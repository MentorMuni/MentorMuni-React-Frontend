import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Mic2, CalendarClock, Layers, Users } from 'lucide-react';

const POSTER_CAROUSEL_SLIDES = [
  {
    title: 'Interview readiness',
    Icon: BarChart3,
    accentOrb: 'from-[#1A8FC4]/20 to-sky-400/15',
    visualBg: 'from-sky-50/95 via-sky-100/90 to-[#f0f9ff]',
    visualKicker: 'Readiness',
    visualLine: 'Score · categories · what to fix first',
    problem: 'You don’t know which skills to fix first — “study everything” hides your real gaps.',
    solution:
      'Interview Readiness Score: one number out of 100 with category breakdowns so you prepare with a target, not a guess.',
  },
  {
    title: '1:1 mentorship',
    Icon: Users,
    accentOrb: 'from-teal-400/20 to-cyan-400/12',
    visualBg: 'from-sky-100/95 via-sky-50/85 to-[#f0f9ff]',
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
      'A structured week-by-week plan so your preparation matches drives and coursework — not chaos.',
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
  const visualBg = slide.visualBg ?? 'from-background via-sky-50/70 to-sky-100/80';

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
        className="pointer-events-none absolute -bottom-16 -left-12 h-32 w-32 rounded-full bg-sky-400/20 blur-2xl opacity-60"
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
          <div className="rounded-xl border border-sky-200/70 bg-white/90 p-2.5 shadow-[0_8px_24px_-12px_rgba(26,143,196,0.18)] ring-1 ring-sky-100/80 sm:p-3">
            <Icon className="h-7 w-7 text-[#1A8FC4] sm:h-8 sm:w-8" strokeWidth={1.15} aria-hidden />
          </div>
          <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#0e5e85]/90 sm:text-[10px]">{slide.visualKicker}</p>
          <p className="mt-0.5 max-w-[280px] text-center text-[11px] font-medium leading-snug text-muted-foreground sm:text-xs">
            {slide.visualLine}
          </p>
        </div>
      </div>
    </div>
  );
}

export function MentorMuniPosterCarousel({ className = '' }) {
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
      className={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="How MentorMuni addresses common preparation gaps"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className="relative h-[112px] w-full shrink-0 cursor-pointer overflow-hidden rounded-t-xl bg-gradient-to-b from-background to-accent-soft sm:h-[124px]"
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

        <div className="relative flex-1 border-t border-border bg-white px-4 py-4 sm:px-5 sm:py-5" aria-live="polite">
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
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{slide.title}</p>
                <div className="rounded-xl border border-neutral-200/90 bg-neutral-50/90 px-3.5 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Problem</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">{slide.problem}</p>
                </div>
                <div className="rounded-xl border border-[#1A8FC4]/25 bg-gradient-to-br from-background to-accent-soft/50 px-3.5 py-3 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0e5e85]">MentorMuni solution</p>
                  <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-foreground sm:text-sm">{slide.solution}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 border-t border-border bg-background px-4 py-3">
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
                i === index ? 'w-7 bg-[#1A8FC4]' : 'w-2 bg-[#E8E4DC] hover:bg-[#CCC8BE]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
