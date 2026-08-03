import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrgAdmins, reinviteTpo, orgAdminTitleLabel } from '../store';
import { platformAdminPaths } from '../paths';

export default function SettingsPage() {
  const [msg, setMsg] = useState('');
  const [tpos, setTpos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [reinvitingId, setReinvitingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setTpos(await getOrgAdmins());
        setError('');
      } catch (e) {
        setError(e.message || 'Unable to load Org Admin accounts.');
      } finally {
        setLoading(false);
      }
    };
    load();
    window.addEventListener('mm-platform-db-updated', load);
    return () => window.removeEventListener('mm-platform-db-updated', load);
  }, []);

  useEffect(() => {
    if (!error) return undefined;
    const timer = window.setTimeout(() => setError(''), 3500);
    return () => window.clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!msg) return undefined;
    const timer = window.setTimeout(() => setMsg(''), 3500);
    return () => window.clearTimeout(timer);
  }, [msg]);

  const onReinvite = async (admin) => {
    if (!admin?.organization_id) return;
    const userId = admin.user_id ?? admin.id;
    setReinvitingId(userId);
    try {
      await reinviteTpo(admin.organization_id, userId);
      setMsg(`Fresh activation queued for ${admin.email || admin.username || 'Org Admin'}.`);
      setTpos(await getOrgAdmins());
    } catch (e) {
      setError(e.message || 'Failed to reinvite Org Admin.');
    } finally {
      setReinvitingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {msg && <div className="mm-pa-success">{msg}</div>}
      {error && <div className="mm-pa-inline-toast mm-pa-inline-toast--error">{error}</div>}

      <section className="mm-pa-panel">
        <h2 className="mm-pa-panel__title">Platform scope</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          This portal only provisions tenants. After Create Organization → Assign Subscription → Enable Features → Create Org Admin,
          work moves to the Organization Portal. No student, HOD, assessment, or college dashboard tools live here.
        </p>
        <div className="mt-4">
          <Link to={platformAdminPaths.changePassword} className="mm-pa-btn mm-pa-btn--ghost">
            Change Password
          </Link>
        </div>
      </section>

      <section className="mm-pa-panel">
        <h2 className="mm-pa-panel__title mb-2">Organization Admins</h2>
        <p className="mb-4 text-sm text-slate-400">
          Each college can have up to three Org Admins (TPO, Dean, Director) with the same access. Primary is TPO.
          Use <strong className="mm-pa-strong">Edit</strong> (with password reset) for handover, or{' '}
          <strong className="mm-pa-strong">Reinvite</strong> if the same person needs a fresh activation link.
        </p>
        <div className="overflow-x-auto">
          <table className="mm-pa-table min-w-[920px]">
            <thead>
              <tr>
                <th>Name</th>
                <th>Title</th>
                <th>Email</th>
                <th>Username</th>
                <th>Organization</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {(loading ? Array.from({ length: 4 }, (_, i) => ({ id: `loading-tpo-${i}` })) : tpos).map((u) => (
                <tr key={u.id || `${u.organization_id}-${u.email || u.username}-${u.title}`}>
                  {loading ? (
                    <>
                      <td><div className="mm-pa-skeleton h-5 w-32" /></td>
                      <td><div className="mm-pa-skeleton h-5 w-16" /></td>
                      <td><div className="mm-pa-skeleton h-5 w-40" /></td>
                      <td><div className="mm-pa-skeleton h-5 w-28" /></td>
                      <td><div className="mm-pa-skeleton h-5 w-24" /></td>
                      <td><div className="mm-pa-skeleton h-6 w-24" /></td>
                      <td><div className="mm-pa-skeleton h-8 w-24" /></td>
                    </>
                  ) : (
                    <>
                      <td className="font-semibold">
                        {[u.first_name, u.last_name].filter(Boolean).join(' ') || 'Org Admin'}
                        {u.is_primary ? (
                          <span className="mm-pa-table__meta block">Primary</span>
                        ) : null}
                      </td>
                      <td>{orgAdminTitleLabel(u.title)}</td>
                      <td>{u.email || '—'}</td>
                      <td className="font-mono text-xs">{u.username || '—'}</td>
                      <td>
                        <span className="mm-pa-table__title">
                          {u.organization_name || u.organization_code || `Organization #${u.organization_id}`}
                        </span>
                        <span className="mm-pa-table__meta block">ID {u.organization_id}</span>
                      </td>
                      <td>
                        <span
                          className={`mm-pa-badge ${
                            u.activation_status === 'PENDING' || u.activation_status === 'INVITED'
                              ? 'mm-pa-badge--pending'
                              : u.activation_status === 'BLOCKED'
                                ? 'mm-pa-badge--suspended'
                                : 'mm-pa-badge--active'
                          }`}
                        >
                          {u.activation_status || 'ACTIVE'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="mm-pa-btn mm-pa-btn--ghost !px-2.5 !py-1.5 text-xs"
                          disabled={reinvitingId === (u.user_id ?? u.id)}
                          onClick={() => onReinvite(u)}
                        >
                          {reinvitingId === (u.user_id ?? u.id) ? 'Sending…' : 'Reinvite'}
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !tpos.length && (
            <div className="mm-pa-empty">
              No Org Admin accounts yet. Create one from Organizations → Add Org Admin.
            </div>
          )}
        </div>
      </section>

      <section className="mm-pa-panel">
        <h2 className="mm-pa-panel__title">How this portal works</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          MentorMuni Platform is the control plane for tenant setup. You create organizations, attach plans,
          turn features on, and invite Org Admins (TPO / Dean / Director). Day-to-day student and department work
          happens in the Organization Portal after an Org Admin activates their account.
        </p>
      </section>
    </div>
  );
}
