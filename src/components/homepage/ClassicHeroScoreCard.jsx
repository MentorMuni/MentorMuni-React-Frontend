import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HERO_SCORE_SAMPLE_LABEL } from '../../constants/brandCopy';
import { getHeroScoreTier, heroRingMetrics } from './heroScoreUtils';

const { size: RING_SIZE, stroke: STROKE, r: R, circ: CIRC, cx: CX, cy: CY } = heroRingMetrics();

/**
 * Hero readiness score card — premium product showcase (Predis-style motion + depth).
 */
export function ClassicHeroScoreCard({ className = '', preview }) {
  const reduceMotion = useReducedMotion();
  const { score, scoreRatio, skillBars, insightLead, insightRest } = preview;
  const tier = getHeroScoreTier(score);

  return (
    <motion.div
      className={`mm-hero-score-root mm-hero-score-float ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{ opacity: 1 }}
    >
      <style>{`
        @keyframes mm-hero-ring-draw-classic {
          from { stroke-dashoffset: ${CIRC}; }
          to { stroke-dashoffset: ${CIRC * (1 - scoreRatio)}; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mm-hero-ring-arc-classic { animation: none !important; stroke-dashoffset: ${CIRC * (1 - scoreRatio)} !important; }
        }
      `}</style>

      <div className="mm-hero-score-aura" aria-hidden />

      <div className="mm-hero-score-border">
        <div
          className="mm-hero-score-panel mm-hero-score-panel--light"
          role="img"
          aria-label={`${HERO_SCORE_SAMPLE_LABEL}. Example score: ${score} out of 100`}
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-sky-300/25 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-16 -left-12 h-36 w-36 rounded-full bg-teal-300/20 blur-3xl" aria-hidden />

          <div className="relative mm-hero-score-header">
            <span className="mm-hero-score-eyebrow">{HERO_SCORE_SAMPLE_LABEL}</span>
            <span className="mm-hero-score-live">
              <span className="mm-hero-score-live-dot" aria-hidden />
              Live preview
            </span>
          </div>

          <span className="mm-hero-score-tier">{tier.label}</span>

          <div className="relative mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6">
            <div className="mm-hero-score-ring-wrap">
              <div className="mm-hero-score-ring-halo" aria-hidden />
              <svg
                width={RING_SIZE}
                height={RING_SIZE}
                className="relative rotate-[-90deg] drop-shadow-[0_4px_16px_rgba(26,143,196,0.25)]"
                aria-hidden
              >
                <defs>
                  <linearGradient id="mm-ring-grad-classic" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1A8FC4" />
                    <stop offset="50%" stopColor="#2AAA8A" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e2e8f0" strokeWidth={STROKE} />
                <circle
                  className="mm-hero-ring-arc-classic"
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                  stroke="url(#mm-ring-grad-classic)"
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC}
                  style={{
                    animation: reduceMotion ? 'none' : 'mm-hero-ring-draw-classic 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  className="mm-hero-score-value"
                  initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.85, type: 'spring', stiffness: 260, damping: 18 }}
                >
                  {score}
                </motion.span>
                <span className="mt-0.5 text-xs font-semibold text-muted-foreground">/ 100</span>
              </div>
            </div>

            <div className="flex w-full min-w-0 flex-1 flex-col gap-3">
              {skillBars.map((b, i) => (
                <div key={b.label} className="min-w-0">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold leading-snug text-neutral-800 sm:text-xs">{b.label}</p>
                      <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">{b.hint}</p>
                    </div>
                    <motion.span
                      className="shrink-0 text-xs font-bold tabular-nums text-neutral-900"
                      initial={reduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + i * 0.08 }}
                    >
                      {b.pct}
                    </motion.span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200/70">
                    <motion.div
                      className="h-full rounded-full shadow-[0_0_12px_rgba(0,0,0,0.08)]"
                      style={{ backgroundColor: b.color }}
                      initial={reduceMotion ? false : { width: 0 }}
                      animate={{ width: `${b.w * 100}%` }}
                      transition={{ duration: 0.9, delay: 0.45 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            className="mm-hero-score-insight-box"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.45 }}
          >
            <span className="font-bold text-neutral-900">{insightLead}</span> {insightRest}
          </motion.div>

          <div className="relative mt-5 space-y-1.5 text-center">
            <p className="text-base font-semibold leading-snug tracking-tight text-neutral-900 sm:text-lg">
              <span className="bg-gradient-to-r from-[#15799F] to-[#1A8FC4] bg-clip-text text-transparent">
                MentorMuni
              </span>
              <span className="text-neutral-400"> — </span>
              show up <span className="text-[#15799F]">prepared & confident</span>.
            </p>
            <p className="text-sm text-neutral-600">Take the free check for your real score.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
