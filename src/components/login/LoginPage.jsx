import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Building2, Eye, EyeOff, Loader2, Lock, UserRound } from 'lucide-react';
import RoutePageShell from '../layout/RoutePageShell';
import {
  consumeOrgAuthFlash,
  loginOrgUser,
  isOrgAuthenticated,
  getOrgSession,
} from '../../orgPortal';

const EASE = [0.22, 1, 0.36, 1];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [organizationCode, setOrganizationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorKind, setErrorKind] = useState(''); // '' | credentials | suspended | success
  const [cta, setCta] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const flash = consumeOrgAuthFlash();
    if (flash?.message) {
      setError(flash.message);
      setErrorKind(flash.kind === 'success' ? 'success' : 'suspended');
      setCta(flash.cta || '');
    }

    const activateSuccess = location.state?.activateSuccess;
    if (activateSuccess) {
      setSuccess(activateSuccess);
      navigate(location.pathname, { replace: true, state: {} });
    }

    if (isOrgAuthenticated()) {
      const session = getOrgSession();
      if (session?.role) {
        // Session kept for future org portal routes.
      }
    }
  }, [location.pathname, location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim() || !password) return;
    setError('');
    setErrorKind('');
    setCta('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await loginOrgUser(userId, password, organizationCode);
      if (!result.ok) {
        if (result.code === 'ORG_SUSPENDED' || result.status === 403) {
          setError(result.error);
          setErrorKind('suspended');
          setCta(result.ux?.cta || 'Contact MentorMuni support');
        } else if (result.code === 'INVALID_CREDENTIALS' || result.status === 401) {
          setError(result.error || 'Invalid credentials.');
          setErrorKind('credentials');
        } else {
          setError(result.error || 'Unable to sign in.');
          setErrorKind('credentials');
        }
        return;
      }

      // Org dashboards are not mounted in this marketing app yet.
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
      setErrorKind('credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoutePageShell scope="marketing" className="mm-login-vibe-root">
      <section className="mm-login-vibe mm-marketing-hero-backdrop" aria-labelledby="login-vibe-heading">
        <div className="mm-login-vibe__noise" aria-hidden />
        <div className="mm-login-vibe__blob mm-login-vibe__blob--1" aria-hidden />
        <div className="mm-login-vibe__blob mm-login-vibe__blob--2" aria-hidden />
        <div className="mm-login-vibe__blob mm-login-vibe__blob--3" aria-hidden />

        <div className="mm-container mm-login-vibe__stage">
          <motion.header
            className="mm-login-vibe__hero"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <h1 id="login-vibe-heading" className="mm-login-vibe__headline">
              <span className="mm-login-vibe__headline-line">Log in.</span>
              <span className="mm-login-vibe__headline-line mm-login-vibe__headline-grad">Get placement-ready.</span>
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
                      <UserRound size={22} />
                    </div>
                    <div>
                      <p className="mm-login-vibe__card-eyebrow">Organization Portal</p>
                      <h2 className="mm-login-vibe__card-title">Welcome Back</h2>
                    </div>
                  </div>

                  <form className="mm-login-vibe-form" onSubmit={handleSubmit} noValidate>
                    {success && (
                      <div className="mm-login-vibe-form__error mm-login-vibe-form__error--success" role="status">
                        <p className="mm-login-vibe-form__error-text">{success}</p>
                      </div>
                    )}

                    {error && (
                      <motion.div
                        className={`mm-login-vibe-form__error ${
                          errorKind === 'suspended' ? 'mm-login-vibe-form__error--suspended' : ''
                        }`}
                        role="alert"
                        initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                      >
                        <p className="mm-login-vibe-form__error-text">{error}</p>
                        {errorKind === 'suspended' && cta ? (
                          <p className="mm-login-vibe-form__error-cta">{cta}</p>
                        ) : null}
                      </motion.div>
                    )}

                    <label className="mm-login-vibe-label" htmlFor="login-user-id">
                      Email / Username
                    </label>
                    <div className="mm-login-vibe-input-wrap">
                      <span className="mm-login-vibe-input-wrap__leading" aria-hidden>
                        <UserRound size={18} strokeWidth={2.25} />
                      </span>
                      <input
                        id="login-user-id"
                        type="text"
                        name="userId"
                        autoComplete="username"
                        required
                        placeholder="tpo@college.edu or username"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="mm-login-vibe-input"
                      />
                    </div>

                    <label className="mm-login-vibe-label" htmlFor="login-org-code">
                      Organization code <span style={{ fontWeight: 500, textTransform: 'none' }}>(optional)</span>
                    </label>
                    <div className="mm-login-vibe-input-wrap">
                      <span className="mm-login-vibe-input-wrap__leading" aria-hidden>
                        <Building2 size={18} strokeWidth={2.25} />
                      </span>
                      <input
                        id="login-org-code"
                        type="text"
                        name="organizationCode"
                        autoComplete="organization"
                        placeholder="e.g. MEDICAPS"
                        value={organizationCode}
                        onChange={(e) => setOrganizationCode(e.target.value.toUpperCase())}
                        className="mm-login-vibe-input uppercase"
                      />
                    </div>

                    <div className="mm-login-vibe-label-row">
                      <label className="mm-login-vibe-label" htmlFor="login-password">
                        Password
                      </label>
                      <Link to="/Organization/forgot-password" className="mm-login-vibe-forgot">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="mm-login-vibe-input-wrap">
                      <span className="mm-login-vibe-input-wrap__leading" aria-hidden>
                        <Lock size={18} strokeWidth={2.25} />
                      </span>
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        autoComplete="current-password"
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mm-login-vibe-input"
                      />
                      <button
                        type="button"
                        className="mm-login-vibe-input-wrap__trailing"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !userId || !password}
                      className="mm-login-vibe-btn mm-login-vibe-btn--full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} aria-hidden />
                          Logging in...
                        </>
                      ) : (
                        <>
                          Log in <ArrowRight size={18} aria-hidden />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </RoutePageShell>
  );
}
