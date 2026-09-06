/**
 * Strict 3-day baseline sprint — calendar gates, not “as fast as you can”.
 *
 * Day 1: checks 1–3 · Day 2: 4–6 · Day 3: 7–8 + generate plan
 * Mirrors backend student_roadmap/baseline_sprint.py
 */

import { BASELINE_SPRINT_PLAN, BASELINE_SPRINT_DAYS, BASELINE_TOTAL_CHECKS } from './baselineAdaptive';
import { getPlacementProfile, savePlacementProfile } from './placementProfile';

export const SPRINT_MAX_ORDER_BY_DAY = { 1: 3, 2: 6, 3: 8 };

const CAMPUS_TZ = 'Asia/Kolkata';

export function campusTodayKey(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: CAMPUS_TZ }).format(now);
}

/** Calendar day of sprint (1–3+) from anchor YYYY-MM-DD. */
export function sprintCalendarDay(sprintStartKey, now = new Date()) {
  if (!sprintStartKey) return 1;
  const today = campusTodayKey(now);
  const startMs = Date.parse(`${sprintStartKey}T00:00:00+05:30`);
  const todayMs = Date.parse(`${today}T00:00:00+05:30`);
  if (!Number.isFinite(startMs) || !Number.isFinite(todayMs)) return 1;
  const diff = Math.round((todayMs - startMs) / 86400000);
  return Math.max(1, diff + 1);
}

export function resolveSprintMap(meta = null) {
  const days = Number(meta?.sprint_days || meta?.sprintDays || 0);
  const mapRaw = meta?.sprint_max_order_by_day || meta?.sprintMaxOrderByDay || null;
  if (mapRaw && typeof mapRaw === 'object') {
    const map = {};
    for (const [k, v] of Object.entries(mapRaw)) {
      map[Number(k)] = Number(v);
    }
    const sprintDays = days > 0 ? days : Math.max(...Object.keys(map).map(Number), 3);
    return { sprintDays, map };
  }
  return { sprintDays: BASELINE_SPRINT_DAYS, map: SPRINT_MAX_ORDER_BY_DAY };
}

export function allowedMaxOrder(sprintStartKey, now = new Date(), meta = null) {
  const day = sprintCalendarDay(sprintStartKey, now);
  const { sprintDays, map } = resolveSprintMap(meta);
  if (day >= sprintDays) return map[sprintDays] ?? map[3] ?? 8;
  return map[day] ?? map[sprintDays] ?? 8;
}

/**
 * @param {object} opts
 * @param {object[]} opts.steps
 * @param {string|null} opts.sprintStartKey  YYYY-MM-DD
 * @param {Date} [opts.now]
 */
export function resolveBaselineSprint({
  steps = [],
  sprintStartKey = null,
  now = new Date(),
  sprintMeta = null,
} = {}) {
  const { sprintDays, map } = resolveSprintMap(sprintMeta);
  const calendarDay = sprintCalendarDay(sprintStartKey, now);
  const sprintDay = Math.min(calendarDay, sprintDays);
  const allowedOrder = allowedMaxOrder(sprintStartKey, now, sprintMeta);
  const doneCount = steps.filter((s) => s.status === 'done').length;
  const current = steps.find((s) => s.status === 'current') || null;

  const dayPlan =
    BASELINE_SPRINT_PLAN[Math.min(sprintDay, BASELINE_SPRINT_PLAN.length) - 1] ||
    BASELINE_SPRINT_PLAN[BASELINE_SPRINT_PLAN.length - 1];
  const doneThroughToday = steps.filter((s) => s.status === 'done' && s.order <= allowedOrder).length;

  const dayQuotaMet =
    doneCount < BASELINE_TOTAL_CHECKS &&
    steps
      .filter((s) => s.order <= allowedOrder)
      .every((s) => s.status === 'done') &&
    steps.some((s) => s.order > allowedOrder && s.status !== 'done');

  const blockedUntilTomorrow = dayQuotaMet && sprintDay < sprintDays;

  const nextBatch = BASELINE_SPRINT_PLAN[sprintDay] || null;
  const isDemoTrial = Boolean(sprintMeta?.is_demo_trial || sprintMeta?.isDemoTrial);

  return {
    sprintStartKey,
    sprintDay,
    sprintDays,
    allowedOrder,
    dayPlan,
    current,
    blockedUntilTomorrow,
    nextDayPreview: nextBatch?.label || null,
    doneCount,
    doneThroughToday,
    isDemoTrial,
    sprintMaxOrderByDay: map,
  };
}

export function canStartBaselineStep(step, sprintStartKey, now = new Date()) {
  if (!step || step.status === 'locked') return false;
  if (step.status === 'done') return true;
  const allowed = allowedMaxOrder(sprintStartKey, now);
  return step.order <= allowed;
}

export function ensureSprintStart(userKey, sprintStartKey = null) {
  const profile = getPlacementProfile(userKey);
  if (profile?.baselineSprintStart) return profile.baselineSprintStart;
  const start = sprintStartKey || campusTodayKey();
  savePlacementProfile(userKey, { baselineSprintStart: start });
  return start;
}

export function baselineSprintCopy(sprintState) {
  if (!sprintState || sprintState.doneCount >= BASELINE_TOTAL_CHECKS) return null;
  const { sprintDay, blockedUntilTomorrow, nextDayPreview, dayPlan, allowedOrder, current } =
    sprintState;

  if (blockedUntilTomorrow) {
    return `Day ${sprintDay} of ${BASELINE_SPRINT_DAYS} complete — great work. Checks for Day ${sprintDay + 1} unlock tomorrow (${nextDayPreview || 'next batch'}).`;
  }
  if (current) {
    const left = Math.max(0, allowedOrder - sprintState.doneThroughToday);
    return `Day ${sprintDay} of ${BASELINE_SPRINT_DAYS} — ${dayPlan?.label || 'baseline'}. Finish today’s checks (up to ${allowedOrder}/8) before tomorrow’s batch unlocks.`;
  }
  return `3-day baseline sprint · Day ${sprintDay} of ${BASELINE_SPRINT_DAYS}.`;
}
