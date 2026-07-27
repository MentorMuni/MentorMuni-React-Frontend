import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Mail, MessageCircle, Phone } from 'lucide-react';
import { goToStartAssessment } from '../../utils/startAssessmentNavigation';
import { FINAL_CTA } from '../../constants/studentJourneyStages';

const ease = [0.22, 1, 0.36, 1];

export default function FinalCTA({ reduceMotion }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

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
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduceMotion ? { duration: 0 } : { duration: 0.55, ease },
    },
  };

  return (
    <section
      ref={ref}
      className="why-mm-final relative overflow-hidden border-t border-border py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 why-mm-final__bg" aria-hidden />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-primary/15 blur-[110px]"
        animate={reduceMotion ? undefined : { x: [0, 24, 0], y: [0, 16, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-1/4 h-72 w-72 rounded-full bg-brand-teal/12 blur-[100px]"
        animate={reduceMotion ? undefined : { x: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mm-container relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.h2
            variants={item}
            className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            {FINAL_CTA.headline}
          </motion.h2>

          <motion.p
            variants={item}
            className="mt-5 text-lg leading-relaxed text-muted-foreground"
          >
            {FINAL_CTA.sub}
          </motion.p>

          <motion.div variants={item} className="mt-10">
            <motion.button
              type="button"
              onClick={goToStartAssessment}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-brand-teal px-10 py-4 text-lg font-bold text-white shadow-[0_18px_48px_-14px_rgba(26,143,196,0.5)]"
              whileHover={reduceMotion ? undefined : { y: -3 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              {FINAL_CTA.primaryCta}
              <ArrowRight size={20} aria-hidden />
            </motion.button>
            <p className="mt-4 text-sm text-muted-foreground">{FINAL_CTA.note}</p>
          </motion.div>

          <motion.div variants={item} className="mt-14 border-t border-border/60 pt-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {FINAL_CTA.contactPrompt}
            </p>
            <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
              <a
                href="mailto:enroll@mentormuni.com"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white/70 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-white"
              >
                <Mail size={16} className="text-primary" aria-hidden />
                enroll@mentormuni.com
              </a>
              <a
                href="https://wa.me/919009355103?text=Hi%20MentorMuni%20%E2%80%94%20I%20am%20a%20student%20and%20want%20help%20getting%20interview-ready."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white/70 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-brand-teal/40 hover:bg-white"
              >
                <MessageCircle size={16} className="text-brand-teal" aria-hidden />
                WhatsApp
              </a>
              <a
                href="tel:+919009355103"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white/70 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-white"
              >
                <Phone size={16} className="text-primary" aria-hidden />
                +91 90093 55103
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
