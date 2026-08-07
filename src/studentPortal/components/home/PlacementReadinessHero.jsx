import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Info } from 'lucide-react';
import { MOTION } from '../../motion';

/**
 * The single place readiness is visualised.
 *
 * It previously carried a big number, a horizontal track with a target
 * tick, a Beginner→Ready scale, AND a progress ring — four renderings
 * of one value. The ring plus the figure stay; the track and scale
 * restated them and are gone.
 *
 * Kept at this path with this prop shape because CollegesPage embeds
 * it as marketing artwork — see src/components/CollegesPage.jsx.
 */

const R = 52;
const C = 2 * Math.PI * R;

export default function PlacementReadinessHero({
  currentReadiness = 0,
  previousReadiness = null,
  targetReadiness = 85,
  estimatedDays = 38,
  /** Readiness earned from today's tasks, so the number moves as work lands. */
  todayGain = 0,
  /** Where a student should be by now — omit until we have a real benchmark. */
  expectedByNow = null,
  weekLabel = 'baseline week',
  breakdown,
}) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  const live = Math.round((currentReadiness + todayGain) * 10) / 10;
  const hasDelta = previousReadiness != null && Number.isFinite(previousReadiness);
  const delta = hasDelta ? currentReadiness - previousReadiness : 0;
  const offset = C - (Math.min(100, Math.max(0, live)) / 100) * C;
  const hasExpected = expectedByNow != null && Number.isFinite(expectedByNow);
  const onTrack = hasExpected ? live >= expectedByNow : null;
  const rows = breakdown?.length ? breakdown : [];

  return (
    <section className="stu-readiness" aria-labelledby="stu-readiness-title">
      <div className="stu-readiness__main">
        <div className="stu-readiness__lead">
          <p className="stu-readiness__eyebrow" id="stu-readiness-title">
            Your placement readiness
            <span
              className="stu-tip"
              title="Weighted score across aptitude, skills, communication, interviews and projects."
            >
              <Info size={14} strokeWidth={2} aria-hidden focusable="false" />
            </span>
          </p>

          <p className="stu-readiness__figure">
            <span className="stu-readiness__pct">{live}</span>
            <span className="stu-readiness__unit">%</span>
            {hasDelta && delta !== 0 ? (
              <span className={`stu-delta${delta > 0 ? ' is-up' : ' is-down'}`}>
                {delta > 0 ? '+' : ''}
                {delta}% <em>vs last check-in</em>
              </span>
            ) : null}
          </p>

          {hasExpected ? (
            <p className={`stu-readiness__track-note${onTrack ? ' is-ok' : ' is-behind'}`}>
              {onTrack
                ? `On track — ${expectedByNow}% is typical by ${weekLabel}.`
                : `Slightly behind — ${expectedByNow}% is typical by ${weekLabel}.`}
            </p>
          ) : (
            <p className="stu-readiness__note">
              {live > 0
                ? `About ${Math.max(0, targetReadiness - Math.round(live))} points to the ${targetReadiness}% placement-ready mark · ${weekLabel}.`
                : 'Finish scored checks to build this readiness number.'}
            </p>
          )}
        </div>

        <div className="stu-readiness__side">
          <div
            className="stu-ring"
            role="img"
            aria-label={`${live} percent readiness against a ${targetReadiness} percent target`}
          >
            <svg viewBox="0 0 120 120" className="stu-ring__svg" aria-hidden focusable="false">
              <circle className="stu-ring__bg" cx="60" cy="60" r={R} />
              {/* Final offset is declared inline, and the sweep keyframe
                  has no fill-mode, so the ring reads the real value even
                  when the animation is skipped for reduced motion. */}
              <circle
                className="stu-ring__fg"
                cx="60"
                cy="60"
                r={R}
                strokeDasharray={C}
                strokeDashoffset={offset}
                style={{ '--ring-c': C }}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="stu-ring__center">
              <span className="stu-ring__value">{targetReadiness}%</span>
              <span className="stu-ring__label">target</span>
            </div>
          </div>

          <div className="stu-readiness__eta">
            <strong>{estimatedDays} days</strong>
            <span>at your current pace</span>
          </div>
        </div>
      </div>

      {rows.length ? (
        <ul className="stu-breakdown stu-breakdown--inline">
          {rows.map((row) => (
            <li key={row.label} className="stu-breakdown__row">
              <span className="stu-breakdown__label">{row.label}</span>
              <span className="stu-breakdown__track">
                <span
                  className="stu-breakdown__fill"
                  style={{ width: `${row.score}%` }}
                  data-tone={row.score >= 60 ? 'good' : row.score >= 45 ? 'mid' : 'low'}
                />
              </span>
              <span className="stu-breakdown__score">{row.score}%</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="stu-readiness__foot">
        <button
          type="button"
          className="stu-readiness__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          disabled={!rows.length}
        >
          How this is weighted
          <ChevronDown
            size={16}
            strokeWidth={2}
            className={open ? 'is-flipped' : ''}
            aria-hidden
            focusable="false"
          />
        </button>
        <button
          type="button"
          className="stu-btn stu-btn--on-dark"
          onClick={() =>
            document.getElementById('stu-today-zone')?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          Go to today’s step
          <ArrowUpRight size={16} strokeWidth={2} aria-hidden focusable="false" />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            className="stu-readiness__panel"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: MOTION.duration.base, ease: MOTION.ease }}
          >
            <ul className="stu-breakdown">
              {rows.map((row) => (
                <li key={row.label} className="stu-breakdown__row">
                  <span className="stu-breakdown__label">
                    {row.label}
                    {row.weight ? <em>{row.weight}</em> : null}
                  </span>
                  <span className="stu-breakdown__track">
                    <span
                      className="stu-breakdown__fill"
                      style={{ width: `${row.score}%` }}
                      data-tone={row.score >= 60 ? 'good' : row.score >= 45 ? 'mid' : 'low'}
                    />
                  </span>
                  <span className="stu-breakdown__score">{row.score}%</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
