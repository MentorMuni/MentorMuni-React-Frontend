/**
 * "What do I do today?" — resolved for every day 1–90.
 *
 * Pure and dependency-light on purpose: the backend implements the same rules,
 * and this file is the spec. Anything non-deterministic (network, storage,
 * Date.now) stays out so client and server can be diffed on a shared fixture.
 *
 * Two problems drive most of the code here:
 *
 *  1. The plan is LLM output. `phases[].weeks[].daily[]` has no ids, day
 *     numbers can collide, repeat per-week, or skip entirely. Everything is
 *     rebuilt into a defensive index before a single task is read.
 *
 *  2. Students miss days. A backlog is the fastest way to lose someone, so
 *     missing days COMPRESSES the plan — the calendar keeps moving, at most
 *     two dropped tasks are carried forward, and anything else that mapped to
 *     a weakness resurfaces through spaced repetition instead of as guilt.
 */

import { clampDay, daysBetween } from './dayKeys';
import { taskKey, taskTextHash, isRecordFresh } from './taskKeys';
import { planHorizonFromPlan, PLAN_HORIZON_DAYS } from '../journeyPlan';

export { PLAN_HORIZON_DAYS } from '../journeyPlan';

export const DEFAULT_CONFIG = {
  catchUpGrace: 2,      // days behind before the plan compresses
  maxCarryOver: 2,      // never more than this from skipped days
  driveSprintDays: 21,  // a drive inside this window takes over the mission
};

/**
 * Task text → tool, for the very common case where the model writes
 * "1x HR AI mock" and omits tool_href. Without this those render as dead
 * bullets the student cannot action. Order matters: specific before generic.
 */
const TOOL_INTENTS = [
  [/\bhr\b|behaviou?ral|tell me about yourself/i, 'hr_mock'],
  [/\bproject\b[^.]*\b(mock|interview|defend|defence|defense)\b/i, 'project_mock'],
  [/pseudo[\s-]?code/i, 'pseudocode'],
  [/\bresume\b|\bats\b|\bcv\b/i, 'resume_ats'],
  [/\bemail\b|\bessay\b|written round|written communication/i, 'written_round'],
  [/\b(interview mock|mock interview)\b/i, 'interview_mock'],
  [/\baptitude\b|\bquant\b|quantitative|reasoning|verbal/i, 'aptitude'],
  [/\bdsa\b|leetcode|\bcoding\b|\balgorithm/i, 'coding'],
  [/\bmock\b/i, 'skill_mock'],
];

/** @returns {string|null} */
export function inferToolCode(text) {
  const s = String(text || '');
  for (const [pattern, code] of TOOL_INTENTS) {
    if (pattern.test(s)) return code;
  }
  return null;
}

/**
 * Flatten the plan into `absoluteDay -> {tasks, minutes, theme, phaseId}`.
 *
 * Handles both shapes the model produces: absolute day numbers (1..90) and
 * per-week numbering (1..7 repeated every week). Duplicates anywhere are the
 * tell for the latter.
 */
export function buildDayIndex(plan, horizon = planHorizonFromPlan(plan)) {
  const phases = plan?.plan?.phases;
  if (!Array.isArray(phases)) return new Map();

  const flat = [];
  let weekOrdinal = 0;
  for (const phase of phases) {
    for (const week of phase?.weeks || []) {
      const thisWeek = weekOrdinal;
      weekOrdinal += 1;
      for (const day of week?.daily || []) {
        if (!day) continue;
        flat.push({
          rawDay: Number(day.day),
          weekOrdinal: thisWeek,
          theme: week.theme || null,
          phaseId: phase.phase_id || null,
          basedOn: week.based_on_weaknesses || [],
          minutes: Number(day.minutes) || 0,
          tasks: Array.isArray(day.tasks) ? day.tasks : [],
          toolHref: day.tool_href || null,
        });
      }
    }
  }
  if (!flat.length) return new Map();

  const raws = flat.map((f) => f.rawDay).filter(Number.isFinite);
  const weekRelative = new Set(raws).size < raws.length;

  const index = new Map();
  for (const entry of flat) {
    const absolute = weekRelative
      ? entry.weekOrdinal * 7 + clampDay(entry.rawDay, 1, 7)
      : clampDay(entry.rawDay, 1, horizon);
    // Last write wins — a genuine collision means the model repeated itself.
    index.set(absolute, { ...entry, day: absolute });
  }
  return index;
}

function ledgerRecord(ledger, key) {
  return ledger && Object.prototype.hasOwnProperty.call(ledger, key)
    ? ledger[key]
    : null;
}

/** Drives come from the API as `company_name`; demo fixtures use `name`. */
function driveName(drive) {
  return drive?.company_name || drive?.name || null;
}

const VOICE_TOOLS = new Set(['skill_mock', 'project_mock', 'interview_mock', 'hr_mock']);

/** Map one plan day's `tasks[]` into DailyTask objects. */
function tasksForDay(entry, ledger, origin = 'plan') {
  if (!entry) return [];
  const count = entry.tasks.length || 1;
  const perTask = Math.max(5, Math.round((entry.minutes || 20) / count));

  return entry.tasks.map((text, i) => {
    const title = String(text || '').trim();
    const key = taskKey(entry.day, i);
    const hash = taskTextHash(title);
    const record = ledgerRecord(ledger, key);
    const fresh = isRecordFresh(record, hash);
    const toolCode = inferToolCode(title);

    return {
      task_key: key,
      origin,
      kind: toolCode ? 'tool' : 'manual',
      title,
      minutes: perTask,
      plan_day: entry.day,
      tool_code: toolCode,
      tool_href: entry.toolHref || null,
      action: null,
      weak_topic_id: null,
      voice_required: VOICE_TOOLS.has(toolCode),
      required: Boolean(toolCode),
      status: fresh && record ? record.status : 'todo',
      score: fresh && record ? (record.score ?? null) : null,
      completed_at: fresh && record ? (record.completed_at ?? null) : null,
      text_hash: hash,
    };
  });
}

/** Lowest plan day that still has unfinished work. */
function firstIncompleteDay(index, ledger, maxDay) {
  for (let day = 1; day <= maxDay; day += 1) {
    const entry = index.get(day);
    if (!entry) continue;
    const tasks = tasksForDay(entry, ledger);
    if (!tasks.length) continue;
    if (tasks.some((t) => t.status === 'todo')) return day;
  }
  return maxDay + 1;
}

function weaknessTask(topic, planDay) {
  const label = topic.label || topic.topic_id;
  const toolCode = topic.tool_code || inferToolCode(label) || 'aptitude';
  return {
    task_key: `w${topic.topic_id}`,
    origin: 'weakness',
    kind: 'retest',
    title: `Re-test: ${label}`,
    minutes: topic.minutes || 10,
    plan_day: planDay,
    tool_code: toolCode,
    tool_href: null,
    action: null,
    weak_topic_id: topic.topic_id,
    voice_required: VOICE_TOOLS.has(toolCode),
    required: true,
    status: 'todo',
    score: null,
    completed_at: null,
    text_hash: taskTextHash(`retest:${topic.topic_id}`),
  };
}

function actionTask(action, title, minutes) {
  return {
    task_key: `a:${action}`,
    origin: 'action',
    kind: 'action',
    title,
    minutes,
    plan_day: null,
    tool_code: null,
    tool_href: null,
    action,
    weak_topic_id: null,
    voice_required: false,
    required: true,
    status: 'todo',
    score: null,
    completed_at: null,
    text_hash: taskTextHash(action),
  };
}

function baselineTask(step) {
  return {
    task_key: `b:${step.tool_code}`,
    origin: 'baseline',
    kind: 'tool',
    title: step.title,
    minutes: Number(step.minutes) || 20,
    plan_day: null,
    tool_code: step.tool_code,
    tool_href: step.href || null,
    action: null,
    weak_topic_id: null,
    voice_required: VOICE_TOOLS.has(step.tool_code),
    required: true,
    status: step.status === 'done' ? 'done' : 'todo',
    score: step.score ?? null,
    completed_at: step.completed_at ?? null,
    text_hash: taskTextHash(`baseline:${step.tool_code}`),
  };
}

/**
 * Cap how many open tasks land in today's mission by band + budget.
 * Weak/busy students should not see a 90-minute mock on a 10-minute day.
 */
function maxTodoTasks(budgetMinutes, bandKey = 'building') {
  if (budgetMinutes <= 10) {
    return bandKey === 'early' || bandKey === 'building' ? 1 : 2;
  }
  if (budgetMinutes <= 25) return bandKey === 'ready' || bandKey === 'approaching' ? 2 : 2;
  if (budgetMinutes <= 45) return 3;
  return bandKey === 'ready' ? 4 : 3;
}

function capFittedTasks(fitted, overflow, budgetMinutes, bandKey) {
  const cap = maxTodoTasks(budgetMinutes, bandKey);
  const done = fitted.filter((t) => t.status === 'done');
  const open = fitted.filter((t) => t.status !== 'done');
  if (open.length <= cap) return { fitted, overflow };

  const kept = open.slice(0, cap);
  const dropped = open.slice(cap);
  return {
    fitted: [...done, ...kept],
    overflow: [...overflow, ...dropped],
  };
}

/**
 * Select tasks that fit the day's budget.
 *
 * Always returns at least one task — a 10-minute budget facing a 20-minute
 * mock must still show the mock (flagged over_budget) rather than an empty
 * mission. Anything that doesn't fit is NOT marked skipped; it simply
 * re-enters tomorrow's pool.
 */
function fitToBudget(candidates, budgetMinutes) {
  const fitted = [];
  const overflow = [];
  let used = 0;

  for (const task of candidates) {
    if (task.status === 'done') {
      fitted.push(task);
      continue;
    }
    const next = used + task.minutes;
    if (!fitted.some((t) => t.status !== 'done') || next <= budgetMinutes) {
      fitted.push({ ...task, over_budget: task.minutes > budgetMinutes });
      used = next;
    } else {
      overflow.push(task);
    }
  }
  return { fitted, overflow, used };
}

/** Carry-over ranking: real tools first, then longer work, then weaknesses. */
function rankForCarryOver(a, b) {
  if ((a.kind === 'tool') !== (b.kind === 'tool')) return a.kind === 'tool' ? -1 : 1;
  if (a.minutes !== b.minutes) return b.minutes - a.minutes;
  return 0;
}

/**
 * @param {object} input
 * @param {string} input.today            local YYYY-MM-DD
 * @param {string|null} input.anchorDate  plan day 1
 * @param {object|null} input.plan
 * @param {object|null} input.roadmap
 * @param {Record<string, object>} [input.ledger]
 * @param {object[]} [input.weakTopics]   due topics, already filtered
 * @param {number} [input.budgetMinutes]
 * @param {{name?: string, days_until?: number}|null} [input.drive]
 * @param {boolean} [input.day0Complete]
 * @param {{from: string, until: string}|null} [input.pause]
 * @param {object} [input.config]
 * @returns {object} Mission
 */
export function resolveMission(input = {}) {
  const {
    today,
    anchorDate = null,
    plan = null,
    roadmap = null,
    ledger = {},
    weakTopics = [],
    budgetMinutes = 25,
    drive = null,
    day0Complete = true,
    pause = null,
    config: overrides,
    personalization = null,
  } = input;

  const bandKey = personalization?.bandKey || 'building';
  const baselinePath = personalization?.baselinePath || null;

  const config = { ...DEFAULT_CONFIG, ...(overrides || {}) };
  const planReady = Boolean(plan?.plan && (plan.status ? plan.status === 'ready' : true));
  const horizon = planReady ? planHorizonFromPlan(plan) : PLAN_HORIZON_DAYS;
  const index = planReady ? buildDayIndex(plan, horizon) : new Map();

  const base = {
    mode: 'on_track',
    calendarDay: null,
    cursorDay: null,
    planDay: null,
    driftDays: 0,
    compressedDays: [],
    carryOver: [],
    droppedTopics: [],
    droppedTasks: [],
    overflow: [],
    tasks: [],
    weekTheme: null,
    phaseId: null,
    planId: plan?.id ?? null,
    anchorDate,
    budgetMinutes,
    deep_prep_days: horizon,
    drive: driveName(drive) ? { name: driveName(drive), daysUntil: drive.days_until ?? null } : null,
  };

  const finish = (mission) => {
    const tasks = mission.tasks || [];
    const required = tasks.filter((t) => t.required);
    const done = tasks.filter((t) => t.status === 'done');
    return {
      ...mission,
      totalMinutes: tasks
        .filter((t) => t.status !== 'done')
        .reduce((sum, t) => sum + t.minutes, 0),
      requiredCount: required.length,
      doneCount: done.length,
      complete: required.length > 0 && required.every((t) => t.status === 'done'),
    };
  };

  // --- Modes that short-circuit before any plan-day maths ---------------

  if (!day0Complete) {
    return finish({
      ...base,
      mode: 'day0',
      tasks: [actionTask('day0', 'Finish your 12-minute snapshot', 12)],
    });
  }

  if (pause && today >= pause.from && today <= pause.until) {
    const optional = weakTopics.length
      ? [{ ...weaknessTask(weakTopics[0], null), required: false }]
      : [];
    return finish({ ...base, mode: 'paused', tasks: optional });
  }

  if (roadmap && roadmap.week_status !== 'done') {
    const current = (roadmap.steps || []).find((s) => s.status === 'current');
    const tasks = current ? [baselineTask(current)] : [];
    if (weakTopics.length && (!current || tasks[0].status === 'done')) {
      tasks.push(weaknessTask(weakTopics[0], null));
    }
    if (baselinePath === 'foundation' && weakTopics.length && tasks.length < 2) {
      tasks.push({
        ...weaknessTask(weakTopics[0], null),
        minutes: Math.min(10, budgetMinutes),
        title: `Foundation drill: ${weakTopics[0].label}`,
        required: false,
        origin: 'foundation',
      });
    }
    return finish({ ...base, mode: 'baseline', tasks });
  }

  if (!planReady || index.size === 0) {
    return finish({
      ...base,
      mode: 'awaiting_plan',
      tasks: [actionTask('generate_plan', 'Generate your personalized placement plan', 2)],
    });
  }

  // --- Plan-day maths ---------------------------------------------------

  const elapsed = anchorDate ? daysBetween(anchorDate, today) : 0;
  const calendarDay = clampDay((elapsed ?? 0) + 1, 1, horizon);
  const cursorDay = firstIncompleteDay(index, ledger, horizon);

  if (cursorDay > horizon && calendarDay >= horizon) {
    const tasks = weakTopics.slice(0, 2).map((t) => weaknessTask(t, null));
    return finish({ ...base, mode: 'complete', calendarDay, cursorDay, tasks });
  }

  // A drive inside the sprint window outranks the calendar entirely.
  const daysUntil = drive?.days_until;
  const sprinting =
    daysUntil != null && daysUntil >= 0 && daysUntil <= config.driveSprintDays;

  const grace = sprinting ? 0 : config.catchUpGrace;
  const maxCarryOver = sprinting ? 3 : config.maxCarryOver;
  const drift = calendarDay - cursorDay;

  let planDay = calendarDay;
  let mode = 'on_track';
  const compressedDays = [];
  let carryOver = [];
  const droppedTopics = [];
  let droppedTasks = [];

  if (drift < 0) {
    mode = 'ahead';
    planDay = Math.min(cursorDay, horizon);
  } else if (drift === 0) {
    mode = 'on_track';
  } else if (drift <= grace) {
    mode = 'catch_up';
    planDay = cursorDay;
  } else {
    mode = 'compressed';
    planDay = Math.max(1, calendarDay - grace);

    const dropped = [];
    for (let day = cursorDay; day < planDay; day += 1) {
      const entry = index.get(day);
      if (!entry) continue;
      compressedDays.push(day);
      for (const task of tasksForDay(entry, ledger)) {
        if (task.status === 'todo') dropped.push(task);
      }
    }
    dropped.sort(rankForCarryOver);
    carryOver = dropped
      .slice(0, maxCarryOver)
      .map((t) => ({ ...t, origin: 'carry_over' }));
    // Nothing is lost: what we drop becomes a weak topic at box 1, and the
    // caller persists these as 'skipped' so they are not re-offered tomorrow.
    droppedTasks = dropped.slice(maxCarryOver);
    for (const task of droppedTasks) {
      droppedTopics.push({ label: task.title, tool_code: task.tool_code });
    }
  }

  if (sprinting && mode === 'on_track') mode = 'drive_sprint';

  const entry = index.get(planDay) || index.get(cursorDay) || null;
  const dayTasks = tasksForDay(entry, ledger);

  const retestLimit = mode === 'ahead' ? 2 : 1;
  const retests = weakTopics.slice(0, retestLimit).map((t) => weaknessTask(t, planDay));

  // Sprint reorders rather than replaces: mocks and tools before reading.
  const ordered = sprinting
    ? [...dayTasks].sort((a, b) => Number(b.kind === 'tool') - Number(a.kind === 'tool'))
    : dayTasks;

  const budgetFit = fitToBudget([...carryOver, ...retests, ...ordered], budgetMinutes);
  const capped = capFittedTasks(
    budgetFit.fitted,
    budgetFit.overflow,
    budgetMinutes,
    bandKey
  );

  return finish({
    ...base,
    mode,
    calendarDay,
    cursorDay,
    planDay,
    driftDays: drift,
    compressedDays,
    carryOver,
    droppedTopics,
    droppedTasks,
    overflow: capped.overflow,
    tasks: capped.fitted,
    weekTheme: entry?.theme || null,
    phaseId: entry?.phaseId || null,
  });
}
