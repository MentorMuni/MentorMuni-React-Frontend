import React from 'react';

export default function TrustIndicators() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex gap-6 items-center">
          <img src="/public/logo-placeholder.png" alt="logo" className="h-8 opacity-80" />
          <div className="text-sm text-gray-600">Trusted by students and early-career engineers at top companies</div>
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          <div><strong className="text-indigo-600">12k+</strong> users</div>
          <div><strong className="text-indigo-600">4.6</strong> avg rating</div>
          <div><strong className="text-indigo-600">3k+</strong> hires</div>
        </div>
      </div>
    </section>
  );
}
