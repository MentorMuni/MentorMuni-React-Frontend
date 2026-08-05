import { Flame, CalendarClock, TrendingUp } from 'lucide-react';

/**
 * Small tiles, deliberately not full cards. Three things a student checks in
 * a glance before deciding whether to open anything:
 *   - is my streak safe today
 *   - how long until the drive
 *   - did last week actually move
 *
 * The streak used to live only in the sidebar, which buried the single
 * strongest reason to come back tomorrow.
 */
export default function QuickStats({
  streak = 18,
  streakSafeToday = false,
  dayDone = false,
  driveName = 'TCS NQT',
  daysToDrive = 14,
  weeklyGain = 8,
}) {
  return (
    <div className="stu-quick">
      <article className={`stu-tile stu-tile--streak${streakSafeToday ? ' is-safe' : ''}${dayDone ? ' is-done' : ''}`}>
        <span className="stu-tile__icon" aria-hidden>
          <Flame size={16} strokeWidth={2.2} />
        </span>
        <p className="stu-tile__value">
          {streak}
          <em>days</em>
        </p>
        <p className="stu-tile__label">
          {dayDone
            ? `Day ${streak + 1} unlocked — full plan done`
            : streakSafeToday
              ? 'Streak safe for today'
              : 'Finish one task to keep it'}
        </p>
        <span className="stu-tile__meter" aria-hidden>
          <span style={{ width: streakSafeToday ? '100%' : '0%' }} />
        </span>
      </article>

      <article className="stu-tile stu-tile--drive">
        <span className="stu-tile__icon" aria-hidden>
          <CalendarClock size={16} strokeWidth={2.2} />
        </span>
        <p className="stu-tile__value">
          {daysToDrive}
          <em>days</em>
        </p>
        <p className="stu-tile__label">{driveName} campus drive</p>
      </article>

      <article className="stu-tile stu-tile--gain">
        <span className="stu-tile__icon" aria-hidden>
          <TrendingUp size={16} strokeWidth={2.2} />
        </span>
        <p className="stu-tile__value">
          +{weeklyGain}
          <em>%</em>
        </p>
        <p className="stu-tile__label">Readiness gained last week</p>
      </article>
    </div>
  );
}
