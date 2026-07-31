import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import {
  clearStudentSession,
  getStudentSession,
  isStudentAuthenticated,
} from './auth';
import { studentPaths } from './paths';
import StudentLoginPage from './pages/StudentLoginPage';
import StudentRegisterPage from './pages/StudentRegisterPage';
import StudentEnrollPage from './pages/StudentEnrollPage';
import StudentSetPasswordPage from './pages/StudentSetPasswordPage';
import StudentForgotPasswordPage from './pages/StudentForgotPasswordPage';
import './student-login.css';

const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;

function RequireStudent({ children }) {
  if (!isStudentAuthenticated()) {
    return <Navigate to={studentPaths.login} replace />;
  }
  return children;
}

function StudentHomeStub() {
  const navigate = useNavigate();
  const session = getStudentSession();

  return (
    <div className="mm-stu-login-root" style={{ minHeight: '100dvh' }}>
      <div className="mm-stu-atm" aria-hidden>
        <div className="mm-stu-atm__mesh" />
        <div className="mm-stu-atm__blob mm-stu-atm__blob--a" />
        <div className="mm-stu-atm__blob mm-stu-atm__blob--b" />
      </div>
      <div
        className="mm-stu-form-col"
        style={{ minHeight: '100dvh', flexDirection: 'column', gap: 20 }}
      >
        <div className="mm-stu-card" style={{ width: 'min(520px, 100%)' }}>
          <div className="mm-stu-brand" style={{ marginBottom: 18 }}>
            <img src={LOGO} alt="MentorMuni" style={{ height: 36 }} />
            <div className="mm-stu-brand__text">
              <span className="mm-stu-brand__name" style={{ color: 'var(--stu-ink)' }}>
                MentorMuni
              </span>
              <span className="mm-stu-brand__tag" style={{ color: 'var(--stu-muted)' }}>
                Student portal
              </span>
            </div>
          </div>
          <p className="mm-stu-step-label">Signed in</p>
          <h1 className="mm-stu-card-title">
            Welcome{session?.name ? `, ${session.name.split(' ')[0]}` : ''}.
          </h1>
          <p className="mm-stu-card-sub">
            {session?.organization_name || 'Your college'}
            {session?.department_name ? ` · ${session.department_name}` : ''}. Full student workspace
            (assessments, mocks, drives) ships next — login is ready.
          </p>
          <p className="mm-stu-card-sub" style={{ marginTop: -8 }}>
            Signed in as <strong>{session?.email || session?.college_id}</strong>
            {session?.demo ? ' (demo)' : ''}
            {session?.localEnrollment ? ' (campus enrollment)' : ''}.
          </p>
          <button
            type="button"
            className="mm-stu-submit"
            onClick={() => {
              clearStudentSession();
              navigate(studentPaths.login, { replace: true });
            }}
          >
            Sign out
          </button>
          <p className="mm-stu-card-foot">
            <Link to="/" className="mm-stu-link">
              Back to MentorMuni home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function StudentPortalApp() {
  return (
    <Routes>
      <Route path="login" element={<StudentLoginPage />} />
      <Route path="register" element={<StudentRegisterPage />} />
      <Route path="enroll" element={<StudentEnrollPage />} />
      <Route path="set-password" element={<StudentSetPasswordPage />} />
      <Route path="forgot-password" element={<StudentForgotPasswordPage />} />
      <Route
        path="home"
        element={
          <RequireStudent>
            <StudentHomeStub />
          </RequireStudent>
        }
      />
      <Route
        index
        element={
          <Navigate
            to={isStudentAuthenticated() ? studentPaths.home : studentPaths.login}
            replace
          />
        }
      />
      <Route path="*" element={<Navigate to={studentPaths.login} replace />} />
    </Routes>
  );
}
