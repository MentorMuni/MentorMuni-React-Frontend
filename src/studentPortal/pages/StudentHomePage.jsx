import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentSession, isStudentAuthenticated } from '../auth';
import { studentPaths } from '../paths';
import { useStudentTheme } from '../useStudentTheme.jsx';

import StudentSidebar from '../components/home/StudentSidebar';
import StudentTopbar from '../components/home/StudentTopbar';
import GreetingSection from '../components/home/GreetingSection';
import QuickStats from '../components/home/QuickStats';
import PlacementPathHero from '../components/home/PlacementPathHero';
import PlacementReadinessHero from '../components/home/PlacementReadinessHero';
import TodaysPlanSection from '../components/home/TodaysPlanSection';
import AiMentorHero from '../components/home/AiMentorHero';
import PlacementJourneySection from '../components/home/PlacementJourneySection';
import UpcomingSection from '../components/home/UpcomingSection';
import CompaniesSection from '../components/home/CompaniesSection';
import LeaderboardSection from '../components/home/LeaderboardSection';

import '../styles/student-home.css';

const READINESS = 47;

/**
 * Ordered by the questions a student actually arrives with:
 *
 *   1. Am I on track?          → three glanceable tiles
 *   2. What do I do right now? → today's plan beside the readiness score
 *   3. I'm stuck, help me      → the AI voice mentor, given hero weight
 *   4. Where is this going?    → the 90-day journey + what's coming up
 *   5. What am I aiming at?    → companies and the people around me
 *
 * Widget size is deliberately uneven. Making every section a large card
 * flattens the hierarchy and the page stops telling you where to look.
 */
export default function StudentHomePage() {
  const navigate = useNavigate();
  const session = getStudentSession();
  const { theme, toggle, rootClass } = useStudentTheme();
  const [navOpen, setNavOpen] = useState(false);

  /* Lifted so finishing a task visibly moves the readiness number and the
     streak tile — the reward loop is the reason to come back tomorrow. */
  const [todayGain, setTodayGain] = useState(0);
  const [dayDone, setDayDone] = useState(false);
  const celebrated = useRef(false);

  const handleGain = useCallback((gain, allDone) => {
    setTodayGain(gain);
    setDayDone(allDone);

    /* Finishing the day used to change a line of text and nothing else.
       For a 21-year-old building a habit, that moment needs to land. */
    if (allDone && !celebrated.current) {
      celebrated.current = true;
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        import('canvas-confetti')
          .then(({ default: confetti }) =>
            confetti({
              particleCount: 90,
              spread: 68,
              startVelocity: 34,
              origin: { y: 0.7 },
              colors: ['#46d4ee', '#1183c4', '#f0ad4a', '#16a34a'],
              disableForReducedMotion: true,
            })
          )
          .catch(() => {});
      }
    }
    if (!allDone) celebrated.current = false;
  }, []);

  useEffect(() => {
    if (!isStudentAuthenticated()) {
      navigate(studentPaths.login, { replace: true });
    }
  }, [navigate]);

  if (!session) return null;

  return (
    <div className={`stu-app stu-app--page ${rootClass}`}>
      <StudentSidebar
        session={session}
        open={navOpen}
        onClose={() => setNavOpen(false)}
        streak={18}
      />

      <div className="stu-shell">
        <StudentTopbar
          session={session}
          onMenu={() => setNavOpen(true)}
          theme={theme}
          onToggleTheme={toggle}
        />

        <main className="stu-main">
          <GreetingSection studentName={session.name} />

          {/* Orientation first: what this is, where you are, what to do now. */}
          <PlacementPathHero
            currentStep={3}
            day={34}
            totalDays={90}
            nextTask={{
              title: 'Resume fix: quantify your impact',
              minutes: 15,
              why: 'biggest score gain today',
            }}
          />

          <QuickStats streak={18} streakSafeToday={todayGain > 0} daysToDrive={14} dayDone={dayDone} />

          {/* Do this now */}
          <div className="stu-start-grid">
            <TodaysPlanSection currentReadiness={READINESS} onGain={handleGain} />
            <PlacementReadinessHero
              currentReadiness={READINESS}
              previousReadiness={41}
              targetReadiness={85}
              estimatedDays={38}
              todayGain={todayGain}
              expectedByNow={45}
              weekLabel="week 3"
            />
          </div>

          {/* The flagship — full width, because it is the reason to stay */}
          <AiMentorHero studentName={session.name} weakest="English communication" />

          {/* Where this is going */}
          <div className="stu-path-grid">
            <PlacementJourneySection />
            <UpcomingSection />
          </div>

          {/* What you're aiming at */}
          <div className="stu-pair-grid">
            <CompaniesSection />
            <LeaderboardSection />
          </div>

          <div className="stu-foot" role="contentinfo">
            <p>One task today keeps the streak — and moves the number.</p>
            <span>© {new Date().getFullYear()} MentorMuni</span>
          </div>
        </main>
      </div>
    </div>
  );
}
