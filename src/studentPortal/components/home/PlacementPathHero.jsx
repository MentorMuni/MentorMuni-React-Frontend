import { ArrowRight, Check, Play } from 'lucide-react';

/**
 * The orientation surface. A student landing here for the first time could
 * previously read six cards and still not know what the platform was for or
 * how it gets them placed. This answers three things in one glance:
 *
 *   where am I   → the five-step path with the current step marked
 *   how far      → day counter and the stage they're in
 *   what now     → the single next action, with its time cost
 *
 * The path line draws itself once on load so the sequence reads as a journey
 * rather than five disconnected dots.
 */

const STEPS = [
  { id: 1, short: 'Profile', full: 'Profile & resume ready' },
  { id: 2, short: 'Baseline', full: 'Baseline tests done' },
  { id: 3, short: 'Build', full: 'Building weak skills' },
  { id: 4, short: 'Mocks', full: 'Interview practice' },
  { id: 5, short: 'Ready', full: 'Placement ready' },
];

export default function PlacementPathHero({
  currentStep = 3,
  day = 34,
  totalDays = 90,
  nextTask = { title: 'Resume fix: quantify your impact', minutes: 15, why: 'biggest score gain today' },
  onStart,
}) {
  const pct = Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100);
  const active = STEPS.find((s) => s.id === currentStep);

  return (
    <section className="stu-path" aria-labelledby="stu-path-title">
      <div className="stu-path__top">
        <div>
          <p className="stu-path__eyebrow">Your path to placement</p>
          <h2 className="stu-path__title" id="stu-path-title">
            You&rsquo;re in step {currentStep} of {STEPS.length} — {active?.full.toLowerCase()}.
          </h2>
        </div>
        <span className="stu-path__day">
          Day <strong>{day}</strong> of {totalDays}
        </span>
      </div>

      {/* the flow */}
      <ol className="stu-path__steps" style={{ '--progress': `${pct}%` }}>
        <span className="stu-path__rail" aria-hidden />
        <span className="stu-path__rail stu-path__rail--fill" aria-hidden />

        {STEPS.map((s) => {
          const done = s.id < currentStep;
          const here = s.id === currentStep;
          return (
            <li
              key={s.id}
              className={`stu-path__step${done ? ' is-done' : ''}${here ? ' is-here' : ''}`}
              style={{ '--d': `${s.id * 90}ms` }}
            >
              <span className="stu-path__dot">
                {done ? <Check size={13} strokeWidth={3} aria-hidden /> : s.id}
                {here ? <span className="stu-path__pulse" aria-hidden /> : null}
              </span>
              <span className="stu-path__label">{s.short}</span>
            </li>
          );
        })}
      </ol>

      {/* the one action */}
      <div className="stu-path__next">
        <span className="stu-path__next-tag">Do this next</span>
        <div className="stu-path__next-body">
          <p className="stu-path__next-title">{nextTask.title}</p>
          <p className="stu-path__next-meta">
            {nextTask.minutes} min · {nextTask.why}
          </p>
        </div>
        <button className="stu-path__next-cta" type="button" onClick={onStart}>
          <Play size={15} fill="currentColor" strokeWidth={2} aria-hidden />
          Start now
        </button>
      </div>

      <p className="stu-path__promise">
        Finish the daily plan and the score moves on its own. That is the whole method —
        no guessing what to study.
        <a href="/studentportal/roadmap">
          See the full 90-day roadmap
          <ArrowRight size={14} strokeWidth={2.2} aria-hidden />
        </a>
      </p>
    </section>
  );
}
