import React from 'react';
import { CheckCircle2, ShieldCheck, HelpCircle, ArrowRight, MessageSquareQuote, Mail, Phone } from 'lucide-react';

const PricingPage = () => {
  const faqs = [
    {
      q: "What all is covered in this price?",
      a: "Every class, interview, all mentor access, AI tools, and counseling—no extra charge for any live session or mock."
    },
    {
      q: "What's not included?",
      a: "Only your internet & device! We do not upsell or hide costs after enrollment. Pure transparency."
    },
    {
      q: "Is there a job guarantee?",
      a: "Yes—fulfill program requirements, and if you don't get any qualifying offer, we refund you fully."
    },
    {
      q: "How do I pay?",
      a: "UPI, net banking, card, EMI, or RazorPay—all secure and receipt-backed."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F1F5F9] font-sans antialiased">
      <main>
        {/* HERO - matches homepage style */}
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
          <div className="relative max-w-4xl mx-auto text-center">
            <p className="text-emerald-300/90 text-sm font-semibold mb-4">How to enroll: Pick the program below → Click Enroll Now → We’ll get you started.</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400">
                Transparent Pricing
              </span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              All-in, 100% support. No hidden charges. Invest in results—guaranteed.
            </p>
          </div>
        </section>

        {/* PRICING CARD - dark card consistent with site */}
        <section className="max-w-6xl mx-auto px-6 -mt-4">
          <div className="flex justify-center">
            <div className="w-full max-w-xl bg-gradient-to-br from-slate-800/50 to-slate-800/20 border border-slate-700 rounded-2xl shadow-xl shadow-indigo-900/20 p-8 md:p-12 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full group-hover:bg-indigo-500/30 transition-all duration-700"></div>
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Complete Placement Program</h2>
                <div className="flex flex-wrap items-baseline gap-4 mb-8">
                  <span className="text-5xl font-black text-white tracking-tight">₹10,000</span>
                  <div className="bg-slate-900/80 backdrop-blur px-4 py-2 rounded-xl border border-slate-700">
                    <span className="text-indigo-400 font-bold text-sm">+ ₹2,000 registration</span>
                  </div>
                </div>
                <ul className="space-y-5 mb-10">
                  <PricingFeature text="Unlimited live & recorded classes" />
                  <PricingFeature text="AI mock interviews & resume review" />
                  <PricingFeature text="1:1 mentorship & project work" />
                  <PricingFeature text="Placement guarantee support" />
                </ul>
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xl font-bold py-5 rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 flex items-center justify-center gap-2 group active:scale-[0.98]"
                >
                  Enroll Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* GUARANTEE - dark card with emerald accent */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-6 py-3 rounded-xl font-bold text-lg md:text-xl mb-6">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              100% Placement Guidance till offer!
            </div>
            <p className="text-slate-400 text-lg">
              Finish the program and get continuous placement support until you land your first qualifying opportunity.
            </p>
          </div>
        </section>

        {/* TESTIMONIAL - same card style as homepage */}
        <section className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/20 border border-slate-700 rounded-2xl p-8 md:p-10 relative hover:border-indigo-500/30 transition-all">
            <MessageSquareQuote className="absolute top-6 right-8 text-slate-600 w-12 h-12" />
            <p className="text-xl font-bold text-slate-200 leading-relaxed mb-8 relative z-10">
              "My package doubled thanks to real mentors & AI mock interview practice. The placement team took care of everything!"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white border-2 border-indigo-500">NA</div>
              <div>
                <p className="font-bold text-white leading-none">Niharika A.</p>
                <p className="text-indigo-400 text-sm font-medium">Placed at HCL</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ - dark section and cards */}
        <section className="py-20 px-6 bg-gradient-to-b from-transparent to-slate-900/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Frequently Asked Questions</h2>
              <div className="h-1.5 w-20 bg-indigo-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-800/20 border border-slate-700 rounded-2xl p-8 hover:border-indigo-500/30 transition-all"
                >
                  <h4 className="flex items-center gap-3 text-lg font-bold text-white mb-4">
                    <HelpCircle className="text-indigo-400 w-5 h-5 flex-shrink-0" />
                    {faq.q}
                  </h4>
                  <p className="text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER - matches homepage */}
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
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

const PricingFeature = ({ text }) => (
  <li className="flex items-center gap-4 text-slate-300 font-medium text-lg">
    <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
    {text}
  </li>
);

export default PricingPage;
