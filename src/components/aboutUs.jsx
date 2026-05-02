import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Target,
  Users,
  Sparkles,
  ArrowRight,
  Mail,
  BarChart3,
  Layers,
  Repeat2,
  GraduationCap,
  Building2,
  Compass,
  Quote,
  ChevronRight,
  Heart,
  MapPin,
} from 'lucide-react';
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
  ABOUT_PAGE_EYEBROW,
  ABOUT_PAGE_HERO_LINE1,
  ABOUT_PAGE_HERO_ACCENT,
  ABOUT_PAGE_HERO_LEAD,
  ABOUT_PULL_QUOTE,
  ABOUT_BELIEFS,
  ABOUT_STORY_TITLE,
  ABOUT_STORY_PARAGRAPHS,
  ABOUT_AUDIENCES_SECTION_TITLE,
  ABOUT_AUDIENCES,
  ABOUT_PILLARS_HEADLINE,
  ABOUT_PILLARS_SUB,
  ABOUT_PILLARS,
} from '../constants/brandCopy';

const ABOUT_LOOP_ICONS = [BarChart3, Layers, Repeat2];
const PILLAR_ICONS = [Target, Users, Sparkles];
const AUDIENCE_ICONS = [GraduationCap, Building2, Compass];

const easeOut = [0.22, 1, 0.36, 1];

const logoSrc = `${import.meta.env.BASE_URL}mentormuni-logo.png`;

function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : reduceMotion ? {} : { opacity: 0, y: 22 }}
      transition={{ duration: reduceMotion ? 0 : 0.52, delay: reduceMotion ? 0 : delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

const AboutUs = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen mm-site-theme overflow-x-hidden text-muted-foreground">
      {/* —— Hero —— */}
      <section
        className="mm-marketing-hero-backdrop border-b border-border"
        aria-labelledby="about-hero-heading"
      >
        <div className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
            <div className="min-w-0 flex-1">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: easeOut }}
                className="mb-4 inline-flex flex-wrap items-center gap-2"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-cyan-50/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-cyan-950">
                  <Heart className="h-3.5 w-3.5 text-[#FF9500]" aria-hidden />
                  {ABOUT_PAGE_EYEBROW}
                </span>
                <span className="hidden text-xs font-semibold text-muted-foreground sm:inline">
                  India · Interview readiness
                </span>
              </motion.div>

              <motion.div
                className="mb-6 flex items-center gap-3 lg:mb-8"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.04, ease: easeOut }}
              >
                <img
                  src={logoSrc}
                  alt="MentorMuni"
                  className="h-14 w-14 shrink-0 rounded-full object-contain ring-2 ring-border shadow-[0_8px_24px_rgba(255,149,0,0.15)] sm:h-16 sm:w-16"
                  width={64}
                  height={64}
                />
                <div className="min-w-0 border-l border-border pl-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#EA580C]">MentorMuni</p>
                  <p className="text-xs text-muted-foreground">The story starts here.</p>
                </div>
              </motion.div>

              <motion.h1
                id="about-hero-heading"
                className="max-w-[40rem] text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl sm:leading-[1.12] lg:text-[2.65rem] lg:leading-[1.08]"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.06, ease: easeOut }}
              >
                <span className="block text-neutral-900">{ABOUT_PAGE_HERO_LINE1}</span>
                <span className="mt-1 block bg-gradient-to-r from-[#ea580c] via-[#FF9500] to-[#0891b2] bg-clip-text text-transparent">
                  {ABOUT_PAGE_HERO_ACCENT}
                </span>
              </motion.h1>

              <motion.p
                className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-[17px]"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.12, ease: easeOut }}
              >
                <span className="font-medium text-foreground/90">{ABOUT_PAGE_HERO_LEAD}</span>
              </motion.p>

              <motion.p
                className="mt-4 max-w-2xl border-l-2 border-[#FF9500]/50 pl-4 text-sm leading-relaxed text-muted-foreground sm:text-[15px]"
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.18, ease: easeOut }}
              >
                {MISSION_TAGLINE}
              </motion.p>

              <motion.div
                className="mt-8 flex flex-wrap gap-2.5"
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.22, ease: easeOut }}
              >
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-[#FFB347] hover:bg-secondary"
                >
                  How it works
                  <ChevronRight className="h-4 w-4 opacity-70" aria-hidden />
                </Link>
                <Link
                  to="/mentors"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-[#FFB347] hover:bg-secondary"
                >
                  Mentors
                  <ChevronRight className="h-4 w-4 opacity-70" aria-hidden />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#FF9500] px-4 py-2 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,149,0,0.3)] transition hover:bg-[#E88600]"
                >
                  Contact
                </Link>
              </motion.div>
            </div>

            <motion.aside
              className="w-full max-w-md shrink-0 lg:w-[380px]"
              initial={reduceMotion ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.12, ease: easeOut }}
            >
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_-12px_rgba(15,23,42,0.12)]">
                <div className="border-b border-border bg-gradient-to-br from-secondary via-white to-cyan-50/50 px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#EA580C]">At a glance</p>
                </div>
                <ul className="divide-y divide-border px-5 py-2">
                  {[
                    { label: 'Core promise', value: 'Score → gaps → reps' },
                    { label: 'Start', value: 'Free readiness check (~5 min)' },
                    { label: 'Where', value: 'Built in Bangalore, for India' },
                  ].map((row) => (
                    <li key={row.label} className="flex items-start justify-between gap-4 py-3.5">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{row.label}</span>
                      <span className="max-w-[58%] text-right text-sm font-semibold text-foreground">{row.value}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-start gap-2 border-t border-border bg-background px-5 py-4">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FF9500]" aria-hidden />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    This page is our handshake: who we are, how we think, and how to work with us.
                  </p>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* —— Beliefs —— */}
      <section className="border-t border-border bg-white px-5 py-14 sm:px-6 lg:py-16" aria-labelledby="about-beliefs-heading">
        <div className="mx-auto max-w-6xl">
          <FadeUp className="mb-10 max-w-2xl">
            <h2 id="about-beliefs-heading" className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
              How we think about preparation
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-[17px]">
              Three beliefs — everything on the product maps back to these.
            </p>
          </FadeUp>

          <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
            {ABOUT_BELIEFS.map((b, i) => (
              <FadeUp key={b.title} delay={i * 0.07}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-white to-[#FFFBF5] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition hover:border-[#FFB347]/60 hover:shadow-[0_12px_36px_-8px_rgba(255,149,0,0.18)] md:p-7">
                  <span
                    className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF4E0] text-sm font-black text-[#EA580C]"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-bold text-foreground md:text-xl">{b.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground md:text-[15px]">{b.body}</p>
                  <div
                    className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-orange-400/10 to-cyan-400/10 blur-2xl transition group-hover:opacity-100"
                    aria-hidden
                  />
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* —— Pull quote + story —— */}
      <section className="border-t border-border bg-gradient-to-b from-background to-white px-5 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,1.15fr)] lg:gap-14 lg:items-start">
            <FadeUp>
              <figure className="relative overflow-hidden rounded-2xl border border-[#FF9500]/25 bg-gradient-to-br from-secondary via-white to-cyan-50/30 p-8 shadow-[0_16px_48px_-16px_rgba(234,88,12,0.2)] md:p-10">
                <Quote className="mb-4 h-8 w-8 text-[#FF9500]/80" aria-hidden />
                <blockquote className="text-xl font-semibold leading-snug text-foreground md:text-2xl md:leading-tight">
                  {ABOUT_PULL_QUOTE}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="h-px flex-1 max-w-[3rem] bg-gradient-to-r from-[#FF9500] to-transparent" aria-hidden />
                  Our operating thesis
                </figcaption>
              </figure>
            </FadeUp>

            <FadeUp delay={0.08}>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">{ABOUT_STORY_TITLE}</h2>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground md:text-[17px]">
                {ABOUT_STORY_PARAGRAPHS.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* —— System (loops) —— */}
      <section
        className="border-t border-border bg-white px-5 py-14 sm:px-6 lg:py-16"
        aria-labelledby="about-system-heading"
      >
        <div className="mx-auto max-w-6xl">
          <FadeUp className="mb-4 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#EA580C]">One spine</p>
            <h2
              id="about-system-heading"
              className="mt-2 text-2xl font-extrabold tracking-tight text-foreground md:text-3xl"
            >
              {ABOUT_SYSTEM_SECTION_TITLE}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-[17px]">{ABOUT_SYSTEM_SECTION_LEAD}</p>
          </FadeUp>

          <div className="relative mt-12">
            <div
              className="pointer-events-none absolute left-4 top-0 hidden h-full w-0.5 bg-gradient-to-b from-[#FF9500] via-[#FFB347] to-cyan-400 md:left-1/2 md:block md:-translate-x-1/2"
              aria-hidden
            />
            <div className="grid gap-8 md:gap-12">
              {ABOUT_SYSTEM_LOOPS.map((loop, i) => {
                const Icon = ABOUT_LOOP_ICONS[i] ?? Sparkles;
                const isLeft = i % 2 === 0;
                return (
                  <FadeUp key={loop.title} delay={i * 0.06}>
                    <div
                      className={`relative flex flex-col gap-4 md:flex-row md:items-center ${
                        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      <div
                        className={`flex flex-1 ${isLeft ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left'}`}
                      >
                        <article className="w-full rounded-2xl border border-border bg-[#FAFAFA]/80 p-6 shadow-sm md:max-w-md md:border-0 md:bg-transparent md:p-0 md:shadow-none">
                          <div
                            className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF4E0] text-[#CC7000] ${
                              isLeft ? 'md:ml-auto' : ''
                            }`}
                          >
                            <Icon size={22} strokeWidth={2} aria-hidden />
                          </div>
                          <h3 className="text-lg font-bold text-foreground md:text-xl">{loop.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">{loop.body}</p>
                        </article>
                      </div>
                      <div
                        className="hidden md:flex md:h-12 md:w-12 md:shrink-0 md:items-center md:justify-center md:rounded-full md:border-4 md:border-white md:bg-[#FF9500] md:text-sm md:font-black md:text-white md:shadow-lg md:shadow-orange-500/30"
                        aria-hidden
                      >
                        {i + 1}
                      </div>
                      <div className="hidden flex-1 md:block" aria-hidden />
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* —— Pillars —— */}
      <section
        className="border-t border-border bg-background px-5 py-14 sm:px-6 lg:py-16"
        aria-labelledby="about-pillars-heading"
      >
        <div className="mx-auto max-w-6xl">
          <FadeUp className="mb-10 max-w-2xl">
            <h2 id="about-pillars-heading" className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
              {ABOUT_PILLARS_HEADLINE}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-[17px]">{ABOUT_PILLARS_SUB}</p>
          </FadeUp>

          <div className="grid gap-6 md:grid-cols-3">
            {ABOUT_PILLARS.map((p, i) => {
              const Icon = PILLAR_ICONS[i] ?? Sparkles;
              return (
                <FadeUp key={p.title} delay={i * 0.06}>
                  <article className="h-full rounded-2xl border border-border bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:border-[#FF9500]/35 hover:shadow-[0_16px_40px_-12px_rgba(255,149,0,0.18)] md:p-7">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFF4E0] to-[#FFE8C8] text-[#CC7000] shadow-inner">
                      <Icon size={24} strokeWidth={2} aria-hidden />
                    </div>
                    <h3 className="text-lg font-bold text-foreground md:text-xl">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">{p.body}</p>
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* —— Audiences —— */}
      <section className="border-t border-border bg-white px-5 py-14 sm:px-6 lg:py-16" aria-labelledby="about-audiences-heading">
        <div className="mx-auto max-w-6xl">
          <FadeUp className="mb-10">
            <h2 id="about-audiences-heading" className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
              {ABOUT_AUDIENCES_SECTION_TITLE}
            </h2>
          </FadeUp>
          <div className="grid gap-6 lg:grid-cols-3">
            {ABOUT_AUDIENCES.map((aud, i) => {
              const Icon = AUDIENCE_ICONS[i] ?? Compass;
              return (
                <FadeUp key={aud.title} delay={i * 0.07}>
                  <article className="flex h-full flex-col rounded-2xl border border-border p-6 transition hover:border-[#0891b2]/40 hover:bg-cyan-50/20 md:p-7">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-900">
                      <Icon size={22} strokeWidth={2} aria-hidden />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{aud.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground md:text-[15px]">{aud.body}</p>
                    <Link
                      to={aud.href}
                      className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#FF9500] transition hover:text-[#E88600]"
                    >
                      {aud.cta}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* —— CTA —— */}
      <section className="border-t border-border px-5 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#1a1a1a] via-[#252530] to-[#0f172a] px-6 py-12 text-center shadow-[0_24px_60px_-12px_rgba(0,0,0,0.35)] sm:px-10 md:px-14 md:py-14">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_80%_0%,rgba(255,149,0,0.2),transparent)]" aria-hidden />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_10%_100%,rgba(34,211,238,0.12),transparent)]" aria-hidden />
              <h2 className="relative text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                Ready to see your baseline?
              </h2>
              <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
                Or tell us about your campus — we read every message.
              </p>
              <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <button
                  type="button"
                  onClick={goToStartAssessment}
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-8 py-3.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(255,149,0,0.4)] transition hover:bg-[#E88600] sm:w-auto"
                >
                  {PRIMARY_CTA_LABEL}
                  <ArrowRight size={18} aria-hidden />
                </button>
                <Link
                  to="/contact"
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border-2 border-white/25 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20 sm:w-auto"
                >
                  <Mail size={18} aria-hidden />
                  {SECONDARY_CTA_BOOK_CALL}
                </Link>
              </div>
              <p className="relative mt-8 text-sm text-white/60">
                <a
                  href="mailto:hello@mentormuni.com"
                  className="font-medium text-[#FFB347] underline-offset-2 hover:text-white hover:underline"
                >
                  hello@mentormuni.com
                </a>
                <span className="mx-2 text-white/40" aria-hidden>
                  ·
                </span>
                <a
                  href={CONTACT_PHONE_HREF}
                  className="font-medium text-[#FFB347] underline-offset-2 hover:text-white hover:underline"
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </p>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
