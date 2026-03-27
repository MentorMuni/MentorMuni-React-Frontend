import React from 'react';

export default function FreeUsageCTA(){
  return (
    <section className="py-10 bg-[#FF9500] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-2xl font-bold">Try the diagnostic — free</h3>
        <p className="mt-2">3 Resume Analyses • 3 Interview Checks • No credit card required</p>
        <div className="mt-4">
          <button className="px-6 py-3 bg-white text-[#FF9500] rounded">Start free diagnostic</button>
        </div>
      </div>
    </section>
  );
}
