import { motion } from 'framer-motion';
import { Flame, Sparkles, Trophy, Zap } from 'lucide-react';
import {
  APTITUDE_GAMES,
  ARCADE_CATEGORIES,
  levelFromXp,
} from '../../constants/aptitudeGames';

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
    <aside
      className="aa-sidebar flex h-full flex-col rounded-3xl border border-white/10 bg-slate-900/95 text-white shadow-2xl shadow-purple-900/30 backdrop-blur-xl"
      aria-label="Aptitude game library"
    >
      {/* Player card */}
      <div className="aa-sidebar-hero relative overflow-hidden px-5 pb-4 pt-5">
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#FF9500]/20 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-6 bottom-0 h-24 w-24 rounded-full bg-purple-500/20 blur-2xl"
          aria-hidden
        />

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
              Aptitude Arcade
            </p>
            <h2 className="mt-0.5 flex items-center gap-2 text-lg font-black tracking-tight">
              <span aria-hidden>{current.badge}</span>
              {current.title}
            </h2>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="flex items-center gap-1 rounded-full bg-orange-500/20 px-2.5 py-1 text-xs font-bold text-orange-300">
              <Flame className="h-3.5 w-3.5 text-orange-400" aria-hidden />
              {streak} day
            </span>
            <span className="text-[10px] font-semibold text-white/45">streak</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-[11px] font-semibold text-white/60">
            <span>{xp} XP</span>
            <span>{next ? `${next.minXp - xp} to ${next.title}` : 'Max level'}</span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#FF9500] via-yellow-300 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white/5 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Today</p>
            <p className="flex items-center gap-1 text-sm font-black text-cyan-300">
              <Zap className="h-3.5 w-3.5" aria-hidden />
              +{todayXp} XP
            </p>
          </div>
          <div className="rounded-xl bg-white/5 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Modes</p>
            <p className="flex items-center gap-1 text-sm font-black text-purple-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Quick + Placement
            </p>
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-1.5 overflow-x-auto px-4 py-2 scrollbar-none">
        <button
          type="button"
          onClick={() => onCategoryFilter?.(null)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${
            !categoryFilter
              ? 'bg-white text-slate-900'
              : 'bg-white/10 text-white/70 hover:bg-white/15'
          }`}
        >
          All
        </button>
        {ARCADE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryFilter?.(cat.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${
              categoryFilter === cat.id
                ? 'bg-white text-slate-900'
                : 'bg-white/10 text-white/70 hover:bg-white/15'
            }`}
          >
            <span aria-hidden>{cat.emoji}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* Game list */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3 scrollbar-none" aria-label="Games">
        <ul className="space-y-2">
          {filtered.map((game, i) => {
            const active = game.id === activeGameId;
            const cat = ARCADE_CATEGORIES.find((c) => c.id === game.category);
            return (
              <motion.li key={game.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <button
                  type="button"
                  onClick={() => onSelectGame(game.id)}
                  className={`group relative w-full rounded-2xl p-3 text-left transition ${
                    active
                      ? 'bg-gradient-to-br from-white/20 to-white/5 ring-2 ring-[#FF9500]/60'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                  aria-current={active ? 'true' : undefined}
                >
                  {active && (
                    <span
                      className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[#FF9500]"
                      aria-hidden
                    />
                  )}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${game.gradient} text-lg shadow-lg`}
                    >
                      <span aria-hidden>{game.emoji}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{game.title}</p>
                      <p className="truncate text-[11px] text-white/55">{game.topic}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] font-bold text-white/40">{game.avgMinutes}m</p>
                      <p
                        className="text-[10px] font-bold"
                        style={{ color: cat?.color ?? '#fff' }}
                      >
                        +{game.xpPerRound} XP
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[11px] leading-snug text-white/45 group-hover:text-white/60">
                    {game.hook}
                  </p>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Footer CTA */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600/40 to-indigo-600/40 px-4 py-3">
          <Trophy className="h-8 w-8 shrink-0 text-yellow-300" aria-hidden />
          <div className="min-w-0">
            <p className="text-xs font-bold text-white/90">Placement ladder</p>
            <p className="text-[11px] text-white/55">
              Arcade XP feeds your aptitude pillar on the dashboard.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
