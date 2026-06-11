import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { X, ArrowRight, Check, BarChart3, Wrench, Building2 } from 'lucide-react';
import { HERO_SOCIAL_PROOF_VISIBLE_LINE } from '../constants/brandCopy';

const OVERLAY_SESSION_KEY = 'mm_welcome_overlay_seen_v5';
const LOGO_SRC = `${import.meta.env.BASE_URL}mentormuni-logo.png`;

const RING_SIZE = 112;
const RING_STROKE = 7;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_R;
const RING_SCORE = 0.72;
const RING_OFFSET = RING_CIRC * (1 - RING_SCORE);

const JOURNEY_STEPS = [
  { label: 'Measure', Icon: BarChart3, tone: 'sky' },
  { label: 'Fix', Icon: Wrench, tone: 'teal' },
  { label: 'Place', Icon: Building2, tone: 'violet' },
];

const TRUST_PILLS = ['Free', '~5 min', 'No signup'];

function WelcomeScoreRing() {
  const cx = RING_SIZE / 2;
  const gradId = 'mm-welcome-ring-grad';

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
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#1a8fc4" />
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
        strokeDashoffset={RING_OFFSET}
        transform={`rotate(-90 ${cx} ${cx})`}
        className="mm-welcome__ring-arc"
      />
    </svg>
  );
}

export default function WelcomeLaunchOverlay() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (pathname !== '/') {
      setOpen(false);
      return;
    }
    try {
      if (!sessionStorage.getItem(OVERLAY_SESSION_KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, [pathname]);

  const closeOverlay = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(OVERLAY_SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  if (pathname !== '/') return null;

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

              <div className="mm-welcome__ring-wrap">
                <WelcomeScoreRing />
                <div className="mm-welcome__ring-center">
                  <img src={LOGO_SRC} alt="" className="mm-welcome__logo" width={28} height={28} />
                  <p className="mm-welcome__score" aria-hidden>
                    <span className="mm-welcome__score-value">72</span>
                    <span className="mm-welcome__score-suffix">/100</span>
                  </p>
                </div>
              </div>

              <p className="mm-welcome__brand">
                Mentor<span className="mm-welcome__brand-accent">Muni</span>
              </p>
              <p className="mm-welcome__eyebrow">Placement readiness</p>

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
                Free readiness score
              </h2>
              <p id="mm-overlay-desc" className="mm-welcome__desc">
                Know your gaps before placement season — 5 min, no signup.
              </p>

              <div className="mm-welcome__trust" aria-label="What's included">
                {TRUST_PILLS.map((pill) => (
                  <span key={pill} className="mm-welcome__trust-pill">
                    <Check size={11} strokeWidth={2.75} className="mm-welcome__trust-check" aria-hidden />
                    {pill}
                  </span>
                ))}
              </div>

              <p className="mm-welcome__social">{HERO_SOCIAL_PROOF_VISIBLE_LINE}</p>

              <Link to="/start-assessment" onClick={closeOverlay} className="mm-welcome__cta">
                Start now
                <ArrowRight size={16} strokeWidth={2.25} aria-hidden />
              </Link>
              <button type="button" onClick={closeOverlay} className="mm-welcome__dismiss">
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
