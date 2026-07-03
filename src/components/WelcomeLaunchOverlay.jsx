import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { X, ArrowRight, Check, BarChart3, Wrench, Building2, Flame, Target, Sparkles } from 'lucide-react';
import { HERO_SOCIAL_PROOF_VISIBLE_LINE } from '../constants/brandCopy';

/** Daily-return keys: shown-once-per-day gate + streak tracking (localStorage). */
const OVERLAY_SHOWN_DATE_KEY = 'mm_welcome_shown_date';
const STREAK_COUNT_KEY = 'mm_welcome_streak_count';
const STREAK_DATE_KEY = 'mm_welcome_streak_date';

/** Local YYYY-MM-DD (avoids UTC off-by-one across timezones). */
function localDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Rotating daily prompt — makes each visit feel fresh, reinforcing the habit. */
const DAILY_FOCUS_LINES = [
  'Sharpen one weak area today.',
  'Attempt a fresh set of questions.',
  'Re-check your readiness score.',
  'Practice one mock answer out loud.',
  'Close one gap before the next drive.',
  'Revisit a topic you find hard.',
  'Keep the streak — consistency wins placements.',
];

const RING_SIZE = 112;
const RING_STROKE = 7;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_R;

const JOURNEY_STEPS = [
  { label: 'Measure', Icon: BarChart3, tone: 'sky' },
  { label: 'Fix', Icon: Wrench, tone: 'teal' },
  { label: 'Place', Icon: Building2, tone: 'violet' },
];

const TRUST_PILLS = ['Free', '~5 min', 'No signup'];

/** Rotating differentiator — what actually makes MentorMuni hard to copy. */
const MOAT_LINES = [
  'AI prep + real human mentor loop',
  'Company-style question patterns',
  'Measure → Fix → Place system',
  'See gaps before a rejection does',
  'Built for campus & off-campus drives',
];

/** Weekly streak ring — fills as the daily habit builds (progress 0–1). */
function WelcomeStreakRing({ progress }) {
  const cx = RING_SIZE / 2;
  const gradId = 'mm-welcome-ring-grad';
  const clamped = Math.max(0.06, Math.min(1, progress));
  const offset = RING_CIRC * (1 - clamped);

  return (
    <svg
      width={RING_SIZE}
      height={RING_SIZE}
      viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
      className="mm-welcome__ring-svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb347" />
          <stop offset="55%" stopColor="#ff9500" />
          <stop offset="100%" stopColor="#2aaa8a" />
        </linearGradient>
      </defs>
      <circle
        cx={cx}
        cy={cx}
        r={RING_R}
        fill="none"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth={RING_STROKE}
      />
      <circle
        cx={cx}
        cy={cx}
        r={RING_R}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={RING_STROKE}
        strokeLinecap="round"
        strokeDasharray={RING_CIRC}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cx})`}
        className="mm-welcome__ring-arc"
        style={{ '--mm-ring-offset': offset }}
      />
    </svg>
  );
}

/** Show at most once per day; count consecutive-day visits as a streak. */
function bumpDailyStreak(today) {
  try {
    const last = localStorage.getItem(STREAK_DATE_KEY);
    let count = parseInt(localStorage.getItem(STREAK_COUNT_KEY) || '0', 10) || 0;
    if (last === today) return count;
    const yesterday = localDateKey(new Date(Date.now() - 86400000));
    count = last === yesterday ? count + 1 : 1;
    localStorage.setItem(STREAK_COUNT_KEY, String(count));
    localStorage.setItem(STREAK_DATE_KEY, today);
    return count;
  } catch {
    return 1;
  }
}

export default function WelcomeLaunchOverlay() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [streak, setStreak] = useState(1);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (pathname !== '/') {
      setOpen(false);
      return;
    }
    const today = localDateKey(new Date());
    try {
      if (localStorage.getItem(OVERLAY_SHOWN_DATE_KEY) === today) return;
      setStreak(bumpDailyStreak(today));
      localStorage.setItem(OVERLAY_SHOWN_DATE_KEY, today);
      setOpen(true);
    } catch {
      setStreak(bumpDailyStreak(today));
      setOpen(true);
    }
  }, [pathname]);

  const closeOverlay = () => {
    setOpen(false);
  };

  if (pathname !== '/') return null;

  const isReturning = streak >= 2;
  const dayIndex = Math.floor(Date.now() / 86400000);
  const dayInWeek = ((streak - 1) % 7) + 1;
  const weeklyProgress = dayInWeek / 7;
  const focusLine = DAILY_FOCUS_LINES[dayIndex % DAILY_FOCUS_LINES.length];
  const moatLine = MOAT_LINES[dayIndex % MOAT_LINES.length];
  const title = isReturning ? `You're on a ${streak}-day streak` : 'Your daily readiness check-in';
  const desc = isReturning
    ? 'A few minutes today keeps you placement-ready. Keep the streak alive.'
    : 'Know your gaps before placement season — 5 min, free, no signup.';
  const ctaLabel = isReturning ? 'Continue today' : 'Start now';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mm-welcome-backdrop fixed inset-0 z-[220] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mm-overlay-title"
          aria-describedby="mm-overlay-desc"
        >
          <button
            type="button"
            onClick={closeOverlay}
            className="mm-welcome-backdrop__shade absolute inset-0"
            aria-label="Close"
          />

          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="mm-welcome relative z-10"
          >
            <button
              type="button"
              onClick={closeOverlay}
              className="mm-welcome__close"
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={2.25} />
            </button>

            <div className="mm-welcome__hero">
              <div className="mm-welcome__grid" aria-hidden />
              <div className="mm-welcome__orb mm-welcome__orb--sky" aria-hidden />
              <div className="mm-welcome__orb mm-welcome__orb--teal" aria-hidden />

              <span className="mm-welcome__streak">
                <Flame size={13} strokeWidth={2.5} className="mm-welcome__streak-flame" aria-hidden />
                {isReturning ? `${streak}-day streak` : 'Day 1'}
              </span>

              <div className="mm-welcome__ring-wrap">
                <WelcomeStreakRing progress={weeklyProgress} />
                <div className="mm-welcome__ring-center">
                  <Flame size={20} strokeWidth={2.25} className="mm-welcome__ring-flame" aria-hidden />
                  <p className="mm-welcome__score" aria-hidden>
                    <span className="mm-welcome__score-value">{dayInWeek}</span>
                    <span className="mm-welcome__score-suffix">/7</span>
                  </p>
                  <span className="mm-welcome__ring-cap">this week</span>
                </div>
              </div>

              <p className="mm-welcome__brand">
                Mentor<span className="mm-welcome__brand-accent">Muni</span>
              </p>
              <span className="mm-welcome__moat">
                <Sparkles size={11} strokeWidth={2.5} className="mm-welcome__moat-icon" aria-hidden />
                {moatLine}
              </span>

              <div className="mm-welcome__journey" aria-hidden>
                {JOURNEY_STEPS.map((step, index) => {
                  const StepIcon = step.Icon;
                  return (
                    <React.Fragment key={step.label}>
                      <div className={`mm-welcome__journey-step mm-welcome__journey-step--${step.tone}`}>
                        <span className="mm-welcome__journey-icon">
                          <StepIcon size={13} strokeWidth={2.25} aria-hidden />
                        </span>
                        <span className="mm-welcome__journey-label">{step.label}</span>
                      </div>
                      {index < JOURNEY_STEPS.length - 1 && (
                        <span className="mm-welcome__journey-connector" aria-hidden />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <div className="mm-welcome__body">
              <h2 id="mm-overlay-title" className="mm-welcome__title">
                {title}
              </h2>
              <p id="mm-overlay-desc" className="mm-welcome__desc">
                {desc}
              </p>

              <div className="mm-welcome__trust" aria-label="What's included">
                {TRUST_PILLS.map((pill) => (
                  <span key={pill} className="mm-welcome__trust-pill">
                    <Check size={11} strokeWidth={2.75} className="mm-welcome__trust-check" aria-hidden />
                    {pill}
                  </span>
                ))}
              </div>

              <p className="mm-welcome__focus">
                <Target size={12} strokeWidth={2.5} aria-hidden />
                <span className="mm-welcome__focus-label">Today</span>
                {focusLine}
              </p>

              <p className="mm-welcome__social">{HERO_SOCIAL_PROOF_VISIBLE_LINE}</p>

              <Link to="/start-assessment" onClick={closeOverlay} className="mm-welcome__cta">
                {ctaLabel}
                <ArrowRight size={16} strokeWidth={2.25} aria-hidden />
              </Link>
              <button type="button" onClick={closeOverlay} className="mm-welcome__dismiss">
                Remind me tomorrow
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
