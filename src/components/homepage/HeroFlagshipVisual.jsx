import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const RING_SIZE = 132;
const STROKE = 10;
const R = (RING_SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;
const DEMO_SCORE = 0.72;

/**
 * Flagship hero visual — pure SVG/CSS (no images) for LCP performance.
 * Mobile: 2×2 category mini-cards + score ring; desktop: ring + classic bar rows.
 */
export function HeroFlagshipVisual({ className = '' }) {
  const reduceMotion = useReducedMotion();

  const bars = [
    { label: 'DSA', w: 0.68, color: '#ea580c' },
    { label: 'SD', w: 0.52, color: '#0891b2' },
    { label: 'HR', w: 0.74, color: '#059669' },
    { label: 'Proj', w: 0.61, color: '#a855f7' },
  ];

  return (
    <motion.div
      className={`relative mx-auto w-full max-w-[min(100%,420px)] ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <style>{`
        @keyframes mm-flagship-border {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes mm-flagship-shine {
          0% { transform: translateX(-120%) skewX(-12deg); opacity: 0; }
          15% { opacity: 0.35; }
          100% { transform: translateX(220%) skewX(-12deg); opacity: 0; }
        }
        @keyframes mm-hero-ring-draw {
          from { stroke-dashoffset: ${CIRC}; }
          to { stroke-dashoffset: ${CIRC * (1 - DEMO_SCORE)}; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mm-flagship-border-anim { animation: none !important; background-position: 40% 50% !important; }
          .mm-flagship-shine-anim { animation: none !important; opacity: 0 !important; }
          .mm-hero-ring-arc { animation: none !important; stroke-dashoffset: ${CIRC * (1 - DEMO_SCORE)} !important; }
        }
      `}</style>

      <div
        className="mm-flagship-border-anim relative rounded-[1.35rem] p-[2px] shadow-[0_24px_80px_-32px_rgba(234,88,12,0.45),0_12px_40px_-24px_rgba(8,145,178,0.2)]"
        style={{
          backgroundImage: 'linear-gradient(135deg, #ff9500 0%, #ffb347 25%, #22d3ee 55%, #ff9500 100%)',
          backgroundSize: '240% 240%',
          animation: reduceMotion ? 'none' : 'mm-flagship-border 8s ease-in-out infinite',
        }}
      >
        <div className="relative overflow-hidden rounded-[1.28rem] bg-gradient-to-br from-white via-[#fffdfb] to-[#fff8ee] px-4 py-5 sm:px-6 sm:py-7">
          <div
            className="mm-flagship-shine-anim pointer-events-none absolute -left-1/4 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent blur-sm"
            style={{
              animation: reduceMotion ? 'none' : 'mm-flagship-shine 4.5s ease-in-out infinite',
            }}
            aria-hidden
          />

          <div className="mb-4 flex flex-col items-center justify-center gap-2 sm:mb-1 sm:flex-row sm:gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Live preview</span>
            <span className="rounded-full bg-[#FFF4E0] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#CC7000] ring-1 ring-[#FFB347]/40">
              Interview readiness
            </span>
          </div>

          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
            <div
              className="relative shrink-0 scale-[1.06] sm:scale-100"
              style={{ width: RING_SIZE, height: RING_SIZE }}
            >
              <div
                className="pointer-events-none absolute inset-[-6px] rounded-full bg-gradient-to-br from-orange-200/35 via-transparent to-cyan-200/25 blur-md sm:inset-[-4px]"
                aria-hidden
              />
              <svg width={RING_SIZE} height={RING_SIZE} className="relative rotate-[-90deg]" aria-hidden>
                <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={R} fill="none" stroke="#f4f4f5" strokeWidth={STROKE} />
                <circle
                  className="mm-hero-ring-arc"
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={R}
                  fill="none"
                  stroke="url(#mm-hero-ring)"
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC}
                  style={{
                    animation: reduceMotion ? 'none' : 'mm-hero-ring-draw 1.35s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                  }}
                />
                <defs>
                  <linearGradient id="mm-hero-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ea580c" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[2.5rem] font-black tabular-nums leading-none tracking-tight text-foreground sm:text-4xl">
                  72
                </span>
                <span className="mt-1 text-xs font-medium text-muted-foreground sm:mt-0.5">
                  / 100
                </span>
              </div>
            </div>

            <div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-col sm:gap-2.5">
              {bars.map((b, i) => {
                const pct = Math.round(b.w * 100);
                return (
                  <div
                    key={b.label}
                    className="rounded-xl border border-zinc-200/90 bg-white/95 p-2.5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] sm:flex sm:flex-row sm:items-center sm:gap-2 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none"
                  >
                    <div className="mb-1.5 flex items-center justify-between sm:mb-0 sm:w-9 sm:shrink-0 sm:justify-start">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{b.label}</span>
                      <span className="text-xs font-bold tabular-nums text-foreground sm:hidden">{pct}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100 sm:h-2 sm:min-w-0 sm:flex-1">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: b.color }}
                        initial={reduceMotion ? false : { width: 0 }}
                        animate={{ width: `${b.w * 100}%` }}
                        transition={{ duration: 0.9, delay: 0.35 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <span className="mt-1 hidden text-right text-xs font-semibold tabular-nums text-muted-foreground sm:ml-0 sm:mt-0 sm:inline sm:w-8 sm:shrink-0">
                      {pct}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-5 rounded-lg border border-border bg-[#FFFCF7]/80 px-3 py-3 text-center text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:border-t sm:border-border sm:border-l-0 sm:border-r-0 sm:border-b-0 sm:bg-transparent sm:px-0 sm:py-0 sm:pt-4">
            Same rubric for every student — <span className="font-semibold text-foreground">one number</span>, then{' '}
            <span className="font-semibold text-[#CC7000]">what to fix first</span>.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
