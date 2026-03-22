import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 10, lineHeight: 1.3 }}>{step.title}</h3>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.70)', lineHeight: 1.75, marginBottom: 16 }}>{step.body}</p>
        <div style={{ background: step.cardBg, border: `1px solid ${step.cardBorder}`, borderRadius: 10, padding: '14px 18px' }}>
          {step.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < step.items.length - 1 ? 9 : 0 }}>
              <span style={{ color: step.dotColor, fontSize: 16, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>•</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.70)', lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Blurred mentor teaser card ───────────────────────────── */
function MentorTeaserCard({ initials, avColor, name, role, badge, stat, lockMsg }) {
  return (
    <div style={{ background: '#0f1a30', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
      {/* Blurred inner layer */}
      <div style={{ padding: '24px 20px 20px', filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: avColor, border: '1.5px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: '#fff', flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 15, color: '#fff', marginBottom: 2 }}>{name}</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{role}</p>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '5px 10px', display: 'inline-block', fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 10 }}>
          {badge}
        </div>
        <p style={{ fontSize: 12, color: '#4ade80', fontWeight: 500 }}>{stat}</p>
      </div>

      {/* Lock overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backdropFilter: 'blur(2px)',
        background: 'rgba(5,11,24,0.75)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 10, padding: '0 20px', textAlign: 'center',
      }}>
        <span style={{ fontSize: 22 }}>🔒</span>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.60)', lineHeight: 1.5, maxWidth: 160 }}>{lockMsg}</p>
      </div>
    </div>
  );
}

/* ─── Mentor feature card ──────────────────────────────────── */
function FeatureCard({ icon, title, body }) {
  return (
    <div style={{ background: '#0f1a30', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 22px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
      <span style={{ fontSize: 26, flexShrink: 0, marginTop: 2 }}>{icon}</span>
      <div>
        <p style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 6 }}>{title}</p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>{body}</p>
      </div>
    </div>
  );
}

/* ─── Data ─────────────────────────────────────────────────── */
const TIMELINE_STEPS = [
  {
    tag: 'STEP 01', tagColor: '#818cf8', emoji: '🔍',
    circleBg: 'rgba(99,102,241,0.15)', circleBorder: 'rgba(99,102,241,0.5)',
    cardBg: 'rgba(99,102,241,0.08)', cardBorder: 'rgba(99,102,241,0.2)', dotColor: '#6366f1',
    connectorGradient: 'linear-gradient(180deg,rgba(99,102,241,0.5),rgba(236,72,153,0.5))',
    title: 'You take the free assessment',
    body: '5 questions tailored to your role and tech stack. Score across DSA, System Design, Communication, and Projects.',
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

const TEASER_CARDS = [
  { initials: 'RS', avColor: 'rgba(99,102,241,0.4)', name: 'Mentor A', role: 'Software Engineer', badge: 'Service sector · DSA · Java', stat: '12+ yrs industry exp', lockMsg: 'Take the assessment to unlock your match' },
  { initials: 'PK', avColor: 'rgba(8,145,178,0.4)', name: 'Mentor B', role: 'Frontend Developer', badge: 'Product company · React · JS', stat: '10+ yrs industry exp', lockMsg: 'Score 60–80 unlocks this mentor match' },
  { initials: 'AM', avColor: 'rgba(21,128,61,0.4)', name: 'Mentor C', role: 'Backend Engineer', badge: 'Service sector · .NET · SQL', stat: '15+ yrs industry exp', lockMsg: 'Score 80+ unlocks senior mentor match' },
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
    } catch (_) { /* best-effort */ }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div style={{ background: '#050b18', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`
        @keyframes mentors-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes mentors-amber-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>

      {/* ══════════════ SECTION 1 — HERO ══════════════ */}
      <section ref={heroRef} style={{ ...REVEAL_STYLE, paddingTop: 80, paddingBottom: 64, textAlign: 'center', padding: '80px 24px 64px' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>

          {/* Pill badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 20, padding: '5px 16px', marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', animation: 'mentors-amber-pulse 1.5s ease-in-out infinite', boxShadow: '0 0 6px #f59e0b', flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#fbbf24', letterSpacing: '0.01em' }}>Mentor matching — launching April 2025</span>
          </div>

          {/* H1 */}
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 38px)', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.15, marginBottom: 18, color: '#fff' }}>
            Your mentor is chosen by{' '}
            <span style={{ background: 'linear-gradient(90deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              your score, not by luck.
            </span>
          </h1>

          {/* Subtext */}
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.50)', lineHeight: 1.75, maxWidth: 480, margin: '0 auto' }}>
            Every student gets matched to a mentor based on their exact gaps, target role, and interview timeline. No random assignments. The right expert for your specific situation.
          </p>
        </div>
      </section>

      {/* ══════════════ SECTION 2 — HOW MATCHING WORKS ══════════════ */}
      <section ref={timelineRef} style={{ ...REVEAL_STYLE, maxWidth: 700, margin: '0 auto', padding: '0 24px 80px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', textAlign: 'center', marginBottom: 40 }}>
          How mentor matching works
        </p>
        {TIMELINE_STEPS.map((step, i) => (
          <TimelineStep key={step.tag} step={step} index={i} isLast={i === TIMELINE_STEPS.length - 1} />
        ))}
      </section>

      {/* ══════════════ SECTION 3 — BLURRED MENTOR TEASER ══════════════ */}
      <section ref={teaserRef} style={{ ...REVEAL_STYLE, padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', textAlign: 'center', marginBottom: 28 }}>
            Mentors joining the platform — April 2025
          </p>

          {/* 3-col grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
            {TEASER_CARDS.map(card => (
              <MentorTeaserCard key={card.initials} {...card} />
            ))}
          </div>

          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
            Mentors are matched after your assessment — so you always get the right fit, not whoever's available.
          </p>
        </div>
      </section>

      {/* ══════════════ SECTION 4 — WHATSAPP NOTIFY ══════════════ */}
      <section style={{ padding: '0 24px 80px', display: 'flex', justifyContent: 'center' }}>
        <div
          ref={notifyRef}
          style={{
            ...REVEAL_STYLE,
            maxWidth: 580, width: '100%',
            background: '#0f1a30',
            border: '1.5px solid rgba(99,102,241,0.3)',
            borderRadius: 14,
            padding: '32px 28px',
          }}
        >
          {/* Eyebrow */}
          <p style={{ fontSize: 12, fontWeight: 600, color: '#818cf8', marginBottom: 10, letterSpacing: '0.02em' }}>
            ✦ Get notified when your matched mentor goes live
          </p>

          {/* Title */}
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 10, lineHeight: 1.35 }}>
            Take the assessment. We'll notify you the moment your mentor match is ready.
          </h2>

          {/* Subtext */}
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.50)', lineHeight: 1.7, marginBottom: 24 }}>
            Mentors are joining in April 2025. Leave your WhatsApp — we'll message you personally when your match is available to book.
          </p>

          {/* 3-step mini flow */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
            {[
              'Take the free 5-min assessment',
              'We match you to your mentor',
              "WhatsApp when they're live",
            ].map((text, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#6366f1', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{text}</p>
              </div>
            ))}
          </div>

          {/* Form / success state */}
          {submitted ? (
            <div style={{ background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 10, padding: '16px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#4ade80', marginBottom: 4 }}>You're on the list!</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>We'll WhatsApp you when your mentor is ready.</p>
            </div>
          ) : (
            <div style={{ maxWidth: 360, margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }}>+91</span>
                  <input
                    type="tel"
                    value={wa}
                    onChange={e => { setWa(e.target.value); setErr(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleNotify()}
                    placeholder="WhatsApp number"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      paddingLeft: 42, paddingRight: 14, paddingTop: 12, paddingBottom: 12,
                      background: 'rgba(255,255,255,0.05)', border: `1px solid ${err ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.12)'}`,
                      borderRadius: 8, color: '#fff', fontSize: 14,
                      outline: 'none',
                    }}
                    maxLength={10}
                  />
                </div>
                <button
                  onClick={handleNotify}
                  disabled={loading}
                  style={{
                    background: '#6366f1', color: '#fff', border: 'none',
                    padding: '0 20px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                    cursor: loading ? 'default' : 'pointer', whiteSpace: 'nowrap',
                    opacity: loading ? 0.7 : 1, transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#4f46e5'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#6366f1'; }}
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
              <span key={t} style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ color: '#4ade80' }}>✓</span>{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ SECTION 5 — WHAT EVERY MENTOR BRINGS ══════════════ */}
      <section ref={featuresRef} style={{ ...REVEAL_STYLE, padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', textAlign: 'center', marginBottom: 28 }}>
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
          background: 'rgba(99,102,241,0.07)',
          borderTop: '1px solid rgba(99,102,241,0.15)',
          padding: '64px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            Find out who your mentor will be.
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.50)', lineHeight: 1.7, maxWidth: 400, margin: '0 auto' }}>
            Take the free assessment — 5 minutes, no signup. We'll show you your score, your gaps, and the type of mentor we'd match you with.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/start-assessment')}
              onMouseEnter={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.transform = 'scale(1)'; }}
              style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '13px 32px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s, transform 0.15s', whiteSpace: 'nowrap' }}
            >
              Check My Score — Free →
            </button>
            <button
              onClick={() => navigate('/waitlist')}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
              style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)', padding: '13px 24px', borderRadius: 9, fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s', whiteSpace: 'nowrap' }}
            >
              Join the waitlist
            </button>
          </div>

          {/* Microcopy */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
            {['Free always', '5 minutes', 'No signup'].map(t => (
              <span key={t} style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ color: '#4ade80' }}>✓</span>{t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
