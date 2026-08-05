import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Mail } from 'lucide-react';
import {
  fetchLoginColleges,
  pickInitialCollege,
  saveCollegeCode,
} from '../../orgPortal';
import { requestStudentPasswordResetApi } from '../../organizationPortal/studentsApi';
import { DEMO_ORG } from '../../organizationPortal/demoAuth';
import { studentPaths } from '../paths';
import { StudentThemeFab, useStudentTheme } from '../useStudentTheme.jsx';
import '../student-login.css';

const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;

export default function StudentForgotPasswordPage() {
  const navigate = useNavigate();
  const { theme, toggle, rootClass } = useStudentTheme();
  const [colleges, setColleges] = useState([]);
  const [college, setCollege] = useState(null);
  const [collegesLoading, setCollegesLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [setupUrl, setSetupUrl] = useState('');
  const [accountHint, setAccountHint] = useState('');
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
        setColleges([DEMO_ORG]);
        setCollege(DEMO_ORG);
        return;
      }
      const list = result.colleges || [];
      setColleges(list);
      const initial = pickInitialCollege(list, new URLSearchParams());
      setCollege(initial || list.find((c) => c.code === DEMO_ORG.code) || list[0] || null);
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
    setSetupUrl('');
    setAccountHint('');
    setCopied(false);
    if (!orgCode) {
      setError('Select your college.');
      return;
    }
    if (!userId.trim()) {
      setError('Enter your college ID or email.');
      return;
    }
    setLoading(true);
    const res = await requestStudentPasswordResetApi({ orgCode, userId: userId.trim() });
    setLoading(false);
    if (!res.ok) {
      setError(res.error || 'Unable to start password reset.');
      return;
    }
    if (orgCode) saveCollegeCode(orgCode);
    setSetupUrl(res.setupUrl || '');
    if (res.setupUrl) {
      setAccountHint(res.email || res.name || userId.trim());
    } else {
      setAccountHint(
        res.message || 'If an account exists, a reset email was sent. Check your inbox.'
      );
    }
  };

  const copyLink = async () => {
    if (!setupUrl) return;
    try {
      await navigator.clipboard.writeText(setupUrl);
      setCopied(true);
    } catch {
      setError('Could not copy — select the link manually.');
    }
  };

  return (
    <div className={`mm-stu-login-root ${rootClass}`}>
      <StudentThemeFab theme={theme} onToggle={toggle} />
      <div className="mm-stu-atm" aria-hidden>
        <div className="mm-stu-atm__mesh" />
        <div className="mm-stu-atm__blob mm-stu-atm__blob--a" />
        <div className="mm-stu-atm__blob mm-stu-atm__blob--b" />
      </div>

      <div className="mm-stu-form-col" style={{ minHeight: '100dvh', paddingTop: 32 }}>
        <div className="mm-stu-card mm-stu-card--genz" style={{ width: 'min(440px, 100%)' }}>
          <button
            type="button"
            className="mm-stu-gate2__back"
            style={{ marginBottom: 16 }}
            onClick={() => navigate(studentPaths.login)}
          >
            <ArrowLeft size={16} strokeWidth={2.4} /> Back to login
          </button>

          <div className="mm-stu-brand" style={{ marginBottom: 18 }}>
            <img src={LOGO} alt="MentorMuni" style={{ height: 36 }} />
            <div className="mm-stu-brand__text">
              <span className="mm-stu-brand__name">MentorMuni</span>
              <span className="mm-stu-brand__tag" style={{ color: 'var(--stu-muted)' }}>
                Password reset
              </span>
            </div>
          </div>

          <p className="mm-stu-step-label">Student portal</p>
          <h1 className="mm-stu-card-title">Forgot password?</h1>
          <p className="mm-stu-card-sub">
            Enter your campus and college ID or email. We’ll send a reset link to your
            registered email.
          </p>

          {error ? (
            <div className="mm-stu-alert mm-stu-alert--error" role="alert">
              {error}
            </div>
          ) : null}

          {setupUrl ? (
            <div className="mm-stu-alert mm-stu-alert--ok" style={{ marginBottom: 14 }}>
              Reset ready{accountHint ? ` for ${accountHint}` : ''}. Open the link to choose a new
              password.
            </div>
          ) : null}

          {!setupUrl && accountHint && !error ? (
            <div className="mm-stu-alert mm-stu-alert--ok" style={{ marginBottom: 14 }}>
              {accountHint}
            </div>
          ) : null}

          {!setupUrl && !accountHint ? (
            <form
              onSubmit={onSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              noValidate
            >
              <label className="mm-stu-label">
                College
                <select
                  className="mm-stu-field-input"
                  value={college?.code || ''}
                  disabled={collegesLoading}
                  onChange={(e) => {
                    const next = colleges.find((c) => c.code === e.target.value) || null;
                    setCollege(next);
                  }}
                  required
                >
                  <option value="">{collegesLoading ? 'Loading…' : 'Select college'}</option>
                  {colleges.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </label>

              <label className="mm-stu-label">
                College ID or email
                <input
                  className="mm-stu-field-input"
                  autoComplete="username"
                  placeholder="CSE2024A01 or you@college.edu"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
              </label>

              <button type="submit" className="mm-stu-submit" disabled={loading}>
                <Mail size={16} style={{ marginRight: 6 }} />
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          ) : setupUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label className="mm-stu-label">
                Your reset link
                <textarea
                  className="mm-stu-field-input"
                  style={{ minHeight: 88, padding: '12px 14px', resize: 'vertical' }}
                  readOnly
                  value={setupUrl}
                />
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <button type="button" className="mm-stu-submit" style={{ flex: 1 }} onClick={copyLink}>
                  <Copy size={16} style={{ marginRight: 6 }} />
                  {copied ? 'Copied' : 'Copy link'}
                </button>
                <a
                  className="mm-stu-submit"
                  style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}
                  href={setupUrl}
                >
                  Open link
                </a>
              </div>
              <button
                type="button"
                className="mm-stu-link"
                style={{
                  border: 0,
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
                onClick={() => {
                  setSetupUrl('');
                  setAccountHint('');
                  setCopied(false);
                }}
              >
                Reset a different account
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="mm-stu-link"
              style={{
                border: 0,
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
                marginTop: 8,
              }}
              onClick={() => setAccountHint('')}
            >
              Try another account
            </button>
          )}

          <p className="mm-stu-card-foot">
            Remember it?{' '}
            <Link to={studentPaths.login} className="mm-stu-link">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
