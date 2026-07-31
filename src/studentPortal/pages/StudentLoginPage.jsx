import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Mic2,
  Search,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import {
  fetchLoginColleges,
  pickInitialCollege,
  saveCollegeCode,
} from '../../orgPortal';
import {
  DEMO_STUDENT,
  isStudentAuthenticated,
  loginStudent,
  matchDemoStudent,
} from '../auth';
import { DEMO_ORG } from '../../organizationPortal/demoAuth';
import { studentPaths } from '../paths';
import { useStudentTheme } from '../useStudentTheme.jsx';
import OrgThemeToggle from '../../organizationPortal/OrgThemeToggle';
import '../../components/organization/organization-login.css';
import './student-login-bridge.css';

const EASE = [0.22, 1, 0.36, 1];
const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;
const SHOW_DEMO =
  import.meta.env.DEV || String(import.meta.env.VITE_SHOW_DEMO || '') === 'true';

const STUDENT_HIGHLIGHTS = [
  {
    icon: Target,
    title: 'Know your readiness',
    text: 'See gaps before drive week — not after the shortlist.',
  },
  {
    icon: Mic2,
    title: 'Practice like the round',
    text: 'Mocks and missions that mirror campus interviews.',
  },
  {
    icon: Sparkles,
    title: 'A clear next step',
    text: 'Daily focus tuned to your college and target companies.',
  },
];

function safeLoginError(message, fallback = 'Unable to sign in. Please try again.') {
  const text = String(message || '').trim();
  if (!text) return fallback;
  if (/api key|x-api-key|missing api|invalid or missing/i.test(text)) return fallback;
  return text;
}

export default function StudentLoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reduceMotion = useReducedMotion();
  const { theme, toggle } = useStudentTheme();

  const [step, setStep] = useState('college');
  const [colleges, setColleges] = useState([]);
  const [college, setCollege] = useState(null);
  const [collegesLoading, setCollegesLoading] = useState(true);
  const [collegeQuery, setCollegeQuery] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  /** When false and a campus is chosen, show the selected card + Change (not the dropdown). */
  const [pickingCampus, setPickingCampus] = useState(true);

  const orgCode = String(college?.code || '').trim().toUpperCase();

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
    college?.code && colleges.some((c) => c.code === college.code) && !pickingCampus
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCollegesLoading(true);
      const result = await fetchLoginColleges();
      if (cancelled) return;
      setCollegesLoading(false);
      if (!result.ok) {
        setColleges([]);
        return;
      }
      setColleges(result.colleges || []);
      const initial = pickInitialCollege(result.colleges, searchParams);
      if (initial) {
        setCollege(initial);
        setPickingCampus(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  useEffect(() => {
    if (isStudentAuthenticated()) {
      navigate(studentPaths.home, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (step === 'login' && !collegesLoading && !college?.code) {
      setStep('college');
    }
  }, [step, college, collegesLoading]);

  const confirmCollege = () => {
    if (!canContinue) {
      setError('Select a campus from the list to continue.');
      setPickingCampus(true);
      return;
    }
    saveCollegeCode(college.code);
    setError('');
    setSuccess('');
    setPickingCampus(false);
    setStep('login');
  };

  const pickCollege = (c) => {
    setCollege(c);
    setError('');
    setPickingCampus(false);
    setCollegeQuery('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim() || !password) return;
    const demo = matchDemoStudent(userId, password);
    if (!demo && !orgCode) return;
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const code = demo ? DEMO_ORG.code : orgCode;
      const result = await loginStudent(userId, password, code);
      if (!result.ok) {
        setError(safeLoginError(result.error, 'Invalid college ID / email or password.'));
        return;
      }
      saveCollegeCode(code);
      navigate(studentPaths.home, { replace: true });
    } catch (err) {
      setError(safeLoginError(err?.message));
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    const demoCollege =
      colleges.find((c) => c.code === DEMO_ORG.code) || {
        id: DEMO_ORG.id,
        name: DEMO_ORG.name,
        code: DEMO_ORG.code,
        city: DEMO_ORG.city,
        state: DEMO_ORG.state,
      };
    setCollege(demoCollege);
    saveCollegeCode(DEMO_ORG.code);
    setUserId(DEMO_STUDENT.email);
    setPassword(DEMO_STUDENT.password);
    setError('');
    setPickingCampus(false);
    setStep('login');
  };

  return (
    <div
      className={`mm-org-root-login mm-org-root-login--student mm-stu-portal-login ${
        theme === 'light' ? 'is-light' : 'is-dark'
      }`}
    >
      <div className={`mm-org-atm ${theme === 'light' ? 'mm-org-atm--light' : ''}`} aria-hidden>
        <div className="mm-org-atm__grid" />
        <div className="mm-org-atm__orb mm-org-atm__orb--1" />
        <div className="mm-org-atm__orb mm-org-atm__orb--2" />
        <div className="mm-org-atm__orb mm-org-atm__orb--3" />
      </div>

      <OrgThemeToggle
        theme={theme}
        onToggle={toggle}
        className="mm-org-theme-toggle--floating"
      />

      <AnimatePresence mode="wait">
        {step === 'college' ? (
          <motion.div
            key="college-gate"
            className="mm-org-gate"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <section className="mm-org-gate__stage">
              <div className="mm-org-gate__stage-inner">
                <Link to="/" className="mm-org-gate__brand-link">
                  <img src={LOGO} alt="MentorMuni" className="mm-org-gate__brand-logo" />
                  <span>MentorMuni</span>
                </Link>

                <p className="mm-org-gate__kicker">For students</p>
                <h1 className="mm-org-gate__headline">
                  Walk into drives
                  <br />
                  offer-ready
                </h1>
                <p className="mm-org-gate__lede">
                  Your campus placement coach — readiness, mocks, and a clear next step every day.
                  Not the TPO desk. This portal is yours.
                </p>

                <ul className="mm-org-gate__value" aria-label="Why students use MentorMuni">
                  {STUDENT_HIGHLIGHTS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.title}>
                        <Icon size={18} aria-hidden />
                        <div>
                          <strong>{item.title}</strong>
                          <em>{item.text}</em>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>

            <motion.aside
              className="mm-org-gate__panel"
              initial={reduceMotion ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div className="mm-org-gate__panel-inner">
                <div className="mm-stu-gate-brand">
                  <Link to="/" className="mm-stu-gate-brand__link">
                    <img src={LOGO} alt="MentorMuni" className="mm-stu-gate-brand__logo" />
                    <span>MentorMuni</span>
                  </Link>
                  <span className="mm-stu-gate-brand__badge">
                    <GraduationCap size={13} aria-hidden />
                    Student portal
                  </span>
                </div>

                <div className="mm-stu-gate-path" aria-hidden>
                  <span className="is-current">
                    <MapPin size={12} />
                    Campus
                  </span>
                  <span className="mm-stu-gate-path__line" />
                  <span>
                    <Lock size={12} />
                    Sign in
                  </span>
                  <span className="mm-stu-gate-path__line" />
                  <span>
                    <Target size={12} />
                    Prep
                  </span>
                </div>

                <div className="mm-org-gate__progress" aria-hidden>
                  <span className="is-active" />
                  <span />
                </div>
                <p className="mm-org-gate__eyebrow">Step 1 of 2</p>
                <h2 className="mm-org-gate__title">Select your campus</h2>
                <p className="mm-org-gate__sub">
                  Lock your college so prep, drives, and your roster stay aligned.
                </p>

                <div className="mm-org-gate__form-block">
                  <label className="mm-org-gate__label" htmlFor="stu-campus-q">
                    Campus
                  </label>

                  {collegesLoading ? (
                    <div className="mm-org-gate__select-shell is-loading">
                      <Loader2 className="mm-org-login__spin" size={18} />
                      Loading campuses…
                    </div>
                  ) : colleges.length ? (
                    college?.code && !pickingCampus ? (
                      <div className="mm-org-gate__selected">
                        <span className="mm-org-gate__selected-mark" aria-hidden>
                          <Check size={14} strokeWidth={2.6} />
                        </span>
                        <div>
                          <strong title={college.name}>{college.name}</strong>
                          <small>
                            {[college.city, college.state].filter(Boolean).join(', ')}
                            {college.code ? ` · ${college.code}` : ''}
                          </small>
                        </div>
                        <button
                          type="button"
                          className="mm-stu-campus-change"
                          onClick={() => {
                            setPickingCampus(true);
                            setCollegeQuery('');
                            setError('');
                          }}
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="mm-org-gate__field mm-stu-campus-search">
                          <Search size={16} aria-hidden />
                          <input
                            id="stu-campus-q"
                            type="search"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                            placeholder="Type BITS, NIT, your city…"
                            value={collegeQuery}
                            onChange={(e) => {
                              setCollegeQuery(e.target.value);
                              setError('');
                            }}
                            aria-label="Search campuses"
                          />
                          {collegeQuery ? (
                            <button
                              type="button"
                              className="mm-stu-campus-clear"
                              aria-label="Clear search"
                              onClick={() => setCollegeQuery('')}
                            >
                              <X size={15} />
                            </button>
                          ) : null}
                        </div>

                        {!collegeQueryActive ? (
                          <div className="mm-stu-campus-hint">
                            <Search size={15} aria-hidden />
                            <span>Type your campus name, city, or code to find it</span>
                          </div>
                        ) : filteredColleges.length ? (
                          <ul className="mm-stu-campus-list" role="listbox" aria-label="Campuses">
                            {filteredColleges.map((c) => {
                              const selected = college?.code === c.code;
                              return (
                                <li key={c.code}>
                                  <button
                                    type="button"
                                    role="option"
                                    aria-selected={selected}
                                    className={`mm-stu-campus-item ${selected ? 'is-selected' : ''}`}
                                    onClick={() => pickCollege(c)}
                                  >
                                    <span className="mm-stu-campus-item__mark">
                                      {selected ? (
                                        <Check size={14} strokeWidth={2.6} />
                                      ) : (
                                        (c.code || '?').slice(0, 3)
                                      )}
                                    </span>
                                    <span className="mm-stu-campus-item__text">
                                      <span className="mm-stu-campus-item__name">{c.name}</span>
                                      <span className="mm-stu-campus-item__meta">
                                        {[c.city, c.state].filter(Boolean).join(', ')}
                                        {c.code ? ` · ${c.code}` : ''}
                                      </span>
                                    </span>
                                    {selected ? (
                                      <span className="mm-stu-campus-item__badge">Selected</span>
                                    ) : null}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="mm-org-gate__hint">No campuses match. Try another name or code.</p>
                        )}
                      </>
                    )
                  ) : (
                    <div className="mm-org-gate__empty-card">
                      <p>Campus list is temporarily unavailable.</p>
                      <button
                        type="button"
                        className="mm-org-gate__retry"
                        onClick={() => {
                          setCollegesLoading(true);
                          fetchLoginColleges().then((result) => {
                            setCollegesLoading(false);
                            setColleges(result.ok ? result.colleges : []);
                            if (result.ok) {
                              const initial = pickInitialCollege(result.colleges, searchParams);
                              if (initial) {
                                setCollege(initial);
                                setPickingCampus(false);
                              }
                            }
                          });
                        }}
                      >
                        Try again
                      </button>
                    </div>
                  )}
                </div>

                {error && step === 'college' ? (
                  <div className="mm-org-login__alert mm-org-login__alert--err" role="alert">
                    <p>{error}</p>
                  </div>
                ) : null}

                <button
                  type="button"
                  className="mm-org-gate__cta"
                  disabled={!canContinue}
                  onClick={confirmCollege}
                >
                  Continue to student sign-in
                  <ArrowRight size={16} aria-hidden />
                </button>

                <p className="mm-org-gate__footnote">
                  Student access only. Staff use the{' '}
                  <Link to="/Organization/login" className="mm-stu-bridge-link">
                    Organization portal
                  </Link>
                  .
                </p>

                <p className="mm-org-gate__footnote mm-stu-bridge-enroll">
                  Not enrolled yet?{' '}
                  <Link
                    to={
                      college?.code
                        ? `${studentPaths.enroll}?org=${encodeURIComponent(college.code)}`
                        : studentPaths.enroll
                    }
                  >
                    Request enrollment
                  </Link>
                </p>
              </div>
            </motion.aside>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            className="mm-org-login"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <section className="mm-org-login__showcase">
              <div className="mm-org-login__showcase-inner">
                <Link to="/" className="mm-org-login__brand">
                  <img
                    src={LOGO}
                    alt="MentorMuni"
                    className="mm-org-login__logo mm-org-login__logo--lg"
                  />
                  <span className="mm-org-login__brand-name">MentorMuni</span>
                </Link>

                <button
                  type="button"
                  className="mm-org-login__campus-chip is-button"
                  onClick={() => setStep('college')}
                >
                  <MapPin size={13} aria-hidden />
                  <span className="mm-org-login__campus-copy">
                    <strong>{college?.name || 'Campus'}</strong>
                    {college?.code ? <em>{college.code}</em> : null}
                  </span>
                  <span className="mm-org-login__change">Change</span>
                </button>

                <p className="mm-org-login__pill">
                  <GraduationCap size={13} aria-hidden />
                  <span>Student · Placement prep</span>
                </p>
                <h1 className="mm-org-login__headline">Continue your offer path</h1>
                <p className="mm-org-login__accent">
                  Readiness, mocks, and today&apos;s mission — in one place.
                </p>
                <p className="mm-org-login__lede">
                  Sign in for {college?.name || 'your campus'} to pick up where you left off. This is
                  your prep workspace — not the college admin portal.
                </p>

                <ul className="mm-org-login__value" aria-label="Student benefits">
                  {STUDENT_HIGHLIGHTS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.title}>
                        <Icon size={18} aria-hidden />
                        <div>
                          <strong>{item.title}</strong>
                          <em>{item.text}</em>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>

            <div className="mm-org-login__form-wrap">
              <motion.div
                className="mm-org-login__card"
                initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}
              >
                <div className="mm-org-login__progress" aria-hidden>
                  <span />
                  <span className="is-active" />
                </div>
                <p className="mm-org-login__step-label">Step 2 of 2</p>

                <div className="mm-org-login__card-top">
                  <div className="mm-org-login__card-brand">
                    <img src={LOGO} alt="MentorMuni" className="mm-org-login__logo" />
                    <span>MentorMuni</span>
                  </div>
                  <span className="mm-org-login__badge">
                    <span className="mm-org-login__live" /> {college?.code || 'Student'}
                  </span>
                </div>

                <h2 className="mm-org-login__card-title">Student login</h2>
                <p className="mm-org-login__card-sub">
                  Sign in for {college?.name || 'your campus'} with your college ID or email.
                </p>

                {SHOW_DEMO ? (
                  <div className="mm-org-login__demo" role="note">
                    <p className="mm-org-login__demo-title">Temp demo credentials (remove later)</p>
                    <p className="mm-org-login__demo-line">
                      College: <strong>DEMO</strong> · MentorMuni Demo College
                    </p>
                    <p className="mm-org-login__demo-line">
                      Student: <code>{DEMO_STUDENT.email}</code> / <code>{DEMO_STUDENT.password}</code>
                    </p>
                    <button type="button" className="mm-org-login__demo-fill" onClick={fillDemo}>
                      Fill student demo
                    </button>
                  </div>
                ) : null}

                <form className="mm-org-login__form" onSubmit={handleSubmit} noValidate>
                  {success ? (
                    <div className="mm-org-login__alert mm-org-login__alert--ok" role="status">
                      {success}
                    </div>
                  ) : null}
                  {error ? (
                    <div className="mm-org-login__alert mm-org-login__alert--err" role="alert">
                      <p>{error}</p>
                    </div>
                  ) : null}

                  <div>
                    <label className="mm-org-login__label" htmlFor="stu-login-user">
                      College ID or email
                    </label>
                    <div className="mm-org-login__field">
                      <Mail size={16} aria-hidden />
                      <input
                        id="stu-login-user"
                        type="text"
                        autoComplete="username"
                        required
                        placeholder="CSE2024A01 or you@college.edu"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mm-org-login__label" htmlFor="stu-login-password">
                      Password
                    </label>
                    <div className="mm-org-login__field">
                      <Lock size={16} aria-hidden />
                      <input
                        id="stu-login-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="mm-org-login__eye"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="mm-stu-bridge-row">
                    <Link to={studentPaths.forgotPassword} className="mm-stu-bridge-link">
                      Forgot password?
                    </Link>
                  </div>

                  <motion.button
                    type="submit"
                    className="mm-org-login__submit"
                    disabled={loading || !userId || !password || (!matchDemoStudent(userId, password) && !orgCode)}
                    whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="mm-org-login__spin" /> Signing in…
                      </>
                    ) : (
                      <>
                        Continue to prep
                        <ArrowRight size={16} aria-hidden />
                      </>
                    )}
                  </motion.button>
                </form>

                <p className="mm-org-login__activate">
                  Not enrolled yet?{' '}
                  <Link
                    to={
                      college?.code
                        ? `${studentPaths.enroll}?org=${encodeURIComponent(college.code)}`
                        : studentPaths.enroll
                    }
                    className="mm-stu-bridge-link"
                  >
                    Request enrollment
                  </Link>
                  {' · '}
                  Staff?{' '}
                  <Link to="/Organization/login" className="mm-stu-bridge-link">
                    Organization portal
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
