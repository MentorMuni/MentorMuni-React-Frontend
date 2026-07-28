/**
 * MentorMuni Platform Admin — auth credentials & session
 * Demo login only; replace with real API later.
 */

export const PLATFORM_ADMIN_CREDENTIALS = {
  email: 'mentormuniteam@gmail.com',
  password: 'MentorMuni@1234',
};

const SESSION_KEY = 'mm-platform-admin-session';

export function getPlatformSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setPlatformSession(user) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      loggedInAt: new Date().toISOString(),
    })
  );
}

export function clearPlatformSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function isPlatformAuthenticated() {
  return Boolean(getPlatformSession());
}

export function authenticatePlatformAdmin(email, password) {
  const normalized = String(email || '').trim().toLowerCase();
  if (
    normalized === PLATFORM_ADMIN_CREDENTIALS.email.toLowerCase() &&
    password === PLATFORM_ADMIN_CREDENTIALS.password
  ) {
    return {
      ok: true,
      user: {
        id: 1,
        name: 'MentorMuni Super Admin',
        email: PLATFORM_ADMIN_CREDENTIALS.email,
        role: 'Platform Admin',
        status: 'ACTIVE',
      },
    };
  }
  return { ok: false, error: 'Invalid login ID or password.' };
}
