/**
 * Shell state shared from StudentLayout down to page bodies.
 *
 * Lives in its own module so StudentLayout.jsx exports only a
 * component (React Fast Refresh requires that).
 */

import { createContext, useContext } from 'react';

const EMPTY_STREAK = { consecutiveDays: 0, sessionsToday: 0, practicedToday: false };

export const StudentShellContext = createContext({
  session: null,
  userKey: 'anon',
  streak: EMPTY_STREAK,
  weekDots: [],
  refreshStreak: () => {},
  nextDrive: null,
});

export function useStudentShell() {
  return useContext(StudentShellContext);
}
