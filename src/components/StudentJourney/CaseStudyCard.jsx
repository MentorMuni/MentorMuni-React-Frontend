import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { COLLEGE_SUCCESS_STORIES } from '../../constants/studentJourneyStages';
import { TrendingUp, Award, Users, Building2 } from 'lucide-react';

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function CaseStudyCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const story = COLLEGE_SUCCESS_STORIES[0]; // Show first case study

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="max-w-4xl mx-auto"
    >
      <motion.article
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-white via-primary/2 to-cyan-500/5 p-8 md:p-12"
      >
        {/* Animated background elements */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/8 blur-[100px]"
          animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/8 blur-[80px]"
          animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative space-y-8">
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-4 border-b border-primary/10 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Building2 size={24} className="text-primary" />
                <div>
                  <h3 className="text-2xl font-extrabold text-foreground md:text-3xl">
                    {story.collegeName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{story.location}</p>
                </div>
              </div>
              <div className="rounded-lg bg-primary/10 px-4 py-2">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">
                  {story.year}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Challenge & Solution */}
          <motion.div variants={containerVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="grid gap-8 md:grid-cols-2">
            {/* Challenge */}
            <motion.div variants={itemVariants} className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-primary/80">Challenge</p>
              <p className="text-base leading-relaxed text-muted-foreground">
                {story.challenge}
              </p>
            </motion.div>

            {/* Solution */}
            <motion.div variants={itemVariants} className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-600/80">What Happened</p>
              <p className="text-base leading-relaxed text-muted-foreground">
                {story.whatHappened}
              </p>
            </motion.div>
          </motion.div>

          {/* Metrics Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid gap-4 md:grid-cols-2 border-t border-primary/10 pt-8"
          >
            {story.metrics.map((metric) => (
              <motion.div
                key={metric.label}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-xl border border-border/40 bg-gradient-to-br from-white/40 to-primary/5 p-4 transition-all hover:shadow-md hover:border-primary/20"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20" />

                <div className="relative space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {metric.label}
                  </p>
                  {metric.change ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{metric.before}</span>
                        <div className="flex items-center gap-1 text-primary">
                          <TrendingUp size={14} />
                          <span className="text-xs font-bold">{metric.change}</span>
                        </div>
                        <span className="text-lg font-extrabold text-foreground">{metric.after}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-2xl font-extrabold text-foreground">{metric.value}</p>
                      {metric.note && (
                        <p className="text-xs text-muted-foreground">{metric.note}</p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quote */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-cyan-500/5 p-6 md:p-8"
          >
            <Award size={24} className="text-primary mb-4" />
            <p className="text-lg leading-relaxed text-foreground italic">
              "{story.quote}"
            </p>
            <footer className="mt-6 flex items-center gap-3 border-t border-primary/10 pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                {story.tpoName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-foreground">{story.tpoName}</p>
                <p className="text-xs text-muted-foreground">{story.tpoTitle}</p>
              </div>
            </footer>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-between"
          >
            <button className="inline-flex items-center justify-center rounded-lg bg-primary/10 px-6 py-3 font-semibold text-primary transition-all hover:bg-primary/20">
              View Full Case Study
            </button>
            <button className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:bg-primary/90">
              Download PDF Report
            </button>
          </motion.div>
        </div>
      </motion.article>
    </motion.div>
  );
}
