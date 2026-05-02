import React from 'react';
import { CheckCircle2, Zap } from 'lucide-react';

const FreeTrialBanner = () => {
  const benefits = [
    {
      icon: CheckCircle2,
      text: '3 Free Resume Analysis',
      description: 'Optimize before you apply',
    },
    {
      icon: CheckCircle2,
      text: '3 Free Interview Assessments',
      description: 'Practice with real-time feedback',
    },
    {
      icon: CheckCircle2,
      text: 'No Credit Card Required',
      description: 'Start immediately',
    },
  ];

  return (
    <section className="border-y border-border bg-gradient-to-r from-accent-soft/50 via-background to-secondary px-6 py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center justify-center gap-3">
          <Zap className="h-6 w-6 text-cta" aria-hidden />
          <h2 className="text-2xl font-black text-foreground md:text-3xl">Start for Free</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-[var(--shadow-card)] transition-all duration-300 hover:border-cta/35 hover:shadow-md"
              >
                <div className="mb-4">
                  <Icon className="h-10 w-10 text-emerald-600 transition-transform group-hover:scale-110" aria-hidden />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground md:text-xl">{benefit.text}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FreeTrialBanner;
