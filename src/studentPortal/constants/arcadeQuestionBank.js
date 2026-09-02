import { QUESTIONS_PER_GAME } from './arcadeGameUtils';

function shuffleFixed(arr, seed) {
  const a = arr.slice();
  let s = seed + 7;
  for (let i = a.length - 1; i > 0; i -= 1) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---- Seating arrangement (28) -------------------------------- */
function makeSeatingPuzzles() {
  const out = [
    {
      clues: ['A at left end.', 'B immediately right of A.', 'C at right end.', 'D sits between B and C.'],
      seats: 4,
      solution: ['A', 'B', 'D', 'C'],
      facing: 'Linear row, left → right.',
      solutionText: 'Left to right: A – B – D – C.',
    },
    {
      clues: ['5 people in a row.', 'P in the middle.', 'Q immediately left of P.', 'R at left end.', 'S between P and T.', 'T at right end.'],
      seats: 5,
      solution: ['R', 'Q', 'P', 'S', 'T'],
      facing: 'Linear row.',
      solutionText: 'R – Q – P – S – T.',
    },
    {
      clues: ['4 seats.', 'P at left end.', 'M at right end.', 'O not at either end.', 'N left of M.'],
      seats: 4,
      solution: ['P', 'O', 'N', 'M'],
      facing: 'Linear row.',
      solutionText: 'P – O – N – M.',
    },
    {
      clues: ['3 seats.', 'X at left.', 'Z at right.', 'Y in the center.'],
      seats: 3,
      solution: ['X', 'Y', 'Z'],
      facing: 'Linear row.',
      solutionText: 'X – Y – Z.',
    },
    {
      clues: ['4 seats.', 'K at left.', 'L at right.', 'J not next to K.', 'M not next to L.'],
      seats: 4,
      solution: ['K', 'M', 'J', 'L'],
      facing: 'Linear row.',
      solutionText: 'K – M – J – L.',
    },
    {
      clues: ['5 seats.', 'A and E at ends.', 'B next to A.', 'C in center.', 'D next to E.'],
      seats: 5,
      solution: ['A', 'B', 'C', 'D', 'E'],
      facing: 'A left, E right.',
      solutionText: 'A – B – C – D – E.',
    },
    {
      clues: ['4 seats.', 'R at left end.', 'S at right end.', 'P not at an end.', 'P and Q sit together.'],
      seats: 4,
      solution: ['R', 'P', 'Q', 'S'],
      facing: 'Linear row.',
      solutionText: 'R – P – Q – S.',
    },
    {
      clues: ['6 seats.', 'A seat 1.', 'F seat 6.', 'B seat 2.', 'C seat 3.', 'D seat 4.', 'E seat 5.'],
      seats: 6,
      solution: ['A', 'B', 'C', 'D', 'E', 'F'],
      facing: 'Fixed seats 1–6.',
      solutionText: 'A, B, C, D, E, F in order.',
    },
  ];

  const names4 = ['A', 'B', 'C', 'D'];
  const names5 = ['A', 'B', 'C', 'D', 'E'];
  const names6 = ['A', 'B', 'C', 'D', 'E', 'F'];

  for (let i = 0; i < 8; i += 1) {
    const order = names4.slice();
    for (let j = 0; j < i % 4; j += 1) order.push(order.shift());
    if (i % 2 === 1) order.reverse();
    out.push({
      clues: [
        `${order[0]} at left end.`,
        `${order[1]} right of ${order[0]}.`,
        `${order[2]} right of ${order[1]}.`,
        `${order[3]} at right end.`,
      ],
      seats: 4,
      solution: order,
      facing: 'Chain left → right.',
      solutionText: order.join(' – '),
    });
  }

  for (let i = 0; i < 6; i += 1) {
    const perm = names5.slice();
    for (let j = 0; j < i; j += 1) perm.push(perm.shift());
    out.push({
      clues: [
        'Five in a row.',
        `${perm[2]} in center.`,
        `${perm[0]} at left end.`,
        `${perm[4]} at right end.`,
        `${perm[1]} between ${perm[0]} and ${perm[2]}.`,
      ],
      seats: 5,
      solution: perm,
      facing: 'Center is seat 3.',
      solutionText: perm.join(' – '),
    });
  }

  for (let i = 0; i < 6; i += 1) {
    const base = names6.slice();
    for (let j = 0; j < i % 6; j += 1) base.push(base.shift());
    out.push({
      clues: [
        'Six seats 1–6 left → right.',
        `${base[0]} seat 1, ${base[5]} seat 6.`,
        `${base[1]} seat 2, ${base[2]} seat 3.`,
        `${base[3]} seat 4, ${base[4]} seat 5.`,
      ],
      seats: 6,
      solution: base,
      facing: 'Direct placement.',
      solutionText: base.join(', '),
    });
  }

  return out.slice(0, QUESTIONS_PER_GAME);
}

export const SEATING_PUZZLES_BANK = makeSeatingPuzzles();

/* ---- Blood relations (28) ------------------------------------- */
const BLOOD_STATIC = [
  { q: 'A is B\'s father. B is C\'s sister. How is A related to C?', options: ['Father', 'Uncle', 'Brother', 'Grandfather'], answer: 'Father', solution: 'B and C are siblings → A is father to both.' },
  { q: 'P is Q\'s mother. Q is R\'s father. How is P related to R?', options: ['Grandmother', 'Mother', 'Aunt', 'Sister'], answer: 'Grandmother', solution: 'P → Q → R: grandmother.' },
  { q: 'X is Y\'s only brother. Y is Z\'s mother. How is X related to Z?', options: ['Uncle', 'Father', 'Brother', 'Cousin'], answer: 'Uncle', solution: 'X is Y\'s brother; Y is Z\'s mother → uncle.' },
  { q: 'M is N\'s daughter. N is O\'s wife. How is M related to O?', options: ['Daughter', 'Sister', 'Niece', 'Mother'], answer: 'Daughter', solution: 'M is N\'s child; N is O\'s wife → M is O\'s daughter.' },
  { q: 'A is B\'s son. C is B\'s father. How is A related to C?', options: ['Grandson', 'Son', 'Nephew', 'Brother'], answer: 'Grandson', solution: 'A is B\'s son; B is C\'s son → A is C\'s grandson.' },
  { q: 'P is Q\'s brother. Q is R\'s mother. How is P related to R?', options: ['Uncle', 'Father', 'Brother', 'Cousin'], answer: 'Uncle', solution: 'P is Q\'s brother; Q is R\'s mother.' },
  { q: 'A is father of B. B is father of C. How is A related to C?', options: ['Grandfather', 'Father', 'Uncle', 'Brother'], answer: 'Grandfather', solution: 'Two generations on father line.' },
  { q: 'X is Y\'s sister. Y is Z\'s father. How is X related to Z?', options: ['Aunt', 'Mother', 'Sister', 'Cousin'], answer: 'Aunt', solution: 'X is Y\'s sister; Y is Z\'s father.' },
  { q: 'M is N\'s husband. N is O\'s sister. How is M related to O?', options: ['Brother-in-law', 'Brother', 'Uncle', 'Cousin'], answer: 'Brother-in-law', solution: 'M married to N; N is O\'s sister.' },
  { q: 'A is B\'s mother. B is C\'s brother. How is A related to C?', options: ['Mother', 'Aunt', 'Grandmother', 'Sister'], answer: 'Mother', solution: 'B and C are siblings; A is their mother.' },
  { q: 'S is T\'s father. T is U\'s mother. How is S related to U?', options: ['Grandfather', 'Father', 'Uncle', 'Brother'], answer: 'Grandfather', solution: 'S → T → U on parent line.' },
  { q: 'A is B\'s sister. C is A\'s father. How is C related to B?', options: ['Father', 'Uncle', 'Grandfather', 'Brother'], answer: 'Father', solution: 'C is A and B\'s father.' },
  { q: 'P is Q\'s son. R is Q\'s daughter. How is P related to R?', options: ['Brother', 'Cousin', 'Father', 'Uncle'], answer: 'Brother', solution: 'P and R are Q\'s children → siblings.' },
  { q: 'M is O\'s mother. N is O\'s wife. How is M related to N?', options: ['Mother-in-law', 'Mother', 'Aunt', 'Sister'], answer: 'Mother-in-law', solution: 'M is O\'s mother; N is O\'s wife.' },
];

function makeBloodRounds() {
  const templates = [
    { q: 'D is E\'s father. E is F\'s brother. How is D related to F?', options: ['Father', 'Uncle', 'Brother', 'Grandfather'], answer: 'Father', solution: 'E and F are brothers → same father D.' },
    { q: 'G is H\'s mother. H is I\'s sister. How is G related to I?', options: ['Mother', 'Aunt', 'Grandmother', 'Sister'], answer: 'Mother', solution: 'H and I are siblings with mother G.' },
    { q: 'J is K\'s only sister. K is L\'s father. How is J related to L?', options: ['Aunt', 'Mother', 'Sister', 'Cousin'], answer: 'Aunt', solution: 'J is K\'s sister; K is L\'s father.' },
    { q: 'P is Q\'s wife. R is Q\'s son. How is P related to R?', options: ['Mother', 'Aunt', 'Sister', 'Grandmother'], answer: 'Mother', solution: 'P is Q\'s wife; R is Q\'s child.' },
    { q: 'A is B\'s grandfather. B is C\'s father. How is A related to C?', options: ['Grandfather', 'Father', 'Uncle', 'Great-grandfather'], answer: 'Grandfather', solution: 'A → B → C.' },
    { q: 'M is N\'s daughter. O is N\'s son. How are M and O related?', options: ['Sister and brother', 'Cousins', 'Mother and son', 'Uncle and niece'], answer: 'Sister and brother', solution: 'Both children of N → siblings.' },
    { q: 'A is B\'s brother. C is B\'s wife. How is A related to C?', options: ['Brother-in-law', 'Brother', 'Uncle', 'Cousin'], answer: 'Brother-in-law', solution: 'A is B\'s brother; C is B\'s wife.' },
    { q: 'X is Y\'s father. Z is Y\'s son. How is X related to Z?', options: ['Grandfather', 'Father', 'Uncle', 'Brother'], answer: 'Grandfather', solution: 'X → Y → Z.' },
  ];

  const rounds = BLOOD_STATIC.map((r) => ({ ...r, tip: r.solution }));
  templates.forEach((t) => rounds.push({ ...t, tip: t.solution }));

  while (rounds.length < QUESTIONS_PER_GAME) {
    const n = rounds.length + 1;
    rounds.push({
      q: `Person A is Person B's parent. Person B and Person C are siblings. How is A related to C?`,
      options: shuffleFixed(['Parent', 'Uncle', 'Grandparent', 'Sibling'], n),
      answer: 'Parent',
      solution: 'B and C share parent A.',
      tip: 'Siblings share the same parent.',
    });
  }

  return rounds.slice(0, QUESTIONS_PER_GAME);
}

export const BLOOD_RELATION_ROUNDS = makeBloodRounds();

/* ---- Number series (28) --------------------------------------- */
function makeNumberSeries() {
  const out = [];

  for (let d = 2; d <= 9; d += 1) {
    const start = d;
    const seq = [start, start + d, start + 2 * d, start + 3 * d, start + 4 * d];
    out.push({
      nums: [...seq, '?'],
      answer: start + 5 * d,
      rule: `Add ${d} each step (AP).`,
      solution: `${seq[4]} + ${d} = ${start + 5 * d}.`,
    });
  }

  for (let r = 2; r <= 4; r += 1) {
    out.push({
      nums: [r, r ** 2, r ** 3, r ** 4, '?'],
      answer: r ** 5,
      rule: `Powers of ${r}.`,
      solution: `${r}^5 = ${r ** 5}.`,
    });
  }

  for (let n = 1; n <= 10; n += 1) {
    out.push({
      nums: [n ** 2, (n + 1) ** 2, (n + 2) ** 2, (n + 3) ** 2, '?'],
      answer: (n + 4) ** 2,
      rule: 'Perfect squares.',
      solution: `${n + 4}² = ${(n + 4) ** 2}.`,
    });
  }

  return out.slice(0, QUESTIONS_PER_GAME);
}

export const NUMBER_SERIES_BANK = makeNumberSeries();

/* ---- Train problems (28) -------------------------------------- */
function makeTrainScenarios() {
  const out = [];
  const meetPairs = [
    [120, 40, 60], [200, 50, 50], [300, 60, 40], [150, 30, 45],
    [240, 80, 40], [180, 54, 36], [400, 100, 50], [250, 75, 25],
    [160, 48, 32], [220, 55, 55], [350, 70, 35], [130, 39, 26],
  ];
  meetPairs.forEach(([dist, a, b]) => {
    const ans = dist / (a + b);
    out.push({
      label: 'Opposite direction — meet',
      length: dist,
      speedA: a,
      speedB: b,
      opposite: true,
      question: `Trains ${dist} km apart approach at ${a} km/h and ${b} km/h. Meeting time (hours)?`,
      answer: ans,
      formula: `${dist} / (${a} + ${b}) = ${ans} h`,
      solution: `Relative speed = ${a + b} km/h → time = ${ans} hours.`,
    });
  });

  const chasePairs = [
    [90, 70, 40], [120, 80, 50], [200, 100, 60], [150, 90, 45],
    [60, 75, 45], [180, 90, 54], [100, 65, 35], [240, 120, 80],
  ];
  chasePairs.forEach(([gap, fast, slow]) => {
    const ans = gap / (fast - slow);
    out.push({
      label: 'Same direction — chase',
      length: gap,
      speedA: fast,
      speedB: slow,
      opposite: false,
      question: `Train A (${fast} km/h) is ${gap} km behind Train B (${slow} km/h). Catch-up time (hours)?`,
      answer: ans,
      formula: `${gap} / (${fast} − ${slow}) = ${ans} h`,
      solution: `Relative speed = ${fast - slow} km/h → time = ${ans} h.`,
    });
  });

  while (out.length < QUESTIONS_PER_GAME) {
    const dist = 100 + out.length * 12;
    const a = 48 + out.length;
    const b = 32 + out.length;
    out.push({
      label: 'Opposite direction — meet',
      length: dist,
      speedA: a,
      speedB: b,
      opposite: true,
      question: `Trains ${dist} km apart, ${a} & ${b} km/h toward each other. Time (h)?`,
      answer: dist / (a + b),
      formula: `${dist}/(${a}+${b})`,
      solution: `Time ≈ ${(dist / (a + b)).toFixed(2)} hours.`,
    });
  }

  return out.slice(0, QUESTIONS_PER_GAME);
}

export const TRAIN_SCENARIOS_BANK = makeTrainScenarios();

/* ---- Work & time (28) ----------------------------------------- */
function makeWorkJobs() {
  const out = [];
  for (let w = 2; w <= 15; w += 1) {
    for (let d = 4; d <= 12; d += 2) {
      if (out.length >= QUESTIONS_PER_GAME) break;
      const target = Math.max(2, Math.floor(d * 0.6));
      const total = w * d;
      const needed = Math.ceil(total / target);
      out.push({
        title: `Job pack ${out.length + 1}`,
        workers: w,
        days: d,
        targetDays: target,
        tip: 'Man-days = workers × days.',
        solution: `${w} workers × ${d} days = ${total} man-days. For ${target} days: ${total}/${target} → ${needed} workers.`,
      });
    }
  }
  return out.slice(0, QUESTIONS_PER_GAME);
}

export const WORK_JOBS_BANK = makeWorkJobs();
