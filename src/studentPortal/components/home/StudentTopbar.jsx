import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CalendarDays, LogOut, Menu, Search, Settings, User } from 'lucide-react';
import { clearStudentSession } from '../../auth';
import { studentPaths } from '../../paths';

export default function StudentTopbar({ session, onMenu, theme, onToggleTheme }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const initials =
    session?.name
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'ST';

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const signOut = () => {
    clearStudentSession();
    navigate(studentPaths.login, { replace: true });
  };

  return (
    <header className="stu-topbar">
      <button className="stu-topbar__menu" onClick={onMenu} aria-label="Open navigation">
        <Menu size={20} />
      </button>

      <div className="stu-search">
        <Search size={16} aria-hidden />
        <input
          type="search"
          placeholder="Search tests, topics, companies…"
          aria-label="Search"
        />
        <kbd className="stu-search__kbd">/</kbd>
      </div>

      <div className="stu-topbar__right">
        <div className="stu-drive-chip" title="Next campus drive">
          <span className="stu-drive-chip__icon" aria-hidden>
            <CalendarDays size={15} />
          </span>
          <span className="stu-drive-chip__text">
            <strong>Campus Drive</strong>
            <em>TCS · in 14 days</em>
          </span>
        </div>

        <button className="stu-icon-btn" aria-label="Notifications (3 unread)">
          <Bell size={18} />
          <span className="stu-icon-btn__dot">3</span>
        </button>

        <div className="stu-topbar__profile" ref={menuRef}>
          <button
            className="stu-topbar__profile-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Account menu"
          >
            <span className="stu-avatar">{initials}</span>
          </button>

          {menuOpen ? (
            <div className="stu-menu" role="menu">
              <div className="stu-menu__head">
                <span className="stu-avatar">{initials}</span>
                <div className="stu-menu__id">
                  <strong>{session?.name || 'Student'}</strong>
                  <em>{session?.email || session?.college_id}</em>
                </div>
              </div>
              <div className="stu-menu__meta">
                <span>{session?.organization_name || 'Your college'}</span>
                {session?.department_name ? <span>{session.department_name}</span> : null}
              </div>
              <div className="stu-menu__sep" />
              <button className="stu-menu__item" role="menuitem">
                <User size={15} /> Profile &amp; resume
              </button>
              <button className="stu-menu__item" role="menuitem" onClick={onToggleTheme}>
                <Settings size={15} /> Switch to {theme === 'light' ? 'dark' : 'light'} mode
              </button>
              <div className="stu-menu__sep" />
              <button className="stu-menu__item stu-menu__item--danger" role="menuitem" onClick={signOut}>
                <LogOut size={15} /> Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
