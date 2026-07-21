import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Check, Mail, MessageCircle, Phone } from 'lucide-react';

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

export default function FinalCTA({ reduceMotion }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-border bg-gradient-to-br from-primary/10 via-background to-cyan-500/5 py-24 md:py-32"
    >
      {/* Animated background elements */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]"
        animate={reduceMotion ? undefined : { x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-cyan-500/8 blur-[100px]"
        animate={reduceMotion ? undefined : { x: [0, -25, 0], y: [0, -15, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mm-container relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="max-w-3xl mx-auto text-center space-y-10"
        >
          {/* Headline */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-4xl font-extrabold leading-tight text-foreground sm:text-5xl md:text-6xl">
            Your Next Interview<br/>
            <span className="bg-gradient-to-r from-primary via-cyan-500 to-brand-teal bg-clip-text text-transparent">
              Starts Here
            </span>
            </h2>
          </motion.div>

          {/* Body Copy */}
          <motion.p
            variants={itemVariants}
            className="text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            Stop guessing. Get your score, see your gaps, practice under real pressure. Walk in confident.
          </motion.p>

          {/* Primary CTA */}
          <motion.div variants={itemVariants} className="pt-4">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-primary to-cyan-500 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-[0_20px_60px_rgba(26,143,196,0.3)] transition-all hover:shadow-2xl hover:shadow-[0_24px_72px_rgba(26,143,196,0.4)] hover:-translate-y-1"
            >
              Take the Free Readiness Check Now
              <ArrowRight size={20} />
            </button>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div variants={itemVariants}>
            <button className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-8 py-3 font-semibold text-foreground transition-all hover:bg-secondary">
              Download Success Metrics PDF
            </button>
          </motion.div>

          {/* Trust Markers */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-6 border-t border-border/30 pt-10 sm:flex-row sm:justify-center"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check size={16} className="text-emerald-500" />
              50+ colleges
            </div>
            <div className="hidden h-1 w-1 rounded-full bg-border/50 sm:block" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check size={16} className="text-emerald-500" />
              5,000+ students
            </div>
            <div className="hidden h-1 w-1 rounded-full bg-border/50 sm:block" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check size={16} className="text-emerald-500" />
              42% improvement
            </div>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="relative rounded-2xl border border-border/30 bg-white/40 p-8 backdrop-blur-sm md:p-10"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
              Questions? Get in touch
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Email */}
              <motion.a
                href="mailto:enroll@mentormuni.com"
                variants={itemVariants}
                className="group flex flex-col items-center gap-3 rounded-lg border border-border/40 bg-gradient-to-br from-white/50 to-primary/2 p-4 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <Mail size={24} className="text-primary transition-transform group-hover:scale-110" />
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Email
                  </p>
                  <p className="mt-1 font-semibold text-foreground text-sm">
                    enroll@mentormuni.com
                  </p>
                </div>
              </motion.a>

              {/* WhatsApp */}
              <motion.a
                href="https://wa.me/919009355103?text=Hi%20MentorMuni%20—%20I%20have%20a%20question%20about%20college%20partnerships."
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                className="group flex flex-col items-center gap-3 rounded-lg border border-border/40 bg-gradient-to-br from-white/50 to-cyan-500/2 p-4 transition-all hover:border-cyan-500/30 hover:shadow-md"
              >
                <MessageCircle size={24} className="text-cyan-600 transition-transform group-hover:scale-110" />
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    WhatsApp
                  </p>
                  <p className="mt-1 font-semibold text-foreground text-sm">+91 90093 55103</p>
                </div>
              </motion.a>

              {/* Phone */}
              <motion.a
                href="tel:+919009355103"
                variants={itemVariants}
                className="group flex flex-col items-center gap-3 rounded-lg border border-border/40 bg-gradient-to-br from-white/50 to-green-500/2 p-4 transition-all hover:border-green-500/30 hover:shadow-md"
              >
                <Phone size={24} className="text-green-600 transition-transform group-hover:scale-110" />
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Call
                  </p>
                  <p className="mt-1 font-semibold text-foreground text-sm">+91 90093 55103</p>
                </div>
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
