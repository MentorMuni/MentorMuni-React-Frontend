/**
 * Org-portal (tenant) auth helpers for college TPO / HOD.
 * Token + session live in sessionStorage so closing the browser requires login.
 * Separate from platform admin (/platform/auth/*).
 */

import { createBrowserSessionStore } from '../lib/browserSessionStore';
import { orgApi, OrgApiError } from './orgApi';
import {
  ORG_SUSPENDED_FLASH_KEY,
  getSuspendedUx,
  isOrgSuspendedDetail,
} from './suspended';
import { normalizeOrgRole } from '../organizationPortal/roles';

const SESSION_KEY = 'mm-org-session';
const TOKEN_KEY = 'mm-org-token';
const authStore = createBrowserSessionStore([SESSION_KEY, TOKEN_KEY]);

export function getOrgSession() {
  try {
    const raw = authStore.get(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setOrgSession(user) {
  const expiresAt =
    user?.expiresAt ||
    (Number(user?.expires_in_minutes) > 0
      ? new Date(Date.now() + Number(user.expires_in_minutes) * 60 * 1000).toISOString()
      : undefined);

  authStore.set(
    SESSION_KEY,
    JSON.stringify({
      id: user?.id,
      name: user?.name || [user?.first_name, user?.last_name].filter(Boolean).join(' ') || '',
      email: user?.email || '',
      username: user?.username || '',
      // FE alias: ORG_ADMIN→TPO, DEPARTMENT_ADMIN→HOD (backend may still send either)
      role: normalizeOrgRole(user?.role || user?.role_code),
      role_code: user?.role_code || '',
      dept_admin_title: user?.dept_admin_title || user?.deptAdminTitle || '',
      role_label:
        user?.role_label ||
        user?.roleLabel ||
        (String(user?.dept_admin_title || user?.deptAdminTitle || '').toUpperCase() ===
        'PLACEMENT_COORDINATOR'
          ? 'Placement Coordinator'
          : ''),
      organization_id: user?.organization_id ?? user?.org_id,
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
      expiresAt,
      demo: Boolean(user?.demo),
      loggedInAt: new Date().toISOString(),
    })
  );
}

export function clearOrgSession() {
  authStore.clearAll();
  orgApi.clearToken();
}

export function isOrgAuthenticated() {
  const token = orgApi.getToken();
  const session = getOrgSession();
  if (!token || !session) return false;
  if (session.expiresAt) {
    const expiresMs = new Date(session.expiresAt).getTime();
    if (Number.isFinite(expiresMs) && Date.now() > expiresMs) {
      clearOrgSession();
      return false;
    }
  }
  return true;
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
      id: `demo_${demo.role}_${String(demo.email).split('@')[0]}`,
      email: demo.email,
      username: demo.email.split('@')[0],
      role: demo.role,
      name: demo.name,
      organization_id: DEMO_ORG.id,
      organization_name: DEMO_ORG.name,
      organization_code: DEMO_ORG.code,
      department_id: demo.department_id || null,
      dept_admin_title: demo.dept_admin_title || '',
      role_label: demo.role_label || '',
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

    // Prefer nested user object; fall back to top-level login fields.
    let user = {
      ...(login.user && typeof login.user === 'object' ? login.user : {}),
      email: login.user?.email || login.email,
      username: login.user?.username || login.username,
      role: login.user?.role || login.role,
      name: login.user?.name || login.name,
      organization_id: login.user?.organization_id || login.organization_id,
      organization_code: login.user?.organization_code || login.organization_code,
      organization_name: login.user?.organization_name || login.organization_name,
      department_id: login.user?.department_id ?? login.department_id ?? null,
      department_name: login.user?.department_name || login.department_name,
      department_code: login.user?.department_code || login.department_code,
      permissions: login.user?.permissions || login.permissions,
      must_change_password:
        login.user?.must_change_password ?? login.must_change_password,
      expires_in_minutes: login.expires_in_minutes,
    };

    try {
      const me = await orgApi.get('/auth/me');
      user = { ...user, ...me, expires_in_minutes: login.expires_in_minutes };
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
    return { ok: true, user: getOrgSession(), token_type: login.token_type || 'bearer' };
  } catch (err) {
    if (err instanceof OrgApiError) {
      const code = String(err.code || '').toUpperCase();
      if (
        err.isSuspended ||
        code === 'ORG_SUSPENDED' ||
        (err.status === 403 && isOrgSuspendedDetail(err.detail || err.message))
      ) {
        clearOrgSession();
        return {
          ok: false,
          error: err.message,
          code: 'ORG_SUSPENDED',
          status: 403,
          ux: getSuspendedUx(err.message),
        };
      }
      if (err.status === 401 || code === 'INVALID_CREDENTIALS') {
        return {
          ok: false,
          error: err.message || 'Invalid credentials.',
          code: 'INVALID_CREDENTIALS',
          status: 401,
        };
      }
      if (err.status === 403) {
        const detail = err.detail && typeof err.detail === 'object' ? err.detail : {};
        return {
          ok: false,
          error: err.message,
          code: code || detail.code || 'FORBIDDEN',
          status: 403,
          portal_url: detail.portal_url || undefined,
          organization_name: detail.organization_name || undefined,
        };
      }
      return {
        ok: false,
        error: err.message || 'Unable to login.',
        status: err.status,
        code: code || undefined,
      };
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
 * POST /auth/forgot-password
 * identifier = email or username/college ID
 * portal = organization | student
 */
export async function requestPasswordReset({
  identifier = '',
  email = '',
  username = '',
  organizationCode = '',
  portal = 'organization',
} = {}) {
  const body = {
    organization_code: String(organizationCode || '').trim().toUpperCase() || undefined,
    portal: portal === 'student' ? 'student' : 'organization',
  };
  const id = String(identifier || '').trim();
  if (email) body.email = String(email).trim().toLowerCase();
  if (username) body.username = String(username).trim();
  if (id) {
    if (id.includes('@')) body.email = id.toLowerCase();
    else body.username = id;
    body.identifier = id;
  }

  const data = await orgApi.post('/auth/forgot-password', body, { auth: false });
  return {
    ok: true,
    message:
      data?.message ||
      'If an account exists for those details, a reset link has been sent.',
    emailed: Boolean(data?.emailed ?? data?.email_sent),
    resetUrl: data?.reset_url || data?.resetUrl || data?.setup_url || '',
  };
}

/**
 * POST /auth/reset-password
 */
export async function resetPasswordWithToken({ token, newPassword }) {
  const data = await orgApi.post(
    '/auth/reset-password',
    {
      token: String(token || '').trim(),
      new_password: String(newPassword || ''),
    },
    { auth: false }
  );
  return {
    ok: true,
    message: data?.message || 'Password has been reset. You can log in now.',
  };
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
 * GET /platform/auth/activate-tpo/preview?token=
 * API key only — college + invite context for the activation page.
 */
export async function previewTpoActivation(token) {
  try {
    const data = await orgApi.get(
      `/platform/auth/activate-tpo/preview?token=${encodeURIComponent(String(token || '').trim())}`,
      { auth: false }
    );
    return {
      ok: true,
      organizationName: data?.organization_name || data?.organizationName || '',
      organizationCode: extractOrgCode(data),
      portalSlug: data?.portal_slug || data?.portalSlug || '',
      title: data?.title || 'TPO',
      email: data?.email || '',
      firstName: data?.first_name || data?.firstName || '',
      data,
    };
  } catch (err) {
    if (err instanceof OrgApiError) return friendlyActivateError(err);
    return { ok: false, error: err?.message || 'Unable to load invite details.' };
  }
}

/**
 * POST /platform/auth/activate-tpo
 * API key only — no platform JWT. Used by /activate-tpo?token=...
 * Success: { message, organization_code }; must_change_password is false after activate.
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
      organizationCode: extractOrgCode(data),
      organizationName: data?.organization_name || data?.organizationName || '',
      data,
    };
  } catch (err) {
    if (err instanceof OrgApiError) return friendlyActivateError(err);
    return { ok: false, error: err?.message || 'Unable to activate account.' };
  }
}

function extractOrgCode(data) {
  const raw =
    data?.organization_code ||
    data?.organizationCode ||
    data?.org_code ||
    data?.orgCode ||
    data?.organization?.code ||
    data?.organization?.organization_code ||
    '';
  return String(raw || '')
    .trim()
    .toUpperCase();
}

function friendlyActivateError(err) {
  const code = String(err?.code || '').toUpperCase();
  if (code === 'ACTIVATION_TOKEN_EXPIRED') {
    return {
      ok: false,
      error: err.message || 'This activation link has expired. Ask for a fresh invite email.',
      status: err.status,
      code,
    };
  }
  if (code === 'TOKEN_INVALID' || code === 'ACTIVATION_TOKEN_INVALID') {
    return {
      ok: false,
      error: err.message || 'This activation link is invalid or already used.',
      status: err.status,
      code,
    };
  }
  return {
    ok: false,
    error: err?.message || 'Unable to activate account.',
    status: err?.status,
    code: code || undefined,
    isSuspended: err?.isSuspended,
  };
}

/**
 * POST /auth/activate-hod (preferred) or /platform/auth/activate-hod
 * API key only — used by /activate-hod?token=...
 * Local fallback only when a demo invite token exists in the browser store.
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
        organizationCode: extractOrgCode(data),
        data,
        source: 'api',
      };
    } catch (err) {
      if (err instanceof OrgApiError) {
        if (err.status === 404 || err.status === 501) {
          lastError = err;
          continue;
        }
        return friendlyActivateError(err);
      }
      lastError = err;
    }
  }

  try {
    const { activateHodInviteLocal, peekHodInvite } = await import('../organizationPortal/store');
    if (!peekHodInvite(payload.token)) {
      return friendlyActivateError(
        lastError || {
          message: 'Unable to activate HOD account. Ask your TPO to resend the invite.',
        }
      );
    }
    const local = activateHodInviteLocal(payload.token, newPassword);
    if (local.ok) {
      try {
        const { registerActivatedDemoMentor } = await import('../organizationPortal/demoAuth');
        registerActivatedDemoMentor({
          email: local.email,
          password: newPassword,
          name: local.name,
          departmentId: local.departmentId,
          slot: local.slot || 'hod',
        });
      } catch {
        // demo registry optional
      }
      return {
        ok: true,
        message: local.message,
        organizationCode: extractOrgCode(local) || 'DEMO',
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
