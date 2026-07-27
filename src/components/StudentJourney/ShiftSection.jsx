import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SHIFT_SECTION, WHY_PAGE } from '../../constants/studentJourneyStages';
import { goToStartAssessment } from '../../utils/startAssessmentNavigation';

const ease = [0.22, 1, 0.36, 1];

export default function ShiftSection({ reduceMotion }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-y border-border bg-gradient-to-br from-background via-secondary/40 to-background py-20 md:py-28"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[min(720px,90vw)] -translate-x-1/2 bg-primary/10 blur-[100px]"
        animate={reduceMotion ? undefined : { opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mm-container relative">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, ease }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            {SHIFT_SECTION.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            {SHIFT_SECTION.headline}
          </h2>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2 md:gap-8">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, delay: 0.08, ease }}
            className="rounded-2xl border border-border/80 bg-white/60 p-7 backdrop-blur-sm md:p-8"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {SHIFT_SECTION.before.label}
            </p>
            <ul className="mt-5 space-y-3.5">
              {SHIFT_SECTION.before.lines.map((line) => (
                <li key={line} className="flex gap-3 text-[15px] leading-snug text-muted-foreground">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400"
                    aria-hidden
                  />
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, delay: 0.16, ease }}
            className="rounded-2xl border border-primary/25 bg-gradient-to-br from-white to-accent-soft/60 p-7 shadow-[0_20px_50px_-28px_rgba(26,143,196,0.35)] md:p-8"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-teal">
              {SHIFT_SECTION.after.label}
            </p>
            <ul className="mt-5 space-y-3.5">
              {SHIFT_SECTION.after.lines.map((line) => (
                <li key={line} className="flex gap-3 text-[15px] font-medium leading-snug text-foreground">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-primary to-brand-teal"
                    aria-hidden
                  />
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.22, ease }}
          className="mt-12 flex justify-center"
        >
          <motion.button
            type="button"
            onClick={goToStartAssessment}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-brand-teal px-8 py-3.5 text-base font-bold text-white shadow-[0_12px_36px_-12px_rgba(26,143,196,0.45)]"
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            {WHY_PAGE.primaryCta}
            <ArrowRight size={17} aria-hidden />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
