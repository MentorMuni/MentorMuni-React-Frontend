import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROUNDS = [
  {
    q: 'A is B\'s father. B is C\'s sister. How is A related to C?',
    options: ['Father', 'Uncle', 'Brother', 'Grandfather'],
    answer: 'Father',
    tip: 'B sister → C means C is also A\'s child.',
  },
  {
    q: 'P is Q\'s mother. Q is R\'s father. How is P related to R?',
    options: ['Grandmother', 'Mother', 'Aunt', 'Sister'],
    answer: 'Grandmother',
    tip: 'Mother of father = grandmother.',
  },
  {
    q: 'X is Y\'s only brother. Y is Z\'s mother. How is X related to Z?',
    options: ['Uncle', 'Father', 'Brother', 'Cousin'],
    answer: 'Uncle',
    tip: 'Brother of mother = maternal uncle.',
  },
];

export default function BloodRelationsGame({ onComplete, placementMode }) {
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(placementMode ? 12 : 18);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const current = ROUNDS[round % ROUNDS.length];

  useEffect(() => {
    if (result) return;
    if (timeLeft <= 0) {
      setResult({ ok: false, msg: 'Time up!' });
      setStreak(0);
      return;
    }
    const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, result]);

  function pick(opt) {
    if (result) return;
    setSelected(opt);
    const ok = opt === current.answer;
    setResult({
      ok,
      msg: ok ? `Streak ${streak + 1}!` : `Answer: ${current.answer}`,
    });
    if (ok) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      onComplete?.({ correct: true, xpBonus: newStreak * 5 });
      setTimeout(() => {
        setRound((r) => r + 1);
        setTimeLeft(placementMode ? 12 : 18);
        setSelected(null);
        setResult(null);
      }, 1400);
    } else {
      setStreak(0);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="rounded-full bg-pink-500/15 px-4 py-1.5 text-sm font-black text-pink-600 dark:text-pink-300">
          Streak ×{streak}
        </div>
        <div className="relative h-10 w-10">
          <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              className="text-pink-500"
              strokeWidth="3"
              strokeDasharray={`${(timeLeft / (placementMode ? 12 : 18)) * 100} 100`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-black">{timeLeft}</span>
        </div>
      </div>

      <motion.div
        key={round}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-3xl border border-pink-200/60 bg-gradient-to-br from-pink-50 to-fuchsia-50 p-6 dark:border-pink-900/40 dark:from-pink-950/50 dark:to-fuchsia-950/30"
      >
        <p className="text-center text-lg font-bold leading-snug text-slate-800 dark:text-slate-100">
          {current.q}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {current.options.map((opt) => {
          const isSel = selected === opt;
          const showCorrect = result && opt === current.answer;
          const showWrong = result && isSel && !result.ok;
          return (
            <button
              key={opt}
              type="button"
              disabled={result?.ok}
              onClick={() => pick(opt)}
              className={`rounded-2xl px-4 py-4 text-sm font-bold transition ${
                showCorrect
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : showWrong
                    ? 'bg-rose-500 text-white'
                    : 'bg-white text-slate-800 shadow-md hover:scale-[1.02] dark:bg-slate-800 dark:text-slate-100'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {result && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center text-sm font-bold ${result.ok ? 'text-emerald-600' : 'text-rose-600'}`}
          >
            {result.msg}
            {!result.ok && <span className="mt-1 block text-xs text-slate-500">{current.tip}</span>}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
