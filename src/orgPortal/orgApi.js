/**
 * Shared API client for Organization Portal (TPO / HOD / Student).
 * Uses X-API-Key + tenant Bearer JWT (scope = tenant), not platform tokens.
 *
 * On 403 org-suspended responses: clears token, stores flash message, redirects to /login.
 * On TOKEN_* / INVALID_API_KEY: auto-logout (same contract as platform admin).
 */

import { API_BASE } from '../config';
import {
  ORG_SUSPENDED_FLASH_KEY,
  getSuspendedUx,
  isOrgSuspendedDetail,
  isRegistrationDisabledDetail,
  normalizeDetail,
} from './suspended';

const BASE_URL = API_BASE;
const API_KEY = import.meta.env.VITE_API_KEY || '';
const TOKEN_KEY = 'mm-org-token';
const SESSION_KEY = 'mm-org-session';

/** Codes that mean the session/API key is unusable — force login. */
const AUTO_LOGOUT_CODES = new Set([
  'TOKEN_EXPIRED',
  'TOKEN_MISSING',
  'TOKEN_INVALID',
  'INVALID_API_KEY',
]);

export class OrgApiError extends Error {
  constructor(
    message,
    {
      status = 0,
      code = '',
      detail = null,
      data = null,
      isSuspended = false,
      isRegistrationDisabled = false,
    } = {}
  ) {
    super(message);
    this.name = 'OrgApiError';
    this.status = status;
    this.code = code;
    this.detail = detail;
    this.data = data;
    this.isSuspended = isSuspended;
    this.isRegistrationDisabled = isRegistrationDisabled;
  }
}

function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setToken(token) {
  try {
    if (!token) localStorage.removeItem(TOKEN_KEY);
    else localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore storage issues
  }
}

function clearToken() {
  setToken(null);
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
  return { code, message: message || text || '', detail };
}

function forceLogoutUnauthorized() {
  clearToken();
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
  if (typeof window !== 'undefined') {
    const path = (window.location.pathname || '').toLowerCase();
    if (!path.includes('/organization/login')) {
      window.location.assign('/Organization/login');
    }
  }
}

function forceLogoutForSuspension(detail) {
  clearToken();
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }

  const ux = getSuspendedUx(detail);
  try {
    sessionStorage.setItem(
      ORG_SUSPENDED_FLASH_KEY,
      JSON.stringify({
        message: ux.message,
        cta: ux.cta,
        kind: ux.kind,
        at: new Date().toISOString(),
      })
    );
  } catch {
    // ignore
  }

  if (typeof window !== 'undefined') {
    const path = (window.location.pathname || '').toLowerCase();
    if (!path.includes('/organization/login')) {
      window.location.assign('/Organization/login');
    }
  }
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
    const { code, message, detail } = extractDetail(data, text);
    const normalized = message || normalizeDetail(detail) || `Request failed (${res.status})`;
    const suspended =
      res.status === 403 &&
      (code === 'ORG_SUSPENDED' || isOrgSuspendedDetail(detail) || isOrgSuspendedDetail(normalized));
    const registrationDisabled =
      res.status === 403 && isRegistrationDisabledDetail(detail);

    if (auth && AUTO_LOGOUT_CODES.has(code)) {
      forceLogoutUnauthorized();
    } else if (auth && res.status === 401 && !code) {
      if (/token|expired|unauthori[sz]ed|invalid api key|missing api/i.test(normalized || text || '')) {
        forceLogoutUnauthorized();
      }
    } else if (auth && suspended) {
      forceLogoutForSuspension(detail);
    }

    throw new OrgApiError(normalized, {
      status: res.status,
      code,
      detail,
      data,
      isSuspended: suspended,
      isRegistrationDisabled: registrationDisabled,
    });
  }

  return data;
}

async function request(method, path, { body, auth = true } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: buildHeaders(auth),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return parseResponse(res, { auth });
}

export const orgApi = {
  baseUrl: BASE_URL,
  key: API_KEY,
  getToken,
  setToken,
  clearToken,
  get: (path, opts) => request('GET', path, opts),
  post: (path, body, opts = {}) => request('POST', path, { ...opts, body }),
  put: (path, body, opts = {}) => request('PUT', path, { ...opts, body }),
  patch: (path, body, opts = {}) => request('PATCH', path, { ...opts, body }),
  delete: (path, opts) => request('DELETE', path, opts),
};

export { forceLogoutForSuspension };
