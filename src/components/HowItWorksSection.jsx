import React from 'react';
import { FileText, TrendingUp, Users, ArrowRight } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      step: 1,
      title: 'Upload Your Resume',
      description: 'AI analyzes your resume, experience, and skills to understand your current profile.',
      icon: FileText,
      badgeClass: 'bg-gradient-to-br from-cta to-cta-mid',
      bgColor: 'bg-warning-bg/60',
      borderColor: 'border-cta/25',
      iconColor: 'text-cta',
    },
    {
      step: 2,
      title: 'Discover Your Skill Gap',
      description: 'Compare your profile with real industry expectations and identify missing skills.',
      icon: TrendingUp,
      badgeClass: 'bg-gradient-to-br from-cyan-500 to-sky-600',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/25',
      iconColor: 'text-cyan-600',
    },
    {
      step: 3,
      title: 'Prepare with Mentors',
      description: 'Get a personalized roadmap and interview preparation guidance from industry mentors.',
      icon: Users,
      badgeClass: 'bg-gradient-to-br from-violet-500 to-purple-600',
      bgColor: 'bg-violet-500/10',
      borderColor: 'border-violet-500/25',
      iconColor: 'text-violet-600',
    },
  ];

  return (
    <section className="border-y border-border bg-secondary/30 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-black text-foreground md:text-5xl">How MentorMuni Works</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Follow a simple 3-step process to become interview ready and land your dream tech job.
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-16 -z-0 hidden h-0.5 bg-gradient-to-r from-cta via-cyan-500 to-violet-500 opacity-40 md:block" />

          {steps.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="relative z-10">
                <div
                  className={`rounded-xl border ${item.borderColor} ${item.bgColor} p-8 backdrop-blur-sm transition-all hover:border-opacity-60 hover:shadow-md`}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${item.badgeClass} text-xl font-black text-white shadow-sm`}
                    >
                      {item.step}
                    </div>
                  </div>

                  <div className={`mb-6 w-fit rounded-lg p-4 ${item.bgColor}`}>
                    <IconComponent className={item.iconColor} size={32} aria-hidden />
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{item.description}</p>

                  {index < steps.length - 1 && (
                    <div className="mt-6 flex justify-center md:hidden">
                      <ArrowRight size={24} className="rotate-90 text-muted-foreground" aria-hidden />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="mb-6 text-muted-foreground">Ready to start your journey?</p>
          <a
            href="#get-started"
            className="inline-block rounded-lg bg-gradient-to-r from-cta to-primary px-8 py-3 font-semibold text-white shadow-button transition-transform hover:scale-[1.02]"
          >
            Start Free Assessment
          </a>
        </div>
      </div>
    </section>
  );
}
