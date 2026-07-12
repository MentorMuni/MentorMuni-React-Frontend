import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  Flame,
  Gamepad2,
  GraduationCap,
  Medal,
  ShieldCheck,
  Swords,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import RoutePageShell from './layout/RoutePageShell';
import { usePageMeta } from '../hooks/usePageMeta';
import { goToStartAssessment } from '../utils/startAssessmentNavigation';

const PRACTICE_MODES = [
  {
    title: 'Aptitude practice',
    copy: 'Short timed rounds for logic, quant, and verbal — the way companies test you in campus drives.',
    icon: Brain,
    accent: 'from-sky-500 to-cyan-500',
  },
  {
    title: 'Coding challenges',
    copy: 'Daily DSA problems with hints and feedback, so you improve topic by topic before interviews.',
    icon: Swords,
    accent: 'from-violet-500 to-fuchsia-500',
  },
  {
    title: 'HR mock answers',
    copy: 'Practice tell-me-about-yourself, projects, strengths, and pressure questions before the real round.',
    icon: Users,
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Resume score tasks',
    copy: 'Earn prep points by fixing keywords, impact lines, project proof, and ATS-friendly formatting.',
    icon: Target,
    accent: 'from-amber-500 to-orange-500',
  },
];

const HOW_IT_WORKS = [
  'Take the free 5-minute readiness check',
  'Get a weekly practice plan based on your gaps',
  'Finish short daily tasks and mock interviews',
  'Collect prep points, badges, and rise on the batch ranking',
  'Get mentor tips before your real campus drives',
];

const STUDENT_OUTCOMES = [
  'Know exactly what to fix before the next drive',
  'Turn long study hours into short daily wins',
  'Build confidence through practice, not only lectures',
  'See how you compare with batchmates — then improve your own score',
];

export default function GamifiedPlacementPrep() {
  usePageMeta({
    title: 'Game-Style Placement Prep for 3rd & 4th Year Students | MentorMuni',
    description:
      'MentorMuni turns campus placement preparation into short daily practice, prep points, badges, batch rankings, AI mocks, and mentor tips for 3rd and 4th year students.',
    keywords:
      'game style placement preparation, placement practice for students, campus placement prep, 3rd year 4th year placement, MentorMuni practice mode',
  });

  return (
    <RoutePageShell scope="marketing" className="pb-20">
      <section className="mm-marketing-hero-backdrop mm-hero-premium relative overflow-hidden border-b border-border">
        <div className="mm-hero-mesh" aria-hidden />
        <div className="mm-hero-dot-grid" aria-hidden />
        <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/15 blur-[90px]" aria-hidden />

        <div className="mm-container relative z-10 grid gap-10 pb-14 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-violet-700">
              <Gamepad2 size={15} aria-hidden />
              Practice mode
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-foreground md:text-6xl">
              Placement prep that feels like a{' '}
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                game — but builds real interview skills.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Made for 3rd and 4th year students. Practice a little every day, earn prep points,
              climb your batch ranking, take AI mock interviews, and get mentor tips before campus drives.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={goToStartAssessment}
                className="mm-btn-primary mm-cta-glow inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-bold text-white"
              >
                Start with free readiness check <ArrowRight size={16} aria-hidden />
              </button>
              <Link
                to="/placement-roadmap"
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white/80 px-7 py-3 text-sm font-bold text-foreground shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
              >
                See year-wise roadmap
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_30px_80px_-45px_rgba(79,70,229,0.65)] backdrop-blur">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 p-5 text-white">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-200">This week&apos;s plan</p>
                    <h2 className="mt-1 text-2xl font-black">Placement Sprint</h2>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-cyan-100">Week 7</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: 'Prep points', value: '2,450', icon: Zap },
                    { label: 'Days in a row', value: '11 days', icon: Flame },
                    { label: 'Batch rank', value: '#18', icon: Trophy },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.08] p-4">
                      {React.createElement(icon, { className: 'mb-3 h-5 w-5 text-cyan-200', 'aria-hidden': true })}
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/55">{label}</p>
                      <p className="mt-1 text-xl font-black">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                  <div className="mb-3 flex items-center justify-between text-sm font-bold">
                    <span>Interview readiness</span>
                    <span className="text-cyan-200">68%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-white/65">
                    Next unlock: AI HR mock after 2 coding tasks and 1 resume fix.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mm-container py-14 md:py-16" aria-labelledby="practice-modes-heading">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-700">Practice modes</p>
          <h2 id="practice-modes-heading" className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
            Learn, practice, compete, improve.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Placement outcome stays serious. Daily practice feels shorter and clearer.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PRACTICE_MODES.map(({ title, copy, icon, accent }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-sm`}>
                {React.createElement(icon, { size: 22, 'aria-hidden': true })}
              </span>
              <h3 className="text-lg font-extrabold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-gradient-to-br from-violet-50 via-white to-cyan-50 py-14 md:py-16">
        <div className="mm-container grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-700">How it works</p>
            <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
              A simple daily habit for placement readiness.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              Instead of saying “study more,” MentorMuni shows what to practice today,
              tracks progress, and connects you with mentor support when needed.
            </p>
          </div>
          <div className="space-y-3">
            {HOW_IT_WORKS.map((item, index) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-black text-white">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm font-bold leading-relaxed text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mm-container py-14 md:py-16">
        <div className="grid gap-8 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <GraduationCap size={28} aria-hidden />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              Useful for colleges, TPOs, and student communities.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              Run weekly placement practice for 3rd and 4th year batches, spot weak topics early,
              and track prep progress before companies arrive on campus.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {STUDENT_OUTCOMES.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-border bg-secondary/60 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
                <p className="text-sm font-semibold leading-relaxed text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mm-container">
        <div className="rounded-3xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 p-7 text-center text-white shadow-[0_24px_60px_-30px_rgba(79,70,229,0.8)] md:p-10">
          <Medal className="mx-auto mb-4 h-10 w-10 text-white/90" aria-hidden />
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">Ready to make placement prep clearer?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/85 md:text-base">
            Start with the free readiness check. Your score becomes your first practice plan.
          </p>
          <button
            type="button"
            onClick={goToStartAssessment}
            className="mt-6 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-black text-violet-700 shadow-lg transition hover:bg-violet-50"
          >
            Start my practice plan <ArrowRight size={16} aria-hidden />
          </button>
        </div>
      </section>
    </RoutePageShell>
  );
}
