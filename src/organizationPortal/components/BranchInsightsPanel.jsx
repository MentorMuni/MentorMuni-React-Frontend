import { Award, TrendingDown, TrendingUp } from 'lucide-react';
import { readinessTone, formatPct } from '../performanceApi';

const PILLAR_LABELS = {
  aptitude: 'Aptitude',
  skills: 'Skills / coding',
  interview: 'Interview / mocks',
};

/**
 * TPO campus brief — which branch leads each pillar and where to intervene.
 */
export default function BranchInsightsPanel({ rankings = {}, byDept = [] }) {
  const areas = ['aptitude', 'skills', 'interview'];
  const cards = areas.map((area) => {
    const list = rankings[area] || [];
    const top = list[0];
    const bottom = list.length > 1 ? list[list.length - 1] : null;
    return { area, label: PILLAR_LABELS[area], top, bottom, list };
  });

  const hasData = cards.some((c) => c.top);
  if (!hasData && !byDept.length) {
    return (
      <div className="mm-org-empty">
        Branch pillar insights appear after students complete assessment checks.
      </div>
    );
  }

  return (
    <div className="mm-org-branch-insights">
      <div className="mm-org-branch-insights__grid">
        {cards.map(({ area, label, top, bottom }) => (
          <article key={area} className="mm-org-branch-insight-card">
            <p className="mm-org-branch-insight-card__kicker">{label}</p>
            {top ? (
              <div className="mm-org-branch-insight-card__row">
                <TrendingUp size={14} aria-hidden />
                <div>
                  <p className="mm-org-branch-insight-card__lead">
                    <strong>{top.departmentName || top.department_name}</strong>
                    <span
                      className={`mm-org-score-chip mm-org-score-chip--${readinessTone(top.score)}`}
                    >
                      {formatPct(top.score)}
                    </span>
                  </p>
                  <p className="mm-org-branch-insight-card__meta">
                    Best branch for {label.toLowerCase()}
                    {top.studentsScored != null || top.students_scored != null
                      ? ` · ${top.studentsScored ?? top.students_scored} scored`
                      : ''}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mm-org-text-muted text-sm">No scored branches yet.</p>
            )}
            {bottom && bottom.departmentId !== top?.departmentId && bottom.department_id !== top?.department_id ? (
              <div className="mm-org-branch-insight-card__row is-muted">
                <TrendingDown size={14} aria-hidden />
                <div>
                  <p className="mm-org-branch-insight-card__lead">
                    {bottom.departmentName || bottom.department_name}
                    <span className="mm-org-score-chip mm-org-score-chip--bad">
                      {formatPct(bottom.score)}
                    </span>
                  </p>
                  <p className="mm-org-branch-insight-card__meta">Needs focused practice</p>
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </div>

      {byDept.length ? (
        <div className="mm-org-branch-insights__table-wrap">
          <p className="mm-org-stat__label mb-2">
            <Award size={14} className="inline mr-1" />
            All branches — aptitude · skills · interview
          </p>
          <div className="mm-org-table-wrap">
            <table className="mm-org-table mm-org-branch-pillar-table">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Scored</th>
                  <th>Readiness</th>
                  <th>Aptitude</th>
                  <th>Skills</th>
                  <th>Interview</th>
                  <th>Strongest</th>
                  <th>Weakest</th>
                </tr>
              </thead>
              <tbody>
                {[...byDept]
                  .sort((a, b) => (b.pillars?.aptitude ?? -1) - (a.pillars?.aptitude ?? -1))
                  .map((d) => (
                    <tr key={d.id}>
                      <td>
                        <p className="mm-org-table__title">{d.name}</p>
                        <p className="mm-org-table__meta">{d.code}</p>
                      </td>
                      <td>{d.scoredStudents ?? d.scored_students ?? 0}</td>
                      <td>
                        {d.avgReadiness == null ? (
                          '—'
                        ) : (
                          <span
                            className={`mm-org-score-chip mm-org-score-chip--${readinessTone(d.avgReadiness)}`}
                          >
                            {Math.round(d.avgReadiness)}%
                          </span>
                        )}
                      </td>
                      {['aptitude', 'skills', 'interview'].map((p) => {
                        const score = d.pillars?.[p];
                        return (
                          <td key={p}>
                            {score == null ? (
                              '—'
                            ) : (
                              <span
                                className={`mm-org-score-chip mm-org-score-chip--${readinessTone(score)}`}
                              >
                                {Math.round(score)}%
                              </span>
                            )}
                          </td>
                        );
                      })}
                      <td className="mm-org-text-good capitalize">{d.bestPillar || d.best_pillar || '—'}</td>
                      <td className="mm-org-text-bad capitalize">
                        {d.weakestPillar || d.weakest_pillar || '—'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
