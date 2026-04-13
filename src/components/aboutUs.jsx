import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Target, Users, Sparkles, ArrowRight, Mail, BarChart3, Layers, Repeat2 } from 'lucide-react';
import { goToStartAssessment } from '../utils/startAssessmentNavigation';
import {
  MISSION_TAGLINE,
  ABOUT_SYSTEM_SECTION_TITLE,
  ABOUT_SYSTEM_SECTION_LEAD,
  ABOUT_SYSTEM_LOOPS,
  PRIMARY_CTA_LABEL,
  SECONDARY_CTA_BOOK_CALL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
} from '../constants/brandCopy';

const ABOUT_LOOP_ICONS = [BarChart3, Layers, Repeat2];

const easeOut = [0.22, 1, 0.36, 1];

function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : reduceMotion ? {} : { opacity: 0, y: 22 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

const PILLARS = [
  {
    Icon: Target,
    title: 'Why we exist',
    body:
      'Campus hiring rewards clarity under pressure — not just tutorials. MentorMuni exists to give engineering students a honest baseline, a plan, and reps before the real panel.',
  },
  {
    Icon: Users,
    title: 'Who we serve',
    body:
      'Final-year and early-career engineers preparing for tech placements, plus colleges that want batch-level readiness visibility — not vanity metrics.',
  },
  {
    Icon: Sparkles,
    title: 'How we work',
    body:
      'Readiness scoring, AI mock practice, and mentor-backed guidance stay connected: measure → fix → rehearse. No disconnected “courses only” path.',
  },
];

const AboutUs = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-background text-muted-foreground">
      <section
        className="relative overflow-hidden border-b border-border px-5 pb-16 pt-20 sm:px-6 md:pb-20 md:pt-24"
        aria-labelledby="about-hero-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(180,120,60,0.07) 1px, transparent 0)`,
            backgroundSize: '28px 28px',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-left">
          <motion.p
            className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#CC7000] sm:text-xs"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
          >
            About MentorMuni
          </motion.p>
          <motion.h1
            id="about-hero-heading"
            className="mb-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.35rem] md:leading-[1.15]"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.05, ease: easeOut }}
          >
            Interview readiness,{' '}
            <span className="bg-gradient-to-r from-[#FF9500] to-[#E88600] bg-clip-text text-transparent">
              built for real hiring
            </span>
          </motion.h1>
          <motion.p
            className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-[17px]"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.1, ease: easeOut }}
          >
            {MISSION_TAGLINE}
          </motion.p>
        </div>
      </section>

      <section
        className="border-t border-border bg-white px-5 py-14 sm:px-6 md:py-16"
        aria-labelledby="about-system-heading"
      >
        <div className="mx-auto max-w-5xl">
          <FadeUp className="text-left">
            <h2
              id="about-system-heading"
              className="text-xl font-bold tracking-tight text-foreground md:text-2xl"
            >
              {ABOUT_SYSTEM_SECTION_TITLE}
            </h2>
            <figure className="mt-6 rounded-2xl border border-[#FF9500]/25 bg-gradient-to-br from-[#FFF8EE] to-white p-5 shadow-[0_4px_24px_rgba(255,149,0,0.08)] md:p-6">
              <blockquote className="text-base font-semibold leading-relaxed text-foreground md:text-lg">
                <span className="text-[#CC7000]">“</span>
                {MISSION_TAGLINE}
                <span className="text-[#CC7000]">”</span>
              </blockquote>
              <figcaption className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Our positioning — one system, three loops
              </figcaption>
            </figure>
            <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              {ABOUT_SYSTEM_SECTION_LEAD}
            </p>
          </FadeUp>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {ABOUT_SYSTEM_LOOPS.map((loop, i) => {
              const Icon = ABOUT_LOOP_ICONS[i] ?? Sparkles;
              return (
                <FadeUp key={loop.title} delay={i * 0.07}>
                  <article className="flex h-full flex-col rounded-2xl border border-border bg-[#FAFAFA]/90 p-5 shadow-sm transition hover:border-[#FF9500]/35 hover:shadow-[0_8px_28px_rgba(255,149,0,0.1)] md:p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF4E0] text-[#CC7000]">
                      <Icon size={20} strokeWidth={2} aria-hidden />
                    </div>
                    <h3 className="mb-2 text-base font-bold text-foreground md:text-lg">{loop.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{loop.body}</p>
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-6 md:py-18" aria-labelledby="about-pillars-heading">
        <div className="mx-auto max-w-5xl">
          <FadeUp className="mb-10 max-w-2xl text-left">
            <h2 id="about-pillars-heading" className="text-xl font-bold text-foreground md:text-2xl">
              What we stand for
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              A small team obsessed with one outcome: you knowing where you stand — and what to do next — before placement
              season runs out.
            </p>
          </FadeUp>

          <div className="grid gap-6 md:grid-cols-3">
            {PILLARS.map((p, i) => {
              const Icon = p.Icon;
              return (
                <FadeUp key={p.title} delay={i * 0.06}>
                  <article className="h-full rounded-2xl border border-border bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF4E0] text-[#CC7000]">
                      <Icon size={22} strokeWidth={2} aria-hidden />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-foreground">{p.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-[#FFF8EE]/80 px-5 py-14 sm:px-6">
        <div className="mx-auto max-w-3xl text-left">
          <FadeUp>
            <h2 className="text-lg font-bold text-foreground md:text-xl">Talk to us</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Questions about mentorship, cohorts, or partnerships — we read every message.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link
                to="/contact"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,149,0,0.22)] transition hover:bg-[#E88600]"
              >
                <Mail size={18} aria-hidden />
                {SECONDARY_CTA_BOOK_CALL}
              </Link>
              <button
                type="button"
                onClick={goToStartAssessment}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border-2 border-[#FF9500]/70 bg-white px-6 py-3 text-sm font-bold text-[#EA580C] transition hover:bg-[#FFF8EE]"
              >
                {PRIMARY_CTA_LABEL}
                <ArrowRight size={16} aria-hidden />
              </button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              <a href={`mailto:hello@mentormuni.com`} className="font-medium text-[#FF9500] underline underline-offset-2 hover:text-[#E88600]">
                hello@mentormuni.com
              </a>
              <span className="mx-2 text-muted-foreground/50" aria-hidden>
                ·
              </span>
              <a href={CONTACT_PHONE_HREF} className="font-medium text-[#FF9500] underline underline-offset-2 hover:text-[#E88600]">
                {CONTACT_PHONE_DISPLAY}
              </a>
            </p>
          </FadeUp>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
