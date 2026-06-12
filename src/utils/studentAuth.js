export const STUDENT_DEMO_ID = 'MM101';
export const STUDENT_DEMO_PASSWORD = 'MM101';
export const STUDENT_SESSION_KEY = 'mm_student_session';
export const STUDENT_PROGRESS_KEY = 'mm_student_progress';

export const DEFAULT_STUDENT_PROFILE = {
  studentId: STUDENT_DEMO_ID,
  name: 'Rahul Sharma',
  email: 'rahul.sharma@college.edu',
  batch: 'Placement Batch 2026',
  college: 'Engineering College',
  mentor: 'Priya Mehta',
  targetRole: 'Software Engineer',
};

export const STUDENT_BENEFITS = [
  {
    id: 'mentorship',
    title: '1:1 Mentorship Sessions',
    total: 3,
    icon: 'users',
    desc: 'Personal roadmap, gap analysis, and accountability with your mentor.',
  },
  {
    id: 'mocks',
    title: 'Mock Interviews',
    subtitle: 'AI + mentors',
    total: 5,
    icon: 'mic',
    desc: 'Technical, HR, and mixed rounds with instant AI + mentor feedback.',
  },
  {
    id: 'doubts',
    title: 'Doubt Clearing Sessions',
    total: 4,
    icon: 'help',
    desc: 'Live sessions to unblock DSA, projects, and interview concepts.',
  },
  {
    id: 'placement-drive',
    title: 'Expert Placement Drive Session',
    total: 1,
    icon: 'building',
    desc: 'Insider tips from experts who have run campus placement drives.',
  },
  {
    id: 'interview-mock',
    title: '1 hr Full Interview Mock',
    total: 1,
    icon: 'clock',
    desc: 'End-to-end panel simulation — technical + HR in one deep session.',
  },
];

export const DEFAULT_PROGRESS = {
  mentorship: 1,
  mocks: 2,
  doubts: 1,
  'placement-drive': 0,
  'interview-mock': 0,
};

export const FEEDBACK_THREADS = [
  {
    id: 'mock-1',
    title: 'Mock Interview #2',
    mentor: 'Priya Mehta',
    lastActive: '2 hours ago',
    messages: [
      {
        id: 'm1',
        role: 'mentor',
        text: 'Great structure on the LRU cache answer. Next time, lead with time/space complexity before diving into code.',
        time: 'Yesterday, 4:30 PM',
      },
      {
        id: 'm2',
        role: 'student',
        text: 'Thanks! Should I practice more graph problems before the next mock?',
        time: 'Yesterday, 5:10 PM',
      },
      {
        id: 'm3',
        role: 'mentor',
        text: 'Yes — focus on BFS/DFS patterns. I\'ll share 5 company-specific questions in our next 1:1.',
        time: 'Yesterday, 5:45 PM',
      },
    ],
  },
  {
    id: 'dsa-doubt',
    title: 'DSA — Binary Trees',
    mentor: 'Priya Mehta',
    lastActive: '1 day ago',
    messages: [
      {
        id: 'm1',
        role: 'student',
        text: 'I get confused on iterative vs recursive tree traversals in interviews.',
        time: 'Mon, 11:00 AM',
      },
      {
        id: 'm2',
        role: 'mentor',
        text: 'Start with recursion for clarity in interviews, then mention you can optimize with a stack for in-order. Want to walk through one example live in doubt clearing?',
        time: 'Mon, 11:30 AM',
      },
    ],
  },
  {
    id: 'hr-comm',
    title: 'HR & Communication',
    mentor: 'Muni AI + Priya',
    lastActive: '3 days ago',
    messages: [
      {
        id: 'm1',
        role: 'mentor',
        text: 'Your "Tell me about yourself" runs 2:40 — trim to 90 seconds. Lead with role + one quantified win.',
        time: 'Fri, 6:00 PM',
      },
      {
        id: 'm2',
        role: 'student',
        text: 'Recorded a new version — pacing feels better. Can you review?',
        time: 'Sat, 10:00 AM',
      },
      {
        id: 'm3',
        role: 'mentor',
        text: 'Much better! Confidence up 20%. Schedule your next AI communication check before Mock #3.',
        time: 'Sat, 2:15 PM',
      },
    ],
  },
];

export function authenticateStudent(studentId, password) {
  const id = String(studentId || '').trim().toUpperCase();
  const pass = String(password || '');
  if (id === STUDENT_DEMO_ID && pass === STUDENT_DEMO_PASSWORD) {
    sessionStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(DEFAULT_STUDENT_PROFILE));
    if (!sessionStorage.getItem(STUDENT_PROGRESS_KEY)) {
      sessionStorage.setItem(STUDENT_PROGRESS_KEY, JSON.stringify(DEFAULT_PROGRESS));
    }
    return { ok: true, profile: DEFAULT_STUDENT_PROFILE };
  }
  return { ok: false, error: 'Invalid student ID or password.' };
}

export function getStudentSession() {
  try {
    const raw = sessionStorage.getItem(STUDENT_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearStudentSession() {
  sessionStorage.removeItem(STUDENT_SESSION_KEY);
}

export function getStudentProgress() {
  try {
    const raw = sessionStorage.getItem(STUDENT_PROGRESS_KEY);
    return raw ? { ...DEFAULT_PROGRESS, ...JSON.parse(raw) } : { ...DEFAULT_PROGRESS };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveStudentProgress(progress) {
  sessionStorage.setItem(STUDENT_PROGRESS_KEY, JSON.stringify(progress));
}
