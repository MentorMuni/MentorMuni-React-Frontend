import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Loader2 } from 'lucide-react';
import { changePlatformPassword, getPlatformSession, setPlatformSession } from '../auth';
import { platformAdminPaths } from '../paths';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const session = getPlatformSession();
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

    try {
      setSaving(true);
      await changePlatformPassword(form.currentPassword, form.newPassword);
      setPlatformSession({ ...session, mustChangePassword: false });
      setSuccess('Password updated successfully. Redirecting to dashboard...');
      window.setTimeout(() => {
        navigate(platformAdminPaths.dashboard, { replace: true });
      }, 900);
    } catch (err) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <section className="mm-pa-panel">
        <h2 className="text-xl font-extrabold tracking-tight">Change Password</h2>
        <p className="mt-2 text-sm text-slate-400">
          For security, update your platform admin password before continuing operations.
        </p>

        <form onSubmit={submit} className="mt-5 space-y-4">
          {error && <div className="mm-pa-inline-toast mm-pa-inline-toast--error">{error}</div>}
          {success && <div className="mm-pa-success">{success}</div>}

          <div>
            <label className="mm-pa-label">Current Password</label>
            <input
              type="password"
              className="mm-pa-input"
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            />
          </div>

          <div>
            <label className="mm-pa-label">New Password</label>
            <input
              type="password"
              className="mm-pa-input"
              autoComplete="new-password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            />
          </div>

          <div>
            <label className="mm-pa-label">Confirm New Password</label>
            <input
              type="password"
              className="mm-pa-input"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="mm-pa-btn mm-pa-btn--ghost"
              onClick={() => navigate(platformAdminPaths.dashboard)}
            >
              Skip for now
            </button>
            <button type="submit" className="mm-pa-btn mm-pa-btn--primary" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <KeyRound size={15} /> Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
