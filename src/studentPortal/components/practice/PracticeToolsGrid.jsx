import { Clock, Lock, Play } from 'lucide-react';
import { ToolIcon } from '../../roadmap/toolIcons';
import { practiceUnlockLabel } from '../../practiceDailyLock';

export default function PracticeToolsGrid({ tools = [], usage = {}, onStart }) {
  const available = tools.filter((t) => !usage[t.tool_code]).length;

  return (
    <section className="stu-practice" aria-labelledby="stu-practice-title">
      <header className="stu-practice__head">
        <div>
          <h1 className="stu-practice__title" id="stu-practice-title">
            Practice
          </h1>
          <p className="stu-practice__sub">
            All placement tools, unlocked. Each one can be run once per day — finish it, then come
            back tomorrow.
          </p>
        </div>
        <p className="stu-practice__count">
          <strong>{available}</strong> / {tools.length} open today
        </p>
      </header>

      <ul className="stu-practice__grid">
        {tools.map((tool) => {
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
