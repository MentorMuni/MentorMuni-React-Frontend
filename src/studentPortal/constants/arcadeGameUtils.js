/** Shared timing + helpers for aptitude arcade mini-games. */

export const QUESTIONS_PER_GAME = 30;

export function questionLabel(index, total = QUESTIONS_PER_GAME) {
  const n = total > 0 ? (index % total) + 1 : 1;
  return `Question ${n} / ${total || QUESTIONS_PER_GAME}`;
}

/** Stable shuffle — same seed => same order (prevents option flicker). */
export function shuffleWithSeed(items, seed) {
  const arr = items.slice();
  let s = Math.abs(seed) || 1;
  for (let i = arr.length - 1; i > 0; i -= 1) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function buildOptions(correct, seed, spread = 7) {
  const distractors = new Set();
  let k = 1;
  while (distractors.size < 3) {
    const deltas = [spread * k, -spread * k, spread * k + 3, -(spread * k + 2)];
    for (const d of deltas) {
      const v = correct + d;
      if (v !== correct && v > 0) distractors.add(v);
    }
    k += 1;
  }
  return shuffleWithSeed([correct, ...Array.from(distractors).slice(0, 3)], seed);
}

export function shuffledLetters(letters, seed) {
  return shuffleWithSeed(letters.slice(), seed);
}
