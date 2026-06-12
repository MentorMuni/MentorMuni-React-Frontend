/** Shared Framer Motion variants — hero entrance (Linear / Vercel style) */
export const HERO_EASE = [0.22, 1, 0.36, 1];

export const heroStaggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.04,
    },
  },
};

export const heroReveal = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: 'blur(12px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.62,
      ease: HERO_EASE,
    },
  },
};

/** Lighter reveal for nested headline lines */
export const heroHeadlineLine = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.68,
      ease: HERO_EASE,
    },
  },
};

export const heroScoreEnter = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.9,
    rotateX: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.9,
      delay: 0.18,
      ease: HERO_EASE,
    },
  },
};
