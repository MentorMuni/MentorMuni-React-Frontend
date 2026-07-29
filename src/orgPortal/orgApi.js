/**
 * Shared API client for Organization Portal (TPO / HOD / Student).
 * Uses X-API-Key + tenant Bearer JWT (scope = tenant), not platform tokens.
 *
 * On 403 org-suspended responses: clears token, stores flash message, redirects to /login.
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

export class OrgApiError extends Error {
  constructor(message, { status = 0, detail = null, data = null, isSuspended = false, isRegistrationDisabled = false } = {}) {
    super(message);
    this.name = 'OrgApiError';
    this.status = status;
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

function forceLogoutForSuspension(detail) {
  clearToken();
  try {
    localStorage.removeItem('mm-org-session');
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
    const path = window.location.pathname || '';
    // Avoid reload loops on the login page itself.
    if (!path.includes('/login')) {
      window.location.assign('/login');
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
    const detail = data?.detail ?? data?.message ?? text;
    const message = normalizeDetail(detail) || `Request failed (${res.status})`;
    const suspended = res.status === 403 && isOrgSuspendedDetail(detail);
    const registrationDisabled =
      res.status === 403 && isRegistrationDisabledDetail(detail);

    // Authenticated org calls: suspended org → hard logout + login redirect.
    if (auth && suspended) {
      forceLogoutForSuspension(detail);
    }

    throw new OrgApiError(message, {
      status: res.status,
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
