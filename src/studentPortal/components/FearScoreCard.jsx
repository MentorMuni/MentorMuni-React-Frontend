import { useEffect } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { fearWeightLabel } from '../knowMe/planUtils';
import { MOTION } from '../motion';

const SAMPLE_POINTS = [
  { label: 'Interview blank', pts: 3 },
  { label: 'Everyone else has projects', pts: 2 },
  { label: 'Family WhatsApp', pts: 2 },
  { label: 'DSA freeze', pts: 1 },
];

const SCALE = [
  { at: 0, label: '0' },
  { at: 3, label: '3' },
  { at: 6, label: '6' },
  { at: 10, label: '10' },
];

export default function FearScoreCard({ score = null }) {
  const reduce = useReducedMotion();
  const live = Number.isFinite(Number(score)) ? Math.max(0, Math.min(10, Number(score))) : null;
  const shown = live ?? 8;
  const value = useMotionValue(reduce ? shown : 0);
  const display = useTransform(value, (v) => String(Math.round(v)));
  const marker = `${(shown / 10) * 100}%`;

  useEffect(() => {
    if (reduce) {
      value.set(shown);
      return undefined;
    }
    const controls = animate(value, shown, { duration: 1.1, ease: MOTION.ease });
    return () => controls.stop();
  }, [reduce, shown, value]);

  return (
    <aside className="ftf-scorecard" aria-label="What a fear score is">
      <p className="ftf-scorecard__kicker">{live != null ? 'Your fear score' : 'What is a fear score?'}</p>
      <div className="ftf-scorecard__hero">
        <p className="ftf-scorecard__figure">
          <motion.strong>{display}</motion.strong>
          <span>/10</span>
        </p>
        <p className="ftf-scorecard__mood">{fearWeightLabel(shown)}</p>
      </div>

      <div
        className="ftf-scorecard__scale"
        role="img"
        aria-label={`Fear score ${shown} out of 10. 0 is fearless, 10 is stuck.`}
      >
        <span className="ftf-scorecard__track" aria-hidden>
          <span className="ftf-scorecard__fill" style={{ width: marker }} />
          <span className="ftf-scorecard__knob" style={{ left: marker }} />
        </span>
        <span className="ftf-scorecard__ticks">
          {SCALE.map((tick) => (
            <span key={tick.at}>{tick.label}</span>
          ))}
        </span>
        <span className="ftf-scorecard__ends">
          <span>Fearless</span>
          <span>Stuck</span>
        </span>
      </div>

      <p className="ftf-scorecard__why">
        {live != null
          ? 'This number is the weight of your placement fear. Mocks pull it toward 0.'
          : 'The check-in turns the spiral into points. Example of a heavy week:'}
      </p>

      {live == null ? (
        <ul className="ftf-scorecard__points">
          {SAMPLE_POINTS.map((row, i) => (
            <li key={row.label}>
              <span>{row.label}</span>
              <span className="ftf-scorecard__bar" aria-hidden>
                <motion.i
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: MOTION.duration.slow, ease: MOTION.ease, delay: 0.15 + i * 0.08 }}
                  style={{ width: `${(row.pts / 10) * 100}%` }}
                />
              </span>
              <b>+{row.pts}</b>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="ftf-scorecard__sum">
        {live == null ? 'Those points add up to 8/10. Your number will be yours.' : 'Open progress anytime to see this move.'}
      </p>
    </aside>
  );
}
