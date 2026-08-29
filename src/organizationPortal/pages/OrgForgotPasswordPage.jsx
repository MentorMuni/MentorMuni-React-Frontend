import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Copy, Mail } from 'lucide-react';
import {
  fetchLoginColleges,
  pickInitialCollege,
  requestPasswordReset,
  saveCollegeCode,
} from '../../orgPortal';
import { useCollegeTenantContext } from '../../tenant/CollegeTenantProvider';
import { tenantPortalPath } from '../../tenant/resolveTenant';
import { orgPaths } from '../paths';
import '../../components/organization/organization-login.css';

const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;

export default function OrgForgotPasswordPage() {
  const navigate = useNavigate();
  const {
    college: tenantCollege,
    organizationCode: tenantOrgCode,
    locked: tenantLocked,
    loading: tenantLoading,
    error: tenantError,
  } = useCollegeTenantContext();

  const [colleges, setColleges] = useState([]);
  const [college, setCollege] = useState(null);
  const [collegesLoading, setCollegesLoading] = useState(!tenantLocked);
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginPath = tenantPortalPath(orgPaths.login);

  useEffect(() => {
    if (tenantLocked) {
      setCollege(tenantCollege);
      setCollegesLoading(tenantLoading);
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
        setCollege(null);
        return;
      }
      const list = result.colleges || [];
      setColleges(list);
      setCollege(pickInitialCollege(list, new URLSearchParams()) || list[0] || null);
    })();
    return () => {
      cancelled = true;
    };
  }, [tenantLocked, tenantCollege, tenantLoading]);

  const orgCode = useMemo(() => {
    if (tenantLocked) return tenantOrgCode;
    return String(college?.code || '').trim().toUpperCase();
  }, [tenantLocked, tenantOrgCode, college]);

  const displayCollege = tenantLocked ? tenantCollege : college;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setHint('');
    setResetUrl('');
    setCopied(false);
    if (tenantError) {
      setError(tenantError);
      return;
    }
    if (!orgCode) {
      setError(tenantLocked ? 'College portal is still loading.' : 'Select your organization.');
      return;
    }
    if (!userId.trim()) {
      setError('Enter your username or email.');
      return;
    }
    setLoading(true);
    try {
      const res = await requestPasswordReset({
        identifier: userId.trim(),
        organizationCode: orgCode,
        portal: 'organization',
      });
      if (orgCode) saveCollegeCode(orgCode);
      setResetUrl(res.resetUrl || '');
      setHint(
        res.resetUrl
          ? 'Use the link below to choose a new password.'
          : res.message ||
              'If an account exists, a reset email was sent. Check your inbox.'
      );
    } catch (err) {
      setError(err?.message || 'Unable to start password reset.');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!resetUrl) return;
    try {
      await navigator.clipboard.writeText(resetUrl);
      setCopied(true);
    } catch {
      setError('Could not copy — select the link manually.');
    }
  };

  return (
    <div className="mm-org-root-login mm-org-root-login--tpo is-light">
      <div className="mm-org-login mm-org-login--solo">
        <div className="mm-org-login__form-wrap mm-org-login__form-wrap--solo">
          <div className="mm-org-login__card mm-org-login__card--solo">
            <button
              type="button"
              className="mm-org-login__back"
              onClick={() => navigate(loginPath)}
            >
              <ArrowLeft size={16} aria-hidden /> Back to login
            </button>

            <header className="mm-org-solo-head">
              <img src={LOGO} alt="MentorMuni" className="mm-org-solo-head__logo" />
              <p className="mm-org-solo-head__product">Organization portal</p>
              {displayCollege?.name || displayCollege?.code ? (
                <div className="mm-org-solo-head__campus" title={displayCollege?.name || ''}>
                  <Building2 size={15} aria-hidden />
                  <div className="mm-org-solo-head__campus-text">
                    <strong>{displayCollege?.name || 'Campus portal'}</strong>
                    {displayCollege?.code ? <span>{displayCollege.code}</span> : null}
                  </div>
                </div>
              ) : tenantLocked && tenantLoading ? (
                <p className="mm-org-solo-head__loading">Loading campus…</p>
              ) : null}
            </header>

            <h1 className="mm-org-login__card-title">Forgot password?</h1>
            <p className="mm-org-login__card-sub">
              {tenantLocked && displayCollege?.name ? (
                <>
                  Enter your username or email for <strong>{displayCollege.name}</strong>. We’ll
                  send a reset link to the registered email.
                </>
              ) : (
                'Enter your organization and username or email. We’ll send a reset link to the registered email.'
              )}
            </p>

            {error || tenantError ? (
              <div className="mm-org-login__alert mm-org-login__alert--err" role="alert">
                {error || tenantError}
              </div>
            ) : null}
            {hint && !error ? (
              <div className="mm-org-login__alert mm-org-login__alert--ok" role="status">
                {hint}
              </div>
            ) : null}

            {!resetUrl ? (
              <form className="mm-org-login__form" onSubmit={onSubmit} noValidate>
                {!tenantLocked ? (
                  <div>
                    <label className="mm-org-login__label" htmlFor="org-fp-college">
                      Organization
                    </label>
                    <select
                      id="org-fp-college"
                      className="mm-org-gate__select"
                      value={college?.code || ''}
                      disabled={collegesLoading}
                      onChange={(e) => {
                        setCollege(colleges.find((c) => c.code === e.target.value) || null);
                      }}
                      required
                    >
                      <option value="">
                        {collegesLoading ? 'Loading…' : 'Select organization'}
                      </option>
                      {colleges.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                <div>
                  <label className="mm-org-login__label" htmlFor="org-fp-user">
                    Username or email
                  </label>
                  <div className="mm-org-login__field">
                    <Mail size={16} aria-hidden />
                    <input
                      id="org-fp-user"
                      type="text"
                      autoComplete="username"
                      placeholder="tpo.admin or you@college.edu"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mm-org-login__submit"
                  disabled={loading || (tenantLocked && (tenantLoading || !orgCode))}
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            ) : (
              <div className="mm-org-login__reset-link-box">
                <label className="mm-org-login__label" htmlFor="org-fp-link">
                  Reset link
                </label>
                <textarea
                  id="org-fp-link"
                  className="mm-org-login__reset-textarea"
                  readOnly
                  value={resetUrl}
                />
                <div className="mm-org-login__reset-actions">
                  <button type="button" className="mm-org-login__submit" onClick={copyLink}>
                    <Copy size={16} aria-hidden />
                    {copied ? 'Copied' : 'Copy link'}
                  </button>
                  <a className="mm-org-login__submit mm-org-login__submit--link" href={resetUrl}>
                    Open link
                  </a>
                </div>
              </div>
            )}

            <p className="mm-org-login__activate">
              Remember it? <Link to={loginPath}>Back to sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
