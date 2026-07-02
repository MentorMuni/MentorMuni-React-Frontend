import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRIMARY_CTA_LABEL } from '../constants/brandCopy';
import RoutePageShell from './layout/RoutePageShell';
import SiteFooter from './layout/SiteFooter';

/* ─── Shared reveal helper ─────────────────────────────────── */
const REVEAL_BASE = {
  opacity: 0,
  transform: 'translateY(20px)',
  transition: 'opacity 0.5s ease, transform 0.5s ease',
};

function useReveal(delay = 0, threshold = 0.12) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}ms`;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, threshold]);
  return ref;
}

function StatCard({ icon, value, label }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '24px 16px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <p
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: 'var(--text-heading)',
          marginBottom: 6,
          letterSpacing: '-0.3px',
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{label}</p>
    </div>
  );
}

function RoleCard({ title, companies, focus }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '20px 20px',
      }}
    >
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#FF9500',
          marginBottom: 8,
        }}
      >
        TARGET ROLE
      </p>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--warning-text)', fontWeight: 500, marginBottom: 6 }}>{companies}</p>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{focus}</p>
    </div>
  );
}

function CommitRow({ bold, rest }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          flexShrink: 0,
          background: 'rgba(74,222,128,0.15)',
          border: '1px solid rgba(74,222,128,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 1,
        }}
      >
        <span style={{ color: '#4ade80', fontSize: 13, fontWeight: 700 }}>✓</span>
      </div>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
        <span style={{ color: 'var(--text-heading)', fontWeight: 600 }}>{bold}</span>
        {rest}
      </p>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--text-secondary)',
        textAlign: 'center',
        marginBottom: 28,
      }}
    >
      {children}
    </p>
  );
}

function CTAButtons({ navigate }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => navigate('/start-assessment')}
          style={{
            background: '#FF9500',
            color: 'var(--text-heading)',
            border: 'none',
            padding: '13px 32px',
            borderRadius: 9,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {PRIMARY_CTA_LABEL} →
        </button>
        <button
          type="button"
          onClick={() => navigate('/waitlist')}
          style={{
            background: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            padding: '13px 24px',
            borderRadius: 9,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Join the waitlist
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
        {['Free always', '5 minutes', 'No signup'].map((t) => (
          <span
            key={t}
            style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span style={{ color: '#4ade80' }}>✓</span>
            {t}
          </span>
        ))}
      </div>
    </>
  );
}

export default function OutcomesPage() {
  const navigate = useNavigate();

  const heroRef = useReveal(0);
  const statsRef = useReveal(50);
  const foundingRef = useReveal(0);
  const rolesRef = useReveal(0);
  const commitRef = useReveal(0);
  const ctaRef = useReveal(0);

  return (
    <RoutePageShell scope="marketing">
      <style>{`
        @keyframes ss-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media(max-width:640px){
          .ss-4col { grid-template-columns: 1fr 1fr !important; }
          .ss-3col { grid-template-columns: 1fr !important; }
          .ss-steps { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section ref={heroRef} style={{ ...REVEAL_BASE, padding: '80px 24px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(245,158,11,0.10)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: 20,
              padding: '5px 16px',
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#f59e0b',
                display: 'inline-block',
                animation: 'ss-pulse 1.5s ease-in-out infinite',
                boxShadow: '0 0 6px #f59e0b',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#fbbf24' }}>
              Founding batch — direct founder &amp; mentor access
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 38px)',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              lineHeight: 1.18,
              marginBottom: 18,
              color: 'var(--text-heading)',
            }}
          >
            Join the founding batch —{' '}
            <span
              style={{
                background: 'linear-gradient(90deg,#FF9500,#CC7000)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              locked-in lowest price, first-batch attention.
            </span>
          </h1>

          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 480, margin: '0 auto' }}>
            We are building MentorMuni with our first cohort. Students who join now get the ₹9,999 program at the lowest
            price we will ever offer, hands-on mentor time, and a direct line to the team as we publish verified outcomes
            here.
          </p>
        </div>
      </section>

      <section style={{ padding: '0 24px 72px' }}>
        <div
          ref={statsRef}
          style={{
            ...REVEAL_BASE,
            maxWidth: 840,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 14,
          }}
          className="ss-4col"
        >
          <StatCard
            icon="📋"
            value="Structured"
            label="Prep aligned to campus drives, role tracks, and typical interview rounds"
          />
          <StatCard
            icon="📊"
            value="Measurable"
            label="Readiness score and gap report — track progress with clear metrics"
          />
          <StatCard icon="👥" value="Mentors" label="1:1 sessions for doubt-clearing and strategy — not chatbot-only learning" />
          <StatCard
            icon="⚙️"
            value="AI + human"
            label="AI mock interviews and ATS-style checks; mentors review gaps and next steps"
          />
        </div>
      </section>

      <section style={{ padding: '0 24px 72px', display: 'flex', justifyContent: 'center' }}>
        <div
          ref={foundingRef}
          style={{
            ...REVEAL_BASE,
            maxWidth: 640,
            width: '100%',
            background: 'rgba(255,149,0,0.08)',
            border: '1.5px solid rgba(255,149,0,0.25)',
            borderRadius: 14,
            padding: '32px 28px',
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 600, color: '#FF9500', marginBottom: 10, letterSpacing: '0.02em' }}>
            ✦ Founding member advantages
          </p>
          <h2 style={{ fontSize: 21, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 10, lineHeight: 1.35 }}>
            Small cohort. More mentor time. Price locked before we scale.
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
            Founding students get priority mentor matching, WhatsApp access throughout prep, and the full 5-week program at
            ₹9,999 — the lowest price MentorMuni will offer. When you are placed and choose to share your story, we
            feature verified outcomes on this page.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }} className="ss-steps">
            {[
              'Take the free readiness check — know your gaps',
              'Get matched to your mentor within 24 hours',
              'Structured reps until you are interview-ready',
            ].map((text, i) => (
              <div key={text} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#FF9500',
                    color: 'var(--text-heading)',
                    fontSize: 13,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                  }}
                >
                  {i + 1}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              onClick={() => navigate('/waitlist')}
              style={{
                background: '#FF9500',
                color: 'var(--text-heading)',
                border: 'none',
                padding: '13px 36px',
                borderRadius: 9,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Join the founding batch →
            </button>
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Start free', 'No commitment', 'Founding pricing'].map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <span style={{ color: '#4ade80' }}>✓</span>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 72px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div ref={rolesRef} style={REVEAL_BASE}>
            <SectionLabel>Roles we prepare you for</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }} className="ss-3col">
              <RoleCard
                title="Software Engineer"
                companies="TCS · Cognizant · HCL · Infosys"
                focus="DSA + System Design focus"
              />
              <RoleCard
                title="Associate Consultant"
                companies="Deloitte · Capgemini · Accenture"
                focus="Technical + HR round prep"
              />
              <RoleCard
                title="Programmer Analyst"
                companies="Cognizant · Wipro · Infosys"
                focus="DSA + System Design focus"
              />
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 72px', display: 'flex', justifyContent: 'center' }}>
        <div
          ref={commitRef}
          style={{
            ...REVEAL_BASE,
            maxWidth: 640,
            width: '100%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '32px 28px',
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-heading)', textAlign: 'center', marginBottom: 24 }}>
            Our commitment to every founding student
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CommitRow bold="Mentor matched in 24 hours" rest=" based on your exact score and role." />
            <CommitRow bold="WhatsApp access throughout —" rest=" reachable all week, not just in sessions." />
            <CommitRow bold="Full support until you're placed —" rest=" mentorship continues until you receive your offer." />
            <CommitRow
              bold="Verified outcomes published here —"
              rest=" when you are placed and opt in, we share your journey on this page."
            />
          </div>
        </div>
      </section>

      <section
        ref={ctaRef}
        style={{
          ...REVEAL_BASE,
          background: 'rgba(255,149,0,0.07)',
          borderTop: '1px solid rgba(255,149,0,0.15)',
          padding: '64px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 460, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 12 }}>
            Start with your score. Join when the gap is real.
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Take the free readiness check. See your gaps. Then decide if the founding batch is right for you.
          </p>
          <CTAButtons navigate={navigate} />
        </div>
      </section>

      <SiteFooter />
    </RoutePageShell>
  );
}
