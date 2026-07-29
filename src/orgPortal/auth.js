/**
 * Org-portal (tenant) auth helpers for college TPO / HOD / student users.
 * Separate from platform admin (/platform/auth/*).
 */

import { orgApi, OrgApiError } from './orgApi';
import {
  ORG_SUSPENDED_FLASH_KEY,
  getSuspendedUx,
  isOrgSuspendedDetail,
} from './suspended';

const SESSION_KEY = 'mm-org-session';

export function getOrgSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setOrgSession(user) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      id: user?.id,
      name: user?.name || [user?.first_name, user?.last_name].filter(Boolean).join(' ') || '',
      email: user?.email || '',
      username: user?.username || '',
      role: user?.role || '',
      organization_id: user?.organization_id,
      organization_name: user?.organization_name || user?.organization?.name || '',
      loggedInAt: new Date().toISOString(),
    })
  );
}

export function clearOrgSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
  orgApi.clearToken();
}

export function isOrgAuthenticated() {
  return Boolean(orgApi.getToken() && getOrgSession());
}

export function consumeOrgAuthFlash() {
  try {
    const raw = sessionStorage.getItem(ORG_SUSPENDED_FLASH_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(ORG_SUSPENDED_FLASH_KEY);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function buildLoginBody(userId, password, organizationCode = '') {
  const id = String(userId || '').trim();
  const payload = { password };
  if (id.includes('@')) {
    payload.email = id.toLowerCase();
  } else {
    payload.username = id;
  }
  const code = String(organizationCode || '').trim().toUpperCase();
  if (code) payload.organization_code = code;
  return payload;
}

/**
 * POST /auth/login
 * - 401 → invalid credentials
 * - 403 + suspended detail → show API detail (not wrong-password UX)
 */
export async function loginOrgUser(userId, password, organizationCode = '') {
  try {
    const login = await orgApi.post(
      '/auth/login',
      buildLoginBody(userId, password, organizationCode),
      { auth: false }
    );

    if (!login?.access_token) {
      return { ok: false, error: 'Login succeeded but access token is missing.', code: 'NO_TOKEN' };
    }

    orgApi.setToken(login.access_token);

    let user = {
      email: login.email,
      username: login.username,
      role: login.role,
      name: login.name,
      organization_id: login.organization_id,
    };

    try {
      const me = await orgApi.get('/auth/me');
      user = { ...user, ...me };
    } catch (err) {
      if (err instanceof OrgApiError && err.isSuspended) {
        clearOrgSession();
        return {
          ok: false,
          error: err.message,
          code: 'ORG_SUSPENDED',
          status: 403,
          ux: getSuspendedUx(err.message),
        };
      }
      // Token received; me is optional for login UX if route differs.
    }

    setOrgSession(user);
    return { ok: true, user, token_type: login.token_type || 'bearer' };
  } catch (err) {
    if (err instanceof OrgApiError) {
      if (err.isSuspended || (err.status === 403 && isOrgSuspendedDetail(err.message))) {
        clearOrgSession();
        return {
          ok: false,
          error: err.message,
          code: 'ORG_SUSPENDED',
          status: 403,
          ux: getSuspendedUx(err.message),
        };
      }
      if (err.status === 401) {
        return {
          ok: false,
          error: err.message || 'Invalid credentials.',
          code: 'INVALID_CREDENTIALS',
          status: 401,
        };
      }
      if (err.status === 403) {
        return {
          ok: false,
          error: err.message,
          code: 'FORBIDDEN',
          status: 403,
          ux: getSuspendedUx(err.message),
        };
      }
      return { ok: false, error: err.message || 'Unable to login.', status: err.status };
    }
    return { ok: false, error: err?.message || 'Unable to login.' };
  }
}

export function logoutOrgUser({ redirectToLogin = false, flash } = {}) {
  clearOrgSession();
  if (flash?.message) {
    try {
      sessionStorage.setItem(ORG_SUSPENDED_FLASH_KEY, JSON.stringify(flash));
    } catch {
      // ignore
    }
  }
  if (redirectToLogin && typeof window !== 'undefined') {
    const path = window.location.pathname || '';
    if (!path.includes('/login')) {
      window.location.assign('/login');
    }
  }
}

/**
 * For college signup / registration forms.
 * Returns a display string when the API blocked signup because the org is suspended.
 */
export function getRegistrationErrorMessage(err) {
  if (!err) return '';
  if (err instanceof OrgApiError) {
    if (err.isRegistrationDisabled || err.isSuspended || err.status === 403) {
      return err.message || 'This organization is suspended. Registration is disabled.';
    }
    return err.message;
  }
  if (typeof err === 'string') return err;
  return err?.message || 'Registration failed.';
}

/**
 * POST /platform/auth/activate-tpo
 * API key only — no platform JWT. Used by /activate-tpo?token=...
 */
export async function activateTpoAccount(token, newPassword) {
  try {
    const data = await orgApi.post(
      '/platform/auth/activate-tpo',
      {
        token: String(token || '').trim(),
        new_password: newPassword,
      },
      { auth: false }
    );
    return {
      ok: true,
      message: data?.message || 'Password set. You can log in to the Organization Portal.',
      data,
    };
  } catch (err) {
    if (err instanceof OrgApiError) {
      return {
        ok: false,
        error: err.message || 'Unable to activate account.',
        status: err.status,
        isSuspended: err.isSuspended,
      };
    }
    return { ok: false, error: err?.message || 'Unable to activate account.' };
  }
}

export { OrgApiError, isOrgSuspendedDetail, getSuspendedUx };
