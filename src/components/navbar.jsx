import React, { useState } from 'react';
import { Menu, X, ChevronDown, Rocket, Users, Zap } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import LearningPathsDropdown from './LearningPathsDropdown';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLearningPathsOpen, setIsLearningPathsOpen] = useState(false);
  const location = useLocation();

  // Check if user is authenticated (you can replace this with actual auth state)
  const isAuthenticated = localStorage.getItem('authToken') !== null;

  const isActive = (path) => location.pathname.startsWith(path);

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

  return (
    <header className="sticky top-0 z-[100] bg-gradient-to-r from-slate-900 to-slate-900/95 backdrop-blur-md border-b border-white/5 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center gap-3">
          <img src={logo} alt="MentorMuni Logo" className="h-8 w-auto" />
          <span className="font-bold text-xl text-white">MentorMuni</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {/* Home */}
          <Link 
            to="/" 
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
              isActive('/') && location.pathname === '/' 
                ? 'text-indigo-400 bg-indigo-400/10' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </Link>

          {/* Start Assessment - Primary CTA Button */}
          <Link 
            to="/start-assessment" 
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1 ${
              isActive('/start-assessment') || isActive('/readiness') || isActive('/interview-ready')
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 hover:bg-indigo-700'
                : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:shadow-lg hover:shadow-indigo-500/40 hover:from-indigo-700 hover:to-indigo-600'
            }`}
          >
            <Rocket size={16} />
            Start Assessment
          </Link>

          {/* Learning Paths - Our USP, prominent placement */}
          <LearningPathsDropdown 
            isActive={isActive('/learning-paths') || isActive('/placement-tracks') || isActive('/free-tutorials') || isActive('/mock-interviews') || isActive('/skill-gap-analyzer') || isActive('/resume-analyzer')}
            learningPathsItems={learningPathsItems}
            variant="usp"
          />

          {/* Success Stories */}
          <Link 
            to="/success-stories" 
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
              isActive('/success-stories') || isActive('/outcomes')
                ? 'text-indigo-400 bg-indigo-400/10' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Success Stories
          </Link>

          {/* Enroll / Pricing */}
          <Link 
            to="/upgrade" 
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
              isActive('/upgrade') || isActive('/pricing')
                ? 'text-emerald-400 bg-emerald-400/10' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Enroll
          </Link>

          {/* For Recruiters */}
          <Link 
            to="/for-recruiters" 
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
              isActive('/for-recruiters')
                ? 'text-blue-400 bg-blue-400/10' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            For Recruiters
          </Link>

          {/* Contact */}
          <Link 
            to="/contact" 
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
              isActive('/contact')
                ? 'text-indigo-400 bg-indigo-400/10' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Contact
          </Link>

          {/* Dashboard - Only show if authenticated */}
          {isAuthenticated && (
            <div className="relative group ml-2">
              <button 
                className="px-3 py-2 text-sm font-semibold rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 hover:border-emerald-500/50 transition-all flex items-center gap-1"
              >
                <Users size={15} />
                Dashboard
                <ChevronDown size={15} />
              </button>
              <div className="absolute right-0 mt-0 w-48 bg-slate-800/95 backdrop-blur border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 space-y-2">
                <Link to="/dashboard" className="block px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  My Dashboard
                </Link>
                <Link to="/profile" className="block px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  Profile
                </Link>
                <button className="block w-full text-left px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800/90 backdrop-blur border-t border-white/5 max-h-[calc(100vh-80px)] overflow-y-auto">
          <nav className="flex flex-col p-4 space-y-3">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-base font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Home
            </Link>

            <Link 
              to="/start-assessment" 
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-base font-bold rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Rocket size={18} />
              Start Assessment
            </Link>

            {/* Mobile Learning Paths Accordion */}
            <div className="border-t border-white/10 pt-3">
              <button 
                onClick={() => setIsLearningPathsOpen(!isLearningPathsOpen)}
                className="w-full text-left px-4 py-3 text-base font-semibold text-slate-300 hover:text-white bg-slate-800/40 hover:bg-white/5 rounded-lg transition-colors flex items-center justify-between"
              >
                Learning Paths
                <ChevronDown size={18} className={`transition-transform duration-300 ${isLearningPathsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Smooth Accordion Content */}
              {isLearningPathsOpen && (
                <div className="pl-2 space-y-2 mt-3 max-h-96 overflow-y-auto">
                  {learningPathsItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.href}
                      onClick={() => {
                        setIsOpen(false);
                        setIsLearningPathsOpen(false);
                      }}
                      className="block px-4 py-3 rounded-lg bg-slate-800/30 hover:bg-slate-700/50 border border-white/5 hover:border-indigo-500/30 transition-all active:scale-95"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg flex-shrink-0">{item.icon}</span>
                        <div className="flex-grow min-w-0">
                          <div className="font-semibold text-slate-300 group-hover:text-white text-sm">{item.title}</div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/success-stories" 
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-base font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Success Stories
            </Link>

            <Link 
              to="/upgrade" 
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-base font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Enroll
            </Link>

            <Link 
              to="/for-recruiters" 
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-base font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              For Recruiters
            </Link>

            <Link 
              to="/contact" 
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-base font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Contact
            </Link>

            {isAuthenticated && (
              <>
                <div className="border-t border-white/10 pt-3">
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 text-base font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-600/20 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Users size={18} />
                    My Dashboard
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;