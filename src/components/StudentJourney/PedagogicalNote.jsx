import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PEDAGOGICAL_NOTE } from '../../constants/studentJourneyStages';
import { ArrowRight, Info } from 'lucide-react';

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

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function PedagogicalNote() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="mm-band mm-marketing-section border-t border-border bg-gradient-to-b from-background to-secondary/50">
      <div className="mm-container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="max-w-4xl space-y-12"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3">
              <Info size={24} className="text-primary" />
              <h2 className="text-2xl font-extrabold text-foreground md:text-3xl">
                {PEDAGOGICAL_NOTE.title}
              </h2>
            </div>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Understanding why this sequence matters helps you move through preparation with intention, not just activity.
            </p>
          </motion.div>

          {/* Three Phases Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid gap-6 md:grid-cols-3"
          >
            {PEDAGOGICAL_NOTE.sections.map((section, index) => (
              <motion.article
                key={section.stage}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-xl border border-border bg-white p-6 transition-all hover:shadow-lg hover:border-primary/30"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
                
                <div className="relative space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                      {index + 1}
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wide text-primary">
                      {section.stage}
                    </p>
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground">{section.label}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Advanced Path Card */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-cyan-500/5 p-6 md:p-8"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            
            <div className="relative space-y-3">
              <div className="flex items-center gap-2">
                <ArrowRight size={20} className="text-primary" />
                <h3 className="text-lg font-bold text-foreground">
                  {PEDAGOGICAL_NOTE.advancedPath.title}
                </h3>
              </div>
              <p className="text-base leading-relaxed text-muted-foreground">
                {PEDAGOGICAL_NOTE.advancedPath.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
