import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import * as Icons from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function StageCard({ stage, index }) {
  const ref = useRef(null);
  const cardInView = useInView(ref, { once: true, margin: '-50px' });
  const IconComponent = Icons[stage.icon];

  // Alternate left/right for visual rhythm
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={cardInView ? 'visible' : 'hidden'}
      className={`relative ${isEven ? 'md:pr-4' : 'md:pl-4'}`}
      layout
    >
      {/* Card Container */}
      <motion.article
        className={`group relative h-full overflow-hidden rounded-2xl border transition-all duration-300 ${stage.borderColor} bg-white`}
        whileHover={{
          y: -4,
          boxShadow: '0 20px 60px -12px rgba(0,0,0,0.15)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Gradient accent background */}
        <div
          className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${stage.color} opacity-[0.08] blur-3xl`}
          aria-hidden
        />

        {/* Content */}
        <div className="relative space-y-5 p-6 md:p-7">
          {/* Header: Step number + Icon */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary/80">
                Stage {stage.step}
              </p>
              <h3 className="mt-2 text-xl font-extrabold leading-tight text-foreground md:text-2xl">
                {stage.title}
              </h3>
            </div>
            <motion.div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${stage.borderColor} ${stage.iconBg}`}
              whileHover={{ scale: 1.08, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <IconComponent size={22} strokeWidth={1.75} />
            </motion.div>
          </div>

          {/* Description (one-liner) */}
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {stage.description}
          </p>

          {/* Primary Outcome */}
          <div className="flex items-start gap-3 rounded-lg bg-white/40 p-3.5 backdrop-blur-sm md:p-4">
            <div className="mt-0.5 h-5 w-5 flex-shrink-0">
              <div className="h-full w-full rounded-full bg-gradient-to-br from-primary to-cyan-400" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">You Will Get</p>
              <p className="mt-1 font-semibold text-foreground">{stage.primaryOutcome}</p>
            </div>
          </div>

          {/* Duration Badge (mobile shows on tap, desktop on hover) */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-wrap gap-2">
              {stage.outcomes.slice(0, 2).map((outcome) => (
                <span
                  key={outcome}
                  className="inline-flex rounded-full bg-secondary/60 px-3 py-1 text-xs font-medium text-foreground"
                >
                  {outcome}
                </span>
              ))}
            </div>
            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {stage.duration}
            </span>
          </div>
        </div>

        {/* Hover border glow effect */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 shadow-inner transition-opacity group-hover:opacity-100"
          style={{
            boxShadow: `inset 0 0 20px -10px rgba(26, 143, 196, 0.2)`,
          }}
          aria-hidden
        />
      </motion.article>

      {/* Connection dots (desktop) */}
      {index < 6 && (
        <motion.div
          className="absolute left-1/2 hidden w-2 -translate-x-1/2 md:block"
          initial={{ opacity: 0, scale: 0 }}
          animate={cardInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="h-6 w-6 rounded-full border-2 border-primary/30 bg-white" />
        </motion.div>
      )}
    </motion.div>
  );
}
