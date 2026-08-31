import { Link } from 'react-router-dom';
import { orgPaths } from '../paths';

/**
 * Named list of students who need mentoring — shared TPO/HOD pattern.
 * @param {{ title?: string, students?: object[], scopeLabel?: string, showAssign?: boolean, onAssign?: (s: object) => void }} props
 */
export default function AtRiskPanel({
  title = 'Students needing attention',
  students = [],
  scopeLabel = '',
  showAssign = false,
  onAssign,
}) {
  const list = (students || []).slice(0, 8);

  return (
    <section className="mm-org-panel">
      <div className="mm-org-panel__head">
        <div>
          <h2 className="mm-org-panel__title">{title}</h2>
          <p className="mm-org-panel__meta">
            Less prepared (&lt;50% readiness){scopeLabel ? ` · ${scopeLabel}` : ''}
          </p>
        </div>
        <Link to={orgPaths.performance} className="mm-org-link text-xs">
          All scorecards →
        </Link>
      </div>
      {list.length ? (
        <ul className="m-0 list-none space-y-2 p-0">
          {list.map((s) => (
            <li key={s.id} className="mm-org-list-card flex items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                <p className="m-0 truncate font-bold mm-org-text">{s.name}</p>
                <p className="m-0 truncate text-xs mm-org-text-muted">
                  {s.departmentName || '—'}
                  {s.weakness && s.weakness !== '—' ? ` · gap: ${s.weakness}` : ''}
                  {s.testsDone != null ? ` · ${s.testsDone} tests` : ''}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 shrink-0">
                <span className="mm-org-badge mm-org-badge--danger">
                  {s.readiness == null ? '—' : `${Math.round(s.readiness)}%`}
                </span>
                {showAssign && onAssign ? (
                  <button
                    type="button"
                    className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                    onClick={() => onAssign(s)}
                  >
                    Assign
                  </button>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="m-0 text-sm mm-org-text-muted">
          No students flagged as less prepared yet — or scores are still loading.
        </p>
      )}
    </section>
  );
}
