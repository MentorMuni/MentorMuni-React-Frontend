/**
 * TEMP demo login — remove when real TPO/HOD accounts are live.
 * Credentials (any college step; DEMO college is auto-added):
 *   TPO  → tpo@demo.edu  / Demo@123
 *   HOD  → hod@demo.edu  / Demo@123
 */

export const DEMO_ORG = {
  id: 'demo-org',
  code: 'DEMO',
  name: 'MentorMuni Demo College',
  city: 'Bengaluru',
  state: 'Karnataka',
};

export const DEMO_DEPT_ID = 'dept_cse_demo';

/** @type {Array<{ email: string, password: string, role: string, name: string, department_id?: string }>} */
export const DEMO_USERS = [
  {
    email: 'tpo@demo.edu',
    password: 'Demo@123',
    role: 'ORG_ADMIN',
    name: 'Demo TPO',
  },
  {
    email: 'hod@demo.edu',
    password: 'Demo@123',
    role: 'DEPARTMENT_ADMIN',
    name: 'Demo HOD',
    department_id: DEMO_DEPT_ID,
  },
];

export function matchDemoUser(userId, password) {
  const id = String(userId || '').trim().toLowerCase();
  const pass = String(password || '');
  return (
    DEMO_USERS.find(
      (u) => (u.email === id || u.email.split('@')[0] === id) && u.password === pass
    ) || null
  );
}

export function isDemoSession(session) {
  return Boolean(session?.demo === true || session?.organization_id === DEMO_ORG.id);
}
