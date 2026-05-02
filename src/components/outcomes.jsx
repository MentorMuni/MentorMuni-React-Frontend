import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PRIMARY_CTA_LABEL } from '../constants/brandCopy';

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
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, threshold]);
  return ref;
}

/* ─── Stat card ────────────────────────────────────────────── */
function StatCard({ icon, value, label }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '24px 16px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <p style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', marginBottom: 6, letterSpacing: '-0.3px' }}>{value}</p>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{label}</p>
    </div>
  );
}

/* ─── Beta feedback card ───────────────────────────────────── */
function FeedbackCard({ quote, initial, avBg, name }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '24px 22px',
    }}>
      <p style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic' }}>
        "{quote}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%', background: avBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 14, color: '#1a1a1a', flexShrink: 0,
        }}>
          {initial}
        </div>
        <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)' }}>{name}</p>
      </div>
    </div>
  );
}

/* ─── Role card ────────────────────────────────────────────── */
function RoleCard({ title, companies, focus }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '20px 20px',
    }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FF9500', marginBottom: 8 }}>
        TARGET ROLE
      </p>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 13, color: '#CC7000', fontWeight: 500, marginBottom: 6 }}>{companies}</p>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{focus}</p>
    </div>
  );
}

/* ─── Commitment row ───────────────────────────────────────── */
function CommitRow({ bold, rest }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
      <div style={{
        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
      }}>
        <span style={{ color: '#4ade80', fontSize: 13, fontWeight: 700 }}>✓</span>
      </div>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
        <span style={{ color: '#1a1a1a', fontWeight: 600 }}>{bold}</span>{rest}
      </p>
    </div>
  );
}

/* ─── Shared section label ─────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
      textTransform: 'uppercase', color: '#888888',
      textAlign: 'center', marginBottom: 28,
    }}>
      {children}
    </p>
  );
}

/* ─── CTA buttons shared ───────────────────────────────────── */
function CTAButtons({ navigate }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/start-assessment')}
          onMouseEnter={e => { e.currentTarget.style.background = '#FF9500'; e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#FF9500'; e.currentTarget.style.transform = 'scale(1)'; }}
          style={{ background: '#FF9500', color: '#1a1a1a', border: 'none', padding: '13px 32px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s, transform 0.15s', whiteSpace: 'nowrap' }}
        >
          {PRIMARY_CTA_LABEL} →
        </button>
        <button
          type="button"
          onClick={() => navigate('/waitlist')}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFB347'; e.currentTarget.style.color = '#CC7000'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = '#666666'; }}
          style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', padding: '13px 24px', borderRadius: 9, fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s', whiteSpace: 'nowrap' }}
        >
          Join the waitlist
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
        {['Free always', '5 minutes', 'No signup'].map(t => (
          <span key={t} style={{ fontSize: 12, color: '#888888', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ color: '#4ade80' }}>✓</span>{t}
          </span>
        ))}
      </div>
    </>
  );
}

/* ─── Main page ─────────────────────────────────────────────── */
export default function SuccessStories() {
  const navigate = useNavigate();

  const heroRef      = useReveal(0);
  const statsRef     = useReveal(50);
  const foundingRef  = useReveal(0);
  const feedbackRef  = useReveal(0);
  const rolesRef     = useReveal(0);
  const commitRef    = useReveal(0);
  const ctaRef       = useReveal(0);

  return (
    <div className="min-h-screen mm-site-theme">
      <style>{`
        @keyframes ss-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media(max-width:640px){
          .ss-4col { grid-template-columns: 1fr 1fr !important; }
          .ss-2col, .ss-3col { grid-template-columns: 1fr !important; }
          .ss-steps { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ══════ SECTION 1 — HERO ══════ */}
      <section
        ref={heroRef}
        style={{ ...REVEAL_BASE, padding: '80px 24px 64px', textAlign: 'center' }}
      >
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          {/* Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 20, padding: '5px 16px', marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', animation: 'ss-pulse 1.5s ease-in-out infinite', boxShadow: '0 0 6px #f59e0b', flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#fbbf24' }}>Founding batch — only spots available per batch</span>
          </div>

          {/* H1 */}
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 38px)', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.18, marginBottom: 18, color: '#1a1a1a' }}>
            The first outcomes from our founding batch are{' '}
            <span style={{ background: 'linear-gradient(90deg,#FF9500,#CC7000)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              taking shape now.
            </span>
          </h1>

          {/* Sub */}
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 480, margin: '0 auto' }}>
            We're in our founding batch. Students who join now get focused mentor attention, clear pricing, and visibility of their progress here. Here's what we commit to every student.
          </p>
        </div>
      </section>

      {/* ══════ SECTION 2 — STAT CARDS ══════ */}
      <section style={{ padding: '0 24px 72px' }}>
        <div
          ref={statsRef}
          style={{ ...REVEAL_BASE, maxWidth: 840, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}
          className="ss-4col"
        >
          <StatCard icon="📋" value="Structured" label="Prep aligned to campus drives, role tracks, and typical interview rounds" />
          <StatCard icon="📊" value="Measurable" label="Readiness score and gap report — track progress with clear metrics" />
          <StatCard icon="👥" value="Mentors" label="1:1 sessions for doubt-clearing and strategy — not chatbot-only learning" />
          <StatCard icon="⚙️" value="AI + human" label="AI mock interviews and ATS-style checks; mentors review gaps and next steps" />
        </div>
      </section>

      {/* ══════ SECTION 3 — FOUNDING MEMBER CARD ══════ */}
      <section style={{ padding: '0 24px 72px', display: 'flex', justifyContent: 'center' }}>
        <div
          ref={foundingRef}
          style={{
            ...REVEAL_BASE, maxWidth: 640, width: '100%',
            background: 'rgba(255,149,0,0.08)',
            border: '1.5px solid rgba(255,149,0,0.25)',
            borderRadius: 14, padding: '32px 28px',
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 600, color: '#FF9500', marginBottom: 10, letterSpacing: '0.02em' }}>✦ Founding member opportunity</p>
          <h2 style={{ fontSize: 21, fontWeight: 700, color: '#1a1a1a', marginBottom: 10, lineHeight: 1.35 }}>
            Be one of the first 100 students. Your outcome can be featured here.
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
            Founding batch students get the lowest price MentorMuni will ever offer, maximum mentor attention, and their placement outcome featured on this page when they’re placed.
          </p>

          {/* 3-step mini grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }} className="ss-steps">
            {[
              'Take the free assessment — know your gaps',
              'Get matched to your mentor in 24 hours',
              'Your outcome listed here when you\'re placed',
            ].map((text, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FF9500', color: '#1a1a1a', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate('/waitlist')}
              onMouseEnter={e => { e.currentTarget.style.background = '#FF9500'; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FF9500'; e.currentTarget.style.transform = 'scale(1)'; }}
              style={{ background: '#FF9500', color: '#1a1a1a', border: 'none', padding: '13px 36px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s, transform 0.15s' }}
            >
              Join the founding batch →
            </button>
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Start free', 'No commitment', '8 spots left'].map(t => (
                <span key={t} style={{ fontSize: 12, color: '#888888', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ color: '#4ade80' }}>✓</span>{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ SECTION 4 — BETA FEEDBACK ══════ */}
      <section style={{ padding: '0 24px 72px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div ref={feedbackRef} style={REVEAL_BASE}>
            <SectionLabel>What students experience</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, marginBottom: 16 }} className="ss-2col">
              <FeedbackCard
                quote="I did 3 AI mock interviews and the feedback was more specific than anything I got from seniors. It told me exactly which answers were weak and why."
                initial="V" avBg="#FF9500"
                name="4th Year · CSE"
              />
              <FeedbackCard
                quote="The gap analysis showed me System Design was my blind spot. Three weeks of focused prep and I can now explain load balancing clearly in an interview."
                initial="R" avBg="#0891b2"
                name="Final Year · IT"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════ SECTION 5 — TARGET ROLES ══════ */}
      <section style={{ padding: '0 24px 72px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div ref={rolesRef} style={REVEAL_BASE}>
            <SectionLabel>Roles we prepare you for</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }} className="ss-3col">
              <RoleCard title="Software Engineer"        companies="TCS · Cognizant · HCL · Infosys"     focus="DSA + System Design focus" />
              <RoleCard title="Associate Consultant"     companies="Deloitte · Capgemini · Accenture"    focus="Technical + HR round prep" />
              <RoleCard title="Programmer Analyst"       companies="Cognizant · Wipro · Infosys"         focus="DSA + System Design focus" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════ SECTION 6 — COMMITMENT CARD ══════ */}
      <section style={{ padding: '0 24px 72px', display: 'flex', justifyContent: 'center' }}>
        <div
          ref={commitRef}
          style={{
            ...REVEAL_BASE, maxWidth: 640, width: '100%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 14, padding: '32px 28px',
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-heading)', textAlign: 'center', marginBottom: 24 }}>
            Our commitment to every founding student
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CommitRow bold="Mentor matched in 24 hours" rest=" based on your exact score and role." />
            <CommitRow bold="WhatsApp access throughout —" rest=" reachable all week, not just in sessions." />
            <CommitRow bold="Full support until you're placed —" rest=" mentorship continues until you receive your offer." />
            <CommitRow bold="Your outcome featured here —" rest=" when placed, your journey is listed on this page." />
          </div>
        </div>
      </section>

      {/* ══════ SECTION 7 — BOTTOM CTA ══════ */}
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
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>
            Be among the first outcomes we feature.
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Start with the free assessment. See your gaps. Then decide if the founding batch is right for you.
          </p>
          <CTAButtons navigate={navigate} />
        </div>
      </section>

      {/* ══════ SECTION 8 — FOOTER ══════ */}
      <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)', padding: '56px 24px 32px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 32, marginBottom: 40 }} className="ss-footer-grid">
            <style>{`@media(max-width:640px){ .ss-footer-grid{ grid-template-columns:1fr 1fr !important; } }`}</style>

            {/* Brand */}
            <div>
              <p style={{ fontWeight: 700, color: '#1a1a1a', fontSize: 15, marginBottom: 8 }}>MentorMuni</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14, maxWidth: 220 }}>
                Know your interview readiness. Improve it. Crack it.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <a href="mailto:enroll@mentormuni.com" style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>enroll@mentormuni.com</a>
                <a href="tel:+919146421302" style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>+91 91464 21302</a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Platform</p>
              {[['Assessment', '/start-assessment'], ['Mock Interviews', '/mock-interviews'], ['Skill Analyser', '/skill-gap-analyzer'], ['Resume Analyser', '/resume-analyzer']].map(([label, to]) => (
                <div key={to} style={{ marginBottom: 10 }}>
                  <Link to={to} style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>{label}</Link>
                </div>
              ))}
            </div>

            {/* Learning */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Learning</p>
              {[['Placement Tracks', '/placement-tracks'], ['Free Tutorials', '/free-tutorials'], ['Learning Paths', '/learning-paths'], ['Outcomes', '/outcomes']].map(([label, to]) => (
                <div key={to} style={{ marginBottom: 10 }}>
                  <Link to={to} style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>{label}</Link>
                </div>
              ))}
            </div>

            {/* Company */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Company</p>
              {[['About Us', '/contact'], ['Careers', '/contact'], ['Contact', '/contact'], ['For Recruiters', '/for-recruiters']].map(([label, to]) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <Link to={to} style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>{label}</Link>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <p style={{ fontSize: 12, color: '#888888' }}>© {new Date().getFullYear()} MentorMuni. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Terms', 'Privacy', 'Cookies'].map(t => (
                <Link key={t} to="/contact" style={{ fontSize: 12, color: '#888888', textDecoration: 'none' }}>{t}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
