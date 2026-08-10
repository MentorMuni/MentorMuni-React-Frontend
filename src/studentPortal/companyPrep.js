import { studentToolPath } from './paths';

/**
 * Daily company-prep mission templates.
 * Tasks map to existing MentorMuni tools where possible.
 */

export const COMPANY_PREP_TASKS = [
  {
    id: 'aptitude_5',
    title: '5 Aptitude Questions',
    minutes: 6,
    href: studentToolPath('aptitude', { from: 'company-prep' }),
  },
  {
    id: 'coding_dsa',
    title: 'Coding pattern drill',
    minutes: 20,
    href: studentToolPath('coding', { from: 'company-prep', skill: 'practice-two-sum' }),
  },
  {
    id: 'sql_challenge',
    title: 'SQL Challenge',
    minutes: 5,
    href: studentToolPath('skill_mock', { from: 'company-prep', skill: 'sql' }),
  },
  {
    id: 'hr_speak',
    title: 'Speak One HR Answer',
    minutes: 4,
    href: studentToolPath('hr_mock', { from: 'company-prep' }),
  },
  {
    id: 'technical_q',
    title: 'Technical Question',
    minutes: 5,
    href: studentToolPath('skill_mock', { from: 'company-prep' }),
  },
  {
    id: 'daily_challenge',
    title: 'Daily Challenge',
    minutes: 2,
    href: studentToolPath('5_sec', { from: 'company-prep' }),
  },
];

/**
 * Prefer company-keyed coding when drive company is known.
 * Falls back to seeded practice-two-sum.
 */
export function codingPrepHref(companyName) {
  const key = String(companyName || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  if (key.includes('microsoft')) {
    return studentToolPath('coding', { from: 'company-prep', mode: 'microsoft' });
  }
  if (key) {
    return studentToolPath('coding', { from: 'company-prep', mode: key });
  }
  return studentToolPath('coding', { from: 'company-prep', skill: 'practice-two-sum' });
}

export function missionTotalMinutes(tasks = COMPANY_PREP_TASKS) {
  return tasks.reduce((sum, t) => sum + (t.minutes || 0), 0);
}

const PREP_KEY = 'mm-student-company-prep-v1';

function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function readStore(userKey) {
  try {
    const raw = localStorage.getItem(`${PREP_KEY}:${userKey}`);
    return raw ? JSON.parse(raw) : { drives: {} };
  } catch {
    return { drives: {} };
  }
}

function writeStore(userKey, data) {
  try {
    localStorage.setItem(`${PREP_KEY}:${userKey}`, JSON.stringify(data));
  } catch {
    // ignore
  }
}

/**
 * Ensure prep started for a drive; returns prep day number (1-based).
 */
export function ensurePrepDay(userKey, driveId) {
  const store = readStore(userKey);
  const key = String(driveId);
  const today = todayKey();
  let entry = store.drives[key];
  if (!entry?.startedOn) {
    entry = { startedOn: today, completedByDay: {}, lastActiveDay: today };
    store.drives[key] = entry;
    writeStore(userKey, store);
  }

  const start = new Date(`${entry.startedOn}T12:00:00`);
  const now = new Date(`${today}T12:00:00`);
  const dayIndex = Math.max(1, Math.round((now - start) / 86400000) + 1);

  if (entry.lastActiveDay !== today) {
    entry.lastActiveDay = today;
    store.drives[key] = entry;
    writeStore(userKey, store);
  }

  return dayIndex;
}

export function getMissionCompletion(userKey, driveId, prepDay) {
  const store = readStore(userKey);
  const entry = store.drives[String(driveId)] || {};
  const dayKey = String(prepDay);
  return entry.completedByDay?.[dayKey] || {};
}

export function markMissionTaskDone(userKey, driveId, prepDay, taskId) {
  const store = readStore(userKey);
  const key = String(driveId);
  const entry = store.drives[key] || { startedOn: todayKey(), completedByDay: {} };
  const dayKey = String(prepDay);
  const dayMap = { ...(entry.completedByDay?.[dayKey] || {}), [taskId]: todayKey() };
  entry.completedByDay = { ...(entry.completedByDay || {}), [dayKey]: dayMap };
  store.drives[key] = entry;
  writeStore(userKey, store);
  return dayMap;
}

/** Demo drive when campus has none published yet. */
export function demoNearestDrive() {
  const driveDate = new Date();
  driveDate.setDate(driveDate.getDate() + 21);
  const y = driveDate.getFullYear();
  const m = String(driveDate.getMonth() + 1).padStart(2, '0');
  const d = String(driveDate.getDate()).padStart(2, '0');
  return {
    id: 'demo-accenture',
    company_name: 'Accenture',
    eligibility_criteria: 'Demo drive — your TPO can publish real campus drives.',
    drive_date: `${y}-${m}-${d}`,
    remark: null,
    days_until: 21,
    is_past: false,
  };
}
