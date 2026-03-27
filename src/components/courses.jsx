import React, { useState } from 'react';
import { Menu, X, CheckCircle2, ArrowRight, ChevronDown } from 'lucide-react';
import logo from '../assets/logo.png';

const CoursesPage = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);

  const courses = [
    {
      title: "Placement Preparation",
      meta: "All-rounder Program • 1 month",
      points: ["Live DSA and problem-solving", "Weekly coding tests & contests", "Mocks (technical + HR + AI)", "Grooming & Resume Projects"],
      price: "₹12,000",
      period: "/ month"
    },
    {
      title: "Mentorship+",
      meta: "Career + Tech Mentoring • 1 month",
      points: ["Industry mentor 1:1", "Regular evaluation calls", "AI skill & progress roadmap"],
      price: "₹5,500",
      period: "/ month"
    },
    {
      title: "HR Interview Mastery",
      meta: "Intensive • 1 month",
      points: ["Most-asked HR questions", "Mock panels & feedback", "Real placement experience sharing"],
      price: "₹4,000",
      period: ""
    },
    {
      title: "Technical Interview Track",
      meta: "Coding, DSA, Systems • 1 month",
      points: ["DSA/Problem-solving live", "Mock tech interviews (1:1)", "Doubt clearing & assignments"],
      price: "₹7,000",
      period: "/ month"
    },
    {
      title: "English Communication",
      meta: "Placement English • 4 weeks",
      points: ["Speaking, writing modules", "1:1 feedback, practice interviews", "Placement communication focus"],
      price: "₹3,000",
      period: ""
    },
    {
      title: "AI Interview Bootcamp",
      meta: "AI-powered mock interviews • 2 weeks",
      points: ["Get real-time AI feedback", "Unlimited test attempts", "Personalized improvement plan"],
      price: "₹1,800",
      period: ""
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#444444] font-sans antialiased">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-[100] bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#F0ECE0] px-5 py-2">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between py-2">
          <a href="/">
            <img src={logo} alt="MentorMuni" className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full object-contain transition-transform hover:scale-105" />
          </a>

          <nav className="hidden md:flex items-center gap-7">
            {['Home', 'Interview Readiness', 'Outcomes', 'Pricing', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`/${item.toLowerCase().replace(' ', '-')}`} 
                className="text-sm font-semibold text-[#666666] hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
            
            {/* Courses Dropdown */}
            <div className="relative group">
              <button className="text-sm font-semibold text-[#06B6D4] flex items-center gap-1 hover:text-white transition-colors">
                Courses
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-[#1E293B] border border-[#E0DCCF] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <a 
                  href="/courses" 
                  className="block px-4 py-3 text-sm font-semibold text-[#666666] hover:text-white hover:bg-white/5 first:rounded-t-lg transition-colors"
                >
                  Placement Tracks
                </a>
                <a 
                  href="/free-tutorials" 
                  className="block px-4 py-3 text-sm font-semibold text-[#666666] hover:text-white hover:bg-white/5 last:rounded-b-lg transition-colors"
                >
                  Free Tutorials
                </a>
              </div>
            </div>
          </nav>

          <button className="md:hidden text-white" onClick={() => setIsNavOpen(!isNavOpen)}>
            {isNavOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isNavOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#FFFDF8] border-b border-[#E0DCCF] p-5 flex flex-col gap-4 shadow-2xl">
            {['Home', 'Interview Readiness', 'Outcomes', 'Pricing', 'Contact'].map((item) => (
              <a key={item} href="#" className="font-bold text-[#666666] hover:text-white">{item}</a>
            ))}
            
            {/* Mobile Courses Dropdown */}
            <div className="border-t border-[#E0DCCF] pt-4">
              <button 
                onClick={() => setIsCoursesDropdownOpen(!isCoursesDropdownOpen)}
                className="font-bold text-[#06B6D4] hover:text-white flex items-center gap-2 w-full"
              >
                Courses
                <ChevronDown size={16} className={isCoursesDropdownOpen ? 'rotate-180' : ''} />
              </button>
              {isCoursesDropdownOpen && (
                <div className="pl-4 space-y-2 pt-2">
                  <a href="/courses" className="block text-sm font-semibold text-[#666666] hover:text-white p-2">Placement Tracks</a>
                  <a href="/free-tutorials" className="block text-sm font-semibold text-[#666666] hover:text-white p-2">Free Tutorials</a>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-[1200px] mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-white to-[#94A3B8] bg-clip-text text-transparent">
            Our Placement Courses
          </h2>
          <p className="text-[#666666] text-lg max-w-2xl mx-auto">
            AI-powered training and mentorship for all-round placement prep.
          </p>
        </div>

        {/* --- COURSE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <article 
              key={index} 
              className="group bg-gradient-to-br from-[#1a2234] to-[#141b28] border border-[#F0ECE0] rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:border-[#06B6D4]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-[#06B6D4] transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs font-bold uppercase tracking-widest text-[#06B6D4] mb-6 opacity-80">
                  {course.meta}
                </p>
                <ul className="space-y-4 mb-8">
                  {course.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[#666666] text-sm">
                      <CheckCircle2 size={18} className="text-[#FF9500] shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-[#F0ECE0] flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-white">{course.price}</span>
                  <span className="text-xs text-[#666666] ml-1">{course.period}</span>
                </div>
                <a 
                  href="/contact" 
                  className="bg-white/5 hover:bg-[#06B6D4] text-white p-3 rounded-full transition-all group-hover:px-6 flex items-center gap-2"
                >
                  <span className="hidden group-hover:block text-sm font-bold">Enroll</span>
                  <ArrowRight size={20} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#FFF8EE] border-t border-[#F0ECE0] pt-16 pb-8 px-6">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1">
            <img src={logo} alt="MentorMuni" className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-contain mb-6" />
            <p className="text-[#666666] text-sm leading-relaxed">Guiding your journey to knowledge and professional excellence.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Courses</h4>
            <a href="/courses" className="text-[#666666] text-sm hover:text-[#06B6D4] block mb-2">All Courses</a>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Company</h4>
            <a href="/about" className="text-[#666666] text-sm hover:text-[#06B6D4] block mb-2">About Us</a>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Support</h4>
            <p className="text-[#666666] text-sm mb-2">enroll@mentormuni.com</p>
            <p className="text-[#666666] text-sm">+91 91464 21302</p>
          </div>
        </div>
        <div className="text-center text-[#475569] text-xs pt-8 border-t border-[#F0ECE0]">
          © {new Date().getFullYear()} MentorMuni. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default CoursesPage;