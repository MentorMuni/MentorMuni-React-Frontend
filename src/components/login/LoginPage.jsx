import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, Bot, Eye, EyeOff, Flame, Loader2, Lock, MessageCircle,
  Mic, Shield, Sparkles, UserRound, Users, X, Zap, GraduationCap,
} from 'lucide-react';
import RoutePageShell from '../layout/RoutePageShell';
import { authenticate } from '../../utils/auth';

const EASE = [0.22, 1, 0.36, 1];

const ROLES = [
  { key: 'student', label: 'Student', icon: GraduationCap, color: 'cyan', hint: 'Demo: STU001 / stu123', redirectTo: '/student/dashboard' },
  { key: 'mentor', label: 'Mentor', icon: Users, color: 'violet', hint: 'Demo: MENTOR01 / mentor123', redirectTo: '/mentor/dashboard' },
  { key: 'admin', label: 'Admin', icon: Shield, color: 'amber', hint: 'Demo: ADMIN01 / admin123', redirectTo: '/admin/dashboard' },
];

const TICKER = ['AI mocks', 'HR prep', 'DSA gaps', '24×7 mentor', 'Instant feedback', 'Placement ready', 'Mock interviews', 'Comm check'];

const BENTO = [
  { Icon: Bot, label: 'AI mentor', vibe: 'always on', hue: 'cyan' },
  { Icon: Mic, label: 'Mock rounds', vibe: 'real feedback', hue: 'violet' },
  { Icon: MessageCircle, label: 'HR prep', vibe: 'no cringe', hue: 'pink' },
  { Icon: Zap, label: 'Skill gaps', vibe: 'fixed fast', hue: 'lime' },
];

const CHAT_SNIPPET = [
  { from: 'ai', text: 'Run a quick HR round?' },
  { from: 'you', text: 'Built a tracker for 40+ students' },
  { from: 'ai', text: 'Fire 🔥 tighten line 2 impact' },
];

const bentoContainer = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.22 } } };
const bentoItem = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } } };

function ForgotPasswordModal({ open, onClose }) {
  const [userId, setUserId] = useState('');
  const [sent, setSent] = useState(false);
  const reduceMotion = useReducedMotion();
  const handleClose = () => { setSent(false); setUserId(''); onClose(); };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button type="button" className="mm-login-vibe-modal-backdrop" aria-label="Close"
            initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} />
          <motion.div role="dialog" aria-modal="true" aria-labelledby="forgot-password-title" className="mm-login-vibe-modal"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.32, ease: EASE }}>
            <button type="button" className="mm-login-vibe-modal__x" onClick={handleClose} aria-label="Close"><X size={18} /></button>
            {!sent ? (
              <>
                <span className="mm-login-vibe-modal__emoji" aria-hidden>🔐</span>
                <h2 id="forgot-password-title" className="mm-login-vibe-modal__title">Reset password</h2>
                <p className="mm-login-vibe-modal__sub">Drop your ID — we'll email reset steps.</p>
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mm-login-vibe-form">
                  <div className="mm-login-vibe-input-wrap">
                    <span className="mm-login-vibe-input-wrap__leading" aria-hidden><UserRound size={18} strokeWidth={2.25} /></span>
                    <input type="text" required placeholder="Your ID" value={userId} onChange={(e) => setUserId(e.target.value)} className="mm-login-vibe-input" />
                  </div>
                  <button type="submit" className="mm-login-vibe-btn mm-login-vibe-btn--full">Send link <ArrowRight size={18} aria-hidden /></button>
                </form>
              </>
            ) : (
              <div className="mm-login-vibe-modal__done">
                <Sparkles size={28} aria-hidden />
                <h2 id="forgot-password-title" className="mm-login-vibe-modal__title">Check inbox</h2>
                <p className="mm-login-vibe-modal__sub">Reset steps sent for <strong>{userId}</strong></p>
                <Link to="/contact" className="mm-login-vibe-modal__link" onClick={handleClose}>Still stuck? Hit support →</Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [activeRole, setActiveRole] = useState('student');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [error, setError] = useState('');

  const role = ROLES.find(r => r.key === activeRole);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId.trim() || !password) return;
    setError('');
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      const result = authenticate(userId, password, activeRole);
      if (result.ok) {
        navigate(role.redirectTo);
      } else {
        setError(result.error);
      }
    }, 650);
  };

  return (
    <RoutePageShell scope="marketing" className="mm-login-vibe-root">
      <section className="mm-login-vibe mm-marketing-hero-backdrop" aria-labelledby="login-vibe-heading">
        <div className="mm-login-vibe__noise" aria-hidden />
        <div className="mm-login-vibe__blob mm-login-vibe__blob--1" aria-hidden />
        <div className="mm-login-vibe__blob mm-login-vibe__blob--2" aria-hidden />
        <div className="mm-login-vibe__blob mm-login-vibe__blob--3" aria-hidden />

        <div className="mm-login-vibe__ticker-wrap" aria-hidden>
          <div className="mm-login-vibe__ticker">
            {[...TICKER, ...TICKER].map((item, i) => (
              <span key={i} className="mm-login-vibe__ticker-item"><Flame size={12} aria-hidden />{item}</span>
            ))}
          </div>
        </div>

        <div className="mm-container mm-login-vibe__stage">
          <motion.header className="mm-login-vibe__hero"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE }}>
            <span className="mm-login-vibe__pill">
              <span className="mm-login-vibe__pill-dot" aria-hidden />
              2,400+ students prepping right now
            </span>
            <h1 id="login-vibe-heading" className="mm-login-vibe__headline">
              <span className="mm-login-vibe__headline-line">Log in.</span>
              <span className="mm-login-vibe__headline-line mm-login-vibe__headline-grad">Get placement-ready.</span>
            </h1>
          </motion.header>

          <div className="mm-login-vibe__layout">
            <aside className="mm-login-vibe__showcase" aria-label="What you get with MentorMuni">
              <motion.div className="mm-login-vibe__bento" variants={reduceMotion ? undefined : bentoContainer}
                initial={reduceMotion ? false : 'hidden'} animate={reduceMotion ? undefined : 'show'}>
                {BENTO.map(({ Icon, label, vibe, hue }) => (
                  <motion.div key={label} className={`mm-login-vibe__bento-tile mm-login-vibe__bento-tile--${hue}`}
                    variants={reduceMotion ? undefined : bentoItem}
                    whileHover={reduceMotion ? undefined : { y: -4, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
                    <Icon size={20} strokeWidth={2.25} aria-hidden />
                    <span className="mm-login-vibe__bento-label">{label}</span>
                    <span className="mm-login-vibe__bento-vibe">{vibe}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div className="mm-login-vibe__chat-strip"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5, ease: EASE }}>
                <div className="mm-login-vibe__chat-strip-head">
                  <span className="mm-login-vibe__chat-live" aria-hidden />
                  Muni AI · live preview
                </div>
                <div className="mm-login-vibe__chat-strip-msgs">
                  {CHAT_SNIPPET.map((m, i) => (
                    <motion.span key={i} className={`mm-login-vibe__chat-msg mm-login-vibe__chat-msg--${m.from}`}
                      initial={reduceMotion ? false : { opacity: 0, x: m.from === 'ai' ? -10 : 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.12, duration: 0.35, ease: EASE }}>
                      {m.text}
                    </motion.span>
                  ))}
                  <span className="mm-login-vibe__chat-typing" aria-hidden><span /><span /><span /></span>
                </div>
              </motion.div>
            </aside>

            <div className="mm-login-vibe__main">
              <motion.div className="mm-login-vibe__card-shell"
                initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}>
                <div className="mm-login-vibe__card-glow" aria-hidden />
                <div className="mm-login-vibe__card">
                  {/* Role selector tabs */}
                  <div className="flex gap-2 mb-5">
                    {ROLES.map(r => {
                      const Icon = r.icon;
                      const active = r.key === activeRole;
                      return (
                        <button key={r.key} type="button" onClick={() => { setActiveRole(r.key); setError(''); setUserId(''); setPassword(''); }}
                          className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-200 border-2 ${
                            active
                              ? 'border-[#FF9500] bg-[#FF9500]/10 text-[#FF9500] shadow-md shadow-[#FF9500]/10'
                              : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70'
                          }`}>
                          <Icon size={16} />
                          {r.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mm-login-vibe__card-top">
                    <div className="mm-login-vibe__avatar" aria-hidden>
                      {activeRole === 'admin' ? <Shield size={22} /> : activeRole === 'mentor' ? <Users size={22} /> : <Bot size={22} />}
                    </div>
                    <div>
                      <p className="mm-login-vibe__card-eyebrow">{role.label} portal</p>
                      <h2 className="mm-login-vibe__card-title">Let's get you in</h2>
                    </div>
                  </div>

                  <form className="mm-login-vibe-form" onSubmit={handleSubmit} noValidate>
                    <AnimatePresence>
                      {error && (
                        <motion.p className="mm-login-vibe-form__error" role="alert"
                          initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <label className="mm-login-vibe-label" htmlFor="login-user-id">{role.label} ID</label>
                    <div className="mm-login-vibe-input-wrap">
                      <span className="mm-login-vibe-input-wrap__leading" aria-hidden><UserRound size={18} strokeWidth={2.25} /></span>
                      <input id="login-user-id" type="text" name="userId" autoComplete="username" required
                        placeholder={`Your ${role.label.toLowerCase()} ID`}
                        value={userId} onChange={(e) => setUserId(e.target.value)} className="mm-login-vibe-input" />
                    </div>

                    <div className="mm-login-vibe-label-row">
                      <label className="mm-login-vibe-label" htmlFor="login-password">Password</label>
                      <button type="button" className="mm-login-vibe-forgot" onClick={() => setForgotOpen(true)}>Forgot?</button>
                    </div>
                    <div className="mm-login-vibe-input-wrap">
                      <span className="mm-login-vibe-input-wrap__leading" aria-hidden><Lock size={18} strokeWidth={2.25} /></span>
                      <input id="login-password" type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password"
                        required placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="mm-login-vibe-input mm-login-vibe-input--pass" />
                      <button type="button" className="mm-login-vibe-input-wrap__toggle"
                        onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <motion.button type="submit" className="mm-login-vibe-btn mm-login-vibe-btn--full" disabled={loading}
                      whileHover={reduceMotion ? undefined : { scale: 1.02 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
                      {loading ? (<><Loader2 size={20} className="mm-login-vibe-spin" aria-hidden />Signing in…</>) :
                        (<>Let's go <ArrowRight size={20} aria-hidden /></>)}
                    </motion.button>
                  </form>

                  <p className="mm-login-vibe__fine">
                    New here? <Link to="/waitlist">Join waitlist</Link> · <Link to="/interview-readiness-tools">Free score first</Link>
                  </p>
                </div>

                <motion.div className="mm-login-vibe__float mm-login-vibe__float--1"
                  animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} aria-hidden>
                  <Bot size={16} />24×7 AI
                </motion.div>
                <motion.div className="mm-login-vibe__float mm-login-vibe__float--2"
                  animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} aria-hidden>
                  <Mic size={16} />Live mocks
                </motion.div>
              </motion.div>

              <p className="mm-login-vibe__legal">
                By logging in you agree to our <Link to="/terms">terms</Link> & <Link to="/privacy">privacy</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </RoutePageShell>
  );
}
