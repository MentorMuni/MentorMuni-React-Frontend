import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, X, ShieldCheck, ArrowRight,
  Mail, Phone, Users, Zap, Star,
} from 'lucide-react';

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
    ctaStyle: 'border border-white/15 hover:border-white/30 hover:bg-white/5 text-slate-300 hover:text-white',
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
      { yes: true, text: 'Sessions by recently placed students — how they did it' },
      { yes: true, text: '1-on-1 mentor with WhatsApp access' },
      { yes: true, text: 'Resume + LinkedIn review' },
      { yes: true, text: 'Week-by-week personalised roadmap' },
      { yes: true, text: 'Placement support till offer letter' },
    ],
    cta: 'Enroll — ₹10,000 total',
    ctaTo: '/contact',
    ctaStyle: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20',
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
      { yes: true, text: 'Direct referrals to 50+ companies' },
      { yes: true, text: 'Priority mentor — daily check-in' },
      { yes: true, text: 'Salary negotiation coaching' },
      { yes: true, text: 'LinkedIn profile full rewrite' },
      { yes: true, text: '3 mock interviews with hiring managers' },
    ],
    cta: 'Apply for Elite',
    ctaTo: '/contact',
    ctaStyle: 'border border-white/15 hover:border-white/30 hover:bg-white/5 text-slate-300 hover:text-white',
  },
];

const VALUE_ROWS = [
  { label: '6 × 1-on-1 mentor sessions',      market: '₹18,000' },
  { label: 'AI mock interviews (unlimited)',    market: '₹6,000'  },
  { label: 'Industry expert real interview',    market: '₹4,000'  },
  { label: 'Resume + LinkedIn review',          market: '₹3,000'  },
  { label: 'Placed-student sessions (6 weeks)', market: '₹5,000'  },
];

const TESTIMONIALS = [
  {
    init: 'RS', bg: 'bg-indigo-500',
    name: 'Rahul S.', college: 'NIT Trichy',
    placed: 'TCS', lpa: '₹7 LPA',
    quote: '"Got placed at TCS within 5 weeks. The placed-student sessions showed me exactly what interviewers actually look for — not textbook answers, real ones."',
  },
  {
    init: 'PK', bg: 'bg-violet-500',
    name: 'Priya K.', college: 'VIT Vellore',
    placed: 'Infosys', lpa: '₹6.5 LPA',
    quote: '"My AI mock score went from 48 to 81. The gap analysis was scary accurate — it found things I didn\'t know I was missing. Cleared Infosys first attempt."',
  },
  {
    init: 'AR', bg: 'bg-blue-500',
    name: 'Ananya R.', college: 'SRM Chennai',
    placed: 'Wipro', lpa: '₹6 LPA',
    quote: '"The WhatsApp mentor access was the difference. 11pm before my interview, I had a doubt — mentor replied in 10 minutes. That\'s what made me confident."',
  },
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
    <div className="min-h-screen bg-[#050b18] text-white font-sans antialiased">

      {/* ── Hero ── */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">

        {/* Guarantee badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
          <ShieldCheck size={15} />
          Money-back guarantee if you complete the program and don't get placed
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 leading-tight">
          Simple, honest pricing.
          <br />
          <span className="text-indigo-400">One program. Complete support.</span>
        </h1>
        <p className="text-slate-400 text-lg mb-4">Until you're placed.</p>
        <p className="text-slate-500 text-sm">No hidden fees. No upsells. No "basic" tier that doesn't work.</p>

      </section>

      {/* ── Scarcity banner ── */}
      <div className="max-w-3xl mx-auto px-6 mb-8">
        <div className="flex items-center justify-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-3">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <p className="text-sm text-amber-300 font-medium">
            <span className="font-bold">April cohort</span>
            {' · '}Only 8 seats remaining
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
                  ? 'bg-indigo-600/10 border-2 border-indigo-500 shadow-xl shadow-indigo-500/10'
                  : 'bg-[#0f1a30] border border-white/8'
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                  plan.highlight ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-300 border border-white/10'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div className="mb-5 pt-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">{plan.name}</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">{plan.sub}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{plan.desc}</p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5 text-sm">
                    {f.yes
                      ? <CheckCircle2 size={15} className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-indigo-400' : 'text-green-500'}`} />
                      : <X size={15} className="mt-0.5 shrink-0 text-slate-700" />}
                    <span className={f.yes ? 'text-slate-300' : 'text-slate-600'}>{f.text}</span>
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
        <h2 className="text-xl font-bold text-white mb-1 text-center">What you'd pay separately</h2>
        <p className="text-slate-400 text-sm text-center mb-6">This is why ₹10,000 is not expensive — it's what you're saving.</p>

        <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
          {VALUE_ROWS.map((row, i) => (
            <div key={row.label} className={`flex items-center justify-between px-5 py-3.5 ${i < VALUE_ROWS.length - 1 ? 'border-b border-white/5' : ''}`}>
              <span className="text-sm text-slate-300">{row.label}</span>
              <span className="text-sm font-semibold text-slate-400">{row.market}</span>
            </div>
          ))}
          {/* Subtotal */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/8 bg-white/[0.03]">
            <span className="text-sm text-slate-400">Market value total</span>
            <span className="text-sm font-bold text-slate-300 line-through">₹36,000</span>
          </div>
          {/* MentorMuni price */}
          <div className="flex items-center justify-between px-5 py-4 bg-indigo-600/15 border-t border-indigo-500/30">
            <span className="font-bold text-white">You pay with MentorMuni</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-indigo-400">₹10,000</span>
              <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-semibold">Save ₹26,000</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="max-w-5xl mx-auto px-6 mb-16">
        <h2 className="text-xl font-bold text-white mb-1 text-center">Students who enrolled — real outcomes</h2>
        <p className="text-slate-400 text-sm text-center mb-8">Names, colleges, companies, packages. Nothing made up.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 flex flex-col">
              <p className="text-sm text-slate-300 leading-relaxed flex-1 mb-4">{t.quote}</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.bg} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                  {t.init}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-none mb-0.5">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.college}</p>
                  <p className="text-xs text-green-400 font-medium mt-0.5">✓ {t.placed} · {t.lpa}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-2xl mx-auto px-6 mb-16">
        <h2 className="text-xl font-bold text-white mb-6 text-center">Common questions</h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-semibold text-white text-sm pr-4">{faq.q}</span>
                <span className={`text-slate-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                  <span className="inline-block ml-2 text-green-400 font-semibold">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-xl mx-auto px-6 pb-20 text-center">
        <div className="bg-indigo-600/10 border border-indigo-500/25 rounded-2xl p-8">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">April cohort · 8 seats left</p>
          <h3 className="text-2xl font-bold text-white mb-2">Start free. Upgrade when ready.</h3>
          <p className="text-slate-400 text-sm mb-6">Take the free readiness test first — no card needed. Enroll when you've seen your score and know it's worth it.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/start-assessment"
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-semibold text-sm py-3 rounded-xl transition-all"
            >
              Take free test first
            </Link>
            <Link
              to="/contact"
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
            >
              Enroll now — ₹10,000
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-1">
              <h3 className="font-bold text-white mb-2">MentorMuni</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-3 max-w-xs">Know your interview readiness. Improve it. Crack it.</p>
              <div className="space-y-1 text-sm text-slate-500">
                <a href="mailto:enroll@mentormuni.com" className="flex items-center gap-2 hover:text-slate-300 transition-colors"><Mail size={13} /> enroll@mentormuni.com</a>
                <a href="tel:+919146421302" className="flex items-center gap-2 hover:text-slate-300 transition-colors"><Phone size={13} /> +91 91464 21302</a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-3">Tools</p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/start-assessment" className="hover:text-slate-300 transition-colors">Interview Readiness</Link></li>
                <li><Link to="/mock-interviews" className="hover:text-slate-300 transition-colors">Mock Interviews</Link></li>
                <li><Link to="/skill-gap-analyzer" className="hover:text-slate-300 transition-colors">Skill Gap Analyzer</Link></li>
                <li><Link to="/resume-analyzer" className="hover:text-slate-300 transition-colors">Resume Analyzer</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-3">Learn</p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/free-tutorials" className="hover:text-slate-300 transition-colors">Free Tutorials</Link></li>
                <li><Link to="/learning-paths" className="hover:text-slate-300 transition-colors">Learning Paths</Link></li>
                <li><Link to="/placement-tracks" className="hover:text-slate-300 transition-colors">Placement Tracks</Link></li>
                <li><Link to="/success-stories" className="hover:text-slate-300 transition-colors">Success Stories</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-3">Company</p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/contact" className="hover:text-slate-300 transition-colors">Contact</Link></li>
                <li><Link to="/mentors" className="hover:text-slate-300 transition-colors">Mentorship</Link></li>
                <li><Link to="/for-recruiters" className="hover:text-slate-300 transition-colors">For Recruiters</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600">
            <p>© {new Date().getFullYear()} MentorMuni. All rights reserved.</p>
            <div className="flex gap-5">
              <Link to="/contact" className="hover:text-slate-400 transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-slate-400 transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default PricingPage;
