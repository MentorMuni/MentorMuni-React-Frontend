import React from 'react';
import { ArrowRight, Rocket, BookOpen, Video, TrendingUp, ScanSearch } from 'lucide-react';

const LearningPaths = () => {
  const pathsData = [
    {
      id: 1,
      icon: <Rocket size={40} className="text-[#FF9500]" />,
      title: 'Placement Track',
      description: 'Full structured program with mentorship. Master in-demand skills and get placement-ready.',
      href: '/placement-tracks',
      color: 'from-[#FF9500] to-[#E88600]',
      badge: 'Most Popular'
    },
    {
      id: 2,
      icon: <BookOpen size={40} className="text-cyan-400" />,
      title: 'Free Tutorials',
      description: 'Self-paced learning modules. Java, Python, SQL and more. Perfect for beginners.',
      href: '/free-tutorials',
      color: 'from-cyan-600 to-cyan-500',
      badge: 'For Beginners'
    },
    {
      id: 3,
      icon: <Video size={40} className="text-emerald-400" />,
      title: 'Mock Interviews',
      description: 'Practice with real-time evaluation. AI-powered feedback and live mentor sessions.',
      href: '/mock-interviews',
      color: 'from-emerald-600 to-emerald-500',
      badge: 'Premium'
    },
    {
      id: 4,
      icon: <TrendingUp size={40} className="text-[#FF9500]" />,
      title: 'Skill Gap Analyzer',
      description: 'AI-driven improvement insights. Identify your weaknesses and get personalized roadmaps.',
      href: '/skill-gap-analyzer',
      color: 'from-[#FFB347] to-purple-500',
      badge: 'AI Powered'
    },
    {
      id: 5,
      icon: <ScanSearch size={40} className="text-[#FF9500]" />,
      title: 'Resume Optimizer',
      description: 'Optimize your resume with AI-powered ATS scoring and keyword matching tailored to your target role.',
      href: '/resume-analyzer',
      color: 'from-rose-600 to-[#E88600]',
      badge: 'AI Powered'
    }
  ];

  return (
    <div className="min-h-screen mm-site-theme overflow-x-hidden text-foreground">
      <section className="mm-marketing-hero-backdrop border-b border-border">
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-16 pt-20 text-center md:pb-20">
          <h1 className="mb-4 text-5xl font-black text-foreground md:text-6xl">
            Learning Paths
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Choose your perfect learning journey. Whether you're a beginner or advancing your skills,
            we have the right path for you to become interview-ready.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        {/* Learning Paths Grid */}
        <div className="mb-20 grid gap-8 md:grid-cols-2">
          {pathsData.map((path) => (
            <a
              key={path.id}
              href={path.href}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${path.color} rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative rounded-3xl border border-border bg-card p-8 transition-all duration-300 hover:border-cta/30 hover:shadow-lg">
                {/* Badge */}
                <div className={`absolute top-6 right-6 bg-gradient-to-r ${path.color} text-white text-xs font-bold px-4 py-1 rounded-full`}>
                  {path.badge}
                </div>

                {/* Icon */}
                <div className="mb-6 w-fit rounded-2xl bg-accent-soft p-4 transition-colors group-hover:bg-accent-soft/80">
                  {path.icon}
                </div>

                {/* Content */}
                <h3 className="mb-3 text-2xl font-bold text-foreground transition-colors group-hover:text-cta">
                  {path.title}
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {path.description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 font-semibold text-cta transition-all group-hover:gap-3">
                  Get Started
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Why Choose Section */}
        <div className="mb-12 rounded-3xl border border-border bg-card p-12 shadow-[var(--shadow-card)]">
          <h2 className="text-3xl font-black mb-8 text-center text-foreground">Why Choose MentorMuni?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="mb-2 text-4xl font-black text-cta">AI-Powered</div>
              <p className="text-muted-foreground">Real-time AI feedback and personalized recommendations</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-cyan-600 mb-2">Expert Mentors</div>
              <p className="text-muted-foreground">1:1 guidance from industry professionals</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-violet-600 mb-2">Structured Learning</div>
              <p className="text-muted-foreground">Clear steps and milestones—so you always know what to learn next</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-black text-cta">Get Placement Ready</div>
              <p className="text-muted-foreground">Mocks, gap fixes, and reps aligned with what companies actually test</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-3xl bg-gradient-to-r from-cta to-cta-hover p-12 text-center shadow-lg shadow-button">
          <h2 className="mb-4 text-3xl font-bold text-white">Not sure where to start?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            Take our free interview readiness assessment to discover which learning path is perfect for your goals.
          </p>
          <button
            type="button"
            onClick={() => (window.location.href = '/start-assessment')}
            className="inline-flex items-center gap-2 rounded-xl bg-card px-8 py-4 font-bold text-cta shadow-md transition-all hover:shadow-lg"
          >
            Take Free Assessment
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningPaths;
