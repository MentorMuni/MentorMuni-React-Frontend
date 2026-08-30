import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  Check,
  ClipboardCheck,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Search,
  ShieldCheck,
  Users,
  X,
  Zap,
} from 'lucide-react';
import {
  clearOrgSession,
  consumeOrgAuthFlash,
  fetchLoginColleges,
  loginOrgUser,
  pickInitialCollege,
  saveCollegeCode,
} from '../../orgPortal';
import {
  collegePortalOrigin,
  redirectToCollegePortal,
  tenantPortalPath,
} from '../../tenant/resolveTenant';
import { useCollegeTenantContext } from '../../tenant/CollegeTenantProvider';
import { organizationLogoUrl } from '../../tenant/orgLogo';
import { getOrgHomePath } from '../../organizationPortal/roles';
import { DEMO_ORG, DEMO_USERS, matchDemoUser } from '../../organizationPortal/demoAuth';
import { useOrgTheme } from '../../organizationPortal/useOrgTheme';
import OrgThemeToggle from '../../organizationPortal/OrgThemeToggle';
import './organization-login.css';

const EASE = [0.22, 1, 0.36, 1];
const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;

const ROLES = [
  {
    id: 'tpo',
    label: 'TPO',
    icon: ShieldCheck,
    eyebrow: 'Training & Placement Officer',
    headline: 'Manage your college placement portal',
    accent: 'Students, departments, and season ops — together.',
    body: (college) =>
      college
        ? `Sign in as TPO for ${college.name} to run placement operations securely.`
        : 'Sign in as TPO to run your college placement operations securely.',
    highlights: [
      { icon: ShieldCheck, title: 'College admin access', text: 'ORG_ADMIN controls for your campus' },
      { icon: Zap, title: 'Season coordination', text: 'Keep HODs and students on one system' },
      { icon: Building2, title: 'Safe handovers', text: 'Transfer access without data mix-ups' },
    ],
    fieldUser: 'TPO email or username',
    fieldUserHint: 'From your MentorMuni activation invite',
    fieldPass: 'Password',
    cta: 'Continue as TPO',
    placeholder: 'tpo@college.edu',
  },
  {
    id: 'hod',
    label: 'HOD',
    icon: Users,
    eyebrow: 'Head of Department',
    headline: 'Track your department’s placement readiness',
    accent: 'See who needs support — before drive week.',
    body: (college) =>
      college
        ? `Sign in as HOD or Placement Coordinator for ${college.name} to monitor batch readiness.`
        : 'Sign in as HOD or Placement Coordinator to monitor batch readiness.',
    highlights: [
      { icon: Users, title: 'Batch overview', text: 'See readiness across your department' },
      { icon: ClipboardCheck, title: 'Early alerts', text: 'Spot students who need help sooner' },
      { icon: Building2, title: 'Aligned with TPO', text: 'Same data your placement office uses' },
    ],
    fieldUser: 'HOD / Coordinator email or username',
    fieldUserHint: 'Use your department account',
    fieldPass: 'Password',
    cta: 'Continue as HOD / Coordinator',
    placeholder: 'hod@college.edu',
  },
];

function postLoginPath(user) {
  if (user?.mustChangePassword || user?.must_change_password) {
    return '/Organization/change-password';
  }
  return getOrgHomePath();
}

/** Never surface API-key / infra errors on the login UI. */
function safeLoginError(message, fallback = 'Unable to sign in. Please try again.') {
  const text = String(message || '').trim();
  if (!text) return fallback;
  if (/api key|x-api-key|missing api|invalid or missing/i.test(text)) return fallback;
  return text;
}

export default function OrganizationLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const reduceMotion = useReducedMotion();
  const { theme, toggleTheme } = useOrgTheme();
  const {
    college: tenantCollege,
    organizationCode: tenantOrgCode,
    locked: tenantLockedFromHost,
    loading: tenantLoading,
    error: tenantError,
    isTenantHost: collegeHost,
  } = useCollegeTenantContext();

  const [step, setStep] = useState(() => (collegeHost ? 'login' : 'college')); // college | login
  const [roleId, setRoleId] = useState('tpo');
  const [colleges, setColleges] = useState([]);
  const [college, setCollege] = useState(null);
  const [collegesLoading, setCollegesLoading] = useState(true);
  const [collegesWarning, setCollegesWarning] = useState('');
  const [collegesSource, setCollegesSource] = useState('');
  const [collegeQuery, setCollegeQuery] = useState('');
  /** When false and a college is chosen, show selected card + Change. */
  const [pickingCollege, setPickingCollege] = useState(() => !collegeHost);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorKind, setErrorKind] = useState('');
  const [cta, setCta] = useState('');
  const [success, setSuccess] = useState('');
  const [portalLink, setPortalLink] = useState('');

  const tenantLocked = tenantLockedFromHost || collegeHost;
  const displayCollege = tenantLocked ? tenantCollege || college : college;
  const displayCollegeLogo =
    displayCollege?.has_logo && displayCollege?.id
      ? organizationLogoUrl(displayCollege.id, {
          updatedAt: displayCollege.logo_updated_at,
        })
      : null;
  const activeRole = ROLES.find((r) => r.id === roleId) || ROLES[0];
  const RoleIcon = activeRole.icon;
  const orgCode = String(
    displayCollege?.code || (tenantLocked ? tenantOrgCode : '') || ''
  )
    .trim()
    .toUpperCase();
  const hideCollegePicker = tenantLocked;
  const showCampusGate = step === 'college' && !hideCollegePicker;

  const filteredColleges = useMemo(() => {
    const q = collegeQuery.trim().toLowerCase();
    if (!q) return colleges;
    return colleges.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        `${c.city} ${c.state}`.toLowerCase().includes(q)
    );
  }, [colleges, collegeQuery]);

  const collegeQueryActive = collegeQuery.trim().length > 0;
  const canContinue = Boolean(
    college?.code && colleges.some((c) => c.code === college.code) && !pickingCollege
  );

  const pickCollege = (c) => {
    setCollege(c);
    setPickingCollege(false);
    setCollegeQuery('');
    setError('');
    setErrorKind('');
  };

  // Landing on login clears any prior session. Do not listen to popstate —
  // React Router / history changes were wiping sessions right after demo login.
  useEffect(() => {
    clearOrgSession();
  }, []);

  useEffect(() => {
    if (!tenantLocked || !tenantCollege?.code) return;
    setCollege(tenantCollege);
    setColleges([tenantCollege]);
    saveCollegeCode(tenantCollege.code);
    setPickingCollege(false);
    setStep('login');
    setCollegesLoading(tenantLoading);
    setCollegesSource('tenant');
    if (tenantError) setCollegesWarning(tenantError);
  }, [tenantLocked, tenantCollege, tenantLoading, tenantError]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (tenantLocked) {
        setCollegesLoading(tenantLoading);
        if (tenantError) setCollegesWarning(tenantError);
        return;
      }

      setCollegesLoading(true);
      setPortalLink('');

      const result = await fetchLoginColleges();
      if (cancelled) return;
      setCollegesLoading(false);
      if (!result.ok) {
        setColleges([]);
        setCollegesWarning(result.warning || 'Unable to load colleges.');
        setCollegesSource('');
        return;
      }
      setColleges(result.colleges);
      setCollegesWarning(result.warning || '');
      setCollegesSource(result.source || '');
      const preferredOrg = String(searchParams.get('org') || '').trim().toUpperCase();
      const initial = pickInitialCollege(result.colleges, searchParams, {
        allowSaved: Boolean(preferredOrg),
      });
      if (initial) {
        if (
          typeof window !== 'undefined' &&
          (initial.portal_url || initial.portal_slug)
        ) {
          const host = window.location.hostname.toLowerCase();
          if (
            host.endsWith('mentormuni.com') ||
            host === 'localhost' ||
            host.endsWith('.localhost')
          ) {
            window.location.assign(
              `${initial.portal_url || collegePortalOrigin(initial.portal_slug)}/Organization/login`
            );
            return;
          }
        }
        setCollege(initial);
        setPickingCollege(false);
        setStep('login');
      } else if (preferredOrg) {
        setError(
          `College code “${preferredOrg}” was not found in the active list. Confirm the organization is ACTIVE, then refresh.`
        );
        setErrorKind('credentials');
        setStep('college');
        setPickingCollege(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchParams, tenantLocked, tenantLoading, tenantError]);

  useEffect(() => {
    const flash = consumeOrgAuthFlash();
    if (flash?.message) {
      const isSuccess = flash.kind === 'success';
      if (isSuccess) {
        setSuccess(flash.message);
        setError('');
        setErrorKind('');
        setCta('');
      } else {
        setError(flash.message);
        setErrorKind(flash.kind === 'suspended' ? 'suspended' : 'credentials');
        setCta(flash.cta || '');
        setSuccess('');
      }
      setStep('login');
    }

    const activateSuccess = location.state?.activateSuccess;
    if (activateSuccess) {
      setSuccess(activateSuccess);
      setError('');
      setErrorKind('');
      const preferred = String(location.state?.preferredRole || 'tpo').toLowerCase();
      setRoleId(preferred === 'hod' ? 'hod' : 'tpo');
      const preferredOrg = String(
        location.state?.preferredOrgCode || searchParams.get('org') || ''
      )
        .trim()
        .toUpperCase();
      if (preferredOrg) {
        saveCollegeCode(preferredOrg);
      }
      setStep('login');
      navigate(location.pathname + location.search, { replace: true, state: {} });
    }
  }, [location.pathname, location.search, location.state, navigate, searchParams]);

  // Login step requires a locked college — send users back to the gate if missing.
  useEffect(() => {
    if (hideCollegePicker) return;
    if (step !== 'login' || collegesLoading) return;
    if (college?.code && !pickingCollege) return;
    const initial = pickInitialCollege(colleges, searchParams, { allowSaved: true });
    if (initial) {
      setCollege(initial);
      setPickingCollege(false);
      return;
    }
    setStep('college');
    setPickingCollege(true);
  }, [step, college, colleges, collegesLoading, searchParams, pickingCollege, hideCollegePicker]);

  const confirmCollege = () => {
    if (!canContinue) return;
    if (
      typeof window !== 'undefined' &&
      (college.portal_url || college.portal_slug) &&
      !tenantLocked
    ) {
      const host = window.location.hostname.toLowerCase();
      if (host.endsWith('mentormuni.com') || host === 'localhost' || host.endsWith('.localhost')) {
        redirectToCollegePortal(
          college.portal_slug,
          '/Organization/login'
        );
        return;
      }
    }
    saveCollegeCode(college.code);
    setError('');
    setErrorKind('');
    setStep('login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim() || !password) return;
    const demoMatch = matchDemoUser(userId, password);
    if (demoMatch && tenantLocked && orgCode && orgCode !== DEMO_ORG.code) {
      setError('Sample credentials are only for the DEMO campus. Use your college account here.');
      setErrorKind('credentials');
      return;
    }
    if (!demoMatch && !orgCode) return;
    setError('');
    setErrorKind('');
    setCta('');
    setSuccess('');
    setPortalLink('');
    setLoading(true);
    try {
      const code = demoMatch ? DEMO_ORG.code : orgCode;
      const result = await loginOrgUser(userId, password, code);
      if (!result.ok) {
        if (result.code === 'WRONG_TENANT' || result.code === 'PUBLIC_ON_COLLEGE') {
          setError(result.error);
          setErrorKind('credentials');
          if (result.portal_url) setPortalLink(result.portal_url);
        } else if (result.code === 'ORG_SUSPENDED' || result.status === 403) {
          setError(result.error);
          setErrorKind('suspended');
          setCta(result.ux?.cta || 'Please contact MentorMuni support.');
        } else if (result.code === 'INVALID_CREDENTIALS' || result.status === 401) {
          setError(safeLoginError(result.error, 'Incorrect email/username or password.'));
          setErrorKind('credentials');
        } else {
          setError(safeLoginError(result.error, 'Unable to sign in. Please try again.'));
          setErrorKind('credentials');
        }
        return;
      }
      saveCollegeCode(code);
      navigate(postLoginPath(result.user), { replace: true });
    } catch (err) {
      setError(safeLoginError(err?.message, 'Unable to sign in. Please try again.'));
      setErrorKind('credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`mm-org-root-login mm-org-root-login--${roleId} ${theme === 'light' ? 'is-light' : 'is-dark'}`}>
      <div className={`mm-org-atm ${theme === 'light' ? 'mm-org-atm--light' : ''}`} aria-hidden>
        <div className="mm-org-atm__grid" />
        <div className="mm-org-atm__orb mm-org-atm__orb--1" />
        <div className="mm-org-atm__orb mm-org-atm__orb--2" />
        <div className="mm-org-atm__orb mm-org-atm__orb--3" />
      </div>

      <OrgThemeToggle
        theme={theme}
        onToggle={toggleTheme}
        className="mm-org-theme-toggle--floating"
      />

      <AnimatePresence mode="wait">
        {showCampusGate ? (
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

                <p className="mm-org-gate__kicker">For colleges</p>
                <h1 className="mm-org-gate__headline">
                  Campus placement,
                  <br />
                  run with clarity
                </h1>
                <p className="mm-org-gate__lede">
                  One system for placement officers and department heads — shared readiness data, cleaner handoffs, and seasons that stay on track.
                </p>

                <ul className="mm-org-gate__value" aria-label="Why colleges use MentorMuni">
                  <li>
                    <ShieldCheck size={18} aria-hidden />
                    <div>
                      <strong>Placement office control</strong>
                      <em>Season ops, access, and campus-wide follow-through in one workspace.</em>
                    </div>
                  </li>
                  <li>
                    <Users size={18} aria-hidden />
                    <div>
                      <strong>Department visibility</strong>
                      <em>HODs see who needs support early — before drive week pressure hits.</em>
                    </div>
                  </li>
                  <li>
                    <ClipboardCheck size={18} aria-hidden />
                    <div>
                      <strong>Readiness that compounds</strong>
                      <em>Skill gaps, practice, and feedback that raise offer outcomes over time.</em>
                    </div>
                  </li>
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
                <div className="mm-org-gate-brand">
                  <div className="mm-org-gate-brand__link">
                    <img src={LOGO} alt="" className="mm-org-gate-brand__logo" />
                    <span>MentorMuni</span>
                  </div>
                  <span className="mm-org-gate-brand__badge">
                    <Building2 size={13} aria-hidden />
                    Organization
                  </span>
                </div>

                <div className="mm-org-gate__progress" aria-hidden>
                  <span className="is-active" />
                  <span />
                </div>
                <p className="mm-org-gate__eyebrow">Step 1 of 2</p>
                <h2 className="mm-org-gate__title">Select your college</h2>
                <p className="mm-org-gate__sub">
                  Confirm your institution to continue to secure sign-in.
                </p>

                {collegesWarning ? (
                  <div className="mm-login-vibe-form__error" role="status" style={{ marginBottom: 12 }}>
                    <p className="mm-login-vibe-form__error-text">{collegesWarning}</p>
                    {collegesSource === 'offline' ? (
                      <p className="mm-login-vibe-form__error-cta" style={{ marginTop: 6 }}>
                        Demo still works — college <strong>DEMO</strong> ·{' '}
                        <code>tpo@demo.edu</code> / <code>Demo@123</code> (HOD:{' '}
                        <code>hod@demo.edu</code>)
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <div className="mm-org-gate__form-block">
                  <label className="mm-org-gate__label" htmlFor="org-college-q">
                    Institution
                  </label>

                  {collegesLoading ? (
                    <div className="mm-org-gate__select-shell is-loading">
                      <Loader2 className="mm-org-login__spin" size={18} />
                      Loading institutions…
                    </div>
                  ) : colleges.length ? (
                    college?.code && !pickingCollege ? (
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
                        {!hideCollegePicker ? (
                          <button
                            type="button"
                            className="mm-org-gate__change"
                            onClick={() => {
                              setPickingCollege(true);
                              setCollegeQuery('');
                              setError('');
                              setErrorKind('');
                            }}
                          >
                            Change
                          </button>
                        ) : null}
                      </div>
                    ) : (
                      <div className="mm-org-college-picker">
                        <div className="mm-org-gate__field mm-org-college-search">
                          <Search size={16} aria-hidden />
                          <input
                            id="org-college-q"
                            type="search"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                            placeholder="Search college name, city, or code…"
                            value={collegeQuery}
                            onChange={(e) => {
                              setCollegeQuery(e.target.value);
                              setError('');
                              setErrorKind('');
                            }}
                            aria-label="Search colleges"
                          />
                          {collegeQuery ? (
                            <button
                              type="button"
                              className="mm-org-college-clear"
                              aria-label="Clear search"
                              onClick={() => setCollegeQuery('')}
                            >
                              <X size={15} />
                            </button>
                          ) : null}
                        </div>

                        {!collegeQueryActive ? (
                          <div className="mm-org-college-hint">
                            <Search size={15} aria-hidden />
                            <span>Type to find your college — results open below</span>
                          </div>
                        ) : filteredColleges.length ? (
                          <ul className="mm-org-college-list" role="listbox" aria-label="Colleges">
                            {filteredColleges.map((c) => {
                              const selected = college?.code === c.code;
                              return (
                                <li key={c.code}>
                                  <button
                                    type="button"
                                    role="option"
                                    aria-selected={selected}
                                    className={`mm-org-college-item ${selected ? 'is-selected' : ''}`}
                                    onClick={() => pickCollege(c)}
                                  >
                                    <span className="mm-org-college-item__mark">
                                      {selected ? (
                                        <Check size={14} strokeWidth={2.6} />
                                      ) : (
                                        (c.code || '?').slice(0, 3)
                                      )}
                                    </span>
                                    <span className="mm-org-college-item__text">
                                      <span className="mm-org-college-item__name">{c.name}</span>
                                      <span className="mm-org-college-item__meta">
                                        {[c.city, c.state].filter(Boolean).join(', ')}
                                        {c.code ? ` · ${c.code}` : ''}
                                      </span>
                                    </span>
                                    {selected ? (
                                      <span className="mm-org-college-item__badge">Selected</span>
                                    ) : null}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="mm-org-gate__hint">No institutions match. Try another name or code.</p>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="mm-org-gate__empty-card">
                      <p>Institution list is temporarily unavailable.</p>
                      <button
                        type="button"
                        className="mm-org-gate__retry"
                        onClick={() => {
                          setCollegesLoading(true);
                          setCollegesWarning('');
                          fetchLoginColleges().then((result) => {
                            setCollegesLoading(false);
                            setColleges(result.ok ? result.colleges : []);
                            setCollegesWarning(result.warning || '');
                            setCollegesSource(result.source || '');
                            if (result.ok) {
                              const initial = pickInitialCollege(result.colleges, searchParams, {
                                allowSaved: true,
                              });
                              if (initial) {
                                setCollege(initial);
                                setPickingCollege(false);
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

                <button
                  type="button"
                  className="mm-org-gate__cta"
                  disabled={!canContinue}
                  onClick={confirmCollege}
                >
                  Continue to sign-in
                  <ArrowRight size={16} aria-hidden />
                </button>

                <p className="mm-org-gate__footnote">
                  TPO and HOD access only. Secure campus credentials required.
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
                  <img src={LOGO} alt="MentorMuni" className="mm-org-login__logo mm-org-login__logo--lg" />
                  <span className="mm-org-login__brand-name">MentorMuni</span>
                </Link>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${roleId}-${displayCollege?.code}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <button
                      type="button"
                      className="mm-org-login__campus-chip is-button"
                      disabled={hideCollegePicker}
                      onClick={() => {
                        if (hideCollegePicker) return;
                        setStep('college');
                        setPickingCollege(true);
                        setCollegeQuery('');
                      }}
                    >
                      {displayCollegeLogo ? (
                        <img
                          className="mm-org-login__campus-logo"
                          src={displayCollegeLogo}
                          alt=""
                          width={28}
                          height={28}
                        />
                      ) : (
                        <MapPin size={13} aria-hidden />
                      )}
                      <span className="mm-org-login__campus-copy">
                        <strong>{displayCollege?.name || (tenantLoading ? 'Loading campus…' : 'College')}</strong>
                        {displayCollege?.code ? <em>{displayCollege.code}</em> : null}
                      </span>
                      {!hideCollegePicker ? (
                        <span className="mm-org-login__change">Change</span>
                      ) : null}
                    </button>

                    <p className="mm-org-login__pill">
                      <RoleIcon size={13} aria-hidden />
                      <span>{activeRole.eyebrow}</span>
                    </p>
                    <h1 className="mm-org-login__headline">{activeRole.headline}</h1>
                    <p className="mm-org-login__accent">{activeRole.accent}</p>
                    <p className="mm-org-login__lede">{activeRole.body(displayCollege)}</p>

                    <ul className="mm-org-login__value" aria-label="Role benefits">
                      {activeRole.highlights.map((item) => {
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
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>

            <div className="mm-org-login__form-wrap">
              <motion.div
                className="mm-org-login__card"
                initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}
              >
                <div className="mm-org-login__card-top">
                  <div className="mm-org-login__card-brand">
                    <img src={LOGO} alt="MentorMuni" className="mm-org-login__logo" />
                    <span>MentorMuni</span>
                    {displayCollege?.name ? (
                      <>
                        <span aria-hidden> · </span>
                        {displayCollegeLogo ? (
                          <img
                            className="mm-org-login__college-logo"
                            src={displayCollegeLogo}
                            alt=""
                            width={22}
                            height={22}
                          />
                        ) : null}
                        <span title={displayCollege.name}>{displayCollege.name}</span>
                      </>
                    ) : null}
                  </div>
                  <span className="mm-org-login__badge">
                    <span className="mm-org-login__live" />{' '}
                    {displayCollege?.code || (tenantLoading ? '…' : 'College')}
                  </span>
                </div>

                <h2 className="mm-org-login__card-title">Login</h2>
                <p className="mm-org-login__card-sub">
                  Continue as TPO or HOD for {displayCollege?.name || 'your college'}.
                </p>

                <div className="mm-org-login__tabs" role="tablist" aria-label="Sign-in role">
                  {ROLES.map((role) => {
                    const Icon = role.icon;
                    const selected = role.id === roleId;
                    return (
                      <motion.button
                        key={role.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        className={`mm-org-login__tab ${selected ? 'is-active' : ''}`}
                        onClick={() => setRoleId(role.id)}
                        whileHover={reduceMotion ? undefined : { y: selected ? 0 : -1 }}
                        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                      >
                        <Icon size={14} aria-hidden />
                        {role.label}
                      </motion.button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={`hint-${roleId}`}
                    className="mm-org-login__hint"
                    initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                  >
                    {activeRole.fieldUserHint}
                  </motion.p>
                </AnimatePresence>

                {(tenantError || collegesWarning) && tenantLocked ? (
                  <div className="mm-org-login__alert mm-org-login__alert--err" role="alert">
                    <p>{tenantError || collegesWarning}</p>
                  </div>
                ) : null}

                {!tenantLocked ? (
                <div className="mm-org-login__demo" role="note">
                  <p className="mm-org-login__demo-title">Temp demo credentials (remove later)</p>
                  <p className="mm-org-login__demo-line">
                    College: <strong>DEMO</strong> · MentorMuni Demo College
                  </p>
                  <p className="mm-org-login__demo-line">
                    TPO: <code>tpo@demo.edu</code> / <code>Demo@123</code>
                  </p>
                  <p className="mm-org-login__demo-line">
                    HOD: <code>hod@demo.edu</code> / <code>Demo@123</code>
                  </p>
                  <button
                    type="button"
                    className="mm-org-login__demo-fill"
                    onClick={() => {
                      const demoCollege =
                        colleges.find((c) => c.code === DEMO_ORG.code) || {
                          id: DEMO_ORG.id,
                          name: DEMO_ORG.name,
                          code: DEMO_ORG.code,
                          city: DEMO_ORG.city,
                          state: DEMO_ORG.state,
                        };
                      setCollege(demoCollege);
                      setPickingCollege(false);
                      saveCollegeCode(DEMO_ORG.code);
                      const u =
                        roleId === 'hod'
                          ? DEMO_USERS.find((x) => x.email.startsWith('hod'))
                          : DEMO_USERS.find((x) => x.email.startsWith('tpo'));
                      setUserId(u?.email || '');
                      setPassword(u?.password || '');
                      setError('');
                    }}
                  >
                    Fill {roleId === 'hod' ? 'HOD' : 'TPO'} demo
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
                    <div
                      className={`mm-org-login__alert ${
                        errorKind === 'suspended' ? 'mm-org-login__alert--warn' : 'mm-org-login__alert--err'
                      }`}
                      role="alert"
                    >
                      <p>{error}</p>
                      {errorKind === 'suspended' && cta ? <span>{cta}</span> : null}
                      {portalLink ? (
                        <p style={{ marginTop: 8 }}>
                          <a href={portalLink}>Go to your college portal</a>
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  <div>
                    <label className="mm-org-login__label" htmlFor="org-login-user">
                      {activeRole.fieldUser}
                    </label>
                    <div className="mm-org-login__field">
                      <Mail size={16} aria-hidden />
                      <input
                        id="org-login-user"
                        type="text"
                        autoComplete="username"
                        required
                        placeholder={activeRole.placeholder}
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mm-org-login__label" htmlFor="org-login-password">
                      {activeRole.fieldPass}
                    </label>
                    <div className="mm-org-login__field">
                      <Lock size={16} aria-hidden />
                      <input
                        id="org-login-password"
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

                  <motion.button
                    type="submit"
                    className="mm-org-login__submit"
                    disabled={loading || !userId || !password || !orgCode}
                    whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="mm-org-login__spin" /> Signing in…
                      </>
                    ) : (
                      <>
                        {activeRole.cta}
                        <ArrowRight size={16} aria-hidden />
                      </>
                    )}
                  </motion.button>
                </form>

                <p className="mm-org-login__activate" style={{ marginTop: 12 }}>
                  <Link to={tenantPortalPath('/Organization/forgot-password')}>Forgot password?</Link>
                </p>

                <p className="mm-org-login__activate">
                  For new users, activate your account and set your password from the email sent by your admin.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
