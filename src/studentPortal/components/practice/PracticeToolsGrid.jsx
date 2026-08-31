import { Clock, Lock, Play, Target } from 'lucide-react';
import { ToolIcon } from '../../roadmap/toolIcons';
import { practiceUnlockLabel } from '../../practiceDailyLock';

function ToolCard({ tool, locked, onStart, primary = false }) {
  return (
    <li
      className={`stu-practice__gap-card${primary ? ' is-primary' : ''}${locked ? ' is-locked' : ''}`}
    >
      {primary ? <p className="stu-practice__gap-label">Recommended for you</p> : null}
      <div className="stu-practice__card-top">
        <span className="stu-practice__icon" aria-hidden>
          <ToolIcon toolCode={tool.tool_code} size={18} strokeWidth={2} />
        </span>
        {locked ? (
          <span className="stu-practice__badge is-done">
            <Lock size={12} strokeWidth={2.4} aria-hidden />
            Done today
          </span>
        ) : (
          <span className="stu-practice__badge">
            <Clock size={12} strokeWidth={2.4} aria-hidden />
            {tool.minutes} min
          </span>
        )}
      </div>
      <h3 className="stu-practice__card-title">{tool.title}</h3>
      <p className="stu-practice__card-blurb">{tool.blurb}</p>
      {locked ? (
        <p className="stu-practice__lock-note">{practiceUnlockLabel()}</p>
      ) : (
        <button
          type="button"
          className="stu-btn stu-btn--soft stu-practice__cta"
          onClick={() => onStart?.(tool)}
        >
          <Play size={14} fill="currentColor" strokeWidth={2} aria-hidden />
          Start
        </button>
      )}
    </li>
  );
}

export default function PracticeToolsGrid({
  tools = [],
  usage = {},
  onStart,
  gapTools = [],
  gapLabel = '',
}) {
  const available = tools.filter((t) => !usage[t.tool_code]).length;
  const gapCodes = new Set((gapTools || []).map((t) => t.tool_code));
  const catalogTools = tools.filter((t) => !gapCodes.has(t.tool_code));

  const showGap = gapTools.length > 0 && gapLabel;

  return (
    <section className="stu-practice" aria-labelledby="stu-practice-title">
      <header className="stu-practice__head">
        <div>
          <h1 className="stu-practice__title" id="stu-practice-title">
            Practice
          </h1>
          <p className="stu-practice__sub">
            Tools sized to your gaps first, then the full catalog. Each runs once per day.
          </p>
        </div>
        <p className="stu-practice__count">
          <strong>{available}</strong> / {tools.length} open today
        </p>
      </header>

      {showGap ? (
        <div className="stu-practice__gap">
          <div className="stu-practice__gap-head">
            <h2 className="stu-practice__gap-title">
              <Target size={16} style={{ display: 'inline', verticalAlign: '-2px' }} /> Fix my
              gap
            </h2>
            <p className="stu-practice__gap-sub">
              Your baseline flagged <strong>{gapLabel}</strong> — start here before general practice.
            </p>
          </div>
          <ul className="stu-practice__gap-grid">
            {gapTools.map((tool, i) => (
              <ToolCard
                key={tool.tool_code}
                tool={tool}
                locked={Boolean(usage[tool.tool_code])}
                onStart={onStart}
                primary={i === 0}
              />
            ))}
          </ul>
        </div>
      ) : null}

      <h2 className="stu-practice__all-title">All practice tools</h2>

      <ul className="stu-practice__grid">
        {catalogTools.map((tool) => {
          const locked = Boolean(usage[tool.tool_code]);
          return (
            <li
              key={tool.tool_code}
              className={`stu-practice__card${locked ? ' is-locked' : ''}`}
            >
              <div className="stu-practice__card-top">
                <span className="stu-practice__icon" aria-hidden>
                  <ToolIcon toolCode={tool.tool_code} size={18} strokeWidth={2} />
                </span>
                {locked ? (
                  <span className="stu-practice__badge is-done">
                    <Lock size={12} strokeWidth={2.4} aria-hidden />
                    Done today
                  </span>
                ) : (
                  <span className="stu-practice__badge">
                    <Clock size={12} strokeWidth={2.4} aria-hidden />
                    {tool.minutes} min
                  </span>
                )}
              </div>

              <h2 className="stu-practice__card-title">{tool.title}</h2>
              <p className="stu-practice__card-blurb">{tool.blurb}</p>

              {locked ? (
                <p className="stu-practice__lock-note">{practiceUnlockLabel()}</p>
              ) : (
                <button
                  type="button"
                  className="stu-btn stu-btn--soft stu-practice__cta"
                  onClick={() => onStart?.(tool)}
                >
                  <Play size={14} fill="currentColor" strokeWidth={2} aria-hidden />
                  Start
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
