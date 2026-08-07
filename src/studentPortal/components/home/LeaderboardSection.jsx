import EmptyState from './EmptyState';

/**
 * Peer standing — locked.
 *
 * There is no ranking endpoint. The student API exposes dashboard,
 * roadmap (+analysis/generate/plan/progress) and upcoming-drives, and
 * nothing else. This section used to fill the gap with three invented
 * leaderboards containing a hardcoded student called "Rahul Verma",
 * shown to every user as though it were their own cohort.
 *
 * A locked state that says why is more useful than a convincing lie,
 * and it keeps the slot for when the endpoint lands.
 */

const TABS = ['Department', 'College', 'Friends'];

export default function LeaderboardSection() {
  return (
    <section className="stu-card stu-lb">
      <header className="stu-card__head">
        <div>
          <h2 className="stu-card__title">Peer standing</h2>
          <p className="stu-card__sub">How your batch is tracking against the placement bar</p>
        </div>
      </header>

      <div className="stu-tabs" role="tablist" aria-label="Leaderboard scope">
        {TABS.map((label, i) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={i === 0}
            className={`stu-tabs__tab${i === 0 ? ' is-active' : ''}`}
            disabled
          >
            <span className="stu-tabs__label">{label}</span>
          </button>
        ))}
      </div>

      <EmptyState art="leaderboard" title="Rankings unlock soon">
        Once enough students in your batch finish their baseline, you&rsquo;ll see where you sit —
        and how many have cleared the 85% placement bar.
      </EmptyState>
    </section>
  );
}
