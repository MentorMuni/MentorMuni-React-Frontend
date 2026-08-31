import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { orgPaths } from '../paths';

const STATUS_COPY = {
  healthy: {
    title: 'On track',
    blurb: 'Most students are progressing. Keep weekly checks and mocks before the next drive.',
  },
  watch: {
    title: 'Watch closely',
    blurb: 'Mixed signals — focus on unscored students and branches with low coverage.',
  },
  critical: {
    title: 'Needs action',
    blurb: 'Many students are behind or inactive. Prioritize less-prepared batches and tool completion.',
  },
};

/**
 * Executive preparation snapshot — one screen to answer “how is prep going?”
 * @param {{ scope?: 'campus'|'branch', scopeLabel?: string, metrics?: object, showPerformanceLink?: boolean }} props
 */
export default function PrepSnapshot({
  scope = 'campus',
  scopeLabel = 'Campus',
  metrics = {},
  showPerformanceLink = true,
}) {
  const status = metrics?.clarity?.status || 'watch';
  const copy = STATUS_COPY[status] || STATUS_COPY.watch;
  const students = metrics?.students ?? 0;
  const scored = metrics?.studentsScored ?? Math.max(0, students - (metrics?.unscored ?? 0));
  const coverage = metrics?.coveragePct != null ? Math.round(metrics.coveragePct) : scored && students ? Math.round((scored / students) * 100) : 0;
  const tests = metrics?.tests || {};
  const strong = metrics?.bands?.strong ?? metrics?.strong ?? 0;
  const weak = metrics?.bands?.weak ?? metrics?.weak ?? 0;
  const unscored = metrics?.bands?.unscored ?? metrics?.unscored ?? Math.max(0, students - scored);

  const tiles = [
    {
      label: metrics.enrollment ? 'Active (analytics)' : 'Enrolled',
      value: metrics.enrollment ? metrics.enrollment.active : students,
      hint: metrics.enrollment
        ? `${metrics.enrollment.invited} awaiting password · ${metrics.enrollment.pending} pending`
        : scope === 'branch'
          ? scopeLabel
          : 'Active students',
    },
    {
      label: 'Scored',
      value: `${scored}/${students}`,
      hint: `${coverage}% have baseline scores`,
    },
    {
      label: 'Avg readiness',
      value: metrics?.avgReadiness == null ? '—' : `${Math.round(metrics.avgReadiness)}%`,
      hint: scored ? 'Among scored cohort' : 'Complete assessment week',
    },
    {
      label: 'Drive-ready',
      value: strong,
      hint: '≥75% readiness',
    },
    {
      label: 'Less prepared',
      value: weak,
      hint: '<50% — mentor first',
    },
    {
      label: 'Not scored yet',
      value: unscored,
      hint: 'Invite to start baseline',
    },
    {
      label: 'Avg tests done',
      value: `${tests.avgTestsDone ?? 0}/${tests.toolsTotal ?? 8}`,
      hint: `${tests.studentsNoneDone ?? 0} never started tools`,
    },
    {
      label: 'Active (7d)',
      value: metrics?.active7d ?? 0,
      hint: `${metrics?.neverStarted ?? 0} never started`,
    },
  ];

  return (
    <section className={`mm-org-prep mm-org-prep--${status}`}>
      <div className="mm-org-prep__head">
        <div>
          <p className="mm-org-prep__eyebrow">
            {scope === 'branch' ? 'Branch preparation' : 'Campus preparation'} · {scopeLabel}
          </p>
          <h2 className="mm-org-prep__title">{copy.title}</h2>
          <p className="mm-org-prep__blurb">{copy.blurb}</p>
          {metrics.enrollment ? (
            <p className="mm-org-prep__enrollment">
              <strong>Roster pipeline:</strong>{' '}
              {metrics.enrollment.active} active · {metrics.enrollment.invited} awaiting password ·{' '}
              {metrics.enrollment.pending} pending approval
              {metrics.enrollment.blocked
                ? ` · ${metrics.enrollment.blocked} blocked`
                : ''}
              <span className="mm-org-prep__enrollment-note">
                Readiness charts use active students only ({students}).
              </span>
            </p>
          ) : null}
        </div>
        {showPerformanceLink ? (
          <Link to={orgPaths.performance} className="mm-org-btn mm-org-btn--primary mm-org-btn--sm">
            <BarChart3 size={14} /> Full analytics <ArrowRight size={14} />
          </Link>
        ) : null}
      </div>
      <div className="mm-org-prep__grid">
        {tiles.map((t) => (
          <div key={t.label} className="mm-org-prep__tile">
            <p className="mm-org-prep__tile-label">{t.label}</p>
            <p className="mm-org-prep__tile-value">{t.value}</p>
            <p className="mm-org-prep__tile-hint">{t.hint}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
