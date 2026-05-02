import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
import { PRIMARY_CTA_LABEL, READINESS_TEST_COUPON_BADGE } from '../constants/brandCopy';
import LimitedRewardLabel from './LimitedRewardLabel';

/** Secondary links — desktop dropdown to avoid a crowded top bar */
const MORE_LINKS = [
  { label: 'For colleges', path: '/colleges', exact: true, Icon: Building2 },
  { label: 'About us', path: '/about', exact: true, Icon: Info },
  { label: 'Contact us', path: '/contact', exact: true, Icon: Mail },
];

const TOOLS = [
  {
    icon: BarChart2,
    color: 'text-primary',
    bg: 'bg-accent-soft',
    title: 'Interview Readiness Score',
    desc: 'DSA, SD & HR score — finish the test for a coupon (1:1 mentorship + AI mock)',
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
  const [isOpen, setIsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const toolsRef = useRef(null);
  const moreRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setToolsOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setToolsOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: 'How It Works', path: '/how-it-works', exact: false },
    { label: 'How to Prepare', path: '/roadmap', exact: true, variant: 'roadmap' },
    { label: 'Mentors', path: '/mentors', exact: false },
    { label: 'Outcomes', path: '/outcomes', exact: false },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const handleHomeClick = () => {
    scrollToTop();
    setIsOpen(false);
  };

  const defaultNavDesktopClass = (active) =>
    `inline-flex h-10 max-w-full items-center whitespace-nowrap rounded-lg px-2 text-[0.8125rem] font-semibold leading-none transition-all lg:px-2.5 xl:px-3 xl:text-[0.875rem] ${
      active
        ? 'text-primary bg-accent-soft ring-1 ring-brand-teal/35'
        : 'text-ink hover:text-primary hover:bg-accent-faint'
    }`;

  const moreMenuActive = MORE_LINKS.some((l) => isActive(l.path, l.exact));

  const navLinkClass = (item) => {
    const active = isActive(item.path, item.exact);
    if (item.variant === 'roadmap') {
      return `inline-flex h-10 max-w-full items-center whitespace-nowrap rounded-lg px-2 text-[0.8125rem] leading-none transition-all lg:px-2.5 xl:px-3 xl:text-[0.875rem] ${
        active
          ? 'font-bold text-success-strong underline decoration-2 decoration-success-strong underline-offset-[5px]'
          : 'font-semibold text-ink hover:text-success-strong hover:underline hover:decoration-success-strong/70 hover:underline-offset-[5px]'
      }`;
    }
    return defaultNavDesktopClass(active);
  };

  const navLinkClassMobile = (item) => {
    const active = isActive(item.path, item.exact);
    if (item.variant === 'roadmap') {
      return `px-4 py-3.5 text-lg rounded-xl transition-all ${
        active
          ? 'font-bold text-success-strong underline decoration-2 decoration-success-strong underline-offset-[6px] bg-emerald-50/90 border border-success-strong/25'
          : 'font-semibold text-muted-foreground hover:text-success-strong hover:bg-emerald-50/50'
      }`;
    }
    return `px-4 py-3.5 text-lg font-semibold rounded-xl transition-all ${
      active
        ? 'text-primary bg-accent-soft border border-brand-teal/40'
        : 'text-muted-foreground hover:text-primary hover:bg-accent-faint'
    }`;
  };

  return (
    <header className="mm-sticky-header">
      <div className="mx-auto max-w-7xl pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8">
        <div className="flex h-[4.25rem] items-center gap-3 lg:h-[4.5rem] lg:gap-4">
          <Link to="/" onClick={handleHomeClick} className="group flex shrink-0 items-center gap-2.5 sm:gap-3">
            <img
              src={logoSrc}
              alt="MentorMuni Logo"
              className="h-11 w-11 shrink-0 rounded-full object-contain ring-2 ring-border transition-all group-hover:ring-brand-teal/50 sm:h-12 sm:w-12"
            />
            <span className="hidden text-xl font-extrabold tracking-tight text-foreground xl:inline xl:text-[1.4rem]">
              Mentor<span className="text-primary">Muni</span>
            </span>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex lg:gap-1 xl:gap-1.5">
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

            <div ref={toolsRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setToolsOpen(v => !v)}
                aria-expanded={toolsOpen}
                aria-haspopup="true"
                className={`inline-flex h-10 items-center gap-0.5 rounded-lg px-2 text-[0.8125rem] font-semibold transition-all lg:gap-1 lg:px-2.5 xl:px-3 xl:text-[0.875rem] ${
                  toolsOpen
                    ? 'text-primary bg-accent-soft ring-1 ring-[#2AAA8A]/35'
                    : 'text-ink hover:text-primary hover:bg-accent-faint'
                }`}
              >
                Tools
                <ChevronDown size={16} strokeWidth={2.25} className={`shrink-0 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-[19.5rem] rounded-xl border border-border bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10)] overflow-hidden z-50">
                  <div className="max-h-[min(70vh,26rem)] overflow-y-auto overscroll-contain p-2">
                    {TOOLS.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.href}
                          to={tool.href}
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-secondary transition-colors group"
                        >
                          <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tool.bg}`}>
                            <Icon size={17} className={tool.color} strokeWidth={2} />
                          </span>
                          <span>
                            <span className="block text-[0.9375rem] font-semibold text-foreground group-hover:text-primary transition-colors">{tool.title}</span>
                            <span className="block text-[13px] text-muted-foreground leading-snug mt-0.5">{tool.desc}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="border-t border-border px-4 py-3 bg-gradient-to-r from-sky-50/90 to-secondary">
                    <div className="mb-1.5 w-fit">
                      <LimitedRewardLabel className="text-[8px] px-2 py-0.5 [&_svg]:h-2.5 [&_svg]:w-2.5" />
                    </div>
                    <p className="text-[12px] text-muted-foreground leading-snug mb-2">{READINESS_TEST_COUPON_BADGE}</p>
                    <Link
                      to="/interview-readiness-tools"
                      onClick={() => setToolsOpen(false)}
                      className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                    >
                      Start with a free readiness check →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div ref={moreRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                aria-label="Colleges, about, and contact"
                className={`inline-flex h-10 max-w-full items-center gap-0.5 whitespace-nowrap rounded-lg px-2 text-[0.8125rem] font-semibold transition-all lg:gap-1 lg:px-2.5 xl:px-3 xl:text-[0.875rem] ${
                  moreOpen || moreMenuActive
                    ? 'text-primary bg-accent-soft ring-1 ring-[#2AAA8A]/35'
                    : 'text-ink hover:text-primary hover:bg-accent-faint'
                }`}
              >
                About/Contact
                <ChevronDown size={16} strokeWidth={2.25} className={`shrink-0 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-[min(calc(100vw-2rem),15.5rem)] rounded-xl border border-border bg-white py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.10)]">
                  {MORE_LINKS.map(({ label, path, exact, Icon }) => {
                    const active = isActive(path, exact);
                    return (
                      <Link
                        key={path}
                        to={path}
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 text-[0.9375rem] font-semibold transition-colors ${
                          active ? 'bg-accent-soft text-primary' : 'text-foreground hover:bg-secondary'
                        }`}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft">
                          <Icon size={16} className="text-[#15799F]" strokeWidth={2} />
                        </span>
                        {label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
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
              className="inline-flex h-11 min-w-[7.5rem] items-center justify-center rounded-xl border-2 border-cta px-4 text-[0.8125rem] font-semibold text-cta transition-all hover:bg-warning-bg active:scale-[0.98] xl:text-[0.875rem]"
            >
              Join Waitlist
            </Link>
            <button
              type="button"
              onClick={goToStartAssessment}
              className="nb-cta relative inline-flex h-11 max-w-[16.5rem] items-center justify-center gap-2 overflow-hidden rounded-xl bg-cta px-4 text-[0.8125rem] font-bold text-white shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all hover:bg-cta-hover active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta xl:max-w-none xl:px-5 xl:text-[0.875rem]"
            >
              <span className="nb-shine pointer-events-none absolute inset-0 w-1/3 bg-white/25 blur-sm" style={{ transform: 'translateX(-100%) skewX(-15deg)' }} />
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
              </span>
              <span className="relative max-w-[11rem] truncate text-left leading-tight sm:max-w-none">
                {PRIMARY_CTA_LABEL}
              </span>
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden border-t border-border bg-background"
          >
            <nav className="flex max-h-[calc(100vh-5.5rem)] flex-col space-y-2 overflow-y-auto p-4">
              {navItems.map((item) => {
                const linkActive = isActive(item.path, item.exact);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={navLinkClassMobile(item)}
                    aria-current={linkActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="border-t border-border my-2 pt-2">
                <p className="px-4 py-1 text-xs font-bold text-hint uppercase tracking-widest">Tools</p>
                {TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.href}
                      to={tool.href}
                      onClick={handleNavClick}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent-faint transition-all"
                    >
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tool.bg}`}>
                        <Icon size={13} className={tool.color} />
                      </span>
                      <span className="text-base font-semibold">{tool.title}</span>
                    </Link>
                  );
                })}
                <div className="mx-2 mt-2 rounded-xl border border-sky-200/60 bg-gradient-to-r from-sky-50 to-secondary px-3 py-3">
                  <div className="mb-1.5 w-fit">
                    <LimitedRewardLabel className="text-[8px] px-2 py-0.5 [&_svg]:h-2.5 [&_svg]:w-2.5" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug mb-2">{READINESS_TEST_COUPON_BADGE}</p>
                  <button
                    type="button"
                    onClick={() => {
                      handleNavClick();
                      goToStartAssessment();
                    }}
                    className="text-sm font-semibold text-primary hover:text-[#15799F] transition-colors"
                  >
                    Take the test →
                  </button>
                </div>
              </div>

              <div className="border-t border-border my-2 pt-2">
                <p className="px-4 py-1 text-xs font-bold text-hint uppercase tracking-widest">Company</p>
                {MORE_LINKS.map(({ label, path, exact, Icon }) => {
                  const active = isActive(path, exact);
                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={handleNavClick}
                      className={`flex items-center gap-3 px-4 py-3.5 text-lg font-semibold rounded-xl transition-all ${
                        active
                          ? 'text-primary bg-accent-soft border border-brand-teal/40'
                          : 'text-muted-foreground hover:text-primary hover:bg-accent-faint'
                      }`}
                    >
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-white/80' : 'bg-accent-soft'}`}>
                        <Icon size={18} className="text-[#15799F]" strokeWidth={2} />
                      </span>
                      {label}
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-border my-2"></div>

              <Link
                to="/waitlist"
                onClick={handleNavClick}
                className="px-4 py-3.5 text-lg font-semibold rounded-xl border-2 border-cta text-cta flex items-center justify-center w-full transition-all"
              >
                Join Waitlist
              </Link>
              <button
                type="button"
                onClick={() => {
                  handleNavClick();
                  goToStartAssessment();
                }}
                className="px-4 py-3.5 text-lg font-bold rounded-xl bg-cta hover:bg-cta-hover text-white shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all flex items-center justify-center gap-2 w-full"
              >
                {PRIMARY_CTA_LABEL}
              </button>
            </nav>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
