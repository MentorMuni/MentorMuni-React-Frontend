import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Gamepad2, Sparkles, Target } from 'lucide-react';
import AptitudeGameSidebar from '../components/aptitudeArcade/AptitudeGameSidebar';
import GamePlayShell from '../components/aptitudeArcade/GamePlayShell';
import { gameById } from '../constants/aptitudeGames';
import { useStudentShell } from '../shellContext';
import { recordStudentSession } from '../streak';
import '../styles/aptitude-arcade.css';

const STORAGE_KEY = 'mm-aptitude-arcade-v1';

function loadProgress(userKey) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}:${userKey}`);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { xp: 0, streak: 0, todayXp: 0, lastDay: null };
}

function saveProgress(userKey, data) {
  try {
    localStorage.setItem(`${STORAGE_KEY}:${userKey}`, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export default function StudentAptitudeArcadePage() {
  const { userKey, refreshStreak } = useStudentShell();
  const [activeGameId, setActiveGameId] = useState('seating_shuffle');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [placementMode, setPlacementMode] = useState(false);
  const [progress, setProgress] = useState(() => loadProgress(userKey));
  const [xpToast, setXpToast] = useState(null);

  const handleRoundComplete = useCallback(
    ({ xp }) => {
      const today = new Date().toDateString();
      setProgress((p) => {
        const next = {
          ...p,
          xp: p.xp + xp,
          todayXp: (p.lastDay === today ? p.todayXp : 0) + xp,
          lastDay: today,
        };
        saveProgress(userKey, next);
        return next;
      });
      recordStudentSession(userKey);
      refreshStreak();
      setXpToast(xp);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#FF9500', '#a855f7', '#06b6d4', '#10b981'],
      });
      setTimeout(() => setXpToast(null), 2000);
    },
    [refreshStreak, userKey],
  );

  const activeGame = gameById(activeGameId);

  return (
    <div className="stu-arcade">
      <header className="stu-arcade__hero">
        <div>
          <p className="stu-arcade__eyebrow">Free-time grind</p>
          <h1 className="stu-arcade__title">
            <Gamepad2 size={28} strokeWidth={2.2} aria-hidden />
            Aptitude Arcade
          </h1>
          <p className="stu-arcade__sub">
            Seating puzzles, blood relations, trains, work-time & number series — prep while you play.
          </p>
        </div>
        <div className="stu-arcade__modes" role="group" aria-label="Game mode">
          <button
            type="button"
            className={`stu-arcade__mode${!placementMode ? ' is-active' : ''}`}
            onClick={() => setPlacementMode(false)}
          >
            <Sparkles size={16} aria-hidden />
            Chill
          </button>
          <button
            type="button"
            className={`stu-arcade__mode stu-arcade__mode--placement${placementMode ? ' is-active' : ''}`}
            onClick={() => setPlacementMode(true)}
          >
            <Target size={16} aria-hidden />
            Placement
          </button>
        </div>
      </header>

      {placementMode && (
        <p className="stu-arcade__banner">
          Placement mode: tighter timers, exam-style pressure, bonus XP on streaks.
        </p>
      )}

      <div className="stu-arcade__grid">
        <AptitudeGameSidebar
          activeGameId={activeGameId}
          onSelectGame={setActiveGameId}
          xp={progress.xp}
          streak={progress.streak}
          todayXp={progress.todayXp}
          categoryFilter={categoryFilter}
          onCategoryFilter={setCategoryFilter}
        />

        <div className="stu-arcade__play">
          <GamePlayShell
            gameId={activeGameId}
            placementMode={placementMode}
            onRoundComplete={handleRoundComplete}
          />

          <section className="stu-arcade__why">
            <h2>Why this maps to placements</h2>
            <p>{activeGame.hook}</p>
            <div className="stu-arcade__skills">
              {activeGame.skills.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </section>
        </div>
      </div>

      {xpToast != null && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="stu-arcade__toast"
          role="status"
        >
          +{xpToast} XP · Aptitude grinding
        </motion.div>
      )}
    </div>
  );
}
