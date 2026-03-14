import React from 'react';
import { Users, MessageSquare, Lightbulb, Heart, MessageCircle, Slack, ArrowRight } from 'lucide-react';

const CommunitySection = () => {
  const communityBenefits = [
    {
      icon: MessageSquare,
      title: "Ask Questions",
      description: "Get help from mentors and peers anytime."
    },
    {
      icon: MessageCircle,
      title: "Share Experiences",
      description: "Learn from others' interview stories and success."
    },
    {
      icon: Lightbulb,
      title: "Share Resources",
      description: "Discover curated learning materials and projects."
    },
    {
      icon: Heart,
      title: "Stay Motivated",
      description: "Get support and encouragement from the community."
    }
  ];

  const communities = [
    {
      id: 1,
      name: "Discord Community",
      description: "Join live discussions, ask interview prep questions, and collaborate with peers in real-time.",
      icon: "💬",
      members: "800+",
      channels: "20+ channels",
      buttonText: "Join Discord",
      buttonUrl: "https://discord.gg/mentormuni",
      color: "indigo"
    },
    {
      id: 2,
      name: "Slack Community",
      description: "Connect with mentors, professionals, and get career advice within organized channels.",
      icon: "🔗",
      members: "500+",
      channels: "15+ channels",
      buttonText: "Join Slack",
      buttonUrl: "https://slack.com/oauth/v2/authorize?client_id=YOUR_CLIENT_ID&scope=chat:write&redirect_uri=https://mentormuni.com/slack-auth",
      color: "purple"
    }
  ];

  const colorMap = {
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      button: "from-indigo-600 to-blue-600",
      hover: "hover:border-indigo-400 hover:shadow-indigo-300"
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      button: "from-purple-600 to-pink-600",
      hover: "hover:border-purple-400 hover:shadow-purple-300"
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Join the MentorMuni Community
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
            Connect with students, mentors, and professionals preparing for tech careers.
          </p>
          <div className="inline-block px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 font-semibold text-sm">
            1,350+ learners growing together
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          {/* Left Side - Benefits */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-8">
              Why Join Our Community?
            </h3>
            <div className="space-y-6">
              {communityBenefits.map((benefit, index) => {
                const BenefitIcon = benefit.icon;
                return (
                  <div key={index} className="flex gap-4 group">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white group-hover:scale-110 transition-transform">
                        <BenefitIcon className="w-6 h-6" strokeWidth={1.5} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-slate-600 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side - Community Platforms */}
          <div className="space-y-6">
            {communities.map((community) => {
              const colors = colorMap[community.color];
              return (
                <div
                  key={community.id}
                  className={`${colors.bg} border-2 ${colors.border} rounded-xl p-8 transition-all duration-300 ${colors.hover} hover:shadow-xl hover:-translate-y-1 group`}
                >
                  {/* Icon and Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{community.icon}</div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900">
                          {community.name}
                        </h4>
                        <p className="text-xs text-slate-600 font-medium">
                          {community.channels}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-indigo-600">
                        {community.members}
                      </div>
                      <p className="text-xs text-slate-600 font-medium">members</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    {community.description}
                  </p>

                  {/* Join Button */}
                  <a
                    href={community.buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-gradient-to-r ${colors.button} text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95 group/btn`}
                  >
                    <span>{community.buttonText}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>

                  {/* Stats Line */}
                  <p className="text-xs text-slate-600 text-center mt-4">
                    Active conversations • Quick responses • Supportive community
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to start your learning journey?
          </h3>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join the community, take our free assessment, and get personalized guidance on your path to a tech job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#/interview-readiness"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 active:scale-95"
            >
              <span>Check My Readiness (Free)</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/#/skill-gap-analyzer"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Analyze My Skills
            </a>
          </div>
        </div>

        {/* Trust Signal */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 text-sm font-medium">
            Join <span className="text-indigo-600 font-bold">1,350+ students</span> from <span className="text-purple-600 font-bold">50+ colleges</span> preparing for their dream tech jobs
          </p>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
