import { CheckCircle2, Clock, Mic, TrendingUp } from 'lucide-react';

export default function ProgressMetricsSection({
  readinessImproved = 8,
  testsCompleted = 12,
  practiceHours = 14.5,
  mockInterviews = 4,
}) {
  const metrics = [
    { key: 'lift', icon: TrendingUp, label: 'Readiness gained', value: `+${readinessImproved}%`, delta: '+3 vs last week', up: true },
    { key: 'tests', icon: CheckCircle2, label: 'Tests completed', value: testsCompleted, delta: '+3 vs last week', up: true },
    { key: 'hours', icon: Clock, label: 'Practice time', value: `${practiceHours}h`, delta: '+2.5h vs last week', up: true },
    { key: 'mocks', icon: Mic, label: 'Mock interviews', value: mockInterviews, delta: '+1 vs last week', up: true },
  ];

  return (
    <section className="stu-card stu-metrics">
      <header className="stu-card__head">
        <div>
          <h2 className="stu-card__title">Your week</h2>
          <p className="stu-card__sub">Progress since Monday · resets next week</p>
        </div>
      </header>

      <div className="stu-metrics__grid">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.key} className={`stu-metric stu-metric--${m.key}`}>
              <span className="stu-metric__icon" aria-hidden>
                <Icon size={16} strokeWidth={2} />
              </span>
              <p className="stu-metric__label">{m.label}</p>
              <p className="stu-metric__value">{m.value}</p>
              <p className={`stu-metric__delta${m.up ? ' is-up' : ''}`}>{m.delta}</p>
            </div>
          );
        })}
      </div>

      <p className="stu-metrics__note">
        <span aria-hidden>⭐</span> You solved 38 aptitude questions this week — your most
        consistent week yet.
      </p>
    </section>
  );
}
