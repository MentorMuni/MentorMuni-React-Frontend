/**
 * Student portal login — light career-accelerator layout.
 * Desktop: value props | product stage | form
 * Tablet/mobile: stacked header → stage → form
 * No person illustrations — center stage shows MentorMuni portal offerings.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Gauge,
  CalendarDays,
  Headphones,
  Loader2,
  Lock,
  Mic2,
  Route,
  Search,
  Sparkles,
  Target,
  UserRound,
  X,
} from 'lucide-react';
import { useCollegeTenantContext } from '../../tenant/CollegeTenantProvider';
import {
  redirectToCollegePortal,
  tenantPortalPath,
} from '../../tenant/resolveTenant';
import { organizationLogoUrl } from '../../tenant/orgLogo';
import {
  fetchLoginColleges,
  pickInitialCollege,
  saveCollegeCode,
} from '../../orgPortal';
import {
  DEMO_STUDENT,
  clearStudentSession,
  getStudentSession,
  loginStudent,
  matchDemoStudent,
  studentMustChangePassword,
} from '../auth';
import { DEMO_ORG } from '../../organizationPortal/demoAuth';
import { studentPaths } from '../paths';
import { StudentThemeFab, useStudentTheme } from '../useStudentTheme.jsx';
import './student-login-career.css';

const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;
const EASE = [0.22, 1, 0.36, 1];
const SHOW_DEMO =
  import.meta.env.DEV || String(import.meta.env.VITE_SHOW_DEMO || '') === 'true';

const INDIVIDUAL_LOGIN = {
  id: 'public',
  name: 'Individual student',
  code: 'PUBLIC',
  city: '',
  state: '',
  individual: true,
};

const FEATURES = [
  {
    icon: Gauge,
    label: 'Know Your Readiness',
    detail: 'AI-powered score across DSA, aptitude, communication & soft skills',
    tone: 'violet',
  },
  {
    icon: Route,
    label: 'Personalized Roadmap',
    detail: 'Custom plan from your strengths and target roles',
    tone: 'green',
  },
  {
    icon: Mic2,
    label: 'AI Mentor 24×7',
    detail: 'Instant doubt solving and interview guidance',
    tone: 'orange',
  },
  {
    icon: Target,
    label: 'Practice & Improve',
    detail: 'Mocks, coding drills, quizzes, and company prep',
    tone: 'blue',
  },
  {
    icon: Sparkles,
    label: 'Get Placement Ready',
    detail: 'Build confidence for drive day and soft skills',
    tone: 'rose',
  },
];

const STATS = [
  { value: '10,000+', label: 'Students Trust Us' },
  { value: '100+', label: 'Colleges' },
  { value: '', label: 'Better Preparation · Better Placements' },
  { value: '', label: 'AI-Powered Platform' },
];

const READINESS = 85;
const R = 46;
const C = 2 * Math.PI * R;

function safeLoginError(message, fallback = 'Unable to sign in. Please try again.') {
  const text = String(message || '').trim();
  if (!text) return fallback;
  if (/api key|x-api-key|missing api|invalid or missing/i.test(text)) return fallback;
  return text;
}

/** Product-first center visual — readiness + AI mock + daily plan (no people). */
function PortalProductStage({ reduceMotion, collegeName }) {
  const [score, setScore] = useState(reduceMotion ? READINESS : 0);

  useEffect(() => {
    if (reduceMotion) return undefined;
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1600);
      setScore(Math.round(READINESS * (1 - (1 - t) ** 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  const offset = C * (1 - score / 100);

  return (
    <div className="mm-career-stage" aria-hidden>
      <div className="mm-career-stage__glow" />
      <div className="mm-career-stage__board" />

      <motion.div
        className="mm-career-stage__card mm-career-stage__card--readiness"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <p className="mm-career-stage__eyebrow">Interview readiness score</p>
        <div className="mm-career-stage__ring-wrap">
          <svg className="mm-career-stage__ring" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={R} className="mm-career-stage__ring-track" />
            <circle
              cx="60"
              cy="60"
              r={R}
              className="mm-career-stage__ring-prog"
              strokeDasharray={C}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="mm-career-stage__ring-score">
            <strong>{score}</strong>
            <span>/100</span>
          </div>
        </div>
        <p className="mm-career-stage__hint">
          {collegeName ? `${collegeName}` : 'Campus-tuned placement signal'}
        </p>
      </motion.div>

      <motion.div
        className="mm-career-stage__card mm-career-stage__card--goal"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.45, ease: EASE }}
      >
        <span className="mm-career-stage__pill">Today’s goal</span>
        <strong>3/5 tasks completed</strong>
        <p>Close DSA gaps · personalized roadmap</p>
      </motion.div>

      <motion.div
        className="mm-career-stage__card mm-career-stage__card--mock"
        initial={reduceMotion ? false : { opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.18, duration: 0.45, ease: EASE }}
      >
        <div className="mm-career-stage__mock-top">
          <Mic2 size={15} strokeWidth={2.2} />
          <span>AI interview mock</span>
          <em>Live</em>
        </div>
        <div className="mm-career-stage__wave">
          {Array.from({ length: 12 }).map((_, i) => (
            <i key={i} style={{ animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
        <p>Speak like drive day. Get calm, specific feedback.</p>
      </motion.div>

      <motion.div
        className="mm-career-stage__card mm-career-stage__card--next"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.45, ease: EASE }}
      >
        <span className="mm-career-stage__pill mm-career-stage__pill--warm">
          <CalendarDays size={12} strokeWidth={2.4} aria-hidden /> Next mock
        </span>
        <strong>In 2 days</strong>
        <p>Company drill · HR + tech</p>
      </motion.div>

      <motion.div
        className="mm-career-stage__card mm-career-stage__card--drills"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.45, ease: EASE }}
      >
        <span className="mm-career-stage__pill mm-career-stage__pill--warm">Company drills</span>
        <div className="mm-career-stage__chips">
          <span>TCS NQT</span>
          <span>Product</span>
          <span>HR mock</span>
        </div>
      </motion.div>

      <p className="mm-career-stage__quote">
        “The best preparation today leads to the{' '}
        <em>opportunities</em> of tomorrow.”
      </p>
    </div>
  );
}

export default function StudentLoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reduceMotion = useReducedMotion();
  const { theme, toggle, rootClass } = useStudentTheme();
  const {
    college: tenantCollege,
    organizationCode: tenantOrgCode,
    locked: tenantLocked,
    loading: tenantLoading,
    error: tenantError,
    isTenantHost,
  } = useCollegeTenantContext();

  const [step, setStep] = useState(() => (isTenantHost ? 'login' : 'college'));
  const [colleges, setColleges] = useState([]);
  const [college, setCollege] = useState(null);
  const [collegesLoading, setCollegesLoading] = useState(true);
  const [collegesWarning, setCollegesWarning] = useState('');
  const [collegeQuery, setCollegeQuery] = useState('');
  const [listOpen, setListOpen] = useState(true);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSession, setActiveSession] = useState(() => getStudentSession());

  const activeCollege = tenantLocked ? tenantCollege || college : college;
  const orgCode = String(
    activeCollege?.code || (tenantLocked ? tenantOrgCode : '') || ''
  )
    .trim()
    .toUpperCase();
  const isIndividualLogin = Boolean(activeCollege?.individual) || orgCode === 'PUBLIC';
  const collegeName = activeCollege?.name || '';
  const collegeLogo =
    activeCollege?.has_logo && activeCollege?.id
      ? organizationLogoUrl(activeCollege.id, {
          updatedAt: activeCollege.logo_updated_at,
        })
      : null;
  const collegeHostLabel = activeCollege?.portal_slug
    ? `${activeCollege.portal_slug}.mentormuni.com`
    : activeCollege?.code
      ? String(activeCollege.code).toLowerCase()
      : '';

  const filteredColleges = useMemo(() => {
    const q = collegeQuery.trim().toLowerCase();
    if (!q) return [];
    return colleges.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        `${c.city} ${c.state}`.toLowerCase().includes(q)
    );
  }, [colleges, collegeQuery]);

  const collegeQueryActive = collegeQuery.trim().length > 0;
  const canContinue = Boolean(
    college?.code && colleges.some((c) => c.code === college.code) && !listOpen
  );

  useEffect(() => {
    if (!tenantLocked || !tenantCollege?.code) return;
    setCollege(tenantCollege);
    saveCollegeCode(tenantCollege.code);
    setListOpen(false);
    setStep('login');
  }, [tenantLocked, tenantCollege]);

  useEffect(() => {
    if (!listOpen || !collegeQueryActive || !college?.code) return;
    if (!filteredColleges.some((c) => c.code === college.code)) setCollege(null);
  }, [college, filteredColleges, listOpen, collegeQueryActive]);

  useEffect(() => {
    if (tenantLocked) {
      setCollegesLoading(tenantLoading);
      if (tenantError) setCollegesWarning(tenantError);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      setCollegesLoading(true);
      const result = await fetchLoginColleges();
      if (cancelled) return;
      setCollegesLoading(false);
      if (!result.ok) {
        setColleges([]);
        setCollegesWarning(result.warning || 'Unable to load campuses.');
        return;
      }
      const list = result.colleges || [];
      setColleges(list);
      setCollegesWarning(result.warning || '');

      const wantPrefill =
        SHOW_DEMO &&
        /^(1|true|yes|demo)$/i.test(
          String(searchParams.get('prefill') || searchParams.get('demo') || '').trim()
        );
      if (wantPrefill) {
        const demoCollege =
          list.find((c) => c.code === DEMO_ORG.code) || {
            id: DEMO_ORG.id,
            name: DEMO_ORG.name,
            code: DEMO_ORG.code,
            city: DEMO_ORG.city,
            state: DEMO_ORG.state,
          };
        if (!list.some((c) => c.code === DEMO_ORG.code)) setColleges([demoCollege, ...list]);
        setCollege(demoCollege);
        saveCollegeCode(DEMO_ORG.code);
        setUserId(DEMO_STUDENT.email);
        setPassword(DEMO_STUDENT.password);
        setListOpen(false);
        setStep('login');
        setSuccess('Sample credentials prefilled. Click Login to continue.');
        return;
      }

      const wantIndividual =
        /^(PUBLIC)$/i.test(
          String(
            searchParams.get('org') || searchParams.get('code') || searchParams.get('college') || ''
          ).trim()
        ) || /^(1|true|yes|individual)$/i.test(String(searchParams.get('individual') || '').trim());
      if (wantIndividual) {
        setCollege(INDIVIDUAL_LOGIN);
        saveCollegeCode('PUBLIC');
        setListOpen(false);
        setStep('login');
        return;
      }

      const initial = pickInitialCollege(list, searchParams);
      if (initial) {
        setCollege(initial);
        setListOpen(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchParams, tenantLocked, tenantLoading, tenantError]);

  useEffect(() => {
    const forceLogout = /^(1|true|yes|logout)$/i.test(
      String(searchParams.get('logout') || searchParams.get('force') || '').trim()
    );
    if (!forceLogout) return;
    clearStudentSession();
    setActiveSession(null);
    navigate(studentPaths.login, { replace: true });
  }, [navigate, searchParams]);

  useEffect(() => {
    if (step === 'login' && !collegesLoading && !activeCollege?.code && !tenantLocked) {
      setStep('college');
      setListOpen(true);
    }
  }, [step, activeCollege, collegesLoading, tenantLocked]);

  const confirmCollege = () => {
    if (!canContinue) {
      setError('Select a college from the list to continue.');
      setListOpen(true);
      return;
    }
    if (typeof window !== 'undefined' && college?.portal_slug && !tenantLocked) {
      const host = window.location.hostname.toLowerCase();
      if (host.endsWith('mentormuni.com') || host === 'localhost' || host.endsWith('.localhost')) {
        redirectToCollegePortal(college.portal_slug, '/studentportal/login');
        return;
      }
    }
    saveCollegeCode(college.code);
    setError('');
    setSuccess('');
    setListOpen(false);
    setStep('login');
  };

  const chooseIndividual = () => {
    setCollege(INDIVIDUAL_LOGIN);
    saveCollegeCode('PUBLIC');
    setListOpen(false);
    setError('');
    setSuccess('');
    setStep('login');
  };

  const pickCollege = (c) => {
    setCollege(c);
    setError('');
    setListOpen(false);
    setCollegeQuery('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim() || !password) return;
    const demo = matchDemoStudent(userId, password);
    const code = demo ? DEMO_ORG.code : orgCode;
    if (!demo && !code) return;
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const result = await loginStudent(userId, password, code);
      if (!result.ok) {
        setError(safeLoginError(result.error, 'Invalid college ID / email or password.'));
        return;
      }
      saveCollegeCode(code);
      navigate(
        studentMustChangePassword(result.user) ? studentPaths.changePassword : studentPaths.home,
        { replace: true }
      );
    } catch (err) {
      setError(safeLoginError(err?.message));
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    if (tenantLocked) return;
    const demoCollege =
      colleges.find((c) => c.code === DEMO_ORG.code) || {
        id: DEMO_ORG.id,
        name: DEMO_ORG.name,
        code: DEMO_ORG.code,
        city: DEMO_ORG.city,
        state: DEMO_ORG.state,
      };
    setCollege(demoCollege);
    setColleges((list) =>
      list.some((c) => c.code === DEMO_ORG.code) ? list : [demoCollege, ...list]
    );
    saveCollegeCode(DEMO_ORG.code);
    setUserId(DEMO_STUDENT.email);
    setPassword(DEMO_STUDENT.password);
    setError('');
    setListOpen(false);
    setStep('login');
    setSuccess('Sample credentials prefilled. Click Login to continue.');
  };

  const signOutAndStay = () => {
    clearStudentSession();
    setActiveSession(null);
    setUserId('');
    setPassword('');
    setSuccess('');
    setError('');
    setStep(tenantLocked ? 'login' : 'college');
    setListOpen(!tenantLocked);
    navigate(studentPaths.login, { replace: true });
  };

  const showLogin = step === 'login';

  return (
    <div className={`mm-career-root ${rootClass}`}>
      <StudentThemeFab theme={theme} onToggle={toggle} />
      {activeSession ? (
        <div className="mm-career-session" role="status">
          <p>
            Signed in as <strong>{activeSession.name || activeSession.email || 'student'}</strong>
            {activeSession.organization_name ? ` · ${activeSession.organization_name}` : ''}
          </p>
          <div className="mm-career-session__actions">
            <button
              type="button"
              onClick={() =>
                navigate(
                  studentMustChangePassword(activeSession)
                    ? studentPaths.changePassword
                    : studentPaths.home,
                  { replace: true }
                )
              }
            >
              Continue to home
            </button>
            <button type="button" className="is-ghost" onClick={signOutAndStay}>
              Sign out
            </button>
          </div>
        </div>
      ) : null}

      <header className="mm-career-top">
        <div className="mm-career-brand">
          <img src={LOGO} alt="MentorMuni" />
          <div className="mm-career-brand__text">
            <div className="mm-career-brand__title">
              <strong>MentorMuni</strong>
              {(collegeName || tenantLocked) && (
                <>
                  <span className="mm-career-brand__dot" aria-hidden>
                    ·
                  </span>
                  {collegeLogo ? (
                    <img
                      className="mm-career-brand__college-logo"
                      src={collegeLogo}
                      alt=""
                      width={22}
                      height={22}
                    />
                  ) : null}
                  <em className="mm-career-brand__college" title={collegeName || undefined}>
                    {collegeName || (tenantLoading ? 'Loading…' : 'Campus portal')}
                  </em>
                </>
              )}
            </div>
            <span className="mm-career-brand__tag">Career accelerator platform</span>
          </div>
        </div>
      </header>

      <div className={`mm-career-shell ${showLogin ? 'is-login' : 'is-gate'}`}>
        {/* Left — value props (desktop) */}
        <aside className="mm-career-value">
          <span className="mm-career-badge">Student portal</span>
          <h1>
            Your Placement Journey <em>Starts Here.</em>
          </h1>
          <p className="mm-career-lede">
            MentorMuni helps you prepare smarter, practice better and get placed in your dream
            company.
          </p>
          <ul className="mm-career-features">
            {FEATURES.map(({ icon: Icon, label, detail, tone }) => (
              <li key={label}>
                <span className={`mm-career-features__icon is-${tone}`}>
                  <Icon size={16} strokeWidth={2.2} />
                </span>
                <div>
                  <strong>{label}</strong>
                  <span>{detail}</span>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Center — MentorMuni product stage (no person image) */}
        <section className="mm-career-center" aria-label="MentorMuni student portal preview">
          <PortalProductStage reduceMotion={reduceMotion} collegeName={collegeName} />
        </section>

        {/* Right — form */}
        <section className="mm-career-form-col">
          <div className="mm-career-card">
            {!showLogin ? (
              <>
                <h2>Where do you study?</h2>
                <p className="mm-career-card__sub">
                  Choose your campus so prep, drives, and enrollment stay aligned.
                </p>

                {SHOW_DEMO && !tenantLocked ? (
                  <div className="mm-career-demo">
                    <p>
                      Sample: <code>{DEMO_STUDENT.email}</code> / <code>{DEMO_STUDENT.password}</code>
                    </p>
                    <button type="button" onClick={fillDemo}>
                      Prefill sample
                    </button>
                  </div>
                ) : null}

                {collegesWarning ? (
                  <div className="mm-career-alert is-error" role="status">
                    {collegesWarning}
                  </div>
                ) : null}

                {college && !listOpen ? (
                  <div className="mm-career-selected">
                    <div>
                      <p className="mm-career-selected__label">Selected campus</p>
                      <p className="mm-career-selected__name">{college.name}</p>
                      <p className="mm-career-selected__meta">
                        {[college.city, college.state].filter(Boolean).join(', ')}
                        {college.code ? ` · ${college.code}` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setListOpen(true);
                        setCollegeQuery('');
                      }}
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <>
                    <label className="mm-career-field">
                      <span>Search campus</span>
                      <div className="mm-career-input">
                        <Search size={17} aria-hidden />
                        <input
                          type="search"
                          autoComplete="off"
                          placeholder="Type BITS, NIT, your city…"
                          value={collegeQuery}
                          onChange={(e) => {
                            setCollegeQuery(e.target.value);
                            setError('');
                            setListOpen(true);
                          }}
                          onFocus={() => setListOpen(true)}
                        />
                        {collegeQuery ? (
                          <button
                            type="button"
                            className="mm-career-eye"
                            aria-label="Clear"
                            onClick={() => setCollegeQuery('')}
                          >
                            <X size={16} />
                          </button>
                        ) : null}
                      </div>
                    </label>

                    {collegesLoading ? (
                      <div className="mm-career-empty">
                        <Loader2 size={18} className="mm-career-spin" /> Loading campuses…
                      </div>
                    ) : !collegeQueryActive ? (
                      <div className="mm-career-empty">Type your campus name, city, or code</div>
                    ) : filteredColleges.length ? (
                      <ul className="mm-career-college-list" role="listbox">
                        {filteredColleges.map((c) => (
                          <li key={c.code}>
                            <button type="button" onClick={() => pickCollege(c)}>
                              <strong>{c.name}</strong>
                              <span>
                                {[c.city, c.state].filter(Boolean).join(', ')}
                                {c.code ? ` · ${c.code}` : ''}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="mm-career-empty">No campuses match.</div>
                    )}
                  </>
                )}

                {error ? (
                  <div className="mm-career-alert is-error" role="alert">
                    {error}
                  </div>
                ) : null}

                <button
                  type="button"
                  className="mm-career-cta"
                  disabled={!canContinue}
                  onClick={confirmCollege}
                >
                  Continue to login <ArrowRight size={18} />
                </button>
                <button type="button" className="mm-career-ghost" onClick={chooseIndividual}>
                  Individual student — continue without a college
                </button>
              </>
            ) : (
              <>
                <div className="mm-career-card__hero">
                  <Building2 size={28} className="mm-career-card__hero-icon" aria-hidden />
                  <h2>Welcome Back!</h2>
                  <p>
                    {isIndividualLogin
                      ? 'Login to your MentorMuni student portal'
                      : 'Login to your college portal'}
                  </p>
                </div>

                {tenantError && tenantLocked ? (
                  <div className="mm-career-alert is-error" role="alert">
                    {tenantError}
                  </div>
                ) : null}
                {success ? (
                  <div className="mm-career-alert is-ok" role="status">
                    {success}
                  </div>
                ) : null}
                {error ? (
                  <div className="mm-career-alert is-error" role="alert">
                    {error}
                  </div>
                ) : null}

                <form className="mm-career-form" onSubmit={handleSubmit} noValidate>
                  <label className="mm-career-field">
                    <span>College / Organization</span>
                    <div
                      className={`mm-career-input mm-career-input--college is-locked ${
                        tenantLocked ? 'is-tenant' : ''
                      }`}
                    >
                      <Building2 size={17} aria-hidden />
                      <div className="mm-career-input__stack">
                        <input
                          type="text"
                          readOnly
                          value={
                            collegeName ||
                            (tenantLoading ? 'Loading campus…' : 'Select campus')
                          }
                        />
                        {collegeHostLabel ? (
                          <span className="mm-career-input__host">{collegeHostLabel}</span>
                        ) : null}
                      </div>
                      {!tenantLocked ? (
                        <button
                          type="button"
                          className="mm-career-change"
                          onClick={() => {
                            setStep('college');
                            setCollegeQuery('');
                            setError('');
                            if (isIndividualLogin) {
                              setCollege(null);
                              setListOpen(true);
                            } else {
                              setListOpen(false);
                            }
                          }}
                        >
                          Change
                        </button>
                      ) : null}
                    </div>
                  </label>

                  <label className="mm-career-field">
                    <span>Login ID / College ID / Email</span>
                    <div className="mm-career-input">
                      <UserRound size={17} aria-hidden />
                      <input
                        name="username"
                        autoComplete="username"
                        autoFocus
                        placeholder="Enter your ID / Email"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                      />
                    </div>
                  </label>

                  <label className="mm-career-field">
                    <span>Password</span>
                    <div className="mm-career-input">
                      <Lock size={17} aria-hidden />
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="mm-career-eye"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                    <Link
                      to={tenantPortalPath(studentPaths.forgotPassword)}
                      className="mm-career-forgot"
                    >
                      Forgot Password?
                    </Link>
                  </label>

                  {SHOW_DEMO && !tenantLocked ? (
                    <button type="button" className="mm-career-demo-link" onClick={fillDemo}>
                      Prefill sample student
                    </button>
                  ) : null}

                  <button
                    type="submit"
                    className="mm-career-cta"
                    disabled={
                      loading ||
                      !userId.trim() ||
                      !password ||
                      (!matchDemoStudent(userId, password) && !orgCode)
                    }
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="mm-career-spin" /> Signing in…
                      </>
                    ) : (
                      <>
                        Login <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <div className="mm-career-support">
                  <Headphones size={16} aria-hidden />
                  <span className="mm-career-support__full">
                    Need help? Contact your TPO or{' '}
                    <a href="mailto:mentormuniteam@gmail.com">MentorMuni Support</a>
                  </span>
                  <span className="mm-career-support__short">
                    <a href="mailto:mentormuniteam@gmail.com">Contact TPO / Support</a>
                  </span>
                </div>

                <p className="mm-career-foot">
                  {isIndividualLogin ? (
                    <>
                      Need an invite?{' '}
                      <a href="mailto:mentormuniteam@gmail.com" className="mm-career-link">
                        Contact MentorMuni support
                      </a>
                      .
                    </>
                  ) : (
                    <>
                      New student?{' '}
                      <Link
                        to={
                          activeCollege?.code
                            ? `${studentPaths.enroll}?org=${encodeURIComponent(activeCollege.code)}`
                            : studentPaths.enroll
                        }
                        className="mm-career-link"
                      >
                        Create your account
                      </Link>
                      {' · '}
                      Staff?{' '}
                      <Link to={tenantPortalPath('/Organization/login')} className="mm-career-link">
                        Organization portal
                      </Link>
                    </>
                  )}
                </p>
              </>
            )}
          </div>
        </section>
      </div>

      <footer className="mm-career-stats" aria-label="Platform highlights">
        {STATS.map((s) => (
          <div key={s.label} className="mm-career-stats__item">
            {s.value ? <strong>{s.value}</strong> : null}
            <span>{s.label}</span>
          </div>
        ))}
      </footer>
    </div>
  );
}
