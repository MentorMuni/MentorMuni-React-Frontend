import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
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
    accent: 'from-indigo-500 to-violet-500',
    borderAccent: 'border-indigo-500/40',
    iconBg: 'bg-indigo-500/15 text-indigo-300',
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
    accent: 'from-violet-500 to-fuchsia-500',
    borderAccent: 'border-violet-500/40',
    iconBg: 'bg-violet-500/15 text-violet-300',
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
    accent: 'from-fuchsia-500 to-pink-500',
    borderAccent: 'border-fuchsia-500/40',
    iconBg: 'bg-fuchsia-500/15 text-fuchsia-300',
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
        className={`relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f1a30] p-6 shadow-lg shadow-black/20 transition-colors hover:border-white/[0.12] ${phase.borderAccent} border-t-2`}
      >
        <div
          className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${phase.accent} opacity-[0.07] blur-2xl`}
          aria-hidden
        />
        <div className="relative flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 ${phase.iconBg}`}
          >
            <Icon size={22} strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Phase {phase.step}</p>
            <h3 className="mt-1 text-lg font-bold leading-snug text-white">{phase.title}</h3>
          </div>
        </div>
        <p className="relative mt-4 text-sm leading-relaxed text-slate-400">{phase.summary}</p>
        <ul className="relative mt-4 space-y-2.5 border-t border-white/[0.06] pt-4">
          {phase.outcomes.map((line) => (
            <li key={line} className="flex gap-2.5 text-sm text-slate-300">
              <Check size={16} className="mt-0.5 shrink-0 text-indigo-400" strokeWidth={2.5} />
              <span className="leading-snug">{line}</span>
            </li>
          ))}
        </ul>
      </article>
    </FadeUp>
  );
}

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#050b18] font-sans text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06] px-6 pb-16 pt-24 md:pt-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[800px] -translate-x-1/2 bg-indigo-600/[0.12] blur-[120px]" aria-hidden />
        <div className="relative mx-auto max-w-3xl text-center">
          <FadeUp>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-4 py-1.5">
              <Sparkles size={14} className="text-indigo-400" />
              <span className="text-xs font-semibold tracking-wide text-indigo-200/90">How MentorMuni works</span>
            </div>
            <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl md:leading-[1.12]">
              A clear path from{' '}
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                first assessment
              </span>{' '}
              to interview-ready
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400">
              Four phases, one thread: understand your gaps, get aligned support, practice realistically, then take
              that prep into applications—with structure instead of guesswork.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Phases grid */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <FadeUp>
          <div className="mb-10 max-w-2xl">
            <h2 className="text-xl font-bold text-white md:text-2xl">What happens, in order</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              You can start with the free check today. Mentorship and deeper practice are there when you want hands-on
              guidance—not a one-size-fits-all course.
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
      <section className="border-t border-white/[0.06] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <FadeUp>
            <blockquote className="rounded-2xl border border-white/[0.08] bg-[#0f1a30] p-8 md:p-10">
              <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-400/90">Student feedback</p>
              <p className="mt-4 text-base leading-relaxed text-slate-300 md:text-lg">
                After the skill gap analysis I finally knew what to focus on. The mock interview feedback was specific—
                not generic advice—and changed how I structure answers under pressure.
              </p>
              <footer className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600/30 text-sm font-bold text-indigo-200">
                  V
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">4th year · Engineering</p>
                </div>
              </footer>
            </blockquote>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-indigo-500/15 bg-gradient-to-b from-indigo-950/30 to-[#050b18] px-6 py-16 md:py-20">
        <FadeUp>
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-2xl font-bold text-white">Start with the free assessment</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              See your readiness score and gaps in minutes. No signup required. Then decide if you want mentor-led
              support.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={goToStartAssessment}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-900/40 transition-all hover:bg-indigo-500 sm:w-auto"
              >
                Check my readiness — free
                <ArrowRight size={16} />
              </button>
              <Link
                to="/waitlist"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 px-7 py-3.5 text-sm font-semibold text-slate-300 transition-colors hover:border-white/25 hover:bg-white/5 hover:text-white sm:w-auto"
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
