import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { STUDENT_JOURNEY_STAGES } from '../../constants/studentJourneyStages';
import StageCard from './StageCard';

export default function StudentJourneyTimeline({ reduceMotion }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <section ref={ref} className="relative">
      <div className="mm-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Your Journey</p>
          <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">
            The 7-Stage Pipeline
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Start with the free readiness check today—know your gaps before you burn a real round. 
            Build progressively through all 7 stages, from baseline to validation.
          </p>
        </motion.div>

        {/* Timeline - Relative positioned for SVG line */}
        <div className="relative">
          {/* SVG Connecting Line (desktop only) */}
          {!reduceMotion && (
            <svg
              className="pointer-events-none absolute left-0 top-0 hidden h-full w-full md:block"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(26, 143, 196)" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="rgb(42, 170, 138)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <motion.line
                x1="50%"
                y1="0"
                x2="50%"
                y2="100%"
                stroke="url(#timelineGradient)"
                strokeWidth="3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
            </svg>
          )}

          {/* Grid of Stage Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid gap-8 md:grid-cols-2 md:gap-10 relative z-10"
          >
            {STUDENT_JOURNEY_STAGES.map((stage, index) => (
              <StageCard key={stage.id} stage={stage} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
