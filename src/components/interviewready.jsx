import React, { useState, useEffect, useRef, useId } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle, CheckCircle, ChevronRight, Lock, Mail, Phone, Check, Zap, ShieldCheck, Map, ArrowRight, Star, Clock,
  TrendingUp, Target, Sparkles, BarChart3, AlertTriangle, CheckCircle2, Lightbulb, Users, Headphones,
  Share2, Linkedin, Trophy, Building2, Briefcase, Gift, Copy,
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE } from '../config';
import {
  READINESS_TEST_COUPON_BADGE,
  HERO_EARLY_BIRD_RIBBON,
  READINESS_TEST_COUPON_OFFER_HEADLINE,
} from '../constants/brandCopy';
import { pickRandomEarlyBirdCoupon } from '../utils/earlyBirdCoupons';
import LimitedRewardLabel from './LimitedRewardLabel';
import AIAnalysisLoader from './AIAnalysisLoader';
import { useFreeUsageTracker } from './FreeUsageCounter';
import UpgradePromptModal from './UpgradePromptModal';
const FREE_TIER_LIMIT = 3;

/** Same as Swagger: generate_plan_interview_ready_plan_post → POST /interview-ready/plan */
const INTERVIEW_PLAN_PATH = '/interview-ready/plan';

/**
 * PlanRequest.user_type — must match backend validation exactly:
 * student | working professional | 3rd Year Student | 4th Year Student
 * (UI shows 1st-3rd Year Student for the 3rd_year bucket; API value unchanged.)
 */
const API_USER_TYPE_BY_CATEGORY = {
  '3rd_year': '3rd Year Student',
  '4th_year': '4th Year Student',
  'recent_graduate': 'student',
  professional: 'working professional',
};

/** Pretty labels for UI only (not sent to API) */
const DISPLAY_ROLE_BY_CATEGORY = {
  '3rd_year': '1st–3rd Year Student',
  '4th_year': '4th Year Student',
  'recent_graduate': 'Recent Graduate',
  professional: 'Working Professional',
};

/** PlanRequest.primary_skill maxLength in OpenAPI schema */
const PLAN_PRIMARY_SKILL_MAX = 100;

/** POST /interview-ready/plan — skill-deep vs placement-breadth (backend may ignore if unsupported) */
const ASSESSMENT_FOCUS_SKILL = 'skill';
const ASSESSMENT_FOCUS_PLACEMENT = 'placement';

const ASSESSMENT_MODE_LABEL = {
  [ASSESSMENT_FOCUS_SKILL]: 'Skill preparation score',
  [ASSESSMENT_FOCUS_PLACEMENT]: 'Interview readiness score',
};

function formatPlanApiError(data) {
  if (!data) return 'Failed to generate questions';
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail
      .map((d) => (typeof d === 'string' ? d : d.msg || JSON.stringify(d)))
      .join(' ');
  }
  return data.error || data.message || 'Failed to generate questions';
}

/** Avoid crash when server returns HTML or plain text on 5xx */
async function parseResponseJson(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {
      detail: `Unexpected response from server. ${text.slice(0, 180)}${text.length > 180 ? '…' : ''}`,
    };
  }
}

const PLAN_FETCH_TIMEOUT_MS = 120000;

/** User-facing copy only — never show raw HTTP status codes (e.g. 500) in the UI */
function explainPlanHttpError(status, apiMessage) {
  const base = (apiMessage || '').trim();

  if (status === 429) {
    return base || 'Too many requests. Please wait and try again.';
  }

  if (status === 500 || status === 502 || status === 503 || status === 504) {
    if (/failed to generate plan/i.test(base)) {
      return "We couldn't generate your questions right now. Please try again in a minute. If this keeps happening, the assessment service may need maintenance.";
    }
    return "Something went wrong on our side. Please try again in a few minutes.";
  }

  if (status >= 500) {
    return 'Service is temporarily unavailable. Please try again later.';
  }

  // 4xx: show API validation / business message when useful
  if (status === 422 || status === 400) {
    return base || 'Please check your input and try again.';
  }

  return base || 'Something went wrong. Please try again.';
}

/** HashRouter: #/start-assessment?entry=tools */
function readToolsEntryFromHash() {
  if (typeof window === 'undefined') return false;
  try {
    const h = window.location.hash || '';
    const qi = h.indexOf('?');
    if (qi === -1) return false;
    return new URLSearchParams(h.slice(qi + 1)).get('entry') === 'tools';
  } catch {
    return false;
  }
}

const InputField = ({ label, type, name, value, onChange, placeholder, error, maxLength, showCharCount }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-sm font-bold text-foreground">
        {label} <span className="text-red-400">*</span>
      </label>
      {showCharCount && maxLength && (
        <span className={`text-xs font-medium ${value.length > maxLength * 0.9 ? 'text-red-400' : 'text-hint'}`}>
          {value.length} / {maxLength}
        </span>
      )}
    </div>
    {type === 'textarea' ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        className={`w-full px-4 py-3 rounded-xl border bg-white border border-[#E0DCCF] outline-none transition-all resize-none text-foreground placeholder:text-hint ${
          error
            ? 'border-red-500/50 bg-red-500/10'
            : 'border-[#E0DCCF] hover:border-[#E0DCCF] focus:border-[#FF9500] focus:ring-2 focus:ring-[#FF9500]/30'
        }`}
        required
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-3 rounded-xl border bg-white border border-[#E0DCCF] outline-none transition-all text-foreground placeholder:text-hint ${
          error
            ? 'border-red-500/50 bg-red-500/10'
            : 'border-[#E0DCCF] hover:border-[#E0DCCF] focus:border-[#FF9500] focus:ring-2 focus:ring-[#FF9500]/30'
        }`}
        required
      />
    )}
    {error && (
      <div className="flex items-center gap-2 text-red-400 text-xs font-medium">
        <AlertCircle size={14} />
        {error}
      </div>
    )}
  </div>
);

const resultsListContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const resultsListItem = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 320, damping: 28 } },
};

/** SVG ring — warm track + thick arc (no thin pink stroke) */
function ReadinessScoreRing({ pct }) {
  const uid = useId().replace(/:/g, '');
  const gradId = `readinessRingGrad-${uid}`;
  const size = 220;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);
  const tier =
    pct >= 75
      ? { from: '#059669', to: '#10b981', glow: 'rgba(16,185,129,0.2)' }
      : pct >= 50
        ? { from: '#EA580C', to: '#F59E0B', glow: 'rgba(234,88,12,0.18)' }
        : { from: '#C2410C', to: '#EA580C', glow: 'rgba(194,65,12,0.16)' };

  return (
    <div className="relative mx-auto flex h-[232px] w-[232px] items-center justify-center">
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-90"
        style={{ background: `radial-gradient(circle, ${tier.glow} 0%, transparent 72%)` }}
      />
      <svg width={size} height={size} className="-rotate-90 transform" aria-hidden>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={tier.from} />
            <stop offset="100%" stopColor={tier.to} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#EDE4D8"
          strokeWidth={stroke}
        />
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
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 280, damping: 22 }}
          className="text-5xl font-black tabular-nums tracking-tight text-foreground sm:text-[3.25rem]"
        >
          {pct}%
        </motion.span>
        <span className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">Readiness</span>
      </div>
    </div>
  );
}

function ScoreFactorRow({ label, value, hint, icon: Icon, variant = 'orange', delay = 0 }) {
  const v = Math.min(100, Math.max(0, value));
  const grad =
    variant === 'emerald'
      ? 'linear-gradient(90deg, #059669, #34d399)'
      : variant === 'amber'
        ? 'linear-gradient(90deg, #d97706, #fbbf24)'
        : 'linear-gradient(90deg, #ea580c, #ff9500)';
  const iconWrap =
    variant === 'emerald'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
      : variant === 'amber'
        ? 'bg-amber-50 text-amber-700 ring-amber-100'
        : 'bg-orange-50 text-orange-700 ring-orange-100';

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        {Icon && (
          <span
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ${iconWrap}`}
            aria-hidden
          >
            <Icon size={16} strokeWidth={2.25} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-foreground">{label}</span>
            <span className="tabular-nums text-sm font-bold text-foreground-muted">{Math.round(v)}%</span>
          </div>
          {hint ? <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{hint}</p> : null}
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#EDE8E0]">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${v}%` }}
              transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: grad }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function nextStepsForScoreBand(pct) {
  if (pct < 50) {
    return [
      { title: 'Close your top gaps first', sub: 'Pick 2 topics from “Areas to improve” and study 25–40 min daily.' },
      { title: 'Talk to a mentor (free intro)', sub: 'Align a plan with someone who has cleared top tech interviews.' },
      { title: 'Retake this check in 2 weeks', sub: 'Measure movement — most students here gain 20–35 points with focus.' },
    ];
  }
  if (pct < 75) {
    return [
      { title: 'Drill weak topics with mocks', sub: 'Verbalize answers out loud — same format as real panels.' },
      { title: 'Add system-design reps', sub: 'Push from “good” to “hire-ready” on breadth and tradeoffs.' },
      { title: 'Book a mentor before your next drive', sub: 'Polish stories and gaps while companies are active.' },
    ];
  }
  return [
    { title: 'Polish edge cases', sub: 'You are in a strong band — refine depth on your gap list only.' },
    { title: 'Full mock interview sprint', sub: 'Stress-test under time pressure with AI + mentor feedback.' },
    { title: 'Maintain until offers', sub: 'Short weekly touch-ups beat cramming before finals.' },
  ];
}

function peerDimensionsFromResult(pct, strengthSignal, gapPressure) {
  const balance = Math.round((pct + strengthSignal + (100 - gapPressure)) / 3);
  return [
    {
      label: 'Overall readiness',
      value: pct,
      hint: 'Composite vs a typical peer cohort on this assessment.',
    },
    {
      label: 'Topic strength signal',
      value: strengthSignal,
      hint: 'Share of topics where you showed confidence.',
    },
    {
      label: 'Gap load',
      value: gapPressure,
      hint: 'Surface area still open vs typical — higher means more to close.',
    },
    {
      label: 'Balance index',
      value: Math.min(100, Math.max(0, balance)),
      hint: 'Blend of score, strengths, and gaps — directional only.',
    },
  ];
}

/** Public link to start the same assessment (HashRouter + Vite base). */
function getInterviewReadinessShareUrl() {
  if (typeof window === 'undefined') return '';
  const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
  return `${window.location.origin}${base}#/start-assessment`;
}

function buildWhatsAppChallengeMessage(pct, readinessLabel, modeLabel) {
  const url = getInterviewReadinessShareUrl();
  const product = modeLabel || 'Interview Readiness';
  return (
    `I scored ${pct}% on MentorMuni ${product} (${readinessLabel}).\n\n` +
    `Think you can beat me? Same free 5-minute quiz — no signup.\n\n` +
    `Challenge your batchmates:\n${url}\n\n` +
    `Interview prep · Students & professionals`
  );
}

const ASSESSMENT_MODE_OPTIONS = [
  {
    mode: ASSESSMENT_FOCUS_SKILL,
    emoji: '💻',
    title: ASSESSMENT_MODE_LABEL[ASSESSMENT_FOCUS_SKILL],
    badge: 'One skill, deep prep',
    compactHint: 'Drill one stack end-to-end — Java, Python, AI, etc.',
    details: [
      'You name one skill (Java, C#, Python, AI…)',
      'Questions stay focused on that skill only',
      'Best when you want targeted practice',
    ],
  },
  {
    mode: ASSESSMENT_FOCUS_PLACEMENT,
    emoji: '🎯',
    title: ASSESSMENT_MODE_LABEL[ASSESSMENT_FOCUS_PLACEMENT],
    badge: 'Broad interview check',
    compactHint: 'Typical engineering mix — students & professionals.',
    details: [
      'Typical engineering interview mix across major areas',
      'You share context; questions stay broad, not one-skill deep',
      'Students or working professionals — same readiness lens',
    ],
  },
];

/**
 * Two-card picker — single click selects and calls onPick(mode).
 * variant "hero" = large cards, minimal copy (landing). "default" = full bullet list (tools step).
 */
function AssessmentModeGrid({ selectedMode, onPick, variant = 'default' }) {
  const isHero = variant === 'hero';

  return (
    <div className={`grid grid-cols-1 ${isHero ? 'sm:grid-cols-2 gap-4 md:gap-5' : 'sm:grid-cols-2 gap-4'} mb-2`}>
      {ASSESSMENT_MODE_OPTIONS.map((option) => {
        const selected = selectedMode === option.mode;
        return (
          <motion.button
            key={option.mode}
            type="button"
            onClick={() => onPick(option.mode)}
            whileHover={
              isHero
                ? {
                    y: -8,
                    boxShadow: '0 24px 48px -12px rgba(255, 149, 0, 0.35)',
                    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
                  }
                : undefined
            }
            whileTap={isHero ? { scale: 0.96 } : { scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className={
              isHero
                ? `group relative cursor-pointer select-none text-left rounded-3xl border-2 transition-colors duration-200 will-change-transform ${
                    selected
                      ? 'border-[#FF9500] bg-gradient-to-br from-[#FFF8EE] to-white shadow-xl shadow-[#FF9500]/25 ring-2 ring-[#FF9500]/30'
                      : 'border-[#E0D8CF] bg-gradient-to-br from-white to-[#FFFCF7] shadow-md shadow-black/[0.06] hover:border-[#FF9500] hover:ring-4 hover:ring-[#FF9500]/15'
                  } p-6 sm:p-7`
                : `cursor-pointer p-5 rounded-2xl text-left transition-all border-2 group relative ${
                    selected
                      ? 'border-[#FF9500] bg-[#FF9500]/15 shadow-lg shadow-[0_2px_12px_rgba(255,149,0,0.15)]'
                      : 'border-[#F0ECE0] bg-white hover:border-[#E0DCCF] hover:bg-[#FFFDF8]'
                  }`
            }
          >
            {selected && (
              <div
                className={`absolute rounded-full bg-[#FF9500] flex items-center justify-center text-white ${
                  isHero ? 'top-4 right-4 w-7 h-7' : 'top-3 right-3 w-5 h-5'
                }`}
              >
                <Check size={isHero ? 14 : 11} className="text-white" />
              </div>
            )}
            <div
              className={`mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF9500]/20 to-amber-100/80 ${
                isHero ? 'h-16 w-16 text-4xl shadow-inner' : 'h-14 w-14 text-3xl'
              }`}
            >
              <span className="leading-none">{option.emoji}</span>
            </div>
            <h3 className={`font-black text-foreground ${isHero ? 'text-base sm:text-lg leading-snug pr-6' : 'text-sm mb-1'}`}>
              {option.title}
            </h3>
            <p
              className={`font-semibold uppercase tracking-wide ${isHero ? 'text-[11px] mt-1.5 text-[#CC7000]' : `text-xs mb-3 ${selected ? 'text-[#FF9500]' : 'text-muted-foreground'}`}`}
            >
              {option.badge}
            </p>
            {isHero ? (
              <p className="mt-2 pr-2 text-sm leading-relaxed text-muted-foreground">{option.compactHint}</p>
            ) : (
              <div className="space-y-1.5">
                {option.details.map((d) => (
                  <div key={d} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Check size={11} className={`mt-0.5 shrink-0 ${selected ? 'text-[#FF9500]' : 'text-foreground-muted'}`} />
                    {d}
                  </div>
                ))}
              </div>
            )}
            {isHero && (
              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#FF9500] transition-all group-hover:gap-3">
                <span className="rounded-lg bg-[#FF9500]/10 px-2 py-0.5 text-xs font-black uppercase tracking-wide text-[#CC7000]">
                  Tap to continue
                </span>
                <ArrowRight size={18} className="shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

const HOW_IT_WORKS_STEPS = [
  {
    Icon: Zap,
    title: '~5 min score',
    desc: 'Targeted Yes/No questions and a readiness readout.',
  },
  {
    Icon: ShieldCheck,
    title: 'No friction',
    desc: 'Start immediately — save a report later if you want.',
  },
  {
    Icon: Map,
    title: 'Your gaps',
    desc: 'See weak topics and what to study next for your stack.',
  },
];

/** Timeline + horizontal flow — avoids three heavy “card” boxes */
function HowItWorksFlow() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Mobile: vertical timeline */}
      <div className="relative md:hidden">
        <div
          className="absolute left-[21px] top-2 bottom-2 w-[2px] rounded-full bg-gradient-to-b from-[#FF9500]/35 via-[#E8E4DC] to-[#E8E4DC]"
          aria-hidden
        />
        <ul className="relative space-y-10 pl-0">
          {HOW_IT_WORKS_STEPS.map(({ Icon, title, desc }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex gap-4"
            >
              <motion.div
                className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#FFFDF8] shadow-md ring-2 ring-[#FF9500]/15"
                whileHover={{ scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 420, damping: 24 }}
              >
                <Icon size={19} className="text-[#FF9500]" strokeWidth={2} />
              </motion.div>
              <div className="min-w-0 pt-0.5">
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Desktop: horizontal flow with connectors */}
      <div className="hidden md:flex md:items-start md:justify-center md:gap-0">
        {HOW_IT_WORKS_STEPS.map(({ Icon, title, desc }, i) => (
          <React.Fragment key={title}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex max-w-[220px] flex-1 flex-col items-center px-2 text-center lg:max-w-[240px] lg:px-3"
            >
              <motion.div
                className="relative mb-4"
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              >
                <div className="absolute inset-0 rounded-full bg-[#FF9500]/12 blur-lg" aria-hidden />
                <div className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#E8E4DC] bg-white shadow-sm">
                  <Icon size={22} className="text-[#FF9500]" strokeWidth={2} />
                </div>
              </motion.div>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{desc}</p>
            </motion.div>
            {i < HOW_IT_WORKS_STEPS.length - 1 && (
              <div className="flex shrink-0 items-center self-center px-1 pt-7 lg:px-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.35 }}
                  className="flex items-center text-[#C9C4BB]"
                >
                  <span className="hidden h-px w-4 rounded-full bg-gradient-to-r from-transparent to-[#E0DCCF] lg:block" />
                  <ArrowRight className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" strokeWidth={2} />
                  <span className="hidden h-px w-4 rounded-full bg-gradient-to-l from-transparent to-[#E0DCCF] lg:block" />
                </motion.div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/** Full-screen loader while POST /interview-ready/plan runs — avoids a frozen UI with generic copy */
function PlanGenerationLoader() {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#FFFDF8] font-sans"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-20 h-64 w-64 rounded-full bg-[#FF9500]/10 blur-3xl" />
        <div className="absolute bottom-24 right-1/4 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12 sm:max-w-xl sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <div className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center" aria-hidden>
            <div className="absolute inset-0 rounded-full border-2 border-[#F0ECE0] bg-white/80" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#FF9500] border-r-[#FF9500]/30" />
            <Sparkles className="relative z-10 h-9 w-9 text-[#FF9500]" strokeWidth={2} />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-hint">Please wait</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">Preparing your questions</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-foreground-muted">
            We&apos;re tailoring Yes/No items to your profile and focus. This can take up to a minute on a slow connection.
          </p>
          <p className="mt-2 text-xs text-hint">Do not close this tab.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 rounded-2xl border border-[#E8E4DC] bg-white/95 p-6 shadow-lg shadow-black/[0.04] backdrop-blur-sm sm:p-7"
        >
          <div className="mb-4 flex items-center justify-center gap-2 text-foreground">
            <Users className="h-5 w-5 shrink-0 text-[#FF9500]" strokeWidth={2} />
            <h3 className="text-base font-bold sm:text-lg">Bridge the gap with MentorMuni</h3>
          </div>
          <p className="text-center text-sm leading-relaxed text-foreground-muted">
            Practice alone only gets you so far. Join MentorMuni for{' '}
            <span className="font-semibold text-[#333333]">1:1 mentorship</span> and{' '}
            <span className="font-semibold text-[#333333]">AI mock interviews</span> — structured to build confidence before
            the real round.
          </p>
          <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              to="/mentors"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#FF9500]/25 transition-all hover:bg-[#E88600] sm:w-auto"
            >
              <Headphones className="h-4 w-4" aria-hidden />
              Explore mentorship
            </Link>
            <Link
              to="/mock-interviews"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#E0DCCF] bg-[#FAFAFA] px-5 py-3 text-sm font-semibold text-[#333333] transition-all hover:border-[#FF9500]/40 hover:bg-[#FFF8EE] sm:w-auto"
            >
              AI mock interviews
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** Lighter loader while answers are evaluated (step 5) */
function EvaluatingAnswersLoader() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] px-4 py-12 font-sans sm:px-6">
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-full border-4 border-[#FF9500]/25 border-t-[#FF9500] animate-spin" />
        <h2 className="text-xl font-black text-foreground sm:text-2xl">Scoring your readiness</h2>
        <p className="mt-2 text-sm text-muted-foreground">Analyzing your answers — almost there.</p>
        <p className="mx-auto mt-8 max-w-sm rounded-xl border border-[#F0ECE0] bg-white px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground-muted">MentorMuni</span> pairs you with mentors and AI mocks so gaps turn
          into confidence — explore after your score appears.
        </p>
      </div>
    </div>
  );
}

/** Step 5: compact header; on list scroll, swap to slim title bar so questions stay visible */
function ReadinessQuizPanel({ questions, answers, setAnswers, profile, onSubmit, loading, error }) {
  const [scrolled, setScrolled] = useState(false);
  const listRef = useRef(null);
  const isSkillQuiz = profile.assessmentMode === ASSESSMENT_FOCUS_SKILL;
  const quizTitle = isSkillQuiz ? 'Skill preparation quiz' : 'Interview readiness quiz';
  const answered = Object.keys(answers).length;
  const total = questions.length || 1;
  const pct = Math.min(100, Math.round((answered / total) * 100));
  const skillSnippet = (profile.primarySkill || '').split(',')[0].trim() || 'your input';
  const roleLabel =
    DISPLAY_ROLE_BY_CATEGORY[profile.userCategory] ||
    (profile.userCategory ? String(profile.userCategory).replace(/_/g, ' ') : '') ||
    '';

  const onListScroll = () => {
    const el = listRef.current;
    if (!el) return;
    setScrolled(el.scrollTop > 28);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-6 px-4 font-sans sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-2xl border border-[#E0DCCF] bg-white shadow-xl sm:rounded-3xl">
          {/* Expanded header — hidden once user scrolls the question list */}
          <div
            className={`border-b border-[#F0ECE0] px-4 transition-all duration-200 sm:px-6 ${
              scrolled ? 'max-h-0 overflow-hidden border-0 opacity-0' : 'max-h-[220px] opacity-100 py-4 sm:py-5'
            }`}
            aria-hidden={scrolled}
          >
            <div className="flex flex-wrap items-start justify-between gap-3 gap-y-2">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold leading-tight text-foreground sm:text-xl">{quizTitle}</h2>
                  <span className="shrink-0 rounded-full border border-[#E8D9C8] bg-[#FFF8EE] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#8B6914] sm:text-[11px]">
                    Yes/No · {questions.length}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-muted-foreground sm:text-sm">
                  {isSkillQuiz
                    ? 'Scoped to your skill — not a full interview-round mix.'
                    : 'Broad engineering-style checks for overall readiness.'}
                </p>
                <p className="mt-1 truncate text-xs text-hint">
                  {isSkillQuiz ? 'Skill: ' : 'Context: '}
                  <span className="font-medium text-foreground-muted">{skillSnippet}</span>
                  {roleLabel ? (
                    <>
                      {' · '}
                      <span className="font-medium text-foreground-muted">{roleLabel}</span>
                    </>
                  ) : null}
                </p>
              </div>
              <div className="shrink-0 rounded-lg border border-[#E0DCCF] bg-[#FFFDF8] px-3 py-2 text-right">
                <div className="text-lg font-black tabular-nums leading-none text-foreground sm:text-xl">
                  {answered}
                  <span className="text-[#999999]">/</span>
                  {questions.length}
                </div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-hint">Answered</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#F0ECE0]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF9500] to-cyan-500 transition-[width] duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Slim bar — only after scrolling */}
          <div
            className={`border-b border-[#F0ECE0] bg-[#FAFAFA]/95 px-4 backdrop-blur-sm transition-all duration-200 sm:px-6 ${
              scrolled ? 'max-h-24 py-2.5 opacity-100' : 'max-h-0 overflow-hidden border-0 py-0 opacity-0'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 truncate text-sm font-semibold text-foreground">{quizTitle}</p>
              <span className="shrink-0 text-xs font-bold tabular-nums text-foreground-muted">
                {answered}/{questions.length}
              </span>
            </div>
            <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-[#E8E4DC]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF9500] to-cyan-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div
            ref={listRef}
            onScroll={onListScroll}
            className="max-h-[min(75dvh,720px)] space-y-6 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5"
          >
            {questions.map((q, i) => (
              <div key={i} className="border-b border-[#F0ECE0] pb-6 last:border-0 last:pb-2">
                <p className="mb-4 flex items-start gap-3 text-base font-semibold leading-relaxed text-foreground">
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#FF9500] to-cyan-600 text-xs font-black text-white">
                    {i + 1}
                  </span>
                  <span>{q}</span>
                </p>
                <div className="flex gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, [i]: 'Yes' })}
                    className={`flex-1 rounded-xl border-2 py-2.5 text-sm font-bold transition-all sm:py-3 ${
                      answers[i] === 'Yes'
                        ? 'border-emerald-500 bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                        : 'border-[#E0DCCF] bg-white text-foreground-muted hover:border-emerald-400/60 hover:bg-emerald-50'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, [i]: 'No' })}
                    className={`flex-1 rounded-xl border-2 py-2.5 text-sm font-bold transition-all sm:py-3 ${
                      answers[i] === 'No'
                        ? 'border-rose-500 bg-rose-600 text-white shadow-md shadow-rose-500/25'
                        : 'border-[#E0DCCF] bg-white text-foreground-muted hover:border-rose-400/60 hover:bg-rose-50'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#F0ECE0] bg-[#FFFCF9] px-4 py-4 sm:px-6">
            {error && (
              <div
                className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-left text-sm font-medium text-red-800"
                role="alert"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden />
                <span>{error}</span>
              </div>
            )}
            <button
              type="button"
              className={`w-full rounded-2xl py-3.5 text-base font-bold text-white shadow-lg transition-all sm:py-4 ${
                answered < questions.length
                  ? 'cursor-not-allowed bg-slate-500 text-slate-200'
                  : 'bg-gradient-to-r from-[#FF9500] to-[#E88600] hover:from-[#FF9500] hover:to-[#E88600] active:scale-[0.99]'
              }`}
              disabled={answered < questions.length || loading}
              onClick={onSubmit}
            >
              {answered < questions.length
                ? `Answer ${questions.length - answered} more ${questions.length - answered === 1 ? 'question' : 'questions'}`
                : 'Get My Readiness Score'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const InterviewReady = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [fromToolsEntry] = useState(() => readToolsEntryFromHash());

  // Initialize free usage tracker and modal
  const { incrementUsage, getUsageInfo } = useFreeUsageTracker('interview_readiness');

  // 0: landing, 12: mode (tools entry), 2: role, … — tools skips hero, starts at mode picker
  const [step, setStep] = useState(() => (readToolsEntryFromHash() ? 12 : 0));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: ''
  });
  
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  // Post-results email save
  const [reportEmail, setReportEmail] = useState('');
  const [reportSent, setReportSent] = useState(false);
  
  const [profile, setProfile] = useState({
    assessmentMode: null,
    userCategory: '',
    primarySkill: '',
    email: '',
    contactNumber: '',
    collegeName: '',
    experienceYears: '',
    currentOrganization: '',
  });

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [evaluationData, setEvaluationData] = useState(null);
  const [result, setResult] = useState(null);
  const [earlyBirdCouponCode, setEarlyBirdCouponCode] = useState('');
  const [couponCopied, setCouponCopied] = useState(false);
  const [usageInfo, setUsageInfo] = useState({
    current_usage: 0,
    limit: FREE_TIER_LIMIT,
    remaining_attempts: FREE_TIER_LIMIT
  });

  // Authentication states
  const [authMode, setAuthMode] = useState(null); // 'signup' or 'signin'
  const [authData, setAuthData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  // Selected payment plan
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  // Client navigation to ?entry=tools after mount (e.g. in-app link)
  useEffect(() => {
    if (searchParams.get('entry') === 'tools') {
      setStep((s) => (s === 0 ? 12 : s));
    }
  }, [searchParams]);

  useEffect(() => {
    if ([2, 3, 4, 5].includes(step) && !profile.assessmentMode) {
      setStep(fromToolsEntry ? 12 : 0);
    }
  }, [step, profile.assessmentMode, fromToolsEntry]);

  const checkBackendHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) {
        console.warn('Backend health check failed');
      }
    } catch (err) {
      console.warn('Cannot reach backend:', err.message);
    }
  };

  // Form validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validatePhone = (phone) => {
    const cleanNumber = phone.replace(/[^\d]/g, '');
    return cleanNumber.length >= 10;
  };

  const validateContactInfo = () => {
    const errors = {};
    
    if (!contactInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(contactInfo.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!contactInfo.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(contactInfo.phone)) {
      errors.phone = 'Please enter a valid phone number (at least 10 digits)';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    
    if (!validateContactInfo()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/get-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: contactInfo.email.trim(),
          phone: contactInfo.phone.trim()
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Failed to send OTP');
        setLoading(false);
        return;
      }
      
      setOtpSent(true);
      setError(null);
    } catch (err) {
      setError('Cannot reach backend. Please ensure server is running.');
    } finally {
      setLoading(false);
    }
  };

  const validateOTP = () => {
    if (!otpCode.trim()) {
      setError('OTP is required');
      return false;
    }
    if (otpCode.trim().length !== 6 || !/^\d+$/.test(otpCode.trim())) {
      setError('OTP must be 6 digits');
      return false;
    }
    return true;
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!validateOTP()) return;
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: contactInfo.email.trim(),
          otp: otpCode.trim()
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'OTP verification failed');
        setLoading(false);
        return;
      }
      
      setOtpVerified(true);
      setUsageInfo(data.usage_info ? {
        current_usage: data.usage_info.current_usage,
        limit: data.usage_info.limit,
        remaining_attempts: data.usage_info.remaining_attempts
      } : usageInfo);
      
      // Move to category selection
      setProfile({
        ...profile,
        email: contactInfo.email.trim(),
        contactNumber: contactInfo.phone.trim()
      });
      setStep(2);
      setOtpCode('');
      setError(null);
    } catch (err) {
      setError('Cannot reach backend. Please ensure server is running.');
    } finally {
      setLoading(false);
    }
  };

  const validateContext = () => {
    const errors = {};
    if (profile.userCategory === 'professional') {
      const raw = String(profile.experienceYears ?? '').trim();
      if (!raw) {
        errors.experienceYears = 'Enter years of experience';
      } else {
        const n = parseFloat(raw, 10);
        if (Number.isNaN(n) || n < 0 || n > 50) {
          errors.experienceYears = 'Enter a number between 0 and 50';
        }
      }
      if (!profile.currentOrganization?.trim()) {
        errors.currentOrganization = 'Current organization is required';
      }
    } else if (profile.userCategory && profile.userCategory !== 'professional') {
      if (!profile.collegeName?.trim()) {
        errors.collegeName = 'College or university name is required';
      }
    }

    const emailStr = String(profile.email ?? '').trim();
    if (emailStr && !validateEmail(emailStr)) {
      errors.email = 'Invalid email format';
    }

    const phoneStr = String(profile.contactNumber ?? '').trim();
    if (phoneStr && !validatePhone(phoneStr)) {
      errors.phone = 'Enter a valid phone number (at least 10 digits)';
    }

    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next.collegeName;
      delete next.experienceYears;
      delete next.currentOrganization;
      delete next.email;
      delete next.phone;
      return { ...next, ...errors };
    });
    return Object.keys(errors).length === 0;
  };

  const validateForm = () => {
    const errors = {};

    if (!profile.userCategory.trim()) {
      errors.userCategory = 'Please select a category';
    }

    if (!profile.primarySkill.trim()) {
      errors.primarySkill =
        profile.assessmentMode === ASSESSMENT_FOCUS_SKILL
          ? 'Enter the skill you want to practice'
          : 'Enter your major subjects or areas (for interview context)';
    } else if (profile.primarySkill.trim().length > PLAN_PRIMARY_SKILL_MAX) {
      errors.primarySkill = `Keep your stack to ${PLAN_PRIMARY_SKILL_MAX} characters or less (API limit)`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGetReadinessPlan = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    const primarySkill = profile.primarySkill.trim().slice(0, PLAN_PRIMARY_SKILL_MAX);
    const expParsed =
      profile.userCategory === 'professional'
        ? Math.min(50, Math.max(0, parseFloat(String(profile.experienceYears).trim(), 10) || 0))
        : 0;
    const payload = {
      user_type:
        API_USER_TYPE_BY_CATEGORY[profile.userCategory] ?? 'student',
      primary_skill: primarySkill,
      experience_years: expParsed,
      target_role: profile.targetRole?.trim() || undefined,
      email: profile.email?.trim() || undefined,
      phone: profile.contactNumber?.trim() || undefined,
    };
    if (profile.userCategory === 'professional' && profile.currentOrganization?.trim()) {
      payload.current_organization = profile.currentOrganization.trim();
    }
    if (profile.userCategory && profile.userCategory !== 'professional' && profile.collegeName?.trim()) {
      payload.college_name = profile.collegeName.trim();
    }
    if (profile.assessmentMode === ASSESSMENT_FOCUS_SKILL || profile.assessmentMode === ASSESSMENT_FOCUS_PLACEMENT) {
      payload.assessment_focus = profile.assessmentMode;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), PLAN_FETCH_TIMEOUT_MS);

    try {
      const res = await fetch(`${API_BASE}${INTERVIEW_PLAN_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data = await parseResponseJson(res);

      if (!res.ok) {
        if (res.status === 429) {
          setStep(7);
          return;
        }
        const msg = formatPlanApiError(data);
        if (import.meta.env.DEV) {
          console.warn('[interview-ready/plan] error', res.status, data);
        }
        setError(explainPlanHttpError(res.status, msg));
        return;
      }

      if (!data.evaluation_plan || !data.evaluation_plan.length) {
        setError('No questions returned from server. Please try again.');
        return;
      }

      setQuestions(data.evaluation_plan.map((q) => q.question));
      setEvaluationData(data.evaluation_plan);
      setStep(5);
    } catch (err) {
      console.error('Plan request:', err);
      if (err.name === 'AbortError') {
        setError(
          `No response after ${PLAN_FETCH_TIMEOUT_MS / 1000}s. Generating questions can be slow — try again, or check your network.`
        );
      } else {
        setError(`Cannot reach ${API_BASE}. Check your connection or try again later.`);
      }
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleEvalSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        questions: evaluationData.map(q => q.question),
        answers: evaluationData.map((_, i) => answers[i] || ''),
        correct_answers: evaluationData.map(q => q.correct_answer),
        study_topics: evaluationData.map(q => q.study_topic),
      };

      const res = await fetch(`${API_BASE}/interview-ready/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await parseResponseJson(res);

      if (!res.ok) {
        const msg =
          (typeof data.detail === 'string' && data.detail) ||
          data.error ||
          data.message ||
          'Failed to evaluate answers. Please try again.';
        setError(msg);
        return;
      }

      const pctRaw = data.readiness_percentage ?? data.readinessPercentage;
      const pctNum =
        typeof pctRaw === 'number' && !Number.isNaN(pctRaw)
          ? pctRaw
          : parseFloat(String(pctRaw ?? '').replace(/,/g, ''), 10);
      const readinessPct = Number.isFinite(pctNum) ? Math.min(100, Math.max(0, pctNum)) : 0;
      const readinessLabel =
        (typeof data.readiness_label === 'string' && data.readiness_label) ||
        (typeof data.readinessLabel === 'string' && data.readinessLabel) ||
        'Your result';

      const evalResult = {
        readiness_percentage: readinessPct,
        readiness_label: readinessLabel,
        summary: `${readinessLabel} — ${readinessPct}% readiness score`,
        userCategory: profile.userCategory,
        assessmentMode: profile.assessmentMode,
        techStack: profile.primarySkill,
        strengths: data.strengths || [],
        gaps: data.gaps || [],
        learning_recommendations: data.learning_recommendations || data.learningRecommendations || [],
        evaluatedAt: Date.now(),
      };

      setEarlyBirdCouponCode(pickRandomEarlyBirdCoupon());
      setCouponCopied(false);
      setResult(evalResult);
      setStep(6);

      const { isLimitReached } = incrementUsage();
      if (isLimitReached) setShowUpgradeModal(true);
    } catch (err) {
      console.error('Evaluate error:', err);
      setError('Cannot connect to backend. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setStep(0);
    setProfile({
      assessmentMode: null,
      userCategory: '',
      primarySkill: '',
      email: '',
      contactNumber: '',
      collegeName: '',
      experienceYears: '',
      currentOrganization: '',
    });
    setContactInfo({ email: '', phone: '' });
    setAnswers({});
    setValidationErrors({});
    setError(null);
    setOtpSent(false);
    setOtpVerified(false);
    setOtpCode('');
    setReportEmail('');
    setReportSent(false);
    setResult(null);
    setEarlyBirdCouponCode('');
    setCouponCopied(false);
  };

  const stepContent = (() => {
  // Score card must win over loading: after evaluate(), step becomes 6 while `loading` may still be true for one frame.
  if (loading && step !== 7 && step !== 8 && step !== 9 && !(step === 6 && result)) {
    if (step === 4) {
      return <PlanGenerationLoader />;
    }
    if (step === 5) {
      return <EvaluatingAnswersLoader />;
    }
    return (
      <div className="min-h-screen bg-[#FFFDF8] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl border border-[#E0DCCF] bg-white p-10 text-center shadow-xl backdrop-blur animate-in fade-in duration-500">
            <div className="mb-6">
              <div className="mx-auto h-14 w-14 rounded-full border-4 border-[#FF9500]/25 border-t-[#FF9500] animate-spin" />
            </div>
            <h2 className="mb-2 text-2xl font-black text-foreground">Processing your request</h2>
            <p className="text-muted-foreground">Please wait a moment…</p>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 12: ASSESSMENT MODE (tools entry — same picker as landing) ==========
  if (step === 12) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] py-10 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-[#F0ECE0]">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2 tracking-tight">Choose what to measure</h2>
            <p className="text-muted-foreground text-sm md:text-base mb-6 leading-relaxed">
              One skill in depth, or a broad interview mix — tap a card to continue.
            </p>
            <AssessmentModeGrid
              variant="hero"
              selectedMode={profile.assessmentMode}
              onPick={(mode) => {
                setProfile((p) => ({ ...p, assessmentMode: mode }));
                setStep(2);
              }}
            />
            <button
              type="button"
              onClick={() => navigate('/interview-readiness-tools')}
              className="mt-6 px-6 py-3 font-bold text-muted-foreground hover:text-foreground hover:bg-[#FFF8EE] rounded-xl transition-all border border-[#F0ECE0] hover:border-[#E0DCCF] text-sm"
            >
              ← Back to tools
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 0: LANDING ==========
  if (step === 0) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#FFFDF8] text-foreground-muted font-sans">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#FF9500]/12 blur-3xl" />
          <div className="absolute -right-16 top-1/3 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-48 w-[min(100%,480px)] -translate-x-1/2 rounded-full bg-amber-200/20 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col px-4 pb-12 pt-8 sm:px-6 sm:pt-10 lg:max-w-5xl lg:px-8">
          {/* Credibility — compact */}
          <div className="mb-5 flex justify-center sm:mb-6">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#F0ECE0] bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur sm:px-4">
              <Star size={14} className="shrink-0 text-amber-400" />
              <span className="text-center text-[11px] font-medium text-muted-foreground sm:text-xs">
                Patterns from 500+ companies · free score
              </span>
            </div>
          </div>

          {/* Headline — short */}
          <div className="mx-auto mb-6 max-w-xl text-center lg:mb-8">
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl leading-[1.08]">
              Interview{' '}
              <span className="bg-gradient-to-r from-[#FF9500] to-amber-500 bg-clip-text text-transparent">Readiness</span>
              <br />
              <span className="text-foreground">Check</span>
            </h1>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Two ways to start — pick one.{' '}
              <span className="whitespace-nowrap font-semibold text-foreground-muted">~5 min.</span>{' '}
              <span className="whitespace-nowrap">Free.</span> No signup.
            </p>
            {/* Trust row — single line */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-hint">
              {[
                { Icon: Clock, text: '~5 min' },
                { Icon: Sparkles, text: 'Instant score' },
                { Icon: ShieldCheck, text: 'No account' },
              ].map(({ Icon, text }) => (
                <span key={text} className="inline-flex items-center gap-1.5">
                  <Icon size={13} className="text-[#FF9500]" />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* How it works — above path choice (timeline / flow, not card grid) */}
          <div className="mx-auto mb-8 w-full max-w-3xl sm:mb-10">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-center sm:mb-8">
              <Zap size={18} className="shrink-0 text-[#FF9500]" />
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                How it works &amp; what you get
              </h2>
            </div>
            <HowItWorksFlow />
          </div>

          {/* Primary action — path cards */}
          <div className="mx-auto w-full max-w-3xl flex-1">
            <div className="mb-6 text-center sm:mb-7">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Choose your path</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Select one option below to continue.
              </p>
              <div className="mx-auto mt-5 h-px w-16 bg-[#E0DCCF]" aria-hidden />
            </div>
            <AssessmentModeGrid
              variant="hero"
              selectedMode={profile.assessmentMode}
              onPick={(mode) => {
                setProfile((p) => ({ ...p, assessmentMode: mode }));
                setStep(2);
              }}
            />
          </div>

          {/* Reward — below CTAs */}
          <div className="mx-auto mt-10 w-full max-w-2xl">
            <div className="flex items-start gap-3 rounded-2xl border border-orange-200/60 bg-gradient-to-r from-[#FFF8EE] to-white px-4 py-3 shadow-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF9500] to-amber-600 text-white shadow-md">
                <Gift size={18} strokeWidth={2} />
              </span>
              <div className="min-w-0 pt-0.5">
                <div className="mb-0.5 w-fit">
                  <LimitedRewardLabel />
                </div>
                <p className="text-sm leading-snug text-foreground-muted">{READINESS_TEST_COUPON_BADGE}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 1: COLLECT CONTACT INFO ==========
  if (step === 1 && !otpSent) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-[#E0DCCF] rounded-3xl shadow-2xl p-8 backdrop-blur animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FF9500]/20 border border-[#FF9500]">
                  <Mail className="text-[#FF9500]" size={24} />
                </div>
                <h2 className="text-3xl font-black text-foreground">Verify Your Contact</h2>
              </div>
              <p className="text-muted-foreground text-base">
                We'll send you an OTP to verify your email and phone
              </p>
            </div>
            
            <form onSubmit={handleRequestOTP} className="space-y-6">
              <div>
                <label className="text-sm font-bold text-[#333333] block mb-3">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input 
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => {
                    setContactInfo({...contactInfo, email: e.target.value});
                    setValidationErrors({...validationErrors, email: ''});
                  }}
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-3 rounded-xl border bg-white border border-[#E0DCCF] outline-none transition-all text-foreground placeholder-[#AAAAAA] ${
                    validationErrors.email 
                      ? 'border-red-500/50 bg-red-500/10' 
                      : 'border-[#E0DCCF] hover:border-[#E0DCCF] focus:border-[#FF9500] focus:ring-2 focus:ring-[#FF9500]/30'
                  }`}
                  required
                />
                {validationErrors.email && (
                  <div className="flex items-center gap-2 text-red-400 text-xs font-medium mt-2">
                    <AlertCircle size={14} />
                    {validationErrors.email}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-bold text-[#333333] block mb-3">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input 
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => {
                    setContactInfo({...contactInfo, phone: e.target.value});
                    setValidationErrors({...validationErrors, phone: ''});
                  }}
                  placeholder="+91 9876543210"
                  className={`w-full px-4 py-3 rounded-xl border bg-white border border-[#E0DCCF] outline-none transition-all text-foreground placeholder-[#AAAAAA] ${
                    validationErrors.phone 
                      ? 'border-red-500/50 bg-red-500/10' 
                      : 'border-[#E0DCCF] hover:border-[#E0DCCF] focus:border-[#FF9500] focus:ring-2 focus:ring-[#FF9500]/30'
                  }`}
                  required
                />
                {validationErrors.phone && (
                  <div className="flex items-center gap-2 text-red-400 text-xs font-medium mt-2">
                    <AlertCircle size={14} />
                    {validationErrors.phone}
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium flex items-start gap-3">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <div>{error}</div>
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button 
                  type="button" 
                  onClick={() => setStep(0)}
                  className="flex-1 py-3 font-bold text-foreground-muted hover:text-foreground hover:bg-[#FFF8EE] rounded-2xl transition-all border border-[#E0DCCF] hover:border-[#E0DCCF]"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-gradient-to-r from-[#FF9500] to-[#E88600] hover:from-[#FF9500] hover:to-[#E88600] disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 rounded-2xl shadow-lg transition-all active:scale-95"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 1B: VERIFY OTP ==========
  if (step === 1 && otpSent && !otpVerified) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-[#E0DCCF] rounded-3xl shadow-2xl p-8 backdrop-blur animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500">
                  <Lock className="text-cyan-400" size={24} />
                </div>
                <h2 className="text-3xl font-black text-foreground">Verify OTP</h2>
              </div>
              <p className="text-muted-foreground text-base">
                Enter the 6-digit code sent to your email and phone
              </p>
              <p className="text-xs text-cyan-400/80 mt-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                Enter the 6-digit OTP we sent to your email. Check your inbox and spam folder.
              </p>
            </div>
            
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="text-sm font-bold text-[#333333] block mb-3">
                  Enter OTP <span className="text-red-400">*</span>
                </label>
                <input 
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.slice(0, 6))}
                  placeholder="000000"
                  maxLength="6"
                  className="w-full px-4 py-3 rounded-xl border border-[#E0DCCF] bg-[#FAFAFA] outline-none text-center text-3xl font-black tracking-widest text-foreground placeholder-[#AAAAAA] hover:border-[#E0DCCF] focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium flex items-start gap-3">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <div>{error}</div>
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button 
                  type="button" 
                  onClick={() => setOtpSent(false)}
                  className="flex-1 py-3 font-bold text-foreground-muted hover:text-foreground hover:bg-[#FFF8EE] rounded-2xl transition-all border border-[#E0DCCF] hover:border-[#E0DCCF]"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 rounded-2xl shadow-lg transition-all active:scale-95"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 2: SELECT USER CATEGORY ==========
  if (step === 2) {
    const ROLES = [
      {
        value: '3rd_year',
        emoji: '🎓',
        label: '1st–3rd Year Student',
        badge: 'Internship-focused',
        details: ['Building DSA fundamentals', 'Core CS concepts', 'Targeting internships'],
      },
      {
        value: '4th_year',
        emoji: '🚀',
        label: '4th Year Student',
        badge: 'Campus placement season',
        details: ['Full-time job offers', 'System Design basics', 'Cracking tech rounds'],
      },
      {
        value: 'recent_graduate',
        emoji: '🎯',
        label: 'Recent Graduate',
        badge: 'Passout 2023–2026',
        details: ['Off-campus job hunt', 'Competitive placement prep', 'High-stakes interviews'],
      },
      {
        value: 'professional',
        emoji: '💼',
        label: 'Working Professional',
        badge: 'Job switch ready',
        details: ['Senior-level interviews', 'Architecture & design', 'Leadership questions'],
      },
    ];

    const ASSESSMENT_STEPS = 6;
    const currentStepIndex = 1;

    return (
      <div className="min-h-screen bg-[#FFFDF8] py-10 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-[#F0ECE0]">

            {/* Progress bar only — no step numbers or labels */}
            <div className="mb-6">
              <div
                className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden"
                role="progressbar"
                aria-label="Assessment progress"
                aria-valuenow={currentStepIndex}
                aria-valuemin={1}
                aria-valuemax={ASSESSMENT_STEPS}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF9500] to-cyan-400 transition-[width] duration-300"
                  style={{ width: `${(currentStepIndex / ASSESSMENT_STEPS) * 100}%` }}
                />
              </div>
            </div>

            {profile.assessmentMode && (
              <div className="mb-4">
                <span className="inline-flex items-center rounded-full border border-cyan-500/35 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-[#0E7490]">
                  {ASSESSMENT_MODE_LABEL[profile.assessmentMode]}
                </span>
              </div>
            )}

            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2 tracking-tight">
              Select your professional profile
            </h2>
            <p className="text-muted-foreground text-base mb-8 leading-relaxed">
              Choose the option that best reflects your current stage. We’ll tailor questions to your context.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {ROLES.map(option => {
                const selected = profile.userCategory === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setProfile((p) => {
                        const next = { ...p, userCategory: option.value };
                        if (option.value === 'professional') {
                          next.collegeName = '';
                        } else {
                          next.experienceYears = '';
                          next.currentOrganization = '';
                        }
                        return next;
                      });
                      setValidationErrors({ ...validationErrors, userCategory: '' });
                    }}
                    className={`p-5 rounded-2xl text-left transition-all border-2 group relative ${
                      selected
                        ? 'border-[#FF9500] bg-[#FF9500]/15 shadow-lg shadow-[0_2px_12px_rgba(255,149,0,0.15)]'
                        : 'border-[#F0ECE0] bg-white/[0.03] hover:border-[#E0DCCF] hover:bg-white/[0.06]'
                    }`}
                  >
                    {selected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#FF9500] flex items-center justify-center">
                        <Check size={11} className="text-white" />
                      </div>
                    )}
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-foreground text-sm mb-1">{option.label}</h3>
                    <p className={`text-xs font-medium mb-3 ${selected ? 'text-[#FF9500]' : 'text-muted-foreground'}`}>{option.badge}</p>
                    <div className="space-y-1.5">
                      {option.details.map((d) => (
                        <div key={d} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                          <Check size={11} className={`mt-0.5 shrink-0 ${selected ? 'text-[#FF9500]' : 'text-foreground-muted'}`} />
                          {d}
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setProfile((p) => ({ ...p, assessmentMode: null }));
                  if (fromToolsEntry) setStep(12);
                  else setStep(0);
                }}
                className="px-6 py-3 font-bold text-muted-foreground hover:text-foreground hover:bg-[#FFF8EE] rounded-xl transition-all border border-[#F0ECE0] hover:border-[#E0DCCF] text-sm"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={!profile.userCategory}
                onClick={() => setStep(3)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
                  profile.userCategory
                    ? 'bg-gradient-to-r from-[#FF9500] to-[#FFB347] text-white shadow-lg shadow-[0_4px_14px_rgba(255,149,0,0.3)] hover:from-[#FF9500] hover:to-[#FFB347] active:scale-[0.98]'
                    : 'cursor-not-allowed border border-[#F0ECE0] bg-white/[0.04] text-foreground-muted'
                }`}
              >
                Continue
                <ChevronRight size={16} />
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 3: CONTEXT (COLLEGE VS PROFESSIONAL) ==========
  if (step === 3) {
    const ASSESSMENT_STEPS = 6;
    const currentStepIndex = 2;
    const isPro = profile.userCategory === 'professional';
    const roleLabel =
      DISPLAY_ROLE_BY_CATEGORY[profile.userCategory] ||
      profile.userCategory.replace(/_/g, ' ');

    return (
      <div className="min-h-screen bg-[#FFFDF8] py-10 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-[#F0ECE0] animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <div
                className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden"
                role="progressbar"
                aria-label="Assessment progress"
                aria-valuenow={currentStepIndex}
                aria-valuemin={1}
                aria-valuemax={ASSESSMENT_STEPS}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF9500] to-cyan-400 transition-[width] duration-300"
                  style={{ width: `${(currentStepIndex / ASSESSMENT_STEPS) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-[#FF9500]/35 bg-[#FF9500]/10 px-3 py-1.5 text-xs font-semibold text-[#CC7000]">
                Profile: <span className="ml-1 text-foreground-muted">{roleLabel}</span>
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2 tracking-tight">
              {isPro ? 'Your experience & organization' : 'Your college or university'}
            </h2>
            <p className="text-muted-foreground text-base mb-8 leading-relaxed max-w-2xl">
              {isPro
                ? 'We use this to calibrate question difficulty and seniority—same as how real interviews adapt to your level.'
                : 'Helps us tailor examples and expectations to your academic context (campus drives, coursework, projects).'}
            </p>

            <div className="space-y-6">
              {isPro ? (
                <>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-[#333333]">
                      <Briefcase size={16} className="text-[#FF9500]" />
                      Years of experience <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      step={0.5}
                      inputMode="decimal"
                      value={profile.experienceYears}
                      onChange={(e) => {
                        setProfile((p) => ({ ...p, experienceYears: e.target.value }));
                        setValidationErrors((prev) =>
                          prev.experienceYears ? { ...prev, experienceYears: '' } : prev
                        );
                      }}
                      placeholder="e.g. 2.5"
                      className={`w-full rounded-xl border border-[#E0DCCF] bg-white px-4 py-3 text-foreground outline-none transition-all placeholder:text-muted-foreground ${
                        validationErrors.experienceYears
                          ? 'border-red-500/50 bg-red-500/10'
                          : 'border-[#E0DCCF] hover:border-[#E0DCCF] focus:border-[#FF9500] focus:ring-2 focus:ring-[#FF9500]/30'
                      }`}
                    />
                    {validationErrors.experienceYears && (
                      <div className="flex items-center gap-2 text-xs font-medium text-red-400">
                        <AlertCircle size={14} />
                        {validationErrors.experienceYears}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-[#333333]">
                      <Building2 size={16} className="text-[#FF9500]" />
                      Current organization <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={profile.currentOrganization}
                      onChange={(e) => {
                        setProfile((p) => ({ ...p, currentOrganization: e.target.value }));
                        setValidationErrors((prev) =>
                          prev.currentOrganization ? { ...prev, currentOrganization: '' } : prev
                        );
                      }}
                      placeholder="Company or employer name"
                      className={`w-full rounded-xl border border-[#E0DCCF] bg-white px-4 py-3 text-foreground outline-none transition-all placeholder:text-muted-foreground ${
                        validationErrors.currentOrganization
                          ? 'border-red-500/50 bg-red-500/10'
                          : 'border-[#E0DCCF] hover:border-[#E0DCCF] focus:border-[#FF9500] focus:ring-2 focus:ring-[#FF9500]/30'
                      }`}
                    />
                    {validationErrors.currentOrganization && (
                      <div className="flex items-center gap-2 text-xs font-medium text-red-400">
                        <AlertCircle size={14} />
                        {validationErrors.currentOrganization}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-[#333333]">
                    <Building2 size={16} className="text-[#FF9500]" />
                    College / university name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={profile.collegeName}
                    onChange={(e) => {
                      setProfile((p) => ({ ...p, collegeName: e.target.value }));
                      setValidationErrors((prev) => (prev.collegeName ? { ...prev, collegeName: '' } : prev));
                    }}
                    placeholder="e.g. IIT Madras, VIT Vellore, state university…"
                    className={`w-full rounded-xl border border-[#E0DCCF] bg-white px-4 py-3 text-foreground outline-none transition-all placeholder:text-muted-foreground ${
                      validationErrors.collegeName
                        ? 'border-red-500/50 bg-red-500/10'
                        : 'border-[#E0DCCF] hover:border-[#E0DCCF] focus:border-[#FF9500] focus:ring-2 focus:ring-[#FF9500]/30'
                    }`}
                  />
                  {validationErrors.collegeName && (
                    <div className="flex items-center gap-2 text-xs font-medium text-red-400">
                      <AlertCircle size={14} />
                      {validationErrors.collegeName}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 space-y-5 rounded-2xl border border-[#E0DCCF] bg-white/[0.03] p-5 md:p-6">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Email &amp; phone</p>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Optional</span>
              </div>
              <p className="text-xs text-muted-foreground -mt-2">Add your email to receive your detailed score report. Skip if you prefer — your score still shows instantly.</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-[#333333]">
                  <Mail size={16} className="text-[#FF9500]" />
                  Email address <span className="text-[10px] font-medium text-muted-foreground ml-1">(for score report)</span>
                </label>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={profile.email}
                  onChange={(e) => {
                    setProfile((p) => ({ ...p, email: e.target.value }));
                    setValidationErrors((prev) => (prev.email ? { ...prev, email: '' } : prev));
                  }}
                  placeholder="you@example.com (optional)"
                  className={`w-full rounded-xl border border-[#E0DCCF] bg-white px-4 py-3 text-foreground outline-none transition-all placeholder:text-muted-foreground ${
                    validationErrors.email
                      ? 'border-red-500/50 bg-red-500/10'
                      : 'border-[#E0DCCF] hover:border-[#E0DCCF] focus:border-[#FF9500] focus:ring-2 focus:ring-[#FF9500]/30'
                  }`}
                />
                {validationErrors.email && (
                  <div className="flex items-center gap-2 text-xs font-medium text-red-400">
                    <AlertCircle size={14} />
                    {validationErrors.email}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-[#333333]">
                  <Phone size={16} className="text-[#FF9500]" />
                  Phone number <span className="text-[10px] font-medium text-muted-foreground ml-1">(optional)</span>
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={profile.contactNumber}
                  onChange={(e) => {
                    setProfile((p) => ({ ...p, contactNumber: e.target.value }));
                    setValidationErrors((prev) => (prev.phone ? { ...prev, phone: '' } : prev));
                  }}
                  placeholder="+91 9876543210 (optional)"
                  className={`w-full rounded-xl border border-[#E0DCCF] bg-white px-4 py-3 text-foreground outline-none transition-all placeholder:text-muted-foreground ${
                    validationErrors.phone
                      ? 'border-red-500/50 bg-red-500/10'
                      : 'border-[#E0DCCF] hover:border-[#E0DCCF] focus:border-[#FF9500] focus:ring-2 focus:ring-[#FF9500]/30'
                  }`}
                />
                {validationErrors.phone && (
                  <div className="flex items-center gap-2 text-xs font-medium text-red-400">
                    <AlertCircle size={14} />
                    {validationErrors.phone}
                  </div>
                )}
              </div>
              <p className="text-xs text-emerald-600 flex items-center gap-1.5">
                <Check size={12} />
                No spam, ever. Just your score report if you add email.
              </p>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-xl border border-[#F0ECE0] px-6 py-3 text-sm font-bold text-muted-foreground transition-all hover:border-[#E0DCCF] hover:bg-white/5 hover:text-white"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!validateContext()) return;
                  setStep(4);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FFB347] py-3 text-sm font-bold text-white shadow-lg shadow-[0_4px_14px_rgba(255,149,0,0.3)] transition-all hover:from-[#FF9500] hover:to-[#FFB347] active:scale-[0.98]"
              >
                Continue to skills
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 4: SKILLS / TECH STACK ==========
  if (step === 4) {
    const ASSESSMENT_STEPS = 6;
    const currentStepIndex = 3;
    const isSkillFocus = profile.assessmentMode === ASSESSMENT_FOCUS_SKILL;

    const roleLabel =
      DISPLAY_ROLE_BY_CATEGORY[profile.userCategory] ||
      profile.userCategory.replace(/_/g, ' ');

    return (
      <div className="min-h-screen bg-[#FFFDF8] py-10 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-[#F0ECE0] animate-in slide-in-from-bottom-4 duration-500">
            {/* Progress — matches role step */}
            <div className="mb-6">
              <div
                className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden"
                role="progressbar"
                aria-label="Assessment progress"
                aria-valuenow={currentStepIndex}
                aria-valuemin={1}
                aria-valuemax={ASSESSMENT_STEPS}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF9500] to-cyan-400 transition-[width] duration-300"
                  style={{ width: `${(currentStepIndex / ASSESSMENT_STEPS) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-6 space-y-3">
              <h2 className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
                {isSkillFocus ? 'Your skill focus' : 'Interview focus areas'}
              </h2>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                {profile.assessmentMode && (
                  <>
                    <span className="font-semibold text-foreground-muted">
                      {ASSESSMENT_MODE_LABEL[profile.assessmentMode]}
                    </span>
                    <span className="text-[#D4D0C8]" aria-hidden>
                      ·
                    </span>
                  </>
                )}
                <span>{roleLabel}</span>
                <span className="text-[#D4D0C8]" aria-hidden>
                  ·
                </span>
                <span className="tabular-nums">
                  {usageInfo.remaining_attempts}/{FREE_TIER_LIMIT} free
                </span>
              </p>
              <p className="max-w-2xl text-sm leading-relaxed text-foreground-muted">
                {isSkillFocus ? (
                  <>
                    One skill only — we&apos;ll keep every question on it.{' '}
                    <span className="text-hint">({PLAN_PRIMARY_SKILL_MAX} characters max)</span>
                  </>
                ) : (
                  <>
                    Add subjects for context (e.g. DSA, OOP, DBMS). You&apos;ll get a{' '}
                    <span className="font-medium text-[#333333]">broad interview mix</span>, not drills on one language.{' '}
                    <span className="text-hint">({PLAN_PRIMARY_SKILL_MAX} characters max)</span>
                  </>
                )}
              </p>
            </div>

            <form onSubmit={handleGetReadinessPlan} className="space-y-6">
              <InputField
                label={isSkillFocus ? 'Skill to practice' : 'Major areas & skills (for context)'}
                type="textarea"
                name="primarySkill"
                value={profile.primarySkill}
                onChange={(e) => {
                  const v = e.target.value;
                  setProfile((prev) => ({ ...prev, primarySkill: v }));
                  setValidationErrors((prev) => (prev.primarySkill ? { ...prev, primarySkill: '' } : prev));
                }}
                placeholder={
                  isSkillFocus
                    ? 'e.g. Java, or C#, or Python, or Machine Learning — one primary skill'
                    : 'e.g. DSA, OOP, DBMS, system design — comma-separated areas'
                }
                error={validationErrors.primarySkill}
                maxLength={PLAN_PRIMARY_SKILL_MAX}
                showCharCount={true}
                autoComplete="off"
              />

              <div className="rounded-lg border border-[#E8E4DC] bg-[#FAFAFA] px-3 py-2.5">
                <p className="text-xs leading-snug text-foreground-muted">
                  {isSkillFocus ? (
                    <>
                      <span className="font-semibold text-foreground-muted">Tip:</span> Best with a single stack (e.g. Java or
                      Python), not a long list.
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-foreground-muted">Tip:</span> Comma-separated is fine; questions stay
                      general across topics.
                    </>
                  )}
                </p>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-300">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-400" />
                    <div className="min-w-0 flex-1 leading-relaxed">{error}</div>
                  </div>
                  <button
                    type="button"
                    disabled={loading || usageInfo.remaining_attempts <= 0}
                    onClick={() => handleGetReadinessPlan({ preventDefault() {} })}
                    className="mt-3 w-full rounded-lg border border-red-500/40 bg-red-500/10 py-2 text-xs font-bold text-red-200 transition-colors hover:bg-red-500/20 disabled:opacity-50 sm:w-auto sm:px-4"
                  >
                    Try again
                  </button>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="rounded-xl border border-[#F0ECE0] px-6 py-3 text-sm font-bold text-muted-foreground transition-all hover:border-[#E0DCCF] hover:bg-white/5 hover:text-white"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading || usageInfo.remaining_attempts <= 0}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FFB347] py-3 text-sm font-bold text-white shadow-lg shadow-[0_4px_14px_rgba(255,149,0,0.3)] transition-all hover:from-[#FF9500] hover:to-[#FFB347] active:scale-[0.98] disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700 disabled:shadow-none"
                >
                  {loading ? (
                    'Preparing your questions…'
                  ) : (
                    <>
                      Generate questions &amp; continue
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 5: QUIZ ==========
  if (step === 5) {
    return (
      <ReadinessQuizPanel
        questions={questions}
        answers={answers}
        setAnswers={setAnswers}
        profile={profile}
        onSubmit={handleEvalSubmit}
        loading={loading}
        error={error}
      />
    );
  }

  // ========== STEP 6: RESULTS (before loader branch so result takes precedence) ==========
  if (step === 6 && result) {
    const pct = result.readiness_percentage;
    const strengthCount = result.strengths?.length || 0;
    const gapCount = result.gaps?.length || 0;
    const topicTotal = Math.max(strengthCount + gapCount, 1);
    const strengthSignal = Math.round((strengthCount / topicTotal) * 100);
    const gapPressure = Math.round((gapCount / topicTotal) * 100);
    const band =
      pct >= 75
        ? { label: 'Strong band', sub: 'Keep momentum — polish the last gaps.' }
        : pct >= 50
          ? { label: 'Growth band', sub: 'Structured practice moves this score quickly.' }
          : { label: 'Build band', sub: 'High upside — lock fundamentals below.' };

    const modeLabel =
      result.assessmentMode === ASSESSMENT_FOCUS_SKILL
        ? 'Skill preparation'
        : result.assessmentMode === ASSESSMENT_FOCUS_PLACEMENT
          ? 'Interview readiness'
          : '—';
    const roleShort = (result.userCategory ? String(result.userCategory) : '').replace(/_/g, ' ');
    const areaShort = result.techStack || '—';
    const nextSteps = nextStepsForScoreBand(pct);
    const peerDims = peerDimensionsFromResult(pct, strengthSignal, gapPressure);

    return (
      <div className="min-h-screen bg-[#FFFDF8] py-8 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Your readiness score</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span className="font-medium text-foreground-muted">{modeLabel}</span>
              <span className="text-[#D4D0C8]" aria-hidden>
                ·
              </span>
              <span className="capitalize">{roleShort}</span>
              <span className="text-[#D4D0C8]" aria-hidden>
                ·
              </span>
              <span className="max-w-[200px] truncate sm:max-w-none" title={areaShort}>
                {areaShort}
              </span>
              <span className="text-[#D4D0C8]" aria-hidden>
                ·
              </span>
              <span className="tabular-nums">
                {usageInfo.current_usage}/{FREE_TIER_LIMIT} attempts
              </span>
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl border border-[#E0DCCF] bg-white p-6 shadow-xl sm:p-8"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#FF9500]/10 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[minmax(0,280px)_1fr] lg:items-start lg:gap-12">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <ReadinessScoreRing pct={pct} />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-950"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                  {band.label}
                </motion.div>
                <h2 className="mt-4 text-2xl font-black leading-tight text-foreground sm:text-3xl">
                  {result.readiness_label}
                </h2>
                <p className="mt-2 max-w-sm text-sm text-foreground-muted">{band.sub}</p>
                <p className="mt-3 text-xs leading-relaxed text-hint">{result.summary}</p>
              </div>

              <div className="rounded-2xl border border-[#E8E4DC] bg-[#FAFAFA]/80 p-5 sm:p-6">
                <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  <BarChart3 size={15} className="text-[#FF9500]" />
                  Score factors
                </p>
                <div className="space-y-6">
                  <ScoreFactorRow
                    label="Overall readiness"
                    value={pct}
                    hint="Headline score from this Yes/No run — your north-star number."
                    icon={Target}
                    variant="orange"
                    delay={0.08}
                  />
                  <ScoreFactorRow
                    label="Strength coverage"
                    value={strengthSignal}
                    hint="Share of topics where your answers looked solid vs all topics scored."
                    icon={CheckCircle2}
                    variant="emerald"
                    delay={0.16}
                  />
                  <ScoreFactorRow
                    label="Gap surface"
                    value={gapPressure}
                    hint="How much ground is still open — higher means more topics to prioritize."
                    icon={AlertTriangle}
                    variant="amber"
                    delay={0.24}
                  />
                </div>
                <p className="mt-5 border-t border-[#EDE8E0] pt-4 text-[10px] leading-relaxed text-hint">
                  Directional only — derived from your score and how many strength vs gap topics we detected.
                </p>
              </div>
            </div>
          </motion.div>

          {earlyBirdCouponCode && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="relative overflow-hidden rounded-3xl border-2 border-[#FFB347]/60 bg-gradient-to-br from-[#FFF8EE] via-white to-[#FFF4E6] p-6 shadow-lg sm:p-8"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#FF9500]/15 blur-2xl" />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-[#FF9500] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                    {HERO_EARLY_BIRD_RIBBON}
                  </span>
                  <Gift className="h-5 w-5 text-[#CC7000]" aria-hidden />
                </div>
                <h3 className="mt-3 text-lg font-black text-foreground sm:text-xl">
                  {READINESS_TEST_COUPON_OFFER_HEADLINE}
                </h3>
                <p className="mt-2 text-sm text-foreground-muted">
                  Your early-bird coupon is below — copy it and use it when you claim your reward (waitlist, mentor
                  session, or checkout when we share the link).
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <code className="break-all rounded-2xl border border-[#E0DCCF] bg-white px-4 py-3 text-center font-mono text-lg font-bold tracking-wide text-foreground shadow-inner sm:text-xl">
                    {earlyBirdCouponCode}
                  </code>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(earlyBirdCouponCode);
                        setCouponCopied(true);
                        window.setTimeout(() => setCouponCopied(false), 2200);
                      } catch {
                        /* clipboard unavailable */
                      }
                    }}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#E88600]"
                  >
                    {couponCopied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy code
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-4 text-xs text-hint">
                  {READINESS_TEST_COUPON_BADGE} · Codes are chosen at random from our early-bird pool for each score
                  card.
                </p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-[#141414] px-6 py-8 text-left text-white shadow-xl sm:px-8"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">What this means for you</p>
            <h3 className="mt-3 max-w-xl text-lg font-semibold leading-snug text-white sm:text-xl">
              {pct < 50
                ? 'At this level, most students gain 25–35 points within a few weeks of guided practice — you are not stuck here.'
                : pct < 75
                  ? 'You are in reach of a strong band — focused reps on gaps and mocks usually close the gap before drives.'
                  : 'You are in a competitive range — polish remaining gaps and practice under time pressure.'}
            </h3>
            <p className="mt-3 text-sm text-white/70">First mentor session is free. No commitment.</p>
            <div className="mt-6">
              <Link
                to="/mentors"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-5 py-3.5 text-sm font-semibold text-[#141414] shadow-lg transition hover:bg-[#FFB347] sm:w-auto"
              >
                Book free intro call
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-[#E0DCCF] bg-white p-6 shadow-sm sm:p-7"
          >
            <h3 className="text-base font-bold text-foreground sm:text-lg">Your next steps</h3>
            <p className="mt-1 text-xs text-muted-foreground">Prioritized for your current band — do them in order.</p>
            <ol className="mt-5 space-y-4">
              {nextSteps.map((stepItem, i) => (
                <li key={stepItem.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF8EE] text-sm font-black text-[#CC7000] ring-1 ring-[#F0ECE0]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{stepItem.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{stepItem.sub}</p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-[#E0DCCF] bg-white p-6 shadow-sm sm:p-7"
          >
            <h3 className="text-base font-bold text-foreground sm:text-lg">How you compare</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Illustrative peer lens — derived from your score profile (not a live benchmark survey).
            </p>
            <div className="mt-6 space-y-6">
              {peerDims.map((row, i) => (
                <ScoreFactorRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                  hint={row.hint}
                  icon={i === 0 ? Target : i === 1 ? TrendingUp : i === 2 ? AlertTriangle : BarChart3}
                  variant={i === 1 ? 'emerald' : i === 2 ? 'amber' : 'orange'}
                  delay={0.05 * i}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-50/90 to-[#FFF8EE] p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20">
                <Trophy className="text-emerald-600" size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Share2 size={16} className="text-muted-foreground" />
                  <p className="text-sm font-bold text-foreground">Challenge your friends</p>
                </div>
                <p className="mt-1 text-sm text-foreground-muted">
                  Dare your squad to beat your {pct}% — same free ~5 min interview readiness check. Bragging rights
                  optional, interview prep mandatory.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      buildWhatsAppChallengeMessage(
                        pct,
                        result.readiness_label,
                        result.assessmentMode ? ASSESSMENT_MODE_LABEL[result.assessmentMode] : ''
                      )
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/25 transition hover:bg-[#20bd5a]"
                  >
                    <Share2 size={14} />
                    Dare on WhatsApp
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getInterviewReadinessShareUrl())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A66C2] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-[#095195]"
                  >
                    <Linkedin size={14} aria-hidden />
                    LinkedIn
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      const msg = buildWhatsAppChallengeMessage(pct, result.readiness_label, result.assessmentMode ? ASSESSMENT_MODE_LABEL[result.assessmentMode] : '');
                      navigator.clipboard.writeText(msg);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E0DCCF] bg-white px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-[#FAFAFA]"
                  >
                    <Copy size={14} />
                    Copy message
                  </button>
                </div>
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5">
                  <p className="text-xs font-semibold text-amber-800">
                    🎯 Invite 3 friends who complete the test → Earn 1 free mentor session!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-[#F0ECE0] bg-white p-6"
          >
            {reportSent ? (
              <div className="py-2 text-center">
                <CheckCircle size={28} className="mx-auto mb-2 text-green-600" />
                <p className="text-sm font-semibold text-foreground">Report sent! Check your inbox.</p>
              </div>
            ) : (
              <>
                <p className="mb-1 text-sm font-semibold text-foreground">Get your full report in your inbox</p>
                <p className="mb-3 text-xs text-muted-foreground">Score breakdown, study plan, and resource links — sent once, no spam.</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={reportEmail}
                    onChange={(e) => setReportEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 rounded-xl border border-[#E0DCCF] bg-[#FAFAFA] px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-hint focus:border-[#FF9500]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (reportEmail.includes('@')) setReportSent(true);
                    }}
                    className="whitespace-nowrap rounded-xl bg-[#FF9500] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#E88600]"
                  >
                    Send Report
                  </button>
                </div>
              </>
            )}
          </motion.div>

          {result.learning_recommendations && result.learning_recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 to-[#E88600]/5 p-6"
            >
              <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-cyan-900">
                <Lightbulb size={20} className="text-cyan-600" />
                Personalized next steps
              </h3>
              <div className="space-y-3">
                {result.learning_recommendations.map((rec, i) =>
                  typeof rec === 'string' ? (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="rounded-xl border border-[#E0DCCF] bg-white p-4 text-left text-sm text-foreground-muted"
                    >
                      {rec}
                    </motion.p>
                  ) : (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="rounded-xl border border-[#E0DCCF] bg-white p-4 text-left"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#CC7000]">
                        {rec.priority || 'Focus'}
                      </p>
                      <p className="mt-1 font-semibold text-foreground">{rec.topic}</p>
                      {rec.why && <p className="mt-1 text-sm text-muted-foreground">{rec.why}</p>}
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {result.strengths && result.strengths.length > 0 && (
              <div className="rounded-2xl border border-[#E0DCCF] bg-white p-6 shadow-sm ring-1 ring-emerald-500/10">
                <h3 className="mb-1 flex items-center gap-2.5 text-base font-semibold tracking-tight text-foreground sm:text-lg">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                    <CheckCircle2 size={20} className="text-emerald-600" strokeWidth={2} aria-hidden />
                  </span>
                  Your strengths
                </h3>
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">Topics where your answers showed solid understanding.</p>
                <motion.div
                  variants={resultsListContainer}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col gap-2"
                >
                  {result.strengths.map((strength, i) => (
                    <motion.div
                      key={i}
                      variants={resultsListItem}
                      className="flex items-start gap-3 rounded-xl border border-[#E8F0EA] bg-[#FAFDFB] px-3.5 py-2.5 text-left text-sm leading-snug text-[#333333]"
                    >
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" strokeWidth={2} aria-hidden />
                      <span className="font-medium">{strength}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            {result.gaps && result.gaps.length > 0 && (
              <div className="rounded-2xl border border-[#E0DCCF] bg-white p-6 shadow-sm ring-1 ring-amber-500/10">
                <h3 className="mb-1 flex items-center gap-2.5 text-base font-semibold tracking-tight text-foreground sm:text-lg">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-800 ring-1 ring-amber-100">
                    <AlertTriangle size={20} className="text-amber-600" strokeWidth={2} aria-hidden />
                  </span>
                  Areas to improve
                </h3>
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">Prioritize these for your next study block.</p>
                <motion.div
                  variants={resultsListContainer}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col gap-2"
                >
                  {result.gaps.map((gap, i) => (
                    <motion.div
                      key={i}
                      variants={resultsListItem}
                      className="flex items-start gap-3 rounded-xl border border-[#F5EBDD] bg-[#FFFCF7] px-3.5 py-2.5 text-left text-sm leading-snug text-[#333333]"
                    >
                      <Target size={16} className="mt-0.5 shrink-0 text-amber-600" strokeWidth={2} aria-hidden />
                      <span className="font-medium">{gap}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="rounded-3xl border border-[#E0DCCF] bg-white p-8 shadow-2xl"
          >
            <div className="space-y-3">
              {usageInfo.remaining_attempts > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setStep(2);
                    setAnswers({});
                    setProfile({
                      ...profile,
                      primarySkill: '',
                      collegeName: '',
                      experienceYears: '',
                      currentOrganization: '',
                    });
                  }}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#FF9500] to-[#FFB347] py-4 text-base font-bold text-white shadow-lg shadow-[0_4px_14px_rgba(255,149,0,0.3)] transition-all hover:from-[#FF9500] hover:to-[#FFB347] active:scale-[0.98]"
                >
                  Try another category
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setStep(7);
                    setAuthMode(null);
                  }}
                  className="w-full rounded-2xl bg-[#FF9500] py-4 text-base font-bold text-white shadow-lg shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all hover:bg-[#E88600] active:scale-[0.98]"
                >
                  Unlock premium — get more interviews
                </button>
              )}
              <button
                type="button"
                onClick={resetAll}
                className="w-full rounded-2xl border border-[#E0DCCF] bg-[#FAFAFA] py-4 text-base font-bold text-foreground-muted transition-all hover:border-[#E0DCCF] hover:bg-[#FFF8EE]"
              >
                Start fresh
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ========== STEP 6: LOADING SCORE (step set before result in same tick) ==========
  if (step === 6 && !result) {
    return (
      <AIAnalysisLoader
        onComplete={() => {
          // Results appear when evaluation payload is ready
        }}
        duration={4000}
      />
    );
  }

  // ========== STEP 7: AUTHENTICATION CHECK ==========
  if (step === 7) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-[#FF9500]/25 rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in duration-500">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FF9500]/20 border border-[#FF9500]/45 mb-6">
                <div className="w-2 h-10 bg-[#FFB347] rounded-full"></div>
              </div>
              <h1 className="text-4xl font-black text-foreground mb-3">
                Unlock AI Mock Interviews
              </h1>
              <p className="text-lg text-foreground-muted">
                You've completed your free assessment. Get premium access to unlimited AI mock interviews with advanced features!
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  setAuthMode('signin');
                  setStep(8);
                }}
                className="w-full bg-gradient-to-r from-[#FF9500] to-[#E88600] hover:from-[#FF9500] hover:to-[#E88600] text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
              >
                Sign In to Your Account
              </button>
              <button 
                onClick={() => {
                  setAuthMode('signup');
                  setStep(8);
                }}
                className="w-full bg-white/5 hover:bg-white/10 border border-[#E0DCCF] hover:border-[#E0DCCF] text-foreground-muted font-bold py-4 rounded-2xl transition-all"
              >
                Create New Account
              </button>
              <button 
                onClick={resetAll}
                className="w-full bg-white/5 hover:bg-white/10 border border-[#E0DCCF] hover:border-[#E0DCCF] text-foreground-muted font-bold py-3 rounded-2xl transition-all text-sm"
              >
                Go Back Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 8: SIGNUP / SIGNIN ==========
  if (step === 8) {
    if (authMode === 'signin') {
      return (
        <div className="min-h-screen bg-[#FFFDF8] py-12 px-4 sm:px-6 lg:px-8 font-sans">
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-[#E0DCCF] rounded-3xl shadow-2xl p-8 backdrop-blur animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-foreground mb-2">Sign In</h2>
              <p className="text-muted-foreground mb-8">Access your premium interviews</p>

              <form onSubmit={(e) => {
                e.preventDefault();
                setStep(9);
              }} className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-[#333333] block mb-2">Email</label>
                  <input 
                    type="email"
                    value={signInData.email}
                    onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-[#E0DCCF] bg-[#FAFAFA] text-foreground placeholder-[#888888] outline-none focus:border-[#FF9500]"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#333333] block mb-2">Password</label>
                  <input 
                    type="password"
                    value={signInData.password}
                    onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-[#E0DCCF] bg-[#FAFAFA] text-foreground placeholder-[#888888] outline-none focus:border-[#FF9500]"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setStep(7)}
                    className="flex-1 py-3 font-bold text-foreground-muted hover:text-foreground hover:bg-[#FFF8EE] rounded-2xl transition-all border border-[#E0DCCF]"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#FF9500] to-[#E88600] hover:from-[#FF9500] hover:to-[#E88600] text-white font-bold py-3 rounded-2xl shadow-lg transition-all"
                  >
                    Sign In
                  </button>
                </div>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-6">
                Don't have an account? <button onClick={() => setAuthMode('signup')} className="text-[#FF9500] font-semibold hover:text-[#CC7000]">Sign up here</button>
              </p>
            </div>
          </div>
        </div>
      );
    }

    // SIGNUP
    return (
      <div className="min-h-screen bg-[#FFFDF8] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-[#E0DCCF] rounded-3xl shadow-2xl p-8 backdrop-blur animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-foreground mb-2">Create Account</h2>
            <p className="text-muted-foreground mb-8">Join thousands of job seekers mastering interviews</p>

            <form onSubmit={(e) => {
              e.preventDefault();
              setStep(9);
            }} className="space-y-6">
              <div>
                <label className="text-sm font-bold text-[#333333] block mb-2">Full Name</label>
                <input 
                  type="text"
                  value={authData.fullName}
                  onChange={(e) => setAuthData({...authData, fullName: e.target.value})}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-[#E0DCCF] bg-white/5 text-white placeholder-slate-500 outline-none focus:border-[#FF9500]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#333333] block mb-2">Email</label>
                <input 
                  type="email"
                  value={authData.email}
                  onChange={(e) => setAuthData({...authData, email: e.target.value})}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#E0DCCF] bg-white/5 text-white placeholder-slate-500 outline-none focus:border-[#FF9500]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#333333] block mb-2">Phone</label>
                <input 
                  type="tel"
                  value={authData.phone}
                  onChange={(e) => setAuthData({...authData, phone: e.target.value})}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3 rounded-xl border border-[#E0DCCF] bg-white/5 text-white placeholder-slate-500 outline-none focus:border-[#FF9500]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#333333] block mb-2">Password</label>
                <input 
                  type="password"
                  value={authData.password}
                  onChange={(e) => setAuthData({...authData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-[#E0DCCF] bg-white/5 text-white placeholder-slate-500 outline-none focus:border-[#FF9500]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#333333] block mb-2">Confirm Password</label>
                <input 
                  type="password"
                  value={authData.confirmPassword}
                  onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-[#E0DCCF] bg-white/5 text-white placeholder-slate-500 outline-none focus:border-[#FF9500]"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setStep(7)}
                  className="flex-1 py-3 font-bold text-foreground-muted hover:text-foreground hover:bg-[#FFF8EE] rounded-2xl transition-all border border-[#E0DCCF]"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#FF9500] to-[#E88600] hover:from-[#FF9500] hover:to-[#E88600] text-white font-bold py-3 rounded-2xl shadow-lg transition-all"
                >
                  Sign Up
                </button>
              </div>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Already have an account? <button onClick={() => setAuthMode('signin')} className="text-[#FF9500] font-semibold hover:text-[#CC7000]">Sign in here</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 9: PAYMENT PLANS ==========
  if (step === 9) {
    const plans = [
      {
        id: 'plan1',
        name: 'Starter Plan',
        interviews: 2,
        price: 999,
        duration: '1 month',
        features: [
          'Timed mock interviews',
          'Voice-based interview simulation',
          'Behavioral question simulation',
          'HR round practice',
          'Live feedback on answers'
        ],
        badge: 'Best for Entry Level'
      },
      {
        id: 'plan2',
        name: 'Pro Plan',
        interviews: 5,
        price: 1899,
        duration: '3 months',
        features: [
          'Timed mock interviews',
          'Voice-based interview simulation',
          'Behavioral question simulation',
          'HR round practice',
          'Live feedback on answers',
          'Performance analytics'
        ],
        badge: 'Most Popular',
        highlighted: true
      },
      {
        id: 'plan3',
        name: 'Expert Plan',
        interviews: 10,
        price: 3299,
        duration: '6 months',
        features: [
          'Timed mock interviews',
          'Voice-based interview simulation',
          'Behavioral question simulation',
          'HR round practice',
          'Live feedback on answers',
          'Performance analytics',
          '1:1 Mentor consultation',
          'Resume feedback'
        ],
        badge: 'Complete Package'
      }
    ];

    return (
      <div className="min-h-screen bg-[#FFFDF8] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              AI Mock Interview Plans
            </h1>
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
              Choose the perfect plan to ace your interviews with AI-powered simulations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl transition-all transform hover:scale-105 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-[#FF9500] to-cyan-600 p-1 md:scale-105'
                    : 'border border-[#E0DCCF]'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#FF9500] text-white px-4 py-1 rounded-full text-xs font-black">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className={`${
                  plan.highlighted
                    ? 'bg-[#FFFDF8] rounded-[calc(1.5rem-1px)]'
                    : 'bg-white/5'
                } p-8 h-full`}>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className={`text-sm ${plan.highlighted ? 'text-cyan-400' : 'text-muted-foreground'} mb-6`}>{plan.duration}</p>

                  <div className="mb-6">
                    <div className="text-4xl font-black text-white mb-1">₹{plan.price}</div>
                    <div className="text-sm text-muted-foreground">
                      {plan.interviews} AI Mock Interviews
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle size={18} className={`flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-cyan-400' : 'text-[#FF9500]'}`} />
                        <span className="text-sm text-foreground-muted">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full py-4 rounded-xl font-bold transition-all ${
                      selectedPlan === plan.id
                        ? plan.highlighted
                          ? 'bg-cyan-600 text-white'
                          : 'bg-[#FF9500] text-white'
                        : plan.highlighted
                        ? 'bg-cyan-600/30 border border-cyan-600 text-cyan-400 hover:bg-cyan-600/50'
                        : 'bg-white/5 border border-[#E0DCCF] text-white hover:bg-white/10'
                    }`}
                  >
                    {selectedPlan === plan.id ? (
                      <span className="inline-flex items-center gap-2">
                        <Check size={18} /> Selected
                      </span>
                    ) : (
                      'Select Plan'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedPlan && (
            <div className="bg-gradient-to-r from-[#FF9500] to-cyan-600 rounded-3xl p-8 text-center">
              <h2 className="text-2xl font-black text-white mb-4">
                Ready to master interviews?
              </h2>
              <button className="bg-white text-[#FF9500] px-12 py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-white/20 transition-all">
                Proceed to Payment
              </button>
            </div>
          )}

          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={() => setStep(6)}
              className="bg-white/5 hover:bg-white/10 border border-[#E0DCCF] text-foreground-muted font-bold py-3 px-8 rounded-2xl transition-all"
            >
              ← Back
            </button>
            <button
              onClick={resetAll}
              className="bg-white/5 hover:bg-white/10 border border-[#E0DCCF] text-foreground-muted font-bold py-3 px-8 rounded-2xl transition-all"
            >
              Skip for Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // OTP verified → step 2 in same update; rare fallthrough while step is still 1
  if (step === 1 && otpSent && otpVerified) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center px-4">
        <div className="w-12 h-12 border-4 border-[#FF9500]/35 border-t-[#FF9500] rounded-full animate-spin" aria-hidden />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col items-center justify-center gap-4 px-4 py-12">
      <p className="text-foreground-muted text-center max-w-md">Something went wrong loading this screen.</p>
      <button
        type="button"
        onClick={resetAll}
        className="rounded-xl bg-[#FF9500] hover:bg-[#E88600] px-6 py-3 font-bold text-white shadow-lg transition-colors"
      >
        Start over
      </button>
    </div>
  );
  })();

  return (
    <>
      {stepContent}
      <UpgradePromptModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        toolName="Interview Readiness Check"
      />
    </>
  );
};

export default InterviewReady;
