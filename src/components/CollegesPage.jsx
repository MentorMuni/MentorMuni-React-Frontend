import { usePageMeta } from '../hooks/usePageMeta';
import SiteFooter from './layout/SiteFooter';
import ScrollReveal from './layout/ScrollReveal';
import ProductFrame from './colleges/ProductFrame';
import StudentPortalPeek from './colleges/StudentPortalPeek';
import OrgFlowDiagram from './colleges/OrgFlowDiagram';
import { ArrowRight, CalendarDays, Phone } from 'lucide-react';
import './colleges/colleges-page.css';

/* The student dashboard used to be embedded here as hero artwork, which is
   why this file imported the portal stylesheets and a frozen set of demo
   props. The hero now carries OrgFlowDiagram instead, and the real dashboard
   is shown full-width and interactive by StudentPortalPeek — so the portal
   CSS (home.css alone is ~36KB) no longer loads on this route. */

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
            Interview practice that scales to your whole&nbsp;campus.
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
            <span><b>✓</b> Runs on your drive calendar</span>
            <span><b>✓</b> Roster upload, then we onboard</span>
            <span><b>✓</b> No invigilation, no scheduling</span>
          </p>
        </div>

        {/* Was a ProductFrame embedding the live student dashboard. At this
            column's width that component's two-column layout collapsed and its
            summary text wrapped to one or two words per line, so it read as a
            broken screenshot. The hero claim is about four roles on one system,
            which a diagram states directly and a cropped dashboard never did.
            The real dashboard still appears on this page, at full width and
            interactive, in the "For the student" band. */}
        <div className="mmc-glow">
          <OrgFlowDiagram />
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
  ['Interview at 8 students per faculty-day', '60+ days'],
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
    <section className="mmc-surface mmc-band" id="effort">
      <div className="mmc-shell">
        <ScrollReveal>
          <p className="mmc-eyebrow">Why this exists</p>
          <h2 className="mmc-h2">
            Mock interviews for every student used to be&nbsp;impossible.
          </h2>
          <p className="mmc-lede">
            Not hard — <em>impossible</em>. One faculty member can run maybe eight
            interviews in a day. For a 500-student batch that is over sixty working days
            of one person&rsquo;s time, for <em>one</em> round. So campuses run a seminar
            instead and hope. This is the arithmetic that changes — and you can check it
            against your own numbers.
          </p>
        </ScrollReveal>

        <div className="mmc-effort">
          <ScrollReveal className="mmc-ecol mmc-ecol--before">
            <h3>Running one mock round today</h3>
            <p className="mmc-ecol__sub">500+ students · manual</p>
            <Steps rows={MANUAL} />
            <div className="mmc-etotal"><span>Realistically</span><b>Never happens</b></div>
          </ScrollReveal>

          <ScrollReveal className="mmc-ecol mmc-ecol--after">
            <h3>Running it on MentorMuni</h3>
            <p className="mmc-ecol__sub">500+ students · automated</p>
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
    <ProductFrame url="mentormuni.com/tpo/students" tone="light">
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
    <ProductFrame url="mentormuni.com/hod/ece/notify" tone="light">
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
/* Deliberately not outcome statistics. We don't have a defensible season of
   placement-rate data yet, and a TPO will check anything we publish — one
   disprovable number would discredit the rest of the page. What we can stand
   behind is the visibility itself, so the section sells that instead. */
const MEASURES = [
  ['Per student', 'Readiness across all six placement rounds, not a single test score', true],
  ['Per branch', 'Every department side by side, updated as students practise'],
  ['Weekly', 'Who has stalled, flagged while there is still time to act'],
  ['One click', 'Management reports and NAAC / NBA exports, already formatted'],
];

function Roi() {
  return (
    <section className="mmc-wash-success mmc-band">
      <div className="mmc-shell">
        <ScrollReveal>
          <p className="mmc-eyebrow">What you&rsquo;ll be able to see</p>
          <h2 className="mmc-h2">The questions you cannot answer&nbsp;today</h2>
          <p className="mmc-lede">
            Not because your team isn&rsquo;t good — because nobody has the data. Ask any
            placement cell which forty students are least ready for next month&rsquo;s drive
            and the honest answer is a guess. That is the gap this closes.
          </p>
        </ScrollReveal>
        <div className="mmc-roi">
          {MEASURES.map(([n, label, hero]) => (
            <ScrollReveal key={n} className={`mmc-roi__card ${hero ? 'is-hero' : ''}`}>
              <b>{n}</b><em>{label}</em>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal>
          <div className="mmc-honest">
            <b>On numbers:</b> we don&rsquo;t publish placement-rate claims we can&rsquo;t
            show you the working for. Ask us on the demo what our live campuses are seeing
            and we&rsquo;ll tell you exactly what we do and don&rsquo;t know yet.
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

const OBJECTIONS = [
  ['“How much work is this for my team?”',
   'Upload your student list once — we handle onboarding, reminders and chasing from there. There is no invigilation, no slot scheduling and no manual result entry, so what is left for your team is reading reports and deciding what to do about them.'],
  ['“My students won’t actually log in.”',
   'A fair worry — most campus tools die this way. Two things work against it: the daily plan is about forty minutes, not a 200-hour course, and you see engagement per department every week rather than at the end of the year. If a branch goes quiet you will know while you can still do something about it.'],
  ['“What does it cost?”',
   'It depends on your cohort size and which modules you actually want, so we don’t publish a number that would be wrong for you. Take the demo, tell us your student count and priorities, and you’ll have a written quote — not a discovery process.'],
  ['“Does this help my NAAC / NBA file?”',
   'Yes — and this is usually what gets it approved. One-click export of training hours, student progression, placement outcomes and department-wise attainment, formatted for accreditation reporting.'],
  ['“Show me it actually works.”',
   'Take the demo. We will run the TPO dashboard, the HOD view and a live AI interview against a real cohort structure — not slides — and you can put your own department names and student counts into it. Judge the capability in front of you rather than taking a claim on trust.'],
  ['“Are you replacing my placement cell?”',
   'No, and we would not want to. Your TPO team knows your recruiters, runs your drives and owns those relationships — none of that is something software should touch. What we take off them is the volume work: tracking hundreds of students individually, chasing completion, compiling scores. The cell stays; the spreadsheets go.'],
  ['“What happens to our data?”',
   'Student, department and institutional data stays with your organisation. We operate under an NDA per campus, and DPDP and ISO compliance work is in progress — we will tell you exactly where that stands rather than claiming a certificate we do not yet hold. Your Registrar can read the agreement before anything is signed.'],
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

/* ══════════════════════════════════════════════════════════════
   WHO IT HELPS — the three roles, and what each one gets
   ══════════════════════════════════════════════════════════════ */
const ROLES = [
  {
    key: 'tpo',
    who: 'For the TPO',
    title: 'Stop guessing who is ready',
    gain: 'You walk into the drive knowing exactly which students clear the bar — and you built that list in a minute, not a fortnight.',
    points: [
      'Live readiness across every department and batch',
      'Assign any test or mock to campus, branch or one student',
      'Shortlist for a drive by score, branch and eligibility',
      'Announce drives and notify students in-app and by email',
      'Export scorecards for management, NAAC and NBA',
    ],
  },
  {
    key: 'hod',
    who: 'For the HOD',
    title: 'Catch your branch slipping early',
    gain: 'You see which students are stalling while there is still a semester left to fix it — instead of finding out on results day.',
    points: [
      'Department view, section by section',
      'At-risk students surfaced automatically',
      'Assign targeted practice where the data points',
      'Notify your branch about deadlines and sessions',
      'Compare your branch against the campus average',
    ],
  },
  {
    key: 'student',
    who: 'For the student',
    title: 'Know what to do today',
    gain: 'Instead of vague advice to “practise more”, a student opens the app and sees three specific tasks worth about forty minutes.',
    points: [
      'One readiness score across all six placement rounds',
      'A daily plan weighted to their weakest area',
      'Unlimited AI mock interviews — technical, HR, project',
      'Which companies they can clear, and what is blocking the rest',
      'A 24/7 AI mentor that has read their results',
    ],
  },
];

function WhoItHelps() {
  return (
    <section className="mmc-light mmc-tint mmc-band" id="roles">
      <div className="mmc-shell">
        <ScrollReveal>
          <p className="mmc-eyebrow">Who it helps</p>
          <h2 className="mmc-h2">One system. Three people who stop&nbsp;guessing.</h2>
          <p className="mmc-lede">
            Placement is a chain — management sets the goal, the TPO runs the campus, the
            HOD runs the branch, the student does the work. Break any link and the season
            slips. This connects all four.
          </p>
        </ScrollReveal>

        <div className="mmc-roles">
          {ROLES.map((r) => (
            <ScrollReveal key={r.who} className={`mmc-role mmc-role--${r.key}`}>
              <p className="mmc-role__who">{r.who}</p>
              <h3>{r.title}</h3>
              <p className="mmc-role__gain">{r.gain}</p>
              <ul>{r.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   DIFFERENTIATION — why this is not the tool you already rejected
   ══════════════════════════════════════════════════════════════ */
const DIFFERENTIATORS = [
  {
    n: '01',
    h: 'We measure, not teach',
    p: 'Every topic your students need is already free online — content was never the problem. We tell you where each student actually stands, then close that specific gap. Nobody else gives you a number you can act on.',
  },
  {
    n: '02',
    h: 'The whole chain, not just the student',
    p: 'Other tools stop at the learner. Management, TPO, HOD and student each get their own view of the same data — so an intervention decided upstairs actually reaches the student who needs it.',
  },
  {
    n: '03',
    h: 'Unlimited interviews, zero faculty',
    p: 'The rounds students lose — HR and communication — are exactly the ones a campus cannot rehearse at scale. AI mocks run 24/7 with no invigilation, no scheduling and no ceiling on attempts.',
  },
  {
    n: '04',
    h: 'Built for the placement calendar',
    p: 'Everything counts down to your drive dates. Plans compress when a drive moves up. Generic courses have no idea when your season starts.',
  },
];

function WhyDifferent() {
  return (
    <section className="mmc-dark mmc-band" id="why-us">
      <div className="mmc-shell">
        <ScrollReveal>
          <p className="mmc-eyebrow">Why MentorMuni</p>
          <h2 className="mmc-h2">What makes this different from what you&rsquo;ve already&nbsp;tried</h2>
          <p className="mmc-lede">
            You have probably bought a training portal before. Here is what we do that
            those did not.
          </p>
        </ScrollReveal>

        <div className="mmc-diff">
          {DIFFERENTIATORS.map((d) => (
            <ScrollReveal key={d.n} className="mmc-diff__card">
              <span className="mmc-diff__n">{d.n}</span>
              <h3>{d.h}</h3>
              <p>{d.p}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   PLANS — demo first, price after. No published numbers.
   ══════════════════════════════════════════════════════════════ */
function Plans() {
  return (
    <section className="mmc-surface mmc-band" id="plans">
      <div className="mmc-shell">
        <ScrollReveal>
          <p className="mmc-eyebrow">Plans</p>
          <h2 className="mmc-h2">Built around your campus, not a&nbsp;price list</h2>
          <p className="mmc-lede">
            A 400-student private college and a 4,000-student university need different
            things. We would rather understand your cohort and your season than sell you
            a tier you half-use.
          </p>
        </ScrollReveal>

        <div className="mmc-plan">
          <ScrollReveal>
            <ul className="mmc-plan__points">
              <li><b>Pick the modules you need.</b> Aptitude, technical, communication,
                HR mocks, coding rounds, project defence — take the ones your students
                actually lose marks on.</li>
              <li><b>Priced on cohort size and scope.</b> Per enrolled student per year,
                scaled to your numbers. You get a written quote after the demo.</li>
              <li><b>Runs by semester or by year, not as a 90-day sprint.</b> The 90-day
                plan is what a final-year student sees before a drive. Underneath it, programmes
                run across semesters and year groups — you can start preparing second and third
                years long before the season.</li>
              <li><b>Start with one department.</b> One branch, one semester, pro-rata.
                Expand when the numbers convince you rather than when a contract says so.</li>
              <li><b>New features ship every month</b> and land in your plan at no extra
                cost — you are buying a product that keeps moving, not a fixed bundle.</li>
            </ul>

            <div className="mmc-shipping">
              <b>Shipping soon:</b> group discussion rounds, regional-language
              communication practice, recruiter-facing shortlists, and deeper NAAC
              automation. Existing campuses get these as they land.
            </div>
          </ScrollReveal>

          <ScrollReveal className="mmc-plan__cta">
            <p className="mmc-eyebrow" style={{ marginBottom: '0.5rem' }}>Next step</p>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.375rem', fontWeight: 750, letterSpacing: '-0.02em' }}>
              See it on your own numbers
            </h3>
            <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--text-body)' }}>
              Thirty minutes. We will walk your departments through the dashboard and show
              you what your readiness would look like today.
            </p>
            <div style={{ marginTop: '1.5rem' }}>
              <a className="mmc-btn mmc-btn--cta" href={DEMO_URL} target="_blank" rel="noopener noreferrer">
                <CalendarDays size={17} aria-hidden />
                Book a live demo
              </a>
            </div>
            <p className="mmc-plan__note">
              Pricing is discussed on the call, once we know what you need.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   WHO WE ARE — a Director is buying the company, not just the tool
   ══════════════════════════════════════════════════════════════ */
function WhoWeAre() {
  return (
    <section className="mmc-surface mmc-band" id="about">
      <div className="mmc-shell mmc-band__grid">
        <ScrollReveal>
          <p className="mmc-eyebrow">Who we are</p>
          <h2 className="mmc-h2">We chose placement, and nothing&nbsp;else</h2>
          <p className="mmc-lede">
            MentorMuni has been working on placement preparation for years. What changed
            recently is what AI made possible — the individual practice that was never
            affordable at campus scale suddenly is.
          </p>
          <p className="mmc-lede">
            We think the market has drifted toward general upskilling while the moment that
            actually decides a student&rsquo;s career — the placement season — is left to a
            handful of group sessions. We build for that window only. It is the whole
            company.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mmc-belief">
            <p className="mmc-belief__lead">What we will and won&rsquo;t claim</p>
            <ul className="mmc-belief__list">
              <li>
                <b>We will not promise you 100% placement.</b> Nobody can, and a vendor who
                does is telling you what you want to hear.
              </li>
              <li>
                <b>What we commit to</b> is a roadmap your TPO and HODs own, honest visibility
                of where every student stands, and the gaps identified early enough to act on.
              </li>
              <li>
                <b>AI is part of it, not the whole of it.</b> Mentors and structured programmes
                sit behind the automation — the software is what makes them reach everyone.
              </li>
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   WHY NOW — early access framed as the advantage, not an apology

   A Director's instinct is to ask "who else uses this?". Answering
   with a reference list makes the college one of many and hands the
   advantage to whoever adopted first. The honest and stronger frame:
   placement percentage is a competitive number in the admissions
   market, so the edge exists only while it is uncommon.
   ══════════════════════════════════════════════════════════════ */
const EARLY_GET = [
  ['A direct line to the people who build it',
   'Not a ticket queue. Your TPO talks to the team that writes the software.'],
  ['Influence over what gets built next',
   'Founding campuses set the roadmap. The features shipping each month come from what these colleges ask for.'],
  ['Pricing held as you grow',
   'Your rate is locked at founding terms even as the product and the price rise for later campuses.'],
  ['Your season becomes the benchmark',
   'The first campuses to show results define what "good" looks like in this category — with their name on it.'],
];

const EARLY_ASK = [
  ['Honest feedback, quickly',
   'Tell us what is broken while we can still fix it in the same season.'],
  ['Patience with a young product',
   'Some things will not exist yet. We will tell you which, before you sign, not after.'],
  ['Let us tell your story once it works',
   'If the numbers move, we would like to say so publicly — with your approval on every word.'],
];

function WhyNow() {
  return (
    <section className="mmc-light mmc-tint mmc-band" id="why-now">
      <div className="mmc-shell">
        <ScrollReveal>
          <p className="mmc-eyebrow">Why now</p>
          <h2 className="mmc-h2">Placement percentage is a competitive&nbsp;number</h2>
          <p className="mmc-lede">
            It is on your brochure, in your NIRF submission and in the conversation every
            parent has before admission. It only works as a differentiator while your
            neighbours cannot match it.
          </p>
          <p className="mmc-lede">
            Individual interview practice at campus scale has just become possible. Within a
            few seasons it will be ordinary — every college will run something like this and
            the advantage disappears into the baseline. The window where it separates you
            from the campus down the road is now, and it is not a long one.
          </p>
        </ScrollReveal>

        <div className="mmc-trade">
          <ScrollReveal className="mmc-trade__col mmc-trade__col--get">
            <p className="mmc-trade__head">What a founding campus gets</p>
            <ul>
              {EARLY_GET.map(([h, p]) => (
                <li key={h}><b>{h}</b><span>{p}</span></li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal className="mmc-trade__col mmc-trade__col--ask">
            <p className="mmc-trade__head">What we ask in return</p>
            <ul>
              {EARLY_ASK.map(([h, p]) => (
                <li key={h}><b>{h}</b><span>{p}</span></li>
              ))}
            </ul>
            <p className="mmc-trade__note">
              That is the whole trade. We would rather you knew it going in than discovered
              it in month three.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   DATA & TRUST — the Registrar's questions, answered before asked
   ══════════════════════════════════════════════════════════════ */
const TRUST = [
  ['Your data stays yours',
   'Student, department and institutional data belongs to your organisation. We do not sell it, share it between campuses, or use one college’s data to serve another.'],
  ['NDA per campus',
   'We sign a non-disclosure agreement with every institution before onboarding. Your Registrar reads it before anything moves.'],
  ['DPDP & ISO — in progress',
   'Compliance work is underway and we will show you exactly where it stands. We would rather tell you that than display a badge we have not earned.'],
  ['Exit without hostage-taking',
   'If you leave, your data leaves with you in a portable export. No lock-in clause, no retention of student records.'],
];

function DataTrust() {
  return (
    <section className="mmc-dark mmc-band" id="data">
      <div className="mmc-shell">
        <ScrollReveal>
          <p className="mmc-eyebrow">Data &amp; trust</p>
          <h2 className="mmc-h2">The questions your Registrar will&nbsp;ask</h2>
          <p className="mmc-lede">
            You are handing us student records and assessment history. That deserves a
            straight answer before procurement, not a clause discovered later.
          </p>
        </ScrollReveal>

        <div className="mmc-diff">
          {TRUST.map(([h, p]) => (
            <ScrollReveal key={h} className="mmc-diff__card">
              <h3>{h}</h3>
              <p>{p}</p>
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
        tint
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

      {/* TPO → HOD → student: the admin bands above sell the campus view,
          this one answers "what does my student actually get?". */}
      <StudentPortalPeek />

      <WhoItHelps />
      <WhyDifferent />
      <Roi />
      <WhoWeAre />
      <WhyNow />
      <DataTrust />
      <Plans />
      <Objections />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}
