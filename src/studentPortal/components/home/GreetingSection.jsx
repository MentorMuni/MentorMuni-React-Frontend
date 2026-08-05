import { Flame, TrendingUp } from 'lucide-react';

/**
 * A returning student's first question is not "what is this" — it is
 * "what happened since I left". Without that, the page looks identical
 * every visit and there is no felt reason to open it again tomorrow.
 */
export default function GreetingSection({
  studentName,
  /** Movement since the student's last visit, so the page acknowledges them. */
  lastVisit = { gain: 1.5, streak: 18, day: 'yesterday' },
}) {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  const firstName = studentName?.split(' ')[0] || 'there';

  return (
    <div className="stu-greet">
      <div>
        <h1 className="stu-greet__title">
          Good {timeOfDay}, {firstName}{' '}
          <span className="stu-greet__wave" aria-hidden>
            👋
          </span>
        </h1>

        <p className="stu-greet__since">
          {lastVisit.gain > 0 ? (
            <>
              <span className="stu-greet__pill stu-greet__pill--up">
                <TrendingUp size={13} strokeWidth={2.4} aria-hidden />
                +{lastVisit.gain}%
              </span>
              from {lastVisit.day}&rsquo;s tasks.
            </>
          ) : (
            <>Nothing logged {lastVisit.day} — an easy one today gets you moving.</>
          )}
          <span className="stu-greet__pill stu-greet__pill--streak">
            <Flame size={13} strokeWidth={2.4} aria-hidden />
            Day {lastVisit.streak}
          </span>
        </p>
      </div>

    </div>
  );
}
