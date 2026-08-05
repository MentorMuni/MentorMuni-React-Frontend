import { ArrowRight, Code2, Mic, Zap } from 'lucide-react';

const EVENTS = [
  { id: 1, icon: Zap, title: 'Aptitude full test', when: 'Tomorrow · 10:00 AM', days: 1, urgent: true },
  { id: 2, icon: Mic, title: 'AI mock interview — HR', when: 'Fri · 2:00 PM', days: 4 },
  { id: 3, icon: Code2, title: 'TCS NQT campus drive', when: 'Dec 20 · 9:00 AM', days: 14 },
];

export default function UpcomingSection() {
  return (
    <section className="stu-card stu-up">
      <header className="stu-card__head">
        <div>
          <h2 className="stu-card__title">Coming up</h2>
          <p className="stu-card__sub">Tests &amp; drives in the next 14 days</p>
        </div>
        <button className="stu-link-btn">
          Calendar <ArrowRight size={16} strokeWidth={2} aria-hidden />
        </button>
      </header>

      <ul className="stu-up__list">
        {EVENTS.map((e) => {
          const Icon = e.icon;
          return (
            <li key={e.id} className={`stu-up__row${e.urgent ? ' is-urgent' : ''}`}>
              <span className="stu-up__icon" aria-hidden>
                <Icon size={16} strokeWidth={2} />
              </span>
              <span className="stu-up__text">
                <strong>{e.title}</strong>
                <em>{e.when}</em>
              </span>
              <span className="stu-up__count">
                <strong>{e.days}</strong>
                <em>{e.days === 1 ? 'day' : 'days'}</em>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
