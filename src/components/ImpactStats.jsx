import React from 'react';
import { Users, Target, Zap } from 'lucide-react';

const ImpactStats = () => {
  const stats = [
    {
      number: '200+',
      label: 'Students Mentored',
      description: 'Active learners preparing for tech careers',
      icon: Users,
      bgColor: 'bg-cta/10',
      borderColor: 'border-cta/25',
      iconColor: 'text-cta',
    },
    {
      number: '85%',
      label: 'Got Interview Calls',
      description: 'After completing our interview readiness program',
      icon: Target,
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/25',
      iconColor: 'text-cyan-700',
    },
    {
      number: '50+',
      label: 'Companies Cracked',
      description: 'Tech companies our students joined',
      icon: Zap,
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/25',
      iconColor: 'text-emerald-700',
    },
  ];

  return (
    <section className="border-y border-border bg-gradient-to-b from-accent-soft/35 via-background to-secondary/40 px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-black text-foreground md:text-4xl">Trusted by Students Preparing for Tech Careers</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Real outcomes from real students using MentorMuni to ace their tech interviews
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`rounded-2xl border bg-card p-10 text-center shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-md ${stat.borderColor} ${stat.bgColor}`}
              >
                <div className="mb-6 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-secondary/90">
                    <Icon className={`h-7 w-7 ${stat.iconColor}`} aria-hidden />
                  </div>
                </div>

                <div className={`mb-2 text-5xl font-black md:text-6xl ${stat.iconColor}`}>{stat.number}</div>

                <h3 className="mb-2 text-xl font-bold text-foreground">{stat.label}</h3>

                <p className="text-sm leading-relaxed text-muted-foreground">{stat.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 text-center">
          <p className="text-sm text-muted-foreground">
            These numbers are growing every day. <span className="font-semibold text-warning-text">You could be next.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
