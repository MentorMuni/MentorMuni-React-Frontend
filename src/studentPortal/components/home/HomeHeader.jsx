import { ArrowRight, Check, Circle, Flame } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { MOTION, enterProps } from '../../motion';
import { bandHomeCopy } from '../../placementProfile';

/**
 * Page header: where the student is, and the one thing to do next.
 *
 * It used to carry a readiness figure and a checks-done counter as
 * well, which meant readiness appeared three times on one screen
 * (here, in the momentum row, and in the readiness ring). The score
 * now lives only in the readiness card; this header answers "where am
 * I in the journey" and nothing else.
 */

// Only phases we can drive from current plan state (Mocks/Ready need separate signals).
const PHASES = [
  { id: 'baseline', label: 'Assessment week' },
  { id: 'plan', label: 'Your plan' },
  { id: 'prep', label: 'Daily prep' },
];

function activePhaseIndex(weekStatus, planStatus) {
  if (planStatus === 'ready') return 2;
  if (weekStatus === 'done') return 1;
  return 0;
}

export default function HomeHeader({
  studentName = 'there',
  completedCount = 0,
  totalCount = 8,
  weekStatus = 'in_progress',
  planStatus,
  currentStep,
  onStart,
  onGenerate,
  generating = false,
  readiness = null,
  readinessBand: band = null,
  weakest = null,
  baselineSprintState = null,
}) {
  const reduce = useReducedMotion();
  const firstName = String(studentName || '').split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  const phaseIdx = activePhaseIndex(weekStatus, planStatus);
  const baselineDone = weekStatus === 'done';
  const planReady = planStatus === 'ready';
  const hasScore = readiness != null && Number(readiness) > 0;

  const personalizedLine =
    band && hasScore
      ? bandHomeCopy(band.key, { baselineDone, weakest, planReady })
      : null;

  const nextLine =
    personalizedLine ||
    (baselineDone
      ? planReady
        ? 'Your plan is ready. Finish today’s tasks and watch your readiness climb.'
        : planStatus === 'generating'
          ? 'We’re building your personalized plan from your assessment scores.'
          : 'All 8 assessment checks are complete. Generate your plan — every student gets a different roadmap from their strengths and gaps.'
      : baselineSprintState?.blockedUntilTomorrow
        ? `Day ${baselineSprintState.sprintDay} of 3 is complete. Tomorrow unlocks the next batch.`
        : currentStep
          ? `Next up: ${currentStep.title} — Day ${baselineSprintState?.sprintDay ?? 1} of 3.`
          : 'Start with the first baseline check to map your strengths and gaps.');

  const ctaLabel = baselineDone
    ? planStatus === 'ready'
      ? 'View your plan'
      : generating
        ? 'Generating…'
        : 'Generate personalized plan'
    : baselineSprintState?.blockedUntilTomorrow
      ? 'Back tomorrow'
      : currentStep
        ? `Start ${currentStep.title}`
        : 'Start baseline';

  const handleCta = () => {
    if (baselineDone && planStatus !== 'ready' && !generating) {
      onGenerate?.();
      return;
    }
    if (baselineDone && planStatus === 'ready') {
      document
        .getElementById('stu-journey-zone')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    // Primary action mirrors the today panel's Start button.
    if (currentStep) onStart?.(currentStep);
    else document.getElementById('stu-today-zone')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.section className="stu-hero" aria-labelledby="stu-hero-title" {...enterProps(reduce)}>
      <motion.span className="stu-hero__badge" {...enterProps(reduce, MOTION.stagger)}>
        <Flame size={14} strokeWidth={2} aria-hidden focusable="false" />
        Daily placement mission
      </motion.span>

      <motion.h1
        className="stu-hero__title"
        id="stu-hero-title"
        {...enterProps(reduce, MOTION.stagger * 1.5)}
      >
        Good {timeOfDay}, {firstName}
      </motion.h1>

      {band && hasScore ? (
        <motion.div className="stu-hero__band-row" {...enterProps(reduce, MOTION.stagger * 1.75)}>
          <span className={`stu-hero__band is-${band.key}`}>{band.label}</span>
          <span className="stu-hero__band-score">{Math.round(readiness)}% readiness</span>
        </motion.div>
      ) : null}

      <motion.p className="stu-hero__lead" {...enterProps(reduce, MOTION.stagger * 2)}>
        {nextLine}
      </motion.p>

      {/* A connected rail rather than five loose labels, so the five
          phases read as one journey with a position on it. */}
      <nav className="stu-hero__phases" aria-label="Your placement journey">
        {PHASES.map((phase, i) => {
          const done = i < phaseIdx;
          const active = i === phaseIdx;
          return (
            <span
              key={phase.id}
              className={`stu-hero__phase${done ? ' is-done' : ''}${active ? ' is-active' : ''}`}
              aria-current={active ? 'step' : undefined}
            >
              <span className="stu-hero__phase-icon" aria-hidden>
                {done ? (
                  <Check size={14} strokeWidth={2} />
                ) : (
                  <Circle size={active ? 10 : 8} strokeWidth={2} fill={active ? 'currentColor' : 'none'} />
                )}
              </span>
              <span className="stu-hero__phase-label">{phase.label}</span>
            </span>
          );
        })}
      </nav>

      <div className="stu-hero__actions">
        <motion.button
          type="button"
          className="stu-hero__cta"
          onClick={handleCta}
          disabled={generating || baselineSprintState?.blockedUntilTomorrow}
          {...enterProps(reduce, MOTION.stagger * 3)}
          whileHover={reduce || generating ? undefined : { y: -1 }}
          whileTap={reduce || generating ? undefined : { scale: 0.985 }}
          transition={{ duration: MOTION.duration.fast, ease: MOTION.ease }}
        >
          {ctaLabel}
          <ArrowRight size={16} strokeWidth={2} aria-hidden focusable="false" />
        </motion.button>

        {!baselineDone ? (
          <p className="stu-hero__note">
            {baselineSprintState?.blockedUntilTomorrow
              ? `Day ${baselineSprintState.sprintDay} of 3 done — next batch unlocks tomorrow.`
              : `Day ${baselineSprintState?.sprintDay ?? 1} of 3 · ${completedCount}/${totalCount} checks · finish today's batch before tomorrow.`}
          </p>
        ) : null}
      </div>
    </motion.section>
  );
}
