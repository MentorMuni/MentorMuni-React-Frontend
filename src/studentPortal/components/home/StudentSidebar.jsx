import { NavLink, Link } from 'react-router-dom';
import {
  Home,
  Code2,
  TrendingUp,
  Building2,
  Briefcase,
  ChevronRight,
  Flame,
  X,
  Terminal,
  Sparkles,
  Heart,
  LifeBuoy,
  StickyNote,
} from 'lucide-react';
import '../../styles/fear-to-fearless-sidebar.css';
import '../../styles/whiteboard.css';
import { isIndividualStudent, studentCampusLabel } from '../../accountType';

const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;

const NAV_PRIMARY = [
  { icon: Home, label: 'Home', to: '/studentportal/home', end: true },
  { icon: Sparkles, label: 'AI Mentor', to: '/studentportal/mentor' },
  { icon: StickyNote, label: 'White Board', to: '/studentportal/whiteboard', wall: true },
  { icon: Code2, label: 'Practice', to: '/studentportal/practice' },
  { icon: Terminal, label: 'Coding Round', to: '/studentportal/coding' },
  { icon: Briefcase, label: 'Companies', to: '/studentportal/companies' },
  { icon: Building2, label: 'Company Prep', to: '/studentportal/company-prep' },
  { icon: TrendingUp, label: 'Progress', to: '/studentportal/progress' },
  { icon: LifeBuoy, label: 'Help Center', to: '/studentportal/help' },
];

// Special premium feature - separated with divider
const PREMIUM_FEATURES = [
  { icon: Heart, label: 'Fear → Fearless', to: '/studentportal/fear-to-fearless', special: true },
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
                  `stu-nav__item no-underline${isActive ? ' is-active' : ''}${item.wall ? ' stu-nav__item--wall' : ''}`
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
  const campus = studentCampusLabel(session);
  const footerLine = isIndividualStudent(session)
    ? campus.secondary || campus.primary || 'Individual'
    : session?.department_name || 'Department';

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
          
          {/* Divider for premium feature */}
          <div className="stu-nav__divider" />
          
          {/* Fear → Fearless premium feature */}
          <div className="stu-nav__group">
            <ul className="stu-nav__list">
              {PREMIUM_FEATURES.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <NavLink
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `stu-nav__item no-underline${isActive ? ' is-active' : ''}${item.special ? ' stu-nav__item--premium' : ''}`
                      }
                      title="Your private 6-week AI coaching journey"
                    >
                      <Icon size={16} strokeWidth={2} aria-hidden focusable="false" />
                      <span className="stu-nav__text">{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
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
                {footerLine}
                {session?.year || session?.batch_year
                  ? ` · ${session.year || session.batch_year}`
                  : ''}
              </em>
            </span>
            <ChevronRight size={16} strokeWidth={2} aria-hidden focusable="false" />
          </Link>
        </div>
      </aside>
    </>
  );
}
