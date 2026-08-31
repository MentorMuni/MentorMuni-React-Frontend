import { X } from 'lucide-react';
import { readinessTone } from '../performanceApi';
import { drillLabel } from '../hodPerformanceUtils';

export default function ChartDrilldownModal({
  open,
  title,
  meta,
  drill,
  students = [],
  chart,
  onClose,
  onSelectStudent,
}) {
  if (!open) return null;

  const subtitle = drillLabel(drill);

  return (
    <div className="mm-org-drill-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="mm-org-drill-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mm-org-drill-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mm-org-drill-modal__head">
          <div>
            <h2 id="mm-org-drill-title" className="mm-org-drill-modal__title">
              {title}
            </h2>
            {meta ? <p className="mm-org-drill-modal__meta">{meta}</p> : null}
            <p className="mm-org-drill-modal__slice">
              Showing: <strong>{subtitle}</strong> · {students.length} student
              {students.length === 1 ? '' : 's'}
            </p>
          </div>
          <button type="button" className="mm-org-drawer__close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </header>

        <div className="mm-org-drill-modal__chart">{chart}</div>

        <section className="mm-org-drill-modal__table-wrap">
          <h3 className="mm-org-drill-modal__table-title">Students in this slice</h3>
          {students.length ? (
            <table className="mm-org-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Readiness</th>
                  <th>Strength</th>
                  <th>Gap</th>
                  <th>Tests</th>
                  <th>Activity</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr
                    key={s.id}
                    className="mm-org-table-row--clickable"
                    onClick={() => onSelectStudent?.(s)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectStudent?.(s);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                  >
                    <td>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs mm-org-text-muted">{s.email}</div>
                    </td>
                    <td>
                      {s.readiness == null ? (
                        <span className="mm-org-score-chip mm-org-score-chip--none">—</span>
                      ) : (
                        <span
                          className={`mm-org-score-chip mm-org-score-chip--${readinessTone(s.readiness)}`}
                        >
                          {Math.round(s.readiness)}%
                        </span>
                      )}
                    </td>
                    <td>{s.strength || '—'}</td>
                    <td>{s.weakness || '—'}</td>
                    <td>
                      {s.testsDone ?? 0}/
                      {((s.testsDone || 0) + (s.testsRemaining || 0) + (s.testsInProgress || 0)) || 8}
                    </td>
                    <td className="capitalize">{s.activityStatus || 'never'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="mm-org-empty">No students match this slice yet.</div>
          )}
        </section>
      </div>
    </div>
  );
}
