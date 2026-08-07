/**
 * TEMP demo login — remove when real TPO/HOD accounts are live.
 * Credentials (any college step; DEMO college is auto-added):
 *   TPO  → tpo@demo.edu  / Demo@123
 *   HOD  → hod@demo.edu  / Demo@123
 *   Placement Coordinators created via Departments invite also work after activate
 *   (password from activation form, stored in localStorage).
 */

export const DEMO_ORG = {
  id: 'demo-org',
  code: 'DEMO',
  name: 'MentorMuni Demo College',
  city: 'Bengaluru',
  state: 'Karnataka',
};

export const DEMO_DEPT_ID = 'dept_cse_demo';

const ACTIVATED_MENTORS_KEY = 'mm-org-demo-mentors-v1';

/** @type {Array<{ email: string, password: string, role: string, name: string, department_id?: string, dept_admin_title?: string, role_label?: string }>} */
export const DEMO_USERS = [
  {
    email: 'tpo@demo.edu',
    password: 'Demo@123',
    role: 'TPO',
    name: 'Demo TPO',
  },
  {
    email: 'hod@demo.edu',
    password: 'Demo@123',
    role: 'HOD',
    name: 'Demo HOD',
    department_id: DEMO_DEPT_ID,
    dept_admin_title: 'HOD',
    role_label: 'HOD',
  },
];

function readActivatedMentors() {
  try {
    const raw = localStorage.getItem(ACTIVATED_MENTORS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeActivatedMentors(list) {
  localStorage.setItem(ACTIVATED_MENTORS_KEY, JSON.stringify(list));
}

/**
 * Register a demo mentor after /activate-hod local path so they can sign in.
 */
export function registerActivatedDemoMentor({
  email,
  password,
  name = '',
  departmentId = '',
  slot = 'hod',
} = {}) {
  const emailNorm = String(email || '')
    .trim()
    .toLowerCase();
  const pass = String(password || '');
  if (!emailNorm || pass.length < 8) return { ok: false };

  const isCoordinator = slot === 'coordinator';
  const next = {
    email: emailNorm,
    password: pass,
    role: 'HOD',
    name: String(name || '').trim() || (isCoordinator ? 'Placement Coordinator' : 'HOD'),
    department_id: departmentId || DEMO_DEPT_ID,
    dept_admin_title: isCoordinator ? 'PLACEMENT_COORDINATOR' : 'HOD',
    role_label: isCoordinator ? 'Placement Coordinator' : 'HOD',
  };

  const list = readActivatedMentors().filter((u) => u.email !== emailNorm);
  list.push(next);
  writeActivatedMentors(list);
  return { ok: true, user: next };
}

export function matchDemoUser(userId, password) {
  const id = String(userId || '').trim().toLowerCase();
  const pass = String(password || '');
  const builtIn =
    DEMO_USERS.find(
      (u) => (u.email === id || u.email.split('@')[0] === id) && u.password === pass
    ) || null;
  if (builtIn) return builtIn;

  return (
    readActivatedMentors().find(
      (u) => (u.email === id || u.email.split('@')[0] === id) && u.password === pass
    ) || null
  );
}

export function isDemoSession(session) {
  return Boolean(session?.demo === true || session?.organization_id === DEMO_ORG.id);
}
