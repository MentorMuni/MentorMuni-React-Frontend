import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, BarChart2, Mic, FileSearch, Cpu } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { goToStartAssessment } from '../utils/startAssessmentNavigation';
import { PRIMARY_CTA_LABEL } from '../constants/brandCopy';

const TOOLS = [
  {
    icon: BarChart2,
    color: 'text-[#FF9500]',
    bg: 'bg-[#FFF4E0]',
    title: 'Interview Readiness Score',
    desc: 'Get your score across DSA, System Design & HR',
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
        <div className="h-20 flex items-center justify-between">

          <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
            <img
              src="/MentorMuni-React-Frontend/mentormuni-logo.png"
              alt="MentorMuni Logo"
              className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full object-contain group-hover:scale-105 transition-transform"
            />
            <span className="font-bold text-xl text-[#1A1A1A] hidden sm:inline">
              Mentor<span className="text-[#FF9500]">Muni</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  isActive(item.path, item.exact)
                    ? 'text-[#FF9500] bg-[#FFF4E0] border border-[#FFB347]/40'
                    : 'text-[#444444] hover:text-[#FF9500] hover:bg-[rgba(255,149,0,0.06)]'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div ref={toolsRef} className="relative">
              <button
                onClick={() => setToolsOpen(v => !v)}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  toolsOpen
                    ? 'text-[#FF9500] bg-[#FFF4E0] border border-[#FFB347]/40'
                    : 'text-[#444444] hover:text-[#FF9500] hover:bg-[rgba(255,149,0,0.06)]'
                }`}
              >
                Tools
                <ChevronDown size={14} className={`transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 rounded-xl border border-[#F0ECE0] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10)] overflow-hidden z-50">
                  <div className="p-2">
                    {TOOLS.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.href}
                          to={tool.href}
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-[#FFF8EE] transition-colors group"
                        >
                          <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tool.bg}`}>
                            <Icon size={15} className={tool.color} />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-[#1A1A1A] group-hover:text-[#FF9500] transition-colors">{tool.title}</span>
                            <span className="block text-xs text-[#666666] leading-snug mt-0.5">{tool.desc}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="border-t border-[#F0ECE0] px-4 py-2.5 bg-[#FFF8EE]">
                    <Link
                      to="/interview-readiness-tools"
                      onClick={() => setToolsOpen(false)}
                      className="text-xs font-semibold text-[#FF9500] hover:text-[#E88600] transition-colors"
                    >
                      Start with a free readiness check →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
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
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-[#FF9500] text-[#FF9500] hover:bg-[#FFF4E0] transition-all"
            >
              Join Waitlist
            </Link>
            <button
              type="button"
              onClick={goToStartAssessment}
              className="nb-cta relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF9500] hover:bg-[#E88600] text-white font-bold transition-all overflow-hidden shadow-[0_4px_14px_rgba(255,149,0,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF9500]"
            >
              <span className="nb-shine pointer-events-none absolute inset-0 w-1/3 bg-white/25 blur-sm" style={{ transform: 'translateX(-100%) skewX(-15deg)' }} />
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A8C55] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A8C55]" />
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

        {isOpen && (
          <div className="lg:hidden bg-[#FFF8EE] border-t border-[#F0ECE0] max-h-[calc(100vh-80px)] overflow-y-auto">
            <nav className="flex flex-col p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={`px-4 py-3 text-base font-semibold rounded-lg transition-all ${
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
                      <span className="text-sm font-semibold">{tool.title}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-[#F0ECE0] my-2"></div>

              <Link
                to="/waitlist"
                onClick={handleNavClick}
                className="px-4 py-3 text-base font-semibold rounded-lg border border-[#FF9500] text-[#FF9500] flex items-center justify-center w-full transition-all"
              >
                Join Waitlist
              </Link>
              <button
                type="button"
                onClick={() => {
                  handleNavClick();
                  goToStartAssessment();
                }}
                className="px-4 py-3 text-base font-bold rounded-lg bg-[#FF9500] hover:bg-[#E88600] text-white shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all flex items-center justify-center gap-2 w-full"
              >
                {PRIMARY_CTA_LABEL}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
