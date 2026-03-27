import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { goToStartAssessment } from '../utils/startAssessmentNavigation';
import {
  PRIMARY_CTA_LABEL,
  PAIN_HOOK,
  MISSION_TAGLINE,
  MENTORSHIP_BANNER,
  MENTORSHIP_TRUST_BADGE,
  PRODUCT_READINESS_SCORE,
} from '../constants/brandCopy';
import {
  ArrowRight, Brain, Target, Trophy,
  BarChart3, Cpu, TrendingUp,
  MessageSquare, GraduationCap, Building2, Users,
  Mail, Phone, Check, X,
  BookOpen, Code2, Layers, Sparkles, CalendarClock,
} from 'lucide-react';

/* ─── Welcome popup ─────────────────────────────────────────── */
const WelcomePopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('mm_popup_seen')) return;
    let triggered = false;
    const trigger = () => { if (triggered) return; triggered = true; setOpen(true); };
    const timer = setTimeout(trigger, 30000);
    const onMouseLeave = (e) => { if (e.clientY <= 0) trigger(); };
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      if (scrolled / document.documentElement.scrollHeight >= 0.6) trigger();
    };
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(timer); document.removeEventListener('mouseleave', onMouseLeave); window.removeEventListener('scroll', onScroll); };
  }, []);

  const close = () => { sessionStorage.setItem('mm_popup_seen', '1'); setOpen(false); };

  // Auto-dismiss after 6 seconds
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(close, 6000);
    return () => clearTimeout(t);
  }, [open]);;

  const outcomes = [
    {
      Icon: BarChart3,
      label: 'Score across the areas recruiters test',
      sub: 'DSA, system design, HR, and project depth—in one index out of 100.',
    },
    {
      Icon: Target,
      label: 'Gaps you can act on',
      sub: 'Concrete weaknesses, not vague advice to “study more.”',
    },
    {
      Icon: CalendarClock,
      label: 'What to do next, in order',
      sub: 'A practical sequence so you know where to start this week.',
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="popup-backdrop"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[rgba(255,149,0,0.12)] backdrop-blur-sm" onClick={close} />

          <motion.div
            key="popup-card"
            className="relative z-10 w-full max-w-[420px] overflow-hidden"
            style={{
              background: '#ffffff',
              border: '1px solid #F0ECE0',
              borderRadius: 18,
              boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 2px 12px rgba(0,0,0,0.05)',
            }}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Auto-dismiss countdown bar */}
            <div style={{ height: 3, background: 'rgba(255,149,0,0.15)', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, height: '100%',
                background: 'linear-gradient(90deg,#FF9500,#FFB347)',
                width: '100%',
                animation: 'mm-countdown 6s linear forwards',
              }} />
            </div>
            <style>{`@keyframes mm-countdown { from { width: 100%; } to { width: 0%; } }`}</style>

            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-[#888888] hover:text-[#1A1A1A] hover:bg-[#FFF4E0] transition-all"
              aria-label="Close"
            >
              <X size={15} />
            </button>

            <div className="px-6 pt-5 pb-6">

              {/* Brand header */}
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg,#FF9500,#FFB347)' }}>
                  M
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1A1A1A] leading-none">MentorMuni</p>
                  <p className="text-[10px] text-[#888888] leading-none mt-0.5">Interview readiness check</p>
                </div>
                <span className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold text-[#1A8C55] bg-[#E8F8F0] border border-[#1A8C55]/25 rounded-full px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A8C55] animate-pulse" />
                  Free
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-[1.35rem] font-extrabold text-[#1A1A1A] leading-tight mb-2 tracking-tight">
                Know where you stand<br />
                <span style={{ background: 'linear-gradient(90deg,#FF9500,#FFB347)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  before the interview round
                </span>
              </h2>
              <p className="text-sm text-[#666666] leading-relaxed mb-5">
                Confidence is easy; calibrated prep is harder. In about five minutes you get a readiness score, a clear view of strengths and gaps, and a focused idea of what to improve next—so you prepare with intent, not guesswork.
              </p>

              {/* Outcome cards */}
              <div className="space-y-2 mb-5">
                {outcomes.map((o, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl px-3.5 py-2.5"
                    style={{ background: 'rgba(255,149,0,0.08)', border: '1px solid rgba(255,149,0,0.2)' }}>
                    <o.Icon size={18} className="text-[#E88600] shrink-0 mt-0.5" strokeWidth={2.25} aria-hidden />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#1A1A1A] leading-snug mb-0.5">{o.label}</p>
                      <p className="text-[10px] text-[#888888] leading-snug">{o.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={() => {
                  close();
                  goToStartAssessment();
                }}
                className="group flex items-center justify-center gap-2 w-full text-white font-bold text-sm py-3.5 rounded-xl transition-all mb-3"
                style={{ background: 'linear-gradient(135deg,#FF9500,#E88600)', boxShadow: '0 4px 14px rgba(255,149,0,0.25)' }}
              >
                {PRIMARY_CTA_LABEL}
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Trust row */}
              <div className="flex justify-center gap-5 mb-3">
                {['~5 minutes', 'No account required', 'Immediate results'].map(t => (
                  <span key={t} className="flex items-center gap-1 text-[11px] text-[#666666]">
                    <Check size={9} className="text-[#1A8C55] shrink-0" /> {t}
                  </span>
                ))}
              </div>

              {/* Neutral dismiss */}
              <button
                onClick={close}
                className="w-full text-center text-[11px] text-[#666666] hover:text-[#1A1A1A] transition-colors py-1"
              >
                Not now
              </button>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

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

/* ─── Features data ─────────────────────────────────────────── */
const FEATURES = [
  {
    Icon: Brain,
    tag: 'START HERE',
    title: 'Interview Readiness Score',
    desc: 'Answer 20 questions across DSA, System Design, and HR. Get a score out of 100 broken down by category — so you know exactly what to work on first, not everything at once.',
    highlight: 'Free · 5 minutes · Instant result',
  },
  {
    Icon: Cpu,
    tag: 'MOST IMPORTANT',
    title: 'AI Mock Interviews',
    desc: "Knowing an answer in your head is completely different from saying it out loud under pressure. Our AI interviews you in real-time — just like a recruiter — and tells you exactly why your answer would get rejected.",
    highlight: 'Simulates real TCS, Wipro, Infosys patterns',
  },
  {
    Icon: BarChart3,
    tag: 'HIDDEN FILTER',
    title: 'Resume ATS Checker',
    desc: "75% of resumes are rejected before any human sees them — by software. Paste yours in, get your ATS score, and see exactly which lines are getting you filtered out before you even reach an interview.",
    highlight: 'Instant ATS score + fix suggestions',
  },
  {
    Icon: TrendingUp,
    tag: 'AI ADVANTAGE',
    title: 'AI Tools Training',
    desc: "Interviewers in 2025 now ask: 'How do you use AI in your workflow?' Students who can't answer lose points. We teach you to use GitHub Copilot, ChatGPT, and Cursor in real development — so you stand out.",
    highlight: 'New in 2025 — AI fluency module',
  },
];

/* ─── Beta feedback ─────────────────────────────────────────── */
const BETA_FEEDBACK = [
  {
    avatar: 'V', bg: '#FF9500',
    tag: '4th Year · CSE',
    quote: "The gap analysis was more specific than anything my seniors told me. It showed me System Design was my blind spot — I had never even heard of some concepts they asked about. Three weeks of focused prep and I actually understand what I'm talking about now.",
  },
  {
    avatar: 'R', bg: '#0891b2',
    tag: 'Final Year · IT',
    quote: "I did 5 AI mock interviews and the feedback was uncomfortably accurate. It told me I explained things in a way that sounds like I memorised them, not understood them. That one feedback changed how I answer questions.",
  },
  {
    avatar: 'S', bg: '#059669',
    tag: '3rd Year · CSE',
    quote: "The readiness score broke down my gaps by category — not just 'you need more DSA practice'. It told me I was weak at string manipulation specifically. That's actually useful. Random LeetCode wasn't giving me that.",
  },
];


/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const HomePage = () => {
  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <style>{`
        :focus-visible {
          outline: 2px solid #FF9500;
          outline-offset: 3px;
          border-radius: 6px;
        }
      `}</style>
      <WelcomePopup />

      {/* ════════════════ ANNOUNCEMENT BANNER ════════════════ */}
      <div className="bg-[#FFF4E0] border-b border-[#F0ECE0] py-2 px-4 text-center">
        <p className="text-xs text-[#CC7000]">
          <span className="font-semibold">{MENTORSHIP_BANNER}</span>
          {' · '}
          <Link to="/waitlist" className="underline hover:no-underline font-semibold">Join the waitlist →</Link>
        </p>
      </div>

      {/* ════════════════ HERO ════════════════ */}
      <section className="relative min-h-[92vh] flex items-center">
        <div className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px] bg-[rgba(255,149,0,0.12)] rounded-full blur-[130px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-[rgba(255,179,71,0.08)] rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-10 grid lg:grid-cols-2 gap-10 lg:gap-14 items-start w-full">

          {/* ── Left: copy ── */}
          <div>
            {/* Eyebrow pill */}
            <style>{`
              @keyframes mm-pill-shimmer {
                0%   { transform: translateX(-120%) skewX(-15deg); opacity: 0; }
                10%  { opacity: 1; }
                90%  { opacity: 1; }
                100% { transform: translateX(320%) skewX(-15deg); opacity: 0; }
              }
              @keyframes mm-pill-border {
                0%,100% { border-color: rgba(255,149,0,0.25); }
                50%      { border-color: rgba(255,149,0,0.55); }
              }
            `}</style>
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 relative overflow-hidden"
              style={{
                background: 'rgba(255,149,0,0.08)',
                border: '1px solid rgba(255,149,0,0.2)',
                animation: 'mm-pill-border 3s ease-in-out infinite',
              }}
            >
              {/* shimmer sweep */}
              <span style={{
                position: 'absolute', top: 0, left: 0, height: '100%', width: '35%',
                background: 'linear-gradient(90deg, transparent, rgba(255,149,0,0.12), transparent)',
                animation: 'mm-pill-shimmer 4s ease-in-out infinite',
                pointerEvents: 'none',
              }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500] animate-pulse shrink-0 relative z-10" />
              <span className="text-xs font-semibold text-[#CC7000] tracking-wide relative z-10">
                Interview readiness for 2nd–4th year engineering students
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-4xl md:text-5xl xl:text-[3.2rem] font-extrabold leading-[1.08] mb-5 tracking-tight"
            >
              Placement season is coming.{' '}
              <br className="hidden sm:block" />
              <span style={{
                background: 'linear-gradient(90deg,#FF9500,#FFB347)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Walk in prepared.
              </span>
            </motion.h1>

            {/* Problem hook — first 5 seconds */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mb-5 max-w-[540px] text-base md:text-lg font-medium text-[#1A1A1A] leading-snug border-l-[3px] border-[#FF9500] pl-4"
            >
              {PAIN_HOOK}
            </motion.p>

            {/* Solution sub-copy */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mb-5 max-w-[480px] space-y-2"
            >
              <p className="text-lg leading-relaxed text-[#444444]">
                <span className="text-[#1A1A1A] font-semibold">
                  MentorMuni builds a focused path only for you
                </span>
                {' '}— based on your strengths, your gaps, and your interview timeline.
              </p>
              <p className="text-sm leading-relaxed text-[#666666]">
                <span className="text-[#FF9500] font-semibold">AI-powered mock interviews</span>
                {' '}and{' '}
                <span className="text-[#FF9500] font-semibold">real mentor feedback</span>
                {' '}to help you become job-ready.
              </p>
            </motion.div>

            {/* 3 outcome points */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="flex flex-col gap-2.5 mb-8"
            >
              {[
                'A readiness score built around your profile — not a one-size-fits-all test',
                'Strengths and gaps specific to your role, skills, and target companies',
                'A week-by-week preparation path designed for your interview timeline',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-[#FF9500]" />
                  <span className="text-sm text-[#444444]">{text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6"
            >
              <button
                type="button"
                onClick={goToStartAssessment}
                className="group inline-flex items-center justify-center gap-2 bg-[#FF9500] hover:bg-[#E88600] text-white font-bold text-base px-8 py-4 rounded-xl shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all"
              >
                {PRIMARY_CTA_LABEL}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/how-it-works"
                className="text-[#666666] hover:text-[#FF9500] text-sm font-medium transition-colors flex items-center gap-1.5 px-2 rounded"
              >
                See how it works <ArrowRight size={14} />
              </Link>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              <div className="flex items-center gap-2 bg-[#FFF4E0] border border-[#F0ECE0] rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A8C55] animate-pulse" />
                <span className="text-xs font-semibold text-[#CC7000]">{MENTORSHIP_TRUST_BADGE}</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {[
                  { icon: '✓', text: 'Free always' },
                  { icon: '✓', text: 'No signup' },
                  { icon: '✓', text: '5 minutes' },
                ].map(t => (
                  <span key={t.text} className="text-[11px] text-[#666666] flex items-center gap-1">
                    <span className="text-[#1A8C55]">{t.icon}</span> {t.text}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right: brand image + feature pills ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:flex flex-row items-start justify-center gap-4 w-full"
            style={{ marginTop: 80 }}
          >
            <style>{`
              @keyframes mm-glow {
                0%, 100% { box-shadow: 0 0 10px 2px rgba(255,149,0,0.35), 0 0 0 1px rgba(255,149,0,0.25); }
                50%       { box-shadow: 0 0 22px 6px rgba(255,149,0,0.45), 0 0 0 1px rgba(255,149,0,0.35); }
              }
              @keyframes mm-dot-blink {
                0%, 100% { opacity: 1; transform: scale(1); }
                50%       { opacity: 0.4; transform: scale(0.75); }
              }
              @keyframes mm-badge-float {
                0%, 100% { transform: translateY(0px); }
                50%       { transform: translateY(-4px); }
              }
              @keyframes mm-fp {
                0%        { opacity: 0; transform: translateX(10px) scale(0.90); }
                12%, 68%  { opacity: 1; transform: translateX(0)    scale(1);    }
                80%,100%  { opacity: 0; transform: translateX(8px)  scale(0.92); }
              }
            `}</style>

            {/* Left: Free 1-on-1 badge + image */}
            <div className="flex flex-col items-center shrink-0">
              {/* Free 1-on-1 badge */}
              <Link
                to="/waitlist"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: 'linear-gradient(135deg, #ffffff, #FFF8EE)',
                  border: '1px solid rgba(255,149,0,0.35)',
                  borderRadius: 14, padding: '10px 18px',
                  textDecoration: 'none', marginBottom: 18,
                  animation: 'mm-glow 2s ease-in-out infinite, mm-badge-float 3s ease-in-out infinite',
                  cursor: 'pointer',
                }}
              >
                <span style={{
                  width: 9, height: 9, borderRadius: '50%',
                  background: '#1A8C55', flexShrink: 0,
                  animation: 'mm-dot-blink 1.2s ease-in-out infinite',
                  boxShadow: '0 0 8px rgba(26,140,85,0.5)',
                }} />
                <span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#1A1A1A', display: 'block', lineHeight: 1.2 }}>
                    Free 1-on-1 Mentorship Session
                  </span>
                  <span style={{ fontSize: 10, color: '#666666', fontWeight: 500 }}>
                    Limited slots · Book yours before they fill up
                  </span>
                </span>
                <span style={{ marginLeft: 4, fontSize: 14, color: '#FF9500', fontWeight: 700, flexShrink: 0 }}>→</span>
              </Link>

              <img
                src="/MentorMuni-React-Frontend/mentormuni-brand-banner-new.png"
                alt="MentorMuni — Guiding Your Journey to Knowledge"
                className="w-full rounded-2xl"
                style={{ maxWidth: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,149,0,0.08)' }}
              />
            </div>

            {/* Right: randomly flashing feature pills */}
            <div className="flex flex-col gap-3 shrink-0" style={{ marginTop: 72, width: 168 }}>
              {[
                { icon: '📊', text: 'Readiness Score',     color: '#CC7000', bg: 'rgba(255,149,0,0.10)',  border: 'rgba(255,149,0,0.28)',  delay: '0s',   dur: '6s'   },
                { icon: '🤖', text: 'AI Mock Interview',   color: '#FF9500', bg: 'rgba(255,179,71,0.12)', border: 'rgba(255,179,71,0.28)', delay: '2.2s', dur: '7s'   },
                { icon: '📄', text: 'Resume Analyser',     color: '#CC7000', bg: 'rgba(255,149,0,0.08)', border: 'rgba(255,149,0,0.22)', delay: '1s',   dur: '8s'   },
                { icon: '👨‍🏫', text: '1-on-1 Mentorship',  color: '#E88600', bg: 'rgba(255,213,128,0.15)', border: 'rgba(255,179,71,0.3)', delay: '3.5s', dur: '6.5s' },
                { icon: '📚', text: 'Free Study Material', color: '#1A8C55', bg: 'rgba(26,140,85,0.08)',  border: 'rgba(26,140,85,0.22)', delay: '4.8s', dur: '7.5s' },
              ].map((p, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 13px', borderRadius: 10,
                    background: p.bg, border: `1px solid ${p.border}`,
                    backdropFilter: 'blur(8px)',
                    animation: `mm-fp ${p.dur} ${p.delay} ease-in-out infinite`,
                    opacity: 0,
                  }}
                >
                  <span style={{ fontSize: 15 }}>{p.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: p.color, whiteSpace: 'nowrap' }}>{p.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ 2ND & 3RD YEAR — EARLY INTERVIEW PREP ════════════════ */}
      <section className="relative py-16 px-6 border-t border-[#F0ECE0] overflow-hidden bg-[#FFF8EE]">
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[rgba(255,149,0,0.12)] blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[rgba(255,179,71,0.1)] blur-[90px]" />
        <div className="max-w-5xl mx-auto relative">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
            <FadeUp>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB347]/40 bg-[#FFF4E0] px-3 py-1.5">
                  <GraduationCap size={14} className="text-[#FF9500]" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#CC7000]">2nd year</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB347]/40 bg-[#FFF4E0] px-3 py-1.5">
                  <GraduationCap size={14} className="text-[#E88600]" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#CC7000]">3rd year</span>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] leading-tight mb-3">
                Prep for the topics you&apos;re studying —{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9500] via-[#FFB347] to-[#FFD580]">
                  not someday, from now.
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-3 mb-5 max-w-xl">
                <div className="rounded-xl border border-[#F0ECE0] bg-white px-3.5 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#CC7000] mb-1">2nd year focus</p>
                  <p className="text-xs text-[#666666] leading-snug">
                    Foundations, core subjects, first projects — see how interview-style thinking maps to what you&apos;re in class now.
                  </p>
                </div>
                <div className="rounded-xl border border-[#F0ECE0] bg-white px-3.5 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#CC7000] mb-1">3rd year focus</p>
                  <p className="text-xs text-[#666666] leading-snug">
                    Internships &amp; sharper tech rounds — benchmark DSA, stack, and HR on the timeline ahead of drives.
                  </p>
                </div>
              </div>
              <p className="text-[#666666] text-sm leading-relaxed mb-5 max-w-xl">
                Interviews reward{' '}
                <span className="text-[#444444]">clarity on what you already cover</span> (DSA, core CS, projects) — and honest gaps.
                Map how interview-ready you are on the stack you&apos;re preparing, then double down where it counts.
              </p>
              <ul className="space-y-2.5 mb-7">
                {[
                  { Icon: BookOpen, text: 'See readiness against the topics on your plate — not generic advice', accent: 'orange' },
                  { Icon: Layers, text: 'Know what to fix first while you still have semesters ahead', accent: 'peach' },
                  { Icon: CalendarClock, text: '~5 minutes · Free · No signup — check in anytime as your prep evolves', accent: 'orange' },
                ].map(({ Icon, text, accent }) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-[#666666]">
                    <span
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                        accent === 'peach'
                          ? 'border-[#FFB347]/35 bg-[#FFF4E0]'
                          : 'border-[#FF9500]/30 bg-[#FFF4E0]'
                      }`}
                    >
                      <Icon size={14} className={accent === 'peach' ? 'text-[#E88600]' : 'text-[#FF9500]'} />
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={goToStartAssessment}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF9500] hover:bg-[#E88600] px-6 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all"
              >
                Check prep on my topics — free
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <p className="mt-3 text-[11px] text-[#666666]">
                When you start, choose the profile that fits your goal —{' '}
                <span className="text-[#FF9500]">3rd Year Student</span> for internship-focused prep (works for many 2nd-year
                students mapping early), or <span className="text-[#CC7000]">4th Year</span> when placement season is live.
              </p>
            </FadeUp>

            <FadeUp delay={0.12}>
              <div className="relative">
                <div
                  className="absolute -inset-px rounded-3xl bg-gradient-to-br from-[#FF9500]/25 via-[#FFB347]/20 to-[#FFD580]/15 opacity-90 blur-sm"
                  aria-hidden
                />
                <div className="relative overflow-hidden rounded-3xl border border-[#F0ECE0] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-[#FF9500]" />
                      <span className="text-xs font-bold text-[#1A1A1A]">Your prep map</span>
                    </div>
                    <span className="rounded-full border border-[#F0ECE0] bg-[#FFF4E0] px-2.5 py-0.5 text-[10px] font-semibold text-[#CC7000]">
                      Sample snapshot
                    </span>
                  </div>
                  <p className="mb-5 text-[11px] leading-relaxed text-[#888888]">
                    The real assessment scores you across skills you select — here&apos;s how topic focus can look.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Code2, label: 'DSA & problem solving', w: 72, hue: 'from-[#FF9500] to-[#FFB347]' },
                      { icon: Layers, label: 'OS / DBMS / CN', w: 58, hue: 'from-[#FFB347] to-[#FFD580]' },
                      { icon: Cpu, label: 'Projects & stack', w: 65, hue: 'from-[#FF9500] to-[#E88600]' },
                      { icon: MessageSquare, label: 'HR & communication', w: 48, hue: 'from-[#FFB347] to-[#FF9500]' },
                    ].map((row, i) => (
                      <div
                        key={row.label}
                        className="rounded-2xl border border-[#F0ECE0] bg-[#FFFDF8] p-3 transition-transform hover:scale-[1.02] hover:border-[#FFB347]"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <row.icon size={14} className="text-[#666666]" />
                          <span className="text-[10px] font-semibold leading-tight text-[#444444]">{row.label}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-[#F0ECE0]">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${row.hue}`}
                            style={{ width: `${row.w}%` }}
                          />
                        </div>
                        <p className="mt-1.5 text-[9px] text-[#888888]">Directional — your report is personalized</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-[#F0ECE0] pt-4">
                    {['OOPs', 'SQL', 'Git', 'Aptitude', 'System basics'].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-[#F0ECE0] bg-[#FFF8EE] px-2.5 py-1 text-[10px] font-medium text-[#666666]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ════════════════ THE 2025 HIRING LANDSCAPE ════════════════ */}
      <section className="py-14 px-6 border-t border-[#F0ECE0]">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <span className="text-xs font-bold text-[#CC7000] uppercase tracking-widest block mb-3">The 2025 Hiring Landscape</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] mb-3 leading-tight">
              The placement environment has changed significantly.
              <br />
              <span className="text-[#FF9500]">Preparation needs to change with it.</span>
            </h2>
            <p className="text-[#666666] text-sm mb-10 max-w-2xl leading-relaxed">
              Understanding what has shifted in hiring over the last two years is essential to preparing effectively for placements in 2025.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-5 mb-8">
            {[
              {
                icon: '🤖', color: 'border-red-500/30 bg-red-500/5',
                tagColor: 'text-red-400',
                tag: 'Industry Shift',
                title: 'Reduced entry-level hiring across IT sector',
                body: "Automation has reduced entry-level headcount requirements at major IT firms. Fewer openings with the same pool of graduates means the selection bar has risen considerably.",
              },
              {
                icon: '🧠', color: 'border-amber-500/30 bg-amber-500/5',
                tagColor: 'text-amber-400',
                tag: 'New Interview Criteria',
                title: 'AI tool proficiency is now assessed in interviews',
                body: "Questions around practical AI tool usage have become standard in technical rounds. Students who can demonstrate familiarity with tools like GitHub Copilot and ChatGPT in their workflow have a clear advantage.",
              },
              {
                icon: '👥', color: 'border-[#FFB347]/35 bg-[#FFF4E0]',
                tagColor: 'text-[#CC7000]',
                tag: 'Increased Competition',
                title: '15+ applicants per IT opening — up from 4:1 in 2022',
                body: "The candidates clearing rounds today are not necessarily more talented. They have prepared more specifically — they identified their exact gaps and focused on those, rather than preparing broadly.",
              },
              {
                icon: '📅', color: 'border-[#FFB347]/35 bg-[#FFF8EE]',
                tagColor: 'text-[#FF9500]',
                tag: 'Placement Cycle Reality',
                title: 'Campus drives run in defined windows',
                body: "Placement seasons at most colleges run October–December and February–April. Missing your preparation window means waiting months for the next cycle — making focused, timely preparation essential.",
              },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.07}>
                <div className={`rounded-2xl border p-5 h-full ${item.color}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{item.icon}</span>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${item.tagColor} block mb-1`}>{item.tag}</span>
                      <h3 className="text-[#1A1A1A] font-bold text-sm mb-2 leading-snug">{item.title}</h3>
                      <p className="text-[#666666] text-xs leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.25}>
            <div className="bg-white border border-[#F0ECE0] shadow-[0_2px_12px_rgba(0,0,0,0.05)] rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1">
                <p className="text-[#1A1A1A] font-semibold text-sm mb-1">Students who perform well in placements prepare with a clear plan, not just effort.</p>
                <p className="text-[#666666] text-xs leading-relaxed">They measure their readiness first, identify specific gaps, and fix those gaps systematically — with guidance from mentors who understand the exact interviews they are facing.</p>
              </div>
              <button
                type="button"
                onClick={goToStartAssessment}
                className="flex-shrink-0 flex items-center gap-2 bg-[#FF9500] hover:bg-[#E88600] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-[0_4px_14px_rgba(255,149,0,0.25)]"
              >
                {PRIMARY_CTA_LABEL} <ArrowRight size={14} />
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ THE PLACEMENT GAP ════════════════ */}
      <section className="py-14 px-6 border-t border-[#F0ECE0]">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest block mb-3">Understanding the Placement Gap</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] mb-2 leading-tight">
              Strong academics. Struggling interviews.
              <br /><span className="text-[#666666] font-normal text-xl">Why interview preparation is a distinct skill.</span>
            </h2>
            <p className="text-[#666666] text-sm mb-10 max-w-2xl leading-relaxed">
              College examinations and placement interviews assess very different abilities. Students who prepare for each separately perform significantly better in both.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {[
              {
                stat: '60%+', color: 'text-red-600', statBg: 'bg-red-50 border-red-200',
                label: 'of engineering freshers fail their first campus interview',
                sub: "NASSCOM 2024 hiring report. College tests memory under controlled conditions. Interviews test thinking under pressure with a stranger watching — a completely different skill.",
              },
              {
                stat: '1 in 3', color: 'text-[#CC7000]', statBg: 'bg-[#FFF4E0] border-[#FFB347]/30',
                label: 'campus students say they froze when they knew the answer',
                sub: "Saying an answer out loud to a timer is different from knowing it in your head. Most students have never once practiced answering a technical question aloud before their first real interview.",
              },
              {
                stat: '15:1', color: 'text-[#1A8C55]', statBg: 'bg-[#E8F8F0] border-[#1A8C55]/20',
                label: 'applicants per IT opening in 2025 — up from 4:1 in 2022',
                sub: "LinkedIn 2024 India Jobs Report. The candidates who clear rounds aren't smarter. They prepared specifically — they knew their score and exactly what to fix.",
              },
            ].map((item, i) => (
              <FadeUp key={item.stat} delay={i * 0.08}>
                <div className="bg-white border border-[#F0ECE0] shadow-[0_2px_12px_rgba(0,0,0,0.05)] rounded-2xl p-6 h-full flex flex-col">
                  <div className={`inline-block border rounded-xl px-3 py-1.5 mb-4 ${item.statBg}`}>
                    <span className={`text-3xl font-extrabold ${item.color}`}>{item.stat}</span>
                  </div>
                  <p className="font-bold text-[#1A1A1A] text-sm leading-snug mb-2">{item.label}</p>
                  <p className="text-[#888888] text-xs leading-relaxed flex-1">{item.sub}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Side-by-side comparison */}
          <FadeUp delay={0.2}>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
                <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3">The unprepared student</p>
                <div className="space-y-2">
                  {[
                    'Did LeetCode randomly — no pattern, no strategy',
                    'Never said an answer out loud under time pressure',
                    'Resume written in final year, never ATS-tested',
                    "Can't explain what they built in their projects clearly",
                    "Answers 'why this company?' with the company website copy",
                  ].map(p => (
                    <div key={p} className="flex items-start gap-2">
                      <X size={12} className="text-red-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-[#666666] leading-snug">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
                <p className="text-xs font-bold text-[#1A8C55] uppercase tracking-widest mb-3">The placed student</p>
                <div className="space-y-2">
                  {[
                    'Took a readiness test — knew their exact score and gaps',
                    'Did 15+ mock interviews out loud, with feedback',
                    'Resume scored 85+ on ATS — every line had a reason',
                    'Practiced STAR answers for every project they listed',
                    'Knew each company\'s specific interview pattern beforehand',
                  ].map(p => (
                    <div key={p} className="flex items-start gap-2">
                      <Check size={12} className="text-[#1A8C55] mt-0.5 shrink-0" />
                      <span className="text-xs text-[#666666] leading-snug">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ FEATURES ════════════════ */}
      <section className="py-14 px-6 border-t border-[#F0ECE0]">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <span className="text-xs font-bold text-[#FF9500] uppercase tracking-widest block mb-3">What MentorMuni gives you</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] mb-2">Four tools. One goal: get you placed.</h2>
            <p className="text-[#666666] text-sm mb-10 max-w-xl leading-relaxed">
              No video lectures. No random quizzes. Every tool targets a specific gap between where you are and where you need to be.
            </p>
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

      {/* ════════════════ STUDENT FEEDBACK ════════════════ */}
      <section className="py-14 px-6 border-t border-[#F0ECE0]">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <span className="text-xs font-bold text-[#FF9500] uppercase tracking-widest block mb-3">Student Experiences</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] mb-3">What students discover from the assessment.</h2>
            <p className="text-[#666666] text-sm mb-10 max-w-2xl leading-relaxed">
              Feedback from students who completed the Interview Readiness Assessment. Names withheld on request.
            </p>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-5">
            {BETA_FEEDBACK.map((t, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="h-full flex flex-col bg-white border border-[#F0ECE0] shadow-[0_2px_12px_rgba(0,0,0,0.05)] rounded-2xl overflow-hidden hover:border-[#FFB347] transition-all">
                  <div className="px-5 py-4 flex-1">
                    <p className="text-[#444444] text-sm leading-relaxed italic mb-4">"{t.quote}"</p>
                  </div>
                  <div className="px-5 pb-5 flex items-center gap-2.5 border-t border-[#F0ECE0] pt-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: t.bg }}>{t.avatar}</div>
                    <p className="text-[#666666] text-xs font-medium">{t.tag}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
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
              <p className="text-xs text-[#888888] uppercase tracking-wider mb-4 font-medium">What we look for in every mentor</p>

              {/* Mentor criteria — honest, no fake profiles */}
              <div className="space-y-3 mb-5">
                {[
                  { icon: '🏢', label: '10–15 years in the industry', desc: 'Senior engineers and tech leads, not freshers. They have been the interviewer, not just the interviewee.' },
                  { icon: '🎯', label: 'Conducted 100+ interviews themselves', desc: 'They know exactly what interviewers are looking for — because they\'ve been on that side of the table.' },
                  { icon: '🤖', label: 'Actively using AI tools in current role', desc: 'GitHub Copilot, ChatGPT, Cursor — daily. They teach you to use and talk about AI the way interviewers in 2025 expect.' },
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
              <div className="space-y-1.5 text-sm text-[#666666]">
                <a href="mailto:hello@mentormuni.com" className="flex items-center gap-2 hover:text-[#FF9500] transition-colors">
                  <Mail size={13} /> hello@mentormuni.com
                </a>
                <a href="tel:+916000000000" className="flex items-center gap-2 hover:text-[#FF9500] transition-colors">
                  <Phone size={13} /> +91 6000 000 000
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
