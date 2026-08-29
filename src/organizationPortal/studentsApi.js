/**
 * Student enrollment — API-first with local store fallback.
 * Demo sessions (tpo@demo.edu) never call the live API with a fake demo.* JWT.
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
import { getOrgSession } from '../orgPortal/auth';
import { isDemoSession, DEMO_ORG } from './demoAuth';
import * as local from './store';
import { buildStudentSetupUrl } from '../studentPortal/localStudentAuth';

function isMissingApi(err) {
  if (!(err instanceof OrgApiError)) return true;
  return err.status === 404 || err.status === 501 || err.status === 0;
}

/** Demo TPO/HOD must not hit Railway with a fake demo.* Bearer (→ “Invalid token”). */
function allowLocalFallback() {
  const session = getOrgSession();
  if (isDemoSession(session)) return true;
  try {
    const token = orgApi.getToken?.() || '';
    return String(token).startsWith('demo.');
  } catch {
    return false;
  }
}

function authErrorMessage(err, fallback) {
  const code = String(err?.code || err?.body?.code || '').toUpperCase();
  const status = err?.status;
  if (
    code === 'TOKEN_INVALID' ||
    code === 'TOKEN_EXPIRED' ||
    code === 'TOKEN_MISSING' ||
    code === 'TOKEN_WRONG_SCOPE' ||
    status === 401
  ) {
    return 'Your session is invalid or expired. Sign out and sign in again, then retry.';
  }
  return err?.message || fallback;
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
    phone: row.phone || row.contact || row.mobile || '',
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
  if (allowLocalFallback()) {
    return withSource({ ok: true, students: filterLocalStudents(departmentId) }, 'local');
  }
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
        error: authErrorMessage(err, 'Failed to load students.'),
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
  if (allowLocalFallback()) {
    return withSource(
      { ok: true, invitations: filterLocalInvites(status, departmentId) },
      'local'
    );
  }
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
        error: authErrorMessage(err, 'Failed to load invites.'),
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

  if (allowLocalFallback()) {
    const res = local.inviteStudents({
      emails: emailList.join('\n'),
      departmentId,
      autoEnroll,
    });
    return withSource(
      {
        ok: true,
        added: res.added || 0,
        setupUrl: res.setupUrl || '',
        message:
          res.message ||
          (autoEnroll
            ? 'Students added to roster. Copy the set-password link below (demo — no email).'
            : 'Invites queued for approval.'),
      },
      'local'
    );
  }

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
      return { ok: false, error: authErrorMessage(err, 'Unable to queue invites.') };
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
        setupUrl: res.setupUrl || '',
        message:
          res.message ||
          (autoEnroll
            ? 'Students added to roster. Copy the set-password link below.'
            : undefined),
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
  if (allowLocalFallback()) {
    const res = local.addStudentManual({
      name,
      email,
      collegeId,
      batchYear,
      departmentId,
      autoEnroll,
    });
    return withSource(
      res.ok
        ? {
            ...res,
            message:
              res.message ||
              (autoEnroll
                ? 'Student added to roster. Copy the set-password link below (demo — no email).'
                : 'Student queued for approval.'),
          }
        : res,
      'local'
    );
  }

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
      return { ok: false, error: authErrorMessage(err, 'Unable to add student.') };
    }
    return withSource(
      local.addStudentManual({
        name,
        email,
        collegeId,
        batchYear,
        departmentId,
        autoEnroll,
      }),
      'local'
    );
  }
}

export async function importStudentsApi({
  departmentId,
  csvText,
  rows,
  sendInviteEmail = true,
  autoEnroll = false,
}) {
  if (allowLocalFallback()) {
    const res = local.importStudentsFromCsv({ csvText, departmentId, autoEnroll });
    return withSource(res, 'local');
  }

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
      return { ok: false, error: authErrorMessage(err, 'CSV import failed.') };
    }
    return withSource(
      local.importStudentsFromCsv({ csvText, departmentId, autoEnroll }),
      'local'
    );
  }
}

/**
 * Approve pending invite → roster + set-password email to student.
 * POST /organizations/students/invites/:id/approve
 * Body: { send_email: true }
 * Response (preferred): { emailed, email_sent?, setup_url?, activation_token?, student?, message? }
 */
export async function approveStudentInvite(id) {
  if (allowLocalFallback()) {
    const res = local.decideInvitation(id, 'approve');
    return withSource(
      {
        ...res,
        emailed: false,
        emailSkipped: true,
        message:
          res.message ||
          (res.setupUrl
            ? 'Approved (demo). Email is not sent in demo — copy the set-password link and share it with the student.'
            : 'Approved (demo). Email is not sent in demo mode.'),
      },
      'local'
    );
  }

  try {
    const data = await orgApi.post(`/organizations/students/invites/${id}/approve`, {
      send_email: true,
      notify_student: true,
    });
    const { setupUrl, activationToken } = extractSetupUrl(data || {});
    const emailedRaw = data?.emailed ?? data?.email_sent ?? data?.invite_email_sent;
    const emailed = emailedRaw == null ? null : Boolean(emailedRaw);
    const studentEmail =
      data?.student?.email || data?.email || data?.invite?.email || data?.invitation?.email || '';

    let message = data?.message || '';
    if (!message) {
      if (emailed === true) {
        message = studentEmail
          ? `Approved. Set-password email sent to ${studentEmail}.`
          : 'Approved. Set-password email sent to the student.';
        if (setupUrl) message += ' Copy link below if they need it again.';
      } else if (emailed === false) {
        message = setupUrl
          ? 'Approved, but email failed to send. Copy the set-password link below and share it.'
          : 'Approved, but email failed to send. Use Resend link on the roster.';
      } else if (setupUrl) {
        message =
          'Approved. Copy the set-password link below (confirm whether email was sent on the server).';
      } else {
        message =
          'Approved. Ask the student to check email, or use Resend link on the roster.';
      }
    }

    return withSource(
      {
        ok: true,
        decision: 'approve',
        setupUrl,
        activationToken,
        emailed,
        emailSkipped: emailed === false,
        emailUnknown: emailed == null,
        studentEmail,
        student: data?.student ? normalizeStudent(data.student) : null,
        message,
      },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: authErrorMessage(err, 'Unable to approve.') };
    }
    const res = local.decideInvitation(id, 'approve');
    return withSource(
      {
        ...res,
        emailed: false,
        emailSkipped: true,
        message:
          res.message ||
          'Approved locally. Copy the set-password link (API approve/email unavailable).',
      },
      'local'
    );
  }
}

/**
 * Deny pending invite → notify student by email.
 * POST /organizations/students/invites/:id/reject
 * Body: { send_email: true }
 * Response (preferred): { emailed, message? }
 */
export async function rejectStudentInvite(id) {
  if (allowLocalFallback()) {
    const res = local.decideInvitation(id, 'reject');
    return withSource(
      {
        ...res,
        emailed: false,
        emailSkipped: true,
        message:
          res.message ||
          'Denied (demo). Rejection email is not sent in demo mode — tell the student manually if needed.',
      },
      'local'
    );
  }

  try {
    const data = await orgApi.post(`/organizations/students/invites/${id}/reject`, {
      send_email: true,
      notify_student: true,
    });
    const emailedRaw = data?.emailed ?? data?.email_sent ?? data?.rejection_email_sent;
    const emailed = emailedRaw == null ? null : Boolean(emailedRaw);
    const studentEmail = data?.email || data?.invite?.email || data?.invitation?.email || '';

    let message = data?.message || '';
    if (!message) {
      if (emailed === true) {
        message = studentEmail
          ? `Denied. Notification email sent to ${studentEmail}.`
          : 'Denied. Notification email sent to the student.';
      } else if (emailed === false) {
        message = 'Denied, but notification email failed to send. Inform the student manually.';
      } else {
        message = 'Registration denied.';
      }
    }

    return withSource(
      {
        ok: true,
        decision: 'reject',
        emailed,
        emailSkipped: emailed === false,
        emailUnknown: emailed == null,
        studentEmail,
        message,
      },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: authErrorMessage(err, 'Unable to reject.') };
    }
    const res = local.decideInvitation(id, 'reject');
    return withSource(
      {
        ...res,
        emailed: false,
        emailSkipped: true,
        message: res.message || 'Denied locally (API reject/email unavailable).',
      },
      'local'
    );
  }
}

/**
 * Approve or deny many pending invites one-by-one (no bulk API yet).
 * Returns counts + last setup URL from a successful approve that exposed one.
 */
export async function decideAllInvites(ids = [], decision = 'approve') {
  const list = (Array.isArray(ids) ? ids : []).map((id) => String(id)).filter(Boolean);
  let okCount = 0;
  let failCount = 0;
  const errors = [];
  let lastSetupUrl = '';
  let lastMessage = '';

  for (const id of list) {
    const res =
      decision === 'approve' ? await approveStudentInvite(id) : await rejectStudentInvite(id);
    if (res?.ok) {
      okCount += 1;
      lastMessage = res.message || lastMessage;
      if (res.setupUrl) lastSetupUrl = res.setupUrl;
    } else {
      failCount += 1;
      errors.push(res?.error || `Failed for invite ${id}`);
    }
  }

  const verb = decision === 'approve' ? 'Approved' : 'Denied';
  let message = `${verb} ${okCount} of ${list.length}.`;
  if (failCount) message += ` ${failCount} failed.`;
  if (lastMessage && okCount === 1 && failCount === 0) message = lastMessage;

  return {
    ok: failCount === 0 && okCount > 0,
    okCount,
    failCount,
    total: list.length,
    errors,
    setupUrl: lastSetupUrl,
    message,
  };
}

export async function patchStudent(id, patch = {}) {
  if (allowLocalFallback()) {
    try {
      const student = local.patchStudentLocal(id, patch);
      if (student) return withSource({ ok: true, student }, 'local');
    } catch (e) {
      return { ok: false, error: e?.message || 'Unable to update student.' };
    }
    return { ok: false, error: 'Student not found.' };
  }

  try {
    const body = {};
    if (patch.departmentId != null) {
      const n = Number(patch.departmentId);
      body.department_id =
        Number.isFinite(n) && String(n) === String(patch.departmentId).trim()
          ? n
          : patch.departmentId;
    }
    if (patch.status != null) {
      // Contract: DISABLED / Inactive → BLOCKED on API
      const s = String(patch.status).toUpperCase();
      body.status =
        s === 'DISABLED' || s === 'INACTIVE' || s === 'BLOCKED' ? 'BLOCKED' : s;
    }
    if (patch.name != null) body.name = String(patch.name).trim();
    if (patch.email != null) body.email = String(patch.email).trim().toLowerCase();
    if (patch.phone != null) {
      const phone = String(patch.phone).replace(/\D/g, '');
      body.phone = phone || null;
      body.contact = phone || null;
    }
    if (patch.collegeId != null) body.roll_number = String(patch.collegeId).trim();
    if (patch.batchYear != null) {
      body.batch_year = patch.batchYear ? Number(patch.batchYear) || patch.batchYear : null;
    }
    const data = await orgApi.patch(`/organizations/students/${id}`, body);
    return withSource({ ok: true, student: normalizeStudent(data?.student || data) }, 'api');
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: authErrorMessage(err, 'Unable to update student.') };
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
 * Permanently remove a student from the roster.
 * DELETE /organizations/students/{id}
 */
export async function deleteStudentApi(id) {
  if (allowLocalFallback()) {
    const res = local.deleteStudentLocal(id);
    return withSource(res, 'local');
  }

  try {
    await orgApi.delete(`/organizations/students/${encodeURIComponent(id)}`);
    return withSource({ ok: true, message: 'Student removed from roster.' }, 'api');
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: authErrorMessage(err, 'Unable to delete student.') };
    }
    const res = local.deleteStudentLocal(id);
    return withSource(res, 'local');
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

  if (allowLocalFallback()) {
    const localRes = local.regenerateStudentSetupLink(studentOrInviteId);
    if (localRes?.ok && localRes.setupUrl) {
      return withSource(
        {
          ...localRes,
          emailed: false,
          message: localRes.message || 'Copy the set-password link below (demo — no email).',
        },
        'local'
      );
    }
    return { ok: false, error: localRes?.error || 'Unable to create set-password link.' };
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
  const orgCode = String(payload.orgCode || '').trim().toUpperCase();
  const deptRaw = payload.departmentId;
  const deptAsInt = toOptionalInt(deptRaw);
  const phoneDigits = String(payload.phone || payload.contact || '').replace(/\D/g, '');
  const roll = String(payload.collegeId || '').trim();

  // Demo college / non-numeric local dept ids → local queue (no fake API ints).
  const isDemoOrg = orgCode === String(DEMO_ORG.code || 'DEMO').toUpperCase();
  const isLocalDeptId =
    deptRaw != null &&
    String(deptRaw).trim() !== '' &&
    deptAsInt === undefined;

  if (isDemoOrg || isLocalDeptId) {
    return withSource(local.submitStudentSelfRegistration(payload), 'local');
  }

  try {
    const body = {
      name: String(payload.name || '').trim(),
      email: String(payload.email || '').trim().toLowerCase(),
      organization_code: orgCode,
      // FastAPI often types department_id as int — JSON string "3" → validation error.
      department_id: deptAsInt !== undefined ? deptAsInt : deptRaw,
      // Roll / college IDs are often alphanumeric — always send as string.
      roll_number: roll || undefined,
      batch_year: toOptionalInt(payload.batchYear),
    };
    if (payload.password) body.password = payload.password;
    if (phoneDigits) {
      // Prefer string; if API insists on int, digits-only still parses when sent as number.
      body.phone = phoneDigits;
      body.contact = phoneDigits;
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
      return { ok: false, error: formatRegisterError(err) };
    }
    return withSource(local.submitStudentSelfRegistration(payload), 'local');
  }
}

function toOptionalInt(value) {
  if (value == null || value === '') return undefined;
  const trimmed = String(value).trim();
  if (!/^-?\d+$/.test(trimmed)) return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
}

function formatRegisterError(err) {
  const detail = err?.detail;
  if (Array.isArray(detail)) {
    const parts = detail
      .map((item) => {
        if (typeof item === 'string') return item;
        const loc = Array.isArray(item?.loc)
          ? item.loc.filter((p) => p !== 'body').join('.')
          : '';
        const msg = item?.msg || item?.message || '';
        if (loc && msg) return `${loc}: ${msg}`;
        return msg;
      })
      .filter(Boolean);
    if (parts.length) return parts.join(' · ');
  }
  const raw = String(err?.message || '');
  if (/valid integer/i.test(raw)) {
    return 'One of the fields must be a number (usually department). Re-select your department and try again. If your roll number has letters, that is fine — tell your campus if this keeps failing.';
  }
  return raw || 'Unable to register.';
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
        organization_code: data?.organization_code || '',
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
  try {
    const id = String(userId || '').trim();
    const body = {
      organization_code: String(orgCode || '').trim().toUpperCase(),
      portal: 'student',
      identifier: id,
    };
    if (id.includes('@')) body.email = id.toLowerCase();
    else body.username = id;

    const data = await orgApi.post('/auth/forgot-password', body, { auth: false });
    const resetUrl = data?.reset_url || data?.resetUrl || data?.setup_url || '';
    return withSource(
      {
        ok: true,
        setupUrl: resetUrl,
        emailed: Boolean(data?.emailed ?? data?.email_sent ?? !resetUrl),
        message:
          data?.message ||
          'If an account exists, a reset email was sent. Check your inbox.',
        email: data?.email || '',
        delivery: resetUrl ? 'link' : 'email',
      },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to start password reset.' };
    }
    return withSource(local.requestStudentPasswordReset({ orgCode, userId }), 'local');
  }
}

export function getRegistrationLink(departmentId) {
  return local.getStudentRegistrationLink(departmentId);
}
