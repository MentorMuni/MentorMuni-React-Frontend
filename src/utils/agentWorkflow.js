import { SESSION_PLAN, getAllMentors } from './auth';

const WORKFLOW_KEY = 'mm_workflow_state';

export function getWorkflowState(studentId) {
  try {
    const all = JSON.parse(sessionStorage.getItem(WORKFLOW_KEY) || '{}');
    return all[studentId] || null;
  } catch { return null; }
}

function saveWorkflowState(studentId, state) {
  try {
    const all = JSON.parse(sessionStorage.getItem(WORKFLOW_KEY) || '{}');
    all[studentId] = state;
    sessionStorage.setItem(WORKFLOW_KEY, JSON.stringify(all));
  } catch { /* */ }
}

export function initializeStudentWorkflow(studentId) {
  const existing = getWorkflowState(studentId);
  if (existing) return existing;

  const mentors = getAllMentors();
  const primaryMentor = mentors[0];
  const industryExpert = mentors[2];

  const sessions = SESSION_PLAN.map((s, i) => ({
    ...s,
    status: i === 0 ? 'scheduled' : 'pending',
    assignedMentor: s.mode === 'human' || s.mode === 'hybrid'
      ? (s.type === 'industry-expert' ? industryExpert.name : primaryMentor.name)
      : 'Muni AI',
    scheduledDate: i === 0 ? getNextSlot(i) : null,
    completedDate: null,
    feedback: null,
    meetLink: null,
    aiScore: null,
  }));

  const state = {
    studentId,
    assignedMentor: primaryMentor.name,
    assignedMentorId: primaryMentor.id,
    industryExpert: industryExpert.name,
    enrolledAt: Date.now(),
    currentPhase: 'onboarding',
    sessions,
    aiMentorEnabled: true,
    completionPercent: 0,
    nextAction: sessions[0],
    notifications: [
      { id: 'n1', type: 'welcome', message: `Welcome! Your mentor ${primaryMentor.name} has been assigned. Your first AI mock interview is scheduled.`, time: Date.now(), read: false },
      { id: 'n2', type: 'schedule', message: `Mock Interview #1 (AI) scheduled for ${formatDate(getNextSlot(0))}`, time: Date.now(), read: false },
    ],
  };

  saveWorkflowState(studentId, state);
  return state;
}

export function completeSession(studentId, sessionId, feedback) {
  const state = getWorkflowState(studentId);
  if (!state) return null;

  const idx = state.sessions.findIndex(s => s.id === sessionId);
  if (idx === -1) return state;

  state.sessions[idx].status = 'completed';
  state.sessions[idx].completedDate = Date.now();
  state.sessions[idx].feedback = feedback || 'Great session! Keep improving.';
  state.sessions[idx].aiScore = Math.floor(Math.random() * 20) + 75;

  const nextIdx = state.sessions.findIndex(s => s.status === 'pending');
  if (nextIdx !== -1) {
    state.sessions[nextIdx].status = 'scheduled';
    state.sessions[nextIdx].scheduledDate = getNextSlot(nextIdx);
    state.sessions[nextIdx].meetLink = state.sessions[nextIdx].mode !== 'ai'
      ? `https://meet.mentormuni.com/${studentId}-${state.sessions[nextIdx].id}`
      : null;
    state.nextAction = state.sessions[nextIdx];

    state.notifications.unshift({
      id: `n-${Date.now()}`,
      type: 'schedule',
      message: `${state.sessions[nextIdx].label} has been auto-scheduled for ${formatDate(state.sessions[nextIdx].scheduledDate)}`,
      time: Date.now(),
      read: false,
    });
  } else {
    state.nextAction = null;
    state.currentPhase = 'completed';
    state.notifications.unshift({
      id: `n-${Date.now()}`,
      type: 'complete',
      message: 'Congratulations! You have completed all sessions. You are placement ready!',
      time: Date.now(),
      read: false,
    });
  }

  const completed = state.sessions.filter(s => s.status === 'completed').length;
  state.completionPercent = Math.round((completed / state.sessions.length) * 100);
  state.currentPhase = state.completionPercent === 100 ? 'completed' : state.completionPercent > 50 ? 'advanced' : 'in-progress';

  saveWorkflowState(studentId, state);
  return state;
}

export function getCalendarEvents(studentId) {
  const state = getWorkflowState(studentId);
  if (!state) return [];
  return state.sessions
    .filter(s => s.scheduledDate || s.completedDate)
    .map(s => ({
      id: s.id,
      title: s.label,
      date: s.completedDate || s.scheduledDate,
      status: s.status,
      mentor: s.assignedMentor,
      type: s.type,
      meetLink: s.meetLink,
    }));
}

export function getStudentStats(studentId) {
  const state = getWorkflowState(studentId);
  if (!state) return null;
  const completed = state.sessions.filter(s => s.status === 'completed');
  const avgScore = completed.length
    ? Math.round(completed.reduce((a, s) => a + (s.aiScore || 0), 0) / completed.length)
    : 0;
  return {
    totalSessions: state.sessions.length,
    completed: completed.length,
    scheduled: state.sessions.filter(s => s.status === 'scheduled').length,
    pending: state.sessions.filter(s => s.status === 'pending').length,
    avgScore,
    completionPercent: state.completionPercent,
    phase: state.currentPhase,
  };
}

function getNextSlot(offset) {
  const d = new Date();
  d.setDate(d.getDate() + 2 + offset * 3);
  d.setHours(10 + (offset % 3) * 2, 0, 0, 0);
  return d.getTime();
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
