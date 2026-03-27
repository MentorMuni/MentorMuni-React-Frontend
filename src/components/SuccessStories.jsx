import { Star } from 'lucide-react';

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      name: "Rahul Sharma",
      background: "Mechanical Engineering Graduate",
      transformation: "Mechanical → Software Engineer",
      company: "TCS",
      quote: "I was lost about how to transition from mechanical to software engineering. MentorMuni's skill gap analysis showed me exactly what to learn first. In 3 months, I got placed at TCS!",
      avatar: "RS",
      bgColor: "from-[#FF9500]/20 to-[#E88600]/10",
      borderColor: "border-[#FF9500]/25"
    },
    {
      id: 2,
      name: "Priya Desai",
      background: "Commerce Graduate, Non-Tech Background",
      transformation: "Commerce → Data Analyst",
      company: "Microsoft",
      quote: "Coming from a commerce background, the resume analyzer helped me reframe my experience to appeal to tech companies. The interview practice was incredibly helpful. I cracked Microsoft interviews!",
      avatar: "PD",
      bgColor: "from-cyan-600/20 to-cyan-600/10",
      borderColor: "border-cyan-500/20"
    },
    {
      id: 3,
      name: "Arjun Patel",
      background: "3rd Year Computer Science Student",
      transformation: "Student → Intern to Full-Time",
      company: "Amazon",
      quote: "Before placement season, MentorMuni gave me confidence. The mock interviews felt so real, and I got detailed feedback on every aspect. Got an offer from Amazon for my dream role!",
      avatar: "AP",
      bgColor: "from-purple-600/20 to-purple-600/10",
      borderColor: "border-purple-500/20"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 bg-gradient-to-b from-transparent to-slate-900/40">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Outcomes
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Real students, real transformations, real results. See how MentorMuni helped them break into tech.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div
              key={story.id}
              className={`bg-gradient-to-br ${story.bgColor} ${story.borderColor} border rounded-2xl p-8 hover:border-opacity-50 transition-all hover:shadow-lg hover:shadow-black/20`}
            >
              {/* Stars Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-200 italic text-sm leading-relaxed mb-6">
                "{story.quote}"
              </p>

              {/* Divider */}
              <div className="border-t border-slate-700/50 mb-6"></div>

              {/* Student Info */}
              <div className="flex items-center gap-4 mb-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white">{story.avatar}</span>
                </div>

                {/* Details */}
                <div className="flex-grow">
                  <h3 className="font-bold text-white text-sm">{story.name}</h3>
                  <p className="text-xs text-slate-400">{story.background}</p>
                </div>
              </div>

              {/* Transformation Badge */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 mb-4">
                <p className="text-xs font-semibold text-slate-300 mb-1">Journey:</p>
                <p className="text-sm text-[#CC7000] font-semibold">{story.transformation}</p>
              </div>

              {/* Company */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Joined:</span>
                <span className="px-3 py-1 bg-[#FF9500]/20 border border-[#FF9500]/35 rounded-full text-xs font-bold text-[#CC7000]">
                  {story.company}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Message */}
        <div className="mt-14 text-center">
          <p className="text-slate-300 mb-6">
            Your success story could be next. <span className="text-emerald-300 font-semibold">Start your free assessment today.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
