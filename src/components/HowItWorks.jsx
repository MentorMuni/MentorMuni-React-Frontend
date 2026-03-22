import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Data ─────────────────────────────────────────────────── */
const STEPS = [
  {
    number: 'STEP 01',
    numberColor: '#818cf8',
    title: 'Know exactly where you stand',
    body: "Take the 5-minute AI assessment. Get a score across DSA, System Design, Communication, and Projects. No guessing. No vague feedback. A precise map of where you're strong and where you'll lose offers.",
    emoji: '🔍',
    circleBg: 'rgba(99,102,241,0.15)',
    circleBorder: 'rgba(99,102,241,0.5)',
    cardBg: 'rgba(99,102,241,0.08)',
    cardBorder: 'rgba(99,102,241,0.2)',
    dotColor: '#6366f1',
    items: [
      { bold: 'Readiness score', rest: ' across 4 categories' },
      { bold: null, rest: '3 critical gaps identified with specific fixes' },
      { bold: null, rest: 'Takes 5 minutes · Free · No signup needed' },
    ],
    connectorGradient: 'linear-gradient(180deg, rgba(99,102,241,0.5), rgba(139,92,246,0.5))',
  },
  {
    number: 'STEP 02',
    numberColor: '#a78bfa',
    title: 'Get matched with the right mentor',
    body: "Based on your score, role, and target companies, we match you with a mentor who fits your exact gaps and timeline — not a random assignment from a list.",
    emoji: '🧑‍💼',
    circleBg: 'rgba(139,92,246,0.15)',
    circleBorder: 'rgba(139,92,246,0.5)',
    cardBg: 'rgba(139,92,246,0.08)',
    cardBorder: 'rgba(139,92,246,0.2)',
    dotColor: '#a78bfa',
    items: [
      { bold: null, rest: 'Mentor matched to your role + target stack' },
      { bold: null, rest: 'WhatsApp access — ask anything, anytime' },
      { bold: null, rest: 'Industry professionals with 10+ years experience' },
    ],
    connectorGradient: 'linear-gradient(180deg, rgba(139,92,246,0.5), rgba(236,72,153,0.5))',
  },
  {
    number: 'STEP 03',
    numberColor: '#ec4899',
    title: "Practice until you're genuinely ready",
    body: 'AI mock interviews tailored to your role and gaps. Then a live real interview with an industry engineer — the closest thing to the actual experience without the consequences. Your mentor reviews every session and tells you exactly what to fix.',
    emoji: '🤖',
    circleBg: 'rgba(236,72,153,0.15)',
    circleBorder: 'rgba(236,72,153,0.5)',
    cardBg: 'rgba(236,72,153,0.08)',
    cardBorder: 'rgba(236,72,153,0.2)',
    dotColor: '#ec4899',
    items: [
      { bold: null, rest: 'Unlimited AI mock interviews — instant feedback' },
      { bold: null, rest: '1 live interview with a real industry engineer' },
      { bold: null, rest: 'Resume + LinkedIn reviewed and rewritten' },
    ],
    connectorGradient: 'linear-gradient(180deg, rgba(236,72,153,0.5), rgba(74,222,128,0.5))',
  },
  {
    number: 'STEP 04',
    numberColor: '#4ade80',
    title: 'Apply with confidence. Get placed.',
    body: "Your mentor stays with you through applications, follow-ups, and offer negotiation. You don't walk into interviews alone anymore. We support you until you get the offer.",
    emoji: '🎯',
    circleBg: 'rgba(74,222,128,0.15)',
    circleBorder: 'rgba(74,222,128,0.5)',
    cardBg: 'rgba(74,222,128,0.08)',
    cardBorder: 'rgba(74,222,128,0.2)',
    dotColor: '#4ade80',
    items: [
      { bold: null, rest: 'Placement support until you receive an offer' },
      { bold: null, rest: 'Salary negotiation coaching before you accept' },
      { bold: null, rest: 'Average 6 weeks to first offer letter' },
    ],
    connectorGradient: null,
  },
];

/* ─── Intersection Observer hook ───────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.revealed = 'true';
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}

/* ─── Step row component ────────────────────────────────────── */
function StepRow({ step, index, isLast }) {
  const rowRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const el = rowRef.current;
    const line = lineRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          if (line) {
            setTimeout(() => {
              line.style.height = line.dataset.fullHeight || '0px';
            }, 300);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* measure connector height after first paint */
  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    const naturalHeight = line.scrollHeight;
    line.dataset.fullHeight = `${naturalHeight}px`;
    line.style.height = '0px';
  }, []);

  return (
    <div
      ref={rowRef}
      style={{
        opacity: 0,
        transform: 'translateY(24px)',
        transition: `opacity 0.5s ease ${index * 100}ms, transform 0.5s ease ${index * 100}ms`,
      }}
      className="flex gap-0"
    >
      {/* ── Left column: circle + connector ── */}
      <div className="flex flex-col items-center" style={{ width: 64, flexShrink: 0 }}>
        {/* Circle */}
        <div
          style={{
            width: 56,
            height: 56,
            minHeight: 56,
            borderRadius: '50%',
            background: step.circleBg,
            border: `1.5px solid ${step.circleBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {step.emoji}
        </div>

        {/* Connector line */}
        {!isLast && (
          <div
            ref={lineRef}
            style={{
              width: 2,
              background: step.connectorGradient,
              transition: 'height 0.4s ease 0.3s',
              overflow: 'hidden',
              flexGrow: 1,
              minHeight: 60,
            }}
          />
        )}
      </div>

      {/* ── Right column: content ── */}
      <div style={{ paddingLeft: 20, paddingBottom: isLast ? 0 : 48, flex: 1, minWidth: 0 }}>
        {/* Step number label */}
        <p
          style={{
            color: step.numberColor,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 6,
            marginTop: 14,
          }}
        >
          {step.number}
        </p>

        {/* Title */}
        <h3
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: 10,
            lineHeight: 1.3,
          }}
        >
          {step.title}
        </h3>

        {/* Body */}
        <p
          style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.70)',
            lineHeight: 1.75,
            marginBottom: 16,
          }}
        >
          {step.body}
        </p>

        {/* Detail card */}
        <div
          style={{
            background: step.cardBg,
            border: `1px solid ${step.cardBorder}`,
            borderRadius: 10,
            padding: '14px 18px',
          }}
        >
          {step.items.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                marginBottom: i < step.items.length - 1 ? 9 : 0,
              }}
            >
              <span
                style={{
                  color: step.dotColor,
                  fontSize: 16,
                  lineHeight: 1,
                  marginTop: 2,
                  flexShrink: 0,
                }}
              >
                •
              </span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.70)', lineHeight: 1.6 }}>
                {item.bold ? (
                  <>
                    <strong style={{ color: '#ffffff', fontWeight: 600 }}>{item.bold}</strong>
                    {item.rest}
                  </>
                ) : (
                  item.rest
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────── */
export default function HowItWorks() {
  const navigate = useNavigate();
  const heroRef = useReveal(0.1);
  const testimonialRef = useReveal(0.1);
  const ctaRef = useReveal(0.1);

  return (
    <div style={{ background: '#050b18', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Global pulse keyframe */}
      <style>{`
        @keyframes hiw-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        .hiw-reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .hiw-reveal[data-revealed="true"] {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* ═══════════════ HERO ═══════════════ */}
      <section
        ref={heroRef}
        className="hiw-reveal"
        style={{ paddingTop: 80, paddingBottom: 60, textAlign: 'center', paddingLeft: 24, paddingRight: 24 }}
      >
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          {/* Eyebrow pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 20,
              padding: '4px 16px',
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#4ade80',
                display: 'inline-block',
                animation: 'hiw-pulse 1.5s ease-in-out infinite',
                flexShrink: 0,
              }}
            />
            <span style={{ color: '#a78bfa', fontSize: 12, fontWeight: 500, letterSpacing: '0.01em' }}>
              Your path from assessment to offer letter
            </span>
          </div>

          {/* H1 */}
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 36px)',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              lineHeight: 1.15,
              marginBottom: 18,
              color: '#ffffff',
            }}
          >
            Four steps.{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #6366f1, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Six weeks.
            </span>{' '}
            Your first offer.
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontSize: 15,
              color: 'rgba(255,255,255,0.50)',
              lineHeight: 1.7,
              maxWidth: 480,
              margin: '0 auto',
            }}
          >
            Here's exactly what happens after you take the free assessment — and how MentorMuni's mentors guide you to your first tech job.
          </p>
        </div>
      </section>

      {/* ═══════════════ TIMELINE ═══════════════ */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 80px' }}>
        {STEPS.map((step, i) => (
          <StepRow key={step.number} step={step} index={i} isLast={i === STEPS.length - 1} />
        ))}
      </section>

      {/* ═══════════════ TESTIMONIAL STRIP ═══════════════ */}
      <section style={{ padding: '0 24px 80px', display: 'flex', justifyContent: 'center' }}>
        <div
          ref={testimonialRef}
          className="hiw-reveal"
          style={{
            maxWidth: 600,
            width: '100%',
            background: '#0f1a30',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14,
            padding: '28px 28px 24px',
            position: 'relative',
          }}
        >
          {/* Big quote mark */}
          <div
            style={{
              color: '#6366f1',
              fontSize: 48,
              lineHeight: 1,
              fontFamily: 'Georgia, serif',
              marginBottom: 12,
              userSelect: 'none',
            }}
          >
            "
          </div>

          {/* Quote */}
          <p
            style={{
              fontSize: 15,
              color: 'rgba(255,255,255,0.80)',
              lineHeight: 1.7,
              marginBottom: 20,
              fontStyle: 'italic',
            }}
          >
            After the skill gap analysis I finally knew exactly what to focus on. The AI mock interviews gave me feedback I'd never gotten from seniors or online practice — specific, uncomfortable, and actually useful.
          </p>

          {/* Person row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: '#1e3a5f', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 13, fontWeight: 600, flexShrink: 0,
              }}
            >
              V
            </div>
            <div>
              <span style={{ fontWeight: 500, color: '#ffffff', fontSize: 14 }}>4th year student</span>
              <span style={{ color: 'rgba(255,255,255,0.40)', fontSize: 13, marginLeft: 6 }}>VIT Vellore</span>
            </div>
            <div
              style={{
                background: 'rgba(99,102,241,0.12)', color: '#a78bfa',
                borderRadius: 6, fontSize: 11, padding: '2px 10px',
                fontWeight: 500, marginLeft: 'auto', whiteSpace: 'nowrap',
              }}
            >
              Beta tester · placement outcome in progress
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ BOTTOM CTA ═══════════════ */}
      <section
        ref={ctaRef}
        className="hiw-reveal"
        style={{
          background: 'rgba(99,102,241,0.07)',
          borderTop: '1px solid rgba(99,102,241,0.15)',
          padding: '64px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: 14,
            }}
          >
            Start with the free assessment.
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.50)',
              fontSize: 14,
              lineHeight: 1.7,
              maxWidth: 400,
              margin: '0 auto',
            }}
          >
            Know where you stand in 5 minutes. No signup. No cost. No pressure. Then decide if mentorship is right for you.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 12,
              marginTop: 28,
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => navigate('/start-assessment')}
              onMouseEnter={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.transform = 'scale(1)'; }}
              style={{
                background: '#6366f1',
                color: '#ffffff',
                border: 'none',
                padding: '13px 32px',
                borderRadius: 9,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.15s ease, transform 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              Check My Score — Free →
            </button>
            <button
              onClick={() => navigate('/waitlist')}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
              style={{
                background: 'transparent',
                color: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.12)',
                padding: '13px 24px',
                borderRadius: 9,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'border-color 0.15s ease, color 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              Join the waitlist
            </button>
          </div>

          {/* Microcopy */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 20,
              marginTop: 16,
              flexWrap: 'wrap',
            }}
          >
            {['Free always', '5 minutes', 'No signup'].map(item => (
              <span key={item} style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ color: '#4ade80' }}>✓</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
