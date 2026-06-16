import { ROLES } from './auth';

const STORAGE_KEY = 'mm_custom_users';

export function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { return {}; }
}

function saveStoredUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function createStudentCredential(userData) {
  const { name, email, college, targetRole, batch } = userData;
  const id = `STU${String(Date.now()).slice(-6)}`;
  const password = `${id.toLowerCase()}${Math.random().toString(36).slice(2, 8)}`;

  const users = getStoredUsers();
  if (!users.student) users.student = [];

  const student = {
    id,
    password,
    name,
    email,
    role: 'student',
    college,
    targetRole,
    batch,
    createdAt: Date.now(),
  };

  users.student.push(student);
  saveStoredUsers(users);

  return { ...student, password };
}

export function createMentorCredential(mentorData) {
  const { name, email, specialty, rating = 4.8, calendarLink = '' } = mentorData;
  const id = `MENTOR${String(Date.now()).slice(-5)}`;
  const password = `${id.toLowerCase()}${Math.random().toString(36).slice(2, 8)}`;

  const users = getStoredUsers();
  if (!users.mentor) users.mentor = [];

  const mentor = {
    id,
    password,
    name,
    email,
    role: 'mentor',
    specialty,
    rating,
    studentsAssigned: 0,
    calendarLink,
    createdAt: Date.now(),
  };

  users.mentor.push(mentor);
  saveStoredUsers(users);

  return { ...mentor, password };
}

export function getAllStoredStudents() {
  const users = getStoredUsers();
  return users.student || [];
}

export function getAllStoredMentors() {
  const users = getStoredUsers();
  return users.mentor || [];
}

export function deleteStudent(studentId) {
  const users = getStoredUsers();
  users.student = (users.student || []).filter(s => s.id !== studentId);
  saveStoredUsers(users);
}

export function deleteMentor(mentorId) {
  const users = getStoredUsers();
  users.mentor = (users.mentor || []).filter(m => m.id !== mentorId);
  saveStoredUsers(users);
}

export function updateMentorCalendar(mentorId, calendarLink) {
  const users = getStoredUsers();
  const mentor = (users.mentor || []).find(m => m.id === mentorId);
  if (mentor) {
    mentor.calendarLink = calendarLink;
    saveStoredUsers(users);
  }
}

export function assignMentorToStudent(studentId, mentorId) {
  const users = getStoredUsers();
  const assignments = JSON.parse(localStorage.getItem('mm_mentor_assignments') || '{}');
  assignments[studentId] = mentorId;
  localStorage.setItem('mm_mentor_assignments', JSON.stringify(assignments));
}

export function getStudentMentor(studentId) {
  const assignments = JSON.parse(localStorage.getItem('mm_mentor_assignments') || '{}');
  return assignments[studentId] || null;
}
