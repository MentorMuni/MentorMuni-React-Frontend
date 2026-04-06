import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Users, Mic2, Target, MessagesSquare, Code2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const API_BASE = import.meta.env.VITE_API_URL || '';

const AVATARS = [
  { init: 'P', bg: 'bg-[#FF9500]' },
  { init: 'R', bg: 'bg-[#FFB347]' },
  { init: 'A', bg: 'bg-blue-500' },
  { init: 'S', bg: 'bg-purple-500' },
  { init: 'V', bg: 'bg-teal-500' },
];

/** What the paid mentorship batch will include — shown on waitlist for clarity */
const COVERAGE = [
  {
    Icon: Users,
    title: '1:1 mentorship',
    desc: 'Dedicated mentor time — roadmap, gaps, and accountability tailored to you.',
  },
  {
    Icon: Mic2,
    title: 'AI mock interviews',
    desc: 'Voice-style practice with structured feedback so you improve before the real panel.',
  },
  {
    Icon: Target,
    title: 'Interview readiness test',
    desc: 'More focused and accurate scoring aligned with how companies actually hire — not generic trivia.',
  },
  {
    Icon: MessagesSquare,
    title: 'HR preparation',
    desc: 'Behavioural rounds, stories, and how to present your profile with confidence.',
  },
  {
    Icon: Code2,
    title: 'Technical interview preparation',
    desc: 'DSA, system design, and stack depth — aligned to your target role and level.',
  },
];

const YEARS = ['2nd Year', '3rd Year', '4th Year', 'Recent Graduate', 'Working Professional'];
const ROLES = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack', 'Data / ML', 'Other'];

const STORAGE_KEY = 'mm_waitlist_count';
const JOINED_KEY  = 'mm_waitlist_joined';
const BASE_COUNT  = 50;

const getCount = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseInt(stored, 10) : BASE_COUNT;
};

export default function WaitlistPage() {
  const [count, setCount]     = useState(getCount);
  const [form, setForm]       = useState({
    name: '', phone: '', college: '', year: '', role: '', whatsapp: true,
  });
  const [errors, setErrors]   = useState({});
  const [submitted, setSubmitted] = useState(
    () => !!localStorage.getItem(JOINED_KEY)
  );
  const [loading, setLoading] = useState(false);
  const btnRef = useRef(null);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.college.trim()) e.college = 'College is required';
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 10)   e.phone   = 'Enter a valid 10-digit WhatsApp number';
    if (!form.year)            e.year    = 'Please select your year';
    if (!form.role)            e.role    = 'Please select a target role';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const fireConfetti = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight }
      : { x: 0.5, y: 0.5 };
    confetti({ particleCount: 120, spread: 80, origin, colors: ['#FF9500','#FFB347','#1A8C55','#fff'] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const payload = { ...form, score: null, source: 'waitlist_page', timestamp: new Date().toISOString() };

    // Save locally first (fallback)
    localStorage.setItem(JOINED_KEY, JSON.stringify(payload));
    const newCount = count + 1;
    localStorage.setItem(STORAGE_KEY, String(newCount));
    setCount(newCount);

    // Try API
    try {
      await fetch(`${API_BASE}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (_) { /* silent — localStorage fallback already saved */ }

    setLoading(false);
    setSubmitted(true);
    setTimeout(fireConfetti, 100);
  };

  const inputCls = (k) =>
    `w-full px-4 py-3 rounded-xl border bg-white text-foreground placeholder-[#AAAAAA] outline-none transition-all text-sm ${
      errors[k] ? 'border-red-500/50' : 'border-border hover:border-border focus:border-[#FF9500] focus:ring-2 focus:ring-[#FF9500]/25'
    }`;

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-foreground font-sans antialiased">
      <div className="max-w-3xl mx-auto px-5 pt-16 pb-24">

        {/* ── Hero ── */}
        <div className="text-center mb-10">

          {/* Pill badge */}
          <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-2 bg-[#FFF4E0] border border-[#FFB347]/40 rounded-full px-4 py-2.5 sm:px-5 mb-7 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <span className="w-2 h-2 rounded-full bg-[#1A8C55] shrink-0" style={{ animation: 'pulse 1.5s ease-in-out infinite', boxShadow: '0 0 6px rgba(26,140,85,0.5)' }} />
            <span className="text-sm font-semibold text-[#CC7000] tracking-wide">
              Mentorship program
            </span>
            <span className="w-px h-3.5 bg-[#F0ECE0]" />
            <span className="text-sm font-bold text-foreground">First batch starting April</span>
            <span className="text-xs font-semibold bg-red-500/10 text-red-600 border border-red-400/30 rounded-full px-2.5 py-0.5 leading-none">
              Limited seats
            </span>
            <span className="w-px h-3.5 bg-[#F0ECE0] hidden sm:block" />
            <span className="text-xs font-bold text-[#B45309] sm:text-sm">
              Pricing — revealing soon
            </span>
          </div>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>

          <h1 className="text-3xl md:text-4xl font-black leading-snug tracking-tight mb-4">
            Be the first to get placed with <span className="text-[#FF9500]">MentorMuni</span> — Mentorship and interview preparation.
          </h1>

          <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
            Full mentorship with AI mocks, company-aligned readiness, HR and technical prep — built for real hiring bar.
            {' '}
            <span className="text-foreground font-semibold">Pricing will be announced soon; waitlist members hear first.</span>
          </p>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {AVATARS.map(({ init, bg }) => (
                <div key={init} className={`w-8 h-8 rounded-full border-2 border-[#FFFDF8] ${bg} flex items-center justify-center text-xs font-bold text-white shadow-sm`}>
                  {init}
                </div>
              ))}
            </div>
              <p className="text-sm text-muted-foreground">
              <span className="text-[#1A8C55] font-bold">{count}+</span>
              {' '}students already on the waitlist
            </p>
          </div>
        </div>

        {/* ── What we'll cover + pricing note ── */}
        <div className="mb-10 rounded-2xl border border-[#FFB347]/35 bg-gradient-to-br from-[#FFF8EE] via-white to-[#FFFDF8] p-6 md:p-8 shadow-[0_8px_32px_-20px_rgba(234,88,12,0.15)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight">What we'll cover</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                The mentorship program is designed around how companies actually run campus and lateral hiring — not generic prep.
              </p>
            </div>
            <div className="shrink-0 rounded-xl border border-dashed border-[#FF9500]/50 bg-[#FFF4E0]/80 px-4 py-2.5 text-center sm:text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#CC7000]">Investment</p>
              <p className="text-base font-black text-foreground">Pricing revealing soon</p>
            </div>
          </div>
          <ul className="space-y-4">
            {COVERAGE.map(({ Icon, title, desc }) => (
              <li key={title} className="flex gap-3.5">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF4E0] ring-1 ring-[#FFB347]/30">
                  <Icon className="h-4 w-4 text-[#FF9500]" strokeWidth={2.25} aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm">{title}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed mt-0.5">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Form card ── */}
        <div className="bg-white border border-border rounded-2xl p-6 md:p-8 mb-12">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">You're on the list!</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                We'll WhatsApp you when mentorship opens — with pricing, launch details, and your early access link.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/start-assessment"
                  className="inline-flex items-center justify-center gap-2 bg-[#FF9500] hover:bg-[#E88600] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all"
                >
                  Take free readiness test while you wait
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold text-foreground mb-1">Join the waitlist</h2>
              <p className="text-muted-foreground text-sm mb-6">Takes 30 seconds. Spot is saved instantly.</p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Full name <span className="text-red-400">*</span></label>
                    <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                      placeholder="Priya Sharma" className={inputCls('name')} />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">WhatsApp number <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">+91</span>
                      <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="9876543210" className={`${inputCls('phone')} pl-11`} />
                    </div>
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">College name <span className="text-red-400">*</span></label>
                  <input type="text" value={form.college} onChange={e => set('college', e.target.value)}
                    placeholder="e.g. VIT Vellore, NIT Trichy, SRM Chennai" className={inputCls('college')} />
                  {errors.college && <p className="text-red-400 text-xs mt-1">{errors.college}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Year of study <span className="text-red-400">*</span></label>
                    <select value={form.year} onChange={e => set('year', e.target.value)}
                      className={`${inputCls('year')} appearance-none`}>
                      <option value="" disabled>Select year</option>
                      {YEARS.map(y => <option key={y} value={y} className="bg-white">{y}</option>)}
                    </select>
                    {errors.year && <p className="text-red-400 text-xs mt-1">{errors.year}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Target role <span className="text-red-400">*</span></label>
                    <select value={form.role} onChange={e => set('role', e.target.value)}
                      className={`${inputCls('role')} appearance-none`}>
                      <option value="" disabled>Select role</option>
                      {ROLES.map(r => <option key={r} value={r} className="bg-white">{r}</option>)}
                    </select>
                    {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role}</p>}
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.whatsapp} onChange={e => set('whatsapp', e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded accent-[#FF9500] shrink-0" />
                  <span className="text-sm text-muted-foreground">Send me updates on WhatsApp when mentorship opens</span>
                </label>

                <button ref={btnRef} type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#FF9500] hover:bg-[#E88600] disabled:opacity-60 text-white font-bold text-sm py-4 rounded-xl transition-all shadow-lg shadow-[0_4px_14px_rgba(255,149,0,0.25)] active:scale-[0.98]">
                  {loading ? 'Saving your spot…' : <>Join Waitlist — Free <ArrowRight size={16} /></>}
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  <span className="text-green-500">✓</span> No spam{'  '}
                  <span className="text-green-500">✓</span> Cancel anytime{'  '}
                  <span className="text-green-500">✓</span> Early access perks
                </p>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Questions?{' '}
          <Link to="/contact" className="font-semibold text-[#FF9500] hover:text-[#E88600] transition-colors">
            Contact us
          </Link>
        </p>

      </div>
    </div>
  );
}
