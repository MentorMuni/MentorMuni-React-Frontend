
import React, { useEffect, useState } from 'react';
import { ArrowRight, Users, Target, Zap, Briefcase, FileText, MessageSquare, Mail, Phone, Check, ClipboardCheck, TrendingUp } from 'lucide-react';

const HomePage = () => {
  const [heroSrc, setHeroSrc] = useState(null);
  useEffect(() => {
    import('../assets/hero-brand-banner.png').then((m) => setHeroSrc(m.default));
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F1F5F9] font-sans antialiased overflow-hidden">
      
      {/* === 2-SEC HOOK: Free placement tools (no data-aos = visible immediately) === */}
      <div className="bg-emerald-500/10 border-b border-emerald-500/20 py-2.5 px-4 text-center">
        <p className="text-sm md:text-base text-emerald-200 font-semibold">
          🎯 Free placement tools — ATS score, interview readiness, mock interviews. Try in 2 mins, no card required.
        </p>
      </div>

      {/* === HERO SECTION (no data-aos = visible on first paint) === */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Decorative blobs – stay behind content with z-0 */}
        <div className="absolute inset-0 z-0 opacity-25 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">
            <div className="space-y-6">
              <p className="text-base text-cyan-300 font-semibold">Free tools for placement checks — then level up with mentors.</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-300">
                  Know exactly where you stand.
                </span>
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
                <strong className="text-white">MentorMuni</strong> is your placement prep partner. Start with free AI tools—readiness, ATS score, mocks—then level up with <strong className="text-indigo-300">mentor-led programs</strong>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => window.location.href = '/start-assessment'}
                  className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2 group"
                >
                  Start free assessment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => window.location.href = '/learning-paths'}
                  className="border-2 border-slate-500 text-slate-200 hover:border-white hover:text-white hover:bg-white/5 px-8 py-4 rounded-xl font-bold transition-all inline-flex items-center justify-center gap-2"
                >
                  Explore learning paths
                </button>
              </div>
              <div className="pt-6 border-t border-slate-700/80 space-y-2">
                <p className="text-sm text-slate-500">Trusted by students preparing for campus & off-campus placements</p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                  <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Interview readiness</span>
                  <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> ATS score</span>
                  <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> AI mock interviews</span>
                  <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Mentor-led learning</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-cyan-600/10 rounded-3xl blur-2xl"></div>
              <div className="relative animate-float w-full max-w-md min-h-[200px]">
                {heroSrc ? (
                  <img src={heroSrc} alt="MentorMuni – Guiding your journey to knowledge" className="w-full h-auto drop-shadow-2xl rounded-2xl" loading="eager" decoding="async" />
                ) : (
                  <div className="w-full aspect-video rounded-2xl bg-slate-800/50 border border-slate-700/50" />
                )}
              </div>
            </div>
          </div>
        </main>
      </section>

      {/* === OUR MAIN OFFERINGS (Pillars) === */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10" data-aos>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">What we do</h2>
            <p className="text-slate-400">Free tools + mentor-led programs</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="/start-assessment" data-aos className="group relative bg-gradient-to-b from-slate-800/60 to-slate-800/30 border border-slate-700 rounded-2xl p-8 hover:border-indigo-500/60 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:bg-indigo-500/30 transition-colors">
                <ClipboardCheck className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Interview readiness</h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-grow">AI-powered assessment tailored to your role. Know your strengths and gaps in minutes.</p>
              <span className="mt-4 inline-flex items-center gap-1 text-indigo-400 font-semibold text-sm group-hover:gap-2 transition-all">Start assessment <ArrowRight className="w-4 h-4" /></span>
            </a>
            <a href="/resume-analyzer" data-aos className="group relative bg-gradient-to-b from-slate-800/60 to-slate-800/30 border border-slate-700 rounded-2xl p-8 hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6 group-hover:bg-cyan-500/30 transition-colors">
                <FileText className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">ATS score</h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-grow">Get your resume scored for ATS compatibility and role fit. Improve before you apply.</p>
              <span className="mt-4 inline-flex items-center gap-1 text-cyan-400 font-semibold text-sm group-hover:gap-2 transition-all">Analyze resume <ArrowRight className="w-4 h-4" /></span>
            </a>
            <a href="/mock-interviews" data-aos className="group relative bg-gradient-to-b from-slate-800/60 to-slate-800/30 border border-slate-700 rounded-2xl p-8 hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 group-hover:bg-emerald-500/30 transition-colors">
                <MessageSquare className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI mock interviews</h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-grow">Practice with AI-driven mock interviews and get actionable feedback to improve.</p>
              <span className="mt-4 inline-flex items-center gap-1 text-emerald-400 font-semibold text-sm group-hover:gap-2 transition-all">Practice now <ArrowRight className="w-4 h-4" /></span>
            </a>
            <a href="/skill-gap-analyzer" data-aos className="group relative bg-gradient-to-b from-slate-800/60 to-slate-800/30 border border-slate-700 rounded-2xl p-8 hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
                <TrendingUp className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Career gap analysis</h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-grow">See gaps between your skills and your target role. Get a clear roadmap to close them.</p>
              <span className="mt-4 inline-flex items-center gap-1 text-purple-400 font-semibold text-sm group-hover:gap-2 transition-all">Analyze gap <ArrowRight className="w-4 h-4" /></span>
            </a>
          </div>
          <div className="mt-10 text-center" data-aos>
            <a href="/learning-paths" className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-indigo-500/15 border-2 border-indigo-500/40 text-indigo-300 font-semibold hover:bg-indigo-500/25 hover:border-indigo-400/50 transition-all">
              <Zap className="w-5 h-5" /> Learning paths with mentor guidance – learn from experts
            </a>
          </div>
        </div>
      </section>

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
              <a href="/start-assessment" className="mt-4 inline-flex items-center gap-1 text-indigo-400 text-sm font-semibold group-hover:gap-2 transition-all">Start free <ArrowRight className="w-4 h-4" /></a>
            </div>

            {/* Card 2 */}
            <a href="/skill-gap-analyzer" data-aos className="group block bg-gradient-to-br from-slate-800/50 to-slate-800/20 border border-slate-700 rounded-2xl p-8 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-600/30 transition-all">
                <Target className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Freshers in IT</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Refresh your fundamentals and gain confidence. Score well in technical assessments.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-cyan-400 text-sm font-semibold group-hover:gap-2 transition-all">Find your gaps <ArrowRight className="w-4 h-4" /></span>
            </a>

            {/* Card 3 */}
            <a href="/learning-paths" data-aos className="group block bg-gradient-to-br from-slate-800/50 to-slate-800/20 border border-slate-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600/30 transition-all">
                <Briefcase className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Career Switchers</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Transition into tech confidently with structured guidance and real-world practice.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-purple-400 text-sm font-semibold group-hover:gap-2 transition-all">Explore paths <ArrowRight className="w-4 h-4" /></span>
            </a>
          </div>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section className="py-12 md:py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10" data-aos>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">How it works</h2>
            <p className="text-slate-400">Try free → See gaps → Enroll for full program</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600/20 via-cyan-600/20 to-transparent"></div>

            <div data-aos className="relative group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10">
                  <span className="text-2xl font-black">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Try free tools</h3>
                <p className="text-slate-400 text-sm">Assessment, ATS score, mocks — no signup. See where you stand.</p>
                <a href="/start-assessment" className="mt-2 inline-flex items-center gap-1 text-indigo-400 font-semibold text-sm">Start free <ArrowRight className="w-4 h-4" /></a>
              </div>
            </div>

            <div data-aos className="relative group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10">
                  <span className="text-2xl font-black">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Explore learning paths</h3>
                <p className="text-slate-400 text-sm">Mentor-led DSA, system design, interview prep.</p>
                <a href="/learning-paths" className="mt-2 inline-flex items-center gap-1 text-cyan-400 font-semibold text-sm">Explore <ArrowRight className="w-4 h-4" /></a>
              </div>
            </div>

            <div data-aos className="relative group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10">
                  <span className="text-2xl font-black">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Enroll in full program</h3>
                <p className="text-slate-400 text-sm">One fee: classes, mocks, 1:1 mentorship, placement support.</p>
                <a href="/upgrade" className="mt-2 inline-flex items-center gap-1 text-emerald-400 font-semibold text-sm">Enroll now <ArrowRight className="w-4 h-4" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === HOW TO ENROLL === */}
      <section className="py-12 md:py-16 px-6 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-3xl mx-auto text-center" data-aos>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">How to enroll</h2>
          <p className="text-slate-400 mb-8">Join the Complete Placement Program—full details and next steps are on our Enroll page. Click below and we’ll get you started.</p>
          <a href="/upgrade" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20">
            Enroll now — program details
          </a>
        </div>
      </section>

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
            <button 
              onClick={() => window.location.href = '/start-assessment'}
              className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2 group"
            >
              Start free assessment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => window.location.href = '/upgrade'}
              className="border-2 border-slate-500 text-slate-200 hover:border-white hover:text-white px-8 py-4 rounded-xl font-bold transition-all"
            >
              Enroll
            </button>
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
                <li><a href="/start-assessment" className="hover:text-white transition-colors">Assessment</a></li>
                <li><a href="/mock-interviews" className="hover:text-white transition-colors">Mock Interviews</a></li>
                <li><a href="/skill-gap-analyzer" className="hover:text-white transition-colors">Skill Analyzer</a></li>
                <li><a href="/resume-analyzer" className="hover:text-white transition-colors">Resume Analyzer</a></li>
              </ul>
            </div>

            {/* Column 2: Learning */}
            <div>
              <h4 className="font-bold text-white mb-4">Learning</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="/upgrade" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Enroll</a></li>
                <li><a href="/placement-tracks" className="hover:text-white transition-colors">Placement Tracks</a></li>
                <li><a href="/free-tutorials" className="hover:text-white transition-colors">Free Tutorials</a></li>
                <li><a href="/learning-paths" className="hover:text-white transition-colors">Learning Paths</a></li>
                <li><a href="/outcomes" className="hover:text-white transition-colors">Success Stories</a></li>
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
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
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
    </div>
  );
};

export default HomePage;