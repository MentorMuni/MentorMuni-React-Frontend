import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
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
import { StudentThemeFab, useStudentTheme } from '../useStudentTheme.jsx';
import '../student-login.css';

const EASE = [0.22, 1, 0.36, 1];
const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;
const SHOW_DEMO =
  import.meta.env.DEV || String(import.meta.env.VITE_SHOW_DEMO || '') === 'true';

/** Aspirational campus recruiters — mood, not partnership claims */
const DREAM_COMPANIES = [
  'Google',
  'Amazon',
  'Microsoft',
  'Flipkart',
  'TCS',
  'Infosys',
  'Accenture',
  'Deloitte',
  'Adobe',
  'Uber',
  'Zoho',
  'Razorpay',
];

const PATH_TO_OFFER = [
  { n: '01', label: 'Measure', hint: 'Know your readiness' },
  { n: '02', label: 'Practice', hint: 'Mocks that mirror drives' },
  { n: '03', label: 'Clear', hint: 'Walk in drive-day ready' },
];

const ACHIEVE = [
  { value: '78+', label: 'Avg readiness after 2 weeks' },
  { value: '3×', label: 'More mock reps before drives' },
  { value: '1 plan', label: 'Campus-tuned daily focus' },
];

const READINESS_SCORE = 78;
const READINESS_R = 52;
const READINESS_C = 2 * Math.PI * READINESS_R;

function ReadinessOrb({ reduceMotion }) {
  const [score, setScore] = useState(reduceMotion ? READINESS_SCORE : 0);

  useEffect(() => {
    if (reduceMotion) return undefined;
    let raf = 0;
    const start = performance.now();
    const duration = 1800;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setScore(Math.round(READINESS_SCORE * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  const dashOffset = READINESS_C * (1 - score / 100);

  return (
    <div className="mm-stu-stage__orb">
      <div className="mm-stu-stage__glow" aria-hidden />
      <div className="mm-stu-stage__orbit mm-stu-stage__orbit--a" aria-hidden />
      <div className="mm-stu-stage__orbit mm-stu-stage__orbit--b" aria-hidden />
      <div className="mm-stu-stage__spark mm-stu-stage__spark--1" aria-hidden />
      <div className="mm-stu-stage__spark mm-stu-stage__spark--2" aria-hidden />
      <div className="mm-stu-stage__spark mm-stu-stage__spark--3" aria-hidden />

      <div className="mm-stu-stage__meter-wrap">
        <svg className="mm-stu-stage__meter" viewBox="0 0 120 120" aria-hidden>
          <defs>
            <linearGradient id="mm-stu-ready-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="55%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <filter id="mm-stu-ready-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle className="mm-stu-stage__meter-track" cx="60" cy="60" r={READINESS_R} />
          <circle
            className="mm-stu-stage__meter-prog"
            cx="60"
            cy="60"
            r={READINESS_R}
            strokeDasharray={READINESS_C}
            strokeDashoffset={dashOffset}
            filter="url(#mm-stu-ready-glow)"
          />
        </svg>
        <div className="mm-stu-stage__score">
          <strong>{score}</strong>
          <span>readiness</span>
        </div>
      </div>
      <p className="mm-stu-stage__orb-cap">Your placement signal</p>
      <div className="mm-stu-stage__offer" aria-hidden>
        <span className="mm-stu-stage__offer-tag">Path</span>
        <p>From gap report → offer-ready</p>
      </div>
    </div>
  );
}

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
  const [listOpen, setListOpen] = useState(false);

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
    college?.code && colleges.some((c) => c.code === college.code)
  );

  useEffect(() => {
    if (!listOpen || !collegeQueryActive || !college?.code) return;
    if (!filteredColleges.some((c) => c.code === college.code)) {
      setCollege(null);
    }
  }, [college, filteredColleges, listOpen, collegeQueryActive]);

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
        setListOpen(false);
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
      setListOpen(true);
    }
  }, [step, college, collegesLoading]);

  const confirmCollege = () => {
    if (!canContinue) {
      setError('Select a college from the list to continue.');
      setListOpen(true);
      return;
    }
    saveCollegeCode(college.code);
    setError('');
    setSuccess('');
    setListOpen(false);
    setStep('login');
  };

  const pickCollege = (c) => {
    setCollege(c);
    setError('');
    setListOpen(false);
    setCollegeQuery('');
  };

  const reopenCollegeList = () => {
    setListOpen(true);
    setCollegeQuery('');
    setError('');
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
    setListOpen(false);
    setStep('login');
  };

  return (
    <div className={`mm-stu-login-root ${theme === 'dark' ? 'is-dark' : 'is-light'}`}>
      <StudentThemeFab theme={theme} onToggle={toggle} />

      <div className="mm-stu-atm" aria-hidden>
        <div className="mm-stu-atm__mesh" />
        <div className="mm-stu-atm__blob mm-stu-atm__blob--a" />
        <div className="mm-stu-atm__blob mm-stu-atm__blob--b" />
        <div className="mm-stu-atm__blob mm-stu-atm__blob--c" />
      </div>

      <div className="mm-stu-shell">
        <section
          className={`mm-stu-showcase ${step === 'login' ? 'mm-stu-showcase--login' : ''}`}
          aria-label="MentorMuni student portal"
        >
          <div className="mm-stu-showcase__glow" aria-hidden />
          <div className="mm-stu-showcase__top">
            <div className={`mm-stu-brand ${step === 'login' && college ? 'mm-stu-brand--collab' : ''}`}>
              <img src={LOGO} alt="MentorMuni" />
              <div className="mm-stu-brand__text">
                <span className="mm-stu-brand__name">MentorMuni</span>
                <span className="mm-stu-brand__tag">Student portal</span>
              </div>
              {step === 'login' && college ? (
                <>
                  <span className="mm-stu-brand__sep" aria-hidden>
                    |
                  </span>
                  <div className="mm-stu-brand__campus">
                    <span className="mm-stu-brand__campus-name" title={college.name}>
                      {college.name}
                    </span>
                    <button
                      type="button"
                      className="mm-stu-brand__change"
                      onClick={() => {
                        setStep('college');
                        setListOpen(false);
                      }}
                    >
                      Change
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className={`mm-stu-showcase__body ${step === 'login' ? 'mm-stu-showcase__body--login' : ''}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <p className="mm-stu-eyebrow">
                  <span className="mm-stu-eyebrow__dot" />
                  {step === 'college' ? 'Campus placement season' : 'Your prep workspace'}
                </p>
                <h1 className="mm-stu-headline">
                  {step === 'college' ? (
                    <>
                      Walk into drives <em>ready</em>.
                    </>
                  ) : (
                    <>
                      Continue your <em>offer path</em>.
                    </>
                  )}
                </h1>
                <p className="mm-stu-lede">
                  {step === 'college'
                    ? 'See where you stand, close the gaps that matter, and practice like the companies on your campus calendar — TCS to product.'
                    : college?.name
                      ? `${college.name} · readiness, AI mocks, and company drills in one calm workspace.`
                      : 'Pick up your readiness, mocks, and company prep exactly where you left off.'}
                </p>

                <div className="mm-stu-dream" aria-hidden>
                  <p className="mm-stu-dream__label">
                    {step === 'college' ? 'Roles students prepare for' : 'Built around campus recruiters'}
                  </p>
                  <div className="mm-stu-marquee">
                    <div className="mm-stu-marquee__track">
                      {[...DREAM_COMPANIES, ...DREAM_COMPANIES].map((name, i) => (
                        <span key={`${name}-${i}`} className="mm-stu-marquee__chip">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {step === 'college' ? (
                  <>
                    <ol className="mm-stu-journey">
                      {PATH_TO_OFFER.map((j, i) => (
                        <motion.li
                          key={j.n}
                          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.1, duration: 0.42, ease: EASE }}
                        >
                          <span className="mm-stu-journey__n">{j.n}</span>
                          <span className="mm-stu-journey__text">
                            <strong>{j.label}</strong>
                            <em>{j.hint}</em>
                          </span>
                        </motion.li>
                      ))}
                    </ol>
                    <div className="mm-stu-achieve" aria-hidden>
                      {ACHIEVE.map((a, i) => (
                        <motion.div
                          key={a.label}
                          className="mm-stu-achieve__item"
                          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.28 + i * 0.08, duration: 0.4, ease: EASE }}
                        >
                          <strong>{a.value}</strong>
                          <span>{a.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </>
                ) : (
                  <ul className="mm-stu-daily" aria-hidden>
                    <li>
                      <strong>Score</strong>
                      <em>see the real gaps</em>
                    </li>
                    <li>
                      <strong>Mocks</strong>
                      <em>HR + technical</em>
                    </li>
                    <li>
                      <strong>Drives</strong>
                      <em>company-shaped prep</em>
                    </li>
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mm-stu-stage" aria-hidden>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.55, ease: EASE }}
              >
                <ReadinessOrb reduceMotion={reduceMotion} />
              </motion.div>

              <motion.div
                className="mm-stu-stage__session"
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.45, ease: EASE }}
              >
                <div className="mm-stu-stage__session-top">
                  <Mic2 size={15} strokeWidth={2.2} />
                  <span>AI interview</span>
                  <em>8 min</em>
                </div>
                <div className="mm-stu-stage__wave">
                  <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
                </div>
                <p className="mm-stu-stage__session-copy">
                  Speak like drive day. Get calm, specific feedback.
                </p>
              </motion.div>

              <motion.div
                className="mm-stu-stage__note"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.45, ease: EASE }}
              >
                <Sparkles size={14} strokeWidth={2.2} />
                <p>
                  Aptitude, English, DSA, and company rounds — one plan tuned to your campus season.
                </p>
              </motion.div>
            </div>
          </div>

          <div className={`mm-stu-showcase__foot ${step === 'login' ? 'mm-stu-showcase__foot--tight' : ''}`}>
            <span>
              {step === 'college' ? (
                <>
                  measure → practice → <strong>clear with confidence</strong>
                </>
              ) : (
                <>
                  {college?.code ? (
                    <>
                      <strong>{college.code}</strong> × MentorMuni · secure campus sign-in
                    </>
                  ) : (
                    <>
                      secure campus sign-in · <strong>your offer path continues</strong>
                    </>
                  )}
                </>
              )}
            </span>
          </div>
        </section>

        <div className="mm-stu-form-col">
          <motion.div
            className={`mm-stu-card mm-stu-card--genz ${step === 'login' ? 'mm-stu-card--gate2' : ''}`}
            initial={reduceMotion ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: EASE, delay: 0.06 }}
          >
            {step === 'college' ? (
              <div className="mm-stu-progress" aria-hidden>
                <span className="is-on" />
                <span />
              </div>
            ) : null}

            <AnimatePresence mode="wait">
              {step === 'college' ? (
                <motion.div
                  key="college"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <p className="mm-stu-step-label">Step 1 of 2 · Campus gate</p>
                  <h2 className="mm-stu-card-title">Where do you study?</h2>
                  <p className="mm-stu-card-sub">
                    Lock your campus so prep, drives, and HOD roster stay aligned — then start the
                    path to offer-ready.
                  </p>

                  <div className="mm-stu-vibe" aria-hidden>
                    <span>Drive season</span>
                    <span>Company mocks</span>
                    <span>Offer path</span>
                  </div>

                  {college && !listOpen ? (
                    <div className="mm-stu-selected">
                      <div className="mm-stu-selected__mark" aria-hidden>
                        <Check size={16} strokeWidth={2.6} />
                      </div>
                      <div className="mm-stu-selected__body">
                        <p className="mm-stu-selected__label">Selected campus</p>
                        <p className="mm-stu-selected__name">{college.name}</p>
                        <p className="mm-stu-selected__meta">
                          {college.city}
                          {college.state ? `, ${college.state}` : ''} · {college.code}
                        </p>
                      </div>
                      <button type="button" className="mm-stu-selected__change" onClick={reopenCollegeList}>
                        Change
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mm-stu-field mm-stu-search">
                        <label className="mm-stu-label" htmlFor="stu-college-q">
                          Search campus
                        </label>
                        <div className="mm-stu-input-wrap">
                          <Search size={17} aria-hidden />
                          <input
                            id="stu-college-q"
                            name="campus-search"
                            type="text"
                            inputMode="search"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
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
                              className="mm-stu-eye"
                              aria-label="Clear search"
                              onClick={() => {
                                setCollegeQuery('');
                                setListOpen(true);
                              }}
                            >
                              <X size={16} />
                            </button>
                          ) : null}
                        </div>
                      </div>

                      {collegesLoading ? (
                        <div className="mm-stu-empty">Loading colleges…</div>
                      ) : !collegeQueryActive ? (
                        <div className="mm-stu-college-hint">
                          <Search size={15} aria-hidden />
                          <span>Type your campus name, city, or code to find it</span>
                        </div>
                      ) : filteredColleges.length ? (
                        <ul className="mm-stu-college-list" role="listbox" aria-label="Colleges">
                          {filteredColleges.map((c) => {
                            const selected = college?.code === c.code;
                            return (
                              <li key={c.code}>
                                <button
                                  type="button"
                                  role="option"
                                  aria-selected={selected}
                                  className={`mm-stu-college-item ${selected ? 'is-selected' : ''}`}
                                  onClick={() => pickCollege(c)}
                                >
                                  <span className="mm-stu-college-item__mark">
                                    {selected ? (
                                      <Check size={14} strokeWidth={2.6} />
                                    ) : (
                                      (c.code || '?').slice(0, 3)
                                    )}
                                  </span>
                                  <span className="mm-stu-college-item__text">
                                    <p className="mm-stu-college-item__name">{c.name}</p>
                                    <p className="mm-stu-college-item__meta">
                                      {c.city}
                                      {c.state ? `, ${c.state}` : ''} · {c.code}
                                    </p>
                                  </span>
                                  {selected ? (
                                    <span className="mm-stu-college-item__badge">Selected</span>
                                  ) : null}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <div className="mm-stu-empty">
                          No campuses match. Try another name or code.
                        </div>
                      )}
                    </>
                  )}

                  {error && step === 'college' ? (
                    <div className="mm-stu-alert mm-stu-alert--error" role="alert">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="button"
                    className="mm-stu-submit"
                    disabled={!canContinue}
                    onClick={confirmCollege}
                  >
                    Continue to placement prep <ArrowRight size={17} />
                  </button>

                  <p className="mm-stu-card-foot">
                    Not enrolled yet?{' '}
                    <Link
                      to={
                        college?.code
                          ? `${studentPaths.enroll}?org=${encodeURIComponent(college.code)}`
                          : studentPaths.enroll
                      }
                      className="mm-stu-link"
                    >
                      Request enrollment
                    </Link>
                  </p>

                  {SHOW_DEMO ? (
                    <div className="mm-stu-demo">
                      <p className="mm-stu-demo__title">Temp demo (remove later)</p>
                      <p className="mm-stu-demo__line">
                        College <code>DEMO</code> · <code>{DEMO_STUDENT.email}</code> or{' '}
                        <code>{DEMO_STUDENT.collegeId}</code> / <code>{DEMO_STUDENT.password}</code>
                      </p>
                      <button type="button" className="mm-stu-demo__fill" onClick={fillDemo}>
                        Fill demo student
                      </button>
                    </div>
                  ) : null}
                </motion.div>
              ) : (
                <motion.div
                  key="login"
                  className="mm-stu-gate2"
                  initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.38, ease: EASE }}
                >
                  <div className="mm-stu-gate2__top">
                    <button
                      type="button"
                      className="mm-stu-gate2__back mm-stu-gate2__back--icon"
                      aria-label="Back to campus selection"
                      title="Change campus"
                      onClick={() => {
                        setStep('college');
                        setListOpen(false);
                      }}
                    >
                      <ArrowLeft size={18} strokeWidth={2.4} />
                    </button>
                    <span className="mm-stu-gate2__live">
                      <i /> Secure
                    </span>
                  </div>

                  <header className="mm-stu-gate2__hero">
                    <h2 className="mm-stu-gate2__title">
                      Ready for <em>drives</em>?
                    </h2>
                    <p className="mm-stu-gate2__sub">
                      Sign in to pick up your readiness, mocks, and company prep.
                    </p>
                  </header>

                  <div className="mm-stu-gate2__tiles" aria-hidden>
                    <div className="mm-stu-gate2__tile">
                      <Target size={16} strokeWidth={2.2} />
                      <strong>Score</strong>
                      <span>Know the gaps</span>
                    </div>
                    <div className="mm-stu-gate2__tile mm-stu-gate2__tile--hot">
                      <Mic2 size={16} strokeWidth={2.2} />
                      <strong>Mocks</strong>
                      <span>Drive-day voice</span>
                    </div>
                    <div className="mm-stu-gate2__tile">
                      <Sparkles size={16} strokeWidth={2.2} />
                      <strong>Offers</strong>
                      <span>Company drills</span>
                    </div>
                  </div>

                  {success ? <div className="mm-stu-alert mm-stu-alert--ok">{success}</div> : null}
                  {error ? (
                    <div className="mm-stu-alert mm-stu-alert--error" role="alert">
                      {error}
                    </div>
                  ) : null}

                  <form className="mm-stu-gate2__form" onSubmit={handleSubmit} noValidate>
                    <label className="mm-stu-gate2__field">
                      <span>College ID or email</span>
                      <div className="mm-stu-gate2__input">
                        <Mail size={18} aria-hidden />
                        <input
                          id="stu-id"
                          name="username"
                          autoComplete="username"
                          autoFocus
                          placeholder="CSE2024A01 or you@college.edu"
                          value={userId}
                          onChange={(e) => setUserId(e.target.value)}
                          required
                        />
                      </div>
                    </label>

                    <label className="mm-stu-gate2__field">
                      <span className="mm-stu-gate2__pass-row">
                        Password
                        <Link to={studentPaths.forgotPassword} className="mm-stu-link mm-stu-link--sm">
                          Forgot?
                        </Link>
                      </span>
                      <div className="mm-stu-gate2__input">
                        <Lock size={18} aria-hidden />
                        <input
                          id="stu-pass"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="mm-stu-eye"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowPassword((v) => !v)}
                        >
                          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                    </label>

                    <button
                      type="submit"
                      className="mm-stu-gate2__cta"
                      disabled={loading || !userId.trim() || !password}
                    >
                      {loading ? (
                        <>
                          <span className="mm-stu-submit__spin" aria-hidden /> Opening…
                        </>
                      ) : (
                        <>
                          Start my offer path <ArrowRight size={18} strokeWidth={2.4} />
                        </>
                      )}
                    </button>
                  </form>

                  <p className="mm-stu-gate2__hook">
                    Measure → practice → clear campus drives with confidence.
                  </p>

                  <p className="mm-stu-card-foot" style={{ marginTop: 4 }}>
                    Not on the roster?{' '}
                    <Link
                      to={
                        college?.code
                          ? `${studentPaths.enroll}?org=${encodeURIComponent(college.code)}`
                          : studentPaths.enroll
                      }
                      className="mm-stu-link"
                    >
                      Enroll
                    </Link>
                    {' · '}
                    Staff?{' '}
                    <Link to="/Organization/login" className="mm-stu-link">
                      TPO / HOD login
                    </Link>
                  </p>

                  {SHOW_DEMO ? (
                    <div className="mm-stu-demo mm-stu-demo--quiet">
                      <p className="mm-stu-demo__title">Temp demo</p>
                      <p className="mm-stu-demo__line">
                        <code>{DEMO_STUDENT.email}</code> · <code>{DEMO_STUDENT.collegeId}</code> /{' '}
                        <code>{DEMO_STUDENT.password}</code>
                      </p>
                      <button type="button" className="mm-stu-demo__fill" onClick={fillDemo}>
                        Fill demo student
                      </button>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
