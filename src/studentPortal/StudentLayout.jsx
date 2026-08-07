/**
 * Shared chrome for every authenticated portal page.
 *
 * Before this existed, Home / Practice / Progress / Company Prep each
 * rendered their own sidebar, topbar and theme state, and each
 * imported the whole stylesheet — four copies of the shell that could
 * drift apart. They now render only their page body into <Outlet/>.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getStudentSession, isStudentAuthenticated } from './auth';
import { studentPaths } from './paths';
import { useStudentPortalCanvas, useStudentTheme } from './useStudentTheme.jsx';
import { getStreakWeekDots, getStudentStreak } from './streak';
import { fetchUpcomingDrives } from './drives';
import { StudentShellContext } from './shellContext';

import StudentSidebar from './components/home/StudentSidebar';
import StudentTopbar from './components/home/StudentTopbar';

import './styles/portal.css';

export default function StudentLayout() {
  const session = getStudentSession();
  const authed = isStudentAuthenticated();
  const { theme } = useStudentTheme();
  const [navOpen, setNavOpen] = useState(false);

  const userKey = session?.id || session?.email || 'anon';

  // Streak lives in localStorage, so the initial read is synchronous —
  // no mount effect needed. Pages call refreshStreak() after recording
  // a session.
  const [streakState, setStreakState] = useState(() => ({
    streak: getStudentStreak(userKey),
    weekDots: getStreakWeekDots(userKey),
  }));
  const [nextDrive, setNextDrive] = useState(null);

  useStudentPortalCanvas(theme);

  const refreshStreak = useCallback(() => {
    setStreakState({
      streak: getStudentStreak(userKey),
      weekDots: getStreakWeekDots(userKey),
    });
  }, [userKey]);

  // One drive fetch for the whole shell: the topbar chip and the home
  // page's campus sections read the same result instead of inventing
  // their own. fetchUpcomingDrives never rejects — a failure resolves
  // to the demo shape, and surfaces label it as a sample.
  useEffect(() => {
    if (!authed) return undefined;
    let cancelled = false;
    fetchUpcomingDrives().then((drives) => {
      if (!cancelled) setNextDrive(drives.nearest || null);
    });
    return () => {
      cancelled = true;
    };
  }, [authed]);

  const shell = useMemo(
    () => ({
      session,
      userKey,
      streak: streakState.streak,
      weekDots: streakState.weekDots,
      refreshStreak,
      nextDrive,
    }),
    [session, userKey, streakState, refreshStreak, nextDrive]
  );

  if (!authed || !session) {
    return <Navigate to={studentPaths.login} replace />;
  }

  return (
    <div className="stu-app stu-app--page" data-theme={theme}>
      <StudentSidebar
        session={session}
        open={navOpen}
        onClose={() => setNavOpen(false)}
        streak={streakState.streak.consecutiveDays}
        weekDots={streakState.weekDots}
      />

      <div className="stu-shell">
        <StudentTopbar
          session={session}
          onMenu={() => setNavOpen(true)}
          nextDrive={nextDrive}
        />

        <StudentShellContext.Provider value={shell}>
          <Outlet />
        </StudentShellContext.Provider>
      </div>
    </div>
  );
}
