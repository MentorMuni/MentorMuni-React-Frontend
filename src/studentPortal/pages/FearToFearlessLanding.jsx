import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, LineChart, Lock } from 'lucide-react';
import FearFactorMeter from '../components/FearFactorMeter';
import FearScoreCard from '../components/FearScoreCard';
import FearScoreJourney from '../components/FearScoreJourney';
import { MOTION, enterProps } from '../motion';
import '../styles/fear-to-fearless-landing.css';

const FEARS = [
  'I blank in the interview',
  'Everyone else has projects',
  'DSA freeze',
  'Family keeps asking',
  '“Tell me about yourself”',
  'I don’t belong in this drive',
];

export default function FearToFearlessLanding({
  onStartJourney,
  onViewProgress,
  onOpenPlan,
  onOpenHistory,
  loading = false,
  error = '',
  active = null,
}) {
  const reduce = useReducedMotion();
  const [liveFear, setLiveFear] = useState(0);
  const locked = Boolean(active?.locked);
  const hasPlan = Boolean(active?.checkin_id && (active?.phase === 'plan' || active?.phase === 'unlocked'));
  const inForm = active?.phase === 'form';
  const history = active?.history || [];
  const older = history.filter((h) => h.checkin_id !== active?.checkin_id);

  useEffect(() => {
    if (reduce || hasPlan) return undefined;
    const id = window.setInterval(() => {
      setLiveFear((i) => (i + 1) % FEARS.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, [hasPlan, reduce]);

  const ctaLabel = hasPlan
    ? loading
      ? 'Opening…'
      : 'Open my plan'
    : loading
      ? 'Starting…'
      : inForm
        ? 'Continue check-in'
        : 'Try it once';

  const ctaSub = hasPlan
    ? locked
      ? `${active.days_remaining} day${active.days_remaining === 1 ? '' : 's'} left on this plan`
      : 'Pick up where you left the mocks'
    : '6 minutes. Private. Then a plan to beat placement fear.';

  return (
    <div className="ftf-landing">
      <header className="ftf-landing__hero">
        <div className="ftf-landing__copy">
          <motion.p className="ftf-landing__badge" {...enterProps(reduce, 0)}>
            <span className="ftf-landing__live" aria-hidden />
            Private · TPO and HOD never see this
          </motion.p>
          <motion.h1 className="ftf-landing__title" {...enterProps(reduce, 0.06)}>
            Fear <span className="ftf-landing__to" aria-hidden>→</span> Fearless
          </motion.h1>
          <motion.p className="ftf-landing__punch" {...enterProps(reduce, 0.12)}>
            That 3am spiral before the drive?
            <br />
            We built a 6-week plan for it.
          </motion.p>
          <motion.p className="ftf-landing__lead" {...enterProps(reduce, 0.18)}>
            Blank in HR. Compare yourself to the person with four projects.
            Family WhatsApp. You do not have to “just be confident.” Name it once.
            Show up to the mocks. Watch the fear score fall to 0.
          </motion.p>

          <motion.div className="ftf-landing__actions" {...enterProps(reduce, 0.24)}>
            {error ? (
              <p className="ftf-landing__error" role="alert">
                {error}
              </p>
            ) : null}
            <div className="ftf-landing__btns">
              <motion.button
                type="button"
                className="ftf-landing__cta"
                onClick={hasPlan ? onOpenPlan : onStartJourney}
                disabled={loading}
                whileHover={reduce || loading ? undefined : { y: -2 }}
                whileTap={reduce || loading ? undefined : { scale: 0.98 }}
                transition={{ duration: MOTION.duration.fast, ease: MOTION.ease }}
              >
                {ctaLabel}
                {!loading ? <ArrowRight size={18} strokeWidth={2.4} aria-hidden /> : null}
              </motion.button>
              <motion.button
                type="button"
                className="ftf-landing__cta ftf-landing__cta--progress"
                onClick={onViewProgress}
                whileHover={reduce ? undefined : { y: -2 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
                transition={{ duration: MOTION.duration.fast, ease: MOTION.ease }}
              >
                <LineChart size={18} strokeWidth={2.4} aria-hidden />
                View my progress
              </motion.button>
            </div>
            <p className="ftf-landing__cta-hint">{ctaSub}</p>
            {hasPlan && !locked ? (
              <div className="ftf-landing__links">
                <button type="button" className="ftf-landing__link" onClick={onStartJourney}>
                  Start a new check-in
                </button>
              </div>
            ) : null}
          </motion.div>
        </div>

        <motion.div {...enterProps(reduce, 0.16)}>
          <FearScoreCard score={active?.fear_factor} />
        </motion.div>
      </header>

      {hasPlan ? (
        <motion.div className="ftf-landing__panel" {...enterProps(reduce, 0.28)}>
          <FearFactorMeter
            current={active.fear_factor}
            initial={active.fear_factor_initial}
            daysRemaining={locked ? active.days_remaining : 0}
            lockDays={active.lock_days || 15}
          />
          <p className="ftf-landing__note">
            {locked
              ? `A new check-in unlocks in ${active.days_remaining} day${
                  active.days_remaining === 1 ? '' : 's'
                }. Aptitude, skill, interview, and HR mocks are how this number drops.`
              : 'Your 15-day window is open again. Start a new check-in, or keep working the last plan.'}
          </p>
        </motion.div>
      ) : (
        <>
          <FearScoreJourney />

          <div className="ftf-landing__if">
            <h2>If this is you</h2>
            <ul className="ftf-landing__fears">
              <AnimatePresence mode="sync">
                {FEARS.map((fear, i) => (
                  <motion.li
                    key={fear}
                    className={i === liveFear ? 'is-live' : ''}
                    {...enterProps(reduce, 0.08 + i * 0.04)}
                    animate={
                      reduce
                        ? undefined
                        : { opacity: 1, y: 0, scale: i === liveFear ? 1.03 : 1 }
                    }
                  >
                    {fear}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </>
      )}

      <p className="ftf-landing__privacy">
        <Lock size={13} strokeWidth={2.2} aria-hidden />
        Your answers stay between you and this space. Classmates never see them.
      </p>

      {older.length > 0 ? (
        <section className="ftf-landing__history">
          <h2>Earlier plans</h2>
          <ul>
            {older.slice(0, 5).map((item) => (
              <li key={item.checkin_id}>
                <button type="button" onClick={() => onOpenHistory?.(item.checkin_id)}>
                  <span>{item.headline}</span>
                  <span>
                    Fear {item.fear_factor ?? '—'}/10
                    {item.completed_at ? ` · ${String(item.completed_at).slice(0, 10)}` : ''}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
