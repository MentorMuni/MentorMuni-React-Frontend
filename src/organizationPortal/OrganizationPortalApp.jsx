import { Navigate, Route, Routes } from 'react-router-dom';
import { CollegeTenantProvider } from '../tenant/CollegeTenantProvider';
import { CollegeTenantGate } from '../tenant/UnknownCollegePortalPage';
import OrganizationLoginPage from '../components/organization/OrganizationLoginPage';
import OrgForgotPasswordPage from './pages/OrgForgotPasswordPage';
import OrgResetPasswordPage from './pages/OrgResetPasswordPage';
import { getOrgSession, isOrgAuthenticated, clearOrgSession } from '../orgPortal';
import OrganizationShell from './OrganizationShell';
import DashboardPage from './pages/DashboardPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ProfilePage from './pages/ProfilePage';
import DepartmentsPage from './pages/DepartmentsPage';
import EnrollmentPage from './pages/EnrollmentPage';
import ProgramsPage from './pages/ProgramsPage';
import DrivesPage from './pages/DrivesPage';
import UpcomingDrivesPage from './pages/UpcomingDrivesPage';
import PerformancePage from './pages/PerformancePage';
import AccessSettingsPage from './pages/AccessSettingsPage';
import MyWorkspacePage from './pages/MyWorkspacePage';
import HodStudentsPage from './pages/HodStudentsPage';
import HelpCenterPage from './pages/HelpCenterPage';
import {
  canAssignPrograms,
  canMutateCampus,
  canViewAnalytics,
  canViewCampusDepartments,
  canAccessOrgPortal,
  getOrgHomePath,
  getOrgLoginPath,
  isHodRole,
} from './roles';
import { orgPaths } from './paths';
import { useAuthGateRerender } from '../lib/sessionGuards';

function RequireOrgAuth({ children }) {
  useAuthGateRerender();
  if (!isOrgAuthenticated()) return <Navigate to={getOrgLoginPath()} replace />;
  const session = getOrgSession();
  if (!canAccessOrgPortal(session?.role)) {
    clearOrgSession();
    return <Navigate to={getOrgLoginPath()} replace state={{ wrongPortal: true }} />;
  }
  return children;
}

function RequirePasswordOk({ children }) {
  const session = getOrgSession();
  if (session?.mustChangePassword) {
    return <Navigate to={orgPaths.changePassword} replace />;
  }
  return children;
}

function RequireTpo({ children }) {
  const session = getOrgSession();
  if (!canMutateCampus(session?.role)) {
    return <Navigate to={getOrgHomePath()} replace />;
  }
  return children;
}

/** TPO/Org Admin or HOD — shared personal workspace. */
function RequireWorkspace({ children }) {
  const session = getOrgSession();
  if (!canMutateCampus(session?.role) && !isHodRole(session?.role)) {
    return <Navigate to={getOrgHomePath()} replace />;
  }
  return children;
}

/** TPO manages drives; HOD can view upcoming list. */
function RequireUpcomingDrives({ children }) {
  const session = getOrgSession();
  if (!canMutateCampus(session?.role) && !isHodRole(session?.role)) {
    return <Navigate to={getOrgHomePath()} replace />;
  }
  return children;
}

function RequireHod({ children }) {
  const session = getOrgSession();
  if (!isHodRole(session?.role)) {
    return <Navigate to={getOrgHomePath()} replace />;
  }
  return children;
}

function RequireAnalytics({ children }) {
  const session = getOrgSession();
  if (!canViewAnalytics(session?.role)) {
    return <Navigate to={getOrgHomePath()} replace />;
  }
  return children;
}

function RequireCampusDepartments({ children }) {
  const session = getOrgSession();
  if (!canViewCampusDepartments(session?.role)) {
    return <Navigate to={getOrgHomePath()} replace />;
  }
  return children;
}

function RequirePrograms({ children }) {
  const session = getOrgSession();
  if (!canAssignPrograms(session?.role)) {
    return <Navigate to={getOrgHomePath()} replace />;
  }
  return children;
}

/** TPO or HOD — campus / branch notifications. */
function RequireNotify({ children }) {
  const session = getOrgSession();
  if (!canMutateCampus(session?.role) && !isHodRole(session?.role)) {
    return <Navigate to={getOrgHomePath()} replace />;
  }
  return children;
}

function TpoPage({ children }) {
  return (
    <RequirePasswordOk>
      <RequireTpo>{children}</RequireTpo>
    </RequirePasswordOk>
  );
}

function WorkspacePage({ children }) {
  return (
    <RequirePasswordOk>
      <RequireWorkspace>{children}</RequireWorkspace>
    </RequirePasswordOk>
  );
}

function UpcomingDrivesGate({ children }) {
  return (
    <RequirePasswordOk>
      <RequireUpcomingDrives>{children}</RequireUpcomingDrives>
    </RequirePasswordOk>
  );
}

function NotifyPage({ children }) {
  return (
    <RequirePasswordOk>
      <RequireNotify>{children}</RequireNotify>
    </RequirePasswordOk>
  );
}

function HodPage({ children }) {
  return (
    <RequirePasswordOk>
      <RequireHod>{children}</RequireHod>
    </RequirePasswordOk>
  );
}

function AnalyticsPage({ children }) {
  return (
    <RequirePasswordOk>
      <RequireAnalytics>{children}</RequireAnalytics>
    </RequirePasswordOk>
  );
}

function DepartmentsGate({ children }) {
  return (
    <RequirePasswordOk>
      <RequireCampusDepartments>{children}</RequireCampusDepartments>
    </RequirePasswordOk>
  );
}

function ProgramsGate({ children }) {
  return (
    <RequirePasswordOk>
      <RequirePrograms>{children}</RequirePrograms>
    </RequirePasswordOk>
  );
}

export default function OrganizationPortalApp() {
  return (
    <CollegeTenantProvider>
      <CollegeTenantGate audience="organization">
        <Routes>
      <Route path="login" element={<OrganizationLoginPage />} />
      <Route path="forgot-password" element={<OrgForgotPasswordPage />} />
      <Route path="reset-password" element={<OrgResetPasswordPage />} />
      <Route
        index
        element={
          isOrgAuthenticated() ? (
            <Navigate to={getOrgHomePath()} replace />
          ) : (
            <Navigate to={getOrgLoginPath()} replace />
          )
        }
      />
      <Route
        element={
          <RequireOrgAuth>
            <OrganizationShell />
          </RequireOrgAuth>
        }
      >
        <Route
          path="dashboard"
          element={
            <RequirePasswordOk>
              <DashboardPage />
            </RequirePasswordOk>
          }
        />
        <Route path="change-password" element={<ChangePasswordPage />} />
        <Route
          path="profile"
          element={
            <RequirePasswordOk>
              <ProfilePage />
            </RequirePasswordOk>
          }
        />
        <Route path="settings" element={<Navigate to={orgPaths.profile} replace />} />
        <Route
          path="help"
          element={
            <RequirePasswordOk>
              <HelpCenterPage />
            </RequirePasswordOk>
          }
        />
        <Route path="departments" element={<DepartmentsGate><DepartmentsPage /></DepartmentsGate>} />
        <Route path="performance" element={<AnalyticsPage><PerformancePage /></AnalyticsPage>} />
        <Route path="enrollment" element={<TpoPage><EnrollmentPage /></TpoPage>} />
        <Route path="programs" element={<ProgramsGate><ProgramsPage /></ProgramsGate>} />
        <Route path="drives" element={<NotifyPage><DrivesPage /></NotifyPage>} />
        <Route path="upcoming-drives" element={<UpcomingDrivesGate><UpcomingDrivesPage /></UpcomingDrivesGate>} />
        <Route path="workspace" element={<WorkspacePage><MyWorkspacePage /></WorkspacePage>} />
        <Route path="access" element={<TpoPage><AccessSettingsPage /></TpoPage>} />
        <Route path="students" element={<HodPage><HodStudentsPage /></HodPage>} />
        <Route path="notify" element={<Navigate to={orgPaths.drives} replace />} />
      </Route>
      <Route
        path="*"
        element={
          <Navigate
            to={isOrgAuthenticated() ? getOrgHomePath() : getOrgLoginPath()}
            replace
          />
        }
      />
        </Routes>
      </CollegeTenantGate>
    </CollegeTenantProvider>
  );
}
