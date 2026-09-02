/** Aptitude Arcade — game catalog + progression metadata (client-side v1). */

export const ARCADE_CATEGORIES = [
  { id: 'logical', label: 'Logical', color: '#a855f7', emoji: '🧩' },
  { id: 'quant', label: 'Quant', color: '#06b6d4', emoji: '🔢' },
  { id: 'verbal', label: 'Verbal', color: '#f59e0b', emoji: '📖' },
];

export const APTITUDE_GAMES = [
  {
    id: 'seating_shuffle',
    title: 'Seat Shuffle',
    subtitle: 'Arrange characters from clues',
    category: 'logical',
    topic: 'Seating arrangement',
    emoji: '🪑',
    gradient: 'from-violet-500 via-purple-600 to-indigo-700',
    accent: '#a855f7',
    xpPerRound: 40,
    placementWeight: 0.18,
    avgMinutes: 4,
    difficulty: ['easy', 'medium', 'hard'],
    hook: 'Drag & drop seating puzzles — same logic as TCS / Infosys linear arrangement.',
    skills: ['Constraint tracking', 'Left-right positioning', 'Facing direction'],
  },
  {
    id: 'family_tree_rush',
    title: 'Family Tree Rush',
    subtitle: 'Who is who — fast rounds',
    category: 'logical',
    topic: 'Blood relations',
    emoji: '🌳',
    gradient: 'from-fuchsia-500 via-pink-600 to-rose-700',
    accent: '#ec4899',
    xpPerRound: 35,
    placementWeight: 0.14,
    avgMinutes: 3,
    difficulty: ['easy', 'medium', 'hard'],
    hook: 'Tap the right relation before the timer fades — builds speed for placement tests.',
    skills: ['Generational mapping', 'Sibling vs cousin', 'In-law chains'],
  },
  {
    id: 'rail_rush',
    title: 'Rail Rush',
    subtitle: 'Trains meet, pass, or chase',
    category: 'quant',
    topic: 'Train problems',
    emoji: '🚂',
    gradient: 'from-cyan-500 via-sky-600 to-blue-700',
    accent: '#06b6d4',
    xpPerRound: 45,
    placementWeight: 0.16,
    avgMinutes: 5,
    difficulty: ['easy', 'medium', 'hard'],
    hook: 'Slide speeds & distances — watch trains collide visually, then lock the formula.',
    skills: ['Relative speed', 'Time = distance / speed', 'Opposite vs same direction'],
  },
  {
    id: 'factory_floor',
    title: 'Factory Floor',
    subtitle: 'Workers × days = work done',
    category: 'quant',
    topic: 'Work & time',
    emoji: '🏭',
    gradient: 'from-amber-500 via-orange-600 to-red-600',
    accent: '#FF9500',
    xpPerRound: 40,
    placementWeight: 0.15,
    avgMinutes: 4,
    difficulty: ['easy', 'medium', 'hard'],
    hook: 'Assign worker crews to hit the deadline — LCM & efficiency without boring worksheets.',
    skills: ['Man-days', 'Combined work rate', 'Pipe & cistern intuition'],
  },
  {
    id: 'pattern_pulse',
    title: 'Pattern Pulse',
    subtitle: 'Find the missing number',
    category: 'quant',
    topic: 'Number series',
    emoji: '💫',
    gradient: 'from-emerald-500 via-teal-600 to-cyan-700',
    accent: '#10b981',
    xpPerRound: 30,
    placementWeight: 0.12,
    avgMinutes: 3,
    difficulty: ['easy', 'medium', 'hard'],
    hook: 'Beat-synced rounds — squares, primes, AP/GP mix like real exam patterns.',
    skills: ['Difference patterns', 'Square & cube series', 'Alternating rules'],
  },
];

export const LEVEL_TITLES = [
  { minXp: 0, title: 'Aptitude Intern', badge: '🌱' },
  { minXp: 200, title: 'Logic Learner', badge: '🧠' },
  { minXp: 500, title: 'Quant Grinder', badge: '⚡' },
  { minXp: 1000, title: 'Placement Prepper', badge: '🎯' },
  { minXp: 2000, title: 'Offer Hunter', badge: '🏆' },
  { minXp: 4000, title: 'Aptitude Ace', badge: '👑' },
];

export function levelFromXp(xp) {
  let current = LEVEL_TITLES[0];
  for (const tier of LEVEL_TITLES) {
    if (xp >= tier.minXp) current = tier;
  }
  const next = LEVEL_TITLES.find((t) => t.minXp > xp);
  const progress = next
    ? (xp - current.minXp) / (next.minXp - current.minXp)
    : 1;
  return { current, next, progress: Math.min(1, Math.max(0, progress)) };
}

export function gameById(id) {
  return APTITUDE_GAMES.find((g) => g.id === id) ?? APTITUDE_GAMES[0];
}
