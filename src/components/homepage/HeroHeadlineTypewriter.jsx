import { useEffect, useMemo, useState } from 'react';

/**
 * Rotating typewriter headline — types each phrase, pauses, deletes, next phrase.
 * @param {object} props
 * @param {string[]} props.phrases
 * @param {boolean} [props.reducedMotion]
 * @param {string} [props.className]
 * @param {string} [props.cursorClassName]
 */
export function HeroHeadlineTypewriter({
  phrases,
  reducedMotion = false,
  className = '',
  cursorClassName = 'bg-[#1A8FC4]',
}) {
  const safePhrases = useMemo(() => (Array.isArray(phrases) ? phrases.filter(Boolean) : []), [phrases]);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!safePhrases.length) return;
    if (reducedMotion) {
      setPhraseIndex(0);
      setCharIndex(safePhrases[0].length);
      return;
    }

    const current = safePhrases[phraseIndex] ?? '';
    const isDoneTyping = charIndex >= current.length;

    const timeout = window.setTimeout(
      () => {
        if (isDoneTyping) {
          setPhraseIndex((prev) => (prev + 1) % safePhrases.length);
          setCharIndex(0);
          return;
        }
        setCharIndex((prev) => prev + 1);
      },
      isDoneTyping ? 1700 : 38
    );

    return () => window.clearTimeout(timeout);
  }, [charIndex, phraseIndex, safePhrases, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const id = setInterval(() => setShowCursor((c) => !c), 520);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const reservePhrase = useMemo(() => {
    if (!safePhrases.length) return '';
    return safePhrases.reduce((longest, phrase) => (phrase.length > longest.length ? phrase : longest));
  }, [safePhrases]);

  const currentPhrase = safePhrases[phraseIndex] ?? '';
  const displayed = reducedMotion ? currentPhrase : currentPhrase.slice(0, charIndex);

  return (
    <span className="mm-hero-typewriter-inner" aria-live="polite">
      {/* Locks height to the tallest phrase so typing does not shift layout */}
      <span className={`${className} mm-hero-typewriter-line--reserve`} aria-hidden>
        {reservePhrase}
      </span>
      <span className={`${className} mm-hero-typewriter-line--active`}>
        <span className="mm-hero-typewriter-text">{displayed}</span>
        <span
          className={`mm-hero-typewriter-cursor ${cursorClassName} ${
            showCursor ? 'opacity-100' : 'opacity-30'
          }`}
          aria-hidden
        />
      </span>
    </span>
  );
}
