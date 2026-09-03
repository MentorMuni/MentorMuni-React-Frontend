import { Flame, Trophy } from 'lucide-react';
import {
  APTITUDE_GAMES,
  ARCADE_CATEGORIES,
  levelFromXp,
} from '../../constants/aptitudeGames';

const ICON_CLASS = {
  seating_shuffle: 'aa-sidebar__game-icon--brand',
  family_tree_rush: 'aa-sidebar__game-icon--brand',
  rail_rush: 'aa-sidebar__game-icon--accent',
  factory_floor: 'aa-sidebar__game-icon--amber',
  pattern_pulse: 'aa-sidebar__game-icon--teal',
};

export default function AptitudeGameSidebar({
  activeGameId,
  onSelectGame,
  xp = 0,
  streak = 0,
  categoryFilter,
  onCategoryFilter,
}) {
  const { current, next, progress } = levelFromXp(xp);
  const filtered = categoryFilter
    ? APTITUDE_GAMES.filter((g) => g.category === categoryFilter)
    : APTITUDE_GAMES;

  return (
    <aside className="aa-sidebar" aria-label="Aptitude game library">
      <div className="aa-sidebar__hero">
        <div className="aa-row-between">
          <div>
            <p className="aa-sidebar__label">Progress</p>
            <h2 className="aa-sidebar__level">
              <span className="aa-sidebar__level-badge" aria-hidden>
                {current.badge}
              </span>
              {current.title}
            </h2>
          </div>
          <div className="aa-sidebar__streak-wrap">
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
        <div className="aa-sidebar__xp-bar" aria-hidden>
          <div
            className="aa-sidebar__xp-fill"
            style={{ width: `${Math.max(4, progress * 100)}%` }}
          />
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
            {cat.label}
          </button>
        ))}
      </div>

      <nav className="aa-sidebar__nav" aria-label="Games">
        {filtered.map((game) => {
          const active = game.id === activeGameId;
          return (
            <button
              key={game.id}
              type="button"
              onClick={() => onSelectGame(game.id)}
              className={`aa-sidebar__game${active ? ' is-active' : ''}`}
              aria-current={active ? 'true' : undefined}
            >
              <div className="aa-sidebar__game-row">
                <div className={`aa-sidebar__game-icon ${ICON_CLASS[game.id] || ''}`}>
                  <span aria-hidden>{game.emoji}</span>
                </div>
                <div className="aa-sidebar__game-copy">
                  <p className="aa-sidebar__game-title">{game.title}</p>
                  <p className="aa-sidebar__game-topic">{game.topic}</p>
                </div>
                <div className="aa-sidebar__game-meta">
                  <p className="aa-sidebar__game-time">{game.avgMinutes}m</p>
                  <p className="aa-sidebar__game-xp">+{game.xpPerRound} XP</p>
                </div>
              </div>
              <p className="aa-sidebar__game-hook">{game.hook}</p>
            </button>
          );
        })}
      </nav>

      <div className="aa-sidebar__footer">
        <div className="aa-sidebar__ladder">
          <Trophy size={22} aria-hidden />
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
