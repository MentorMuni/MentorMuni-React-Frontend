/**
 * Student portal auth — separate session from TPO/HOD org portal.
 * TEMP demo student included; remove when campus student APIs are live.
 */

import { orgApi, OrgApiError } from '../orgPortal/orgApi';
import { isOrgSuspendedDetail, getSuspendedUx, ORG_SUSPENDED_FLASH_KEY } from '../orgPortal/suspended';
import { DEMO_ORG } from '../organizationPortal/demoAuth';
import { matchLocalStudent } from './localStudentAuth';
import { studentPaths } from './paths';

const SESSION_KEY = 'mm-student-session';
const TOKEN_KEY = 'mm-student-token';

export const DEMO_STUDENT = {
  email: 'student@demo.edu',
  password: 'Demo@123',
  collegeId: 'CSE2024A01',
  name: 'Ananya Rao',
  role: 'STUDENT',
};

export function getStudentSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStudentSession(user) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      id: user?.id,
      name: user?.name || '',
      email: user?.email || '',
      username: user?.username || '',
      college_id: user?.college_id || user?.username || '',
      role: 'STUDENT',
      organization_id: user?.organization_id,
      organization_name: user?.organization_name || '',
      organization_code: user?.organization_code || '',
      department_name: user?.department_name || user?.department?.name || '',
      mustChangePassword: Boolean(
        user?.mustChangePassword || user?.must_change_password || user?.force_password_change
      ),
      demo: Boolean(user?.demo),
      loggedInAt: new Date().toISOString(),
    })
  );
}

export function getStudentToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setStudentToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export function clearStudentSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export function isStudentAuthenticated() {
  return Boolean(getStudentToken() && getStudentSession());
}

function buildLoginBody(userId, password, organizationCode = '') {
  const id = String(userId || '').trim();
  const payload = { password };
  if (id.includes('@')) payload.email = id.toLowerCase();
  else payload.username = id;
  const code = String(organizationCode || '').trim().toUpperCase();
  if (code) payload.organization_code = code;
  return payload;
}

function isStudentRole(role) {
  const r = String(role || '').toUpperCase();
  return r === 'STUDENT' || r.includes('STUDENT');
}

export function matchDemoStudent(userId, password) {
  const id = String(userId || '').trim().toLowerCase();
  const pass = String(password || '');
  if (pass !== DEMO_STUDENT.password) return null;
  if (
    id === DEMO_STUDENT.email ||
    id === DEMO_STUDENT.collegeId.toLowerCase() ||
    id === 'student'
  ) {
    return DEMO_STUDENT;
  }
  return null;
}

/**
 * Student login — demo (DEMO college only) → API → local enrollment fallback.
 */
export async function loginStudent(userId, password, organizationCode = '') {
  const code = String(organizationCode || '').trim().toUpperCase();

  // Demo only when campus is DEMO (or unset during local smoke)
  if (!code || code === DEMO_ORG.code) {
    const demo = matchDemoStudent(userId, password);
    if (demo) {
      const token = `demo.student.${Date.now()}`;
      setStudentToken(token);
      const user = {
        id: 'demo_student',
        email: demo.email,
        username: demo.collegeId,
        college_id: demo.collegeId,
        name: demo.name,
        role: 'STUDENT',
        organization_id: DEMO_ORG.id,
        organization_name: DEMO_ORG.name,
        organization_code: DEMO_ORG.code,
        department_name: 'Computer Science',
        mustChangePassword: false,
        demo: true,
      };
      setStudentSession(user);
      return { ok: true, user, source: 'demo' };
    }
  }

  const tryLocal = () => {
    const local = matchLocalStudent(userId, password, organizationCode);
    if (!local) return null;
    const token = `local.student.${Date.now()}`;
    setStudentToken(token);
    const user = {
      id: local.studentId || `local_${local.email}`,
      email: local.email,
      username: local.collegeId || local.email,
      college_id: local.collegeId || local.email,
      name: local.name,
      role: 'STUDENT',
      organization_id: local.orgCode,
      organization_name: local.orgName,
      organization_code: local.orgCode,
      department_name: local.departmentName,
      mustChangePassword: false,
      demo: false,
      localEnrollment: true,
    };
    setStudentSession(user);
    return { ok: true, user, source: 'local' };
  };

  try {
    const login = await orgApi.post(
      '/auth/login',
      buildLoginBody(userId, password, organizationCode),
      { auth: false }
    );

    if (!login?.access_token) {
      return { ok: false, error: 'Login succeeded but access token is missing.', code: 'NO_TOKEN' };
    }

    let user = {
      email: login.email,
      username: login.username,
      role: login.role,
      name: login.name,
      organization_id: login.organization_id,
    };

    const prevOrgToken = orgApi.getToken();
    try {
      orgApi.setToken(login.access_token);
      const me = await orgApi.get('/auth/me');
      user = { ...user, ...me };
    } catch (err) {
      if (err instanceof OrgApiError && err.isSuspended) {
        clearStudentSession();
        if (prevOrgToken) orgApi.setToken(prevOrgToken);
        else orgApi.clearToken();
        return {
          ok: false,
          error: err.message,
          code: 'ORG_SUSPENDED',
          status: 403,
          ux: getSuspendedUx(err.message),
        };
      }
    } finally {
      // Restore prior org JWT so student login never leaves student token on orgApi
      if (prevOrgToken) orgApi.setToken(prevOrgToken);
      else orgApi.clearToken();
    }

    if (!isStudentRole(user.role)) {
      return {
        ok: false,
        error: 'This portal is for students. Use the Organization login for TPO / HOD.',
        code: 'WRONG_PORTAL',
      };
    }

    setStudentToken(login.access_token);
    setStudentSession({
      ...user,
      college_id: user.username || user.college_id,
      organization_code: organizationCode || user.organization_code,
    });

    return { ok: true, user, source: 'api' };
  } catch (err) {
    // Local fallback only for DEMO / missing API — never mask a live 401 with stale local creds
    const missingApi =
      !(err instanceof OrgApiError) ||
      err.status === 0 ||
      err.status === 404 ||
      err.status === 501;
    const allowLocal = !code || code === DEMO_ORG.code || missingApi;
    if (allowLocal) {
      const localHit = tryLocal();
      if (localHit) return localHit;
    }

    if (err instanceof OrgApiError) {
      if (err.isSuspended || (err.status === 403 && isOrgSuspendedDetail(err.message))) {
        clearStudentSession();
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
          error: err.message || 'Invalid college ID / email or password.',
          code: 'INVALID_CREDENTIALS',
          status: 401,
        };
      }
      return { ok: false, error: err.message || 'Unable to sign in.', status: err.status };
    }
    return { ok: false, error: err?.message || 'Unable to sign in.' };
  }
}

export function logoutStudent({ redirectToLogin = false } = {}) {
  clearStudentSession();
  if (redirectToLogin && typeof window !== 'undefined') {
    window.location.assign(studentPaths.login);
  }
}

export function consumeStudentAuthFlash() {
  try {
    const raw = sessionStorage.getItem(ORG_SUSPENDED_FLASH_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(ORG_SUSPENDED_FLASH_KEY);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
