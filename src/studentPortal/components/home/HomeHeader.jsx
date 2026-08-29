import { ArrowRight, Check, Circle, Flame } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { MOTION, enterProps } from '../../motion';

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
  { id: 'baseline', label: 'Baseline' },
  { id: 'plan', label: '90-day plan' },
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
}) {
  const reduce = useReducedMotion();
  const firstName = String(studentName || '').split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  const phaseIdx = activePhaseIndex(weekStatus, planStatus);
  const baselineDone = weekStatus === 'done';

  const nextLine = baselineDone
    ? planStatus === 'ready'
      ? 'Your plan is ready. Finish today’s tasks and watch your readiness climb.'
      : planStatus === 'generating'
        ? 'We’re building your 90-day plan from your baseline scores.'
        : 'All 8 baseline checks are complete. Generate your plan and begin your 90-day sprint.'
      : currentStep
        ? `Next up: ${currentStep.title} — about ${currentStep.minutes} minutes. Finishing it unlocks the step after.`
        : 'Start with the first baseline check to map your strengths and gaps.';

  const ctaLabel = baselineDone
    ? planStatus === 'ready'
      ? 'View 90-day plan'
      : generating
        ? 'Generating…'
        : 'Generate 90-day plan'
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
          disabled={generating}
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
            {completedCount} of {totalCount} baseline checks done · one unlocks at a time · every
            result sharpens your 90-day plan
          </p>
        ) : null}
      </div>
    </motion.section>
  );
}
