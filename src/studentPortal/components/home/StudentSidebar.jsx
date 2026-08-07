import { NavLink, Link } from 'react-router-dom';
import { Home, Code2, TrendingUp, Building2, ChevronRight, Flame, X } from 'lucide-react';

const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;

const NAV_PRIMARY = [
  { icon: Home, label: 'Home', to: '/studentportal/home', end: true },
  { icon: Code2, label: 'Practice', to: '/studentportal/practice' },
  { icon: Building2, label: 'Company Prep', to: '/studentportal/company-prep' },
  { icon: TrendingUp, label: 'Progress', to: '/studentportal/progress' },
];

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function NavGroup({ label, items, onNavigate }) {
  return (
    <div className="stu-nav__group">
      {label ? <p className="stu-nav__group-label">{label}</p> : null}
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
                <Icon size={16} strokeWidth={2} aria-hidden focusable="false" />
                <span className="stu-nav__text">{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * @param {{ session: object, open: boolean, onClose: function, streak?: number, weekDots?: boolean[] }} props
 * weekDots: Sun→Sat practiced flags from streak store (length 7).
 */
export default function StudentSidebar({
  session,
  open,
  onClose,
  streak = 0,
  weekDots = null,
}) {
  const initials =
    session?.name
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'ST';

  const dots = Array.isArray(weekDots) && weekDots.length === 7
    ? weekDots
    : [false, false, false, false, false, false, false];
  const doneCount = dots.filter(Boolean).length;

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
        </nav>

        <div className="stu-sidebar__foot">
          <div className="stu-streak-mini">
            <div className="stu-streak-mini__top">
              <span className="stu-streak-mini__flame" aria-hidden>
                <Flame size={16} strokeWidth={2} />
              </span>
              <span className="stu-streak-mini__count">{streak}</span>
              <span className="stu-streak-mini__unit">day streak</span>
            </div>
            <div
              className="stu-streak-mini__week"
              role="img"
              aria-label={`${doneCount} of 7 days with a session this week`}
            >
              {DAY_LABELS.map((label, i) => (
                <span
                  key={`${label}-${i}`}
                  className={`stu-streak-mini__dot${dots[i] ? ' is-done' : ''}`}
                >
                  {label}
                </span>
              ))}
            </div>
            <p className="stu-streak-mini__hint">Start a Home or Practice session today.</p>
          </div>

          <Link
            className="stu-sidebar__user"
            to="/studentportal/profile"
            onClick={onClose}
            title="View your placement profile"
          >
            <span className="stu-avatar stu-avatar--sm">{initials}</span>
            <span className="stu-sidebar__user-text">
              <strong>{session?.name || 'Student'}</strong>
              <em>
                {session?.department_name || 'Department'}
                {session?.year ? ` · ${session.year}` : ''}
              </em>
            </span>
            <ChevronRight size={16} strokeWidth={2} aria-hidden focusable="false" />
          </Link>
        </div>
      </aside>
    </>
  );
}
