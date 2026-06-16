import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requireRole } from '../../utils/auth';
import StudentLayout from './StudentLayout';

// Import section components
import JourneySection from './sections/JourneySection';
import ProgressSection from './sections/ProgressSection';
import MentorChatSection from './sections/MentorChatSection';
import CalendarSection from './sections/CalendarSection';
import ResourcesSection from './sections/ResourcesSection';
import CertificatesSection from './sections/CertificatesSection';
import SupportSection from './sections/SupportSection';

function StudentDashboardContent({ student, currentSection, setCurrentSection, currentTab, setCurrentTab }) {
  const sectionProps = {
    student,
    currentTab,
    onTabChange: setCurrentTab,
  };

  switch (currentSection) {
    case 'journey':
      return <JourneySection {...sectionProps} />;
    case 'progress':
      return <ProgressSection {...sectionProps} />;
    case 'mentor':
      return <MentorChatSection {...sectionProps} />;
    case 'calendar':
      return <CalendarSection {...sectionProps} />;
    case 'resources':
      return <ResourcesSection {...sectionProps} />;
    case 'certificates':
      return <CertificatesSection {...sectionProps} />;
    case 'support':
      return <SupportSection {...sectionProps} />;
    default:
      return <JourneySection {...sectionProps} />;
  }
}

export default function StudentDashboardRefactored() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('journey');
  const [currentTab, setCurrentTab] = useState('overview');

  useEffect(() => {
    const studentUser = requireRole('student');
    if (!studentUser) {
      navigate('/login');
      return;
    }
    setStudent(studentUser);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    setCurrentTab('overview');
  }, [currentSection]);

  if (loading || !student) {
    return <div style={{ backgroundColor: 'var(--dashboard-bg)', minHeight: '100vh' }} />;
  }

  return (
    <StudentLayout
      currentSection={currentSection}
      onNavigate={setCurrentSection}
      student={student}
    >
      <StudentDashboardContent
        student={student}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
    </StudentLayout>
  );
}
