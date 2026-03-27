import React from 'react';
import { Code, CheckCircle, BarChart3, Layout, Server, Zap, ArrowRight } from 'lucide-react';
import { PRIMARY_CTA_LABEL } from '../constants/brandCopy';

const JobRolesSection = () => {
  const jobRoles = [
    {
      id: 1,
      title: "Software Engineer",
      description: "Prepare for coding interviews, system design, and problem-solving challenges.",
      icon: Code,
      color: "indigo",
      keywords: ["DSA", "System Design", "OOP"]
    },
    {
      id: 2,
      title: "QA Automation Engineer",
      description: "Learn test automation, API testing, and modern QA frameworks and tools.",
      icon: CheckCircle,
      color: "cyan",
      keywords: ["Selenium", "API Testing", "Automation"]
    },
    {
      id: 3,
      title: "Data Analyst",
      description: "Master SQL, Excel, data visualization, and analytics tools.",
      icon: BarChart3,
      color: "purple",
      keywords: ["SQL", "Excel", "Tableau"]
    },
    {
      id: 4,
      title: "Frontend Developer",
      description: "Build modern web interfaces using HTML, CSS, JavaScript, and React.",
      icon: Layout,
      color: "blue",
      keywords: ["React", "CSS", "JavaScript"]
    },
    {
      id: 5,
      title: "Backend Developer",
      description: "Learn server-side development, APIs, databases, and scalable systems.",
      icon: Server,
      color: "amber",
      keywords: ["APIs", "Databases", "Scaling"]
    },
    {
      id: 6,
      title: "DevOps Engineer",
      description: "Master CI/CD pipelines, containerization, and infrastructure management.",
      icon: Zap,
      color: "rose",
      keywords: ["Docker", "CI/CD", "Kubernetes"]
    }
  ];

  const colorMap = {
    indigo: {
      bg: "card-dark",
      border: "border-[#FF9500]/25",
      icon: "text-[#FF9500]",
      badge: "bg-[#FF9500]/20 text-[#CC7000]",
      button: "from-[#FF9500] to-blue-600",
      hover: "hover:border-[#FFB347]/50"
    },
    cyan: {
      bg: "card-dark",
      border: "border-cyan-500/20",
      icon: "text-cyan-400",
      badge: "bg-cyan-500/20 text-cyan-300",
      button: "from-cyan-600 to-blue-600",
      hover: "hover:border-cyan-400/50"
    },
    purple: {
      bg: "card-dark",
      border: "border-purple-500/20",
      icon: "text-purple-400",
      badge: "bg-purple-500/20 text-purple-300",
      button: "from-purple-600 to-pink-600",
      hover: "hover:border-purple-400/50"
    },
    blue: {
      bg: "card-dark",
      border: "border-blue-500/20",
      icon: "text-blue-400",
      badge: "bg-blue-500/20 text-blue-300",
      button: "from-blue-600 to-cyan-600",
      hover: "hover:border-blue-400/50"
    },
    amber: {
      bg: "card-dark",
      border: "border-amber-500/20",
      icon: "text-amber-400",
      badge: "bg-amber-500/20 text-amber-300",
      button: "from-amber-600 to-orange-600",
      hover: "hover:border-amber-400/50"
    },
    rose: {
      bg: "card-dark",
      border: "border-rose-500/20",
      icon: "text-rose-400",
      badge: "bg-rose-500/20 text-rose-300",
      button: "from-rose-600 to-pink-600",
      hover: "hover:border-rose-400/50"
    }
  };

  return (
    <section className="py-20 px-6 section-dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-on-dark mb-4">
            Prepare for These Roles
          </h2>
          <p className="text-lg text-on-dark-sub max-w-2xl mx-auto">
            Choose a career path and start preparing for in-demand tech jobs.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {jobRoles.map((role) => {
            const Icon = role.icon;
            const colors = colorMap[role.color];

            return (
              <div
                key={role.id}
                className={`${colors.bg} border ${colors.border} rounded-xl p-8 transition-all duration-300 ${colors.hover} hover:shadow-xl hover:-translate-y-2 group cursor-pointer`}
              >
                {/* Icon Circle */}
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`} style={{ background: 'rgba(99,102,241,0.06)' }}>
                  <Icon className={`w-8 h-8 ${colors.icon}`} strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-on-dark mb-3">
                  {role.title}
                </h3>
                <p className="text-on-dark-sub text-sm mb-6 leading-relaxed">
                  {role.description}
                </p>

                {/* Keywords/Skills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {role.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className={`${colors.badge} px-3 py-1 rounded-full text-xs font-semibold`}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <button className={`w-full bg-gradient-to-r ${colors.button} text-white font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 group/btn`}>
                  <span>View Path</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center pt-12" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-on-dark-sub mb-8 max-w-2xl mx-auto">
            Not sure which role is right for you? Use our free tools to assess your current skills and discover the best career path.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#/skill-gap-analyzer"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 active:scale-95"
            >
              <span>Explore Tools & Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/#/start-assessment"
              className="inline-flex items-center gap-2 px-8 py-4 border border-primary text-primary font-bold rounded-lg hover:bg-primary/10 transition-all duration-300"
            >
              {PRIMARY_CTA_LABEL}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobRolesSection;
