import { Clock } from 'lucide-react';
import { TIME_BUDGETS, BUDGET_LABELS } from '../../daily/timeBudget';

/**
 * "How long have you got today?"
 *
 * The generated plan writes 60–90 minute days. A student on a lab day has ten,
 * and a 90-minute card is how you lose them. The mission is built to whatever
 * they pick, so ten minutes is a complete win rather than a truncated one.
 */
export default function TimeBudgetPicker({ value, onChange, disabled = false }) {
  return (
    <div className="stu-mission__budget">
      <span className="stu-mission__budget-label">
        <Clock size={13} strokeWidth={2} aria-hidden focusable="false" />
        Time today
      </span>
      <div className="stu-mission__budget-chips" role="group" aria-label="Time available today">
        {TIME_BUDGETS.map((minutes) => (
          <button
            key={minutes}
            type="button"
            disabled={disabled}
            aria-pressed={value === minutes}
            title={BUDGET_LABELS[minutes]}
            className={`stu-chip stu-mission__budget-chip${value === minutes ? ' is-on' : ''}`}
            onClick={() => onChange?.(minutes)}
          >
            {minutes}m
          </button>
        ))}
      </div>
    </div>
  );
}
