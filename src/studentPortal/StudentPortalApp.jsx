import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CollegeTenantProvider } from '../tenant/CollegeTenantProvider';
import { CollegeTenantGate } from '../tenant/UnknownCollegePortalPage';
import { isStudentAuthenticated } from './auth';
import { studentPaths } from './paths';
import { StudentThemeProvider } from './useStudentTheme.jsx';
import StudentLayout from './StudentLayout';
import StudentLoginPage from './pages/StudentLoginPage';
import StudentRegisterPage from './pages/StudentRegisterPage';
import StudentEnrollPage from './pages/StudentEnrollPage';
import StudentSetPasswordPage from './pages/StudentSetPasswordPage';
import StudentForgotPasswordPage from './pages/StudentForgotPasswordPage';
import StudentResetPasswordPage from './pages/StudentResetPasswordPage';
import './student-login.css';

const StudentHomePage = lazy(() => import('./pages/StudentHomePage'));
const StudentMentorPage = lazy(() => import('./pages/StudentMentorPage'));
const StudentKnowMePage = lazy(() => import('./pages/StudentKnowMePage'));
const StudentPracticePage = lazy(() => import('./pages/StudentPracticePage'));
const StudentCodingRoundPage = lazy(() => import('./pages/StudentCodingRoundPage'));
const StudentCompanyPrepPage = lazy(() => import('./pages/StudentCompanyPrepPage'));
const StudentProgressPage = lazy(() => import('./pages/StudentProgressPage'));
const StudentProfilePage = lazy(() => import('./pages/StudentProfilePage'));
const StudentToolPage = lazy(() => import('./pages/StudentToolPage'));
const StudentCompaniesPage = lazy(() => import('./pages/StudentCompaniesPage'));
const StudentCompanyIntelPage = lazy(() => import('./pages/StudentCompanyIntelPage'));
const StudentHelpCenterPage = lazy(() => import('./pages/StudentHelpCenterPage'));
const StudentWhiteboardPage = lazy(() => import('./pages/StudentWhiteboardPage'));
const StudentChangePasswordPage = lazy(() => import('./pages/StudentChangePasswordPage'));
const StudentAptitudeArcadePage = lazy(() => import('./pages/StudentAptitudeArcadePage'));

function PortalFallback() {
  return (
    <div className="stu-portal-fallback">
      <p>Loading…</p>
    </div>
  );
}

/**
 * The four authed pages share one shell. StudentLayout owns the auth
 * guard, sidebar, topbar, theme and streak, so each page renders only
 * its own body — previously all four re-implemented the chrome and
 * each held a separate copy of the theme state.
 */
export default function StudentPortalApp() {
  return (
    <CollegeTenantProvider>
      <CollegeTenantGate audience="student">
        <StudentThemeProvider>
          <Routes>
            <Route path="login" element={<StudentLoginPage />} />
            <Route path="register" element={<StudentRegisterPage />} />
            <Route path="enroll" element={<StudentEnrollPage />} />
            <Route path="set-password" element={<StudentSetPasswordPage />} />
            <Route path="forgot-password" element={<StudentForgotPasswordPage />} />
            <Route path="reset-password" element={<StudentResetPasswordPage />} />

            <Route element={<StudentLayout />}>
              <Route
                path="home"
                element={
                  <Suspense fallback={<PortalFallback />}>
                    <StudentHomePage />
                  </Suspense>
                }
              />
              <Route
                path="mentor"
                element={
                  <Suspense fallback={<PortalFallback />}>
                    <StudentMentorPage />
                  </Suspense>
                }
              />
              <Route
                path="fear-to-fearless"
                element={
                  <Suspense fallback={<PortalFallback />}>
                    <StudentKnowMePage />
                  </Suspense>
                }
              />
              <Route
                path="know-me"
                element={
                  <Suspense fallback={<PortalFallback />}>
                    <StudentKnowMePage />
                  </Suspense>
                }
              />
              <Route
                path="practice"
                element={
                  <Suspense fallback={<PortalFallback />}>
                    <StudentPracticePage />
                  </Suspense>
                }
              />
              <Route
                path="aptitude-arcade"
                element={
                  <Suspense fallback={<PortalFallback />}>
                    <StudentAptitudeArcadePage />
                  </Suspense>
                }
              />
              <Route
                path="coding"
                element={
                  <Suspense fallback={<PortalFallback />}>
                    <StudentCodingRoundPage />
                  </Suspense>
                }
              />
              <Route
                path="company-prep"
                element={
                  <Suspense fallback={<PortalFallback />}>
                    <StudentCompanyPrepPage />
                  </Suspense>
                }
              />
              <Route
                path="companies"
                element={
                  <Suspense fallback={<PortalFallback />}>
                    <StudentCompaniesPage />
                  </Suspense>
                }
              />
              <Route
                path="companies/:slug"
                element={
                  <Suspense fallback={<PortalFallback />}>
                    <StudentCompanyIntelPage />
                  </Suspense>
                }
              />
              <Route
                path="progress"
                element={
                  <Suspense fallback={<PortalFallback />}>
                    <StudentProgressPage />
                  </Suspense>
                }
              />
              <Route
                path="profile"
                element={
                  <Suspense fallback={<PortalFallback />}>
                    <StudentProfilePage />
                  </Suspense>
                }
              />
              <Route
                path="change-password"
                element={
                  <Suspense fallback={<PortalFallback />}>
                    <StudentChangePasswordPage />
                  </Suspense>
                }
              />
              <Route
                path="help"
                element={
                  <Suspense fallback={<PortalFallback />}>
                    <StudentHelpCenterPage />
                  </Suspense>
                }
              />
              <Route
                path="whiteboard"
                element={
                  <Suspense fallback={<PortalFallback />}>
                    <StudentWhiteboardPage />
                  </Suspense>
                }
              />
              <Route
                path="tools/:toolCode"
                element={
                  <Suspense fallback={<PortalFallback />}>
                    <StudentToolPage />
                  </Suspense>
                }
              />
            </Route>

            <Route
              index
              element={
                <Navigate
                  to={isStudentAuthenticated() ? studentPaths.home : studentPaths.login}
                  replace
                />
              }
            />
            <Route
              path="*"
              element={
                <Navigate
                  to={isStudentAuthenticated() ? studentPaths.home : studentPaths.login}
                  replace
                />
              }
            />
          </Routes>
        </StudentThemeProvider>
      </CollegeTenantGate>
    </CollegeTenantProvider>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TEMPORARY — dev preview data. Delete this block and
   src/studentPortal/devSeed.js to remove.

   Guarded by import.meta.env.DEV and loaded dynamically, so Rollup
   drops both the branch and the module from production builds.
   ───────────────────────────────────────────────────────────────── */
if (import.meta.env.DEV) {
  import('./devSeed').then(({ installDevSeed }) => installDevSeed());
}
