import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { resetPasswordWithToken } from '../../orgPortal';
import { orgPaths } from '../paths';
import '../../components/organization/organization-login.css';

const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;

export default function OrgResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
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
      setTimeout(() => navigate(orgPaths.login, { replace: true }), 1200);
    } catch (err) {
      setError(err?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mm-org-login">
      <div className="mm-org-login__panel" style={{ maxWidth: 420, margin: '48px auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <img src={LOGO} alt="MentorMuni" style={{ height: 36 }} />
          <div>
            <div style={{ fontWeight: 700 }}>MentorMuni</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>Reset password</div>
          </div>
        </div>

        {!token ? (
          <>
            <h1 style={{ margin: '0 0 8px', fontSize: 24 }}>Link expired</h1>
            <p style={{ margin: '0 0 16px', opacity: 0.75, fontSize: 14 }}>
              This reset link is incomplete. Request a new one from the login page.
            </p>
            <Link to={orgPaths.forgotPassword}>Request a new link</Link>
          </>
        ) : ok ? (
          <>
            <h1 style={{ margin: '0 0 8px', fontSize: 24 }}>Password updated</h1>
            <p style={{ margin: 0, opacity: 0.75, fontSize: 14 }}>Redirecting to login…</p>
          </>
        ) : (
          <>
            <h1 style={{ margin: '0 0 8px', fontSize: 24 }}>Choose a new password</h1>
            <p style={{ margin: '0 0 18px', opacity: 0.75, fontSize: 14 }}>
              Enter a new password for your MentorMuni account.
            </p>
            {error ? (
              <div className="mm-org-login__alert mm-org-login__alert--err" role="alert">
                {error}
              </div>
            ) : null}
            <form className="mm-org-login__form" onSubmit={onSubmit} noValidate>
              <div>
                <label className="mm-org-login__label" htmlFor="org-rp-pass">
                  New password
                </label>
                <div className="mm-org-login__field">
                  <Lock size={16} aria-hidden />
                  <input
                    id="org-rp-pass"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
              </div>
              <div>
                <label className="mm-org-login__label" htmlFor="org-rp-confirm">
                  Confirm password
                </label>
                <div className="mm-org-login__field">
                  <Lock size={16} aria-hidden />
                  <input
                    id="org-rp-confirm"
                    type="password"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
              </div>
              <button type="submit" className="mm-org-login__submit" disabled={loading}>
                {loading ? 'Saving…' : 'Update password'}
              </button>
            </form>
          </>
        )}

        <p style={{ marginTop: 18, fontSize: 14 }}>
          <Link to={orgPaths.login}>Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
