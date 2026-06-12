import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HERO_SCORE_CARD_TITLE } from '../../constants/brandCopy';
import { HeroScoreCardContent } from './HeroScoreCardContent';

/** New UI hero score card — dark glass placement readiness layout */
export function NewUIHeroScoreCard({ className = '', preview, onIncrementStudentPool }) {
  const reduceMotion = useReducedMotion();
  const { score } = preview;

  return (
    <motion.div
      className={`mm-hero-score-root mm-hero-score-float mm-new-ui-score-widget ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{ opacity: 1 }}
    >
      <div className="mm-hero-score-aura" aria-hidden />

      <div className="mm-hero-score-border">
        <div
          className="mm-hero-score-panel mm-hero-score-panel--dark mm-new-ui-readiness-card mm-hero-score-panel--placement"
          role="img"
          aria-label={`${HERO_SCORE_CARD_TITLE}. Score: ${score} out of 100`}
        >
          <div className="relative">
            <HeroScoreCardContent
              preview={preview}
              variant="dark"
              onIncrementStudentPool={onIncrementStudentPool}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
