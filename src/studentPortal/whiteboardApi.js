import { studentApi } from './studentApi';
import { whiteboardLocal } from './whiteboardLocal';

const BASE = '/student/whiteboard';

function userKeyFromSession(session) {
  return session?.id || session?.email || 'anon';
}

async function withLocal(session, remote, local) {
  try {
    return await remote();
  } catch (err) {
    if (studentApi.isDemoOrLocalToken()) return local();
    throw err;
  }
}

export const whiteboardApi = {
  getBoard(session, { silent = false } = {}) {
    return withLocal(
      session,
      () => studentApi.get(BASE, { silent }),
      () => whiteboardLocal.getBoard(userKeyFromSession(session)),
    );
  },

  ensureMorning(session) {
    return withLocal(
      session,
      () => studentApi.post(`${BASE}/morning`, {}, { silent: true }),
      () => whiteboardLocal.getBoard(userKeyFromSession(session)),
    );
  },

  createNote(session, body) {
    return withLocal(
      session,
      () => studentApi.post(`${BASE}/notes`, body),
      () => whiteboardLocal.createNote(userKeyFromSession(session), body),
    );
  },

  updateNote(session, noteId, body) {
    return withLocal(
      session,
      () => studentApi.patch(`${BASE}/notes/${noteId}`, body),
      () => whiteboardLocal.updateNote(userKeyFromSession(session), noteId, body),
    );
  },

  resolveNote(session, noteId) {
    return withLocal(
      session,
      () => studentApi.post(`${BASE}/notes/${noteId}/resolve`, {}),
      () => whiteboardLocal.resolveNote(userKeyFromSession(session), noteId),
    );
  },

  reopenNote(session, noteId) {
    return withLocal(
      session,
      () => studentApi.post(`${BASE}/notes/${noteId}/reopen`, {}),
      () => whiteboardLocal.reopenNote(userKeyFromSession(session), noteId),
    );
  },

  getMentorship(session, mentorshipDate) {
    return withLocal(
      session,
      () => studentApi.get(`${BASE}/mentorships/${mentorshipDate}`),
      () => whiteboardLocal.getMentorship(userKeyFromSession(session), mentorshipDate),
    );
  },
};
