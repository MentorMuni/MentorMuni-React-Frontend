import { Navigate, Route, Routes } from 'react-router-dom';
import { isPlatformAuthenticated } from './auth';
import PlatformAdminLogin from './PlatformAdminLogin';
import PlatformAdminShell from './PlatformAdminShell';
import DashboardPage from './pages/DashboardPage';
import OrganizationsPage from './pages/OrganizationsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import FeatureManagementPage from './pages/FeatureManagementPage';
import PlatformUsersPage from './pages/PlatformUsersPage';
import SettingsPage from './pages/SettingsPage';

function RequirePlatformAuth({ children }) {
  if (!isPlatformAuthenticated()) {
    return <Navigate to="/mentormuniplatformadmin" replace />;
  }
  return children;
}

/**
 * MentorMuni Platform Admin — tenant provisioning portal.
 * Route base: /mentormuniplatformadmin
 */
export default function PlatformAdminApp() {
  return (
    <Routes>
      <Route
        index
        element={
          isPlatformAuthenticated() ? (
            <Navigate to="/mentormuniplatformadmin/dashboard" replace />
          ) : (
            <PlatformAdminLogin />
          )
        }
      />
      <Route
        element={
          <RequirePlatformAuth>
            <PlatformAdminShell />
          </RequirePlatformAuth>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="organizations" element={<OrganizationsPage />} />
        <Route path="subscriptions" element={<SubscriptionsPage />} />
        <Route path="features" element={<FeatureManagementPage />} />
        <Route path="platform-users" element={<PlatformUsersPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/mentormuniplatformadmin" replace />} />
    </Routes>
  );
}
