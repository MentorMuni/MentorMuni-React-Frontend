import React, { useRef, useId } from 'react';
import { motion, useInView } from 'framer-motion';
import { Target, Sparkles, Gift, ArrowRight } from 'lucide-react';
import { goToStartAssessment } from '../../utils/startAssessmentNavigation';
import {
  READINESS_TEST_COUPON_CARD_HEADLINE,
  READINESS_TEST_COUPON_CARD_BODY,
  READINESS_TEST_COUPON_CARD_CTA,
} from '../../constants/brandCopy';
import LimitedRewardLabel from '../LimitedRewardLabel';

const PREP_MAP_SAMPLE_AREAS = [
  { label: 'DSA & problem solving', w: 72 },
  { label: 'OS / DBMS / CN', w: 58 },
  { label: 'Projects & stack', w: 65 },
  { label: 'HR & communication', w: 48 },
];

/** Illustrative drill tags — aligned with placement prep (DSA → stack → HR), not unrelated buzzwords */
const PREP_MAP_PREP_TOPIC_EXAMPLES = [
  'DSA patterns & complexity',
  'OS, DBMS & networking',
  'Project & stack deep-dive',
  'HR & communication',
];

const PREP_MAP_ILLUSTRATIVE_SCORE = 64;

function prepMapGlance(rows) {
  const sorted = [...rows].sort((a, b) => b.w - a.w);
  return { strongest: sorted[0], weakest: sorted[sorted.length - 1] };
}

function prepMapReadinessBand(pct) {
  if (pct >= 75) return { label: 'Strong band', sub: 'Keep momentum — polish the last gaps.' };
  if (pct >= 50) return { label: 'Growth band', sub: 'Structured practice moves this score quickly.' };
  return { label: 'Build band', sub: 'High upside — lock fundamentals below.' };
}

function PrepMapReadinessScoreRing({ pct, inView }) {
  const gradId = `pmr-${useId().replace(/:/g, '')}`;
  const size = 132;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);
  const tier =
    pct >= 75
      ? { from: '#34d399', to: '#10b981', glow: 'rgba(16,185,129,0.45)' }
      : pct >= 50
        ? { from: '#fbbf24', to: '#f59e0b', glow: 'rgba(245,158,11,0.4)' }
        : { from: '#fb7185', to: '#f43f5e', glow: 'rgba(244,63,94,0.35)' };

  return (
    <div className="relative mx-auto flex h-[138px] w-[138px] shrink-0 items-center justify-center sm:h-[148px] sm:w-[148px]">
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-50"
        style={{ background: `radial-gradient(circle, ${tier.glow} 0%, transparent 70%)` }}
        aria-hidden
      />
      <svg width={size} height={size} className="-rotate-90 transform drop-shadow-md" aria-hidden>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={tier.from} />
            <stop offset="100%" stopColor={tier.to} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={inView ? { strokeDashoffset: offset } : { strokeDashoffset: c }}
          transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black tabular-nums tracking-tight text-foreground sm:text-[2.1rem]">{pct}%</span>
        <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Readiness</span>
      </div>
    </div>
  );
}

export function AnimatedPrepMapPanel() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const illustrativeBand = prepMapReadinessBand(PREP_MAP_ILLUSTRATIVE_SCORE);
  const glance = prepMapGlance(PREP_MAP_SAMPLE_AREAS);
  return (
    <div ref={ref} className="relative">
      <div
        className="pointer-events-none absolute -inset-[3px] rounded-[1.45rem] bg-gradient-to-br from-[#FF9500]/45 via-fuchsia-400/15 to-cyan-400/35 opacity-70 blur-[2px]"
        aria-hidden
      />
      <motion.div
        aria-hidden
        className="absolute -inset-1 rounded-[1.35rem] bg-gradient-to-br from-[#FF9500]/35 via-fuchsia-500/15 to-cyan-500/20 opacity-50 blur-md"
        animate={
          inView
            ? { rotate: [0, 2, -1.5, 0], opacity: [0.4, 0.55, 0.45] }
            : { opacity: 0.28 }
        }
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-br from-[#FFFCF7] via-white to-[#F4FAFC] shadow-[0_12px_48px_-16px_rgba(255,149,0,0.18),0_4px_16px_-6px_rgba(15,23,42,0.06)] ring-1 ring-orange-100/40">
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-orange-300/25 to-transparent blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-gradient-to-tr from-cyan-300/20 to-transparent blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `linear-gradient(rgba(180,120,60,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(180,120,60,0.04) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
          aria-hidden
        />

        <div className="relative p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <motion.span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF9500] to-[#EA580C] text-white shadow-[0_8px_24px_-6px_rgba(234,88,12,0.55)] ring-2 ring-white/50"
                animate={inView ? { scale: [1, 1.04, 1] } : {}}
                transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2 }}
              >
                <Sparkles size={20} strokeWidth={2} aria-hidden />
              </motion.span>
              <div>
                <span className="block text-base font-bold tracking-tight text-foreground sm:text-lg">
                  Your prep map
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Readiness by area · sample view
                </span>
              </div>
            </div>
            <div className="shrink-0 self-center">
              <LimitedRewardLabel className="text-[8px] px-2.5 py-1 sm:text-[9px] sm:px-3 sm:py-1.5 [&_svg]:h-2.5 [&_svg]:w-2.5 sm:[&_svg]:h-3 sm:[&_svg]:w-3" />
            </div>
          </div>

          <div className="mb-4 rounded-xl border border-orange-100/90 bg-orange-50/40 px-3 py-2.5 sm:px-4 sm:py-3">
            <p className="text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
              <span className="font-semibold text-foreground">Sample only.</span> In the real test you pick topics — your report
              reflects your answers. What follows is a fictional example so you can see the layout.
            </p>
          </div>

          <div className="mb-4 flex flex-col items-center gap-5 rounded-2xl border border-neutral-200/90 bg-gradient-to-br from-white via-neutral-50/50 to-orange-50/15 p-4 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center sm:gap-8 sm:p-6">
            <div className="flex shrink-0 justify-center">
              <PrepMapReadinessScoreRing pct={PREP_MAP_ILLUSTRATIVE_SCORE} inView={inView} />
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="mb-2 inline-flex items-center justify-center gap-1.5 rounded-full border border-neutral-200/90 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground sm:justify-start">
                <Target size={12} className="text-[#FF9500]" strokeWidth={2.5} aria-hidden />
                Interview readiness score
              </div>
              <p className="text-[11px] font-semibold text-foreground-muted">Example only — not your result</p>
              <p className="mt-2 text-xl font-black leading-tight text-foreground sm:text-2xl">{illustrativeBand.label}</p>
              <p className="mt-1.5 text-sm leading-snug text-muted-foreground">{illustrativeBand.sub}</p>
            </div>
          </div>

          <div className="mb-4 grid gap-2 rounded-xl border border-neutral-200/80 bg-white/90 p-3 sm:grid-cols-2 sm:gap-3 sm:p-4">
            <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/50 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Strongest area (sample)</p>
              <p className="mt-1 text-sm font-bold text-foreground">{glance.strongest.label}</p>
              <p className="text-xs font-semibold tabular-nums text-emerald-800">{glance.strongest.w}%</p>
            </div>
            <div className="rounded-lg border border-amber-200/70 bg-amber-50/60 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900">Focus next (sample)</p>
              <p className="mt-1 text-sm font-bold text-foreground">{glance.weakest.label}</p>
              <p className="text-xs font-semibold tabular-nums text-amber-900">{glance.weakest.w}%</p>
            </div>
          </div>

          <div className="mb-4 rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50/40 via-white to-white px-3 py-3 sm:px-4 sm:py-3.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-violet-900/90">Example topics to prep</p>
            <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
              Sample labels only — in the real test you choose focus areas; questions stay tied to what you tag (technical depth
              and how you communicate).
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {PREP_MAP_PREP_TOPIC_EXAMPLES.map((topic) => (
                <span
                  key={topic}
                  className="rounded-lg border border-violet-200/70 bg-white/90 px-2.5 py-1.5 text-[11px] font-semibold text-foreground shadow-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-0 flex flex-col gap-3 rounded-xl border border-orange-200/90 bg-gradient-to-r from-amber-50 via-orange-50/80 to-amber-50/40 p-3 shadow-sm sm:flex-row sm:items-center sm:gap-4 sm:p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF9500] to-[#EA580C] text-white shadow-md">
              <Gift className="h-5 w-5" strokeWidth={2} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wide text-[#9A3412]">{READINESS_TEST_COUPON_CARD_HEADLINE}</p>
              <p className="mt-1 text-sm leading-snug text-foreground-muted">{READINESS_TEST_COUPON_CARD_BODY}</p>
            </div>
            <button
              type="button"
              onClick={goToStartAssessment}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-4 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#E88600] sm:w-auto sm:min-w-[10.5rem]"
            >
              {READINESS_TEST_COUPON_CARD_CTA}
              <ArrowRight size={16} strokeWidth={2.5} className="shrink-0" aria-hidden />
            </button>
          </div>

          <p className="mt-4 text-center text-[11px] leading-snug text-hint">
            Full report after your test: every topic you tag, with scores and what to improve first.
          </p>
        </div>
      </div>
    </div>
  );
}
