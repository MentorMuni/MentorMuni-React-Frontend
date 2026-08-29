/**
 * Student-portal-only HTTP client.
 * Uses the student session token (sessionStorage); 401 → /studentportal/login.
 * Never touches Organization session/token.
 */

import { API_BASE } from '../config';
import { studentApiBusy } from '../lib/apiBusy';
import { clearStudentSession, getStudentToken } from './auth';
import { studentPaths } from './paths';

const BASE_URL = API_BASE;
const API_KEY = import.meta.env.VITE_API_KEY || '';

const AUTO_LOGOUT_CODES = new Set([
  'TOKEN_EXPIRED',
  'TOKEN_MISSING',
  'TOKEN_INVALID',
  'TOKEN_WRONG_SCOPE',
  'TOKEN_WRONG_TYPE',
  'INVALID_API_KEY',
]);

export class StudentApiError extends Error {
  constructor(message, { status = 0, code = '', detail = null, data = null } = {}) {
    super(message);
    this.name = 'StudentApiError';
    this.status = status;
    this.code = code;
    this.detail = detail;
    this.data = data;
  }
}

function getToken() {
  return getStudentToken();
}

function isDemoOrLocalToken(token = getToken()) {
  const t = String(token || '');
  return t.startsWith('demo.') || t.startsWith('local.');
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

function forceStudentLogout() {
  if (isDemoOrLocalToken()) return;
  clearStudentSession();
  if (typeof window !== 'undefined') {
    const path = (window.location.pathname || '').toLowerCase();
    if (!path.includes('/studentportal/login')) {
      window.location.assign(studentPaths.login);
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
    const normalized = message || `Request failed (${res.status})`;

    if (auth && AUTO_LOGOUT_CODES.has(code)) {
      forceStudentLogout();
    } else if (auth && res.status === 401 && !code) {
      if (/token|expired|unauthori[sz]ed|invalid api key|missing api/i.test(normalized || text || '')) {
        forceStudentLogout();
      }
    }

    throw new StudentApiError(normalized, {
      status: res.status,
      code,
      detail,
      data,
    });
  }

  return data;
}

async function request(method, path, { body, auth = true, silent = false } = {}) {
  if (!silent) studentApiBusy.begin();
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: buildHeaders(auth),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return await parseResponse(res, { auth });
  } finally {
    if (!silent) studentApiBusy.end();
  }
}

export const studentApi = {
  baseUrl: BASE_URL,
  key: API_KEY,
  getToken,
  isDemoOrLocalToken,
  get: (path, opts) => request('GET', path, opts),
  post: (path, body, opts = {}) => request('POST', path, { ...opts, body }),
  put: (path, body, opts = {}) => request('PUT', path, { ...opts, body }),
  patch: (path, body, opts = {}) => request('PATCH', path, { ...opts, body }),
  delete: (path, opts) => request('DELETE', path, opts),
};
