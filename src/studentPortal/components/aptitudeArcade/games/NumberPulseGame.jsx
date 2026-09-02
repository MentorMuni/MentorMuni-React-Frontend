import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SERIES = [
  { nums: [2, 6, 12, 20, 30, '?'], answer: 42, rule: 'n(n+1): 1×2, 2×3, 3×4…' },
  { nums: [3, 9, 27, 81, '?'], answer: 243, rule: '×3 each step (GP)' },
  { nums: [1, 4, 9, 16, 25, '?'], answer: 36, rule: 'Perfect squares n²' },
  { nums: [5, 11, 23, 47, '?'], answer: 95, rule: '×2 + 1 pattern' },
];

export default function NumberPulseGame({ onComplete, placementMode }) {
  const [idx, setIdx] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const series = SERIES[idx % SERIES.length];
  const options = [
    series.answer,
    series.answer + 7,
    series.answer - 5,
    series.answer + 13,
  ].sort(() => Math.random() - 0.5);

  useEffect(() => {
    const t = setInterval(() => setPulse((p) => (p + 1) % 4), 600);
    return () => clearInterval(t);
  }, [idx]);

  function pick(n) {
    if (result) return;
    setSelected(n);
    const ok = n === series.answer;
    setResult({ ok, rule: series.rule });
    if (ok) {
      onComplete?.({ correct: true, xpBonus: placementMode ? 12 : 6 });
      setTimeout(() => {
        setIdx((i) => i + 1);
        setSelected(null);
        setResult(null);
      }, 1300);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {series.nums.map((n, i) => (
          <motion.div
            key={`${idx}-${i}`}
            animate={{
              scale: n === '?' ? (pulse % 2 === 0 ? 1.08 : 1) : 1,
              opacity: n === '?' ? 1 : 0.95,
            }}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-black sm:h-16 sm:w-16 sm:text-xl ${
              n === '?'
                ? 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg shadow-emerald-500/40'
                : 'bg-white text-slate-800 shadow-md dark:bg-slate-800 dark:text-white'
            }`}
          >
            {n}
          </motion.div>
        ))}
      </div>

      <p className="text-center text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
        Tap the missing number
      </p>

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => pick(opt)}
            disabled={result?.ok}
            className={`rounded-2xl py-4 text-lg font-black transition ${
              result && opt === series.answer
                ? 'bg-emerald-500 text-white'
                : result && selected === opt
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-900 text-white hover:scale-[1.03] dark:bg-white dark:text-slate-900'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-4 text-center text-sm ${
              result.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
            }`}
          >
            <p className="font-bold">{result.ok ? 'Pattern locked!' : `Correct: ${series.answer}`}</p>
            <p className="mt-1 text-xs opacity-80">Rule: {series.rule}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
