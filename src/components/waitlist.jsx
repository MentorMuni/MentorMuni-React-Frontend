import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Zap, Users, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

const API_BASE = import.meta.env.VITE_API_URL || '';

const AVATARS = [
  { init: 'P', bg: 'bg-[#FF9500]' },
  { init: 'R', bg: 'bg-[#FFB347]' },
  { init: 'A', bg: 'bg-blue-500' },
  { init: 'S', bg: 'bg-purple-500' },
  { init: 'V', bg: 'bg-teal-500' },
];

const PERKS = [
  { emoji: '🤖', title: 'AI Mock Interviews', desc: 'Unlimited practice with instant AI feedback on your answers.' },
  { emoji: '🧑‍💼', title: 'Real Expert Sessions', desc: 'Live interview simulation with an industry engineer — not just practice.' },
  { emoji: '🎓', title: 'Placed Student Stories', desc: 'Sessions from students placed in the last 6 months. Real playbook, not theory.' },
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
      errors[k] ? 'border-red-500/50' : 'border-[#E0DCCF] hover:border-[#E0DCCF] focus:border-[#FF9500] focus:ring-2 focus:ring-[#FF9500]/25'
    }`;

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-foreground font-sans antialiased">
      <div className="max-w-3xl mx-auto px-5 pt-16 pb-24">

        {/* ── Hero ── */}
        <div className="text-center mb-10">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2.5 bg-[#FFF4E0] border border-[#FFB347]/40 rounded-full px-5 py-2 mb-7 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <span className="w-2 h-2 rounded-full bg-[#1A8C55] shrink-0" style={{ animation: 'pulse 1.5s ease-in-out infinite', boxShadow: '0 0 6px rgba(26,140,85,0.5)' }} />
            <span className="text-sm font-semibold text-[#CC7000] tracking-wide">
              Mentorship program
            </span>
            <span className="w-px h-3.5 bg-[#F0ECE0]" />
            <span className="text-sm font-bold text-foreground">First batch starting April</span>
            <span className="text-xs font-semibold bg-red-500/10 text-red-600 border border-red-400/30 rounded-full px-2.5 py-0.5 leading-none">
              Limited seats
            </span>
          </div>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>

          <h1 className="text-3xl md:text-4xl font-black leading-snug tracking-tight mb-4">
            Be the first to get placed with <span className="text-[#FF9500]">MentorMuni</span> — Mentorship and interview preparation.
          </h1>

          <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto">
            Full 1-on-1 mentorship, AI mock interviews, sessions from placed students,
            and a direct path to your first offer.{' '}
            <span className="text-foreground font-semibold">Early access students get 30% off.</span>
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

        {/* ── Form card ── */}
        <div className="bg-white border border-[#F0ECE0] rounded-2xl p-6 md:p-8 mb-12">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">You're on the list!</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                We'll WhatsApp you the moment mentorship opens — with your early access link and 30% discount.
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

                <p className="text-center text-xs text-foreground-muted">
                  <span className="text-green-500">✓</span> No spam{'  '}
                  <span className="text-green-500">✓</span> Cancel anytime{'  '}
                  <span className="text-green-500">✓</span> Early access perks
                </p>
              </form>
            </>
          )}
        </div>

        {/* ── What you unlock ── */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium text-center mb-5">What you unlock when mentorship opens</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PERKS.map(({ emoji, title, desc }) => (
              <div key={title} className="bg-white border border-[#F0ECE0] rounded-xl p-5">
                <div className="text-2xl mb-3">{emoji}</div>
                <h3 className="font-semibold text-foreground text-sm mb-1.5">{title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
