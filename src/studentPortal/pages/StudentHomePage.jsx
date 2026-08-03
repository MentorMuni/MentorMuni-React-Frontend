import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentSession, isStudentAuthenticated } from '../auth';
import { studentPaths } from '../paths';
import { useStudentTheme } from '../useStudentTheme.jsx';

import StudentSidebar from '../components/home/StudentSidebar';
import StudentTopbar from '../components/home/StudentTopbar';
import GreetingSection from '../components/home/GreetingSection';
import PlacementReadinessHero from '../components/home/PlacementReadinessHero';
import TodaysPlanSection from '../components/home/TodaysPlanSection';
import PlacementJourneySection from '../components/home/PlacementJourneySection';
import ProgressMetricsSection from '../components/home/ProgressMetricsSection';
import UpcomingSection from '../components/home/UpcomingSection';
import CompaniesSection from '../components/home/CompaniesSection';
import MentorCoachSection from '../components/home/MentorCoachSection';
import LeaderboardSection from '../components/home/LeaderboardSection';

import '../styles/student-home.css';

const READINESS = 47;

export default function StudentHomePage() {
  const navigate = useNavigate();
  const session = getStudentSession();
  const { theme, toggle, rootClass } = useStudentTheme();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!isStudentAuthenticated()) {
      navigate(studentPaths.login, { replace: true });
    }
  }, [navigate]);

  if (!session) return null;

  return (
    <div className={`stu-app ${rootClass}`}>
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

        {/* No entrance choreography: this is a tool people open every day,
            so content paints immediately. Motion is reserved for
            interaction feedback and the readiness ring. */}
        <main className="stu-main">
          <GreetingSection
            studentName={session.name}
            collegeName={session.organization_name}
            departmentName={session.department_name}
          />

          <PlacementReadinessHero
            currentReadiness={READINESS}
            previousReadiness={41}
            targetReadiness={85}
            estimatedDays={38}
          />

          <div className="stu-grid">
            <div className="stu-grid__col stu-grid__col--main">
              <TodaysPlanSection currentReadiness={READINESS} />
              <PlacementJourneySection />
              <ProgressMetricsSection />
              <UpcomingSection />
            </div>

            <div className="stu-grid__col stu-grid__col--rail">
              <MentorCoachSection studentName={session.name} />
              <CompaniesSection />
              <LeaderboardSection />
            </div>
          </div>

          {/* Rendered as a div, not <footer>: the global marketing theme
              paints every <footer> with an !important dark background. */}
          <div className="stu-foot" role="contentinfo">
            <p>Small daily improvements lead to stunning placement results. Keep showing up.</p>
            <span>© {new Date().getFullYear()} MentorMuni</span>
          </div>
        </main>
      </div>
    </div>
  );
}
