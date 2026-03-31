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
    ctaStyle: 'border border-[#F0ECE0] bg-white text-[#444444] hover:bg-[#FFF8EE] hover:border-[#FFB347]',
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
    ctaStyle: 'bg-[#FF9500] hover:bg-[#E88600] text-white shadow-lg shadow-[0_4px_14px_rgba(255,149,0,0.25)]',
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
    ctaStyle: 'border border-[#F0ECE0] bg-white text-[#444444] hover:bg-[#FFF8EE] hover:border-[#FFB347]',
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
    q: "What if I don't get placed after completing the program?",
    a: 'Full refund. If you complete all program milestones — sessions, mock interviews, assignments — and do not receive a qualifying offer, we refund 100%. No conditions beyond completing the work.',
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
    <div className="min-h-screen bg-[#FFFDF8] text-[#1A1A1A] font-sans antialiased">

      {/* ── Hero ── */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">

        {/* Support badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-600/25 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
          <ShieldCheck size={15} className="text-emerald-700" />
          Full mentorship support until you get placed
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 leading-tight text-[#1A1A1A]">
          Simple, honest pricing.
          <br />
          <span className="text-[#FF9500]">One program. Complete support.</span>
        </h1>
        <p className="text-[#666666] text-lg mb-4">Until you&apos;re placed.</p>
        <p className="text-[#888888] text-sm">No hidden fees. No upsells. No &quot;basic&quot; tier that doesn&apos;t work.</p>

      </section>

      {/* ── Scarcity banner ── */}
      <div className="max-w-3xl mx-auto px-6 mb-8">
        <div className="flex items-center justify-center gap-3 bg-amber-500/10 border border-amber-600/25 rounded-xl px-5 py-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <p className="text-sm text-[#92400e] font-medium">
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
                  ? 'bg-[#FF9500]/10 border-2 border-[#FF9500] shadow-xl shadow-[0_2px_12px_rgba(255,149,0,0.15)]'
                  : 'bg-white border border-[#F0ECE0]'
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                  plan.highlight ? 'bg-[#FF9500] text-white' : 'bg-[#FFF8EE] text-[#666666] border border-[#F0ECE0]'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div className="mb-5 pt-2">
                <p className="text-xs text-[#888888] uppercase tracking-wider font-medium mb-1">{plan.name}</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-4xl font-black ${plan.highlight ? 'text-[#E88600]' : 'text-[#1A1A1A]'}`}>{plan.price}</span>
                </div>
                <p className="text-xs text-[#888888] mb-3">{plan.sub}</p>
                <p className="text-sm text-[#666666] leading-relaxed">{plan.desc}</p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5 text-sm">
                    {f.yes
                      ? <CheckCircle2 size={15} className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-[#FF9500]' : 'text-emerald-600'}`} />
                      : <X size={15} className="mt-0.5 shrink-0 text-[#BBBBBB]" />}
                    <span className={f.yes ? 'text-[#444444]' : 'text-[#999999]'}>{f.text}</span>
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
        <p className="text-center text-xs text-slate-600 mt-4">All prices in INR · GST applicable · EMI available via RazorPay</p>
      </section>

      {/* ── Value breakdown ── */}
      <section className="max-w-2xl mx-auto px-6 mb-16">
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-1 text-center">What you&apos;d pay separately</h2>
        <p className="text-[#666666] text-sm text-center mb-6">This is why ₹10,000 is not expensive — it&apos;s what you&apos;re saving.</p>

        <div className="bg-white border border-[#F0ECE0] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          {VALUE_ROWS.map((row, i) => (
            <div key={row.label} className={`flex items-center justify-between px-5 py-3.5 ${i < VALUE_ROWS.length - 1 ? 'border-b border-[#F0ECE0]' : ''}`}>
              <span className="text-sm text-[#444444]">{row.label}</span>
              <span className="text-sm font-semibold text-[#888888]">{row.market}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#F0ECE0] bg-[#FFFDF8]">
            <span className="text-sm text-[#666666]">Market value total</span>
            <span className="text-sm font-bold text-[#888888] line-through">₹36,000</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4 bg-[#FF9500]/12 border-t border-[#FF9500]/40">
            <span className="font-bold text-[#1A1A1A]">You pay with MentorMuni</span>
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
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-2">No placement stories yet. That&apos;s exactly why the founding batch price exists.</h2>
          <p className="text-[#666666] text-sm leading-relaxed max-w-xl mx-auto mb-5">
            We&apos;re still a young programme—we&apos;re building verified outcomes with our early cohorts. What we can offer now: the lowest price we plan to charge, high mentor attention per student, and a money-back guarantee—so early risk stays on us, not you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { icon: '🎯', label: 'Founding batch price', sub: 'Lowest MentorMuni will ever charge' },
              { icon: '👤', label: 'Small batch', sub: 'More attention per student' },
              { icon: '💰', label: 'Money-back', sub: 'If you complete and don\'t get placed' },
            ].map(c => (
              <div key={c.label} className="bg-white border border-[#F0ECE0] rounded-xl p-3 shadow-sm">
                <span className="text-xl block mb-1">{c.icon}</span>
                <p className="text-xs font-bold text-[#1A1A1A] mb-0.5">{c.label}</p>
                <p className="text-[10px] text-[#666666] leading-snug">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-2xl mx-auto px-6 mb-16">
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-6 text-center">Common questions</h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white border border-[#F0ECE0] rounded-xl overflow-hidden shadow-sm">
              <button
                type="button"
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-semibold text-[#1A1A1A] text-sm pr-4">{faq.q}</span>
                <span className={`text-[#888888] shrink-0 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-[#666666] leading-relaxed border-t border-[#F0ECE0] pt-3">
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
        <div className="bg-[#FF9500]/10 border border-[#FF9500]/35 rounded-2xl p-8">
          <p className="text-xs text-[#CC7000] uppercase tracking-wider mb-2 font-medium">Founding cohort · Limited seats</p>
          <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">Start free. Upgrade when ready.</h3>
          <p className="text-[#666666] text-sm mb-6">Take the free readiness test first — no card needed. Enroll when you&apos;ve seen your score and know it&apos;s worth it.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/start-assessment"
              className="flex-1 flex items-center justify-center gap-2 border border-[#F0ECE0] bg-white text-[#444444] hover:bg-[#FFF8EE] font-semibold text-sm py-3 rounded-xl transition-all"
            >
              {PRIMARY_CTA_LABEL}
            </Link>
            <Link
              to="/contact"
              className="flex-1 flex items-center justify-center gap-2 bg-[#FF9500] hover:bg-[#E88600] text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-[0_4px_14px_rgba(255,149,0,0.25)]"
            >
              Enroll now — ₹10,000
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#F0ECE0] bg-[#FFF8EE] py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-1">
              <h3 className="font-bold text-[#1A1A1A] mb-2">MentorMuni</h3>
              <p className="text-[#666666] text-sm leading-relaxed mb-3 max-w-xs">{MISSION_TAGLINE}</p>
              <div className="space-y-1 text-sm text-[#666666]">
                <a href="mailto:enroll@mentormuni.com" className="flex items-center gap-2 hover:text-[#FF9500] transition-colors"><Mail size={13} /> enroll@mentormuni.com</a>
                <a href={CONTACT_PHONE_HREF} className="flex items-center gap-2 hover:text-[#FF9500] transition-colors"><Phone size={13} /> {CONTACT_PHONE_DISPLAY}</a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#888888] mb-3">Tools</p>
              <ul className="space-y-2 text-sm text-[#666666]">
                <li><Link to="/start-assessment" className="hover:text-[#FF9500] transition-colors">{PRODUCT_READINESS_SCORE}</Link></li>
                <li><Link to="/mock-interviews" className="hover:text-[#FF9500] transition-colors">Mock Interviews</Link></li>
                <li><Link to="/skill-gap-analyzer" className="hover:text-[#FF9500] transition-colors">Skill Gap Analyzer</Link></li>
                <li><Link to="/resume-analyzer" className="hover:text-[#FF9500] transition-colors">Resume Analyzer</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#888888] mb-3">Learn</p>
              <ul className="space-y-2 text-sm text-[#666666]">
                <li><Link to="/free-tutorials" className="hover:text-[#FF9500] transition-colors">Free Tutorials</Link></li>
                <li><Link to="/learning-paths" className="hover:text-[#FF9500] transition-colors">Learning Paths</Link></li>
                <li><Link to="/placement-tracks" className="hover:text-[#FF9500] transition-colors">Placement Tracks</Link></li>
                <li><Link to="/outcomes" className="hover:text-[#FF9500] transition-colors">Outcomes</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#888888] mb-3">Company</p>
              <ul className="space-y-2 text-sm text-[#666666]">
                <li><Link to="/contact" className="hover:text-[#FF9500] transition-colors">Contact</Link></li>
                <li><Link to="/mentors" className="hover:text-[#FF9500] transition-colors">Mentorship</Link></li>
                <li><Link to="/for-recruiters" className="hover:text-[#FF9500] transition-colors">For Recruiters</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#F0ECE0] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#666666]">
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
