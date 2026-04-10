import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const RING_SIZE = 128;
const STROKE = 10;
const R = (RING_SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;
const DEMO_SCORE = 0.72;

/**
 * Hero “Reality Check” card — clean white panel, orange border, donut + category bars (SVG only).
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
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <style>{`
        @keyframes mm-hero-ring-draw {
          from { stroke-dashoffset: ${CIRC}; }
          to { stroke-dashoffset: ${CIRC * (1 - DEMO_SCORE)}; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mm-hero-ring-arc { animation: none !important; stroke-dashoffset: ${CIRC * (1 - DEMO_SCORE)} !important; }
        }
      `}</style>

      <div
        className="rounded-2xl border-2 border-[#FF9500] bg-white p-4 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.08),0_1px_3px_rgba(15,23,42,0.04)] sm:p-5"
        role="img"
        aria-label="Sample interview readiness score preview"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Your reality check
          </span>
          <span className="rounded-md bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-[#c2410c] ring-1 ring-orange-200/80">
            Interview Readiness
          </span>
        </div>

        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-5">
          <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
            <svg width={RING_SIZE} height={RING_SIZE} className="relative rotate-[-90deg]" aria-hidden>
              <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={R} fill="none" stroke="#e5e5e5" strokeWidth={STROKE} />
              <circle
                className="mm-hero-ring-arc"
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={R}
                fill="none"
                stroke="#FF9500"
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
                  <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                    <motion.div
                      className="h-full rounded-full"
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

        <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/90 px-3 py-3 text-sm leading-relaxed text-[#78350f]">
          <span className="font-bold text-neutral-900">System Design is your biggest gap.</span>{' '}
          Most students with this profile improve +20 pts in 3 weeks with focused practice.
        </div>

        <div className="mt-5 space-y-2 text-center">
          <p className="text-base font-semibold leading-snug tracking-tight text-neutral-900 sm:text-lg">
            <span className="text-[#ea580c]">MentorMuni</span>
            <span className="text-neutral-400"> — </span>
            show up <span className="text-[#c2410c]">prepared & confident</span>.
          </p>
          <p className="text-sm leading-snug text-neutral-600 sm:text-[15px]">
            Real panels. Honest feedback. No last‑minute cram.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
