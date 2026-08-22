import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Loader2 } from 'lucide-react';
import {
  changeStudentPassword,
  getStudentSession,
  studentMustChangePassword,
} from '../auth';
import { studentPaths } from '../paths';
import { StudentApiError } from '../studentApi';
import '../styles/profile.css';

export default function StudentChangePasswordPage() {
  const navigate = useNavigate();
  const session = getStudentSession();
  const forced = studentMustChangePassword(session);
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (form.newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    if (form.newPassword === form.currentPassword) {
      setError('Pick a new password that is different from the current one.');
      return;
    }
    try {
      setSaving(true);
      await changeStudentPassword(form.currentPassword, form.newPassword);
      setSuccess('Password updated.');
      window.setTimeout(() => navigate(studentPaths.home, { replace: true }), 700);
    } catch (err) {
      const message =
        err instanceof StudentApiError
          ? err.message
          : err?.message || 'Could not change password.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="stu-main">
      <section className="stu-card stu-pw">
        <header className="stu-card__head">
          <div>
            <p className="stu-pw__kicker">
              <KeyRound size={14} strokeWidth={2.2} aria-hidden />
              {forced ? 'Required before you continue' : 'Account security'}
            </p>
            <h1 className="stu-card__title">Change password</h1>
            <p className="stu-card__sub">
              {forced
                ? 'Your college set a temporary password. Choose one only you know, then continue into the portal.'
                : 'Update the password you use to sign in to the student portal.'}
            </p>
          </div>
        </header>

        <form className="stu-pw__form" onSubmit={submit} noValidate>
          {error ? (
            <p className="stu-alert stu-alert--bad" role="alert">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="stu-alert stu-alert--info" role="status">
              {success}
            </p>
          ) : null}

          <label className="stu-pw__label">
            Current password
            <input
              type="password"
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            />
          </label>
          <label className="stu-pw__label">
            New password
            <input
              type="password"
              autoComplete="new-password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            />
          </label>
          <label className="stu-pw__label">
            Confirm new password
            <input
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
          </label>

          <div className="stu-pw__actions">
            <button type="submit" className="stu-btn stu-btn--primary" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="spin" aria-hidden /> Updating…
                </>
              ) : (
                'Update password'
              )}
            </button>
            {!forced ? (
              <Link className="stu-link-btn" to={studentPaths.profile}>
                Back to profile
              </Link>
            ) : null}
          </div>
        </form>
      </section>
    </main>
  );
}
