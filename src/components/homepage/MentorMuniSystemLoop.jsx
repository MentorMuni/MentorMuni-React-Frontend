import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Target, BarChart3, Users, Mic2, TrendingUp, ArrowRight } from 'lucide-react';
import { goToStartAssessment } from '../../utils/startAssessmentNavigation';

const STEPS = [
  {
    key: 'check',
    num: '01',
    label: 'CHECK',
    title: 'Scored readiness check (~5 min)',
    description: 'Free • 5 min • Instant score',
    Icon: Target,
    card: 'border-sky-200/70 bg-gradient-to-br from-sky-50/90 via-white to-white',
    iconWrap: 'bg-gradient-to-br from-[#1A8FC4] to-[#15799F] shadow-[0_6px_18px_-6px_rgba(26,143,196,0.55)]',
    pill: 'bg-[#1A8FC4]',
    glow: 'bg-sky-400/25',
    ring: 'ring-[#1A8FC4]/55',
  },
  {
    key: 'score',
    num: '02',
    label: 'SCORE',
    title: 'See Score & Exact Topic Gaps',
    description: 'Know exactly what to fix first',
    Icon: BarChart3,
    card: 'border-amber-200/70 bg-gradient-to-br from-amber-50/85 via-white to-white',
    iconWrap: 'bg-gradient-to-br from-[#FF9500] to-[#E88600] shadow-[0_6px_18px_-6px_rgba(255,149,0,0.45)]',
    pill: 'bg-[#FF9500]',
    glow: 'bg-amber-400/25',
    ring: 'ring-[#FF9500]/50',
  },
  {
    key: 'mentor',
    num: '03',
    label: 'MENTOR',
    title: '1:1 Mentorship Session',
    description: 'Personalized roadmap + confidence',
    Icon: Users,
    card: 'border-violet-200/70 bg-gradient-to-br from-violet-50/85 via-white to-white',
    iconWrap: 'bg-gradient-to-br from-violet-600 to-purple-700 shadow-[0_6px_18px_-6px_rgba(124,58,237,0.4)]',
    pill: 'bg-violet-600',
    glow: 'bg-violet-400/25',
    ring: 'ring-violet-500/50',
  },
  {
    key: 'mock',
    num: '04',
    label: 'AI MOCK',
    title: 'AI Mock Interview + Voice Bot',
    description: 'Practice real interview answers',
    Icon: Mic2,
    card: 'border-emerald-200/70 bg-gradient-to-br from-emerald-50/85 via-white to-white',
    iconWrap: 'bg-gradient-to-br from-emerald-600 to-teal-600 shadow-[0_6px_18px_-6px_rgba(16,185,129,0.4)]',
    pill: 'bg-emerald-600',
    glow: 'bg-emerald-400/22',
    ring: 'ring-emerald-500/50',
  },
  {
    key: 'repeat',
    num: '05',
    label: 'REPEAT',
    title: 'Improve Score & Repeat Loop',
    description: 'Track progress, level up weekly',
    Icon: TrendingUp,
    card: 'border-teal-200/70 bg-gradient-to-br from-teal-50/85 via-white to-white',
    iconWrap: 'bg-gradient-to-br from-[#0d9488] via-[#14b8a6] to-[#1A8FC4] shadow-[0_6px_18px_-6px_rgba(13,148,136,0.4)]',
    pill: 'bg-[#0d9488]',
    glow: 'bg-teal-400/22',
    ring: 'ring-teal-500/50',
  },
];

const LOOP_CYCLE_MS = 3200;
const STEP_COUNT = STEPS.length;

const springHover = { type: 'spring', stiffness: 520, damping: 38, mass: 0.65 };

function headerVariants(reduceMotion) {
  if (reduceMotion) {
    return {
      container: {
        hidden: {},
        visible: { transition: { staggerChildren: 0 } },
      },
      item: {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
      },
    };
  }
  return {
    container: {
      hidden: {},
      visible: { transition: { staggerChildren: 0.11, delayChildren: 0.04 } },
    },
    item: {
      hidden: { opacity: 1, y: 14, filter: 'none' },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
      },
    },
  };
}

function satelliteVariants(reduceMotion) {
  if (reduceMotion) {
    return {
      hidden: { opacity: 1, scale: 1 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    };
  }
  return {
    hidden: { opacity: 1, scale: 0.94 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.09,
        duration: 0.48,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };
}

/** True circles behind satellites — dash travels around the ring */
function CircularOrbitRings({ reduceMotion }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="mm-orbit-outer" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#1A8FC4" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#2AAA8A" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#1A8FC4" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="mm-orbit-inner" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#1A8FC4" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#2AAA8A" stopOpacity="0.32" />
        </linearGradient>
      </defs>
      {!reduceMotion ? (
        <>
          <motion.circle
            cx="120"
            cy="120"
            r="102"
            stroke="url(#mm-orbit-outer)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeDasharray="8 14"
            animate={{ strokeDashoffset: [0, -220] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.circle
            cx="120"
            cy="120"
            r="94"
            stroke="url(#mm-orbit-inner)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="5 12"
            animate={{ strokeDashoffset: [0, 180] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          />
        </>
      ) : (
        <>
          <circle cx="120" cy="120" r="102" stroke="url(#mm-orbit-outer)" strokeWidth="1.25" strokeOpacity="0.35" />
          <circle cx="120" cy="120" r="94" stroke="url(#mm-orbit-inner)" strokeWidth="1" strokeOpacity="0.28" />
        </>
      )}
    </svg>
  );
}

function angleDegForStep(index) {
  return -90 + index * (360 / STEP_COUNT);
}

/**
 * MentorMuni System — five compact satellites on a circular orbit + center hub.
 */
export function MentorMuniSystemLoop({ reduceMotion: reduceMotionProp }) {
  const prefersReduced = useReducedMotion();
  const reduceMotion = Boolean(reduceMotionProp ?? prefersReduced);
  const hv = headerVariants(reduceMotion);
  const sv = satelliteVariants(reduceMotion);

  const loopRef = useRef(null);
  const loopInView = useInView(loopRef, { amount: 0.12, once: false });
  const [activeLoopIndex, setActiveLoopIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || !loopInView) return;
    const id = window.setInterval(() => {
      setActiveLoopIndex((i) => (i + 1) % STEP_COUNT);
    }, LOOP_CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, loopInView]);

  return (
    <section
      className="relative overflow-hidden border-t border-border bg-[var(--bg-primary)] px-5 py-16 font-sans sm:px-6 lg:px-8 lg:py-20"
      aria-labelledby="mm-system-loop-heading"
    >
      {!reduceMotion && (
        <>
          <div
            className="pointer-events-none absolute -left-[10%] top-0 h-[420px] w-[420px] rounded-full bg-[#1A8FC4]/[0.07] blur-[120px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-[8%] bottom-[-20%] h-[380px] w-[380px] rounded-full bg-[#2AAA8A]/[0.06] blur-[110px]"
            aria-hidden
          />
        </>
      )}

      <div className="relative mx-auto max-w-[1400px]">
        <motion.div
          variants={hv.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05, margin: '0px 0px 14% 0px' }}
          style={{ opacity: 1 }}
          className="mb-10 text-center sm:mb-12"
        >
          <motion.p
            variants={hv.item}
            className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#1A8FC4] sm:text-xs"
          >
            THE MENTORMUNI SYSTEM
          </motion.p>
          <motion.h2
            variants={hv.item}
            id="mm-system-loop-heading"
            className="mx-auto mt-3 max-w-[22ch] text-balance bg-gradient-to-br from-[#0f172a] via-[#0f172a] to-[#334155] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl md:text-[2rem] md:leading-[1.15] lg:text-4xl"
          >
            One Proven Loop to Get Placed
          </motion.h2>
          <motion.p
            variants={hv.item}
            className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            Not random prep. A clear system that repeats until you&apos;re ready.
          </motion.p>
        </motion.div>

        {/* Circular orbit: CSS variable drives polar placement */}
        <div
          ref={loopRef}
          className="relative mx-auto aspect-square w-full max-w-[min(92vw,440px)] sm:max-w-[480px] lg:max-w-[520px]"
          style={{
            '--orbit-r': 'clamp(112px, 31vmin, 184px)',
            '--tile-w': 'clamp(104px, 29vmin, 122px)',
          }}
        >
          <CircularOrbitRings reduceMotion={reduceMotion} />

          {/* Satellites — polar transform on static wrapper so Framer scale doesn’t clobber orbit */}
          {STEPS.map((step, index) => {
            const Icon = step.Icon;
            const isLoopActive = !reduceMotion && activeLoopIndex === index;
            const angleDeg = angleDegForStep(index);

            return (
              <div
                key={step.key}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: 'var(--tile-w)',
                  transform: `translate(-50%, -50%) rotate(${angleDeg}deg) translateY(calc(-1 * var(--orbit-r))) rotate(${-angleDeg}deg)`,
                  transformOrigin: 'center center',
                  zIndex: isLoopActive ? 15 : 10,
                }}
              >
                <motion.article
                  custom={index}
                  variants={sv}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.04, margin: '0px 0px 18% 0px' }}
                  style={{ opacity: 1 }}
                  whileHover={reduceMotion ? undefined : { scale: 1.045 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                  animate={
                    reduceMotion
                      ? {}
                      : {
                          scale: isLoopActive ? 1.07 : 1,
                        }
                  }
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className={`group relative flex min-h-0 w-full flex-col rounded-xl border px-2.5 pb-3 pt-3 shadow-[0_6px_24px_-14px_rgba(15,23,42,0.14)] ring-2 ring-offset-2 ring-offset-[var(--bg-primary)] backdrop-blur-[2px] transition-shadow duration-300 ${step.card} ${isLoopActive ? `${step.ring} shadow-[0_18px_46px_-16px_rgba(26,143,196,0.42)]` : 'ring-transparent'}`}
                >
                  {!reduceMotion && (
                    <div
                      className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl ${step.glow} ${isLoopActive ? 'opacity-75' : 'opacity-0'} transition-opacity duration-500 group-hover:opacity-80`}
                      aria-hidden
                    />
                  )}

                  <span
                    className={`pointer-events-none absolute right-2 top-2 tabular-nums text-[9px] tracking-[0.12em] ${isLoopActive ? 'font-semibold text-[#15799F]' : 'font-normal text-zinc-400'}`}
                    aria-label={`Step ${step.num}`}
                  >
                    {step.num}
                  </span>

                  <div className="relative flex flex-col items-center gap-1">
                    <div
                      className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white ${step.iconWrap}`}
                    >
                      {!reduceMotion && isLoopActive && (
                        <span className="pointer-events-none absolute inset-[-2px] rounded-lg ring-2 ring-white/55" />
                      )}
                      <Icon className="relative h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
                    </div>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-white shadow-sm ${step.pill}`}
                    >
                      {step.label}
                    </span>

                    <h3 className="line-clamp-2 text-center text-[10px] font-bold leading-snug text-[#0f172a] sm:text-[11px]">
                      {step.title}
                    </h3>
                    <p className="line-clamp-2 text-center text-[9px] leading-snug text-muted-foreground sm:text-[10px]">
                      {step.description}
                    </p>
                  </div>

                  {!reduceMotion && (
                    <div
                      className={`pointer-events-none absolute inset-x-2 bottom-0 h-px bg-gradient-to-r from-transparent to-transparent transition-opacity duration-500 ${isLoopActive ? 'via-[#1A8FC4]/48 opacity-100' : 'via-[#1A8FC4]/22 opacity-0 group-hover:opacity-100'}`}
                      aria-hidden
                    />
                  )}
                </motion.article>
              </div>
            );
          })}
        </div>

        <motion.div
          initial={false}
          whileInView={{ y: [12, 0] }}
          viewport={{ once: true, amount: 0.05, margin: '0px 0px 12% 0px' }}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ opacity: 1 }}
          className="mt-12 flex justify-center sm:mt-14"
        >
          <motion.button
            type="button"
            onClick={goToStartAssessment}
            whileHover={reduceMotion ? undefined : { scale: 1.02, boxShadow: '0 14px 40px -12px rgba(26,143,196,0.5)' }}
            whileTap={reduceMotion ? undefined : { scale: 0.985 }}
            transition={springHover}
            className="inline-flex min-h-[52px] w-full max-w-md items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#15799F] via-[#1A8FC4] to-[#2AAA8A] px-8 py-3.5 text-base font-bold text-white shadow-[0_10px_34px_-10px_rgba(26,143,196,0.48)] transition-[filter] hover:brightness-[1.04] active:brightness-[0.98] sm:w-auto"
          >
            Start Step 1 — Free
            <ArrowRight className="h-5 w-5" aria-hidden />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
