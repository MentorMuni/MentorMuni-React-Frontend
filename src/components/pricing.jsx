import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InnerRouteShell from './new-ui/InnerRouteShell';
import MarketingHeroMotion from './layout/MarketingHeroMotion';
import StaggerGrid from './layout/StaggerGrid';
import FadeUp from './layout/FadeUp';
import {
  PRIMARY_CTA_LABEL,
  MISSION_TAGLINE,
  PRODUCT_READINESS_SCORE,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  MENTORSHIP_FIRST_BATCH_START_LABEL,
  PROGRAM_6WEEK_CARD_TITLE,
  PROGRAM_6WEEK_PRICE_MAIN,
  PROGRAM_6WEEK_PRICE_MAIN_SUFFIX,
  PROGRAM_6WEEK_SUMMARY,
  PROGRAM_ENROLL_CTA,
  PROGRAM_ENROLL_PATH,
  PRICING_PAGE_HERO_SUB,
  PRICING_PAID_PLAN_FEATURES,
  PRICING_VALUE_ROWS,
  PRICING_MARKET_TOTAL,
  PRICING_FAQ_ITEMS,
} from '../constants/brandCopy';
import { CheckCircle2, X, ShieldCheck, ArrowRight, Mail, Phone } from 'lucide-react';

const FREE_PLAN = {
  id: 'free',
  name: 'Free start',
  price: '₹0',
  sub: 'forever',
  desc: 'Know exactly where you stand before committing a rupee.',
  features: [
    { yes: true, text: 'Interview readiness score' },
    { yes: true, text: 'Personalised gap analysis' },
    { yes: true, text: '1 sample AI mock session' },
    { yes: false, text: 'Weekly 1-on-1 mentorship' },
    { yes: false, text: 'Structured 5-week program' },
    { yes: false, text: 'Placement journey support' },
  ],
  cta: PRIMARY_CTA_LABEL,
  ctaTo: '/start-assessment',
  ctaStyle: 'border border-border bg-card text-muted-foreground hover:bg-secondary hover:border-cta-mid',
};

const PAID_PLAN = {
  id: 'core',
  name: PROGRAM_6WEEK_CARD_TITLE,
  price: PROGRAM_6WEEK_PRICE_MAIN,
  sub: PROGRAM_6WEEK_PRICE_MAIN_SUFFIX,
  badge: 'Complete program',
  desc: PROGRAM_6WEEK_SUMMARY,
  features: PRICING_PAID_PLAN_FEATURES,
  cta: PROGRAM_ENROLL_CTA,
  ctaTo: PROGRAM_ENROLL_PATH,
  ctaStyle: 'bg-cta hover:bg-cta-hover text-white shadow-lg shadow-button',
  highlight: true,
};

const PricingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const plans = [FREE_PLAN, PAID_PLAN];

  return (
    <InnerRouteShell scope="inner" className="mm-site-theme min-h-screen overflow-x-hidden">

      <section className="mm-marketing-hero-backdrop mm-hero-premium border-b border-border">
        <div className="mm-hero-mesh" aria-hidden />
        <div className="mm-hero-dot-grid" aria-hidden />
        <MarketingHeroMotion className="relative z-10 mx-auto max-w-3xl px-6 pb-10 pt-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-800 mm-float-soft">
            <ShieldCheck size={15} className="text-emerald-700" />
            One program · {PROGRAM_6WEEK_PRICE_MAIN} total
          </div>

          <h1 className="mb-3 text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl">
            Simple, honest pricing.
            <br />
            <span className="mm-gradient-text-cta">Start free. Enroll when ready.</span>
          </h1>
          <p className="mb-4 text-lg text-muted-foreground">{PRICING_PAGE_HERO_SUB}</p>
          <p className="text-sm text-hint">No hidden fees. No elite tier. No upsells after you join.</p>
        </MarketingHeroMotion>
      </section>

      <FadeUp className="mx-auto mb-8 max-w-3xl px-6 pt-10">
        <div className="flex items-center justify-center gap-3 rounded-xl border border-amber-600/25 bg-amber-500/10 px-5 py-3">
          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-500" />
          <p className="text-sm font-medium text-warning-ink-deep">
            <span className="font-bold">{MENTORSHIP_FIRST_BATCH_START_LABEL}</span>
            {' · '}Limited seats ·{' '}
            <Link to={PROGRAM_ENROLL_PATH} className="underline hover:no-underline">
              Reserve yours →
            </Link>
          </p>
        </div>
      </FadeUp>

      <section className="mx-auto mb-16 max-w-4xl px-6">
        <StaggerGrid className="grid grid-cols-1 items-start gap-6 md:grid-cols-2" stagger={0.12}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`mm-animate-card mm-card-premium relative flex h-full flex-col rounded-2xl p-6 ${
                plan.highlight
                  ? 'border-2 border-cta bg-cta/10 shadow-xl shadow-cta-card'
                  : 'border border-border bg-card'
              }`}
            >
              {plan.badge && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${
                    plan.highlight ? 'bg-cta text-white' : 'border border-border bg-secondary text-muted-foreground'
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div className="mb-5 pt-2">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-hint">{plan.name}</p>
                <div className="mb-1 flex items-baseline gap-2">
                  <span className={`text-4xl font-black ${plan.highlight ? 'text-cta-hover' : 'text-foreground'}`}>
                    {plan.price}
                  </span>
                </div>
                <p className="mb-3 text-xs text-hint">{plan.sub}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{plan.desc}</p>
              </div>

              <ul className="mb-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5 text-sm">
                    {f.yes ? (
                      <CheckCircle2
                        size={15}
                        className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-cta' : 'text-emerald-600'}`}
                      />
                    ) : (
                      <X size={15} className="mt-0.5 shrink-0 text-[#BBBBBB]" />
                    )}
                    <span className={f.yes ? 'text-muted-foreground' : 'text-hint'}>{f.text}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.ctaTo}
                className={`mm-btn-interactive flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all ${plan.ctaStyle}`}
              >
                {plan.cta}
                <ArrowRight size={15} className="mm-icon-wiggle" />
              </Link>
            </div>
          ))}
        </StaggerGrid>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          All prices in INR · GST applicable where required
        </p>
      </section>

      <section className="mx-auto mb-16 max-w-2xl px-6">
        <h2 className="mb-1 text-center text-xl font-bold text-foreground">What you&apos;d pay separately</h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Illustrative market rates for similar services — not a fake discount gimmick.
        </p>

        <div className="mm-surface-panel overflow-hidden rounded-2xl">
          {PRICING_VALUE_ROWS.map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between px-5 py-3.5 ${
                i < PRICING_VALUE_ROWS.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <span className="text-sm font-semibold text-hint">{row.market}</span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-border bg-background px-5 py-3.5">
            <span className="text-sm text-muted-foreground">Typical market total</span>
            <span className="text-sm font-bold text-hint line-through">{PRICING_MARKET_TOTAL}</span>
          </div>
          <div className="flex items-center justify-between border-t border-[#FF9500]/40 bg-[#FF9500]/12 px-5 py-4">
            <span className="font-bold text-foreground">MentorMuni 5-week program</span>
            <span className="text-xl font-black text-[#E88600]">{PROGRAM_6WEEK_PRICE_MAIN}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto mb-16 max-w-3xl px-6">
        <div className="rounded-2xl border border-amber-600/25 bg-amber-500/5 p-6 text-center">
          <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#B45309]">
            Honest note — we&apos;re a new platform
          </span>
          <h2 className="mb-2 text-lg font-bold text-foreground">
            Founding batch pricing — we stay with you through your placement journey
          </h2>
          <p className="mx-auto mb-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            We&apos;re building verified outcomes with early cohorts. What we offer now: one clear price, high mentor
            attention per student, and sustained support while you prepare and apply. We don&apos;t guarantee a job or
            offer refunds for non-placement.
          </p>
          <div className="mx-auto grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: '🎯', label: 'One price', sub: PROGRAM_6WEEK_PRICE_MAIN + ' all-in' },
              { icon: '👤', label: 'Small batch', sub: 'More attention per student' },
              { icon: '🤝', label: 'Till you\'re placed', sub: 'Mentorship through your journey' },
            ].map((c) => (
              <div key={c.label} className="mm-surface-panel rounded-xl p-3">
                <span className="mb-1 block text-xl">{c.icon}</span>
                <p className="mb-0.5 text-xs font-bold text-foreground">{c.label}</p>
                <p className="text-[10px] leading-snug text-muted-foreground">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mb-16 max-w-2xl px-6">
        <h2 className="mb-6 text-center text-xl font-bold text-foreground">Common questions</h2>
        <div className="space-y-2">
          {PRICING_FAQ_ITEMS.map((faq, i) => (
            <div key={faq.q} className="mm-surface-panel overflow-hidden rounded-xl">
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="pr-4 text-sm font-semibold text-foreground">{faq.q}</span>
                <span className={`shrink-0 text-hint transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              {openFaq === i && (
                <div className="border-t border-border px-5 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-xl px-6 pb-20 text-center">
        <div className="rounded-2xl border border-cta/35 bg-warning-bg/90 p-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-warning-text">Recommended path</p>
          <h3 className="mb-2 text-2xl font-bold text-foreground">Free check first. Enroll when the gap is real.</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Take the readiness check — no card needed. Join the 5-week program when you want structured mentor support.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/start-assessment"
              className="mm-btn-secondary flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
            >
              {PRIMARY_CTA_LABEL}
            </Link>
            <Link
              to={PROGRAM_ENROLL_PATH}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cta py-3 text-sm font-bold text-white shadow-lg shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all hover:bg-cta-hover"
            >
              {PROGRAM_ENROLL_CTA}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-secondary px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="md:col-span-1">
              <h3 className="mb-2 font-bold text-foreground">MentorMuni</h3>
              <p className="mb-3 max-w-xs text-sm leading-relaxed text-muted-foreground">{MISSION_TAGLINE}</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <a href="mailto:enroll@mentormuni.com" className="flex items-center gap-2 transition-colors hover:text-[#FF9500]">
                  <Mail size={13} /> enroll@mentormuni.com
                </a>
                <a href={CONTACT_PHONE_HREF} className="flex items-center gap-2 transition-colors hover:text-[#FF9500]">
                  <Phone size={13} /> {CONTACT_PHONE_DISPLAY}
                </a>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold text-hint">Tools</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/start-assessment" className="transition-colors hover:text-[#FF9500]">
                    {PRODUCT_READINESS_SCORE}
                  </Link>
                </li>
                <li>
                  <Link to="/mock-interviews" className="transition-colors hover:text-[#FF9500]">
                    Mock Interviews
                  </Link>
                </li>
                <li>
                  <Link to="/resume-analyzer" className="transition-colors hover:text-[#FF9500]">
                    Resume Analyzer
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold text-hint">Learn</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/free-tutorials" className="transition-colors hover:text-[#FF9500]">
                    Free Tutorials
                  </Link>
                </li>
                <li>
                  <Link to="/placement-tracks" className="transition-colors hover:text-[#FF9500]">
                    Placement Tracks
                  </Link>
                </li>
                <li>
                  <Link to="/outcomes" className="transition-colors hover:text-[#FF9500]">
                    Outcomes
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold text-hint">Company</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/contact" className="transition-colors hover:text-[#FF9500]">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="transition-colors hover:text-[#FF9500]">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/mentors" className="transition-colors hover:text-[#FF9500]">
                    Mentorship
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} MentorMuni. All rights reserved.</p>
            <div className="flex gap-5">
              <Link to="/terms" className="transition-colors hover:text-[#FF9500]">
                Terms
              </Link>
              <Link to="/privacy" className="transition-colors hover:text-[#FF9500]">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </InnerRouteShell>
  );
};

export default PricingPage;
