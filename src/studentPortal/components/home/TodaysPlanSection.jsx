import { Check, Clock, Lock, Moon } from 'lucide-react';
import { ToolIcon } from '../../roadmap/toolIcons';
import { baselinePathLabel } from '../../baselineAdaptive';
import { baselineSprintCopy } from '../../baselineSprint';
import EmptyState from './EmptyState';
import '../../styles/baseline-path.css';

/**
 * The page's anchor: the one unlocked step, and a button to start it.
 *
 * Kept at this path with this prop shape because CollegesPage embeds
 * it as marketing artwork — see src/components/CollegesPage.jsx.
 */
export default function TodaysPlanSection({
  steps = [],
  onStart,
  baselinePath = null,
  sprintState = null,
}) {
  const current = steps.find((s) => s.status === 'current') || null;
  const lastDone =
    [...steps].filter((s) => s.status === 'done').sort((a, b) => b.order - a.order)[0] || null;
  const doneCount = steps.filter((s) => s.status === 'done').length;
  const total = steps.length || 8;
  const allDone = steps.length > 0 && doneCount === total;
  const sprintLine = baselineSprintCopy(sprintState);

  if (allDone) {
    return (
      <section className="stu-card stu-today">
        <header className="stu-card__head">
          <div>
            <h2 className="stu-card__title">Assessment week complete</h2>
            <p className="stu-card__sub">
              All 8 checks done. Generate your personalized 30–45 day plan — built from your
              strengths and gaps. Your TPO and HOD see your scores on their dashboard.
            </p>
          </div>
          <span className="stu-plan__count">
            {doneCount}/{total}
          </span>
        </header>

        <div className="stu-today__done">
          <Check size={20} strokeWidth={2} aria-hidden focusable="false" />
          <div>
            <p className="stu-today__done-title">All {total} checks finished</p>
            <p className="stu-today__done-sub">
              Your scores and gaps are ready for the placement plan.
            </p>
          </div>
        </div>

        {lastDone ? (
          <p className="stu-today__retake">
            Last finished: {lastDone.title}
            <button type="button" className="stu-link-btn" onClick={() => onStart?.(lastDone)}>
              Retake
            </button>
          </p>
        ) : null}
      </section>
    );
  }

  if (sprintState?.blockedUntilTomorrow) {
    return (
      <section className="stu-card stu-today stu-today--blocked">
        <header className="stu-card__head">
          <div>
            <h2 className="stu-card__title">Day {sprintState.sprintDay} complete</h2>
            <p className="stu-card__sub">
              You finished today&apos;s baseline batch. The next checks unlock tomorrow morning.
            </p>
          </div>
          <span className="stu-plan__count">
            {doneCount}/{total}
          </span>
        </header>

        {sprintLine ? <p className="stu-today__sprint">{sprintLine}</p> : null}

        <div className="stu-today__blocked">
          <Moon size={20} strokeWidth={2} aria-hidden focusable="false" />
          <div>
            <p className="stu-today__done-title">Come back tomorrow</p>
            <p className="stu-today__done-sub">
              {sprintState.nextDayPreview
                ? `Next up: ${sprintState.nextDayPreview}`
                : 'The 3-day sprint spreads checks across calendar days — you cannot rush ahead.'}
            </p>
          </div>
        </div>

        <ol className="stu-today__rail" aria-label={`Baseline progress: ${doneCount} of ${total} done`}>
          {steps.map((s) => (
            <li
              key={s.tool_code}
              className={`stu-today__dot${s.status === 'done' ? ' is-done' : ''}${s.status === 'current' ? ' is-current' : ''}${s.status === 'locked' ? ' is-locked' : ''}`}
              title={`${s.order}. ${s.title} — ${s.status}`}
            >
              {s.status === 'done' ? (
                <Check size={12} strokeWidth={3} aria-hidden focusable="false" />
              ) : s.status === 'locked' ? (
                <Lock size={10} strokeWidth={2.5} aria-hidden focusable="false" />
              ) : (
                s.order
              )}
            </li>
          ))}
        </ol>
      </section>
    );
  }

  if (!current) {
    return (
      <section className="stu-card stu-today">
        <header className="stu-card__head">
          <div>
            <h2 className="stu-card__title">Next check</h2>
          </div>
        </header>
        <EmptyState art="complete" title="Nothing queued yet">
          Your first baseline check appears here as soon as your roadmap loads.
        </EmptyState>
      </section>
    );
  }

  const scoreLabel =
    current.tool_code === '5_sec'
      ? null
      : current.score != null
        ? `${Math.round(current.score)}%`
        : null;

  return (
    <section className="stu-card stu-today">
      <header className="stu-card__head">
        <div>
          <h2 className="stu-card__title">Do this now</h2>
          <p className="stu-card__sub">
            Finish today&apos;s batch (~{current.minutes} min per check). More checks unlock only
            when tomorrow&apos;s sprint day starts.
          </p>
        </div>
        <span className="stu-plan__count">
          {doneCount}/{total}
        </span>
      </header>

      {sprintLine ? <p className="stu-today__sprint">{sprintLine}</p> : null}

      {baselinePath === 'foundation' ? (
        <p className="stu-today__foundation">
          <strong>Foundation mode</strong> — shorter wins before mock pressure. Finish today&apos;s
          check, then optional drills appear on Home.
        </p>
      ) : null}
      {baselinePath === 'fast_track' ? (
        <p className="stu-today__foundation">
          <strong>{baselinePathLabel(baselinePath)}</strong> — readiness checks are waived on
          schedule; mocks unlock with each sprint day.
        </p>
      ) : null}

      <div className="stu-today__mission">
        <span className="stu-today__order" aria-hidden>
          {current.order}
        </span>
        <span className="stu-today__icon" aria-hidden>
          <ToolIcon toolCode={current.tool_code} size={20} strokeWidth={2} />
        </span>
        <div className="stu-today__body">
          <p className="stu-today__kicker">Do this now</p>
          <h3 className="stu-today__title">{current.title}</h3>
          <p className="stu-today__meta">
            <Clock size={14} strokeWidth={2} aria-hidden focusable="false" />
            {current.minutes} min
            {scoreLabel ? ` · last score ${scoreLabel}` : ''}
            {current.order <= (sprintState?.allowedOrder ?? total)
              ? ` · part of Day ${sprintState?.sprintDay ?? 1} batch`
              : ''}
          </p>
        </div>
        <button
          type="button"
          className="stu-btn stu-btn--primary stu-today__cta"
          onClick={() => onStart?.(current)}
        >
          Start
        </button>
      </div>

      <ol className="stu-today__rail" aria-label={`Baseline progress: ${doneCount} of ${total} done`}>
        {steps.map((s) => (
          <li
            key={s.tool_code}
            className={`stu-today__dot${s.status === 'done' ? ' is-done' : ''}${s.status === 'current' ? ' is-current' : ''}${s.status === 'locked' ? ' is-locked' : ''}`}
            title={`${s.order}. ${s.title} — ${s.status}`}
          >
            {s.status === 'done' ? (
              <Check size={12} strokeWidth={3} aria-hidden focusable="false" />
            ) : s.status === 'locked' ? (
              <Lock size={10} strokeWidth={2.5} aria-hidden focusable="false" />
            ) : (
              s.order
            )}
          </li>
        ))}
      </ol>

      {lastDone ? (
        <p className="stu-today__retake">
          Last finished: {lastDone.title}
          <button type="button" className="stu-link-btn" onClick={() => onStart?.(lastDone)}>
            Retake
          </button>
        </p>
      ) : null}
    </section>
  );
}
