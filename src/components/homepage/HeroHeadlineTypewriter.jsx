import { useEffect, useMemo, useState } from 'react';

/**
 * Rotating typewriter headline — types each phrase, pauses, deletes, next phrase.
 * @param {object} props
 * @param {string[]} props.phrases
 * @param {boolean} [props.reducedMotion]
 * @param {string} [props.className]
 */
export function HeroHeadlineTypewriter({ phrases, reducedMotion = false, className = '' }) {
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

  const currentPhrase = safePhrases[phraseIndex] ?? '';
  const displayed = reducedMotion ? currentPhrase : currentPhrase.slice(0, charIndex);

  return (
    <span className={`${className} inline-flex items-end`}>
      <span>{displayed}</span>
      <span
        className={`ml-0.5 inline-block h-[0.92em] w-[2px] translate-y-[0.08em] bg-[#1A8FC4] align-[-0.12em] ${
          showCursor ? 'opacity-100' : 'opacity-30'
        } transition-opacity duration-200`}
        aria-hidden
      />
    </span>
  );
}
