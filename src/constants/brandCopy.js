/**
 * MentorMuni — shared marketing copy (one CTA promise, one mission line).
 * Import from components; update here to align the whole site.
 */

/** Primary action to the free readiness assessment — use everywhere for that flow */
export const PRIMARY_CTA_LABEL = 'Check my readiness — free';

/** Above-the-fold pain hook (problem in one breath) */
export const PAIN_HOOK =
  "Most students don't discover their real interview gaps until after a rejection. We show you where you stand in minutes—then what to fix first.";

/** Homepage hero — chips (split on ·). Keep concrete; avoid “platform” jargon */
export const HERO_EYEBROW =
  'Engineering students in India · interview readiness · Mentors';
/** Early-bird coupon card ribbon (homepage hero) */
export const HERO_EARLY_BIRD_RIBBON = 'Early bird';
/** Small hero sticker (limited slots — keep short) */
export const HERO_EARLY_BIRD_STICKER = 'Early bird · First 50';
/** Second hero sticker — early-career / Gen Z audience (keep short; professional) */
export const HERO_GENZ_STICKER = 'Gen Z · Clear gaps, real practice';
export const HERO_HEADLINE = "You can't fix what you don't measure.";
/** Orange payoff line — own line under the dark headline (readability + emphasis) */
export const HERO_HEADLINE_ACCENT = 'Get your readiness score in ~5 minutes.';
/** Homepage hero — fixed first line (always visible; not typewriter) */
export const HERO_HEADLINE_FIXED = "We don't teach you more.";
/** Homepage hero — typewriter rotates these lines under the fixed headline */
export const HERO_TYPEWRITER_PHRASES = [
  'We make sure you can perform in interviews.',
  "Because knowing is useless if you can't answer.",
];
/** Homepage hero — body copy under the typewriter (single paragraph; no read-more) */
export const HERO_HOME_SUB =
  'A free readiness check shows where you stand vs. what panels test—then mocks, feedback, and reps so you can perform when it counts.';
/** Highlighted journey lines (homepage hero) */
export const HERO_JOURNEY_STEPS = 'Test → Break confidence → Show gap → Fix gap';
export const HERO_JOURNEY_ARC =
  "We've designed a system that takes you from confused → confident → interview-ready";
/** Bridge below hero headline: rejection (hook) → score & gaps (value), reduces bounce */
export const HERO_SUBHEADLINE =
  "Rejection shouldn't be how you discover your gaps. See where you stand in minutes—then what to fix first.";
export const HERO_PROBLEM_LABEL = 'Why it matters';
export const HERO_PROBLEM =
  'Most students only see their real interview gaps after a rejection—not before they walk in.';
export const HERO_SOLUTION_LABEL = 'How MentorMuni helps';
export const HERO_SOLUTION =
  'A free score, your gaps by topic, and what to fix first—then mocks and mentors when you want more.';
export const HERO_PROOF_STAT = '~5 min · Free · No signup · Instant score';

/** Homepage — pain section below hero (eyebrow · headline · sub · three cards) */
export const REAL_PROBLEM_EYEBROW = 'The real problem';
export const REAL_PROBLEM_HEADLINE =
  'You studied hard. You still blanked in the interview.';
export const REAL_PROBLEM_SUB =
  "Knowledge is not the problem. Performance under pressure is. Here's why students fail even after months of preparation.";
export const REAL_PROBLEM_CARDS = [
  {
    title: 'They practice without a score',
    body:
      "Solving problems randomly with no feedback loop. You don't know if you're improving or just staying busy.",
  },
  {
    title: 'They prepare, not perform',
    body:
      "Reading solutions is very different from articulating them live under an interviewer's pressure. Two completely different skills.",
  },
  {
    title: 'No gap analysis',
    body:
      "Students spend 80% of time on topics they're already decent at. The weakest areas — the ones that cost offers — get ignored.",
  },
];

/** Homepage — comparison table (vs LeetCode, YouTube, coaching) */
export const COMPARISON_TABLE_EYEBROW = 'Why not just use…';
export const COMPARISON_TABLE_HEADLINE = "We're not another prep tool.";
export const COMPARISON_TABLE_SUB =
  "Here's how MentorMuni compares to what you're already using — honestly.";
export const COMPARISON_TABLE_FEATURE_COL_LABEL = 'What it gives you';
export const COMPARISON_TABLE_BRANDS = [
  'LeetCode',
  'YouTube',
  'Coaching institutes',
  'MentorMuni',
];
/** Row label + four cells: `yes` | `no` | short orange label (e.g. Sometimes) */
export const COMPARISON_TABLE_ROWS = [
  {
    label: 'Scored readiness check',
    cells: ['no', 'no', 'Sometimes', 'yes'],
  },
  {
    label: 'Personalised gap analysis',
    cells: ['no', 'no', 'no', 'yes'],
  },
  {
    label: 'Live answer performance training',
    cells: ['no', 'no', 'Rarely', 'yes'],
  },
  {
    label: 'Mock interview with scoring',
    cells: ['no', 'no', 'no', 'yes'],
  },
  {
    label: 'Mentor accountability',
    cells: ['no', 'no', 'Varies', 'yes'],
  },
  {
    label: 'Free to start',
    cells: ['yes', 'yes', 'no', 'yes'],
  },
];

/** Homepage — “How it works” strip (feature cards under the story section) */
export const HOW_IT_WORKS_HEADLINE =
  'Measure first—then prep what hiring rounds actually test.';

/** Homepage — dark “reality check” (who it’s for / not for) */
export const REALITY_CHECK_EYEBROW = 'Be honest with yourself';
export const REALITY_CHECK_HEADLINE = 'This is not for everyone.';
export const REALITY_CHECK_SUB =
  "We only want serious students. If you're looking for shortcuts, this isn't it.";
export const REALITY_CHECK_NOT_TITLE = 'This is not for you if…';
export const REALITY_CHECK_FOR_TITLE = 'This is for you if…';
export const REALITY_CHECK_NOT_ITEMS = [
  'You want someone to solve problems for you',
  "You're not willing to do daily practice sessions",
  'You think you already know everything and just need "luck"',
  'You want a certificate, not an actual offer',
  "You're looking for a 3-day crash course before your interview tomorrow",
];
export const REALITY_CHECK_FOR_ITEMS = [
  "You've prepared but keep getting rejected — and don't know why",
  'You blank under pressure even when you know the answer',
  'You want to know exactly where you stand — not guess',
  "You're willing to work hard for 6 weeks to change your outcome",
  'You want an offer at a company worth joining — not just any job',
];
export const REALITY_CHECK_CTA = "I'm serious — Take the Reality Check";

/** Homepage — 6-week interview readiness program (timeline + pricing card) */
export const PROGRAM_6WEEK_EYEBROW = 'The 6-week program';
export const PROGRAM_6WEEK_HEADLINE = 'From your score to your offer.';
export const PROGRAM_6WEEK_SUB =
  'A structured, mentor-guided program built around your reality check score. No generic content. Every day has a purpose.';
export const PROGRAM_6WEEK_PHASES = [
  {
    title: 'Weeks 1-2: Gap audit + foundation fix',
    body:
      'Deep dive into your lowest-scoring area. Targeted drills, not random problems.',
  },
  {
    title: 'Weeks 3-4: Answer structure training',
    body:
      'Learn how to frame and deliver answers. Daily mock sessions with rubric scoring.',
  },
  {
    title: 'Week 5: Full mock interview rounds',
    body:
      'End-to-end interview simulations. Score tracked weekly. Mentor review every session.',
  },
  {
    title: 'Week 6: Offer readiness sprint',
    body:
      'Final polish — company-specific prep, negotiation, offer conversion mindset.',
  },
];
export const PROGRAM_6WEEK_CARD_BADGE = 'Most popular';
export const PROGRAM_6WEEK_CARD_TITLE = '6-Week Interview Readiness Program';
/** Display prices blurred in UI; keep for ops / future unblur */
export const PROGRAM_6WEEK_PRICE_MAIN = '₹5,999';
export const PROGRAM_6WEEK_PRICE_MAIN_SUFFIX = 'one-time';
export const PROGRAM_6WEEK_PRICE_STRIKE = '₹9,999 — Early bird pricing';
/** Single line instead of a long checklist on the homepage */
export const PROGRAM_6WEEK_SUMMARY =
  'Includes your roadmap, scored mocks, weekly mentor sessions, answer modules, a final re-test, and a small accountability group—details when pricing goes live.';

/**
 * Homepage hero — personalized by academic year or experience level.
 * Copy is product-accurate: same assessment; framing matches urgency.
 * `subShort` = first-screen body; full `sub` shown after “Read more”.
 */
export const HERO_YEAR_COPY = {
  y2: {
    headline: 'Build the right foundations—before placement pressure hits.',
    accent: 'Get a readiness baseline in ~5 minutes.',
    subShort:
      "Map DSA, System Design, HR, and projects to where you are now—so you're not guessing when OA season hits.",
    sub:
      'Campus drives feel far away until they are not. Map DSA, System Design, HR, and projects to where you are now—so when OA season starts, you are not guessing what to fix first.',
  },
  y3: {
    headline: 'Internship season rewards clarity—not endless grinding.',
    accent: 'Know your gaps before the OA and interview window.',
    subShort:
      'Benchmark tech + HR readiness, then prep the top gaps before your next online assessment.',
    sub:
      'Shortlists go to people who sound clear under pressure—not who solved the most random problems. Benchmark tech + HR readiness, then prep the top gaps before your next online assessment.',
  },
  y4: {
    headline: HERO_HEADLINE,
    accent: HERO_HEADLINE_ACCENT,
    subShort: HERO_HOME_SUB,
    sub: HERO_HOME_SUB,
  },
  /** Working professionals — interview + skill readiness (same rubric; framing matches career moves). */
  yexp: {
    headline: 'Switching roles or levelling up? Measure before you commit months to the wrong prep.',
    accent: 'Interview readiness + skill readiness—in one structured baseline (~5 min).',
    subShort:
      'Benchmark DSA, System Design, HR, and projects—then close gaps with mocks and mentors aligned to your goal.',
    sub:
      'Panels care how you communicate trade-offs, not only years on a CV. Benchmark interview readiness alongside skill signals across DSA, System Design, HR, and projects—then close gaps with mocks and mentors aligned to where you actually want to land.',
  },
};

/** Canonical public URL for share links (WhatsApp, copy) — matches deployed base path */
export const SITE_SHARE_BASE = 'https://mentormuni.com/MentorMuni-React-Frontend';
export const SITE_SHARE_ASSESSMENT_URL = `${SITE_SHARE_BASE}/start-assessment`;

/**
 * Viral one-liner for messages (result page, OG emphasis). Keep under ~160 chars for previews.
 */
export const BRAND_MEME_LINE = "You can't fix what you don't measure.";

/**
 * Build WhatsApp / native / clipboard share text from assessment result.
 */
export function buildResultShareMessage(score, roleLabel = 'Student') {
  const hook =
    score >= 75
      ? 'Feeling sharp on interview readiness.'
      : score >= 50
        ? 'Found my gaps before placement season.'
        : 'Got my baseline — now I know what to fix first.';
  return `${hook} Scored ${score}/100 on MentorMuni (${roleLabel}). ${BRAND_MEME_LINE} Free test (~5 min, no signup):\n${SITE_SHARE_ASSESSMENT_URL}`;
}

/** Mission / positioning — footer, meta, tool intros */
export const MISSION_TAGLINE =
  'Readiness scores, specific gaps, and mentor-backed practice—so you walk into interviews prepared, not guessing.';

/** Completing the free Interview Readiness assessment — coupon reward (homepage + promos) */
/** Promo bar — line 1: the offer (what) */
export const READINESS_TEST_COUPON_OFFER_HEADLINE =
  '1 free 1:1 mentorship + 1 free AI mock interview';
/** Promo bar — line 2: how you get it */
export const READINESS_TEST_COUPON_OFFER_HOW =
  'How: take the free readiness test (~5 min). Your coupon code is emailed right after.';
/** One-line summary for nav / tool strips that only have room for a single sentence */
export const READINESS_TEST_COUPON_PROMO =
  'Free: 1× 1:1 mentorship + 1× AI mock — unlock by completing the free readiness test.';
/** Short line for badges / narrow layouts */
export const READINESS_TEST_COUPON_BADGE =
  '1× 1:1 mentor + 1× AI mock · coupon after free test';
/** Prep map card (narrow column) — short lines so nothing clips */
export const READINESS_TEST_COUPON_CARD_HEADLINE = 'Your real test unlocks a code';
export const READINESS_TEST_COUPON_CARD_BODY =
  'Coupon: 1 free 1:1 + 1 AI mock after your test';
export const READINESS_TEST_COUPON_CARD_CTA = 'Check my readiness';

/** Stale-date-free mentorship messaging */
export const MENTORSHIP_BANNER = 'Mentorship programme · Limited seats per batch';

export const MENTORSHIP_TRUST_BADGE = 'Mentorship cohorts · Waitlist open · Limited seats';

/** Sticky mobile bar — second line under Join waitlist */
export const WAITLIST_STICKY_TEASER = 'Cohort seats · limited';

/** Homepage — one short line between Expert Mentorship and final CTA (no second “Why” block) */
export const HOMEPAGE_MENTORS_TO_CTA_BRIDGE = 'Ready to move forward?';

/** Homepage — final CTA block (above footer) */
export const FINAL_CTA_HEADLINE = 'Stop guessing what to study this week.';
export const FINAL_CTA_HEADLINE_ACCENT = 'Take the free test—then choose how deep you go.';
export const FINAL_CTA_BODY =
  'Get one readiness score and a clear “fix this first” list—then add mocks or mentors only if you need them.';

/** Footer / nav: name of the free assessment product (not “mock interviews”) */
export const PRODUCT_READINESS_SCORE = 'Interview readiness score';

/** Public contact phone — keep in sync across footer, contact, pricing */
export const CONTACT_PHONE_DISPLAY = '+91 91464 21302';
export const CONTACT_PHONE_HREF = 'tel:+919146421302';

/** Per-route SEO titles — update document.title dynamically */
export const ROUTE_TITLES = {
  '/': 'MentorMuni — Know Your Interview Readiness Score in 5 Minutes',
  '/how-it-works': 'How MentorMuni Works — Step-by-Step Interview Prep | MentorMuni',
  '/mentors': 'Expert Industry Mentors — 12–15 Yrs Experience | MentorMuni',
  '/outcomes': 'Student Outcomes & Success Stories | MentorMuni',
  '/pricing': 'Plans & Pricing | MentorMuni',
  '/waitlist': 'Join the Mentorship Waitlist — Limited Seats | MentorMuni',
  '/tools': 'All Interview Prep Tools | MentorMuni',
  '/tools/interview-readiness': 'Interview Readiness Score Tool | MentorMuni',
  '/interview-readiness-tools': 'Interview Readiness Tools | MentorMuni',
  '/mock-interviews': 'AI Mock Interviews — Practice Under Real Pressure | MentorMuni',
  '/resume-analyzer': 'Resume ATS Checker — See How Screeners Read Your Resume | MentorMuni',
  '/skill-gap-analyzer': 'Skill Gap Analyzer for Engineers | MentorMuni',
  '/ai-tools': 'AI Tools Knowledge Base for Engineers | MentorMuni',
  '/java-tutorial': 'Java Tutorial for Beginners — Free | MentorMuni',
  '/java-for-beginners': 'Java Tutorial for Beginners — Free | MentorMuni',
  '/python-tutorial': 'Python Tutorial for Beginners — Free | MentorMuni',
  '/python-for-beginners': 'Python Tutorial for Beginners — Free | MentorMuni',
  '/sql-tutorial': 'SQL Tutorial for Beginners — Free | MentorMuni',
  '/sql-for-beginners': 'SQL Tutorial for Beginners — Free | MentorMuni',
  '/generative-ai-tutorial': 'Generative AI for Beginners — Free Tutorial | MentorMuni',
  '/tutorials/generative-ai-for-beginners': 'Generative AI for Beginners — Free | MentorMuni',
  '/prompt-engineering': 'Prompt Engineering Masterclass — Free | MentorMuni',
  '/courses/prompt-engineering-masterclass': 'Prompt Engineering Masterclass | MentorMuni',
  '/rag-systems': 'RAG Systems Tutorial — Build AI Apps | MentorMuni',
  '/courses/rag-systems': 'RAG Systems Tutorial | MentorMuni',
  '/quantum-computing': 'Quantum Computing for Engineers — Free | MentorMuni',
  '/courses/quantum-computing': 'Quantum Computing Tutorial | MentorMuni',
  '/courses/devops-roadmap-for-beginners': 'DevOps Roadmap for Beginners — Free | MentorMuni',
  '/free-tutorials': 'Free Tutorials for Engineering Students | MentorMuni',
  '/learning-paths': 'Learning Paths for Campus Placements | MentorMuni',
  '/placement-tracks': 'Placement Tracks — TCS, Infosys, Cognizant & More | MentorMuni',
  '/leadership-board': 'Interview Readiness Leaderboard | MentorMuni',
  '/colleges': 'MentorMuni for Colleges — Batch Readiness Dashboard',
  '/for-recruiters': 'For Recruiters — Pre-Screened Interview-Ready Talent | MentorMuni',
  '/contact': 'Contact MentorMuni — We\'re Here to Help',
  '/career-health': 'Career Health Dashboard | MentorMuni',
  '/dashboard/health': 'Career Health Dashboard | MentorMuni',
  '/dashboard': 'Dashboard | MentorMuni',
  '/result': 'Your Interview Readiness Score | MentorMuni',
};
