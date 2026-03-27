import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';

const MENTORS = [
  { name: 'Anita S.', role: 'Software Engineer', company: 'Amazon', exp: '8+ years', initial: 'A' },
  { name: 'Raj K.', role: 'Ex Google SDE', company: 'Google', exp: '10+ years', initial: 'R' },
  { name: 'Kavya M.', role: 'Senior Engineer', company: 'Microsoft', exp: '6+ years', initial: 'K' },
];

export default function MentorProfilesCards() {
  return (
    <section className="py-20 md:py-28 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 text-center mb-4">
          Learn from Industry Experts
        </h2>
        <p className="text-slate-600 text-center text-lg max-w-2xl mx-auto mb-16">
          1-on-1 mentorship from engineers at top tech companies
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {MENTORS.map((m) => (
            <div
              key={m.name}
              className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 hover:shadow-card transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-[#FFB347]/20 flex items-center justify-center text-primary font-bold text-xl">
                  {m.initial}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{m.name}</p>
                  <p className="text-slate-600 text-sm">{m.role} – {m.company}</p>
                  <p className="text-slate-500 text-xs mt-1">{m.exp} experience</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/mentors"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            <Users className="w-5 h-5" /> Explore mentors <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
