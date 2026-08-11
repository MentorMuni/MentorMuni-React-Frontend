import { Fragment, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import { ArrowDown, ArrowRight, Check } from 'lucide-react';
import { MOTION } from '../motion';

const WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];

const ACTS = [
  {
    id: 'score',
    kicker: 'Right now',
    title: 'Fear score',
    blurb: 'How heavy the drive feels today. Not marks. Not CGPA.',
  },
  {
    id: 'plan',
    kicker: 'The work',
    title: 'Your plan',
    blurb: 'Six weeks of mocks aimed at that exact fear.',
  },
  {
    id: 'zero',
    kicker: 'The goal',
    title: 'Fear score 0',
    blurb: 'Same campus drive. You walk in lighter.',
  },
];

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const id = window.setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        window.clearTimeout(id);
        reject(new DOMException('aborted', 'AbortError'));
      },
      { once: true },
    );
  });
}

export default function FearScoreJourney() {
  const reduce = useReducedMotion();
  const score = useMotionValue(reduce ? 0 : 10);
  const label = useTransform(score, (v) => String(Math.round(v)));
  const goalRef = useRef(null);
  const celebrated = useRef(false);
  const [phase, setPhase] = useState(reduce ? 'zero' : 'score');
  const [weekLit, setWeekLit] = useState(reduce ? WEEKS.length : 0);
  const [pinned, setPinned] = useState(null);

  useEffect(() => {
    if (reduce || pinned) return undefined;
    const ac = new AbortController();
    let playback;

    async function run() {
      while (!ac.signal.aborted) {
        setPhase('score');
        setWeekLit(0);
        score.set(10);
        await wait(1400, ac.signal);

        setPhase('plan');
        playback = animate(score, 0, { duration: 2.1, ease: MOTION.ease });
        for (let i = 1; i <= WEEKS.length; i += 1) {
          setWeekLit(i);
          await wait(280, ac.signal);
        }
        await playback;
        if (ac.signal.aborted) return;

        setPhase('zero');
        if (!celebrated.current && goalRef.current) {
          celebrated.current = true;
          const node = goalRef.current;
          import('canvas-confetti').then(({ default: confetti }) => {
            const box = node.getBoundingClientRect();
            confetti({
              particleCount: 28,
              spread: 48,
              startVelocity: 24,
              scalar: 0.65,
              origin: {
                x: (box.left + box.width / 2) / window.innerWidth,
                y: (box.top + box.height / 2) / window.innerHeight,
              },
              colors: ['#34d385', '#5b52d6', '#e8a33d'],
            });
          });
        }
        await wait(1800, ac.signal);
      }
    }

    run().catch(() => {});
    return () => {
      ac.abort();
      playback?.stop();
    };
  }, [pinned, reduce, score]);

  function showAct(id) {
    setPinned(id);
    setPhase(id);
    if (id === 'score') {
      score.set(10);
      setWeekLit(0);
    } else if (id === 'plan') {
      score.set(5);
      setWeekLit(3);
    } else {
      score.set(0);
      setWeekLit(WEEKS.length);
    }
  }

  return (
    <section className="ftf-story" aria-labelledby="ftf-story-title">
      <div className="ftf-story__head">
        <p className="ftf-story__eyebrow">How it works</p>
        <h2 id="ftf-story-title">Fear score → plan → fear score 0</h2>
        <p>One private check-in. A plan built for your fear. Mocks that move the number.</p>
      </div>

      <div className={`ftf-story__board is-${phase}`}>
        {ACTS.map((act, i) => (
          <Fragment key={act.id}>
            {i > 0 ? (
              <div className={`ftf-story__arrow${phaseIndex(phase) >= i ? ' is-on' : ''}`} aria-hidden>
                <ArrowRight className="ftf-story__arrow-x" size={18} strokeWidth={2.4} />
                <ArrowDown className="ftf-story__arrow-y" size={18} strokeWidth={2.4} />
              </div>
            ) : null}

            <button
              type="button"
              className={`ftf-story__act is-${act.id}${phase === act.id ? ' is-on' : ''}`}
              onClick={() => showAct(act.id)}
              aria-pressed={phase === act.id}
              aria-label={`${act.kicker}: ${act.title}`}
            >
              <span className="ftf-story__kicker">{act.kicker}</span>
              <span className="ftf-story__name">{act.title}</span>

              <span className="ftf-story__stage" ref={act.id === 'zero' ? goalRef : undefined}>
                {act.id === 'plan' ? (
                  <ul className="ftf-story__weeks">
                    {WEEKS.map((week, wi) => (
                      <li key={week} className={wi < weekLit ? 'is-lit' : ''}>
                        {week}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {phase === act.id ? (
                  <motion.span
                    layoutId="ftf-live-score"
                    className={`ftf-story__chip is-${act.id}`}
                    transition={{ duration: MOTION.duration.slow, ease: MOTION.ease }}
                  >
                    {act.id === 'zero' ? (
                      <>
                        <strong>0</strong>
                        <em>/10</em>
                        <Check size={16} strokeWidth={2.6} aria-hidden />
                      </>
                    ) : (
                      <>
                        <motion.strong>{label}</motion.strong>
                        <em>/10</em>
                      </>
                    )}
                  </motion.span>
                ) : (
                  <span className="ftf-story__ghost" aria-hidden>
                    {act.id === 'score' ? '10/10' : act.id === 'zero' ? '0/10' : 'plan'}
                  </span>
                )}
              </span>

              <span className="ftf-story__blurb">{act.blurb}</span>
            </button>
          </Fragment>
        ))}
      </div>

      <div className="ftf-story__caption">
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: MOTION.duration.fast, ease: MOTION.ease }}
          >
            {phase === 'score'
              ? 'You start by naming the fear. That becomes a number from 0–10.'
              : phase === 'plan'
                ? 'The plan takes that number and aims mocks at it for 6 weeks.'
                : 'Do the mocks. The fear score drops to 0. That is fearless.'}
          </motion.p>
        </AnimatePresence>
        {pinned ? (
          <button type="button" className="ftf-story__replay" onClick={() => setPinned(null)}>
            Play the loop
          </button>
        ) : (
          <span>Tap a card to pause on that step</span>
        )}
      </div>
    </section>
  );
}

function phaseIndex(phase) {
  if (phase === 'plan') return 1;
  if (phase === 'zero') return 2;
  return 0;
}
