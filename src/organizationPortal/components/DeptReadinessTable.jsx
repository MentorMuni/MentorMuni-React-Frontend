import { readinessTone } from '../performanceApi';
import { useTableQuery } from '../../hooks/useTableQuery';
import { TableToolbar } from '../../components/table/TableToolbar';
import { SortableTh } from '../../components/table/SortableTh';

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
  const deptTable = useTableQuery(departments, {
    searchKeys: ['name', 'code', 'topGap', 'hodStatus', 'bestPillar'],
    initialSort: { key: 'readiness', direction: 'asc' },
    getSortValue: (row, key) => {
      if (key === 'branch') return (row.name || row.code || '').toLowerCase();
      if (key === 'scored') return row.scoredStudents ?? 0;
      if (key === 'readiness') return row.avgReadiness ?? -1;
      if (key === 'aptitude') return row.pillars?.aptitude;
      if (key === 'skills') return row.pillars?.skills;
      if (key === 'interview') return row.pillars?.interview;
      if (key === 'voiceMock') return row.avgMock;
      if (key === 'communication') return row.pillars?.communication;
      if (key === 'driveReady') return row.strong ?? 0;
      if (key === 'lessPrepared') return row.weak ?? 0;
      if (key === 'topGap') return row.topGap || '';
      if (key === 'mentor') return row.hodStatus || '';
      return row[key];
    },
  });

  if (!departments?.length) {
    return (
      <div className="mm-org-empty">
        No department data yet. Create branches and enroll students to compare readiness.
      </div>
    );
  }

  return (
    <>
      <TableToolbar
        query={deptTable.query}
        onQueryChange={deptTable.setQuery}
        placeholder="Search branch, code, gap…"
        count={deptTable.count}
        total={deptTable.total}
      />
      <div className="mm-org-table-wrap">
        <table className="mm-org-table mm-org-dept-table">
          <thead>
            <tr>
              <SortableTh label="Branch" sortKey="branch" sort={deptTable.sort} onSort={deptTable.toggleSort} />
              <SortableTh label="Scored" sortKey="scored" sort={deptTable.sort} onSort={deptTable.toggleSort} />
              <SortableTh label="Readiness" sortKey="readiness" sort={deptTable.sort} onSort={deptTable.toggleSort} />
              <SortableTh label="Aptitude" sortKey="aptitude" sort={deptTable.sort} onSort={deptTable.toggleSort} />
              <SortableTh label="Skills" sortKey="skills" sort={deptTable.sort} onSort={deptTable.toggleSort} />
              <SortableTh label="Interview" sortKey="interview" sort={deptTable.sort} onSort={deptTable.toggleSort} />
              <SortableTh label="Voice mock" sortKey="voiceMock" sort={deptTable.sort} onSort={deptTable.toggleSort} />
              <SortableTh label="Communication" sortKey="communication" sort={deptTable.sort} onSort={deptTable.toggleSort} />
              <SortableTh label="Drive-ready" sortKey="driveReady" sort={deptTable.sort} onSort={deptTable.toggleSort} />
              <SortableTh label="Less prepared" sortKey="lessPrepared" sort={deptTable.sort} onSort={deptTable.toggleSort} />
              <SortableTh label="Top gap" sortKey="topGap" sort={deptTable.sort} onSort={deptTable.toggleSort} />
              <SortableTh label="Mentor" sortKey="mentor" sort={deptTable.sort} onSort={deptTable.toggleSort} />
            </tr>
          </thead>
          <tbody>
            {deptTable.rows.length ? (
              deptTable.rows.map((d) => {
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
                    <td>
                      <PillarCell value={d.avgMock} />
                    </td>
                    <td>
                      <PillarCell value={d.pillars?.communication} />
                    </td>
                    <td className="mm-org-text-good">{d.strong ?? 0}</td>
                    <td className="mm-org-text-bad">{d.weak ?? 0}</td>
                    <td className="mm-org-text">{d.topGap || '—'}</td>
                    <td>
                      <span className={`mm-org-badge ${hod.className}`}>{hod.label}</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={12}>
                  <div className="mm-org-empty">No branches match this search.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
