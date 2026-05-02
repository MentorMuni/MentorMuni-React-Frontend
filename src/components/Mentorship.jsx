import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, TrendingUp, Award, ArrowRight } from 'lucide-react';

const Mentorship = () => {
  const features = [
    {
      id: 1,
      title: '1:1 Mentor Guidance',
      description: 'Get personalized guidance from experienced engineers who have cracked top tech companies.',
      icon: Users,
      color: 'indigo',
    },
    {
      id: 2,
      title: 'Career Roadmap',
      description: 'Create a structured learning plan tailored to your target role, timeline, and career goals.',
      icon: Target,
      color: 'cyan',
    },
    {
      id: 3,
      title: 'Interview Preparation',
      description: 'Intensive interview prep with mock interviews, real-time feedback, and personalized improvement plans.',
      icon: TrendingUp,
      color: 'purple',
    },
    {
      id: 4,
      title: 'Job Placement Support',
      description: 'Get support with application strategy, negotiation tips, and placement into top tech companies.',
      icon: Award,
      color: 'emerald',
    },
  ];

  return (
    <div className="min-h-screen mm-site-theme overflow-x-hidden text-foreground pb-20 pt-20">
      <section className="mm-marketing-hero-backdrop border-b border-border">
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-14 pt-6 text-center md:pb-16">
          <h1 className="mb-4 text-4xl font-black text-foreground md:text-5xl">Learn from Industry Mentors</h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
            Get guidance from experienced engineers and tech leaders who have successfully navigated tech careers
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pt-14">
        <div className="mb-14 grid gap-8 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            const colorMap = {
              indigo: { bg: 'bg-cta/10', border: 'border-cta/25', icon: 'text-cta' },
              cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/25', icon: 'text-cyan-600' },
              purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/25', icon: 'text-purple-600' },
              emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', icon: 'text-emerald-600' },
            };
            const colors = colorMap[feature.color];

            return (
              <div
                key={feature.id}
                className={`rounded-2xl border bg-card p-8 shadow-[var(--shadow-card)] transition-all hover:border-opacity-80 ${colors.border} ${colors.bg}`}
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${colors.bg}`}>
                  <Icon className={`h-6 w-6 ${colors.icon}`} aria-hidden />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-border bg-gradient-to-br from-accent-soft/60 via-background to-secondary p-10 text-center shadow-[var(--shadow-card)] md:p-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">Ready to Get a Mentor?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            Start with our free tools to identify your gaps, then upgrade to access experienced mentors who will guide you to success.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/learning-paths"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cta to-primary px-8 py-4 font-bold text-white shadow-button transition-all hover:scale-[1.02] hover:shadow-lg"
            >
              Explore Mentorship Programs
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <Link
              to="/start-assessment"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-cta/45 px-8 py-4 font-bold text-cta transition-all hover:border-cta hover:bg-accent-soft/80"
            >
              Start Free Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentorship;
