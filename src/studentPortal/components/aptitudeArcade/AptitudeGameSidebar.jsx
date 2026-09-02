import { Flame, Sparkles, Trophy, Zap } from 'lucide-react';
import {
  APTITUDE_GAMES,
  ARCADE_CATEGORIES,
  levelFromXp,
} from '../../constants/aptitudeGames';

const ICON_CLASS = {
  seating_shuffle: 'aa-sidebar__game-icon--violet',
  family_tree_rush: 'aa-sidebar__game-icon--pink',
  rail_rush: 'aa-sidebar__game-icon--cyan',
  factory_floor: 'aa-sidebar__game-icon--orange',
  pattern_pulse: 'aa-sidebar__game-icon--emerald',
};

export default function AptitudeGameSidebar({
  activeGameId,
  onSelectGame,
  xp = 0,
  streak = 0,
  categoryFilter,
  onCategoryFilter,
  todayXp = 0,
}) {
  const { current, next, progress } = levelFromXp(xp);
  const filtered = categoryFilter
    ? APTITUDE_GAMES.filter((g) => g.category === categoryFilter)
    : APTITUDE_GAMES;

  return (
    <aside className="aa-sidebar" aria-label="Aptitude game library">
      <div className="aa-sidebar__hero">
        <div className="aa-sidebar__hero-glow aa-sidebar__hero-glow--orange" aria-hidden />
        <div className="aa-sidebar__hero-glow aa-sidebar__hero-glow--purple" aria-hidden />

        <div className="aa-row-between">
          <div>
            <p className="aa-sidebar__label">Aptitude Arcade</p>
            <h2 className="aa-sidebar__level">
              <span aria-hidden>{current.badge}</span>
              {current.title}
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="aa-sidebar__streak">
              <Flame size={14} aria-hidden />
              {streak} day
            </span>
            <p className="aa-sidebar__streak-label">streak</p>
          </div>
        </div>

        <div className="aa-sidebar__xp-row">
          <span>{xp} XP</span>
          <span>{next ? `${next.minXp - xp} to ${next.title}` : 'Max level'}</span>
        </div>
        <div className="aa-sidebar__xp-bar">
          <div
            className="aa-sidebar__xp-fill"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="aa-sidebar__stats">
          <div className="aa-sidebar__stat">
            <p className="aa-sidebar__stat-label">Today</p>
            <p className="aa-sidebar__stat-value aa-sidebar__stat-value--cyan">
              <Zap size={14} aria-hidden />
              +{todayXp} XP
            </p>
          </div>
          <div className="aa-sidebar__stat">
            <p className="aa-sidebar__stat-label">Modes</p>
            <p className="aa-sidebar__stat-value aa-sidebar__stat-value--violet">
              <Sparkles size={14} aria-hidden />
              Quick + Placement
            </p>
          </div>
        </div>
      </div>

      <div className="aa-sidebar__filters">
        <button
          type="button"
          onClick={() => onCategoryFilter?.(null)}
          className={`aa-sidebar__pill${!categoryFilter ? ' is-active' : ''}`}
        >
          All
        </button>
        {ARCADE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryFilter?.(cat.id)}
            className={`aa-sidebar__pill${categoryFilter === cat.id ? ' is-active' : ''}`}
          >
            <span aria-hidden>{cat.emoji}</span> {cat.label}
          </button>
        ))}
      </div>

      <nav className="aa-sidebar__nav" aria-label="Games">
        {filtered.map((game) => {
          const active = game.id === activeGameId;
          const cat = ARCADE_CATEGORIES.find((c) => c.id === game.category);
          return (
            <div key={game.id}>
              <button
                type="button"
                onClick={() => onSelectGame(game.id)}
                className={`aa-sidebar__game${active ? ' is-active' : ''}`}
                aria-current={active ? 'true' : undefined}
              >
                <div className="aa-sidebar__game-row">
                  <div className={`aa-sidebar__game-icon ${ICON_CLASS[game.id] || ''}`}>
                    <span aria-hidden>{game.emoji}</span>
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p className="aa-sidebar__game-title">{game.title}</p>
                    <p className="aa-sidebar__game-topic">{game.topic}</p>
                  </div>
                  <div className="aa-sidebar__game-meta">
                    <p className="aa-sidebar__game-time">{game.avgMinutes}m</p>
                    <p className="aa-sidebar__game-xp" style={{ color: cat?.color ?? '#fff' }}>
                      +{game.xpPerRound} XP
                    </p>
                  </div>
                </div>
                <p className="aa-sidebar__game-hook">{game.hook}</p>
              </button>
            </div>
          );
        })}
      </nav>

      <div className="aa-sidebar__footer">
        <div className="aa-sidebar__ladder">
          <Trophy size={32} aria-hidden />
          <div>
            <p className="aa-sidebar__ladder-title">Placement ladder</p>
            <p className="aa-sidebar__ladder-sub">
              Arcade XP feeds your aptitude pillar on the dashboard.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
