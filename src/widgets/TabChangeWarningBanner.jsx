import { AlertTriangle, X } from 'lucide-react';

/**
 * Shown when the user returns after switching browser tabs during a tool session.
 */
export default function TabChangeWarningBanner({
  warning,
  onDismiss,
  label = 'this assessment',
  className = '',
}) {
  if (!warning) return null;

  const times = warning.count;
  const repeatNote =
    times > 1 ? ` You have left this tab ${times} times.` : '';

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        'mm-tab-change-warning',
        'flex items-start gap-3 rounded-xl border border-amber-500/45 bg-warning-bg px-4 py-3 text-sm shadow-md',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <AlertTriangle
        className="mt-0.5 h-5 w-5 shrink-0 text-warning-text"
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="font-bold text-warning-ink-strong">Stay on this tab</p>
        <p className="mt-0.5 leading-snug text-warning-ink-deep">
          You switched away during {label}. Timers keep running and tab changes may
          affect your score integrity.{repeatNote}
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="mm-focus shrink-0 rounded-lg p-1.5 text-warning-ink-strong transition hover:bg-amber-500/15"
        aria-label="Dismiss tab switch warning"
      >
        <X size={18} aria-hidden />
      </button>
    </div>
  );
}
