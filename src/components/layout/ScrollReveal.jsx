import { useEffect, useRef, useState } from 'react';

/**
 * Intersection-based reveal — Predis-style section entrance sitewide.
 */
export default function ScrollReveal({
  children,
  className = '',
  delayClass = '',
  scale = false,
  as: Tag = 'div',
  threshold = 0.12,
  rootMargin = '0px 0px -8% 0px',
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setVisible(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return (
    <Tag
      ref={ref}
      className={[
        'mm-scroll-reveal',
        scale ? 'mm-scroll-reveal--scale' : '',
        delayClass,
        visible ? 'mm-scroll-reveal--visible' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  );
}
