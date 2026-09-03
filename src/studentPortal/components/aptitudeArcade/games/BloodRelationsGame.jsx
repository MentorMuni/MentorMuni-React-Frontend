import { useCallback, useEffect, useMemo, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { BLOOD_RELATION_ROUNDS } from '../../../constants/arcadeQuestionBank';
import { questionLabel } from '../../../constants/arcadeGameUtils';
import ArcadeSolutionPanel from '../ArcadeSolutionPanel';

export default function BloodRelationsGame({ onComplete, placementMode, bank }) {
  const rounds = Array.isArray(bank) && bank.length ? bank : BLOOD_RELATION_ROUNDS;
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(placementMode ? 15 : 22);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState('play');
  const [feedback, setFeedback] = useState(null);
  const [hintText, setHintText] = useState('');

  const current = rounds[round % rounds.length];
  const locked = phase === 'feedback';

  useEffect(() => {
    setRound(0);
  }, [rounds]);

  useEffect(() => {
    setTimeLeft(placementMode ? 15 : 22);
    setSelected(null);
    setPhase('play');
    setFeedback(null);
    setHintText('');
  }, [round, placementMode]);

  useEffect(() => {
    if (locked) return undefined;
    if (timeLeft <= 0) {
      setPhase('feedback');
      setFeedback({
        ok: false,
        title: 'Time up!',
        answerLabel: current.answer,
        solution: current.solution,
        rule: current.tip,
      });
      setStreak(0);
      return undefined;
    }
    const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, locked, current, placementMode]);

  const loadNext = useCallback(() => {
    setRound((r) => (r + 1) % rounds.length);
  }, []);

  function pick(opt) {
    if (locked) return;
    setSelected(opt);
    const ok = opt === current.answer;
    setPhase('feedback');
    if (ok) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      onComplete?.({ correct: true, xpBonus: newStreak * 5 });
      setFeedback({
        ok: true,
        title: `Correct! Streak ×${newStreak}`,
        answerLabel: current.answer,
        solution: current.solution,
        rule: current.tip,
      });
    } else {
      setStreak(0);
      setFeedback({
        ok: false,
        title: 'Not quite',
        answerLabel: current.answer,
        solution: current.solution,
        rule: current.tip,
      });
    }
  }

  function showHint() {
    if (locked) return;
    setHintText(`Answer: ${current.answer}. ${current.solution}`);
  }

  const progress = useMemo(() => questionLabel(round, rounds.length), [round, rounds.length]);
  const totalTime = placementMode ? 15 : 22;

  return (
    <div className={`aa-game${locked ? ' is-locked' : ''}`}>
      <p className="aa-q-progress">{progress}</p>

      <div className="aa-row-between">
        <span className="aa-streak-badge">Streak ×{streak}</span>
        <div className="aa-timer">
          <svg width="40" height="40" viewBox="0 0 36 36" aria-hidden style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.2" />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#ec4899"
              strokeWidth="3"
              strokeDasharray={`${(timeLeft / totalTime) * 100} 100`}
            />
          </svg>
          <span>{timeLeft}</span>
        </div>
      </div>

      <div className="aa-question-card">
        <p>{current.q}</p>
      </div>

      {hintText && !feedback && <p className="aa-hint-preview">{hintText}</p>}

      <div className="aa-options-grid">
        {current.options.map((opt) => {
          const isSel = selected === opt;
          const showCorrect = locked && opt === current.answer;
          const showWrong = locked && isSel && !feedback?.ok;
          let cls = 'aa-btn aa-btn--option';
          if (showCorrect) cls += ' is-correct';
          else if (showWrong) cls += ' is-wrong';
          return (
            <button key={opt} type="button" disabled={locked} onClick={() => pick(opt)} className={cls}>
              {opt}
            </button>
          );
        })}
      </div>

      {!feedback && (
        <div className="aa-actions">
          <button type="button" className="aa-btn aa-btn--secondary" onClick={showHint} disabled={locked}>
            <Lightbulb size={16} aria-hidden /> Show answer hint
          </button>
        </div>
      )}

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
