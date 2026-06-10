import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  BarChart2,
  Mic,
  FileSearch,
  Cpu,
  GraduationCap,
  BookOpen,
  Building2,
  Info,
  Mail,
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { goToStartAssessment } from '../utils/startAssessmentNavigation';
import { isNavActive } from '../utils/navRouteMatch';
import { PRIMARY_CTA_LABEL, READINESS_TEST_COUPON_BADGE } from '../constants/brandCopy';
import LimitedRewardLabel from './LimitedRewardLabel';
import NavDropdownPortal from './navbar/NavDropdownPortal';
import MobileNavDrawer from './navbar/MobileNavDrawer';
import { useScrolledHeader } from '../hooks/useScrolledHeader';
import { NAV_DESKTOP_MQ } from '../constants/layoutBreakpoints';

/** Secondary links — desktop dropdown to avoid a crowded top bar */
const MORE_LINKS = [
  { label: 'For colleges', path: '/colleges', exact: true, Icon: Building2 },
  { label: 'About us', path: '/about', exact: true, Icon: Info },
  { label: 'Contact us', path: '/contact', exact: true, Icon: Mail },
];

const TOOLS = [
  {
    icon: BookOpen,
    color: 'text-primary',
    bg: 'bg-accent-soft',
    title: 'All free tools',
    desc: 'Readiness, mocks, ATS, tutorials — one hub',
    href: '/tools',
  },
  {
    icon: BarChart2,
    color: 'text-primary',
    bg: 'bg-accent-soft',
    title: 'Readiness check',
    desc: 'DSA, SD & HR score — finish the check for a coupon (1:1 mentorship + AI mock)',
    href: '/interview-readiness-tools',
  },
  {
    icon: Mic,
    color: 'text-primary',
    bg: 'bg-accent-soft',
    title: 'AI Mock Interviews',
    desc: 'Practice with real-time AI interviewer feedback',
    href: '/mock-interviews',
  },
  {
    icon: FileSearch,
    color: 'text-primary',
    bg: 'bg-accent-soft',
    title: 'Resume ATS Checker',
    desc: 'See your ATS score and fix what gets you filtered',
    href: '/resume-analyzer',
  },
  {
    icon: Cpu,
    color: 'text-primary-hover',
    bg: 'bg-accent-soft',
    title: 'AI Tools Knowledge Base',
    desc: 'Learn GitHub Copilot, ChatGPT & Cursor for interviews',
    href: '/ai-tools',
  },
  {
    icon: GraduationCap,
    color: 'text-primary',
    bg: 'bg-accent-soft',
    title: 'Placement Tracks',
    desc: 'Company-wise preparation paths — TCS, Infosys, Wipro, and more',
    href: '/placement-tracks',
  },
  {
    icon: BookOpen,
    color: 'text-primary',
    bg: 'bg-accent-soft',
    title: 'Free Tutorials',
    desc: 'Topic refreshers and panel-ready framing — start free',
    href: '/free-tutorials',
  },
];

const Navbar = () => {
  const logoSrc = `${import.meta.env.BASE_URL}mentormuni-logo.png`;
  const headerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const toolsRef = useRef(null);
  const moreRef = useRef(null);
  const toolsPanelRef = useRef(null);
  const morePanelRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      const inTools =
        toolsRef.current?.contains(e.target) || toolsPanelRef.current?.contains(e.target);
      const inMore =
        moreRef.current?.contains(e.target) || morePanelRef.current?.contains(e.target);
      if (!inTools) setToolsOpen(false);
      if (!inMore) setMoreOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setToolsOpen(false);
    setMoreOpen(false);
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const mq = window.matchMedia(NAV_DESKTOP_MQ);
    const closeOnDesktop = (event) => {
      if (event.matches) setIsOpen(false);
    };
    mq.addEventListener('change', closeOnDesktop);
    return () => mq.removeEventListener('change', closeOnDesktop);
  }, []);

  const navItems = [
    { label: 'How It Works', path: '/how-it-works', exact: false },
    { label: 'How to Prepare', path: '/roadmap', exact: true, variant: 'roadmap' },
    { label: 'Mentors', path: '/mentors', exact: false },
    { label: 'Outcomes', path: '/outcomes', exact: false },
  ];

  const isActive = (path, exact = false) => isNavActive(location.pathname, path, exact);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const handleHomeClick = () => {
    scrollToTop();
    setIsOpen(false);
  };

  const defaultNavDesktopClass = (active) =>
    `font-medium whitespace-nowrap transition-colors ${
      active
        ? 'text-primary font-semibold'
        : 'text-gray-700 hover:text-primary'
    }`;

  const moreMenuActive = MORE_LINKS.some((l) => isActive(l.path, l.exact));

  const navLinkClass = (item) => {
    const active = isActive(item.path, item.exact);
    if (item.variant === 'roadmap') {
      return `whitespace-nowrap transition-colors ${
        active
          ? 'font-semibold text-success-strong'
          : 'font-medium text-gray-700 hover:text-success-strong'
      }`;
    }
    return defaultNavDesktopClass(active);
  };

  const navMenuOpen = toolsOpen || moreOpen;
  const headerScrolled = useScrolledHeader();

  return (
    <header
      ref={headerRef}
      className={`mm-sticky-header${navMenuOpen ? ' mm-sticky-header--menu-open' : ''}${
        headerScrolled ? ' mm-sticky-header--scrolled' : ''
      }${isOpen ? ' mm-sticky-header--mobile-nav-open' : ''}`}
    >
      <div className="mm-container">
        <div className="mm-header-bar min-h-[4rem] min-w-0 py-1">
          <Link
            to="/"
            onClick={handleHomeClick}
            className="group flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2"
          >
            <img
              src={logoSrc}
              alt="MentorMuni Logo"
              className="h-9 w-9 shrink-0 object-contain transition-all group-hover:opacity-80 sm:h-10 sm:w-10"
            />
            <span className="truncate text-base font-extrabold tracking-tight text-foreground sm:text-lg">
              Mentor<span className="text-primary">Muni</span>
            </span>
          </Link>

          <nav
            data-mm-desktop-nav
            className="mm-desktop-nav min-w-0 items-center"
          >
            {navItems.map((item) => {
              const linkActive = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={navLinkClass(item)}
                  aria-current={linkActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}

            <div ref={toolsRef} className="mm-nav-menu relative" data-open={toolsOpen ? 'true' : undefined}>
              <button
                type="button"
                onClick={() => setToolsOpen(v => !v)}
                aria-expanded={toolsOpen}
                aria-haspopup="true"
                className={`mm-nav-trigger relative z-[1] inline-flex items-center gap-1 font-medium transition-colors ${
                  toolsOpen
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                Tools
                <ChevronDown size={16} strokeWidth={2} className={`shrink-0 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>

              <NavDropdownPortal
                open={toolsOpen}
                anchorRef={toolsRef}
                panelRef={toolsPanelRef}
                align="left"
                className="w-[19.5rem] overflow-hidden"
              >
                <div className="max-h-[min(70vh,26rem)] overflow-y-auto overscroll-contain p-2">
                  {TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.href}
                        to={tool.href}
                        onClick={() => setToolsOpen(false)}
                        className="mm-nav-dropdown-item"
                        role="menuitem"
                      >
                        <span className="mm-nav-dropdown-icon mm-nav-dropdown-icon--lg">
                          <Icon size={17} strokeWidth={2} aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <span className="mm-nav-dropdown-item__title">{tool.title}</span>
                          <span className="mm-nav-dropdown-item__desc">{tool.desc}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
                <div className="mm-nav-dropdown-promo">
                  <div className="mb-1.5 w-fit">
                    <LimitedRewardLabel className="text-[8px] px-2 py-0.5 [&_svg]:h-2.5 [&_svg]:w-2.5" />
                  </div>
                  <p className="mm-nav-dropdown-promo__text">{READINESS_TEST_COUPON_BADGE}</p>
                  <Link
                    to="/interview-readiness-tools"
                    onClick={() => setToolsOpen(false)}
                    className="mm-nav-dropdown-promo__link"
                    role="menuitem"
                  >
                    Start with a free readiness check →
                  </Link>
                </div>
              </NavDropdownPortal>
            </div>

            <div ref={moreRef} className="mm-nav-menu relative" data-open={moreOpen ? 'true' : undefined}>
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                aria-label="Colleges, about, and contact"
                className={`mm-nav-trigger relative z-[1] inline-flex items-center gap-1 font-medium whitespace-nowrap transition-colors ${
                  moreOpen || moreMenuActive
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                About/Contact
                <ChevronDown size={16} strokeWidth={2} className={`shrink-0 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              <NavDropdownPortal
                open={moreOpen}
                anchorRef={moreRef}
                panelRef={morePanelRef}
                align="right"
                className="w-[min(calc(100vw-2rem),15.5rem)] py-1.5"
              >
                {MORE_LINKS.map(({ label, path, exact, Icon }) => {
                  const active = isActive(path, exact);
                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setMoreOpen(false)}
                      className={`mm-nav-dropdown-item mm-nav-dropdown-item--row px-3 py-2.5 text-[0.9375rem] font-semibold ${
                        active ? 'mm-nav-dropdown-item--active' : ''
                      }`}
                      role="menuitem"
                    >
                      <span className="mm-nav-dropdown-icon mm-nav-dropdown-icon--md">
                        <Icon size={16} strokeWidth={2} aria-hidden />
                      </span>
                      {label}
                    </Link>
                  );
                })}
              </NavDropdownPortal>
            </div>
          </nav>

          <div data-mm-desktop-cta className="flex shrink-0 items-center">
            <style>{`
              @keyframes nb-shimmer {
                0%   { transform: translateX(-100%) skewX(-15deg); }
                100% { transform: translateX(220%) skewX(-15deg); }
              }
              @keyframes nb-ring {
                0%,100% { box-shadow: 0 0 0 0 rgba(255,149,0,0.45), 0 4px 14px rgba(255,149,0,0.25); }
                50%      { box-shadow: 0 0 0 5px rgba(255,149,0,0), 0 4px 20px rgba(255,149,0,0.35); }
              }
              .nb-cta { animation: nb-ring 2s ease-in-out infinite; }
              .nb-cta:hover .nb-shine { animation: nb-shimmer 0.55s ease forwards; }
            `}</style>
            <Link
              to="/waitlist"
              className="inline-flex items-center justify-center rounded-lg border-2 border-cta font-semibold text-cta transition-all hover:bg-warning-bg active:scale-[0.98]"
            >
              Waitlist
            </Link>
            <button
              type="button"
              onClick={goToStartAssessment}
              data-mm-primary-cta
              className="nb-cta relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-cta font-semibold text-white shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all hover:bg-cta-hover active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta"
            >
              <span className="nb-shine pointer-events-none absolute inset-0 w-1/3 bg-white/25 blur-sm" style={{ transform: 'translateX(-100%) skewX(-15deg)' }} />
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
              </span>
              <span className="relative truncate leading-tight">
                <span data-mm-cta-short>Free check</span>
                <span data-mm-cta-full>{PRIMARY_CTA_LABEL}</span>
              </span>
            </button>
          </div>

          <button
            type="button"
            data-mm-mobile-nav-toggle
            onClick={() => setIsOpen(!isOpen)}
            className="shrink-0 p-2 text-muted-foreground transition-colors hover:text-primary"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mm-mobile-nav-drawer"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <MobileNavDrawer
          open={isOpen}
          onClose={() => setIsOpen(false)}
          anchorRef={headerRef}
          navItems={navItems}
          tools={TOOLS}
          moreLinks={MORE_LINKS}
          isActive={isActive}
        />
      </div>
    </header>
  );
};

export default Navbar;
