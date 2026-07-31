import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { activateStudentAccount } from '../../organizationPortal/studentsApi';
import { peekPasswordSetupToken } from '../localStudentAuth';
import { studentPaths } from '../paths';
import { StudentThemeFab, useStudentTheme } from '../useStudentTheme.jsx';
import '../student-login.css';

const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;

export default function StudentSetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { theme, toggle, rootClass } = useStudentTheme();
  const token = String(params.get('token') || '').trim();
  const peek = useMemo(() => (token ? peekPasswordSetupToken(token) : null), [token]);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('Missing activation token.');
      return;
    }
    setLoading(true);
    const res = await activateStudentAccount({ token, newPassword: password });
    setLoading(false);
    if (!res.ok) {
      setError(res.error || 'Unable to set password.');
      return;
    }
    setOk(true);
    setTimeout(() => navigate(studentPaths.login, { replace: true }), 1200);
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
                Set password
              </span>
            </div>
          </div>

          {!token ? (
            <>
              <h1 className="mm-stu-card-title">Link expired</h1>
              <p className="mm-stu-card-sub">
                This set-password link is missing a token. Ask your HOD or TPO to resend it from the
                enrollment roster.
              </p>
              <Link to={studentPaths.login} className="mm-stu-link">
                Back to login
              </Link>
            </>
          ) : ok ? (
            <>
              <p className="mm-stu-step-label">Done</p>
              <h1 className="mm-stu-card-title">Password saved</h1>
              <p className="mm-stu-card-sub">Redirecting you to student login…</p>
            </>
          ) : (
            <>
              <p className="mm-stu-step-label">
                {peek?.orgName || peek?.orgCode || 'Campus'} · approved
              </p>
              <h1 className="mm-stu-card-title">Create your password</h1>
              <p className="mm-stu-card-sub">
                {peek?.name || peek?.email
                  ? `Hi ${peek.name || peek.email}. `
                  : ''}
                Choose a password (min 8 characters), then sign in with your email or college ID.
              </p>
              {error ? (
                <div className="mm-stu-alert mm-stu-alert--error" role="alert">
                  {error}
                </div>
              ) : null}
              <form
                onSubmit={onSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <label className="mm-stu-label">
                  New password
                  <input
                    type="password"
                    autoComplete="new-password"
                    className="mm-stu-field-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                </label>
                <label className="mm-stu-label">
                  Confirm password
                  <input
                    type="password"
                    autoComplete="new-password"
                    className="mm-stu-field-input"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    minLength={8}
                    required
                  />
                </label>
                <button type="submit" className="mm-stu-submit" disabled={loading}>
                  {loading ? 'Saving…' : 'Save & continue to login'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
