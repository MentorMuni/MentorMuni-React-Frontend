import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-20 md:py-28 px-6 bg-gradient-to-br from-primary via-primary-light to-violet-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
          Check Your Interview Readiness in 5 Minutes
        </h2>
        <p className="text-indigo-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Free test. No signup required. Get your placement readiness score and a personalized improvement plan.
        </p>
        <Link
          to="/start-assessment"
          className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl bg-white text-primary font-bold text-lg shadow-card hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Take Free Test
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="mt-6 text-indigo-200 text-sm">Trusted by 5000+ engineering students</p>
      </div>
    </section>
  );
}
