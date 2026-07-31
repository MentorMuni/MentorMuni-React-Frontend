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
        hodEmail: byId.hodEmail || session?.email || '',
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
      (d) => String(d.hodEmail || '').trim().toLowerCase() === email
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
