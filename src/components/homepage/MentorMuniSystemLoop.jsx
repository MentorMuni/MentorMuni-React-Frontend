import React from 'react';
import { motion } from 'framer-motion';
import { Target, BarChart3, Users, Mic2, TrendingUp, ArrowRight } from 'lucide-react';
import { goToStartAssessment } from '../../utils/startAssessmentNavigation';

const STEPS = [
  {
    key: 'check',
    num: '01',
    label: 'CHECK',
    title: 'Skill & Interview Readiness Check',
    description: 'Free • 5 min • Instant score',
    Icon: Target,
    card: 'border-sky-200/80 bg-gradient-to-br from-sky-50/95 via-white to-sky-50/70',
    iconWrap: 'bg-gradient-to-br from-[#1A8FC4] to-[#15799F] shadow-[0_6px_20px_-4px_rgba(26,143,196,0.45)]',
    pill: 'bg-[#1A8FC4]',
  },
  {
    key: 'score',
    num: '02',
    label: 'SCORE',
    title: 'See Score & Exact Topic Gaps',
    description: 'Know exactly what to fix first',
    Icon: BarChart3,
    card: 'border-amber-200/80 bg-gradient-to-br from-amber-50/95 via-white to-orange-50/65',
    iconWrap: 'bg-gradient-to-br from-[#FF9500] to-[#E88600] shadow-[0_6px_20px_-4px_rgba(255,149,0,0.4)]',
    pill: 'bg-[#FF9500]',
  },
  {
    key: 'mentor',
    num: '03',
    label: 'MENTOR',
    title: '1:1 Mentorship Session',
    description: 'Personalized roadmap + confidence',
    Icon: Users,
    card: 'border-violet-200/80 bg-gradient-to-br from-violet-50/95 via-white to-purple-50/65',
    iconWrap: 'bg-gradient-to-br from-violet-600 to-purple-700 shadow-[0_6px_20px_-4px_rgba(124,58,237,0.35)]',
    pill: 'bg-violet-600',
  },
  {
    key: 'mock',
    num: '04',
    label: 'AI MOCK',
    title: 'AI Mock Interview + Voice Bot',
    description: 'Practice real interview answers',
    Icon: Mic2,
    card: 'border-emerald-200/80 bg-gradient-to-br from-emerald-50/95 via-white to-teal-50/65',
    iconWrap: 'bg-gradient-to-br from-emerald-600 to-teal-600 shadow-[0_6px_20px_-4px_rgba(16,185,129,0.35)]',
    pill: 'bg-emerald-600',
  },
  {
    key: 'repeat',
    num: '05',
    label: 'REPEAT',
    title: 'Improve Score & Repeat Loop',
    description: 'Track progress, level up weekly',
    Icon: TrendingUp,
    card: 'border-teal-200/80 bg-gradient-to-br from-teal-50/95 via-white to-cyan-50/70',
    iconWrap: 'bg-gradient-to-br from-[#0d9488] via-[#14b8a6] to-[#1A8FC4] shadow-[0_6px_20px_-4px_rgba(13,148,136,0.35)]',
    pill: 'bg-[#0d9488]',
  },
];

/** Light grey arrows between cards (matches reference). */
function ConnectorArrow({ className = '' }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center text-zinc-300 ${className}`}
      aria-hidden
    >
      <ArrowRight className="h-5 w-5" strokeWidth={1.75} />
    </div>
  );
}

/**
 * “The MentorMuni System” — five-step placement loop (homepage).
 * Step indices 01–05 sit at the card top-right in a subtle thin style (not beside the icon).
 */
export function MentorMuniSystemLoop({ reduceMotion }) {
  return (
    <section
      className="border-t border-border bg-[var(--bg-primary)] px-5 py-16 font-sans sm:px-6 lg:px-8 lg:py-20"
      aria-labelledby="mm-system-loop-heading"
    >
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center lg:mb-14"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1A8FC4] sm:text-xs sm:tracking-[0.26em]">
            THE MENTORMUNI SYSTEM
          </p>
          <h2
            id="mm-system-loop-heading"
            className="mt-3 text-balance text-2xl font-extrabold tracking-tight text-[#0f172a] sm:text-3xl md:text-[2rem] md:leading-tight lg:text-4xl"
          >
            One Proven Loop to Get Placed
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Not random prep. A clear system that repeats until you&apos;re ready.
          </p>
        </motion.div>

        <div className="flex flex-col gap-0 sm:flex-row sm:items-stretch sm:gap-0 sm:overflow-x-auto sm:overflow-y-visible sm:pb-4 sm:snap-x sm:snap-mandatory sm:[scrollbar-width:thin] lg:justify-center lg:overflow-visible lg:pb-0">
          {STEPS.map((step, index) => {
            const Icon = step.Icon;
            return (
              <React.Fragment key={step.key}>
                {index > 0 && (
                  <ConnectorArrow className="hidden min-h-[140px] w-6 shrink-0 sm:flex sm:items-center sm:self-center lg:w-8" />
                )}
                {index > 0 && (
                  <div className="flex justify-center py-2 sm:hidden" aria-hidden>
                    <ArrowRight className="h-5 w-5 rotate-90 text-zinc-300" strokeWidth={1.75} />
                  </div>
                )}
                <motion.article
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.45,
                    delay: reduceMotion ? 0 : index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`relative flex min-h-[220px] w-full shrink-0 flex-col rounded-2xl border px-5 pb-6 pt-6 shadow-[0_2px_24px_-12px_rgba(15,23,42,0.08)] sm:min-w-[232px] sm:max-w-[272px] sm:snap-center sm:px-5 sm:pb-6 md:min-w-[248px] lg:min-h-0 lg:max-w-none lg:min-w-0 lg:flex-1 lg:px-6 lg:pb-7 lg:pt-7 ${step.card}`}
                >
                  {/* Step index — top-right of card only; thin, subtle (matches mock) */}
                  <span
                    className="pointer-events-none absolute right-5 top-5 select-none text-[13px] font-light tabular-nums tracking-[0.1em] text-zinc-400 sm:right-5 sm:top-5 lg:right-6 lg:top-6"
                    aria-label={`Step ${step.num}`}
                  >
                    {step.num}
                  </span>

                  <div className="flex flex-col items-center">
                    <div
                      className={`mb-4 flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full text-white sm:h-16 sm:w-16 ${step.iconWrap}`}
                    >
                      <Icon className="h-[26px] w-[26px] sm:h-7 sm:w-7" strokeWidth={2} aria-hidden />
                    </div>

                    <span
                      className={`mb-3 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white sm:text-[11px] ${step.pill}`}
                    >
                      {step.label}
                    </span>

                    <h3 className="text-center text-[15px] font-bold leading-snug text-[#0f172a] sm:text-base">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-center text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                      {step.description}
                    </p>
                  </div>
                </motion.article>
              </React.Fragment>
            );
          })}
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.15 }}
          className="mt-12 flex justify-center sm:mt-14"
        >
          <button
            type="button"
            onClick={goToStartAssessment}
            className="inline-flex min-h-[52px] w-full max-w-md items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#15799F] via-[#1A8FC4] to-[#2AAA8A] px-8 py-3.5 text-base font-bold text-white shadow-[0_8px_28px_-6px_rgba(26,143,196,0.45)] transition hover:brightness-[1.03] active:scale-[0.99] sm:w-auto"
          >
            Start Step 1 — Free
            <ArrowRight className="h-5 w-5" aria-hidden />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
