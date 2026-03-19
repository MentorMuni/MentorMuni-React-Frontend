import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Brain, Target, Trophy,
  BarChart3, Cpu, TrendingUp,
  MessageSquare, GraduationCap, Building2, Users,
  Mail, Phone, Check, X,
} from 'lucide-react';

/* ─── Welcome popup ─────────────────────────────────────────── */
const POPUP_DURATION = 10;

const WelcomePopup = () => {
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState(POPUP_DURATION);

  useEffect(() => {
    if (sessionStorage.getItem('mm_popup_seen')) return;
    const show = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(show);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (countdown <= 0) { close(); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [open, countdown]);

  const close = () => {
    sessionStorage.setItem('mm_popup_seen', '1');
    setOpen(false);
  };

  const progress = ((POPUP_DURATION - countdown) / POPUP_DURATION) * 100;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="popup-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={close} />

          <motion.div
            key="popup-card"
            className="relative z-10 bg-[#0F172A] border border-slate-700/60 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Countdown progress bar */}
            <div className="h-1 bg-slate-800">
              <motion.div
                className="h-full bg-indigo-500"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </div>

            {/* Close + timer */}
            <div className="absolute top-3.5 right-4 flex items-center gap-2">
              <span className="text-xs text-slate-600 tabular-nums">{countdown}s</span>
              <button onClick={close} className="text-slate-500 hover:text-white transition-colors" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 pt-6 pb-6">
              {/* Big scary stat */}
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-5xl font-black text-red-400 tabular-nums">72%</span>
                <span className="text-slate-400 text-sm leading-tight">of students fail<br />their first interview.</span>
              </div>

              <h2 className="text-xl font-bold text-white leading-snug mb-1">
                Are <em className="not-italic text-indigo-400">you</em> in the other 28%?
              </h2>
              <p className="text-slate-400 text-sm mb-5">
                Find out in 3 minutes — before your campus drives do.
              </p>

              {/* CTAs */}
              <div className="flex flex-col gap-2.5">
                <Link
                  to="/start-assessment"
                  onClick={close}
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all"
                >
                  Check My Readiness — Free
                  <ArrowRight size={15} />
                </Link>
                <Link
                  to="/mentorship"
                  onClick={close}
                  className="flex items-center justify-center gap-2 border border-white/10 hover:border-white/25 hover:bg-white/5 text-slate-400 hover:text-white text-sm px-5 py-2.5 rounded-xl transition-all"
                >
                  Get Free 1-on-1 Mentorship
                </Link>
              </div>
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
    title: 'Interview Readiness Score',
    desc: 'Answer 20 questions, get a score out of 100. DSA, System Design, HR — broken down so you know exactly what to work on first.',
  },
  {
    Icon: Cpu,
    title: 'AI Mock Interviews',
    desc: "Saying an answer out loud to a timer is completely different from knowing it in your head. Practice until it stops feeling scary.",
  },
  {
    Icon: BarChart3,
    title: 'Resume ATS Checker',
    desc: "Your resume might never reach a human. Paste it in, see your ATS score, find out what's getting you filtered out before you even interview.",
  },
  {
    Icon: TrendingUp,
    title: 'Personalised Study Plan',
    desc: "Based on your score, we tell you: study this topic this week, do these mock questions, revisit these concepts. Not a generic syllabus.",
  },
];

/* ─── Testimonials ──────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    avatar: 'P', name: 'Priya S.',
    placed: 'TCS Digital', before: 38, after: 82,
    quote: "My first test score was 38. Embarrassing tbh. The roadmap was specific — week 1 DSA, week 2 mocks, week 3 system design revision. Three weeks of actual work. Got the TCS offer.",
  },
  {
    avatar: 'R', name: 'Rahul M.',
    placed: 'Cognizant', before: 42, after: 78,
    quote: "I thought I was prepared because I'd done some LeetCode. The mock interview showed me I froze completely under pressure. Did 10 rounds in 2 weeks. First real interview felt totally different.",
  },
  {
    avatar: 'A', name: 'Ananya K.',
    placed: 'Wipro', before: 46, after: 75,
    quote: "System Design was my blind spot — hadn't even heard of some concepts they asked. The roadmap focused me on OOPS and DBMS for 3 weeks. Cleared Wipro first attempt.",
  },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const HomePage = () => {
  return (
    <div className="bg-[#0B0F19] text-white overflow-x-hidden">
      <style>{`
        :focus-visible {
          outline: 2px solid #6366f1;
          outline-offset: 3px;
          border-radius: 6px;
        }
      `}</style>
      <WelcomePopup />

      {/* ════════════════ URGENCY BANNER ════════════════ */}
      <div className="bg-indigo-600/20 border-b border-indigo-500/20 py-2 px-4 text-center">
        <p className="text-xs text-indigo-300">
          <span className="font-semibold">Next mentorship cohort starts April 5</span>
          {' · '}Only 12 spots left{' · '}
          <Link to="/mentorship" className="underline hover:no-underline font-semibold">Reserve your spot →</Link>
        </p>
      </div>

      {/* ════════════════ HERO ════════════════ */}
      <section className="relative min-h-[92vh] flex items-center">
        <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

          {/* ── Left: copy ── */}
          <div>

            {/* Social proof avatars */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="flex -space-x-2">
                {[
                  'bg-indigo-500', 'bg-violet-500', 'bg-blue-500',
                  'bg-purple-500', 'bg-teal-500',
                ].map((bg, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 border-[#0B0F19] ${bg} flex items-center justify-center text-xs font-bold text-white`}
                  >
                    {['P', 'R', 'A', 'S', 'V'][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-none mb-0.5">2,400+ students</p>
                <p className="text-xs text-slate-500">already tested their readiness</p>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-4xl md:text-5xl xl:text-[3.4rem] font-bold leading-[1.1] mb-4 tracking-tight"
            >
              Your college taught you{' '}
              <span className="text-indigo-400">to code.</span>
              <br />
              Nobody taught you{' '}
              <span className="text-indigo-400">to get placed.</span>
            </motion.h1>

            {/* Outcome stat */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <p className="text-sm text-slate-400">
                <span className="text-green-400 font-semibold">Students who complete mentorship get placed 3× faster.</span>
                {' '}Average time to first offer: 6 weeks.
              </p>
            </motion.div>

            {/* Sub-copy */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg text-slate-400 leading-relaxed mb-6 max-w-lg"
            >
              {"You've been coding. Doing LeetCode. Watching YouTube. But do you actually know if you're ready? Get your personalized placement roadmap — free, in 3 minutes."}
            </motion.p>

            {/* Trust lines — ABOVE the CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400 mb-6"
            >
              <span className="flex items-center gap-1.5"><Check size={14} className="text-green-500" /> Free, always</span>
              <span className="flex items-center gap-1.5"><Check size={14} className="text-green-500" /> No signup required</span>
              <span className="flex items-center gap-1.5"><Check size={14} className="text-green-500" /> Takes under 3 minutes</span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <Link
                to="/start-assessment"
                className="group inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Check My Score — Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/mentorship"
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5 px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 rounded"
              >
                Talk to a Mentor <ArrowRight size={14} />
              </Link>
            </motion.div>

            {/* Company logos strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-1"
            >
              <span className="text-xs text-slate-600 whitespace-nowrap">Students placed at →</span>
              {['TCS', 'Cognizant', 'Wipro', 'Infosys', 'Accenture', 'HCL'].map(c => (
                <span key={c} className="text-xs text-slate-500 font-semibold whitespace-nowrap">{c}</span>
              ))}
            </motion.div>
          </div>

          {/* ── Right: score preview card ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:flex justify-end"
          >
            <div className="w-full max-w-xs bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-0.5">Example Result</p>
                  <p className="text-sm font-semibold text-white">Interview Readiness Report</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-amber-400 leading-none">68</p>
                  <p className="text-xs text-slate-500">/100</p>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                {[
                  { label: 'DSA & Problem Solving', status: 'Needs work', color: 'text-red-400', dot: 'bg-red-500' },
                  { label: 'System Design', status: 'Critical gap', color: 'text-red-400', dot: 'bg-red-500' },
                  { label: 'Communication & HR', status: 'Almost there', color: 'text-amber-400', dot: 'bg-amber-500' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${item.dot}`} />
                      <span className="text-xs text-slate-300">{item.label}</span>
                    </div>
                    <span className={`text-xs font-medium ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 mb-4">
                <p className="text-xs text-indigo-300 font-semibold mb-1">Your #1 priority this week</p>
                <p className="text-xs text-slate-400">Complete 15 medium DSA problems — arrays and strings first.</p>
              </div>

              <Link
                to="/start-assessment"
                className="block text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Get your actual score →
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ════════════════ WHY STUDENTS FAIL ════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Most students walk into interviews unprepared — and don't know it
            </h2>
            <p className="text-slate-400 text-sm mb-10">
              Not because they're bad at coding. Because nobody told them what "ready" actually looks like.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              {
                stat: '68%', color: 'text-red-400',
                label: 'scored below 50 on their first test',
                sub: 'They had been coding for 2+ years. The issue wasn\'t skill — it was never measuring themselves against what interviews actually ask.',
              },
              {
                stat: '71%', color: 'text-amber-400',
                label: 'froze during their first mock interview',
                sub: 'Knew the answer sitting at home. Couldn\'t say it out loud under a timer. That\'s a different problem — and it\'s fixable.',
              },
              {
                stat: '3 weeks', color: 'text-green-400',
                label: 'average time to go from 45 → 75+ score',
                sub: 'Not months of grinding. Three focused weeks, working on the right things. That\'s the difference a roadmap makes.',
              },
            ].map((item, i) => (
              <FadeUp key={item.stat} delay={i * 0.08}>
                <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
                  <div className={`text-4xl font-bold mb-2 ${item.color}`}>{item.stat}</div>
                  <p className="font-semibold text-white text-sm leading-snug mb-2">{item.label}</p>
                  <p className="text-slate-500 text-xs leading-relaxed">{item.sub}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.2}>
            <div className="bg-indigo-950/40 border border-indigo-900/50 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
              <p className="flex-1 text-slate-400 text-sm leading-relaxed">
                <span className="text-white font-semibold">The test takes 3 minutes. </span>
                It tells you your score, where you're weak, and what to study first.
                That's more useful than 3 months of random LeetCode.
              </p>
              <Link
                to="/start-assessment"
                className="flex-shrink-0 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                Take the Test <ArrowRight size={15} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ FEATURES ════════════════ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">What you actually get</h2>
            <p className="text-slate-400 text-sm mb-10 max-w-xl">
              No video lectures to watch. No random quizzes. Tools that point directly at your gaps and help you close them.
            </p>
          </FadeUp>
          <div className="grid md:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.07}>
                <div className="group flex gap-5 bg-white/[0.025] border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all">
                  <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600/30 transition-colors mt-0.5">
                    <f.Icon size={18} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-1.5">{f.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ TESTIMONIALS ════════════════ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-bold mb-1">Students who were exactly where you are</h2>
            <p className="text-slate-400 text-sm mb-10">Low scores, no idea what to fix, placement season coming. Here's what happened.</p>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.08}>
                <div className="h-full flex flex-col bg-[#0F172A] border border-white/8 rounded-2xl overflow-hidden">
                  <div className="px-5 pt-5 pb-4 border-b border-white/5 flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="bg-red-500/15 text-red-400 font-semibold px-2 py-1 rounded-md">{t.before}/100</span>
                      <span className="text-slate-600">→</span>
                      <span className="bg-green-500/15 text-green-400 font-semibold px-2 py-1 rounded-md">{t.after}/100</span>
                    </div>
                    <span className="ml-auto text-xs text-indigo-400 font-medium">✓ {t.placed}</span>
                  </div>
                  <div className="px-5 py-4 flex-1">
                    <p className="text-slate-300 text-sm leading-relaxed">"{t.quote}"</p>
                  </div>
                  <div className="px-5 pb-4">
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ REAL MENTORS ════════════════ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              The AI tells you what's wrong.<br />A mentor helps you actually fix it.
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6 text-sm">
              Scores and roadmaps are useful. But sometimes you need someone who's been through the
              same interviews to tell you — "here's why you're freezing, here's what the interviewer
              actually wanted, here's how I'd answer that."
            </p>
            <div className="space-y-4 mb-7">
              {[
                { Icon: MessageSquare, title: 'Talk through your score with a real person', desc: "Not a bot. Someone who looks at your result and tells you where to focus." },
                { Icon: Target, title: "Prep for the companies you're targeting", desc: 'TCS, Cognizant, Wipro, Infosys — each recruits differently. Your mentor knows the pattern.' },
                { Icon: Trophy, title: 'Get your resume actually reviewed', desc: "Most resume feedback is generic. This is specific: this line is weak, add this, remove that." },
              ].map(item => (
                <div key={item.title} className="flex gap-3 items-start">
                  <div className="w-8 h-8 bg-white/5 border border-white/8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.Icon size={14} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm mb-0.5">{item.title}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/mentorship"
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Book a free session <ArrowRight size={15} />
            </Link>
          </FadeUp>

          <FadeUp delay={0.12}>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-4 font-medium">Meet your mentors</p>
              <div className="space-y-3">
                {[
                  { init: 'S', bg: 'bg-indigo-500', name: 'Saurabh K.', role: 'Software Engineer', company: 'Infosys · Ex-Cognizant', note: 'Helped 40+ students crack service-based company rounds' },
                  { init: 'M', bg: 'bg-violet-500', name: 'Meera R.', role: 'Technical Lead', company: 'Wipro · 6 yrs exp', note: 'Specialises in DSA, System Design, and HR prep' },
                  { init: 'A', bg: 'bg-blue-500', name: 'Arjun P.', role: 'Placement Mentor', company: 'Ex-TCS Digital', note: 'Cleared TCS Digital, Ninja, and Cognizant GenC in the same season' },
                  { init: 'D', bg: 'bg-teal-500', name: 'Divya S.', role: 'Senior Analyst', company: 'Accenture · 4 yrs exp', note: 'Resume reviews and mock interviews — 35+ students placed' },
                ].map(m => (
                  <div key={m.name} className="flex items-start gap-3.5 bg-white/[0.03] border border-white/8 rounded-xl p-4">
                    <div className={`w-10 h-10 rounded-full ${m.bg} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                      {m.init}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-white">{m.name}</p>
                        <p className="text-xs text-slate-500 truncate">{m.company}</p>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{m.note}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <p className="text-xs text-slate-600">First session free · Cancel anytime</p>
                <Link to="/mentorship" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 rounded">
                  Book a session →
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════ FOR COLLEGES ════════════════ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <div className="bg-[#0F172A] border border-white/8 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-12 h-12 bg-blue-600/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 size={22} className="text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-blue-400 font-medium mb-1">For placement officers & TPOs</p>
                <h3 className="text-xl font-bold text-white mb-2">MentorMuni for Colleges</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">
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

      {/* ════════════════ FINAL CTA ════════════════ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              You won't know where you stand<br />
              <span className="text-indigo-400">until you actually check.</span>
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed text-sm">
              Takes 3 minutes. If the score is good — you'll interview with confidence.
              If it's low — better you find out now than the interviewer does first.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/start-assessment"
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg transition-all text-sm"
              >
                Check My Score — It's Free <ArrowRight size={16} />
              </Link>
              <Link
                to="/mentorship"
                className="flex items-center justify-center gap-2 border border-white/12 hover:border-white/25 hover:bg-white/5 text-slate-300 hover:text-white font-medium px-7 py-3.5 rounded-xl transition-all text-sm"
              >
                Talk to a Mentor
              </Link>
            </div>
            <p className="text-xs text-slate-600 mt-4">No signup needed · Free forever · 3 minutes</p>
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
                <li><Link to="/start-assessment" className="hover:text-slate-300 transition-colors">Interview Readiness</Link></li>
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
                <li><Link to="/success-stories" className="hover:text-slate-300 transition-colors">Success Stories</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-3">Company</p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/contact" className="hover:text-slate-300 transition-colors">Contact</Link></li>
                <li><Link to="/pricing" className="hover:text-slate-300 transition-colors">Pricing</Link></li>
                <li><Link to="/mentorship" className="hover:text-slate-300 transition-colors">Mentorship</Link></li>
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
