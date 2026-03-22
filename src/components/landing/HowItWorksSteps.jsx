import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, BarChart3, Mic, Users, Trophy, ArrowRight } from 'lucide-react';

const STEPS = [
  { icon: ClipboardCheck, title: 'Take Interview Readiness Test', href: '/start-assessment' },
  { icon: BarChart3, title: 'Get Placement Readiness Score' },
  { icon: Mic, title: 'Practice AI Mock Interviews', href: '/mock-interviews' },
  { icon: Users, title: 'Get Mentorship from Industry Experts', href: '/mentors' },
  { icon: Trophy, title: 'Crack Placement Interviews' },
];

export default function HowItWorksSteps() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 px-6 bg-surface scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 text-center mb-4">
          How it works
        </h2>
        <p className="text-slate-600 text-center text-lg max-w-2xl mx-auto mb-16">
          Five simple steps from assessment to placement
        </p>

        <div className="relative">
          {/* Connecting line - visible on desktop */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-200 via-violet-200 to-indigo-200" style={{ top: '3rem' }} />

          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-5 md:gap-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const content = (
                <div className="relative flex flex-col items-center text-center md:pt-0">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-soft flex items-center justify-center text-primary mx-auto mb-4 hover:shadow-card hover:border-primary/30 transition-all">
                    <Icon className="w-8 h-8" />
                  </div>
                  <p className="font-semibold text-slate-900 text-sm md:text-base">
                    Step {index + 1}
                  </p>
                  <p className="text-slate-600 text-sm mt-1">
                    {step.title}
                  </p>
                  {step.href && (
                    <Link
                      to={step.href}
                      className="mt-3 inline-flex items-center gap-1 text-primary text-sm font-semibold hover:underline"
                    >
                      Start <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              );
              return step.href ? <Link key={index} to={step.href} className="block">{content}</Link> : <div key={index}>{content}</div>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
