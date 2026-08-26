/**
 * How many minutes the student actually has today.
 *
 * The generated plan writes days of 60–90 minutes. A 4th-year on a lab day
 * has ten. Showing them a 90-minute card is how you lose them, so the mission
 * is BUILT to the declared budget rather than truncated after the fact.
 *
 * The choice is remembered per weekday — Tuesdays are reliably worse than
 * Sundays — so most days the student confirms rather than decides.
 */

import { todayKey } from './dayKeys';

const BUDGET_KEY = 'mm-student-time-budget-v1';

export const TIME_BUDGETS = [10, 25, 45, 90];
export const DEFAULT_BUDGET = 25;

export const BUDGET_LABELS = {
  10: 'Ten minutes',
  25: 'Half hour',
  45: 'Proper session',
  90: 'Long haul',
};

function storeKey(userKey) {
  return `${BUDGET_KEY}:${userKey || 'anon'}`;
}

function readStore(userKey) {
  try {
    const raw = localStorage.getItem(storeKey(userKey));
    return raw ? JSON.parse(raw) : { byWeekday: {}, byDate: {} };
  } catch {
    return { byWeekday: {}, byDate: {} };
  }
}

function writeStore(userKey, data) {
  try {
    localStorage.setItem(storeKey(userKey), JSON.stringify(data));
  } catch {
    // ignore
  }
}

/** Nearest supported budget — the server may send a value we don't offer. */
export function normalizeBudget(minutes) {
  const n = Number(minutes);
  if (!Number.isFinite(n)) return DEFAULT_BUDGET;
  return TIME_BUDGETS.reduce((best, b) =>
    Math.abs(b - n) < Math.abs(best - n) ? b : best
  );
}

/**
 * Today's budget: an explicit choice for today, else what this weekday
 * usually looks like, else the default.
 * @returns {{minutes: number, source: 'today'|'weekday'|'default'}}
 */
export function getTodayBudget(userKey = 'anon', now = new Date()) {
  const store = readStore(userKey);
  const today = todayKey(now);

  const explicit = store.byDate?.[today];
  if (explicit) return { minutes: normalizeBudget(explicit), source: 'today' };

  const usual = store.byWeekday?.[now.getDay()];
  if (usual) return { minutes: normalizeBudget(usual), source: 'weekday' };

  return { minutes: DEFAULT_BUDGET, source: 'default' };
}

/** Record today's choice and let it inform this weekday in future. */
export function setTodayBudget(minutes, userKey = 'anon', now = new Date()) {
  const value = normalizeBudget(minutes);
  const store = readStore(userKey);
  const today = todayKey(now);

  const byDate = { ...(store.byDate || {}), [today]: value };
  // Keep the map small — only the last 60 days can matter.
  const dates = Object.keys(byDate).sort();
  while (dates.length > 60) delete byDate[dates.shift()];

  writeStore(userKey, {
    byWeekday: { ...(store.byWeekday || {}), [now.getDay()]: value },
    byDate,
  });
  return value;
}

/** True once the student has chosen for today — suppresses the prompt. */
export function hasChosenToday(userKey = 'anon', now = new Date()) {
  return Boolean(readStore(userKey).byDate?.[todayKey(now)]);
}
