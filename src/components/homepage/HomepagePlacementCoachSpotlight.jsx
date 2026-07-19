import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Headphones, Play, ArrowRight } from 'lucide-react';
import ScrollReveal from '../layout/ScrollReveal';
import './homepage-placement-coach.css';

const MODES = ['Full live round', 'Any skill dive', 'Project walkthrough'];

/**
 * Homepage product spotlight — AI 24×7 Voice Placement Coach.
 * Sits directly under the hero.
 */
export function HomepagePlacementCoachSpotlight() {
  const reduceMotion = useReducedMotion();

  return (
    <ScrollReveal
      as="section"
      className="mm-voice-home mm-band border-t border-border"
      aria-labelledby="home-placement-coach-heading"
    >
      <div className="mm-voice-home__glow" aria-hidden />
      <div className="mm-container relative z-10">
        <div className="mm-voice-home__grid">
          <motion.div
            className="mm-voice-home__copy"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mm-voice-home__kicker">
              <Headphones className="h-3.5 w-3.5" aria-hidden />
              New · AI 24×7
            </p>

            <h2 id="home-placement-coach-heading" className="mm-voice-home__title">
              Placement Coach
            </h2>

            <p className="mm-voice-home__lede">
              Speak like the offer depends on it — live technical, skill, and project rounds scored
              with a study plan before your next campus drive.
            </p>

            <div className="mm-voice-home__modes" aria-label="Interview modes">
              {MODES.map((mode) => (
                <span key={mode} className="mm-voice-home__mode">
                  {mode}
                </span>
              ))}
            </div>

            <div className="mm-voice-home__cta">
              <Link to="/voice-interview-coach" className="mm-voice-home__btn">
                <Play className="h-4 w-4" fill="currentColor" aria-hidden />
                Start a voice round
              </Link>
              <Link to="/voice-interview-coach" className="mm-voice-home__link">
                See how it works
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="mm-voice-home__stage"
            aria-hidden
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          >
            <div className={`mm-voice-home__orb ${reduceMotion ? '' : 'mm-voice-home__orb--live'}`}>
              <div className="mm-voice-home__wave">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
            <p className="mm-voice-home__stage-label">
              Live Mock interview
              <br />
              instant feedback
            </p>
          </motion.div>
        </div>
      </div>
    </ScrollReveal>
  );
}
