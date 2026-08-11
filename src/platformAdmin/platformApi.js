import { API_BASE } from '../config';
import { createBrowserSessionStore } from '../lib/browserSessionStore';

const BASE_URL = API_BASE;
const API_KEY = import.meta.env.VITE_API_KEY || '';
const TOKEN_KEY = 'mm-platform-admin-token';
const SESSION_KEY = 'mm-platform-admin-session';
const authStore = createBrowserSessionStore([TOKEN_KEY, SESSION_KEY]);

/** Codes that mean the session/API key is unusable — force login. */
const AUTO_LOGOUT_CODES = new Set([
  'TOKEN_EXPIRED',
  'TOKEN_MISSING',
  'TOKEN_INVALID',
  'INVALID_API_KEY',
]);

export class PlatformApiError extends Error {
  constructor(message, status = 0, code = '') {
    super(message);
    this.name = 'PlatformApiError';
    this.status = status;
    this.code = code;
  }
}

function getToken() {
  return authStore.get(TOKEN_KEY);
}

function setToken(token) {
  authStore.set(TOKEN_KEY, token || '');
}

function forceLogoutUnauthorized() {
  authStore.clearAll();
  const path = String(window.location?.pathname || '');
  if (!path.includes('/platform/admin/login')) {
    window.location.assign('/platform/admin/login');
  }
}

function buildHeaders(includeAuth = true) {
  const token = getToken();
  return {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
    ...(includeAuth && token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function extractDetail(data, text) {
  const detail = data?.detail ?? data?.message ?? text;
  let code = '';
  let message = '';

  if (typeof detail === 'string') {
    message = detail;
  } else if (Array.isArray(detail)) {
    message = detail
      .map((item) => (typeof item === 'string' ? item : item?.msg || item?.message || ''))
      .filter(Boolean)
      .join(' ');
  } else if (detail && typeof detail === 'object') {
    code = String(detail.code || data?.code || '').toUpperCase();
    message = detail.message || detail.msg || detail.detail || '';
  }

  if (!code && data?.code) code = String(data.code).toUpperCase();
  return { code, message: message || text || '' };
}

async function parseResponse(res, { auth = true } = {}) {
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const { code, message } = extractDetail(data, text);

    // Auto-logout only for token/API-key failures — not INVALID_CREDENTIALS,
    // ACCOUNT_INACTIVE, or FORBIDDEN_ROLE.
    if (auth && AUTO_LOGOUT_CODES.has(code)) {
      forceLogoutUnauthorized();
    } else if (auth && res.status === 401 && !code) {
      // Legacy string responses without structured code
      if (/token|expired|unauthori[sz]ed|invalid api key|missing api/i.test(message || text || '')) {
        forceLogoutUnauthorized();
      }
    }

    throw new PlatformApiError(
      message || text || `Request failed (${res.status})`,
      res.status,
      code
    );
  }
  return data;
}

async function request(method, path, { body, auth = true } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: buildHeaders(auth),
    body: body ? JSON.stringify(body) : undefined,
  });
  return parseResponse(res, { auth });
}

export const platformApi = {
  baseUrl: BASE_URL,
  key: API_KEY,
  getToken,
  setToken,
  clearToken: () => setToken(null),
  get: (path, opts) => request('GET', path, opts),
  post: (path, body, opts = {}) => request('POST', path, { ...opts, body }),
  put: (path, body, opts = {}) => request('PUT', path, { ...opts, body }),
  delete: (path, opts = {}) => request('DELETE', path, opts),
};
