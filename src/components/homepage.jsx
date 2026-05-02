import React, { useRef, createElement, useState, useEffect } from 'react';
import { motion, useInView, useReducedMotion, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import { goToStartAssessment } from '../utils/startAssessmentNavigation';
import {
  PRIMARY_CTA_LABEL,
  SECONDARY_CTA_BOOK_CALL,
  HERO_EYEBROW,
  HERO_EARLY_BIRD_STICKER,
  HERO_GENZ_STICKER,
  HERO_YEAR_COPY,
  HERO_HEADLINE_LINE1,
  HERO_HEADLINE_LINE2,
  HERO_PLAYFUL_CLAUSE,
  HERO_TYPEWRITER_PHRASES,
  HERO_JOURNEY_STEPS,
  HERO_JOURNEY_ARC,
  HERO_PROOF_BULLETS,
  HERO_PLATFORM_HIGHLIGHTS,
  MISSION_TAGLINE,
  PRODUCT_READINESS_SCORE,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  REAL_PROBLEM_EYEBROW,
  REAL_PROBLEM_HEADLINE,
  REAL_PROBLEM_SUB,
  REAL_PROBLEM_CARDS,
  COMPARISON_TABLE_EYEBROW,
  COMPARISON_TABLE_HEADLINE,
  COMPARISON_TABLE_SUB,
  COMPARISON_TABLE_FEATURE_COL_LABEL,
  COMPARISON_TABLE_BRANDS,
  COMPARISON_TABLE_ROWS,
  REALITY_CHECK_EYEBROW,
  REALITY_CHECK_HEADLINE,
  REALITY_CHECK_SUB,
  REALITY_CHECK_NOT_TITLE,
  REALITY_CHECK_FOR_TITLE,
  REALITY_CHECK_NOT_ITEMS,
  REALITY_CHECK_FOR_ITEMS,
  PROGRAM_6WEEK_EYEBROW,
  PROGRAM_6WEEK_HEADLINE,
  PROGRAM_6WEEK_SUB,
  PROGRAM_6WEEK_PHASES,
  PROGRAM_6WEEK_CARD_BADGE,
  PROGRAM_6WEEK_CARD_TITLE,
  PROGRAM_6WEEK_PRICE_MAIN,
  PROGRAM_6WEEK_PRICE_MAIN_SUFFIX,
  PROGRAM_6WEEK_PRICE_STRIKE,
  PROGRAM_6WEEK_SUMMARY,
  READINESS_TEST_COUPON_BADGE,
  FINAL_CTA_HEADLINE,
  FINAL_CTA_HEADLINE_ACCENT,
  FINAL_CTA_BODY,
  HOW_IT_WORKS_HEADLINE,
  HOW_IT_WORKS_SUB,
  HOMEPAGE_MENTORS_TO_CTA_BRIDGE,
} from '../constants/brandCopy';
import { AnimatedPrepMapPanel } from './homepage/prepMapPanel';
import { HeroFlagshipVisual } from './homepage/HeroFlagshipVisual';
import { HeroHeadlineTypewriter } from './homepage/HeroHeadlineTypewriter';
import { HeroLoopVideo } from './homepage/HeroLoopVideo';

import {
  ArrowRight, Brain, Target,
  BarChart3, Cpu,
  GraduationCap, Building2, Users,
  Mail, Phone, Check, X,
  BookOpen, Sparkles, Mic2,
  Gift, Clock, TrendingUp, AlertTriangle, Compass,
  Handshake,
} from 'lucide-react';

/** Icons aligned with HERO_PLATFORM_HIGHLIGHTS order (homepage value grid) */
const HERO_PLATFORM_HIGHLIGHT_ICONS = [
  GraduationCap,
  Users,
  Mic2,
  Cpu,
  Handshake,
  Target,
  BarChart3,
  Sparkles,
];

const heroValueSpring = { type: 'spring', stiffness: 420, damping: 28, mass: 0.85 };

/** Per-tile accent — bright light cards with vivid color pops */
const HERO_PLATFORM_TILE_THEMES = [
  {
    card: 'border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-orange-50/60 shadow-[0_4px_24px_-8px_rgba(251,191,36,0.25)]',
    icon: 'from-amber-400 to-orange-500 shadow-[0_6px_20px_-4px_rgba(251,191,36,0.5)]',
    glow: 'bg-amber-400/15',
    text: 'text-amber-900',
    line: 'from-amber-400 via-orange-400 to-amber-500',
  },
  {
    card: 'border-sky-200/80 bg-gradient-to-br from-sky-50 via-white to-cyan-50/60 shadow-[0_4px_24px_-8px_rgba(56,189,248,0.25)]',
    icon: 'from-sky-400 to-blue-500 shadow-[0_6px_20px_-4px_rgba(56,189,248,0.5)]',
    glow: 'bg-sky-400/15',
    text: 'text-sky-900',
    line: 'from-sky-400 via-cyan-400 to-sky-500',
  },
  {
    card: 'border-rose-200/80 bg-gradient-to-br from-rose-50 via-white to-pink-50/60 shadow-[0_4px_24px_-8px_rgba(251,113,133,0.25)]',
    icon: 'from-rose-400 to-pink-500 shadow-[0_6px_20px_-4px_rgba(251,113,133,0.5)]',
    glow: 'bg-rose-400/15',
    text: 'text-rose-900',
    line: 'from-rose-400 via-pink-400 to-rose-500',
  },
  {
    card: 'border-violet-200/80 bg-gradient-to-br from-violet-50 via-white to-purple-50/60 shadow-[0_4px_24px_-8px_rgba(167,139,250,0.25)]',
    icon: 'from-violet-400 to-purple-500 shadow-[0_6px_20px_-4px_rgba(167,139,250,0.5)]',
    glow: 'bg-violet-400/15',
    text: 'text-violet-900',
    line: 'from-violet-400 via-purple-400 to-violet-500',
  },
  {
    card: 'border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-teal-50/60 shadow-[0_4px_24px_-8px_rgba(52,211,153,0.25)]',
    icon: 'from-emerald-400 to-teal-500 shadow-[0_6px_20px_-4px_rgba(52,211,153,0.5)]',
    glow: 'bg-emerald-400/15',
    text: 'text-emerald-900',
    line: 'from-emerald-400 via-teal-400 to-emerald-500',
  },
  {
    card: 'border-blue-200/80 bg-gradient-to-br from-blue-50 via-white to-indigo-50/60 shadow-[0_4px_24px_-8px_rgba(96,165,250,0.25)]',
    icon: 'from-blue-400 to-indigo-500 shadow-[0_6px_20px_-4px_rgba(96,165,250,0.5)]',
    glow: 'bg-blue-400/15',
    text: 'text-blue-900',
    line: 'from-blue-400 via-indigo-400 to-blue-500',
  },
  {
    card: 'border-teal-200/80 bg-gradient-to-br from-teal-50 via-white to-cyan-50/60 shadow-[0_4px_24px_-8px_rgba(45,212,191,0.25)]',
    icon: 'from-teal-400 to-cyan-500 shadow-[0_6px_20px_-4px_rgba(45,212,191,0.5)]',
    glow: 'bg-teal-400/15',
    text: 'text-teal-900',
    line: 'from-teal-400 via-cyan-400 to-teal-500',
  },
  {
    card: 'border-fuchsia-200/80 bg-gradient-to-br from-fuchsia-50 via-white to-pink-50/60 shadow-[0_4px_24px_-8px_rgba(232,121,249,0.25)]',
    icon: 'from-fuchsia-400 to-purple-500 shadow-[0_6px_20px_-4px_rgba(232,121,249,0.5)]',
    glow: 'bg-fuchsia-400/15',
    text: 'text-fuchsia-900',
    line: 'from-fuchsia-400 via-purple-400 to-fuchsia-500',
  },
];

const HERO_PLATFORM_HIGHLIGHT_DETAILS = [
  'End-to-end preparation system, not disconnected tools.',
  'Built for campus hiring timelines and pressure.',
  'Practice responses in realistic interview conditions.',
  'Train both technical depth and communication clarity.',
  'Guidance from experienced mentors who have hired.',
  'Measure where you stand before real rounds.',
  'Identify exactly which skills need improvement first.',
  'AI + mentors together for faster performance gains.',
];

const HERO_PROBLEM_TICKER = [
  'Scattered preparation',
  'No interview baseline',
  'Generic practice plans',
  'Weak answer delivery',
  'Last-minute panic preparation',
  'No clear improvement loop',
  'No clarity on role-fit',
  'Inconsistent mock feedback',
];

function homepagePosterAsset(filename) {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
  return `${base}MentorMuni-React-Frontend/images/poster-carousel/${filename}`;
}

const HERO_FLOW_STEPS = [
  {
    title: 'Take the free score',
    body: 'Get your interview-readiness baseline in about 5 minutes.',
  },
  {
    title: 'See exact gaps',
    body: 'Know what to fix first instead of random preparation.',
  },
  {
    title: 'Practice to perform',
    body: 'Use mocks and mentor feedback to improve answer delivery.',
  },
];

/** Premium animated “platform stack” strip — mesh, gradient border, spring cards */
function HeroValueStack({ reduceMotion }) {
  const cardSpringHover = reduceMotion ? {} : { y: -6, scale: 1.02, transition: heroValueSpring };
  const cardTap = reduceMotion ? {} : { scale: 0.99 };

  return (
    <>
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-8 w-full sm:mt-10"
        aria-label="What MentorMuni offers"
      >
        <div className="relative mx-auto max-w-5xl">
          <div
            className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-sky-400/10 blur-[120px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-teal-400/10 blur-[100px]"
            aria-hidden
          />

          <div className="relative px-4 py-8 sm:px-7 sm:py-10 lg:px-10">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
              className="mb-10 flex flex-col items-center gap-4 text-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#1A8FC4]/20 bg-[#1A8FC4]/[0.08] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1A8FC4] sm:text-[11px]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Platform stack
              </span>
              <h2 className="max-w-3xl text-balance text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                Everything in one place, from{' '}
                <span className="bg-gradient-to-r from-[#1A8FC4] to-[#2AAA8A] bg-clip-text text-transparent">
                  practice to performance.
                </span>
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Built so students walk into interviews with clarity, confidence, and repeatable performance.
              </p>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
                <span className="rounded-full border border-[#1A8FC4]/25 bg-[#1A8FC4]/[0.06] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#15799F]">
                  8 integrated modules
                </span>
                <span className="rounded-full border border-[#2AAA8A]/25 bg-[#2AAA8A]/[0.06] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#2AAA8A]">
                  1 clear interview workflow
                </span>
              </div>
            </motion.div>

            <motion.ul
              initial={reduceMotion ? 'visible' : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: reduceMotion ? 0 : 0.065,
                    delayChildren: reduceMotion ? 0 : 0.12,
                  },
                },
              }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {HERO_PLATFORM_HIGHLIGHTS.map((item, idx) => {
                const Icon = HERO_PLATFORM_HIGHLIGHT_ICONS[idx] ?? Sparkles;
                const theme = HERO_PLATFORM_TILE_THEMES[idx % HERO_PLATFORM_TILE_THEMES.length];
                return (
                  <motion.li
                    key={item}
                    custom={idx}
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: 32,
                        filter: reduceMotion ? 'none' : 'blur(8px)',
                      },
                      visible: (i) => ({
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        transition: {
                          delay: reduceMotion ? 0 : i * 0.04,
                          duration: 0.65,
                          ease: [0.16, 1, 0.3, 1],
                        },
                      }),
                    }}
                    className="list-none"
                  >
                    <motion.div
                      whileHover={reduceMotion ? undefined : cardSpringHover}
                      whileTap={reduceMotion ? undefined : cardTap}
                      className={`group relative flex h-full min-h-[9rem] flex-col overflow-hidden rounded-2xl border p-5 transition-shadow duration-300 hover:shadow-xl sm:min-h-0 ${theme.card}`}
                    >
                      <div
                        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-opacity duration-500 group-hover:opacity-100 ${theme.glow} opacity-60`}
                        aria-hidden
                      />
                      <div className="relative mb-3">
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg] ${theme.icon}`}
                        >
                          <Icon className="h-5 w-5 text-white drop-shadow-sm" strokeWidth={2} aria-hidden />
                        </span>
                      </div>
                      <div className="relative min-w-0 flex-1 text-left">
                        <p className={`text-[13px] font-bold leading-snug sm:text-sm ${theme.text}`}>{item}</p>
                        <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                          {HERO_PLATFORM_HIGHLIGHT_DETAILS[idx]}
                        </p>
                      </div>
                      <div
                        className={`pointer-events-none absolute bottom-0 left-5 right-5 h-[2px] origin-left scale-x-0 bg-gradient-to-r opacity-0 transition-all duration-500 ease-out group-hover:scale-x-100 group-hover:opacity-100 ${theme.line}`}
                        aria-hidden
                      />
                    </motion.div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>
        </div>
      </motion.section>
    </>
  );
}

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
const StoryLine = ({ children, className = '', delay = 0, as: Comp = 'p' }) => {
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
      {createElement(Comp, { className }, children)}
    </motion.div>
  );
};

/** Comparison matrix cell: check / X / orange partial label */
const ComparisonTableCell = ({ value }) => {
  if (value === 'yes') {
    return (
      <span className="inline-flex w-full justify-center">
        <Check className="h-5 w-5 text-emerald-600" strokeWidth={2.5} aria-hidden />
        <span className="sr-only">Yes</span>
      </span>
    );
  }
  if (value === 'no') {
    return (
      <span className="inline-flex w-full justify-center">
        <X className="h-5 w-5 text-red-500" strokeWidth={2.5} aria-hidden />
        <span className="sr-only">No</span>
      </span>
    );
  }
  return (
    <span className="block text-center text-xs font-semibold text-[#1A8FC4] sm:text-sm">{value}</span>
  );
};

/* ─── How it works — feature cards (homepage) ───────────────────────────── */
const FEATURES = [
  {
    Icon: Brain,
    tag: 'PRIMARY PATH',
    title: 'Free reality check (readiness score)',
    desc: 'One spine for everything else: measure first, see the gap, then decide how hard you want to push. This is the step most students skip — then they wonder why interviews feel random.',
    highlight: 'Start here · ~5 min · No signup',
  },
  {
    Icon: Cpu,
    tag: 'PERFORMANCE',
    title: 'AI mock interviews',
    desc: 'Voice practice with scoring — secondary to the reality check, but where “I knew it” turns into “I said it well under pressure.”',
    highlight: 'Reps that feel like a real panel',
  },
  {
    Icon: BarChart3,
    tag: 'SCREENING',
    title: 'Resume ATS checker',
    desc: 'See how software reads you before a human does. Supporting tool — not a substitute for interview performance.',
    highlight: 'Keywords + structure fixes',
  },
  {
    Icon: BookOpen,
    tag: 'REFERENCE',
    title: 'Tutorials & AI-tool angles',
    desc: 'Topic refreshers when you need them. Not the main event — the main event is performing in the room.',
    highlight: 'Free paths · Panel-ready framing',
    link: '/free-tutorials',
    linkLabel: 'Browse tutorials',
  },
];

/* ─── Student voices — anonymised; each has a clear before/after ───────── */
const STUDENT_SNIPPETS = [
  {
    avatar: 'V',
    bg: '#1A8FC4',
    gradient: 'from-[#1A8FC4] via-[#2AAA8A] to-[#7DD3C0]',
    tag: '4th Year · CSE',
    insight: 'Named the real gap',
    text: 'Seniors kept saying “practice more,” but nobody said what to practice. The readiness breakdown pointed at System Design—not everything at once—so I could prepare with a target instead of a guess.',
    proofMetric: 'Proof: readiness 42% → 78% after 4 weeks focused on one gap',
    Icon: Target,
  },
  {
    avatar: 'R',
    bg: '#0891b2',
    gradient: 'from-cyan-500 via-sky-400 to-teal-400',
    tag: 'Final Year · IT',
    insight: 'Feedback on how you sound',
    text: 'The mock was blunt: my answers sounded memorised, not understood. I changed how I open and structure answers under pressure—not just the facts inside them.',
    proofMetric: 'Proof: 12+ full mock rounds before first real onsite',
    Icon: Mic2,
  },
  {
    avatar: 'S',
    bg: '#059669',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    tag: '3rd Year · CSE',
    insight: 'Specific weak spot',
    text: 'The score split my DSA by pattern and showed strings were the weak link. Random LeetCode never made that obvious; I finally knew what to drill instead of grinding everything.',
    proofMetric: 'Proof: DSA bucket 38% → 71% in three weeks of targeted drills',
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

/* ─── Early-years section — consequence-led copy (no year tabs) ───────────────── */
const EARLY_SECTION_COPY = {
  shortLine: "Know What's Missing Before It Costs You an Interview",
  detail:
    'See how your preparation compares to real interview expectations—and identify the exact gaps you need to fix.',
};

const EARLY_BENEFIT_TILES = [
  {
    Icon: Target,
    title: 'What companies actually ask',
    sub: 'Understand how your preparation compares to real panels—not generic textbook lists.',
    gradient: 'from-[#1A8FC4] to-[#2AAA8A]',
  },
  {
    Icon: BarChart3,
    title: 'Your readiness score',
    sub: 'A clear read on strengths, weak areas, and where you stand before drives.',
    gradient: 'from-[#0891b2] to-[#22d3ee]',
  },
  {
    Icon: AlertTriangle,
    title: 'Gap identification',
    sub: "Spot what's stopping you from performing when questions turn real—not when you're revising alone.",
    gradient: 'from-[#c2410c] to-[#fb923c]',
  },
  {
    Icon: Compass,
    title: 'What to fix first',
    sub: "High-impact topics and order—so you don't scatter effort across everything at once.",
    gradient: 'from-[#059669] to-[#34d399]',
  },
];

const EARLY_SECTION_MICRO_INFO = '~5 min · Free · Revisit anytime';

const EARLY_SECTION_CTA_HOOK = "Most students think they're ready. This shows the truth.";

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

const SOCIAL_PROOF_COUNT = 100;

/** Hero line under subShort — avatar stack + count-up; `fullLabel` for a11y */
function HeroSocialProof({ fullLabel, reduceMotion }) {
  const [count, setCount] = useState(reduceMotion ? SOCIAL_PROOF_COUNT : 0);

  useEffect(() => {
    if (reduceMotion) {
      setCount(SOCIAL_PROOF_COUNT);
      return;
    }
    const ctrl = animate(0, SOCIAL_PROOF_COUNT, {
      duration: 1.15,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [reduceMotion]);

  const rings = [
    { className: 'bg-gradient-to-br from-[#1A8FC4] to-[#2AAA8A]' },
    { className: 'bg-gradient-to-br from-[#0891b2] to-[#0e7490]' },
    { className: 'bg-gradient-to-br from-[#2AAA8A] to-[#1A8FC4]' },
  ];

  return (
    <motion.div
      className="mt-3 flex flex-col items-center gap-3.5 sm:flex-row sm:items-center sm:justify-start sm:gap-4"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      aria-label={fullLabel}
    >
      <div className="flex shrink-0 items-center pl-0.5" aria-hidden>
        {rings.map((ring, i) => (
          <motion.span
            key={i}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.6, x: -16 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.12 + i * 0.1,
              duration: 0.45,
              type: 'spring',
              stiffness: 380,
              damping: 24,
            }}
            className={`relative h-9 w-9 rounded-full border-[3px] border-white shadow-[0_2px_8px_rgba(15,23,42,0.12)] sm:h-10 sm:w-10 ${ring.className} ${i > 0 ? '-ml-3 sm:-ml-3.5' : ''}`}
          />
        ))}
      </div>
      <p className="max-w-[22rem] text-center text-[15px] font-semibold leading-snug text-neutral-800 sm:max-w-none sm:text-left sm:text-[15px]">
        <span className="tabular-nums font-bold text-[#15799F]">{count}</span>
        <span className="font-semibold text-neutral-800">
          + students checked their readiness… <span className="text-[#9a3412]">When will you?</span>
        </span>
      </p>
    </motion.div>
  );
}

function HeroProblemTicker({ reduceMotion }) {
  const tickerItems = [...HERO_PROBLEM_TICKER, ...HERO_PROBLEM_TICKER];
  return (
    <section className="relative mt-7 w-full overflow-hidden rounded-2xl border border-[#FFD9A8]/80 bg-white/90 shadow-[0_6px_22px_rgba(26,143,196,0.08)]">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent"
        aria-hidden
      />
      <div className={`flex items-center gap-3 px-3 py-2.5 ${reduceMotion ? '' : 'mm-problem-track'}`}>
        {tickerItems.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200/90 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#1A8FC4]" aria-hidden />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

function VisualPrepJourney({ reduceMotion }) {
  const cards = [
    {
      title: 'Readiness score',
      line: 'See score, strengths, and weakness topics in one report',
      image: 'hr-technical.jpg',
      tone: 'from-sky-500/35 via-sky-900/30 to-black/40',
    },
    {
      title: 'Practice pressure',
      line: 'Mock rounds with real interview vibe',
      image: 'mock-interview.jpg',
      tone: 'from-cyan-500/30 via-slate-900/35 to-black/45',
    },
    {
      title: 'Weekly plan',
      line: 'Small, consistent steps beat panic preparation',
      image: 'planner.jpg',
      tone: 'from-emerald-500/30 via-emerald-950/35 to-black/40',
    },
    {
      title: 'Mentor loop',
      line: 'Feedback -> iterate -> improve',
      image: 'mentorship.jpg',
      tone: 'from-violet-500/30 via-violet-950/35 to-black/45',
    },
  ];

  return (
    <section className="border-t border-slate-100 bg-gradient-to-b from-white to-secondary/60 px-5 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <FadeUp>
          <div className="mb-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1A8FC4]">Your interview preparation path</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              See exactly how you go from confusion to interview-ready.
            </h2>
          </div>
        </FadeUp>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, idx) => (
            <FadeUp key={card.title} delay={idx * 0.06}>
              <motion.article
                whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 340, damping: 24 }}
                className="group overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_10px_30px_-20px_rgba(0,0,0,0.25)] ring-1 ring-black/[0.04]"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={homepagePosterAsset(card.image)}
                    alt={card.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${card.tone}`} aria-hidden />
                  {idx === 0 && (
                    <div className="pointer-events-none absolute right-2 top-9 z-10 space-y-1.5">
                      <div className="rounded-lg bg-white/92 px-2 py-1 text-[10px] font-bold text-[#7C2D12] shadow-sm">
                        Score: 74%
                      </div>
                      <div className="rounded-lg bg-emerald-50/95 px-2 py-1 text-[10px] font-semibold text-emerald-800 shadow-sm">
                        Strengths
                      </div>
                      <div className="rounded-lg bg-sky-100/95 px-2 py-1 text-[10px] font-semibold text-sky-800 shadow-sm">
                        Weaknesses
                      </div>
                    </div>
                  )}
                  <p className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7C2D12]">
                    Step {idx + 1}
                  </p>
                  <p className="absolute bottom-3 left-3 right-3 text-lg font-black leading-tight text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.45)]">
                    {card.title}
                  </p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-muted-foreground">{card.line}</p>
                </div>
              </motion.article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Quip below hero score card — shimmer + sparkles (respects reduced motion). */
function HeroPlayfulClause({ text, reduceMotion }) {
  return (
    <motion.div
      className="relative w-full max-w-[min(100%,440px)]"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex justify-center lg:justify-end">
        <div
          className={`inline-flex max-w-full items-start gap-2 rounded-xl px-3.5 py-2.5 text-left ${
            reduceMotion
              ? 'border border-sky-100/90 bg-sky-50/50'
              : 'border border-sky-200/70 bg-gradient-to-br from-sky-50/95 via-white to-cyan-50/40 shadow-[0_6px_24px_-10px_rgba(26,143,196,0.35),0_0_0_1px_rgba(26,143,196,0.08)]'
          }`}
        >
        <motion.span
          className="mt-0.5 shrink-0 text-[#1A8FC4] drop-shadow-[0_0_10px_rgba(26,143,196,0.45)]"
          aria-hidden
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [1, 1.12, 1],
                  rotate: [0, -6, 6, 0],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : { duration: 2.4, repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut' }
          }
        >
          <Sparkles className="h-4 w-4" strokeWidth={2.25} />
        </motion.span>
        <p
          className={`text-[13px] italic leading-snug ${
            reduceMotion ? 'text-neutral-600' : 'mm-hero-playful-shimmer'
          }`}
        >
          {text}
        </p>
        </div>
      </div>
      {!reduceMotion && (
        <style>{`
          @keyframes mm-hero-playful-shimmer {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes mm-hero-playful-glow {
            0%, 100% { filter: drop-shadow(0 0 0px rgba(234, 88, 12, 0)); }
            50% { filter: drop-shadow(0 0 6px rgba(234, 88, 12, 0.35)); }
          }
          .mm-hero-playful-shimmer {
            background: linear-gradient(
              105deg,
              #525252 0%,
              #525252 28%,
              #ea580c 42%,
              #f97316 48%,
              #0891b2 54%,
              #525252 62%,
              #525252 100%
            );
            background-size: 240% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation:
              mm-hero-playful-shimmer 3.2s ease-in-out infinite,
              mm-hero-playful-glow 3.2s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .mm-hero-playful-shimmer {
              animation: none;
              background: none;
              color: #525252;
              -webkit-background-clip: unset;
              background-clip: unset;
            }
          }
        `}</style>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const HomePage = () => {
  const reduceMotion = useReducedMotion();
  const heroCopy = HERO_YEAR_COPY.y4;

  /** Same-page scroll to the conversion block — avoids `href="#…"` breaking HashRouter. */
  const scrollToFinalCta = () => {
    document.getElementById('final-cta')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="mm-site-theme overflow-x-hidden">
      <style>{`
        :focus-visible {
          outline: 2px solid #1A8FC4;
          outline-offset: 3px;
          border-radius: 6px;
        }
        .mm-hero-accent {
          background-size: 200% 200%;
          animation: mm-hero-accent 10s ease-in-out infinite;
        }
        @keyframes mm-problem-track {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .mm-problem-track {
          width: max-content;
          animation: mm-problem-track 22s linear infinite;
        }
        .mm-hero-typewriter-line {
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.025em;
        }
        @media (min-width: 400px) {
          .mm-hero-typewriter-line { font-size: 1.75rem; line-height: 1.15; }
        }
        @media (min-width: 640px) {
          .mm-hero-typewriter-line { font-size: 2.125rem; }
        }
        @media (min-width: 768px) {
          .mm-hero-typewriter-line { font-size: 2.5rem; }
        }
        @keyframes mm-hero-accent {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mm-hero-accent { animation: none !important; background-position: 0% 50% !important; }
          .mm-problem-track { animation: none !important; }
        }
      `}</style>

      {/* ════════════════ HERO — copy left · reality-check card right · white field ════════════════ */}
      <section className="relative overflow-hidden border-b-0 bg-gradient-to-b from-slate-50/90 via-white to-[#fff8f0] pb-0 pt-10 md:pt-12 lg:pt-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_70%_-10%,rgba(26,143,196,0.12),transparent)]" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_10%_50%,rgba(14,165,233,0.06),transparent)]" aria-hidden />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-5 sm:px-6 lg:px-8">
          <div className="grid w-full min-w-0 grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-x-12 lg:gap-y-0 xl:gap-x-16">
            <div className="flex w-full min-w-0 flex-col gap-5 sm:gap-6">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 lg:justify-start"
              >
                <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-sky-200/90 bg-sky-50/90 px-3 py-1.5 text-left text-[11px] font-medium leading-snug text-[#0c4a6e] sm:text-xs">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.25)]" aria-hidden />
                  <span className="min-w-0">{HERO_EYEBROW}</span>
                </span>
                <div className="inline-flex items-center gap-2 whitespace-nowrap">
                  <span
                    className="inline-flex rotate-[-2.5deg] items-center rounded-md border-2 border-[#1A8FC4] bg-gradient-to-br from-sky-100 to-sky-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#0e5e85] shadow-[2px_3px_0_0_rgba(26,143,196,0.35)] sm:text-[11px]"
                    title="Limited early-bird offer"
                  >
                    {HERO_EARLY_BIRD_STICKER}
                  </span>
                  <span
                    className="inline-flex rotate-[2deg] items-center rounded-md border-2 border-cyan-600/75 bg-gradient-to-br from-cyan-50 to-sky-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-950 shadow-[2px_3px_0_0_rgba(8,145,178,0.35)] sm:text-[11px]"
                    title="Skills-first interview preparation for students and early-career engineers"
                  >
                    {HERO_GENZ_STICKER}
                  </span>
                </div>
              </motion.div>

              <div className="w-full text-center lg:text-left">
                <motion.h1
                  key="hero-headline"
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto max-w-[44rem] lg:mx-0 lg:max-w-[38rem]"
                >
                  <span className="typo-display block text-neutral-900 leading-[1.06] tracking-tight">
                    {HERO_HEADLINE_LINE1}
                  </span>
                  <span className="typo-display mt-1 block text-neutral-900 leading-[1.06] tracking-tight">
                    {HERO_HEADLINE_LINE2}
                  </span>
                  <span className="mt-2 block min-h-[4.75rem] sm:min-h-[6rem] sm:mt-3 md:min-h-[5.5rem]">
                    <HeroHeadlineTypewriter
                      phrases={HERO_TYPEWRITER_PHRASES}
                      reducedMotion={reduceMotion}
                      className="mm-hero-typewriter-line block mm-hero-accent bg-gradient-to-r from-[#15799F] via-[#1A8FC4] to-[#2AAA8A] bg-clip-text text-transparent"
                    />
                  </span>
                </motion.h1>

                <motion.div
                  key="hero-sub"
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, delay: 0.04 }}
                  className="mx-auto mt-4 max-w-prose-marketing px-0 sm:mt-5 lg:mx-0 lg:max-w-[38rem]"
                >
                  <p className="typo-body-lg text-neutral-600">{heroCopy.subShort}</p>
                  {heroCopy.socialProofLine && (
                    <HeroSocialProof fullLabel={heroCopy.socialProofLine} reduceMotion={reduceMotion} />
                  )}
                  <div
                    className="mt-5 space-y-2 rounded-xl border border-sky-100/90 bg-sky-50/50 px-4 py-3.5 sm:px-5 sm:py-4"
                    role="region"
                    aria-label="How MentorMuni works"
                  >
                    <p className="text-center text-[13px] font-bold leading-relaxed tracking-tight text-[#15799F] sm:text-left sm:text-sm">
                      {HERO_JOURNEY_STEPS}
                    </p>
                    <p className="text-center text-[13px] font-semibold leading-relaxed text-neutral-800 sm:text-left sm:text-sm">
                      {HERO_JOURNEY_ARC}
                    </p>
                  </div>

                  <div className="mt-6 flex w-full flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center lg:justify-start">
                    <button
                      type="button"
                      onClick={goToStartAssessment}
                      className="inline-flex min-h-[44px] w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-7 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,149,0,0.3)] transition-colors hover:bg-[#E88600] active:bg-[#D97706] sm:w-auto"
                    >
                      {PRIMARY_CTA_LABEL} <ArrowRight size={16} aria-hidden />
                    </button>
                    <Link
                      to="/contact"
                      className="inline-flex min-h-[44px] w-full touch-manipulation items-center justify-center rounded-xl border border-border bg-white px-7 py-3.5 text-sm font-bold text-foreground shadow-sm transition-colors hover:border-[#2AAA8A] hover:bg-secondary active:bg-neutral-50 sm:w-auto"
                    >
                      {SECONDARY_CTA_BOOK_CALL}
                    </Link>
                  </div>

                  <div className="mt-6 sm:mt-7">
                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-neutral-600 sm:gap-x-6 lg:justify-start">
                      {HERO_PROOF_BULLETS.map((line) => (
                        <span key={line} className="inline-flex items-center gap-2">
                          <Check className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.5} aria-hidden />
                          {line}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="flex w-full min-w-0 flex-col items-center justify-center gap-3 lg:items-end lg:pt-1">
              <HeroFlagshipVisual />
              <HeroPlayfulClause text={HERO_PLAYFUL_CLAUSE} reduceMotion={reduceMotion} />
            </div>
          </div>

          <div className="mt-8 flex w-full flex-col items-center gap-8 lg:mt-10 lg:gap-10">
            <div className="flex w-full max-w-3xl justify-center">
              <HeroLoopVideo />
            </div>
          </div>

          <HeroValueStack reduceMotion={reduceMotion} />
          <HeroProblemTicker reduceMotion={reduceMotion} />
        </div>
      </section>

      <VisualPrepJourney reduceMotion={reduceMotion} />

      <section className="border-t border-slate-100 bg-white px-5 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <div className="mb-7 text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1A8FC4]">How it works</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Clear workflow. No random preparation.
              </h2>
            </div>
          </FadeUp>
          <div className="grid gap-4 md:grid-cols-3">
            {HERO_FLOW_STEPS.map((step, idx) => (
              <FadeUp key={step.title} delay={idx * 0.07}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.05)]">
                  <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e0f0fa] text-sm font-bold text-[#1A8FC4]">
                    {idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ THE REAL PROBLEM — pain + three cards ════════════════ */}
      <section
        className="relative overflow-hidden border-t border-sky-200/50 bg-gradient-to-b from-sky-50/95 via-[#f8fafc] to-slate-100/50 py-14 md:py-16 px-5 sm:px-6 lg:px-8"
        aria-labelledby="real-problem-heading"
      >
        <div
          className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-sky-300/20 blur-[100px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-20 bottom-8 h-56 w-56 rounded-full bg-cyan-200/20 blur-[90px]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-5xl">
          <FadeUp>
            <header className="mb-12 text-center md:mb-14 md:text-left">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#1A8FC4] sm:text-sm sm:tracking-[0.2em]">
                {REAL_PROBLEM_EYEBROW}
              </p>
              <h2
                id="real-problem-heading"
                className="mx-auto max-w-[40rem] text-balance text-3xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:mx-0 md:max-w-[44rem] md:text-5xl md:leading-[1.08]"
              >
                {REAL_PROBLEM_HEADLINE}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:mx-0 md:mt-5">
                {REAL_PROBLEM_SUB}
              </p>
            </header>
          </FadeUp>
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
            {REAL_PROBLEM_CARDS.map((card, idx) => {
              const CardIcon = [Clock, Users, TrendingUp][idx];
              return (
                <FadeUp key={card.title} delay={idx * 0.06}>
                  <div className="flex h-full flex-col rounded-2xl border border-sky-100/80 bg-white/95 p-6 shadow-[0_2px_16px_rgba(14,116,144,0.06)] backdrop-blur-[2px]">
                    <div
                      className="mb-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-rose-50 ring-1 ring-rose-100/80"
                      aria-hidden
                    >
                      <CardIcon className="h-5 w-5 text-rose-700/90" strokeWidth={2} />
                    </div>
                    <h3 className="mb-2 text-lg font-bold leading-snug text-foreground">{card.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════ COMPARISON — MentorMuni vs alternatives ════════════════ */}
      <section
        className="border-t border-border bg-white py-14 md:py-16 px-5 sm:px-6 lg:px-8"
        aria-labelledby="comparison-table-heading"
      >
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <header className="mb-8 text-center md:mb-10 md:text-left">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#1A8FC4] sm:text-sm sm:tracking-[0.2em]">
                {COMPARISON_TABLE_EYEBROW}
              </p>
              <h2
                id="comparison-table-heading"
                className="mx-auto max-w-[40rem] text-balance text-3xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:mx-0 md:text-[2.5rem] md:leading-[1.08]"
              >
                {COMPARISON_TABLE_HEADLINE}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:mx-0 md:mt-5">
                {COMPARISON_TABLE_SUB}
              </p>
            </header>
          </FadeUp>
          <FadeUp delay={0.08}>
            <div className="overflow-hidden rounded-xl border border-border shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
                <table className="w-full min-w-[720px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border bg-neutral-50/90">
                      <th
                        scope="col"
                        className="rounded-tl-xl px-4 py-4 text-left text-xs font-bold text-foreground sm:px-5 sm:text-sm"
                      >
                        {COMPARISON_TABLE_FEATURE_COL_LABEL}
                      </th>
                      {COMPARISON_TABLE_BRANDS.map((brand, i) => {
                        const isMM = i === COMPARISON_TABLE_BRANDS.length - 1;
                        return (
                          <th
                            key={brand}
                            scope="col"
                            className={`px-3 py-4 text-center text-xs font-bold sm:px-4 sm:text-sm ${
                              isMM
                                ? 'rounded-tr-xl bg-[#FFF4E6] text-[#1A8FC4]'
                                : 'text-foreground'
                            }`}
                          >
                            {brand}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/90">
                    {COMPARISON_TABLE_ROWS.map((row, ri) => {
                      const isLast = ri === COMPARISON_TABLE_ROWS.length - 1;
                      return (
                        <tr key={row.label} className="bg-white">
                          <th
                            scope="row"
                            className="px-4 py-3.5 text-left text-[13px] font-medium leading-snug text-foreground sm:px-5 sm:py-4 sm:text-sm"
                          >
                            {row.label}
                          </th>
                          {row.cells.map((cell, ci) => {
                            const isMM = ci === COMPARISON_TABLE_BRANDS.length - 1;
                            return (
                              <td
                                key={ci}
                                className={`px-3 py-3.5 sm:px-4 sm:py-4 ${
                                  isMM
                                    ? `bg-secondary ${isLast ? 'rounded-br-xl' : ''}`
                                    : ''
                                }`}
                              >
                                <ComparisonTableCell value={cell} />
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-center text-[11px] text-muted-foreground md:hidden" role="note">
                Swipe sideways to see all columns
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ REALITY CHECK — dark qualification / fit ════════════════ */}
      <section
        className="border-t border-neutral-800 bg-[#121212] py-16 md:py-20 px-5 sm:px-6 lg:px-8"
        aria-labelledby="reality-check-heading"
      >
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <header className="mb-12 text-center md:mb-14">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF7A30] sm:text-xs sm:tracking-[0.22em]">
                {REALITY_CHECK_EYEBROW}
              </p>
              <h2
                id="reality-check-heading"
                className="mx-auto max-w-[40rem] text-balance text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl md:leading-[1.08]"
              >
                {REALITY_CHECK_HEADLINE}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg">
                {REALITY_CHECK_SUB}
              </p>
            </header>
          </FadeUp>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <FadeUp delay={0.06}>
              <div>
                <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-[#FF8A8A]">
                  {REALITY_CHECK_NOT_TITLE}
                </h3>
                <ul className="space-y-4">
                  {REALITY_CHECK_NOT_ITEMS.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[15px] leading-relaxed text-[#FFAEAE] sm:text-base"
                    >
                      <span
                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#f87171] ring-2 ring-[#f87171]/30"
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div>
                <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-[#4ADE80]">
                  {REALITY_CHECK_FOR_TITLE}
                </h3>
                <ul className="space-y-4">
                  {REALITY_CHECK_FOR_ITEMS.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[15px] leading-relaxed text-[#86efac] sm:text-base"
                    >
                      <span
                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#4ADE80] ring-2 ring-[#4ADE80]/35"
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>

        </div>
      </section>

      {/* ════════════════ 60-DAY PROGRAM — timeline + pricing card ════════════════ */}
      <section
        className="border-t border-border bg-white py-14 md:py-16 px-5 sm:px-6 lg:px-8"
        aria-labelledby="program-6week-heading"
      >
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <header className="mb-10 text-center md:mb-12 md:text-left">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#1A8FC4] sm:text-sm">
                {PROGRAM_6WEEK_EYEBROW}
              </p>
              <h2
                id="program-6week-heading"
                className="mx-auto max-w-[40rem] text-balance text-3xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:mx-0 md:text-[2.5rem] md:leading-[1.08]"
              >
                {PROGRAM_6WEEK_HEADLINE}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:mx-0">
                {PROGRAM_6WEEK_SUB}
              </p>
            </header>
          </FadeUp>

          <div className="grid items-start gap-12 lg:grid-cols-[1fr_minmax(280px,380px)] lg:gap-14 xl:grid-cols-[1fr_400px]">
            <FadeUp delay={0.06}>
              <ol className="list-none space-y-0 pl-0">
                {PROGRAM_6WEEK_PHASES.map((phase, idx) => {
                  const isLast = idx === PROGRAM_6WEEK_PHASES.length - 1;
                  return (
                    <li key={phase.title} className="relative flex gap-4 pb-10 last:pb-0">
                      <div className="flex flex-col items-center">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1A8FC4] shadow-sm ring-4 ring-white"
                          aria-hidden
                        />
                        {!isLast && (
                          <span className="mt-1 w-px flex-1 min-h-[3rem] bg-neutral-200" aria-hidden />
                        )}
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-base font-bold text-foreground">{phase.title}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{phase.body}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="relative rounded-2xl border-2 border-[#2AAA8A] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-7">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-block rounded-full bg-[#1A8FC4] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
                    {PROGRAM_6WEEK_CARD_BADGE}
                  </span>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-bold text-foreground md:text-xl">{PROGRAM_6WEEK_CARD_TITLE}</h3>
                  <div className="mt-5 flex flex-col items-center gap-1">
                    <p className="flex flex-wrap items-baseline justify-center gap-2">
                      <span className="inline-block select-none blur-[12px]" aria-hidden>
                        {PROGRAM_6WEEK_PRICE_MAIN}
                      </span>
                      <span className="text-sm font-medium text-muted-foreground">{PROGRAM_6WEEK_PRICE_MAIN_SUFFIX}</span>
                    </p>
                    <p className="text-sm text-muted-foreground select-none blur-[10px] line-through" aria-hidden>
                      {PROGRAM_6WEEK_PRICE_STRIKE}
                    </p>
                    <p className="sr-only">
                      Program pricing is shown blurred on this page; see checkout or contact for current price.
                    </p>
                  </div>
                </div>
                <p className="mt-6 border-t border-border pt-6 text-left text-sm leading-relaxed text-muted-foreground">
                  {PROGRAM_6WEEK_SUMMARY}
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ════════════════ 2ND & 3RD YEAR — preparation journey + early-years copy + readiness map ════════════════ */}
      <section className="relative overflow-hidden border-t-0 bg-secondary px-5 pb-16 pt-0 sm:px-6">
        <style>{`
          @keyframes mm-flow-arrow {
            0%, 100% { transform: translateX(0); opacity: 0.35; }
            50% { transform: translateX(5px); opacity: 1; }
          }
          @keyframes mm-preparation-journey {
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
            animation: mm-preparation-journey 8s cubic-bezier(0.45, 0.02, 0.55, 0.98) infinite;
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
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[rgba(26,143,196,0.12)] blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[rgba(255,179,71,0.1)] blur-[90px]" />
        <div className="pointer-events-none absolute left-0 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[80px]" />

        <div className="relative mx-auto max-w-5xl pt-12 md:pt-14">
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
                <h2 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-foreground md:text-3xl">
                  Prep for what you&apos;re studying —{' '}
                  <span className="mm-hero-accent bg-gradient-to-r from-[#1A8FC4] via-[#2AAA8A] to-[#7DD3C0] bg-clip-text text-transparent">
                    not someday, from now.
                  </span>
                </h2>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-5 max-w-xl rounded-2xl border border-[#2AAA8A]/35 bg-gradient-to-br from-white via-[#f0f7ff] to-[#e0f0fa]/70 p-5 shadow-[0_8px_32px_rgba(26,143,196,0.08)]"
                >
                  <p className="text-base font-bold leading-snug text-foreground sm:text-lg">
                    {EARLY_SECTION_COPY.shortLine}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{EARLY_SECTION_COPY.detail}</p>
                </motion.div>

                <motion.div
                  className="mb-5 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2"
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
                      className="group relative overflow-hidden rounded-2xl border border-border bg-white p-3.5 shadow-sm"
                    >
                      <div
                        className={`absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br ${b.gradient} opacity-20 blur-2xl transition-opacity group-hover:opacity-45`}
                        aria-hidden
                      />
                      <div
                        className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${b.gradient} p-[1px]`}
                      >
                        <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-white">
                          <b.Icon size={16} className="text-foreground" strokeWidth={2.2} />
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-foreground">{b.title}</p>
                      <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{b.sub}</p>
                    </motion.div>
                  ))}
                </motion.div>

                <div className="mb-4 max-w-xl space-y-1.5 rounded-xl border border-neutral-200/80 bg-white/80 px-4 py-3.5 text-sm leading-relaxed text-muted-foreground">
                  <p className="font-medium text-foreground">This is not a test of what you know.</p>
                  <p>It&apos;s a check of how well you can perform.</p>
                </div>

                <p className="mb-5 max-w-xl text-center text-xs font-medium text-muted-foreground sm:text-left">
                  {EARLY_SECTION_MICRO_INFO}
                </p>

                <div className="max-w-xl space-y-2">
                  <p className="text-sm font-semibold leading-snug text-neutral-800">{EARLY_SECTION_CTA_HOOK}</p>
                  <p className="text-sm text-muted-foreground">
                    When you&apos;re ready:{' '}
                    <button
                      type="button"
                      onClick={scrollToFinalCta}
                      className="font-semibold text-[#1A8FC4] underline decoration-[#2AAA8A]/50 underline-offset-[4px] transition hover:text-[#15799F] bg-transparent border-0 p-0 cursor-pointer font-inherit"
                    >
                      Jump to the free check
                    </button>{' '}
                    (~5 min).
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="min-w-0"
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
      <section className="relative border-t border-border overflow-hidden bg-gradient-to-b from-background to-secondary py-16 md:py-20 px-5 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[rgba(26,143,196,0.1)] blur-[100px]" aria-hidden />
        <div className="relative mx-auto w-full max-w-5xl">
          <div className="mb-10">
            <StoryLine
              delay={0}
              className="mb-4 block text-xs font-bold uppercase tracking-[0.22em] text-[#1A8FC4] sm:text-sm"
              as="span"
            >
              Why MentorMuni
            </StoryLine>
            <StoryLine
              delay={0.07}
              className="mb-6 max-w-[38rem] text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl md:text-[1.65rem] md:leading-[1.35]"
              as="h2"
            >
              Too many students walk into placement{' '}
              <span className="font-semibold text-[#15799F]">
                before they&apos;ve ever had a real mock.
              </span>
            </StoryLine>

            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              <div className="relative overflow-hidden rounded-2xl border border-sky-200/70 bg-gradient-to-br from-white to-sky-50/30 p-5 shadow-[0_4px_28px_-14px_rgba(26,143,196,0.18)] md:p-6">
                <div
                  className="pointer-events-none absolute inset-y-4 left-0 w-1 rounded-full bg-gradient-to-b from-[#1A8FC4] to-sky-400/50"
                  aria-hidden
                />
                <StoryLine
                  delay={0.12}
                  className="mb-3 pl-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
                  as="p"
                >
                  What we kept seeing
                </StoryLine>
                <div className="space-y-3 pl-4">
                  <StoryLine
                    delay={0.18}
                    className="relative text-sm leading-relaxed text-muted-foreground md:text-base"
                  >
                    We started MentorMuni after seeing the same pattern: final-year students showing up for interviews with almost no structured preparation.
                  </StoryLine>
                  <StoryLine
                    delay={0.28}
                    className="relative text-sm leading-relaxed text-muted-foreground md:text-base"
                  >
                    No measured baseline, no serious mock round—sometimes no practice speaking answers under pressure.
                  </StoryLine>
                  <StoryLine
                    delay={0.38}
                    className="relative text-sm font-medium leading-relaxed text-muted-foreground md:text-base"
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
                  className="mb-3 pl-4 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-800"
                  as="p"
                >
                  Why we built it
                </StoryLine>
                <div className="space-y-3 pl-4">
                  <StoryLine
                    delay={0.3}
                    className="relative text-sm leading-relaxed text-muted-foreground md:text-base"
                  >
                    Hiring is tighter and panels are unforgiving. You don&apos;t get unlimited shots.
                  </StoryLine>
                  <StoryLine
                    delay={0.4}
                    className="relative text-sm leading-relaxed text-muted-foreground md:text-base"
                  >
                    That&apos;s why we built MentorMuni so you can go in at full strength:
                  </StoryLine>
                  <StoryLine
                    delay={0.5}
                    className="relative text-sm font-semibold leading-relaxed text-foreground md:text-base"
                  >
                    Interview readiness check, voice mocks, and mentor-backed preparation—before the rounds that actually count.
                  </StoryLine>
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {[
              { icon: '🎤', title: 'First “real” round was never mocked', line: 'Many students never ran a serious mock interview before facing a panel.', tint: 'from-red-500/10 to-transparent border-red-500/20' },
              { icon: '📉', title: 'Fewer interviews, same crowd', line: 'Open roles are harder to land—walking in under-prepared costs more than before.', tint: 'from-amber-500/10 to-transparent border-sky-500/25' },
              { icon: '📊', title: 'Rejection without a map', line: 'Without a readiness score, you don’t know what to fix first—only that it “went badly.”', tint: 'from-[#1A8FC4]/12 to-transparent border-[#2AAA8A]/30' },
              { icon: '✅', title: '100% preparation before Day 1', line: 'Measure gaps, practice out loud, then close them with mentorship—before real interviews.', tint: 'from-emerald-500/10 to-transparent border-emerald-500/25' },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.06}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className={`h-full rounded-2xl border bg-gradient-to-br ${item.tint} p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]`}
                >
                  <span className="text-2xl" aria-hidden>{item.icon}</span>
                  <h3 className="mt-2 text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.line}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.15}>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5 md:p-6">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">Showing up under-prepared</p>
                <ul className="space-y-2.5">
                  {[
                    'Placement season without a real mock interview or timed practice',
                    'No readiness benchmark—only hope after every rejection',
                    'Cramming topics instead of fixing the gaps the panel actually tests',
                  ].map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                      <X size={14} className="text-red-500 shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.05] p-5 md:p-6">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">Going in with MentorMuni</p>
                <ul className="space-y-2.5">
                  {[
                    'Free interview readiness check—a clear score and what to fix first',
                    'Voice mocks so your first “real” panel isn’t your first time under pressure',
                    'Mentorship to close gaps and align preparation to the companies you’re targeting',
                  ].map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                      <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.22}>
            <p className="max-w-2xl rounded-2xl border border-border bg-white p-5 text-sm leading-relaxed text-muted-foreground shadow-[0_2px_12px_rgba(0,0,0,0.05)] md:p-6 md:text-base">
              Don’t use real interviews as practice.{' '}
              <button
                type="button"
                onClick={scrollToFinalCta}
                className="font-semibold text-[#1A8FC4] underline decoration-[#2AAA8A]/55 underline-offset-[5px] transition hover:text-[#15799F] bg-transparent border-0 p-0 cursor-pointer font-inherit"
              >
                Start with the free check
              </button>
              —then add mocks and mentors until you’re ready for the panel.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ HOW IT WORKS — what we give (after the “why”) ════════════════ */}
      <section className="border-t border-border bg-white py-14 md:py-16 px-5 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl text-left">
          <FadeUp className="w-full text-left">
            <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">How it works</span>
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {HOW_IT_WORKS_HEADLINE}
            </h2>
            <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {HOW_IT_WORKS_SUB}
            </p>
            <Link
              to="/how-it-works"
              className="mb-10 inline-flex items-center gap-1 text-sm font-semibold text-[#1A8FC4] transition-colors hover:text-[#15799F]"
            >
              Full step-by-step walkthrough <ArrowRight size={14} aria-hidden />
            </Link>
          </FadeUp>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.07} className="w-full text-left">
                <div className="group flex h-full gap-4 rounded-2xl border border-border bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-all hover:border-[#2AAA8A]">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-accent-soft group-hover:bg-secondary">
                    <f.Icon size={18} className="text-[#1A8FC4]" />
                  </div>
                  <div className="min-w-0 flex flex-col">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                      <span className="rounded border border-border bg-[#e0f0fa] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#15799F]">
                        {f.tag}
                      </span>
                    </div>
                    <p className="mb-2 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
                    <span className="text-xs font-semibold text-[#1A8C55]">{f.highlight}</span>
                    {f.link && (
                      <Link
                        to={f.link}
                        className="mt-3 inline-flex w-fit items-center gap-1 text-xs font-semibold text-[#1A8FC4] transition-colors hover:text-[#15799F]"
                      >
                        {f.linkLabel} <ArrowRight size={12} strokeWidth={2.5} aria-hidden />
                      </Link>
                    )}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.28} className="w-full text-left">
            <p className="mt-8 text-sm text-muted-foreground">
              Ready for a number on where you stand?{' '}
              <button
                type="button"
                onClick={scrollToFinalCta}
                className="font-semibold text-[#1A8FC4] underline decoration-[#2AAA8A]/45 underline-offset-[4px] transition hover:text-[#15799F] bg-transparent border-0 p-0 cursor-pointer font-inherit"
              >
                Get your free score
              </button>{' '}
              <span className="text-muted-foreground/90">— ~5 min, no signup.</span>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ STUDENT STORIES — animated cards ════════════════ */}
      <section className="relative overflow-hidden border-t border-border bg-gradient-to-b from-background via-sky-50/80 to-secondary py-14 md:py-16 px-5 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-[rgba(26,143,196,0.15)] blur-[100px]" aria-hidden />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[rgba(8,145,178,0.1)] blur-[90px]" aria-hidden />

        <div className="relative mx-auto w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 text-center md:text-left"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#2AAA8A]/35 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-sm md:mb-4">
              <Sparkles size={14} className="text-[#1A8FC4]" aria-hidden />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#15799F]">
                Real voices
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Numbers beat vibes —{' '}
              <span className="bg-gradient-to-r from-[#1A8FC4] to-[#15799F] bg-clip-text text-transparent">
                what shifted after the check
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:mx-0">
              Paraphrased stories; initials only. Proof lines are typical patterns — not guarantees.
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
                  <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white/90 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-md transition-all duration-300 group-hover:border-[#2AAA8A]/45 group-hover:shadow-[0_16px_48px_rgba(26,143,196,0.14)] md:p-6">
                    <div className="absolute right-4 top-4 text-[4rem] font-serif font-bold leading-none text-[#1A8FC4]/[0.07] transition-transform duration-500 group-hover:scale-110 group-hover:text-[#1A8FC4]/10">
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
                          <p className="text-sm font-bold text-foreground">Student {t.avatar}</p>
                          <p className="text-xs text-hint">{t.tag}</p>
                        </div>
                      </div>
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${t.gradient} p-[1px] shadow-sm`}
                      >
                        <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-white/95">
                          <CardIcon size={18} className="text-muted-foreground" strokeWidth={2} aria-hidden />
                        </div>
                      </div>
                    </div>

                    <p className="relative mb-3 inline-flex w-fit rounded-full bg-[#e0f0fa] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#15799F] ring-1 ring-[#2AAA8A]/30">
                      {t.insight}
                    </p>
                    <p className="relative text-base leading-relaxed text-muted-foreground">{t.text}</p>
                    {t.proofMetric && (
                      <p className="relative mt-4 border-t border-border pt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1A8C55]">
                        {t.proofMetric}
                      </p>
                    )}

                    <div
                      className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#1A8FC4] to-[#2AAA8A] transition-transform duration-300 ease-out group-hover:scale-x-100"
                      aria-hidden
                    />
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ MENTORS — Expert Mentorship (two columns) ════════════════ */}
      <section className="border-t border-border bg-neutral-50 py-14 md:py-20 px-5 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <FadeUp className="w-full text-left">
              <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#15799F] md:text-xs">
                Expert Mentorship
              </span>
              <h2 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-foreground md:text-3xl">
                Mentors with 12–15 years
                <br />
                <span className="text-[#1A8FC4]">of industry experience.</span>
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                Our mentors are senior engineers and tech leads from India&apos;s leading IT companies with over a decade
                of industry experience. They have conducted hundreds of interviews — and bring that perspective directly
                to your preparation.
              </p>
              <div className="mb-7 space-y-4">
                {[
                  {
                    Icon: Brain,
                    title: 'They know what the interviewer is actually testing',
                    desc: "After 12+ years, they've conducted hundreds of interviews. They'll tell you exactly what an answer needs — not what sounds good.",
                  },
                  {
                    Icon: Cpu,
                    title: 'They teach AI tools in real workflows',
                    desc: 'Our mentors use GitHub Copilot, ChatGPT, and Claude daily. They teach you not just how to use these tools but how to talk about them in interviews — a skill most freshers completely lack.',
                  },
                  {
                    Icon: Target,
                    title: 'Company-specific pattern knowledge',
                    desc: 'TCS Digital vs TCS NQT. Cognizant GenC vs GenC Pro. Infosys SP vs DSP. Each track asks different things. Your mentor knows them all.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3 items-start">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-[#e0f0fa]">
                      <item.Icon size={14} className="text-[#1A8FC4]" aria-hidden />
                    </div>
                    <div>
                      <p className="mb-0.5 text-sm font-bold text-foreground">{item.title}</p>
                      <p className="text-xs leading-relaxed text-hint">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1A8FC4] bg-white px-6 py-3 text-sm font-bold text-[#1A8FC4] shadow-sm transition-colors hover:bg-secondary"
                >
                  {SECONDARY_CTA_BOOK_CALL}
                </Link>
                <Link
                  to="/mentors"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground underline decoration-border underline-offset-4 transition hover:text-[#1A8FC4]"
                >
                  Meet the mentors <ArrowRight size={14} aria-hidden />
                </Link>
              </div>
            </FadeUp>

            <FadeUp delay={0.12} className="w-full text-left">
              <p className="mb-4 text-xs font-medium uppercase tracking-wider text-hint">What you get with every mentor</p>
              <div className="mb-5 space-y-3">
                {[
                  {
                    icon: '🏢',
                    label: '10–15 years in the industry',
                    desc: 'Senior engineers and tech leads, not freshers. They have been the interviewer, not just the interviewee.',
                  },
                  {
                    icon: '🎯',
                    label: 'Conducted 100+ interviews themselves',
                    desc: "They know exactly what interviewers are looking for — because they've been on that side of the table.",
                  },
                  {
                    icon: '🤖',
                    label: 'Actively using AI tools in current role',
                    desc: 'GitHub Copilot, ChatGPT, Cursor — daily. They teach you to use and talk about AI the way interviewers expect today.',
                  },
                  {
                    icon: '📱',
                    label: 'WhatsApp access throughout',
                    desc: 'Not just during sessions. Reachable for quick doubts, mock Q&A, and morale support all week.',
                  },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="flex gap-3 rounded-xl border border-border bg-white p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
                  >
                    <span className="mt-0.5 text-lg" aria-hidden>
                      {c.icon}
                    </span>
                    <div>
                      <p className="mb-0.5 text-sm font-bold text-foreground">{c.label}</p>
                      <p className="text-xs leading-relaxed text-hint">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-border bg-[#e0f0fa] p-4">
                <p className="mb-1 text-xs font-bold text-[#15799F]">✦ Mentorship cohorts · Waitlist open</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  We&apos;re onboarding mentors in batches. Join the waitlist—you&apos;ll be matched based on your
                  readiness profile when your cohort opens.
                </p>
                <Link
                  to="/waitlist"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#1A8FC4] transition-colors hover:text-[#15799F]"
                >
                  Join the waitlist → <ArrowRight size={11} aria-hidden />
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ════════════════ ABOUT US (teaser → full page) ════════════════ */}
      <section id="about" className="border-t border-border bg-white py-14 md:py-16 px-5 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <FadeUp className="w-full text-left">
            <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#15799F] md:text-xs">
              About us
            </span>
            <h2 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-foreground md:text-3xl">
              Built for placement reality —{' '}
              <span className="text-[#1A8FC4]">not generic “preparation.”</span>
            </h2>
            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              {MISSION_TAGLINE} We tie scoring, practice, and mentors together so you improve where panels actually probe —
              DSA, projects, communication, and presenting under pressure.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A8FC4] transition-colors hover:text-[#15799F]"
            >
              Read our story <ArrowRight size={15} aria-hidden />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ Bridge — mentors → final CTA (one line, no duplicate headline) ════════════════ */}
      <section className="border-t border-border bg-[#FAFAF9] py-8 md:py-10 px-5 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl text-left">
          <FadeUp className="w-full text-left">
            <p className="text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              {HOMEPAGE_MENTORS_TO_CTA_BRIDGE}{' '}
              <Link
                to="/contact"
                className="font-semibold text-[#1A8FC4] underline decoration-[#2AAA8A]/45 underline-offset-[5px] transition hover:text-[#15799F]"
              >
                {SECONDARY_CTA_BOOK_CALL}
              </Link>
              <span className="text-muted-foreground/40" aria-hidden>
                {' '}
                ·{' '}
              </span>
              <Link
                to="/waitlist"
                className="font-semibold text-[#1A8FC4] underline decoration-[#2AAA8A]/45 underline-offset-[5px] transition hover:text-[#15799F]"
              >
                Join the waitlist
              </Link>
              .
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ FINAL CTA (single primary conversion zone for free check — hero also) ════════════════ */}
      <section
        id="final-cta"
        className="border-t border-emerald-100/80 bg-gradient-to-b from-emerald-50/50 via-white to-white scroll-mt-[5.5rem] py-14 md:py-16 px-5 sm:px-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-3xl text-left">
          <FadeUp className="w-full text-left">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#15803d] sm:text-sm">Free · 5 minutes · Instant result</p>
            <div className="mb-6 flex w-full max-w-full flex-wrap items-start gap-3 rounded-2xl border border-sky-200/70 bg-gradient-to-r from-sky-50/95 to-sky-100/80 px-4 py-3 text-left text-sm font-semibold leading-snug text-foreground shadow-sm">
              <Gift size={16} className="mt-0.5 shrink-0 text-[#1A8FC4]" aria-hidden />
              <span className="min-w-0 flex-1">{READINESS_TEST_COUPON_BADGE}</span>
            </div>
            <h2 className="mb-4 text-left text-3xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-[2.5rem] md:leading-[1.1]">
              <span className="block">{FINAL_CTA_HEADLINE}</span>
              <span className="mt-2 block text-[#1A8FC4]">{FINAL_CTA_HEADLINE_ACCENT}</span>
            </h2>
            <p className="mb-8 w-full max-w-3xl text-left text-base leading-relaxed text-muted-foreground">{FINAL_CTA_BODY}</p>
            <div className="mb-6 flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <button
                type="button"
                onClick={goToStartAssessment}
                className="inline-flex min-h-[48px] w-full touch-manipulation shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-8 py-4 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all hover:bg-[#E88600] active:scale-[0.98] sm:w-auto"
              >
                {PRIMARY_CTA_LABEL} <ArrowRight size={16} aria-hidden />
              </button>
              <Link
                to="/contact"
                className="inline-flex min-h-[48px] w-full touch-manipulation shrink-0 items-center justify-center rounded-xl border-2 border-[#1A8FC4]/80 bg-white px-6 py-3.5 text-sm font-bold text-[#1A8FC4] transition hover:bg-secondary active:bg-sky-50/50 sm:w-auto"
              >
                {SECONDARY_CTA_BOOK_CALL}
              </Link>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Prefer a cohort seat later?{' '}
              <Link to="/waitlist" className="font-semibold text-[#1A8FC4] underline underline-offset-2 hover:text-[#15799F]">
                Join the mentorship waitlist
              </Link>
            </p>
            <p className="text-left text-sm text-muted-foreground">No signup · ~5 min · instant score</p>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ FOR COLLEGES ════════════════ */}
      <section className="border-t border-border bg-slate-100/80 py-14 md:py-16 px-5 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl text-left">
          <p className="mb-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Are you a placement officer?</p>
          <FadeUp className="w-full text-left">
            <div className="flex flex-col gap-8 rounded-2xl border border-border bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)] sm:p-8 md:flex-row md:items-start">
              <div className="w-12 h-12 bg-[#E8F3FF] rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 size={22} className="text-[#1A6FC4]" />
              </div>
              <div>
                <p className="text-xs text-[#1A6FC4] font-medium mb-1">For placement officers & TPOs</p>
                <h3 className="text-xl font-bold text-foreground mb-2">MentorMuni for Colleges</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  Give your entire batch a readiness score before placement season. Identify who
                  needs what, track improvement week over week, and go in prepared — not hoping.
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  {[
                    { Icon: Users, label: 'Batch readiness dashboard' },
                    { Icon: BarChart3, label: 'Per-student tracking' },
                    { Icon: GraduationCap, label: 'Placement stats reporting' },
                  ].map(f => (
                    <span key={f.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <f.Icon size={12} className="text-hint" /> {f.label}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/contact?topic=colleges"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-[#1A6FC4] hover:bg-[#155a9e] px-5 py-2.5 rounded-xl transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
                  >
                    Request a demo <ArrowRight size={15} />
                  </Link>
                  <Link
                    to="/colleges"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#1A6FC4] hover:text-[#155a9e]"
                  >
                    Learn more <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer className="border-t border-border bg-secondary py-14 px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl w-full">
          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="md:col-span-2">
              <h3 className="font-bold text-foreground mb-2">Mentor<span className="text-[#1A8FC4]">Muni</span></h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-xs">
                {MISSION_TAGLINE}
              </p>
              <div className="mb-4 max-w-sm rounded-xl border border-sky-200/60 bg-white/90 px-3 py-3 shadow-sm">
                <div className="flex gap-2.5">
                  <Gift className="h-4 w-4 shrink-0 text-[#15799F] mt-0.5" aria-hidden />
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Limited offer</p>
                    <p className="text-xs text-muted-foreground leading-snug mb-2">{READINESS_TEST_COUPON_BADGE}</p>
                    <button
                      type="button"
                      onClick={scrollToFinalCta}
                      className="-mx-1 inline-flex min-h-[40px] items-center rounded-md px-1 py-2 text-left text-xs font-semibold text-[#1A8FC4] transition-colors hover:text-[#15799F] active:text-[#0d5f7f] bg-transparent border-0 cursor-pointer font-inherit"
                    >
                      Take the test →
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <a href="mailto:hello@mentormuni.com" className="flex items-center gap-2 hover:text-[#1A8FC4] transition-colors">
                  <Mail size={13} /> hello@mentormuni.com
                </a>
                <a href={CONTACT_PHONE_HREF} className="flex items-center gap-2 hover:text-[#1A8FC4] transition-colors">
                  <Phone size={13} /> {CONTACT_PHONE_DISPLAY}
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-hint mb-3">Tools</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/interview-readiness-tools"
                    className="hover:text-[#1A8FC4] transition-colors"
                  >
                    {PRODUCT_READINESS_SCORE}
                  </Link>
                </li>
                <li><Link to="/mock-interviews" className="hover:text-[#1A8FC4] transition-colors">Mock Interviews</Link></li>
                <li><Link to="/resume-analyzer" className="hover:text-[#1A8FC4] transition-colors">Resume Analyzer</Link></li>
                <li><Link to="/placement-tracks" className="hover:text-[#1A8FC4] transition-colors">Placement Tracks</Link></li>
                <li><Link to="/free-tutorials" className="hover:text-[#1A8FC4] transition-colors">Free Tutorials</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-hint mb-3">Learn</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/learning-paths" className="hover:text-[#1A8FC4] transition-colors">Learning Paths</Link></li>
                <li><Link to="/outcomes" className="hover:text-[#1A8FC4] transition-colors">Outcomes</Link></li>
                <li><Link to="/leadership-board" className="hover:text-[#1A8FC4] transition-colors">Leadership Board</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-hint mb-3">Company</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-[#1A8FC4] transition-colors">About us</Link></li>
                <li><Link to="/contact" className="hover:text-[#1A8FC4] transition-colors">Contact</Link></li>
                <li><Link to="/mentors" className="hover:text-[#1A8FC4] transition-colors">Mentorship</Link></li>
                <li><Link to="/colleges" className="hover:text-[#1A8FC4] transition-colors">For Colleges</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} MentorMuni. All rights reserved.</p>
            <div className="flex gap-5">
              <Link to="/contact" className="hover:text-[#1A8FC4] transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-[#1A8FC4] transition-colors">Privacy</Link>
              <Link to="/contact" className="hover:text-[#1A8FC4] transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
