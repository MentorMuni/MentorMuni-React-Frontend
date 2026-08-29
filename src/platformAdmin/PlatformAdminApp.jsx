import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { getPlatformSession, isPlatformAuthenticated } from './auth';
import { platformAdminPaths } from './paths';
import PlatformAdminLogin from './PlatformAdminLogin';
import PlatformAdminShell from './PlatformAdminShell';
import DashboardPage from './pages/DashboardPage';
import OrganizationsPage from './pages/OrganizationsPage';
import IndividualsPage from './pages/IndividualsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import FeatureManagementPage from './pages/FeatureManagementPage';
import PlatformUsersPage from './pages/PlatformUsersPage';
import SettingsPage from './pages/SettingsPage';
import SupportInboxPage from './pages/SupportInboxPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import { useAuthGateRerender } from '../lib/sessionGuards';

function RequirePlatformAuth({ children }) {
  useAuthGateRerender();
  const location = useLocation();
  if (!isPlatformAuthenticated()) {
    return <Navigate to={platformAdminPaths.login} replace />;
  }
  const session = getPlatformSession();
  const onChangePassword = location.pathname.includes('/change-password');
  if (session?.mustChangePassword && !onChangePassword) {
    return <Navigate to={platformAdminPaths.changePassword} replace />;
  }
  return children;
}

function RequirePlatformRoles({ roles, children }) {
  const session = getPlatformSession();
  const role = String(session?.role || '').toUpperCase();
  if (!roles.includes(role)) {
    return <Navigate to={platformAdminPaths.dashboard} replace />;
  }
  return children;
}

function platformHomePath() {
  const session = getPlatformSession();
  if (!isPlatformAuthenticated()) return platformAdminPaths.login;
  if (session?.mustChangePassword) return platformAdminPaths.changePassword;
  return platformAdminPaths.dashboard;
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
        element={<Navigate to={platformHomePath()} replace />}
      />
      <Route
        path="login"
        element={
          isPlatformAuthenticated() ? (
            <Navigate to={platformHomePath()} replace />
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
        <Route path="individuals" element={<IndividualsPage />} />
        <Route path="subscriptions" element={<SubscriptionsPage />} />
        <Route path="features" element={<FeatureManagementPage />} />
        <Route
          path="platform-users"
          element={
            <RequirePlatformRoles roles={['PLATFORM_ADMIN']}>
              <PlatformUsersPage />
            </RequirePlatformRoles>
          }
        />
        <Route
          path="support"
          element={
            <RequirePlatformRoles roles={['PLATFORM_ADMIN', 'SUPPORT', 'OPERATIONS']}>
              <SupportInboxPage />
            </RequirePlatformRoles>
          }
        />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={platformHomePath()} replace />}
      />
    </Routes>
  );
}
