import { motion, useReducedMotion } from 'framer-motion';

/**
 * Scroll-triggered entrance — use on sections/cards sitewide.
 */
export default function FadeUp({
  children,
  delay = 0,
  className = '',
  y = 32,
  once = true,
  amount = 0.1,
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once, amount, margin: '0px 0px -48px 0px' }}
      transition={{ duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
