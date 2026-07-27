import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { STUDENT_JOURNEY_STAGES, RECOGNITION } from '../../constants/studentJourneyStages';

const ease = [0.22, 1, 0.36, 1];

export default function RecognitionSection({ reduceMotion }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [activeId, setActiveId] = useState(STUDENT_JOURNEY_STAGES[0].id);
  const active = STUDENT_JOURNEY_STAGES.find((s) => s.id === activeId) || STUDENT_JOURNEY_STAGES[0];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-border bg-background py-20 md:py-28"
    >
      <div className="mm-container">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55, ease }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            {RECOGNITION.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            {RECOGNITION.headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {RECOGNITION.sub}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Student-voice list */}
          <motion.ul
            className="space-y-2 lg:col-span-5"
            initial={reduceMotion ? false : { opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, delay: 0.08, ease }}
          >
            {STUDENT_JOURNEY_STAGES.map((stage, i) => {
              const isActive = stage.id === activeId;
              return (
                <li key={stage.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(stage.id)}
                    onMouseEnter={() => !reduceMotion && setActiveId(stage.id)}
                    className={`why-mm-recog-item why-mm-surface w-full rounded-xl px-4 py-3.5 text-left transition-all duration-300 ${
                      isActive
                        ? 'shadow-[0_12px_36px_-18px_rgba(26,143,196,0.35)] ring-1 ring-primary/25'
                        : 'opacity-90'
                    }`}
                    aria-pressed={isActive}
                  >
                    <span className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${
                          isActive
                            ? 'bg-gradient-to-br from-primary to-brand-teal text-white'
                            : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>
                        <span
                          className={`block text-sm font-semibold leading-snug md:text-[15px] ${
                            isActive ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          “{stage.studentVoice}”
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>

          {/* Active relief panel */}
          <motion.div
            className="relative lg:col-span-7"
            initial={reduceMotion ? false : { opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, delay: 0.12, ease }}
          >
            <div className="why-mm-recog-panel why-mm-surface sticky top-28 overflow-hidden rounded-2xl border border-border p-7 md:p-9">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
                aria-hidden
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease }}
                  className="relative space-y-6"
                >
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cta">
                      The worry
                    </p>
                    <h3 className="mt-2 text-2xl font-extrabold leading-snug tracking-tight text-foreground md:text-3xl">
                      {active.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                      {active.painPoint}
                    </p>
                  </div>

                  <div className="border-t border-border pt-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-teal">
                      How it gets resolved
                    </p>
                    <p className="mt-2 text-base font-medium leading-relaxed text-foreground md:text-lg">
                      {active.solution}
                    </p>
                    <p className="mt-4 text-sm text-muted-foreground">
                      You leave with:{' '}
                      <span className="font-semibold text-foreground">{active.primaryOutcome}</span>
                      <span className="mx-2 text-border">·</span>
                      <span>{active.duration}</span>
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
