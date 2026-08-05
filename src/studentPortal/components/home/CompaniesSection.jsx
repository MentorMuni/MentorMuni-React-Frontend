import { ArrowRight, Target } from 'lucide-react';

const COMPANIES = [
  { id: 1, name: 'TCS', score: 82, role: 'Ninja / Digital' },
  { id: 2, name: 'Infosys', score: 80, role: 'Systems Engineer' },
  { id: 3, name: 'Accenture', score: 71, role: 'ASE' },
  { id: 4, name: 'Wipro', score: 65, role: 'Project Engineer' },
  { id: 5, name: 'Amazon', score: 28, role: 'SDE-1' },
];

function tier(score) {
  if (score >= 80) return { key: 'ready', label: 'Ready' };
  if (score >= 70) return { key: 'almost', label: 'Almost' };
  if (score >= 50) return { key: 'practice', label: 'Practice' };
  return { key: 'gap', label: 'Needs work' };
}

export default function CompaniesSection() {
  return (
    <section className="stu-card stu-companies">
      <header className="stu-card__head">
        <div>
          <h2 className="stu-card__title">Companies you can crack</h2>
          <p className="stu-card__sub">Based on your readiness vs campus drives</p>
        </div>
        <button className="stu-link-btn">
          View all <ArrowRight size={16} strokeWidth={2} aria-hidden />
        </button>
      </header>

      <ul className="stu-co__list">
        {COMPANIES.map((c, i) => {
          const t = tier(c.score);
          return (
            <li key={c.id} className="stu-co">
              <span className="stu-co__mark" aria-hidden>
                {c.name.slice(0, 2).toUpperCase()}
              </span>

              <span className="stu-co__id">
                <strong>{c.name}</strong>
                <em>{c.role}</em>
              </span>

              {/* Width is declared, not animated in JS, so the bar is correct
                  even if the grow animation never runs. */}
              <span className="stu-co__bar" aria-hidden>
                <span
                  className="stu-co__fill"
                  data-tier={t.key}
                  style={{ width: `${c.score}%`, animationDelay: `${i * 60}ms` }}
                />
              </span>

              <span className="stu-co__score">{c.score}%</span>
              <span className={`stu-tier stu-tier--${t.key}`}>{t.label}</span>
            </li>
          );
        })}
      </ul>

      <button className="stu-nudge">
        <span className="stu-nudge__icon" aria-hidden>
          <Target size={16} strokeWidth={2} />
        </span>
        <span className="stu-nudge__text">
          <strong>Focus on aptitude &amp; communication</strong>
          <em>Unlocks eligibility for 90%+ of your campus drives</em>
        </span>
        <ArrowRight size={16} strokeWidth={2} aria-hidden />
      </button>
    </section>
  );
}
