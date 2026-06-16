import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bell, Bot, Calendar, CheckCircle2, ChevronRight, Clock, ExternalLink,
  GraduationCap, LogOut, MessageSquare, Mic, Star, TrendingUp, Users, Video,
} from 'lucide-react';
import { requireRole, logout, getAllStudents } from '../../utils/auth';
import { getWorkflowState, getStudentStats, completeSession } from '../../utils/agentWorkflow';

export default function MentorDashboardNew() {
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [tab, setTab] = useState('today');
  const [, setTick] = useState(0);

  useEffect(() => {
    const s = requireRole('mentor');
    if (!s) { navigate('/login'); return; }
    setMentor(s);
  }, [navigate]);

  if (!mentor) return null;

  const students = getAllStudents();
  const myStudents = students.filter(s => {
    const wf = getWorkflowState(s.id);
    return wf && (wf.assignedMentor === mentor.name || wf.industryExpert === mentor.name);
  });

  const upcomingSessions = [];
  myStudents.forEach(s => {
    const wf = getWorkflowState(s.id);
    if (!wf) return;
    wf.sessions.filter(ss => ss.status === 'scheduled' && (ss.assignedMentor === mentor.name)).forEach(ss => {
      upcomingSessions.push({ ...ss, studentName: s.name, studentId: s.id });
    });
  });

  const completedSessions = [];
  myStudents.forEach(s => {
    const wf = getWorkflowState(s.id);
    if (!wf) return;
    wf.sessions.filter(ss => ss.status === 'completed' && ss.assignedMentor === mentor.name).forEach(ss => {
      completedSessions.push({ ...ss, studentName: s.name, studentId: s.id });
    });
  });

  const handleComplete = (studentId, sessionId) => {
    completeSession(studentId, sessionId, `Great session! ${mentor.name} feedback: Keep practicing and improving.`);
    setTick(t => t + 1);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const TABS = [
    { key: 'today', label: 'Today', icon: Calendar },
    { key: 'students', label: 'My Students', icon: GraduationCap },
    { key: 'completed', label: 'Completed', icon: CheckCircle2 },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--dashboard-bg)',
        color: 'var(--dashboard-text)',
      }}
    >
      <header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{
          borderBottomColor: 'var(--dashboard-border)',
          backgroundColor: 'var(--dashboard-bg)',
          opacity: 0.8,
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {mentor.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-bold">{mentor.name}</p>
              <p className="text-[10px] text-white/40">{mentor.specialty} · <Star size={10} className="inline text-amber-400" /> {mentor.rating}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-white/5 transition">
              <Bell size={18} className="text-white/50" />
              {upcomingSessions.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF9500]" />}
            </button>
            <Link to="/mentor/profile" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-white/50 hover:text-white/80 hover:bg-white/5 transition">
              👤 Profile
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-white/50 hover:text-white/80 hover:bg-white/5 transition">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div
            className="rounded-2xl p-4 text-center"
            style={{
              borderColor: 'var(--dashboard-border)',
              backgroundColor: 'var(--dashboard-bg-secondary)',
              borderWidth: '1px',
            }}
          >
            <p className="text-2xl font-bold text-white">{myStudents.length}</p>
            <p className="text-xs text-white/50">Assigned Students</p>
          </div>
          <div
            className="rounded-2xl p-4 text-center"
            style={{
              borderColor: 'var(--dashboard-border)',
              backgroundColor: 'var(--dashboard-bg-secondary)',
              borderWidth: '1px',
            }}
          >
            <p className="text-2xl font-bold text-[#FF9500]">{upcomingSessions.length}</p>
            <p className="text-xs text-white/50">Upcoming Sessions</p>
          </div>
          <div
            className="rounded-2xl p-4 text-center"
            style={{
              borderColor: 'var(--dashboard-border)',
              backgroundColor: 'var(--dashboard-bg-secondary)',
              borderWidth: '1px',
            }}
          >
            <p className="text-2xl font-bold text-emerald-400">{completedSessions.length}</p>
            <p className="text-xs text-white/50">Completed</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                tab === t.key ? 'bg-[#FF9500]/10 text-[#FF9500] border border-[#FF9500]/30' : 'text-white/40 hover:text-white/60 border border-transparent'
              }`}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {tab === 'today' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Upcoming Sessions</h2>
            {upcomingSessions.length === 0 ? (
              <div
                className="rounded-2xl p-8 text-center"
                style={{
                  borderColor: 'var(--dashboard-border)',
                  backgroundColor: 'var(--dashboard-bg-secondary)',
                  borderWidth: '1px',
                }}
              >
                <Calendar size={32} className="text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/40">No upcoming sessions. AI agent is scheduling...</p>
              </div>
            ) : (
              upcomingSessions.map(s => (
                <motion.div
                  key={`${s.studentId}-${s.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-5 flex items-center gap-4"
                  style={{
                    borderColor: 'var(--dashboard-border)',
                    backgroundColor: 'var(--dashboard-bg-secondary)',
                    borderWidth: '1px',
                  }}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    s.type === 'mock-interview' ? 'bg-cyan-500/20 text-cyan-400' :
                    s.type === 'mentorship' ? 'bg-violet-500/20 text-violet-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {s.type === 'mock-interview' ? <Mic size={20} /> : s.type === 'mentorship' ? <Users size={20} /> : <MessageSquare size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{s.label}</p>
                    <p className="text-xs text-white/40">with {s.studentName} · {s.duration} min · {s.mode} mode</p>
                    {s.scheduledDate && (
                      <p className="text-xs text-white/30 mt-1 flex items-center gap-1">
                        <Clock size={12} /> {new Date(s.scheduledDate).toLocaleString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {s.meetLink && (
                      <button className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 px-3 py-1.5 text-xs font-bold hover:bg-emerald-500/30 transition">
                        <Video size={14} /> Join
                      </button>
                    )}
                    <button onClick={() => handleComplete(s.studentId, s.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-[#FF9500]/20 text-[#FF9500] px-3 py-1.5 text-xs font-bold hover:bg-[#FF9500]/30 transition">
                      <CheckCircle2 size={14} /> Complete
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {tab === 'students' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">My Students ({myStudents.length})</h2>
            {myStudents.map(s => {
              const stats = getStudentStats(s.id);
              return (
                <div
                  key={s.id}
                  className="rounded-2xl p-5 flex items-center gap-4"
                  style={{
                    borderColor: 'var(--dashboard-border)',
                    backgroundColor: 'var(--dashboard-bg-secondary)',
                    borderWidth: '1px',
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {s.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{s.name}</p>
                    <p className="text-xs text-white/40">{s.college} · {s.targetRole}</p>
                  </div>
                  {stats && (
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{stats.completionPercent}%</p>
                      <p className="text-xs text-white/40">{stats.completed}/{stats.totalSessions} sessions</p>
                      {stats.avgScore > 0 && <p className="text-xs text-emerald-400">Avg: {stats.avgScore}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === 'completed' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Completed Sessions ({completedSessions.length})</h2>
            {completedSessions.map((s, i) => (
              <div
                key={i}
                className="rounded-xl p-4 flex items-center gap-3"
                style={{
                  borderColor: 'var(--dashboard-border)',
                  backgroundColor: 'var(--dashboard-bg-secondary)',
                  borderWidth: '1px',
                }}
              >
                <CheckCircle2 size={16} className="text-emerald-400" />
                <div className="flex-1">
                  <p className="text-sm text-white">{s.label} — {s.studentName}</p>
                  <p className="text-xs text-white/30">{s.feedback}</p>
                </div>
                {s.aiScore && <span className="text-sm font-bold text-emerald-400">{s.aiScore}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
