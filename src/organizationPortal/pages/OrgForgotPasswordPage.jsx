import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Mail } from 'lucide-react';
import {
  fetchLoginColleges,
  pickInitialCollege,
  requestPasswordReset,
  saveCollegeCode,
} from '../../orgPortal';
import { orgPaths } from '../paths';
import '../../components/organization/organization-login.css';

const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;

export default function OrgForgotPasswordPage() {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [college, setCollege] = useState(null);
  const [collegesLoading, setCollegesLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
  }, []);

  const orgCode = useMemo(
    () => String(college?.code || '').trim().toUpperCase(),
    [college]
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setHint('');
    setResetUrl('');
    setCopied(false);
    if (!orgCode) {
      setError('Select your organization.');
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
    <div className="mm-org-login">
      <div className="mm-org-login__panel" style={{ maxWidth: 440, margin: '48px auto' }}>
        <button
          type="button"
          className="mm-org-login__ghost-link"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 16,
            border: 0,
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: 'inherit',
            color: 'inherit',
          }}
          onClick={() => navigate(orgPaths.login)}
        >
          <ArrowLeft size={16} /> Back to login
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <img src={LOGO} alt="MentorMuni" style={{ height: 36 }} />
          <div>
            <div style={{ fontWeight: 700 }}>MentorMuni</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>Organization portal</div>
          </div>
        </div>

        <h1 style={{ margin: '0 0 8px', fontSize: 24 }}>Forgot password?</h1>
        <p style={{ margin: '0 0 18px', opacity: 0.75, fontSize: 14, lineHeight: 1.5 }}>
          Enter your organization and username or email. We’ll send a reset link to the
          registered email.
        </p>

        {error ? (
          <div className="mm-org-login__alert mm-org-login__alert--err" role="alert">
            {error}
          </div>
        ) : null}
        {hint && !error ? (
          <div className="mm-org-login__alert mm-org-login__alert--ok" role="status">
            {hint}
          </div>
        ) : null}

        {!resetUrl ? (
          <form className="mm-org-login__form" onSubmit={onSubmit} noValidate>
            <div>
              <label className="mm-org-login__label" htmlFor="org-fp-college">
                Organization
              </label>
              <select
                id="org-fp-college"
                className="mm-org-login__field"
                style={{ width: '100%', padding: '10px 12px' }}
                value={college?.code || ''}
                disabled={collegesLoading}
                onChange={(e) => {
                  setCollege(colleges.find((c) => c.code === e.target.value) || null);
                }}
                required
              >
                <option value="">{collegesLoading ? 'Loading…' : 'Select organization'}</option>
                {colleges.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

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

            <button type="submit" className="mm-org-login__submit" disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label className="mm-org-login__label">
              Reset link
              <textarea
                readOnly
                value={resetUrl}
                style={{
                  width: '100%',
                  minHeight: 88,
                  marginTop: 6,
                  padding: 12,
                  borderRadius: 8,
                  fontFamily: 'inherit',
                }}
              />
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" className="mm-org-login__submit" style={{ flex: 1 }} onClick={copyLink}>
                <Copy size={16} style={{ marginRight: 6 }} />
                {copied ? 'Copied' : 'Copy link'}
              </button>
              <a className="mm-org-login__submit" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }} href={resetUrl}>
                Open link
              </a>
            </div>
          </div>
        )}

        <p style={{ marginTop: 18, fontSize: 14 }}>
          Remember it?{' '}
          <Link to={orgPaths.login} className="mm-org-login__ghost-link">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
