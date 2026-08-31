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
 * Solutions are built in the background on the server; poll intervention or call generateSolutions.
 */
export async function generateInsight(checkin_id) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 180_000);
  try {
    return await studentApi.post(`${BASE}/insight/${checkin_id}`, {}, { signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * Explicitly generate / fetch solutions for a check-in.
 * fast=true uses instant heuristic plans (reliable on submit).
 */
export async function generateSolutions(checkin_id, fears = [], { fast = true } = {}) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 90_000);
  try {
    return await studentApi.post(
      `${BASE}/generate-solutions`,
      { checkin_id, fears, fast },
      { signal: controller.signal, silent: true }
    );
  } finally {
    window.clearTimeout(timer);
  }
}

function interventionReady(status) {
  if (!status) return false;
  if (status.status === 'awaiting_solutions') return false;
  return Boolean((status.solutions?.length ?? 0) > 0 || (status.fears?.length ?? 0) > 0);
}

/**
 * Poll until the 6-week plan exists (background task or fast generate).
 */
export async function waitForInterventionPlan(checkin_id, { attempts = 12, delayMs = 1500 } = {}) {
  let last = null;
  for (let i = 0; i < attempts; i += 1) {
    last = await getInterventionStatus(checkin_id);
    if (interventionReady(last)) return last;
    if (i === 0 || i === 3) {
      try {
        await generateSolutions(checkin_id, [], { fast: true });
        last = await getInterventionStatus(checkin_id);
        if (interventionReady(last)) return last;
      } catch {
        /* background task may already be running */
      }
    }
    if (i < attempts - 1) {
      await new Promise((resolve) => window.setTimeout(resolve, delayMs));
    }
  }
  return last;
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

/**
 * Latest (or a past) journey: lock window, fear factor, plan, history.
 */
export async function getActiveJourney(checkinId) {
  const q = checkinId != null && checkinId !== '' ? `?checkin_id=${encodeURIComponent(checkinId)}` : '';
  return studentApi.get(`${BASE}/active${q}`);
}

export async function getJourneyHistory() {
  return studentApi.get(`${BASE}/history`);
}

/**
 * Record a suggested mock/test so the fear-factor score drops.
 */
export async function completePlanAction(checkinId, { fear_id, tool_code, action_key, source = 'tool' } = {}) {
  return studentApi.post(`${BASE}/plan-actions/${checkinId}/complete`, {
    fear_id: fear_id || '',
    tool_code,
    action_key: action_key || undefined,
    source,
  });
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
