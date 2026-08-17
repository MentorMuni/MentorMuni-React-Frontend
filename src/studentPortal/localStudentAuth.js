/**
 * Local student credentials + password-setup tokens.
 * TEMP until backend invite/approve/email activation is wired.
 * Passwords stored in localStorage for campus demo only — never ship to production as-is.
 */

const CRED_KEY = 'mm-student-local-creds-v1';
const SETUP_KEY = 'mm-student-setup-tokens-v1';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (!(import.meta.env.DEV || import.meta.env.VITE_SHOW_DEMO === 'true' || import.meta.env.VITE_SHOW_DEMO === '1')) {
    return;
  }
  localStorage.setItem(key, JSON.stringify(value));
}

function credId(orgCode, emailOrCollegeId) {
  return `${String(orgCode || '').trim().toUpperCase()}::${String(emailOrCollegeId || '')
    .trim()
    .toLowerCase()}`;
}

export function upsertLocalStudentCredential({
  orgCode,
  orgName,
  email,
  collegeId,
  password,
  name,
  departmentId,
  departmentName,
  studentId,
}) {
  const all = readJson(CRED_KEY, {});
  const record = {
    orgCode: String(orgCode || '').trim().toUpperCase(),
    orgName: orgName || '',
    email: String(email || '').trim().toLowerCase(),
    collegeId: String(collegeId || '').trim(),
    password: String(password || ''),
    name: name || '',
    departmentId: departmentId || '',
    departmentName: departmentName || '',
    studentId: studentId || '',
    updatedAt: new Date().toISOString(),
  };
  if (record.email) all[credId(record.orgCode, record.email)] = record;
  if (record.collegeId) all[credId(record.orgCode, record.collegeId)] = record;
  writeJson(CRED_KEY, all);
  return record;
}

export function matchLocalStudent(userId, password, organizationCode = '') {
  const id = String(userId || '').trim().toLowerCase();
  const pass = String(password || '');
  const code = String(organizationCode || '').trim().toUpperCase();
  if (!id || !pass) return null;

  const all = readJson(CRED_KEY, {});
  const candidates = Object.values(all).filter((row) => {
    if (!row?.password || row.password !== pass) return false;
    if (code && String(row.orgCode || '').toUpperCase() !== code) return false;
    const email = String(row.email || '').toLowerCase();
    const collegeId = String(row.collegeId || '').toLowerCase();
    return id === email || id === collegeId;
  });
  return candidates[0] || null;
}

export function createPasswordSetupToken({
  orgCode,
  orgName,
  orgId,
  email,
  collegeId,
  name,
  departmentId,
  departmentName,
  studentId,
  invitationId,
  ttlHours = 72,
}) {
  const token = `stu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  const all = readJson(SETUP_KEY, {});
  const expiresAt = new Date(Date.now() + ttlHours * 3600 * 1000).toISOString();
  all[token] = {
    token,
    orgCode: String(orgCode || '').trim().toUpperCase(),
    orgName: orgName || '',
    orgId: orgId || '',
    email: String(email || '').trim().toLowerCase(),
    collegeId: String(collegeId || '').trim(),
    name: name || '',
    departmentId: departmentId || '',
    departmentName: departmentName || '',
    studentId: studentId || '',
    invitationId: invitationId || '',
    expiresAt,
    createdAt: new Date().toISOString(),
  };
  writeJson(SETUP_KEY, all);
  return all[token];
}

export function peekPasswordSetupToken(token) {
  const key = String(token || '').trim();
  if (!key) return null;
  const all = readJson(SETUP_KEY, {});
  const row = all[key];
  if (!row) return null;
  if (row.expiresAt && new Date(row.expiresAt).getTime() < Date.now()) {
    delete all[key];
    writeJson(SETUP_KEY, all);
    return null;
  }
  return row;
}

export function consumePasswordSetupToken(token, newPassword) {
  const row = peekPasswordSetupToken(token);
  if (!row) return { ok: false, error: 'This link is invalid or expired.' };
  const pass = String(newPassword || '');
  if (pass.length < 8) {
    return { ok: false, error: 'Password must be at least 8 characters.' };
  }
  upsertLocalStudentCredential({
    orgCode: row.orgCode,
    orgName: row.orgName,
    email: row.email,
    collegeId: row.collegeId,
    password: pass,
    name: row.name,
    departmentId: row.departmentId,
    departmentName: row.departmentName,
    studentId: row.studentId,
  });
  const all = readJson(SETUP_KEY, {});
  delete all[String(token).trim()];
  writeJson(SETUP_KEY, all);
  return { ok: true, credential: row };
}

export function findLocalStudentIdentity(userId, organizationCode = '') {
  const id = String(userId || '').trim().toLowerCase();
  const code = String(organizationCode || '').trim().toUpperCase();
  if (!id) return null;
  const all = readJson(CRED_KEY, {});
  const rows = Object.values(all).filter((row) => {
    if (!row) return false;
    if (code && String(row.orgCode || '').toUpperCase() !== code) return false;
    const email = String(row.email || '').toLowerCase();
    const collegeId = String(row.collegeId || '').toLowerCase();
    return id === email || id === collegeId;
  });
  return rows[0] || null;
}

/**
 * Forgot-password: issue a fresh set-password token for a known local student.
 * Real product will email this URL; local demo returns the link for the UI to show/copy.
 */
export function requestLocalPasswordReset({ userId, orgCode, orgName, student }) {
  const identity = student || findLocalStudentIdentity(userId, orgCode);
  if (!identity?.email && !identity?.collegeId) {
    return { ok: false, error: 'No student account found for that campus ID / email.' };
  }
  const tokenRow = createPasswordSetupToken({
    orgCode: identity.orgCode || orgCode,
    orgName: identity.orgName || orgName || '',
    orgId: identity.orgId || '',
    email: identity.email,
    collegeId: identity.collegeId,
    name: identity.name,
    departmentId: identity.departmentId,
    departmentName: identity.departmentName,
    studentId: identity.studentId,
    ttlHours: 24,
  });
  return {
    ok: true,
    setupUrl: buildStudentSetupUrl(tokenRow.token),
    email: identity.email,
    collegeId: identity.collegeId,
    name: identity.name,
  };
}

export function buildStudentSetupUrl(token) {
  if (typeof window === 'undefined') return `/studentportal/set-password?token=${encodeURIComponent(token)}`;
  return `${window.location.origin}/studentportal/set-password?token=${encodeURIComponent(token)}`;
}

export function buildStudentRegisterUrl({ orgCode, departmentId }) {
  const params = new URLSearchParams();
  if (orgCode) params.set('org', String(orgCode).toUpperCase());
  if (departmentId) params.set('dept', departmentId);
  const qs = params.toString();
  if (typeof window === 'undefined') return `/studentportal/enroll${qs ? `?${qs}` : ''}`;
  return `${window.location.origin}/studentportal/enroll${qs ? `?${qs}` : ''}`;
}
