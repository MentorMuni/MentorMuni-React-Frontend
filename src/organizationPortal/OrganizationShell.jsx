import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  Briefcase,
  Building2,
  ClipboardList,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  NotebookPen,
  LifeBuoy,
  Shield,
  User,
  UserPlus,
  Users,
  BarChart3,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { clearOrgSession, getOrgSession, isOrgAuthenticated } from '../orgPortal';
import {
  canMutateCampus,
  canViewAnalytics,
  getOrgLoginPath,
  isHodRole,
  isViewerRole,
  normalizeOrgRole,
  ORG_ROLES,
  sessionDisplayRole,
} from './roles';
import { orgPaths } from './paths';
import { useOrgTheme } from './useOrgTheme';
import OrgThemeToggle from './OrgThemeToggle';
import OrgAccountIdentity from './components/OrgAccountIdentity';
import OrgShellCollegeBrand from './components/OrgShellCollegeBrand';
import { useOrgCollegeBrand } from './useOrgCollegeBrand';
import IdleSessionGuard from '../components/IdleSessionGuard';
import '../components/table/table-query.css';
import './organization-portal.css';

const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;

function navForRole(role) {
  if (canMutateCampus(role)) {
    return [
      { section: 'Overview', items: [
        { to: orgPaths.dashboard, label: 'Dashboard', icon: LayoutDashboard },
        { to: orgPaths.workspace, label: 'My workspace', icon: NotebookPen },
        { to: orgPaths.performance, label: 'Performance dashboard', icon: BarChart3 },
      ]},
      { section: 'Campus', items: [
        { to: orgPaths.departments, label: 'Departments', icon: Building2 },
        { to: orgPaths.enrollment, label: 'Enrollment', icon: UserPlus },
      ]},
      { section: 'Placement ops', items: [
        { to: orgPaths.programs, label: 'Programs & tests', icon: ClipboardList },
        { to: orgPaths.upcomingDrives, label: 'Upcoming drives', icon: Briefcase },
        { to: orgPaths.drives, label: 'Notify events', icon: Bell },
      ]},
      { section: 'Admin', items: [
        { to: orgPaths.access, label: 'HOD access', icon: Shield },
        { to: orgPaths.help, label: 'Help Center', icon: LifeBuoy },
      ]},
    ];
  }

  if (isHodRole(role)) {
    return [
      { section: 'Overview', items: [
        { to: orgPaths.dashboard, label: 'Dashboard', icon: LayoutDashboard },
        { to: orgPaths.workspace, label: 'My workspace', icon: NotebookPen },
        { to: orgPaths.performance, label: 'Performance dashboard', icon: BarChart3 },
      ]},
      { section: 'My branch', items: [
        { to: orgPaths.students, label: 'Students', icon: Users },
        { to: orgPaths.programs, label: 'Programs & assessments', icon: ClipboardList },
        { to: orgPaths.drives, label: 'Notify branch', icon: Bell },
        { to: orgPaths.upcomingDrives, label: 'Upcoming drives', icon: Briefcase },
      ]},
      { section: 'Account', items: [
        { to: orgPaths.help, label: 'Help Center', icon: LifeBuoy },
      ]},
    ];
  }

  if (isViewerRole(role) || canViewAnalytics(role)) {
    return [
      { section: 'Analytics', items: [
        { to: orgPaths.dashboard, label: 'Dashboard', icon: LayoutDashboard },
        { to: orgPaths.performance, label: 'Performance dashboard', icon: BarChart3 },
        { to: orgPaths.departments, label: 'Departments', icon: Building2 },
      ]},
      { section: 'Account', items: [
        { to: orgPaths.help, label: 'Help Center', icon: LifeBuoy },
      ]},
    ];
  }

  return [
    { section: 'Overview', items: [
      { to: orgPaths.dashboard, label: 'Dashboard', icon: LayoutDashboard },
    ]},
    { section: 'Account', items: [
      { to: orgPaths.help, label: 'Help Center', icon: LifeBuoy },
    ]},
  ];
}

const TITLES = {
  dashboard: {
    [ORG_ROLES.TPO]: ['TPO Dashboard', 'Campus readiness, enrollment, and placement ops.'],
    [ORG_ROLES.HOD]: ['Branch dashboard', 'Your branch pulse — readiness, gaps, and mentoring actions.'],
    [ORG_ROLES.VIEWER]: ['Analytics Dashboard', 'Read-only campus readiness and trends.'],
    [ORG_ROLES.STUDENT]: ['Student Dashboard', 'Your placement preparation workspace.'],
  },
  workspace: ['My workspace', 'Your private todos, reminders, and notes — stay on this platform.'],
  departments: ['Departments', 'Branches, HOD, and optional Placement Coordinator.'],
  enrollment: ['Student enrollment', 'Invite students, approve requests, assign departments.'],
  students: ['Branch students', 'Enrolled students, invites, and readiness for your department.'],
  programs: {
    [ORG_ROLES.TPO]: ['Programs & tests', 'Assign readiness tests, mocks, competitions, and timelines.'],
    [ORG_ROLES.HOD]: ['Programs & assessments', 'Assign skill, aptitude, English, technical, and mock interviews.'],
  },
  drives: ['Notify events', 'Events, workshops, and announcements — all students, selected departments, or HODs.'],
  'upcoming-drives': ['Upcoming drives', 'Company drives — eligibility, date, and remarks for Org Admins.'],
  notify: ['Notify branch', 'Announcements and reminders for your department only.'],
  performance: {
    [ORG_ROLES.TPO]: ['Performance dashboard', 'Executive readiness for dean, director & HR — pillars, charts, PDF export.'],
    [ORG_ROLES.HOD]: ['Branch performance', 'Scorecards and gaps for your department students.'],
    [ORG_ROLES.VIEWER]: ['Performance dashboard', 'Campus readiness pillars, departments, and export for leadership.'],
  },
  access: ['HOD access', 'Control what department mentors can do.'],
  profile: ['Profile', 'Your account — name, email, and college.'],
  settings: ['Profile', 'Your account — name, email, and college.'],
  help: ['Help Center', 'Tell MentorMuni if the platform is broken — or send feedback.'],
  'change-password': ['Change password', 'Update your credentials securely.'],
};

function Atmosphere() {
  return (
    <div className="mm-org-atmosphere" aria-hidden>
      <div className="mm-org-atmosphere__grid" />
      <div className="mm-org-atmosphere__orb mm-org-atmosphere__orb--1" />
      <div className="mm-org-atmosphere__orb mm-org-atmosphere__orb--2" />
      <div className="mm-org-atmosphere__orb mm-org-atmosphere__orb--3" />
    </div>
  );
}

export default function OrganizationShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getOrgSession();
  const college = useOrgCollegeBrand(session);
  const { theme, toggleTheme } = useOrgTheme();
  const [navOpen, setNavOpen] = useState(false);
  const portalRole = normalizeOrgRole(session?.role);
  const navGroups = navForRole(session?.role);
  const segment = location.pathname.split('/').filter(Boolean).pop() || 'dashboard';
  let title = 'Organization Portal';
  let sub = 'College placement workspace';
  const entry = TITLES[segment];
  if (Array.isArray(entry)) [title, sub] = entry;
  else if (entry?.[portalRole]) [title, sub] = entry[portalRole];
  if (segment === 'help') {
    const org = session?.organization_name || session?.organization_code || 'your college';
    sub = `Report a platform issue or send product feedback. MentorMuni sees ${org} and the Organization Portal — not your name.`;
  }

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!navOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setNavOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);

  const brandSub =
    portalRole === ORG_ROLES.TPO
      ? 'TPO Portal'
      : portalRole === ORG_ROLES.HOD
        ? sessionDisplayRole(session) === 'Placement Coordinator'
          ? 'Placement Coordinator Portal'
          : 'HOD Portal'
        : portalRole === ORG_ROLES.VIEWER
          ? 'Viewer'
          : 'Organization';

  const liveLabel = isViewerRole(session?.role)
    ? 'Live · View only'
    : isHodRole(session?.role)
      ? 'Live · Branch ops'
      : 'Live · Campus ops';

  return (
    <IdleSessionGuard
      isAuthenticated={isOrgAuthenticated}
      clearSession={clearOrgSession}
      loginPath={getOrgLoginPath()}
      portalLabel="organization portal"
    >
      <div
        className={`mm-org-root ${theme === 'light' ? 'mm-org-root--light' : ''}${
          navOpen ? ' is-nav-open' : ''
        }`}
      >
      <Atmosphere />
      <button
        type="button"
        className="mm-org-nav-backdrop"
        aria-label="Close navigation"
        onClick={() => setNavOpen(false)}
      />
      <div className="mm-org-shell">
        <aside className="mm-org-sidebar" id="mm-org-sidebar">
          <div className="mm-org-brand">
            <img src={LOGO} alt="MentorMuni" />
            <div>
              <div className="mm-org-brand__title">MentorMuni</div>
              <div className="mm-org-brand__sub">{brandSub}</div>
            </div>
            <button
              type="button"
              className="mm-org-sidebar__close"
              aria-label="Close navigation"
              onClick={() => setNavOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="mm-org-sidebar__scroll">
            <nav className="mm-org-nav" aria-label="Organization modules">
            {navGroups.map((group) => (
              <div key={group.section}>
                <p className="mm-org-nav-label">{group.section}</p>
                {group.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.03 * i, duration: 0.3 }}
                    >
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          `mm-org-nav-item ${isActive ? 'mm-org-nav-item--active' : ''}`
                        }
                      >
                        <Icon size={17} strokeWidth={2.2} />
                        <span>{item.label}</span>
                      </NavLink>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </nav>
          </div>

          <div className="mm-org-sidebar__foot">
            <div className="mm-org-sidebar__foot-links">
              <NavLink
                to={orgPaths.profile}
                className={({ isActive }) =>
                  `mm-org-sidebar__foot-link ${isActive ? 'is-active' : ''}`
                }
              >
                <User size={15} />
                <span>Profile</span>
              </NavLink>
              <NavLink
                to={orgPaths.changePassword}
                className={({ isActive }) =>
                  `mm-org-sidebar__foot-link ${isActive ? 'is-active' : ''}`
                }
              >
                <KeyRound size={15} />
                <span>Change password</span>
              </NavLink>
            </div>
          </div>
        </aside>

        <div className="mm-org-main">
          <header className="mm-org-topbar">
            <button
              type="button"
              className="mm-org-nav-toggle"
              aria-label={navOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={navOpen}
              aria-controls="mm-org-sidebar"
              onClick={() => setNavOpen((o) => !o)}
            >
              {navOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="mm-org-topbar__titles min-w-0">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={title}
                  className="mm-org-page-title"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {title}
                </motion.h1>
              </AnimatePresence>
              <p className="mm-org-page-sub">{sub}</p>
            </div>
            <div className="mm-org-topbar__campus mm-org-topbar__campus-strip">
              <OrgShellCollegeBrand
                college={college}
                variant="topbar"
                belowName={
                  <span className="mm-org-live mm-org-live--topbar mm-org-live--below-college">
                    <span className="mm-org-live-dot" />
                    {liveLabel}
                  </span>
                }
              />
            </div>
            <div className="mm-org-account" title="Signed-in account">
              <OrgAccountIdentity session={session} align="right" />
              <div className="mm-org-account__actions">
                <button
                  type="button"
                  className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm mm-org-account__signout"
                  onClick={() => {
                    clearOrgSession();
                    navigate(getOrgLoginPath(), { replace: true });
                  }}
                >
                  <LogOut size={15} />
                  <span>Sign out</span>
                </button>
                <OrgThemeToggle
                  theme={theme}
                  onToggle={toggleTheme}
                  compact
                  className="mm-org-theme-toggle--in-account"
                />
              </div>
            </div>
          </header>
          <main className="mm-org-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
    </IdleSessionGuard>
  );
}
