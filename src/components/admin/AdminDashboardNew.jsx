import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requireRole } from '../../utils/auth';
import AdminLayout from './AdminLayout';

// Import section components
import OverviewSection from './sections/OverviewSection';
import EnrollmentSection from './sections/EnrollmentSection';
import StudentsSection from './sections/StudentsSection';
import MentorsSection from './sections/MentorsSection';
import SettingsSection from './sections/SettingsSection';
import ReportsSection from './sections/ReportsSection';
import NotificationsSection from './sections/NotificationsSection';

function AdminDashboardContent({ currentSection, setCurrentSection, currentTab, setCurrentTab }) {
  const sectionProps = {
    currentTab,
    onTabChange: setCurrentTab,
  };

  switch (currentSection) {
    case 'overview':
      return <OverviewSection {...sectionProps} />;
    case 'enrollment':
      return <EnrollmentSection />;
    case 'students':
      return <StudentsSection {...sectionProps} />;
    case 'mentors':
      return <MentorsSection {...sectionProps} />;
    case 'settings':
      return <SettingsSection />;
    case 'reports':
      return <ReportsSection />;
    case 'notifications':
      return <NotificationsSection />;
    default:
      return <OverviewSection {...sectionProps} />;
  }
}

export default function AdminDashboardNew() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('overview');
  const [currentTab, setCurrentTab] = useState('overview');

  useEffect(() => {
    const adminUser = requireRole('admin');
    if (!adminUser) {
      navigate('/login');
      return;
    }
    setAdmin(adminUser);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    setCurrentTab(currentSection === 'overview' ? 'overview' : 'all');
  }, [currentSection]);

  if (loading || !admin) {
    return <div style={{ backgroundColor: 'var(--dashboard-bg)', minHeight: '100vh' }} />;
  }

  return (
    <AdminLayout
      currentSection={currentSection}
      onNavigate={setCurrentSection}
      admin={admin}
    >
      <AdminDashboardContent
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
    </AdminLayout>
  );
}
