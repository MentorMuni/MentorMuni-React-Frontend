/**
 * MentorMuni — shared marketing copy (one CTA promise, one mission line).
 * Import from components; update here to align the whole site.
 */

/**
 * Single customer-facing name for the free scored assessment (homepage, nav, promos).
 * Use this phrase instead of mixing “reality check”, “readiness test”, and “readiness score” as product names.
 * (The numeric outcome can still be called “score” or “your score”.)
 */
export const READINESS_CHECK_PRODUCT_NOUN = 'readiness check';

/** Primary action to the free readiness assessment — use everywhere for that flow */
export const PRIMARY_CTA_LABEL = 'Take the free readiness check';

/** Secondary — talk to team (homepage, final CTA row) */
export const SECONDARY_CTA_BOOK_CALL = 'Book a call';

/** Above-the-fold pain hook (problem in one breath) */
export const PAIN_HOOK =
  "Most students don't discover their real interview gaps until after a rejection. We show you where you stand in minutes—then what to fix first.";

/** Homepage hero — chips (split on ·). Keep concrete; avoid “platform” jargon */
export const HERO_EYEBROW =
  'Interview readiness system · Built for engineering students';
/** Early-bird coupon card ribbon (homepage hero) */
export const HERO_EARLY_BIRD_RIBBON = 'Early bird';
/** Small hero sticker (limited slots — keep short) */
export const HERO_EARLY_BIRD_STICKER = 'Early bird · First 50';
/** Second hero sticker — early-career / Gen Z audience (keep short; professional) */
export const HERO_GENZ_STICKER = 'Not a course — a system';
export const HERO_HEADLINE = "You can't fix what you don't measure.";
/** Orange payoff line — own line under the dark headline (readability + emphasis) */
export const HERO_HEADLINE_ACCENT = 'Get your score from the free readiness check in ~5 minutes.';
/** Homepage hero — two-line headline (render as two blocks; avoids awkward 3-line wrap) */
export const HERO_HEADLINE_LINE1 = 'Are You Actually';
export const HERO_HEADLINE_LINE2 = 'Interview-Ready?';
/** Light quip under the eyebrow — playful, not the main headline */
export const HERO_PLAYFUL_CLAUSE = 'From reels to reality — different kind of screen time.';
/** @deprecated Use HERO_HEADLINE_LINE1 + LINE2 */
export const HERO_HEADLINE_FIXED = `${HERO_HEADLINE_LINE1}\n${HERO_HEADLINE_LINE2}`;
/** Homepage hero — typewriter rotates these lines under the fixed headline */
export const HERO_TYPEWRITER_PHRASES = [
  "We don't teach. We make you perform.",
  'You won’t crack interviews without practicing them.',
];
/** Homepage hero — body copy under the typewriter (single paragraph; no read-more) */
export const HERO_HOME_SUB =
  'Most students think they are prepared. They fail when it matters. A free readiness check shows where you stand vs what panels actually test — then you close gaps with reps, not hope.';
/** Highlighted journey lines (homepage hero) — loop + positioning */
export const HERO_JOURNEY_STEPS = 'Mock interview → 1:1 session → Improve → Repeat';
export const HERO_JOURNEY_ARC =
  'Join MentorMuni — a structured way to prepare for interviews.';
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

/** Homepage hero — trust bullets (honest; no unverified lift claims) */
export const HERO_PROOF_BULLETS = [
  'Free · No signup · ~5 min',
  'Founding batch · limited seats per cohort',
  'Measure → gap report → structured reps',
];

/** Homepage hero — one line under CTAs (scannable; avoid bullet walls) */
export const HERO_PROOF_ONE_LINER =
  'Free · No signup · ~5 min · Mocks + mentors when you level up';

/** Homepage hero — social proof (screen readers get full sentence; UI stays tiny) */
export const HERO_SOCIAL_PROOF_ARIA =
  'Engineering students across India use the free readiness check before placement season. You can take it too.';

/** Visible hero social line (no inflated counts — qualitative trust) */
export const HERO_SOCIAL_PROOF_VISIBLE_LINE =
  'Engineering students across India — taking the free readiness check first.';

/** Homepage hero — quick clarity about what we offer */
export const HERO_PLATFORM_HIGHLIGHTS = [
  'Interview preparation platform',
  'For 3rd & 4th year students',
  'Mock interview preparation',
  'Technical + HR interview practice',
  '1:1 mentorship',
  'Scored readiness check',
  'Skill gap visibility',
  'Mentor + AI driven platform',
];

/** Homepage — pain section below hero (eyebrow · headline · sub · three cards) */
export const REAL_PROBLEM_EYEBROW = 'The uncomfortable truth';
export const REAL_PROBLEM_HEADLINE =
  'Most students at your level fail interviews — not because they did not study.';
export const REAL_PROBLEM_SUB =
  'Knowledge is not the problem. Performance under pressure is. Here is why busy preparation still breaks in the real round.';
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
export const COMPARISON_TABLE_HEADLINE = 'An interview readiness system — not another content library.';
export const COMPARISON_TABLE_SUB =
  'We are not here to dump more tutorials. We measure you, then train you to perform when the panel is staring at you.';
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
  'One spine: measure → expose the gap → train performance.';

/** One paragraph under HOW_IT_WORKS_HEADLINE on homepage */
export const HOW_IT_WORKS_SUB =
  'Everything else supports that path. Mocks, resume checks, and tutorials are secondary — the conversion engine is: take the readiness check, see your gap, then join the 5-week interview readiness program if you want structured reps.';

/** Homepage — fit block (who it’s for / not for); uses same product name as READINESS_CHECK_PRODUCT_NOUN */
export const REALITY_CHECK_EYEBROW = 'After your readiness check';
export const REALITY_CHECK_HEADLINE = 'This is not for everyone.';
export const REALITY_CHECK_SUB =
  'If you want comfort, watch another tutorial. If you want an offer, we will push you where it hurts — in a safe practice room first.';
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
  "You're willing to work hard for 5 focused weeks to change your outcome",
  'You want an offer at a company worth joining — not just any job',
];
export const REALITY_CHECK_CTA = PRIMARY_CTA_LABEL;

/** Homepage — HR & communication confidence (inclusive of Hindi-medium learners) */
export const HR_READINESS_EYEBROW = 'Interviews · Communication · Confidence';
export const HR_READINESS_HEADLINE = 'Scared of interviews—or English after Hindi medium?';
export const HR_READINESS_HEADLINE_ACCENT = 'Our HR readiness track is built to lift you up, not judge you.';
export const HR_READINESS_SUB =
  'Plenty of strong students freeze in HR rounds or doubt how they sound. That is a skill gap like any other—and it is fixable with the right reps, feedback, and a safe space to practise before the real panel.';
export const HR_READINESS_PROGRAM_LINE =
  'Our HR readiness program focuses on how you show up: opening confidently, structuring answers, handling common HR questions, and sounding clear under pressure—so you walk in steadier than you feel today.';
export const HR_READINESS_POINTS = [
  {
    title: 'Interview fear',
    body: 'You are not “weak”—you are under-rehearsed for live scrutiny. We replace panic with a repeatable practice loop.',
  },
  {
    title: 'Communication in the room',
    body: 'Panels listen to how you speak, not only what you memorised. You train delivery, pace, and presence—not endless grammar drills alone.',
  },
  {
    title: 'Hindi-medium background',
    body: 'If you studied in Hindi and worry about English in interviews, you are welcome here. Mentors work with your level and push you where it helps—without embarrassment.',
  },
];

/**
 * Paid program — single public offer (homepage + /pricing).
 * Legacy export names use PROGRAM_6WEEK_*; duration is 5 weeks.
 */
export const PROGRAM_6WEEK_EYEBROW = 'The 5-week system';
export const PROGRAM_6WEEK_HEADLINE = 'From your score to real interview performance.';
export const PROGRAM_6WEEK_SUB =
  'Structured, mentor-guided execution — not a “course” you half-watch. Built around your readiness-check score. One price, one program — no hidden tiers.';
export const PROGRAM_6WEEK_PHASES = [
  {
    title: 'Week 1: Gap audit + foundation fix',
    body: 'Deep dive into your lowest-scoring area. Targeted drills, not random problems.',
  },
  {
    title: 'Week 2: Answer structure + daily reps',
    body: 'Frame and deliver answers under time. Mock sessions with rubric scoring — not passive videos.',
  },
  {
    title: 'Week 3: Full mock interview rounds',
    body: 'End-to-end simulations. Scores tracked. Mentor review after every round.',
  },
  {
    title: 'Week 4: Company-specific prep',
    body: 'Tracks for service MNCs and product roles — aptitude, technical, and HR aligned to your targets.',
  },
  {
    title: 'Week 5: Offer readiness sprint',
    body: 'Final re-test, negotiation basics, and closing the loop with mentor accountability.',
  },
];
export const PROGRAM_6WEEK_CARD_BADGE = 'Structured program';
export const PROGRAM_6WEEK_CARD_TITLE = '5-Week Interview Readiness Program';
export const PROGRAM_6WEEK_PRICE_MAIN = '₹9,999';
export const PROGRAM_6WEEK_PRICE_MAIN_SUFFIX = 'one-time · all inclusive';
/** @deprecated No tiered/strike pricing — kept empty for layout guards */
export const PROGRAM_6WEEK_PRICE_STRIKE = '';
export const PROGRAM_6WEEK_SUMMARY =
  'Roadmap from your score, weekly mentor sessions, unlimited AI mocks, scored mock rounds, resume & HR prep, and mentorship support through your placement journey.';
export const PROGRAM_6WEEK_INCLUDES = [
  'Personalised roadmap from your readiness score',
  'Weekly 1:1 mentor sessions',
  'Unlimited AI mock interviews',
  'Scored mock rounds with mentor review',
  'Resume + HR round preparation',
  'Support through your placement journey',
];
export const PROGRAM_ENROLL_CTA = 'Enroll — ₹9,999 total';
export const PROGRAM_ENROLL_PATH = '/contact';
export const PROGRAM_PRICING_PATH = '/pricing';

/** /pricing page — shared with homepage */
export const PRICING_PAGE_HERO_SUB = 'One paid program. Start free. Upgrade when you have seen your score.';
export const PRICING_PAID_PLAN_FEATURES = [
  { yes: true, text: 'Everything in the free readiness check + gap report' },
  { yes: true, text: '5-week structured roadmap from your score' },
  { yes: true, text: 'Weekly 1:1 mentor sessions (WhatsApp access)' },
  { yes: true, text: 'Unlimited AI mock interviews' },
  { yes: true, text: 'Scored mock rounds + mentor review' },
  { yes: true, text: 'Resume + LinkedIn review' },
  { yes: true, text: 'Mentorship support through your placement journey' },
];
export const PRICING_VALUE_ROWS = [
  { label: '5 × weekly 1-on-1 mentor sessions', market: '₹15,000' },
  { label: 'AI mock interviews (unlimited)', market: '₹6,000' },
  { label: 'Industry expert mock + review', market: '₹4,000' },
  { label: 'Resume + LinkedIn review', market: '₹3,000' },
  { label: 'Placement-track prep (5 weeks)', market: '₹5,000' },
];
export const PRICING_MARKET_TOTAL = '₹33,000';
export const PRICING_FAQ_ITEMS = [
  {
    q: 'Is ₹9,999 the total? Any hidden charges?',
    a: '₹9,999 is the complete 5-week program. No registration fee, no per-session upsells, and no “premium tier” locked behind another payment.',
  },
  {
    q: "What if I don't get placed right away?",
    a: "We don't guarantee a job or offer refunds for non-placement. Our commitment is sustained mentorship and support through your placement journey — sessions, mocks, and guidance while you are actively preparing and applying.",
  },
  {
    q: 'What makes this different from YouTube + LeetCode?',
    a: 'YouTube cannot score your readiness or name your gaps. LeetCode does not train HR rounds or live answer delivery. We measure you first, then mentor-led reps close the gap — with mocks that score how you perform under pressure.',
  },
  {
    q: 'Should I take the free check before enrolling?',
    a: 'Yes — always. The free readiness check (~5 min, no signup) shows where you stand. Enroll in the 5-week program when you want structured mentor support to fix those gaps.',
  },
  {
    q: 'How do I pay?',
    a: 'Contact us to enroll. We accept UPI, card, and net banking; receipt and onboarding details are shared after payment confirmation.',
  },
];

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
      'Benchmark tech + HR readiness, then focus preparation on the top gaps before your next online assessment.',
    sub:
      'Shortlists go to people who sound clear under pressure—not who solved the most random problems. Benchmark tech + HR readiness, then focus preparation on the top gaps before your next online assessment.',
  },
  y4: {
    headline: HERO_HEADLINE,
    accent: 'Scored mock interviews, 1:1 mentorship, structured prep—until you perform in the room.',
    subShort: 'Mocks · 1:1 mentors · Structured placement prep.',
    /** @deprecated Homepage uses HERO_SOCIAL_PROOF_ARIA; kept for other experiments */
    socialProofLine: 'Campus hires reward clarity — start with the free readiness check.',
    sub: HERO_HOME_SUB,
  },
  /** Working professionals — interview + skill readiness (same rubric; framing matches career moves). */
  yexp: {
    headline: 'Switching roles or levelling up? Measure before you commit months to the wrong preparation.',
    accent: 'Interview readiness + skill readiness—in one structured baseline (~5 min).',
    subShort:
      'Benchmark DSA, System Design, HR, and projects—then close gaps with mocks and mentors aligned to your goal.',
    sub:
      'Panels care how you communicate trade-offs, not only years on a CV. Benchmark interview readiness alongside skill signals across DSA, System Design, HR, and projects—then close gaps with mocks and mentors aligned to where you actually want to land.',
  },
};

/** Canonical public URL for share links (WhatsApp, copy) — matches deployed base path */
export const SITE_SHARE_BASE = 'https://www.mentormuni.com';
export const SITE_SHARE_ASSESSMENT_URL = `${SITE_SHARE_BASE}/start-assessment`;

/**
 * Viral one-liner for messages (result page, OG emphasis). Keep under ~160 chars for previews.
 */
export const BRAND_MEME_LINE = "We don't teach. We make you perform.";

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
  return `${hook} Scored ${score}/100 on MentorMuni (${roleLabel}). ${BRAND_MEME_LINE} Free readiness check (~5 min, no signup):\n${SITE_SHARE_ASSESSMENT_URL}`;
}

/** Mission / positioning — footer, meta, tool intros */
export const MISSION_TAGLINE =
  'An interview readiness system — scores, gap clarity, and performance reps — so you walk in prepared, not guessing.';

/** About page — section title + lead under the mission line */
export const ABOUT_SYSTEM_SECTION_TITLE = 'What interview readiness means here';
export const ABOUT_SYSTEM_SECTION_LEAD =
  'Most preparation stops at content. We connect measurement to practice: you see where you stand, get clarity on what to fix first, then rehearse until your answers hold up under pressure — not just on paper or in passive tutorials.';

/** About page — three loops (aligned with MISSION_TAGLINE) */
export const ABOUT_SYSTEM_LOOPS = [
  {
    title: 'Scores',
    body:
      'A baseline you can trust — not guesswork. Know how interview-ready you are before companies decide for you, and track whether you are actually improving.',
  },
  {
    title: 'Gap clarity',
    body:
      'Topic- and behaviour-level visibility: where you leak points, what panels actually test, and what to prioritise — instead of a vague “study more DSA” list.',
  },
  {
    title: 'Performance reps',
    body:
      'Mocks, AI-led practice, and mentor feedback so you train how you will perform — live, under scrutiny — not how you scroll feeds or read solutions.',
  },
];

/** About page — flagship hero & story (aboutUs.jsx) */
export const ABOUT_PAGE_EYEBROW = 'The heart of MentorMuni';
export const ABOUT_PAGE_HERO_LINE1 = 'We build the moment between';
export const ABOUT_PAGE_HERO_ACCENT = 'practice and the panel.';
export const ABOUT_PAGE_HERO_LEAD =
  'Everything you read here is how we think: measurement first, honesty second, reps third. If that aligns with how you want to prepare, you already know us.';
export const ABOUT_PULL_QUOTE =
  'You cannot fix what you do not measure — and you cannot rehearse what you cannot name.';

export const ABOUT_BELIEFS = [
  {
    title: 'Measure first',
    body: 'A number you trust beats a feeling that you are “almost ready.” The score is the start of the work — not the trophy.',
  },
  {
    title: 'Name the gap',
    body: 'Panels punish vague weaknesses. We turn “I am bad at DSA” into specific behaviours and topics to fix first.',
  },
  {
    title: 'Rehearse like it counts',
    body: 'Mocks, AI sessions, and mentor feedback stack so you train performance — not just consumption.',
  },
];

export const ABOUT_STORY_TITLE = 'Why MentorMuni exists';
export const ABOUT_STORY_PARAGRAPHS = [
  'Campus hiring does not wait for you to “feel” ready. It tests how you sound under pressure, how you structure answers, and whether you can show depth — often before you get a second chance.',
  'Most students only discover their real gaps after a rejection. We built MentorMuni so the first signal is a score and a plan — not a “better luck next time” email.',
  'Students get a free baseline and a path. Colleges get cohort visibility. Partners get a serious readiness system — not another slide deck about courses.',
];

export const ABOUT_AUDIENCES_SECTION_TITLE = 'Who we build for';
export const ABOUT_AUDIENCES = [
  {
    title: 'Students & early-career engineers',
    body:
      'Final-year and pre-placement learners who want clarity before chaos — a score, a gap list, and reps that feel like the real round.',
    href: '/start-assessment',
    cta: 'Take the free check',
  },
  {
    title: 'Colleges & placement teams',
    body:
      'Batch-level readiness visibility, structured programmes, and partnerships that align with your placement calendar — not vanity metrics.',
    href: '/colleges',
    cta: 'Explore for colleges',
  },
  {
    title: 'Anyone comparing offers to effort',
    body:
      'If you are tired of infinite tabs and still getting surprised in interviews, we are built for you — AI practice, mentors, and one spine: measure → fix → perform.',
    href: '/contact',
    cta: 'Talk to us',
  },
];

export const ABOUT_PILLARS_HEADLINE = 'What we stand for';
export const ABOUT_PILLARS_SUB =
  'A small team, one spine, zero theatre. We would rather you hate your score early than your panel later.';
export const ABOUT_PILLARS = [
  {
    title: 'Why we exist',
    body:
      'Campus hiring rewards clarity under pressure — not just tutorials. MentorMuni exists to give engineering students an honest baseline, a plan, and reps before the real panel.',
  },
  {
    title: 'Who we serve',
    body:
      'Final-year and early-career engineers preparing for tech placements, plus colleges that want batch-level readiness visibility — not vanity metrics.',
  },
  {
    title: 'How we work',
    body:
      'Readiness scoring, AI mock practice, and mentor-backed guidance stay connected: measure → fix → rehearse. No disconnected “courses only” path.',
  },
];

/** Completing the free Interview Readiness assessment — coupon reward (homepage + promos) */
/** Promo bar — line 1: the offer (what) */
export const READINESS_TEST_COUPON_OFFER_HEADLINE =
  '1 free 1:1 mentorship + 1 free AI mock interview';
/** Promo bar — line 2: how you get it */
export const READINESS_TEST_COUPON_OFFER_HOW =
  'How: take the free readiness check (~5 min). Your coupon code is emailed right after.';
/** One-line summary for nav / tool strips that only have room for a single sentence */
export const READINESS_TEST_COUPON_PROMO =
  'Free: 1× 1:1 mentorship + 1× AI mock — unlock by completing the free readiness check.';
/** Short line for badges / narrow layouts */
export const READINESS_TEST_COUPON_BADGE =
  '1× 1:1 mentor + 1× AI mock · coupon after free readiness check';
/** Readiness report card (narrow column) — short lines so nothing clips */
export const READINESS_TEST_COUPON_CARD_HEADLINE = 'Your readiness check unlocks a code';
export const READINESS_TEST_COUPON_CARD_BODY =
  'Coupon: 1 free 1:1 + 1 AI mock after your readiness check';
export const READINESS_TEST_COUPON_CARD_CTA = 'Start readiness check';

/** Mentorship programme — first cohort start month (waitlist, mentors, pricing) */
export const MENTORSHIP_FIRST_BATCH_START_LABEL = 'First batch starting June';

/** Stale-date-free mentorship messaging */
export const MENTORSHIP_BANNER = 'Mentorship programme · Limited seats per batch';

export const MENTORSHIP_TRUST_BADGE = 'Mentorship cohorts · Waitlist open · Limited seats';

/** Homepage — bridge between Expert Mentorship and final CTA (mentorship-only; free score: hero + #final-cta) */
export const HOMEPAGE_MENTORS_TO_CTA_BRIDGE = 'Questions on mentorship or cohort seats?';

/** Homepage — final CTA block (above footer) */
export const FINAL_CTA_HEADLINE = 'Know the gap before the panel does.';
export const FINAL_CTA_HEADLINE_ACCENT =
  'Take the free readiness check — then go deeper only if the gap is real.';
export const FINAL_CTA_BODY =
  'One score, one honest gap list, then optional mocks and the 5-week program if you want structured mentor support. No infinite tabs. No pretend progress.';

/** Hero score widget — demo only (not the visitor's score) */
export const HERO_SCORE_SAMPLE_LABEL = 'Sample preview — take the free check for your score';

/** Footer / nav: name of the free assessment product (not “mock interviews”) */
export const PRODUCT_READINESS_SCORE = 'Readiness check';

/** Public contact phone — keep in sync across footer, contact, pricing */
export const CONTACT_EMAIL = 'enroll@mentormuni.com';
export const CONTACT_EMAIL_HREF = 'mailto:enroll@mentormuni.com';

export const CONTACT_PHONE_DISPLAY = '+91 90093 55103';
export const CONTACT_PHONE_HREF = 'tel:+919009355103';

/** WhatsApp (India) — same number as phone; pre-filled message for one tap */
export const CONTACT_WHATSAPP_HREF =
  'https://wa.me/919009355103?text=' +
  encodeURIComponent('Hi MentorMuni — I have a question about interview preparation.');
export const CONTACT_WHATSAPP_LABEL = 'WhatsApp us';

/** Homepage — trust strip below hero (text labels; swap for SVG logos when licensed) */
export const HERO_TRUST_LOGO_ROW_LABEL = 'Used by engineering students preparing for campus placements';
export const HERO_TRUST_LOGO_ROW_ITEMS = [
  'Final-year students',
  '3rd year students',
  'Placement season prep',
  'Campus hiring',
  'Off-campus drives',
];

/** Default meta description when a route has no specific entry (SPA + crawlers). */
export const DEFAULT_META_DESCRIPTION =
  'MentorMuni is your placement mentor for campus hiring in India — free readiness score in 5 min, AI mock interviews, gap report, and 1:1 mentors for TCS, Infosys, and product companies.';

/** Per-route SEO — see src/constants/routeSeoMeta.js (title, description, keywords). */
export { ROUTE_TITLES, ROUTE_DESCRIPTIONS, ROUTE_KEYWORDS } from './routeSeoMeta';
