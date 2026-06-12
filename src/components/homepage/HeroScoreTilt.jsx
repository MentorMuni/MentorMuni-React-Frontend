import { useCallback, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const MAX_TILT = 7;

/**
 * Subtle 3D tilt on pointer move — Stripe / Linear product-card feel.
 */
export function HeroScoreTilt({ children, className = '' }) {
  const rootRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const handleMove = useCallback(
    (event) => {
      if (reduceMotion || !rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      rootRef.current.style.setProperty('--mm-tilt-x', `${(-py * MAX_TILT).toFixed(2)}deg`);
      rootRef.current.style.setProperty('--mm-tilt-y', `${(px * MAX_TILT).toFixed(2)}deg`);
    },
    [reduceMotion],
  );

  const handleLeave = useCallback(() => {
    if (!rootRef.current) return;
    rootRef.current.style.setProperty('--mm-tilt-x', '0deg');
    rootRef.current.style.setProperty('--mm-tilt-y', '0deg');
  }, []);

  return (
    <div
      ref={rootRef}
      className={`mm-hero-score-tilt ${className}`.trim()}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}
