import { useCallback, useEffect, useMemo, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { NUMBER_SERIES_BANK } from '../../../constants/arcadeQuestionBank';
import { buildOptions, questionLabel } from '../../../constants/arcadeGameUtils';
import ArcadeSolutionPanel from '../ArcadeSolutionPanel';

export default function NumberPulseGame({ onComplete, placementMode, bank }) {
  const seriesBank = Array.isArray(bank) && bank.length ? bank : NUMBER_SERIES_BANK;
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState('play');
  const [feedback, setFeedback] = useState(null);
  const [hintText, setHintText] = useState('');

  const series = seriesBank[idx % seriesBank.length];
  const options = useMemo(
    () => buildOptions(series.answer, idx * 17 + 3),
    [series.answer, idx],
  );

  const locked = phase === 'feedback';

  useEffect(() => {
    setIdx(0);
  }, [seriesBank]);

  useEffect(() => {
    setSelected(null);
    setPhase('play');
    setFeedback(null);
    setHintText('');
  }, [idx]);

  const loadNext = useCallback(() => {
    setIdx((i) => (i + 1) % seriesBank.length);
  }, [seriesBank.length]);

  function pick(n) {
    if (locked) return;
    setSelected(n);
    const ok = n === series.answer;
    setPhase('feedback');
    if (ok) {
      onComplete?.({ correct: true, xpBonus: placementMode ? 12 : 6 });
    }
    setFeedback({
      ok,
      title: ok ? 'Pattern locked!' : 'Here\'s the pattern',
      answerLabel: String(series.answer),
      solution: series.solution,
      rule: series.rule,
    });
  }

  function showHint() {
    if (locked) return;
    setHintText(`Missing number is ${series.answer}. Rule: ${series.rule}`);
  }

  const progress = useMemo(() => questionLabel(idx, seriesBank.length), [idx, seriesBank.length]);

  return (
    <div className={`aa-game${locked ? ' is-locked' : ''}`}>
      <p className="aa-q-progress">{progress}</p>

      <div className="aa-tiles">
        {series.nums.map((n, i) => (
          <div key={`${idx}-${i}`} className={`aa-number-tile${n === '?' ? ' is-missing' : ''}`}>
            {n}
          </div>
        ))}
      </div>

      <p className="aa-caption-center">Tap the missing number</p>

      {hintText && !feedback && <p className="aa-hint-preview">{hintText}</p>}

      <div className="aa-options-grid">
        {options.map((opt) => {
          const showCorrect = locked && opt === series.answer;
          const showWrong = locked && selected === opt && !feedback?.ok;
          let cls = 'aa-btn aa-btn--option-dark';
          if (showCorrect) cls += ' is-correct';
          else if (showWrong) cls += ' is-wrong';
          return (
            <button
              key={`opt-${idx}-${opt}`}
              type="button"
              disabled={locked}
              onClick={() => pick(opt)}
              className={cls}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {!feedback && (
        <div className="aa-actions">
          <button type="button" className="aa-btn aa-btn--secondary" onClick={showHint} disabled={locked}>
            <Lightbulb size={16} aria-hidden /> Show solution hint
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
