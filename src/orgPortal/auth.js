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
      organization_code: user?.organization_code || user?.organization?.code || '',
      department_id: user?.department_id ?? user?.department?.id ?? null,
      department_name:
        user?.department_name ||
        user?.department?.name ||
        '',
      department_code: user?.department_code || user?.department?.code || '',
      permissions: Array.isArray(user?.permissions) ? user.permissions : [],
      mustChangePassword: Boolean(
        user?.mustChangePassword ||
          user?.must_change_password ||
          user?.password_change_required ||
          user?.force_password_change
      ),
      demo: Boolean(user?.demo),
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
  // TEMP demo bypass — remove with demoAuth.js when real accounts are live
  const { matchDemoUser, DEMO_ORG } = await import('../organizationPortal/demoAuth');
  const demo = matchDemoUser(userId, password);
  if (demo) {
    const { seedDemoWorkspace } = await import('../organizationPortal/store');
    seedDemoWorkspace();
    const token = `demo.${demo.role}.${Date.now()}`;
    orgApi.setToken(token);
    const user = {
      id: `demo_${demo.role}`,
      email: demo.email,
      username: demo.email.split('@')[0],
      role: demo.role,
      name: demo.name,
      organization_id: DEMO_ORG.id,
      organization_name: DEMO_ORG.name,
      organization_code: DEMO_ORG.code,
      department_id: demo.department_id || null,
      permissions: [],
      mustChangePassword: false,
      demo: true,
    };
    setOrgSession(user);
    return { ok: true, user, token_type: 'bearer', source: 'demo' };
  }

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
    const path = (window.location.pathname || '').toLowerCase();
    if (!path.includes('/organization/login')) {
      window.location.assign('/Organization/login');
    }
  }
}

/**
 * POST /auth/change-password — same contract as platform admin.
 */
export async function changeOrgPassword(currentPassword, newPassword) {
  return orgApi.post('/auth/change-password', {
    current_password: currentPassword,
    new_password: newPassword,
  });
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

/**
 * POST /auth/activate-hod (preferred) or /platform/auth/activate-hod
 * API key only — used by /activate-hod?token=...
 * Falls back to local invite token store until backend is live.
 */
export async function activateHodAccount(token, newPassword) {
  const payload = {
    token: String(token || '').trim(),
    new_password: newPassword,
  };

  const paths = ['/auth/activate-hod', '/platform/auth/activate-hod'];
  let lastError = null;

  for (const path of paths) {
    try {
      const data = await orgApi.post(path, payload, { auth: false });
      return {
        ok: true,
        message: data?.message || 'Password set. You can log in to the Organization Portal.',
        data,
        source: 'api',
      };
    } catch (err) {
      if (err instanceof OrgApiError) {
        if (err.status === 404 || err.status === 501) {
          lastError = err;
          continue;
        }
        return {
          ok: false,
          error: err.message || 'Unable to activate HOD account.',
          status: err.status,
          isSuspended: err.isSuspended,
        };
      }
      lastError = err;
    }
  }

  // Local fallback for demo / pre-API environments
  try {
    const { activateHodInviteLocal } = await import('../organizationPortal/store');
    const local = activateHodInviteLocal(payload.token, newPassword);
    if (local.ok) {
      return {
        ok: true,
        message: local.message,
        data: local,
        source: 'local',
      };
    }
    return { ok: false, error: local.error || 'Unable to activate HOD account.' };
  } catch (err) {
    return {
      ok: false,
      error:
        lastError?.message ||
        err?.message ||
        'Unable to activate HOD account. Ask your TPO for a new invite.',
    };
  }
}
