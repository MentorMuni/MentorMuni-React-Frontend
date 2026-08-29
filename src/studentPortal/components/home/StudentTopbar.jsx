import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, CalendarDays, GraduationCap, KeyRound, LogOut, Menu, Monitor, Moon, Sun, User } from 'lucide-react';
import { clearStudentSession } from '../../auth';
import { studentPaths } from '../../paths';
import { useStudentTheme } from '../../useStudentTheme.jsx';
import { driveCountdown, isDriveSoon } from '../../drives';
import { isIndividualStudent, studentCampusLabel } from '../../accountType';
import StudentAvatar from '../StudentAvatar';

const THEME_MODES = [
  { id: 'light', label: 'Light', Icon: Sun },
  { id: 'system', label: 'System', Icon: Monitor },
  { id: 'dark', label: 'Dark', Icon: Moon },
];

/** Demo/local sessions get a synthetic drive; it must not read as real. */
function isSampleDrive(drive) {
  return String(drive?.id || '').startsWith('demo');
}

/** Closes a popover on outside click or Escape. */
function useDismissable(open, onDismiss) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onDismiss();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') onDismiss();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onDismiss]);
  return ref;
}

export default function StudentTopbar({ session, onMenu, nextDrive }) {
  const navigate = useNavigate();
  const { mode, setMode } = useStudentTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const menuRef = useDismissable(menuOpen, () => setMenuOpen(false));
  const notifRef = useDismissable(notifOpen, () => setNotifOpen(false));
  const individual = isIndividualStudent(session);
  const campus = studentCampusLabel(session);

  const signOut = () => {
    clearStudentSession();
    navigate(studentPaths.login, { replace: true });
  };

  return (
    <header className="stu-topbar">
      <button className="stu-topbar__menu" onClick={onMenu} aria-label="Open navigation">
        <Menu size={20} strokeWidth={2} aria-hidden />
      </button>

      {/* College chip for campus students; individual shows college_name or "Individual". */}
      {campus.primary ? (
        <div className="stu-campus" title={campus.primary}>
          <span className="stu-campus__mark" aria-hidden>
            <GraduationCap size={16} strokeWidth={2} />
          </span>
          <span className="stu-campus__text">
            <strong>{campus.primary}</strong>
            {campus.secondary ? <em>{campus.secondary}</em> : null}
          </span>
        </div>
      ) : null}

      <div className="stu-topbar__right">
        {/* Campus drives are college-only — hide for individual students. */}
        {!individual && nextDrive ? (
          <div
            className={`stu-drive-chip${isDriveSoon(nextDrive) ? ' is-soon' : ''}`}
            title={
              isSampleDrive(nextDrive)
                ? 'Sample drive — your college has not published its calendar yet'
                : `Next campus drive: ${nextDrive.company_name}`
            }
          >
            <span className="stu-drive-chip__icon" aria-hidden>
              <CalendarDays size={16} strokeWidth={2} focusable="false" />
            </span>
            <span className="stu-drive-chip__text">
              <strong>{nextDrive.company_name}</strong>
              <em>
                {isSampleDrive(nextDrive) ? 'sample drive' : driveCountdown(nextDrive)}
              </em>
            </span>
          </div>
        ) : null}

        <div
          className="stu-theme-switch"
          role="group"
          aria-label="Colour theme"
        >
          {THEME_MODES.map((option) => {
            const Icon = option.Icon;
            return (
              <button
                key={option.id}
                type="button"
                className="stu-theme-switch__btn"
                aria-pressed={mode === option.id}
                aria-label={`${option.label} theme`}
                title={`${option.label} theme`}
                onClick={() => setMode(option.id)}
              >
                <Icon size={16} strokeWidth={2} aria-hidden focusable="false" />
              </button>
            );
          })}
        </div>

        {/* No badge: there is no notification backend, and a hardcoded
            count is worse than an honest empty panel. */}
        <div className="stu-notif" ref={notifRef}>
          <button
            className="stu-icon-btn"
            aria-label="Notifications"
            aria-haspopup="dialog"
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen((v) => !v)}
          >
            <Bell size={16} strokeWidth={2} aria-hidden />
          </button>

          {notifOpen ? (
            <div className="stu-notif__panel" role="dialog" aria-label="Notifications">
              <p className="stu-notif__title">You&rsquo;re all caught up</p>
              <p className="stu-notif__sub">
                Drive announcements and plan reminders will show up here.
              </p>
            </div>
          ) : null}
        </div>

        <div className="stu-topbar__profile" ref={menuRef}>
          <button
            className="stu-topbar__profile-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Account menu"
          >
            <StudentAvatar student={session} />
          </button>

          {menuOpen ? (
            <div className="stu-menu" role="menu">
              <div className="stu-menu__head">
                <StudentAvatar student={session} />
                <div className="stu-menu__id">
                  <strong>{session?.name || 'Student'}</strong>
                  <em>{session?.email || session?.college_id}</em>
                </div>
              </div>
              <div className="stu-menu__meta">
                <span>
                  {individual
                    ? campus.primary || 'Individual student'
                    : session?.organization_name || 'Your college'}
                </span>
                {!individual && session?.department_name ? (
                  <span>{session.department_name}</span>
                ) : individual && campus.secondary ? (
                  <span>{campus.secondary}</span>
                ) : null}
              </div>
              <div className="stu-menu__sep" />
              <Link
                className="stu-menu__item"
                role="menuitem"
                to={studentPaths.profile}
                onClick={() => setMenuOpen(false)}
              >
                <User size={16} strokeWidth={2} aria-hidden focusable="false" /> Placement profile
              </Link>
              <Link
                className="stu-menu__item"
                role="menuitem"
                to={studentPaths.changePassword}
                onClick={() => setMenuOpen(false)}
              >
                <KeyRound size={16} strokeWidth={2} aria-hidden focusable="false" /> Change password
              </Link>
              <div className="stu-menu__sep" />
              <button
                className="stu-menu__item stu-menu__item--danger"
                role="menuitem"
                onClick={signOut}
              >
                <LogOut size={16} strokeWidth={2} aria-hidden /> Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
