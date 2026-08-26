/**
 * Local mission ledger — what the student did, and when.
 *
 * Mirrors the readLocal / writeLocal shape used by roadmapApi.js so the
 * two stores read alike. This is the source of truth until `/student/daily` lands,
 * and the offline cache afterwards: a completion the student saw is never
 * rolled back because a POST failed on campus wifi.
 */

import { todayKey, addDays, daysBetween } from './dayKeys';
import { ledgerScope, parseTaskKey } from './taskKeys';

const MISSION_KEY = 'mm-student-mission-v1';

/** Below this, a regenerated plan may reset the calendar. Above it, never. */
const ANCHOR_KEEP_THRESHOLD_DAYS = 3;

function storeKey(userKey) {
  return `${MISSION_KEY}:${userKey || 'anon'}`;
}

function emptyStore() {
  return { anchor: null, anchorPlanId: null, ledger: {}, daily: {} };
}

export function readMissionStore(userKey = 'anon') {
  try {
    const raw = localStorage.getItem(storeKey(userKey));
    return raw ? { ...emptyStore(), ...JSON.parse(raw) } : emptyStore();
  } catch {
    return emptyStore();
  }
}

function writeMissionStore(userKey, data) {
  try {
    localStorage.setItem(storeKey(userKey), JSON.stringify(data));
  } catch {
    // ignore — quota or private mode
  }
}

export function readLedger(userKey = 'anon', planId = null) {
  return readMissionStore(userKey).ledger?.[ledgerScope(planId)] || {};
}

/** Distinct plan days with at least one completion. */
export function completedDayCount(userKey = 'anon', planId = null) {
  const ledger = readLedger(userKey, planId);
  const days = new Set();
  for (const [key, record] of Object.entries(ledger)) {
    if (record?.status !== 'done') continue;
    const parsed = parseTaskKey(key);
    if (parsed) days.add(parsed.day);
  }
  return days.size;
}

/**
 * Day 1 of the plan.
 *
 * Keyed to the STUDENT, not the plan: regenerating produces a new plan_id and
 * resets the ledger scope, but a student on day 40 must not be thrown back to
 * day 1. The anchor only resets when barely any work has been done.
 */
export function ensureAnchor(userKey = 'anon', planId = null, today = todayKey()) {
  const store = readMissionStore(userKey);

  if (store.anchor) {
    const planChanged = store.anchorPlanId !== planId;
    const barelyStarted = completedDayCount(userKey, store.anchorPlanId) < ANCHOR_KEEP_THRESHOLD_DAYS;
    if (!planChanged || !barelyStarted) {
      if (planChanged) writeMissionStore(userKey, { ...store, anchorPlanId: planId });
      return store.anchor;
    }
  }

  writeMissionStore(userKey, { ...store, anchor: today, anchorPlanId: planId });
  return today;
}

/** Adopt the server's anchor when it disagrees — the server is authoritative. */
export function setAnchor(userKey = 'anon', anchorDate, planId = null) {
  if (!anchorDate) return null;
  const store = readMissionStore(userKey);
  writeMissionStore(userKey, { ...store, anchor: anchorDate, anchorPlanId: planId });
  return anchorDate;
}

/**
 * @param {object} entry
 * @param {string} entry.task_key
 * @param {'done'|'skipped'|'todo'} entry.status
 */
export function recordTask(userKey = 'anon', planId = null, entry = {}) {
  const { task_key: taskKeyValue, status = 'done', score = null, text_hash = null, source = 'manual' } = entry;
  if (!taskKeyValue) return null;

  const store = readMissionStore(userKey);
  const scope = ledgerScope(planId);
  const scoped = { ...(store.ledger?.[scope] || {}) };

  const record = {
    status,
    score,
    text_hash,
    source,
    completed_at: status === 'done' ? new Date().toISOString() : null,
    pending_sync: entry.pending_sync === true,
  };
  scoped[taskKeyValue] = record;

  writeMissionStore(userKey, { ...store, ledger: { ...(store.ledger || {}), [scope]: scoped } });
  return record;
}

/** Mark whole days as dropped by compression — not the student's failure. */
export function recordSkippedDays(userKey = 'anon', planId = null, tasks = [], reason = 'compressed') {
  if (!tasks.length) return;
  const store = readMissionStore(userKey);
  const scope = ledgerScope(planId);
  const scoped = { ...(store.ledger?.[scope] || {}) };

  for (const task of tasks) {
    if (!task?.task_key || scoped[task.task_key]?.status === 'done') continue;
    scoped[task.task_key] = {
      status: 'skipped',
      score: null,
      text_hash: task.text_hash || null,
      source: reason,
      completed_at: null,
    };
  }
  writeMissionStore(userKey, { ...store, ledger: { ...(store.ledger || {}), [scope]: scoped } });
}

/** Roll up a day's activity — feeds the readiness execution multiplier. */
export function recordDailyActivity(userKey = 'anon', date = todayKey(), stats = {}) {
  const store = readMissionStore(userKey);
  const daily = { ...(store.daily || {}) };
  const prev = daily[date] || { minutes: 0, tasks_done: 0, tasks_total: 0 };

  daily[date] = {
    minutes: Math.max(prev.minutes, Number(stats.minutes) || 0),
    tasks_done: Math.max(prev.tasks_done, Number(stats.tasksDone) || 0),
    tasks_total: Math.max(prev.tasks_total, Number(stats.tasksTotal) || 0),
  };

  // Keep the map bounded; 120 days covers the whole plan plus slack.
  const dates = Object.keys(daily).sort();
  while (dates.length > 120) delete daily[dates.shift()];

  writeMissionStore(userKey, { ...store, daily });
  return daily[date];
}

/**
 * Share of required tasks completed over the trailing window.
 * Days with no mission at all are ignored rather than counted as failures.
 * @returns {number} 0..1
 */
export function completionRate(userKey = 'anon', windowDays = 7, today = todayKey()) {
  const daily = readMissionStore(userKey).daily || {};
  let done = 0;
  let total = 0;

  for (let i = 0; i < windowDays; i += 1) {
    const day = addDays(today, -i);
    const entry = daily[day];
    if (!entry || !entry.tasks_total) continue;
    done += entry.tasks_done;
    total += entry.tasks_total;
  }
  return total > 0 ? Math.min(1, done / total) : 0;
}

/** Days since the student last completed anything — drives drop-off nudges. */
export function daysSinceLastActivity(userKey = 'anon', today = todayKey()) {
  const daily = readMissionStore(userKey).daily || {};
  const active = Object.entries(daily)
    .filter(([, v]) => v.tasks_done > 0)
    .map(([k]) => k)
    .sort();
  if (!active.length) return null;
  return daysBetween(active[active.length - 1], today);
}

/** Test/dev helper — clears the ledger for one student. */
export function clearMissionStore(userKey = 'anon') {
  try {
    localStorage.removeItem(storeKey(userKey));
  } catch {
    // ignore
  }
}
