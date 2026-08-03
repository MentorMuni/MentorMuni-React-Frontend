import { ArrowRight, Check } from 'lucide-react';

const STAGES = [
  { id: 1, title: 'Profile setup', window: 'Days 1–3', state: 'done' },
  { id: 2, title: 'Baseline tests', window: 'Days 4–10', state: 'done' },
  { id: 3, title: 'Resume ready', window: 'Days 11–20', state: 'done' },
  { id: 4, title: 'Skills building', window: 'Days 21–50', state: 'current' },
  { id: 5, title: 'Mock interviews', window: 'Days 51–75', state: 'next' },
  { id: 6, title: 'Placement ready', window: 'Days 76–90', state: 'next' },
];

export default function PlacementJourneySection() {
  const current = STAGES.find((s) => s.state === 'current');

  return (
    <section className="stu-card stu-journey">
      <header className="stu-card__head">
        <div>
          <h2 className="stu-card__title">Your 90-day journey</h2>
          <p className="stu-card__sub">Day 34 of 90 · on track</p>
        </div>
        <button className="stu-link-btn">
          Full roadmap <ArrowRight size={14} aria-hidden />
        </button>
      </header>

      <ol className="stu-steps">
        {STAGES.map((stage) => (
          <li key={stage.id} className={`stu-step is-${stage.state}`}>
            <span className="stu-step__rail" aria-hidden />
            <span className="stu-step__node" aria-hidden>
              {stage.state === 'done' ? (
                <Check size={13} strokeWidth={3} />
              ) : stage.state === 'current' ? (
                <span className="stu-step__pulse" />
              ) : (
                stage.id
              )}
            </span>
            <span className="stu-step__label">
              <strong>{stage.title}</strong>
              <em>{stage.window}</em>
            </span>
          </li>
        ))}
      </ol>

      {current ? (
        <div className="stu-journey__now">
          <div className="stu-journey__now-head">
            <span className="stu-chip stu-chip--accent">In progress</span>
            <span className="stu-journey__now-days">16 days left in this phase</span>
          </div>
          <h3>{current.title}</h3>
          <p>
            Build depth in DSA, core CS and communication. Two practice sets and one mock
            per week keeps you on pace for the mock-interview phase.
          </p>
          <button className="stu-btn stu-btn--soft">Open phase resources</button>
        </div>
      ) : null}
    </section>
  );
}
