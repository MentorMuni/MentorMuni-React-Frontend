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

export function allowedMaxOrder(sprintStartKey, now = new Date()) {
  const day = sprintCalendarDay(sprintStartKey, now);
  if (day >= BASELINE_SPRINT_DAYS) return SPRINT_MAX_ORDER_BY_DAY[3];
  return SPRINT_MAX_ORDER_BY_DAY[day] ?? SPRINT_MAX_ORDER_BY_DAY[3];
}

/**
 * @param {object} opts
 * @param {object[]} opts.steps
 * @param {string|null} opts.sprintStartKey  YYYY-MM-DD
 * @param {Date} [opts.now]
 */
export function resolveBaselineSprint({ steps = [], sprintStartKey = null, now = new Date() } = {}) {
  const calendarDay = sprintCalendarDay(sprintStartKey, now);
  const sprintDay = Math.min(calendarDay, BASELINE_SPRINT_DAYS);
  const allowedOrder = allowedMaxOrder(sprintStartKey, now);
  const doneCount = steps.filter((s) => s.status === 'done').length;
  const current = steps.find((s) => s.status === 'current') || null;

  const dayPlan = BASELINE_SPRINT_PLAN[sprintDay - 1] || BASELINE_SPRINT_PLAN[2];
  const doneThroughToday = steps.filter((s) => s.status === 'done' && s.order <= allowedOrder).length;

  const dayQuotaMet =
    doneCount < BASELINE_TOTAL_CHECKS &&
    steps
      .filter((s) => s.order <= allowedOrder)
      .every((s) => s.status === 'done') &&
    steps.some((s) => s.order > allowedOrder && s.status !== 'done');

  const blockedUntilTomorrow = dayQuotaMet && sprintDay < BASELINE_SPRINT_DAYS;

  const nextBatch = BASELINE_SPRINT_PLAN[sprintDay] || null;

  return {
    sprintStartKey,
    sprintDay,
    allowedOrder,
    dayPlan,
    current,
    blockedUntilTomorrow,
    nextDayPreview: nextBatch?.label || null,
    doneCount,
    doneThroughToday,
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
