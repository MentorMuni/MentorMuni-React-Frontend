import { studentApi, StudentApiError } from '../studentApi';

export { StudentApiError };

export async function fetchMentorContext() {
  return studentApi.get('/student/mentor/context');
}

/**
 * Mint OpenAI Realtime ephemeral key for the 24/7 voice mentor.
 * Same shape as voice interview session (client_secret + realtime_calls_url).
 */
export async function createMentorVoiceSession(body = {}) {
  return studentApi.post('/student/mentor/voice/session', body || {});
}
