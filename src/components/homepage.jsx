import React from 'react';
import { ArrowRight, Users, Target, Zap, Briefcase, FileText, MessageSquare, Mail, Phone, Check, ClipboardCheck, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import MentorMuniChatbot from './MentorMuniChatbot';
import AboutMentorMuniVideo from './AboutMentorMuniVideo';
import FreeUsageBanner from './FreeUsageBanner';
import HeroSection from './HeroSection';
import ProblemDrivenFeatures from './ProblemDrivenFeatures';
import CareerReadinessJourney from './CareerReadinessJourney';
import FreeTrialBanner from './FreeTrialBanner';
import ImpactStats from './ImpactStats';
import SuccessStories from './SuccessStories';
import MentorSection from './MentorSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F1F5F9] font-sans antialiased overflow-hidden">
      
      {/* === Free Usage Banner === */}
      <FreeUsageBanner />

      {/* === HERO SECTION === */}
      <HeroSection />

      {/* === Free Trial Benefits Banner === */}
      <FreeTrialBanner />

      {/* === MEET MENTORMUNI — VIDEO === */}
      <AboutMentorMuniVideo />

      {/* === Problem-Driven Features Section === */}
      <ProblemDrivenFeatures />

      {/* === Career Readiness Journey Section === */}
      <CareerReadinessJourney />

      {/* === Impact Stats Section === */}
      <ImpactStats />

      {/* === WHO IT'S FOR === */}
      <section className="py-16 md:py-20 px-6 bg-gradient-to-b from-transparent to-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12" data-aos>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              Built for every stage of your tech journey
            </h2>
            <p className="text-lg text-slate-400">
              Whether you’re in placement season or switching careers—we have a path for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 - 4th year / placement focus */}
            <div data-aos className="group relative bg-gradient-to-br from-slate-800/50 to-slate-800/20 border-2 border-indigo-500/30 rounded-2xl p-8 hover:border-indigo-500/60 transition-all hover:shadow-lg hover:shadow-indigo-500/10">
              <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase">For you</span>
              <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600/30 transition-all">
                <Users className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Final Year Students</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Placement season ready. Get interview-ready before graduation with AI practice, mentor-led paths, and DSA & system design prep.
              </p>
              <Link to="/start-assessment" className="mt-4 inline-flex items-center gap-1 text-indigo-400 text-sm font-semibold group-hover:gap-2 transition-all">Start free <ArrowRight className="w-4 h-4" /></Link>
            </div>

            {/* Card 2 */}
            <Link to="/skill-gap-analyzer" data-aos className="group block bg-gradient-to-br from-slate-800/50 to-slate-800/20 border border-slate-700 rounded-2xl p-8 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-600/30 transition-all">
                <Target className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Freshers in IT</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Refresh your fundamentals and gain confidence. Score well in technical assessments.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-cyan-400 text-sm font-semibold group-hover:gap-2 transition-all">Find your gaps <ArrowRight className="w-4 h-4" /></span>
            </Link>

            {/* Card 3 */}
            <Link to="/learning-paths" data-aos className="group block bg-gradient-to-br from-slate-800/50 to-slate-800/20 border border-slate-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600/30 transition-all">
                <Briefcase className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Career Switchers</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Transition into tech confidently with structured guidance and real-world practice.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-purple-400 text-sm font-semibold group-hover:gap-2 transition-all">Explore paths <ArrowRight className="w-4 h-4" /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* === Mentor Section === */}
      <MentorSection />

      {/* === WHO IT'S FOR === */}
      <section className="py-12 md:py-16 px-6 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-3xl mx-auto text-center" data-aos>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">How to enroll</h2>
          <p className="text-slate-400 mb-8">Join the Complete Placement Program—full details and next steps are on our Enroll page. Click below and we’ll get you started.</p>
          <Link to="/upgrade" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20">
            Enroll now — program details
          </Link>
        </div>
      </section>

      {/* === Success Stories Section === */}
      <SuccessStories />

      {/* === OUTCOMES === */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12" data-aos>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Real results, real progress</h2>
            <p className="text-lg text-slate-400 mb-1">What learners achieve with MentorMuni</p>
            <p className="text-sm text-slate-500">Join students preparing for campus and off-campus placements</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Stat 1 */}
            <div data-aos className="bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 rounded-2xl p-10 text-center hover:border-indigo-500/50 transition-all">
              <div className="text-6xl font-black text-indigo-400 mb-3">82%</div>
              <p className="text-slate-300 font-semibold">Improved Interview Confidence</p>
              <p className="text-slate-500 text-sm mt-2">Students report significantly higher confidence in technical interviews</p>
            </div>

            {/* Stat 2 */}
            <div data-aos className="bg-gradient-to-br from-cyan-600/10 to-transparent border border-cyan-500/20 rounded-2xl p-10 text-center hover:border-cyan-500/50 transition-all">
              <div className="text-6xl font-black text-cyan-400 mb-3">65%</div>
              <p className="text-slate-300 font-semibold">Increased Assessment Score</p>
              <p className="text-slate-500 text-sm mt-2">Average score improvement after following personalized learning paths</p>
            </div>

            {/* Stat 3 */}
            <div data-aos className="bg-gradient-to-br from-purple-600/10 to-transparent border border-purple-500/20 rounded-2xl p-10 text-center hover:border-purple-500/50 transition-all">
              <div className="text-6xl font-black text-purple-400 mb-3">3x</div>
              <p className="text-slate-300 font-semibold">Faster Preparation</p>
              <p className="text-slate-500 text-sm mt-2">Structured approach reduces preparation time by 3x compared to self-study</p>
            </div>
          </div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="relative py-20 md:py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/25 via-purple-900/25 to-cyan-900/25" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto text-center" data-aos>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5">Ready to know where you stand?</h2>
          <p className="text-lg md:text-xl text-slate-400 mb-4 max-w-xl mx-auto">
            Free AI assessment in 15 minutes. Instant insights into your interview readiness.
          </p>
          <p className="text-sm text-slate-500 mb-10">Free to start. No card required.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/start-assessment"
              className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2 group"
            >
              Start free assessment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/upgrade"
              className="border-2 border-slate-500 text-slate-200 hover:border-white hover:text-white px-8 py-4 rounded-xl font-bold transition-all"
            >
              Enroll
            </Link>
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-slate-900/50 border-t border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            {/* Column 1: Platform */}
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link to="/start-assessment" className="hover:text-white transition-colors">Assessment</Link></li>
                <li><Link to="/mock-interviews" className="hover:text-white transition-colors">Mock Interviews</Link></li>
                <li><Link to="/skill-gap-analyzer" className="hover:text-white transition-colors">Skill Analyzer</Link></li>
                <li><Link to="/resume-analyzer" className="hover:text-white transition-colors">Resume Analyzer</Link></li>
              </ul>
            </div>

            {/* Column 2: Learning */}
            <div>
              <h4 className="font-bold text-white mb-4">Learning</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link to="/upgrade" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Enroll</Link></li>
                <li><Link to="/placement-tracks" className="hover:text-white transition-colors">Placement Tracks</Link></li>
                <li><Link to="/free-tutorials" className="hover:text-white transition-colors">Free Tutorials</Link></li>
                <li><Link to="/learning-paths" className="hover:text-white transition-colors">Learning Paths</Link></li>
                <li><Link to="/outcomes" className="hover:text-white transition-colors">Success Stories</Link></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>

            {/* Column 4: Company */}
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Column 5: Contact */}
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

          {/* Footer Bottom */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
            <p>© 2026 MentorMuni. All rights reserved.</p>
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
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <MentorMuniChatbot />
    </div>
  );
};

export default HomePage;