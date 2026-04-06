import { motion, useReducedMotion } from 'framer-motion';
import { Timer, Gauge, Gift } from 'lucide-react';
import {
  HERO_PROOF_FACTS,
  HERO_PROOF_PILLARS,
  HERO_PROOF_SECTION_EYEBROW,
  HERO_PROOF_STAT,
} from '../../constants/brandCopy';

const FACT_ICONS = {
  timer: Timer,
  gauge: Gauge,
  gift: Gift,
};

/**
 * Compact hero proof: one row of pillar chips + one row of facts — dense, scannable, low vertical weight.
 */
export function HeroProofSpec({ className = '' }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`w-full ${className}`}>
      <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {HERO_PROOF_SECTION_EYEBROW}
      </p>

      <motion.div
        className="mt-2.5 overflow-hidden rounded-xl border border-border bg-card shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)]"
        aria-label={HERO_PROOF_STAT}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Row 1 — pillars as chips (the meaningful “what”) */}
        <div className="flex flex-col items-center gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-center sm:gap-3 sm:px-3.5 sm:py-2">
          <span className="shrink-0 text-xs font-semibold text-muted-foreground">Scored</span>
          <div className="flex min-w-0 flex-wrap justify-center gap-1.5">
            {HERO_PROOF_PILLARS.map((pillar, i) => (
              <motion.span
                key={pillar}
                className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-foreground ring-1 ring-border"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: reduceMotion ? 0 : 0.04 + i * 0.035,
                  type: 'spring',
                  stiffness: 500,
                  damping: 28,
                }}
              >
                {pillar}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="h-px bg-border" aria-hidden />

        {/* Row 2 — logistics in one scan (no duplicate fluff) */}
        <div className="flex flex-col items-center gap-2.5 px-3 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-5 sm:gap-y-1 sm:px-3.5 sm:py-2">
          {HERO_PROOF_FACTS.map((fact) => {
            const Icon = FACT_ICONS[fact.icon] ?? Timer;
            return (
              <div key={fact.text} className="flex items-center gap-1.5">
                <Icon
                  className="h-3.5 w-3.5 shrink-0 text-primary opacity-90"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="text-xs leading-snug text-muted-foreground sm:text-sm">{fact.text}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
