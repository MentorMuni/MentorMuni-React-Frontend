import React, { useRef, createElement } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { goToStartAssessment } from '../utils/startAssessmentNavigation';
import {
  PRIMARY_CTA_LABEL,
  MISSION_TAGLINE,
  PRODUCT_READINESS_SCORE,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  HERO_EYEBROW,
  HERO_YEAR_COPY,
  HERO_HEADLINE_FIXED,
  HERO_TYPEWRITER_PHRASES,
  HERO_JOURNEY_STEPS,
  HERO_JOURNEY_ARC,
  READINESS_TEST_COUPON_BADGE,
  CONVERSION_WHY_SECTION_HEADLINE,
  CONVERSION_WHY_SECTION_SUB,
  CONVERSION_WHY_CARDS,
  FINAL_CTA_HEADLINE,
  FINAL_CTA_HEADLINE_ACCENT,
  FINAL_CTA_BODY,
} from '../constants/brandCopy';
import { AnimatedPrepMapPanel } from './homepage/prepMapPanel';
import { HeroFlagshipVisual } from './homepage/HeroFlagshipVisual';
import { HeroLoopVideo } from './homepage/HeroLoopVideo';
import { HeroHeadlineTypewriter } from './homepage/HeroHeadlineTypewriter';

import {
  ArrowRight, Brain, Target,
  BarChart3, Cpu,
  GraduationCap, Building2, Users,
  Mail, Phone, Check, X,
  BookOpen, Layers, Sparkles, CalendarClock, Mic2,
  Gift, Gauge,
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
    Icon: BookOpen,
    tag: 'LEARN',
    title: 'Free tutorials & AI-tool interview prep',
    desc: 'Topic-wise study materials—Java, Python, SQL, Gen AI, DevOps, and more—plus how to talk about Copilot, ChatGPT, and Cursor credibly in hiring rounds.',
    highlight: 'Free · Learning paths · Panel-ready angles',
    link: '/free-tutorials',
    linkLabel: 'Explore free tutorials',
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
    proofMetric: 'Outcome: top gap named in one flow — not “study everything”',
    Icon: Target,
  },
  {
    avatar: 'R',
    bg: '#0891b2',
    gradient: 'from-cyan-500 via-sky-400 to-teal-400',
    tag: 'Final Year · IT',
    insight: 'Feedback on how you sound',
    text: 'The AI mock was blunt: my answers sounded memorised, not understood. I changed how I open and structure answers under pressure—not just the facts inside them.',
    proofMetric: 'Panel-style feedback: how you sound, not memorised lines',
    Icon: Mic2,
  },
  {
    avatar: 'S',
    bg: '#059669',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    tag: '3rd Year · CSE',
    insight: 'Specific weak spot',
    text: 'The score split my DSA by pattern and showed strings were the weak link. Random LeetCode never made that obvious; I finally knew what to drill instead of grinding everything.',
    proofMetric: 'DSA split by pattern — knew to drill strings, not random LC',
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

/* ─── Early-years section — single blurb (no year tabs) ───────────────── */
const EARLY_SECTION_COPY = {
  shortLine: 'Foundations through placement drives',
  detail:
    "See how interview-style thinking maps to what you're studying—and benchmark DSA, stack, and HR before drives.",
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

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const HomePage = () => {
  const reduceMotion = useReducedMotion();
  const heroCopy = HERO_YEAR_COPY.y4;

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
        /* Smaller than .typo-h1 — responsive display for rotating hero line */
        .mm-hero-typewriter-line {
          font-size: 1.75rem;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.025em;
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
        }
      `}</style>

      {/* ════════════════ HERO — mock-style: copy left · reality-check card right · white field ════════════════ */}
      <section className="relative border-b-0 bg-white pb-0 pt-10 md:pt-12 lg:pt-14">
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-5 sm:px-6 lg:px-8">
          <div className="grid w-full grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-x-12 lg:gap-y-0 xl:gap-x-16">
            {/* Left — eyebrow + headline + sub + journey + primary CTA + proof chips */}
            <div className="flex w-full min-w-0 flex-col gap-5 sm:gap-6">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex justify-center lg:justify-start"
              >
                <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-orange-200/90 bg-orange-50/90 px-3 py-1.5 text-left text-[11px] font-medium leading-snug text-[#78350f] sm:text-xs">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.25)]" aria-hidden />
                  <span className="min-w-0">{HERO_EYEBROW}</span>
                </span>
              </motion.div>

              <div className="w-full text-center lg:text-left">
                <motion.h1
                  key="hero-headline"
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto max-w-[44rem] lg:mx-0 lg:max-w-[36rem]"
                >
                  <span className="typo-display block text-neutral-900">{HERO_HEADLINE_FIXED}</span>
                  <span className="mt-2 block min-h-[min(20vh,8rem)] sm:mt-3 sm:min-h-[6.75rem] md:min-h-[5.75rem]">
                    <HeroHeadlineTypewriter
                      phrases={HERO_TYPEWRITER_PHRASES}
                      reducedMotion={reduceMotion}
                      className="mm-hero-typewriter-line block mm-hero-accent bg-gradient-to-r from-[#ea580c] via-[#FF9500] to-[#f59e0b] bg-clip-text text-transparent"
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
                  <div
                    className="mt-5 space-y-2 rounded-xl border border-orange-100/90 bg-orange-50/50 px-4 py-3.5 sm:px-5 sm:py-4"
                    role="region"
                    aria-label="How MentorMuni works"
                  >
                    <p className="text-center text-[13px] font-bold leading-relaxed tracking-tight text-[#c2410c] sm:text-left sm:text-sm">
                      {HERO_JOURNEY_STEPS}
                    </p>
                    <p className="text-center text-[13px] font-semibold leading-relaxed text-neutral-800 sm:text-left sm:text-sm">
                      {HERO_JOURNEY_ARC}
                    </p>
                  </div>

                  <div className="mt-6 sm:mt-7">
                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-neutral-600 sm:gap-x-6 lg:justify-start">
                      <span className="inline-flex items-center gap-2">
                        <Check className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.5} aria-hidden />
                        Free · No signup
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Check className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.5} aria-hidden />
                        120+ students tested
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Check className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.5} aria-hidden />
                        ~5 min
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right — scorecard */}
            <div className="flex w-full justify-center lg:justify-end lg:pt-1">
              <HeroFlagshipVisual />
            </div>
          </div>

          {/* Loop video — full width below the hero grid */}
          <div className="mt-8 flex w-full flex-col items-center gap-8 lg:mt-10 lg:gap-10">
            <div className="flex w-full max-w-3xl justify-center">
              <HeroLoopVideo />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 2ND & 3RD YEAR — scannable flow + tab + animated map ════════════════ */}
      <section className="relative overflow-hidden border-t-0 bg-gradient-to-b from-[#FFF8EE] via-[#FFF8EE] to-[#FFF8EE] px-6 pb-16 pt-0">
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
                  <span className="mm-hero-accent bg-gradient-to-r from-[#FF9500] via-[#f97316] to-[#FFB347] bg-clip-text text-transparent">
                    not someday, from now.
                  </span>
                </h2>

                <div className="mb-6 rounded-2xl border border-border bg-white/90 px-3 py-4 shadow-sm sm:px-5">
                  <p className="mb-3 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-hint">
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
                          <span className="max-w-[8rem] text-[10px] font-bold uppercase leading-tight tracking-wide text-muted-foreground sm:max-w-[9rem]">
                            {s.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                    <p className="mt-3 text-center text-[10px] text-muted-foreground md:hidden">
                      Learn → readiness test & score → 1:1 MentorMuni
                    </p>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-5 max-w-xl rounded-2xl border border-[#FFB347]/35 bg-gradient-to-br from-white via-[#FFFCF7] to-[#FFF4E0]/70 p-5 shadow-[0_8px_32px_rgba(255,149,0,0.08)]"
                >
                  <p className="text-sm font-bold text-foreground">{EARLY_SECTION_COPY.shortLine}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{EARLY_SECTION_COPY.detail}</p>
                </motion.div>

                <p className="mb-6 max-w-xl text-sm font-medium leading-relaxed text-muted-foreground">
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

                <button
                  type="button"
                  onClick={goToStartAssessment}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-6 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all hover:bg-[#E88600]"
                >
                  Check prep on my topics — free
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </button>
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
      <section className="relative py-16 md:py-20 px-6 border-t border-border overflow-hidden bg-gradient-to-b from-[#FFFDF8] to-[#FFF8EE]">
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
              className="mb-6 max-w-3xl text-2xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-3xl md:text-4xl"
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
                    We started MentorMuni after seeing the same pattern: final-year students showing up for interviews with almost no structured prep.
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
                    'AI mock interviews so your first “real” panel isn’t your first time under pressure',
                    'Mentorship to close gaps and align prep to the companies you’re targeting',
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-white p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
              <p className="text-sm md:text-base text-muted-foreground font-medium max-w-xl">
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
      <section className="py-14 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">How it works</span>
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              What we give you—before you face the real panel
            </h2>
            <p className="text-muted-foreground text-sm mb-4 max-w-2xl leading-relaxed">
              One flow: measure with the readiness check, practice with AI mocks, polish with ATS, learn topic-by-topic with free tutorials and AI-tool talking points, then go deeper with mentor-backed prep when you want a human in your corner.
            </p>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF9500] hover:text-[#E88600] transition-colors mb-10"
            >
              Full step-by-step walkthrough <ArrowRight size={14} />
            </Link>
          </FadeUp>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.07}>
                <div className="group flex gap-4 bg-white border border-border shadow-[0_2px_12px_rgba(0,0,0,0.05)] rounded-2xl p-6 hover:border-[#FFB347] transition-all h-full">
                  <div className="w-10 h-10 bg-[#FFF4E0] border border-border rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFF8EE] transition-colors mt-0.5">
                    <f.Icon size={18} className="text-[#FF9500]" />
                  </div>
                  <div className="min-w-0 flex flex-col">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                      <span className="rounded border border-border bg-[#FFF4E0] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#CC7000]">{f.tag}</span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-2">{f.desc}</p>
                    <span className="text-xs font-semibold text-[#1A8C55]">{f.highlight}</span>
                    {f.link && (
                      <Link
                        to={f.link}
                        className="mt-3 inline-flex w-fit items-center gap-1 text-xs font-semibold text-[#FF9500] transition-colors hover:text-[#E88600]"
                      >
                        {f.linkLabel} <ArrowRight size={12} strokeWidth={2.5} aria-hidden />
                      </Link>
                    )}
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
              <p className="text-xs text-muted-foreground mt-2">No signup · 5 minutes · Instant score</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ STUDENT STORIES — animated cards ════════════════ */}
      <section className="relative overflow-hidden border-t border-border bg-gradient-to-b from-[#FFFDF8] via-[#FFFCF7] to-[#FFF8EE] py-14 md:py-16 px-6">
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
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#CC7000]">
                Real voices
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              What changes{' '}
              <span className="bg-gradient-to-r from-[#FF9500] to-[#E88600] bg-clip-text text-transparent">
                after the assessment
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:mx-0">
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
                  <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white/90 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-md transition-all duration-300 group-hover:border-[#FFB347]/45 group-hover:shadow-[0_16px_48px_rgba(255,149,0,0.14)] md:p-6">
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

                    <p className="relative mb-3 inline-flex w-fit rounded-full bg-[#FFF4E0] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#CC7000] ring-1 ring-[#FFB347]/30">
                      {t.insight}
                    </p>
                    <p className="relative text-base leading-relaxed text-muted-foreground">{t.text}</p>
                    {t.proofMetric && (
                      <p className="relative mt-4 border-t border-border pt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1A8C55]">
                        {t.proofMetric}
                      </p>
                    )}

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
      <section className="py-14 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <FadeUp>
              <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#CC7000]">Expert Mentorship</span>
              <h2 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-foreground md:text-3xl">
                Mentors with 12–15 years<br />
                <span className="text-[#FF9500]">of industry experience.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                Our mentors are senior engineers and tech leads from India's leading IT companies with over a decade of industry experience. They have conducted hundreds of interviews — and bring that perspective directly to your preparation.
              </p>
              <div className="space-y-4 mb-7">
                {[
                  { Icon: Brain, title: 'They know what the interviewer is actually testing', desc: "After 12+ years, they've conducted hundreds of interviews. They'll tell you exactly what an answer needs — not what sounds good." },
                  { Icon: Cpu, title: 'They teach AI tools in real workflows', desc: 'Our mentors use GitHub Copilot, ChatGPT, and Claude daily. They teach you not just how to use these tools but how to talk about them in interviews — a skill most freshers completely lack.' },
                  { Icon: Target, title: 'Company-specific pattern knowledge', desc: 'TCS Digital vs TCS NQT. Cognizant GenC vs GenC Pro. Infosys SP vs DSP. Each track asks different things. Your mentor knows them all.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-3 items-start">
                    <div className="w-8 h-8 bg-[#FFF4E0] border border-border rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.Icon size={14} className="text-[#FF9500]" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm mb-0.5">{item.title}</p>
                      <p className="text-hint text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/mentors" className="inline-flex items-center gap-1.5 bg-[#FF9500] hover:bg-[#E88600] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-[0_4px_14px_rgba(255,149,0,0.25)]">
                Meet the mentors <ArrowRight size={15} />
              </Link>
            </FadeUp>

            <FadeUp delay={0.12}>
              <p className="text-xs text-hint uppercase tracking-wider mb-4 font-medium">What you get with every mentor</p>

              {/* Mentor strengths — student-facing */}
              <div className="space-y-3 mb-5">
                {[
                  { icon: '🏢', label: '10–15 years in the industry', desc: 'Senior engineers and tech leads, not freshers. They have been the interviewer, not just the interviewee.' },
                  { icon: '🎯', label: 'Conducted 100+ interviews themselves', desc: 'They know exactly what interviewers are looking for — because they\'ve been on that side of the table.' },
                  { icon: '🤖', label: 'Actively using AI tools in current role', desc: 'GitHub Copilot, ChatGPT, Cursor — daily. They teach you to use and talk about AI the way interviewers expect today.' },
                  { icon: '📱', label: 'WhatsApp access throughout', desc: 'Not just during sessions. Reachable for quick doubts, mock Q&A, and morale support all week.' },
                ].map(c => (
                  <div key={c.label} className="flex gap-3 items-start bg-white border border-border shadow-[0_2px_12px_rgba(0,0,0,0.05)] rounded-xl p-3.5">
                    <span className="text-lg mt-0.5">{c.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-foreground mb-0.5">{c.label}</p>
                      <p className="text-xs text-hint leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Honest launch notice */}
              <div className="bg-[#FFF4E0] border border-border rounded-xl p-4">
                <p className="text-xs font-bold text-[#CC7000] mb-1">✦ Mentorship cohorts · Waitlist open</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
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

      {/* ════════════════ WHY START — conversion clarity ════════════════ */}
      <section className="border-t border-border bg-gradient-to-b from-[#FFFDF8] to-white py-14 px-6 md:py-16">
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#CC7000] md:text-left">
              Why MentorMuni
            </p>
            <h2 className="mb-3 text-center text-2xl font-bold tracking-tight text-foreground md:text-left md:text-3xl">
              {CONVERSION_WHY_SECTION_HEADLINE}
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground md:mx-0 md:text-left">
              {CONVERSION_WHY_SECTION_SUB}
            </p>
          </FadeUp>
          <div className="grid gap-5 md:grid-cols-3">
            {CONVERSION_WHY_CARDS.map((card, idx) => {
              const CardIcon = [Gauge, Gift, Users][idx];
              return (
                <FadeUp key={card.title} delay={idx * 0.06}>
                  <div className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all hover:border-[#FFB347]/50 hover:shadow-[0_12px_40px_-28px_rgba(255,149,0,0.2)]">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF4E0] ring-1 ring-border">
                      <CardIcon className="h-5 w-5 text-[#FF9500]" strokeWidth={2} aria-hidden />
                    </div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#1A8C55]">{card.kicker}</p>
                    <h3 className="mb-2 text-lg font-bold text-foreground">{card.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
          <FadeUp delay={0.2}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={goToStartAssessment}
                className="inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-8 py-4 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all hover:bg-[#E88600] active:scale-[0.98] sm:w-auto"
              >
                {PRIMARY_CTA_LABEL} <ArrowRight size={16} aria-hidden />
              </button>
              <Link
                to="/waitlist"
                className="text-center text-sm font-semibold text-[#FF9500] underline decoration-[#FFB347]/50 underline-offset-4 transition hover:text-[#E88600]"
              >
                Want mentorship cohorts? Join the waitlist →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ FINAL CTA ════════════════ */}
      <section className="py-16 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <FadeUp>
            <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A8C55]">Free · 5 Minutes · Instant Result</span>
            <p className="mb-4 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-orange-200/70 bg-gradient-to-r from-orange-50/95 to-amber-50/80 px-4 py-2.5 text-center text-sm font-semibold leading-snug text-foreground shadow-sm">
              <Gift size={16} className="shrink-0 text-[#EA580C]" aria-hidden />
              {READINESS_TEST_COUPON_BADGE}
            </p>
            <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
              {FINAL_CTA_HEADLINE}
              <br />
              <span className="text-[#FF9500]">{FINAL_CTA_HEADLINE_ACCENT}</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed text-sm max-w-lg mx-auto">
              {FINAL_CTA_BODY}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <button
                type="button"
                onClick={goToStartAssessment}
                className="flex items-center justify-center gap-2 bg-[#FF9500] hover:bg-[#E88600] text-white font-bold px-8 py-4 rounded-xl shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all text-sm active:scale-[0.98]"
              >
                {PRIMARY_CTA_LABEL} <ArrowRight size={16} />
              </button>
              <Link
                to="/waitlist"
                className="flex items-center justify-center gap-2 border border-[#FF9500] hover:bg-[#FFF4E0] text-[#FF9500] font-medium px-7 py-4 rounded-xl transition-all text-sm active:scale-[0.98]"
              >
                Join the mentorship waitlist
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
              {['No signup needed', 'Free forever', '5 min test', 'Instant score + roadmap'].map(t => (
                <span key={t} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Check size={10} className="text-[#1A8C55]" /> {t}
                </span>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ FOR COLLEGES ════════════════ */}
      <section className="py-14 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-hint uppercase tracking-wider font-medium text-center mb-5">Are you a placement officer?</p>
          <FadeUp>
            <div className="bg-white border border-border shadow-[0_2px_12px_rgba(0,0,0,0.05)] rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-start">
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
      <footer className="border-t border-border bg-[#FFF8EE] py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="md:col-span-2">
              <h3 className="font-bold text-foreground mb-2">Mentor<span className="text-[#FF9500]">Muni</span></h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-xs">
                {MISSION_TAGLINE}
              </p>
              <div className="mb-4 max-w-sm rounded-xl border border-orange-200/60 bg-white/90 px-3 py-3 shadow-sm">
                <div className="flex gap-2.5">
                  <Gift className="h-4 w-4 shrink-0 text-[#CC7000] mt-0.5" aria-hidden />
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Limited offer</p>
                    <p className="text-xs text-muted-foreground leading-snug mb-2">{READINESS_TEST_COUPON_BADGE}</p>
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
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <a href="mailto:hello@mentormuni.com" className="flex items-center gap-2 hover:text-[#FF9500] transition-colors">
                  <Mail size={13} /> hello@mentormuni.com
                </a>
                <a href={CONTACT_PHONE_HREF} className="flex items-center gap-2 hover:text-[#FF9500] transition-colors">
                  <Phone size={13} /> {CONTACT_PHONE_DISPLAY}
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-hint mb-3">Tools</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
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
                <li><Link to="/resume-analyzer" className="hover:text-[#FF9500] transition-colors">Resume Analyzer</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-hint mb-3">Learn</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/free-tutorials" className="hover:text-[#FF9500] transition-colors">Free Tutorials</Link></li>
                <li><Link to="/learning-paths" className="hover:text-[#FF9500] transition-colors">Learning Paths</Link></li>
                <li><Link to="/placement-tracks" className="hover:text-[#FF9500] transition-colors">Placement Tracks</Link></li>
                <li><Link to="/outcomes" className="hover:text-[#FF9500] transition-colors">Outcomes</Link></li>
                <li><Link to="/leadership-board" className="hover:text-[#FF9500] transition-colors">Leadership Board</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-hint mb-3">Company</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/contact" className="hover:text-[#FF9500] transition-colors">Contact</Link></li>
                <li><Link to="/mentors" className="hover:text-[#FF9500] transition-colors">Mentorship</Link></li>
                <li><Link to="/for-recruiters" className="hover:text-[#FF9500] transition-colors">For Recruiters</Link></li>
                <li><Link to="/colleges" className="hover:text-[#FF9500] transition-colors">For Colleges</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
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
