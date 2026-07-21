/**
 * Student Journey - 7-Stage Pipeline
 * Central source of truth for all stage data, messaging, and configuration.
 * Update here to sync across all components.
 */

export const STUDENT_JOURNEY_STAGES = [
  {
    id: 'resume-ats',
    step: 1,
    title: 'Resume ATS Check',
    description: 'Parse your resume like hiring systems do. Know your format & keyword gaps.',
    shortDescription: 'Resume screening like hiring systems see it',
    outcomes: ['Resume Score', 'Keyword Gaps', 'Formatting Tips'],
    primaryOutcome: 'Your Resume Score + Fixes',
    duration: '3 min',
    icon: 'FileText',
    color: 'from-sky-400 to-blue-500',
    borderColor: 'border-sky-200',
    bgGradient: 'from-sky-50/50 to-blue-50/30',
    iconBg: 'bg-sky-100/60 text-sky-600',
    details:
      'Stages 1–4: Build your baseline. Understand exactly where you stand across all interview dimensions.',
  },
  {
    id: '5-sec-test',
    step: 2,
    title: '5-Sec Quick Test',
    description: 'Speed matters. Benchmark your aptitude reflexes before high-stakes OAs.',
    shortDescription: 'Quick aptitude baseline test',
    outcomes: ['Speed Baseline', 'Weak Areas', 'Improvement Tips'],
    primaryOutcome: 'Speed Baseline + Weak Areas',
    duration: '5 min',
    icon: 'Zap',
    color: 'from-amber-400 to-orange-500',
    borderColor: 'border-amber-200',
    bgGradient: 'from-amber-50/50 to-orange-50/30',
    iconBg: 'bg-amber-100/60 text-amber-600',
    details:
      'Under pressure, speed and confidence collapse for most students. This baseline shows where your reflexes are.',
  },
  {
    id: 'aptitude-readiness',
    step: 3,
    title: 'Aptitude Readiness Test',
    description: 'Full assessment: quant, logic, verbal. Benchmark vs college cohort. Real interview topics.',
    shortDescription: 'Comprehensive aptitude assessment',
    outcomes: ['Aptitude Gaps', 'Category Breakdown', 'Practice Drills'],
    primaryOutcome: 'Aptitude Gaps by Category',
    duration: '20 min',
    icon: 'Brain',
    color: 'from-purple-400 to-indigo-500',
    borderColor: 'border-purple-200',
    bgGradient: 'from-purple-50/50 to-indigo-50/30',
    iconBg: 'bg-purple-100/60 text-purple-600',
    details:
      'Quantitative + logical reasoning + verbal comprehension. The panel tests all three. You need baseline across all.',
  },
  {
    id: 'skill-readiness',
    step: 4,
    title: 'Skill Readiness Test',
    description: 'DSA, system design, coding fundamentals. What panels actually test.',
    shortDescription: 'Technical skills assessment',
    outcomes: ['Technical Gaps', 'DSA Assessment', 'System Design Level'],
    primaryOutcome: 'Technical Gaps Map',
    duration: '25 min',
    icon: 'Code2',
    color: 'from-emerald-400 to-teal-500',
    borderColor: 'border-emerald-200',
    bgGradient: 'from-emerald-50/50 to-teal-50/30',
    iconBg: 'bg-emerald-100/60 text-emerald-600',
    details: 'DSA breadth (trees, graphs, DP), system design thinking, and coding fundamentals. This is what companies actually quiz.',
  },
  {
    id: 'ai-mock-skill',
    step: 5,
    title: 'AI Mock Interview - Skill',
    description: 'Live mock. Real pressure. Interview-style Q&As with scoring.',
    shortDescription: 'Technical mock interview simulation',
    outcomes: ['Technical Score', 'Live Feedback', 'Weak Spots Named'],
    primaryOutcome: 'Technical Interview Score + Feedback',
    duration: '45 min',
    icon: 'Mic2',
    color: 'from-rose-400 to-pink-500',
    borderColor: 'border-rose-200',
    bgGradient: 'from-rose-50/50 to-pink-50/30',
    iconBg: 'bg-rose-100/60 text-rose-600',
    details:
      'Stages 5–6: High-pressure rehearsal. The gap between knowing and explaining under scrutiny is huge. This closes it.',
  },
  {
    id: 'ai-mock-hr',
    step: 6,
    title: 'AI Mock Interview - HR',
    description: 'Conversational HR round. Tell me about yourself, projects, challenges.',
    shortDescription: 'HR communication mock interview',
    outcomes: ['HR Score', 'Communication Notes', 'Confidence Feedback'],
    primaryOutcome: 'HR Round Score + Communication Coaching',
    duration: '30 min',
    icon: 'Users',
    color: 'from-cyan-400 to-blue-600',
    borderColor: 'border-cyan-200',
    bgGradient: 'from-cyan-50/50 to-blue-50/30',
    iconBg: 'bg-cyan-100/60 text-cyan-600',
    details:
      'Communication under pressure is a skill, not a personality trait. Practice it out loud. Get coached on presence, clarity, pace.',
  },
  {
    id: 'offer-prep-sprint',
    step: 7,
    title: 'Offer Prep Sprint',
    description: 'Final validation. Compare your score from Stage 1. Track your improvement. Ready for offers.',
    shortDescription: 'Final readiness validation',
    outcomes: ['Final Score', 'Progress Report', 'Next Steps'],
    primaryOutcome: 'Final Readiness Score + Progress Report',
    duration: '20 min',
    icon: 'Trophy',
    color: 'from-amber-500 to-yellow-500',
    borderColor: 'border-amber-300',
    bgGradient: 'from-amber-50/50 to-yellow-50/30',
    iconBg: 'bg-amber-100/60 text-amber-600',
    details:
      'Stage 7: Validate improvement. See the delta from where you started. Prove the system works. Ready for real panels.',
  },
];

export const SUPPORT_SYSTEMS = [
  {
    id: 'ai-buddy',
    title: 'AI Buddy',
    subtitle: 'Never Feel Stuck. Ever.',
    icon: 'Sparkles',
    benefits: [
      'Instant concept review at 2 AM',
      'Mock answer feedback on demand',
      '24/7 preparation support',
    ],
    pricingNote: 'Included in all plans',
    color: 'from-violet-400 to-purple-500',
    bgColor: 'bg-violet-50/40',
    borderColor: 'border-violet-200/50',
    iconColor: 'text-violet-600',
  },
  {
    id: 'student-dashboard',
    title: 'Your Progress Dashboard',
    subtitle: 'See Your Growth. Own Your Path.',
    icon: 'BarChart3',
    benefits: [
      'All 7 stages in one visual',
      'Spot weak areas, celebrate wins',
      'Stay accountable to your goals',
    ],
    pricingNote: 'Real-time updates',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-50/40',
    borderColor: 'border-green-200/50',
    iconColor: 'text-green-600',
  },
  {
    id: 'tpo-dashboard',
    title: 'Cohort Readiness Dashboard',
    subtitle: 'Predict Placement Outcomes.',
    icon: 'Building2',
    benefits: [
      'Batch performance at a glance',
      'Intervene early with at-risk students',
      'Plan placement strategy smarter',
    ],
    pricingNote: 'College partners only',
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-blue-50/40',
    borderColor: 'border-blue-200/50',
    iconColor: 'text-blue-600',
  },
];

export const BENEFITS = [
  {
    id: 'comprehensive-coverage',
    icon: 'CheckCircle',
    headline: 'Every Interview Type Covered',
    body: 'Resume → aptitude → technical → HR. Nothing left to chance. Panels test all four dimensions. So do we.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'improvement-loop',
    icon: 'RotateCw',
    headline: 'Score → Gap → Practice → Re-Test',
    body: 'Not a one-time assessment. Real improvement happens through cycles. Each stage builds on the last. Measurable progress.',
    color: 'from-sky-500 to-blue-500',
  },
  {
    id: 'real-time-feedback',
    icon: 'Zap',
    headline: 'Feedback That Actually Changes Behavior',
    body: 'Mocks scored instantly. Mentor notes within 24h. AI coaching on every answer. Real-time feedback = real improvement.',
    color: 'from-rose-500 to-pink-500',
  },
];

export const COLLEGE_SUCCESS_STORIES = [
  {
    id: 'partner-college',
    collegeName: 'Partner Engineering College',
    location: 'India',
    year: '2025–2026',
    batchSize: 18,
    challenge:
      'Previous year: 60% placement. This year, we needed to do better. Students weren\'t confident in interviews.',
    whatHappened:
      'Introduced MentorMuni readiness baseline in May. Built 5-week prep program around score gaps. Monthly dashboards tracked cohort progress.',
    metrics: [
      { label: 'Avg readiness score', before: '38', after: '72', change: '+89%' },
      { label: 'Placement rate', before: '60%', after: '78%', change: '+30%' },
      { label: 'Avg CTC', before: '₹7.2L', after: '₹8.4L', change: '+17%' },
      { label: 'Students placed in top companies', value: '14/18', note: 'Multiple MNCs & startups' },
    ],
    quote:
      'Finally, we could predict outcomes and guide with confidence. MentorMuni gave us the visibility we needed to support our students better.',
    tpoName: 'Placement Head',
    tpoTitle: 'Engineering College, India',
    isAnonymous: true,
  },
];

export const PEDAGOGICAL_NOTE = {
  title: 'Why This Sequence Matters',
  sections: [
    {
      stage: 'Stages 1–4',
      label: 'Build Your Baseline',
      description: 'What\'s your current state across resume, speed, aptitude, and technical skills?',
    },
    {
      stage: 'Stages 5–6',
      label: 'High-Pressure Rehearsal',
      description: 'Practice how you\'ll actually perform under scrutiny. Mocks + coaching close the knowing-vs-performing gap.',
    },
    {
      stage: 'Stage 7',
      label: 'Validate Improvement',
      description: 'Compare your final score to Stage 1. See the delta. Prove the system works.',
    },
  ],
  advancedPath: {
    title: 'Advanced Path (Optional)',
    description:
      'For students confident in fundamentals: Skip Stage 3 aptitude → Start mocks earlier. Flexibility built in.',
  },
};
