/**
 * Platform Admin route paths.
 * Public URL base: /platform/admin
 */

export const PLATFORM_ADMIN_BASE = '/platform/admin';

export const platformAdminPaths = {
  base: PLATFORM_ADMIN_BASE,
  login: `${PLATFORM_ADMIN_BASE}/login`,
  dashboard: `${PLATFORM_ADMIN_BASE}/dashboard`,
  organizations: `${PLATFORM_ADMIN_BASE}/organizations`,
  individuals: `${PLATFORM_ADMIN_BASE}/individuals`,
  subscriptions: `${PLATFORM_ADMIN_BASE}/subscriptions`,
  features: `${PLATFORM_ADMIN_BASE}/features`,
  platformUsers: `${PLATFORM_ADMIN_BASE}/platform-users`,
  settings: `${PLATFORM_ADMIN_BASE}/settings`,
  support: `${PLATFORM_ADMIN_BASE}/support`,
  changePassword: `${PLATFORM_ADMIN_BASE}/change-password`,
};

/** @deprecated Old URL — kept for redirects only */
export const PLATFORM_ADMIN_LEGACY_BASE = '/mentormuniplatformadmin';
