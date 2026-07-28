import { useEffect, useMemo, useState } from 'react';
import { getOrganizations, getSubscriptions } from '../store';

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function SubscriptionsPage() {
  const [rows, setRows] = useState([]);
  const [orgList, setOrgList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const orgs = useMemo(() => {
    const map = {};
    orgList.forEach((o) => {
      map[o.id] = o;
    });
    return map;
  }, [orgList]);

  useEffect(() => {
    const refresh = async () => {
      setLoading(true);
      const [subs, organizations] = await Promise.all([getSubscriptions(), getOrganizations()]);
      setRows(subs);
      setOrgList(organizations);
      setLoading(false);
    };
    refresh().catch((e) => {
      setError(e.message || 'Failed to load subscriptions.');
      setLoading(false);
    });
    window.addEventListener('mm-platform-db-updated', refresh);
    return () => window.removeEventListener('mm-platform-db-updated', refresh);
  }, []);

  useEffect(() => {
    if (!error) return undefined;
    const timer = window.setTimeout(() => setError(''), 3500);
    return () => window.clearTimeout(timer);
  }, [error]);

  return (
    <div className="space-y-5">
      <div className="mm-pa-panel">
        {error && <div className="mm-pa-inline-toast mm-pa-inline-toast--error">{error}</div>}
        <p className="mb-4 text-sm text-slate-400">
          Assign or renew plans from the Organizations module. This page is the ledger of all subscription rows
          (<code className="mx-1 rounded bg-white/5 px-1.5 py-0.5 text-[11px]">subscriptions</code>
          including <strong className="text-slate-200">used_students</strong> for seat enforcement.
        </p>

        <div className="overflow-x-auto">
          <table className="mm-pa-table min-w-[900px]">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Plan</th>
                <th>Student Limit</th>
                <th>Used</th>
                <th>Utilization</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(loading ? Array.from({ length: 5 }, (_, i) => ({ id: `loading-sub-${i}` })) : rows).map((s) => {
                if (loading) {
                  return (
                    <tr key={s.id}>
                      <td><div className="mm-pa-skeleton h-10 w-44" /></td>
                      <td><div className="mm-pa-skeleton h-6 w-24" /></td>
                      <td><div className="mm-pa-skeleton h-6 w-24" /></td>
                      <td><div className="mm-pa-skeleton h-6 w-20" /></td>
                      <td><div className="mm-pa-skeleton h-8 w-36" /></td>
                      <td><div className="mm-pa-skeleton h-6 w-24" /></td>
                      <td><div className="mm-pa-skeleton h-6 w-24" /></td>
                      <td><div className="mm-pa-skeleton h-6 w-24" /></td>
                    </tr>
                  );
                }
                const org = orgs[s.organization_id];
                const pct = s.student_limit
                  ? Math.min(100, Math.round((s.used_students / s.student_limit) * 100))
                  : 0;
                return (
                  <tr key={s.id}>
                    <td>
                      <p className="font-bold text-slate-100">{org?.name || `Org #${s.organization_id}`}</p>
                      <p className="text-[11px] text-slate-500">{org?.code || '—'}</p>
                    </td>
                    <td className="font-semibold text-sky-300">{s.plan_name}</td>
                    <td>{s.student_limit.toLocaleString('en-IN')}</td>
                    <td>{s.used_students.toLocaleString('en-IN')}</td>
                    <td className="min-w-[140px]">
                      <div className="mb-1 text-[11px] text-slate-400">{pct}%</div>
                      <div className="mm-pa-progress">
                        <div className="mm-pa-progress__bar" style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td>{formatDate(s.start_date)}</td>
                    <td>{formatDate(s.end_date)}</td>
                    <td>
                      <span
                        className={`mm-pa-badge ${
                          s.status === 'ACTIVE'
                            ? 'mm-pa-badge--active'
                            : s.status === 'REPLACED'
                              ? 'mm-pa-badge--neutral'
                              : 'mm-pa-badge--suspended'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!loading && !rows.length && <div className="mm-pa-empty">No subscriptions yet.</div>}
        </div>
      </div>
    </div>
  );
}
