import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { ArrowRight, Check, ChevronRight, Info, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  HERO_COMPARE_AFTER_LABEL,
  HERO_COMPARE_AFTER_SCORE,
  HERO_COMPARE_AFTER_STATUS,
  HERO_COMPARE_AFTER_WINS,
  HERO_COMPARE_BEFORE_GAPS,
  HERO_COMPARE_BEFORE_LABEL,
  HERO_COMPARE_BEFORE_SCORE,
  HERO_COMPARE_BEFORE_STATUS,
  HERO_COMPARE_CTA,
  HERO_COMPARE_TAGLINE,
  HERO_SCORE_CARD_HINT,
  HERO_SCORE_CARD_TITLE,
} from '../../constants/brandCopy';

const GAUGE_SEGMENTS = [
  { label: 'Poor', color: '#ef4444' },
  { label: 'Fair', color: '#f97316' },
  { label: 'Good', color: '#eab308' },
  { label: 'Very good', color: '#84cc16' },
  { label: 'Excellent', color: '#16a34a' },
];

const GAUGE_LOOP_MS = 11_000;

/** Upward semicircle — pivot at bottom center, score sits under pivot */
const GAUGE = {
  width: 148,
  height: 96,
  cx: 74,
  cy: 58,
  r: 52,
  stroke: 10,
};

function segmentPath(index) {
  const total = GAUGE_SEGMENTS.length;
  const segmentAngle = Math.PI / total;
  const startAngle = Math.PI - index * segmentAngle;
  const endAngle = Math.PI - (index + 1) * segmentAngle;
  const x1 = GAUGE.cx + GAUGE.r * Math.cos(startAngle);
  const y1 = GAUGE.cy - GAUGE.r * Math.sin(startAngle);
  const x2 = GAUGE.cx + GAUGE.r * Math.cos(endAngle);
  const y2 = GAUGE.cy - GAUGE.r * Math.sin(endAngle);
  return `M ${x1} ${y1} A ${GAUGE.r} ${GAUGE.r} 0 0 1 ${x2} ${y2}`;
}

function needleTip(score) {
  const angle = Math.PI - (Math.min(100, Math.max(0, score)) / 100) * Math.PI;
  return {
    x: GAUGE.cx + (GAUGE.r - 6) * Math.cos(angle),
    y: GAUGE.cy - (GAUGE.r - 6) * Math.sin(angle),
  };
}

function useGaugeAnimation(target, { reduceMotion, delaySec = 0, enabled = true }) {
  const motionVal = useMotionValue(reduceMotion ? target : 0);
  const spring = useSpring(motionVal, { stiffness: 52, damping: 22, mass: 0.85 });
  const [displayScore, setDisplayScore] = useState(reduceMotion ? target : 0);
  const [tip, setTip] = useState(() => needleTip(reduceMotion ? target : 0));

  useMotionValueEvent(spring, 'change', (v) => {
    const clamped = Math.min(100, Math.max(0, v));
    setDisplayScore(Math.round(clamped));
    setTip(needleTip(clamped));
  });

  useEffect(() => {
    if (!enabled) return undefined;

    if (reduceMotion) {
      motionVal.set(target);
      return undefined;
    }

    let resetTimeout;
    let loopId;

    const animateUp = () => {
      motionVal.set(0);
      resetTimeout = window.setTimeout(() => motionVal.set(target), 60);
    };

    const startId = window.setTimeout(() => {
      animateUp();
      loopId = window.setInterval(animateUp, GAUGE_LOOP_MS);
    }, delaySec * 1000);

    return () => {
      window.clearTimeout(startId);
      window.clearTimeout(resetTimeout);
      window.clearInterval(loopId);
    };
  }, [enabled, reduceMotion, target, delaySec, motionVal]);

  return { displayScore, tip };
}

function SegmentedGauge({ score, variant, reduceMotion, animDelay = 0, inView }) {
  const { displayScore, tip } = useGaugeAnimation(score, {
    reduceMotion,
    delaySec: animDelay,
    enabled: inView,
  });
  const needleColor = variant === 'dark' ? '#e2e8f0' : '#334155';
  const scoreColor = variant === 'dark' ? '#f8fafc' : '#0f172a';
  const denomColor = variant === 'dark' ? '#94a3b8' : '#64748b';

  return (
    <div className="mm-hero-compare-gauge">
      <svg
        width={GAUGE.width}
        height={GAUGE.height}
        viewBox={`0 0 ${GAUGE.width} ${GAUGE.height}`}
        className="mm-hero-compare-gauge__svg"
        aria-hidden
      >
        {GAUGE_SEGMENTS.map((seg, index) => (
          <path
            key={seg.label}
            d={segmentPath(index)}
            fill="none"
            stroke={seg.color}
            strokeWidth={GAUGE.stroke}
            strokeLinecap="round"
            opacity={variant === 'dark' ? 0.95 : 1}
          />
        ))}
        <motion.line
          x1={GAUGE.cx}
          y1={GAUGE.cy}
          initial={false}
          animate={{ x2: tip.x, y2: tip.y }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 52, damping: 22, mass: 0.85 }
          }
          stroke={needleColor}
          strokeWidth="2.25"
          strokeLinecap="round"
          style={{ opacity: displayScore === 0 && !reduceMotion ? 0.35 : 1 }}
        />
        <circle cx={GAUGE.cx} cy={GAUGE.cy} r="4" fill={needleColor} />
        <text
          x={GAUGE.cx}
          y={GAUGE.cy + 21}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={scoreColor}
        >
          <tspan className="mm-hero-compare-gauge__score-svg mm-hero-compare-gauge__score-svg--live">
            {displayScore}
          </tspan>
          <tspan className="mm-hero-compare-gauge__denom-svg" fill={denomColor}>
            {' '}/ 100
          </tspan>
        </text>
      </svg>
      {/* Screen-reader live region for animated score */}
      <span className="sr-only" aria-live="polite">
        Score {displayScore} out of 100
      </span>
    </div>
  );
}

function ComparePanel({
  type,
  score,
  status,
  items,
  variant,
  reduceMotion,
  delay = 0,
  animDelay = 0,
  inView,
}) {
  const isBefore = type === 'before';
  const badgeClass = isBefore ? 'mm-hero-compare-panel__badge--before' : 'mm-hero-compare-panel__badge--after';
  const statusClass = isBefore ? 'mm-hero-compare-panel__status--before' : 'mm-hero-compare-panel__status--after';
  const Icon = isBefore ? X : Check;

  return (
    <motion.article
      className={`mm-hero-compare-panel mm-hero-compare-panel--${type}`}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className={`mm-hero-compare-panel__badge ${badgeClass}`}>
        {isBefore ? HERO_COMPARE_BEFORE_LABEL : HERO_COMPARE_AFTER_LABEL}
      </span>
      <SegmentedGauge
        score={score}
        variant={variant}
        reduceMotion={reduceMotion}
        animDelay={animDelay}
        inView={inView}
      />
      <p className={`mm-hero-compare-panel__status ${statusClass}`}>{status}</p>
      <ul className="mm-hero-compare-panel__list">
        {items.map((item) => (
          <li key={item} className="mm-hero-compare-panel__list-item">
            <span className={`mm-hero-compare-panel__icon mm-hero-compare-panel__icon--${type}`} aria-hidden>
              <Icon size={11} strokeWidth={2.75} />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

/**
 * Before / after placement readiness score — hero proof visual.
 * Gauges count up from 0 and replay on a gentle loop when in view.
 */
export function HeroReadinessCompare({ variant = 'light', className = '' }) {
  const reduceMotion = useReducedMotion();
  const panelVariant = variant === 'dark' ? 'dark' : 'light';
  const compareRef = useRef(null);
  const inView = useInView(compareRef, { once: false, amount: 0.35, margin: '-40px' });

  return (
    <motion.div
      ref={compareRef}
      className={`mm-hero-score-root mm-hero-score-float mm-hero-compare-root ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{ opacity: 1 }}
    >
      <div className="mm-hero-score-aura" aria-hidden />

      <div className="mm-hero-score-border">
        <div
          className={`mm-hero-score-panel mm-hero-compare-panel-shell ${
            panelVariant === 'dark' ? 'mm-hero-score-panel--dark' : 'mm-hero-score-panel--light'
          }`}
          role="img"
          aria-label={`Sample placement readiness comparison. Before score ${HERO_COMPARE_BEFORE_SCORE}, after score ${HERO_COMPARE_AFTER_SCORE}.`}
        >
          <div className="mm-hero-score-header">
            <div className="mm-hero-score-header__copy">
              <h2 className="mm-hero-score-title">
                {HERO_SCORE_CARD_TITLE}
                <Info size={14} className="mm-hero-score-title-icon" aria-hidden />
              </h2>
              <p className="mm-hero-score-hint">{HERO_SCORE_CARD_HINT}</p>
            </div>
          </div>

          <p className="mm-hero-compare-tagline">{HERO_COMPARE_TAGLINE}</p>

          <div className="mm-hero-compare-grid">
            <ComparePanel
              type="before"
              score={HERO_COMPARE_BEFORE_SCORE}
              status={HERO_COMPARE_BEFORE_STATUS}
              items={HERO_COMPARE_BEFORE_GAPS}
              variant={panelVariant}
              reduceMotion={reduceMotion}
              delay={0.15}
              animDelay={0.35}
              inView={inView}
            />
            <div className="mm-hero-compare-arrow" aria-hidden>
              <ChevronRight size={22} className="mm-hero-compare-arrow__icon mm-hero-compare-arrow__icon--h" />
              <ArrowRight size={18} className="mm-hero-compare-arrow__icon mm-hero-compare-arrow__icon--v" />
            </div>
            <ComparePanel
              type="after"
              score={HERO_COMPARE_AFTER_SCORE}
              status={HERO_COMPARE_AFTER_STATUS}
              items={HERO_COMPARE_AFTER_WINS}
              variant={panelVariant}
              reduceMotion={reduceMotion}
              delay={0.28}
              animDelay={0.65}
              inView={inView}
            />
          </div>

          <Link to="/start-assessment" className="mm-hero-compare-cta">
            {HERO_COMPARE_CTA}
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
