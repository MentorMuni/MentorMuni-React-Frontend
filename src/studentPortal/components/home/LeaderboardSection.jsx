import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const DATA = {
  department: [
    { rank: 1, name: 'Sarvesh Gupta', score: 82 },
    { rank: 2, name: 'Ananya Singh', score: 79 },
    { rank: 3, name: 'Meera Iyer', score: 74 },
    { rank: 8, name: 'Rahul Verma', score: 47, you: true },
  ],
  college: [
    { rank: 1, name: 'Karan Mehta', score: 91 },
    { rank: 2, name: 'Sarvesh Gupta', score: 82 },
    { rank: 3, name: 'Ananya Singh', score: 79 },
    { rank: 42, name: 'Rahul Verma', score: 47, you: true },
  ],
  friends: [
    { rank: 1, name: 'Ananya Singh', score: 79 },
    { rank: 2, name: 'Rahul Verma', score: 47, you: true },
    { rank: 3, name: 'Dev Patel', score: 44 },
  ],
};

const TABS = [
  { key: 'department', label: 'Department' },
  { key: 'college', label: 'College' },
  { key: 'friends', label: 'Friends' },
];

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function LeaderboardSection() {
  const [tab, setTab] = useState('department');
  const rows = DATA[tab];

  return (
    <section className="stu-card stu-lb">
      <header className="stu-card__head">
        <div>
          <h2 className="stu-card__title">Leaderboard</h2>
          <p className="stu-card__sub">Ranked by readiness score</p>
        </div>
      </header>

      <div className="stu-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={`stu-tabs__tab${tab === t.key ? ' is-active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {tab === t.key ? (
              <motion.span className="stu-tabs__ink" layoutId="lb-ink" transition={{ duration: 0.22 }} />
            ) : null}
            <span className="stu-tabs__label">{t.label}</span>
          </button>
        ))}
      </div>

      <ul className="stu-lb__list">
        {rows.map((r) => (
          <li key={`${tab}-${r.rank}`} className={`stu-lb__row${r.you ? ' is-you' : ''}`}>
            <span className="stu-lb__rank">{MEDALS[r.rank] || <em>#{r.rank}</em>}</span>
            <span className="stu-avatar stu-avatar--xs" aria-hidden>
              {r.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
            </span>
            <span className="stu-lb__name">
              {r.name}
              {r.you ? <span className="stu-lb__you">You</span> : null}
            </span>
            <span className="stu-lb__score">{r.score}%</span>
          </li>
        ))}
      </ul>

      <button className="stu-link-btn stu-link-btn--block">
        Full leaderboard <ArrowRight size={14} aria-hidden />
      </button>
    </section>
  );
}
