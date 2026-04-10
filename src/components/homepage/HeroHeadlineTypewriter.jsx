import { useState, useEffect } from 'react';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Rotating typewriter headline — types each phrase, pauses, deletes, next phrase.
 * @param {object} props
 * @param {string[]} props.phrases
 * @param {boolean} [props.reducedMotion]
 * @param {string} [props.className]
 */
export function HeroHeadlineTypewriter({ phrases, reducedMotion = false, className = '' }) {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!phrases?.length) return;
    if (reducedMotion) {
      setDisplayed(phrases[0]);
      return;
    }

    let cancelled = false;
    const TYPE_MS = 36;
    const DELETE_MS = 16;
    const PAUSE_TYPED_MS = 2400;
    const PAUSE_EMPTY_MS = 380;

    (async () => {
      while (!cancelled) {
        for (const target of phrases) {
          for (let i = 1; i <= target.length && !cancelled; i++) {
            setDisplayed(target.slice(0, i));
            await sleep(TYPE_MS);
          }
          if (cancelled) return;
          await sleep(PAUSE_TYPED_MS);
          for (let i = target.length - 1; i >= 0 && !cancelled; i--) {
            setDisplayed(target.slice(0, i));
            await sleep(DELETE_MS);
          }
          if (cancelled) return;
          await sleep(PAUSE_EMPTY_MS);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [phrases, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const id = setInterval(() => setShowCursor((c) => !c), 520);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <span className={className}>
      {displayed}
      <span
        className={`ml-0.5 inline-block h-[0.92em] w-[2px] translate-y-[0.08em] bg-[#FF9500] align-[-0.12em] ${
          showCursor ? 'opacity-100' : 'opacity-30'
        } transition-opacity duration-200`}
        aria-hidden
      />
    </span>
  );
}
