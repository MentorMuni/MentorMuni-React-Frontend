import { useState } from 'react';
import { resetPlatformDb, getOrgAdmins } from '../store';

export default function SettingsPage() {
  const [msg, setMsg] = useState('');
  const tpos = getOrgAdmins();

  const reset = () => {
    if (!window.confirm('Reset platform demo data to seed state?')) return;
    resetPlatformDb();
    setMsg('Platform database reset to seed data.');
  };

  return (
    <div className="space-y-5">
      {msg && <div className="mm-pa-success">{msg}</div>}

      <section className="mm-pa-panel">
        <h2 className="text-sm font-extrabold">Platform scope</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          This portal only provisions tenants. After Create Organization → Assign Subscription → Enable Features → Create TPO,
          work moves to the Organization Portal. No student, HOD, assessment, or college dashboard tools live here.
        </p>
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
              {tpos.map((u) => (
                <tr key={u.id}>
                  <td className="font-semibold">{u.first_name} {u.last_name}</td>
                  <td>{u.email}</td>
                  <td className="font-mono text-xs">{u.username}</td>
                  <td>{u.organization_id}</td>
                  <td>
                    <span className={`mm-pa-badge ${u.activation_status === 'PENDING' ? 'mm-pa-badge--pending' : 'mm-pa-badge--active'}`}>
                      {u.activation_status || 'ACTIVE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!tpos.length && <div className="mm-pa-empty">No TPO accounts yet.</div>}
        </div>
      </section>

      <section className="mm-pa-panel">
        <h2 className="text-sm font-extrabold text-rose-300">Danger zone</h2>
        <p className="mt-2 text-sm text-slate-400">
          Local demo store only. Resets organizations, subscriptions, features, and TPO users to seed data.
        </p>
        <button type="button" className="mm-pa-btn mm-pa-btn--danger mt-4" onClick={reset}>
          Reset platform demo data
        </button>
      </section>
    </div>
  );
}
