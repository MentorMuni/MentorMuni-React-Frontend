/**
 * Daily mission transport.
 *
 * `withDailyFallback` is deliberately more forgiving than whiteboardApi's
 * `withLocal`, which only covers demo tokens. These endpoints do not exist on
 * the server yet, so a real student would get an exception rather than a
 * mission. Falling back on 404/501/network-0 lets the whole feature ship
 * before the backend lands, and swap to server truth with no UI change.
 *
 * Anything that is NOT "endpoint missing" still throws — a 500 or a 403 is a
 * real failure and must stay loud.
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
      const params = new URLSearchParams({
        local_date: today,
        tz_offset_minutes: String(tzOffsetMinutes()),
        budget_minutes: String(ctx.budgetMinutes ?? 25),
      });
      const data = await studentApi.get(`${BASE}?${params}`, { silent: ctx.silent });
      // The server owns anchor_date; mirror it so the local path agrees the
      // moment we fall back again.
      if (data?.anchor_date) setAnchor(ctx.userKey, data.anchor_date, ctx.plan?.id ?? null);
      return { ...data, source: 'server' };
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
