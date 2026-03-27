import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/logo.png';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'How it works', path: '/#how-it-works' },
  { label: 'For Students', path: '/for-students' },
  { label: 'For Colleges', path: '/for-colleges' },
  { label: 'Pricing', path: '/pricing' },
];

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="MentorMuni" className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full object-contain" />
            <span className="font-display font-bold text-lg text-slate-900">MentorMuni</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === path || (path === '/' && location.pathname === '/')
                    ? 'text-primary bg-primary/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              to="/start-assessment"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-soft hover:shadow-card transition-all"
            >
              Take Free Test
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-slate-700 font-medium rounded-lg hover:bg-slate-100"
                >
                  {label}
                </Link>
              ))}
              <Link
                to="/start-assessment"
                onClick={() => setOpen(false)}
                className="mx-4 mt-2 py-3 rounded-xl bg-primary text-white font-bold text-center"
              >
                Take Free Test
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
