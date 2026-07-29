import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrgAdmins, reinviteTpo } from '../store';

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
        setError(e.message || 'Unable to fetch ORG_ADMIN users.');
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
        <h2 className="text-sm font-extrabold">Platform scope</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          This portal only provisions tenants. After Create Organization → Assign Subscription → Enable Features → Create TPO,
          work moves to the Organization Portal. No student, HOD, assessment, or college dashboard tools live here.
        </p>
        <div className="mt-4">
          <Link to="/mentormuniplatformadmin/change-password" className="mm-pa-btn mm-pa-btn--ghost">
            Change Password
          </Link>
        </div>
      </section>

      <section className="mm-pa-panel">
        <h2 className="mb-2 text-sm font-extrabold">ORG_ADMIN accounts</h2>
        <p className="mb-4 text-sm text-slate-400">
          Loaded from <code className="mm-pa-code">GET /platform/tpo</code>. One ORG_ADMIN per organization —
          use <strong>Edit</strong> (with password reset) for handover, or <strong>Reinvite</strong> if the same person forgot their password.
        </p>
        <div className="overflow-x-auto">
          <table className="mm-pa-table min-w-[820px]">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Org</th>
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
                        {[u.first_name, u.last_name].filter(Boolean).join(' ') || 'ORG_ADMIN'}
                      </td>
                      <td>{u.email || '—'}</td>
                      <td className="font-mono text-xs">{u.username || '—'}</td>
                      <td>
                        <span className="mm-pa-table__title">
                          {u.organization_name || u.organization_code || `Org #${u.organization_id}`}
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
              No TPO accounts yet. Create one from Organizations → TPO.
            </div>
          )}
        </div>
      </section>

      <section className="mm-pa-panel">
        <h2 className="mm-pa-heading-warn">Environment</h2>
        <p className="mt-2 text-sm text-slate-400">
          This portal is connected to backend APIs using <code className="mm-pa-code">VITE_API_KEY</code> and
          <code className="mm-pa-code">VITE_API_URL</code>.
        </p>
      </section>
    </div>
  );
}
