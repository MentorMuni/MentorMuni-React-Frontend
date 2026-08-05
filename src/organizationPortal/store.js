/**
 * Local org workspace store (per organization).
 * Ready to swap for API calls when backend endpoints land.
 */

import { getOrgSession } from '../orgPortal';
import { DEMO_DEPT_ID, DEMO_ORG } from './demoAuth';
import {
  buildStudentSetupUrl,
  createPasswordSetupToken,
  findLocalStudentIdentity,
  requestLocalPasswordReset,
  upsertLocalStudentCredential,
} from '../studentPortal/localStudentAuth';

const DB_KEY = 'mm-org-tpo-db-v1';
const CODE_INDEX_KEY = 'mm-org-code-index-v1';
const EVENT = 'mm-org-db-updated';

function orgKey() {
  const s = getOrgSession();
  return String(s?.organization_id || s?.organization_code || 'default');
}

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function emptyOrg() {
  return {
    departments: [],
    students: [],
    invitations: [],
    programs: [],
    drives: [],
    meta: {
      organization_code: '',
      organization_name: '',
    },
    hodAccess: {
      canInviteStudents: true,
      canViewAllScores: true,
      canAssignPrograms: true,
      canNotifyDepartment: true,
      canRunMocks: true,
    },
  };
}

function readCodeIndex() {
  try {
    const raw = localStorage.getItem(CODE_INDEX_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCodeIndex(idx) {
  localStorage.setItem(CODE_INDEX_KEY, JSON.stringify(idx));
}

function rememberOrgCode(code, key, name = '') {
  const c = String(code || '').trim().toUpperCase();
  if (!c || !key) return;
  const idx = readCodeIndex();
  idx[c] = { key, name: name || idx[c]?.name || '' };
  writeCodeIndex(idx);
}

function syncSessionMeta(data) {
  const s = getOrgSession();
  if (!s) return data;
  const code = String(s.organization_code || '').trim().toUpperCase();
  const name = s.organization_name || '';
  data.meta = {
    ...(data.meta || {}),
    organization_code: code || data.meta?.organization_code || '',
    organization_name: name || data.meta?.organization_name || '',
  };
  if (code) rememberOrgCode(code, orgKey(), name);
  return data;
}

function readAll() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(all) {
  localStorage.setItem(DB_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent(EVENT));
}

function readOrg() {
  const all = readAll();
  const key = orgKey();
  if (!all[key]) {
    all[key] = emptyOrg();
    writeAll(all);
  }
  all[key] = syncSessionMeta(all[key]);
  return { all, key, data: all[key] };
}

function mutate(fn) {
  const { all, key, data } = readOrg();
  const next = syncSessionMeta(fn(structuredClone(data)) || data);
  all[key] = next;
  writeAll(all);
  return next;
}

function resolveOrgKeyByCode(organizationCode) {
  const code = String(organizationCode || '').trim().toUpperCase();
  if (!code) return null;
  const idx = readCodeIndex();
  if (idx[code]?.key) return idx[code].key;
  if (code === DEMO_ORG.code) return DEMO_ORG.id;
  const all = readAll();
  if (all[code]) return code;
  if (all[code.toLowerCase()]) return code.toLowerCase();
  return null;
}

export function getOrgPublicProfile(organizationCode) {
  const code = String(organizationCode || '').trim().toUpperCase();
  const key = resolveOrgKeyByCode(code);
  if (!key) {
    if (code === DEMO_ORG.code) {
      return {
        ok: true,
        orgCode: DEMO_ORG.code,
        orgName: DEMO_ORG.name,
        orgId: DEMO_ORG.id,
        departments: [
          { id: DEMO_DEPT_ID, name: 'Computer Science', code: 'CSE' },
        ],
      };
    }
    return { ok: false, error: 'College not found. Check the registration link.' };
  }
  const all = readAll();
  const data = all[key] || emptyOrg();
  return {
    ok: true,
    orgCode: data.meta?.organization_code || code,
    orgName: data.meta?.organization_name || '',
    orgId: key,
    departments: (data.departments || []).map((d) => ({
      id: d.id,
      name: d.name,
      code: d.code || '',
    })),
  };
}

function mutateByKey(key, fn) {
  const all = readAll();
  if (!all[key]) all[key] = emptyOrg();
  const next = fn(structuredClone(all[key])) || all[key];
  all[key] = next;
  writeAll(all);
  return next;
}

export function subscribeOrgDb(cb) {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}

export function getOrgWorkspace() {
  return readOrg().data;
}

/**
 * TEMP — seed CSE branch + students for demo TPO/HOD login.
 * Call on demo login; overwrites the demo org workspace only.
 */
export function seedDemoWorkspace() {
  const now = new Date().toISOString();
  const students = [
    {
      id: 'stu_demo_1',
      name: 'Ananya Rao',
      email: 'ananya.rao@demo.edu',
      departmentId: DEMO_DEPT_ID,
      departmentName: 'Computer Science',
      status: 'active',
      readiness: 82,
      mockScore: 78,
      activities: 9,
      strength: 'DSA',
      weakness: 'HR round',
      createdAt: now,
    },
    {
      id: 'stu_demo_2',
      name: 'Karthik Menon',
      email: 'karthik.m@demo.edu',
      departmentId: DEMO_DEPT_ID,
      departmentName: 'Computer Science',
      status: 'active',
      readiness: 71,
      mockScore: 68,
      activities: 6,
      strength: 'Projects',
      weakness: 'System design',
      createdAt: now,
    },
    {
      id: 'stu_demo_3',
      name: 'Priya Nair',
      email: 'priya.nair@demo.edu',
      departmentId: DEMO_DEPT_ID,
      departmentName: 'Computer Science',
      status: 'active',
      readiness: 44,
      mockScore: 51,
      activities: 3,
      strength: 'Communication',
      weakness: 'Coding speed',
      createdAt: now,
    },
    {
      id: 'stu_demo_4',
      name: 'Rohit Sharma',
      email: 'rohit.s@demo.edu',
      departmentId: DEMO_DEPT_ID,
      departmentName: 'Computer Science',
      status: 'active',
      readiness: 58,
      mockScore: 55,
      activities: 5,
      strength: 'Aptitude',
      weakness: 'Resume',
      createdAt: now,
    },
    {
      id: 'stu_demo_5',
      name: 'Sneha Iyer',
      email: 'sneha.iyer@demo.edu',
      departmentId: DEMO_DEPT_ID,
      departmentName: 'Computer Science',
      status: 'active',
      readiness: 91,
      mockScore: 88,
      activities: 12,
      strength: 'Communication',
      weakness: 'System design',
      createdAt: now,
    },
    {
      id: 'stu_demo_6',
      name: 'Vikram Das',
      email: 'vikram.das@demo.edu',
      departmentId: DEMO_DEPT_ID,
      departmentName: 'Computer Science',
      status: 'active',
      readiness: 37,
      mockScore: 42,
      activities: 2,
      strength: 'Projects',
      weakness: 'Coding speed',
      createdAt: now,
    },
  ];

  const seeded = {
    departments: [
      {
        id: DEMO_DEPT_ID,
        name: 'Computer Science',
        code: 'CSE',
        hodName: 'Demo HOD',
        hodEmail: 'hod@demo.edu',
        hodStatus: 'active',
        studentCount: students.length,
        createdAt: now,
      },
      {
        id: 'dept_ece_demo',
        name: 'Electronics',
        code: 'ECE',
        hodName: '',
        hodEmail: '',
        hodStatus: 'empty',
        studentCount: 0,
        createdAt: now,
      },
    ],
    students,
    invitations: [
      {
        id: 'inv_demo_1',
        email: 'new.student@demo.edu',
        departmentId: DEMO_DEPT_ID,
        departmentName: 'Computer Science',
        status: 'pending',
        createdAt: now,
      },
    ],
    programs: [
      {
        id: 'prg_demo_1',
        title: 'CSE aptitude baseline',
        type: 'aptitude',
        audience: 'department',
        departmentId: DEMO_DEPT_ID,
        studentIds: [],
        dueInDays: 7,
        status: 'active',
        createdAt: now,
      },
    ],
    drives: [],
    meta: {
      organization_code: DEMO_ORG.code,
      organization_name: DEMO_ORG.name,
    },
    hodAccess: {
      canInviteStudents: true,
      canViewAllScores: true,
      canAssignPrograms: true,
      canNotifyDepartment: true,
      canRunMocks: true,
    },
  };

  rememberOrgCode(DEMO_ORG.code, DEMO_ORG.id, DEMO_ORG.name);

  const all = readAll();
  all[DEMO_ORG.id] = seeded;
  all[DEMO_ORG.code] = seeded;
  writeAll(all);
  return seeded;
}

/**
 * TEMP — wipe demo org data from local store.
 */
export function clearDemoWorkspace() {
  const all = readAll();
  delete all[DEMO_ORG.id];
  delete all[DEMO_ORG.code];
  writeAll(all);
}
/* ── Departments ─────────────────────────────────────────── */

const INVITE_KEY = 'mm-org-hod-invites-v1';

function readInvites() {
  try {
    const raw = localStorage.getItem(INVITE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeInvites(map) {
  localStorage.setItem(INVITE_KEY, JSON.stringify(map));
}

function makeActivationToken() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `hod_${crypto.randomUUID().replace(/-/g, '')}`;
  }
  return `hod_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 14)}`;
}

function activationUrlFor(token) {
  if (!token || typeof window === 'undefined') return '';
  return `${window.location.origin}/activate-hod?token=${encodeURIComponent(token)}`;
}

function pushMentorHistory(dept, event, extra = {}) {
  const history = Array.isArray(dept.mentorHistory) ? dept.mentorHistory : [];
  history.unshift({
    id: uid('mh'),
    at: new Date().toISOString(),
    event,
    name: dept.hodName || '',
    email: dept.hodEmail || '',
    status: dept.hodStatus || '',
    ...extra,
  });
  dept.mentorHistory = history.slice(0, 40);
}

function registerInvite(token, payload) {
  const map = readInvites();
  map[token] = {
    ...payload,
    token,
    createdAt: new Date().toISOString(),
  };
  writeInvites(map);
}

function clearInviteToken(token) {
  if (!token) return;
  const map = readInvites();
  delete map[token];
  writeInvites(map);
}

function issueHodInvite(dept, { name, email } = {}) {
  if (name) dept.hodName = String(name).trim();
  if (email) dept.hodEmail = String(email).trim().toLowerCase();
  if (!dept.hodEmail) {
    throw new Error('HOD email is required to send an invite.');
  }
  if (dept.activationToken) clearInviteToken(dept.activationToken);
  const token = makeActivationToken();
  const now = new Date().toISOString();
  dept.activationToken = token;
  dept.hodStatus = 'invited';
  dept.invitedAt = now;
  dept.activatedAt = null;
  dept.updatedAt = now;
  registerInvite(token, {
    orgKey: orgKey(),
    departmentId: dept.id,
    departmentName: dept.name,
    departmentCode: dept.code,
    email: dept.hodEmail,
    name: dept.hodName || '',
    organizationName: getOrgSession()?.organization_name || '',
    organizationCode: getOrgSession()?.organization_code || '',
  });
  pushMentorHistory(dept, 'invited');
  return { department: dept, activationToken: token, activationUrl: activationUrlFor(token) };
}

export function listDepartments() {
  return getOrgWorkspace().departments;
}

export function getDepartment(id) {
  return listDepartments().find((d) => d.id === id) || null;
}

export function upsertDepartment(input) {
  const code = String(input.code || '').trim().toUpperCase();
  const name = String(input.name || '').trim();
  if (!name || !code) throw new Error('Department name and code are required.');

  return mutate((data) => {
    const now = new Date().toISOString();
    const duplicate = data.departments.find(
      (d) => d.code === code && d.id !== input.id
    );
    if (duplicate) throw new Error(`Department code ${code} already exists.`);

    if (input.id) {
      data.departments = data.departments.map((d) => {
        if (d.id !== input.id) return d;
        return {
          ...d,
          name,
          code,
          // Structural edit only — HOD changes go through invite/replace
          updatedAt: now,
        };
      });
    } else {
      data.departments.unshift({
        id: uid('dept'),
        name,
        code,
        hodName: '',
        hodEmail: '',
        hodStatus: 'unassigned',
        activationToken: '',
        invitedAt: null,
        activatedAt: null,
        mentorHistory: [],
        studentCount: 0,
        createdAt: now,
        updatedAt: now,
      });
    }
    return data;
  });
}

export function removeDepartment(id) {
  return mutate((data) => {
    const dept = data.departments.find((d) => d.id === id);
    if (dept?.activationToken) clearInviteToken(dept.activationToken);
    data.departments = data.departments.filter((d) => d.id !== id);
    data.students = data.students.map((s) =>
      s.departmentId === id ? { ...s, departmentId: '', departmentName: '' } : s
    );
    data.invitations = data.invitations.map((i) =>
      i.departmentId === id ? { ...i, departmentId: '', departmentName: i.departmentName } : i
    );
    return data;
  });
}

/** Invite or re-issue invite for current HOD email on the department. */
export function inviteHod(departmentId, { name, email } = {}) {
  let result = null;
  mutate((data) => {
    const dept = data.departments.find((d) => d.id === departmentId);
    if (!dept) throw new Error('Department not found.');
    result = issueHodInvite(dept, {
      name: name || dept.hodName,
      email: email || dept.hodEmail,
    });
    return data;
  });
  return result;
}

export function reinviteHod(departmentId) {
  return inviteHod(departmentId);
}

export function revokeHod(departmentId, reason = '') {
  let department = null;
  mutate((data) => {
    const dept = data.departments.find((d) => d.id === departmentId);
    if (!dept) throw new Error('Department not found.');
    if (!dept.hodEmail && dept.hodStatus === 'unassigned') {
      throw new Error('No HOD assigned to revoke.');
    }
    pushMentorHistory(dept, 'revoked', { reason: reason || '' });
    if (dept.activationToken) clearInviteToken(dept.activationToken);
    dept.hodName = '';
    dept.hodEmail = '';
    dept.hodStatus = 'unassigned';
    dept.activationToken = '';
    dept.invitedAt = null;
    dept.activatedAt = null;
    dept.updatedAt = new Date().toISOString();
    department = { ...dept };
    return data;
  });
  return department;
}

export function replaceHod(departmentId, { name, email, reason = '' }) {
  if (!String(email || '').trim()) throw new Error('New HOD email is required.');
  let result = null;
  mutate((data) => {
    const dept = data.departments.find((d) => d.id === departmentId);
    if (!dept) throw new Error('Department not found.');
    if (dept.hodEmail || dept.hodStatus !== 'unassigned') {
      pushMentorHistory(dept, 'replaced', {
        reason: reason || '',
        replacedByName: String(name || '').trim(),
        replacedByEmail: String(email).trim().toLowerCase(),
      });
      if (dept.activationToken) clearInviteToken(dept.activationToken);
    }
    result = issueHodInvite(dept, { name, email });
    return data;
  });
  return result;
}

/**
 * Complete HOD activation from /activate-hod?token=…
 * Local path marks department active (API path lives in auth.activateHodAccount).
 */
export function activateHodInviteLocal(token) {
  const map = readInvites();
  const invite = map[String(token || '').trim()];
  if (!invite) {
    return { ok: false, error: 'This activation link is invalid or has already been used.' };
  }

  const all = readAll();
  const orgData = all[invite.orgKey];
  if (!orgData) {
    return { ok: false, error: 'Organization data for this invite was not found in this browser.' };
  }

  const dept = orgData.departments.find((d) => d.id === invite.departmentId);
  if (!dept) {
    return { ok: false, error: 'Department for this invite no longer exists.' };
  }
  if (dept.activationToken !== invite.token) {
    return { ok: false, error: 'This invite was superseded. Ask your TPO for a new link.' };
  }

  const now = new Date().toISOString();
  dept.hodStatus = 'active';
  dept.hodEmail = invite.email;
  dept.hodName = invite.name || dept.hodName;
  dept.activatedAt = now;
  dept.updatedAt = now;
  dept.activationToken = '';
  pushMentorHistory(dept, 'activated');
  clearInviteToken(invite.token);
  writeAll(all);

  return {
    ok: true,
    message: 'Password set. You can log in to the Organization Portal as HOD.',
    department: dept,
    email: invite.email,
    organizationCode: invite.organizationCode || '',
  };
}

export function peekHodInvite(token) {
  const invite = readInvites()[String(token || '').trim()];
  if (!invite) return null;
  return {
    email: invite.email,
    name: invite.name,
    departmentName: invite.departmentName,
    organizationName: invite.organizationName,
  };
}

/* ── Enrollment / students ───────────────────────────────── */

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function invitationExists(data, email) {
  const e = normalizeEmail(email);
  return (
    data.invitations.some((i) => normalizeEmail(i.email) === e && i.status === 'pending') ||
    data.students.some((s) => normalizeEmail(s.email) === e)
  );
}

function buildInvitationRow({
  email,
  name = '',
  collegeId = '',
  batchYear = '',
  departmentId = '',
  departmentName = '',
  source = 'invite',
  pendingPassword = '',
  phone = '',
}) {
  return {
    id: uid('inv'),
    email: normalizeEmail(email),
    name: String(name || '').trim(),
    collegeId: String(collegeId || '').trim(),
    batchYear: String(batchYear || '').trim(),
    phone: String(phone || '').trim(),
    departmentId: departmentId || '',
    departmentName: departmentName || '',
    source, // invite | manual | csv | self_register
    status: 'pending',
    createdAt: new Date().toISOString(),
    decidedAt: '',
    setupUrl: '',
    // Self-register may already include a password (API: PENDING → approve → ACTIVE)
    pendingPassword: pendingPassword ? String(pendingPassword) : '',
  };
}

export function listStudents() {
  return getOrgWorkspace().students;
}

export function listInvitations() {
  return getOrgWorkspace().invitations;
}

export function getStudentRegistrationLink(departmentId = '') {
  const session = getOrgSession();
  const orgCode =
    String(session?.organization_code || getOrgWorkspace().meta?.organization_code || '').trim() ||
    DEMO_ORG.code;
  const params = new URLSearchParams();
  params.set('org', orgCode.toUpperCase());
  if (departmentId) params.set('dept', departmentId);
  // Enroll uses public departments API; legacy /register redirects here too
  if (typeof window === 'undefined') return `/studentportal/enroll?${params}`;
  return `${window.location.origin}/studentportal/enroll?${params}`;
}

function orgContext() {
  const session = getOrgSession();
  return {
    orgCode:
      String(session?.organization_code || getOrgWorkspace().meta?.organization_code || '').trim() ||
      DEMO_ORG.code,
    orgName:
      session?.organization_name || getOrgWorkspace().meta?.organization_name || DEMO_ORG.name,
    orgId: session?.organization_id || orgKey(),
  };
}

/** Mint set-password URL for a roster student (demo / local). */
function attachSetupUrl(student) {
  if (!student?.email) return '';
  const { orgCode, orgName, orgId } = orgContext();
  const tokenRow = createPasswordSetupToken({
    orgCode,
    orgName,
    orgId,
    email: student.email,
    collegeId: student.collegeId || '',
    name: student.name || '',
    departmentId: student.departmentId || '',
    departmentName: student.departmentName || '',
    studentId: student.id,
  });
  const setupUrl = buildStudentSetupUrl(tokenRow.token);
  student.setupUrl = setupUrl;
  student.authStatus = student.authStatus || 'needs_password';
  return setupUrl;
}

/** Paste emails → pending invites, or auto-enroll when autoEnroll=true (HOD/TPO staff add) */
export function inviteStudents({ emails, departmentId, source = 'invite', autoEnroll = false }) {
  const dept = listDepartments().find((d) => d.id === departmentId);
  const rows = String(emails || '')
    .split(/[\n,;]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  let added = 0;
  let setupUrl = '';
  mutate((data) => {
    rows.forEach((email) => {
      if (!isValidEmail(email) || invitationExists(data, email)) return;
      if (autoEnroll) {
        if (data.students.some((s) => s.email === email)) return;
        const student = {
          id: uid('stu'),
          name: email.split('@')[0].replace(/[._]/g, ' '),
          email,
          collegeId: '',
          batchYear: '',
          departmentId: departmentId || '',
          departmentName: dept?.name || '',
          status: 'active',
          authStatus: 'needs_password',
          readiness: 0,
          mockScore: 0,
          activities: 0,
          strength: '—',
          weakness: '—',
          source: source || 'invite',
          setupUrl: '',
          createdAt: new Date().toISOString(),
        };
        setupUrl = attachSetupUrl(student) || setupUrl;
        data.students.unshift(student);
        if (dept) {
          const d = data.departments.find((x) => x.id === departmentId);
          if (d) d.studentCount = (d.studentCount || 0) + 1;
        }
        added += 1;
        return;
      }
      data.invitations.unshift(
        buildInvitationRow({
          email,
          departmentId: departmentId || '',
          departmentName: dept?.name || '',
          source,
        })
      );
      added += 1;
    });
    return data;
  });
  return {
    ok: true,
    added,
    setupUrl,
    message: autoEnroll
      ? added
        ? 'Students added to roster. Copy the set-password link (demo — share it with the student).'
        : 'No new students added (duplicates skipped).'
      : undefined,
  };
}

/** Single student form → pending queue, or roster when autoEnroll */
export function addStudentManual({
  name,
  email,
  collegeId,
  batchYear,
  departmentId,
  autoEnroll = false,
}) {
  const e = normalizeEmail(email);
  if (!isValidEmail(e)) return { ok: false, error: 'Enter a valid student email.' };
  if (!String(name || '').trim()) return { ok: false, error: 'Student name is required.' };
  const dept = listDepartments().find((d) => d.id === departmentId);
  if (!departmentId || !dept) return { ok: false, error: 'Select a department.' };

  if (autoEnroll) {
    let student = null;
    let setupUrl = '';
    mutate((data) => {
      if (data.students.some((s) => s.email === e) || invitationExists(data, e)) return data;
      student = {
        id: uid('stu'),
        name: String(name).trim(),
        email: e,
        collegeId: collegeId || '',
        batchYear: batchYear || '',
        departmentId,
        departmentName: dept.name,
        status: 'active',
        authStatus: 'needs_password',
        readiness: 0,
        mockScore: 0,
        activities: 0,
        strength: '—',
        weakness: '—',
        source: 'manual',
        setupUrl: '',
        createdAt: new Date().toISOString(),
      };
      setupUrl = attachSetupUrl(student);
      data.students.unshift(student);
      const d = data.departments.find((x) => x.id === departmentId);
      if (d) d.studentCount = (d.studentCount || 0) + 1;
      return data;
    });
    if (!student) return { ok: false, error: 'This email is already pending or enrolled.' };
    return {
      ok: true,
      student,
      setupUrl,
      message:
        'Student added to roster. Copy the set-password link below and share it (demo — no email).',
    };
  }

  let created = null;
  const result = mutate((data) => {
    if (invitationExists(data, e)) {
      return data;
    }
    created = buildInvitationRow({
      email: e,
      name,
      collegeId,
      batchYear,
      departmentId,
      departmentName: dept.name,
      source: 'manual',
    });
    data.invitations.unshift(created);
    return data;
  });
  if (!created) {
    return { ok: false, error: 'This email is already pending or enrolled.' };
  }
  return { ok: true, invitation: created, workspace: result };
}

/**
 * CSV text → pending invites, or roster when autoEnroll=true.
 * Expected headers (flexible): email, name, college_id|roll|roll_number, batch_year|batch
 */
export function importStudentsFromCsv({ csvText, departmentId, autoEnroll = false }) {
  const dept = listDepartments().find((d) => d.id === departmentId);
  if (!departmentId || !dept) return { ok: false, error: 'Select a department first.' };

  const lines = String(csvText || '')
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) {
    return { ok: false, error: 'CSV needs a header row and at least one student row.' };
  }

  const split = (line) => {
    const out = [];
    let cur = '';
    let q = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (ch === '"') {
        q = !q;
        continue;
      }
      if (ch === ',' && !q) {
        out.push(cur.trim());
        cur = '';
        continue;
      }
      cur += ch;
    }
    out.push(cur.trim());
    return out;
  };

  const headers = split(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, '_'));
  const idx = {
    email: headers.findIndex((h) => h === 'email' || h === 'student_email'),
    name: headers.findIndex((h) => h === 'name' || h === 'student_name' || h === 'full_name'),
    collegeId: headers.findIndex(
      (h) => h === 'college_id' || h === 'roll' || h === 'roll_number' || h === 'roll_no'
    ),
    batchYear: headers.findIndex((h) => h === 'batch_year' || h === 'batch' || h === 'year'),
  };
  if (idx.email < 0) {
    return { ok: false, error: 'CSV must include an “email” column.' };
  }

  const errors = [];
  let added = 0;
  let skipped = 0;
  let setupUrl = '';

  mutate((data) => {
    for (let r = 1; r < lines.length; r += 1) {
      const cols = split(lines[r]);
      const email = normalizeEmail(cols[idx.email] || '');
      const name = idx.name >= 0 ? cols[idx.name] || '' : '';
      const collegeId = idx.collegeId >= 0 ? cols[idx.collegeId] || '' : '';
      const batchYear = idx.batchYear >= 0 ? cols[idx.batchYear] || '' : '';
      if (!email) {
        errors.push({ row: r + 1, message: 'Missing email' });
        continue;
      }
      if (!isValidEmail(email)) {
        errors.push({ row: r + 1, email, message: 'Invalid email' });
        continue;
      }
      if (invitationExists(data, email) || data.students.some((s) => s.email === email)) {
        skipped += 1;
        continue;
      }
      if (autoEnroll) {
        const student = {
          id: uid('stu'),
          name: name || email.split('@')[0].replace(/[._]/g, ' '),
          email,
          collegeId,
          batchYear,
          departmentId,
          departmentName: dept.name,
          status: 'active',
          authStatus: 'needs_password',
          readiness: 0,
          mockScore: 0,
          activities: 0,
          strength: '—',
          weakness: '—',
          source: 'csv',
          setupUrl: '',
          createdAt: new Date().toISOString(),
        };
        setupUrl = attachSetupUrl(student) || setupUrl;
        data.students.unshift(student);
        const d = data.departments.find((x) => x.id === departmentId);
        if (d) d.studentCount = (d.studentCount || 0) + 1;
      } else {
        data.invitations.unshift(
          buildInvitationRow({
            email,
            name,
            collegeId,
            batchYear,
            departmentId,
            departmentName: dept.name,
            source: 'csv',
          })
        );
      }
      added += 1;
    }
    return data;
  });

  return {
    ok: true,
    added,
    skipped,
    errors,
    setupUrl,
    message: autoEnroll
      ? `Imported ${added} · skipped ${skipped}. Copy set-password link below (demo — no email).`
      : undefined,
  };
}

/** Local demo patch for student profile fields */
export function patchStudentLocal(id, patch = {}) {
  let updated = null;
  mutate((data) => {
    const depts = data.departments || [];
    data.students = data.students.map((s) => {
      if (String(s.id) !== String(id)) return s;
      const nextDeptId = patch.departmentId != null ? patch.departmentId : s.departmentId;
      const nextDept =
        patch.departmentId != null
          ? depts.find((d) => String(d.id) === String(patch.departmentId))
          : null;
      updated = {
        ...s,
        name: patch.name != null ? String(patch.name).trim() : s.name,
        email:
          patch.email != null ? String(patch.email).trim().toLowerCase() : s.email,
        phone: patch.phone != null ? String(patch.phone).trim() : s.phone || '',
        collegeId: patch.collegeId != null ? String(patch.collegeId).trim() : s.collegeId,
        batchYear: patch.batchYear != null ? String(patch.batchYear).trim() : s.batchYear,
        status:
          patch.status != null
            ? String(patch.status).toLowerCase() === 'disabled'
              ? 'disabled'
              : s.status
            : s.status,
        authStatus:
          patch.status != null && String(patch.status).toUpperCase() === 'DISABLED'
            ? 'disabled'
            : s.authStatus,
        departmentId: nextDeptId,
        departmentName:
          patch.departmentName != null
            ? String(patch.departmentName)
            : nextDept?.name || s.departmentName,
      };
      return updated;
    });

    // Keep department student counts roughly in sync when branch changes
    if (updated && patch.departmentId != null) {
      const counts = {};
      data.students.forEach((s) => {
        if (!s.departmentId) return;
        counts[s.departmentId] = (counts[s.departmentId] || 0) + 1;
      });
      data.departments = depts.map((d) => ({
        ...d,
        studentCount: counts[d.id] != null ? counts[d.id] : d.studentCount || 0,
      }));
    }
    return data;
  });
  if (!updated) throw new Error('Student not found.');
  return updated;
}

/** Permanently remove student from local roster */
export function deleteStudentLocal(id) {
  let removed = null;
  mutate((data) => {
    const before = data.students.length;
    data.students = data.students.filter((s) => {
      if (String(s.id) !== String(id)) return true;
      removed = s;
      return false;
    });
    if (removed?.departmentId) {
      data.departments = (data.departments || []).map((d) =>
        String(d.id) === String(removed.departmentId)
          ? { ...d, studentCount: Math.max(0, (d.studentCount || 0) - 1) }
          : d
      );
    }
    if (data.students.length === before) return data;
    return data;
  });
  if (!removed) return { ok: false, error: 'Student not found.' };
  return { ok: true, message: 'Student removed from roster.', student: removed };
}

/** Public self-register → pending for HOD/TPO approve */
export function submitStudentSelfRegistration({
  orgCode,
  departmentId,
  departmentName = '',
  name,
  email,
  collegeId,
  batchYear,
  password = '',
  phone = '',
  contact = '',
  orgName = '',
}) {
  const code = String(orgCode || '').trim().toUpperCase();
  let profile = getOrgPublicProfile(code);
  if (!profile.ok) {
    // College known from login list but not yet in local workspace
    profile = {
      ok: true,
      orgCode: code,
      orgName: orgName || code,
      orgId: `code:${code}`,
      departments: [],
    };
  }

  const e = normalizeEmail(email);
  if (!isValidEmail(e)) return { ok: false, error: 'Enter a valid email.' };
  if (!String(name || '').trim()) return { ok: false, error: 'Name is required.' };
  if (!String(collegeId || '').trim()) return { ok: false, error: 'College ID / roll number is required.' };
  if (password && String(password).length < 8) {
    return { ok: false, error: 'Password must be at least 8 characters.' };
  }

  let dept =
    profile.departments.find((d) => String(d.id) === String(departmentId)) ||
    (profile.departments.length === 1 ? profile.departments[0] : null);
  if (!dept && departmentId) {
    dept = {
      id: departmentId,
      name: departmentName || 'Department',
      code: '',
    };
  }
  if (!dept) return { ok: false, error: 'Select your department.' };

  const key = profile.orgId;
  let created = null;
  mutateByKey(key, (data) => {
    data.meta = {
      ...(data.meta || {}),
      organization_code: profile.orgCode,
      organization_name: profile.orgName || orgName || '',
    };
    rememberOrgCode(profile.orgCode, key, profile.orgName || orgName);
    if (invitationExists(data, e)) return data;
    if (!data.departments.some((d) => String(d.id) === String(dept.id))) {
      data.departments.push({
        id: dept.id,
        name: dept.name,
        code: dept.code || '',
        hodEmail: '',
        hodStatus: 'unassigned',
        studentCount: 0,
      });
    }
    created = buildInvitationRow({
      email: e,
      name,
      collegeId,
      batchYear,
      phone: phone || contact || '',
      departmentId: dept.id,
      departmentName: dept.name,
      source: 'self_register',
      pendingPassword: password || '',
    });
    data.invitations.unshift(created);
    return data;
  });

  if (!created) {
    return { ok: false, error: 'You already submitted this email, or you are already enrolled.' };
  }
  return { ok: true, invitation: created };
}

/**
 * Approve → roster + password setup token (UI shows link; email is backend later).
 * Reject → mark rejected.
 */
export function decideInvitation(id, decision) {
  const session = getOrgSession();
  const orgCode =
    String(session?.organization_code || getOrgWorkspace().meta?.organization_code || '').trim() ||
    DEMO_ORG.code;
  const orgName =
    session?.organization_name || getOrgWorkspace().meta?.organization_name || DEMO_ORG.name;
  const orgId = session?.organization_id || orgKey();

  let setupUrl = '';
  let approvedStudent = null;

  mutate((data) => {
    const inv = data.invitations.find((i) => i.id === id);
    if (!inv) return data;
    const now = new Date().toISOString();
    if (decision === 'approve') {
      inv.status = 'approved';
      inv.decidedAt = now;
      const hasPassword = Boolean(inv.pendingPassword);
      const student = {
        id: uid('stu'),
        name: inv.name || inv.email.split('@')[0].replace(/[._]/g, ' '),
        email: inv.email,
        collegeId: inv.collegeId || '',
        batchYear: inv.batchYear || '',
        departmentId: inv.departmentId,
        departmentName: inv.departmentName,
        status: 'active',
        authStatus: hasPassword ? 'ready' : 'needs_password',
        readiness: Math.floor(40 + Math.random() * 20),
        mockScore: 0,
        activities: 0,
        strength: '—',
        weakness: '—',
        source: inv.source || 'invite',
        createdAt: now,
      };
      data.students.unshift(student);
      approvedStudent = student;

      if (hasPassword) {
        upsertLocalStudentCredential({
          orgCode,
          orgName,
          email: student.email,
          collegeId: student.collegeId,
          password: inv.pendingPassword,
          name: student.name,
          departmentId: student.departmentId,
          departmentName: student.departmentName,
          studentId: student.id,
        });
        inv.pendingPassword = '';
      } else {
        const tokenRow = createPasswordSetupToken({
          orgCode,
          orgName,
          orgId,
          email: student.email,
          collegeId: student.collegeId,
          name: student.name,
          departmentId: student.departmentId,
          departmentName: student.departmentName,
          studentId: student.id,
          invitationId: inv.id,
        });
        setupUrl = buildStudentSetupUrl(tokenRow.token);
        inv.setupUrl = setupUrl;
        student.setupUrl = setupUrl;
      }

      if (inv.departmentId) {
        data.departments = data.departments.map((d) =>
          d.id === inv.departmentId ? { ...d, studentCount: (d.studentCount || 0) + 1 } : d
        );
      }
    } else {
      inv.status = 'rejected';
      inv.decidedAt = now;
    }
    return data;
  });

  return {
    ok: true,
    decision,
    setupUrl,
    student: approvedStudent,
    emailed: false,
    message:
      decision === 'approve'
        ? setupUrl
          ? 'Approved (demo). Email not sent — copy the set-password link and share it with the student.'
          : 'Approved (demo). Email not sent in demo mode.'
        : 'Denied (demo). Rejection email not sent — tell the student manually if needed.',
  };
}

/** Resend / regenerate set-password link for an enrolled student */
export function regenerateStudentSetupLink(studentId) {
  const session = getOrgSession();
  const orgCode =
    String(session?.organization_code || getOrgWorkspace().meta?.organization_code || '').trim() ||
    DEMO_ORG.code;
  const orgName =
    session?.organization_name || getOrgWorkspace().meta?.organization_name || DEMO_ORG.name;
  const orgId = session?.organization_id || orgKey();

  const student = listStudents().find((s) => s.id === studentId);
  if (!student) return { ok: false, error: 'Student not found.' };

  const tokenRow = createPasswordSetupToken({
    orgCode,
    orgName,
    orgId,
    email: student.email,
    collegeId: student.collegeId,
    name: student.name,
    departmentId: student.departmentId,
    departmentName: student.departmentName,
    studentId: student.id,
  });
  const setupUrl = buildStudentSetupUrl(tokenRow.token);

  mutate((data) => {
    data.students = data.students.map((s) =>
      s.id === studentId ? { ...s, setupUrl, authStatus: s.authStatus || 'needs_password' } : s
    );
    return data;
  });

  return { ok: true, setupUrl };
}

export function markStudentPasswordReady(studentId) {
  if (!studentId) return;
  const all = readAll();
  Object.keys(all).forEach((key) => {
    const data = all[key];
    if (!data?.students) return;
    let changed = false;
    data.students = data.students.map((s) => {
      if (s.id !== studentId) return s;
      changed = true;
      return { ...s, authStatus: 'ready', setupUrl: '' };
    });
    if (changed) all[key] = data;
  });
  writeAll(all);
}

/**
 * Public forgot-password lookup (no staff session).
 * Finds student in campus roster and/or local credentials, then issues a set-password link.
 */
export function requestStudentPasswordReset({ orgCode, userId }) {
  const code = String(orgCode || '').trim().toUpperCase();
  const id = String(userId || '').trim().toLowerCase();
  if (!code) return { ok: false, error: 'Select your college first.' };
  if (!id) return { ok: false, error: 'Enter your college ID or email.' };

  const profile = getOrgPublicProfile(code);
  if (!profile.ok) return profile;

  const key = resolveOrgKeyByCode(code) || profile.orgId;
  const all = readAll();
  const data = (key && all[key]) || emptyOrg();
  const rosterHit = (data.students || []).find((s) => {
    const email = String(s.email || '').toLowerCase();
    const collegeId = String(s.collegeId || '').toLowerCase();
    return id === email || id === collegeId;
  });

  const localHit = findLocalStudentIdentity(id, code);

  // Demo student shortcut (always resettable in local demo)
  const isDemoStudent =
    code === DEMO_ORG.code &&
    (id === 'student@demo.edu' || id === 'cse2024a01' || id === 'student');

  if (!rosterHit && !localHit && !isDemoStudent) {
    return {
      ok: false,
      error: 'No student account found for that college ID / email on this campus.',
    };
  }

  const student = {
    orgCode: code,
    orgName: profile.orgName || DEMO_ORG.name,
    orgId: profile.orgId || key || '',
    email: rosterHit?.email || localHit?.email || (isDemoStudent ? 'student@demo.edu' : ''),
    collegeId:
      rosterHit?.collegeId || localHit?.collegeId || (isDemoStudent ? 'CSE2024A01' : ''),
    name: rosterHit?.name || localHit?.name || (isDemoStudent ? 'Ananya Rao' : ''),
    departmentId: rosterHit?.departmentId || localHit?.departmentId || '',
    departmentName: rosterHit?.departmentName || localHit?.departmentName || '',
    studentId: rosterHit?.id || localHit?.studentId || (isDemoStudent ? 'demo_student' : ''),
  };

  const reset = requestLocalPasswordReset({
    userId: id,
    orgCode: code,
    orgName: student.orgName,
    student,
  });

  if (!reset.ok) return reset;

  if (rosterHit?.id) {
    mutateByKey(key, (workspace) => {
      workspace.students = (workspace.students || []).map((s) =>
        s.id === rosterHit.id
          ? { ...s, setupUrl: reset.setupUrl, authStatus: 'needs_password' }
          : s
      );
      return workspace;
    });
  }

  return {
    ok: true,
    setupUrl: reset.setupUrl,
    email: student.email,
    name: student.name,
    // When email API lands: send mail here and return { emailed: true } without setupUrl in prod.
    delivery: 'link',
  };
}

/* ── Programs ────────────────────────────────────────────── */

export const PROGRAM_TYPES = [
  { id: 'readiness', label: 'Readiness / placement test', group: 'Assessment' },
  { id: 'aptitude', label: 'Aptitude test', group: 'Assessment' },
  { id: 'skill', label: 'Skill assessment', group: 'Assessment' },
  { id: 'english', label: 'English / communication check', group: 'Assessment' },
  { id: 'technical', label: 'Technical / coding check', group: 'Assessment' },
  { id: 'mock_ai', label: 'AI mock interview', group: 'Interview' },
  { id: 'mock_hr', label: 'HR mock interview', group: 'Interview' },
  { id: 'competition', label: 'Competition', group: 'Engagement' },
  { id: 'feature', label: 'Feature / module', group: 'Engagement' },
  { id: 'custom', label: 'Custom program', group: 'Engagement' },
];

export function listPrograms() {
  return getOrgWorkspace().programs;
}

export function createProgram(input) {
  return mutate((data) => {
    const now = new Date().toISOString();
    data.programs.unshift({
      id: uid('prg'),
      title: input.title.trim(),
      type: input.type || 'custom',
      audience: input.audience || 'all', // all | department | student
      departmentId: input.departmentId || '',
      studentIds: input.studentIds || [],
      dueInDays: Number(input.dueInDays) || 7,
      status: 'active',
      createdAt: now,
    });
    return data;
  });
}

export function removeProgram(id) {
  return mutate((data) => {
    data.programs = data.programs.filter((p) => p.id !== id);
    return data;
  });
}

/* ── Drives / notifications ──────────────────────────────── */

export function listDrives() {
  return getOrgWorkspace().drives;
}

export function createDrive(input) {
  return mutate((data) => {
    const kind = String(input.kind || input.type || 'event').toLowerCase();
    const title = String(input.title || input.company || '').trim();
    data.drives.unshift({
      id: uid('drv'),
      kind: ['event', 'workshop', 'announcement'].includes(kind) ? kind : 'event',
      title,
      company: title, // legacy field used by older UI/metrics
      role: input.role?.trim() || '',
      date: input.date || '',
      message: input.message?.trim() || '',
      audience: input.audience || 'all', // all | department | hods
      departmentId: input.departmentId || '',
      status: 'scheduled',
      notifiedAt: new Date().toISOString(),
    });
    return data;
  });
}

export function removeDrive(id) {
  return mutate((data) => {
    data.drives = data.drives.filter((d) => d.id !== id);
    return data;
  });
}

/* ── HOD access ──────────────────────────────────────────── */

export function getHodAccess() {
  return getOrgWorkspace().hodAccess;
}

export function updateHodAccess(patch) {
  return mutate((data) => {
    data.hodAccess = { ...data.hodAccess, ...patch };
    return data;
  });
}

/* ── Dashboard metrics ───────────────────────────────────── */

export function getTpoMetrics() {
  const data = getOrgWorkspace();
  const students = data.students;
  const avgReadiness = students.length
    ? Math.round(students.reduce((s, x) => s + (x.readiness || 0), 0) / students.length)
    : 0;
  const strong = students.filter((s) => (s.readiness || 0) >= 75).length;
  const weak = students.filter((s) => (s.readiness || 0) < 50).length;
  const pendingInvites = data.invitations.filter((i) => i.status === 'pending').length;
  const activePrograms = data.programs.filter((p) => p.status === 'active').length;
  const upcomingDrives = data.drives.filter((d) => d.status === 'scheduled').length;

  const byDept = data.departments.map((d) => {
    const deptStudents = students.filter((s) => s.departmentId === d.id);
    const avg = deptStudents.length
      ? Math.round(deptStudents.reduce((s, x) => s + (x.readiness || 0), 0) / deptStudents.length)
      : 0;
    return {
      id: d.id,
      name: d.name,
      code: d.code,
      students: deptStudents.length || d.studentCount || 0,
      avgReadiness: avg,
      hodStatus: d.hodStatus,
    };
  });

  const leaders = [...students]
    .sort((a, b) => (b.readiness || 0) - (a.readiness || 0))
    .slice(0, 8);

  const bands = {
    strong: students.filter((s) => (s.readiness || 0) >= 75).length,
    mid: students.filter((s) => (s.readiness || 0) >= 50 && (s.readiness || 0) < 75).length,
    weak: students.filter((s) => (s.readiness || 0) < 50).length,
  };

  const weaknessCount = {};
  const strengthCount = {};
  students.forEach((s) => {
    if (s.weakness) weaknessCount[s.weakness] = (weaknessCount[s.weakness] || 0) + 1;
    if (s.strength) strengthCount[s.strength] = (strengthCount[s.strength] || 0) + 1;
  });
  const topGaps = Object.entries(weaknessCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label, count]) => ({ label, count }));
  const topStrengths = Object.entries(strengthCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label, count]) => ({ label, count }));

  const programCoverage = data.programs.length
    ? Math.min(100, Math.round((students.length ? activePrograms * 20 : 0)))
    : 0;

  return {
    departments: data.departments.length,
    students: students.length,
    pendingInvites,
    activePrograms,
    upcomingDrives,
    avgReadiness,
    strong,
    weak,
    byDept,
    leaders,
    recentPrograms: data.programs.slice(0, 5),
    recentDrives: data.drives.slice(0, 4),
    bands,
    topGaps,
    topStrengths,
    programCoverage,
    hodGaps: data.departments.filter((d) => d.hodStatus !== 'invited' && d.hodStatus !== 'active').length,
  };
}

/** Department-scoped metrics for HOD / branch mentors. */
export function getHodMetrics(departmentId) {
  const data = getOrgWorkspace();
  const dept = data.departments.find((d) => d.id === departmentId);
  const students = data.students.filter((s) => s.departmentId === departmentId);
  const avgReadiness = students.length
    ? Math.round(students.reduce((s, x) => s + (x.readiness || 0), 0) / students.length)
    : 0;
  const strong = students.filter((s) => (s.readiness || 0) >= 75).length;
  const weak = students.filter((s) => (s.readiness || 0) < 50).length;
  const mid = students.filter(
    (s) => (s.readiness || 0) >= 50 && (s.readiness || 0) < 75
  ).length;
  const pendingInvites = data.invitations.filter(
    (i) => i.status === 'pending' && i.departmentId === departmentId
  ).length;

  const studentIds = new Set(students.map((s) => s.id));
  const programs = data.programs.filter((p) => {
    if (p.audience === 'all') return true;
    if (p.audience === 'department') return p.departmentId === departmentId;
    if (p.audience === 'student') {
      return (p.studentIds || []).some((id) => studentIds.has(id));
    }
    return false;
  });
  const activePrograms = programs.filter((p) => p.status === 'active').length;
  const upcomingDrives = data.drives.filter(
    (d) =>
      d.status === 'scheduled' &&
      (!d.departmentId || d.departmentId === departmentId || d.audience === 'all')
  ).length;

  const leaders = [...students]
    .sort((a, b) => (b.readiness || 0) - (a.readiness || 0))
    .slice(0, 8);

  const atRisk = [...students]
    .filter((s) => (s.readiness || 0) < 50)
    .sort((a, b) => (a.readiness || 0) - (b.readiness || 0))
    .slice(0, 8);

  const bands = { strong, mid, weak };

  const weaknessCount = {};
  const strengthCount = {};
  students.forEach((s) => {
    if (s.weakness) weaknessCount[s.weakness] = (weaknessCount[s.weakness] || 0) + 1;
    if (s.strength) strengthCount[s.strength] = (strengthCount[s.strength] || 0) + 1;
  });
  const topGaps = Object.entries(weaknessCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label, count]) => ({ label, count }));
  const topStrengths = Object.entries(strengthCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label, count]) => ({ label, count }));

  return {
    departmentId,
    departmentName: dept?.name || 'Department',
    departmentCode: dept?.code || '',
    students: students.length,
    pendingInvites,
    activePrograms,
    upcomingDrives,
    avgReadiness,
    strong,
    mid,
    weak,
    leaders,
    atRisk,
    bands,
    topGaps,
    topStrengths,
    recentPrograms: programs.slice(0, 5),
    driveReadyPct: students.length ? Math.round((strong / students.length) * 100) : 0,
  };
}

export function buildLocalBranchInsight(metrics) {
  if (!metrics || !metrics.students) {
    return {
      summary:
        'No students in your branch yet. Invite your batch, then assign aptitude, skill, English, or mock interviews.',
      actions: [
        'Invite students to your department',
        'Assign a readiness or aptitude baseline',
        'Schedule an AI or HR mock for early movers',
      ],
      source: 'heuristic',
    };
  }
  const gap = metrics.topGaps[0];
  const actions = [];
  if (metrics.weak > 0) {
    actions.push(`Pull ${metrics.weak} at-risk student(s) into a technical or aptitude drill`);
  }
  if (gap) {
    actions.push(`Run a focused ${gap.label} session for ${gap.count} student(s)`);
  }
  if (metrics.activePrograms === 0) {
    actions.push('Assign at least one assessment (skill, English, or mock interview)');
  }
  if (metrics.strong > 0 && metrics.upcomingDrives > 0) {
    actions.push(`Nominate ${metrics.strong} drive-ready student(s) for the next company drive`);
  }
  if (!actions.length) {
    actions.push('Keep weekly English + technical checks ahead of placement season');
  }
  return {
    summary: `${metrics.departmentName} avg readiness is ${metrics.avgReadiness}%. ${metrics.strong} drive-ready, ${metrics.weak} need support${
      gap ? `. Top gap: ${gap.label}` : ''
    }.`,
    actions,
    source: 'heuristic',
  };
}

/** Local heuristic insight until OpenAI endpoint is wired. */
export function buildLocalCampusInsight(metrics = getTpoMetrics()) {
  if (!metrics.students) {
    return {
      summary:
        'No enrolled students yet. Invite and approve a cohort, then AI can rank readiness and recommend mocks.',
      actions: ['Create departments', 'Invite HOD mentors', 'Enroll first student batch'],
      source: 'heuristic',
    };
  }
  const gap = metrics.topGaps[0];
  const weakDept = [...(metrics.byDept || [])].sort((a, b) => a.avgReadiness - b.avgReadiness)[0];
  const actions = [];
  if (metrics.weak > 0) actions.push(`Assign AI mock to ${metrics.weak} students below 50% readiness`);
  if (gap) actions.push(`Run a focused ${gap.label} drill for ${gap.count} students`);
  if (weakDept && weakDept.avgReadiness < 60) {
    actions.push(`Escalate ${weakDept.name} (${weakDept.avgReadiness}% avg) to HOD`);
  }
  if (metrics.hodGaps > 0) actions.push(`Invite HOD for ${metrics.hodGaps} department(s) still unassigned`);
  if (!actions.length) actions.push('Maintain weekly readiness tests ahead of next drive');

  return {
    summary: `Campus avg readiness is ${metrics.avgReadiness}%. ${metrics.strong} students are drive-ready; ${metrics.weak} need support${
      gap ? `. Top skill gap: ${gap.label} (${gap.count} students)` : ''
    }.`,
    actions,
    source: 'heuristic',
  };
}
