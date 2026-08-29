import { Check, Mic, MicOff, Play, RotateCcw, Sparkles } from 'lucide-react';

/**
 * One task. Tool tasks get a Start button and tick themselves off when the
 * tool finishes; manual tasks get a checkbox.
 *
 * Voice tasks carry an explicit way out. A student in a shared hostel room at
 * 11pm cannot speak aloud, and without an escape the most important tasks
 * become the most-skipped ones — then compression keeps re-pushing them.
 */
export default function MissionTaskRow({ task, onStart, onToggle, onDefer }) {
  const done = task.status === 'done';
  const skipped = task.status === 'skipped';
  const isTool = task.kind === 'tool' || task.kind === 'retest' || task.kind === 'action';
  const canToggle = !isTool && !done;

  return (
    <li
      className={`stu-mission__row${done ? ' is-done' : ''}${skipped ? ' is-skipped' : ''}`}
    >
      {canToggle ? (
        <button
          type="button"
          className="stu-mission__check"
          aria-pressed={done}
          aria-label={`Mark "${task.title}" done`}
          onClick={() => onToggle?.(task)}
        />
      ) : (
        <span
          className={`stu-mission__check${done ? ' is-static-done' : ' is-static'}`}
          aria-hidden
        >
          {done ? <Check size={13} strokeWidth={3} focusable="false" /> : null}
        </span>
      )}

      <div className="stu-mission__body">
        <p className="stu-mission__title">{task.title}</p>
        {task.why_this ? (
          <details className="stu-mission__why">
            <summary>Why this?</summary>
            <p>{task.why_this}</p>
          </details>
        ) : null}
        <p className="stu-mission__meta">
          <span>{task.minutes} min</span>
          {task.origin === 'weakness' ? (
            <span className="stu-chip stu-chip--accent stu-mission__tag">
              <RotateCcw size={11} strokeWidth={2.5} aria-hidden focusable="false" />
              Re-test
            </span>
          ) : null}
          {task.origin === 'carry_over' ? (
            <span className="stu-chip stu-chip--soft stu-mission__tag">Carried over</span>
          ) : null}
          {task.voice_required && !done ? (
            <span className="stu-chip stu-chip--soft stu-mission__tag">
              <Mic size={11} strokeWidth={2.5} aria-hidden focusable="false" />
              Needs a quiet spot
            </span>
          ) : null}
          {task.over_budget && !done ? (
            <span className="stu-chip stu-chip--soft stu-mission__tag">Over today’s time</span>
          ) : null}
          {task.pending_sync ? (
            <span className="stu-mission__pending" title="Saved on this device; will sync">
              saved offline
            </span>
          ) : null}
        </p>
      </div>

      {!done && isTool ? (
        <button
          type="button"
          className="stu-btn stu-btn--primary stu-mission__go"
          onClick={() => onStart?.(task)}
        >
          {task.kind === 'action' ? (
            <Sparkles size={15} strokeWidth={2} aria-hidden focusable="false" />
          ) : (
            <Play size={15} strokeWidth={2} aria-hidden focusable="false" />
          )}
          Start
        </button>
      ) : null}

      {!done && task.voice_required ? (
        <button
          type="button"
          className="stu-link-btn stu-mission__defer"
          onClick={() => onDefer?.(task, 'no_quiet_space')}
          title="Moves this to another day — it will come back, not disappear"
        >
          <MicOff size={13} strokeWidth={2} aria-hidden focusable="false" />
          Can’t talk now
        </button>
      ) : null}
    </li>
  );
}
