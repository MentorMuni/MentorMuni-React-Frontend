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
  const logoSrc = `${import.meta.env.BASE_URL}mentormuni-logo.png`;
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
      <div className="min-h-screen mm-site-theme flex items-center justify-center">
        <div className="text-foreground text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9500] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen mm-site-theme text-foreground flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-border rounded-2xl p-8 text-center shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF9500]/15 border border-[#FF9500]/35 mb-6">
            <AlertCircle size={32} className="text-[#FF9500]" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-foreground">Authentication Required</h2>
          <p className="text-muted-foreground mb-8">
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
              className="w-full bg-[#FFF4E0] hover:bg-[#FFE8C2] border border-border text-foreground font-bold py-3 rounded-lg transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mm-site-theme flex flex-col text-foreground">
      
      {/* HEADER / NAV */}
      <header className="mm-sticky-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex-shrink-0">
              <img src={logoSrc} alt="MentorMuni" className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full object-contain" />
            </a>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
              <a href="/index.html" className="hover:text-[#FF9500] transition-colors">Home</a>
              <a href="/index.html#courses" className="hover:text-[#FF9500] transition-colors">Courses</a>
              <a href="/index.html#contact" className="hover:text-[#FF9500] transition-colors">Contact</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:text-muted-foreground"><Settings size={20} /></button>
            <div className="h-8 w-8 rounded-full bg-[#FF9500] flex items-center justify-center text-white text-xs font-bold">JD</div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Mentor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here is what's happening with your students.</p>
        </div>

        {/* QUICK ACTIONS SECTION */}
        <section className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Quick Actions</h3>
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
                      <p className="text-xs font-bold text-muted-foreground uppercase">{item.date.split(' ')[0]}</p>
                      <p className="text-xl font-black text-foreground">{item.date.split(' ')[1].replace(',', '')}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{item.student} — {item.session}</h4>
                      <p className="text-sm text-muted-foreground">{item.batch} • {item.time}</p>
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
                <div key={student.id} className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex items-center justify-between group hover:border-border hover:bg-white transition-all">
                  <div>
                    <p className="font-bold text-foreground text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.course}</p>
                  </div>
                  <button className="p-2 text-muted-foreground hover:text-[#FF9500] hover:bg-[#FFF4E0] rounded-lg transition-all">
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
              <img src={logoSrc} alt="MentorMuni" className="h-12 w-12 rounded-full object-contain mx-auto mb-6" />
              <p className="text-sm text-muted-foreground leading-relaxed">Guiding your journey to knowledge through elite mentorship.</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Courses</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="#dsa" className="hover:text-[#FF9500]">DSA Placement</a>
                <a href="#system-design" className="hover:text-[#FF9500]">System Design</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Company</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="/about" className="hover:text-[#FF9500]">About Us</a>
                <a href="/careers" className="hover:text-[#FF9500]">Careers</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Contact</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>hello@mentormuni.com</p>
                <p>+91 98765 43210</p>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
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