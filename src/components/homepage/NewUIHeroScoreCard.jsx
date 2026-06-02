import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HERO_SCORE_SAMPLE_LABEL } from '../../constants/brandCopy';
import { getHeroScoreTier, heroRingMetrics } from './heroScoreUtils';

const { size: RING_SIZE, stroke: STROKE, r: R, circ: CIRC, cx: CX, cy: CY } = heroRingMetrics();

/** New UI hero score card — premium dark glass (Predis-style) */
export function NewUIHeroScoreCard({ className = '', preview }) {
  const reduceMotion = useReducedMotion();
  const { score, scoreRatio, skillBars, insightLead, insightRest } = preview;
  const tier = getHeroScoreTier(score);

  return (
    <motion.div
      className={`mm-hero-score-root mm-hero-score-float mm-new-ui-score-widget ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{ opacity: 1 }}
    >
      <style>{`
        @keyframes mm-hero-ring-draw-new-ui {
          from { stroke-dashoffset: ${CIRC}; }
          to { stroke-dashoffset: ${CIRC * (1 - scoreRatio)}; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mm-hero-ring-arc-new-ui { animation: none !important; stroke-dashoffset: ${CIRC * (1 - scoreRatio)} !important; }
        }
      `}</style>

      <div className="mm-hero-score-aura" aria-hidden />

      <div className="mm-hero-score-border">
        <div
          className="mm-hero-score-panel mm-hero-score-panel--dark mm-new-ui-readiness-card"
          role="img"
          aria-label={`${HERO_SCORE_SAMPLE_LABEL}. Example score: ${score} out of 100`}
        >
          <div className="relative mm-hero-score-header mm-score-widget-divider">
            <span className="mm-hero-score-eyebrow mm-score-widget-eyebrow">{HERO_SCORE_SAMPLE_LABEL}</span>
            <span className="mm-hero-score-live mm-score-widget-badge">
              <span className="mm-hero-score-live-dot mm-score-widget-badge-dot" aria-hidden />
              Live preview
            </span>
          </div>

          <span className="mm-hero-score-tier">{tier.label}</span>

          <div className="relative mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6">
            <div className="mm-hero-score-ring-wrap">
              <div className="mm-hero-score-ring-halo mm-score-ring-halo" aria-hidden />
              <svg
                width={RING_SIZE}
                height={RING_SIZE}
                className="relative rotate-[-90deg] drop-shadow-[0_0_24px_rgba(56,189,248,0.4)]"
                aria-hidden
              >
                <defs>
                  <linearGradient id="mm-ring-grad-new-ui" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="45%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(51, 65, 85, 0.55)" strokeWidth={STROKE} />
                <circle
                  className="mm-hero-ring-arc-new-ui"
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                  stroke="url(#mm-ring-grad-new-ui)"
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC}
                  style={{
                    animation: reduceMotion ? 'none' : 'mm-hero-ring-draw-new-ui 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  className="mm-hero-score-value mm-score-hero-value"
                  initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.85, type: 'spring', stiffness: 260, damping: 18 }}
                >
                  {score}
                </motion.span>
                <span className="mt-0.5 text-xs font-medium mm-score-hero-denom">/ 100</span>
              </div>
            </div>

            <div className="flex w-full min-w-0 flex-1 flex-col gap-3">
              {skillBars.map((b, i) => (
                <div key={b.label} className="min-w-0">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold leading-snug sm:text-xs mm-score-bar-label">{b.label}</p>
                      <p className="mt-0.5 text-[10px] leading-snug mm-score-bar-hint">{b.hint}</p>
                    </div>
                    <motion.span
                      className="shrink-0 text-xs font-bold tabular-nums mm-score-bar-pct"
                      initial={reduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + i * 0.08 }}
                    >
                      {b.pct}
                    </motion.span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full mm-score-bar-track">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: b.color,
                        boxShadow: `0 0 12px ${b.glow}`,
                      }}
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
            className="mm-hero-score-insight-box mm-score-insight"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.45 }}
          >
            <span className="mm-score-insight-lead font-bold">{insightLead}</span> {insightRest}
          </motion.div>

          <div className="relative mt-5 space-y-1.5 text-center">
            <p className="text-base font-semibold leading-snug text-slate-50 sm:text-lg">
              <span className="mm-score-footer-brand">MentorMuni</span>
              <span className="text-slate-500"> — </span>
              show up <span className="mm-score-footer-accent">prepared & confident</span>.
            </p>
            <p className="text-sm mm-score-footer-sub">Take the free check for your real score.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
