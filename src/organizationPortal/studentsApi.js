/**
 * Student enrollment — API-first with local store fallback.
 *
 * Live (migration 0005):
 *   GET    /organizations/students?department_id=
 *   GET    /organizations/students/invites?status=pending
 *   POST   /organizations/students/invite          { emails[], department_id }
 *   POST   /organizations/students                 manual { name, email, department_id, roll_number?, batch_year? }
 *   POST   /organizations/students/import          { department_id, rows[] and/or csv_text, send_invite_email? }
 *   POST   /organizations/students/invites/:id/approve
 *   POST   /organizations/students/invites/:id/reject
 *   PATCH  /organizations/students/:id             { department_id?, status? }
 *   POST   /students/register                      public self-register
 *   POST   /auth/activate-student                  { token, new_password }
 */

import { orgApi, OrgApiError } from '../orgPortal/orgApi';
import * as local from './store';
import { buildStudentSetupUrl } from '../studentPortal/localStudentAuth';

function isMissingApi(err) {
  if (!(err instanceof OrgApiError)) return true;
  return err.status === 404 || err.status === 501 || err.status === 0;
}

function withSource(result, source) {
  return { ...result, source };
}

function asList(data, ...keys) {
  if (Array.isArray(data)) return data;
  for (const k of keys) {
    if (Array.isArray(data?.[k])) return data[k];
  }
  return [];
}

/** Normalize API student → FE roster shape */
export function normalizeStudent(row = {}) {
  return {
    id: row.id ?? row.student_id,
    name: row.name || '',
    email: String(row.email || '').toLowerCase(),
    collegeId: row.roll_number || row.college_id || row.username || row.collegeId || '',
    batchYear: row.batch_year != null ? String(row.batch_year) : row.batchYear || '',
    departmentId: row.department_id ?? row.departmentId ?? '',
    departmentName: row.department_name || row.departmentName || row.department?.name || '',
    status: String(row.status || 'active').toLowerCase(),
    authStatus: mapAuthStatus(row.status || row.auth_status || row.authStatus),
    readiness: Number(row.readiness ?? row.readiness_score ?? 0) || 0,
    mockScore: Number(row.mock_score ?? row.mockScore ?? 0) || 0,
    activities: Number(row.activities ?? 0) || 0,
    strength: row.strength || '—',
    weakness: row.weakness || '—',
    source: row.source || row.created_via || 'api',
    setupUrl: row.setup_url || row.setupUrl || '',
    createdAt: row.created_at || row.createdAt || '',
    raw: row,
  };
}

function mapAuthStatus(status) {
  const s = String(status || '').toUpperCase();
  // PENDING belongs in the invite queue — not "set password" on roster
  if (s === 'PENDING') return 'pending';
  if (s === 'INVITED' || s === 'NEEDS_PASSWORD') return 'needs_password';
  if (s === 'ACTIVE' || s === 'READY') return 'ready';
  if (s === 'BLOCKED' || s === 'DISABLED') return 'blocked';
  if (s === 'REJECTED') return 'disabled';
  return String(status || 'ready').toLowerCase() === 'needs_password' ? 'needs_password' : 'ready';
}

/** Normalize API invite → FE queue shape */
export function normalizeInvite(row = {}) {
  return {
    id: row.id ?? row.invite_id,
    email: String(row.email || '').toLowerCase(),
    name: row.name || '',
    collegeId: row.roll_number || row.college_id || row.collegeId || '',
    batchYear: row.batch_year != null ? String(row.batch_year) : row.batchYear || '',
    phone: row.phone || row.contact || row.mobile || '',
    departmentId: row.department_id ?? row.departmentId ?? '',
    departmentName: row.department_name || row.departmentName || '',
    source: row.source || (row.self_registered ? 'self_register' : 'invite'),
    status: String(row.status || 'pending').toLowerCase(),
    createdAt: row.created_at || row.createdAt || '',
    decidedAt: row.decided_at || row.decidedAt || '',
    setupUrl: row.setup_url || row.setupUrl || row.activation_url || '',
    activationToken: row.activation_token || row.token || '',
    raw: row,
  };
}

function extractSetupUrl(row) {
  const token = row?.activation_token || row?.token || row?.setup_token;
  const url =
    row?.setup_url ||
    row?.setupUrl ||
    row?.activation_url ||
    row?.password_setup_url ||
    (token ? buildStudentSetupUrl(token) : '');
  return { setupUrl: url, activationToken: token || '' };
}

/* ── Reads ───────────────────────────────────────────────── */

export async function fetchStudents({ departmentId } = {}) {
  try {
    const qs = departmentId
      ? `?department_id=${encodeURIComponent(departmentId)}`
      : '';
    const data = await orgApi.get(`/organizations/students${qs}`);
    const list = asList(data, 'students', 'items', 'results').map(normalizeStudent);
    return withSource({ ok: true, students: list }, 'api');
  } catch (err) {
    if (!isMissingApi(err)) {
      return {
        ok: false,
        error: err.message || 'Failed to load students.',
        students: filterLocalStudents(departmentId),
      };
    }
    return withSource({ ok: true, students: filterLocalStudents(departmentId) }, 'local');
  }
}

function filterLocalStudents(departmentId) {
  const all = local.listStudents();
  if (!departmentId) return all;
  return all.filter((s) => String(s.departmentId) === String(departmentId));
}

export async function fetchStudentInvites({ status = 'pending', departmentId } = {}) {
  try {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (departmentId) params.set('department_id', departmentId);
    const qs = params.toString() ? `?${params}` : '';
    const data = await orgApi.get(`/organizations/students/invites${qs}`);
    let list = asList(data, 'invites', 'invitations', 'items', 'results').map(normalizeInvite);
    if (departmentId) {
      list = list.filter((i) => String(i.departmentId) === String(departmentId));
    }
    if (status) {
      list = list.filter((i) => i.status === String(status).toLowerCase());
    }
    return withSource({ ok: true, invitations: list }, 'api');
  } catch (err) {
    if (!isMissingApi(err)) {
      return {
        ok: false,
        error: err.message || 'Failed to load invites.',
        invitations: filterLocalInvites(status, departmentId),
      };
    }
    return withSource(
      { ok: true, invitations: filterLocalInvites(status, departmentId) },
      'local'
    );
  }
}

function filterLocalInvites(status, departmentId) {
  let list = local.listInvitations();
  if (status) list = list.filter((i) => i.status === String(status).toLowerCase());
  if (departmentId) {
    list = list.filter((i) => String(i.departmentId) === String(departmentId));
  }
  return list;
}

/* ── Writes ──────────────────────────────────────────────── */

export async function inviteStudentsApi({ emails, departmentId, autoEnroll = false }) {
  const emailList = Array.isArray(emails)
    ? emails
    : String(emails || '')
        .split(/[\n,;]+/)
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

  try {
    const data = await orgApi.post('/organizations/students/invite', {
      emails: emailList,
      department_id: departmentId || undefined,
      auto_enroll: autoEnroll || undefined,
      skip_approval: autoEnroll || undefined,
    });
    const added =
      data?.created ??
      data?.added ??
      data?.count ??
      asList(data, 'invites', 'invitations').length ??
      emailList.length;
    const { setupUrl, activationToken } = extractSetupUrl(data || {});
    return withSource(
      {
        ok: true,
        added: Number(added) || emailList.length,
        setupUrl,
        activationToken,
        emailed: Boolean(data?.emailed ?? data?.email_sent ?? false),
        message:
          data?.message ||
          (autoEnroll
            ? 'Invites sent. Students are on the roster — they set a password from email/link.'
            : ''),
      },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to queue invites.' };
    }
    const res = local.inviteStudents({
      emails: emailList.join('\n'),
      departmentId,
      autoEnroll,
    });
    return withSource(
      {
        ok: true,
        added: res.added || 0,
        message: autoEnroll
          ? 'Demo: students added to roster (use Resend link for set-password).'
          : undefined,
      },
      'local'
    );
  }
}

export async function addStudentManualApi({
  name,
  email,
  collegeId,
  batchYear,
  departmentId,
  autoEnroll = false,
}) {
  try {
    const data = await orgApi.post('/organizations/students', {
      name: String(name || '').trim(),
      email: String(email || '').trim().toLowerCase(),
      department_id: departmentId,
      roll_number: collegeId || undefined,
      batch_year: batchYear ? Number(batchYear) || batchYear : undefined,
      auto_enroll: autoEnroll || undefined,
      skip_approval: autoEnroll || undefined,
    });
    const student = data?.student ? normalizeStudent(data.student) : null;
    const invitation =
      !student && (data?.invite || data?.invitation || (!autoEnroll && data))
        ? normalizeInvite(data?.invite || data?.invitation || data)
        : null;
    const { setupUrl, activationToken } = extractSetupUrl(data || {});
    const onRoster = Boolean(student) || autoEnroll;
    return withSource(
      {
        ok: true,
        invitation: onRoster ? null : invitation,
        student,
        setupUrl,
        activationToken,
        emailed: Boolean(data?.emailed ?? data?.email_sent ?? false),
        message:
          data?.message ||
          (onRoster
            ? 'Student added to roster. They get a set-password email when mail works.'
            : 'Student queued for approval.'),
      },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to add student.' };
    }
    return local.addStudentManual({
      name,
      email,
      collegeId,
      batchYear,
      departmentId,
      autoEnroll,
    });
  }
}

export async function importStudentsApi({
  departmentId,
  csvText,
  rows,
  sendInviteEmail = true,
  autoEnroll = false,
}) {
  try {
    const payload = {
      department_id: departmentId,
      send_invite_email: sendInviteEmail,
      auto_enroll: autoEnroll || undefined,
      skip_approval: autoEnroll || undefined,
    };
    if (csvText) payload.csv_text = csvText;
    if (rows?.length) payload.rows = rows;
    if (!payload.csv_text && !payload.rows) {
      payload.csv_text = csvText || '';
    }
    const data = await orgApi.post('/organizations/students/import', payload);
    return withSource(
      {
        ok: true,
        added: Number(data?.created ?? data?.added ?? 0) || 0,
        skipped: Number(data?.skipped ?? data?.updated ?? 0) || 0,
        errors: data?.errors || [],
        message:
          data?.message ||
          (autoEnroll
            ? 'Import complete. Students are on the roster.'
            : ''),
      },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'CSV import failed.' };
    }
    return local.importStudentsFromCsv({ csvText, departmentId, autoEnroll });
  }
}

export async function approveStudentInvite(id) {
  try {
    const data = await orgApi.post(`/organizations/students/invites/${id}/approve`);
    const { setupUrl, activationToken } = extractSetupUrl(data || {});
    const emailed = Boolean(
      data?.emailed ?? data?.email_sent ?? data?.invite_email_sent ?? false
    );
    let message = data?.message || '';
    if (!message) {
      if (setupUrl) {
        message = emailed
          ? 'Approved. Email sent — copy link below if needed.'
          : 'Approved. Copy the set-password link below (email may not have sent).';
      } else if (emailed) {
        message = 'Approved. Set-password email sent to the student.';
      } else {
        message =
          'Approved. No set-password link returned — ask the student to check email, or use Password link on the roster.';
      }
    }
    return withSource(
      {
        ok: true,
        decision: 'approve',
        setupUrl,
        activationToken,
        emailed,
        student: data?.student ? normalizeStudent(data.student) : null,
        message,
      },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to approve.' };
    }
    return withSource(local.decideInvitation(id, 'approve'), 'local');
  }
}

export async function rejectStudentInvite(id) {
  try {
    const data = await orgApi.post(`/organizations/students/invites/${id}/reject`);
    return withSource(
      {
        ok: true,
        decision: 'reject',
        message: data?.message || 'Registration rejected.',
      },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to reject.' };
    }
    return withSource(local.decideInvitation(id, 'reject'), 'local');
  }
}

export async function patchStudent(id, patch = {}) {
  try {
    const body = {};
    if (patch.departmentId != null) body.department_id = patch.departmentId;
    if (patch.status != null) {
      // Contract: DISABLED / Inactive → BLOCKED on API
      const s = String(patch.status).toUpperCase();
      body.status =
        s === 'DISABLED' || s === 'INACTIVE' || s === 'BLOCKED' ? 'BLOCKED' : s;
    }
    if (patch.name != null) body.name = patch.name;
    if (patch.collegeId != null) body.roll_number = patch.collegeId;
    if (patch.batchYear != null) {
      body.batch_year = patch.batchYear ? Number(patch.batchYear) || patch.batchYear : null;
    }
    const data = await orgApi.patch(`/organizations/students/${id}`, body);
    return withSource({ ok: true, student: normalizeStudent(data?.student || data) }, 'api');
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to update student.' };
    }
    try {
      const student = local.patchStudentLocal(id, patch);
      if (student) return withSource({ ok: true, student }, 'local');
    } catch (e) {
      return { ok: false, error: e?.message || 'Unable to update student.' };
    }
    return { ok: false, error: 'Student update API unavailable.' };
  }
}

/**
 * Resend set-password for a roster student.
 * POST /organizations/students/{id}/resend-invite
 * Aliases: resend-setup, resend-activation
 *
 * PENDING → same as approve (email / setup_url)
 * INVITED / ACTIVE / BLOCKED → new token + email
 * REJECTED → 400
 */
export async function resendStudentSetupLink(studentOrInviteId, { asInvite = false } = {}) {
  if (asInvite) {
    return approveStudentInvite(studentOrInviteId);
  }

  const id = encodeURIComponent(studentOrInviteId);
  const paths = [
    `/organizations/students/${id}/resend-invite`,
    `/organizations/students/${id}/resend-setup`,
    `/organizations/students/${id}/resend-activation`,
  ];

  let sawMissing = false;
  let lastErr = null;

  for (const path of paths) {
    try {
      const data = await orgApi.post(path);
      const { setupUrl, activationToken } = extractSetupUrl(data || {});
      const emailed = Boolean(data?.emailed ?? data?.email_sent ?? false);
      const message =
        data?.message ||
        (setupUrl
          ? emailed
            ? 'Email sent — copy link below if needed.'
            : 'Copy the set-password link below (email may not have sent).'
          : emailed
            ? 'Set-password email resent.'
            : 'Resend requested.');

      return withSource(
        {
          ok: true,
          setupUrl,
          activationToken,
          emailed,
          message,
          student: data?.student ? normalizeStudent(data.student) : null,
        },
        'api'
      );
    } catch (err) {
      lastErr = err;
      // REJECTED / validation — surface immediately
      if (err instanceof OrgApiError && err.status === 400) {
        return {
          ok: false,
          error: err.message || 'Cannot resend for this student status.',
        };
      }
      if (isMissingApi(err) || err.status === 404) {
        sawMissing = true;
        continue;
      }
      return { ok: false, error: err.message || 'Unable to resend link.' };
    }
  }

  // Local only when every endpoint is absent (demo / pre-deploy)
  if (sawMissing) {
    const localRes = local.regenerateStudentSetupLink(studentOrInviteId);
    if (localRes?.ok && localRes.setupUrl) {
      return withSource(
        {
          ...localRes,
          emailed: false,
          message: localRes.message || 'Local set-password link (API resend not available).',
        },
        'local'
      );
    }
  }

  return {
    ok: false,
    error:
      lastErr?.message ||
      'Unable to resend set-password link. Redeploy API or check student status.',
  };
}

/* ── Public student auth ─────────────────────────────────── */

/**
 * Departments for student self-enroll (no org JWT).
 * Preferred: GET /organizations/colleges/{CODE}/departments
 * Fallback:  GET /organizations/departments?organization_code={CODE}
 * Local only when both endpoints are missing — empty API list is authoritative.
 */
export async function fetchPublicDepartments(organizationCode) {
  const code = String(organizationCode || '').trim().toUpperCase();
  if (!code) {
    return { ok: false, error: 'Select your college first.', departments: [] };
  }

  const paths = [
    `/organizations/colleges/${encodeURIComponent(code)}/departments`,
    `/organizations/departments?organization_code=${encodeURIComponent(code)}`,
  ];

  let sawMissing = false;

  for (const path of paths) {
    try {
      const data = await orgApi.get(path, { auth: false });
      const list = asList(data, 'departments', 'items', 'results').map((d) => ({
        id: d.id ?? d.department_id,
        name: d.name || '',
        code: d.code || '',
      }));
      // Empty list is still a live API answer (e.g. MEDICAPS with 0 active depts).
      return withSource(
        {
          ok: true,
          departments: list,
          error: list.length
            ? ''
            : 'No active departments for this college yet. Ask your HOD / TPO to add one.',
        },
        'api'
      );
    } catch (err) {
      if (isMissingApi(err) || err.status === 401 || err.status === 403) {
        sawMissing = true;
        continue;
      }
      return {
        ok: false,
        error: err.message || 'Unable to load departments.',
        departments: [],
      };
    }
  }

  if (sawMissing) {
    const profile = local.getOrgPublicProfile(code);
    if (profile.ok && profile.departments?.length) {
      return withSource({ ok: true, departments: profile.departments }, 'local');
    }
  }

  return withSource(
    {
      ok: true,
      departments: [],
      error: 'No departments listed for this college yet. Ask your HOD to create one.',
    },
    sawMissing ? 'local' : 'api'
  );
}

export async function registerStudentPublic(payload) {
  try {
    const body = {
      name: payload.name,
      email: String(payload.email || '').trim().toLowerCase(),
      organization_code: String(payload.orgCode || '').trim().toUpperCase(),
      department_id: payload.departmentId,
      roll_number: payload.collegeId || undefined,
      batch_year: payload.batchYear ? Number(payload.batchYear) || payload.batchYear : undefined,
    };
    if (payload.password) body.password = payload.password;
    if (payload.phone || payload.contact) {
      body.phone = String(payload.phone || payload.contact || '').trim();
      body.contact = body.phone;
    }
    const data = await orgApi.post('/students/register', body, { auth: false });
    return withSource(
      {
        ok: true,
        message: data?.message || 'Submitted for campus approval.',
        invitation: data?.invite || data?.invitation || null,
      },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to register.' };
    }
    return local.submitStudentSelfRegistration(payload);
  }
}

export async function activateStudentAccount({ token, newPassword }) {
  try {
    const data = await orgApi.post(
      '/auth/activate-student',
      { token, new_password: newPassword },
      { auth: false }
    );
    return withSource(
      {
        ok: true,
        message: data?.message || 'Password saved. You can sign in now.',
        email: data?.email || '',
      },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to set password.' };
    }
    // Local token fallback
    const { consumePasswordSetupToken } = await import('../studentPortal/localStudentAuth');
    const localRes = consumePasswordSetupToken(token, newPassword);
    if (localRes.ok) {
      local.markStudentPasswordReady(localRes.credential?.studentId);
    }
    return withSource(localRes, 'local');
  }
}

export async function requestStudentPasswordResetApi({ orgCode, userId }) {
  // Prefer standard forgot-password if backend has it
  try {
    const id = String(userId || '').trim();
    const body = {
      organization_code: String(orgCode || '').trim().toUpperCase(),
    };
    if (id.includes('@')) body.email = id.toLowerCase();
    else body.username = id;

    const data = await orgApi.post('/auth/forgot-password', body, { auth: false });
    const { setupUrl, activationToken } = extractSetupUrl(data || {});
    return withSource(
      {
        ok: true,
        setupUrl,
        activationToken,
        emailed: Boolean(data?.emailed ?? data?.email_sent ?? !setupUrl),
        message: data?.message || 'If an account exists, a reset email was sent.',
        email: data?.email || '',
        delivery: setupUrl ? 'link' : 'email',
      },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      // Don't leak existence on 404-style responses if backend returns generic message
      return { ok: false, error: err.message || 'Unable to start password reset.' };
    }
    return withSource(local.requestStudentPasswordReset({ orgCode, userId }), 'local');
  }
}

export function getRegistrationLink(departmentId) {
  return local.getStudentRegistrationLink(departmentId);
}
