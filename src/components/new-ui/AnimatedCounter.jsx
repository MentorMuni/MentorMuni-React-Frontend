import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';

function parseStatValue(raw) {
  const str = String(raw);
  const match = str.match(/^([~]?)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { prefix: '', value: 0, suffix: str, decimals: 0 };
  const [, prefix, num, suffix] = match;
  const decimals = num.includes('.') ? num.split('.')[1].length : 0;
  return { prefix, value: Number(num), suffix, decimals };
}

export default function AnimatedCounter({ value, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 18, mass: 0.8 });
  const parsed = parseStatValue(value);
  const display = useTransform(spring, (v) => {
    const num = parsed.decimals > 0 ? v.toFixed(parsed.decimals) : Math.round(v).toString();
    return `${parsed.prefix}${num}${parsed.suffix}`;
  });

  useEffect(() => {
    if (inView) motionVal.set(parsed.value);
  }, [inView, motionVal, parsed.value]);

  return (
    <motion.span ref={ref} className={className} style={{ opacity: inView ? 1 : 0.85 }}>
      <motion.span>{display}</motion.span>
    </motion.span>
  );
}
