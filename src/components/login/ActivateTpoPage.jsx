import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, KeyRound, Loader2, Lock } from 'lucide-react';
import RoutePageShell from '../layout/RoutePageShell';
import { activateTpoAccount } from '../../orgPortal';

const EASE = [0.22, 1, 0.36, 1];

export default function ActivateTpoPage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [params] = useSearchParams();
  const token = useMemo(() => String(params.get('token') || '').trim(), [params]);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Activation token is missing. Open the link from your invite email.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Password and confirm password do not match.');
      return;
    }

    setLoading(true);
    try {
      const result = await activateTpoAccount(token, password);
      if (!result.ok) {
        setError(result.error || 'Unable to activate account.');
        return;
      }
      const orgCode = String(result.organizationCode || '').trim().toUpperCase();
      const loginPath = orgCode
        ? `/Organization/login?org=${encodeURIComponent(orgCode)}`
        : '/Organization/login';
      navigate(loginPath, {
        replace: true,
        state: {
          activateSuccess:
            result.message || 'Password set. You can log in to the Organization Portal.',
          preferredRole: 'tpo',
          preferredOrgCode: orgCode || undefined,
        },
      });
    } catch (err) {
      setError(err.message || 'Unable to activate account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoutePageShell scope="marketing" className="mm-login-vibe-root">
      <section className="mm-login-vibe mm-marketing-hero-backdrop" aria-labelledby="activate-tpo-heading">
        <div className="mm-login-vibe__noise" aria-hidden />
        <div className="mm-login-vibe__blob mm-login-vibe__blob--1" aria-hidden />
        <div className="mm-login-vibe__blob mm-login-vibe__blob--2" aria-hidden />

        <div className="mm-container mm-login-vibe__stage">
          <motion.header
            className="mm-login-vibe__hero"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <h1 id="activate-tpo-heading" className="mm-login-vibe__headline">
              <span className="mm-login-vibe__headline-line">Activate TPO account</span>
              <span className="mm-login-vibe__headline-line mm-login-vibe__headline-grad">Set your password.</span>
            </h1>
          </motion.header>

          <div className="mm-login-vibe__layout">
            <div className="mm-login-vibe__main">
              <motion.div
                className="mm-login-vibe__card-shell"
                initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
              >
                <div className="mm-login-vibe__card-glow" aria-hidden />
                <div className="mm-login-vibe__card">
                  <div className="mm-login-vibe__card-top">
                    <div className="mm-login-vibe__avatar" aria-hidden>
                      <KeyRound size={22} />
                    </div>
                    <div>
                      <p className="mm-login-vibe__card-eyebrow">Organization Portal</p>
                      <h2 className="mm-login-vibe__card-title">Create your password</h2>
                    </div>
                  </div>

                  {!token ? (
                    <div className="mm-login-vibe-form__note" role="status">
                      <p className="mm-login-vibe-form__error-text">
                        Activation only works from your MentorMuni invite email.
                      </p>
                      <p className="mm-login-vibe-form__error-cta" style={{ marginTop: 8 }}>
                        Open the link in that email. If you don’t have it, ask your Platform Admin to reinvite you.
                      </p>
                      <p className="mm-login-vibe-form__error-cta" style={{ marginTop: 12 }}>
                        <Link to="/Organization/login">Back to login</Link>
                      </p>
                    </div>
                  ) : (
                    <form className="mm-login-vibe-form" onSubmit={handleSubmit} noValidate>
                      {error && (
                        <div className="mm-login-vibe-form__error" role="alert">
                          <p className="mm-login-vibe-form__error-text">{error}</p>
                        </div>
                      )}

                      <label className="mm-login-vibe-label" htmlFor="activate-password">
                        New password
                      </label>
                      <div className="mm-login-vibe-input-wrap">
                        <span className="mm-login-vibe-input-wrap__leading" aria-hidden>
                          <Lock size={18} strokeWidth={2.25} />
                        </span>
                        <input
                          id="activate-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          required
                          minLength={8}
                          placeholder="At least 8 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="mm-login-vibe-input"
                        />
                        <button
                          type="button"
                          className="mm-login-vibe-input-wrap__trailing"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      <label className="mm-login-vibe-label" htmlFor="activate-confirm">
                        Confirm password
                      </label>
                      <div className="mm-login-vibe-input-wrap">
                        <span className="mm-login-vibe-input-wrap__leading" aria-hidden>
                          <Lock size={18} strokeWidth={2.25} />
                        </span>
                        <input
                          id="activate-confirm"
                          type={showConfirm ? 'text' : 'password'}
                          autoComplete="new-password"
                          required
                          minLength={8}
                          placeholder="Re-enter password"
                          value={confirm}
                          onChange={(e) => setConfirm(e.target.value)}
                          className="mm-login-vibe-input"
                        />
                        <button
                          type="button"
                          className="mm-login-vibe-input-wrap__trailing"
                          onClick={() => setShowConfirm((v) => !v)}
                          aria-label={showConfirm ? 'Hide password' : 'Show password'}
                        >
                          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || !password || !confirm}
                        className="mm-login-vibe-btn mm-login-vibe-btn--full"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin" size={18} aria-hidden />
                            Activating…
                          </>
                        ) : (
                          <>
                            Set password & continue <ArrowRight size={18} aria-hidden />
                          </>
                        )}
                      </button>

                      <p className="mm-login-hint" style={{ marginTop: 12, textAlign: 'center' }}>
                        Already activated? <Link to="/Organization/login">Log in</Link>
                      </p>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </RoutePageShell>
  );
}
