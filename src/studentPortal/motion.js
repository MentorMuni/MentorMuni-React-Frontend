/**
 * Motion constants for the student portal.
 *
 * SOURCE OF TRUTH. The `--ease`, `--ease-out` and `--dur-*` custom
 * properties in styles/tokens.css mirror these values by hand — if you
 * change a number here, change it there too. CSS cannot read a JS
 * object, and framer-motion cannot read a custom property, so one of
 * the two has to be the copy; this is the original.
 *
 *   --ease      = MOTION.ease
 *   --ease-out  = MOTION.easeOut
 *   --dur-fast  = MOTION.duration.fast   (180ms)
 *   --dur-base  = MOTION.duration.base   (320ms)
 *   --dur-slow  = MOTION.duration.slow   (480ms)
 *
 * Both helpers below return `{}` under reduced motion, which removes
 * the initial/animate pair entirely rather than animating to the same
 * value — content renders at its final state immediately.
 */

export const MOTION = {
  ease: [0.22, 1, 0.36, 1],
  easeOut: [0.16, 1, 0.3, 1],
  duration: {
    fast: 0.18,
    base: 0.32,
    slow: 0.48,
    /** Meters and rings run longer so the fill reads as a measurement. */
    meter: 0.64,
  },
  stagger: 0.06,
  revealY: 12,
};

/** Scroll-triggered reveal, once per element. */
export function revealProps(reduce, delay = 0) {
  if (reduce) return {};
  return {
    initial: { opacity: 0, y: MOTION.revealY },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-48px' },
    transition: { duration: MOTION.duration.base, ease: MOTION.ease, delay },
  };
}

/** Mount fade-and-rise, for content already above the fold. */
export function enterProps(reduce, delay = 0) {
  if (reduce) return {};
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: MOTION.duration.base, ease: MOTION.ease, delay },
  };
}
