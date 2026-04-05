import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const Plan = ({ title, price, bullets, cta, href, primary }) => (
  <div className="card-dark rounded-xl p-6 md:p-8 flex flex-col">
    <div className="text-lg font-bold text-white">{title}</div>
    <div className="mt-2 text-3xl font-black text-white">{price}</div>
    <ul className="mt-4 text-sm text-muted-foreground space-y-2 flex-grow">
      {bullets.map((b, i) => (
        <li key={i} className="flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          {b}
        </li>
      ))}
    </ul>
    <Link
      to={href}
      className={`mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all ${
        primary
          ? 'bg-[#FF9500] hover:bg-[#E88600] text-white'
          : 'border border-slate-500 text-slate-300 hover:border-slate-400 hover:text-white'
      }`}
    >
      {cta}
      <ArrowRight className="w-4 h-4" />
    </Link>
  </div>
);

export default function PricingSection() {
  return (
    <section className="py-16 md:py-20 px-6 section-dark border-t border-slate-800/60">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-on-dark">Pricing</h2>
          <p className="mt-2 text-on-dark-sub max-w-xl mx-auto">
            Freemium diagnostic funnel — upgrade for mentorship and unlimited analysis.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          <Plan
            title="Free"
            price="$0"
            bullets={['3 Resume Analyses', '3 Interview Readiness checks', 'Limited roadmaps']}
            cta="Get started free"
            href="/start-assessment"
            primary={true}
          />
          <Plan
            title="Premium"
            price="$19/mo"
            bullets={['Unlimited analyses', 'Mentor sessions', 'Mock interviews']}
            cta="View plans"
            href="/upgrade"
            primary={false}
          />
        </div>
      </div>
    </section>
  );
}
