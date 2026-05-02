import React from 'react';
import { Briefcase } from 'lucide-react';

const MentorSection = () => {
  const mentors = [
    {
      id: 1,
      name: 'Amit Verma',
      role: 'Senior Software Engineer',
      experience: 'Ex-Amazon, Ex-Flipkart',
      expertise: 'Backend, System Design',
      avatar: 'AV',
      bgGradient: 'from-blue-600 to-[#E88600]',
      borderColor: 'border-blue-500/25',
    },
    {
      id: 2,
      name: 'Neha Gupta',
      role: 'QA Automation Lead',
      experience: 'Ex-Microsoft, Ex-Adobe',
      expertise: 'Testing, Automation',
      avatar: 'NG',
      bgGradient: 'from-purple-600 to-pink-700',
      borderColor: 'border-purple-500/25',
    },
    {
      id: 3,
      name: 'Deepak Sharma',
      role: 'Product Manager',
      experience: 'Ex-Google, Current Startup CTO',
      expertise: 'Product, Growth, Leadership',
      avatar: 'DS',
      bgGradient: 'from-emerald-600 to-teal-700',
      borderColor: 'border-emerald-500/25',
    },
    {
      id: 4,
      name: 'Sophia Das',
      role: 'Data Scientist',
      experience: 'Ex-Netflix, ML Engineer',
      expertise: 'Machine Learning, Data',
      avatar: 'SD',
      bgGradient: 'from-orange-600 to-amber-700',
      borderColor: 'border-orange-500/25',
    },
    {
      id: 5,
      name: 'Rahul Iyer',
      role: 'DevOps & Cloud Architect',
      experience: 'Ex-AWS, Ex-IBM',
      expertise: 'AWS, Docker, Kubernetes',
      avatar: 'RI',
      bgGradient: 'from-cyan-600 to-blue-700',
      borderColor: 'border-cyan-500/25',
    },
    {
      id: 6,
      name: 'Anjali Verma',
      role: 'Frontend Engineer',
      experience: 'Ex-Stripe, Ex-Uber',
      expertise: 'React, Web, Performance',
      avatar: 'AV',
      bgGradient: 'from-pink-600 to-rose-700',
      borderColor: 'border-pink-500/25',
    },
  ];

  return (
    <section className="border-y border-border bg-gradient-to-b from-accent-soft/35 via-background to-secondary/40 px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-black text-foreground md:text-4xl">Learn from Industry Mentors</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Get guidance from experienced engineers and tech leaders who have cracked top tech companies
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className={`flex flex-col items-center rounded-2xl border bg-card p-8 text-center shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-md ${mentor.borderColor}`}
            >
              <div
                className={`mb-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${mentor.bgGradient} text-lg font-black text-white shadow-lg transition-transform group-hover:scale-110 md:h-20 md:w-20 md:text-xl`}
              >
                {mentor.avatar}
              </div>

              <h3 className="mb-1 text-lg font-bold text-foreground md:text-xl">{mentor.name}</h3>

              <div className="mb-3 flex items-center justify-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" aria-hidden />
                <p className="text-sm font-semibold text-muted-foreground">{mentor.role}</p>
              </div>

              <p className="mb-4 rounded-full border border-cta/25 bg-warning-bg px-3 py-2 text-xs font-semibold text-warning-text">
                {mentor.experience}
              </p>

              <p className="mb-4 flex-grow text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Expertise:</span> {mentor.expertise}
              </p>

              <div className="w-full border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">Learn from this mentor</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="mb-6 text-sm text-muted-foreground">
            All mentors are available to guide you through your preparation journey
          </p>
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-cta/35 bg-warning-bg/80 px-6 py-3">
            <span className="text-sm font-semibold text-warning-text">Access mentor guidance → Upgrade to Pro</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentorSection;
