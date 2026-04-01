import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  ClipboardCheck,
  Users,
  Mic2,
  Briefcase,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { goToStartAssessment } from '../utils/startAssessmentNavigation';
import { PRIMARY_CTA_LABEL } from '../constants/brandCopy';

const PHASES = [
  {
    step: '01',
    title: 'Measure where you stand',
    summary:
      'Take the free interview readiness check. You get a scored snapshot across the areas that matter for tech hiring—not a vague “you’re fine” or “practice more.”',
    outcomes: [
      'Category-level scores (e.g. problem-solving, projects, communication)',
      'Concrete gaps you can act on this week',
      'About five minutes · no signup · no payment',
    ],
    Icon: ClipboardCheck,
    accent: 'from-[#FF9500] to-[#FFB347]',
    borderAccent: 'border-[#FF9500]/45',
    iconBg: 'bg-[#FF9500]/15 text-[#CC7000]',
  },
  {
    step: '02',
    title: 'Get a plan that fits your profile',
    summary:
      'Mentorship is matched to your role, stack, and timeline—so guidance addresses what you actually need for the companies and rounds you’re targeting.',
    outcomes: [
      'Mentors with deep industry interview experience',
      'WhatsApp access for quick doubts between sessions',
      'Focus on your gaps, not a generic syllabus',
    ],
    Icon: Users,
    accent: 'from-[#FFB347] to-[#FF9500]',
    borderAccent: 'border-[#FFB347]/40',
    iconBg: 'bg-[#FFF4E0] text-[#CC7000]',
  },
  {
    step: '03',
    title: 'Practice how you will be evaluated',
    summary:
      'Technical skill on paper is not the same as explaining it under pressure. Structured practice—AI mock interviews and mentor feedback—closes that gap before a real panel.',
    outcomes: [
      'Mock interviews tuned to your level and role',
      'Actionable feedback on clarity, depth, and structure',
      'Stronger resume and “tell me about your project” stories',
    ],
    Icon: Mic2,
    accent: 'from-[#FFD580] to-[#FFB347]',
    borderAccent: 'border-[#FFB347]/40',
    iconBg: 'bg-[#FFF4E0] text-[#CC7000]',
  },
  {
    step: '04',
    title: 'Move from prep to offers',
    summary:
      'Support continues as you apply: how you present yourself, follow up, and evaluate options—so decisions are intentional, not rushed.',
    outcomes: [
      'Guidance through applications and interview rounds',
      'Help thinking through offers and negotiation basics',
      'You choose pace; we focus on outcomes that matter to you',
    ],
    Icon: Briefcase,
    accent: 'from-emerald-500 to-teal-500',
    borderAccent: 'border-emerald-500/40',
    iconBg: 'bg-emerald-500/15 text-emerald-300',
  },
];

/** Right-rail visual: mirrors homepage promise (check → mocks → mentors). */
const STORY_FLOW_RAIL = [
  {
    step: '01',
    Icon: ClipboardCheck,
    title: 'Readiness check',
    line: 'Baseline score & gaps—before a real round.',
    ring: 'from-[#FF9500] to-[#EA580C]',
    glow: 'rgba(234,88,12,0.2)',
  },
  {
    step: '02',
    Icon: Mic2,
    title: 'AI mock interviews',
    line: 'Practice aloud under pressure—not alone in your room.',
    ring: 'from-[#f59e0b] to-[#fbbf24]',
    glow: 'rgba(245,158,11,0.2)',
  },
  {
    step: '03',
    Icon: Users,
    title: 'Mentor-backed prep',
    line: 'Human guidance aligned to your role & timeline.',
    ring: 'from-[#0891b2] to-[#14b8a6]',
    glow: 'rgba(8,145,178,0.18)',
  },
];

function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function PhaseCard({ phase, index }) {
  const { Icon } = phase;
  return (
    <FadeUp delay={index * 0.06}>
      <article
        className={`relative h-full overflow-hidden rounded-2xl border border-[#F0ECE0] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-colors hover:border-[#FFB347] ${phase.borderAccent} border-t-2`}
      >
        <div
          className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${phase.accent} opacity-[0.07] blur-2xl`}
          aria-hidden
        />
        <div className="relative flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E0DCCF] ${phase.iconBg}`}
          >
            <Icon size={22} strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Phase {phase.step}</p>
            <h3 className="mt-1 text-lg font-bold leading-snug text-[#1A1A1A]">{phase.title}</h3>
          </div>
        </div>
        <p className="relative mt-4 text-sm leading-relaxed text-slate-400">{phase.summary}</p>
        <ul className="relative mt-4 space-y-2.5 border-t border-[#F0ECE0] pt-4">
          {phase.outcomes.map((line) => (
            <li key={line} className="flex gap-2.5 text-sm text-[#444444]">
              <Check size={16} className="mt-0.5 shrink-0 text-[#FF9500]" strokeWidth={2.5} />
              <span className="leading-snug">{line}</span>
            </li>
          ))}
        </ul>
      </article>
    </FadeUp>
  );
}

function HowItWorksStoryHero({ reduceMotion }) {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.12 });

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: reduceMotion
        ? { duration: 0 }
        : { staggerChildren: 0.11, delayChildren: 0.06 },
    },
  };

  const item = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduceMotion
        ? { duration: 0 }
        : { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden border-b border-[#F0ECE0] px-5 pb-20 pt-24 sm:px-6 md:pb-24 md:pt-28"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(180,120,60,0.07) 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}
        aria-hidden
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-20 h-[340px] w-[340px] rounded-full bg-[#FF9500]/[0.14] blur-[100px]"
        animate={reduceMotion ? undefined : { x: [0, 20, 0], y: [0, 12, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-[280px] w-[280px] rounded-full bg-cyan-400/[0.11] blur-[90px]"
        animate={reduceMotion ? undefined : { x: [0, -16, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[min(900px,100vw)] -translate-x-1/2 bg-gradient-to-b from-[#FF9500]/[0.10] to-transparent blur-[100px]"
        animate={reduceMotion ? undefined : { scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative mx-auto max-w-6xl"
        variants={container}
        initial="hidden"
        animate={heroInView ? 'visible' : 'hidden'}
      >
        <motion.div variants={item} className="mb-6 flex flex-col items-center text-center sm:mb-8">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-[#FF9500]/35 bg-white/80 px-4 py-2 shadow-[0_8px_30px_-12px_rgba(234,88,12,0.25)] backdrop-blur-sm"
            whileHover={reduceMotion ? undefined : { scale: 1.02, y: -1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          >
            <motion.span
              aria-hidden
              animate={reduceMotion ? undefined : { rotate: [0, 12, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles size={15} className="text-[#FF9500]" />
            </motion.span>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A3412] sm:text-xs">
              Our story · your prep
            </span>
          </motion.div>
        </motion.div>

        <motion.h1
          variants={item}
          className="mx-auto max-w-4xl text-center text-[1.65rem] font-black leading-[1.15] tracking-tight text-[#1A1A1A] sm:text-4xl md:text-[2.65rem] md:leading-[1.1]"
        >
          Don&apos;t let your{' '}
          <span className="bg-gradient-to-r from-[#FF9500] via-[#FFB347] to-[#ea580c] bg-clip-text text-transparent">
            first real panel
          </span>{' '}
          be your first mock
        </motion.h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <motion.div variants={item} className="space-y-5 lg:col-span-7">
            <motion.article
              className="relative overflow-hidden rounded-[1.35rem] border border-red-200/40 bg-gradient-to-br from-white via-white to-red-50/30 p-6 shadow-[0_20px_50px_-28px_rgba(220,38,38,0.12)] md:p-7"
              whileHover={reduceMotion ? undefined : { y: -3 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            >
              <div
                className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-red-500/[0.06] blur-3xl"
                aria-hidden
              />
              <span className="relative inline-flex rounded-md bg-red-500/[0.08] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-800">
                The problem
              </span>
              <h2 className="relative mt-4 text-xl font-black leading-[1.25] tracking-tight text-[#1A1A1A] md:text-2xl md:leading-[1.2]">
                For too many students, a real hiring panel was the first time they felt real interview pressure.
              </h2>
              <p className="relative mt-4 text-[15px] leading-[1.7] text-[#555555] md:text-base">
                We started MentorMuni after the same story, over and over: students walking into placement interviews with
                almost no serious mock practice—no baseline, no pressure rehearsal—then getting rejected without a clear map
                of what to fix. Hiring is tighter now; you don&apos;t get unlimited shots.
              </p>
            </motion.article>

            <motion.article
              className="relative overflow-hidden rounded-[1.35rem] border border-[#FFB347]/45 bg-gradient-to-br from-[#FFFCF7] via-white to-cyan-50/20 p-6 shadow-[0_24px_60px_-28px_rgba(234,88,12,0.2)] md:p-7"
              whileHover={reduceMotion ? undefined : { y: -3 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            >
              <div
                className="pointer-events-none absolute -left-12 bottom-0 h-36 w-36 rounded-full bg-[#FF9500]/[0.12] blur-3xl"
                aria-hidden
              />
              <span className="relative inline-flex rounded-md bg-[#FF9500]/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#9A3412]">
                What we built
              </span>
              <h2 className="relative mt-4 text-xl font-black leading-[1.25] tracking-tight text-[#1A1A1A] md:text-2xl md:leading-[1.2]">
                One flow—readiness check, AI mocks, mentor prep—before the rounds that actually count.
              </h2>
              <p className="relative mt-4 text-[15px] leading-[1.7] text-[#444444] md:text-base">
                You get a measured baseline, out-loud AI mocks, and mentor support when you want it—so you aren&apos;t
                improvising when the panel is real. Next: four phases from first check to structured prep—not guesswork.
              </p>
              <div className="relative mt-5 flex flex-wrap gap-2">
                {['Free check first', 'Mocks that feel real', 'Mentors when you want depth'].map((label) => (
                  <span
                    key={label}
                    className="rounded-lg border border-orange-200/70 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-[#7c2d12] shadow-sm"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </motion.article>
          </motion.div>

          <motion.aside variants={item} className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#888888] lg:text-left">
                The thread we follow
              </p>
              <div className="relative rounded-2xl border border-[#F0ECE0] bg-white/90 p-5 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.08)] backdrop-blur-sm md:p-6">
                <motion.div
                  className="absolute left-[1.35rem] top-14 bottom-14 w-px bg-gradient-to-b from-[#FF9500]/50 via-amber-200/90 to-cyan-400/40 md:left-[1.5rem]"
                  aria-hidden
                  initial={{ scaleY: reduceMotion ? 1 : 0 }}
                  animate={{ scaleY: 1 }}
                  style={{ transformOrigin: 'top center' }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.95,
                    ease: [0.22, 1, 0.36, 1],
                    delay: reduceMotion ? 0 : 0.35,
                  }}
                />
                <ul className="relative space-y-6">
                  {STORY_FLOW_RAIL.map((row, i) => {
                    const Icon = row.Icon;
                    return (
                      <motion.li
                        key={row.step}
                        className="flex gap-4 md:gap-5"
                        initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 18 }}
                        animate={
                          reduceMotion || heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 18 }
                        }
                        transition={{
                          duration: reduceMotion ? 0 : 0.45,
                          delay: reduceMotion ? 0 : 0.45 + i * 0.14,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <motion.div
                          className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${row.ring} text-white shadow-lg md:h-12 md:w-12`}
                          whileHover={reduceMotion ? undefined : { scale: 1.06 }}
                          transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                        >
                          <span
                            className="absolute inset-0 rounded-xl opacity-40 blur-md"
                            style={{ background: `radial-gradient(circle, ${row.glow}, transparent 70%)` }}
                            aria-hidden
                          />
                          <Icon className="relative shrink-0 drop-shadow-sm" size={20} strokeWidth={2} />
                        </motion.div>
                        <div className="min-w-0 pt-0.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#999999]">Step {row.step}</p>
                          <p className="mt-0.5 font-bold text-[#1A1A1A]">{row.title}</p>
                          <p className="mt-1 text-sm leading-snug text-[#666666]">{row.line}</p>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </section>
  );
}

export default function HowItWorks() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans text-[#1A1A1A]">
      <HowItWorksStoryHero reduceMotion={reduceMotion} />

      {/* Phases grid */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <FadeUp>
          <div className="mb-10 max-w-2xl">
            <h2 className="text-xl font-bold text-[#1A1A1A] md:text-2xl">What happens, in order</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#666666]">
              Start with the free readiness check today—know your gaps before you burn a real round. Add AI mocks and
              mentor support when you want hands-on guidance, so you walk in measured, practiced, and aligned—not
              hoping luck covers weak spots.
            </p>
          </div>
        </FadeUp>
        <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
          {PHASES.map((phase, i) => (
            <PhaseCard key={phase.step} phase={phase} index={i} />
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="border-t border-[#F0ECE0] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <FadeUp>
            <blockquote className="rounded-2xl border border-[#F0ECE0] bg-white p-8 md:p-10">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#FF9500]/90">Student feedback</p>
              <p className="mt-4 text-base leading-relaxed text-[#444444] md:text-lg">
                After the skill gap analysis I finally knew what to focus on. The mock interview feedback was specific—
                not generic advice—and changed how I structure answers under pressure.
              </p>
              <footer className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#F0ECE0] pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF9500]/30 text-sm font-bold text-[#CC7000]">
                  V
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">4th year · Engineering</p>
                </div>
              </footer>
            </blockquote>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#F0ECE0] bg-gradient-to-b from-[#FFF8EE] to-[#FFFDF8] px-6 py-16 md:py-20">
        <FadeUp>
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Start with the free readiness check</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#666666]">
              Get your score and prioritized gaps in minutes—no signup. Stack mocks and mentorship after that so your
              next interview isn&apos;t the first time you feel real pressure.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={goToStartAssessment}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all hover:bg-[#E88600] sm:w-auto"
              >
                {PRIMARY_CTA_LABEL}
                <ArrowRight size={16} />
              </button>
              <Link
                to="/waitlist"
                className="inline-flex w-full items-center justify-center rounded-xl border border-[#FF9500] px-7 py-3.5 text-sm font-semibold text-[#FF9500] transition-colors hover:bg-[#FFF4E0] sm:w-auto"
              >
                Join mentorship waitlist
              </Link>
            </div>
            <p className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <Check size={12} className="text-emerald-500" /> Free tier
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={12} className="text-emerald-500" /> ~5 minutes
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={12} className="text-emerald-500" /> No card
              </span>
            </p>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
