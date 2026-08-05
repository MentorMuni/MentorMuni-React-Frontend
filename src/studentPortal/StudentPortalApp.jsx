import { Navigate, Route, Routes } from 'react-router-dom';
import { isStudentAuthenticated } from './auth';
import { studentPaths } from './paths';
import StudentLoginPage from './pages/StudentLoginPage';
import StudentHomePage from './pages/StudentHomePage';
import StudentRegisterPage from './pages/StudentRegisterPage';
import StudentEnrollPage from './pages/StudentEnrollPage';
import StudentSetPasswordPage from './pages/StudentSetPasswordPage';
import StudentForgotPasswordPage from './pages/StudentForgotPasswordPage';
import StudentResetPasswordPage from './pages/StudentResetPasswordPage';
import './student-login.css';

function RequireStudent({ children }) {
  if (!isStudentAuthenticated()) {
    return <Navigate to={studentPaths.login} replace />;
  }
  return children;
}

export default function StudentPortalApp() {
  return (
    <Routes>
      <Route path="login" element={<StudentLoginPage />} />
      <Route path="register" element={<StudentRegisterPage />} />
      <Route path="enroll" element={<StudentEnrollPage />} />
      <Route path="set-password" element={<StudentSetPasswordPage />} />
      <Route path="forgot-password" element={<StudentForgotPasswordPage />} />
      <Route path="reset-password" element={<StudentResetPasswordPage />} />
      <Route
        path="home"
        element={
          <RequireStudent>
            <StudentHomePage />
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
