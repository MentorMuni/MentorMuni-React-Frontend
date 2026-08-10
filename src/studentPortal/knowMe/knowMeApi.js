import { studentApi, StudentApiError } from '../studentApi';

export { StudentApiError };

/** Primary Fear → Fearless API prefix (legacy /student/know-me still works on backend). */
const BASE = '/student/fear-to-fearless';

/**
 * Start a new Fear → Fearless check-in session.
 * @returns {{ checkin_id: number, questions: array, total_steps: number }}
 */
export async function startCheckIn() {
  try {
    return await studentApi.post(`${BASE}/start`, {});
  } catch (err) {
    console.error('startCheckIn error:', err);
    throw err;
  }
}

/**
 * Save one step response to the check-in.
 */
export async function saveStepResponse(checkin_id, body) {
  return studentApi.post(`${BASE}/step/${checkin_id}`, body);
}

/**
 * Generate elder-brother insight after check-in complete.
 * Backend also auto-creates 6-week solutions + schedules notifications.
 */
export async function generateInsight(checkin_id) {
  return studentApi.post(`${BASE}/insight/${checkin_id}`, {});
}

/**
 * Explicitly generate / fetch solutions for a check-in.
 * If fears omitted, backend uses stored blockers / defaults.
 */
export async function generateSolutions(checkin_id, fears = []) {
  return studentApi.post(`${BASE}/generate-solutions`, {
    checkin_id,
    fears,
  });
}

/**
 * Submit weekly progress for one fear.
 */
export async function submitWeeklyProgress(checkin_id, body) {
  return studentApi.post(`${BASE}/weekly-progress/${checkin_id}`, body);
}

/**
 * Real intervention status (solutions, severity, weeks).
 */
export async function getInterventionStatus(checkin_id) {
  return studentApi.get(`${BASE}/intervention-status/${checkin_id}`);
}

/**
 * Complete intervention / celebration.
 */
export async function completeIntervention(checkin_id) {
  return studentApi.post(`${BASE}/complete-intervention/${checkin_id}`, {});
}

/**
 * Private Fear → Fearless notifications inbox.
 */
export async function getFearToFearlessNotifications(unreadOnly = false) {
  const q = unreadOnly ? '?unread_only=true' : '';
  return studentApi.get(`${BASE}/notifications${q}`);
}

export async function clickFearToFearlessNotification(notification_id) {
  return studentApi.post(`${BASE}/notifications/${notification_id}/click`, {});
}

/**
 * Get progress view (30–45 day check-in comparison).
 */
export async function getProgress() {
  return studentApi.get(`${BASE}/progress`);
}

const DEVICE_STORAGE_KEY = 'mm-fear-to-fearless-session';

export function saveSessionState(checkin_id, responses, step_index, questions = []) {
  try {
    localStorage.setItem(
      DEVICE_STORAGE_KEY,
      JSON.stringify({
        checkin_id,
        responses,
        step_index,
        questions,
        saved_at: Date.now(),
      })
    );
  } catch {
    /* ignore storage errors */
  }
}

export function loadSessionState() {
  try {
    const raw =
      localStorage.getItem(DEVICE_STORAGE_KEY) ||
      localStorage.getItem('mm-know-me-session');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearSessionState() {
  try {
    localStorage.removeItem(DEVICE_STORAGE_KEY);
    localStorage.removeItem('mm-know-me-session');
  } catch {
    /* ignore */
  }
}
