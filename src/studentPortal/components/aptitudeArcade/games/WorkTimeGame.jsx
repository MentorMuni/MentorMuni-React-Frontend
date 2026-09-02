import { useState } from 'react';
import { motion } from 'framer-motion';

const JOBS = [
  {
    title: 'Wall paint job',
    workers: 4,
    days: 6,
    targetDays: 4,
    tip: 'More workers → fewer days. Work = workers × days.',
  },
  {
    title: 'Road repair',
    workers: 5,
    days: 8,
    targetDays: 5,
    tip: 'Find total man-days, then divide by target days.',
  },
];

export default function WorkTimeGame({ onComplete, placementMode }) {
  const [idx, setIdx] = useState(0);
  const job = JOBS[idx % JOBS.length];
  const totalWork = job.workers * job.days;
  const needed = Math.ceil(totalWork / job.targetDays);
  const [guess, setGuess] = useState('');
  const [crew, setCrew] = useState(job.workers);
  const [feedback, setFeedback] = useState(null);

  function check() {
    const val = parseInt(guess, 10);
    if (Number.isNaN(val)) {
      setFeedback({ ok: false, msg: 'Enter number of workers.' });
      return;
    }
    const ok = val === needed;
    setFeedback({
      ok,
      msg: ok
        ? `${val} workers finish in ${job.targetDays} days!`
        : `Need ${needed} workers (${totalWork} man-days ÷ ${job.targetDays})`,
      detail: `${job.workers} × ${job.days} = ${totalWork} man-days`,
    });
    if (ok) {
      onComplete?.({ correct: true, xpBonus: placementMode ? 18 : 8 });
      setTimeout(() => {
        const next = (idx + 1) % JOBS.length;
        setIdx(next);
        setCrew(JOBS[next].workers);
        setGuess('');
        setFeedback(null);
      }, 1500);
    }
  }

  const projectedDays = crew > 0 ? (totalWork / crew).toFixed(1) : '—';

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-orange-200/60 bg-gradient-to-br from-orange-50 to-amber-50 p-5 dark:border-orange-900/40 dark:from-orange-950/40 dark:to-amber-950/30">
        <p className="text-xs font-bold uppercase tracking-wide text-orange-600 dark:text-orange-300">
          {job.title}
        </p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
          Currently <strong>{job.workers} workers</strong> take <strong>{job.days} days</strong>.
          Boss wants it done in <strong>{job.targetDays} days</strong>. How many workers?
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: Math.min(crew, 12) }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="text-2xl"
            aria-hidden
          >
            👷
          </motion.span>
        ))}
        {crew > 12 && <span className="text-sm font-bold text-slate-500">+{crew - 12}</span>}
      </div>

      <label className="block">
        <span className="text-xs font-bold text-slate-500">Simulate crew size</span>
        <input
          type="range"
          min="1"
          max="20"
          value={crew}
          onChange={(e) => setCrew(Number(e.target.value))}
          className="mt-1 w-full accent-[#FF9500]"
        />
        <p className="text-sm text-slate-600 dark:text-slate-300">
          At {crew} workers → ~{projectedDays} days
        </p>
      </label>

      <div className="flex flex-wrap gap-3">
        <input
          type="number"
          min="1"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Workers needed"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-black dark:border-slate-600 dark:bg-slate-800"
        />
        <button
          type="button"
          onClick={check}
          className="rounded-2xl bg-[#FF9500] px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/30"
        >
          Submit crew
        </button>
      </div>

      {feedback && (
        <div
          className={`rounded-xl p-4 text-sm ${
            feedback.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'
          }`}
        >
          <p className="font-bold">{feedback.msg}</p>
          <p className="mt-1 text-xs">{feedback.detail}</p>
          {!feedback.ok && <p className="mt-1 text-xs opacity-70">{job.tip}</p>}
        </div>
      )}
    </div>
  );
}
