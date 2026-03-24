import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { goToStartAssessment } from '../utils/startAssessmentNavigation';
import {
  ArrowRight, Brain, Target, Trophy,
  BarChart3, Cpu, TrendingUp,
  MessageSquare, GraduationCap, Building2, Users,
  Mail, Phone, Check, X,
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
    { icon: '📊', label: 'Readiness score out of 100', sub: 'Across DSA, System Design, HR & Projects' },
    { icon: '🎯', label: 'Your 3 critical gaps', sub: 'Specific — not just "practice more DSA"' },
    { icon: '📅', label: 'A week-by-week fix plan', sub: 'What to study, in what order, starting now' },
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />

          <motion.div
            key="popup-card"
            className="relative z-10 w-full max-w-[420px] overflow-hidden"
            style={{
              background: '#0d1626',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 18,
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.08)',
            }}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Auto-dismiss countdown bar */}
            <div style={{ height: 3, background: 'rgba(99,102,241,0.15)', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, height: '100%',
                background: 'linear-gradient(90deg,#6366f1,#a78bfa)',
                width: '100%',
                animation: 'mm-countdown 6s linear forwards',
              }} />
            </div>
            <style>{`@keyframes mm-countdown { from { width: 100%; } to { width: 0%; } }`}</style>

            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/8 transition-all"
              aria-label="Close"
            >
              <X size={15} />
            </button>

            <div className="px-6 pt-5 pb-6">

              {/* Brand header */}
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}>
                  M
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">MentorMuni</p>
                  <p className="text-[10px] text-slate-500 leading-none mt-0.5">Interview Readiness Assessment</p>
                </div>
                <span className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Free
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-[1.35rem] font-black text-white leading-tight mb-2 tracking-tight">
                Do you actually know<br />
                <span style={{ background: 'linear-gradient(90deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  if you're ready?
                </span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">
                Most students think they are — until the interview. A 5-minute test tells you your score, your gaps, and exactly what to fix.
              </p>

              {/* Outcome cards */}
              <div className="space-y-2 mb-5">
                {outcomes.map((o, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl px-3.5 py-2.5"
                    style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.12)' }}>
                    <span className="text-lg shrink-0">{o.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-white leading-none mb-0.5">{o.label}</p>
                      <p className="text-[10px] text-slate-500 leading-none">{o.sub}</p>
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
                style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}
              >
                Check My Score — It's Free
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Trust row */}
              <div className="flex justify-center gap-5 mb-3">
                {['5 minutes', 'No signup', 'Instant result'].map(t => (
                  <span key={t} className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Check size={9} className="text-green-500" /> {t}
                  </span>
                ))}
              </div>

              {/* Neutral dismiss */}
              <button
                onClick={close}
                className="w-full text-center text-[11px] text-slate-600 hover:text-slate-400 transition-colors py-1"
              >
                Maybe later
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
    avatar: 'V', bg: '#4f46e5',
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
    <div className="bg-[#050b18] text-white overflow-x-hidden">
      <style>{`
        :focus-visible {
          outline: 2px solid #6366f1;
          outline-offset: 3px;
          border-radius: 6px;
        }
      `}</style>
      <WelcomePopup />

      {/* ════════════════ ANNOUNCEMENT BANNER ════════════════ */}
      <div className="bg-indigo-600/15 border-b border-indigo-500/20 py-2 px-4 text-center">
        <p className="text-xs text-indigo-300">
          <span className="font-semibold">Mentorship Programme · First batch starting April 2025</span>
          {' · '}Limited seats per batch{' · '}
          <Link to="/waitlist" className="underline hover:no-underline font-semibold">Join the waitlist →</Link>
        </p>
      </div>

      {/* ════════════════ HERO ════════════════ */}
      <section className="relative min-h-[92vh] flex items-center">
        <div className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/15 rounded-full blur-[130px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-900/10 rounded-full blur-[100px]" />

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
                0%,100% { border-color: rgba(99,102,241,0.20); }
                50%      { border-color: rgba(99,102,241,0.50); }
              }
            `}</style>
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 relative overflow-hidden"
              style={{
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.20)',
                animation: 'mm-pill-border 3s ease-in-out infinite',
              }}
            >
              {/* shimmer sweep */}
              <span style={{
                position: 'absolute', top: 0, left: 0, height: '100%', width: '35%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                animation: 'mm-pill-shimmer 4s ease-in-out infinite',
                pointerEvents: 'none',
              }} />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shrink-0 relative z-10" />
              <span className="text-xs font-semibold text-indigo-300 tracking-wide relative z-10">
                Interview Readiness Platform for 3rd and 4th Year Engineering Students
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-4xl md:text-5xl xl:text-[3.2rem] font-black leading-[1.08] mb-5 tracking-tight"
            >
              Placement season is coming.{' '}
              <br className="hidden sm:block" />
              <span style={{
                background: 'linear-gradient(90deg,#6366f1,#a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Walk in prepared.
              </span>
            </motion.h1>

            {/* Hook sub-copy */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-5 max-w-[480px] space-y-2"
            >
              <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>
                <span className="text-white font-semibold">
                  MentorMuni builds a focused path only for you
                </span>
                {' '}— based on your strengths, your gaps, and your interview timeline.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.40)' }}>
                <span className="text-indigo-400 font-semibold">AI-powered mock interviews</span>
                {' '}and{' '}
                <span className="text-indigo-400 font-semibold">real mentor feedback</span>
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
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#6366f1' }} />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.60)' }}>{text}</span>
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
                className="group inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
              >
                Check My Interview Score — Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/how-it-works"
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5 px-2 rounded"
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
              <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-semibold text-indigo-300">Founding batch · Mentorship starting April 2025</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {[
                  { icon: '✓', text: 'Free always' },
                  { icon: '✓', text: 'No signup' },
                  { icon: '✓', text: '5 minutes' },
                ].map(t => (
                  <span key={t.text} className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span className="text-green-500">{t.icon}</span> {t.text}
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
                0%, 100% { box-shadow: 0 0 10px 2px rgba(74,222,128,0.35), 0 0 0 1px rgba(74,222,128,0.3); }
                50%       { box-shadow: 0 0 22px 6px rgba(74,222,128,0.55), 0 0 0 1px rgba(74,222,128,0.5); }
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
                  background: 'linear-gradient(135deg, rgba(5,11,24,0.95), rgba(15,26,48,0.98))',
                  border: '1px solid rgba(74,222,128,0.35)',
                  borderRadius: 14, padding: '10px 18px',
                  textDecoration: 'none', marginBottom: 18,
                  animation: 'mm-glow 2s ease-in-out infinite, mm-badge-float 3s ease-in-out infinite',
                  cursor: 'pointer',
                }}
              >
                <span style={{
                  width: 9, height: 9, borderRadius: '50%',
                  background: '#4ade80', flexShrink: 0,
                  animation: 'mm-dot-blink 1.2s ease-in-out infinite',
                  boxShadow: '0 0 8px rgba(74,222,128,0.7)',
                }} />
                <span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', display: 'block', lineHeight: 1.2 }}>
                    Free 1-on-1 Mentorship Session
                  </span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
                    Limited slots · Book yours before they fill up
                  </span>
                </span>
                <span style={{ marginLeft: 4, fontSize: 14, color: '#4ade80', fontWeight: 700, flexShrink: 0 }}>→</span>
              </Link>

              <img
                src="/MentorMuni-React-Frontend/mentormuni-brand-banner-new.png"
                alt="MentorMuni — Guiding Your Journey to Knowledge"
                className="w-full rounded-2xl"
                style={{ maxWidth: 400, boxShadow: '0 24px 64px rgba(0,0,0,0.45)' }}
              />
            </div>

            {/* Right: randomly flashing feature pills */}
            <div className="flex flex-col gap-3 shrink-0" style={{ marginTop: 72, width: 168 }}>
              {[
                { icon: '📊', text: 'Readiness Score',     color: '#818cf8', bg: 'rgba(99,102,241,0.10)',  border: 'rgba(99,102,241,0.28)',  delay: '0s',   dur: '6s'   },
                { icon: '🤖', text: 'AI Mock Interview',   color: '#c4b5fd', bg: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.28)', delay: '2.2s', dur: '7s'   },
                { icon: '📄', text: 'Resume Analyser',     color: '#f9a8d4', bg: 'rgba(236,72,153,0.10)', border: 'rgba(236,72,153,0.25)', delay: '1s',   dur: '8s'   },
                { icon: '👨‍🏫', text: '1-on-1 Mentorship',  color: '#fcd34d', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.25)', delay: '3.5s', dur: '6.5s' },
                { icon: '📚', text: 'Free Study Material', color: '#86efac', bg: 'rgba(74,222,128,0.09)',  border: 'rgba(74,222,128,0.25)', delay: '4.8s', dur: '7.5s' },
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

      {/* ════════════════ THE 2025 HIRING LANDSCAPE ════════════════ */}
      <section className="py-14 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-3">The 2025 Hiring Landscape</span>
            <h2 className="text-2xl md:text-3xl font-black mb-3 leading-tight">
              The placement environment has changed significantly.
              <br />
              <span className="text-amber-400">Preparation needs to change with it.</span>
            </h2>
            <p className="text-slate-400 text-sm mb-10 max-w-2xl leading-relaxed">
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
                icon: '👥', color: 'border-violet-500/30 bg-violet-500/5',
                tagColor: 'text-violet-400',
                tag: 'Increased Competition',
                title: '15+ applicants per IT opening — up from 4:1 in 2022',
                body: "The candidates clearing rounds today are not necessarily more talented. They have prepared more specifically — they identified their exact gaps and focused on those, rather than preparing broadly.",
              },
              {
                icon: '📅', color: 'border-indigo-500/30 bg-indigo-500/5',
                tagColor: 'text-indigo-400',
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
                      <h3 className="text-white font-bold text-sm mb-2 leading-snug">{item.title}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.25}>
            <div className="bg-[#0f1a30] border border-indigo-500/20 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1">
                <p className="text-white font-semibold text-sm mb-1">Students who perform well in placements prepare with a clear plan, not just effort.</p>
                <p className="text-slate-400 text-xs leading-relaxed">They measure their readiness first, identify specific gaps, and fix those gaps systematically — with guidance from mentors who understand the exact interviews they are facing.</p>
              </div>
              <button
                type="button"
                onClick={goToStartAssessment}
                className="flex-shrink-0 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                Check My Readiness <ArrowRight size={14} />
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ THE PLACEMENT GAP ════════════════ */}
      <section className="py-14 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest block mb-3">Understanding the Placement Gap</span>
            <h2 className="text-2xl md:text-3xl font-black mb-2 leading-tight">
              Strong academics. Struggling interviews.
              <br /><span className="text-slate-400 font-normal text-xl">Why interview preparation is a distinct skill.</span>
            </h2>
            <p className="text-slate-400 text-sm mb-10 max-w-2xl leading-relaxed">
              College examinations and placement interviews assess very different abilities. Students who prepare for each separately perform significantly better in both.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {[
              {
                stat: '60%+', color: 'text-red-400', statBg: 'bg-red-500/8 border-red-500/15',
                label: 'of engineering freshers fail their first campus interview',
                sub: "NASSCOM 2024 hiring report. College tests memory under controlled conditions. Interviews test thinking under pressure with a stranger watching — a completely different skill.",
              },
              {
                stat: '1 in 3', color: 'text-amber-400', statBg: 'bg-amber-500/8 border-amber-500/15',
                label: 'campus students say they froze when they knew the answer',
                sub: "Saying an answer out loud to a timer is different from knowing it in your head. Most students have never once practiced answering a technical question aloud before their first real interview.",
              },
              {
                stat: '15:1', color: 'text-green-400', statBg: 'bg-green-500/8 border-green-500/15',
                label: 'applicants per IT opening in 2025 — up from 4:1 in 2022',
                sub: "LinkedIn 2024 India Jobs Report. The candidates who clear rounds aren't smarter. They prepared specifically — they knew their score and exactly what to fix.",
              },
            ].map((item, i) => (
              <FadeUp key={item.stat} delay={i * 0.08}>
                <div className="bg-[#0f1a30] border border-white/8 rounded-2xl p-6 h-full flex flex-col">
                  <div className={`inline-block border rounded-xl px-3 py-1.5 mb-4 ${item.statBg}`}>
                    <span className={`text-3xl font-black ${item.color}`}>{item.stat}</span>
                  </div>
                  <p className="font-bold text-white text-sm leading-snug mb-2">{item.label}</p>
                  <p className="text-slate-500 text-xs leading-relaxed flex-1">{item.sub}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Side-by-side comparison */}
          <FadeUp delay={0.2}>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">The unprepared student</p>
                <div className="space-y-2">
                  {[
                    'Did LeetCode randomly — no pattern, no strategy',
                    'Never said an answer out loud under time pressure',
                    'Resume written in final year, never ATS-tested',
                    "Can't explain what they built in their projects clearly",
                    "Answers 'why this company?' with the company website copy",
                  ].map(p => (
                    <div key={p} className="flex items-start gap-2">
                      <X size={12} className="text-red-400 mt-0.5 shrink-0" />
                      <span className="text-xs text-slate-400 leading-snug">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
                <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">The placed student</p>
                <div className="space-y-2">
                  {[
                    'Took a readiness test — knew their exact score and gaps',
                    'Did 15+ mock interviews out loud, with feedback',
                    'Resume scored 85+ on ATS — every line had a reason',
                    'Practiced STAR answers for every project they listed',
                    'Knew each company\'s specific interview pattern beforehand',
                  ].map(p => (
                    <div key={p} className="flex items-start gap-2">
                      <Check size={12} className="text-green-400 mt-0.5 shrink-0" />
                      <span className="text-xs text-slate-400 leading-snug">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ FEATURES ════════════════ */}
      <section className="py-14 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-3">What MentorMuni gives you</span>
            <h2 className="text-2xl md:text-3xl font-black mb-2">Four tools. One goal: get you placed.</h2>
            <p className="text-slate-400 text-sm mb-10 max-w-xl leading-relaxed">
              No video lectures. No random quizzes. Every tool targets a specific gap between where you are and where you need to be.
            </p>
          </FadeUp>
          <div className="grid md:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.07}>
                <div className="group flex gap-4 bg-[#0f1a30] border border-white/8 rounded-2xl p-6 hover:border-indigo-500/30 transition-all h-full">
                  <div className="w-10 h-10 bg-indigo-600/15 border border-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600/25 transition-colors mt-0.5">
                    <f.Icon size={18} className="text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="font-bold text-white text-sm">{f.title}</h3>
                      <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded px-1.5 py-0.5 uppercase tracking-wider">{f.tag}</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed mb-2">{f.desc}</p>
                    <span className="text-[10px] font-semibold text-green-400">{f.highlight}</span>
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
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-7 py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-indigo-500/20"
              >
                Start with the free readiness test <ArrowRight size={15} />
              </button>
              <p className="text-xs text-slate-600 mt-2">No signup · 5 minutes · Instant score</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ STUDENT FEEDBACK ════════════════ */}
      <section className="py-14 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest block mb-3">Student Experiences</span>
            <h2 className="text-2xl md:text-3xl font-black mb-3">What students discover from the assessment.</h2>
            <p className="text-slate-400 text-sm mb-10 max-w-2xl leading-relaxed">
              Feedback from students who completed the Interview Readiness Assessment. Names withheld on request.
            </p>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-5">
            {BETA_FEEDBACK.map((t, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="h-full flex flex-col bg-[#0f1a30] border border-white/8 rounded-2xl overflow-hidden hover:border-white/15 transition-all">
                  <div className="px-5 py-4 flex-1">
                    <p className="text-slate-300 text-sm leading-relaxed italic mb-4">"{t.quote}"</p>
                  </div>
                  <div className="px-5 pb-5 flex items-center gap-2.5 border-t border-white/5 pt-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: t.bg }}>{t.avatar}</div>
                    <p className="text-slate-400 text-xs font-medium">{t.tag}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ MENTORS — INDUSTRY EXPERTS ════════════════ */}
      <section className="py-14 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <FadeUp>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-3">Expert Mentorship</span>
              <h2 className="text-2xl md:text-3xl font-black mb-3 leading-tight">
                Mentors with 12–15 years<br />
                <span className="text-amber-400">of industry experience.</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6 text-sm">
                Our mentors are senior engineers and tech leads from India's leading IT companies with over a decade of industry experience. They have conducted hundreds of interviews — and bring that perspective directly to your preparation.
              </p>
              <div className="space-y-4 mb-7">
                {[
                  { Icon: Brain, title: 'They know what the interviewer is actually testing', desc: "After 12+ years, they've conducted hundreds of interviews. They'll tell you exactly what an answer needs — not what sounds good." },
                  { Icon: Cpu, title: 'They teach AI tools in real workflows', desc: 'Our mentors use GitHub Copilot, ChatGPT, and Claude daily. They teach you not just how to use these tools but how to talk about them in interviews — a skill most freshers completely lack.' },
                  { Icon: Target, title: 'Company-specific pattern knowledge', desc: 'TCS Digital vs TCS NQT. Cognizant GenC vs GenC Pro. Infosys SP vs DSP. Each track asks different things. Your mentor knows them all.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-3 items-start">
                    <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.Icon size={14} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm mb-0.5">{item.title}</p>
                      <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/mentors" className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
                Meet the mentors <ArrowRight size={15} />
              </Link>
            </FadeUp>

            <FadeUp delay={0.12}>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-4 font-medium">What we look for in every mentor</p>

              {/* Mentor criteria — honest, no fake profiles */}
              <div className="space-y-3 mb-5">
                {[
                  { icon: '🏢', label: '10–15 years in the industry', desc: 'Senior engineers and tech leads, not freshers. They have been the interviewer, not just the interviewee.' },
                  { icon: '🎯', label: 'Conducted 100+ interviews themselves', desc: 'They know exactly what interviewers are looking for — because they\'ve been on that side of the table.' },
                  { icon: '🤖', label: 'Actively using AI tools in current role', desc: 'GitHub Copilot, ChatGPT, Cursor — daily. They teach you to use and talk about AI the way interviewers in 2025 expect.' },
                  { icon: '📱', label: 'WhatsApp access throughout', desc: 'Not just during sessions. Reachable for quick doubts, mock Q&A, and morale support all week.' },
                ].map(c => (
                  <div key={c.label} className="flex gap-3 items-start bg-[#0f1a30] border border-white/8 rounded-xl p-3.5">
                    <span className="text-lg mt-0.5">{c.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white mb-0.5">{c.label}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Honest launch notice */}
              <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-400 mb-1">✦ Mentor cohort launching April 2025</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We're currently onboarding mentors. Join the waitlist — you'll be matched with a mentor based on your assessment score the moment we go live.
                </p>
                <Link to="/waitlist" className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                  Join the waitlist → <ArrowRight size={11} />
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ════════════════ FINAL CTA ════════════════ */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <FadeUp>
            <span className="text-xs font-bold text-green-400 uppercase tracking-widest block mb-4">Free · 5 Minutes · Instant Result</span>
            <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
              Know your readiness score.
              <br />
              <span className="text-indigo-400">Walk into your interview prepared.</span>
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed text-sm max-w-lg mx-auto">
              A strong score means you walk in with confidence. A low score gives you a clear, prioritised plan to improve — with enough time before your placement season to act on it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <button
                type="button"
                onClick={goToStartAssessment}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-sm"
              >
                Check My Interview Score — Free <ArrowRight size={16} />
              </button>
              <Link
                to="/waitlist"
                className="flex items-center justify-center gap-2 border border-white/12 hover:border-white/25 hover:bg-white/5 text-slate-300 hover:text-white font-medium px-7 py-4 rounded-xl transition-all text-sm"
              >
                Join the mentorship waitlist
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
              {['No signup needed', 'Free forever', '5 min test', 'Instant score + roadmap'].map(t => (
                <span key={t} className="flex items-center gap-1 text-xs text-slate-600">
                  <Check size={10} className="text-green-500" /> {t}
                </span>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ FOR COLLEGES ════════════════ */}
      <section className="py-14 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium text-center mb-5">Are you a placement officer?</p>
          <FadeUp>
            <div className="bg-[#0f1a30] border border-white/8 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-12 h-12 bg-blue-600/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 size={22} className="text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-blue-400 font-medium mb-1">For placement officers & TPOs</p>
                <h3 className="text-xl font-bold text-white mb-2">MentorMuni for Colleges</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">
                  Give your entire batch a readiness score before placement season. Identify who
                  needs what, track improvement week over week, and go in prepared — not hoping.
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  {[
                    { Icon: Users, label: 'Batch readiness dashboard' },
                    { Icon: BarChart3, label: 'Per-student tracking' },
                    { Icon: GraduationCap, label: 'Placement stats reporting' },
                  ].map(f => (
                    <span key={f.label} className="flex items-center gap-1.5 text-xs text-slate-400">
                      <f.Icon size={12} className="text-slate-500" /> {f.label}
                    </span>
                  ))}
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl transition-colors"
                >
                  Request a demo <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer className="border-t border-white/5 py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="md:col-span-2">
              <h3 className="font-bold text-white mb-2">MentorMuni</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4 max-w-xs">
                Know your interview readiness. Improve it. Crack it.
              </p>
              <div className="space-y-1.5 text-sm text-slate-500">
                <a href="mailto:hello@mentormuni.com" className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                  <Mail size={13} /> hello@mentormuni.com
                </a>
                <a href="tel:+916000000000" className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                  <Phone size={13} /> +91 6000 000 000
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-3">Tools</p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>
                  <button
                    type="button"
                    onClick={goToStartAssessment}
                    className="hover:text-slate-300 transition-colors text-left bg-transparent border-0 p-0 cursor-pointer text-inherit font-inherit"
                  >
                    Interview Readiness
                  </button>
                </li>
                <li><Link to="/mock-interviews" className="hover:text-slate-300 transition-colors">Mock Interviews</Link></li>
                <li><Link to="/skill-gap-analyzer" className="hover:text-slate-300 transition-colors">Skill Gap Analyzer</Link></li>
                <li><Link to="/resume-analyzer" className="hover:text-slate-300 transition-colors">Resume Analyzer</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-3">Learn</p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/free-tutorials" className="hover:text-slate-300 transition-colors">Free Tutorials</Link></li>
                <li><Link to="/learning-paths" className="hover:text-slate-300 transition-colors">Learning Paths</Link></li>
                <li><Link to="/placement-tracks" className="hover:text-slate-300 transition-colors">Placement Tracks</Link></li>
                <li><Link to="/outcomes" className="hover:text-slate-300 transition-colors">Outcomes</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-3">Company</p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/contact" className="hover:text-slate-300 transition-colors">Contact</Link></li>
                <li><Link to="/pricing" className="hover:text-slate-300 transition-colors">Pricing</Link></li>
                <li><Link to="/mentors" className="hover:text-slate-300 transition-colors">Mentorship</Link></li>
                <li><Link to="/for-recruiters" className="hover:text-slate-300 transition-colors">For Recruiters</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600">
            <p>© {new Date().getFullYear()} MentorMuni. All rights reserved.</p>
            <div className="flex gap-5">
              <Link to="/contact" className="hover:text-slate-400 transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-slate-400 transition-colors">Privacy</Link>
              <Link to="/contact" className="hover:text-slate-400 transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
