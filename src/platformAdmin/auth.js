/**
 * Platform admin auth — token + session live in sessionStorage
 * so closing the browser requires login on the next visit.
 */
import { createBrowserSessionStore } from '../lib/browserSessionStore';
import { platformApi } from './platformApi';

const SESSION_KEY = 'mm-platform-admin-session';
const TOKEN_KEY = 'mm-platform-admin-token';
const authStore = createBrowserSessionStore([SESSION_KEY, TOKEN_KEY]);

export function getPlatformSession() {
  try {
    const raw = authStore.get(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setPlatformSession(user) {
  authStore.set(
    SESSION_KEY,
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      mustChangePassword: Boolean(user.mustChangePassword),
      expiresAt: user.expiresAt || null,
      loggedInAt: new Date().toISOString(),
    })
  );
}

export function clearPlatformSession() {
  authStore.clearAll();
  platformApi.clearToken();
}

export function isPlatformAuthenticated() {
  const session = getPlatformSession();
  const token = platformApi.getToken();
  if (!session || !token) return false;
  if (session.expiresAt && Date.now() > Number(session.expiresAt)) {
    clearPlatformSession();
    return false;
  }
  return true;
}

function normalizeUser(mePayload) {
  return {
    id: mePayload?.id,
    name: mePayload?.name || 'Platform User',
    email: mePayload?.email || '',
    role: mePayload?.role || 'PLATFORM_ADMIN',
    status: mePayload?.status || 'ACTIVE',
    mustChangePassword: Boolean(
      mePayload?.must_change_password ||
        mePayload?.password_change_required ||
        mePayload?.force_password_change
    ),
  };
}

export async function authenticatePlatformAdmin(email, password) {
  try {
    const login = await platformApi.post(
      '/platform/auth/login',
      {
        email: String(email || '').trim().toLowerCase(),
        password,
      },
      { auth: false }
    );
    if (!login?.access_token) {
      return { ok: false, error: 'Login succeeded but access token is missing.' };
    }

    platformApi.setToken(login.access_token);
    try {
      const me = await platformApi.get('/platform/auth/me');
      const user = normalizeUser(me);
      const expiresIn = Number(login.expires_in_minutes);
      return {
        ok: true,
        user: {
          ...user,
          expiresAt:
            Number.isFinite(expiresIn) && expiresIn > 0
              ? Date.now() + expiresIn * 60 * 1000
              : null,
        },
        token_type: login.token_type || 'bearer',
        expires_in_minutes: login.expires_in_minutes,
      };
    } catch (meError) {
      platformApi.clearToken();
      return { ok: false, error: meError.message || 'Unable to load platform profile.' };
    }
  } catch (error) {
    platformApi.clearToken();
    return { ok: false, error: error.message || 'Unable to login.' };
  }
}

export async function changePlatformPassword(currentPassword, newPassword) {
  await platformApi.post('/platform/auth/change-password', {
    current_password: currentPassword,
    new_password: newPassword,
  });
  // Confirm server cleared the flag (do not trust client-only clear).
  const me = await platformApi.get('/platform/auth/me');
  const user = normalizeUser(me);
  const session = getPlatformSession();
  setPlatformSession({
    ...session,
    ...user,
    expiresAt: session?.expiresAt || null,
  });
  return user;
}
