import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Users, Mic, MessageSquare, ArrowRight } from 'lucide-react';
import LandingFooter from './landing/LandingFooter';

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Placement analytics dashboard',
    description: 'Track college-wide readiness scores and placement trends.',
  },
  {
    icon: Users,
    title: 'Student progress tracking',
    description: 'Monitor each student’s improvement and engagement.',
  },
  {
    icon: Mic,
    title: 'Bulk mock interviews',
    description: 'Enable AI mock interviews for entire batches.',
  },
  {
    icon: MessageSquare,
    title: 'Mentor sessions',
    description: 'Connect students with industry mentors at scale.',
  },
];

export default function ForCollegesPage() {
  return (
    <div className="min-h-screen bg-surface font-sans">
      <section className="relative py-20 md:py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8EE]/80 via-white to-[#FFFDF8]/60 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
            Improve Your College Placement Rate
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            AI interview platform for engineering students. Give your students the edge they need to crack placements.
          </p>
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-lg shadow-soft hover:shadow-card transition-all"
          >
            Book Demo
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 text-center mb-12">
            Features for TPOs
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex gap-4 p-6 rounded-2xl border border-slate-200 bg-white shadow-soft hover:shadow-card transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                  <p className="text-slate-600 text-sm mt-1">{description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
            >
              Book Demo for your college <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
