import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Sparkles } from 'lucide-react';
import { getOrgSession } from '../../orgPortal';
import { isHodRole } from '../roles';
import { resolveHodDepartment } from '../hodScope';
import {
  getHodAccess,
  getHodMetrics,
  getTpoMetrics,
  listStudents,
  subscribeOrgDb,
} from '../store';

const EASE = [0.22, 1, 0.36, 1];

function exportScorecardsCsv(rows, filenamePrefix = 'mentormuni-scorecards') {
  const header = ['Name', 'Email', 'Department', 'Readiness', 'Mock', 'Strength', 'Gap', 'Activities'];
  const lines = [header.join(',')];
  rows.forEach((s) => {
    const cells = [
      s.name,
      s.email,
      s.departmentName || '',
      s.readiness,
      s.mockScore,
      s.strength,
      s.weakness,
      s.activities,
    ].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`);
    lines.push(cells.join(','));
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PerformancePage() {
  const session = getOrgSession();
  const hod = isHodRole(session?.role);
  const hodDept = hod ? resolveHodDepartment(session) : null;
  const [access] = useState(() => getHodAccess());
  const [metrics, setMetrics] = useState(() =>
    hod && hodDept ? getHodMetrics(hodDept.id) : getTpoMetrics()
  );
  const [students, setStudents] = useState(() => listStudents());
  const [query, setQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState(hodDept?.id || '');

  useEffect(
    () =>
      subscribeOrgDb(() => {
        const dept = resolveHodDepartment(getOrgSession());
        if (isHodRole(getOrgSession()?.role) && dept) {
          setMetrics(getHodMetrics(dept.id));
          setDeptFilter(dept.id);
        } else {
          setMetrics(getTpoMetrics());
        }
        setStudents(listStudents());
      }),
    []
  );

  const scopedStudents = useMemo(() => {
    if (hod && hodDept) {
      return students.filter((s) => s.departmentId === hodDept.id);
    }
    return students;
  }, [students, hod, hodDept]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scopedStudents
      .filter((s) => (!deptFilter || s.departmentId === deptFilter))
      .filter(
        (s) =>
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.departmentName || '').toLowerCase().includes(q)
      )
      .sort((a, b) => (b.readiness || 0) - (a.readiness || 0));
  }, [scopedStudents, query, deptFilter]);

  if (hod && !hodDept) {
    return (
      <div className="mm-org-panel">
        <h2 className="mm-org-panel__title">Branch not linked</h2>
        <p className="m-0 text-sm" style={{ color: 'var(--org-muted)' }}>
          Scorecards appear once your HOD account is linked to a department.
        </p>
      </div>
    );
  }

  if (hod && access.canViewAllScores === false) {
    return (
      <div className="mm-org-alert mm-org-alert--error">
        Scorecard access is disabled for HODs. Ask TPO to enable “View department scorecards”.
      </div>
    );
  }

  const byDept = hod
    ? [
        {
          id: hodDept.id,
          name: metrics.departmentName || hodDept.name,
          avgReadiness: metrics.avgReadiness,
        },
      ]
    : metrics.byDept || [];

  return (
    <div className="space-y-5">
      <div className="mm-org-toolbar">
        <p className="m-0 text-sm" style={{ color: 'var(--org-muted)' }}>
          {hod
            ? `${hodDept.name} readiness — export for mentoring notes anytime.`
            : `${session?.organization_name || 'Campus'} readiness — export for analysis anytime.`}
        </p>
        <button
          type="button"
          className="mm-org-btn mm-org-btn--primary"
          disabled={!filtered.length}
          onClick={() =>
            exportScorecardsCsv(
              filtered,
              hod ? `mentormuni-${hodDept.code || 'branch'}-scorecards` : 'mentormuni-scorecards'
            )
          }
        >
          <Download size={15} /> Export CSV
        </button>
      </div>
      <div className="mm-org-stat-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        {[
          { label: 'Avg readiness', value: `${metrics.avgReadiness}%` },
          { label: 'Strong (≥75%)', value: metrics.strong },
          { label: 'Needs support (<50%)', value: metrics.weak },
          { label: 'Students scored', value: metrics.students },
        ].map((c, i) => (
          <motion.div
            key={c.label}
            className="mm-org-stat"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i, duration: 0.35, ease: EASE }}
          >
            <p className="mm-org-stat__label">{c.label}</p>
            <p className="mm-org-stat__value">{c.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <section className="mm-org-panel lg:col-span-2">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">{hod ? 'Branch deep dive' : 'Department deep dive'}</h2>
              <p className="mm-org-panel__meta">{hod ? 'Your department' : 'Branch-level readiness'}</p>
            </div>
          </div>
          {byDept.length ? (
            <div className="space-y-4">
              {byDept.map((d, i) => (
                <div key={d.id}>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="font-bold">{d.name}</span>
                    <span style={{ color: 'var(--org-muted)' }}>{d.avgReadiness}%</span>
                  </div>
                  <div className="mm-org-progress">
                    <motion.div
                      className="mm-org-progress__bar"
                      initial={{ width: 0 }}
                      animate={{ width: `${d.avgReadiness}%` }}
                      transition={{ duration: 0.7, delay: 0.04 * i, ease: EASE }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mm-org-empty">Add departments and enroll students to unlock analytics.</div>
          )}
          {!hod ? (
            <div className="mt-5 rounded-xl border p-3" style={{ borderColor: 'var(--org-line)' }}>
              <p className="mm-org-ai-box__title">
                <Sparkles size={14} /> AI insight (next)
              </p>
              <p className="mm-org-ai-box__body" style={{ color: 'var(--org-muted)' }}>
                OpenAI-backed summaries: who’s interview-ready, which batch needs DSA vs HR mocks, and
                personalized remediation plans — wired after live score APIs.
              </p>
            </div>
          ) : (
            <div className="mt-5">
              <p className="mm-org-label">Top gaps in your branch</p>
              <ul className="m-0 list-none space-y-1.5 p-0">
                {(metrics.topGaps || []).length ? (
                  metrics.topGaps.map((g) => (
                    <li key={g.label} className="text-sm" style={{ color: 'var(--org-ink)' }}>
                      {g.label}{' '}
                      <span style={{ color: 'var(--org-muted)' }}>({g.count})</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm" style={{ color: 'var(--org-muted)' }}>—</li>
                )}
              </ul>
            </div>
          )}
        </section>

        <section className="mm-org-panel lg:col-span-3">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">Student scorecards</h2>
              <p className="mm-org-panel__meta">Strengths, gaps, and activity</p>
            </div>
          </div>
          <div className="mm-org-form-grid mb-4">
            <div>
              <label className="mm-org-label" htmlFor="perf-q">Search</label>
              <input
                id="perf-q"
                className="mm-org-input"
                placeholder={hod ? 'Name or email' : 'Name, email, department'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {!hod ? (
              <div>
                <label className="mm-org-label" htmlFor="perf-dept">Department</label>
                <select
                  id="perf-dept"
                  className="mm-org-select"
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {(metrics.byDept || []).map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>
          {filtered.length ? (
            <div className="mm-org-table-wrap">
              <table className="mm-org-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Readiness</th>
                    <th>Mock</th>
                    <th>Strength</th>
                    <th>Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <p className="mm-org-table__title">{s.name}</p>
                        <p className="mm-org-table__meta">
                          {hod ? s.email : `${s.departmentName || '—'} · ${s.activities} activities`}
                        </p>
                      </td>
                      <td>
                        <span
                          className={`mm-org-badge ${
                            s.readiness >= 75
                              ? 'mm-org-badge--active'
                              : s.readiness < 50
                                ? 'mm-org-badge--danger'
                                : 'mm-org-badge--pending'
                          }`}
                        >
                          {s.readiness}%
                        </span>
                      </td>
                      <td>{s.mockScore}</td>
                      <td>{s.strength}</td>
                      <td>{s.weakness}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mm-org-empty">No student scorecards match this filter.</div>
          )}
        </section>
      </div>
    </div>
  );
}
