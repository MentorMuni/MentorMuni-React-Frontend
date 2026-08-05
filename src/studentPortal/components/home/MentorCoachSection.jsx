import { ArrowRight, Sparkles } from 'lucide-react';

const PICKS = [
  { title: 'Resume fix', meta: 'High impact · 15 min', tone: 'high' },
  { title: 'AI HR mock interview', meta: 'Fixes your blocker · 5 min', tone: 'high' },
  { title: 'Java Collections drill', meta: 'Keeps momentum · 15 min', tone: 'mid' },
];

export default function MentorCoachSection({ studentName = 'there' }) {
  const firstName = studentName.split(' ')[0];

  return (
    <section className="stu-card stu-coach">
      <header className="stu-card__head">
        <div className="stu-coach__id">
          <span className="stu-coach__avatar" aria-hidden>
            <Sparkles size={16} strokeWidth={2} />
          </span>
          <div>
            <h2 className="stu-card__title">MentorMuni Coach</h2>
            <p className="stu-card__sub">Personal tips · available 24/7</p>
          </div>
        </div>
      </header>

      <div className="stu-coach__bubble">
        <p className="stu-coach__line">
          {firstName}, you&apos;re improving consistently. Your Java score went up{' '}
          <strong>8%</strong> this week.
        </p>
        <p className="stu-coach__line stu-coach__line--muted">
          Biggest blocker right now: <strong>English communication</strong> at 38%. It&apos;s
          gating you on 4 of your 5 target companies.
        </p>
      </div>

      <p className="stu-coach__kicker">What I&apos;d do today</p>
      <ul className="stu-coach__picks">
        {PICKS.map((p) => (
          <li key={p.title} className="stu-coach__pick">
            <span className={`stu-coach__dot stu-coach__dot--${p.tone}`} aria-hidden />
            <span className="stu-coach__pick-text">
              <strong>{p.title}</strong>
              <em>{p.meta}</em>
            </span>
          </li>
        ))}
      </ul>

      <button className="stu-btn stu-btn--primary stu-btn--block">
        Chat with AI Mentor
        <ArrowRight size={16} strokeWidth={2} aria-hidden />
      </button>
    </section>
  );
}
