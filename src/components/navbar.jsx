import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'How It Works', path: '/how-it-works', exact: false },
    { label: 'Mentors', path: '/mentorship', exact: false },
    { label: 'Success Stories', path: '/success-stories', exact: false },
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
    <header className="sticky top-0 z-[100] bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900/95 backdrop-blur-md border-b border-indigo-500/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
            <img src={logo} alt="MentorMuni Logo" className="h-8 w-auto group-hover:scale-110 transition-transform" />
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
          </nav>

          {/* Pricing ghost + primary CTA (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/pricing"
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-white/15 text-slate-300 hover:text-white hover:border-white/30 transition-all"
            >
              Pricing
            </Link>
            <Link
              to="/start-assessment"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Check My Score
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full font-semibold">Free</span>
            </Link>
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

              {/* Divider */}
              <div className="border-t border-slate-700 my-2"></div>

              {/* Mobile CTA Button */}
              <Link
                to="/start-assessment"
                onClick={handleNavClick}
                className="px-4 py-3 text-base font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all flex items-center justify-center gap-2 w-full"
              >
                Check My Score — Free
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;