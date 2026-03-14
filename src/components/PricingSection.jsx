import React from 'react';

const Plan = ({title, price, bullets}) => (
  <div className="p-6 rounded-lg shadow bg-white">
    <div className="text-lg font-semibold">{title}</div>
    <div className="mt-2 text-3xl font-bold">{price}</div>
    <ul className="mt-4 text-sm text-gray-600 space-y-1">
      {bullets.map((b,i) => <li key={i}>• {b}</li>)}
    </ul>
    <button className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded">Choose</button>
  </div>
);

export default function PricingSection(){
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold">Pricing</h3>
        <p className="text-gray-600 mt-2">Freemium diagnostic funnel — upgrade for mentorship and unlimited analysis.</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Plan title="Free" price="$0" bullets={["3 Resume Analyses", "3 Interview Checks", "Limited Roadmaps"]} />
          <Plan title="Premium" price="$19/mo" bullets={["Unlimited analyses", "Mentor sessions", "Mock interviews"]} />
        </div>
      </div>
    </section>
  );
}
