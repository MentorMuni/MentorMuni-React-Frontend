import { lazy, Suspense } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import SiteFooter from './layout/SiteFooter';
import ScrollReveal from './layout/ScrollReveal';
import ProductFrame from './colleges/ProductFrame';
import { ArrowRight, CalendarDays, Phone } from 'lucide-react';
import '../studentPortal/styles/student-home.css';
import './colleges/colleges-page.css';

/* The real student dashboard sections. These are pure presentational and
   prop-driven — no auth, no network — so the marketing page renders the same
   code students see, and can never drift from it. Lazy so the dashboard bundle
   stays off the critical path. */
const PlacementReadinessHero = lazy(
  () => import('../studentPortal/components/home/PlacementReadinessHero')
);
const TodaysPlanSection = lazy(
  () => import('../studentPortal/components/home/TodaysPlanSection')
);

const DEMO_URL = 'https://calendly.com/mentormuni';

/* ══════════════════════════════════════════════════════════════
   HERO — dark, cinematic, product as the light source
   ══════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <header className="mmc-dark mmc-hero">
      <div className="mmc-shell mmc-hero__grid">
        <div>
          <span className="mmc-chip"><i />Placement season starts in 6 weeks</span>

          <h1 className="mmc-h1">
            Interview practice that scales to&nbsp;1,200&nbsp;students.
          </h1>

          <p className="mmc-lede">
            One system from placement cell to TPO to HOD to every student — so you know
            exactly who is interview-ready, who isn&rsquo;t, and what to do about it
            before drives begin.
          </p>

          <div className="mmc-hero__cta">
            <a className="mmc-btn mmc-btn--cta" href={DEMO_URL} target="_blank" rel="noopener noreferrer">
              <CalendarDays size={17} aria-hidden />
              Book a campus demo
            </a>
            <a className="mmc-btn mmc-btn--glass" href="#effort">
              See how it works
              <ArrowRight size={16} aria-hidden />
            </a>
          </div>

          <p className="mmc-hero__proof">
            <span><b>✓</b> 38 campuses live</span>
            <span><b>✓</b> Set up in a week</span>
            <span><b>✓</b> No per-student admin</span>
          </p>
        </div>

        <div className="mmc-glow">
          <ProductFrame url="mentormuni.com/studentportal/home" stageWidth={1060} scale={0.52} height={430}>
            {/* `.stu-app is-light` supplies the dashboard's own token scope.
                No `--page` modifier: this is artwork, not the page. */}
            <div className="stu-app is-light" style={{ padding: 18, background: 'var(--bg)' }}>
              <Suspense fallback={<div style={{ height: 820 }} />}>
                <PlacementReadinessHero
                  currentReadiness={47}
                  previousReadiness={41}
                  targetReadiness={85}
                  estimatedDays={38}
                />
                <div style={{ height: 18 }} />
                <TodaysPlanSection currentReadiness={47} />
              </Suspense>
            </div>
          </ProductFrame>
        </div>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════════════════════
   EFFORT COLLAPSE — the unique idea, stated as work removed
   ══════════════════════════════════════════════════════════════ */
const MANUAL = [
  ['Collect rosters, build the spreadsheet', '2 weeks'],
  ['Schedule slots, book rooms, assign faculty', '1 week'],
  ['Interview at 8 students per faculty-day', '150 days'],
  ['Chase no-shows over WhatsApp', 'ongoing'],
  ['Compile scores by hand, resolve conflicts', '2 weeks'],
  ['Build the report for management', '1 week'],
];

const AUTOMATED = [
  ['Upload the roster once — we onboard everyone', '20 min'],
  ['Assign the round to a batch, branch or campus', '3 clicks'],
  ['Students interview 24/7, unlimited retries', 'no faculty'],
  ['Automatic reminders until they complete', 'automatic'],
  ['Scores compiled and ranked as they finish', 'instant'],
  ['Export the report for management or NAAC', '1 click'],
];

function Steps({ rows }) {
  return rows.map(([label, cost], i) => (
    <div className="mmc-estep" key={label}>
      <i>{String(i + 1).padStart(2, '0')}</i>
      <span>{label}</span>
      <b>{cost}</b>
    </div>
  ));
}

function EffortCollapse() {
  return (
    <section className="mmc-dark mmc-band" id="effort">
      <div className="mmc-shell">
        <ScrollReveal>
          <p className="mmc-eyebrow">Why this exists</p>
          <h2 className="mmc-h2">
            Mock interviews for 1,200 students used to be&nbsp;impossible.
          </h2>
          <p className="mmc-lede">
            Not hard — <em>impossible</em>. One faculty member can run maybe eight
            interviews a day. That&rsquo;s 150 working days for a single round. So campuses
            run a seminar instead and hope. This is the arithmetic that changes.
          </p>
        </ScrollReveal>

        <div className="mmc-effort">
          <ScrollReveal className="mmc-ecol">
            <h3>Running one mock round today</h3>
            <p className="mmc-ecol__sub">1,200 students · manual</p>
            <Steps rows={MANUAL} />
            <div className="mmc-etotal"><span>Realistically</span><b>Never happens</b></div>
          </ScrollReveal>

          <ScrollReveal className="mmc-ecol mmc-ecol--after">
            <h3>Running it on MentorMuni</h3>
            <p className="mmc-ecol__sub">1,200 students · automated</p>
            <Steps rows={AUTOMATED} />
            <div className="mmc-etotal"><span>Your time</span><b>≈ 40 minutes</b></div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   CLAIM + VISUAL BANDS — one idea per screen
   ══════════════════════════════════════════════════════════════ */
function Band({ eyebrow, title, lede, caps, children, flipped, tint }) {
  return (
    <section className={`mmc-light mmc-band ${tint ? 'mmc-tint' : ''}`}>
      <div className={`mmc-shell mmc-band__grid ${flipped ? 'is-flipped' : ''}`}>
        <ScrollReveal>
          <p className="mmc-eyebrow">{eyebrow}</p>
          <h2 className="mmc-h2">{title}</h2>
          <p className="mmc-lede">{lede}</p>
          {caps ? (
            <ul className="mmc-caps">
              {caps.map(([b, rest]) => (
                <li key={b}><b>{b}</b> {rest}</li>
              ))}
            </ul>
          ) : null}
        </ScrollReveal>
        <ScrollReveal>{children}</ScrollReveal>
      </div>
    </section>
  );
}

/* Lightweight, honest recreations for the org screens. The org dashboard is
   auth- and network-coupled, so it cannot be embedded directly; extracting its
   presentational pieces into shared components is tracked as follow-up work. */
function RankingPreview() {
  const rows = [
    ['1', 'SG', 'Sarvesh Gupta', 'CSE', '92%', 'top'],
    ['2', 'AS', 'Ananya Singh', 'CSE', '89%', 'top'],
    ['3', 'MI', 'Meera Iyer', 'IT', '86%', 'top'],
    ['4', 'RV', 'Rahul Verma', 'CSE', '74%', ''],
    ['…', 'PK', 'Priya Kulkarni', 'MECH', '41%', 'risk'],
    ['…', 'DN', 'Dev Nair', 'ECE', '38%', 'risk'],
  ];
  return (
    <ProductFrame url="mentormuni.com/tpo/students" tone="light" stageWidth={560} scale={0.92}>
      <div style={{ padding: '14px 16px', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                      marginBottom: 10, fontSize: 13, fontWeight: 700 }}>
          <span>Campus ranking</span>
          <span className="mmc-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>1,204 students</span>
        </div>
        {rows.map(([n, ini, name, dept, score, tone]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0',
                                   borderBottom: '1px solid var(--border)', fontSize: 13 }}>
            <span className="mmc-mono" style={{ width: 20, fontSize: 11, color: 'var(--text-muted)' }}>{n}</span>
            <span style={{ width: 26, height: 26, borderRadius: '50%', display: 'grid', placeItems: 'center',
                           fontSize: 10, fontWeight: 700, color: '#fff',
                           background: 'linear-gradient(140deg,var(--accent-secondary),var(--accent))' }}>{ini}</span>
            <span style={{ flex: 1 }}>{name}</span>
            <span className="mmc-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{dept}</span>
            <span style={{ width: 42, textAlign: 'right', fontWeight: 700,
                           color: tone === 'risk' ? 'var(--accent-cta-deep)'
                                : tone === 'top' ? 'var(--success)' : 'inherit' }}>{score}</span>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '5px 11px', borderRadius: 999,
                         background: 'var(--accent-cta)', color: '#fff' }}>Shortlist top 200 for TCS</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '5px 11px', borderRadius: 999,
                         background: 'var(--accent-soft)', color: 'var(--accent-hover)' }}>Export CSV</span>
        </div>
      </div>
    </ProductFrame>
  );
}

function NotifyPreview() {
  return (
    <ProductFrame url="mentormuni.com/hod/ece/notify" tone="light" stageWidth={560} scale={0.92}>
      <div style={{ padding: '14px 16px', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                      marginBottom: 12, fontSize: 13, fontWeight: 700 }}>
          <span>Notify branch</span>
          <span className="mmc-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>ECE · 214 students</span>
        </div>
        <div style={{ border: '1px dashed var(--border)', borderRadius: 12, padding: 12 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
            {['ECE · all sections', '214 recipients'].map((t) => (
              <span key={t} style={{ fontSize: 11, fontWeight: 650, padding: '3px 8px', borderRadius: 999,
                                     background: 'var(--accent-soft)', color: 'var(--accent-hover)' }}>{t}</span>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--text-body)' }}>
            <b style={{ color: 'var(--text-primary)' }}>Aptitude bootcamp — Thu 10 AM, Seminar Hall 2.</b>{' '}
            Your branch is at 61% against a campus average of 73%.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
            <span className="mmc-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>In-app + email</span>
            <span style={{ marginLeft: 'auto', background: 'var(--accent-cta)', color: '#fff',
                           borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>Send now</span>
          </div>
        </div>
        <p style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
          142 of 214 students are below the 70% threshold and will be auto-included.
        </p>
      </div>
    </ProductFrame>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROI · OBJECTIONS · CTA
   ══════════════════════════════════════════════════════════════ */
const ROI = [
  ['+16%', 'placement rate, year on year', true],
  ['2.4×', 'interview conversion', false],
  ['71%', 'weekly active students', false],
  ['6 hrs', 'staff time per week', false],
];

function Roi() {
  return (
    <section className="mmc-light mmc-band">
      <div className="mmc-shell">
        <ScrollReveal>
          <p className="mmc-eyebrow">The only metric that matters</p>
          <h2 className="mmc-h2">Your placement percentage. Not a readiness&nbsp;score.</h2>
          <p className="mmc-lede">
            Readiness is how we get there — placement rate is what you report to your
            Director. Across 38 campuses in the 2024–25 season:
          </p>
        </ScrollReveal>
        <div className="mmc-roi">
          {ROI.map(([n, label, hero]) => (
            <ScrollReveal key={label} className={`mmc-roi__card ${hero ? 'is-hero' : ''}`}>
              <b>{n}</b><em>{label}</em>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const OBJECTIONS = [
  ['“How much work is this for my team?”',
   'Upload your student list once. We handle onboarding, reminders and chasing. TPOs on live campuses spend a median of 6 hours a week, mostly reading reports. No invigilation, no scheduling, no manual result entry.'],
  ['“My students won’t actually log in.”',
   'The honest number: 71% weekly active, and it holds because the plan is 40 minutes a day, not a 200-hour course. We report engagement weekly — if a department drops below 50%, you’ll know before it becomes a problem.'],
  ['“What does it cost, and who pays?”',
   'Campus licence is priced per enrolled student per year, and lands between ₹400–₹900 depending on cohort size. Most colleges fund it from the training budget. We give you a written quote in the first call, not a discovery process.'],
  ['“Does this help my NAAC / NBA file?”',
   'Yes — and this is usually what gets it approved. One-click export of training hours, student progression, placement outcomes and department-wise attainment, formatted for accreditation reporting.'],
  ['“Which colleges near me use it?”',
   'We’ll name them on the call and connect you directly with a TPO who has run a full season — no sales rep on the line. If nobody in your state is live yet, we’ll tell you that too.'],
  ['“I’m not signing campus-wide cold.”',
   'Don’t. Run one department for one semester, priced pro-rata. If readiness in that branch doesn’t move measurably against your other departments, walk away — no renewal clause, no lock-in.'],
];

function Objections() {
  return (
    <section className="mmc-light mmc-tint mmc-band">
      <div className="mmc-shell">
        <ScrollReveal>
          <p className="mmc-eyebrow">Straight answers</p>
          <h2 className="mmc-h2">What you&rsquo;re going to ask in the first&nbsp;meeting</h2>
          <p className="mmc-lede">
            You&rsquo;ve bought training tools before. Some of them are still sitting unused.
            Here are the answers before you have to ask.
          </p>
        </ScrollReveal>
        <div className="mmc-obj">
          {OBJECTIONS.map(([q, a]) => (
            <ScrollReveal key={q} className="mmc-obj__card">
              <p className="mmc-obj__q">{q}</p>
              <p className="mmc-obj__a">{a}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mmc-dark mmc-band mmc-final">
      <div className="mmc-shell">
        <ScrollReveal>
          <h2 className="mmc-h2" style={{ maxWidth: '18ch', marginInline: 'auto' }}>
            Your placement season has a&nbsp;date.
          </h2>
          <p className="mmc-lede">
            Thirty minutes on a call and you&rsquo;ll know whether this fits your campus.
            We&rsquo;ll bring your department numbers, not a slide deck.
          </p>
          <div className="mmc-hero__cta" style={{ justifyContent: 'center' }}>
            <a className="mmc-btn mmc-btn--cta" href={DEMO_URL} target="_blank" rel="noopener noreferrer">
              <CalendarDays size={17} aria-hidden />
              Book a campus demo
            </a>
            <a className="mmc-btn mmc-btn--glass" href="tel:+919000000000">
              <Phone size={16} aria-hidden />
              Talk to us
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export default function CollegesPage() {
  usePageMeta({
    title: 'MentorMuni for Colleges — the placement operating system',
    description:
      'Run interview practice for every student, track readiness by department, and report placement outcomes. One system from placement cell to TPO to HOD to student.',
    keywords: 'campus placement software, TPO dashboard, placement training, NAAC reporting, mock interviews',
  });

  return (
    <div className="mmc">
      <Hero />
      <EffortCollapse />

      <Band
        eyebrow="For the TPO"
        title="Rank every student. Shortlist in one&nbsp;click."
        lede="Campus-wide readiness, sortable by branch and batch, always current — so drive shortlisting takes a minute instead of a fortnight."
        caps={[
          ['Assign any assessment', '— aptitude, skill, English, technical, AI mock or HR mock, to campus, department or one student.'],
          ['Announce drives and notify', '— in-app and email, targeted by branch or batch.'],
          ['Open any student’s history', '— every test, every mock, every score, with trend.'],
          ['Export scorecards', '— CSV for management, formatted export for NAAC and NBA.'],
        ]}
      >
        <RankingPreview />
      </Band>

      <Band
        tint
        flipped
        eyebrow="For the HOD"
        title="See your branch slipping before the TPO&nbsp;does."
        lede="Department readiness section by section, with at-risk students surfaced while there is still time to intervene."
        caps={[
          ['Notify your students', '— deadlines, sessions and drive reminders, whole branch or one section.'],
          ['Assign targeted practice', '— aimed at the weakness the data actually shows.'],
          ['Compare against campus', '— know where you stand before the review meeting.'],
          ['AI branch insight', '— a weekly written read on what to intervene on.'],
        ]}
      >
        <NotifyPreview />
      </Band>

      <Roi />
      <Objections />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}
