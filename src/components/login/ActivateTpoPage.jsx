import { useEffect, useMemo, useState } from 'react';
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
} from 'lucide-react';
import { activateTpoAccount, previewTpoActivation } from '../../orgPortal';
import { resolveTenantFromHostname } from '../../tenant/resolveTenant';
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

function titleLabel(title) {
  const code = String(title || 'TPO').toUpperCase();
  if (code === 'DEAN') return 'Dean';
  if (code === 'DIRECTOR') return 'Director';
  return 'TPO';
}

/**
 * First-impression activation for college leadership (TPO / Dean / Director).
 * Standalone page — no marketing site navbar/footer (see App.jsx isAuthStandalonePath).
 */
export default function ActivateTpoPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = useMemo(() => String(params.get('token') || '').trim(), [params]);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [collegeCode, setCollegeCode] = useState('');
  const [inviteTitle, setInviteTitle] = useState('TPO');
  const [previewLoading, setPreviewLoading] = useState(Boolean(token));

  const strength = useMemo(() => passwordStrength(password), [password]);
  const passwordsMatch = Boolean(password && confirm && password === confirm);
  const meterTone = strength.score <= 1 ? 'is-weak' : strength.score === 2 ? 'is-fair' : '';
  const roleName = titleLabel(inviteTitle);

  useEffect(() => {
    let cancelled = false;

    async function loadCollege() {
      if (!token) {
        setPreviewLoading(false);
        return;
      }
      setPreviewLoading(true);

      // Prefer invite preview (works on apex + college hosts).
      const preview = await previewTpoActivation(token);
      if (cancelled) return;

      if (preview.ok) {
        setCollegeName(preview.organizationName || '');
        setCollegeCode(preview.organizationCode || '');
        setInviteTitle(preview.title || 'TPO');
        setPreviewLoading(false);
        return;
      }

      // Fallback: college subdomain host (e.g. lnct.mentormuni.com).
      try {
        const tenant = await resolveTenantFromHostname();
        if (cancelled) return;
        if (tenant?.name) {
          setCollegeName(tenant.name);
          setCollegeCode(tenant.code || '');
        }
      } catch {
        /* ignore — page still works without college name */
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    }

    loadCollege();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Activation token is missing. Open the secure link from your MentorMuni invite email.');
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
      const orgCode = String(result.organizationCode || collegeCode || '')
        .trim()
        .toUpperCase();
      const loginPath = orgCode
        ? `/Organization/login?org=${encodeURIComponent(orgCode)}`
        : '/Organization/login';
      navigate(loginPath, {
        replace: true,
        state: {
          activateSuccess:
            result.message || 'Password set. You can sign in to your college portal.',
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
    <div className="mm-activate">
      <aside className="mm-activate__brand" aria-label="Welcome to MentorMuni">
        <div className="mm-activate__brand-top">
          <div className="mm-activate__logo-row">
            <img src={LOGO} alt="" className="mm-activate__logo" />
            <span className="mm-activate__logo-name">MentorMuni</span>
          </div>
        </div>

        <div className="mm-activate__brand-mid">
          <p className="mm-activate__eyebrow">College leadership access</p>
          {collegeName ? (
            <p className="mm-activate__college">{collegeName}</p>
          ) : null}
          <h1 className="mm-activate__headline">Welcome to your campus portal</h1>
          <p className="mm-activate__lede">
            {collegeName
              ? `Set a secure password to activate your ${roleName} account for ${collegeName}.`
              : `Set a secure password to activate your ${roleName} account. You'll use this to lead placement readiness for your institution.`}
          </p>
          <ul className="mm-activate__roles" aria-label="Roles this access covers">
            <li className={`mm-activate__role${inviteTitle === 'TPO' ? ' is-on' : ''}`}>TPO</li>
            <li className={`mm-activate__role${inviteTitle === 'DEAN' ? ' is-on' : ''}`}>Dean</li>
            <li className={`mm-activate__role${inviteTitle === 'DIRECTOR' ? ' is-on' : ''}`}>
              Director
            </li>
          </ul>
        </div>

        <div className="mm-activate__brand-foot">
          <ul className="mm-activate__trust">
            <li>
              <ShieldCheck size={16} className="mm-activate__trust-icon" aria-hidden />
              Secure, invite-only activation for your college
            </li>
            <li>
              <Building2 size={16} className="mm-activate__trust-icon" aria-hidden />
              One portal for students, departments, and placement ops
            </li>
            <li>
              <CheckCircle2 size={16} className="mm-activate__trust-icon" aria-hidden />
              Built for Training &amp; Placement leadership
            </li>
          </ul>
          <p style={{ marginTop: 12 }}>MentorMuni · Placement readiness for engineering colleges</p>
        </div>
      </aside>

      <main className="mm-activate__panel">
        <div className="mm-activate__panel-inner">
          <div className="mm-activate__panel-head">
            <div className="mm-activate__badge" aria-hidden>
              <KeyRound size={22} />
            </div>
            <div>
              <p className="mm-activate__panel-kicker">Account activation · {roleName}</p>
              <h2 className="mm-activate__panel-title">Create your password</h2>
            </div>
          </div>

          {collegeName ? (
            <div className="mm-activate__college-chip">
              <Building2 size={15} aria-hidden />
              <div>
                <span>College</span>
                <strong>
                  {collegeName}
                  {collegeCode ? ` (${collegeCode})` : ''}
                </strong>
              </div>
            </div>
          ) : previewLoading ? (
            <p className="mm-activate__panel-sub">Loading college details…</p>
          ) : (
            <p className="mm-activate__panel-sub">
              This is your first step into MentorMuni. After this, you&apos;ll sign in to the
              Organization Portal.
            </p>
          )}

          {collegeName ? (
            <p className="mm-activate__panel-sub">
              After activation you&apos;ll sign in to the Organization Portal for this campus.
            </p>
          ) : null}

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
                <p>This page only works from the secure link in your invite email.</p>
                <p>
                  If you don&apos;t have the email, ask your MentorMuni Platform Admin to
                  reinvite you.
                </p>
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
                <label className="mm-activate__label" htmlFor="activate-password">
                  New password
                </label>
                <div className="mm-activate__field">
                  <Lock size={16} aria-hidden />
                  <input
                    id="activate-password"
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
                <label className="mm-activate__label" htmlFor="activate-confirm">
                  Confirm password
                </label>
                <div className="mm-activate__field">
                  <Lock size={16} aria-hidden />
                  <input
                    id="activate-confirm"
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
                <Link
                  to={
                    collegeCode
                      ? `/Organization/login?org=${encodeURIComponent(collegeCode)}`
                      : '/Organization/login'
                  }
                  className="mm-activate__link"
                >
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
