import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordWithToken } from '../../orgPortal';
import { studentPaths } from '../paths';
import { StudentThemeFab, useStudentTheme } from '../useStudentTheme.jsx';
import '../student-login.css';

const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;

export default function StudentResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { theme, toggle, rootClass } = useStudentTheme();
  const token = String(params.get('token') || '').trim();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!token) {
      setError('This reset link is missing a token. Request a new one.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await resetPasswordWithToken({ token, newPassword: password });
      setOk(true);
      setTimeout(() => navigate(studentPaths.login, { replace: true }), 1200);
    } catch (err) {
      setError(err?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`mm-stu-login-root ${rootClass}`}>
      <StudentThemeFab theme={theme} onToggle={toggle} />
      <div className="mm-stu-atm" aria-hidden>
        <div className="mm-stu-atm__mesh" />
        <div className="mm-stu-atm__blob mm-stu-atm__blob--a" />
      </div>
      <div className="mm-stu-form-col" style={{ minHeight: '100dvh' }}>
        <div className="mm-stu-card mm-stu-card--genz" style={{ width: 'min(420px, 100%)' }}>
          <div className="mm-stu-brand" style={{ marginBottom: 18 }}>
            <img src={LOGO} alt="MentorMuni" style={{ height: 36 }} />
            <div className="mm-stu-brand__text">
              <span className="mm-stu-brand__name">MentorMuni</span>
              <span className="mm-stu-brand__tag" style={{ color: 'var(--stu-muted)' }}>
                Reset password
              </span>
            </div>
          </div>

          {!token ? (
            <>
              <h1 className="mm-stu-card-title">Link expired</h1>
              <p className="mm-stu-card-sub">
                This reset link is incomplete. Request a new one from student login.
              </p>
              <Link to={studentPaths.forgotPassword} className="mm-stu-link">
                Request a new link
              </Link>
            </>
          ) : ok ? (
            <>
              <p className="mm-stu-step-label">Done</p>
              <h1 className="mm-stu-card-title">Password updated</h1>
              <p className="mm-stu-card-sub">Redirecting you to student login…</p>
            </>
          ) : (
            <>
              <p className="mm-stu-step-label">Student portal</p>
              <h1 className="mm-stu-card-title">Choose a new password</h1>
              <p className="mm-stu-card-sub">Enter a new password for your student account.</p>
              {error ? (
                <div className="mm-stu-alert mm-stu-alert--error" role="alert">
                  {error}
                </div>
              ) : null}
              <form
                onSubmit={onSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                noValidate
              >
                <label className="mm-stu-label">
                  New password
                  <input
                    className="mm-stu-field-input"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </label>
                <label className="mm-stu-label">
                  Confirm password
                  <input
                    className="mm-stu-field-input"
                    type="password"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={8}
                  />
                </label>
                <button type="submit" className="mm-stu-submit" disabled={loading}>
                  {loading ? 'Saving…' : 'Update password'}
                </button>
              </form>
            </>
          )}

          <p className="mm-stu-card-foot">
            <Link to={studentPaths.login} className="mm-stu-link">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
