import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PRIMARY_CTA_LABEL,
  MISSION_TAGLINE,
  PRODUCT_READINESS_SCORE,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
} from '../constants/brandCopy';
import { CheckCircle2, X, ShieldCheck, ArrowRight, Mail, Phone } from 'lucide-react';

/* ─── Data ──────────────────────────────────────────────────── */
const PLANS = [
  {
    id: 'free',
    name: 'Free start',
    price: '₹0',
    sub: 'forever',
    badge: null,
    desc: "Know exactly where you stand before committing a rupee.",
    features: [
      { yes: true,  text: 'Interview readiness score' },
      { yes: true,  text: 'Personalised gap analysis' },
      { yes: true,  text: '1 sample AI mock session' },
      { yes: false, text: '1-on-1 mentorship' },
      { yes: false, text: 'Placement support' },
      { yes: false, text: 'Expert sessions' },
    ],
    cta: 'Start free',
    ctaTo: '/start-assessment',
    ctaStyle: 'border border-border bg-card text-muted-foreground hover:bg-secondary hover:border-cta-mid',
  },
  {
    id: 'core',
    name: 'Complete program',
    price: '₹10,000',
    sub: 'total — nothing else ever',
    badge: 'Most chosen',
    desc: 'Everything you need, from zero to placed. Nothing held back.',
    features: [
      { yes: true, text: 'AI mock interviews — unlimited' },
      { yes: true, text: 'Real interview with industry expert' },
      { yes: true, text: 'Industry mentor sessions — 10+ years experience' },
      { yes: true, text: '1-on-1 mentor with WhatsApp access' },
      { yes: true, text: 'Resume + LinkedIn review' },
      { yes: true, text: 'Week-by-week personalised roadmap' },
      { yes: true, text: 'Placement support till offer letter' },
    ],
    cta: 'Enroll — ₹10,000 total',
    ctaTo: '/contact',
    ctaStyle: 'bg-cta hover:bg-cta-hover text-white shadow-lg shadow-button',
    highlight: true,
  },
  {
    id: 'elite',
    name: 'Elite + referral',
    price: '₹18,000',
    sub: 'total',
    badge: 'For serious job-switchers',
    desc: 'Everything in Complete, plus direct referrals to hiring managers.',
    features: [
      { yes: true, text: 'Everything in Complete program' },
      { yes: true, text: 'Mentor network connections + referral guidance' },
      { yes: true, text: 'Priority mentor — daily check-in' },
      { yes: true, text: 'Salary negotiation coaching' },
      { yes: true, text: 'LinkedIn profile full rewrite' },
      { yes: true, text: '3 mock interviews with hiring managers' },
    ],
    cta: 'Apply for Elite',
    ctaTo: '/contact',
    ctaStyle: 'border border-border bg-card text-muted-foreground hover:bg-secondary hover:border-cta-mid',
  },
];

const VALUE_ROWS = [
  { label: '6 × 1-on-1 mentor sessions',      market: '₹18,000' },
  { label: 'AI mock interviews (unlimited)',    market: '₹6,000'  },
  { label: 'Industry expert real interview',    market: '₹4,000'  },
  { label: 'Resume + LinkedIn review',          market: '₹3,000'  },
  { label: 'Placed-student sessions (6 weeks)', market: '₹5,000'  },
];

const FAQS = [
  {
    q: 'Is ₹10,000 the total? Any hidden charges?',
    a: '₹10,000 is everything. No registration fee, no session fee, no upsells. Ever. The old registration fee is removed — what you see is what you pay.',
  },
  {
    q: "What if I don't get placed right away?",
    a: "We don't guarantee a job or offer money-back refunds. Our commitment is mentorship and support until you get placed—sessions, mocks, and guidance stay with you through the journey. That's what 'placement support till offer letter' means in the Complete programme.",
  },
  {
    q: 'What makes this different from YouTube + LeetCode?',
    a: 'YouTube cannot tell you your specific gaps. LeetCode does not prepare you for HR rounds, salary negotiation, or referrals. We do all three — with a real person in your corner who has cleared the same interviews you are targeting.',
  },
  {
    q: 'How do I pay?',
    a: 'UPI, card, net banking, or EMI via RazorPay. Receipt and program access provided instantly after payment.',
  },
];

/* ─── Component ─────────────────────────────────────────────── */
const PricingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen mm-site-theme overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="mm-marketing-hero-backdrop border-b border-border">
        <div className="relative z-10 mx-auto max-w-3xl px-6 pb-10 pt-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-800">
            <ShieldCheck size={15} className="text-emerald-700" />
            Full mentorship support until you get placed
          </div>

          <h1 className="mb-3 text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl">
            Simple, honest pricing.
            <br />
            <span className="mm-gradient-text-cta">One program. Complete support.</span>
          </h1>
          <p className="mb-4 text-lg text-muted-foreground">Until you&apos;re placed.</p>
          <p className="text-sm text-hint">No hidden fees. No upsells. No &quot;basic&quot; tier that doesn&apos;t work.</p>
        </div>
      </section>

      {/* ── Scarcity banner ── */}
      <div className="mx-auto mb-8 max-w-3xl px-6 pt-10">
        <div className="flex items-center justify-center gap-3 bg-amber-500/10 border border-amber-600/25 rounded-xl px-5 py-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <p className="text-sm font-medium text-warning-ink-deep">
            <span className="font-bold">Next cohort</span>
            {' · '}Limited seats
            {' · '}
            <Link to="/contact" className="underline hover:no-underline">Reserve yours →</Link>
          </p>
        </div>
      </div>

      {/* ── Pricing cards ── */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 flex flex-col h-full transition-all ${
                plan.highlight
                  ? 'border-2 border-cta bg-cta/10 shadow-xl shadow-cta-card'
                  : 'border border-border bg-card'
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                  plan.highlight ? 'bg-cta text-white' : 'border border-border bg-secondary text-muted-foreground'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div className="mb-5 pt-2">
                <p className="text-xs text-hint uppercase tracking-wider font-medium mb-1">{plan.name}</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-4xl font-black ${plan.highlight ? 'text-cta-hover' : 'text-foreground'}`}>{plan.price}</span>
                </div>
                <p className="text-xs text-hint mb-3">{plan.sub}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{plan.desc}</p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5 text-sm">
                    {f.yes
                      ? <CheckCircle2 size={15} className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-cta' : 'text-emerald-600'}`} />
                      : <X size={15} className="mt-0.5 shrink-0 text-[#BBBBBB]" />}
                    <span className={f.yes ? 'text-muted-foreground' : 'text-[#999999]'}>{f.text}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.ctaTo}
                className={`flex items-center justify-center gap-2 w-full font-bold text-sm py-3.5 rounded-xl transition-all ${plan.ctaStyle}`}
              >
                {plan.cta}
                <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">All prices in INR · GST applicable · EMI available via RazorPay</p>
      </section>

      {/* ── Value breakdown ── */}
      <section className="max-w-2xl mx-auto px-6 mb-16">
        <h2 className="text-xl font-bold text-foreground mb-1 text-center">What you&apos;d pay separately</h2>
        <p className="text-muted-foreground text-sm text-center mb-6">This is why ₹10,000 is not expensive — it&apos;s what you&apos;re saving.</p>

        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          {VALUE_ROWS.map((row, i) => (
            <div key={row.label} className={`flex items-center justify-between px-5 py-3.5 ${i < VALUE_ROWS.length - 1 ? 'border-b border-border' : ''}`}>
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <span className="text-sm font-semibold text-hint">{row.market}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-background">
            <span className="text-sm text-muted-foreground">Market value total</span>
            <span className="text-sm font-bold text-hint line-through">₹36,000</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4 bg-[#FF9500]/12 border-t border-[#FF9500]/40">
            <span className="font-bold text-foreground">You pay with MentorMuni</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-[#E88600]">₹10,000</span>
              <span className="text-xs bg-emerald-500/15 text-emerald-800 border border-emerald-600/20 px-2 py-0.5 rounded-full font-semibold">Save ₹26,000</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Founding batch honest section ── */}
      <section className="max-w-3xl mx-auto px-6 mb-16">
        <div className="bg-amber-500/5 border border-amber-600/25 rounded-2xl p-6 text-center">
          <span className="text-xs font-bold text-[#B45309] uppercase tracking-widest block mb-3">Honest note — we&apos;re a new platform</span>
          <h2 className="text-lg font-bold text-foreground mb-2">No placement stories yet. That&apos;s exactly why the founding batch price exists.</h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xl mx-auto mb-5">
            We&apos;re still a young programme—we&apos;re building verified outcomes with our early cohorts. What we can offer now: the lowest price we plan to charge, high mentor attention per student, and our real promise: we stay with you until you get placed. We don&apos;t guarantee a job or offer refunds for non-placement—what you get is sustained mentorship until you land an offer.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { icon: '🎯', label: 'Founding batch price', sub: 'Lowest MentorMuni will ever charge' },
              { icon: '👤', label: 'Small batch', sub: 'More attention per student' },
              { icon: '🤝', label: "Till you're placed", sub: 'Mentorship support through your placement journey' },
            ].map(c => (
              <div key={c.label} className="bg-white border border-border rounded-xl p-3 shadow-sm">
                <span className="text-xl block mb-1">{c.icon}</span>
                <p className="text-xs font-bold text-foreground mb-0.5">{c.label}</p>
                <p className="text-[10px] text-muted-foreground leading-snug">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-2xl mx-auto px-6 mb-16">
        <h2 className="text-xl font-bold text-foreground mb-6 text-center">Common questions</h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
              <button
                type="button"
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-semibold text-foreground text-sm pr-4">{faq.q}</span>
                <span className={`text-hint shrink-0 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                  {faq.a}
                  <span className="inline-block ml-2 text-emerald-600 font-semibold">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-xl mx-auto px-6 pb-20 text-center">
        <div className="rounded-2xl border border-cta/35 bg-warning-bg/90 p-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-warning-text">Founding cohort · Limited seats</p>
          <h3 className="text-2xl font-bold text-foreground mb-2">Start free. Upgrade when ready.</h3>
          <p className="text-muted-foreground text-sm mb-6">Take the free readiness test first — no card needed. Enroll when you&apos;ve seen your score and know it&apos;s worth it.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/start-assessment"
              className="flex-1 flex items-center justify-center gap-2 border border-border bg-white text-muted-foreground hover:bg-secondary font-semibold text-sm py-3 rounded-xl transition-all"
            >
              {PRIMARY_CTA_LABEL}
            </Link>
            <Link
              to="/contact"
              className="flex-1 flex items-center justify-center gap-2 bg-cta py-3 text-sm font-bold text-white shadow-lg shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all hover:bg-cta-hover"
            >
              Enroll now — ₹10,000
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-secondary py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-1">
              <h3 className="font-bold text-foreground mb-2">MentorMuni</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3 max-w-xs">{MISSION_TAGLINE}</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <a href="mailto:enroll@mentormuni.com" className="flex items-center gap-2 hover:text-[#FF9500] transition-colors"><Mail size={13} /> enroll@mentormuni.com</a>
                <a href={CONTACT_PHONE_HREF} className="flex items-center gap-2 hover:text-[#FF9500] transition-colors"><Phone size={13} /> {CONTACT_PHONE_DISPLAY}</a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-hint mb-3">Tools</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/start-assessment" className="hover:text-[#FF9500] transition-colors">{PRODUCT_READINESS_SCORE}</Link></li>
                <li><Link to="/mock-interviews" className="hover:text-[#FF9500] transition-colors">Mock Interviews</Link></li>
                <li><Link to="/skill-gap-analyzer" className="hover:text-[#FF9500] transition-colors">Skill Gap Analyzer</Link></li>
                <li><Link to="/resume-analyzer" className="hover:text-[#FF9500] transition-colors">Resume Analyzer</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-hint mb-3">Learn</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/free-tutorials" className="hover:text-[#FF9500] transition-colors">Free Tutorials</Link></li>
                <li><Link to="/learning-paths" className="hover:text-[#FF9500] transition-colors">Learning Paths</Link></li>
                <li><Link to="/placement-tracks" className="hover:text-[#FF9500] transition-colors">Placement Tracks</Link></li>
                <li><Link to="/outcomes" className="hover:text-[#FF9500] transition-colors">Outcomes</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-hint mb-3">Company</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/contact" className="hover:text-[#FF9500] transition-colors">Contact</Link></li>
                <li><Link to="/mentors" className="hover:text-[#FF9500] transition-colors">Mentorship</Link></li>
                <li><Link to="/for-recruiters" className="hover:text-[#FF9500] transition-colors">For Recruiters</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} MentorMuni. All rights reserved.</p>
            <div className="flex gap-5">
              <Link to="/contact" className="hover:text-[#FF9500] transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-[#FF9500] transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default PricingPage;
