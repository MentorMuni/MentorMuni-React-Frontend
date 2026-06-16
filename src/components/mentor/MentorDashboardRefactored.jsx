import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requireRole } from '../../utils/auth';
import MentorLayout from './MentorLayout';

// Import section components
import DashboardSection from './sections/DashboardSection';
import StudentsSection from './sections/StudentsSection';
import ScheduleSection from './sections/ScheduleSection';
import SessionsSection from './sections/SessionsSection';
import EarningsSection from './sections/EarningsSection';
import AnalyticsSection from './sections/AnalyticsSection';
import ReviewsSection from './sections/ReviewsSection';

function MentorDashboardContent({ mentor, currentSection, setCurrentSection, currentTab, setCurrentTab }) {
  const sectionProps = {
    mentor,
    currentTab,
    onTabChange: setCurrentTab,
  };

  switch (currentSection) {
    case 'dashboard':
      return <DashboardSection {...sectionProps} />;
    case 'students':
      return <StudentsSection {...sectionProps} />;
    case 'schedule':
      return <ScheduleSection {...sectionProps} />;
    case 'sessions':
      return <SessionsSection {...sectionProps} />;
    case 'earnings':
      return <EarningsSection {...sectionProps} />;
    case 'analytics':
      return <AnalyticsSection {...sectionProps} />;
    case 'reviews':
      return <ReviewsSection {...sectionProps} />;
    default:
      return <DashboardSection {...sectionProps} />;
  }
}

export default function MentorDashboardRefactored() {
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [currentTab, setCurrentTab] = useState('overview');

  useEffect(() => {
    const mentorUser = requireRole('mentor');
    if (!mentorUser) {
      navigate('/login');
      return;
    }
    setMentor(mentorUser);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    setCurrentTab(currentSection === 'dashboard' ? 'overview' : 'all');
  }, [currentSection]);

  if (loading || !mentor) {
    return <div style={{ backgroundColor: 'var(--dashboard-bg)', minHeight: '100vh' }} />;
  }

  return (
    <MentorLayout
      currentSection={currentSection}
      onNavigate={setCurrentSection}
      mentor={mentor}
    >
      <MentorDashboardContent
        mentor={mentor}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
    </MentorLayout>
  );
}
