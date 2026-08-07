/**
 * Honest daily streak — consecutive calendar days with at least one session.
 * Session = starting a Home baseline step or finishing a Practice tool run.
 */

const STREAK_KEY = 'mm-student-streak-v1';

export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseDay(key) {
  const [y, m, d] = String(key || '').split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function daysBetween(aKey, bKey) {
  const a = parseDay(aKey);
  const b = parseDay(bKey);
  if (!a || !b) return null;
  return Math.round((b - a) / 86400000);
}

function readStore(userKey) {
  try {
    const raw = localStorage.getItem(`${STREAK_KEY}:${userKey}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStore(userKey, data) {
  try {
    localStorage.setItem(`${STREAK_KEY}:${userKey}`, JSON.stringify(data));
  } catch {
    // ignore
  }
}

/**
 * Record that the student practiced today (Home start or Practice finish).
 * @returns {{ consecutiveDays: number, sessionsToday: number, lastActiveDay: string, practicedToday: boolean }}
 */
export function recordStudentSession(userKey = 'anon') {
  const today = todayKey();
  const prev = readStore(userKey) || {
    consecutiveDays: 0,
    lastActiveDay: null,
    sessionsByDay: {},
  };

  const sessionsByDay = { ...(prev.sessionsByDay || {}) };
  sessionsByDay[today] = (sessionsByDay[today] || 0) + 1;

  let consecutiveDays = prev.consecutiveDays || 0;
  if (prev.lastActiveDay === today) {
    // already counted today
  } else if (!prev.lastActiveDay) {
    consecutiveDays = 1;
  } else {
    const gap = daysBetween(prev.lastActiveDay, today);
    consecutiveDays = gap === 1 ? consecutiveDays + 1 : 1;
  }

  const next = {
    consecutiveDays,
    lastActiveDay: today,
    sessionsByDay,
  };
  writeStore(userKey, next);

  return {
    consecutiveDays,
    sessionsToday: sessionsByDay[today],
    lastActiveDay: today,
    practicedToday: true,
  };
}

export function getStudentStreak(userKey = 'anon') {
  const today = todayKey();
  const prev = readStore(userKey);
  if (!prev) {
    return {
      consecutiveDays: 0,
      sessionsToday: 0,
      lastActiveDay: null,
      practicedToday: false,
    };
  }

  const sessionsToday = prev.sessionsByDay?.[today] || 0;
  let consecutiveDays = prev.consecutiveDays || 0;

  // If last activity was before yesterday, streak is broken for display.
  if (prev.lastActiveDay && prev.lastActiveDay !== today) {
    const gap = daysBetween(prev.lastActiveDay, today);
    if (gap != null && gap > 1) consecutiveDays = 0;
  }

  return {
    consecutiveDays,
    sessionsToday,
    lastActiveDay: prev.lastActiveDay,
    practicedToday: sessionsToday > 0,
  };
}

/**
 * Sun→Sat practiced flags for the calendar week containing `now`.
 * @returns {boolean[]}
 */
export function getStreakWeekDots(userKey = 'anon', now = new Date()) {
  const prev = readStore(userKey);
  const sessionsByDay = prev?.sessionsByDay || {};
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // JS getDay(): 0=Sun … 6=Sat — align dots to that order.
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return Boolean(sessionsByDay[todayKey(d)]);
  });
}
