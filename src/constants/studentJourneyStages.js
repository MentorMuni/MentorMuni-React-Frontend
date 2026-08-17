/**
 * Why MentorMuni (/how-it-works) — student-only messaging.
 * Frame every block as a student anxiety → how that anxiety gets resolved.
 * Avoid product feature showcases; speak in the student's voice.
 */

export const WHY_PAGE = {
  brand: 'MentorMuni',
  eyebrow: 'For students who are tired of guessing',
  headline: 'You lose offers in silence — not because you never studied.',
  sub:
    'The gap is not knowledge. It is knowing how you perform when someone is watching. MentorMuni closes that gap before a real panel does.',
  primaryCta: 'Take the free readiness check',
  flowLabel: 'How help shows up for you',
  flow: [
    {
      step: '01',
      title: 'Name the freeze',
      help: 'See exactly where you blank — resume, speed, aptitude, or speaking under pressure.',
    },
    {
      step: '02',
      title: 'Fix that gap',
      help: 'Practice the weak spot in a safe room until the panic stops owning the round.',
    },
    {
      step: '03',
      title: 'Walk in with proof',
      help: 'Enter the real panel knowing what improved — not hoping it somehow goes better.',
    },
  ],
};

export const RECOGNITION = {
  eyebrow: 'Sound familiar?',
  headline: 'If any of these hit, you are the student this page is for.',
  sub: 'Most placement anxiety is not laziness. It is practicing alone until the first panel feels like the first real test.',
};

export const RELIEF_SECTION = {
  eyebrow: 'What actually changes',
  headline: 'Each worry gets a clear next move — not another playlist.',
  sub: 'You do not need more content. You need proof of where you break, then safe reps until you do not.',
};

export const SHIFT_SECTION = {
  eyebrow: 'The shift',
  headline: 'Walk in knowing your gaps — not hoping they stay hidden.',
  before: {
    label: 'How it usually feels',
    lines: [
      'Revision loops with no score that means anything',
      'Blanking on answers you knew the night before',
      'Hoping the panel asks something you practiced',
      'No idea if you are ready until the result email',
    ],
  },
  after: {
    label: 'How it feels after',
    lines: [
      'A baseline that names your weak spots',
      'Pressure practice before the stakes are real',
      'Feedback you can act on this week',
      'Confidence from proof, not vibes',
    ],
  },
};

export const FINAL_CTA = {
  headline: 'Stop hoping the next round goes better.',
  sub: 'Take five minutes. See where you actually stand. Then decide what to fix.',
  primaryCta: 'Take the free readiness check',
  note: 'No payment. No lecture. Just a scored snapshot of your interview readiness.',
  contactPrompt: 'Stuck or unsure where to start?',
};

/** Student anxieties → how that anxiety gets resolved (not feature names as headlines). */
export const STUDENT_JOURNEY_STAGES = [
  {
    id: 'resume-ats',
    step: 1,
    title: 'Your resume never reaches a human',
    studentVoice: 'I keep applying. Nothing comes back.',
    painPoint: 'A strong resume still dies in the ATS before a recruiter opens it.',
    solution: 'See what screening systems actually parse — then fix format and keywords in minutes.',
    primaryOutcome: 'A clear resume score and the exact fixes to make',
    duration: '3 min',
    icon: 'FileText',
    accent: 'sky',
  },
  {
    id: '5-sec-test',
    step: 2,
    title: 'You blank under the clock',
    studentVoice: 'I know this at home. In the OA, my mind freezes.',
    painPoint: 'Speed and composure collapse the moment a timer starts.',
    solution: 'Benchmark your reflexes before a high-stakes online assessment costs you a shortlist.',
    primaryOutcome: 'A speed baseline and the topics that slow you down',
    duration: '5 min',
    icon: 'Zap',
    accent: 'amber',
  },
  {
    id: 'aptitude-readiness',
    step: 3,
    title: 'You do not know what is actually weak',
    studentVoice: 'Is it quant? Logic? Verbal? I am just grinding randomly.',
    painPoint: 'Aptitude feels like the silent filter — and you cannot name your gap.',
    solution: 'Get ranked by topic (quant, logic, verbal) so practice stops being guesswork.',
    primaryOutcome: 'Category-level gaps you can drill this week',
    duration: '20 min',
    icon: 'Brain',
    accent: 'teal',
  },
  {
    id: 'skill-readiness',
    step: 4,
    title: 'LeetCode streaks do not equal panel calm',
    studentVoice: 'I have solved hundreds of problems. Why do I still panic explaining?',
    painPoint: 'Solving alone is not the same as defending an approach under scrutiny.',
    solution: 'Find whether DSA depth, system design, or explanation is the real blocker.',
    primaryOutcome: 'A technical gaps map tied to how panels actually quiz',
    duration: '25 min',
    icon: 'Code2',
    accent: 'emerald',
  },
  {
    id: 'ai-mock-skill',
    step: 5,
    title: 'You have never practiced out loud under pressure',
    studentVoice: 'My first real technical round was also my first mock.',
    painPoint: 'Knowing the answer and performing it while being evaluated are different skills.',
    solution: 'Rehearse technical interviews in a safe pressure room — before a hiring panel.',
    primaryOutcome: 'A scored technical mock with weak spots named',
    duration: '15 min',
    icon: 'Mic2',
    accent: 'rose',
  },
  {
    id: 'ai-mock-hr',
    step: 6,
    title: 'You freeze when they say “tell me about yourself”',
    studentVoice: 'Will I sound confident? Or like I am reading a script?',
    painPoint: 'HR rounds punish unclear stories and shaky presence — not missing syntax.',
    solution: 'Practice speaking out loud. Get scored on clarity, presence, and confidence — without judgment.',
    primaryOutcome: 'HR round feedback you can rehearse until it feels natural',
    duration: '30 min',
    icon: 'Users',
    accent: 'cyan',
  },
  {
    id: 'offer-prep-sprint',
    step: 7,
    title: 'You cannot tell if you are ready or just hoping',
    studentVoice: 'Everyone says “you will be fine.” I need proof.',
    painPoint: 'Without a before/after score, readiness is a feeling — and feelings lie.',
    solution: 'Validate improvement against your starting baseline so you walk in with evidence.',
    primaryOutcome: 'A final readiness score and a clear “what next” plan',
    duration: '20 min',
    icon: 'Trophy',
    accent: 'amber',
  },
];

/** @deprecated Kept for any residual imports — prefer WHY_PAGE / STUDENT_JOURNEY_STAGES. */
export const SUPPORT_SYSTEMS = [];
export const BENEFITS = [];
export const COLLEGE_SUCCESS_STORIES = [];
export const PEDAGOGICAL_NOTE = null;
