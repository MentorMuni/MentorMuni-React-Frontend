/**
 * Shared chrome for every authenticated portal page.
 *
 * Before this existed, Home / Practice / Progress / Company Prep each
 * rendered their own sidebar, topbar and theme state, and each
 * imported the whole stylesheet — four copies of the shell that could
 * drift apart. They now render only their page body into <Outlet/>.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getStudentSession, isStudentAuthenticated, studentMustChangePassword } from './auth';
import { isIndividualStudent } from './accountType';
import { studentPaths } from './paths';
import { useStudentPortalCanvas, useStudentTheme } from './useStudentTheme.jsx';
import { getStreakWeekDots, getStudentStreak } from './streak';
import { fetchUpcomingDrives } from './drives';
import { StudentShellContext } from './shellContext';

import StudentSidebar from './components/home/StudentSidebar';
import StudentTopbar from './components/home/StudentTopbar';
import FearToFearlessInProgress from './components/FearToFearlessInProgress';
import { studentApiBusy, useApiBusy } from '../lib/apiBusy';
import { whiteboardApi } from './whiteboardApi';

import './styles/portal.css';

export default function StudentLayout() {
  const session = getStudentSession();
  const authed = isStudentAuthenticated();
  const location = useLocation();
  const { theme } = useStudentTheme();
  const onFearToFearless = /fear-to-fearless|know-me/.test(location.pathname || '');
  const hideGlobalBusy = onFearToFearless || /whiteboard/.test(location.pathname || '');
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
  const apiBusy = useApiBusy(studentApiBusy);

  useStudentPortalCanvas(theme);

  const refreshStreak = useCallback(() => {
    setStreakState({
      streak: getStudentStreak(userKey),
      weekDots: getStreakWeekDots(userKey),
    });
  }, [userKey]);

  // Campus drives are college-only. Skip for individual (PUBLIC) students.
  useEffect(() => {
    if (!authed) return undefined;
    if (isIndividualStudent(session)) {
      setNextDrive(null);
      return undefined;
    }
    let cancelled = false;
    fetchUpcomingDrives().then((drives) => {
      if (!cancelled) setNextDrive(drives.nearest || null);
    });
    return () => {
      cancelled = true;
    };
  }, [authed, session?.organization_type, session?.organization_code, session?.is_individual]);

  // One morning mentorship per IST day — generated on first portal open, not a cron.
  useEffect(() => {
    if (!authed || !session) return undefined;
    whiteboardApi.ensureMorning(session).catch(() => {});
    return undefined;
  }, [authed, session?.id]);

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

  const onChangePassword = /\/change-password\/?$/.test(location.pathname || '');
  if (studentMustChangePassword(session) && !onChangePassword) {
    return <Navigate to={studentPaths.changePassword} replace />;
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

      {apiBusy && !hideGlobalBusy ? <FearToFearlessInProgress session={session} /> : null}
    </div>
  );
}
