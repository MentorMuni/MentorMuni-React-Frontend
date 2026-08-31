import { useEffect, useMemo, useState } from 'react';
import { getOrganizations, getSubscriptions } from '../store';
import { useTableQuery } from '../../hooks/useTableQuery';
import { TableToolbar } from '../../components/table/TableToolbar';
import { SortableTh } from '../../components/table/SortableTh';

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

  const enrichedRows = useMemo(
    () =>
      rows.map((s) => ({
        ...s,
        orgName: orgs[s.organization_id]?.name || '',
        orgCode: orgs[s.organization_id]?.code || '',
      })),
    [rows, orgs]
  );

  const subsTable = useTableQuery(enrichedRows, {
    searchKeys: ['orgName', 'orgCode', 'plan_name', 'status'],
    getSortValue: (row, key) => {
      if (key === 'organization') return (row.orgName || '').toLowerCase();
      if (key === 'plan') return row.plan_name || '';
      if (key === 'seatLimit') return Number(row.student_limit || 0);
      if (key === 'seatsUsed') return Number(row.used_students || 0);
      if (key === 'seatsLeft') return Math.max(0, Number(row.student_limit || 0) - Number(row.used_students || 0));
      if (key === 'utilization') {
        const limit = Number(row.student_limit || 0);
        return limit ? Number(row.used_students || 0) / limit : 0;
      }
      if (key === 'start') return row.start_date || '';
      if (key === 'end') return row.end_date || '';
      if (key === 'status') return row.status || '';
      return row[key];
    },
  });

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
          Don’t create or renew plans here. Use <strong className="mm-pa-strong">Organizations → Plan</strong> to
          assign or renew a subscription. This page is only the history of plans already assigned, and shows how
          many student seats are filled versus the seat limit.
        </p>

        {!loading ? (
          <TableToolbar
            variant="pa"
            query={subsTable.query}
            onQueryChange={subsTable.setQuery}
            placeholder="Search organization, plan, status…"
            count={subsTable.count}
            total={subsTable.total}
          />
        ) : null}

        <div className="overflow-x-auto">
          <table className="mm-pa-table min-w-[900px]">
            <thead>
              <tr>
                <SortableTh label="Organization" sortKey="organization" sort={subsTable.sort} onSort={subsTable.toggleSort} />
                <SortableTh label="Plan" sortKey="plan" sort={subsTable.sort} onSort={subsTable.toggleSort} />
                <SortableTh label="Seat Limit" sortKey="seatLimit" sort={subsTable.sort} onSort={subsTable.toggleSort} />
                <SortableTh label="Seats Used" sortKey="seatsUsed" sort={subsTable.sort} onSort={subsTable.toggleSort} />
                <SortableTh label="Seats Left" sortKey="seatsLeft" sort={subsTable.sort} onSort={subsTable.toggleSort} />
                <SortableTh label="Utilization" sortKey="utilization" sort={subsTable.sort} onSort={subsTable.toggleSort} />
                <SortableTh label="Start" sortKey="start" sort={subsTable.sort} onSort={subsTable.toggleSort} />
                <SortableTh label="End" sortKey="end" sort={subsTable.sort} onSort={subsTable.toggleSort} />
                <SortableTh label="Status" sortKey="status" sort={subsTable.sort} onSort={subsTable.toggleSort} />
              </tr>
            </thead>
            <tbody>
              {(loading ? Array.from({ length: 5 }, (_, i) => ({ id: `loading-sub-${i}` })) : subsTable.rows).map((s) => {
                if (loading) {
                  return (
                    <tr key={s.id}>
                      <td><div className="mm-pa-skeleton h-10 w-44" /></td>
                      <td><div className="mm-pa-skeleton h-6 w-24" /></td>
                      <td><div className="mm-pa-skeleton h-6 w-24" /></td>
                      <td><div className="mm-pa-skeleton h-6 w-20" /></td>
                      <td><div className="mm-pa-skeleton h-6 w-20" /></td>
                      <td><div className="mm-pa-skeleton h-8 w-36" /></td>
                      <td><div className="mm-pa-skeleton h-6 w-24" /></td>
                      <td><div className="mm-pa-skeleton h-6 w-24" /></td>
                      <td><div className="mm-pa-skeleton h-6 w-24" /></td>
                    </tr>
                  );
                }
                const org = orgs[s.organization_id];
                const seatLimit = Number(s.student_limit || 0);
                const seatsUsed = Number(s.used_students || 0);
                const seatsLeft = Math.max(0, seatLimit - seatsUsed);
                const pct = seatLimit
                  ? Math.min(100, Math.round((seatsUsed / seatLimit) * 100))
                  : 0;
                return (
                  <tr key={s.id}>
                    <td>
                      <p className="mm-pa-table__title">{org?.name || `Org #${s.organization_id}`}</p>
                      <p className="mm-pa-table__meta">{org?.code || '—'}</p>
                    </td>
                    <td className="font-semibold text-sky-300">{s.plan_name}</td>
                    <td>{seatLimit.toLocaleString('en-IN')}</td>
                    <td>{seatsUsed.toLocaleString('en-IN')}</td>
                    <td>{seatsLeft.toLocaleString('en-IN')}</td>
                    <td className="min-w-[140px]">
                      <div className="mb-1 mm-pa-table__meta">{pct}%</div>
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
