import { useMemo, useState } from 'react';
import { readinessTone } from '../performanceApi';

/**
 * Per-area leaderboards for HOD — drill into student lists by area.
 */
export default function HodAreaBoardsPanel({ boards = [], onDrillArea, onSelectStudent }) {
  const list = boards || [];
  const [active, setActive] = useState(list[0]?.area || '');

  const board = useMemo(
    () => list.find((b) => b.area === active) || list[0],
    [list, active]
  );

  if (!list.length) {
    return (
      <section className="mm-org-panel">
        <h2 className="mm-org-panel__title">Area deep-dive</h2>
        <div className="mm-org-empty">
          Area boards appear once students complete aptitude, skills, interview, or mock checks.
        </div>
      </section>
    );
  }

  function renderRanked(title, items, tier) {
    if (!items?.length) {
      return (
        <div className="mm-org-area-board__col">
          <h3 className="mm-org-area-board__subtitle">{title}</h3>
          <div className="mm-org-empty text-sm">No ranked students in this slice.</div>
        </div>
      );
    }
    return (
      <div className="mm-org-area-board__col">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="mm-org-area-board__subtitle m-0">{title}</h3>
          <button
            type="button"
            className="mm-org-link text-xs"
            onClick={() =>
              onDrillArea?.({
                area: board.area,
                label: board.label,
                tier,
                studentIds: items.map((s) => s.id),
                title: `${board.label} — ${title}`,
              })
            }
          >
            Expand all →
          </button>
        </div>
        <ul className="m-0 list-none space-y-2 p-0">
          {items.map((s) => (
            <li key={`${tier}-${s.id}`}>
              <button
                type="button"
                className="mm-org-list-card mm-org-list-card--btn w-full text-left text-sm"
                onClick={() => onSelectStudent?.(s)}
              >
                <div className="min-w-0">
                  <p className="m-0 truncate font-bold mm-org-text">
                    #{s.rank} {s.name}
                  </p>
                  <p className="m-0 truncate text-xs mm-org-text-muted">
                    {s.testsDone != null ? `${s.testsDone} tests` : ''}
                    {s.weakness && tier === 'less' ? ` · gap: ${s.weakness}` : ''}
                    {s.strength && tier === 'top' ? ` · ${s.strength}` : ''}
                  </p>
                </div>
                <span className={`mm-org-score-chip mm-org-score-chip--${readinessTone(s.score)}`}>
                  {s.score == null ? '—' : `${Math.round(s.score)}%`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <section className="mm-org-panel mm-org-panel--area-boards">
      <div className="mm-org-panel__head">
        <div>
          <h2 className="mm-org-panel__title">Area deep-dive</h2>
          <p className="mm-org-panel__meta">
            Per-skill leaders and students who need coaching — click expand to see full lists
          </p>
        </div>
      </div>

      <div className="mm-org-area-board__tabs" role="tablist">
        {list.map((b) => (
          <button
            key={b.area}
            type="button"
            role="tab"
            aria-selected={b.area === board?.area}
            className={`mm-org-area-board__tab${b.area === board?.area ? ' is-active' : ''}`}
            onClick={() => setActive(b.area)}
          >
            {b.label}
            {b.avgScore != null ? (
              <span className="mm-org-area-board__tab-score">{Math.round(b.avgScore)}%</span>
            ) : null}
          </button>
        ))}
      </div>

      {board ? (
        <>
          <p className="mm-org-area-board__desc">
            {board.description || `${board.studentsScored || 0} students scored in ${board.label}.`}
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            {renderRanked('Top performers', board.top, 'top')}
            {renderRanked('Needs coaching', board.lessPrepared, 'less')}
          </div>
        </>
      ) : null}
    </section>
  );
}
