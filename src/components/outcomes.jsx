import React, { useEffect } from 'react';
import { Rocket, Target, Users, Sparkles, Mail, Phone } from 'lucide-react';

const OutcomesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F1F5F9] font-sans antialiased">
      <main>
        {/* HERO SECTION - matches homepage section style */}
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          </div>
          <div className="relative max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400">
                Our Commitment
              </span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              We've just started. Be among our first success stories — we're ready to help you get placed.
            </p>
          </div>
        </section>

        {/* STATS GRID - same card style as homepage */}
        <section className="max-w-6xl mx-auto px-6 -mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<Rocket className="w-6 h-6 text-orange-400" />}
              title="Just Started"
              label="Fresh & focused on you"
              accent="orange"
            />
            <StatCard
              icon={<Target className="w-6 h-6 text-rose-400" />}
              title="100%"
              label="Dedicated to your success"
              accent="rose"
            />
            <StatCard
              icon={<Users className="w-6 h-6 text-indigo-400" />}
              title="1:1"
              label="Personal mentorship"
              accent="indigo"
            />
            <StatCard
              icon={<Sparkles className="w-6 h-6 text-amber-400" />}
              title="AI-Powered"
              label="Smart interview prep"
              accent="amber"
            />
          </div>
        </section>

        {/* ROLES & COMPANIES - same section/card style as homepage */}
        <section className="py-20 px-6 bg-gradient-to-b from-transparent to-slate-900/30">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-black mb-4">Target Roles & Companies</h2>
              <p className="text-xl text-slate-400 max-w-2xl">
                We prepare you for roles at top companies — TCS, Cognizant, Deloitte, HCL, Wipro, Infosys, and more.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <OutcomeCard
                role="Software Engineer"
                companies="TCS • Cognizant • HCL"
                focus="Interview-ready roadmap"
                accent="indigo"
              />
              <OutcomeCard
                role="Associate Consultant"
                companies="Deloitte • Capgemini"
                focus="Technical + HR round prep"
                accent="cyan"
              />
              <OutcomeCard
                role="Programmer Analyst"
                companies="Cognizant • Infosys • Wipro"
                focus="DSA + System Design focus"
                accent="purple"
              />
            </div>
          </div>
        </section>

        {/* TESTIMONIALS - dark block consistent with homepage CTA section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">Why Join Us Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TestimonialCard
                quote="I cracked Cognizant with Muni's live problem-solving and mentor feedback. Couldn't have done it alone!"
                author="Prisha S."
                company="Cognizant"
              />
              <TestimonialCard
                quote="Great environment for placements — personal attention, AI tools, and resume feedback help."
                author="Siddharth K."
                company="TCS"
              />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER - matches homepage footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="/start-assessment" className="hover:text-white transition-colors">Assessment</a></li>
                <li><a href="/mock-interviews" className="hover:text-white transition-colors">Mock Interviews</a></li>
                <li><a href="/skill-gap-analyzer" className="hover:text-white transition-colors">Skill Analyzer</a></li>
                <li><a href="/resume-analyzer" className="hover:text-white transition-colors">Resume Analyzer</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Learning</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="/placement-tracks" className="hover:text-white transition-colors">Placement Tracks</a></li>
                <li><a href="/free-tutorials" className="hover:text-white transition-colors">Free Tutorials</a></li>
                <li><a href="/learning-paths" className="hover:text-white transition-colors">Learning Paths</a></li>
                <li><a href="/success-stories" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="/contact" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:enroll@mentormuni.com">enroll@mentormuni.com</a>
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+919146421302">+91 91464 21302</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
            <p>© {new Date().getFullYear()} MentorMuni. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

/* --- SUB-COMPONENTS - match homepage card styles --- */

const statCardClasses = {
  indigo: 'bg-indigo-600/20 group-hover:bg-indigo-600/30',
  cyan: 'bg-cyan-600/20 group-hover:bg-cyan-600/30',
  purple: 'bg-purple-600/20 group-hover:bg-purple-600/30',
  orange: 'bg-orange-600/20 group-hover:bg-orange-600/30',
  rose: 'bg-rose-600/20 group-hover:bg-rose-600/30',
  amber: 'bg-amber-600/20 group-hover:bg-amber-600/30',
};

const StatCard = ({ icon, title, label, accent }) => {
  const iconBg = statCardClasses[accent] || statCardClasses.indigo;
  return (
    <div className="group bg-gradient-to-br from-slate-800/50 to-slate-800/20 border border-slate-700 rounded-2xl p-8 hover:border-slate-500/50 transition-all hover:shadow-lg hover:shadow-slate-500/10 flex flex-col items-center text-center">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all ${iconBg}`}>
        {icon}
      </div>
      <span className="text-xl font-black text-white mb-1">{title}</span>
      <span className="text-sm text-slate-400">{label}</span>
    </div>
  );
};

const OutcomeCard = ({ role, companies, focus, accent }) => {
  const cardHover = accent === 'cyan'
    ? 'hover:border-cyan-500/50 hover:shadow-cyan-500/10'
    : accent === 'purple'
    ? 'hover:border-purple-500/50 hover:shadow-purple-500/10'
    : 'hover:border-indigo-500/50 hover:shadow-indigo-500/10';
  const iconBg = accent === 'cyan'
    ? 'bg-cyan-600/20 group-hover:bg-cyan-600/30'
    : accent === 'purple'
    ? 'bg-purple-600/20 group-hover:bg-purple-600/30'
    : 'bg-indigo-600/20 group-hover:bg-indigo-600/30';
  return (
    <div className={`group bg-gradient-to-br from-slate-800/50 to-slate-800/20 border border-slate-700 rounded-2xl p-8 transition-all hover:shadow-lg ${cardHover}`}>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all ${iconBg}`}>
        <span className="text-2xl font-black text-slate-500">→</span>
      </div>
      <span className="inline-block px-3 py-1 bg-indigo-600/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
        Target Role
      </span>
      <h4 className="text-xl font-bold text-white mb-2">{role}</h4>
      <p className="text-indigo-400 font-semibold text-sm mb-4">{companies}</p>
      <p className="text-slate-400 text-sm">{focus}</p>
    </div>
  );
};

const TestimonialCard = ({ quote, author, company }) => (
  <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/20 border border-slate-700 rounded-2xl p-10 relative hover:border-indigo-500/30 transition-all">
    <span className="absolute top-6 left-8 text-6xl text-slate-700 font-serif leading-none">"</span>
    <p className="text-lg italic text-slate-300 relative z-10 mb-8">{quote}</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white">
        {author[0]}
      </div>
      <div>
        <p className="font-bold text-white leading-none mb-1">{author}</p>
        <p className="text-xs text-indigo-400 font-bold uppercase tracking-tighter">{company}</p>
      </div>
    </div>
  </div>
);

export default OutcomesPage;
