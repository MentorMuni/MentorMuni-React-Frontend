import { readinessTone } from '../performanceApi';

const HOD_STATUS = {
  active: { label: 'HOD active', className: 'mm-org-badge--active' },
  invited: { label: 'HOD invited', className: 'mm-org-badge--pending' },
  unassigned: { label: 'No HOD', className: 'mm-org-badge--danger' },
};

function PillarCell({ value }) {
  if (value == null) return <span className="mm-org-text-muted">—</span>;
  return (
    <span className={`mm-org-score-chip mm-org-score-chip--${readinessTone(value)}`}>
      {Math.round(value)}%
    </span>
  );
}

/**
 * TPO campus view — compare branches with pillar scores and drill-down.
 */
export default function DeptReadinessTable({ departments = [], onSelectDept }) {
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
            <th>Scored</th>
            <th>Readiness</th>
            <th>Aptitude</th>
            <th>Skills</th>
            <th>Interview</th>
            <th>Drive-ready</th>
            <th>Less prepared</th>
            <th>Top gap</th>
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
              <tr
                key={d.id || d.code}
                className={onSelectDept ? 'mm-org-table-row--clickable' : ''}
                onClick={onSelectDept ? () => onSelectDept(d) : undefined}
                onKeyDown={
                  onSelectDept
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectDept(d);
                        }
                      }
                    : undefined
                }
                tabIndex={onSelectDept ? 0 : undefined}
                role={onSelectDept ? 'button' : undefined}
              >
                <td>
                  <p className="mm-org-table__title">{d.name}</p>
                  <p className="mm-org-table__meta">
                    {d.code}
                    {d.bestPillar ? ` · strong in ${d.bestPillar}` : ''}
                  </p>
                </td>
                <td>
                  {d.scoredStudents ?? 0}
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
                <td>
                  <PillarCell value={d.pillars?.aptitude} />
                </td>
                <td>
                  <PillarCell value={d.pillars?.skills} />
                </td>
                <td>
                  <PillarCell value={d.pillars?.interview} />
                </td>
                <td className="mm-org-text-good">{d.strong ?? 0}</td>
                <td className="mm-org-text-bad">{d.weak ?? 0}</td>
                <td className="mm-org-text">{d.topGap || '—'}</td>
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
