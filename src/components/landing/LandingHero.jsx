import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mic, BarChart3, Users } from 'lucide-react';
import { PRIMARY_CTA_LABEL, PRODUCT_READINESS_SCORE } from '../../constants/brandCopy';

export default function LandingHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-surface">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8EE]/80 via-white to-[#FFFDF8]/60 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-0 right-0 w-[40%] max-w-xl h-96 bg-gradient-to-l from-[#FF9500]/15 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-[30%] max-w-sm h-72 bg-[#FFB347]/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Crack Your Placement Interviews in 30 Days
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0">
              AI Mock Interviews · Industry Mentors · {PRODUCT_READINESS_SCORE}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/start-assessment"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-lg shadow-soft hover:shadow-card transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {PRIMARY_CTA_LABEL}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/start-assessment"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-slate-300 text-slate-700 hover:border-primary hover:text-primary font-semibold transition-all"
              >
                See My Placement Probability
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-slate-500 text-sm">
              <span className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-primary" /> AI Mock Interviews
              </span>
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" /> Readiness Score
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> 1-on-1 Mentors
              </span>
            </div>
            <p className="mt-8 text-slate-500 text-sm">
              Trusted by Engineering Students Preparing for Placements
            </p>
          </div>
          <div className="hidden lg:block relative">
            <div className="aspect-square max-w-md mx-auto rounded-3xl bg-white shadow-card border border-slate-100 overflow-hidden">
              <div className="p-8 h-full flex flex-col justify-center bg-gradient-to-br from-[#FFF8EE] to-[#FFFDF8]">
                <p className="text-slate-500 text-sm font-medium">Your Readiness Dashboard</p>
                <p className="text-2xl font-display font-bold text-slate-900 mt-2">Placement Probability: 63%</p>
                <div className="mt-6 space-y-4">
                  {['Coding Skills', 'DSA Knowledge', 'Communication', 'Interview Confidence'].map((label, i) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">{label}</span>
                        <span className="font-semibold text-slate-900">{[72, 61, 54, 49][i]}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-[#FFB347] rounded-full transition-all duration-700"
                          style={{ width: `${[72, 61, 54, 49][i]}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/start-assessment"
                  className="mt-8 inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors"
                >
                  Improve my score <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
