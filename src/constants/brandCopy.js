/**
 * MentorMuni — shared marketing copy (one CTA promise, one mission line).
 * Import from components; update here to align the whole site.
 */

/** Primary action to the free readiness assessment — use everywhere for that flow */
export const PRIMARY_CTA_LABEL = 'Check my readiness — free';

/** Above-the-fold pain hook (problem in one breath) */
export const PAIN_HOOK =
  "Most students don't discover their real interview gaps until after a rejection. We show you where you stand in minutes—then what to fix first.";

/** Homepage hero — chips (split on ·). Audience · focus · Mentors + AI */
export const HERO_EYEBROW =
  'Engineering students in India · interview preparation · Mentors + AI';
/** Early-bird coupon card ribbon (homepage hero) */
export const HERO_EARLY_BIRD_RIBBON = 'Early bird';
export const HERO_HEADLINE = "You can't fix what you don't measure.";
/** Orange payoff line — own line under the dark headline (readability + emphasis) */
export const HERO_HEADLINE_ACCENT = 'Get your readiness score in ~5 minutes.';
/** Bridge below hero headline: rejection (hook) → score & gaps (value), reduces bounce */
export const HERO_SUBHEADLINE =
  "Rejection shouldn't be how you discover your gaps. See where you stand in minutes—then what to fix first.";
export const HERO_PROBLEM_LABEL = 'Why it matters';
export const HERO_PROBLEM =
  'Most students only see their real interview gaps after a rejection—not before they walk in.';
export const HERO_SOLUTION_LABEL = 'How MentorMuni helps';
export const HERO_SOLUTION =
  'A free score, your gaps by topic, and what to fix first—then AI mocks and mentors when you want more.';
export const HERO_PROOF_STAT = '~5 min · Free · No signup · Instant score';

/**
 * Homepage hero — personalized by academic year or experience level.
 * Copy is product-accurate: same assessment; framing matches urgency.
 */
export const HERO_YEAR_COPY = {
  y2: {
    headline: 'Build the right foundations—before placement pressure hits.',
    accent: 'Get a readiness baseline in ~5 minutes.',
    sub:
      'Campus drives feel far away until they are not. Map DSA, System Design, HR, and projects to where you are now—so when OA season starts, you are not guessing what to fix first.',
  },
  y3: {
    headline: 'Internship season rewards clarity—not endless grinding.',
    accent: 'Know your gaps before the OA and interview window.',
    sub:
      'Shortlists go to people who sound clear under pressure—not who solved the most random problems. Benchmark tech + HR readiness, then prep the top gaps before your next online assessment.',
  },
  y4: {
    headline: HERO_HEADLINE,
    accent: HERO_HEADLINE_ACCENT,
    sub:
      'Placement season is noisy—CGPA, OA, HR, tech. One readiness score across four areas shows what to fix first, then AI mocks and mentors when you want depth.',
  },
  /** Working professionals — interview + skill readiness (same rubric; framing matches career moves). */
  yexp: {
    headline: 'Switching roles or levelling up? Measure before you commit months to the wrong prep.',
    accent: 'Interview readiness + skill readiness—in one structured baseline (~5 min).',
    sub:
      'Panels care how you communicate trade-offs, not only years on a CV. Benchmark interview readiness alongside skill signals across DSA, System Design, HR, and projects—then close gaps with mocks and mentors aligned to where you actually want to land.',
  },
};

/** Eyebrow above the compact hero proof strip */
export const HERO_PROOF_SECTION_EYEBROW = 'What the test covers';

/** Four scored pillars — shown as compact chips (not repeated in body copy). */
export const HERO_PROOF_PILLARS = ['DSA', 'System Design', 'HR', 'Projects'];

/**
 * Tight secondary row: icon + one short line each (timer · gauge · gift).
 */
export const HERO_PROOF_FACTS = [
  { icon: 'timer', text: '~5 min · no account' },
  { icon: 'gauge', text: '0–100 readiness score' },
  { icon: 'gift', text: 'Free — mentor + AI mock coupon after' },
];

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

/** Homepage — “why start here” section (conversion) */
export const CONVERSION_WHY_SECTION_HEADLINE = 'Why students start with the free test';
export const CONVERSION_WHY_SECTION_SUB =
  'No payment. No signup. A clear score—then you choose depth: AI mocks, mentors, or placement tracks when you are ready.';

/** Three pillars — order matches icon column on homepage */
export const CONVERSION_WHY_CARDS = [
  {
    title: 'A number that cuts through the noise',
    body: 'One score with DSA, System Design, HR, and project signals—so you know what to fix first, not what to scroll next.',
    kicker: 'Free · ~5 min · no signup',
  },
  {
    title: 'Early-bird reward after you finish',
    body: 'Complete the test and get a coupon for 1 free 1:1 mentor session + 1 AI mock—emailed to you.',
    kicker: 'Coupon unlocks after the test',
  },
  {
    title: 'Mentorship when you want depth',
    body: 'Join the waitlist for cohort-based mentor prep matched to your readiness—not a one-size syllabus.',
    kicker: 'Limited seats per batch',
  },
];

/** Homepage — final CTA block (above footer) */
export const FINAL_CTA_HEADLINE = 'Stop guessing what to study this week.';
export const FINAL_CTA_HEADLINE_ACCENT = 'Take the free test—then choose how deep you go.';
export const FINAL_CTA_BODY =
  'Random prep hides your real gap. Get one readiness score, see where you stand in DSA, System Design, HR, and projects, and what to fix first—then unlock AI mocks and mentorship when you want more.';

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
};
