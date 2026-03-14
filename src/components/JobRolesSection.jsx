import React from 'react';
import { Code, CheckCircle, BarChart3, Layout, Server, Zap, ArrowRight } from 'lucide-react';

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
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: "bg-indigo-100 text-indigo-600",
      badge: "bg-indigo-100 text-indigo-700",
      button: "from-indigo-600 to-blue-600",
      hover: "hover:border-indigo-400 hover:shadow-indigo-200"
    },
    cyan: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      icon: "bg-cyan-100 text-cyan-600",
      badge: "bg-cyan-100 text-cyan-700",
      button: "from-cyan-600 to-blue-600",
      hover: "hover:border-cyan-400 hover:shadow-cyan-200"
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      icon: "bg-purple-100 text-purple-600",
      badge: "bg-purple-100 text-purple-700",
      button: "from-purple-600 to-pink-600",
      hover: "hover:border-purple-400 hover:shadow-purple-200"
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "bg-blue-100 text-blue-600",
      badge: "bg-blue-100 text-blue-700",
      button: "from-blue-600 to-cyan-600",
      hover: "hover:border-blue-400 hover:shadow-blue-200"
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "bg-amber-100 text-amber-600",
      badge: "bg-amber-100 text-amber-700",
      button: "from-amber-600 to-orange-600",
      hover: "hover:border-amber-400 hover:shadow-amber-200"
    },
    rose: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      icon: "bg-rose-100 text-rose-600",
      badge: "bg-rose-100 text-rose-700",
      button: "from-rose-600 to-pink-600",
      hover: "hover:border-rose-400 hover:shadow-rose-200"
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Prepare for These Roles
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
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
                className={`${colors.bg} border-2 ${colors.border} rounded-xl p-8 transition-all duration-300 ${colors.hover} hover:shadow-xl hover:-translate-y-2 group cursor-pointer`}
              >
                {/* Icon Circle */}
                <div className={`${colors.icon} w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {role.title}
                </h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
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
        <div className="text-center pt-12 border-t border-slate-200">
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Not sure which role is right for you? Use our free tools to assess your current skills and discover the best career path.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#/skill-gap-analyzer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1 transition-all duration-300 active:scale-95"
            >
              <span>Explore Tools & Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/#/interview-readiness"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-indigo-600 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-all duration-300"
            >
              Check My Readiness (Free)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobRolesSection;
