import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { WHY_PAGE } from '../../constants/studentJourneyStages';

const ease = [0.22, 1, 0.36, 1];

export default function StudentJourneyHero({ reduceMotion }) {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.15 });

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: reduceMotion
        ? { duration: 0 }
        : { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const item = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduceMotion ? { duration: 0 } : { duration: 0.65, ease },
    },
  };

  return (
    <section
      ref={heroRef}
      className="why-mm-hero relative overflow-hidden border-b border-border"
    >
      {/* Full-bleed atmosphere */}
      <div className="pointer-events-none absolute inset-0 why-mm-hero__bg" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--pattern-dot-cool) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
        aria-hidden
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-28 top-[18%] h-[28rem] w-[28rem] rounded-full bg-[rgba(26,143,196,0.14)] blur-[110px]"
        animate={reduceMotion ? undefined : { x: [0, 22, 0], y: [0, 14, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-[12%] h-[22rem] w-[22rem] rounded-full bg-[rgba(42,170,138,0.12)] blur-[100px]"
        animate={reduceMotion ? undefined : { x: [0, -18, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[min(480px,65vh)] w-[min(920px,100vw)] -translate-x-1/2 bg-gradient-to-b from-[rgba(255,149,0,0.08)] to-transparent blur-[90px]"
        animate={reduceMotion ? undefined : { opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mm-container relative z-10 pb-14 pt-10 md:pb-16 md:pt-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate={heroInView ? 'visible' : 'hidden'}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p
            variants={item}
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:text-xs"
          >
            {WHY_PAGE.eyebrow}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-4 text-3xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] md:leading-[1.12]"
          >
            {WHY_PAGE.headline}
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {WHY_PAGE.sub}
          </motion.p>

          {/* Flow: how help shows up (replaces duplicate CTAs) */}
          <motion.div variants={item} className="mx-auto mt-10 max-w-3xl text-left">
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              {WHY_PAGE.flowLabel}
            </p>
            <ol className="mt-5 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {WHY_PAGE.flow.map((step, index) => (
                <motion.li
                  key={step.step}
                  className="relative rounded-2xl border border-border/80 bg-white/70 p-4 backdrop-blur-sm md:p-5"
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.2 + index * 0.08, ease }}
                >
                  <span className="text-[11px] font-bold tracking-[0.12em] text-primary/80">
                    {step.step}
                  </span>
                  <p className="mt-2 text-[15px] font-bold leading-snug text-foreground">
                    {step.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.help}
                  </p>
                  {index < WHY_PAGE.flow.length - 1 && (
                    <span
                      className="pointer-events-none absolute -right-2.5 top-1/2 hidden h-px w-5 -translate-y-1/2 bg-gradient-to-r from-primary/40 to-transparent sm:block"
                      aria-hidden
                    />
                  )}
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </motion.div>
      </div>

      {/* Soft bottom fade into next section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
        aria-hidden
      />
    </section>
  );
}
