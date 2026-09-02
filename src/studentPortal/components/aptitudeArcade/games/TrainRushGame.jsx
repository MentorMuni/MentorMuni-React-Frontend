import { useState } from 'react';
import { motion } from 'framer-motion';

const SCENARIOS = [
  {
    label: 'Opposite direction — meet',
    length: 300,
    speedA: 60,
    speedB: 40,
    opposite: true,
    question: 'Two trains 300 km apart head toward each other at 60 & 40 km/h. When do they meet?',
    answer: 3,
    unit: 'hours',
    formula: 'Time = Distance / (v₁ + v₂) = 300 / 100 = 3 h',
  },
  {
    label: 'Same direction — chase',
    length: 120,
    speedA: 80,
    speedB: 50,
    opposite: false,
    question: 'Train A (80 km/h) starts 120 km behind Train B (50 km/h), same track. When does A catch B?',
    answer: 4,
    unit: 'hours',
    formula: 'Time = Gap / (v₁ − v₂) = 120 / 30 = 4 h',
  },
];

export default function TrainRushGame({ onComplete, placementMode }) {
  const [idx, setIdx] = useState(0);
  const [speedA, setSpeedA] = useState(SCENARIOS[0].speedA);
  const [speedB, setSpeedB] = useState(SCENARIOS[0].speedB);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const scenario = SCENARIOS[idx % SCENARIOS.length];

  function loadScenario(i) {
    const s = SCENARIOS[i % SCENARIOS.length];
    setIdx(i);
    setSpeedA(s.speedA);
    setSpeedB(s.speedB);
    setGuess('');
    setFeedback(null);
    setAnimKey((k) => k + 1);
  }

  function check() {
    const val = parseFloat(guess);
    if (Number.isNaN(val)) {
      setFeedback({ ok: false, msg: 'Enter a number (hours).' });
      return;
    }
    const rel = scenario.opposite ? speedA + speedB : speedA - speedB;
    const computed = scenario.length / rel;
    const ok = Math.abs(val - computed) < 0.15;
    setFeedback({
      ok,
      msg: ok ? 'Trains synced!' : `Expected ~${computed.toFixed(1)} h`,
      formula: scenario.formula.replace(String(scenario.speedA), String(speedA)).replace(String(scenario.speedB), String(speedB)),
    });
    if (ok) {
      onComplete?.({ correct: true, xpBonus: placementMode ? 20 : 10 });
      setTimeout(() => loadScenario(idx + 1), 1500);
    }
  }

  const relSpeed = scenario.opposite ? speedA + speedB : Math.max(speedA - speedB, 1);
  const meetTime = scenario.length / relSpeed;

  return (
    <div className="space-y-5">
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{scenario.question}</p>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-sky-100 to-cyan-50 p-4 dark:from-slate-800 dark:to-slate-900">
        <div className="relative h-24">
          <motion.div
            key={animKey}
            className="absolute bottom-4 left-0 flex items-center gap-1"
            initial={{ x: 0 }}
            animate={{ x: scenario.opposite ? '45%' : '70%' }}
            transition={{ duration: meetTime * 0.4, ease: 'linear' }}
          >
            <span className="text-2xl" aria-hidden>🚂</span>
            <span className="rounded bg-sky-600 px-2 py-0.5 text-[10px] font-bold text-white">{speedA} km/h</span>
          </motion.div>
          <motion.div
            key={`b-${animKey}`}
            className="absolute bottom-4 right-0 flex items-center gap-1"
            initial={{ x: 0 }}
            animate={{ x: scenario.opposite ? '-45%' : '-20%' }}
            transition={{ duration: meetTime * 0.4, ease: 'linear' }}
          >
            <span className="rounded bg-cyan-600 px-2 py-0.5 text-[10px] font-bold text-white">{speedB} km/h</span>
            <span className="text-2xl" aria-hidden>🚃</span>
          </motion.div>
          <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-slate-400/40" />
          <p className="absolute left-2 top-2 text-[10px] font-bold text-slate-500">
            Gap: {scenario.length} km · {scenario.label}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-bold text-slate-500">Train A speed (km/h)</span>
          <input
            type="range"
            min="20"
            max="120"
            value={speedA}
            onChange={(e) => setSpeedA(Number(e.target.value))}
            className="mt-1 w-full accent-sky-600"
          />
          <span className="text-sm font-black text-sky-600">{speedA}</span>
        </label>
        <label className="block">
          <span className="text-xs font-bold text-slate-500">Train B speed (km/h)</span>
          <input
            type="range"
            min="20"
            max="120"
            value={speedB}
            onChange={(e) => setSpeedB(Number(e.target.value))}
            className="mt-1 w-full accent-cyan-600"
          />
          <span className="text-sm font-black text-cyan-600">{speedB}</span>
        </label>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex-1">
          <span className="text-xs font-bold text-slate-500">Your answer (hours)</span>
          <input
            type="number"
            step="0.1"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-lg font-black dark:border-slate-600 dark:bg-slate-800"
            placeholder="?"
          />
        </label>
        <button
          type="button"
          onClick={check}
          className="rounded-2xl bg-sky-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-sky-500/30"
        >
          Launch
        </button>
      </div>

      {feedback && (
        <div
          className={`rounded-xl p-4 text-sm ${
            feedback.ok
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200'
          }`}
        >
          <p className="font-bold">{feedback.msg}</p>
          {feedback.formula && (
            <p className="mt-1 text-xs opacity-80">Formula: {feedback.formula}</p>
          )}
        </div>
      )}
    </div>
  );
}
