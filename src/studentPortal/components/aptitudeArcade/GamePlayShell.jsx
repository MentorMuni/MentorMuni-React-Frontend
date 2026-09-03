import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Loader2, RefreshCw, Target, Zap } from 'lucide-react';
import SeatingShuffleGame from './games/SeatingShuffleGame';
import BloodRelationsGame from './games/BloodRelationsGame';
import TrainRushGame from './games/TrainRushGame';
import NumberPulseGame from './games/NumberPulseGame';
import WorkTimeGame from './games/WorkTimeGame';
import { gameById } from '../../constants/aptitudeGames';
import {
  SEATING_PUZZLES_BANK,
  BLOOD_RELATION_ROUNDS,
  TRAIN_SCENARIOS_BANK,
  WORK_JOBS_BANK,
  NUMBER_SERIES_BANK,
} from '../../constants/arcadeQuestionBank';
import { QUESTIONS_PER_GAME } from '../../constants/arcadeGameUtils';
import { generateArcadeQuestions, StudentApiError } from '../../arcadeApi';

const GAME_COMPONENTS = {
  seating_shuffle: SeatingShuffleGame,
  family_tree_rush: BloodRelationsGame,
  rail_rush: TrainRushGame,
  factory_floor: WorkTimeGame,
  pattern_pulse: NumberPulseGame,
};

const DEFAULT_BANKS = {
  seating_shuffle: SEATING_PUZZLES_BANK,
  family_tree_rush: BLOOD_RELATION_ROUNDS,
  rail_rush: TRAIN_SCENARIOS_BANK,
  factory_floor: WORK_JOBS_BANK,
  pattern_pulse: NUMBER_SERIES_BANK,
};

function cloneBank(bank) {
  return Array.isArray(bank) ? bank.map((q) => ({ ...q })) : [];
}

export default function GamePlayShell({ gameId, placementMode, onRoundComplete }) {
  const game = gameById(gameId);
  const GameComponent = GAME_COMPONENTS[gameId] ?? SeatingShuffleGame;

  const [banks, setBanks] = useState(() => {
    const init = {};
    Object.keys(DEFAULT_BANKS).forEach((id) => {
      init[id] = cloneBank(DEFAULT_BANKS[id]);
    });
    return init;
  });
  const [bankEpoch, setBankEpoch] = useState(0);
  const [loadingPack, setLoadingPack] = useState(false);
  const [packError, setPackError] = useState('');
  const [packNote, setPackNote] = useState('');

  const bank = useMemo(() => {
    const list = banks[gameId];
    if (Array.isArray(list) && list.length) return list;
    return DEFAULT_BANKS[gameId] || SEATING_PUZZLES_BANK;
  }, [banks, gameId]);

  useEffect(() => {
    setPackError('');
    setPackNote('');
  }, [gameId]);

  function handleComplete(result) {
    if (result?.correct) {
      onRoundComplete?.({
        gameId,
        xp: game.xpPerRound + (result.xpBonus ?? 0),
      });
    }
  }

  const loadMoreQuestions = useCallback(async () => {
    if (loadingPack) return;
    setLoadingPack(true);
    setPackError('');
    setPackNote('');
    try {
      const data = await generateArcadeQuestions(gameId, { count: QUESTIONS_PER_GAME });
      const next = Array.isArray(data?.questions) ? data.questions : [];
      if (next.length < 8) {
        throw new Error('Not enough questions returned. Try again.');
      }
      setBanks((prev) => ({ ...prev, [gameId]: next }));
      setBankEpoch((n) => n + 1);
      setPackNote(`Loaded ${next.length} new questions — previous pack replaced.`);
    } catch (err) {
      const msg =
        err instanceof StudentApiError
          ? err.message
          : err?.message || 'Could not load new questions.';
      setPackError(msg);
    } finally {
      setLoadingPack(false);
    }
  }, [gameId, loadingPack]);

  return (
    <div className="aa-play-shell">
      <div className="aa-play-shell__head">
        <div className="aa-row-between" style={{ alignItems: 'flex-start' }}>
          <div>
            <p className="aa-play-shell__topic">{game.topic}</p>
            <h3 className="aa-play-shell__title">
              <span aria-hidden>{game.emoji}</span>
              {game.title}
            </h3>
            <p className="aa-play-shell__subtitle">{game.subtitle}</p>
          </div>
          <div className="aa-play-shell__badges">
            <span className="aa-play-shell__badge">+{game.xpPerRound} XP / round</span>
            {placementMode && (
              <span className="aa-play-shell__badge aa-play-shell__badge--placement">
                <Target size={12} aria-hidden /> Placement
              </span>
            )}
          </div>
        </div>
        <div className="aa-play-shell__skills">
          {game.skills.map((skill) => (
            <span key={skill} className="aa-play-shell__skill">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="aa-play-shell__bar">
        <p className="aa-play-shell__bar-text">
          <BookOpen size={14} aria-hidden />
          Learn-by-playing — formulas unlock after you solve
        </p>
        <div className="aa-play-shell__bar-right">
          <p className="aa-play-shell__bar-accent">
            <Zap size={14} aria-hidden />
            {bank.length} questions · ~{game.avgMinutes} min
          </p>
          <button
            type="button"
            className="aa-play-shell__reload"
            onClick={loadMoreQuestions}
            disabled={loadingPack}
          >
            {loadingPack ? (
              <>
                <Loader2 size={14} className="aa-spin" aria-hidden /> Generating…
              </>
            ) : (
              <>
                <RefreshCw size={14} aria-hidden /> Load more questions
              </>
            )}
          </button>
        </div>
      </div>

      {packError ? (
        <p className="aa-play-shell__pack-msg is-error" role="alert">
          {packError}
        </p>
      ) : null}
      {packNote && !packError ? (
        <p className="aa-play-shell__pack-msg is-ok" role="status">
          {packNote}
        </p>
      ) : null}

      <motion.div
        key={`${gameId}-${bankEpoch}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="aa-play-shell__body"
      >
        <GameComponent
          bank={bank}
          onComplete={handleComplete}
          placementMode={placementMode}
        />
      </motion.div>
    </div>
  );
}
