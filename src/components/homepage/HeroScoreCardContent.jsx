import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar,
  ChevronRight,
  Code2,
  Info,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import {
  HERO_SCORE_CARD_TITLE,
  HERO_SCORE_LIVE_BADGE,
} from '../../constants/brandCopy';
import { HeroCompanyChips } from './HeroCompanyChips';
import { useHeroGapRotation } from './useHeroGapRotation';
import { getHeroScoreTier, heroArcMetrics } from './heroScoreUtils';
import { HERO_EASE } from './heroMotion';

const { width: ARC_W, height: ARC_H, stroke: ARC_STROKE, arcLength, pathD } = heroArcMetrics();
const GRAD_ID = 'mm-hero-arc-grad';

function SemiCircleGauge({ score, scoreRatio, reduceMotion, variant }) {
  const offset = arcLength * (1 - scoreRatio);

  return (
    <div className="mm-hero-score-gauge">
      <svg
        width={ARC_W}
        height={ARC_H}
        viewBox={`0 0 ${ARC_W} ${ARC_H}`}
        className="mm-hero-score-gauge__svg"
        aria-hidden
      >
        <defs>
          <linearGradient id={GRAD_ID} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={variant === 'dark' ? '#38bdf8' : '#1A8FC4'} />
            <stop offset="55%" stopColor={variant === 'dark' ? '#2dd4bf' : '#2AAA8A'} />
            <stop offset="100%" stopColor={variant === 'dark' ? '#34d399' : '#22d3ee'} />
          </linearGradient>
        </defs>
        <path
          d={pathD}
          fill="none"
          stroke={variant === 'dark' ? 'rgba(51, 65, 85, 0.55)' : '#e2e8f0'}
          strokeWidth={ARC_STROKE}
          strokeLinecap="round"
        />
        <motion.path
          d={pathD}
          fill="none"
          stroke={`url(#${GRAD_ID})`}
          strokeWidth={ARC_STROKE}
          strokeLinecap="round"
          strokeDasharray={arcLength}
          initial={reduceMotion ? { strokeDashoffset: offset } : { strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: reduceMotion ? 0 : 1.4, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      <div className="mm-hero-score-gauge__value">
        <motion.span
          className="mm-hero-score-value mm-hero-score-gauge__score"
          initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.85, type: 'spring', stiffness: 260, damping: 18 }}
        >
          {score}
        </motion.span>
        <span className="mm-hero-score-gauge__denom">/ 100</span>
      </div>
    </div>
  );
}

/**
 * Placement readiness scorecard body — gauge, companies, stats row, action banner.
 */
export function HeroScoreCardContent({ preview, variant = 'light', onIncrementStudentPool }) {
  const reduceMotion = useReducedMotion();
  const {
    score,
    scoreRatio,
    gapSkill,
    improvePct,
    percentileAhead,
    rank,
    totalStudents,
    estimatedWeeks,
    unlockNames,
  } = preview;
  const tier = getHeroScoreTier(score);
  const { activeGap, advanceGap } = useHeroGapRotation(gapSkill, reduceMotion);
  const focusLine = activeGap.focusTopics.join(', ');

  const handleInteract = () => {
    onIncrementStudentPool?.();
    advanceGap();
  };

  return (
    <>
      <div className="mm-hero-score-header">
        <div className="mm-hero-score-header__copy">
          <h2 className="mm-hero-score-title">
            {HERO_SCORE_CARD_TITLE}
            <Info size={14} className="mm-hero-score-title-icon" aria-hidden />
          </h2>
        </div>
        <span className="mm-hero-score-live shrink-0">
          <span className="mm-hero-score-live-dot" aria-hidden />
          {HERO_SCORE_LIVE_BADGE}
        </span>
      </div>

      <div className="mm-hero-score-pr-top">
        <div className="mm-hero-score-pr-gauge-col">
          <SemiCircleGauge score={score} scoreRatio={scoreRatio} reduceMotion={reduceMotion} variant={variant} />
          <span className={`mm-hero-score-tier mm-hero-score-tier--${tier.tone}`}>
            <TrendingUp size={12} strokeWidth={2.5} aria-hidden />
            {tier.label}
          </span>
          <p className="mm-hero-score-percentile">
            You&apos;re ahead of{' '}
            <strong>{percentileAhead}%</strong> of students
          </p>
        </div>

        <HeroCompanyChips variant={variant} onChipClick={handleInteract} />
      </div>

      <div className="mm-hero-score-pr-stats">
        <motion.button
          type="button"
          className="mm-hero-score-stat mm-hero-score-stat--rank"
          aria-label={`Your rank ${rank} out of ${totalStudents} students. Click to refresh live count.`}
          onClick={handleInteract}
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        >
          <p className="mm-hero-score-stat__label">Your Rank</p>
          <div className="mm-hero-score-stat__row">
            <span className="mm-hero-score-stat__icon mm-hero-score-stat__icon--rank">
              <Trophy size={16} strokeWidth={2.25} aria-hidden />
            </span>
            <div className="mm-hero-score-stat__body">
              <motion.p
                key={rank}
                className="mm-hero-score-stat__value"
                initial={reduceMotion ? false : { opacity: 0.6, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                #{rank}
              </motion.p>
              <motion.p
                key={totalStudents}
                className="mm-hero-score-stat__sub"
                initial={reduceMotion ? false : { opacity: 0.6, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                Out of {totalStudents.toLocaleString('en-IN')} students
              </motion.p>
            </div>
          </div>
        </motion.button>

        <div className="mm-hero-score-stat mm-hero-score-stat--gap" aria-live="polite">
          <p className="mm-hero-score-stat__label">Biggest Gap</p>
          <div className="mm-hero-score-stat__row">
            <span className="mm-hero-score-stat__icon mm-hero-score-stat__icon--gap">
              <Code2 size={16} strokeWidth={2.25} aria-hidden />
            </span>
            <div className="mm-hero-score-stat__body mm-hero-score-stat__body--gap">
              <div className="mm-hero-score-gap-value-wrap">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={activeGap.id}
                    className="mm-hero-score-stat__value mm-hero-score-stat__value--gap"
                    initial={reduceMotion ? false : { opacity: 0, y: 8, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -6, filter: 'blur(4px)' }}
                    transition={{ duration: 0.32, ease: HERO_EASE }}
                  >
                    {activeGap.displayName}
                  </motion.p>
                </AnimatePresence>
              </div>
              <p className="mm-hero-score-stat__action">Improve →</p>
            </div>
          </div>
        </div>

        <div className="mm-hero-score-stat">
          <p className="mm-hero-score-stat__label">Estimated Readiness</p>
          <div className="mm-hero-score-stat__row">
            <span className="mm-hero-score-stat__icon mm-hero-score-stat__icon--ready">
              <Calendar size={16} strokeWidth={2.25} aria-hidden />
            </span>
            <div className="mm-hero-score-stat__body">
              <p className="mm-hero-score-stat__value">{estimatedWeeks} Weeks</p>
              <p className="mm-hero-score-stat__sub">Keep it up!</p>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 0.45 }}
      >
        <Link
          to="/free-tutorials"
          className="mm-hero-score-pr-banner"
          aria-label={`View free tutorials to improve ${activeGap.shortName} and unlock ${unlockNames}`}
        >
        <span className="mm-hero-score-pr-banner__icon">
          <Target size={18} strokeWidth={2.25} aria-hidden />
        </span>
        <div className="mm-hero-score-pr-banner__copy">
          <p className="mm-hero-score-pr-banner__lead">
            Improve <strong>{activeGap.shortName}</strong> by <strong>{improvePct}%</strong> to
            unlock {unlockNames} &amp; more
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={activeGap.id}
              className="mm-hero-score-pr-banner__sub"
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.28, ease: HERO_EASE }}
            >
              Focus on {focusLine}
            </motion.p>
          </AnimatePresence>
        </div>
        <ChevronRight size={18} className="mm-hero-score-pr-banner__chev" aria-hidden />
        </Link>
      </motion.div>
    </>
  );
}
