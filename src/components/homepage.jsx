import React, { useRef, useState, useEffect, useId } from 'react';
import { motion, useInView, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { goToStartAssessment } from '../utils/startAssessmentNavigation';
import {
  PRIMARY_CTA_LABEL,
  MISSION_TAGLINE,
  MENTORSHIP_TRUST_BADGE,
  PRODUCT_READINESS_SCORE,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  HERO_EYEBROW,
  HERO_EARLY_BIRD_RIBBON,
  HERO_HEADLINE,
  HERO_HEADLINE_ACCENT,
  HERO_SUBHEADLINE,
  HERO_PROBLEM_LABEL,
  HERO_PROBLEM,
  HERO_SOLUTION_LABEL,
  HERO_SOLUTION,
  HERO_PROOF_STAT,
  READINESS_TEST_COUPON_BADGE,
  READINESS_TEST_COUPON_OFFER_HEADLINE,
  READINESS_TEST_COUPON_OFFER_HOW,
  READINESS_TEST_COUPON_CARD_HEADLINE,
  READINESS_TEST_COUPON_CARD_BODY,
  READINESS_TEST_COUPON_CARD_CTA,
} from '../constants/brandCopy';
import LimitedRewardLabel from './LimitedRewardLabel';
import {
  ArrowRight, Brain, Target,
  BarChart3, Cpu, TrendingUp,
  MessageSquare, GraduationCap, Building2, Users,
  Mail, Phone, Check, X,
  BookOpen, Layers, Sparkles, CalendarClock, Mic2,
  Clock, Gift, UserX, Gauge,
} from 'lucide-react';

/* ─── Scroll-reveal wrapper ─────────────────────────────────── */
const FadeUp = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

/** Staggered line for long “Why MentorMuni” copy — readable at a glance */
const StoryLine = ({ children, className = '', delay = 0, as: Tag = 'p' }) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: reduceMotion ? 0 : 0.45,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Tag className={className}>{children}</Tag>
    </motion.div>
  );
};

/* ─── Features data ─────────────────────────────────────────── */
const FEATURES = [
  {
    Icon: Brain,
    tag: 'START HERE',
    title: 'Interview Readiness Score',
    desc: 'One score out of 100 with category breakdowns—see what to fix first, not everything at once.',
    highlight: 'Free · ~5 min · Instant',
  },
  {
    Icon: Cpu,
    tag: 'PRACTICE',
    title: 'AI Mock Interviews',
    desc: 'Real-time voice practice with feedback on clarity and depth—closer to the real panel than solo prep.',
    highlight: 'Company-style patterns',
  },
  {
    Icon: BarChart3,
    tag: 'ATS',
    title: 'Resume ATS Checker',
    desc: 'See how screening software reads your resume before a human does—keywords, structure, fixes.',
    highlight: 'Score + line-level tips',
  },
  {
    Icon: TrendingUp,
    tag: 'EDGE',
    title: 'AI Tools Training',
    desc: 'Speak confidently about Copilot, ChatGPT, and Cursor in interviews—fluency recruiters now expect.',
    highlight: 'Workflow + talking points',
  },
];

/* ─── Student voices — anonymised; each has a clear before/after ───────── */
const STUDENT_SNIPPETS = [
  {
    avatar: 'V',
    bg: '#FF9500',
    gradient: 'from-[#FF9500] via-[#FFB347] to-[#FFD580]',
    tag: '4th Year · CSE',
    insight: 'Named the real gap',
    text: 'Seniors kept saying “practice more,” but nobody said what to practice. The readiness breakdown pointed at System Design—not everything at once—so I could prep with a target instead of a guess.',
    Icon: Target,
  },
  {
    avatar: 'R',
    bg: '#0891b2',
    gradient: 'from-cyan-500 via-sky-400 to-teal-400',
    tag: 'Final Year · IT',
    insight: 'Feedback on how you sound',
    text: 'The AI mock was blunt: my answers sounded memorised, not understood. I changed how I open and structure answers under pressure—not just the facts inside them.',
    Icon: Mic2,
  },
  {
    avatar: 'S',
    bg: '#059669',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    tag: '3rd Year · CSE',
    insight: 'Specific weak spot',
    text: 'The score split my DSA by pattern and showed strings were the weak link. Random LeetCode never made that obvious; I finally knew what to drill instead of grinding everything.',
    Icon: BarChart3,
  },
];

const studentStoriesContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.08 },
  },
};

const studentStoryCard = {
  hidden: { opacity: 0, y: 36, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── 2nd / 3rd year prep — tab data + benefit tiles ───────────────── */
const EARLY_YEAR_TRACKS = {
  y2: {
    label: '2nd year',
    shortLine: 'Foundations · core subjects · first projects',
    detail:
      "See how interview-style thinking maps to what you're in class now.",
  },
  y3: {
    label: '3rd year',
    shortLine: 'Internships · sharper tech rounds',
    detail: 'Benchmark DSA, stack, and HR on the timeline ahead of drives.',
  },
};

const EARLY_BENEFIT_TILES = [
  {
    Icon: BookOpen,
    title: 'Topic-fit',
    sub: 'Readiness on your plate',
    gradient: 'from-[#FF9500] to-[#FFB347]',
  },
  {
    Icon: Layers,
    title: 'Fix order',
    sub: 'Semesters still ahead',
    gradient: 'from-[#0891b2] to-[#22d3ee]',
  },
  {
    Icon: CalendarClock,
    title: '~5 min · Free',
    sub: 'No signup — revisit anytime',
    gradient: 'from-[#059669] to-[#34d399]',
  },
];

const earlyBenefitContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const earlyBenefitItem = {
  hidden: { opacity: 0, x: -28, scale: 0.92 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 380, damping: 28 },
  },
};

/** Sample area weights for “strongest / focus next” only (prep map teaser). */
const PREP_MAP_SAMPLE_AREAS = [
  { label: 'DSA & problem solving', w: 72 },
  { label: 'OS / DBMS / CN', w: 58 },
  { label: 'Projects & stack', w: 65 },
  { label: 'HR & communication', w: 48 },
];

/** Shown as example prep focus areas (not scored on the homepage teaser). */
const PREP_MAP_PREP_TOPIC_EXAMPLES = [
  'AI agents',
  'LinkedIn checklist',
  'Database partitioning',
  'React & Redux',
];

/** Same 0–100 scale as Interview Readiness results (see `interviewready.jsx`); illustrative sample only. */
const PREP_MAP_ILLUSTRATIVE_SCORE = 64;

/** Strongest / weakest for sample “at a glance” (illustrative). */
function prepMapGlance(rows) {
  const sorted = [...rows].sort((a, b) => b.w - a.w);
  return { strongest: sorted[0], weakest: sorted[sorted.length - 1] };
}

function prepMapReadinessBand(pct) {
  if (pct >= 75) return { label: 'Strong band', sub: 'Keep momentum — polish the last gaps.' };
  if (pct >= 50) return { label: 'Growth band', sub: 'Structured practice moves this score quickly.' };
  return { label: 'Build band', sub: 'High upside — lock fundamentals below.' };
}

/** Compact SVG ring — mirrors `ReadinessScoreRing` on the real assessment results screen. */
function PrepMapReadinessScoreRing({ pct, inView }) {
  const gradId = `pmr-${useId().replace(/:/g, '')}`;
  const size = 132;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);
  const tier =
    pct >= 75
      ? { from: '#34d399', to: '#10b981', glow: 'rgba(16,185,129,0.45)' }
      : pct >= 50
        ? { from: '#fbbf24', to: '#f59e0b', glow: 'rgba(245,158,11,0.4)' }
        : { from: '#fb7185', to: '#f43f5e', glow: 'rgba(244,63,94,0.35)' };

  return (
    <div className="relative mx-auto flex h-[138px] w-[138px] shrink-0 items-center justify-center sm:h-[148px] sm:w-[148px]">
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-50"
        style={{ background: `radial-gradient(circle, ${tier.glow} 0%, transparent 70%)` }}
        aria-hidden
      />
      <svg width={size} height={size} className="-rotate-90 transform drop-shadow-md" aria-hidden>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={tier.from} />
            <stop offset="100%" stopColor={tier.to} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={inView ? { strokeDashoffset: offset } : { strokeDashoffset: c }}
          transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black tabular-nums tracking-tight text-[#1A1A1A] sm:text-[2.1rem]">{pct}%</span>
        <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500">Readiness</span>
      </div>
    </div>
  );
}

function AnimatedPrepMapPanel() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const illustrativeBand = prepMapReadinessBand(PREP_MAP_ILLUSTRATIVE_SCORE);
  const glance = prepMapGlance(PREP_MAP_SAMPLE_AREAS);
  return (
    <div ref={ref} className="relative">
      <div
        className="pointer-events-none absolute -inset-[3px] rounded-[1.45rem] bg-gradient-to-br from-[#FF9500]/45 via-fuchsia-400/15 to-cyan-400/35 opacity-70 blur-[2px]"
        aria-hidden
      />
      <motion.div
        aria-hidden
        className="absolute -inset-1 rounded-[1.35rem] bg-gradient-to-br from-[#FF9500]/35 via-fuchsia-500/15 to-cyan-500/20 opacity-50 blur-md"
        animate={
          inView
            ? { rotate: [0, 2, -1.5, 0], opacity: [0.4, 0.55, 0.45] }
            : { opacity: 0.28 }
        }
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-br from-[#FFFCF7] via-white to-[#F4FAFC] shadow-[0_12px_48px_-16px_rgba(255,149,0,0.18),0_4px_16px_-6px_rgba(15,23,42,0.06)] ring-1 ring-orange-100/40">
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-orange-300/25 to-transparent blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-gradient-to-tr from-cyan-300/20 to-transparent blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `linear-gradient(rgba(180,120,60,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(180,120,60,0.04) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
          aria-hidden
        />

        <div className="relative p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <motion.span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF9500] to-[#EA580C] text-white shadow-[0_8px_24px_-6px_rgba(234,88,12,0.55)] ring-2 ring-white/50"
                animate={inView ? { scale: [1, 1.04, 1] } : {}}
                transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2 }}
              >
                <Sparkles size={20} strokeWidth={2} aria-hidden />
              </motion.span>
              <div>
                <span className="block bg-gradient-to-r from-[#1A1A1A] to-neutral-700 bg-clip-text text-base font-extrabold tracking-tight text-transparent sm:text-lg">
                  Your prep map
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-500">
                  Readiness by area · sample view
                </span>
              </div>
            </div>
            <div className="shrink-0 self-center">
              <LimitedRewardLabel className="text-[8px] px-2.5 py-1 sm:text-[9px] sm:px-3 sm:py-1.5 [&_svg]:h-2.5 [&_svg]:w-2.5 sm:[&_svg]:h-3 sm:[&_svg]:w-3" />
            </div>
          </div>

          <div className="mb-4 rounded-xl border border-orange-100/90 bg-orange-50/40 px-3 py-2.5 sm:px-4 sm:py-3">
            <p className="text-[11px] leading-relaxed text-neutral-600 sm:text-xs">
              <span className="font-semibold text-neutral-800">Sample only.</span> In the real test you pick topics — your report
              reflects your answers. What follows is a fictional example so you can see the layout.
            </p>
          </div>

          {/* Overall score: ring + band only (no coupon here — stays readable) */}
          <div className="mb-4 flex flex-col items-center gap-5 rounded-2xl border border-neutral-200/90 bg-gradient-to-br from-white via-neutral-50/50 to-orange-50/15 p-4 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center sm:gap-8 sm:p-6">
            <div className="flex shrink-0 justify-center">
              <PrepMapReadinessScoreRing pct={PREP_MAP_ILLUSTRATIVE_SCORE} inView={inView} />
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="mb-2 inline-flex items-center justify-center gap-1.5 rounded-full border border-neutral-200/90 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-600 sm:justify-start">
                <Target size={12} className="text-[#FF9500]" strokeWidth={2.5} aria-hidden />
                Interview readiness score
              </div>
              <p className="text-[11px] font-semibold text-neutral-700">Example only — not your result</p>
              <p className="mt-2 text-xl font-black leading-tight text-neutral-900 sm:text-2xl">{illustrativeBand.label}</p>
              <p className="mt-1.5 text-sm leading-snug text-neutral-600">{illustrativeBand.sub}</p>
            </div>
          </div>

          {/* At a glance — strengths vs gaps (sample) */}
          <div className="mb-4 grid gap-2 rounded-xl border border-neutral-200/80 bg-white/90 p-3 sm:grid-cols-2 sm:gap-3 sm:p-4">
            <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/50 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Strongest area (sample)</p>
              <p className="mt-1 text-sm font-bold text-neutral-900">{glance.strongest.label}</p>
              <p className="text-xs font-semibold tabular-nums text-emerald-800">{glance.strongest.w}%</p>
            </div>
            <div className="rounded-lg border border-amber-200/70 bg-amber-50/60 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900">Focus next (sample)</p>
              <p className="mt-1 text-sm font-bold text-neutral-900">{glance.weakest.label}</p>
              <p className="text-xs font-semibold tabular-nums text-amber-900">{glance.weakest.w}%</p>
            </div>
          </div>

          <div className="mb-4 rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50/40 via-white to-white px-3 py-3 sm:px-4 sm:py-3.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-violet-900/90">Example topics to prep</p>
            <p className="mt-1 text-[11px] leading-snug text-neutral-600">
              Ideas you might drill or tag in the real assessment — mix tech depth with how you show up.
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {PREP_MAP_PREP_TOPIC_EXAMPLES.map((topic) => (
                <span
                  key={topic}
                  className="rounded-lg border border-violet-200/70 bg-white/90 px-2.5 py-1.5 text-[11px] font-semibold text-neutral-800 shadow-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Reward — full width so copy & CTA never clip */}
          <div className="mb-0 flex flex-col gap-3 rounded-xl border border-orange-200/90 bg-gradient-to-r from-amber-50 via-orange-50/80 to-amber-50/40 p-3 shadow-sm sm:flex-row sm:items-center sm:gap-4 sm:p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF9500] to-[#EA580C] text-white shadow-md">
              <Gift className="h-5 w-5" strokeWidth={2} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wide text-[#9A3412]">{READINESS_TEST_COUPON_CARD_HEADLINE}</p>
              <p className="mt-1 text-sm leading-snug text-neutral-800">{READINESS_TEST_COUPON_CARD_BODY}</p>
            </div>
            <button
              type="button"
              onClick={goToStartAssessment}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-4 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#E88600] sm:w-auto sm:min-w-[10.5rem]"
            >
              {READINESS_TEST_COUPON_CARD_CTA}
              <ArrowRight size={16} strokeWidth={2.5} className="shrink-0" aria-hidden />
            </button>
          </div>

          <p className="mt-4 text-center text-[11px] leading-snug text-neutral-500">
            Full report after your test: every topic you tag, with scores and what to improve first.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero poster carousel: compact dark strip + icon + problem / solution copy ─ */
const POSTER_CAROUSEL_SLIDES = [
  {
    title: 'Interview readiness',
    Icon: BarChart3,
    accentOrb: 'from-[#ea580c]/20 to-amber-400/15',
    visualBg: 'from-orange-50/95 via-amber-50/90 to-[#fffbeb]',
    visualKicker: 'Readiness',
    visualLine: 'Score · categories · what to fix first',
    problem: 'You don’t know which skills to fix first — “study everything” hides your real gaps.',
    solution:
      'Interview Readiness Score: one number out of 100 with category breakdowns so you prep with a target, not a guess.',
  },
  {
    title: '1:1 mentorship',
    Icon: Users,
    accentOrb: 'from-amber-400/20 to-yellow-400/12',
    visualBg: 'from-amber-50/95 via-orange-50/85 to-[#fff7ed]',
    visualKicker: 'Mentorship',
    visualLine: 'Human guidance · your timeline · your goals',
    problem: 'Generic advice from seniors doesn’t map to your timeline, branch, or goals.',
    solution:
      'Human 1:1 mentorship (waitlist, limited seats) aligned to what you’re aiming for — not one-size-fits-all.',
  },
  {
    title: 'Mock interview prep',
    Icon: Mic2,
    accentOrb: 'from-cyan-400/18 to-sky-300/12',
    visualBg: 'from-cyan-50/90 via-sky-50/80 to-[#f0fdfa]',
    visualKicker: 'Practice',
    visualLine: 'Voice · feedback · panel-style pressure',
    problem: 'Solo grind doesn’t mirror the panel: you never hear how your answers land under pressure.',
    solution:
      'AI mock interviews with voice practice and blunt feedback on clarity and depth — closer to a real round.',
  },
  {
    title: 'Week planner',
    Icon: CalendarClock,
    accentOrb: 'from-emerald-400/18 to-teal-300/12',
    visualBg: 'from-emerald-50/90 via-teal-50/75 to-[#ecfdf5]',
    visualKicker: 'Structure',
    visualLine: 'Weekly rhythm · aligned to drives & coursework',
    problem: 'Random LeetCode nights and last-minute cramming don’t compound into interview readiness.',
    solution:
      'A structured week-by-week plan so your prep matches drives and coursework — not chaos.',
  },
  {
    title: 'HR & technical interviews',
    Icon: Layers,
    accentOrb: 'from-violet-400/18 to-fuchsia-300/12',
    visualBg: 'from-violet-50/90 via-fuchsia-50/70 to-[#faf5ff]',
    visualKicker: 'Full stack prep',
    visualLine: 'Behavioral polish · DSA · stack · depth',
    problem: 'Students often over-index on DSA or only HR — companies expect both to feel credible.',
    solution:
      'Prep that connects behavioral polish with DSA, stack, and role-relevant technical depth.',
  },
];

function PosterSlideVisual({ slide, fillParent = false }) {
  const Icon = slide.Icon;
  const visualBg = slide.visualBg ?? 'from-[#fffdfb] via-orange-50/70 to-amber-50/80';

  return (
    <div
      className={`relative min-h-0 w-full min-w-0 overflow-hidden rounded-t-xl bg-gradient-to-br ${visualBg} ${
        fillParent ? 'h-full w-full' : 'aspect-[16/10] sm:aspect-[16/9]'
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-16 -top-12 h-[min(45%,200px)] w-[min(45%,200px)] rounded-full bg-gradient-to-br ${slide.accentOrb} blur-2xl opacity-50`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-12 h-32 w-32 rounded-full bg-orange-400/20 blur-2xl opacity-60"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: `linear-gradient(rgba(120,80,40,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120,80,40,0.06) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
        aria-hidden
      />
      <div className="relative flex h-full min-h-[96px] flex-col items-center justify-center gap-1.5 px-4 py-4 sm:min-h-[104px] sm:gap-2 sm:px-5 sm:py-5">
        <div className="flex flex-col items-center">
          <div className="rounded-xl border border-orange-200/70 bg-white/90 p-2.5 shadow-[0_8px_24px_-12px_rgba(234,88,12,0.18)] ring-1 ring-orange-100/80 sm:p-3">
            <Icon className="h-7 w-7 text-[#ea580c] sm:h-8 sm:w-8" strokeWidth={1.15} aria-hidden />
          </div>
          <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9A3412]/90 sm:text-[10px]">{slide.visualKicker}</p>
          <p className="mt-0.5 max-w-[280px] text-center text-[11px] font-medium leading-snug text-neutral-600 sm:text-xs">
            {slide.visualLine}
          </p>
        </div>
      </div>
    </div>
  );
}

function MentorMuniPosterCarousel({ className = '' }) {
  const [index, setIndex] = useState(0);
  const n = POSTER_CAROUSEL_SLIDES.length;

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % n);
    }, 2000);
    return () => window.clearInterval(id);
  }, [n]);

  const go = (i) => setIndex(i);
  const next = () => setIndex((i) => (i + 1) % n);

  const slide = POSTER_CAROUSEL_SLIDES[index];

  return (
    <div
      className={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[#F0ECE0] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="How MentorMuni addresses common prep problems"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className="relative h-[112px] w-full shrink-0 cursor-pointer overflow-hidden rounded-t-xl bg-gradient-to-b from-[#fffdfb] to-[#fff4e6] sm:h-[124px]"
          onClick={next}
          title="Tap for next slide"
        >
          <div className="absolute inset-0 min-h-0">
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={index}
                className="absolute inset-0 h-full w-full min-h-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <PosterSlideVisual slide={slide} fillParent />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="relative flex-1 border-t border-[#F0ECE0] bg-white px-4 py-4 sm:px-5 sm:py-5" aria-live="polite">
          <div className="relative min-h-[200px] sm:min-h-[200px]">
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={index}
                className="absolute inset-x-0 top-0 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">{slide.title}</p>
                <div className="rounded-xl border border-zinc-200/90 bg-zinc-50/90 px-3.5 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Problem</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-700 sm:text-sm">{slide.problem}</p>
                </div>
                <div className="rounded-xl border border-[#FF9500]/25 bg-gradient-to-br from-[#FFFDFB] to-[#FFF4E0]/50 px-3.5 py-3 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#B45309]">MentorMuni solution</p>
                  <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-[#1A1A1A] sm:text-sm">{slide.solution}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 border-t border-[#F0ECE0] bg-[#FFFDF8] px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {POSTER_CAROUSEL_SLIDES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(i);
              }}
              aria-label={`${s.title}, slide ${i + 1} of ${n}`}
              aria-current={i === index || undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? 'w-7 bg-[#FF9500]' : 'w-2 bg-[#E8E4DC] hover:bg-[#CCC8BE]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const HomePage = () => {
  const [earlyYear, setEarlyYear] = useState('y2');
  const reduceMotion = useReducedMotion();

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <style>{`
        :focus-visible {
          outline: 2px solid #FF9500;
          outline-offset: 3px;
          border-radius: 6px;
        }
        .mm-hero-accent {
          background-size: 200% 200%;
          animation: mm-hero-accent 10s ease-in-out infinite;
        }
        @keyframes mm-hero-accent {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mm-hero-accent { animation: none !important; background-position: 0% 50% !important; }
          .mm-hero-orb { animation: none !important; }
        }
        @keyframes mm-orb-drift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          33% { transform: translate(3%, 2%) scale(1.05); opacity: 0.65; }
          66% { transform: translate(-2%, -1%) scale(0.98); opacity: 0.55; }
        }
        .mm-hero-proof-strip {
          background-size: 200% 200%;
          animation: mm-hero-proof-shimmer 12s ease-in-out infinite;
        }
        @keyframes mm-hero-proof-shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .mm-hero-value-mesh {
          background-image:
            radial-gradient(ellipse 80% 60% at 10% 20%, rgba(255, 149, 0, 0.09), transparent 50%),
            radial-gradient(ellipse 70% 50% at 90% 80%, rgba(6, 182, 212, 0.07), transparent 45%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 251, 245, 0.96) 50%, rgba(248, 250, 252, 0.94) 100%);
        }
        @media (prefers-reduced-motion: reduce) {
          .mm-hero-proof-strip { animation: none !important; background-position: 0% 50% !important; }
        }
        /* Eyebrow pills: soft glow pulse (text stays sharp — no sliding gradient) */
        .mm-hero-eyebrow-pill {
          background-image: linear-gradient(135deg, #fff8f0 0%, #ffffff 45%, #f0fdfa 100%);
        }
        .mm-hero-eyebrow-pill-glow {
          animation: mm-eyebrow-glow 5s ease-in-out infinite;
        }
        .mm-hero-eyebrow-pill-glow.mm-eyebrow-d1 { animation-delay: 0.35s; }
        .mm-hero-eyebrow-pill-glow.mm-eyebrow-d2 { animation-delay: 0.7s; }
        @keyframes mm-eyebrow-glow {
          0%, 100% {
            box-shadow: 0 2px 14px -6px rgba(255, 149, 0, 0.32), 0 0 0 0 rgba(255, 149, 0, 0);
            border-color: rgba(253, 186, 116, 0.55);
          }
          50% {
            box-shadow: 0 4px 22px -4px rgba(255, 149, 0, 0.42), 0 0 20px -8px rgba(251, 146, 60, 0.25);
            border-color: rgba(251, 146, 60, 0.75);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .mm-hero-eyebrow-pill-glow { animation: none !important; }
        }
      `}</style>

      {/* ════════════════ HERO — editorial layout, calm canvas, strong type ════════════════ */}
      <section className="relative flex min-h-[min(85vh,760px)] items-start border-b border-neutral-200/60 bg-gradient-to-b from-neutral-50 via-[#fffdf8] to-[#faf8f5] pt-8 pb-14 md:pt-10 md:pb-16 lg:pt-10 lg:pb-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className="mm-hero-orb absolute -right-32 top-0 h-[520px] w-[520px] rounded-full bg-[rgba(255,149,0,0.06)] blur-[120px]"
            style={{ animation: 'mm-orb-drift 18s ease-in-out infinite' }}
          />
          <div
            className="mm-hero-orb absolute -bottom-32 left-1/4 h-[380px] w-[380px] rounded-full bg-[rgba(251,146,60,0.05)] blur-[100px]"
            style={{ animation: 'mm-orb-drift 22s ease-in-out infinite reverse' }}
          />
        </div>

        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-stretch gap-10 px-5 sm:px-6 lg:gap-12 lg:px-8">
          {/* ── Tagline — centered, top of hero ── */}
          <div className="w-full text-center">
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.03 }}
              className="mx-auto max-w-[42rem] text-[1.85rem] font-semibold leading-[1.12] tracking-[-0.025em] sm:text-4xl md:max-w-[48rem] md:text-5xl lg:text-[3.15rem] lg:leading-[1.08]"
            >
              <span className="block text-neutral-900">{HERO_HEADLINE}</span>
              <span className="mt-2 block sm:mt-3 mm-hero-accent bg-gradient-to-r from-[#ea580c] via-[#FF9500] to-[#f59e0b] bg-clip-text text-transparent">
                {HERO_HEADLINE_ACCENT}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mx-auto mt-4 max-w-[36rem] px-1 text-[15px] leading-relaxed text-neutral-600 sm:mt-5 sm:text-lg"
            >
              {HERO_SUBHEADLINE}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 }}
              className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:mt-6"
              aria-label={HERO_PROOF_STAT}
            >
              {[
                { Icon: Clock, text: '~5 min' },
                { Icon: Gift, text: 'Free' },
                { Icon: UserX, text: 'No signup' },
                { Icon: Gauge, text: 'Instant score' },
              ].map(({ Icon, text }) => (
                <span
                  key={text}
                  className="mm-hero-proof-strip inline-flex items-center gap-1.5 rounded-xl border border-orange-200/50 bg-gradient-to-r from-[#FFF8F0] via-white to-[#FFFDF8] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-600 shadow-[0_2px_12px_-4px_rgba(255,149,0,0.2)] sm:gap-2 sm:px-3 sm:text-[11px]"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-[#EA580C] sm:h-4 sm:w-4" strokeWidth={2.2} aria-hidden />
                  {text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── Intro: eyebrow → promo card (narrow measure, centered under tagline) ── */}
          <div className="mx-auto w-full max-w-[36rem]">
            <div className="mb-6">
              <div className="-mx-1 flex max-w-full flex-nowrap items-center gap-1 overflow-x-auto px-1 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:gap-1.5 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
                {HERO_EYEBROW.split(' · ').map((part, idx) => (
                  <motion.span
                    key={`${part}-${idx}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            delay: 0.05 + idx * 0.14,
                            type: 'spring',
                            stiffness: 420,
                            damping: 26,
                            mass: 0.7,
                          }
                    }
                    whileHover={
                      reduceMotion
                        ? undefined
                        : { scale: 1.03, transition: { type: 'spring', stiffness: 500, damping: 22 } }
                    }
                    className={`mm-hero-eyebrow-pill mm-hero-eyebrow-pill-glow inline-flex shrink-0 items-center gap-1 rounded-full border border-orange-200/60 px-2 py-1 text-[9px] font-bold uppercase leading-snug tracking-[0.08em] text-neutral-800 ring-1 ring-white/90 sm:px-2.5 sm:py-1.5 sm:text-[10px] sm:tracking-[0.1em] md:gap-1.5 md:px-3 md:text-[11px] md:tracking-[0.12em] ${idx === 1 ? 'mm-eyebrow-d1' : ''} ${idx === 2 ? 'mm-eyebrow-d2' : ''}`}
                  >
                    {idx === 0 ? (
                      <GraduationCap className="h-2.5 w-2.5 shrink-0 text-[#EA580C] sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" strokeWidth={2.2} aria-hidden />
                    ) : idx === 1 ? (
                      <Mic2 className="h-2.5 w-2.5 shrink-0 text-[#0891B2] sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" strokeWidth={2.2} aria-hidden />
                    ) : (
                      <Sparkles className="h-2.5 w-2.5 shrink-0 text-[#EA580C] sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" strokeWidth={2.2} aria-hidden />
                    )}
                    {part}
                  </motion.span>
                ))}
              </div>
            </div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-[1] mb-6 max-w-xl"
              aria-label={`${HERO_EARLY_BIRD_RIBBON}: ${READINESS_TEST_COUPON_OFFER_HEADLINE}`}
            >
              <div className="absolute left-4 -top-2 z-10 sm:left-5">
                <span className="inline-flex items-center gap-1 rounded-md bg-neutral-900 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-amber-200 shadow-[3px_3px_0_0_rgba(251,146,60,0.55)] ring-1 ring-amber-500/40">
                  <Sparkles className="h-3 w-3 text-amber-300" strokeWidth={2.5} aria-hidden />
                  {HERO_EARLY_BIRD_RIBBON}
                </span>
              </div>
              <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-amber-500/60 bg-gradient-to-br from-amber-50/98 via-white to-orange-50/90 px-4 pb-4 pt-7 shadow-[0_22px_56px_-28px_rgba(234,88,12,0.48),inset_0_1px_0_rgba(255,255,255,0.95)] ring-1 ring-amber-200/60 sm:px-5 sm:pb-5 sm:pt-8">
                <div
                  className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
                  aria-hidden
                />
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-400/15 blur-3xl" aria-hidden />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
                  <div className="flex min-w-0 gap-3 sm:gap-3.5">
                    <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-[#EA580C] text-white shadow-lg ring-2 ring-white/90">
                      <Gift size={20} strokeWidth={2.2} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[15px] font-black leading-snug text-neutral-900 sm:text-base">
                        {READINESS_TEST_COUPON_OFFER_HEADLINE}
                      </p>
                      <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-neutral-600 sm:text-xs">
                        {READINESS_TEST_COUPON_OFFER_HOW}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={goToStartAssessment}
                    className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#EA580C] px-4 py-3 text-xs font-bold text-white shadow-[0_10px_28px_-10px_rgba(234,88,12,0.75)] ring-2 ring-white/70 transition hover:brightness-[1.05] sm:w-auto sm:min-w-[11.5rem] sm:py-2.5 sm:text-sm"
                  >
                    {PRIMARY_CTA_LABEL}
                    <ArrowRight size={16} className="opacity-95" aria-hidden />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Same row: “Why it matters / How MentorMuni helps” | poster carousel — equal columns, matched height ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="grid w-full grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8"
          >
            <div className="relative flex h-full min-h-[min(52vh,520px)] flex-col">
              <div
                className="pointer-events-none absolute -inset-px rounded-[1.35rem] bg-gradient-to-br from-[#FFB347]/55 via-[#FF9500]/25 to-cyan-400/30 opacity-90 blur-[1px]"
                aria-hidden
              />
              <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[1.3rem] border border-white/70 shadow-[0_4px_24px_-8px_rgba(255,149,0,0.12),0_24px_60px_-28px_rgba(15,23,42,0.12)]">
                <div
                  className="pointer-events-none absolute -right-24 top-0 h-56 w-56 rounded-full bg-gradient-to-br from-orange-400/25 to-amber-300/10 blur-3xl"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -bottom-28 -left-16 h-52 w-52 rounded-full bg-cyan-400/15 blur-3xl"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.4]"
                  style={{
                    backgroundImage: `linear-gradient(rgba(120,80,40,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(120,80,40,0.03) 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                  }}
                  aria-hidden
                />
                <div className="mm-hero-value-mesh relative flex min-h-0 flex-1 flex-col space-y-0 p-5 sm:p-7">
                  <div className="relative rounded-2xl border border-orange-200/45 bg-gradient-to-br from-orange-50/90 via-white/60 to-transparent p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:p-5">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9A3412] shadow-sm">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-white" aria-hidden />
                      </span>
                      {HERO_PROBLEM_LABEL}
                    </div>
                    <p className="text-[15px] leading-[1.65] text-neutral-700 sm:text-base">{HERO_PROBLEM}</p>
                  </div>

                  <div className="relative shrink-0 py-4 sm:py-5">
                    <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-orange-200/70 to-transparent" aria-hidden />
                    <div className="relative mx-auto flex w-fit items-center justify-center gap-2 rounded-full border border-orange-100/90 bg-white/95 px-3 py-1 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]">
                      <Sparkles className="h-3.5 w-3.5 text-[#FF9500]" strokeWidth={2} aria-hidden />
                    </div>
                  </div>

                  <div className="relative rounded-2xl border border-cyan-200/40 bg-gradient-to-br from-cyan-50/80 via-white/70 to-[#FAFAF9] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] sm:p-5">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/55 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-950 shadow-sm">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-sm">
                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                      </span>
                      {HERO_SOLUTION_LABEL}
                    </div>
                    <p className="text-[15px] font-medium leading-[1.65] text-neutral-800 sm:text-base">{HERO_SOLUTION}</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex h-full min-h-[min(52vh,520px)] flex-col"
            >
              <MentorMuniPosterCarousel className="h-full w-full min-h-[min(52vh,520px)] shadow-[0_24px_80px_-48px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.04]" />
            </motion.div>
          </motion.div>

          <div className="mx-auto w-full max-w-[36rem]">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6"
            >
              <button
                type="button"
                onClick={goToStartAssessment}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_32px_-12px_rgba(234,88,12,0.55)] transition hover:bg-[#E88600] sm:w-auto sm:py-4 sm:text-[15px]"
              >
                {PRIMARY_CTA_LABEL}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
              >
                How it works <ArrowRight size={14} />
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-sm text-neutral-500"
            >
              <Link to="/waitlist" className="font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-4 transition hover:text-[#CC7000] hover:decoration-[#FFB347]">
                Mentorship waitlist
              </Link>
              <span className="text-neutral-400"> — limited seats per batch.</span>
            </motion.p>
          </div>
        </div>
      </section>

      {/* ════════════════ 2ND & 3RD YEAR — scannable flow + tab + animated map ════════════════ */}
      <section className="relative overflow-hidden border-t border-[#F0ECE0] bg-[#FFF8EE] py-16 px-6">
        <style>{`
          @keyframes mm-flow-arrow {
            0%, 100% { transform: translateX(0); opacity: 0.35; }
            50% { transform: translateX(5px); opacity: 1; }
          }
          @keyframes mm-prep-journey {
            0%, 8% { left: 16.66%; }
            18%, 32% { left: 50%; }
            42%, 58% { left: 83.33%; }
            68%, 100% { left: 16.66%; }
          }
          @keyframes mm-walk-bob {
            0%, 100% { transform: translateY(0) rotate(-1deg); }
            50% { transform: translateY(-5px) rotate(1deg); }
          }
          @keyframes mm-step-glow {
            0%, 100% { box-shadow: 0 2px 10px rgba(255, 149, 0, 0.2); }
            50% { box-shadow: 0 6px 18px rgba(255, 149, 0, 0.35), 0 0 0 2px rgba(255, 179, 71, 0.12); }
          }
          @keyframes mm-logo-float {
            0%, 100% { filter: drop-shadow(0 4px 8px rgba(0,0,0,0.12)); }
            50% { filter: drop-shadow(0 8px 16px rgba(234, 88, 12, 0.25)); }
          }
          .mm-journey-traveler {
            left: 16.66%;
            animation: mm-prep-journey 8s cubic-bezier(0.45, 0.02, 0.55, 0.98) infinite;
          }
          .mm-walk-inner {
            animation: mm-walk-bob 0.42s ease-in-out infinite, mm-logo-float 3s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .mm-journey-traveler {
              animation: none !important;
              left: 50% !important;
            }
            .mm-walk-inner {
              animation: none !important;
            }
            .mm-step-badge { animation: none !important; }
          }
        `}</style>
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[rgba(255,149,0,0.12)] blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[rgba(255,179,71,0.1)] blur-[90px]" />
        <div className="pointer-events-none absolute left-0 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[80px]" />

        <div className="relative mx-auto max-w-5xl">
          <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/25 bg-cyan-50/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-900">
                    Early years on campus
                  </span>
                </div>
                <h2 className="mb-4 text-2xl font-extrabold leading-tight text-[#1A1A1A] md:text-3xl">
                  Prep for what you&apos;re studying —{' '}
                  <span className="mm-hero-accent bg-gradient-to-r from-[#FF9500] via-[#f97316] to-[#FFB347] bg-clip-text text-transparent">
                    not someday, from now.
                  </span>
                </h2>

                <div className="mb-6 rounded-2xl border border-[#F0ECE0] bg-white/90 px-3 py-4 shadow-sm sm:px-5">
                  <p className="mb-3 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-[#888888]">
                    Your prep journey
                  </p>
                  {/* Track + walking mascot (md+); stacked steps on small screens */}
                  <div className="relative mx-auto max-w-lg md:max-w-none">
                    <div className="relative hidden min-h-[5.5rem] md:block">
                      <div className="mm-journey-traveler absolute bottom-2 z-10 -translate-x-1/2">
                        <div className="mm-walk-inner flex items-end gap-1.5">
                          <span className="relative flex h-9 w-7 flex-col items-center justify-end" aria-hidden>
                            <svg viewBox="0 0 32 40" className="h-9 w-7 text-[#3f3f46]" fill="currentColor">
                              <circle cx="16" cy="8" r="5" />
                              <path d="M16 13 L11 26 L14 26 L16 18 L18 26 L21 26 L16 13" />
                              <path
                                d="M11 26 L9 36 M21 26 L23 36"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                fill="none"
                              />
                              <ellipse cx="16" cy="36" rx="3" ry="1.5" opacity="0.15" />
                            </svg>
                          </span>
                          <img
                            src={`${import.meta.env.BASE_URL}mentormuni-logo.png`}
                            alt=""
                            className="h-9 w-9 shrink-0 rounded-full border-2 border-white object-contain shadow-md ring-1 ring-orange-200/80"
                            width={36}
                            height={36}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 md:pt-0">
                      {[
                        { step: '1', label: 'Learn the skill' },
                        { step: '2', label: 'Readiness test & score' },
                        { step: '3', label: '1:1 MentorMuni to close gaps' },
                      ].map((s, i) => (
                        <motion.div
                          key={s.label}
                          initial={{ opacity: 0, y: 10, scale: 0.94 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: true, amount: 0.8 }}
                          transition={{ delay: i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          className="flex flex-col items-center gap-1.5 text-center"
                        >
                          <span
                            className="mm-step-badge flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9500] to-[#FFB347] text-xs font-extrabold text-white ring-2 ring-white"
                            style={{
                              animation: 'mm-step-glow 4.5s ease-in-out infinite',
                              animationDelay: `${i * 0.4}s`,
                            }}
                          >
                            {s.step}
                          </span>
                          <span className="max-w-[8rem] text-[9px] font-bold uppercase leading-tight tracking-wide text-[#444444] sm:max-w-[9rem] sm:text-[10px]">
                            {s.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                    <p className="mt-3 text-center text-[10px] text-[#999999] md:hidden">
                      Learn → readiness test & score → 1:1 MentorMuni
                    </p>
                  </div>
                </div>

                <div
                  className="mb-5 flex max-w-md rounded-2xl border border-[#F0ECE0] bg-[#FFF4E0]/50 p-1.5"
                  role="tablist"
                  aria-label="Choose year focus"
                >
                  {['y2', 'y3'].map((key) => (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={earlyYear === key}
                      onClick={() => setEarlyYear(key)}
                      className={`relative flex-1 rounded-xl py-3 text-sm font-bold transition-colors ${
                        earlyYear === key ? 'text-[#1A1A1A]' : 'text-[#888888] hover:text-[#555555]'
                      }`}
                    >
                      {earlyYear === key && (
                        <motion.div
                          layoutId="earlyYearTab"
                          className="absolute inset-0 rounded-xl bg-white shadow-[0_4px_24px_rgba(255,149,0,0.2)]"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10">{EARLY_YEAR_TRACKS[key].label}</span>
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={earlyYear}
                    initial={{ opacity: 0, x: 28, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-5 max-w-xl rounded-2xl border border-[#FFB347]/35 bg-gradient-to-br from-white via-[#FFFCF7] to-[#FFF4E0]/70 p-5 shadow-[0_8px_32px_rgba(255,149,0,0.08)]"
                  >
                    <p className="text-sm font-bold text-[#1A1A1A]">{EARLY_YEAR_TRACKS[earlyYear].shortLine}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#555555]">{EARLY_YEAR_TRACKS[earlyYear].detail}</p>
                  </motion.div>
                </AnimatePresence>

                <p className="mb-6 max-w-xl text-sm font-medium leading-relaxed text-[#666666]">
                  See how your prep lines up with what companies actually ask in interviews—then{' '}
                  <span className="font-semibold text-[#CC7000]">focus on the gaps</span> that matter most.
                </p>

                <motion.div
                  className="mb-7 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3"
                  variants={earlyBenefitContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                >
                  {EARLY_BENEFIT_TILES.map((b) => (
                    <motion.div
                      key={b.title}
                      variants={earlyBenefitItem}
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                      className="group relative overflow-hidden rounded-2xl border border-[#F0ECE0] bg-white p-3.5 shadow-sm"
                    >
                      <div
                        className={`absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br ${b.gradient} opacity-20 blur-2xl transition-opacity group-hover:opacity-45`}
                        aria-hidden
                      />
                      <div
                        className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${b.gradient} p-[1px]`}
                      >
                        <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-white">
                          <b.Icon size={16} className="text-[#333333]" strokeWidth={2.2} />
                        </div>
                      </div>
                      <p className="text-xs font-extrabold text-[#1A1A1A]">{b.title}</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-[#777777]">{b.sub}</p>
                    </motion.div>
                  ))}
                </motion.div>

                <button
                  type="button"
                  onClick={goToStartAssessment}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-6 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all hover:bg-[#E88600]"
                >
                  Check prep on my topics — free
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </button>
                <div className="mt-3 max-w-xl space-y-2 text-xs leading-relaxed text-[#555555] sm:text-sm">
                  <p className="font-medium text-[#333333]">When you begin, pick the option that fits you:</p>
                  <p>
                    <span className="font-semibold text-[#FF9500]">2nd and 3rd year</span>
                    {' — '}internships, core subjects, and building readiness before final year.
                  </p>
                  <p>
                    <span className="font-semibold text-[#CC7000]">4th Year</span>
                    {' — '}when placements and full-time hiring are your main focus.
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <AnimatedPrepMapPanel />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════ WHY MENTORMUNI — origin story + urgency (leads the page narrative) ════════════════ */}
      <section className="relative py-16 md:py-20 px-6 border-t border-[#F0ECE0] overflow-hidden bg-gradient-to-b from-[#FFFDF8] to-[#FFF8EE]">
        <div className="pointer-events-none absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[rgba(255,149,0,0.1)] blur-[100px]" aria-hidden />
        <div className="max-w-5xl mx-auto relative">
          <div className="mb-10">
            <StoryLine
              delay={0}
              className="text-xs font-bold text-[#CC7000] uppercase tracking-[0.2em] block mb-3"
              as="span"
            >
              Why MentorMuni
            </StoryLine>
            <StoryLine
              delay={0.07}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1A1A1A] mb-6 leading-[1.15] tracking-tight max-w-3xl"
              as="h2"
            >
              Too many students walk into placement{' '}
              <span className="bg-gradient-to-r from-[#FF9500] to-[#FFB347] bg-clip-text text-transparent">
                before they&apos;ve ever had a real mock.
              </span>
            </StoryLine>

            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              <div className="relative overflow-hidden rounded-2xl border border-orange-200/70 bg-gradient-to-br from-white to-orange-50/30 p-5 shadow-[0_4px_28px_-14px_rgba(234,88,12,0.18)] md:p-6">
                <div
                  className="pointer-events-none absolute inset-y-4 left-0 w-1 rounded-full bg-gradient-to-b from-[#FF9500] to-amber-400/50"
                  aria-hidden
                />
                <StoryLine
                  delay={0.12}
                  className="mb-3 pl-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#B45309]"
                  as="p"
                >
                  What we kept seeing
                </StoryLine>
                <div className="space-y-3 pl-4">
                  <StoryLine
                    delay={0.18}
                    className="relative text-sm leading-relaxed text-[#555555] md:text-[15px]"
                  >
                    We started MentorMuni after seeing the same pattern: final-year students showing up for interviews with almost no structured prep.
                  </StoryLine>
                  <StoryLine
                    delay={0.28}
                    className="relative text-sm leading-relaxed text-[#555555] md:text-[15px]"
                  >
                    No measured baseline, no serious mock round—sometimes no practice speaking answers under pressure.
                  </StoryLine>
                  <StoryLine
                    delay={0.38}
                    className="relative text-sm font-medium leading-relaxed text-[#444444] md:text-[15px]"
                  >
                    The first time they truly get evaluated is often already the real interview—and the rejection email follows.
                  </StoryLine>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-white to-emerald-50/25 p-5 shadow-[0_4px_28px_-14px_rgba(16,185,129,0.12)] md:p-6">
                <div
                  className="pointer-events-none absolute inset-y-4 left-0 w-1 rounded-full bg-gradient-to-b from-emerald-500/80 to-teal-400/40"
                  aria-hidden
                />
                <StoryLine
                  delay={0.22}
                  className="mb-3 pl-4 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800"
                  as="p"
                >
                  Why we built it
                </StoryLine>
                <div className="space-y-3 pl-4">
                  <StoryLine
                    delay={0.3}
                    className="relative text-sm leading-relaxed text-[#555555] md:text-[15px]"
                  >
                    Hiring is tighter and panels are unforgiving. You don&apos;t get unlimited shots.
                  </StoryLine>
                  <StoryLine
                    delay={0.4}
                    className="relative text-sm leading-relaxed text-[#555555] md:text-[15px]"
                  >
                    That&apos;s why we built MentorMuni so you can go in at full strength:
                  </StoryLine>
                  <StoryLine
                    delay={0.5}
                    className="relative text-sm font-semibold leading-relaxed text-[#1A1A1A] md:text-[15px]"
                  >
                    Interview readiness check, AI mock interviews, and mentor-backed prep—all before the rounds that actually count.
                  </StoryLine>
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {[
              { icon: '🎤', title: 'First “real” round was never mocked', line: 'Many students never ran a serious mock interview before facing a panel.', tint: 'from-red-500/10 to-transparent border-red-500/20' },
              { icon: '📉', title: 'Fewer interviews, same crowd', line: 'Open roles are harder to land—walking in under-prepared costs more than before.', tint: 'from-amber-500/10 to-transparent border-amber-500/25' },
              { icon: '📊', title: 'Rejection without a map', line: 'Without a readiness score, you don’t know what to fix first—only that it “went badly.”', tint: 'from-[#FF9500]/12 to-transparent border-[#FFB347]/30' },
              { icon: '✅', title: '100% prep before Day 1', line: 'Measure gaps, practice out loud, then close them with mentorship—before real interviews.', tint: 'from-emerald-500/10 to-transparent border-emerald-500/25' },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.06}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className={`h-full rounded-2xl border bg-gradient-to-br ${item.tint} p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]`}
                >
                  <span className="text-2xl" aria-hidden>{item.icon}</span>
                  <h3 className="mt-2 font-bold text-[#1A1A1A] text-sm">{item.title}</h3>
                  <p className="mt-1 text-xs text-[#666666] leading-relaxed">{item.line}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.15}>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5 md:p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-3">Showing up under-prepared</p>
                <ul className="space-y-2.5">
                  {[
                    'Placement season without a real mock interview or timed practice',
                    'No readiness benchmark—only hope after every rejection',
                    'Cramming topics instead of fixing the gaps the panel actually tests',
                  ].map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-[#555555]">
                      <X size={14} className="text-red-500 shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.05] p-5 md:p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-3">Going in with MentorMuni</p>
                <ul className="space-y-2.5">
                  {[
                    'Free interview readiness check—a clear score and what to fix first',
                    'AI mock interviews so your first “real” panel isn’t your first time under pressure',
                    'Mentorship to close gaps and align prep to the companies you’re targeting',
                  ].map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-[#555555]">
                      <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.22}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#F0ECE0] bg-white p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
              <p className="text-sm md:text-base text-[#444444] font-medium max-w-xl">
                Don’t use real interviews as practice. Start with the free check—then stack mocks and mentors until you’re ready for the panel.
              </p>
              <button
                type="button"
                onClick={goToStartAssessment}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-colors hover:bg-[#E88600]"
              >
                {PRIMARY_CTA_LABEL}
                <ArrowRight size={16} />
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ HOW IT WORKS — what we give (after the “why”) ════════════════ */}
      <section className="py-14 px-6 border-t border-[#F0ECE0]">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <span className="text-xs font-bold text-[#FF9500] uppercase tracking-widest block mb-3">How it works</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] mb-2">What we give you—before you face the real panel</h2>
            <p className="text-[#666666] text-sm mb-4 max-w-2xl leading-relaxed">
              One flow: measure with the readiness check, practice with AI mocks, polish with ATS and AI-tool fluency, and go deeper with mentor-backed prep when you want a human in your corner.
            </p>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF9500] hover:text-[#E88600] transition-colors mb-10"
            >
              Full step-by-step walkthrough <ArrowRight size={14} />
            </Link>
          </FadeUp>
          <div className="grid md:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.07}>
                <div className="group flex gap-4 bg-white border border-[#F0ECE0] shadow-[0_2px_12px_rgba(0,0,0,0.05)] rounded-2xl p-6 hover:border-[#FFB347] transition-all h-full">
                  <div className="w-10 h-10 bg-[#FFF4E0] border border-[#F0ECE0] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFF8EE] transition-colors mt-0.5">
                    <f.Icon size={18} className="text-[#FF9500]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="font-bold text-[#1A1A1A] text-sm">{f.title}</h3>
                      <span className="text-[9px] font-bold text-[#CC7000] bg-[#FFF4E0] border border-[#F0ECE0] rounded px-1.5 py-0.5 uppercase tracking-wider">{f.tag}</span>
                    </div>
                    <p className="text-[#666666] text-xs leading-relaxed mb-2">{f.desc}</p>
                    <span className="text-[10px] font-semibold text-[#1A8C55]">{f.highlight}</span>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.3}>
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={goToStartAssessment}
                className="inline-flex items-center gap-2 bg-[#FF9500] hover:bg-[#E88600] text-white font-bold px-7 py-3.5 rounded-xl transition-colors text-sm shadow-[0_4px_14px_rgba(255,149,0,0.25)]"
              >
                {PRIMARY_CTA_LABEL} <ArrowRight size={15} />
              </button>
              <p className="text-xs text-[#666666] mt-2">No signup · 5 minutes · Instant score</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ STUDENT STORIES — animated cards ════════════════ */}
      <section className="relative overflow-hidden border-t border-[#F0ECE0] bg-gradient-to-b from-[#FFFDF8] via-[#FFFCF7] to-[#FFF8EE] py-14 md:py-16 px-6">
        <div className="pointer-events-none absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-[rgba(255,149,0,0.15)] blur-[100px]" aria-hidden />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[rgba(8,145,178,0.1)] blur-[90px]" aria-hidden />

        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 text-center md:text-left"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#FFB347]/35 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-sm md:mb-4">
              <Sparkles size={14} className="text-[#FF9500]" aria-hidden />
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#CC7000]">
                Real voices
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#1A1A1A] md:text-3xl">
              What changes{' '}
              <span className="bg-gradient-to-r from-[#FF9500] to-[#E88600] bg-clip-text text-transparent">
                after the assessment
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#666666] md:mx-0">
              Paraphrased from students who used the readiness check and mocks. Initials only; names withheld.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-5 md:grid-cols-3 md:gap-6"
            variants={studentStoriesContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
          >
            {STUDENT_SNIPPETS.map((t) => {
              const CardIcon = t.Icon;
              return (
                <motion.article
                  key={`${t.avatar}-${t.tag}`}
                  variants={studentStoryCard}
                  whileHover={{
                    y: -10,
                    transition: { type: 'spring', stiffness: 420, damping: 28 },
                  }}
                  className="group relative flex h-full flex-col"
                >
                  <div
                    className={`pointer-events-none absolute -inset-0.5 rounded-3xl bg-gradient-to-br ${t.gradient} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70`}
                    aria-hidden
                  />
                  <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#F0ECE0] bg-white/90 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-md transition-all duration-300 group-hover:border-[#FFB347]/45 group-hover:shadow-[0_16px_48px_rgba(255,149,0,0.14)] md:p-6">
                    <div className="absolute right-4 top-4 text-[4rem] font-serif font-bold leading-none text-[#FF9500]/[0.07] transition-transform duration-500 group-hover:scale-110 group-hover:text-[#FF9500]/10">
                      &ldquo;
                    </div>

                    <div className="relative mb-4 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="flex h-12 w-12 items-center justify-center rounded-2xl text-base font-bold text-white shadow-md ring-2 ring-white/80"
                          style={{ background: t.bg }}
                          whileHover={{ scale: 1.08, rotate: [-2, 2, 0] }}
                          transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                          aria-hidden
                        >
                          {t.avatar}
                        </motion.div>
                        <div>
                          <p className="text-sm font-bold text-[#1A1A1A]">Student {t.avatar}</p>
                          <p className="text-xs text-[#888888]">{t.tag}</p>
                        </div>
                      </div>
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${t.gradient} p-[1px] shadow-sm`}
                      >
                        <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-white/95">
                          <CardIcon size={18} className="text-[#444444]" strokeWidth={2} aria-hidden />
                        </div>
                      </div>
                    </div>

                    <p className="relative mb-3 inline-flex w-fit rounded-full bg-[#FFF4E0] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#CC7000] ring-1 ring-[#FFB347]/30">
                      {t.insight}
                    </p>
                    <p className="relative text-[15px] leading-relaxed text-[#3d3d3d]">{t.text}</p>

                    <div
                      className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#FF9500] to-[#FFB347] transition-transform duration-300 ease-out group-hover:scale-x-100"
                      aria-hidden
                    />
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ MENTORS — INDUSTRY EXPERTS ════════════════ */}
      <section className="py-14 px-6 border-t border-[#F0ECE0]">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <FadeUp>
              <span className="text-xs font-bold text-[#CC7000] uppercase tracking-widest block mb-3">Expert Mentorship</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] mb-3 leading-tight">
                Mentors with 12–15 years<br />
                <span className="text-[#FF9500]">of industry experience.</span>
              </h2>
              <p className="text-[#666666] leading-relaxed mb-6 text-sm">
                Our mentors are senior engineers and tech leads from India's leading IT companies with over a decade of industry experience. They have conducted hundreds of interviews — and bring that perspective directly to your preparation.
              </p>
              <div className="space-y-4 mb-7">
                {[
                  { Icon: Brain, title: 'They know what the interviewer is actually testing', desc: "After 12+ years, they've conducted hundreds of interviews. They'll tell you exactly what an answer needs — not what sounds good." },
                  { Icon: Cpu, title: 'They teach AI tools in real workflows', desc: 'Our mentors use GitHub Copilot, ChatGPT, and Claude daily. They teach you not just how to use these tools but how to talk about them in interviews — a skill most freshers completely lack.' },
                  { Icon: Target, title: 'Company-specific pattern knowledge', desc: 'TCS Digital vs TCS NQT. Cognizant GenC vs GenC Pro. Infosys SP vs DSP. Each track asks different things. Your mentor knows them all.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-3 items-start">
                    <div className="w-8 h-8 bg-[#FFF4E0] border border-[#F0ECE0] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.Icon size={14} className="text-[#FF9500]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1A1A1A] text-sm mb-0.5">{item.title}</p>
                      <p className="text-[#888888] text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/mentors" className="inline-flex items-center gap-1.5 bg-[#FF9500] hover:bg-[#E88600] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-[0_4px_14px_rgba(255,149,0,0.25)]">
                Meet the mentors <ArrowRight size={15} />
              </Link>
            </FadeUp>

            <FadeUp delay={0.12}>
              <p className="text-xs text-[#888888] uppercase tracking-wider mb-4 font-medium">What you get with every mentor</p>

              {/* Mentor strengths — student-facing */}
              <div className="space-y-3 mb-5">
                {[
                  { icon: '🏢', label: '10–15 years in the industry', desc: 'Senior engineers and tech leads, not freshers. They have been the interviewer, not just the interviewee.' },
                  { icon: '🎯', label: 'Conducted 100+ interviews themselves', desc: 'They know exactly what interviewers are looking for — because they\'ve been on that side of the table.' },
                  { icon: '🤖', label: 'Actively using AI tools in current role', desc: 'GitHub Copilot, ChatGPT, Cursor — daily. They teach you to use and talk about AI the way interviewers expect today.' },
                  { icon: '📱', label: 'WhatsApp access throughout', desc: 'Not just during sessions. Reachable for quick doubts, mock Q&A, and morale support all week.' },
                ].map(c => (
                  <div key={c.label} className="flex gap-3 items-start bg-white border border-[#F0ECE0] shadow-[0_2px_12px_rgba(0,0,0,0.05)] rounded-xl p-3.5">
                    <span className="text-lg mt-0.5">{c.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-[#1A1A1A] mb-0.5">{c.label}</p>
                      <p className="text-xs text-[#888888] leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Honest launch notice */}
              <div className="bg-[#FFF4E0] border border-[#F0ECE0] rounded-xl p-4">
                <p className="text-xs font-bold text-[#CC7000] mb-1">✦ Mentorship cohorts · Waitlist open</p>
                <p className="text-xs text-[#666666] leading-relaxed">
                  We&apos;re onboarding mentors in batches. Join the waitlist—you&apos;ll be matched based on your readiness profile when your cohort opens.
                </p>
                <Link to="/waitlist" className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-[#FF9500] hover:text-[#E88600] transition-colors">
                  Join the waitlist → <ArrowRight size={11} />
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ════════════════ FINAL CTA ════════════════ */}
      <section className="py-16 px-6 border-t border-[#F0ECE0]">
        <div className="max-w-2xl mx-auto text-center">
          <FadeUp>
            <span className="text-xs font-bold text-[#1A8C55] uppercase tracking-widest block mb-4">Free · 5 Minutes · Instant Result</span>
            <p className="mb-4 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-orange-200/70 bg-gradient-to-r from-orange-50/95 to-amber-50/80 px-4 py-2.5 text-center text-[12px] font-semibold leading-snug text-neutral-900 shadow-sm sm:text-sm">
              <Gift size={16} className="shrink-0 text-[#EA580C]" aria-hidden />
              {READINESS_TEST_COUPON_BADGE}
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] mb-4 leading-tight">
              Know your readiness score.
              <br />
              <span className="text-[#FF9500]">Walk into your interview prepared.</span>
            </h2>
            <p className="text-[#666666] mb-8 leading-relaxed text-sm max-w-lg mx-auto">
              A strong score means you walk in with confidence. A low score gives you a clear, prioritised plan to improve — with enough time before your placement season to act on it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <button
                type="button"
                onClick={goToStartAssessment}
                className="flex items-center justify-center gap-2 bg-[#FF9500] hover:bg-[#E88600] text-white font-bold px-8 py-4 rounded-xl shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all text-sm"
              >
                {PRIMARY_CTA_LABEL} <ArrowRight size={16} />
              </button>
              <Link
                to="/waitlist"
                className="flex items-center justify-center gap-2 border border-[#FF9500] hover:bg-[#FFF4E0] text-[#FF9500] font-medium px-7 py-4 rounded-xl transition-all text-sm"
              >
                Join the mentorship waitlist
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
              {['No signup needed', 'Free forever', '5 min test', 'Instant score + roadmap'].map(t => (
                <span key={t} className="flex items-center gap-1 text-xs text-[#666666]">
                  <Check size={10} className="text-[#1A8C55]" /> {t}
                </span>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ FOR COLLEGES ════════════════ */}
      <section className="py-14 px-6 border-t border-[#F0ECE0]">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-[#888888] uppercase tracking-wider font-medium text-center mb-5">Are you a placement officer?</p>
          <FadeUp>
            <div className="bg-white border border-[#F0ECE0] shadow-[0_2px_12px_rgba(0,0,0,0.05)] rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-12 h-12 bg-[#E8F3FF] rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 size={22} className="text-[#1A6FC4]" />
              </div>
              <div>
                <p className="text-xs text-[#1A6FC4] font-medium mb-1">For placement officers & TPOs</p>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">MentorMuni for Colleges</h3>
                <p className="text-[#444444] text-sm leading-relaxed mb-5">
                  Give your entire batch a readiness score before placement season. Identify who
                  needs what, track improvement week over week, and go in prepared — not hoping.
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  {[
                    { Icon: Users, label: 'Batch readiness dashboard' },
                    { Icon: BarChart3, label: 'Per-student tracking' },
                    { Icon: GraduationCap, label: 'Placement stats reporting' },
                  ].map(f => (
                    <span key={f.label} className="flex items-center gap-1.5 text-xs text-[#666666]">
                      <f.Icon size={12} className="text-[#888888]" /> {f.label}
                    </span>
                  ))}
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-[#1A6FC4] hover:bg-[#155a9e] px-5 py-2.5 rounded-xl transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
                >
                  Request a demo <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer className="border-t border-[#F0ECE0] bg-[#FFF8EE] py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="md:col-span-2">
              <h3 className="font-bold text-[#1A1A1A] mb-2">Mentor<span className="text-[#FF9500]">Muni</span></h3>
              <p className="text-[#666666] text-sm leading-relaxed mb-4 max-w-xs">
                {MISSION_TAGLINE}
              </p>
              <div className="mb-4 max-w-sm rounded-xl border border-orange-200/60 bg-white/90 px-3 py-3 shadow-sm">
                <div className="flex gap-2.5">
                  <Gift className="h-4 w-4 shrink-0 text-[#CC7000] mt-0.5" aria-hidden />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A3412] mb-1">Limited offer</p>
                    <p className="text-xs text-[#555555] leading-snug mb-2">{READINESS_TEST_COUPON_BADGE}</p>
                    <button
                      type="button"
                      onClick={goToStartAssessment}
                      className="text-xs font-semibold text-[#FF9500] hover:text-[#E88600] transition-colors"
                    >
                      Take the test →
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-[#666666]">
                <a href="mailto:hello@mentormuni.com" className="flex items-center gap-2 hover:text-[#FF9500] transition-colors">
                  <Mail size={13} /> hello@mentormuni.com
                </a>
                <a href={CONTACT_PHONE_HREF} className="flex items-center gap-2 hover:text-[#FF9500] transition-colors">
                  <Phone size={13} /> {CONTACT_PHONE_DISPLAY}
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#888888] mb-3">Tools</p>
              <ul className="space-y-2 text-sm text-[#666666]">
                <li>
                  <button
                    type="button"
                    onClick={goToStartAssessment}
                    className="hover:text-[#FF9500] transition-colors text-left bg-transparent border-0 p-0 cursor-pointer text-inherit font-inherit"
                  >
                    {PRODUCT_READINESS_SCORE}
                  </button>
                </li>
                <li><Link to="/mock-interviews" className="hover:text-[#FF9500] transition-colors">Mock Interviews</Link></li>
                <li><Link to="/skill-gap-analyzer" className="hover:text-[#FF9500] transition-colors">Skill Gap Analyzer</Link></li>
                <li><Link to="/resume-analyzer" className="hover:text-[#FF9500] transition-colors">Resume Analyzer</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#888888] mb-3">Learn</p>
              <ul className="space-y-2 text-sm text-[#666666]">
                <li><Link to="/free-tutorials" className="hover:text-[#FF9500] transition-colors">Free Tutorials</Link></li>
                <li><Link to="/learning-paths" className="hover:text-[#FF9500] transition-colors">Learning Paths</Link></li>
                <li><Link to="/placement-tracks" className="hover:text-[#FF9500] transition-colors">Placement Tracks</Link></li>
                <li><Link to="/outcomes" className="hover:text-[#FF9500] transition-colors">Outcomes</Link></li>
                <li><Link to="/leadership-board" className="hover:text-[#FF9500] transition-colors">Leadership Board</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#888888] mb-3">Company</p>
              <ul className="space-y-2 text-sm text-[#666666]">
                <li><Link to="/contact" className="hover:text-[#FF9500] transition-colors">Contact</Link></li>
                <li><Link to="/pricing" className="hover:text-[#FF9500] transition-colors">Pricing</Link></li>
                <li><Link to="/mentors" className="hover:text-[#FF9500] transition-colors">Mentorship</Link></li>
                <li><Link to="/for-recruiters" className="hover:text-[#FF9500] transition-colors">For Recruiters</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#F0ECE0] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#666666]">
            <p>© {new Date().getFullYear()} MentorMuni. All rights reserved.</p>
            <div className="flex gap-5">
              <Link to="/contact" className="hover:text-[#FF9500] transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-[#FF9500] transition-colors">Privacy</Link>
              <Link to="/contact" className="hover:text-[#FF9500] transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
