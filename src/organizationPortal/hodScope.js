/**
 * Resolve HOD department scope from session + optional department list (API or local).
 * Prefer session.department_id from /auth/me — do not require localStorage match.
 */

import { getOrgSession } from '../orgPortal';
import {
  getHodAccess,
  getHodMetrics,
  listDepartments,
  listDrives,
  listInvitations,
  listPrograms,
  listStudents,
} from './store';

/**
 * @param {object|null} session
 * @param {Array<{id:*, name?:string, code?:string, hodEmail?:string}>} [departments]
 */
export function resolveHodDepartment(session = getOrgSession(), departments) {
  const depts = Array.isArray(departments) && departments.length
    ? departments
    : listDepartments();

  const id = session?.department_id ?? session?.department?.id ?? null;
  if (id != null && id !== '') {
    const byId = depts.find((d) => String(d.id) === String(id));
    if (byId) {
      return {
        id: byId.id,
        name: byId.name || session?.department_name || 'Department',
        code: byId.code || '',
        hodEmail: byId.hodEmail || byId.hod_email || session?.email || '',
      };
    }
    // Live API: trust session even when dept list not hydrated yet
    return {
      id,
      name:
        session?.department_name ||
        session?.department?.name ||
        'Your department',
      code: session?.department_code || session?.department?.code || '',
      hodEmail: session?.email || '',
      fromSession: true,
    };
  }

  const email = String(session?.email || '').trim().toLowerCase();
  if (email) {
    const byEmail = depts.find(
      (d) =>
        String(d.hodEmail || d.hod_email || '')
          .trim()
          .toLowerCase() === email
    );
    if (byEmail) return byEmail;
  }
  return null;
}

/** Live API HODs are not blocked by local AccessSettings toggles. */
export function resolveHodAccess(session = getOrgSession()) {
  const local = getHodAccess();
  if (session?.demo) return local;
  const perms = Array.isArray(session?.permissions) ? session.permissions : [];
  const denyInvite = perms.some((p) => /deny.*invite|invite.*deny/i.test(String(p)));
  const denyAssign = perms.some((p) => /deny.*assign|assign.*deny/i.test(String(p)));
  return {
    ...local,
    canInviteStudents: !denyInvite,
    canAssignPrograms: !denyAssign,
  };
}

/** Build branch metrics from live API student + pending lists (HOD dashboard/performance). */
export function buildBranchMetricsFromApi({ students = [], pendingCount = 0, programsCount = 0 } = {}) {
  const list = Array.isArray(students) ? students : [];
  const active = list.filter((s) => s.authStatus !== 'disabled' && s.authStatus !== 'blocked');
  const readinessVals = active.map((s) => Number(s.readiness) || 0);
  const avgReadiness = readinessVals.length
    ? Math.round(readinessVals.reduce((a, b) => a + b, 0) / readinessVals.length)
    : 0;
  const strong = active.filter((s) => (s.readiness || 0) >= 75).length;
  const mid = active.filter((s) => (s.readiness || 0) >= 50 && (s.readiness || 0) < 75).length;
  const weak = active.filter((s) => (s.readiness || 0) < 50).length;
  const atRisk = active
    .filter((s) => (s.readiness || 0) < 50)
    .sort((a, b) => (a.readiness || 0) - (b.readiness || 0))
    .slice(0, 8);
  const leaders = active
    .slice()
    .sort((a, b) => (b.readiness || 0) - (a.readiness || 0))
    .slice(0, 8);

  const gapMap = {};
  const strengthMap = {};
  active.forEach((s) => {
    const g = s.weakness && s.weakness !== '—' ? s.weakness : null;
    const st = s.strength && s.strength !== '—' ? s.strength : null;
    if (g) gapMap[g] = (gapMap[g] || 0) + 1;
    if (st) strengthMap[st] = (strengthMap[st] || 0) + 1;
  });
  const topGaps = Object.entries(gapMap)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const topStrengths = Object.entries(strengthMap)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    students: active.length,
    avgReadiness,
    strong,
    mid,
    weak,
    bands: { strong, mid, weak },
    pendingInvites: pendingCount,
    activePrograms: programsCount,
    atRisk,
    leaders,
    topGaps,
    topStrengths,
  };
}

export function listHodStudents(departmentId) {
  if (!departmentId) return [];
  return listStudents().filter((s) => String(s.departmentId) === String(departmentId));
}

export function listHodInvitations(departmentId) {
  if (!departmentId) return [];
  return listInvitations().filter((i) => String(i.departmentId) === String(departmentId));
}

export function listHodPrograms(departmentId) {
  if (!departmentId) return [];
  const students = listHodStudents(departmentId);
  const studentIds = new Set(students.map((s) => s.id));
  return listPrograms().filter((p) => {
    if (p.audience === 'all') return true;
    if (p.audience === 'department') return String(p.departmentId) === String(departmentId);
    if (p.audience === 'student') {
      return (p.studentIds || []).some((id) => studentIds.has(id));
    }
    return false;
  });
}

export function listHodDrives(departmentId) {
  if (!departmentId) return [];
  return listDrives().filter(
    (d) =>
      !d.departmentId ||
      String(d.departmentId) === String(departmentId) ||
      d.audience === 'all'
  );
}

export function getHodWorkspaceSnapshot(session = getOrgSession(), departments) {
  const department = resolveHodDepartment(session, departments);
  const departmentId = department?.id || '';
  const access = resolveHodAccess(session);
  const metrics = departmentId ? getHodMetrics(departmentId) : null;
  return {
    department,
    departmentId,
    access,
    metrics,
    students: listHodStudents(departmentId),
    invitations: listHodInvitations(departmentId),
    programs: listHodPrograms(departmentId),
    drives: listHodDrives(departmentId),
  };
}
