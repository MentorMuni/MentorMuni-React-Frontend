import { NavLink, Link } from 'react-router-dom';
import {
  Home,
  Target,
  Map,
  ClipboardCheck,
  Video,
  Sparkles,
  Code2,
  TrendingUp,
  Trophy,
  BookOpen,
  Award,
  ChevronRight,
  X,
} from 'lucide-react';

const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;

const NAV_PRIMARY = [
  { icon: Home, label: 'Home', to: '/studentportal/home', end: true },
  { icon: Target, label: "Today's Plan", to: '/studentportal/plan' },
  { icon: Map, label: 'My Roadmap', to: '/studentportal/roadmap' },
];

const NAV_PREPARE = [
  { icon: ClipboardCheck, label: 'Assessments', to: '/studentportal/assessments', badge: '3' },
  { icon: Video, label: 'Mock Interviews', to: '/studentportal/mocks' },
  { icon: Code2, label: 'Practice', to: '/studentportal/practice' },
  { icon: Sparkles, label: 'AI Mentor', to: '/studentportal/mentor', badge: '24/7', accent: true },
];

const NAV_TRACK = [
  { icon: TrendingUp, label: 'Progress', to: '/studentportal/progress' },
  { icon: Trophy, label: 'Leaderboard', to: '/studentportal/leaderboard' },
  { icon: BookOpen, label: 'Resources', to: '/studentportal/resources' },
  { icon: Award, label: 'Achievements', to: '/studentportal/achievements' },
];

const WEEK = [
  { day: 'S', done: true },
  { day: 'M', done: true },
  { day: 'T', done: true },
  { day: 'W', done: true },
  { day: 'T', done: true },
  { day: 'F', done: true },
  { day: 'S', done: false },
];

function NavGroup({ label, items, onNavigate }) {
  return (
    <div className="stu-nav__group">
      <p className="stu-nav__group-label">{label}</p>
      <ul className="stu-nav__list">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `stu-nav__item${isActive ? ' is-active' : ''}`
                }
              >
                <Icon size={16} strokeWidth={2} aria-hidden />
                <span className="stu-nav__text">{item.label}</span>
                {item.badge ? (
                  <span
                    className={`stu-nav__badge${item.accent ? ' stu-nav__badge--accent' : ''}`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function StudentSidebar({ session, open, onClose, streak = 18 }) {
  const initials =
    session?.name
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'ST';

  return (
    <>
      <div
        className={`stu-scrim${open ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden
      />

      <aside className={`stu-sidebar${open ? ' is-open' : ''}`} aria-label="Main navigation">
        <div className="stu-sidebar__head">
          <Link to="/studentportal/home" className="stu-sidebar__brand" onClick={onClose}>
            <img src={LOGO} alt="" className="stu-sidebar__logo" />
            <span className="stu-sidebar__brand-text">
              <strong>MentorMuni</strong>
              <em>Your Placement OS</em>
            </span>
          </Link>
          <button className="stu-sidebar__close" onClick={onClose} aria-label="Close navigation">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <nav className="stu-nav">
          <NavGroup items={NAV_PRIMARY} onNavigate={onClose} />
          <NavGroup label="Prepare" items={NAV_PREPARE} onNavigate={onClose} />
          <NavGroup label="Track" items={NAV_TRACK} onNavigate={onClose} />
        </nav>

        <div className="stu-sidebar__foot">
          <div className="stu-streak-mini">
            <div className="stu-streak-mini__top">
              <span className="stu-streak-mini__flame" aria-hidden>🔥</span>
              <span className="stu-streak-mini__count">{streak}</span>
              <span className="stu-streak-mini__unit">day streak</span>
            </div>
            <div className="stu-streak-mini__week" role="img" aria-label={`${WEEK.filter((d) => d.done).length} of 7 days completed this week`}>
              {WEEK.map((d, i) => (
                <span
                  key={i}
                  className={`stu-streak-mini__dot${d.done ? ' is-done' : ''}`}
                >
                  {d.day}
                </span>
              ))}
            </div>
            <p className="stu-streak-mini__hint">One task today keeps it alive.</p>
          </div>

          <button className="stu-sidebar__user" type="button">
            <span className="stu-avatar stu-avatar--sm">{initials}</span>
            <span className="stu-sidebar__user-text">
              <strong>{session?.name || 'Student'}</strong>
              <em>
                {session?.department_name || 'Department'}
                {session?.year ? ` · ${session.year}` : ''}
              </em>
            </span>
            <ChevronRight size={16} strokeWidth={2} aria-hidden />
          </button>
        </div>
      </aside>
    </>
  );
}
