import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, BarChart2, Mic, FileSearch, Cpu } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { goToStartAssessment } from '../utils/startAssessmentNavigation';

const TOOLS = [
  {
    icon: BarChart2,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    title: 'Interview Readiness Score',
    desc: 'Get your score across DSA, System Design & HR',
    href: '/interview-readiness-tools',
  },
  {
    icon: Mic,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    title: 'AI Mock Interviews',
    desc: 'Practice with real-time AI interviewer feedback',
    href: '/mock-interviews',
  },
  {
    icon: FileSearch,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    title: 'Resume ATS Checker',
    desc: 'See your ATS score and fix what gets you filtered',
    href: '/resume-analyzer',
  },
  {
    icon: Cpu,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
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

  // Check if a nav item is active
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

  // Close mobile menu when a link is clicked
  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-[100] bg-[#050b18]/95 backdrop-blur-md border-b border-indigo-500/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
            <img
              src="/MentorMuni-React-Frontend/mentormuni-logo.png"
              alt="MentorMuni Logo"
              className="h-9 w-9 rounded-full object-cover group-hover:scale-110 transition-transform"
              style={{ mixBlendMode: 'screen' }}
            />
            <span className="font-bold text-xl text-white hidden sm:inline">MentorMuni</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  isActive(item.path, item.exact)
                    ? 'text-indigo-300 bg-indigo-500/15 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Tools dropdown */}
            <div ref={toolsRef} className="relative">
              <button
                onClick={() => setToolsOpen(v => !v)}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  toolsOpen ? 'text-indigo-300 bg-indigo-500/15 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Tools
                <ChevronDown size={14} className={`transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 rounded-xl border border-indigo-500/20 bg-[#0b1120]/98 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                  <div className="p-2">
                    {TOOLS.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.href}
                          to={tool.href}
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group"
                        >
                          <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tool.bg}`}>
                            <Icon size={15} className={tool.color} />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">{tool.title}</span>
                            <span className="block text-xs text-slate-500 leading-snug mt-0.5">{tool.desc}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="border-t border-white/5 px-4 py-2.5 bg-indigo-500/5">
                    <Link
                      to="/interview-readiness-tools"
                      onClick={() => setToolsOpen(false)}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Start with a free readiness check →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Waitlist + primary CTA (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            <style>{`
              @keyframes nb-shimmer {
                0%   { transform: translateX(-100%) skewX(-15deg); }
                100% { transform: translateX(220%) skewX(-15deg); }
              }
              @keyframes nb-ring {
                0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.55), 0 4px 14px rgba(99,102,241,0.35); }
                50%      { box-shadow: 0 0 0 5px rgba(99,102,241,0), 0 4px 20px rgba(99,102,241,0.55); }
              }
              .nb-cta { animation: nb-ring 2s ease-in-out infinite; }
              .nb-cta:hover .nb-shine { animation: nb-shimmer 0.55s ease forwards; }
            `}</style>
            <Link
              to="/waitlist"
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-indigo-500/40 text-indigo-400 hover:text-indigo-300 hover:border-indigo-400/60 hover:bg-indigo-500/10 transition-all"
            >
              Join Waitlist
            </Link>
            <button
              type="button"
              onClick={goToStartAssessment}
              className="nb-cta relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {/* shimmer sweep on hover */}
              <span className="nb-shine pointer-events-none absolute inset-0 w-1/3 bg-white/20 blur-sm" style={{ transform: 'translateX(-100%) skewX(-15deg)' }} />
              {/* pulsing dot */}
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              Check My Interview Readiness
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full font-semibold">Free</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-slate-800/95 backdrop-blur border-t border-indigo-500/10 max-h-[calc(100vh-80px)] overflow-y-auto">
            <nav className="flex flex-col p-4 space-y-2">
              {/* Mobile Navigation Items */}
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={`px-4 py-3 text-base font-semibold rounded-lg transition-all ${
                    isActive(item.path, item.exact)
                      ? 'text-indigo-300 bg-indigo-500/15 border border-indigo-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Tools section */}
              <div className="border-t border-slate-700 my-2 pt-2">
                <p className="px-4 py-1 text-xs font-bold text-slate-500 uppercase tracking-widest">Tools</p>
                {TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.href}
                      to={tool.href}
                      onClick={handleNavClick}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tool.bg}`}>
                        <Icon size={13} className={tool.color} />
                      </span>
                      <span className="text-sm font-semibold">{tool.title}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="border-t border-slate-700 my-2"></div>

              {/* Mobile CTA Buttons */}
              <Link
                to="/waitlist"
                onClick={handleNavClick}
                className="px-4 py-3 text-base font-semibold rounded-lg border border-indigo-500/40 text-indigo-400 flex items-center justify-center w-full transition-all"
              >
                Join Waitlist
              </Link>
              <button
                type="button"
                onClick={() => {
                  handleNavClick();
                  goToStartAssessment();
                }}
                className="px-4 py-3 text-base font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all flex items-center justify-center gap-2 w-full"
              >
                Check My Interview Readiness — Free
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;