import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  PlayCircle, 
  FileUp, 
  Mail, 
  Settings, 
  LogOut,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const MentorDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    setIsAuthenticated(!!authToken);
    setLoading(false);
  }, []);

  // Mock Data for the Dashboard
  const [interviews] = useState([
    { id: 1, date: 'Jan 12, 2026', batch: 'Batch A', time: '10:00 AM', student: 'John', session: 'Mock 1' },
    { id: 2, date: 'Jan 13, 2026', batch: 'Batch B', time: '02:00 PM', student: 'Priya', session: 'Mock 2' },
  ]);

  const [students] = useState([
    { id: 1, name: 'John Doe', course: 'DSA Placement', status: 'Active' },
    { id: 2, name: 'Priya Singh', course: 'System Design', status: 'Active' },
    { id: 3, name: 'Rahul Verma', course: 'Full Stack', status: 'Completed' },
  ]);

  useEffect(() => {
    // Logic for setting the year
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  }, []);

  // Show authentication prompt if not authenticated
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB347] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-800/50 backdrop-blur border border-[#E0DCCF] rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF9500]/20 border border-[#FF9500]/35 mb-6">
            <AlertCircle size={32} className="text-[#FF9500]" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Authentication Required</h2>
          <p className="text-slate-300 mb-8">
            Please sign in to access your dashboard. Your dashboard shows your assessment progress, readiness score, and personalized learning recommendations.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/start-assessment'}
              className="w-full bg-gradient-to-r from-[#FF9500] to-[#E88600] hover:from-[#E88600] hover:to-[#E88600] text-white font-bold py-3 rounded-lg transition-all"
            >
              Start Free Assessment
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-white/10 hover:bg-white/20 border border-[#E0DCCF] text-white font-bold py-3 rounded-lg transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* HEADER / NAV */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex-shrink-0">
              <img src="/MentorMuni-React-Frontend/mentormuni-logo.png" alt="MentorMuni" className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full object-contain" />
            </a>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              <a href="/index.html" className="hover:text-[#FF9500] transition-colors">Home</a>
              <a href="/index.html#courses" className="hover:text-[#FF9500] transition-colors">Courses</a>
              <a href="/index.html#contact" className="hover:text-[#FF9500] transition-colors">Contact</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600"><Settings size={20} /></button>
            <div className="h-8 w-8 rounded-full bg-[#FF9500] flex items-center justify-center text-white text-xs font-bold">JD</div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Mentor Dashboard</h1>
          <p className="text-slate-500">Welcome back! Here is what's happening with your students.</p>
        </div>

        {/* QUICK ACTIONS SECTION */}
        <section className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 bg-[#FF9500] hover:bg-[#CC7000] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all active:scale-95">
              <PlayCircle size={20} /> Start Mock Interview
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-600 hover:text-[#FF9500] px-6 py-3 rounded-xl font-bold transition-all active:scale-95">
              <FileUp size={20} /> Upload Feedback
            </button>
          </div>
        </section>

        {/* DASHBOARD GRID */}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* UPCOMING INTERVIEWS */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Calendar className="text-[#FF9500]" size={20} /> Upcoming Interviews
              </h3>
              <span className="text-xs font-bold bg-[#FFF4E0] text-[#CC7000] px-2 py-1 rounded-md">
                {interviews.length} Scheduled
              </span>
            </div>
            <div className="divide-y divide-slate-50">
              {interviews.map((item) => (
                <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                  <div className="flex gap-6">
                    <div className="text-center min-w-[60px]">
                      <p className="text-xs font-bold text-slate-400 uppercase">{item.date.split(' ')[0]}</p>
                      <p className="text-xl font-black text-slate-900">{item.date.split(' ')[1].replace(',', '')}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.student} — {item.session}</h4>
                      <p className="text-sm text-slate-500">{item.batch} • {item.time}</p>
                    </div>
                  </div>
                  <button className="text-slate-300 group-hover:text-[#FF9500] transition-colors">
                    <ChevronRight size={24} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ASSIGNED STUDENTS */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Users className="text-[#FF9500]" size={20} /> Assigned Students
              </h3>
            </div>
            <div className="p-4 flex-grow space-y-3">
              {students.map((student) => (
                <div key={student.id} className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex items-center justify-between group hover:border-[#F0ECE0] hover:bg-white transition-all">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{student.name}</p>
                    <p className="text-xs text-slate-500">{student.course}</p>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-[#FF9500] hover:bg-[#FFF4E0] rounded-lg transition-all">
                    <Mail size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="p-4 mt-auto">
              <button className="w-full py-3 text-sm font-bold text-[#FF9500] bg-[#FFF4E0] rounded-xl hover:bg-[#FFF4E0] transition-colors">
                View All Students
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <img src="/MentorMuni-React-Frontend/mentormuni-logo.png" alt="MentorMuni" className="h-12 w-12 rounded-full object-contain mx-auto mb-6" />
              <p className="text-sm text-slate-500 leading-relaxed">Guiding your journey to knowledge through elite mentorship.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Courses</h4>
              <div className="flex flex-col gap-2 text-sm text-slate-500">
                <a href="#dsa" className="hover:text-[#FF9500]">DSA Placement</a>
                <a href="#system-design" className="hover:text-[#FF9500]">System Design</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Company</h4>
              <div className="flex flex-col gap-2 text-sm text-slate-500">
                <a href="/about" className="hover:text-[#FF9500]">About Us</a>
                <a href="/careers" className="hover:text-[#FF9500]">Careers</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Contact</h4>
              <div className="text-sm text-slate-500 space-y-1">
                <p>hello@mentormuni.com</p>
                <p>+91 98765 43210</p>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <p>© {new Date().getFullYear()} MentorMuni. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MentorDashboard;