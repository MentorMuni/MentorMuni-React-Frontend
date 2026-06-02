import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
  HERO_PROOF_ONE_LINER,
  HERO_SOCIAL_PROOF_ARIA,
  HERO_SOCIAL_PROOF_VISIBLE_LINE,
  HERO_TRUST_LOGO_ROW_LABEL,
  HERO_TRUST_LOGO_ROW_ITEMS,
  HERO_PLATFORM_HIGHLIGHTS,
  MISSION_TAGLINE,
  PRODUCT_READINESS_SCORE,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  CONTACT_WHATSAPP_HREF,
  CONTACT_WHATSAPP_LABEL,
  REAL_PROBLEM_EYEBROW,
  REAL_PROBLEM_CARDS,
  COMPARISON_TABLE_HEADLINE,
  COMPARISON_TABLE_SUB,
  COMPARISON_TABLE_FEATURE_COL_LABEL,
  COMPARISON_TABLE_BRANDS,
  COMPARISON_TABLE_ROWS,
  REALITY_CHECK_EYEBROW,
  REALITY_CHECK_SUB,
  REALITY_CHECK_NOT_TITLE,
  REALITY_CHECK_FOR_TITLE,
  REALITY_CHECK_NOT_ITEMS,
  REALITY_CHECK_FOR_ITEMS,
  HR_READINESS_EYEBROW,
  HR_READINESS_HEADLINE,
  HR_READINESS_HEADLINE_ACCENT,
  HR_READINESS_SUB,
  HR_READINESS_PROGRAM_LINE,
  HR_READINESS_POINTS,
  PROGRAM_6WEEK_EYEBROW,
  PROGRAM_6WEEK_HEADLINE,
  PROGRAM_6WEEK_SUB,
  PROGRAM_6WEEK_PHASES,
  PROGRAM_6WEEK_CARD_BADGE,
  PROGRAM_6WEEK_CARD_TITLE,
  PROGRAM_6WEEK_PRICE_MAIN,
  PROGRAM_6WEEK_PRICE_MAIN_SUFFIX,
  PROGRAM_6WEEK_SUMMARY,
  PROGRAM_6WEEK_INCLUDES,
  PROGRAM_ENROLL_CTA,
  PROGRAM_ENROLL_PATH,
  PROGRAM_PRICING_PATH,
  READINESS_TEST_COUPON_BADGE,
  FINAL_CTA_HEADLINE,
  FINAL_CTA_HEADLINE_ACCENT,
  FINAL_CTA_BODY,
  HOW_IT_WORKS_HEADLINE,
  HOW_IT_WORKS_SUB,
  HOMEPAGE_MENTORS_TO_CTA_BRIDGE,
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
} from '../constants/brandCopy';
import {
  HOMEPAGE_META_TITLE,
  HOMEPAGE_META_DESCRIPTION,
  HOMEPAGE_META_KEYWORDS,
  HOMEPAGE_FAQ_ITEMS,
} from '../constants/homepageSeo';
import { usePageMeta } from '../hooks/usePageMeta';
import { useNewUI } from '../context/NewUIContext';
import InnerRouteShell from './new-ui/InnerRouteShell';
import AnimatedCounter from './new-ui/AnimatedCounter';
import { HeroFlagshipVisual } from './homepage/HeroFlagshipVisual';
import { HeroHeadlineTypewriter } from './homepage/HeroHeadlineTypewriter';
import { HeroLoopVideo } from './homepage/HeroLoopVideo';
import { MentorMuniSystemLoop } from './homepage/MentorMuniSystemLoop';
import { HomepageFreeToolsShowcase } from './homepage/HomepageFreeToolsShowcase';
import FadeUp from './layout/FadeUp';
import ScrollReveal from './layout/ScrollReveal';

import {
  ArrowRight, Brain, Target,
  BarChart3, Cpu,
  GraduationCap, Users,
  Mail, Phone, MessageCircle, Check, X,
  BookOpen, Sparkles, Mic2,
  Gift, Clock, TrendingUp,
  Handshake,
  Languages,
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

/** Premium animated “platform stack” strip — mesh, gradient border, spring cards */
function HeroValueStack({ reduceMotion }) {
  const cardSpringHover = reduceMotion ? {} : { y: -6, scale: 1.02, transition: heroValueSpring };
  const cardTap = reduceMotion ? {} : { scale: 0.99 };

  return (
    <>
      <motion.section
        initial={{ y: 16 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.02, margin: '0px 0px -60px 0px' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ opacity: 1 }}
        className="relative mt-0 w-full"
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

          <div className="relative px-4 pt-2 pb-6 sm:px-7 sm:pt-3 sm:pb-8 lg:px-10">
            <motion.div
              initial={{ y: 12 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0.02, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ opacity: 1 }}
              className="mb-8 flex flex-col items-center gap-3 text-center"
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
              viewport={{ once: true, amount: 0.05, margin: '0px 0px 10% 0px' }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: reduceMotion ? 0 : 0.065,
                    delayChildren: reduceMotion ? 0 : 0.08,
                  },
                },
              }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4"
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
                        opacity: 1,
                        y: reduceMotion ? 0 : 20,
                        filter: 'none',
                      },
                      visible: (i) => ({
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        transition: {
                          delay: reduceMotion ? 0 : i * 0.04,
                          duration: 0.55,
                          ease: [0.16, 1, 0.3, 1],
                        },
                      }),
                    }}
                    className="list-none"
                  >
                    <motion.div
                      whileHover={reduceMotion ? undefined : cardSpringHover}
                      whileTap={reduceMotion ? undefined : cardTap}
                      className={`group relative flex h-full min-h-[7.5rem] flex-col overflow-hidden rounded-2xl border p-4 transition-shadow duration-300 hover:shadow-xl sm:p-5 sm:min-h-0 ${theme.card}`}
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
    title: 'Free readiness check (scored)',
    desc: 'One spine for everything else: measure first, see the gap, then decide how hard you want to push. This is the step most students skip — then they wonder why interviews feel random.',
    highlight: 'Start here · ~5 min · No signup',
  },
  {
    Icon: Cpu,
    tag: 'PERFORMANCE',
    title: 'AI mock interviews',
    desc: 'Voice practice with scoring — secondary to the readiness check, but where “I knew it” turns into “I said it well under pressure.”',
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
    proofMetric: 'Illustrative: focus one gap area first (e.g. System Design)',
    Icon: Target,
  },
  {
    avatar: 'R',
    bg: '#0891b2',
    gradient: 'from-cyan-500 via-sky-400 to-teal-400',
    tag: 'Final Year · IT',
    insight: 'Feedback on how you sound',
    text: 'The mock was blunt: my answers sounded memorised, not understood. I changed how I open and structure answers under pressure—not just the facts inside them.',
    proofMetric: 'Illustrative: mock reps before the real panel',
    Icon: Mic2,
  },
  {
    avatar: 'S',
    bg: '#059669',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    tag: '3rd Year · CSE',
    insight: 'Specific weak spot',
    text: 'The score split my DSA by pattern and showed strings were the weak link. Random LeetCode never made that obvious; I finally knew what to drill instead of grinding everything.',
    proofMetric: 'Illustrative: pattern-level score breakdown',
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
  hidden: { opacity: 1, y: 18, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Hero — avatar stack + qualitative social proof (no inflated counts) */
function HeroSocialProof({ ariaLabel, reduceMotion }) {
  const rings = [
    { className: 'bg-gradient-to-br from-[#1A8FC4] to-[#2AAA8A]' },
    { className: 'bg-gradient-to-br from-[#0891b2] to-[#0e7490]' },
    { className: 'bg-gradient-to-br from-[#2AAA8A] to-[#1A8FC4]' },
  ];

  return (
    <motion.div
      className="mt-3 flex flex-col items-center gap-3.5 sm:flex-row sm:items-center sm:justify-start sm:gap-4"
      initial={false}
      animate={{ y: [6, 0] }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ opacity: 1 }}
      aria-label={ariaLabel}
    >
      <div className="flex shrink-0 items-center pl-0.5" aria-hidden>
        {rings.map((ring, i) => (
          <motion.span
            key={i}
            initial={false}
            animate={{ scale: 1, x: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.08 + i * 0.08,
              duration: 0.4,
              type: 'spring',
              stiffness: 380,
              damping: 24,
            }}
            className={`relative h-9 w-9 rounded-full border-[3px] border-white shadow-[0_2px_8px_rgba(15,23,42,0.12)] sm:h-10 sm:w-10 ${ring.className} ${i > 0 ? '-ml-3 sm:-ml-3.5' : ''}`}
          />
        ))}
      </div>
      <p className="max-w-[24rem] text-center text-sm font-semibold leading-snug text-neutral-800 sm:max-w-none sm:text-left">
        {HERO_SOCIAL_PROOF_VISIBLE_LINE}
      </p>
    </motion.div>
  );
}

function HeroProblemTicker({ reduceMotion }) {
  const tickerItems = [...HERO_PROBLEM_TICKER, ...HERO_PROBLEM_TICKER];
  return (
    <section className="relative mt-7 w-full overflow-hidden mm-surface-panel rounded-2xl border border-[#FFD9A8]/80 shadow-[0_6px_22px_rgba(26,143,196,0.08)]">
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

/** Quip below hero score card — shimmer + sparkles (respects reduced motion). */
function HeroPlayfulClause({ text, reduceMotion, newUI = false }) {
  return (
    <motion.div
      className="relative mb-6 w-full max-w-[min(100%,440px)] sm:mb-8 lg:mb-0"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
      style={{ opacity: 1 }}
    >
      <div className="flex justify-center lg:justify-end">
        <div
          className={
            newUI
              ? 'mm-hero-playful-clause-new-ui inline-flex max-w-full items-start gap-2 rounded-xl border px-3.5 py-2.5 text-left'
              : `inline-flex max-w-full items-start gap-2 rounded-xl px-3.5 py-2.5 text-left ${
                  reduceMotion
                    ? 'border border-sky-100/90 bg-sky-50/50'
                    : 'border border-sky-200/70 bg-gradient-to-br from-sky-50/95 via-white to-cyan-50/40 shadow-[0_6px_24px_-10px_rgba(26,143,196,0.35),0_0_0_1px_rgba(26,143,196,0.08)]'
                }`
          }
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
            newUI
              ? 'mm-hero-playful-new-ui'
              : reduceMotion
                ? 'text-neutral-600'
                : 'mm-hero-playful-shimmer'
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
/** Homepage FAQ — visible HTML matches FAQPage JSON-LD in index.html (rich results). */
function HomepageFaqSection() {
  return (
    <section
      className="mm-surface-section border-t py-14 md:py-16 px-5 sm:px-6 lg:px-8"
      aria-labelledby="homepage-faq-heading"
    >
      <div className="mx-auto max-w-3xl">
        <FadeUp>
          <h2 id="homepage-faq-heading" className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Placement prep — common questions
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
            Answers about campus placement, placement mentorship, and our free readiness check for engineering students
            in India.
          </p>
        </FadeUp>
        <div className="mt-8 space-y-2">
          {HOMEPAGE_FAQ_ITEMS.map((item, i) => (
            <FadeUp key={item.question} delay={i * 0.04}>
              <details
                className="group overflow-hidden rounded-xl border border-border bg-card open:shadow-sm"
                open={i === 0 ? true : undefined}
              >
                <summary className="mm-focus cursor-pointer list-none px-4 py-4 text-sm font-semibold text-foreground marker:content-none sm:px-5 sm:text-base [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {item.question}
                    <span className="text-muted-foreground transition group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </span>
                </summary>
                <p className="border-t border-border px-4 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground sm:px-5">
                  {item.answer}
                </p>
              </details>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

const HomePage = () => {
  const reduceMotion = useReducedMotion();
  const { newUI } = useNewUI();
  usePageMeta({
    title: HOMEPAGE_META_TITLE,
    description: HOMEPAGE_META_DESCRIPTION,
    keywords: HOMEPAGE_META_KEYWORDS,
  });
  const heroCopy = HERO_YEAR_COPY.y4;
  const heroLeadCopy = heroCopy.subShort || heroCopy.sub;

  /** Same-page scroll to the conversion block — use scrollIntoView, not hash links. */
  const scrollToFinalCta = () => {
    document.getElementById('final-cta')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const scrollToHomepagePricing = () => {
    document.getElementById('homepage-pricing')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <InnerRouteShell scope="marketing">
    <main className="mm-marketing-flow mm-site-theme relative z-[1] overflow-x-hidden">
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
          animation: mm-problem-track 60s linear infinite;
        }
        .mm-hero-typewriter-line {
          font-size: clamp(1.25rem, 2.8vw + 0.5rem, 2.5rem);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.025em;
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

      {/* ════════════════ HERO — copy left · reality-check card right ════════════════ */}
      <section
        className={
          newUI
            ? 'mm-hero-section mm-new-ui-hero mm-hero-premium mm-marketing-hero-backdrop relative overflow-hidden border-b border-white/[0.06] pb-0 pt-8 md:pt-10 xl:pt-12'
            : 'mm-hero-section mm-hero-premium mm-marketing-hero-backdrop relative overflow-hidden border-b-0 pb-0 pt-8 md:pt-10 xl:pt-12'
        }
      >
        <div className="mm-hero-mesh" aria-hidden />
        <div className="mm-hero-dot-grid" aria-hidden />
        <div className="mm-hero-orb mm-hero-orb--sky" aria-hidden />
        <div className="mm-hero-orb mm-hero-orb--teal" aria-hidden />
        <div className="mm-hero-orb mm-hero-orb--cta" aria-hidden />
        <div className="mm-container relative z-10 flex w-full flex-col">
          <div className="mm-hero-layout">
            <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5 md:gap-6">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ opacity: 1 }}
                className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5"
              >
                <span
                  className={
                    newUI
                      ? 'mm-new-ui-chip mm-new-ui-chip--eyebrow max-w-full px-3 py-1.5 text-left text-[11px] leading-snug sm:text-xs'
                      : 'inline-flex max-w-full items-center gap-2 rounded-full border border-sky-200/90 bg-sky-50/90 px-3 py-1.5 text-left text-[11px] font-medium leading-snug text-[#0c4a6e] sm:text-xs'
                  }
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full shadow-[0_0_0_2px_rgba(16,185,129,0.25)] ${
                      newUI ? 'bg-emerald-400' : 'bg-emerald-500'
                    }`}
                    aria-hidden
                  />
                  <span className="min-w-0">{HERO_EYEBROW}</span>
                </span>
                {newUI ? (
                  <span
                    className="mm-new-ui-chip mm-new-ui-chip--promo px-2.5 py-1 sm:text-[11px]"
                    title="Limited early-bird offer · Skills-first placement prep"
                  >
                    {HERO_EARLY_BIRD_STICKER} · {HERO_GENZ_STICKER}
                  </span>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
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
                )}
              </motion.div>

              <div className="mm-hero-copy w-full min-w-0 text-center">
                <motion.h1
                  key="hero-headline"
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ opacity: 1 }}
                  className="mx-auto max-w-[44rem]"
                >
                  <span className="typo-display block text-neutral-900 leading-[1.06] tracking-tight">
                    {HERO_HEADLINE_LINE1}
                  </span>
                  <span
                    className={
                      newUI
                        ? 'typo-display mt-1 block leading-[1.06] tracking-tight mm-hero-accent-new-ui'
                        : 'typo-display mt-1 block leading-[1.06] tracking-tight mm-gradient-text-brand'
                    }
                  >
                    {HERO_HEADLINE_LINE2}
                  </span>
                  <span className="mt-2 block text-base font-medium text-neutral-600 sm:text-lg">
                    Campus placement mentor &amp; interview readiness for engineering students in India
                  </span>
                  <span className="mt-2 block w-full sm:mt-3">
                    <HeroHeadlineTypewriter
                      phrases={HERO_TYPEWRITER_PHRASES}
                      reducedMotion={reduceMotion}
                      cursorClassName={newUI ? 'bg-[#38bdf8]' : 'bg-[#1A8FC4]'}
                      className={
                        newUI
                          ? 'mm-hero-typewriter-line mm-hero-accent-new-ui block'
                          : 'mm-hero-typewriter-line mm-hero-accent bg-gradient-to-r from-[#15799F] via-[#1A8FC4] to-[#2AAA8A] bg-clip-text text-transparent'
                      }
                    />
                  </span>
                </motion.h1>

                <motion.div
                  key="hero-sub"
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, delay: 0.04 }}
                  style={{ opacity: 1 }}
                  className="mm-hero-sub-block mx-auto mt-4 max-w-prose-marketing px-0 sm:mt-5"
                >
                  <p className="text-base font-semibold leading-snug text-neutral-800 sm:text-lg">{heroLeadCopy}</p>
                  <HeroSocialProof ariaLabel={HERO_SOCIAL_PROOF_ARIA} reduceMotion={reduceMotion} />
                  <div
                    className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start"
                    role="region"
                    aria-label="What MentorMuni offers"
                  >
                    <span
                      className={
                        newUI
                          ? 'mm-new-ui-chip mm-new-ui-chip--emerald px-2.5 py-1 text-[10px] uppercase tracking-[0.1em]'
                          : 'rounded-full border border-emerald-200/90 bg-emerald-50/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-900'
                      }
                    >
                      Mocks → Mentor → Repeat
                    </span>
                    <span
                      className={
                        newUI
                          ? 'mm-new-ui-chip mm-new-ui-chip--sky px-2.5 py-1 text-[10px] uppercase tracking-[0.1em]'
                          : 'rounded-full border border-sky-200/90 bg-sky-50/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-900'
                      }
                    >
                      Your score
                    </span>
                    <span
                      className={
                        newUI
                          ? 'mm-new-ui-chip mm-new-ui-chip--violet px-2.5 py-1 text-[10px] uppercase tracking-[0.1em]'
                          : 'rounded-full border border-violet-200/90 bg-violet-50/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-violet-900'
                      }
                    >
                      5-week program
                    </span>
                  </div>

                  <div className="mm-trust-pills mt-5 mb-1 w-full justify-center sm:justify-start">
                    {['Free · No signup', '~5 min score', 'Mocks & mentors'].map((label) => (
                      <span key={label} className="mm-trust-pill">
                        <span className="mm-trust-pill__check" aria-hidden>
                          ✓
                        </span>
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className="mm-hero-cta-row mt-4 flex w-full flex-col gap-3 sm:mt-5 sm:flex-row sm:flex-wrap sm:items-center">
                    <button
                      type="button"
                      onClick={goToStartAssessment}
                      className="mm-cta-glow mm-btn-interactive inline-flex min-h-[48px] w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#E88600] active:bg-[#D97706] sm:w-auto"
                    >
                      {PRIMARY_CTA_LABEL} <ArrowRight size={16} aria-hidden />
                    </button>
                    <Link
                      to="/how-it-works"
                      className="inline-flex min-h-[48px] w-full touch-manipulation items-center justify-center mm-btn-secondary rounded-xl px-7 py-3.5 text-sm font-bold text-foreground shadow-sm transition-colors hover:border-[#1A8FC4] hover:bg-secondary sm:w-auto"
                    >
                      How it works
                    </Link>
                  </div>

                  <p className="mm-hero-trust mt-3 mb-8 text-center text-xs leading-relaxed text-neutral-600 sm:mb-10">
                    <button
                      type="button"
                      onClick={scrollToHomepagePricing}
                      className="font-semibold text-[#1A8FC4] underline decoration-[#2AAA8A]/45 underline-offset-[4px] transition hover:text-[#15799F] bg-transparent border-0 p-0 cursor-pointer font-inherit text-inherit"
                    >
                      60-day placement program
                    </button>
                    <span className="text-neutral-400"> · </span>
                    <Link to="/contact" className="font-semibold text-[#1A8FC4] hover:text-[#15799F]">
                      {SECONDARY_CTA_BOOK_CALL}
                    </Link>
                    <span className="text-neutral-400"> · </span>
                    <a
                      href={CONTACT_WHATSAPP_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#15803d] hover:underline"
                    >
                      {CONTACT_WHATSAPP_LABEL}
                    </a>
                    <span className="hidden sm:inline text-neutral-400"> · </span>
                    <span className="block sm:inline mt-1 sm:mt-0">{HERO_PROOF_ONE_LINER}</span>
                  </p>
                </motion.div>
              </div>
            </div>

            <motion.div
              className="mm-hero-score-slot flex w-full min-w-0 flex-col items-center justify-center gap-3"
              initial={reduceMotion ? false : { opacity: 0, x: 20, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <HeroFlagshipVisual className="w-full" />
              <HeroPlayfulClause text={HERO_PLAYFUL_CLAUSE} reduceMotion={reduceMotion} newUI={newUI} />
            </motion.div>
          </div>

        </div>
      </section>

      {/* ════════════════ TRUST — campus types + stats ════════════════ */}
      <section
        className="mm-band mm-surface-section mm-section--sm border-t"
        aria-label={HERO_TRUST_LOGO_ROW_LABEL}
      >
        <div className="mm-container mm-container--narrow">
          <div className={`mb-5 ${newUI ? 'flex flex-wrap items-center justify-center gap-5 sm:gap-8' : 'mm-stat-strip'}`}>
            <div className={newUI ? 'text-center' : 'mm-stat-card'}>
              <p className={newUI ? `text-2xl font-extrabold mm-new-ui-stat-value` : 'mm-stat-card__value'}>
                {newUI ? (
                  <AnimatedCounter value="200+" className="inline-block tabular-nums" />
                ) : (
                  '200+'
                )}
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground">readiness scores checked</p>
            </div>
            {newUI && <div className="hidden h-8 w-px bg-border sm:block" aria-hidden />}
            <div className={newUI ? 'text-center' : 'mm-stat-card'}>
              <p
                className={
                  newUI
                    ? 'text-2xl font-extrabold mm-new-ui-stat-value--teal'
                    : 'mm-stat-card__value'
                }
              >
                {newUI ? (
                  <AnimatedCounter value="~5 min" className="inline-block tabular-nums" />
                ) : (
                  '~5 min'
                )}
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground">free readiness score</p>
            </div>
            {newUI && <div className="hidden h-8 w-px bg-border sm:block" aria-hidden />}
            <div className={newUI ? 'text-center' : 'mm-stat-card'}>
              <p
                className={
                  newUI ? 'text-2xl font-extrabold mm-new-ui-stat-value--cta' : 'mm-stat-card__value mm-stat-card__value--cta'
                }
              >
                No signup
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground">to start the check</p>
            </div>
          </div>
          <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
            {HERO_TRUST_LOGO_ROW_LABEL}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {HERO_TRUST_LOGO_ROW_ITEMS.map((label) => (
              <span
                key={label}
                className={
                  newUI
                    ? 'mm-new-ui-chip mm-new-ui-chip--trust px-3 py-1.5 text-[11px] sm:text-xs'
                    : 'inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-slate-50/90 px-3 py-1.5 text-[11px] font-semibold text-slate-700 sm:text-xs'
                }
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <HomepageFreeToolsShowcase />

      {/* ════════════════ Platform depth — below fold (lighter hero, better LCP) ════════════════ */}
      <ScrollReveal
        as="section"
        className="border-t border-border bg-gradient-to-b from-white to-secondary/40 py-5 md:py-7 px-5 sm:px-6 lg:px-8 mm-scroll-reveal--scale"
        aria-label="Platform overview"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-5 md:gap-6">
          <div className="flex w-full max-w-3xl justify-center">
            <HeroLoopVideo />
          </div>
          <HeroValueStack reduceMotion={reduceMotion} />
          <HeroProblemTicker reduceMotion={reduceMotion} />
        </div>
      </ScrollReveal>

      {/* ════════════════ WHAT IS MENTORMUNI — one clear explainer block ════════════════ */}
      <section className="mm-surface-section border-t py-12 md:py-14 px-5 sm:px-6 lg:px-8" aria-labelledby="what-is-mm-heading">
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <div className="rounded-2xl border border-sky-200/70 bg-gradient-to-br from-sky-50/80 via-white to-emerald-50/40 p-7 md:p-10 shadow-[0_4px_28px_rgba(26,143,196,0.08)]">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:gap-12 lg:items-center">
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1A8FC4]">What is MentorMuni?</p>
                  <h2 id="what-is-mm-heading" className="mb-4 text-2xl font-extrabold leading-tight tracking-tight text-foreground md:text-3xl">
                    An interview readiness system —{' '}
                    <span className="bg-gradient-to-r from-[#1A8FC4] to-[#2AAA8A] bg-clip-text text-transparent">
                      not another course to watch.
                    </span>
                  </h2>
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                    MentorMuni is a <strong className="font-semibold text-foreground">placement mentor</strong> for
                    engineering students: a free 5-minute readiness check, a personalised gap report, then AI mock
                    interviews, 1:1 mentorship, and a structured 5-week program ({PROGRAM_6WEEK_PRICE_MAIN}) — built for Indian campus and off-campus
                    hiring (TCS, Infosys, product companies, and more).
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Free readiness check', color: 'border-sky-200 bg-sky-50 text-sky-900' },
                      { label: 'Personalised gap report', color: 'border-teal-200 bg-teal-50 text-teal-900' },
                      { label: 'AI mock interviews', color: 'border-violet-200 bg-violet-50 text-violet-900' },
                      { label: '1:1 mentor sessions', color: 'border-amber-200 bg-amber-50 text-amber-900' },
                      { label: `5-week · ${PROGRAM_6WEEK_PRICE_MAIN}`, color: 'border-emerald-200 bg-emerald-50 text-emerald-900' },
                    ].map(({ label, color }) => (
                      <span key={label} className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${color}`}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4 lg:min-w-[220px]">
                  <div className="mm-surface-panel rounded-xl p-4 text-center">
                    <p className="text-3xl font-extrabold text-[#1A8FC4]">Instant</p>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">to start · no signup needed</p>
                  </div>
                  <div className="mm-surface-panel rounded-xl p-4 text-center">
                    <p className="text-3xl font-extrabold text-[#2AAA8A]">5 min</p>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">readiness check · instant result</p>
                  </div>
                  <button
                    type="button"
                    onClick={goToStartAssessment}
                    className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,149,0,0.3)] transition-colors hover:bg-[#E88600]"
                  >
                    {PRIMARY_CTA_LABEL} <ArrowRight size={15} aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ HR READINESS — interview fear, communication, Hindi-medium inclusive ════════════════ */}
      <section
        className="border-t border-border bg-gradient-to-b from-violet-50/80 via-white to-sky-50/40 py-14 md:py-16 px-5 sm:px-6 lg:px-8"
        aria-labelledby="hr-readiness-heading"
      >
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <header className="mb-10 text-center md:mb-12 md:text-left">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-violet-700 sm:text-sm">
                {HR_READINESS_EYEBROW}
              </p>
              <h2
                id="hr-readiness-heading"
                className="mx-auto max-w-[44rem] text-balance text-3xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:mx-0 md:text-[2.5rem] md:leading-[1.08]"
              >
                {HR_READINESS_HEADLINE}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-snug text-[#15799F] md:mx-0">
                {HR_READINESS_HEADLINE_ACCENT}
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:mx-0">
                {HR_READINESS_SUB}
              </p>
            </header>
          </FadeUp>

          <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,1.05fr)] lg:gap-10 lg:items-start">
            <FadeUp delay={0.06}>
              <div className="mm-surface-panel rounded-2xl p-6 shadow-[0_4px_24px_rgba(124,58,237,0.08)] md:p-7">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
                  <Languages className="h-5 w-5" strokeWidth={2} aria-hidden />
                </div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-800">HR readiness program</p>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-[17px]">
                  {HR_READINESS_PROGRAM_LINE}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={goToStartAssessment}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-colors hover:bg-[#E88600]"
                  >
                    {PRIMARY_CTA_LABEL} <ArrowRight size={16} aria-hidden />
                  </button>
                  <Link
                    to="/contact"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl mm-btn-secondary border-2 border-violet-300 px-6 py-3 text-sm font-bold text-violet-900 transition-colors hover:bg-violet-50"
                  >
                    {SECONDARY_CTA_BOOK_CALL}
                  </Link>
                </div>
              </div>
            </FadeUp>

            <ul className="list-none space-y-4 p-0">
              {HR_READINESS_POINTS.map((point, idx) => (
                <FadeUp key={point.title} delay={0.08 + idx * 0.05}>
                  <li className="flex gap-4 mm-surface-panel rounded-2xl p-5 shadow-sm md:p-6">
                    <span
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-[#15799F]"
                      aria-hidden
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-foreground">{point.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{point.body}</p>
                    </div>
                  </li>
                </FadeUp>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <MentorMuniSystemLoop reduceMotion={reduceMotion} />

      {/* ════════════════ 5-WEEK PROGRAM — timeline + pricing card ════════════════ */}
      <section
        id="homepage-pricing"
        className="mm-surface-section border-t py-14 md:py-16 px-5 sm:px-6 lg:px-8"
        aria-labelledby="program-6week-heading"
      >
        <div className="mx-auto max-w-5xl">
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_minmax(280px,380px)] lg:gap-12 xl:grid-cols-[1fr_400px]">
            {/* Left Column - Header + Timeline */}
            <div>
              <FadeUp>
                <header className="mb-8 text-center md:text-left">
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
            </div>

            {/* Right Column — free check + paid program */}
            <FadeUp delay={0.1}>
              <div className="relative mm-surface-panel rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-7">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1A8FC4] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
                    {PROGRAM_6WEEK_CARD_BADGE}
                  </span>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-bold text-foreground md:text-xl">{PROGRAM_6WEEK_CARD_TITLE}</h3>
                  <p className="mt-2 text-3xl font-black text-[#1A8FC4] md:text-4xl">
                    {PROGRAM_6WEEK_PRICE_MAIN}
                    <span className="ml-1 text-sm font-semibold text-muted-foreground">{PROGRAM_6WEEK_PRICE_MAIN_SUFFIX}</span>
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{PROGRAM_6WEEK_SUMMARY}</p>
                </div>
                <div className="mt-6 border-t border-border pt-6">
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    {PROGRAM_6WEEK_INCLUDES.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 text-[#2AAA8A] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={goToStartAssessment}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-6 py-3.5 text-base font-bold text-white shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all hover:bg-[#E88600]"
                    >
                      {PRIMARY_CTA_LABEL} <ArrowRight className="h-5 w-5" aria-hidden />
                    </button>
                    <Link
                      to={PROGRAM_ENROLL_PATH}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#1A8FC4] bg-white px-6 py-3.5 text-base font-bold text-[#15799F] transition-colors hover:bg-sky-50"
                    >
                      {PROGRAM_ENROLL_CTA}
                    </Link>
                  </div>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    Start free · <Link to={PROGRAM_PRICING_PATH} className="font-semibold text-[#1A8FC4] hover:underline">Full pricing details</Link>
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ════════════════ PROOF — problem + fit + comparison (single scroll) ════════════════ */}
      <section
        className="relative overflow-hidden border-t border-sky-200/50 bg-gradient-to-b from-sky-50/95 via-white to-slate-50/80 py-14 md:py-16 px-5 sm:px-6 lg:px-8"
        aria-labelledby="homepage-proof-heading"
      >
        <div
          className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-sky-300/15 blur-[100px]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-5xl">
          <FadeUp>
            <header className="mb-8 text-center md:mb-10 md:text-left">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#1A8FC4] sm:text-sm sm:tracking-[0.2em]">
                {REAL_PROBLEM_EYEBROW}
              </p>
              <h2
                id="homepage-proof-heading"
                className="mx-auto max-w-[40rem] text-balance text-3xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:mx-0 md:text-[2.5rem] md:leading-[1.08]"
              >
                {COMPARISON_TABLE_HEADLINE}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:mx-0 md:mt-5">
                {COMPARISON_TABLE_SUB}
              </p>
            </header>
          </FadeUp>

          <div className="mb-8 grid gap-4 sm:grid-cols-3 sm:gap-5">
            {REAL_PROBLEM_CARDS.map((card, idx) => {
              const CardIcon = [Clock, Users, TrendingUp][idx];
              return (
                <FadeUp key={card.title} delay={idx * 0.05}>
                  <div className="flex h-full flex-col mm-surface-panel rounded-2xl p-5 shadow-sm">
                    <div
                      className="mb-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 ring-1 ring-rose-100/80"
                      aria-hidden
                    >
                      <CardIcon className="h-5 w-5 text-rose-700/90" strokeWidth={2} />
                    </div>
                    <h3 className="mb-1.5 text-base font-bold leading-snug text-foreground">{card.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>

          <FadeUp delay={0.06}>
            <div className="mb-10 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-5 md:p-6">
              <p className="mb-5 text-center text-sm font-semibold text-foreground md:text-left">
                {REALITY_CHECK_EYEBROW}
              </p>
              <p className="mb-6 text-center text-sm leading-relaxed text-muted-foreground md:text-left md:text-base">
                {REALITY_CHECK_SUB}
              </p>
              <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-rose-700">
                    {REALITY_CHECK_NOT_TITLE}
                  </h3>
                  <ul className="space-y-2.5">
                    {REALITY_CHECK_NOT_ITEMS.slice(0, 4).map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
                    {REALITY_CHECK_FOR_TITLE}
                  </h3>
                  <ul className="space-y-2.5">
                    {REALITY_CHECK_FOR_ITEMS.slice(0, 4).map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
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
                        <tr key={row.label} className="mm-surface-panel">
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

      {/* ════════════════ HOW IT WORKS — what we give (after the “why”) ════════════════ */}
      <section className="mm-surface-section border-t py-14 md:py-16 px-5 sm:px-6 lg:px-8">
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
                <div className="mm-animate-card group flex h-full gap-4 mm-surface-panel rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-all hover:border-[#2AAA8A]">
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
                Take the free readiness check
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
            initial={{ y: 14 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.02, margin: '0px 0px -60px 0px' }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            style={{ opacity: 1 }}
            className="mb-10 text-center md:text-left"
          >
            <div className="mb-3 inline-flex items-center gap-2 mm-surface-chip px-3 py-1.5 shadow-sm backdrop-blur-sm md:mb-4">
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
            viewport={{ once: true, amount: 0.05, margin: '0px 0px -80px 0px' }}
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
                  <div className="relative flex h-full flex-col overflow-hidden mm-surface-panel rounded-3xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-md transition-all duration-300 group-hover:border-[#2AAA8A]/45 group-hover:shadow-[0_16px_48px_rgba(26,143,196,0.14)] md:p-6">
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
                        <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[color:var(--bg-card)]">
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
                  className="inline-flex items-center gap-1.5 rounded-xl mm-btn-secondary border-2 border-[#1A8FC4] px-6 py-3 text-sm font-bold text-[#1A8FC4] shadow-sm transition-colors hover:bg-secondary"
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
                    className="flex gap-3 mm-surface-panel rounded-xl p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
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

      <HomepageFaqSection />

      {/* ════════════════ FINAL CTA (single primary conversion zone for free check — hero also) ════════════════ */}
      <ScrollReveal
        as="section"
        id="final-cta"
        className="mm-band border-t border-emerald-100/80 bg-gradient-to-b from-emerald-50/50 via-white to-white mm-scroll-mt-chrome py-14 md:py-16 mm-scroll-reveal--scale"
      >
        <div className="mm-container mm-container--prose w-full text-left">
          <FadeUp className="w-full text-left">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#15803d] sm:text-sm">5 minutes · Instant result · No signup</p>
            <div className="mb-6 flex w-full max-w-full flex-wrap items-start gap-3 rounded-2xl border border-sky-200/70 bg-gradient-to-r from-sky-50/95 to-sky-100/80 px-4 py-3 text-left text-sm font-semibold leading-snug text-foreground shadow-sm">
              <Gift size={16} className="mt-0.5 shrink-0 text-[#1A8FC4]" aria-hidden />
              <span className="min-w-0 flex-1">{READINESS_TEST_COUPON_BADGE}</span>
            </div>
            <h2 className="mb-4 text-left text-3xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-[2.5rem] md:leading-[1.1]">
              <span className="block">{FINAL_CTA_HEADLINE}</span>
              <span className="mt-2 block text-[#1A8FC4]">{FINAL_CTA_HEADLINE_ACCENT}</span>
            </h2>
            <p className="mb-6 w-full max-w-3xl text-left text-base leading-relaxed text-muted-foreground">{FINAL_CTA_BODY}</p>
            <p className="mb-8 w-full max-w-3xl text-left text-sm leading-relaxed text-muted-foreground md:text-[15px]">
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
            <div className="mb-6 flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <button
                type="button"
                onClick={goToStartAssessment}
                className="mm-cta-glow mm-btn-interactive inline-flex min-h-[48px] w-full touch-manipulation shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-8 py-4 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all hover:bg-[#E88600] active:scale-[0.98] sm:w-auto"
              >
                {PRIMARY_CTA_LABEL} <ArrowRight size={16} aria-hidden />
              </button>
              <Link
                to="/contact"
                className="mm-btn-secondary mm-btn-interactive inline-flex min-h-[48px] w-full touch-manipulation shrink-0 items-center justify-center rounded-xl border-2 border-[#1A8FC4]/80 px-6 py-3.5 text-sm font-bold text-[#1A8FC4] transition hover:bg-secondary active:bg-sky-50/50 sm:w-auto"
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
            <p className="text-left text-sm text-muted-foreground">No signup · ~5 min · instant results</p>
          </FadeUp>
        </div>
      </ScrollReveal>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer className="mm-band border-t border-border bg-secondary py-14">
        <div className="mm-container mm-container--wide w-full">
          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="md:col-span-2">
              <h3 className="font-bold text-foreground mb-2">Mentor<span className="text-[#1A8FC4]">Muni</span></h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-xs">
                {MISSION_TAGLINE}
              </p>
              <div className="mb-4 mm-surface-panel max-w-sm rounded-xl px-3 py-3 shadow-sm">
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
                      {PRIMARY_CTA_LABEL} →
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <a href={CONTACT_EMAIL_HREF} className="flex items-center gap-2 hover:text-[#1A8FC4] transition-colors">
                  <Mail size={13} /> {CONTACT_EMAIL}
                </a>
                <a href={CONTACT_PHONE_HREF} className="flex items-center gap-2 hover:text-[#1A8FC4] transition-colors">
                  <Phone size={13} /> {CONTACT_PHONE_DISPLAY}
                </a>
                <a
                  href={CONTACT_WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#1A8FC4] transition-colors"
                >
                  <MessageCircle size={13} /> {CONTACT_WHATSAPP_LABEL}
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
              <Link to="/terms" className="hover:text-[#1A8FC4] transition-colors">Terms</Link>
              <Link to="/privacy" className="hover:text-[#1A8FC4] transition-colors">Privacy</Link>
              <Link to="/contact" className="hover:text-[#1A8FC4] transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>

    </main>
    </InnerRouteShell>
  );
};

export default HomePage;
