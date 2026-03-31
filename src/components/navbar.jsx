import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ChevronDown, BarChart2, Mic, FileSearch, Cpu } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { goToStartAssessment } from '../utils/startAssessmentNavigation';
import { PRIMARY_CTA_LABEL, READINESS_TEST_COUPON_BADGE } from '../constants/brandCopy';
import LimitedRewardLabel from './LimitedRewardLabel';

const TOOLS = [
  {
    icon: BarChart2,
    color: 'text-[#FF9500]',
    bg: 'bg-[#FFF4E0]',
    title: 'Interview Readiness Score',
    desc: 'DSA, SD & HR score — finish the test for a coupon (1:1 mentorship + AI mock)',
    href: '/interview-readiness-tools',
  },
  {
    icon: Mic,
    color: 'text-[#FF9500]',
    bg: 'bg-[#FFF4E0]',
    title: 'AI Mock Interviews',
    desc: 'Practice with real-time AI interviewer feedback',
    href: '/mock-interviews',
  },
  {
    icon: FileSearch,
    color: 'text-[#FF9500]',
    bg: 'bg-[#FFF4E0]',
    title: 'Resume ATS Checker',
    desc: 'See your ATS score and fix what gets you filtered',
    href: '/resume-analyzer',
  },
  {
    icon: Cpu,
    color: 'text-[#CC7000]',
    bg: 'bg-[#FFF4E0]',
    title: 'AI Tools Knowledge Base',
    desc: 'Learn GitHub Copilot, ChatGPT & Cursor for interviews',
    href: '/ai-tools',
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'How It Works', path: '/how-it-works', exact: false },
    { label: 'Mentors', path: '/mentors', exact: false },
    { label: 'Outcomes', path: '/outcomes', exact: false },
    { label: 'Leadership Board', path: '/leadership-board', exact: false },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const learningPathsItems = [
    {
      id: 1,
      icon: null,
      title: 'Placement Track',
      href: '/placement-tracks',
      description: 'Full structured program with mentorship'
    },
    {
      id: 2,
      icon: null,
      title: 'Free Tutorials',
      href: '/free-tutorials',
      description: 'Self-paced learning modules'
    },
    {
      id: 3,
      icon: null,
      title: 'Mock Interviews',
      href: '/mock-interviews',
      description: 'Practice with real-time evaluation'
    },
    {
      id: 4,
      icon: null,
      title: 'Skill Gap Analyzer',
      href: '/skill-gap-analyzer',
      description: 'AI-driven improvement insights'
    },
    {
      id: 5,
      icon: null,
      title: 'Resume Analyzer',
      href: '/resume-analyzer',
      description: 'Optimize your resume with ATS scoring'
    }
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-[100] border-b border-border bg-background/95 shadow-nav backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[5.25rem] lg:min-h-[5.5rem] flex items-center justify-between py-2">

          <Link to="/" className="flex-shrink-0 flex items-center gap-3 sm:gap-3.5 group">
            <img
              src="/MentorMuni-React-Frontend/mentormuni-logo.png"
              alt="MentorMuni Logo"
              className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full object-contain ring-2 ring-[#F0ECE0] group-hover:ring-[#FFB347]/50 group-hover:scale-[1.02] transition-all"
            />
            <span className="font-extrabold text-2xl sm:text-[1.65rem] tracking-tight text-[#1A1A1A] hidden sm:inline">
              Mentor<span className="text-[#FF9500]">Muni</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2.5 text-[0.9375rem] xl:text-base font-semibold rounded-xl transition-all ${
                  isActive(item.path, item.exact)
                    ? 'text-[#FF9500] bg-[#FFF4E0] border border-[#FFB347]/40'
                    : 'text-[#333333] hover:text-[#FF9500] hover:bg-[rgba(255,149,0,0.06)]'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div ref={toolsRef} className="relative">
              <button
                type="button"
                onClick={() => setToolsOpen(v => !v)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-[0.9375rem] xl:text-base font-semibold rounded-xl transition-all ${
                  toolsOpen
                    ? 'text-[#FF9500] bg-[#FFF4E0] border border-[#FFB347]/40'
                    : 'text-[#333333] hover:text-[#FF9500] hover:bg-[rgba(255,149,0,0.06)]'
                }`}
              >
                Tools
                <ChevronDown size={18} strokeWidth={2.25} className={`shrink-0 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-[19rem] rounded-xl border border-[#F0ECE0] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10)] overflow-hidden z-50">
                  <div className="p-2">
                    {TOOLS.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.href}
                          to={tool.href}
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-[#FFF8EE] transition-colors group"
                        >
                          <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tool.bg}`}>
                            <Icon size={17} className={tool.color} strokeWidth={2} />
                          </span>
                          <span>
                            <span className="block text-[0.9375rem] font-semibold text-[#1A1A1A] group-hover:text-[#FF9500] transition-colors">{tool.title}</span>
                            <span className="block text-[13px] text-[#666666] leading-snug mt-0.5">{tool.desc}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="border-t border-[#F0ECE0] px-4 py-3 bg-gradient-to-r from-amber-50/90 to-[#FFF8EE]">
                    <div className="mb-1.5 w-fit">
                      <LimitedRewardLabel className="text-[8px] px-2 py-0.5 [&_svg]:h-2.5 [&_svg]:w-2.5" />
                    </div>
                    <p className="text-[12px] text-[#444444] leading-snug mb-2">{READINESS_TEST_COUPON_BADGE}</p>
                    <Link
                      to="/interview-readiness-tools"
                      onClick={() => setToolsOpen(false)}
                      className="text-sm font-semibold text-[#FF9500] hover:text-[#E88600] transition-colors"
                    >
                      Start with a free readiness check →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
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
              className="px-5 py-2.5 text-[0.9375rem] xl:text-base font-semibold rounded-xl border-2 border-[#FF9500] text-[#FF9500] hover:bg-[#FFF4E0] transition-all"
            >
              Join Waitlist
            </Link>
            <button
              type="button"
              onClick={goToStartAssessment}
              className="nb-cta relative inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#FF9500] hover:bg-[#E88600] text-white text-[0.9375rem] xl:text-base font-bold transition-all overflow-hidden shadow-[0_4px_14px_rgba(255,149,0,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF9500]"
            >
              <span className="nb-shine pointer-events-none absolute inset-0 w-1/3 bg-white/25 blur-sm" style={{ transform: 'translateX(-100%) skewX(-15deg)' }} />
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A8C55] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1A8C55]" />
              </span>
              {PRIMARY_CTA_LABEL}
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-[#444444] hover:text-[#FF9500] transition-colors"
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
            className="lg:hidden border-t border-[#F0ECE0] bg-[#FFF8EE]"
          >
            <nav className="flex max-h-[calc(100vh-5.5rem)] flex-col space-y-2 overflow-y-auto p-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={`px-4 py-3.5 text-lg font-semibold rounded-xl transition-all ${
                    isActive(item.path, item.exact)
                      ? 'text-[#FF9500] bg-[#FFF4E0] border border-[#FFB347]/40'
                      : 'text-[#444444] hover:text-[#FF9500] hover:bg-[rgba(255,149,0,0.06)]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-[#F0ECE0] my-2 pt-2">
                <p className="px-4 py-1 text-xs font-bold text-[#888888] uppercase tracking-widest">Tools</p>
                {TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.href}
                      to={tool.href}
                      onClick={handleNavClick}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#444444] hover:text-[#FF9500] hover:bg-[rgba(255,149,0,0.06)] transition-all"
                    >
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tool.bg}`}>
                        <Icon size={13} className={tool.color} />
                      </span>
                      <span className="text-base font-semibold">{tool.title}</span>
                    </Link>
                  );
                })}
                <div className="mx-2 mt-2 rounded-xl border border-orange-200/60 bg-gradient-to-r from-amber-50 to-[#FFF8EE] px-3 py-3">
                  <div className="mb-1.5 w-fit">
                    <LimitedRewardLabel className="text-[8px] px-2 py-0.5 [&_svg]:h-2.5 [&_svg]:w-2.5" />
                  </div>
                  <p className="text-xs text-[#444444] leading-snug mb-2">{READINESS_TEST_COUPON_BADGE}</p>
                  <button
                    type="button"
                    onClick={() => {
                      handleNavClick();
                      goToStartAssessment();
                    }}
                    className="text-sm font-semibold text-[#FF9500] hover:text-[#E88600] transition-colors"
                  >
                    Take the test →
                  </button>
                </div>
              </div>

              <div className="border-t border-[#F0ECE0] my-2"></div>

              <Link
                to="/waitlist"
                onClick={handleNavClick}
                className="px-4 py-3.5 text-lg font-semibold rounded-xl border-2 border-[#FF9500] text-[#FF9500] flex items-center justify-center w-full transition-all"
              >
                Join Waitlist
              </Link>
              <button
                type="button"
                onClick={() => {
                  handleNavClick();
                  goToStartAssessment();
                }}
                className="px-4 py-3.5 text-lg font-bold rounded-xl bg-[#FF9500] hover:bg-[#E88600] text-white shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all flex items-center justify-center gap-2 w-full"
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
