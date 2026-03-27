import React from 'react';
import { ArrowRight, Code, BarChart3, Zap, Database, Smartphone, Shield, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const CareerSwitchPaths = () => {
  const careerPaths = [
    {
      title: 'Manual Testing → QA Engineer',
      description: 'Learn software testing fundamentals, automation tools, and testing frameworks to transition into QA roles.',
      icon: Shield,
      color: 'indigo',
      gradient: 'from-[#FF9500] to-blue-500',
      bgGradient: 'from-[#FF9500]/20 to-blue-600/20',
      borderColor: 'border-[#FF9500]/35',
      route: '/learning-paths'
    },
    {
      title: 'Business → Data Analyst',
      description: 'Master SQL, Excel, Python, and data visualization tools to launch a career in analytics.',
      icon: BarChart3,
      color: 'cyan',
      gradient: 'from-cyan-500 to-emerald-500',
      bgGradient: 'from-cyan-600/20 to-emerald-600/20',
      borderColor: 'border-cyan-500/30',
      route: '/learning-paths'
    },
    {
      title: 'Any Background → Frontend Developer',
      description: 'Learn HTML, CSS, JavaScript, and React to build modern web applications and start your dev career.',
      icon: Code,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-600/20 to-pink-600/20',
      borderColor: 'border-purple-500/30',
      route: '/learning-paths'
    },
    {
      title: 'Developer → DevOps Engineer',
      description: 'Master cloud platforms, CI/CD pipelines, and infrastructure automation to transition into DevOps.',
      icon: Zap,
      color: 'amber',
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-600/20 to-orange-600/20',
      borderColor: 'border-amber-500/30',
      route: '/learning-paths'
    },
    {
      title: 'Professional → Backend Developer',
      description: 'Build strong foundations in databases, APIs, and system design to become a backend engineer.',
      icon: Database,
      color: 'rose',
      gradient: 'from-rose-500 to-red-500',
      bgGradient: 'from-rose-600/20 to-red-600/20',
      borderColor: 'border-rose-500/30',
      route: '/learning-paths'
    },
    {
      title: 'Designer → Mobile Developer',
      description: 'Leverage design knowledge and learn React Native to create cross-platform mobile applications.',
      icon: Smartphone,
      color: 'fuchsia',
      gradient: 'from-fuchsia-500 to-[#FFB347]',
      bgGradient: 'from-fuchsia-600/20 to-[#FFB347]/20',
      borderColor: 'border-fuchsia-500/30',
      route: '/learning-paths'
    },
    {
      title: 'Non-Tech → Product Manager',
      description: 'Build tech skills, understand product development, and transition into PM roles at tech companies.',
      icon: Briefcase,
      color: 'teal',
      gradient: 'from-teal-500 to-cyan-500',
      bgGradient: 'from-teal-600/20 to-cyan-600/20',
      borderColor: 'border-teal-500/30',
      route: '/learning-paths'
    },
    {
      title: 'IT Support → Cloud Engineer',
      description: 'Advance from IT support to cloud infrastructure by mastering AWS, Azure, and GCP.',
      icon: Shield,
      color: 'lime',
      gradient: 'from-lime-500 to-emerald-500',
      bgGradient: 'from-lime-600/20 to-emerald-600/20',
      borderColor: 'border-lime-500/30',
      route: '/learning-paths'
    }
  ];

  const transitions = [
    { from: 'Mechanical Engineering', to: 'Data Analyst' },
    { from: 'Civil Engineering', to: 'Software Engineer' },
    { from: 'Non-Tech Background', to: 'QA Tester' },
    { from: 'Sales Representative', to: 'Product Manager' },
    { from: 'Business Analyst', to: 'Frontend Developer' },
    { from: 'IT Support', to: 'DevOps Engineer' }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent border-y border-slate-800/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Career Switch Paths
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Explore the most popular tech career transitions and start your journey with MentorMuni.
          </p>

          {/* Popular Transitions */}
          <div className="inline-block">
            <p className="text-sm font-semibold text-slate-400 mb-4">Popular career transitions:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {transitions.map((transition, index) => (
                <div
                  key={index}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF9500]/10 to-cyan-500/10 border border-[#FF9500]/25 text-sm text-slate-300 hover:border-[#FF9500]/45 transition-colors"
                >
                  <span className="font-semibold text-[#CC7000]">{transition.from}</span>
                  <span className="mx-2 text-slate-500">→</span>
                  <span className="font-semibold text-cyan-300">{transition.to}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Career Path Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {careerPaths.map((path, index) => {
            const IconComponent = path.icon;
            return (
              <div
                key={index}
                className={`group relative h-full bg-gradient-to-br ${path.bgGradient} border ${path.borderColor} rounded-2xl p-6 backdrop-blur-sm hover:border-${path.color}-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-${path.color}-500/20 overflow-hidden`}
              >
                {/* Background glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${path.bgGradient} opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10 blur-xl`} />

                {/* Icon */}
                <div className={`mb-6 inline-flex p-3 rounded-lg bg-gradient-to-br ${path.bgGradient} border border-${path.color}-500/20 group-hover:scale-110 transition-transform`}>
                  <IconComponent className={`w-6 h-6 text-${path.color}-400`} />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                    {path.title}
                  </h3>

                  <p className="text-slate-300 text-sm mb-6 flex-grow leading-relaxed">
                    {path.description}
                  </p>

                  {/* CTA Button */}
                  <Link
                    to={path.route}
                    className={`mt-auto inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r ${path.gradient} hover:shadow-lg hover:shadow-${path.color}-500/30 transition-all active:scale-95 group-hover:gap-3`}
                  >
                    View Roadmap
                    <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center p-8 bg-gradient-to-r from-[#FF9500]/20 to-cyan-600/20 border border-[#FF9500]/35 rounded-2xl">
          <h3 className="text-2xl font-bold text-white mb-3">
            Not sure which path is right for you?
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Take our free interview readiness assessment to understand your current skills and get personalized career recommendations.
          </p>
          <Link
            to="/start-assessment"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-[#FF9500] to-cyan-600 text-white font-bold hover:shadow-lg hover:shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all active:scale-95 hover:gap-3"
          >
            Start Free Assessment
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CareerSwitchPaths;

