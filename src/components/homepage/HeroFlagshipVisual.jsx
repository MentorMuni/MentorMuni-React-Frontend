import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const RING_SIZE = 128;
const STROKE = 10;
const R = (RING_SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;
const DEMO_SCORE = 0.72;

/**
 * Hero “Reality Check” card — product-style panel: gradient frame, depth, subtle motion.
 */
export function HeroFlagshipVisual({ className = '' }) {
  const reduceMotion = useReducedMotion();

  const bars = [
    {
      label: 'Data structures & algorithms',
      hint: 'Coding / problem-solving rounds',
      w: 0.68,
      color: '#ef4444',
    },
    {
      label: 'System design',
      hint: 'Architecture & trade-offs',
      w: 0.52,
      color: '#ea580c',
    },
    {
      label: 'HR & communication',
      hint: 'Behavioral & clarity',
      w: 0.74,
      color: '#16a34a',
    },
    {
      label: 'Projects & depth',
      hint: 'What you built & why',
      w: 0.61,
      color: '#9333ea',
    },
  ];

  return (
    <motion.div
      className={`relative mx-auto w-full min-w-0 max-w-[min(100%,440px)] ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <style>{`
        @keyframes mm-hero-ring-draw {
          from { stroke-dashoffset: ${CIRC}; }
          to { stroke-dashoffset: ${CIRC * (1 - DEMO_SCORE)}; }
        }
        @keyframes mm-card-shimmer {
          0%, 100% { opacity: 0.35; transform: translate(0, 0) scale(1); }
          50% { opacity: 0.55; transform: translate(-4%, 2%) scale(1.03); }
        }
        @keyframes mm-border-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .mm-hero-card-border {
          background: linear-gradient(
            125deg,
            rgba(255, 149, 0, 0.95),
            rgba(251, 191, 36, 0.65),
            rgba(34, 211, 238, 0.55),
            rgba(255, 149, 0, 0.9)
          );
          background-size: 200% 200%;
          animation: mm-border-flow 8s ease infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .mm-hero-ring-arc { animation: none !important; stroke-dashoffset: ${CIRC * (1 - DEMO_SCORE)} !important; }
          .mm-hero-card-glow { animation: none !important; }
          .mm-hero-card-border { animation: none; background-position: 50% 50%; }
        }
      `}</style>

      {/* soft glow behind card */}
      <div
        className="mm-hero-card-glow pointer-events-none absolute -inset-3 rounded-[28px] bg-gradient-to-br from-orange-400/25 via-amber-300/15 to-cyan-400/20 blur-2xl"
        style={{ animation: reduceMotion ? 'none' : 'mm-card-shimmer 6s ease-in-out infinite' }}
        aria-hidden
      />

      <div className="relative rounded-[22px] p-[1.5px] shadow-[0_20px_50px_-12px_rgba(15,23,42,0.15),0_8px_24px_-8px_rgba(234,88,12,0.12)] mm-hero-card-border">
        <div
          className="relative overflow-hidden rounded-[20.5px] border border-white/80 bg-white/95 p-4 backdrop-blur-sm sm:p-5"
          role="img"
          aria-label="Sample interview readiness score preview"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-200/30 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-cyan-200/25 blur-3xl" aria-hidden />

          <div className="relative mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100/90 pb-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Your reality check
            </span>
            <span className="rounded-full bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-1 text-[10px] font-semibold text-[#c2410c] ring-1 ring-orange-200/90 shadow-sm">
              Interview Readiness
            </span>
          </div>

          <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-5">
            <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
              <div className="absolute inset-0 rounded-full bg-orange-400/15 blur-xl" aria-hidden />
              <svg
                width={RING_SIZE}
                height={RING_SIZE}
                className="relative rotate-[-90deg] drop-shadow-[0_2px_8px_rgba(234,88,12,0.2)]"
                aria-hidden
              >
                <defs>
                  <linearGradient id="mm-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
                <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={R} fill="none" stroke="#e5e5e5" strokeWidth={STROKE} />
                <circle
                  className="mm-hero-ring-arc"
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={R}
                  fill="none"
                  stroke="url(#mm-ring-grad)"
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC}
                  style={{
                    animation: reduceMotion ? 'none' : 'mm-hero-ring-draw 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[2.25rem] font-black tabular-nums leading-none tracking-tight text-neutral-900 sm:text-[2.5rem]">
                  72
                </span>
                <span className="mt-0.5 text-xs font-medium text-muted-foreground">/ 100</span>
              </div>
            </div>

            <div className="flex w-full min-w-0 flex-1 flex-col gap-3 sm:gap-2.5">
              {bars.map((b, i) => {
                const pct = Math.round(b.w * 100);
                return (
                  <div key={b.label} className="min-w-0">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold leading-snug text-neutral-800 sm:text-xs">{b.label}</p>
                        <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">{b.hint}</p>
                      </div>
                      <span className="shrink-0 text-xs font-bold tabular-nums text-neutral-900">{pct}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100/90 ring-1 ring-neutral-200/60">
                      <motion.div
                        className="h-full rounded-full shadow-[0_0_8px_rgba(0,0,0,0.08)]"
                        style={{ backgroundColor: b.color }}
                        initial={reduceMotion ? false : { width: 0 }}
                        animate={{ width: `${b.w * 100}%` }}
                        transition={{ duration: 0.85, delay: 0.3 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative mt-4 overflow-hidden rounded-xl border border-orange-200/80 bg-gradient-to-br from-orange-50/95 to-amber-50/80 px-3 py-3 text-sm leading-relaxed text-[#78350f] shadow-inner">
            <span className="font-bold text-neutral-900">System Design is your biggest gap.</span>{' '}
            Most students with this profile improve +20 pts in 3 weeks with focused practice.
          </div>

          <div className="relative mt-5 space-y-2 text-center">
            <p className="text-base font-semibold leading-snug tracking-tight text-neutral-900 sm:text-lg">
              <span className="bg-gradient-to-r from-[#ea580c] to-[#f97316] bg-clip-text text-transparent">MentorMuni</span>
              <span className="text-neutral-400"> — </span>
              show up <span className="text-[#c2410c]">prepared & confident</span>.
            </p>
            <p className="text-sm leading-snug text-neutral-600 sm:text-[15px]">
              Real panels. Honest feedback. No last‑minute cram.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
