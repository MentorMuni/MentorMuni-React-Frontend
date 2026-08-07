/**
 * Practice tab: each tool may be run once per calendar day.
 * Lock is recorded when a run completes (result saved / shown).
 */

const PRACTICE_LOCK_KEY = 'mm-student-practice-daily-v1';

export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function storeKey(userKey) {
  return `${PRACTICE_LOCK_KEY}:${userKey || 'anon'}`;
}

function readStore(userKey) {
  try {
    const raw = localStorage.getItem(storeKey(userKey));
    return raw ? JSON.parse(raw) : { usedByDay: {} };
  } catch {
    return { usedByDay: {} };
  }
}

function writeStore(userKey, data) {
  try {
    localStorage.setItem(storeKey(userKey), JSON.stringify(data));
  } catch {
    // ignore
  }
}

/** @returns {Record<string, string>} toolCode → ISO day last completed */
export function getPracticeUsageMap(userKey = 'anon') {
  const store = readStore(userKey);
  const today = todayKey();
  const usedByDay = store.usedByDay || {};
  const map = {};
  for (const [tool, day] of Object.entries(usedByDay)) {
    if (day === today) map[tool] = day;
  }
  return map;
}

export function isPracticeLockedToday(toolCode, userKey = 'anon') {
  if (!toolCode) return false;
  const store = readStore(userKey);
  return (store.usedByDay || {})[toolCode] === todayKey();
}

/**
 * Mark a practice tool as used for today.
 * @returns {{ locked: true, day: string }}
 */
export function markPracticeCompleted(toolCode, userKey = 'anon') {
  if (!toolCode) return { locked: false, day: null };
  const store = readStore(userKey);
  const day = todayKey();
  const usedByDay = { ...(store.usedByDay || {}), [toolCode]: day };
  writeStore(userKey, { usedByDay });
  return { locked: true, day };
}

/** Human-readable unlock time (local midnight). */
export function practiceUnlockLabel(now = new Date()) {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  const ms = next - now;
  const hours = Math.max(1, Math.ceil(ms / 3600000));
  if (hours >= 20) return 'Unlocks tomorrow';
  return `Unlocks in ~${hours}h`;
}
