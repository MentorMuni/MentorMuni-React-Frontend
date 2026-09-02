import { motion } from 'framer-motion';
import { BookOpen, Target, Zap } from 'lucide-react';
import SeatingShuffleGame from './games/SeatingShuffleGame';
import BloodRelationsGame from './games/BloodRelationsGame';
import TrainRushGame from './games/TrainRushGame';
import NumberPulseGame from './games/NumberPulseGame';
import WorkTimeGame from './games/WorkTimeGame';
import { gameById } from '../../constants/aptitudeGames';

const GAME_COMPONENTS = {
  seating_shuffle: SeatingShuffleGame,
  family_tree_rush: BloodRelationsGame,
  rail_rush: TrainRushGame,
  factory_floor: WorkTimeGame,
  pattern_pulse: NumberPulseGame,
};

const HEAD_CLASS = {
  seating_shuffle: 'aa-play-shell__head--violet',
  family_tree_rush: 'aa-play-shell__head--pink',
  rail_rush: 'aa-play-shell__head--cyan',
  factory_floor: 'aa-play-shell__head--orange',
  pattern_pulse: 'aa-play-shell__head--emerald',
};

export default function GamePlayShell({ gameId, placementMode, onRoundComplete }) {
  const game = gameById(gameId);
  const GameComponent = GAME_COMPONENTS[gameId] ?? SeatingShuffleGame;

  function handleComplete(result) {
    if (result?.correct) {
      onRoundComplete?.({
        gameId,
        xp: game.xpPerRound + (result.xpBonus ?? 0),
      });
    }
  }

  return (
    <div className="aa-play-shell">
      <div className={`aa-play-shell__head ${HEAD_CLASS[gameId] || HEAD_CLASS.seating_shuffle}`}>
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
        <p className="aa-play-shell__bar-accent">
          <Zap size={14} aria-hidden />
          Quick session ~{game.avgMinutes} min
        </p>
      </div>

      <motion.div
        key={gameId}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="aa-play-shell__body"
      >
        <GameComponent onComplete={handleComplete} placementMode={placementMode} />
      </motion.div>
    </div>
  );
}
