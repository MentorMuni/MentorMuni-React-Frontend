import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { clearStudentSession, getStudentSession, isStudentAuthenticated, studentMustChangePassword } from './auth';
import { isIndividualStudent } from './accountType';
import { studentPaths } from './paths';
import { useStudentPortalCanvas, useStudentTheme } from './useStudentTheme.jsx';
import { getStreakWeekDots, getStudentStreak } from './streak';
import { fetchUpcomingDrives } from './drives';
import { StudentShellContext } from './shellContext';

import StudentSidebar from './components/home/StudentSidebar';
import StudentTopbar from './components/home/StudentTopbar';
import StudentPortalBusy from './components/StudentPortalBusy';
import PlacementOnboarding from './components/PlacementOnboarding';
import IdleSessionGuard from '../components/IdleSessionGuard';
import { needsPlacementOnboarding } from './placementProfile';
import { fetchStudentTarget } from './targetApi';
import { studentApiBusy, useApiBusy } from '../lib/apiBusy';
import { useAuthGateRerender } from '../lib/sessionGuards';
import { whiteboardApi } from './whiteboardApi';

import '../components/table/table-query.css';
import './styles/portal.css';
import './styles/placement-onboarding.css';

export default function StudentLayout() {
  useAuthGateRerender();
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
  const [onboardingOpen, setOnboardingOpen] = useState(() => needsPlacementOnboarding(userKey));
  const apiBusy = useApiBusy(studentApiBusy);

  useStudentPortalCanvas(theme);

  const refreshStreak = useCallback(() => {
    setStreakState({
      streak: getStudentStreak(userKey),
      weekDots: getStreakWeekDots(userKey),
    });
  }, [userKey]);

  useEffect(() => {
    if (!authed) return undefined;
    let cancelled = false;
    fetchStudentTarget({ userKey })
      .then((target) => {
        if (cancelled) return;
        if (target.onboarding_completed) {
          setOnboardingOpen(false);
        } else if (needsPlacementOnboarding(userKey)) {
          setOnboardingOpen(true);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [authed, userKey]);

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

  // Mobile drawer: Escape closes; lock body scroll while open.
  useEffect(() => {
    if (!navOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setNavOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [navOpen]);

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

  // Campus drives / company intel are college-only — block deep-links for individuals.
  if (isIndividualStudent(session)) {
    const path = location.pathname || '';
    if (
      path.includes('/studentportal/companies') ||
      path.includes('/studentportal/company-prep')
    ) {
      return <Navigate to={studentPaths.home} replace />;
    }
  }

  return (
    <IdleSessionGuard
      isAuthenticated={isStudentAuthenticated}
      clearSession={clearStudentSession}
      loginPath={studentPaths.login}
      portalLabel="student portal"
    >
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

        {apiBusy && !hideGlobalBusy ? <StudentPortalBusy /> : null}

        {onboardingOpen ? (
          <PlacementOnboarding
            userKey={userKey}
            onComplete={() => setOnboardingOpen(false)}
          />
        ) : null}
      </div>
    </IdleSessionGuard>
  );
}
