import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrgAdmins } from '../store';

export default function SettingsPage() {
  const [msg, setMsg] = useState('');
  const [tpos, setTpos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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
  }, []);

  useEffect(() => {
    if (!error) return undefined;
    const timer = window.setTimeout(() => setError(''), 3500);
    return () => window.clearTimeout(timer);
  }, [error]);

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
        <h2 className="mb-3 text-sm font-extrabold">ORG_ADMIN accounts created</h2>
        <div className="overflow-x-auto">
          <table className="mm-pa-table min-w-[700px]">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Org ID</th>
                <th>Activation</th>
              </tr>
            </thead>
            <tbody>
              {(loading ? Array.from({ length: 4 }, (_, i) => ({ id: `loading-tpo-${i}` })) : tpos).map((u) => (
                <tr key={u.id}>
                  {loading ? (
                    <>
                      <td><div className="mm-pa-skeleton h-5 w-32" /></td>
                      <td><div className="mm-pa-skeleton h-5 w-40" /></td>
                      <td><div className="mm-pa-skeleton h-5 w-28" /></td>
                      <td><div className="mm-pa-skeleton h-5 w-16" /></td>
                      <td><div className="mm-pa-skeleton h-6 w-24" /></td>
                    </>
                  ) : (
                    <>
                      <td className="font-semibold">{u.first_name} {u.last_name}</td>
                      <td>{u.email}</td>
                      <td className="font-mono text-xs">{u.username}</td>
                      <td>{u.organization_id}</td>
                      <td>
                        <span className={`mm-pa-badge ${u.activation_status === 'PENDING' ? 'mm-pa-badge--pending' : 'mm-pa-badge--active'}`}>
                          {u.activation_status || 'ACTIVE'}
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !tpos.length && <div className="mm-pa-empty">No TPO accounts yet.</div>}
        </div>
      </section>

      <section className="mm-pa-panel">
        <h2 className="text-sm font-extrabold text-rose-300">Environment</h2>
        <p className="mt-2 text-sm text-slate-400">
          This portal is connected to backend APIs using <code className="mx-1 rounded bg-white/5 px-1.5 py-0.5 text-[11px]">VITE_API_KEY</code> and
          <code className="mx-1 rounded bg-white/5 px-1.5 py-0.5 text-[11px]">VITE_PLATFORM_API_BASE_URL</code>.
        </p>
      </section>
    </div>
  );
}
