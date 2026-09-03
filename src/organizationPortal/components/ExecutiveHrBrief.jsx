import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  MessageSquare,
  Target,
  Users,
  AlertTriangle,
  Trophy,
} from 'lucide-react';
import { orgPaths } from '../paths';
import { buildExecutiveHrBrief } from '../executiveBrief';
import { readinessTone, formatPct } from '../performanceApi';

/**
 * One-screen answers for TPO → dean / director / HR.
 * Closes the “hunt across charts” gap on Dashboard + Performance.
 */
export default function ExecutiveHrBrief({
  metrics,
  scopeLabel = 'Campus',
  showPerformanceLink = false,
  onSelectDept,
  compact = false,
}) {
  const brief = buildExecutiveHrBrief(metrics || {}, { scopeLabel });
  const { pillars, interview, tests, participation: part, branches, answers, prepFocus } = brief;

  const kpi = [
    {
      label: 'College readiness',
      value: formatPct(brief.avgReadiness),
      hint: `${part.scored}/${part.students} scored`,
      icon: Target,
    },
    {
      label: 'Interview-ready branches',
      value: String(interview.ready.length),
      hint:
        interview.ready.length > 0
          ? interview.ready.map((b) => b.code || b.name).join(', ')
          : `None ≥${interview.threshold}% interview yet`,
      icon: MessageSquare,
    },
    {
      label: 'Tests completed',
      value: tests.totalCompletions.toLocaleString(),
      hint: `Avg ${tests.avgTestsDone}/${tests.toolsTotal} · ${tests.completionPct}% of possible`,
      icon: ClipboardCheck,
    },
    {
      label: 'Preparing properly',
      value: String(part.preparingProperly),
      hint: `Developing+ of scored · ${part.active7d} active 7d`,
      icon: Users,
    },
  ];

  return (
    <section className={`mm-org-exec-hr${compact ? ' mm-org-exec-hr--compact' : ''}`}>
      <div className="mm-org-exec-hr__head">
        <div>
          <p className="mm-org-exec-hr__eyebrow">Executive · HR answers</p>
          <h2 className="mm-org-exec-hr__title">What leadership will ask</h2>
          <p className="mm-org-exec-hr__sub">
            Interview-ready branches, pillar scores, gaps, test volume, and who is preparing — for{' '}
            {scopeLabel}.
          </p>
        </div>
        {showPerformanceLink ? (
          <Link to={orgPaths.performance} className="mm-org-btn mm-org-btn--primary mm-org-btn--sm">
            Full performance <ArrowRight size={14} />
          </Link>
        ) : null}
      </div>

      <div className="mm-org-exec-hr__kpis">
        {kpi.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="mm-org-exec-hr__kpi">
              <div className="mm-org-exec-hr__kpi-top">
                <p className="mm-org-exec-hr__kpi-label">{c.label}</p>
                <Icon size={15} aria-hidden />
              </div>
              <p className="mm-org-exec-hr__kpi-value">{c.value}</p>
              <p className="mm-org-exec-hr__kpi-hint">{c.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="mm-org-exec-hr__pillars">
        <p className="mm-org-stat__label mb-2">Campus pillar averages</p>
        <div className="mm-org-exec-hr__pillar-row">
          {[
            { key: 'aptitude', label: 'Aptitude', value: pillars.aptitude },
            { key: 'skills', label: 'Skills', value: pillars.skills },
            { key: 'interview', label: 'Interview', value: pillars.interview },
            { key: 'communication', label: 'Communication', value: pillars.communication },
          ].map((p) => (
            <div key={p.key} className="mm-org-exec-hr__pillar">
              <span>{p.label}</span>
              <strong className={`mm-org-score-chip mm-org-score-chip--${readinessTone(p.value)}`}>
                {p.value == null ? '—' : `${Math.round(p.value)}%`}
              </strong>
            </div>
          ))}
        </div>
      </div>

      <div className="mm-org-exec-hr__prep">
        <div className="mm-org-exec-hr__prep-col is-good">
          <p className="mm-org-exec-hr__prep-label">
            <Trophy size={13} aria-hidden /> Protect these strengths
          </p>
          {prepFocus.strengthen.length ? (
            <ul>
              {prepFocus.strengthen.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          ) : (
            <p className="mm-org-text-muted text-sm m-0">Strength themes appear after scores land.</p>
          )}
        </div>
        <div className="mm-org-exec-hr__prep-col is-bad">
          <p className="mm-org-exec-hr__prep-label">
            <AlertTriangle size={13} aria-hidden /> Prep focus (gaps)
          </p>
          {prepFocus.fix.length ? (
            <ul>
              {prepFocus.fix.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          ) : (
            <p className="mm-org-text-muted text-sm m-0">Gap themes appear after scores land.</p>
          )}
        </div>
      </div>

      {branches.length ? (
        <div className="mm-org-exec-hr__table-wrap">
          <p className="mm-org-stat__label mb-2">
            <Building2 size={12} aria-hidden /> Branch readiness & pillars
          </p>
          <div className="mm-org-table-wrap">
            <table className="mm-org-table mm-org-exec-hr__table">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Overall</th>
                  <th>Aptitude</th>
                  <th>Skills</th>
                  <th>Interview</th>
                  <th>Comm</th>
                  <th>Interview-ready?</th>
                  <th>Top gap</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((b) => {
                  const interviewReady =
                    b.interview != null && b.interview >= interview.threshold;
                  return (
                    <tr
                      key={b.id || b.code}
                      className={onSelectDept ? 'mm-org-table-row--clickable' : ''}
                      onClick={onSelectDept ? () => onSelectDept(b) : undefined}
                    >
                      <td>
                        <strong className="mm-org-text">{b.name}</strong>
                        {b.code ? (
                          <span className="block text-xs mm-org-text-muted">{b.code}</span>
                        ) : null}
                      </td>
                      <td>
                        <span className={`mm-org-score-chip mm-org-score-chip--${readinessTone(b.avgReadiness)}`}>
                          {b.avgReadiness == null ? '—' : `${Math.round(b.avgReadiness)}%`}
                        </span>
                      </td>
                      <td>{b.aptitude == null ? '—' : `${Math.round(b.aptitude)}%`}</td>
                      <td>{b.skills == null ? '—' : `${Math.round(b.skills)}%`}</td>
                      <td>{b.interview == null ? '—' : `${Math.round(b.interview)}%`}</td>
                      <td>{b.communication == null ? '—' : `${Math.round(b.communication)}%`}</td>
                      <td>
                        {b.interview == null ? (
                          <span className="mm-org-text-muted">—</span>
                        ) : interviewReady ? (
                          <span className="mm-org-badge mm-org-badge--active">Yes ≥{interview.threshold}%</span>
                        ) : (
                          <span className="mm-org-badge mm-org-badge--pending">Not yet</span>
                        )}
                      </td>
                      <td className="mm-org-text-muted">{b.topGap || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div className="mm-org-exec-hr__answers">
        {answers.map((a) => (
          <article key={a.id} className="mm-org-exec-hr__answer">
            <h3>{a.question}</h3>
            <p className="mm-org-exec-hr__answer-head">{a.headline}</p>
            {a.detail?.length ? (
              <ul>
                {a.detail.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
