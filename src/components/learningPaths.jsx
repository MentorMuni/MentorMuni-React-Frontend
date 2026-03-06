import React from 'react';
import { ArrowRight, Rocket, BookOpen, Video, TrendingUp, ScanSearch } from 'lucide-react';

const LearningPaths = () => {
  const pathsData = [
    {
      id: 1,
      icon: <Rocket size={40} className="text-indigo-400" />,
      title: 'Placement Track',
      description: 'Full structured program with mentorship. Master in-demand skills and get placement-ready.',
      href: '/placement-tracks',
      color: 'from-indigo-600 to-indigo-500',
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
      icon: <TrendingUp size={40} className="text-violet-400" />,
      title: 'Skill Gap Analyzer',
      description: 'AI-driven improvement insights. Identify your weaknesses and get personalized roadmaps.',
      href: '/skill-gap-analyzer',
      color: 'from-violet-600 to-purple-500',
      badge: 'AI Powered'
    },
    {
      id: 5,
      icon: <ScanSearch size={40} className="text-indigo-600" />,
      title: 'Resume Optimizer',
      description: 'Optimize your resume with AI-powered ATS scoring and keyword matching tailored to your target role.',
      href: '/resume-analyzer',
      color: 'from-rose-600 to-indigo-500',
      badge: 'AI Powered'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Learning Paths
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Choose your perfect learning journey. Whether you're a beginner or advancing your skills, 
            we have the right path for you to become interview-ready.
          </p>
        </div>

        {/* Learning Paths Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {pathsData.map((path) => (
            <a
              key={path.id}
              href={path.href}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${path.color} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative bg-white/5 backdrop-blur border border-white/10 hover:border-white/30 rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl">
                {/* Badge */}
                <div className={`absolute top-6 right-6 bg-gradient-to-r ${path.color} text-white text-xs font-bold px-4 py-1 rounded-full`}>
                  {path.badge}
                </div>

                {/* Icon */}
                <div className="mb-6 p-4 bg-white/5 w-fit rounded-2xl group-hover:bg-white/10 transition-colors">
                  {path.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">
                  {path.title}
                </h3>
                <p className="text-slate-300 mb-8 leading-relaxed">
                  {path.description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-indigo-400 group-hover:gap-3 transition-all font-semibold">
                  Get Started
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Why Choose Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-white/10 rounded-3xl p-12 mb-12">
          <h2 className="text-3xl font-black mb-8 text-center">Why Choose MentorMuni?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-black text-indigo-400 mb-2">AI-Powered</div>
              <p className="text-slate-300">Real-time AI feedback and personalized recommendations</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-cyan-400 mb-2">Expert Mentors</div>
              <p className="text-slate-300">1:1 guidance from industry professionals</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-emerald-400 mb-2">100% Job-Ready</div>
              <p className="text-slate-300">Curriculum aligned with current job market</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-rose-400 mb-2">Flexible Learning</div>
              <p className="text-slate-300">Learn at your own pace, anytime, anywhere</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Not sure where to start?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Take our free interview readiness assessment to discover which learning path is perfect for your goals.
          </p>
          <button
            onClick={() => window.location.href = '/start-assessment'}
            className="bg-white text-indigo-600 font-bold py-4 px-8 rounded-xl hover:shadow-lg hover:shadow-white/20 transition-all inline-flex items-center gap-2"
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
