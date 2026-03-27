import React from 'react';
import { Zap, BarChart3, Code, ArrowRight, Star } from 'lucide-react';

const CapabilitySection = () => {
  const capabilities = [
    {
      id: 1,
      title: "AI-Powered Career Feedback",
      description: "Get instant, actionable feedback on your resume, skills, and interview readiness using AI trained on real industry expectations.",
      icon: Zap,
      points: [
        "Resume improvement suggestions",
        "Skill gap insights with learning paths",
        "Interview readiness evaluation"
      ],
      color: "indigo",
      gradient: "from-[#FF9500] to-blue-600",
      bgGradient: "from-[#FF9500]/10 to-blue-500/10"
    },
    {
      id: 2,
      title: "Industry-Level Skill Assessment",
      description: "Test your knowledge against real-world tech requirements and discover exactly how your skills compare to industry expectations.",
      icon: BarChart3,
      points: [
        "Skill benchmarking against job roles",
        "Technical readiness scoring",
        "Industry comparison metrics"
      ],
      color: "cyan",
      gradient: "from-cyan-600 to-blue-600",
      bgGradient: "from-cyan-500/10 to-blue-500/10"
    },
    {
      id: 3,
      title: "Learn Through Real Projects",
      description: "Work on guided projects that simulate real developer tasks and build a portfolio that employers actively seek.",
      icon: Code,
      points: [
        "Hands-on coding projects",
        "Real-world developer scenarios",
        "Portfolio building for job interviews"
      ],
      color: "purple",
      gradient: "from-purple-600 to-pink-600",
      bgGradient: "from-purple-500/10 to-pink-500/10"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Build Real-World Job Readiness
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our AI evaluates your skills, identifies gaps, and helps you prepare for real tech interviews with a complete career preparation ecosystem.
          </p>
        </div>

        {/* Capability Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;

            return (
              <div
                key={capability.id}
                className="group relative"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Card Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${capability.bgGradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Card */}
                <div className="relative bg-white rounded-2xl border-2 border-slate-200 p-8 shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 h-full flex flex-col">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${capability.bgGradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 text-${capability.color}-600`} strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {capability.title}
                  </h3>

                  <p className="text-slate-600 text-sm mb-6 leading-relaxed flex-grow">
                    {capability.description}
                  </p>

                  {/* Points List */}
                  <ul className="space-y-3 mb-8">
                    {capability.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Star className={`w-4 h-4 mt-0.5 flex-shrink-0 text-${capability.color}-600`} fill="currentColor" />
                        <span className="text-sm text-slate-700">{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Learn More Link */}
                  <button className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-${capability.color}-600 hover:bg-${capability.color}-50 rounded-lg transition-all group/link`}>
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Why These Matter Section */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white mb-16 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-black text-[#FF9500] mb-2">85%</div>
              <p className="text-slate-300">of successful candidates use feedback-driven preparation</p>
            </div>
            <div>
              <div className="text-4xl font-black text-cyan-400 mb-2">3x</div>
              <p className="text-slate-300">faster interview preparation with skill assessment</p>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-400 mb-2">10+</div>
              <p className="text-slate-300">portfolio projects to showcase real-world expertise</p>
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">
            How MentorMuni Stands Out
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-300">
                  <th className="text-left py-4 px-6 font-bold text-slate-900">Capability</th>
                  <th className="text-center py-4 px-6 font-bold text-[#FF9500]">MentorMuni</th>
                  <th className="text-center py-4 px-6 font-bold text-slate-500">Others</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900">AI Resume Feedback</td>
                  <td className="text-center py-4 px-6">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                  <td className="text-center py-4 px-6">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900">Skill Gap Analysis</td>
                  <td className="text-center py-4 px-6">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                  <td className="text-center py-4 px-6">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900">Guided Projects</td>
                  <td className="text-center py-4 px-6">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                  <td className="text-center py-4 px-6">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900">Mentor Community</td>
                  <td className="text-center py-4 px-6">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                  <td className="text-center py-4 px-6">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-[#FF9500] to-purple-600 rounded-2xl p-12 text-white shadow-xl">
            <h3 className="text-3xl font-black mb-3">
              Ready to Prepare Like Top Tech Candidates?
            </h3>
            <p className="text-lg text-indigo-100 mb-2 max-w-2xl mx-auto">
              Start building your real-world job readiness today.
            </p>
            <p className="text-sm text-[#CC7000] mb-8 max-w-2xl mx-auto">
              Get 3 free analyses. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#/resume-analyzer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#FF9500] font-bold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 active:scale-95"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/#/career-health"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                View Your Career Health
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CapabilitySection;
