import { Navigate, Route, Routes } from 'react-router-dom';
import { isPlatformAuthenticated } from './auth';
import { platformAdminPaths } from './paths';
import PlatformAdminLogin from './PlatformAdminLogin';
import PlatformAdminShell from './PlatformAdminShell';
import DashboardPage from './pages/DashboardPage';
import OrganizationsPage from './pages/OrganizationsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import FeatureManagementPage from './pages/FeatureManagementPage';
import PlatformUsersPage from './pages/PlatformUsersPage';
import SettingsPage from './pages/SettingsPage';
import ChangePasswordPage from './pages/ChangePasswordPage';

function RequirePlatformAuth({ children }) {
  if (!isPlatformAuthenticated()) {
    return <Navigate to={platformAdminPaths.login} replace />;
  }
  return children;
}

/**
 * MentorMuni Platform Admin — tenant provisioning portal.
 * Route base: /platform/admin
 * Login: /platform/admin/login
 */
export default function PlatformAdminApp() {
  return (
    <Routes>
      <Route
        index
        element={
          <Navigate
            to={isPlatformAuthenticated() ? platformAdminPaths.dashboard : platformAdminPaths.login}
            replace
          />
        }
      />
      <Route
        path="login"
        element={
          isPlatformAuthenticated() ? (
            <Navigate to={platformAdminPaths.dashboard} replace />
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
        <Route path="change-password" element={<ChangePasswordPage />} />
      </Route>
      <Route path="*" element={<Navigate to={platformAdminPaths.login} replace />} />
    </Routes>
  );
}
