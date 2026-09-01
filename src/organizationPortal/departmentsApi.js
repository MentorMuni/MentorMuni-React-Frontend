/**
 * Departments + HOD lifecycle — API-first.
 * Local fallback only for demo sessions (tpo@demo.edu). Real sessions fail loud.
 */

import { orgApi, OrgApiError } from '../orgPortal/orgApi';
import { getOrgSession } from '../orgPortal/auth';
import { isDemoSession } from './demoAuth';
import * as local from './store';

function isMissingApi(err) {
  if (!(err instanceof OrgApiError)) return true;
  return err.status === 404 || err.status === 501 || err.status === 0;
}

function allowLocalFallback() {
  const session = getOrgSession();
  if (isDemoSession(session)) return true;
  // Safety: demo JWT without session.demo still must not hit the live API.
  try {
    const token = orgApi.getToken?.() || '';
    return String(token).startsWith('demo.');
  } catch {
    return false;
  }
}

function withSource(result, source) {
  return { ...result, source };
}

export function buildHodActivationUrl(token) {
  if (!token || typeof window === 'undefined') return '';
  return `${window.location.origin}/activate-hod?token=${encodeURIComponent(token)}`;
}

function normalizeHodStatus(raw) {
  const s = String(raw || '')
    .trim()
    .toLowerCase();
  if (!s || s === 'empty' || s === 'none' || s === 'null') return 'unassigned';
  if (s === 'pending' || s === 'invited' || s === 'invite_sent') return 'invited';
  if (s === 'active' || s === 'activated' || s === 'ready') return 'active';
  if (s === 'revoked' || s === 'inactive' || s === 'disabled') return 'revoked';
  return s;
}

function normalizeMentorHistoryEntry(row = {}) {
  return {
    id: row.id ?? row.event_id ?? `${row.at || row.created_at || ''}-${row.event || row.action || ''}`,
    at: row.at || row.created_at || row.createdAt || '',
    event: row.event || row.action || row.type || '',
    name: row.name || row.hod_name || row.hodName || '',
    email: row.email || row.hod_email || row.hodEmail || '',
    status: normalizeHodStatus(row.status || row.hod_status || row.hodStatus),
    reason: row.reason || '',
    replacedByEmail: row.replaced_by_email || row.replacedByEmail || '',
  };
}

/**
 * Normalize API / local department rows to the camelCase shape DepartmentsPage expects.
 */
export function normalizeDepartment(row = {}) {
  if (!row || typeof row !== 'object') return null;

  const hodEmail = String(row.hod_email ?? row.hodEmail ?? row.hod?.email ?? '').trim().toLowerCase();
  const hodName = String(row.hod_name ?? row.hodName ?? row.hod?.name ?? '').trim();
  const rawStatus =
    row.hod_status ?? row.hodStatus ?? row.hod?.status ?? (hodEmail ? 'invited' : 'unassigned');

  const historyRaw =
    row.mentor_history || row.mentorHistory || row.hod_history || row.history || [];

  const coordinatorEmail = String(
    row.coordinator_email ?? row.coordinatorEmail ?? row.coordinator?.email ?? ''
  )
    .trim()
    .toLowerCase();
  const coordinatorName = String(
    row.coordinator_name ?? row.coordinatorName ?? row.coordinator?.name ?? ''
  ).trim();
  const rawCoordStatus =
    row.coordinator_status ??
    row.coordinatorStatus ??
    row.coordinator?.status ??
    (coordinatorEmail ? 'invited' : 'unassigned');

  return {
    id: row.id ?? row.department_id ?? row.departmentId,
    name: row.name || row.department_name || '',
    code: String(row.code || row.department_code || '').trim().toUpperCase(),
    hodName,
    hodEmail,
    hodStatus: normalizeHodStatus(rawStatus),
    coordinatorName,
    coordinatorEmail,
    coordinatorStatus: normalizeHodStatus(rawCoordStatus),
    studentCount: Number(
      row.student_count ?? row.studentCount ?? row.students_count ?? row.studentsCount ?? 0
    ) || 0,
    mentorHistory: Array.isArray(historyRaw)
      ? historyRaw.map(normalizeMentorHistoryEntry)
      : [],
    activationToken:
      row.activation_token || row.activationToken || row.hod_activation_token || '',
    raw: row,
  };
}

function extractActivation(row = {}) {
  const token =
    row?.activation_token ||
    row?.activationToken ||
    row?.token ||
    row?.invite_token ||
    row?.setup_token ||
    '';
  const url =
    row?.activation_url ||
    row?.activationUrl ||
    row?.invite_url ||
    row?.setup_url ||
    row?.setupUrl ||
    (token ? buildHodActivationUrl(token) : '');

  const emailedRaw = row?.emailed ?? row?.email_sent ?? row?.invite_email_sent;
  const emailed = emailedRaw == null ? null : Boolean(emailedRaw);
  const emailSkipped = Boolean(row?.email_skipped);
  const emailDetail = row?.email_detail || row?.emailDetail || '';

  return {
    activationToken: token || '',
    activationUrl: url || '',
    emailed,
    emailSkipped,
    emailDetail,
  };
}

function activationResult(row, fallbackMessage, source, { mentorLabel = 'HOD' } = {}) {
  const dept = normalizeDepartment(row?.department || row) || row?.department || row;
  const { activationToken, activationUrl, emailed, emailSkipped, emailDetail } = extractActivation(
    row || {}
  );
  const who = mentorLabel || 'HOD';
  let message = row?.message || fallbackMessage;
  if (source === 'api') {
    if (emailed === true && !activationUrl) {
      message =
        row?.message ||
        `Invite email sent to the ${who}. Ask them to check inbox (and spam).`;
    } else if (emailed === true && activationUrl) {
      message =
        row?.message ||
        'Invite email sent. Keep the activation link below as a backup.';
    } else if (emailed === false || emailSkipped) {
      message =
        row?.message ||
        (emailDetail
          ? `Invite saved, but email failed (${emailDetail}). Copy the link and share it with the ${who}.`
          : `Invite saved, but email was not sent. Copy the activation link and share it with the ${who}.`);
    } else if (activationUrl) {
      message =
        row?.message ||
        `Invite created. Copy the activation link and share it with the ${who}.`;
    }
  }
  return withSource(
    {
      ok: true,
      department: dept,
      activationToken,
      activationUrl,
      emailed: emailed === true,
      emailUnknown: emailed == null,
      emailSkipped,
      emailDetail,
      message,
      mentorLabel: who,
    },
    source
  );
}

function friendlyMutateError(err, action = 'complete this action') {
  const status = err?.status;
  const code = String(err?.code || '').toUpperCase();
  const raw = String(err?.message || '').toLowerCase();

  // Locked contract codes (docs/tpo-hod-e2e-contract.md)
  if (code === 'HOD_EMAIL_CONFLICT') {
    return (
      err.message ||
      'This email is already a department mentor (or reserved) in this organization. Use a different email, or replace the existing mentor.'
    );
  }
  if (code === 'HOD_EMAIL_IN_USE') {
    return (
      err.message ||
      'This email is already a live mentor of another department. Use a different email.'
    );
  }
  if (code === 'HOD_NOT_FOUND' || code === 'COORDINATOR_NOT_FOUND') {
    return err.message || 'No mentor found for this action. Invite first, or refresh the page.';
  }
  if (code === 'HOD_ALREADY_ASSIGNED') {
    return (
      err.message ||
      'This department already has a HOD. Resend their invite, or Replace to assign someone new.'
    );
  }
  if (code === 'COORDINATOR_ALREADY_ASSIGNED') {
    return (
      err.message ||
      'This department already has a Placement Coordinator. Resend their invite, or Replace to assign someone new.'
    );
  }
  if (code === 'MENTOR_EMAIL_SLOT_CONFLICT') {
    return (
      err.message ||
      'This email is already used for the other mentor slot on this department. Use a different email.'
    );
  }
  if (code === 'DEPARTMENT_CODE_EXISTS' || /department code .+ already exists/i.test(raw)) {
    return (
      err.message ||
      'This department code is already added. Use a different code (e.g. CS-1, CS-2).'
    );
  }
  if (code === 'DEPARTMENT_HAS_STUDENTS') {
    return (
      err.message ||
      'Cannot delete this department while students are still assigned. Move or remove students first.'
    );
  }
  if (code === 'FORBIDDEN_ROLE' || code === 'FORBIDDEN' || status === 403) {
    return (
      err.message ||
      'You do not have permission for this action. Only the TPO can manage departments and mentor invites.'
    );
  }
  if (code === 'ACTIVATION_TOKEN_EXPIRED') {
    return err.message || 'This activation link has expired. Ask your TPO to resend the invite.';
  }
  if (
    code === 'TOKEN_INVALID' ||
    code === 'TOKEN_EXPIRED' ||
    code === 'TOKEN_MISSING' ||
    code === 'TOKEN_WRONG_SCOPE' ||
    status === 401
  ) {
    return 'Your session is invalid or expired. Sign out and sign in again, then retry.';
  }

  if (status === 409 || raw.includes('already') || raw.includes('duplicate') || raw.includes('unique')) {
    if (raw.includes('student')) {
      return (
        err.message ||
        'Cannot delete this department while students are still assigned. Move or remove students first.'
      );
    }
    return (
      err.message ||
      'This email is already used for a department mentor in this organization. Use a different email, or replace the existing mentor.'
    );
  }
  if (status === 400 && (raw.includes('email') || raw.includes('hod'))) {
    return err.message || 'Invalid HOD details. Check the name and email, then try again.';
  }
  return err?.message || `Unable to ${action}.`;
}

function apiUnavailableError(action) {
  return {
    ok: false,
    error: `Departments API is unavailable. Cannot ${action} until the server responds. (Local demo works only when signed in as the demo TPO.)`,
    source: 'unavailable',
  };
}

export async function fetchDepartments({ include = 'full' } = {}) {
  // Demo HOD/TPO use local store only — calling the real API with a fake token
  // returns 401 and previously auto-logged the user out.
  if (allowLocalFallback()) {
    return withSource({ ok: true, departments: local.listDepartments() }, 'local');
  }

  const mode = String(include || 'full').toLowerCase();
  const qs =
    mode === 'full' || mode === ''
      ? ''
      : `?include=${encodeURIComponent(mode === 'options' ? 'light' : mode)}`;
  const path = `/organizations/departments${qs}`;

  const parseList = (data) => {
    const list = Array.isArray(data) ? data : data?.departments || data?.items || [];
    return list.map(normalizeDepartment).filter(Boolean);
  };

  let lastErr = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const data = await orgApi.get(path);
      return withSource({ ok: true, departments: parseList(data) }, 'api');
    } catch (err) {
      lastErr = err;
      const retryable =
        err instanceof OrgApiError &&
        (err.status === 0 || err.status >= 500 || err.status === 429);
      if (!retryable || attempt === 1) break;
      await new Promise((resolve) => window.setTimeout(resolve, 350));
    }
  }

  const err = lastErr;
  if (err instanceof OrgApiError && !isMissingApi(err)) {
    return {
      ok: false,
      error: err.message || 'Failed to load departments.',
      departments: [],
      source: 'error',
    };
  }
  return {
    ok: false,
    error: 'Unable to load departments from the server.',
    departments: [],
    source: 'unavailable',
  };
}

/** Dropdown / filter rows — skips mentors + history on the API. */
export async function fetchDepartmentOptions() {
  return fetchDepartments({ include: 'light' });
}

function saveDepartmentLocal(input) {
  local.upsertDepartment(input);
  const dept = local.listDepartments().find(
    (d) =>
      (input.id && d.id === input.id) ||
      (!input.id && d.code === String(input.code || '').trim().toUpperCase())
  );
  return withSource({ ok: true, department: dept }, 'local');
}

export async function saveDepartment(input) {
  // Demo sessions must never call the real API (fake demo.* JWT → "Invalid token.").
  if (allowLocalFallback()) {
    try {
      return saveDepartmentLocal(input);
    } catch (e) {
      return { ok: false, error: e.message || 'Unable to save department.' };
    }
  }

  try {
    const path = input.id
      ? `/organizations/departments/${input.id}`
      : '/organizations/departments';
    const method = input.id ? 'put' : 'post';
    const row = await orgApi[method](path, {
      name: input.name,
      code: String(input.code || '')
        .trim()
        .toUpperCase(),
    });
    return withSource(
      { ok: true, department: normalizeDepartment(row?.department || row) || row },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: friendlyMutateError(err, 'save department'), status: err.status };
    }
    return apiUnavailableError('save department');
  }
}

export async function deleteDepartment(id) {
  if (allowLocalFallback()) {
    local.removeDepartment(id);
    return withSource({ ok: true }, 'local');
  }

  try {
    await orgApi.delete(`/organizations/departments/${id}`);
    return withSource({ ok: true }, 'api');
  } catch (err) {
    if (!isMissingApi(err)) {
      return {
        ok: false,
        error: friendlyMutateError(err, 'delete department'),
        status: err.status,
        code: err.code,
      };
    }
    return apiUnavailableError('delete department');
  }
}

export async function inviteDepartmentHod(departmentId, { name, email } = {}) {
  if (allowLocalFallback()) {
    try {
      const result = local.inviteHod(departmentId, { name, email });
      return withSource(
        {
          ok: true,
          department: result.department,
          activationToken: result.activationToken,
          activationUrl: result.activationUrl,
          emailed: false,
          emailUnknown: false,
          message:
            'Demo invite ready (not emailed). Copy the activation link and open it to set the HOD password.',
        },
        'local'
      );
    } catch (e) {
      return { ok: false, error: e.message || 'Unable to invite HOD.' };
    }
  }

  try {
    const row = await orgApi.post(`/organizations/departments/${departmentId}/hod`, {
      name,
      email,
    });
    return activationResult(row, 'HOD invite sent.', 'api', { mentorLabel: 'HOD' });
  } catch (err) {
    if (!isMissingApi(err)) {
      return {
        ok: false,
        error: friendlyMutateError(err, 'invite HOD'),
        status: err.status,
        code: err.code,
      };
    }
    return apiUnavailableError('invite HOD');
  }
}

export async function reinviteDepartmentHod(departmentId) {
  if (allowLocalFallback()) {
    try {
      const result = local.reinviteHod(departmentId);
      return withSource(
        {
          ok: true,
          department: result.department,
          activationToken: result.activationToken,
          activationUrl: result.activationUrl,
          emailed: false,
          message: 'Demo: fresh activation link generated (not emailed).',
        },
        'local'
      );
    } catch (e) {
      return { ok: false, error: e.message || 'Unable to reinvite HOD.' };
    }
  }

  try {
    const row = await orgApi.post(`/organizations/departments/${departmentId}/hod/reinvite`);
    return activationResult(row, 'HOD reinvited.', 'api', { mentorLabel: 'HOD' });
  } catch (err) {
    if (!isMissingApi(err)) {
      return {
        ok: false,
        error: friendlyMutateError(err, 'resend HOD invite'),
        status: err.status,
        code: err.code,
      };
    }
    return apiUnavailableError('resend HOD invite');
  }
}

export async function revokeDepartmentHod(departmentId, reason = '') {
  if (allowLocalFallback()) {
    try {
      const department = local.revokeHod(departmentId, reason);
      return withSource(
        { ok: true, department, message: 'HOD access revoked. Students stay in the department.' },
        'local'
      );
    } catch (e) {
      return { ok: false, error: e.message || 'Unable to revoke HOD.' };
    }
  }

  try {
    const row = await orgApi.post(`/organizations/departments/${departmentId}/hod/revoke`, {
      reason,
    });
    return withSource(
      {
        ok: true,
        department: normalizeDepartment(row?.department || row) || row,
        message: row?.message || 'HOD access revoked.',
      },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return {
        ok: false,
        error: friendlyMutateError(err, 'revoke HOD'),
        status: err.status,
      };
    }
    return apiUnavailableError('revoke HOD');
  }
}

export async function replaceDepartmentHod(departmentId, { name, email, reason = '' }) {
  if (allowLocalFallback()) {
    try {
      const result = local.replaceHod(departmentId, { name, email, reason });
      return withSource(
        {
          ok: true,
          department: result.department,
          activationToken: result.activationToken,
          activationUrl: result.activationUrl,
          emailed: false,
          message: 'Demo: previous HOD revoked. Share the new activation link.',
        },
        'local'
      );
    } catch (e) {
      return { ok: false, error: e.message || 'Unable to replace HOD.' };
    }
  }

  try {
    const row = await orgApi.post(`/organizations/departments/${departmentId}/hod/replace`, {
      name,
      email,
      reason,
    });
    return activationResult(row, 'HOD replaced. New invite sent.', 'api', { mentorLabel: 'HOD' });
  } catch (err) {
    if (!isMissingApi(err)) {
      return {
        ok: false,
        error: friendlyMutateError(err, 'replace HOD'),
        status: err.status,
        code: err.code,
      };
    }
    return apiUnavailableError('replace HOD');
  }
}

export async function inviteDepartmentCoordinator(departmentId, { name, email } = {}) {
  if (allowLocalFallback()) {
    try {
      const result = local.inviteCoordinator(departmentId, { name, email });
      return withSource(
        {
          ok: true,
          department: result.department,
          activationToken: result.activationToken,
          activationUrl: result.activationUrl,
          emailed: false,
          emailUnknown: false,
          message:
            'Demo invite ready (not emailed). Copy the activation link and open it to set the Placement Coordinator password.',
        },
        'local'
      );
    } catch (e) {
      return { ok: false, error: e.message || 'Unable to invite Placement Coordinator.' };
    }
  }

  try {
    const row = await orgApi.post(`/organizations/departments/${departmentId}/coordinator`, {
      name,
      email,
    });
    return activationResult(row, 'Placement Coordinator invite sent.', 'api', { mentorLabel: 'Placement Coordinator' });
  } catch (err) {
    if (!isMissingApi(err)) {
      return {
        ok: false,
        error: friendlyMutateError(err, 'invite Placement Coordinator'),
        status: err.status,
        code: err.code,
      };
    }
    return apiUnavailableError('invite Placement Coordinator');
  }
}

export async function reinviteDepartmentCoordinator(departmentId) {
  if (allowLocalFallback()) {
    try {
      const result = local.reinviteCoordinator(departmentId);
      return withSource(
        {
          ok: true,
          department: result.department,
          activationToken: result.activationToken,
          activationUrl: result.activationUrl,
          emailed: false,
          message: 'Demo: fresh Placement Coordinator activation link generated (not emailed).',
        },
        'local'
      );
    } catch (e) {
      return { ok: false, error: e.message || 'Unable to reinvite Placement Coordinator.' };
    }
  }

  try {
    const row = await orgApi.post(
      `/organizations/departments/${departmentId}/coordinator/reinvite`
    );
    return activationResult(row, 'Placement Coordinator reinvited.', 'api', { mentorLabel: 'Placement Coordinator' });
  } catch (err) {
    if (!isMissingApi(err)) {
      return {
        ok: false,
        error: friendlyMutateError(err, 'resend Placement Coordinator invite'),
        status: err.status,
        code: err.code,
      };
    }
    return apiUnavailableError('resend Placement Coordinator invite');
  }
}

export async function revokeDepartmentCoordinator(departmentId, reason = '') {
  if (allowLocalFallback()) {
    try {
      const department = local.revokeCoordinator(departmentId, reason);
      return withSource(
        {
          ok: true,
          department,
          message: 'Placement Coordinator access revoked. Students stay in the department.',
        },
        'local'
      );
    } catch (e) {
      return { ok: false, error: e.message || 'Unable to revoke Placement Coordinator.' };
    }
  }

  try {
    const row = await orgApi.post(`/organizations/departments/${departmentId}/coordinator/revoke`, {
      reason,
    });
    return withSource(
      {
        ok: true,
        department: normalizeDepartment(row?.department || row) || row,
        message: row?.message || 'Placement Coordinator access revoked.',
      },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return {
        ok: false,
        error: friendlyMutateError(err, 'revoke Placement Coordinator'),
        status: err.status,
      };
    }
    return apiUnavailableError('revoke Placement Coordinator');
  }
}

export async function replaceDepartmentCoordinator(departmentId, { name, email, reason = '' }) {
  if (allowLocalFallback()) {
    try {
      const result = local.replaceCoordinator(departmentId, { name, email, reason });
      return withSource(
        {
          ok: true,
          department: result.department,
          activationToken: result.activationToken,
          activationUrl: result.activationUrl,
          emailed: false,
          message: 'Demo: previous Placement Coordinator revoked. Share the new activation link.',
        },
        'local'
      );
    } catch (e) {
      return { ok: false, error: e.message || 'Unable to replace Placement Coordinator.' };
    }
  }

  try {
    const row = await orgApi.post(`/organizations/departments/${departmentId}/coordinator/replace`, {
      name,
      email,
      reason,
    });
    return activationResult(row, 'Placement Coordinator replaced. New invite sent.', 'api', { mentorLabel: 'Placement Coordinator' });
  } catch (err) {
    if (!isMissingApi(err)) {
      return {
        ok: false,
        error: friendlyMutateError(err, 'replace Placement Coordinator'),
        status: err.status,
        code: err.code,
      };
    }
    return apiUnavailableError('replace Placement Coordinator');
  }
}

