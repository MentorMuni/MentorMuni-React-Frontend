import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, RotateCcw } from 'lucide-react';

const PUZZLES = [
  {
    clues: [
      'A sits at the left end.',
      'B sits immediately right of A.',
      'C sits at the right end.',
      'D is not next to C.',
    ],
    seats: 4,
    solution: ['A', 'B', 'D', 'C'],
    facing: 'All face north (left → right order).',
  },
  {
    clues: [
      '5 people in a row — P at center.',
      'Q is left of P, not adjacent to R.',
      'R sits at an end.',
      'S is between P and T.',
    ],
    seats: 5,
    solution: ['R', 'Q', 'P', 'S', 'T'],
    facing: 'Linear row, left to right.',
  },
];

export default function SeatingShuffleGame({ onComplete, placementMode }) {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const puzzle = PUZZLES[puzzleIdx % PUZZLES.length];
  const [slots, setSlots] = useState(Array(puzzle.seats).fill(null));
  const [pool, setPool] = useState(() => {
    const letters = puzzle.solution.slice().sort(() => Math.random() - 0.5);
    return letters;
  });
  const [feedback, setFeedback] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);

  function resetPuzzle() {
    const p = PUZZLES[puzzleIdx % PUZZLES.length];
    setSlots(Array(p.seats).fill(null));
    setPool(p.solution.slice().sort(() => Math.random() - 0.5));
    setFeedback(null);
    setHintsUsed(0);
  }

  function placeInSlot(slotIdx, letter) {
    if (slots[slotIdx]) return;
    setSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = letter;
      return next;
    });
    setPool((prev) => prev.filter((l) => l !== letter));
  }

  function removeFromSlot(slotIdx) {
    const letter = slots[slotIdx];
    if (!letter) return;
    setSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = null;
      return next;
    });
    setPool((prev) => [...prev, letter]);
    setFeedback(null);
  }

  function checkAnswer() {
    const filled = slots.every(Boolean);
    if (!filled) {
      setFeedback({ ok: false, msg: 'Fill every seat first.' });
      return;
    }
    const correct = slots.every((s, i) => s === puzzle.solution[i]);
    if (correct) {
      setFeedback({ ok: true, msg: 'Perfect arrangement!' });
      const bonus = placementMode ? 15 : 0;
      const penalty = hintsUsed * 5;
      onComplete?.({ correct: true, xpBonus: bonus - penalty });
      setTimeout(() => {
        setPuzzleIdx((i) => i + 1);
        const nextP = PUZZLES[(puzzleIdx + 1) % PUZZLES.length];
        setSlots(Array(nextP.seats).fill(null));
        setPool(nextP.solution.slice().sort(() => Math.random() - 0.5));
        setFeedback(null);
        setHintsUsed(0);
      }, 1200);
    } else {
      setFeedback({ ok: false, msg: 'Clues don’t match — re-read left/right & ends.' });
    }
  }

  function revealHint() {
    const emptyIdx = slots.findIndex((s) => !s);
    if (emptyIdx === -1) return;
    const letter = puzzle.solution[emptyIdx];
    setHintsUsed((h) => h + 1);
    setSlots((prev) => {
      const next = [...prev];
      next[emptyIdx] = letter;
      return next;
    });
    setPool((prev) => prev.filter((l) => l !== letter));
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-violet-200/60 bg-violet-50/80 p-4 dark:border-violet-800/50 dark:bg-violet-950/40">
        <p className="text-xs font-bold uppercase tracking-wide text-violet-600 dark:text-violet-300">
          Clues
        </p>
        <ul className="mt-2 space-y-1.5">
          {puzzle.clues.map((c) => (
            <li key={c} className="text-sm text-slate-700 dark:text-slate-200">
              • {c}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{puzzle.facing}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {slots.map((letter, i) => (
          <button
            key={i}
            type="button"
            onClick={() => removeFromSlot(i)}
            className={`flex h-16 w-16 flex-col items-center justify-center rounded-2xl border-2 text-lg font-black transition ${
              letter
                ? 'border-violet-400 bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30'
                : 'border-dashed border-slate-300 bg-white/80 text-slate-400 dark:border-slate-600 dark:bg-slate-800/80'
            }`}
          >
            {letter || `Seat ${i + 1}`}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {pool.map((letter) => (
          <button
            key={letter}
            type="button"
            onClick={() => {
              const emptyIdx = slots.findIndex((s) => !s);
              if (emptyIdx !== -1) placeInSlot(emptyIdx, letter);
            }}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-black text-white shadow-md transition hover:scale-105 dark:bg-white dark:text-slate-900"
          >
            {letter}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-center text-sm font-bold ${
              feedback.ok ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {feedback.msg}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={checkAnswer}
          className="flex items-center gap-2 rounded-2xl bg-[#FF9500] px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/30 transition hover:scale-[1.02]"
        >
          <Check className="h-4 w-4" /> Lock seats
        </button>
        <button
          type="button"
          onClick={revealHint}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
        >
          Hint (−5 XP)
        </button>
        <button
          type="button"
          onClick={resetPuzzle}
          className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-500"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>
    </div>
  );
}
