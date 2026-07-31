import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Loader2, Lock, ShieldCheck, Mail, Sparkles, Building2, Zap } from 'lucide-react';
import { authenticatePlatformAdmin, setPlatformSession } from './auth';
import { platformAdminPaths } from './paths';
import { usePlatformTheme } from './usePlatformTheme';
import PlatformThemeToggle from './PlatformThemeToggle';
import './platform-admin.css';

const EASE = [0.22, 1, 0.36, 1];
const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;

const FLOW = [
  { title: 'Create Organization', help: 'Spin up a college or public tenant' },
  { title: 'Assign Subscription', help: 'Plan, seats, and validity window' },
  { title: 'Enable Features', help: 'Resume ATS, AI Mentor, mocks…' },
  { title: 'Create TPO', help: 'Activation link — they set their password' },
];

function Atmosphere() {
  return (
    <div className="mm-pa-atmosphere" aria-hidden>
      <div className="mm-pa-atmosphere__grid" />
      <div className="mm-pa-atmosphere__orb mm-pa-atmosphere__orb--1" />
      <div className="mm-pa-atmosphere__orb mm-pa-atmosphere__orb--2" />
      <div className="mm-pa-atmosphere__orb mm-pa-atmosphere__orb--3" />
    </div>
  );
}

export default function PlatformAdminLogin() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = usePlatformTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authenticatePlatformAdmin(email, password);
      setLoading(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setPlatformSession(result.user);
      navigate(
        result.user?.mustChangePassword
          ? platformAdminPaths.changePassword
          : platformAdminPaths.dashboard,
        { replace: true }
      );
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Unable to sign in.');
    }
  };

  return (
    <div className={`mm-pa-root ${theme === 'light' ? 'mm-pa-light' : ''}`}>
      <Atmosphere />
      <PlatformThemeToggle
        theme={theme}
        onToggle={toggleTheme}
        className="mm-pa-theme-toggle--floating"
      />
      <div className="mm-pa-login">
        <motion.section
          className="mm-pa-login__showcase"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="mm-pa-login__showcase-inner">
            <motion.img
              src={LOGO}
              alt="MentorMuni"
              className="mm-pa-logo mm-pa-logo--lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            />
            <motion.div
              className="mm-pa-pill mt-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
            >
              <Sparkles size={13} /> Platform Control Plane
            </motion.div>
            <motion.h1
              className="mt-5 text-4xl font-black leading-[1.08] tracking-tight text-white md:text-5xl"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.55, ease: EASE }}
            >
              Provision tenants.
              <span className="block bg-gradient-to-r from-sky-300 via-cyan-300 to-amber-300 bg-clip-text text-transparent">
                Let the organization handle the rest — safe, no data leak.
              </span>
            </motion.h1>
            <motion.p
              className="mt-4 max-w-md text-base leading-relaxed text-slate-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              CEO-grade ops for MentorMuni. Create organizations, attach plans, flip features, hand off to TPO.
            </motion.p>

            <motion.div
              className="mt-8"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } },
              }}
            >
              {FLOW.map((step, i) => (
                <motion.div
                  key={step.title}
                  className="mm-pa-flow-step"
                  variants={{
                    hidden: { opacity: 0, x: -12 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
                  }}
                >
                  <span className="mm-pa-flow-step__num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="text-sm font-bold text-white">{step.title}</p>
                    <p className="text-xs text-slate-400">{step.help}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        <div className="mm-pa-login__form-wrap">
          <motion.div
            className="mm-pa-login-card"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.12 }}
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <img src={LOGO} alt="MentorMuni" className="mm-pa-logo" />
              <span className="mm-pa-badge mm-pa-badge--active">
                <span className="mm-pa-live-dot" /> Super Admin
              </span>
            </div>

            <h2 className="mb-1 text-2xl font-extrabold tracking-tight text-white">
              Sign in to Platform
            </h2>
            <p className="mm-pa-login-sub">
              Restricted operator access. No student dashboards here — tenants only.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div className="mm-pa-error" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                  {error}
                </motion.div>
              )}

              <div>
                <label className="mm-pa-label" htmlFor="pa-email">Login ID</label>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="pa-email"
                    type="email"
                    required
                    autoComplete="username"
                    className="mm-pa-input mm-pa-input--icon-left"
                    placeholder="admin@mentormuni.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mm-pa-label" htmlFor="pa-password">Password</label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="pa-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    className="mm-pa-input mm-pa-input--icons"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="mm-pa-login-eye"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="mm-pa-btn mm-pa-btn--primary w-full min-h-[48px]"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.985 }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Authenticating…
                  </>
                ) : (
                  <>
                    Enter Platform <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="mm-pa-login-tile">
                <Building2 size={14} className="mm-pa-login-tile__icon mm-pa-login-tile__icon--sky" />
                <p className="mm-pa-login-tile__title">Tenant Ops</p>
                <p className="mm-pa-login-tile__sub">Org · Plan · Features</p>
              </div>
              <div className="mm-pa-login-tile">
                <Zap size={14} className="mm-pa-login-tile__icon mm-pa-login-tile__icon--amber" />
                <p className="mm-pa-login-tile__title">Fast Handoff</p>
                <p className="mm-pa-login-tile__sub">TPO activation link</p>
              </div>
            </div>

            <p className="mm-pa-login-hint">
              Seeded admin: <span>admin@mentormuni.com</span>
            </p>

            <div className="mm-pa-login-note">
              <ShieldCheck size={16} className="mt-0.5 shrink-0" />
              <span>MentorMuni platform operators only. Student data lives in the Organization Portal.</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
