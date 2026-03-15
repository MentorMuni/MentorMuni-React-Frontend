import React from 'react';

const COMPANIES = ['Amazon', 'TCS', 'Infosys', 'Accenture', 'Deloitte', 'Wipro', 'Cognizant', 'HCL'];

export default function TrustSection() {
  return (
    <section className="py-12 md:py-16 px-6 bg-white border-y border-slate-100">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-slate-500 text-sm font-medium mb-8">
          5000+ students preparing for placements
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {COMPANIES.map((name) => (
            <div
              key={name}
              className="text-slate-400 font-semibold text-lg md:text-xl hover:text-slate-600 transition-colors"
            >
              {name}
            </div>
          ))}
        </div>
        <p className="text-center text-slate-400 text-xs mt-6">
          Companies where our students have been placed
        </p>
      </div>
    </section>
  );
}
