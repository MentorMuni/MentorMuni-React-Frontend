const MENTOR_STATS_KEY = 'mm_mentor_stats';
const STUDENT_STATS_KEY = 'mm_student_stats';

export function getMentorStats(mentorId) {
  try {
    const all = JSON.parse(sessionStorage.getItem(MENTOR_STATS_KEY) || '{}');
    return all[mentorId] || {
      mentorId,
      totalSessions: 0,
      completedSessions: 0,
      mockInterviews: 0,
      mentorshipSessions: 0,
      doubtClearing: 0,
      studentsFeedback: [],
      avgRating: 0,
      joinDate: Date.now(),
    };
  } catch { return null; }
}

export function getStudentStats(studentId) {
  try {
    const all = JSON.parse(sessionStorage.getItem(STUDENT_STATS_KEY) || '{}');
    return all[studentId] || {
      studentId,
      totalSessions: 0,
      completedSessions: 0,
      avgScore: 0,
      joinDate: Date.now(),
      enrollmentPhase: 'onboarding',
    };
  } catch { return null; }
}

export function updateMentorSession(mentorId, sessionType) {
  try {
    const all = JSON.parse(sessionStorage.getItem(MENTOR_STATS_KEY) || '{}');
    if (!all[mentorId]) {
      all[mentorId] = {
        mentorId,
        totalSessions: 0,
        completedSessions: 0,
        mockInterviews: 0,
        mentorshipSessions: 0,
        doubtClearing: 0,
        studentsFeedback: [],
        avgRating: 0,
        joinDate: Date.now(),
      };
    }
    all[mentorId].totalSessions += 1;
    all[mentorId].completedSessions += 1;
    if (sessionType === 'mock-interview') all[mentorId].mockInterviews += 1;
    else if (sessionType === 'mentorship') all[mentorId].mentorshipSessions += 1;
    else if (sessionType === 'doubt-clearing') all[mentorId].doubtClearing += 1;
    sessionStorage.setItem(MENTOR_STATS_KEY, JSON.stringify(all));
  } catch { /* */ }
}

export function addMentorFeedback(mentorId, studentName, score, feedback) {
  try {
    const all = JSON.parse(sessionStorage.getItem(MENTOR_STATS_KEY) || '{}');
    if (!all[mentorId]) {
      all[mentorId] = {
        mentorId,
        totalSessions: 0,
        completedSessions: 0,
        mockInterviews: 0,
        mentorshipSessions: 0,
        doubtClearing: 0,
        studentsFeedback: [],
        avgRating: 0,
        joinDate: Date.now(),
      };
    }
    all[mentorId].studentsFeedback.push({ studentName, score, feedback, date: Date.now() });
    const scores = all[mentorId].studentsFeedback.map(f => f.score);
    all[mentorId].avgRating = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    sessionStorage.setItem(MENTOR_STATS_KEY, JSON.stringify(all));
  } catch { /* */ }
}

export function updateStudentStats(studentId, sessionsCount, avgScore, phase) {
  try {
    const all = JSON.parse(sessionStorage.getItem(STUDENT_STATS_KEY) || '{}');
    all[studentId] = {
      studentId,
      totalSessions: sessionsCount,
      completedSessions: Math.floor(sessionsCount * 0.3),
      avgScore: avgScore || 0,
      joinDate: Date.now(),
      enrollmentPhase: phase || 'in-progress',
    };
    sessionStorage.setItem(STUDENT_STATS_KEY, JSON.stringify(all));
  } catch { /* */ }
}
