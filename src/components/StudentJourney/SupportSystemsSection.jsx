import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import * as Icons from 'lucide-react';
import { SUPPORT_SYSTEMS } from '../../constants/studentJourneyStages';
import { Check } from 'lucide-react';

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

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function SupportSystemsSection({ reduceMotion }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="mm-band mm-marketing-section border-t border-border bg-white">
      <div className="mm-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Support Systems</p>
          <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">
            Never Prepare Alone
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground mx-auto">
            AI assistance, progress tracking, and institution-wide insights—all designed to keep you accountable and on track.
          </p>
        </motion.div>

        {/* Support Systems Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid gap-8 md:grid-cols-3"
        >
          {SUPPORT_SYSTEMS.map((system) => {
            const IconComponent = Icons[system.icon];
            return (
              <motion.article
                key={system.id}
                variants={cardVariants}
                className="group relative overflow-hidden rounded-2xl border border-border/50 transition-all hover:border-border hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.9), ${system.bgColor})`,
                }}
              >
                {/* Animated background blob */}
                <motion.div
                  aria-hidden
                  className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${system.color} opacity-5 blur-2xl transition-all group-hover:opacity-10`}
                />

                <div className="relative space-y-6 p-6 md:p-8">
                  {/* Icon */}
                  <motion.div
                    whileHover={reduceMotion ? undefined : { scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${system.color} text-white shadow-lg`}
                  >
                    <IconComponent size={28} strokeWidth={1.5} />
                  </motion.div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-extrabold text-foreground">{system.title}</h3>
                    <p className="text-lg font-semibold leading-tight text-primary">{system.subtitle}</p>
                  </div>

                  {/* Benefits List */}
                  <ul className="space-y-3 border-t border-border/30 pt-4">
                    {system.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <Check
                          size={18}
                          className="mt-0.5 shrink-0 text-primary"
                          strokeWidth={2.5}
                        />
                        <span className="text-sm leading-snug text-muted-foreground">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Pricing Note */}
                  <div className="rounded-lg bg-secondary/40 px-3 py-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-foreground/70">
                      {system.pricingNote}
                    </p>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    boxShadow: `inset 0 0 30px -15px rgba(26, 143, 196, 0.15)`,
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
