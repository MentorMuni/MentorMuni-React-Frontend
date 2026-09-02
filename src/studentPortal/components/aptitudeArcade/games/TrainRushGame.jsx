import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { TRAIN_SCENARIOS_BANK } from '../../../constants/arcadeQuestionBank';
import { questionLabel } from '../../../constants/arcadeGameUtils';
import ArcadeSolutionPanel from '../ArcadeSolutionPanel';

export default function TrainRushGame({ onComplete, placementMode }) {
  const [idx, setIdx] = useState(0);
  const scenario = TRAIN_SCENARIOS_BANK[idx % TRAIN_SCENARIOS_BANK.length];
  const [speedA, setSpeedA] = useState(scenario.speedA);
  const [speedB, setSpeedB] = useState(scenario.speedB);
  const [guess, setGuess] = useState('');
  const [phase, setPhase] = useState('play');
  const [feedback, setFeedback] = useState(null);
  const [hintText, setHintText] = useState('');
  const [animKey, setAnimKey] = useState(0);

  const locked = phase === 'feedback';

  useEffect(() => {
    const s = TRAIN_SCENARIOS_BANK[idx % TRAIN_SCENARIOS_BANK.length];
    setSpeedA(s.speedA);
    setSpeedB(s.speedB);
    setGuess('');
    setPhase('play');
    setFeedback(null);
    setHintText('');
    setAnimKey((k) => k + 1);
  }, [idx]);

  const loadNext = useCallback(() => {
    setIdx((i) => (i + 1) % TRAIN_SCENARIOS_BANK.length);
  }, []);

  function check() {
    if (locked) return;
    const val = parseFloat(guess);
    if (Number.isNaN(val)) {
      setPhase('feedback');
      setFeedback({
        ok: false,
        title: 'Enter a number',
        answerLabel: `${computeAnswer().toFixed(2)} hours`,
        solution: scenario.solution,
        rule: scenario.formula,
      });
      return;
    }
    const computed = computeAnswer();
    const ok = Math.abs(val - computed) < 0.15;
    setPhase('feedback');
    if (ok) {
      onComplete?.({ correct: true, xpBonus: placementMode ? 20 : 10 });
    }
    setFeedback({
      ok,
      title: ok ? 'Trains synced!' : 'Check the formula',
      answerLabel: `${computed.toFixed(2)} hours`,
      solution: scenario.solution,
      rule: scenario.formula.replace(String(scenario.speedA), String(speedA)).replace(String(scenario.speedB), String(speedB)),
    });
  }

  function computeAnswer() {
    const rel = scenario.opposite ? speedA + speedB : Math.max(speedA - speedB, 1);
    return scenario.length / rel;
  }

  function showHint() {
    if (locked) return;
    const ans = computeAnswer();
    setHintText(`Answer ≈ ${ans.toFixed(2)} h. ${scenario.formula}`);
  }

  const relSpeed = scenario.opposite ? speedA + speedB : Math.max(speedA - speedB, 1);
  const meetTime = scenario.length / relSpeed;
  const progress = useMemo(() => questionLabel(idx), [idx]);

  return (
    <div className={`aa-game${locked ? ' is-locked' : ''}`}>
      <p className="aa-q-progress">{progress}</p>
      <p className="aa-caption">{scenario.question}</p>

      <div className="aa-train-stage">
        <div className="aa-train-track">
          <motion.div
            key={animKey}
            style={{ position: 'absolute', bottom: '1rem', left: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            initial={{ x: 0 }}
            animate={{ x: scenario.opposite ? '45%' : '70%' }}
            transition={{ duration: meetTime * 0.35, ease: 'linear' }}
          >
            <span style={{ fontSize: '1.5rem' }} aria-hidden>🚂</span>
            <span style={{ borderRadius: '4px', background: '#0284c7', color: '#fff', padding: '2px 6px', fontSize: '10px', fontWeight: 700 }}>
              {speedA} km/h
            </span>
          </motion.div>
          <motion.div
            key={`b-${animKey}`}
            style={{ position: 'absolute', bottom: '1rem', right: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            initial={{ x: 0 }}
            animate={{ x: scenario.opposite ? '-45%' : '-20%' }}
            transition={{ duration: meetTime * 0.35, ease: 'linear' }}
          >
            <span style={{ borderRadius: '4px', background: '#0891b2', color: '#fff', padding: '2px 6px', fontSize: '10px', fontWeight: 700 }}>
              {speedB} km/h
            </span>
            <span style={{ fontSize: '1.5rem' }} aria-hidden>🚃</span>
          </motion.div>
          <div className="aa-train-rail" />
          <p style={{ position: 'absolute', left: '0.5rem', top: '0.5rem', margin: 0, fontSize: '10px', fontWeight: 700, color: 'var(--aa-play-muted)' }}>
            Gap: {scenario.length} km · {scenario.label}
          </p>
        </div>
      </div>

      {hintText && !feedback && <p className="aa-hint-preview">{hintText}</p>}

      <div className="aa-sliders">
        <label>
          <span className="aa-field-label">Train A speed (km/h)</span>
          <input type="range" min="20" max="120" value={speedA} disabled={locked} onChange={(e) => setSpeedA(Number(e.target.value))} style={{ width: '100%', accentColor: '#0284c7' }} />
          <span className="aa-speed-value aa-speed-value--a">{speedA}</span>
        </label>
        <label>
          <span className="aa-field-label">Train B speed (km/h)</span>
          <input type="range" min="20" max="120" value={speedB} disabled={locked} onChange={(e) => setSpeedB(Number(e.target.value))} style={{ width: '100%', accentColor: '#0891b2' }} />
          <span className="aa-speed-value aa-speed-value--b">{speedB}</span>
        </label>
      </div>

      <div className="aa-form-row">
        <label className="aa-field">
          <span className="aa-field-label">Your answer (hours)</span>
          <input
            type="number"
            step="0.1"
            value={guess}
            disabled={locked}
            onChange={(e) => setGuess(e.target.value)}
            className="aa-input"
            placeholder="?"
          />
        </label>
        {!feedback && (
          <>
            <button type="button" onClick={check} className="aa-btn aa-btn--sky" disabled={locked}>
              Launch
            </button>
            <button type="button" onClick={showHint} className="aa-btn aa-btn--secondary" disabled={locked}>
              <Lightbulb size={16} aria-hidden /> Hint
            </button>
          </>
        )}
      </div>

      <ArcadeSolutionPanel
        open={!!feedback}
        ok={feedback?.ok}
        title={feedback?.title}
        answerLabel={feedback?.answerLabel}
        solution={feedback?.solution}
        rule={feedback?.rule}
        onContinue={loadNext}
      />
    </div>
  );
}
