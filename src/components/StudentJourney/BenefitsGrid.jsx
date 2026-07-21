import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import * as Icons from 'lucide-react';
import { BENEFITS } from '../../constants/studentJourneyStages';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function BenefitsGrid({ reduceMotion }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="mm-band mm-marketing-section border-t border-border bg-gradient-to-b from-background/50 to-background">
      <div className="mm-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Why It Works</p>
          <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">
            A System, Not a Toolbox
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground mx-auto">
            Every component is designed to work together toward one outcome: measurable improvement.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid gap-8 md:grid-cols-3"
        >
          {BENEFITS.map((benefit) => {
            const IconComponent = Icons[benefit.icon];
            return (
              <motion.article
                key={benefit.id}
                variants={cardVariants}
                className="group relative overflow-hidden rounded-2xl border border-border bg-white p-8 transition-all hover:shadow-lg hover:border-primary/20"
              >
                {/* Gradient background blob */}
                <motion.div
                  aria-hidden
                  className={`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br ${benefit.color} opacity-[0.06] blur-3xl transition-all group-hover:opacity-[0.12]`}
                />

                <div className="relative space-y-4">
                  {/* Icon with gradient */}
                  <motion.div
                    whileHover={reduceMotion ? undefined : { scale: 1.12, rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${benefit.color} text-white shadow-lg`}
                  >
                    <IconComponent size={32} strokeWidth={1.5} />
                  </motion.div>

                  {/* Headline */}
                  <h3 className="text-lg font-extrabold leading-tight text-foreground">
                    {benefit.headline}
                  </h3>

                  {/* Body copy */}
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {benefit.body}
                  </p>
                </div>

                {/* Hover effect border */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    boxShadow: `inset 0 0 40px -20px rgba(26, 143, 196, 0.15)`,
                  }}
                  aria-hidden
                />
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
