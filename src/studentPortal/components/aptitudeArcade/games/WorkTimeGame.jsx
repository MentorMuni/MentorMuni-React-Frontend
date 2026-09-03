import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { WORK_JOBS_BANK } from '../../../constants/arcadeQuestionBank';
import { questionLabel } from '../../../constants/arcadeGameUtils';
import ArcadeSolutionPanel from '../ArcadeSolutionPanel';

export default function WorkTimeGame({ onComplete, placementMode, bank }) {
  const jobs = Array.isArray(bank) && bank.length ? bank : WORK_JOBS_BANK;
  const [idx, setIdx] = useState(0);
  const job = jobs[idx % jobs.length];
  const totalWork = job.workers * job.days;
  const needed = Math.ceil(totalWork / job.targetDays);
  const [guess, setGuess] = useState('');
  const [crew, setCrew] = useState(job.workers);
  const [phase, setPhase] = useState('play');
  const [feedback, setFeedback] = useState(null);
  const [hintText, setHintText] = useState('');

  const locked = phase === 'feedback';

  useEffect(() => {
    setIdx(0);
  }, [jobs]);

  useEffect(() => {
    const j = jobs[idx % jobs.length];
    setCrew(j.workers);
    setGuess('');
    setPhase('play');
    setFeedback(null);
    setHintText('');
  }, [idx, jobs]);

  const loadNext = useCallback(() => {
    setIdx((i) => (i + 1) % jobs.length);
  }, [jobs.length]);

  function check() {
    if (locked) return;
    const val = parseInt(guess, 10);
    if (Number.isNaN(val)) {
      setPhase('feedback');
      setFeedback({
        ok: false,
        title: 'Enter number of workers',
        answerLabel: `${needed} workers`,
        solution: job.solution,
        rule: job.tip,
      });
      return;
    }
    const ok = val === needed;
    setPhase('feedback');
    if (ok) {
      onComplete?.({ correct: true, xpBonus: placementMode ? 18 : 8 });
    }
    setFeedback({
      ok,
      title: ok ? 'Crew assigned!' : 'Try the man-days method',
      answerLabel: `${needed} workers`,
      solution: job.solution,
      rule: job.tip,
    });
  }

  function showHint() {
    if (locked) return;
    setHintText(job.solution);
  }

  const projectedDays = crew > 0 ? (totalWork / crew).toFixed(1) : '—';
  const progress = useMemo(() => questionLabel(idx, jobs.length), [idx, jobs.length]);

  return (
    <div className={`aa-game${locked ? ' is-locked' : ''}`}>
      <p className="aa-q-progress">{progress}</p>

      <div className="aa-panel aa-panel--orange">
        <p className="aa-panel__label aa-panel__label--orange">{job.title}</p>
        <p className="aa-panel__text">
          Currently <strong>{job.workers} workers</strong> take <strong>{job.days} days</strong>.
          Boss wants it done in <strong>{job.targetDays} days</strong>. How many workers?
        </p>
      </div>

      {hintText && !feedback && <p className="aa-hint-preview">{hintText}</p>}

      <div className="aa-tiles">
        {Array.from({ length: Math.min(crew, 12) }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.03 }}
            style={{ fontSize: '1.5rem' }}
            aria-hidden
          >
            👷
          </motion.span>
        ))}
        {crew > 12 && <span className="aa-caption">+{crew - 12}</span>}
      </div>

      <label>
        <span className="aa-field-label">Simulate crew size</span>
        <input
          type="range"
          min="1"
          max="20"
          value={crew}
          disabled={locked}
          onChange={(e) => setCrew(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#ff9500' }}
        />
        <p className="aa-caption">At {crew} workers → ~{projectedDays} days</p>
      </label>

      <div className="aa-form-row">
        <input
          type="number"
          min="1"
          value={guess}
          disabled={locked}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Workers needed"
          className="aa-input"
          style={{ flex: 1 }}
        />
        {!feedback && (
          <>
            <button type="button" onClick={check} className="aa-btn aa-btn--primary" disabled={locked}>
              Submit crew
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
