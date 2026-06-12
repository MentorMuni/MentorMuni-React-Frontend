import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { BarChart3, Target, Mic2 } from 'lucide-react';
import { HERO_AWARENESS_ARIA, HERO_AWARENESS_STEPS } from '../../constants/brandCopy';
import { HERO_EASE } from './heroMotion';

const STEP_ICONS = {
  score: BarChart3,
  gaps: Target,
  practice: Mic2,
};

const STEP_MS = 2200;

/**
 * 5-second awareness strip — cycles Score → Gaps → Practice (what MentorMuni is / does).
 */
export function HeroAwarenessLoop({ newUI = false }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const steps = HERO_AWARENESS_STEPS;

  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = window.setInterval(() => {
      setActive((index) => (index + 1) % steps.length);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, steps.length]);

  const progress = ((active + 1) / steps.length) * 100;

  return (
    <div
      className={`mm-hero-awareness${newUI ? ' mm-hero-awareness--dark' : ''}`}
      role="group"
      aria-label={HERO_AWARENESS_ARIA}
    >
      <ol className="mm-hero-awareness__steps">
        {steps.map((step, index) => {
          const Icon = STEP_ICONS[step.id] ?? BarChart3;
          const isActive = index === active;
          const isPast = index < active;

          return (
            <li
              key={step.id}
              data-step={step.id}
              className={`mm-hero-awareness__step${isActive ? ' is-active' : ''}${isPast ? ' is-past' : ''}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="mm-hero-awareness__icon" aria-hidden>
                <Icon size={16} strokeWidth={2.5} />
              </span>
              <span className="mm-hero-awareness__label">{step.label}</span>
            </li>
          );
        })}
      </ol>

      <div className="mm-hero-awareness__rail" aria-hidden>
        <motion.span
          className="mm-hero-awareness__rail-fill"
          animate={{ width: `${progress}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: HERO_EASE }}
        />
      </div>

      <div className="mm-hero-awareness__hint-wrap" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={steps[active].id}
            className="mm-hero-awareness__hint"
            initial={reduceMotion ? false : { opacity: 0, y: 6, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: HERO_EASE }}
          >
            {steps[active].hint}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
