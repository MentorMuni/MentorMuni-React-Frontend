import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { resetPasswordWithToken } from '../../orgPortal';
import { tenantPortalPath } from '../../tenant/resolveTenant';
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
      setTimeout(() => navigate(tenantPortalPath(orgPaths.login), { replace: true }), 1200);
    } catch (err) {
      setError(err?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mm-org-root-login mm-org-root-login--tpo is-light">
      <div className="mm-org-login mm-org-login--solo">
        <div className="mm-org-login__form-wrap mm-org-login__form-wrap--solo">
          <div className="mm-org-login__card mm-org-login__card--solo">
            <header className="mm-org-solo-head">
              <img src={LOGO} alt="MentorMuni" className="mm-org-solo-head__logo" />
              <p className="mm-org-solo-head__product">Organization portal</p>
            </header>

            {!token ? (
              <>
                <h1 className="mm-org-login__card-title">Link expired</h1>
                <p className="mm-org-login__card-sub">
                  This reset link is incomplete. Request a new one from the login page.
                </p>
                <p className="mm-org-login__activate">
                  <Link to={tenantPortalPath(orgPaths.forgotPassword)}>Request a new link</Link>
                </p>
              </>
            ) : ok ? (
              <>
                <h1 className="mm-org-login__card-title">Password updated</h1>
                <p className="mm-org-login__card-sub">Redirecting to login…</p>
              </>
            ) : (
              <>
                <h1 className="mm-org-login__card-title">Choose a new password</h1>
                <p className="mm-org-login__card-sub">
                  Enter a new password for your MentorMuni organization account.
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
                <p className="mm-org-login__activate">
                  <Link to={tenantPortalPath(orgPaths.login)}>Back to sign in</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
