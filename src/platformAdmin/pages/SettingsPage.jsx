import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrgAdmins, reinviteTpo } from '../store';
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
        setError(e.message || 'Unable to load organization TPO accounts.');
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

  const onReinvite = async (tpo) => {
    if (!tpo?.organization_id) return;
    setReinvitingId(tpo.organization_id);
    try {
      await reinviteTpo(tpo.organization_id);
      setMsg(`Fresh activation queued for ${tpo.email || tpo.username || 'TPO'}.`);
      setTpos(await getOrgAdmins());
    } catch (e) {
      setError(e.message || 'Failed to reinvite TPO.');
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
          This portal only provisions tenants. After Create Organization → Assign Subscription → Enable Features → Create TPO,
          work moves to the Organization Portal. No student, HOD, assessment, or college dashboard tools live here.
        </p>
        <div className="mt-4">
          <Link to={platformAdminPaths.changePassword} className="mm-pa-btn mm-pa-btn--ghost">
            Change Password
          </Link>
        </div>
      </section>

      <section className="mm-pa-panel">
        <h2 className="mm-pa-panel__title mb-2">Organization TPOs</h2>
        <p className="mb-4 text-sm text-slate-400">
          Each college or public tenant has one Training &amp; Placement Officer (TPO). Use{' '}
          <strong className="mm-pa-strong">Edit</strong> (with password reset) when handing the role to someone new,
          or <strong className="mm-pa-strong">Reinvite</strong> if the same person needs a fresh activation link.
        </p>
        <div className="overflow-x-auto">
          <table className="mm-pa-table min-w-[820px]">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Organization</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {(loading ? Array.from({ length: 4 }, (_, i) => ({ id: `loading-tpo-${i}` })) : tpos).map((u) => (
                <tr key={u.id || `${u.organization_id}-${u.email || u.username}`}>
                  {loading ? (
                    <>
                      <td><div className="mm-pa-skeleton h-5 w-32" /></td>
                      <td><div className="mm-pa-skeleton h-5 w-40" /></td>
                      <td><div className="mm-pa-skeleton h-5 w-28" /></td>
                      <td><div className="mm-pa-skeleton h-5 w-24" /></td>
                      <td><div className="mm-pa-skeleton h-6 w-24" /></td>
                      <td><div className="mm-pa-skeleton h-8 w-24" /></td>
                    </>
                  ) : (
                    <>
                      <td className="font-semibold">
                        {[u.first_name, u.last_name].filter(Boolean).join(' ') || 'Organization TPO'}
                      </td>
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
                          disabled={reinvitingId === u.organization_id}
                          onClick={() => onReinvite(u)}
                        >
                          {reinvitingId === u.organization_id ? 'Sending…' : 'Reinvite'}
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
              No TPO accounts yet. Create one from Organizations → Add TPO.
            </div>
          )}
        </div>
      </section>

      <section className="mm-pa-panel">
        <h2 className="mm-pa-panel__title">How this portal works</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          MentorMuni Platform is the control plane for tenant setup. You create organizations, attach plans,
          turn features on, and invite the campus TPO. Day-to-day student and department work happens in the
          Organization Portal after the TPO activates their account.
        </p>
      </section>
    </div>
  );
}
