import { studentApi, StudentApiError } from '../studentApi';

export { StudentApiError };

/**
 * Start a new Know Me check-in session.
 * @returns {{ checkin_id: number, questions: array, total_steps: number }}
 */
export async function startCheckIn() {
  try {
    const result = await studentApi.post('/student/know-me/start', {});
    return result;
  } catch (err) {
    console.error('startCheckIn error:', err);
    throw err;
  }
}

/**
 * Save one step response to the check-in.
 * @param {number} checkin_id
 * @param {{ question_key: string, response_type: string, selected_ids: array, free_text: string }} body
 */
export async function saveStepResponse(checkin_id, body) {
  return studentApi.post(`/student/know-me/step/${checkin_id}`, body);
}

/**
 * Generate elder-brother insight after check-in complete.
 * @param {number} checkin_id
 * @returns {{ checkin_id, source, headline, what_i_hear, narrative, blockers, action_plan, ... }}
 */
export async function generateInsight(checkin_id) {
  return studentApi.post(`/student/know-me/insight/${checkin_id}`, {});
}

/**
 * Get progress view (30–45 day check-in comparison).
 */
export async function getProgress() {
  return studentApi.get('/student/know-me/progress');
}

const DEVICE_STORAGE_KEY = 'mm-know-me-session';

export function saveSessionState(checkin_id, responses, step_index) {
  try {
    localStorage.setItem(
      DEVICE_STORAGE_KEY,
      JSON.stringify({
        checkin_id,
        responses,
        step_index,
        saved_at: Date.now(),
      })
    );
  } catch {
    /* ignore storage errors */
  }
}

export function loadSessionState() {
  try {
    const raw = localStorage.getItem(DEVICE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearSessionState() {
  try {
    localStorage.removeItem(DEVICE_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
