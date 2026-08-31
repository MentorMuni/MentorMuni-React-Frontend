import { CalendarClock, Flame, Timer } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { MOTION, enterProps } from '../../motion';

/**
 * Three honest counters, all from data we actually hold.
 *
 * The third card used to repeat readiness, which the ring already
 * shows. It now reports practice minutes this week — a different
 * fact, derived from the same local streak store.
 */
export default function MomentumRow({
  consecutiveDays = 0,
  sessionsToday = 0,
  practicedToday = false,
  weekSessions = 0,
  dayDone = false,
  daysToDrive = null,
  baselineProgress = 0,
  baselineTotal = 8,
  sprintDay = null,
  sprintBlocked = false,
}) {
  const reduce = useReducedMotion();
  const baselinePct = baselineTotal ? Math.round((baselineProgress / baselineTotal) * 100) : 0;
  const streakSafe = practicedToday || sessionsToday > 0;
  const checksLeft = Math.max(0, baselineTotal - baselineProgress);

  const cards = [
    {
      key: 'streak',
      icon: Flame,
      title: 'Day streak',
      value: `${consecutiveDays}`,
      suffix: consecutiveDays === 1 ? 'day' : 'days',
      note: streakSafe
        ? sessionsToday > 1
          ? `${sessionsToday} sessions today — streak safe.`
          : 'You practiced today. Streak is safe.'
        : consecutiveDays > 0
          ? 'Start today’s step or the streak resets tomorrow.'
          : 'Start today’s step to begin a streak.',
      meter: streakSafe ? 100 : consecutiveDays > 0 ? 35 : 8,
      tone: streakSafe ? 'hot' : consecutiveDays > 0 ? 'mid' : 'neutral',
    },
    dayDone
      ? {
          key: 'drive',
          icon: CalendarClock,
          title: daysToDrive != null ? 'Next drive' : 'Plan horizon',
          value: daysToDrive != null ? `${Math.max(0, daysToDrive)}` : '90',
          suffix: 'days',
          note:
            daysToDrive != null
              ? 'Keep the daily plan running until drive day.'
              : 'No drive posted yet — stay on your personalized plan.',
          meter: 100,
          tone: 'good',
        }
      : {
          key: 'baseline',
          icon: CalendarClock,
          title: 'Baseline left',
          value: `${checksLeft}`,
          suffix: checksLeft === 1 ? 'check' : 'checks',
          note: sprintBlocked
            ? `Day ${sprintDay} batch done — more checks unlock tomorrow.`
            : `Day ${sprintDay ?? 1} of 3 · ${baselinePct}% done · ${checksLeft} check${checksLeft === 1 ? '' : 's'} left in the sprint.`,
          meter: Math.max(8, baselinePct),
          tone: baselinePct >= 100 ? 'good' : 'neutral',
        },
    {
      key: 'week',
      icon: Timer,
      title: 'Sessions this week',
      value: `${weekSessions}`,
      suffix: weekSessions === 1 ? 'day' : 'days',
      note:
        weekSessions >= 5
          ? 'Strong week. This is the pace that moves readiness.'
          : weekSessions > 0
            ? `${7 - weekSessions} more days this week to make it a full one.`
            : 'No sessions logged this week yet.',
      meter: Math.max(6, Math.round((weekSessions / 7) * 100)),
      tone: weekSessions >= 5 ? 'good' : weekSessions > 0 ? 'mid' : 'neutral',
    },
  ];

  return (
    <section className="stu-momentum" aria-label="Your momentum">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.article
            key={card.key}
            className={`stu-momentum__card is-${card.tone}`}
            {...enterProps(reduce, MOTION.stagger * (index + 1))}
            whileHover={
              reduce
                ? undefined
                : { y: -2, transition: { duration: MOTION.duration.fast, ease: MOTION.ease } }
            }
          >
            <header className="stu-momentum__head">
              <span className="stu-momentum__icon" aria-hidden>
                <Icon size={16} strokeWidth={2} focusable="false" />
              </span>
              <h3>{card.title}</h3>
            </header>

            <p className="stu-momentum__value">
              {card.value}
              {card.suffix ? <em>{card.suffix}</em> : null}
            </p>

            <p className="stu-momentum__note">{card.note}</p>

            <div className="stu-momentum__meter" aria-hidden>
              <motion.span
                initial={reduce ? false : { width: 0 }}
                animate={{ width: `${card.meter}%` }}
                transition={{
                  delay: 0.18 + index * MOTION.stagger,
                  duration: MOTION.duration.meter,
                  ease: MOTION.easeOut,
                }}
              />
            </div>
          </motion.article>
        );
      })}
    </section>
  );
}
