import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Loader2 } from 'lucide-react';
import { changeOrgPassword, getOrgSession, setOrgSession } from '../../orgPortal';
import { getOrgHomePath } from '../roles';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const session = getOrgSession();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
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
      await changeOrgPassword(form.currentPassword, form.newPassword);
      setOrgSession({ ...session, mustChangePassword: false });
      setSuccess('Password updated. Redirecting…');
      window.setTimeout(() => navigate(getOrgHomePath(), { replace: true }), 900);
    } catch (err) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <section className="mm-org-panel">
        <div className="mb-1 flex items-center gap-2">
          <KeyRound size={18} className="mm-org-icon-accent" />
          <h2 className="mm-org-section-title">Change Password</h2>
        </div>
        <form onSubmit={submit} className="mt-5 space-y-4">
          {error ? <div className="mm-org-alert mm-org-alert--error">{error}</div> : null}
          {success ? <div className="mm-org-alert mm-org-alert--success">{success}</div> : null}
          <div>
            <label className="mm-org-label">Current Password</label>
            <input
              type="password"
              className="mm-org-input"
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            />
          </div>
          <div>
            <label className="mm-org-label">New Password</label>
            <input
              type="password"
              className="mm-org-input"
              autoComplete="new-password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            />
          </div>
          <div>
            <label className="mm-org-label">Confirm New Password</label>
            <input
              type="password"
              className="mm-org-input"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
          </div>
          <button type="submit" className="mm-org-btn mm-org-btn--primary" disabled={saving}>
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Updating…
              </>
            ) : (
              'Update password'
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
