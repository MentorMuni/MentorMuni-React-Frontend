export const ROLES = { ADMIN: 'admin', MENTOR: 'mentor', STUDENT: 'student' };
export const AUTH_KEY = 'mm_auth_session';

const DEMO_USERS = {
  admin: [
    { id: 'ADMIN01', password: 'admin123', name: 'MentorMuni Admin', email: 'admin@mentormuni.com', role: 'admin' },
  ],
  mentor: [
    { id: 'MENTOR01', password: 'mentor123', name: 'Priya Mehta', email: 'priya@mentormuni.com', role: 'mentor', specialty: 'DSA & System Design', rating: 4.9, studentsAssigned: 12, calendarLink: '' },
    { id: 'MENTOR02', password: 'mentor123', name: 'Arjun Patel', email: 'arjun@mentormuni.com', role: 'mentor', specialty: 'Full Stack & HR', rating: 4.8, studentsAssigned: 8, calendarLink: '' },
    { id: 'MENTOR03', password: 'mentor123', name: 'Sneha Gupta', email: 'sneha@mentormuni.com', role: 'mentor', specialty: 'Industry Expert - FAANG', rating: 4.95, studentsAssigned: 5, calendarLink: '' },
  ],
  student: [
    { id: 'STU001', password: 'stu123', name: 'Rahul Sharma', email: 'rahul@college.edu', role: 'student', batch: 'Placement Batch 2026', college: 'IIT Delhi', targetRole: 'Software Engineer', enrolledAt: '2026-06-01' },
    { id: 'STU002', password: 'stu123', name: 'Ananya Singh', email: 'ananya@college.edu', role: 'student', batch: 'Placement Batch 2026', college: 'NIT Trichy', targetRole: 'Backend Engineer', enrolledAt: '2026-06-05' },
    { id: 'STU003', password: 'stu123', name: 'Karthik Reddy', email: 'karthik@college.edu', role: 'student', batch: 'Placement Batch 2026', college: 'BITS Pilani', targetRole: 'Data Engineer', enrolledAt: '2026-06-08' },
  ],
};

export const SESSION_PLAN = [
  { id: 'mock-1', type: 'mock-interview', label: 'Mock Interview #1', mode: 'ai', description: 'AI-powered technical interview simulation', duration: 45 },
  { id: 'mock-2', type: 'mock-interview', label: 'Mock Interview #2', mode: 'ai', description: 'DSA & problem solving round', duration: 45 },
  { id: 'mock-3', type: 'mock-interview', label: 'Mock Interview #3', mode: 'ai', description: 'System design mock with AI feedback', duration: 45 },
  { id: 'mock-4', type: 'mock-interview', label: 'Mock Interview #4', mode: 'hybrid', description: 'Technical round with mentor review', duration: 60 },
  { id: 'mock-5', type: 'mock-interview', label: 'Mock Interview #5', mode: 'human', description: 'Full panel mock with human mentor', duration: 60 },
  { id: 'mentorship-1', type: 'mentorship', label: '1:1 Mentorship #1', mode: 'human', description: 'Career roadmap & gap analysis with assigned mentor', duration: 45 },
  { id: 'mentorship-2', type: 'mentorship', label: '1:1 Mentorship #2', mode: 'human', description: 'Deep-dive on weak areas & placement strategy', duration: 45 },
  { id: 'doubt-1', type: 'doubt-clearing', label: 'Doubt Clearing #1', mode: 'ai', description: 'AI-assisted DSA & concept clearing', duration: 30 },
  { id: 'doubt-2', type: 'doubt-clearing', label: 'Doubt Clearing #2', mode: 'human', description: 'Live session with mentor for unresolved doubts', duration: 30 },
  { id: 'industry-1', type: 'industry-expert', label: 'Industry Expert Session', mode: 'human', description: 'Session with FAANG/industry expert on real interview patterns', duration: 60 },
  { id: 'hr-training', type: 'hr-training', label: 'HR & Communication Training', mode: 'ai', description: 'AI-driven HR prep: tell me about yourself, strengths, salary negotiation', duration: 45 },
  { id: 'hr-mock', type: 'hr-mock', label: 'Mock HR Interview', mode: 'hybrid', description: 'Full HR round simulation with AI + mentor feedback', duration: 45 },
];

export function authenticate(userId, password, role) {
  const id = String(userId || '').trim().toUpperCase();
  const pass = String(password || '');

  // Try demo users first
  const demoUsers = DEMO_USERS[role];
  if (demoUsers) {
    const user = demoUsers.find(u => u.id === id && u.password === pass);
    if (user) {
      const session = { ...user, password: undefined, loginAt: Date.now() };
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(session));
      return { ok: true, user: session };
    }
  }

  // Try custom users from authManager (if available)
  try {
    const authManager = require('./authManager');
    const storedUsers = authManager.getStoredUsers();
    const customUsers = storedUsers[role] || [];
    const user = customUsers.find(u => u.id === id && u.password === pass);
    if (user) {
      const session = { ...user, password: undefined, loginAt: Date.now() };
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(session));
      return { ok: true, user: session };
    }
  } catch (e) {
    // authManager not available, continue
  }

  return { ok: false, error: 'Invalid ID or password.' };
}

export function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(AUTH_KEY));
  } catch { return null; }
}

export function logout() {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem('mm_student_progress');
  sessionStorage.removeItem('mm_workflow_state');
}

export function requireRole(role) {
  const s = getSession();
  return s && s.role === role ? s : null;
}

export function getAllMentors() { return DEMO_USERS.mentor; }
export function getAllStudents() { return DEMO_USERS.student; }
