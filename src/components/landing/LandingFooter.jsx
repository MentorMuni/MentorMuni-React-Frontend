import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Interview Readiness Test', to: '/start-assessment' },
    { label: 'Mock Interviews', to: '/mock-interviews' },
    { label: 'Skill Gap Analyzer', to: '/skill-gap-analyzer' },
    { label: 'Resume Analyzer', to: '/resume-analyzer' },
  ],
  Learning: [
    { label: 'Learning Paths', to: '/learning-paths' },
    { label: 'Mentorship', to: '/mentorship' },
    { label: 'Pricing', to: '/pricing' },
  ],
  Company: [
    { label: 'For Students', to: '/for-students' },
    { label: 'For Colleges', to: '/for-colleges' },
    { label: 'Contact', to: '/contact' },
  ],
};

export default function LandingFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <p className="font-display font-bold text-white text-lg">MentorMuni</p>
            <p className="text-slate-400 text-sm mt-2">Crack your placement interviews with AI and mentors.</p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map(({ label, to }) => (
                  <li key={to}>
                    <Link to={to} className="text-slate-400 hover:text-white transition-colors text-sm">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} MentorMuni. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm">
            <a href="mailto:enroll@mentormuni.com" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <Mail className="w-4 h-4" /> enroll@mentormuni.com
            </a>
            <a href="tel:+919146421302" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <Phone className="w-4 h-4" /> +91 91464 21302
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
