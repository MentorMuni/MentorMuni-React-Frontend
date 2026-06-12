import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { HERO_TARGET_COMPANY_ROWS } from '../../utils/heroScorePreview';
import { HERO_EASE } from './heroMotion';

/**
 * Interactive company target chips — name-only, tactile hover/focus UX.
 */
export function HeroCompanyChips({ variant = 'light', onChipClick }) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(null);
  const flatIndex = (rowIndex, index) =>
    HERO_TARGET_COMPANY_ROWS.slice(0, rowIndex).reduce((sum, row) => sum + row.length, 0) + index;

  return (
    <div
      className={`mm-hero-score-companies${variant === 'dark' ? ' mm-hero-score-companies--dark' : ''}`}
    >
      <p className="mm-hero-score-companies__label">Companies you can target</p>

      <div className="mm-hero-score-companies__rows" role="list" aria-label="Target companies">
        {HERO_TARGET_COMPANY_ROWS.map((row, rowIndex) => (
          <div
            key={`company-row-${rowIndex}`}
            className={`mm-hero-score-companies__row${row.length < 3 ? ' mm-hero-score-companies__row--pair' : ''}`}
            role="presentation"
          >
            {row.map((company, index) => {
              const isActive = activeId === company.id;
              const delay = 0.38 + flatIndex(rowIndex, index) * 0.07;

              return (
                <motion.button
                  key={company.id}
                  type="button"
                  role="listitem"
                  className={`mm-hero-score-company-chip${isActive ? ' is-active' : ''}`}
                  aria-label={`${company.name} — placement target`}
                  aria-pressed={isActive}
                  onClick={() => onChipClick?.()}
                  onMouseEnter={() => setActiveId(company.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onFocus={() => setActiveId(company.id)}
                  onBlur={() => setActiveId(null)}
                  initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay, duration: 0.4, ease: HERO_EASE }}
                  whileHover={reduceMotion ? undefined : { y: -2, scale: 1.03 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                >
                  <span className="mm-hero-score-company-chip__text">{company.name}</span>
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      <motion.button
        type="button"
        className="mm-hero-score-company-chip mm-hero-score-company-chip--more"
        aria-label="Many more companies available after your readiness check"
        onClick={() => onChipClick?.()}
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.78, duration: 0.4, ease: HERO_EASE }}
        whileHover={reduceMotion ? undefined : { y: -1, scale: 1.01 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      >
        <Sparkles size={11} strokeWidth={2.25} aria-hidden />
        <span>+ many more companies</span>
      </motion.button>
    </div>
  );
}
