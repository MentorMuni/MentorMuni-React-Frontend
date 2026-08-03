import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Info, TrendingUp } from 'lucide-react';

const BREAKDOWN = [
  { label: 'Aptitude', score: 45, weight: '20%' },
  { label: 'Technical skills', score: 52, weight: '25%' },
  { label: 'Communication', score: 38, weight: '20%' },
  { label: 'Interview craft', score: 48, weight: '25%' },
  { label: 'Projects', score: 61, weight: '10%' },
];

const R = 52;
const C = 2 * Math.PI * R;

export default function PlacementReadinessHero({
  currentReadiness = 47,
  previousReadiness = 41,
  targetReadiness = 85,
  estimatedDays = 38,
}) {
  const [open, setOpen] = useState(false);
  const delta = currentReadiness - previousReadiness;
  const offset = C - (currentReadiness / 100) * C;

  return (
    <section className="stu-readiness">
      <div className="stu-readiness__main">
        <div className="stu-readiness__lead">
          <p className="stu-readiness__eyebrow">
            Your placement readiness
            <span className="stu-tip" title="Weighted score across aptitude, skills, communication, interviews and projects.">
              <Info size={13} aria-hidden />
            </span>
          </p>

          <div className="stu-readiness__figure">
            <span className="stu-readiness__pct">{currentReadiness}</span>
            <span className="stu-readiness__unit">%</span>
            {delta !== 0 ? (
              <span className={`stu-delta${delta > 0 ? ' is-up' : ' is-down'}`}>
                <TrendingUp size={13} aria-hidden />
                {delta > 0 ? '+' : ''}
                {delta}% <em>vs last week</em>
              </span>
            ) : null}
          </div>

          <p className="stu-readiness__note">
            You&apos;re ahead of <strong>38%</strong> of students in your department.
          </p>

          <div className="stu-readiness__track" role="img" aria-label={`${currentReadiness} percent of the way to placement ready`}>
            <span className="stu-readiness__fill" style={{ width: `${currentReadiness}%` }} />
            <span
              className="stu-readiness__target-tick"
              style={{ left: `${targetReadiness}%` }}
              aria-hidden
            />
          </div>
          <div className="stu-readiness__scale">
            <span>Beginner</span>
            <span>Placement ready · {targetReadiness}%</span>
          </div>
        </div>

        <div className="stu-readiness__side">
          <div className="stu-ring">
            <svg viewBox="0 0 120 120" className="stu-ring__svg" aria-hidden>
              <circle className="stu-ring__bg" cx="60" cy="60" r={R} />
              {/* Final offset is declared; CSS only animates the sweep in,
                  so the ring reads correctly even if it never plays. */}
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

      <div className="stu-readiness__foot">
        <button
          className="stu-readiness__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          See how we calculated this
          <ChevronDown size={15} className={open ? 'is-flipped' : ''} aria-hidden />
        </button>
        <button className="stu-btn stu-btn--ghost-light">
          Improve my score
          <ArrowUpRight size={15} aria-hidden />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            className="stu-readiness__panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="stu-breakdown">
              {BREAKDOWN.map((row) => (
                <li key={row.label} className="stu-breakdown__row">
                  <span className="stu-breakdown__label">
                    {row.label}
                    <em>{row.weight}</em>
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
