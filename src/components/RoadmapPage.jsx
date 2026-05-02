import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * Year color themes — accent / light bg / dark text
 */
const ROADMAP_YEAR_THEME = {
  1: {
    key: 1,
    label: '1st Year',
    short: '1st',
    accent: '#1D9E75',
    light: '#E1F5EE',
    dark: '#085041',
    title: 'Foundation Year — Build Your Roots',
    subtitle:
      'Academics, core programming, tools, and awareness. The earlier you start right, the further you go.',
  },
  2: {
    key: 2,
    label: '2nd Year',
    short: '2nd',
    accent: '#378ADD',
    light: '#E6F1FB',
    dark: '#0C447C',
    title: 'Core Build Year — Go Deeper',
    subtitle:
      'DSA, your second language, AI depth, internship hunting, cloud basics — this year defines your placement profile.',
  },
  3: {
    key: 3,
    label: '3rd Year',
    short: '3rd',
    accent: '#D85A30',
    light: '#FAECE7',
    dark: '#712B13',
    title: 'Final Prep Year — Get Interview Ready',
    subtitle:
      'Campus placements begin. Solidify coding, build a strong AI project, clear aptitude rounds, and practice interviews.',
  },
  4: {
    key: 4,
    label: '4th Year',
    short: '4th',
    accent: '#7F77DD',
    light: '#EEEDFE',
    dark: '#3C3489',
    title: 'Placement Year — Execute the Plan',
    subtitle:
      "For those who followed the roadmap, you're ready. For those catching up — here's your sprint plan.",
  },
};

const MENTORMUNI_ORIGIN = 'https://mentormuni.com';

function RoadmapCard({ theme, title, tags, note }) {
  return (
    <div className="group rounded-[14px] border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md md:p-6">
      <div className="flex gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold"
          style={{ backgroundColor: theme.light, color: theme.dark }}
          aria-hidden
        >
          {title.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold leading-snug text-foreground">{title}</h4>
          {note ? (
            <p className="mt-2 rounded-lg bg-amber-100 px-2.5 py-1.5 text-xs italic leading-snug text-amber-900">
              {note}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-block rounded-full px-2.5 py-1 text-[11px] font-medium leading-tight text-foreground/90"
                style={{ backgroundColor: theme.light }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MilestoneRow({ theme, icon, children }) {
  return (
    <div className="flex gap-3 rounded-[10px] bg-secondary px-4 py-3 text-[13px] leading-snug text-muted-foreground">
      <span
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
        style={{ backgroundColor: theme.light, color: theme.dark }}
        aria-hidden
      >
        {icon === 'check' ? '✓' : '★'}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function CTAStrip({ theme, title, subtitle, buttonLabel, to, href, external }) {
  const btnClass =
    'inline-flex shrink-0 items-center justify-center rounded-xl px-5 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-95 active:scale-[0.98]';
  return (
    <div className="flex flex-col gap-4 rounded-[14px] border border-border bg-secondary/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:p-6">
      <div className="min-w-0">
        <p className="text-base font-bold text-foreground">{title}</p>
        {subtitle ? <p className="mt-1 text-sm font-normal text-muted-foreground">{subtitle}</p> : null}
      </div>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
          style={{ backgroundColor: theme.accent }}
        >
          {buttonLabel}
        </a>
      ) : (
        <Link to={to} className={btnClass} style={{ backgroundColor: theme.accent }}>
          {buttonLabel}
        </Link>
      )}
    </div>
  );
}

/* ——— Year 1 content ——— */
const Y1_CS_CARDS = [
  {
    title: 'Academics & CGPA',
    tags: ['Strong CGPA', 'Mathematics', 'Physics/Science Basics', 'All Core Subjects'],
  },
  {
    title: 'C Programming — Full Mastery',
    tags: [
      'Loops & Arrays',
      'Functions',
      'Pointers',
      'Memory Management',
      'Logic Building',
      'Basic to Advanced Problems',
    ],
  },
  {
    title: 'Start C++ with OOPs',
    tags: ['Classes & Objects', 'Inheritance', 'Polymorphism', 'Encapsulation'],
  },
  {
    title: 'AI Awareness — Concepts Not Just Tools',
    tags: [
      'What is AI',
      'LLMs & NLP',
      'Deep Learning Basics',
      'How Search Engines Work',
      'Tools Overview (ChatGPT / Claude / Gemini)',
    ],
  },
  {
    title: 'Git & GitHub Basics',
    tags: ['Version Control', 'Push/Pull/Commit', 'GitHub Profile Setup', 'First Repository'],
  },
  {
    title: 'Professional Presence',
    tags: [
      'LinkedIn Profile',
      'GitHub Active',
      'HackerRank Beginner Problems',
      'Start Competitive Coding Awareness',
    ],
  },
];

const Y1_NONCS_CARDS = [
  { title: 'Academics & CGPA', tags: ['Strong CGPA', 'Core Branch Subjects', 'Mathematics Focus'] },
  {
    title: 'Programming from Zero — C Language',
    tags: ['Why Programming Matters', 'Variables & Data Types', 'Loops', 'Functions', 'Basic Logic Building'],
    note: 'Take extra time here — this is your base',
  },
  {
    title: 'Basic C++ Intro',
    tags: ['What is OOPs', 'Simple Classes', 'Basic Syntax Only'],
  },
  {
    title: 'Computer Awareness',
    tags: ['How Internet Works', 'What is Software', 'OS Basics', 'Basic Excel/Docs'],
  },
  {
    title: 'Git & GitHub Basics',
    tags: ['Version Control', 'GitHub Profile', 'First Repository'],
  },
  {
    title: 'Career Awareness',
    tags: [
      'IT vs Core Jobs',
      'What is a Service Company',
      'What is a Product Company',
      'LinkedIn Setup',
    ],
  },
];

/* Year 2 */
const Y2_CS_CARDS = [
  {
    title: 'DSA — Your Interview Engine',
    tags: [
      'Arrays',
      'Linked Lists',
      'Stacks',
      'Queues',
      'Trees',
      'Graphs',
      'Sorting & Searching',
      'LeetCode Easy → Medium',
    ],
  },
  {
    title: 'Master C++ + Pick One Language',
    tags: ['Python', 'Java (pick one)', 'C++ Deep OOPs', 'Write Code Daily'],
  },
  {
    title: 'CS Core Subjects — Theory Matters',
    tags: ['Operating Systems', 'DBMS', 'Computer Networks', 'SQL (must)', 'Theory + Conceptual Clarity'],
  },
  {
    title: 'Gen AI & Agentic AI',
    tags: [
      'LLM Deep Dive',
      'Prompt Engineering',
      'Claude vs OpenAI vs Gemini',
      'Agentic AI Basics',
      'RAG Concept Intro',
    ],
  },
  {
    title: 'Cloud & Web Basics',
    tags: ['AWS / Azure / GCP Intro', 'Node.js Basics', 'React Intro', 'SQL Queries'],
  },
  {
    title: 'Resume Building',
    tags: ['First Resume Draft', 'Projects Section', 'Skills Section', 'LinkedIn Sync', 'Get Mentor Review'],
  },
  {
    title: 'Aptitude Preparation',
    tags: [
      'Quantitative',
      'Logical Reasoning',
      'Verbal & Communication',
      'TCS NQT / Infosys Pattern Awareness',
    ],
  },
  {
    title: 'Internship Hunting Begins',
    tags: [
      'Apply for Summer Internships',
      'LinkedIn Outreach',
      'Referrals',
      'Internshala / LinkedIn Jobs',
      'Target 6-month or Summer Intern',
    ],
  },
];

const Y2_NONCS_CARDS = [
  {
    title: 'C Programming — Solidify Everything',
    tags: ['Advanced Loops', 'Pointers Deep Dive', 'Memory Management', '50+ Practice Problems'],
  },
  {
    title: 'Start C++ & OOPs Properly',
    tags: ['Classes', 'Objects', 'Inheritance', 'Polymorphism', 'Basic Projects'],
  },
  {
    title: 'DSA Introduction',
    tags: ['Arrays', 'Strings', 'Basic Sorting', 'LeetCode Easy Problems Only', 'Logic First'],
  },
  {
    title: 'Pick One Language — Python Recommended',
    tags: ['Python Basics to Intermediate', 'Scripting', 'Small Automation Projects'],
  },
  {
    title: 'CS Fundamentals',
    tags: ['OS Basics', 'Networking Basics', 'What is DBMS', 'Basic SQL Queries'],
  },
  {
    title: 'Resume Building',
    tags: ['First Resume', 'Projects', 'Skills Honest Listing', 'LinkedIn Active'],
  },
  {
    title: 'Aptitude Prep',
    tags: ['Quantitative', 'Logical Reasoning', 'Verbal', 'Service Company Test Patterns'],
  },
  {
    title: 'Internship Awareness',
    tags: ['IT Internship Search Starts', 'Internshala', 'LinkedIn', 'Apply Even Without Full Skills'],
  },
];

/* Year 3 — shared list with optional nonCsNote */
const Y3_CARDS = [
  {
    title: 'Coding Mastery',
    tags: [
      'C Basic to Advanced Done',
      'LeetCode Medium → Hard',
      'HackerRank Challenges',
      '1 Language Expert Level',
      'OOPs Concepts Solid',
    ],
    nonCsNote: 'Target 75+ LeetCode Easy-Medium',
  },
  {
    title: 'System Design — HLD & LLD',
    tags: [
      'High Level Design',
      'Low Level Design',
      'Scalability Concepts',
      'Gaurav Sen YouTube / AI Guide',
      'Design Common Systems (URL Shortener, Chat App)',
    ],
    nonCsNote: 'Focus on HLD only for service companies',
  },
  {
    title: 'CS Core — Interview Level',
    tags: [
      'OS: Process, Thread, Deadlock',
      'DBMS: Normalization, Transactions',
      'CN: TCP/IP, DNS, HTTP/HTTPS',
      'SQL: Joins, Indexes, Queries',
    ],
  },
  {
    title: 'Cloud — Intermediate',
    tags: ['AWS / Azure Hands-On', 'Deploy a Project Free Tier', 'Understand S3, EC2, Lambda Basics'],
  },
  {
    title: 'AI-Powered Capstone Project',
    tags: [
      'Agentic AI',
      'RAG-based Chatbot',
      'End-to-End Deployment',
      'Cloud Hosted',
      'OpenAI / Claude API',
      'GitHub Public Repo',
    ],
    note: 'This project = your biggest interview differentiator',
  },
  {
    title: 'Backend or Frontend Specialization',
    tags: [
      'Python / Java / Go (Backend)',
      'React / Next.js (Frontend)',
      'REST APIs',
      'SQL Expert',
      'Pick One and Go Deep',
    ],
  },
  {
    title: 'Company-Specific Aptitude Prep',
    tags: [
      'TCS NQT Pattern',
      'Infosys Springboard',
      'Wipro NLTH',
      'Cognizant GenC',
      'Accenture Pattern',
      'Mock Aptitude Tests Weekly',
    ],
  },
  {
    title: 'Soft Skills & HR Prep',
    tags: [
      'Group Discussion Practice',
      'HR Interview Questions',
      'Communication Skills',
      'Body Language',
      'Tell Me About Yourself — Perfected',
    ],
  },
  {
    title: 'Internship / Live Project',
    tags: ['6-Month Internship if Possible', 'Add to Resume', 'Real-World Experience', 'Reference Letter'],
  },
  {
    title: 'Interview Readiness Tests',
    tags: [
      'MentorMuni Mock Interviews',
      'Coding Round Simulation',
      'Aptitude Mock',
      'HR Round Practice',
    ],
  },
];

const Y4_ON_TRACK = [
  {
    title: 'Campus Placement Strategy',
    tags: [
      'Service Companies First (TCS/Infosys/Wipro)',
      'Then Mid-Tier Product',
      'Then Top Product',
      'Apply in Waves',
      "Don't Skip Any Round",
    ],
  },
  {
    title: 'Off-Campus Applications',
    tags: [
      'LinkedIn Easy Apply',
      'Company Careers Pages',
      'Referrals from Alumni',
      'AngelList for Startups',
      'Naukri / Shine',
    ],
  },
  {
    title: 'Final Mock & Test Loop',
    tags: [
      'Skill Readiness Test',
      'Interview Readiness Test',
      'Weekly Mock Interviews',
      'Peer Mock Sessions',
    ],
  },
  {
    title: 'Networking & Referrals',
    tags: ['LinkedIn Outreach', 'Alumni Network', 'MentorMuni Community', 'Cold Messaging Strategy'],
  },
];

const Y4_SPRINT = [
  {
    title: '30-Day Coding Sprint',
    tags: ['50 LeetCode Easy Problems', 'C++ / Python Revision', 'OOPs in 1 Week'],
  },
  {
    title: '15-Day Aptitude Crash',
    tags: ['Quant Shortcuts', 'Logical Patterns', 'Verbal Speed', 'TCS/Infosys Mock Tests Daily'],
  },
  {
    title: 'Project in 2 Weeks',
    tags: ['Simple CRUD App', 'Add AI Feature (ChatGPT API)', 'Deploy Free on Vercel/Render', 'Push to GitHub'],
  },
  {
    title: 'Interview Crash Prep',
    tags: [
      'Top 50 HR Questions',
      'Top 30 Technical Questions',
      'Tell Me About Yourself',
      'Mock with MentorMuni Mentor',
    ],
  },
];

function Year1Section({ branch, theme }) {
  const cards = branch === 'cs' ? Y1_CS_CARDS : Y1_NONCS_CARDS;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:gap-5">
        {cards.map((c) => (
          <RoadmapCard key={c.title} theme={theme} title={c.title} tags={c.tags} note={c.note} />
        ))}
      </div>
      <div className="space-y-3">
        <MilestoneRow theme={theme} icon="check">
          <strong className="font-bold text-foreground">Skill Readiness Check:</strong>{' '}
          Take MentorMuni&apos;s C Programming Skill Readiness Test — basic to advanced
        </MilestoneRow>
        <MilestoneRow theme={theme} icon="star">
          <strong className="font-bold text-foreground">Goal by Year End:</strong> CGPA on track + C complete + GitHub active +
          LinkedIn created
        </MilestoneRow>
      </div>
      <CTAStrip
        theme={theme}
        title="Lock in your C fundamentals"
        subtitle="See where you stand before placement season ramps up."
        buttonLabel="Take the C Skill Readiness Test"
        to="/interview-readiness-tools"
      />
    </div>
  );
}

function Year2Section({ branch, theme }) {
  const cards = branch === 'cs' ? Y2_CS_CARDS : Y2_NONCS_CARDS;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:gap-5">
        {cards.map((c) => (
          <RoadmapCard key={c.title} theme={theme} title={c.title} tags={c.tags} note={c.note} />
        ))}
      </div>
      <div className="space-y-3">
        <MilestoneRow theme={theme} icon="check">
          <strong className="font-bold text-foreground">Skill Readiness Test:</strong> MentorMuni DSA &amp; Language Readiness
          Check
        </MilestoneRow>
        <MilestoneRow theme={theme} icon="check">
          <strong className="font-bold text-foreground">Resume Review:</strong> Get your resume reviewed by a mentor
        </MilestoneRow>
        <MilestoneRow theme={theme} icon="star">
          <strong className="font-bold text-foreground">Goal:</strong> 50+ LeetCode (CS) / 20+ LeetCode (Non-CS) + Internship
          applied + CS subjects understood + Resume ready
        </MilestoneRow>
      </div>
      <CTAStrip
        theme={theme}
        title="Benchmark your stack"
        subtitle="DSA, language depth, and core CS — one structured check."
        buttonLabel="Check Your Skill Readiness"
        to="/interview-readiness-tools"
      />
    </div>
  );
}

function Year3Section({ branch, theme }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:gap-5">
        {Y3_CARDS.map((c) => {
          const extra = branch === 'noncs' && c.nonCsNote ? c.nonCsNote : c.note;
          return <RoadmapCard key={c.title} theme={theme} title={c.title} tags={c.tags} note={extra} />;
        })}
      </div>
      <div className="space-y-3">
        <MilestoneRow theme={theme} icon="check">
          <strong className="font-bold text-foreground">Interview Readiness Test:</strong> Full MentorMuni Assessment —
          coding, design, aptitude, communication
        </MilestoneRow>
        <MilestoneRow theme={theme} icon="check">
          <strong className="font-bold text-foreground">Resume Final Version:</strong> Projects + Internship + Skills updated,
          mentor reviewed
        </MilestoneRow>
        <MilestoneRow theme={theme} icon="star">
          <strong className="font-bold text-foreground">Goal:</strong> AI project live on cloud + 150+ LeetCode (CS) / 75+
          (Non-CS) + aptitude cleared in mocks + interview-ready
        </MilestoneRow>
      </div>
      <CTAStrip
        theme={theme}
        title="Full panel-style readiness"
        subtitle="Breadth + depth — how recruiters actually filter."
        buttonLabel="Take Interview Readiness Test"
        to="/start-assessment"
      />
    </div>
  );
}

function Year4Section({ theme }) {
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-lg" style={{ color: theme.accent }} aria-hidden>
            ✓
          </span>
          <h3 className="text-lg font-extrabold" style={{ color: theme.dark }}>
            If You&apos;re On Track
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:gap-5">
          {Y4_ON_TRACK.map((c) => (
            <RoadmapCard key={c.title} theme={theme} title={c.title} tags={c.tags} />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-lg text-amber-700" aria-hidden>
            ⚠
          </span>
          <h3 className="text-lg font-extrabold text-amber-900">If You&apos;re Behind — Sprint Plan</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:gap-5">
          {Y4_SPRINT.map((c) => (
            <RoadmapCard key={c.title} theme={theme} title={c.title} tags={c.tags} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <MilestoneRow theme={theme} icon="check">
          <strong className="font-bold text-foreground">Still in doubt?</strong> Visit mentormuni.com — take both readiness tests
          and join the mentorship batch
        </MilestoneRow>
        <MilestoneRow theme={theme} icon="check">
          <strong className="font-bold text-foreground">Company tier strategy:</strong> Know which companies suit your current
          level — don&apos;t aim blind
        </MilestoneRow>
        <MilestoneRow theme={theme} icon="star">
          <strong className="font-bold text-foreground">Remember:</strong> Off-campus = as important as on-campus. Apply
          everywhere, network actively.
        </MilestoneRow>
      </div>

      <CTAStrip
        theme={theme}
        title="Get structured support"
        subtitle="Mentors who’ve run 100+ interviews — batches fill fast."
        buttonLabel="Join MentorMuni Mentorship Batch"
        to="/waitlist"
      />
      <p className="text-center text-sm text-muted-foreground">
        <a
          href={`${MENTORMUNI_ORIGIN}/#/contact`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#7F77DD] underline decoration-[#7F77DD]/40 underline-offset-2 transition hover:text-[#5B54B8]"
        >
          Still unsure? Chat with a Mentor at mentormuni.com
        </a>
      </p>
    </div>
  );
}

export default function RoadmapPage() {
  const [branch, setBranch] = useState('cs');
  const [activeYear, setActiveYear] = useState(1);
  const prefersReducedMotion = useReducedMotion();

  const theme = ROADMAP_YEAR_THEME[activeYear];
  const yearKeys = [1, 2, 3, 4];

  const panelTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.38, ease: [0.22, 1, 0.36, 1] };

  return (
    <div className="min-h-screen min-w-0 mm-site-theme">
      {/* Hero */}
      <section className="border-b border-border px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            <div className="lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12">
              <div>
                <h1 className="text-3xl font-black leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                  From Fresher to Placement-Ready
                </h1>
                <p className="mx-auto mt-5 max-w-2xl text-base font-normal leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
                  A mentor-designed 4-year roadmap — what to build each year so you&apos;re ready for campus placements at top IT
                  companies, with clear milestones and focus areas.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
                  <Link
                    to="/interview-readiness-tools"
                    className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#1D9E75] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-95 active:scale-[0.98]"
                  >
                    Take Skill Readiness Test
                  </Link>
                  <Link
                    to="/waitlist"
                    className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-[#FF9500] bg-transparent px-6 py-3 text-sm font-bold text-[#FF9500] transition hover:bg-[#FFF4E0]"
                  >
                    Join Mentorship Batch
                  </Link>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
                  {['4 Year Plan', 'DSA + AI + Cloud', 'Interview Ready'].map((pill) => (
                    <span
                      key={pill}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-10 hidden rounded-2xl border border-border bg-card/80 p-6 shadow-sm lg:mt-0 lg:block">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">At a glance</p>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-[#1D9E75]">●</span>
                    Year-by-year skills, milestones, and CTAs
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#378ADD]">●</span>
                    CS/IT vs Non-CS tracks where it matters most
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#D85A30]">●</span>
                    Linked to MentorMuni readiness tests &amp; waitlist
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Branch toggle */}
          <div className="mx-auto mt-12 max-w-3xl lg:mt-16">
            <p className="mb-3 text-center text-sm font-semibold text-foreground sm:text-left">I am a</p>
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center lg:justify-start">
              <button
                type="button"
                onClick={() => setBranch('cs')}
                className={`min-h-[48px] flex-1 rounded-xl border-2 px-4 py-3 text-sm font-bold transition-all duration-300 ease-out sm:flex-none sm:min-w-[200px] ${
                  branch === 'cs'
                    ? 'border-[#1D9E75] bg-[#E1F5EE] text-[#085041] shadow-sm'
                    : 'border-border bg-card text-muted-foreground hover:border-[#1D9E75]/40'
                }`}
              >
                CS / IT Student
              </button>
              <button
                type="button"
                onClick={() => setBranch('noncs')}
                className={`min-h-[48px] flex-1 rounded-xl border-2 px-4 py-3 text-sm font-bold transition-all duration-300 ease-out sm:flex-none sm:min-w-[260px] ${
                  branch === 'noncs'
                    ? 'border-[#1D9E75] bg-[#E1F5EE] text-[#085041] shadow-sm'
                    : 'border-border bg-card text-muted-foreground hover:border-[#1D9E75]/40'
                }`}
              >
                Non-CS Student (ECE / Mech / Civil)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-6xl min-w-0">
          {/* Year tabs — horizontal scroll on small screens to avoid wrap overflow */}
          <div className="relative -mx-4 min-w-0 sm:mx-0">
            <div
              className="flex snap-x snap-mandatory gap-2 overflow-x-auto overflow-y-visible overscroll-x-contain px-4 pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:items-end sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0 lg:justify-start [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Select academic year"
            >
              {yearKeys.map((y) => {
                const t = ROADMAP_YEAR_THEME[y];
                const active = activeYear === y;
                return (
                  <button
                    key={y}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={t.label}
                    id={`roadmap-tab-${y}`}
                    onClick={() => setActiveYear(y)}
                    className={`relative min-h-[44px] shrink-0 snap-start rounded-t-xl border-x border-t px-3 py-2.5 font-sans text-xs font-bold transition-all duration-300 ease-out min-[400px]:px-4 min-[400px]:text-sm sm:min-h-0 sm:scale-100 sm:px-5 sm:py-3 sm:text-base ${
                      active ? 'z-10 scale-[1.02] shadow-md sm:scale-105' : 'opacity-85 hover:opacity-100'
                    }`}
                    style={{
                      borderColor: active ? t.accent : '#E0E0DC',
                      backgroundColor: active ? t.light : '#fff',
                      color: active ? t.dark : '#666',
                    }}
                  >
                    <span className="sm:hidden">{t.short}</span>
                    <span className="hidden sm:inline">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-0 flex h-3 w-full min-w-0 overflow-hidden rounded-full bg-[#E5E5E0] shadow-inner">
            {yearKeys.map((y) => {
              const t = ROADMAP_YEAR_THEME[y];
              const filled = y <= activeYear;
              return (
                <div
                  key={y}
                  className="h-full flex-1 border-r border-white/40 last:border-r-0 transition-all duration-500"
                  style={{
                    backgroundColor: filled ? t.accent : 'transparent',
                    opacity: filled ? 1 : 0.25,
                  }}
                  title={t.label}
                />
              );
            })}
          </div>

          {/* Panel */}
          <div
            className="rounded-b-2xl border border-t-0 border-border bg-card p-5 shadow-sm sm:rounded-tr-2xl sm:p-8 md:rounded-tr-3xl md:p-10"
            role="tabpanel"
            aria-labelledby={`roadmap-tab-${activeYear}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${activeYear}-${branch}`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 1, transition: { duration: 0 } }
                    : { opacity: 0, y: -8 }
                }
                transition={panelTransition}
              >
                <header className="mb-8 border-b border-border pb-6">
                  <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl" style={{ color: theme.dark }}>
                    {theme.title}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm font-normal leading-relaxed text-muted-foreground sm:text-base">
                    {theme.subtitle}
                  </p>
                </header>

                <div>
                  {activeYear === 1 && <Year1Section branch={branch} theme={theme} />}
                  {activeYear === 2 && <Year2Section branch={branch} theme={theme} />}
                  {activeYear === 3 && <Year3Section branch={branch} theme={theme} />}
                  {activeYear === 4 && <Year4Section theme={theme} />}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
