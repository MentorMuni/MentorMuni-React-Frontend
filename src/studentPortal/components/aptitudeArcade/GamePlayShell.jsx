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
    <div className="aa-play-shell overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-xl dark:border-slate-700 dark:bg-slate-800/95">
      {/* Game header */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${game.gradient} px-5 py-5 sm:px-6 sm:py-6`}>
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
              {game.topic}
            </p>
            <h3 className="mt-1 flex items-center gap-2 text-xl font-black text-white sm:text-2xl">
              <span aria-hidden>{game.emoji}</span>
              {game.title}
            </h3>
            <p className="mt-1 text-sm text-white/75">{game.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
              +{game.xpPerRound} XP / round
            </span>
            {placementMode && (
              <span className="flex items-center gap-1 rounded-full bg-[#FF9500] px-3 py-1 text-xs font-bold text-white">
                <Target className="h-3 w-3" /> Placement
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {game.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-lg bg-black/20 px-2.5 py-1 text-[10px] font-bold text-white/90"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Mode bar */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-2.5 dark:border-slate-700 dark:bg-slate-900/50">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <BookOpen className="h-3.5 w-3.5" />
          Learn-by-playing — formulas unlock after you solve
        </p>
        <p className="flex items-center gap-1 text-xs font-bold text-[#FF9500]">
          <Zap className="h-3.5 w-3.5" />
          Quick session ~{game.avgMinutes} min
        </p>
      </div>

      <motion.div
        key={gameId}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="p-5 sm:p-6"
      >
        <GameComponent onComplete={handleComplete} placementMode={placementMode} />
      </motion.div>
    </div>
  );
}
