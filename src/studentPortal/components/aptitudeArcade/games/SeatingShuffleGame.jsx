import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Lightbulb, RotateCcw } from 'lucide-react';
import { SEATING_PUZZLES_BANK } from '../../../constants/arcadeQuestionBank';
import { questionLabel, shuffledLetters } from '../../../constants/arcadeGameUtils';
import ArcadeSolutionPanel from '../ArcadeSolutionPanel';

export default function SeatingShuffleGame({ onComplete, placementMode }) {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const puzzle = SEATING_PUZZLES_BANK[puzzleIdx % SEATING_PUZZLES_BANK.length];
  const [slots, setSlots] = useState(() => Array(puzzle.seats).fill(null));
  const [pool, setPool] = useState(() => shuffledLetters(puzzle.solution, puzzleIdx));
  const [phase, setPhase] = useState('play');
  const [feedback, setFeedback] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintPreview, setHintPreview] = useState('');

  const locked = phase === 'feedback';

  useEffect(() => {
    const p = SEATING_PUZZLES_BANK[puzzleIdx % SEATING_PUZZLES_BANK.length];
    setSlots(Array(p.seats).fill(null));
    setPool(shuffledLetters(p.solution, puzzleIdx + 1));
    setPhase('play');
    setFeedback(null);
    setHintsUsed(0);
    setHintPreview('');
  }, [puzzleIdx]);

  const loadNext = useCallback(() => {
    setPuzzleIdx((i) => (i + 1) % SEATING_PUZZLES_BANK.length);
  }, []);

  function resetPuzzle() {
    setSlots(Array(puzzle.seats).fill(null));
    setPool(shuffledLetters(puzzle.solution, puzzleIdx + 99));
    setPhase('play');
    setFeedback(null);
    setHintsUsed(0);
    setHintPreview('');
  }

  function placeInSlot(slotIdx, letter) {
    if (locked || slots[slotIdx]) return;
    setSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = letter;
      return next;
    });
    setPool((prev) => prev.filter((l) => l !== letter));
  }

  function removeFromSlot(slotIdx) {
    if (locked) return;
    const letter = slots[slotIdx];
    if (!letter) return;
    setSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = null;
      return next;
    });
    setPool((prev) => [...prev, letter]);
  }

  function checkAnswer() {
    if (locked) return;
    const filled = slots.every(Boolean);
    if (!filled) {
      setPhase('feedback');
      setFeedback({
        ok: false,
        title: 'Incomplete',
        answerLabel: puzzle.solution.join(' – '),
        solution: puzzle.solutionText,
        rule: 'Read each clue for left/right/end constraints.',
      });
      return;
    }
    const correct = slots.every((s, i) => s === puzzle.solution[i]);
    if (correct) {
      const bonus = placementMode ? 15 : 0;
      const penalty = hintsUsed * 5;
      onComplete?.({ correct: true, xpBonus: bonus - penalty });
      setPhase('feedback');
      setFeedback({
        ok: true,
        title: 'Perfect arrangement!',
        answerLabel: puzzle.solution.join(' – '),
        solution: puzzle.solutionText,
        rule: puzzle.facing,
      });
    } else {
      setPhase('feedback');
      setFeedback({
        ok: false,
        title: 'Not quite — check the clues again',
        answerLabel: puzzle.solution.join(' – '),
        solution: puzzle.solutionText,
        rule: 'Re-read left/right, ends, and “between” clues.',
      });
    }
  }

  function revealHint() {
    if (locked) return;
    setHintsUsed((h) => h + 1);
    const emptyIdx = slots.findIndex((s) => !s);
    if (emptyIdx !== -1) {
      const letter = puzzle.solution[emptyIdx];
      setHintPreview(`Seat ${emptyIdx + 1} should be **${letter}**. Full order: ${puzzle.solution.join(' – ')}.`);
      setSlots((prev) => {
        const next = [...prev];
        next[emptyIdx] = letter;
        return next;
      });
      setPool((prev) => prev.filter((l) => l !== letter));
    } else {
      setHintPreview(`Full solution left→right: ${puzzle.solution.join(' – ')}. ${puzzle.solutionText}`);
    }
  }

  function showFullSolution() {
    if (locked) return;
    setHintsUsed((h) => h + 2);
    setSlots(puzzle.solution.slice());
    setPool([]);
    setHintPreview(`Solution: ${puzzle.solution.join(' – ')}. ${puzzle.solutionText}`);
  }

  const progress = useMemo(() => questionLabel(puzzleIdx), [puzzleIdx]);

  return (
    <div className={`aa-game${locked ? ' is-locked' : ''}`}>
      <p className="aa-q-progress">{progress}</p>

      <div className="aa-panel aa-panel--violet">
        <p className="aa-panel__label aa-panel__label--violet">Clues</p>
        <ul>
          {puzzle.clues.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p className="aa-panel__hint">{puzzle.facing}</p>
      </div>

      {hintPreview && !feedback && (
        <p className="aa-hint-preview">{hintPreview.replace(/\*\*/g, '')}</p>
      )}

      <div className="aa-tiles">
        {slots.map((letter, i) => (
          <button
            key={`seat-${i}`}
            type="button"
            onClick={() => removeFromSlot(i)}
            className={`aa-tile${letter ? ' is-filled' : ''}`}
            disabled={locked}
          >
            {letter || `Seat ${i + 1}`}
          </button>
        ))}
      </div>

      <div className="aa-actions">
        {pool.map((letter) => (
          <button
            key={`pool-${letter}-${puzzleIdx}`}
            type="button"
            disabled={locked}
            onClick={() => {
              const emptyIdx = slots.findIndex((s) => !s);
              if (emptyIdx !== -1) placeInSlot(emptyIdx, letter);
            }}
            className="aa-btn aa-btn--chip"
          >
            {letter}
          </button>
        ))}
      </div>

      {!feedback && (
        <div className="aa-actions">
          <button type="button" onClick={checkAnswer} className="aa-btn aa-btn--primary" disabled={locked}>
            <Check size={16} aria-hidden /> Lock seats
          </button>
          <button type="button" onClick={revealHint} className="aa-btn aa-btn--secondary" disabled={locked}>
            <Lightbulb size={16} aria-hidden /> Hint (−5 XP)
          </button>
          <button type="button" onClick={showFullSolution} className="aa-btn aa-btn--secondary" disabled={locked}>
            Show solution
          </button>
          <button type="button" onClick={resetPuzzle} className="aa-btn aa-btn--ghost" disabled={locked}>
            <RotateCcw size={16} aria-hidden /> Reset
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
