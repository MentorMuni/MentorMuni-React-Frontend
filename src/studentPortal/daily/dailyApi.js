/**
 * Daily mission transport.
 *
 * Prefers GET /student/daily (P0 intelligence). Falls back to local
 * missionResolver on 404/501/network-0 or demo/local sessions.
 */

import { studentApi, StudentApiError } from '../studentApi';
import { isLocalFallbackSession } from '../roadmap/roadmapApi';
import { resolveMission } from './missionResolver';
import { todayKey, tzOffsetMinutes } from './dayKeys';
import {
  completionRate,
  ensureAnchor,
  readLedger,
  recordDailyActivity,
  recordSkippedDays,
  recordTask,
  setAnchor,
} from './dailyLocal';

const BASE = '/student/daily';

/** Statuses that mean "this endpoint isn't built yet", not "this failed". */
const MISSING_ENDPOINT = new Set([0, 404, 501]);

/** Map P0 server mission shape onto what MissionTaskRow / sections expect. */
function normalizeServerMission(data) {
  if (!data || typeof data !== 'object') return data;
  const tasks = (data.tasks || []).map((t) => {
    const done = Boolean(t.done) || t.status === 'done';
    return {
      ...t,
      task_key: t.task_key || t.key,
      title: t.title || t.text || 'Today’s task',
      minutes: t.minutes ?? 15,
      required: t.required !== false,
      status: done ? 'done' : t.status === 'skipped' ? 'skipped' : 'todo',
      kind: t.kind || (t.tool_href || t.tool_code ? 'tool' : 'manual'),
      tool_code: t.tool_code || t.widget_spec?.tool_code || null,
      tool_href: t.tool_href || null,
      why_this: t.why_this || t.widget_spec?.why_this || null,
      widget_spec: t.widget_spec || null,
    };
  });
  const required = tasks.filter((t) => t.required);
  const doneCount =
    data.doneCount ?? data.done_count ?? required.filter((t) => t.status === 'done').length;
  const planDay = data.planDay ?? data.day_in_plan ?? data.dayInPlan ?? null;
  return {
    ...data,
    tasks,
    planDay,
    requiredCount: data.requiredCount ?? data.required_count ?? required.length,
    doneCount,
    totalMinutes: data.totalMinutes ?? data.total_minutes ?? tasks.reduce((s, t) => s + (t.minutes || 0), 0),
    compressedDays: data.compressedDays || data.compressed_days || [],
    droppedTasks: data.droppedTasks || data.dropped_tasks || [],
    carryOver: data.carryOver || data.carry_over || [],
    completionRate7d: data.completionRate7d ?? data.completion_rate_7d ?? 0,
  };
}

export function isMissingEndpoint(err) {
  return err instanceof StudentApiError && MISSING_ENDPOINT.has(err.status);
}

export async function withDailyFallback(remote, local) {
  if (isLocalFallbackSession()) return local();
  try {
    return await remote();
  } catch (err) {
    if (isMissingEndpoint(err)) return local();
    throw err;
  }
}

/**
 * Resolve today's mission locally from the plan already in memory.
 * Same inputs the server will receive, so the two can be diffed.
 */
function localMission(context) {
  const {
    userKey,
    plan,
    roadmap,
    weakTopics,
    budgetMinutes,
    drive,
    day0Complete,
    pause,
    today,
  } = context;

  const planId = plan?.id ?? null;
  const planReady = Boolean(plan?.plan);
  // Only anchor once there is a plan to anchor to.
  const anchorDate = planReady ? ensureAnchor(userKey, planId, today) : null;

  const mission = resolveMission({
    today,
    anchorDate,
    plan,
    roadmap,
    ledger: readLedger(userKey, planId),
    weakTopics,
    budgetMinutes,
    drive,
    day0Complete,
    pause,
  });

  // Compression is a decision, not a display: persist the skips so the same
  // days are not re-offered tomorrow, and surface what got dropped so the
  // caller can push it into the weakness queue.
  if (mission.mode === 'compressed' && mission.compressedDays.length) {
    recordSkippedDays(userKey, planId, mission.droppedTasks, 'compressed');
  }

  recordDailyActivity(userKey, today, {
    tasksDone: mission.doneCount,
    tasksTotal: mission.requiredCount,
    minutes: mission.totalMinutes,
  });

  return {
    ...mission,
    source: 'local',
    completionRate7d: completionRate(userKey, 7, today),
  };
}

/**
 * One call powers Home.
 * @param {object} context see localMission
 */
export async function fetchDailyMission(context = {}) {
  const today = context.today || todayKey();
  const ctx = { ...context, today };

  return withDailyFallback(
    async () => {
      // Until Week-1 + plan exist, local resolver owns the correct modes
      // (baseline / awaiting_plan). Server intelligence is post-plan only.
      if (ctx.roadmap && ctx.roadmap.week_status !== 'done') {
        return localMission(ctx);
      }
      const planReady = Boolean(ctx.plan?.plan || ctx.plan?.id);
      if (ctx.roadmap?.week_status === 'done' && !planReady) {
        return localMission(ctx);
      }

      const params = new URLSearchParams({
        local_date: today,
        tz_offset_minutes: String(tzOffsetMinutes()),
        budget_minutes: String(ctx.budgetMinutes ?? 25),
      });
      if (ctx.plan?.id != null) params.set('plan_id', String(ctx.plan.id));
      const data = await studentApi.get(`${BASE}?${params}`, { silent: ctx.silent });
      // The server owns anchor_date; mirror it so the local path agrees the
      // moment we fall back again.
      const serverPlanId = data?.plan_id ?? ctx.plan?.id ?? null;
      if (data?.anchor_date) setAnchor(ctx.userKey, data.anchor_date, serverPlanId);
      return { ...normalizeServerMission(data), planId: serverPlanId, source: 'server' };
    },
    () => localMission(ctx)
  );
}

/**
 * Complete one task. Optimistic by design — the local write happens first and
 * is never undone, because a student who saw a tick must not see it vanish.
 */
export async function completeMissionTask(taskKeyValue, body = {}, context = {}) {
  const { userKey = 'anon', planId = null } = context;
  const today = body.local_date || todayKey();

  recordTask(userKey, planId, {
    task_key: taskKeyValue,
    status: 'done',
    score: body.score ?? null,
    text_hash: body.text_hash ?? null,
    source: body.source || 'manual',
    pending_sync: true,
  });

  return withDailyFallback(
    async () => {
      const data = await studentApi.post(
        `${BASE}/tasks/${encodeURIComponent(taskKeyValue)}/complete`,
        { ...body, local_date: today, plan_id: planId },
        { silent: true }
      );
      recordTask(userKey, planId, {
        task_key: taskKeyValue,
        status: 'done',
        score: body.score ?? null,
        text_hash: body.text_hash ?? null,
        source: body.source || 'manual',
        pending_sync: false,
      });
      return { ...data, source: 'server' };
    },
    () => ({ ok: true, source: 'local', task_key: taskKeyValue })
  );
}

export async function skipMissionTask(taskKeyValue, body = {}, context = {}) {
  const { userKey = 'anon', planId = null } = context;
  const today = body.local_date || todayKey();

  recordTask(userKey, planId, {
    task_key: taskKeyValue,
    status: 'skipped',
    text_hash: body.text_hash ?? null,
    source: body.reason || 'manual',
  });

  return withDailyFallback(
    () =>
      studentApi.post(
        `${BASE}/tasks/${encodeURIComponent(taskKeyValue)}/skip`,
        { ...body, local_date: today, plan_id: planId },
        { silent: true }
      ),
    () => ({ ok: true, source: 'local', task_key: taskKeyValue })
  );
}
