import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  ToggleLeft,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';
import { clearPlatformSession, getPlatformSession } from './auth';
import { platformAdminPaths } from './paths';
import { usePlatformTheme } from './usePlatformTheme';
import PlatformThemeToggle from './PlatformThemeToggle';
import './platform-admin.css';

const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;

const NAV = [
  { to: platformAdminPaths.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: platformAdminPaths.organizations, label: 'Organizations', icon: Building2 },
  { to: platformAdminPaths.subscriptions, label: 'Subscriptions', icon: CreditCard },
  { to: platformAdminPaths.features, label: 'Feature Management', icon: ToggleLeft },
  { to: platformAdminPaths.platformUsers, label: 'Platform Users', icon: Users },
  { to: platformAdminPaths.settings, label: 'Settings', icon: Settings },
];

const TITLES = {
  dashboard: ['Dashboard', 'SaaS metrics across tenants — no student operations.'],
  organizations: ['Organizations', 'Provision and manage college / public tenants.'],
  subscriptions: ['Subscriptions', 'History of assigned plans, seat limits, and seats used.'],
  features: ['Feature Management', 'Enable capabilities per organization.'],
  'platform-users': ['Platform Users', 'MentorMuni employees with portal access.'],
  settings: ['Settings', 'Platform preferences and data tools.'],
  'change-password': ['Change Password', 'Update platform admin credentials securely.'],
};

function Atmosphere() {
  return (
    <div className="mm-pa-atmosphere" aria-hidden>
      <div className="mm-pa-atmosphere__grid" />
      <div className="mm-pa-atmosphere__orb mm-pa-atmosphere__orb--1" />
      <div className="mm-pa-atmosphere__orb mm-pa-atmosphere__orb--2" />
      <div className="mm-pa-atmosphere__orb mm-pa-atmosphere__orb--3" />
    </div>
  );
}

export default function PlatformAdminShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getPlatformSession();
  const { theme, toggleTheme } = usePlatformTheme();
  const segment = location.pathname.split('/').filter(Boolean).pop() || 'dashboard';
  const [title, sub] = TITLES[segment] || ['MentorMuni Platform', 'Tenant provisioning'];

  const logout = () => {
    clearPlatformSession();
    navigate(platformAdminPaths.login, { replace: true });
  };

  return (
    <div className={`mm-pa-root ${theme === 'light' ? 'mm-pa-light' : ''}`}>
      <Atmosphere />
      <div className="mm-pa-shell">
        <aside className="mm-pa-sidebar">
          <div className="mm-pa-brand">
            <img src={LOGO} alt="MentorMuni" className="mm-pa-logo mm-pa-logo--sm" />
            <div className="mm-pa-brand__copy">
              <div className="mm-pa-brand__title">MentorMuni</div>
              <div className="mm-pa-brand__sub">Platform</div>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5" aria-label="Platform modules">
            {NAV.map(({ to, label, icon: Icon }, i) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.35 }}
              >
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `mm-pa-nav-item ${isActive ? 'mm-pa-nav-item--active' : ''}`
                  }
                >
                  <Icon size={17} strokeWidth={2.2} />
                  {label}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          <div className="mm-pa-sidebar__footer">
            <div className="mb-3 rounded-xl border border-sky-500/15 bg-sky-500/5 px-3 py-3">
              <p className="text-xs font-bold text-slate-100">{session?.name || 'Platform Admin'}</p>
              <p className="truncate text-[11px] text-slate-500">{session?.email}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-sky-400">
                {session?.role || 'Platform Admin'}
              </p>
            </div>
            <button type="button" onClick={logout} className="mm-pa-btn mm-pa-btn--ghost w-full">
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </aside>

        <div className="mm-pa-main">
          <header className="mm-pa-topbar">
            <div>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mm-pa-page-title"
                >
                  {title}
                </motion.h1>
              </AnimatePresence>
              <p className="mm-pa-page-sub">{sub}</p>
            </div>
            <div className="flex items-center gap-3">
              <PlatformThemeToggle theme={theme} onToggle={toggleTheme} />
              <span className="mm-pa-badge mm-pa-badge--active hidden sm:inline-flex">
                <span className="mm-pa-live-dot" /> Live · Tenant Ops
              </span>
              <img src={LOGO} alt="" className="mm-pa-logo mm-pa-logo--sm hidden opacity-90 sm:block" />
            </div>
          </header>

          <main className="mm-pa-content">
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
  );
}
