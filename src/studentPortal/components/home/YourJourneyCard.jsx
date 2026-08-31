import { Check, ChevronRight, Lock, Sparkles, Target, CalendarDays } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { BASELINE_SPRINT_PLAN } from '../../baselineAdaptive';
import { SPRINT_MAX_ORDER_BY_DAY } from '../../baselineSprint';
import { ASSESSMENT_WEEK_DAYS } from '../../journeyPlan';
import { MOTION, enterProps } from '../../motion';

const ASSESSMENT_DAY_RANGES = [
  { day: 1, from: 1, to: SPRINT_MAX_ORDER_BY_DAY[1] },
  { day: 2, from: 4, to: SPRINT_MAX_ORDER_BY_DAY[2] },
  { day: 3, from: 7, to: SPRINT_MAX_ORDER_BY_DAY[3] },
];

function phaseState(id, { onboardingDone, baselineDone, planReady }) {
  if (id === 'onboarding') {
    if (!onboardingDone) return 'current';
    return 'done';
  }
  if (id === 'assessment') {
    if (!onboardingDone) return 'locked';
    if (baselineDone) return 'done';
    return 'current';
  }
  if (id === 'plan') {
    if (!baselineDone) return 'locked';
    if (planReady) return 'done';
    return 'current';
  }
  return 'locked';
}

function timingForDay(dayNum, sprintState) {
  const sprintDay = sprintState?.sprintDay ?? 1;
  if (dayNum < sprintDay) return { key: 'past', label: `Day ${dayNum} · done` };
  if (dayNum === sprintDay) {
    if (sprintState?.blockedUntilTomorrow) {
      return { key: 'today-done', label: 'Today · complete' };
    }
    return { key: 'today', label: 'Today' };
  }
  if (dayNum === sprintDay + 1) {
    if (sprintState?.blockedUntilTomorrow || sprintDay < dayNum) {
      return { key: 'tomorrow', label: 'Tomorrow' };
    }
  }
  if (dayNum === sprintDay + 2) return { key: 'later', label: 'Day 3' };
  return { key: 'later', label: `Day ${dayNum}` };
}

/**
 * Visual map: onboarding → assessment week (by calendar day) → personalized plan.
 */
export default function YourJourneyCard({
  onboardingDone = false,
  steps = [],
  sprintState = null,
  baselineDone = false,
  planReady = false,
  planGenerating = false,
  planHorizonDays = 38,
}) {
  const reduce = useReducedMotion();
  const sprintDay = sprintState?.sprintDay ?? 1;

  const phases = [
    {
      id: 'onboarding',
      icon: Sparkles,
      title: 'Onboarding',
      sub: onboardingDone ? 'Profile saved' : 'Target companies & time budget',
      meta: '~2 min',
      state: phaseState('onboarding', { onboardingDone, baselineDone, planReady }),
    },
    {
      id: 'assessment',
      icon: Target,
      title: 'Assessment week',
      sub: baselineDone
        ? 'All 8 checks complete'
        : `Day ${Math.min(sprintDay, ASSESSMENT_WEEK_DAYS)} of ${ASSESSMENT_WEEK_DAYS} · calendar sprint`,
      meta: '3 days · 8 checks',
      state: phaseState('assessment', { onboardingDone, baselineDone, planReady }),
    },
    {
      id: 'plan',
      icon: CalendarDays,
      title: 'Your plan',
      sub: planReady
        ? 'Daily tasks from your gaps'
        : baselineDone
          ? planGenerating
            ? 'Building your roadmap…'
            : 'Generate after assessment'
          : `Unlocks after assessment · ${planHorizonDays} days`,
      meta: planReady ? `${planHorizonDays} days` : `${planHorizonDays} days personalized`,
      state: phaseState('plan', { onboardingDone, baselineDone, planReady }),
    },
  ];

  const showAssessmentDays = onboardingDone && !baselineDone;

  return (
    <motion.section
      className="stu-card stu-journey"
      aria-labelledby="stu-journey-title"
      {...enterProps(reduce, MOTION.stagger)}
    >
      <header className="stu-card__head">
        <div>
          <h2 className="stu-card__title" id="stu-journey-title">
            Your journey
          </h2>
          <p className="stu-card__sub">
            Three phases — what you do now, what unlocks tomorrow, and what comes after.
          </p>
        </div>
      </header>

      <ol className="stu-journey__phases" aria-label="Placement journey phases">
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          return (
            <li
              key={phase.id}
              className={`stu-journey__phase is-${phase.state}`}
            >
              <span className="stu-journey__phase-icon" aria-hidden>
                {phase.state === 'done' ? (
                  <Check size={16} strokeWidth={2.5} />
                ) : (
                  <Icon size={16} strokeWidth={2} />
                )}
              </span>
              <div className="stu-journey__phase-body">
                <p className="stu-journey__phase-title">{phase.title}</p>
                <p className="stu-journey__phase-sub">{phase.sub}</p>
                <p className="stu-journey__phase-meta">{phase.meta}</p>
              </div>
              {index < phases.length - 1 ? (
                <ChevronRight className="stu-journey__phase-arrow" size={14} aria-hidden />
              ) : null}
            </li>
          );
        })}
      </ol>

      {showAssessmentDays ? (
        <div className="stu-journey__days">
          <p className="stu-journey__days-kicker">Assessment week — by calendar day</p>
          <ul className="stu-journey__day-list">
            {ASSESSMENT_DAY_RANGES.map(({ day, from, to }) => {
              const plan = BASELINE_SPRINT_PLAN[day - 1];
              const daySteps = steps.filter((s) => s.order >= from && s.order <= to);
              const allDone = daySteps.length > 0 && daySteps.every((s) => s.status === 'done');
              const timing = timingForDay(day, sprintState);
              const isToday = timing.key === 'today' || timing.key === 'today-done';
              const isTomorrow = timing.key === 'tomorrow';

              return (
                <li
                  key={day}
                  className={`stu-journey__day${isToday ? ' is-today' : ''}${isTomorrow ? ' is-tomorrow' : ''}${allDone ? ' is-done' : ''}${timing.key === 'past' || allDone ? ' is-past' : ''}`}
                >
                  <div className="stu-journey__day-head">
                    <span className={`stu-journey__day-badge is-${timing.key}`}>{timing.label}</span>
                    <span className="stu-journey__day-range">
                      Checks {from}–{to}
                    </span>
                  </div>
                  <p className="stu-journey__day-label">{plan?.label}</p>
                  <ul className="stu-journey__checks" aria-label={`Day ${day} checks`}>
                    {daySteps.map((s) => (
                      <li
                        key={s.tool_code}
                        className={`stu-journey__check is-${s.status}`}
                        title={s.title}
                      >
                        {s.status === 'done' ? (
                          <Check size={11} strokeWidth={3} aria-hidden />
                        ) : s.status === 'locked' ? (
                          <Lock size={10} strokeWidth={2.5} aria-hidden />
                        ) : (
                          <span className="stu-journey__check-dot" aria-hidden />
                        )}
                        <span>{s.title}</span>
                      </li>
                    ))}
                  </ul>
                  {isTomorrow && !allDone ? (
                    <p className="stu-journey__day-note">
                      Unlocks tomorrow morning — finish today&apos;s batch first.
                    </p>
                  ) : null}
                  {isToday && sprintState?.blockedUntilTomorrow ? (
                    <p className="stu-journey__day-note is-highlight">
                      Today&apos;s batch is done. Come back tomorrow for Day {day + 1}.
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {baselineDone && !planReady ? (
        <p className="stu-journey__foot">
          Assessment complete — generate your <strong>{planHorizonDays}-day</strong> personalized
          plan. Your TPO and HOD already see your scores on their dashboard.
        </p>
      ) : null}

      {planReady ? (
        <p className="stu-journey__foot">
          You&apos;re on your <strong>{planHorizonDays}-day</strong> plan — daily tasks below are
          picked from your strengths and gaps.
        </p>
      ) : null}
    </motion.section>
  );
}
