import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bell, BookOpen, Calendar, Clock, LogOut, Mic, Settings, Share2, Star,
  Target, TrendingUp, Users, Video, Award, MessageSquare, CheckCircle2,
} from 'lucide-react';
import RoutePageShell from '../layout/RoutePageShell';
import { requireRole, logout } from '../../utils/auth';
import { getMentorStats } from '../../utils/profileManager';

const EASE = [0.22, 1, 0.36, 1];

export default function MentorProfile() {
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    const s = requireRole('mentor');
    if (!s) { navigate('/login'); return; }
    setMentor(s);

    // Mock stats for demo
    const mockStats = {
      mentorId: s.id,
      totalSessions: 24,
      completedSessions: 24,
      mockInterviews: 8,
      mentorshipSessions: 10,
      doubtClearing: 6,
      studentsFeedback: [
        { studentName: 'Rahul Sharma', score: 4.8, feedback: 'Excellent guidance on system design', date: Date.now() - 86400000 },
        { studentName: 'Ananya Singh', score: 4.9, feedback: 'Best mentorship experience. Very supportive.', date: Date.now() - 172800000 },
        { studentName: 'Karthik Reddy', score: 4.7, feedback: 'Great mock interview feedback, helped me improve.', date: Date.now() - 259200000 },
      ],
      avgRating: 4.8,
      joinDate: Date.now() - 30*24*60*60*1000,
    };
    setStats(mockStats);
  }, [navigate]);

  if (!mentor || !stats) return null;

  const handleLogout = () => { logout(); navigate('/login'); };

  const TABS = [
    { key: 'overview', label: 'Overview', icon: Users },
    { key: 'students', label: 'My Students', icon: Target },
    { key: 'sessions', label: 'Sessions', icon: Calendar },
    { key: 'feedback', label: 'Feedback', icon: MessageSquare },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--dashboard-bg)',
        color: 'var(--dashboard-text)',
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{
          borderBottomColor: 'var(--dashboard-border)',
          backgroundColor: 'var(--dashboard-bg)',
          opacity: 0.8,
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {mentor.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-base font-bold">{mentor.name}</p>
              <p className="text-xs text-white/40">{mentor.specialty}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-white/5 transition">
              <Bell size={18} className="text-white/50" />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-white/50 hover:text-white/80 hover:bg-white/5 transition">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5"
            style={{
              borderColor: 'var(--dashboard-border)',
              borderWidth: '1px',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Mic size={18} className="text-cyan-400" />
              <span className="text-xs text-white/40">Mock Interviews</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.mockInterviews}</p>
            <p className="text-[10px] text-cyan-400 mt-1">conducted</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-violet-500/5 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Users size={18} className="text-violet-400" />
              <span className="text-xs text-white/40">Mentorships</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.mentorshipSessions}</p>
            <p className="text-[10px] text-violet-400 mt-1">1:1 sessions</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-5">
            <div className="flex items-center gap-3 mb-2">
              <HelpCircle size={18} className="text-amber-400" />
              <span className="text-xs text-white/40">Doubt Sessions</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.doubtClearing}</p>
            <p className="text-[10px] text-amber-400 mt-1">cleared</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Star size={18} className="text-emerald-400" />
              <span className="text-xs text-white/40">Avg Rating</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.avgRating}</p>
            <p className="text-[10px] text-emerald-400 mt-1">{stats.studentsFeedback.length} reviews</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                tab === t.key ? 'bg-[#FF9500]/10 text-[#FF9500] border border-[#FF9500]/30' : 'text-white/40 hover:text-white/60 border border-transparent'
              }`}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="space-y-6">
            {/* Profile info */}
            <div
              className="rounded-2xl p-8"
              style={{
                borderColor: 'var(--dashboard-border)',
                backgroundColor: 'var(--dashboard-bg-secondary)',
                borderWidth: '1px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Award size={20} className="text-[#FF9500]" /> Profile Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-white/40 mb-1">Name</p>
                  <p className="text-sm font-semibold text-white">{mentor.name}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Email</p>
                  <p className="text-sm font-semibold text-white">{mentor.email}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Specialty</p>
                  <p className="text-sm font-semibold text-white">{mentor.specialty}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Rating</p>
                  <p className="text-sm font-semibold text-white flex items-center gap-1">
                    <Star size={14} className="text-amber-400" /> {mentor.rating}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Member Since</p>
                  <p className="text-sm font-semibold text-white">
                    {new Date(stats.joinDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Calendar Link</p>
                  <p className="text-xs text-cyan-400 truncate">{mentor.calendarLink || 'Not set'}</p>
                </div>
              </div>
            </div>

            {/* Stats summary */}
            <div
              className="rounded-2xl p-8"
              style={{
                borderColor: 'var(--dashboard-border)',
                backgroundColor: 'var(--dashboard-bg-secondary)',
                borderWidth: '1px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-[#FF9500]" /> Performance Summary
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Total Sessions Completed</span>
                  <span className="text-2xl font-bold text-emerald-400">{stats.completedSessions}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                    style={{ width: `${Math.min((stats.completedSessions / 30) * 100, 100)}%` }} />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-3 rounded-lg bg-white/[0.02]">
                    <p className="text-sm text-white/40">Interview Rounds</p>
                    <p className="text-2xl font-bold text-cyan-400 mt-1">{stats.mockInterviews}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/[0.02]">
                    <p className="text-sm text-white/40">Mentorships</p>
                    <p className="text-2xl font-bold text-violet-400 mt-1">{stats.mentorshipSessions}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/[0.02]">
                    <p className="text-sm text-white/40">Doubts Cleared</p>
                    <p className="text-2xl font-bold text-amber-400 mt-1">{stats.doubtClearing}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'feedback' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <MessageSquare size={20} className="text-[#FF9500]" /> Student Feedback
            </h2>
            {stats.studentsFeedback.length === 0 ? (
              <div
              className="rounded-2xl p-8 text-center"
              style={{
                borderColor: 'var(--dashboard-border)',
                backgroundColor: 'var(--dashboard-bg-secondary)',
                borderWidth: '1px',
              }}
            >
                <p className="text-sm text-white/40">No feedback yet</p>
              </div>
            ) : (
              stats.studentsFeedback.map((fb, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl p-5"
                  style={{
                    borderColor: 'var(--dashboard-border)',
                    backgroundColor: 'var(--dashboard-bg-secondary)',
                    borderWidth: '1px',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-white">{fb.studentName}</p>
                      <p className="text-xs text-white/40">
                        {new Date(fb.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-amber-400 fill-amber-400" />
                      <span className="font-bold text-amber-400">{fb.score}</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/70">{fb.feedback}</p>
                </motion.div>
              ))
            )}
          </div>
        )}

        {tab === 'students' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Assigned Students (12)</h2>
            <p className="text-xs text-white/40">Mentoring these students through their placement journey</p>
            <div className="grid grid-cols-1 gap-3">
              {['Rahul Sharma', 'Ananya Singh', 'Karthik Reddy', 'Pooja Nair', 'Vikram Singh', 'Deepak Kumar'].map((name, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{name}</p>
                    <p className="text-xs text-white/40">6/12 sessions completed · 85% progress</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">85%</p>
                    <div className="w-20 h-1.5 rounded-full bg-white/10 mt-1">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                        style={{ width: '85%' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'sessions' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Recent Sessions</h2>
            <div className="space-y-3">
              {[
                { type: 'Mock Interview', student: 'Rahul Sharma', date: 'Today, 10:00 AM', status: 'completed', score: 88 },
                { type: 'Mentorship', student: 'Ananya Singh', date: 'Yesterday, 3:00 PM', status: 'completed', score: 92 },
                { type: 'Doubt Clearing', student: 'Karthik Reddy', date: '2 days ago', status: 'completed', score: 85 },
                { type: 'Mock Interview', student: 'Pooja Nair', date: 'Tomorrow, 2:00 PM', status: 'scheduled', score: null },
              ].map((session, i) => (
                <div key={i} className={`rounded-xl border p-4 flex items-center justify-between ${
                  session.status === 'completed' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/10 bg-white/5'
                }`}>
                  <div>
                    <p className="font-semibold text-white">{session.type}</p>
                    <p className="text-xs text-white/40">{session.student} · {session.date}</p>
                  </div>
                  {session.status === 'completed' ? (
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={14} /> {session.score}
                      </p>
                    </div>
                  ) : (
                    <Clock size={16} className="text-[#FF9500]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HelpCircle(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>;
}
