import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import * as Icons from 'lucide-react';
import { STUDENT_JOURNEY_STAGES, RELIEF_SECTION } from '../../constants/studentJourneyStages';

const ease = [0.22, 1, 0.36, 1];

const accentMap = {
  sky: 'from-sky-400/20 to-primary/10 border-sky-200/60',
  amber: 'from-amber-400/15 to-orange-400/10 border-amber-200/60',
  teal: 'from-teal-400/15 to-brand-teal/10 border-teal-200/60',
  emerald: 'from-emerald-400/15 to-teal-400/10 border-emerald-200/60',
  rose: 'from-rose-400/15 to-orange-400/10 border-rose-200/50',
  cyan: 'from-cyan-400/15 to-primary/10 border-cyan-200/60',
};

export default function StudentJourneyTimeline({ reduceMotion }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative overflow-hidden bg-background py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--pattern-dot-cool) 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}
        aria-hidden
      />

      <div className="mm-container relative">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, ease }}
          className="mx-auto mb-14 max-w-2xl text-center md:mb-16"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            {RELIEF_SECTION.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            {RELIEF_SECTION.headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {RELIEF_SECTION.sub}
          </p>
        </motion.div>

        <ol className="relative mx-auto max-w-3xl space-y-0">
          {/* Vertical spine */}
          <div
            className="pointer-events-none absolute left-[19px] top-3 bottom-3 hidden w-px bg-gradient-to-b from-primary/40 via-brand-teal/50 to-primary/20 sm:block md:left-[23px]"
            aria-hidden
          />

          {STUDENT_JOURNEY_STAGES.map((stage, index) => {
            const Icon = Icons[stage.icon] || Icons.Circle;
            const accent = accentMap[stage.accent] || accentMap.sky;

            return (
              <motion.li
                key={stage.id}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : index * 0.04, ease }}
                className="relative flex gap-5 pb-10 last:pb-0 md:gap-7"
              >
                <div className="relative z-10 flex shrink-0 flex-col items-center">
                  <motion.div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border bg-gradient-to-br md:h-12 md:w-12 ${accent}`}
                    whileHover={reduceMotion ? undefined : { scale: 1.06 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  >
                    <Icon size={20} className="text-primary" strokeWidth={1.75} />
                  </motion.div>
                </div>

                <div className="min-w-0 flex-1 pt-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Worry {String(stage.step).padStart(2, '0')}
                  </p>
                  <h3 className="mt-1.5 text-lg font-bold leading-snug text-foreground md:text-xl">
                    {stage.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                    <span className="font-medium text-foreground/80">You feel: </span>
                    {stage.painPoint}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-foreground md:text-[15px]">
                    <span className="font-semibold text-brand-teal">Resolved by: </span>
                    {stage.solution}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
