import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { activateHodAccount } from '../../orgPortal';
import { peekHodInvite } from '../../organizationPortal/store';
import './activate-account.css';

const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;

function passwordStrength(value) {
  const pwd = String(value || '');
  if (!pwd) return { score: 0, label: '' };
  let score = 0;
  if (pwd.length >= 8) score += 1;
  if (pwd.length >= 12) score += 1;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
  if (/\d/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: labels[score] || '' };
}

/**
 * Standalone HOD activation — same first-impression shell as Org Admin activate.
 */
export default function ActivateHodPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = useMemo(() => String(params.get('token') || '').trim(), [params]);
  const invitePreview = useMemo(() => (token ? peekHodInvite(token) : null), [token]);
  const isCoordinator = invitePreview?.slot === 'coordinator';
  const roleNoun = isCoordinator ? 'Placement Coordinator' : 'HOD';
  const roleHeadline = isCoordinator ? 'Welcome, Placement Coordinator' : 'Welcome, Head of Department';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const strength = useMemo(() => passwordStrength(password), [password]);
  const passwordsMatch = Boolean(password && confirm && password === confirm);
  const meterTone = strength.score <= 1 ? 'is-weak' : strength.score === 2 ? 'is-fair' : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Activation token is missing. Open the secure link from your TPO invite.');
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
      const result = await activateHodAccount(token, password);
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
            result.message ||
            `Password set. Sign in as ${roleNoun} for your department.`,
          preferredRole: 'hod',
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
    <div className="mm-activate">
      <aside className="mm-activate__brand" aria-label="Welcome to MentorMuni">
        <div className="mm-activate__brand-top">
          <div className="mm-activate__logo-row">
            <img src={LOGO} alt="" className="mm-activate__logo" />
            <span className="mm-activate__logo-name">MentorMuni</span>
          </div>
        </div>

        <div className="mm-activate__brand-mid">
          <p className="mm-activate__eyebrow">Department leadership access</p>
          <h1 className="mm-activate__headline">{roleHeadline}</h1>
          <p className="mm-activate__lede">
            Set your password to activate your {roleNoun} account and track placement readiness
            for your department.
            {isCoordinator
              ? ' You have the same portal access as the HOD for your branch.'
              : ''}
          </p>
          {invitePreview ? (
            <ul className="mm-activate__roles" aria-label="Invite details">
              <li className="mm-activate__role">{roleNoun}</li>
              {invitePreview.name ? (
                <li className="mm-activate__role">{invitePreview.name}</li>
              ) : null}
              {invitePreview.departmentName ? (
                <li className="mm-activate__role">{invitePreview.departmentName}</li>
              ) : null}
            </ul>
          ) : (
            <ul className="mm-activate__roles" aria-label="Role">
              <li className="mm-activate__role">{roleNoun}</li>
            </ul>
          )}
        </div>

        <div className="mm-activate__brand-foot">
          <ul className="mm-activate__trust">
            <li>
              <Users size={16} className="mm-activate__trust-icon" aria-hidden />
              Monitor batch readiness across your department
            </li>
            <li>
              <Building2 size={16} className="mm-activate__trust-icon" aria-hidden />
              Stay aligned with your college TPO / Org Admin
            </li>
            <li>
              <CheckCircle2 size={16} className="mm-activate__trust-icon" aria-hidden />
              Invite-only access secured by MentorMuni
            </li>
          </ul>
          <p style={{ marginTop: 20 }}>MentorMuni · Placement readiness for engineering colleges</p>
        </div>
      </aside>

      <main className="mm-activate__panel">
        <div className="mm-activate__panel-inner">
          <div className="mm-activate__panel-head">
            <div className="mm-activate__badge" aria-hidden>
              <KeyRound size={22} />
            </div>
            <div>
              <p className="mm-activate__panel-kicker">Account activation</p>
              <h2 className="mm-activate__panel-title">Create your password</h2>
            </div>
          </div>

          <p className="mm-activate__panel-sub">
            {invitePreview?.email
              ? `Activating ${invitePreview.email}. After this, you’ll sign in to the Organization Portal.`
              : 'This is your first step into MentorMuni. After this, you’ll sign in to the Organization Portal.'}
          </p>

          <div className="mm-activate__steps" aria-label="Activation steps">
            <span className="mm-activate__step is-active">
              <span className="mm-activate__step-num">1</span>
              Set password
            </span>
            <span className="mm-activate__step-rule" aria-hidden />
            <span className="mm-activate__step">
              <span className="mm-activate__step-num">2</span>
              Sign in
            </span>
          </div>

          {!token ? (
            <div className="mm-activate__form">
              <div className="mm-activate__alert" role="status">
                <p>This page only works from the invite link your TPO shared.</p>
                <p>Ask your TPO to reinvite you from Departments if you need a new link.</p>
              </div>
              <p className="mm-activate__footer">
                <Link to="/Organization/login" className="mm-activate__link">
                  Go to college login
                </Link>
              </p>
            </div>
          ) : (
            <form className="mm-activate__form" onSubmit={handleSubmit} noValidate>
              {error ? (
                <div className="mm-activate__alert" role="alert">
                  <p>{error}</p>
                </div>
              ) : null}

              <div>
                <label className="mm-activate__label" htmlFor="hod-activate-password">
                  New password
                </label>
                <div className="mm-activate__field">
                  <Lock size={16} aria-hidden />
                  <input
                    id="hod-activate-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="mm-activate__eye"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {password ? (
                  <>
                    <div className="mm-activate__meter" aria-hidden>
                      {[1, 2, 3, 4].map((n) => (
                        <span
                          key={n}
                          className={`mm-activate__meter-seg${strength.score >= n ? ` is-on ${meterTone}` : ''}`}
                        />
                      ))}
                    </div>
                    <p className="mm-activate__meter-label">{strength.label}</p>
                  </>
                ) : (
                  <p className="mm-activate__hint">Use a strong password you don&apos;t reuse elsewhere.</p>
                )}
              </div>

              <div>
                <label className="mm-activate__label" htmlFor="hod-activate-confirm">
                  Confirm password
                </label>
                <div className="mm-activate__field">
                  <Lock size={16} aria-hidden />
                  <input
                    id="hod-activate-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    placeholder="Re-enter password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                  <button
                    type="button"
                    className="mm-activate__eye"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="mm-activate__match" hidden={!passwordsMatch}>
                  <CheckCircle2 size={14} aria-hidden />
                  Passwords match
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !password || !confirm}
                className="mm-activate__submit"
              >
                {loading ? (
                  <>
                    <Loader2 className="mm-activate__spin" size={18} aria-hidden />
                    Activating account…
                  </>
                ) : (
                  <>
                    Activate &amp; continue to login
                    <ArrowRight size={18} aria-hidden />
                  </>
                )}
              </button>

              <p className="mm-activate__footer">
                Already activated?{' '}
                <Link to="/Organization/login" className="mm-activate__link">
                  Sign in to your college portal
                </Link>
              </p>

              <p className="mm-activate__secure">
                <ShieldCheck size={14} aria-hidden />
                Encrypted invite · Password stored securely
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
