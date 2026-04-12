import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRIMARY_CTA_LABEL, MENTORSHIP_TRUST_BADGE } from '../constants/brandCopy';

/* ─── Scroll-reveal hook ───────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

const REVEAL_STYLE = {
  opacity: 0,
  transform: 'translateY(20px)',
  transition: 'opacity 0.55s ease, transform 0.55s ease',
};

/* ─── Timeline step ────────────────────────────────────────── */
function TimelineStep({ step, index, isLast }) {
  const rowRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const el = rowRef.current;
    const line = lineRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          if (line) setTimeout(() => { line.style.height = line.dataset.h || '80px'; }, 300);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    line.dataset.h = `${line.scrollHeight || 80}px`;
    line.style.height = '0px';
  }, []);

  return (
    <div
      ref={rowRef}
      style={{ opacity: 0, transform: 'translateY(24px)', transition: `opacity 0.5s ease ${index * 120}ms, transform 0.5s ease ${index * 120}ms`, display: 'flex', gap: 0 }}
    >
      {/* Left: circle + line */}
      <div style={{ width: 64, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 52, height: 52, minHeight: 52, borderRadius: '50%',
          background: step.circleBg, border: `1.5px solid ${step.circleBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, flexShrink: 0,
        }}>
          {step.emoji}
        </div>
        {!isLast && (
          <div ref={lineRef} style={{
            width: 2, background: step.connectorGradient,
            transition: 'height 0.4s ease 0.3s', overflow: 'hidden',
            flexGrow: 1, minHeight: 60,
          }} />
        )}
      </div>

      {/* Right: content */}
      <div style={{ paddingLeft: 20, paddingBottom: isLast ? 0 : 48, flex: 1, minWidth: 0 }}>
        <p style={{ color: step.tagColor, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6, marginTop: 12 }}>
          {step.tag}
        </p>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 10, lineHeight: 1.3 }}>{step.title}</h3>
        <p style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.75, marginBottom: 16 }}>{step.body}</p>
        <div style={{ background: step.cardBg, border: `1px solid ${step.cardBorder}`, borderRadius: 10, padding: '14px 18px' }}>
          {step.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < step.items.length - 1 ? 9 : 0 }}>
              <span style={{ color: step.dotColor, fontSize: 16, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>•</span>
              <span style={{ fontSize: 13, color: 'var(--text-body)', lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Mentor profile card — circular blurred portrait + pills ─ */
function MentorProfileCard({ name, experience, companies, tag, gradient }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#EDE8DD] bg-white p-5 shadow-[0_2px_20px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FFB347]/45 hover:shadow-[0_14px_40px_rgba(255,149,0,0.12)]">
      <div className="flex gap-4">
        <div
          className="relative h-[5.25rem] w-[5.25rem] shrink-0 overflow-hidden rounded-full ring-[3px] ring-[#FFF4E0] shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
          aria-hidden
        >
          <div
            className="absolute -inset-8 scale-125"
            style={{ background: gradient, filter: 'blur(16px)' }}
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-neutral-900/25"
            aria-hidden
          />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="text-[1.0625rem] font-bold leading-tight tracking-tight text-[#1a1a1a]">{name}</h3>
          <p className="mt-1 text-sm font-semibold text-[#C2410C]">{experience} experience</p>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Previously at
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {companies.map((c) => (
          <span
            key={c}
            className="inline-flex rounded-full border border-[#FF9500]/25 bg-[#FFF4E0]/90 px-2.5 py-1 text-[11px] font-semibold text-[#9A3412]"
          >
            {c}
          </span>
        ))}
      </div>
      <p className="mt-4 border-t border-[#F0ECE0] pt-3 text-[13px] leading-relaxed text-muted-foreground">{tag}</p>
    </article>
  );
}

/* ─── Mentor feature card ──────────────────────────────────── */
function FeatureCard({ icon, title, body }) {
  return (
    <div style={{ background: '#ffffff', border: '1px solid #f0ece0', borderRadius: 12, padding: '20px 22px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
      <span style={{ fontSize: 26, flexShrink: 0, marginTop: 2 }}>{icon}</span>
      <div>
        <p style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', marginBottom: 6 }}>{title}</p>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{body}</p>
      </div>
    </div>
  );
}

/* ─── Data ─────────────────────────────────────────────────── */
const TIMELINE_STEPS = [
  {
    tag: 'STEP 01', tagColor: '#FF9500', emoji: '🔍',
    circleBg: 'rgba(99,102,241,0.15)', circleBorder: 'rgba(99,102,241,0.5)',
    cardBg: 'rgba(99,102,241,0.08)', cardBorder: 'rgba(99,102,241,0.2)', dotColor: '#FF9500',
    connectorGradient: 'linear-gradient(180deg,rgba(99,102,241,0.5),rgba(236,72,153,0.5))',
    title: 'You take the free assessment',
    body: 'Questions tailored to your role and tech stack. Score across DSA, System Design, Communication, and Projects.',
    items: [
      'Score 80+ → matched to senior engineer mentor for advanced prep',
      'Score 50–79 → matched to recently placed mentor who fixed same gaps',
      'Score below 50 → matched to mentor specialising in foundations',
    ],
  },
  {
    tag: 'STEP 02', tagColor: '#ec4899', emoji: '🤖',
    circleBg: 'rgba(236,72,153,0.15)', circleBorder: 'rgba(236,72,153,0.5)',
    cardBg: 'rgba(236,72,153,0.08)', cardBorder: 'rgba(236,72,153,0.2)', dotColor: '#ec4899',
    connectorGradient: 'linear-gradient(180deg,rgba(236,72,153,0.5),rgba(74,222,128,0.5))',
    title: 'AI identifies your exact mentor fit',
    body: 'Your score, role, target companies, and interview timeline feed our matching system — not a random pick from a list.',
    items: [
      'Matches on role + gaps + target company type',
      'Prioritises mentors from your college tier',
      'Considers your interview date — urgent vs relaxed timeline',
    ],
  },
  {
    tag: 'STEP 03', tagColor: '#4ade80', emoji: '🎯',
    circleBg: 'rgba(74,222,128,0.15)', circleBorder: 'rgba(74,222,128,0.5)',
    cardBg: 'rgba(74,222,128,0.08)', cardBorder: 'rgba(74,222,128,0.2)', dotColor: '#4ade80',
    connectorGradient: null,
    title: 'You meet your mentor — they already know your gaps',
    body: 'Your mentor receives your full score report before session one. No wasted time. Week-by-week roadmap built in the first call.',
    items: [
      'Mentor reviews your score before you even meet',
      'Week-by-week roadmap built in session one',
      'WhatsApp access throughout — not just session time',
    ],
  },
];

/** Representative profiles — soft gradients behind blur (no harsh rainbow strips) */
const MENTOR_PROFILES = [
  {
    name: 'Mohit J',
    experience: '14 years',
    companies: ['Nagarro', 'Persistent'],
    tag: 'Enterprise delivery and engineering leadership — deep MNC services experience.',
    gradient: 'linear-gradient(145deg, #94a3b8 0%, #64748b 40%, #475569 100%)',
  },
  {
    name: 'Ananya K',
    experience: '12 years',
    companies: ['Infosys', 'Razorpay'],
    tag: 'Scaled systems at a large IT major, then product engineering at a fintech.',
    gradient: 'linear-gradient(150deg, #5eead4 0%, #2dd4bf 45%, #0d9488 100%)',
  },
  {
    name: 'Rohan S',
    experience: '15 years',
    companies: ['Accenture', 'Swiggy'],
    tag: 'Consulting and delivery backgrounds, then high-pace consumer product teams.',
    gradient: 'linear-gradient(145deg, #fdba74 0%, #fb923c 42%, #ea580c 100%)',
  },
];

const FEATURE_CARDS = [
  { icon: '🏢', title: '10–15 years in the industry', body: 'Our mentors are senior engineers and tech leads. They\'ve been the interviewer — so they know exactly what the panel is actually evaluating.' },
  { icon: '📊', title: 'Sees your score first', body: 'Your gap report is shared before session one. No wasted time — they arrive with a plan already built.' },
  { icon: '💬', title: 'WhatsApp throughout', body: 'Not just 1-hour sessions. Reachable on WhatsApp for quick doubts, mock Q&A, and morale support.' },
  { icon: '🏆', title: 'Stays till you\'re placed', body: "Your mentor's job isn't done at end of programme — they stay through offers, follow-ups, and negotiations." },
];

/* ─── Main component ───────────────────────────────────────── */
export default function Mentors() {
  const navigate = useNavigate();
  const heroRef = useReveal(0.1);
  const timelineRef = useReveal(0.05);
  const teaserRef = useReveal(0.05);
  const notifyRef = useReveal(0.1);
  const featuresRef = useReveal(0.1);
  const ctaRef = useReveal(0.1);

  const [wa, setWa] = useState('');
  const [submitted, setSubmitted] = useState(() => !!localStorage.getItem('mentor_notify_wa'));
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNotify = async () => {
    const digits = wa.replace(/\D/g, '');
    if (digits.length !== 10) { setErr('Enter a valid 10-digit WhatsApp number'); return; }
    setErr('');
    setLoading(true);
    localStorage.setItem('mentor_notify_wa', digits);
    try {
      await fetch('/api/mentor-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp: digits, timestamp: new Date().toISOString() }),
      });
    } catch { /* best-effort */ }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fffdf8] font-sans text-foreground antialiased">
      <style>{`
        @keyframes mentors-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes mentors-amber-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>

      {/* ══════════════ SECTION 1 — HERO ══════════════ */}
      <section ref={heroRef} style={{ ...REVEAL_STYLE, paddingTop: 80, paddingBottom: 64, textAlign: 'center', padding: '80px 24px 64px' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>

          {/* Pill badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255, 149, 0, 0.12)', border: '1px solid rgba(180, 83, 9, 0.35)', borderRadius: 20, padding: '5px 16px', marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ea580c', display: 'inline-block', animation: 'mentors-amber-pulse 1.5s ease-in-out infinite', boxShadow: '0 0 6px rgba(234, 88, 12, 0.6)', flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#9A3412', letterSpacing: '0.01em' }}>Mentor matching · {MENTORSHIP_TRUST_BADGE}</span>
          </div>

          {/* H1 */}
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 38px)', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.15, marginBottom: 18, color: '#1a1a1a' }}>
            Your mentor is chosen by{' '}
            <span style={{ background: 'linear-gradient(90deg,#FF9500,#CC7000)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              your score, not by luck.
            </span>
          </h1>

          {/* Subtext */}
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 480, margin: '0 auto' }}>
            Every student gets matched to a mentor based on their exact gaps, target role, and interview timeline. No random assignments. The right expert for your specific situation.
          </p>
        </div>
      </section>

      {/* ══════════════ SECTION 2 — MENTOR PROFILES (blurred photos) ══════════════ */}
      <section
        ref={teaserRef}
        className="border-y border-[#EDE8DD]/90 bg-gradient-to-b from-[#FFFBF5] via-white to-[#FFFBF5] px-5 py-14 sm:px-6 md:py-16"
        style={REVEAL_STYLE}
      >
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#CC7000]">
            Know your mentors
          </p>
          <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-[#1a1a1a] md:text-[1.65rem] md:leading-snug">
            <span className="bg-gradient-to-r from-[#FF9500] to-[#D97706] bg-clip-text text-transparent">
              They&apos;ve sat on interview panels.
            </span>
            <br className="hidden sm:block" />
            <span className="text-[#1a1a1a]"> Now they&apos;re coaching you through yours.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-muted-foreground md:text-[15px]">
            These are the people in your corner: they spot what interviewers actually test, tighten your stories and tech depth,
            run you through realistic pressure — and push you until you walk into the room ready to convert that effort into
            offers.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {MENTOR_PROFILES.map((m) => (
              <MentorProfileCard key={m.name} {...m} />
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-md text-center text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-[#9A3412]">MentorMuni batches starting soon.</span>{' '}
            From first gap analysis to mock panels and offer prep — your mentor&apos;s job is to get you placement-ready, not
            just &ldquo;more studied.&rdquo;
          </p>
        </div>
      </section>

      {/* ══════════════ SECTION 3 — HOW MATCHING WORKS ══════════════ */}
      <section ref={timelineRef} style={{ ...REVEAL_STYLE, maxWidth: 700, margin: '0 auto', padding: '48px 24px 80px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888888', textAlign: 'center', marginBottom: 40 }}>
          How mentor matching works
        </p>
        {TIMELINE_STEPS.map((step, i) => (
          <TimelineStep key={step.tag} step={step} index={i} isLast={i === TIMELINE_STEPS.length - 1} />
        ))}
      </section>

      {/* ══════════════ SECTION 4 — WHATSAPP NOTIFY ══════════════ */}
      <section style={{ padding: '0 24px 80px', display: 'flex', justifyContent: 'center' }}>
        <div
          ref={notifyRef}
          style={{
            ...REVEAL_STYLE,
            maxWidth: 580, width: '100%',
            background: '#ffffff',
            border: '1.5px solid rgba(255,149,0,0.35)',
            borderRadius: 14,
            padding: '32px 28px',
          }}
        >
          {/* Eyebrow */}
          <p style={{ fontSize: 12, fontWeight: 600, color: '#FF9500', marginBottom: 10, letterSpacing: '0.02em' }}>
            ✦ Get notified when your matched mentor goes live
          </p>

          {/* Title */}
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 10, lineHeight: 1.35 }}>
            Take the assessment. We'll notify you the moment your mentor match is ready.
          </h2>

          {/* Subtext */}
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
            Leave your WhatsApp — we&apos;ll message you when your matched mentor is available to book.
          </p>

          {/* 3-step mini flow */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
            {[
              'Take the free 5-min assessment',
              'We match you to your mentor',
              "WhatsApp when they're live",
            ].map((text, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FF9500', color: '#1a1a1a', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</p>
              </div>
            ))}
          </div>

          {/* Form / success state */}
          {submitted ? (
            <div style={{ background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 10, padding: '16px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#4ade80', marginBottom: 4 }}>You're on the list!</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>We'll WhatsApp you when your mentor is ready.</p>
            </div>
          ) : (
            <div style={{ maxWidth: 360, margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#777777', pointerEvents: 'none' }}>+91</span>
                  <input
                    type="tel"
                    value={wa}
                    onChange={e => { setWa(e.target.value); setErr(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleNotify()}
                    placeholder="WhatsApp number"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      paddingLeft: 42, paddingRight: 14, paddingTop: 12, paddingBottom: 12,
                      background: '#ffffff', border: `1px solid ${err ? 'rgba(248,113,113,0.6)' : '#F0ECE0'}`,
                      borderRadius: 8, color: '#1a1a1a', fontSize: 14,
                      outline: 'none',
                    }}
                    maxLength={10}
                  />
                </div>
                <button
                  onClick={handleNotify}
                  disabled={loading}
                  style={{
                    background: '#FF9500', color: '#1a1a1a', border: 'none',
                    padding: '0 20px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                    cursor: loading ? 'default' : 'pointer', whiteSpace: 'nowrap',
                    opacity: loading ? 0.7 : 1, transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#E88600'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#FF9500'; }}
                >
                  {loading ? '...' : 'Notify me →'}
                </button>
              </div>
              {err && <p style={{ fontSize: 12, color: '#f87171', marginTop: 6 }}>{err}</p>}
            </div>
          )}

          {/* Microcopy */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 16, flexWrap: 'wrap' }}>
            {['No spam', 'One message only', 'Free always'].map(t => (
              <span key={t} style={{ fontSize: 12, color: '#888888', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ color: '#4ade80' }}>✓</span>{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ SECTION 5 — WHAT EVERY MENTOR BRINGS ══════════════ */}
      <section ref={featuresRef} style={{ ...REVEAL_STYLE, padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888888', textAlign: 'center', marginBottom: 28 }}>
            What every mentor brings
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
            {FEATURE_CARDS.map(c => <FeatureCard key={c.title} {...c} />)}
          </div>
        </div>
      </section>

      {/* ══════════════ SECTION 6 — BOTTOM CTA ══════════════ */}
      <section
        ref={ctaRef}
        style={{
          ...REVEAL_STYLE,
          background: 'rgba(255,149,0,0.06)',
          borderTop: '1px solid rgba(255,149,0,0.15)',
          padding: '64px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>
            Find out who your mentor will be.
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 400, margin: '0 auto' }}>
            Take the free assessment — 5 minutes, no signup. We'll show you your score, your gaps, and the type of mentor we'd match you with.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => navigate('/start-assessment')}
              onMouseEnter={e => { e.currentTarget.style.background = '#E88600'; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FF9500'; e.currentTarget.style.transform = 'scale(1)'; }}
              style={{ background: '#FF9500', color: '#ffffff', border: 'none', padding: '13px 32px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s, transform 0.15s', whiteSpace: 'nowrap' }}
            >
              {PRIMARY_CTA_LABEL} →
            </button>
            <button
              type="button"
              onClick={() => navigate('/waitlist')}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFB347'; e.currentTarget.style.color = '#CC7000'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#F0ECE0'; e.currentTarget.style.color = '#666666'; }}
              style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid #F0ECE0', padding: '13px 24px', borderRadius: 9, fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s', whiteSpace: 'nowrap' }}
            >
              Join the waitlist
            </button>
          </div>

          {/* Microcopy */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
            {['Free always', '5 minutes', 'No signup'].map(t => (
              <span key={t} style={{ fontSize: 12, color: '#888888', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ color: '#4ade80' }}>✓</span>{t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
