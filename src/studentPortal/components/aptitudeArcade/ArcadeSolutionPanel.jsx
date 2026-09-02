import { ArrowRight } from 'lucide-react';

/**
 * Sticky solution / feedback panel — stays until user clicks Next.
 * Fixes buttons blinking from auto-advance timeouts.
 */
export default function ArcadeSolutionPanel({
  open,
  ok,
  title,
  solution,
  rule,
  answerLabel,
  onContinue,
  continueLabel = 'Next question',
}) {
  if (!open) return null;

  return (
    <div
      className={`aa-solution-panel${ok ? ' aa-solution-panel--ok' : ' aa-solution-panel--bad'}`}
      role="status"
      aria-live="polite"
    >
      <p className="aa-solution-panel__title">{title}</p>
      {answerLabel && (
        <p className="aa-solution-panel__answer">
          <strong>Answer:</strong> {answerLabel}
        </p>
      )}
      {solution && <p className="aa-solution-panel__body">{solution}</p>}
      {rule && (
        <p className="aa-solution-panel__rule">
          <strong>How to solve:</strong> {rule}
        </p>
      )}
      <button type="button" className="aa-btn aa-btn--primary aa-solution-panel__next" onClick={onContinue}>
        {continueLabel} <ArrowRight size={16} aria-hidden />
      </button>
    </div>
  );
}
