import { fearWeightLabel } from '../knowMe/planUtils';

export default function FearFactorMeter({
  current,
  initial,
  compact = false,
  daysRemaining = null,
  lockDays = 15,
}) {
  const now = Number.isFinite(Number(current)) ? Math.max(0, Math.min(10, Number(current))) : null;
  const start = Number.isFinite(Number(initial)) ? Math.max(0, Math.min(10, Number(initial))) : now;
  if (now == null) return null;
  const pct = (now / 10) * 100;
  const dropped = start != null && start > now;

  return (
    <div className={`ftf-meter${compact ? ' ftf-meter--compact' : ''}`}>
      <div className="ftf-meter__top">
        <p className="ftf-meter__kicker">Fear factor</p>
        <p className="ftf-meter__score">
          <strong>{now}</strong>
          <span>/ 10</span>
        </p>
      </div>
      <div className="ftf-meter__track" aria-hidden>
        <div
          className={`ftf-meter__fill${now === 0 ? ' is-zero' : now <= 3 ? ' is-low' : now <= 6 ? ' is-mid' : ' is-high'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="ftf-meter__caption">
        {now === 0
          ? 'Fearless on this plan. Keep the reps until your next check-in window.'
          : dropped
            ? `Started at ${start}/10 · ${fearWeightLabel(now)}. Do the suggested mocks to take this to 0.`
            : `${fearWeightLabel(now)}. Work the plan — each suggested mock lowers this toward 0.`}
      </p>
      {daysRemaining != null && daysRemaining > 0 ? (
        <p className="ftf-meter__lock">
          Stay with this plan for {daysRemaining} more day{daysRemaining === 1 ? '' : 's'} of {lockDays}.
        </p>
      ) : null}
    </div>
  );
}
