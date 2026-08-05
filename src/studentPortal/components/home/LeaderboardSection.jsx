import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const DATA = {
  /* A slice around the student, not the top of the table. Comparing a 47%
     student against 92% only teaches them they are losing; showing the two
     people just ahead makes the next rank feel like a step. */
  department: [
    { rank: 6, name: 'Kavya Nair', score: 54 },
    { rank: 7, name: 'Imran Shaikh', score: 51 },
    { rank: 8, name: 'Rahul Verma', score: 47, you: true },
    { rank: 9, name: 'Dev Patel', score: 44 },
  ],
  college: [
    { rank: 40, name: 'Sneha Rao', score: 52 },
    { rank: 41, name: 'Arjun Menon', score: 49 },
    { rank: 42, name: 'Rahul Verma', score: 47, you: true },
    { rank: 43, name: 'Ritu Bansal', score: 45 },
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
          <p className="stu-card__sub">Your neighbourhood — the next rank is one step away</p>
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

      <div className="stu-lb__foot">
        <p className="stu-lb__bar">
          <strong>12 of 47</strong> in your branch have cleared the 85% placement bar.
          Rank moves; the bar is what recruiters check.
        </p>
        <button className="stu-link-btn stu-link-btn--block">
          Full leaderboard <ArrowRight size={16} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </section>
  );
}
