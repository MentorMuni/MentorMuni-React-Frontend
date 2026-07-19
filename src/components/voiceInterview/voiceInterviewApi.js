import { API_BASE } from '../../config';

const SESSION_PATH = '/interview-ready/voice-interview/session';
const ANALYZE_PATH = '/interview-ready/voice-interview/analyze';

function formatDetail(detail) {
  if (!detail) return '';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item?.msg) return item.msg;
        if (item?.message) return item.message;
        return null;
      })
      .filter(Boolean)
      .join('. ');
  }
  if (typeof detail === 'object') {
    return detail.msg || detail.message || JSON.stringify(detail);
  }
  return String(detail);
}

export function messageForHttpStatus(status, fallback) {
  switch (status) {
    case 422:
      return 'Check your interview focus and try again.';
    case 429:
      return 'Too many requests — wait a minute, then retry.';
    case 502:
    case 503:
      return 'The coach is briefly unavailable. Try again in a moment.';
    case 504:
      return 'That took too long. Retry analysis — your transcript is still saved.';
    default:
      return fallback || `Something went wrong (${status || 'error'}).`;
  }
}

async function parseError(res) {
  const text = await res.text().catch(() => '');
  let raw = '';
  try {
    const json = JSON.parse(text);
    raw = formatDetail(json.detail) || formatDetail(json.message) || formatDetail(json.error) || text;
  } catch {
    raw = text;
  }
  return messageForHttpStatus(res.status, raw || `HTTP ${res.status}`);
}

/**
 * Mint an ephemeral OpenAI Realtime key for browser WebRTC.
 * @param {{ interview_focus: string, target_role?: string, target_companies?: string, extra_context?: string, voice?: string }} body
 */
export async function createVoiceInterviewSession(body) {
  const res = await fetch(`${API_BASE}${SESSION_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const message = await parseError(res);
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

/**
 * Score a completed interview from the captured transcript.
 * @param {{ interview_focus: string, transcript: Array<{ role: 'user'|'assistant', text: string }>, target_role?: string, target_companies?: string }} body
 */
export async function analyzeVoiceInterview(body) {
  const res = await fetch(`${API_BASE}${ANALYZE_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const message = await parseError(res);
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

/** Normalize OpenAI-style nested client_secret shapes. */
export function normalizeClientSecret(clientSecret) {
  if (!clientSecret) return null;
  if (typeof clientSecret === 'string') return clientSecret;
  if (typeof clientSecret === 'object' && typeof clientSecret.value === 'string') {
    return clientSecret.value;
  }
  return null;
}
