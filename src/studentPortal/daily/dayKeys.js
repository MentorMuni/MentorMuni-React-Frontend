/**
 * Local calendar-day helpers, shared by every daily surface.
 *
 * `streak.js` and `practiceDailyLock.js` each grew their own copy of
 * todayKey/parseDay/daysBetween. Both re-export from here so the mission,
 * the streak and the daily locks can never disagree about what "today" is.
 *
 * Everything is LOCAL time on purpose: a student in IST who practises at
 * 11pm must not have it land on yesterday's UTC date.
 */

/** @returns {string} local `YYYY-MM-DD` */
export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** @returns {Date|null} local midnight for a `YYYY-MM-DD` key */
export function parseDayKey(key) {
  const [y, m, d] = String(key || '').split('-').map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  // Reject 2026-02-31 and friends rather than silently rolling into March.
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return null;
  }
  return date;
}

/** Whole days from `aKey` to `bKey`; negative when b is earlier. */
export function daysBetween(aKey, bKey) {
  const a = parseDayKey(aKey);
  const b = parseDayKey(bKey);
  if (!a || !b) return null;
  // Round, don't floor: a DST transition makes the span 23 or 25 hours.
  return Math.round((b - a) / 86400000);
}

/** @returns {string|null} `key` shifted by `n` days */
export function addDays(key, n) {
  const d = parseDayKey(key);
  if (!d) return null;
  d.setDate(d.getDate() + Number(n || 0));
  return todayKey(d);
}

/** Minutes the local zone is behind UTC (IST → -330), for the server. */
export function tzOffsetMinutes(d = new Date()) {
  return -d.getTimezoneOffset();
}

/** Clamp helper used wherever a plan day is derived from a date. */
export function clampDay(day, min, max) {
  const n = Number(day);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.round(n)));
}
