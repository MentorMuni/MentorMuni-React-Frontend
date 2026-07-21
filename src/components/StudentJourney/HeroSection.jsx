import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function StudentJourneyHero({ reduceMotion }) {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.12 });

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-background to-primary/8 pb-24 pt-32 md:pb-32 md:pt-40"
    >
      {/* Animated background elements */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[rgba(26,143,196,0.08)] blur-[120px]"
        animate={reduceMotion ? undefined : { x: [0, 24, 0], y: [0, 16, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-1/3 h-80 w-80 rounded-full bg-cyan-400/8 blur-[100px]"
        animate={reduceMotion ? undefined : { x: [0, -20, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mm-container relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={heroInView ? 'visible' : 'hidden'}
          className="flex flex-col items-center text-center"
        >
          {/* Eyebrow Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white/85 px-4 py-2 shadow-lg shadow-[0_8px_30px_-12px_rgba(26,143,196,0.12)] backdrop-blur-sm"
            whileHover={reduceMotion ? undefined : { scale: 1.03, y: -2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          >
            <motion.span
              animate={reduceMotion ? undefined : { scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-cyan-400"
            />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Your Interview Journey
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="mt-8 max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl tracking-tight"
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              The 7-Stage System
            </motion.span>
            <motion.span
              className="block bg-gradient-to-r from-primary via-cyan-500 to-brand-teal bg-clip-text text-transparent mt-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              That Transforms Lost Students Into Confident Performers
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            From anxiety & confusion → clarity & confidence → real offers.
            <motion.span
              className="block text-base mt-3 font-semibold text-primary"
              animate={reduceMotion ? undefined : { opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              ✨ Structured, measurable, proven.
            </motion.span>
          </motion.p>

          {/* Key Stat - Enhanced */}
          <motion.div
            variants={itemVariants}
            className="mt-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-white/60 to-primary/5 backdrop-blur-sm overflow-hidden"
          >
            <div className="px-8 py-6 md:py-8">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-primary/90 mb-3">
                  Proven Impact
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-3xl font-black text-primary">42%</p>
                    <p className="text-xs text-muted-foreground mt-1">Avg Score Improvement</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-3xl font-black text-cyan-600">85%</p>
                    <p className="text-xs text-muted-foreground mt-1">Placement Rate</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-3xl font-black text-brand-teal">7</p>
                    <p className="text-xs text-muted-foreground mt-1">Structured Stages</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
            {/* Animated border */}
            <motion.div
              className="h-1 bg-gradient-to-r from-primary via-cyan-500 to-brand-teal"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ transformOrigin: 'left' }}
              viewport={{ once: true }}
            />
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-cyan-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-[0_12px_40px_rgba(26,143,196,0.25)] transition-all hover:shadow-xl hover:shadow-[0_16px_48px_rgba(26,143,196,0.3)] sm:w-auto"
            >
              Start Free Readiness Check
              <ArrowRight size={18} />
            </button>
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-white px-8 py-4 text-base font-semibold text-foreground transition-colors hover:bg-secondary sm:w-auto"
            >
              See Your Roadmap
            </button>
          </motion.div>

          {/* Trust Markers */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-border pt-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Check size={16} className="text-emerald-500" />
              5,000+ students
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-emerald-500" />
              Free to start
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-emerald-500" />
              No signup needed
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
