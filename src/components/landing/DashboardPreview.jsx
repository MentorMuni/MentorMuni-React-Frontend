import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const SKILLS = [
  { label: 'Coding Skills', value: 72, color: 'from-indigo-500 to-indigo-600' },
  { label: 'DSA Knowledge', value: 61, color: 'from-violet-500 to-violet-600' },
  { label: 'Communication', value: 54, color: 'from-purple-500 to-purple-600' },
  { label: 'Interview Confidence', value: 49, color: 'from-fuchsia-500 to-fuchsia-600' },
];

export default function DashboardPreview() {
  return (
    <section className="py-20 md:py-28 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 text-center mb-4">
          Your Interview Readiness Dashboard
        </h2>
        <p className="text-slate-600 text-center text-lg mb-12">
          See where you stand. Get motivated to improve.
        </p>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-8 md:p-12">
          <div className="space-y-6">
            {SKILLS.map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">{label}</span>
                  <span className="font-bold text-slate-900">{value}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-8 border-t border-slate-100">
            <p className="text-slate-500 text-sm">Overall</p>
            <p className="font-display text-3xl font-bold text-slate-900 mt-1">
              Placement Probability: <span className="text-primary">63%</span>
            </p>
            <Link
              to="/start-assessment"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
            >
              Get my score <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
