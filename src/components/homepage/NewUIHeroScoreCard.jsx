import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HERO_SCORE_SAMPLE_LABEL } from '../../constants/brandCopy';

const RING_SIZE = 128;
const STROKE = 10;
const R = (RING_SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

const SCORE_CARD_MOTION = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] },
};

function ScoreCardKeyframes({ ringCirc, scoreRatio }) {
  return (
    <style>{`
      @keyframes mm-hero-ring-draw {
        from { stroke-dashoffset: ${ringCirc}; }
        to { stroke-dashoffset: ${ringCirc * (1 - scoreRatio)}; }
      }
      @keyframes mm-card-shimmer {
        0%, 100% { opacity: 0.4; transform: translate(0, 0) scale(1); }
        50% { opacity: 0.65; transform: translate(-3%, 2%) scale(1.02); }
      }
      @keyframes mm-border-flow {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
      .mm-hero-card-border-new-ui {
        animation: mm-border-flow 9s ease infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        .mm-hero-ring-arc { animation: none !important; stroke-dashoffset: ${ringCirc * (1 - scoreRatio)} !important; }
        .mm-hero-card-glow { animation: none !important; }
        .mm-hero-card-border-new-ui { animation: none; background-position: 50% 50%; }
      }
    `}</style>
  );
}

/** New UI hero score card — premium dark glass panel */
export function NewUIHeroScoreCard({ className = '', preview }) {
  const reduceMotion = useReducedMotion();
  const { score, scoreRatio, skillBars, insightLead, insightRest } = preview;

  return (
    <motion.div
      className={`relative mx-auto w-full min-w-0 max-w-[min(100%,440px)] mm-new-ui-score-widget ${className}`}
      initial={reduceMotion ? false : SCORE_CARD_MOTION.initial}
      animate={SCORE_CARD_MOTION.animate}
      transition={SCORE_CARD_MOTION.transition}
      style={{ opacity: 1 }}
    >
      <ScoreCardKeyframes ringCirc={CIRC} scoreRatio={scoreRatio} />

      <div
        className="mm-hero-card-glow pointer-events-none absolute -inset-4 rounded-[28px] blur-2xl"
        style={{ animation: reduceMotion ? 'none' : 'mm-card-shimmer 6s ease-in-out infinite' }}
        aria-hidden
      />

      <div className="relative rounded-[22px] p-[2px] mm-hero-card-border-new-ui shadow-[0_32px_64px_-20px_rgba(0,0,0,0.7)]">
        <div
          className="mm-hero-readiness-card mm-new-ui-readiness-card relative overflow-hidden rounded-[20px] p-4 backdrop-blur-xl sm:p-5"
          role="img"
          aria-label={`${HERO_SCORE_SAMPLE_LABEL}. Example score: ${score} out of 100`}
        >
          <div className="relative mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-3 mm-score-widget-divider">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] mm-score-widget-eyebrow">
              {HERO_SCORE_SAMPLE_LABEL}
            </span>
            <span className="mm-score-widget-badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold">
              <span className="mm-score-widget-badge-dot h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
              Scored in ~5 min
            </span>
          </div>

          <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-5">
            <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
              <div className="absolute inset-0 rounded-full blur-xl mm-score-ring-halo" aria-hidden />
              <svg
                width={RING_SIZE}
                height={RING_SIZE}
                className="relative rotate-[-90deg] drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                aria-hidden
              >
                <defs>
                  <linearGradient id="mm-ring-grad-new-ui" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="45%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
                <circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={R}
                  fill="none"
                  stroke="rgba(51, 65, 85, 0.55)"
                  strokeWidth={STROKE}
                />
                <circle
                  className="mm-hero-ring-arc"
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={R}
                  fill="none"
                  stroke="url(#mm-ring-grad-new-ui)"
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
                <span className="text-[2.25rem] font-black tabular-nums leading-none tracking-tight sm:text-[2.5rem] mm-score-hero-value">
                  {score}
                </span>
                <span className="mt-0.5 text-xs font-medium mm-score-hero-denom">/ 100</span>
              </div>
            </div>

            <div className="flex w-full min-w-0 flex-1 flex-col gap-3 sm:gap-2.5">
              {skillBars.map((b, i) => (
                <div key={b.label} className="min-w-0">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold leading-snug sm:text-xs mm-score-bar-label">{b.label}</p>
                      <p className="mt-0.5 text-[10px] leading-snug mm-score-bar-hint">{b.hint}</p>
                    </div>
                    <span className="shrink-0 text-xs font-bold tabular-nums mm-score-bar-pct">{b.pct}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full mm-score-bar-track">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: b.color,
                        boxShadow: `0 0 10px ${b.glow}`,
                      }}
                      initial={reduceMotion ? false : { width: 0 }}
                      animate={{ width: `${b.w * 100}%` }}
                      transition={{ duration: 0.85, delay: 0.3 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mm-score-insight relative mt-4 overflow-hidden rounded-xl px-3 py-3 text-sm leading-relaxed">
            <span className="mm-score-insight-lead font-bold">{insightLead}</span>{' '}
            {insightRest}
          </div>

          <div className="relative mt-5 space-y-2 text-center">
            <p className="text-base font-semibold leading-snug tracking-tight text-slate-50 sm:text-lg">
              <span className="mm-score-footer-brand">MentorMuni</span>
              <span className="text-slate-500"> — </span>
              show up <span className="mm-score-footer-accent">prepared & confident</span>.
            </p>
            <p className="text-sm leading-snug sm:text-[15px] mm-score-footer-sub">
              Real panels. Honest feedback. No last‑minute cram.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
