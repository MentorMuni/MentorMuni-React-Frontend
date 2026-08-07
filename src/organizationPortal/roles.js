import { orgPaths } from './paths';

export const ORG_ROLES = {
  TPO: 'TPO',
  HOD: 'HOD',
  VIEWER: 'VIEWER',
  STUDENT: 'STUDENT',
};

/**
 * Normalize API / session role strings into portal roles.
 * Viewer aliases: VIEWER, ANALYST, READ_ONLY, OBSERVER, PRINCIPAL_VIEW
 */
export function normalizeOrgRole(role) {
  const r = String(role || '').trim().toUpperCase();
  if (!r) return ORG_ROLES.STUDENT;
  if (
    r === 'VIEWER' ||
    r === 'ANALYST' ||
    r === 'READ_ONLY' ||
    r === 'READONLY' ||
    r === 'OBSERVER' ||
    r === 'PRINCIPAL_VIEW' ||
    r.includes('ANALYST') ||
    r.includes('VIEW_ONLY') ||
    r.includes('VIEWONLY')
  ) {
    return ORG_ROLES.VIEWER;
  }
  if (r === 'ORG_ADMIN' || r === 'TPO' || r === 'TPO_ADMIN' || r.includes('TPO') || r === 'ORGANIZATION_ADMIN') {
    return ORG_ROLES.TPO;
  }
  // Backend role_code for HOD mentors (must run before generic *ADMIN* → TPO)
  if (
    r === 'HOD' ||
    r === 'DEPARTMENT_HEAD' ||
    r === 'DEPARTMENT_ADMIN' ||
    r === 'DEPT_ADMIN' ||
    r.includes('HOD') ||
    r.includes('DEPARTMENT_ADMIN')
  ) {
    return ORG_ROLES.HOD;
  }
  if (r.includes('ADMIN') && !r.includes('PLATFORM')) return ORG_ROLES.TPO;
  return ORG_ROLES.STUDENT;
}

export function getOrgHomePath() {
  return orgPaths.dashboard;
}

export function getOrgLoginPath() {
  return orgPaths.login;
}

export function roleLabel(role) {
  const n = normalizeOrgRole(role);
  if (n === ORG_ROLES.TPO) return 'TPO';
  if (n === ORG_ROLES.HOD) return 'HOD';
  if (n === ORG_ROLES.VIEWER) return 'Viewer';
  return 'Student';
}

/** Prefer API/session role_label (e.g. Placement Coordinator) over generic HOD. */
export function sessionDisplayRole(session) {
  const label = String(session?.role_label || session?.roleLabel || '').trim();
  if (label) return label;
  const title = String(session?.dept_admin_title || session?.deptAdminTitle || '')
    .trim()
    .toUpperCase();
  if (title === 'PLACEMENT_COORDINATOR') return 'Placement Coordinator';
  return roleLabel(session?.role);
}

/** Can create/edit departments, enroll, assign programs, notify, set HOD access. */
export function canMutateCampus(role) {
  return normalizeOrgRole(role) === ORG_ROLES.TPO;
}

export function isHodRole(role) {
  return normalizeOrgRole(role) === ORG_ROLES.HOD;
}

/** HOD branch mentor — department-scoped ops. */
export function canManageBranch(role) {
  return normalizeOrgRole(role) === ORG_ROLES.HOD;
}

/** TPO campus-wide or HOD within their department (UI still checks hodAccess). */
export function canAssignPrograms(role) {
  const n = normalizeOrgRole(role);
  return n === ORG_ROLES.TPO || n === ORG_ROLES.HOD;
}

/** Dashboard + performance (and export) without mutate. */
export function canViewAnalytics(role) {
  const n = normalizeOrgRole(role);
  return n === ORG_ROLES.TPO || n === ORG_ROLES.VIEWER || n === ORG_ROLES.HOD;
}

/** Campus-wide department list (not HOD — they stay in their branch). */
export function canViewCampusDepartments(role) {
  const n = normalizeOrgRole(role);
  return n === ORG_ROLES.TPO || n === ORG_ROLES.VIEWER;
}

export function isViewerRole(role) {
  return normalizeOrgRole(role) === ORG_ROLES.VIEWER;
}
