import { readinessTone } from '../performanceApi';

const HOD_STATUS = {
  active: { label: 'HOD active', className: 'mm-org-badge--active' },
  invited: { label: 'HOD invited', className: 'mm-org-badge--pending' },
  unassigned: { label: 'No HOD', className: 'mm-org-badge--danger' },
};

/**
 * TPO campus view — compare every branch in one table.
 * @param {{ departments?: object[] }} props
 */
export default function DeptReadinessTable({ departments = [] }) {
  const rows = [...(departments || [])].sort((a, b) => {
    const aAvg = a.avgReadiness ?? -1;
    const bAvg = b.avgReadiness ?? -1;
    return aAvg - bAvg;
  });

  if (!rows.length) {
    return (
      <div className="mm-org-empty">
        No department data yet. Create branches and enroll students to compare readiness.
      </div>
    );
  }

  return (
    <div className="mm-org-table-wrap">
      <table className="mm-org-table mm-org-dept-table">
        <thead>
          <tr>
            <th>Branch</th>
            <th>Students</th>
            <th>Scored</th>
            <th>Avg readiness</th>
            <th>Drive-ready</th>
            <th>Developing</th>
            <th>Less prepared</th>
            <th>Top gap</th>
            <th>Active 7d</th>
            <th>Mentor</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => {
            const hodKey = String(d.hodStatus || 'unassigned').toLowerCase();
            const hod = HOD_STATUS[hodKey] || {
              label: d.hodStatus || '—',
              className: 'mm-org-badge--neutral',
            };
            const avg = d.avgReadiness;
            return (
              <tr key={d.id || d.code}>
                <td>
                  <p className="mm-org-table__title">{d.name}</p>
                  <p className="mm-org-table__meta">{d.code}</p>
                </td>
                <td>{d.students ?? 0}</td>
                <td>
                  {d.scoredStudents ?? '—'}
                  {d.coveragePct != null ? (
                    <span className="mm-org-table__meta block">{Math.round(d.coveragePct)}%</span>
                  ) : null}
                </td>
                <td>
                  {avg == null ? (
                    <span className="mm-org-text-muted">—</span>
                  ) : (
                    <span className={`mm-org-score-chip mm-org-score-chip--${readinessTone(avg)}`}>
                      {Math.round(avg)}%
                    </span>
                  )}
                </td>
                <td className="mm-org-text-good">{d.strong ?? 0}</td>
                <td>{d.mid ?? 0}</td>
                <td className="mm-org-text-bad">{d.weak ?? 0}</td>
                <td className="mm-org-text">{d.topGap || '—'}</td>
                <td>{d.active7d ?? 0}</td>
                <td>
                  <span className={`mm-org-badge ${hod.className}`}>{hod.label}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
