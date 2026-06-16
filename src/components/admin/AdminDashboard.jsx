import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Bell, Bot, Calendar, CheckCircle2, ChevronRight, Clock,
  Copy, GraduationCap, LayoutDashboard, LogOut, Mic, Play, Plus, Search,
  Settings, Shield, Star, TrendingUp, Trash2, UserPlus, Users, Video, X, Zap,
} from 'lucide-react';
import { requireRole, logout, getAllMentors, getAllStudents, SESSION_PLAN } from '../../utils/auth';
import { getWorkflowState, initializeStudentWorkflow, getStudentStats } from '../../utils/agentWorkflow';
import {
  createStudentCredential, createMentorCredential, getAllStoredStudents,
  getAllStoredMentors, deleteStudent, deleteMentor, assignMentorToStudent,
} from '../../utils/authManager';

const EASE = [0.22, 1, 0.36, 1];

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 flex flex-col gap-2"
      style={{
        borderColor: 'var(--dashboard-border)',
        backgroundColor: 'var(--dashboard-bg-secondary)',
        backdropFilter: 'blur(4px)',
        borderWidth: '1px',
      }}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-white/60">{label}</p>
      {sub && <p className="text-xs text-emerald-400">{sub}</p>}
    </motion.div>
  );
}

function StudentRow({ student, onEnroll }) {
  const wf = getWorkflowState(student.id);
  const stats = wf ? getStudentStats(student.id) : null;

  return (
    <div
      className="flex items-center gap-4 rounded-xl p-4 transition"
      style={{
        borderColor: 'var(--dashboard-border)',
        backgroundColor: 'var(--dashboard-bg-secondary)',
        borderWidth: '1px',
      }}
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
        {student.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: 'var(--dashboard-text)' }}>
          {student.name}
        </p>
        <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
          {student.college} · {student.targetRole}
        </p>
      </div>
      {stats ? (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-white/50">{stats.completed}/{stats.totalSessions} done</p>
            <div className="w-20 h-1.5 rounded-full bg-white/10 mt-1">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all"
                style={{ width: `${stats.completionPercent}%` }} />
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
            stats.phase === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
            stats.phase === 'advanced' ? 'bg-blue-500/20 text-blue-400' :
            'bg-amber-500/20 text-amber-400'
          }`}>{stats.phase}</span>
        </div>
      ) : (
        <button onClick={() => onEnroll(student.id)}
          className="flex items-center gap-1.5 rounded-lg bg-[#FF9500] px-3 py-1.5 text-xs font-bold text-black hover:bg-[#FFa520] transition">
          <UserPlus size={14} /> Enroll & Assign
        </button>
      )}
    </div>
  );
}

function MentorRow({ mentor }) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl p-4"
      style={{
        borderColor: 'var(--dashboard-border)',
        backgroundColor: 'var(--dashboard-bg-secondary)',
        borderWidth: '1px',
      }}
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
        {mentor.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: 'var(--dashboard-text)' }}>
          {mentor.name}
        </p>
        <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
          {mentor.specialty}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs text-white/50">{mentor.studentsAssigned} students</p>
        <p className="text-xs text-amber-400">★ {mentor.rating}</p>
      </div>
    </div>
  );
}

function AgentActivityFeed() {
  const activities = [
    { icon: Bot, text: 'AI Agent auto-scheduled Mock #1 for STU001', time: '2 min ago', color: 'text-cyan-400' },
    { icon: UserPlus, text: 'STU003 enrolled → assigned to Priya Mehta', time: '10 min ago', color: 'text-emerald-400' },
    { icon: Calendar, text: 'Mentor calendar synced — 3 new slots available', time: '25 min ago', color: 'text-violet-400' },
    { icon: CheckCircle2, text: 'STU002 completed HR Training (AI score: 87)', time: '1 hr ago', color: 'text-amber-400' },
    { icon: Video, text: 'AI Mentor room: 4 active student sessions', time: '1 hr ago', color: 'text-pink-400' },
    { icon: Zap, text: 'Workflow engine processed 12 session transitions', time: '2 hr ago', color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-white/80 flex items-center gap-2"><Zap size={16} className="text-[#FF9500]" /> AI Agent Activity</h3>
      {activities.map((a, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-start gap-3 rounded-lg p-3"
          style={{
            borderColor: 'var(--dashboard-border-light)',
            backgroundColor: 'var(--dashboard-bg-secondary)',
            borderWidth: '1px',
          }}
        >
          <a.icon size={16} className={a.color} />
          <div className="flex-1">
            <p className="text-xs text-white/70">{a.text}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{a.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [tab, setTab] = useState('overview');
  const [createStudentOpen, setCreateStudentOpen] = useState(false);
  const [createMentorOpen, setCreateMentorOpen] = useState(false);
  const [storedStudents, setStoredStudents] = useState([]);
  const [storedMentors, setStoredMentors] = useState([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const s = requireRole('admin');
    if (!s) { navigate('/login'); return; }
    setAdmin(s);
    getAllStudents().forEach(st => initializeStudentWorkflow(st.id));
    loadLists();
  }, [navigate, tick]);

  const loadLists = () => {
    setStoredStudents(getAllStoredStudents());
    setStoredMentors(getAllStoredMentors());
  };

  if (!admin) return null;

  const students = getAllStudents();
  const mentors = getAllMentors();
  const allStats = students.map(s => getStudentStats(s.id)).filter(Boolean);
  const totalCompleted = allStats.reduce((a, s) => a + s.completed, 0);
  const totalSessions = allStats.reduce((a, s) => a + s.totalSessions, 0);
  const avgCompletion = allStats.length ? Math.round(allStats.reduce((a, s) => a + s.completionPercent, 0) / allStats.length) : 0;

  const handleEnroll = (studentId) => {
    initializeStudentWorkflow(studentId);
    setTab('students');
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleStudentCreated = () => {
    setCreateStudentOpen(false);
    setTick(t => t + 1);
  };

  const handleMentorCreated = () => {
    setCreateMentorOpen(false);
    setTick(t => t + 1);
  };

  function CreateStudentModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', email: '', college: '', targetRole: '', batch: '' });
  const [created, setCreated] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cred = createStudentCredential(form);
    setCreated(cred);
    setForm({ name: '', email: '', college: '', targetRole: '', batch: '' });
    onCreated();
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setCreated(null);
    setCopied(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button type="button" className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <div className="bg-[#0c0c14] border border-white/10 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">{created ? 'Student Created ✓' : 'Create Student'}</h2>
                <button onClick={handleClose} className="p-1 rounded-lg hover:bg-white/5"><X size={18} /></button>
              </div>

              {!created ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">Name</label>
                    <input type="text" required placeholder="Full name"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9500]/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">Email</label>
                    <input type="email" required placeholder="student@college.edu"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9500]/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">College</label>
                    <input type="text" required placeholder="IIT Delhi"
                      value={form.college} onChange={e => setForm({ ...form, college: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9500]/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">Target Role</label>
                    <input type="text" required placeholder="Software Engineer"
                      value={form.targetRole} onChange={e => setForm({ ...form, targetRole: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9500]/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">Batch</label>
                    <input type="text" required placeholder="Placement Batch 2026"
                      value={form.batch} onChange={e => setForm({ ...form, batch: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9500]/50" />
                  </div>
                  <button type="submit" className="w-full bg-[#FF9500] text-black font-bold py-2 rounded-lg hover:bg-[#FFa520] transition mt-4">
                    Generate Credentials
                  </button>
                </form>
              ) : (
                <div className="space-y-4 py-4">
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 space-y-3">
                    <p className="text-sm text-white/80"><strong>Student ID:</strong> {created.id}</p>
                    <p className="text-sm text-white/80"><strong>Password:</strong> <code className="bg-black/50 px-2 py-1 rounded text-[11px]">{created.password}</code></p>
                    <p className="text-sm text-white/80"><strong>Email:</strong> {created.email}</p>
                    <button onClick={() => handleCopy(`ID: ${created.id}\nPassword: ${created.password}`)}
                      className="w-full flex items-center justify-center gap-2 bg-[#FF9500]/20 text-[#FF9500] py-2 rounded-lg text-xs font-bold hover:bg-[#FF9500]/30 transition">
                      <Copy size={14} /> {copied ? 'Copied!' : 'Copy Credentials'}
                    </button>
                  </div>
                  <p className="text-[10px] text-white/40 text-center">Share these credentials with the student. They can login at /login with Student role.</p>
                  <button onClick={handleClose} className="w-full bg-white/10 text-white py-2 rounded-lg hover:bg-white/15 transition font-bold">
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CreateMentorModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', email: '', specialty: '', rating: 4.8, calendarLink: '' });
  const [created, setCreated] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cred = createMentorCredential(form);
    setCreated(cred);
    setForm({ name: '', email: '', specialty: '', rating: 4.8, calendarLink: '' });
    onCreated();
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setCreated(null);
    setCopied(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button type="button" className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <div className="bg-[#0c0c14] border border-white/10 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">{created ? 'Mentor Created ✓' : 'Create Mentor'}</h2>
                <button onClick={handleClose} className="p-1 rounded-lg hover:bg-white/5"><X size={18} /></button>
              </div>

              {!created ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">Name</label>
                    <input type="text" required placeholder="Full name"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9500]/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">Email</label>
                    <input type="email" required placeholder="mentor@mentormuni.com"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9500]/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">Specialty</label>
                    <input type="text" required placeholder="DSA & System Design"
                      value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9500]/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">Rating (4.0 - 5.0)</label>
                    <input type="number" min="4" max="5" step="0.1" required placeholder="4.8"
                      value={form.rating} onChange={e => setForm({ ...form, rating: parseFloat(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9500]/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">Calendar Link (Google Meet/Calendly)</label>
                    <input type="url" placeholder="https://calendly.com/mentor"
                      value={form.calendarLink} onChange={e => setForm({ ...form, calendarLink: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9500]/50" />
                  </div>
                  <button type="submit" className="w-full bg-[#FF9500] text-black font-bold py-2 rounded-lg hover:bg-[#FFa520] transition mt-4">
                    Generate Credentials
                  </button>
                </form>
              ) : (
                <div className="space-y-4 py-4">
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 space-y-3">
                    <p className="text-sm text-white/80"><strong>Mentor ID:</strong> {created.id}</p>
                    <p className="text-sm text-white/80"><strong>Password:</strong> <code className="bg-black/50 px-2 py-1 rounded text-[11px]">{created.password}</code></p>
                    <p className="text-sm text-white/80"><strong>Email:</strong> {created.email}</p>
                    <p className="text-sm text-white/80"><strong>Specialty:</strong> {created.specialty}</p>
                    <button onClick={() => handleCopy(`ID: ${created.id}\nPassword: ${created.password}`)}
                      className="w-full flex items-center justify-center gap-2 bg-[#FF9500]/20 text-[#FF9500] py-2 rounded-lg text-xs font-bold hover:bg-[#FF9500]/30 transition">
                      <Copy size={14} /> {copied ? 'Copied!' : 'Copy Credentials'}
                    </button>
                  </div>
                  <p className="text-[10px] text-white/40 text-center">Share these credentials with the mentor. They can login at /login with Mentor role.</p>
                  <button onClick={handleClose} className="w-full bg-white/10 text-white py-2 rounded-lg hover:bg-white/15 transition font-bold">
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const TABS = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'students', label: 'Students', icon: GraduationCap },
    { key: 'mentors', label: 'Mentors', icon: Users },
    { key: 'agents', label: 'AI Agents', icon: Bot },
    { key: 'enroll', label: 'Enroll New', icon: UserPlus },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--dashboard-bg)',
        color: 'var(--dashboard-text)',
      }}
    >
      {/* Top bar */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{
          borderBottomColor: 'var(--dashboard-border)',
          backgroundColor: 'var(--dashboard-bg)',
          opacity: 0.8,
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex items-center justify-center">
              <Shield size={18} className="text-black" />
            </div>
            <div>
              <p className="text-sm font-bold">MentorMuni Admin</p>
              <p className="text-[10px] text-white/40">Agentic Workflow Control Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-white/5 transition">
              <Bell size={18} className="text-white/50" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF9500]" />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-white/50 hover:text-white/80 hover:bg-white/5 transition">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tab nav */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all ${
                tab === t.key ? 'bg-[#FF9500]/10 text-[#FF9500] border border-[#FF9500]/30' : 'text-white/40 hover:text-white/60 hover:bg-white/5 border border-transparent'
              }`}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={GraduationCap} label="Total Students" value={students.length} sub="+2 this week" color="bg-cyan-500/20 text-cyan-400" />
              <StatCard icon={Users} label="Active Mentors" value={mentors.length} color="bg-violet-500/20 text-violet-400" />
              <StatCard icon={CheckCircle2} label="Sessions Done" value={totalCompleted} sub={`of ${totalSessions}`} color="bg-emerald-500/20 text-emerald-400" />
              <StatCard icon={TrendingUp} label="Avg Progress" value={`${avgCompletion}%`} color="bg-amber-500/20 text-amber-400" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Workflow pipeline */}
              <div
                className="rounded-2xl p-6"
                style={{
                  borderColor: 'var(--dashboard-border)',
                  backgroundColor: 'var(--dashboard-bg-secondary)',
                  backdropFilter: 'blur(4px)',
                  borderWidth: '1px',
                }}
              >
                <h3 className="text-sm font-bold text-white/80 mb-4 flex items-center gap-2">
                  <Play size={16} className="text-emerald-400" /> Session Pipeline
                </h3>
                <div className="space-y-2">
                  {SESSION_PLAN.map(s => {
                    const completedCount = allStats.length ? students.filter(st => {
                      const wf = getWorkflowState(st.id);
                      return wf?.sessions.find(ss => ss.id === s.id)?.status === 'completed';
                    }).length : 0;
                    return (
                      <div key={s.id} className="flex items-center gap-3 text-xs">
                        <span className={`w-2 h-2 rounded-full ${s.mode === 'ai' ? 'bg-cyan-400' : s.mode === 'hybrid' ? 'bg-violet-400' : 'bg-amber-400'}`} />
                        <span className="flex-1 text-white/60 truncate">{s.label}</span>
                        <span className="text-white/30">{completedCount}/{students.length}</span>
                        <div className="w-16 h-1 rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                            style={{ width: `${students.length ? (completedCount / students.length) * 100 : 0}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Agent feed */}
              <div
                className="rounded-2xl p-6"
                style={{
                  borderColor: 'var(--dashboard-border)',
                  backgroundColor: 'var(--dashboard-bg-secondary)',
                  backdropFilter: 'blur(4px)',
                  borderWidth: '1px',
                }}
              >
                <AgentActivityFeed />
              </div>
            </div>
          </div>
        )}

        {tab === 'students' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <GraduationCap size={20} className="text-cyan-400" /> Students ({students.length})
              </h2>
              <button onClick={() => setCreateStudentOpen(true)}
                className="flex items-center gap-2 bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-cyan-500/30 transition">
                <Plus size={14} /> Add Student
              </button>
            </div>

            {/* Students list with detailed stats */}
            {students.map(s => {
              const wf = getWorkflowState(s.id);
              const stats = wf ? getStudentStats(s.id) : null;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-6 space-y-4"
                  style={{
                    borderColor: 'var(--dashboard-border)',
                    backgroundColor: 'var(--dashboard-bg-secondary)',
                    borderWidth: '1px',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{s.name}</p>
                        <p className="text-xs text-white/40">{s.email}</p>
                        <p className="text-xs text-white/30 mt-1">{s.college} · {s.targetRole}</p>
                        {wf && <p className="text-[10px] text-[#FF9500] mt-1">Mentor: {wf.assignedMentor}</p>}
                      </div>
                    </div>
                    {stats && (
                      <div className="text-right">
                        <p className="text-xs text-white/40">Progress</p>
                        <p className="text-2xl font-bold text-white mt-1">{stats.completionPercent}%</p>
                        <p className="text-[10px] text-emerald-400 mt-1 capitalize">{stats.phase}</p>
                      </div>
                    )}
                  </div>

                  {stats && (
                    <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
                      <div className="text-center">
                        <p className="text-[10px] text-white/40">Total</p>
                        <p className="text-lg font-bold text-white">{stats.totalSessions}</p>
                        <p className="text-[9px] text-white/30">sessions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-white/40">Done</p>
                        <p className="text-lg font-bold text-emerald-400">{stats.completed}</p>
                        <p className="text-[9px] text-white/30">completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-white/40">Scheduled</p>
                        <p className="text-lg font-bold text-[#FF9500]">{stats.scheduled}</p>
                        <p className="text-[9px] text-white/30">upcoming</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-white/40">Avg Score</p>
                        <p className="text-lg font-bold text-cyan-400">{stats.avgScore || '-'}</p>
                        <p className="text-[9px] text-white/30">from AI</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {!wf && (
                      <button onClick={() => handleEnroll(s.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#FF9500]/20 text-[#FF9500] py-2 rounded-lg text-xs font-bold hover:bg-[#FF9500]/30 transition">
                        <Plus size={14} /> Enroll & Assign
                      </button>
                    )}
                    <button className="flex-1 bg-white/5 text-white/60 py-2 rounded-lg text-xs font-bold hover:bg-white/10 transition">
                      Edit Profile
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {tab === 'mentors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Users size={20} className="text-violet-400" /> Mentors ({mentors.length})
              </h2>
              <button onClick={() => setCreateMentorOpen(true)}
                className="flex items-center gap-2 bg-violet-500/20 text-violet-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-violet-500/30 transition">
                <Plus size={14} /> Add Mentor
              </button>
            </div>

            {/* Mentors list with detailed stats */}
            {mentors.map(m => {
              const assignedCount = students.filter(s => {
                const wf = getWorkflowState(s.id);
                return wf && wf.assignedMentor === m.name;
              }).length;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-6 space-y-4"
                  style={{
                    borderColor: 'var(--dashboard-border)',
                    backgroundColor: 'var(--dashboard-bg-secondary)',
                    borderWidth: '1px',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {m.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{m.name}</p>
                        <p className="text-xs text-white/40">{m.email}</p>
                        <p className="text-xs text-white/30 mt-1">{m.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <p className="text-sm font-bold text-amber-400">{m.rating}</p>
                      </div>
                      <p className="text-[10px] text-white/40 mt-1">{assignedCount} students</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
                    <div className="text-center">
                      <p className="text-[10px] text-white/40">Mocks</p>
                      <p className="text-lg font-bold text-cyan-400">12</p>
                      <p className="text-[9px] text-white/30">interviews</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-white/40">Mentorships</p>
                      <p className="text-lg font-bold text-violet-400">8</p>
                      <p className="text-[9px] text-white/30">1:1 sessions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-white/40">Doubts</p>
                      <p className="text-lg font-bold text-amber-400">6</p>
                      <p className="text-[9px] text-white/30">cleared</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-white/40">Total</p>
                      <p className="text-lg font-bold text-emerald-400">{assignedCount}</p>
                      <p className="text-[9px] text-white/30">assigned</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 bg-violet-500/20 text-violet-400 py-2 rounded-lg text-xs font-bold hover:bg-violet-500/30 transition">
                      View Profile
                    </button>
                    <button className="flex-1 bg-white/5 text-white/60 py-2 rounded-lg text-xs font-bold hover:bg-white/10 transition">
                      Edit
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {tab === 'agents' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2"><Bot size={20} className="text-[#FF9500]" /> AI Agent Orchestrator</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: 'Enrollment Agent', desc: 'Auto-assigns mentors & creates session plan on student signup', status: 'active', icon: UserPlus },
                { name: 'Scheduling Agent', desc: 'Picks optimal slots from mentor calendars, sends invites', status: 'active', icon: Calendar },
                { name: 'Mock Interview Agent', desc: 'Conducts AI-powered technical & HR mock interviews', status: 'active', icon: Mic },
                { name: 'Feedback Agent', desc: 'Generates detailed feedback & scores after each session', status: 'active', icon: BarChart3 },
                { name: 'Escalation Agent', desc: 'Routes stuck students to human mentors automatically', status: 'active', icon: TrendingUp },
                { name: 'AI Mentor Room', desc: '24/7 always-on AI mentor for placement queries', status: 'active', icon: Video },
              ].map(agent => (
                <div
                  key={agent.name}
                  className="rounded-2xl p-5 space-y-3"
                  style={{
                    borderColor: 'var(--dashboard-border)',
                    backgroundColor: 'var(--dashboard-bg-secondary)',
                    borderWidth: '1px',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FF9500]/10 flex items-center justify-center">
                      <agent.icon size={18} className="text-[#FF9500]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{agent.name}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {agent.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-white/50">{agent.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'enroll' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Create Student */}
              <div
                className="rounded-2xl p-8 text-center space-y-4"
                style={{
                  borderColor: 'var(--dashboard-border)',
                  backgroundColor: 'var(--dashboard-bg-secondary)',
                  backdropFilter: 'blur(4px)',
                  borderWidth: '1px',
                }}
              >
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center mx-auto">
                  <GraduationCap size={32} className="text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Add New Student</h3>
                <p className="text-sm text-white/50">Create login credentials for a student to start their placement journey.</p>
                <button onClick={() => setCreateStudentOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-cyan-500/20 text-cyan-400 px-4 py-3 rounded-lg font-bold hover:bg-cyan-500/30 transition">
                  <Plus size={18} /> Create Student
                </button>
              </div>

              {/* Create Mentor */}
              <div
                className="rounded-2xl p-8 text-center space-y-4"
                style={{
                  borderColor: 'var(--dashboard-border)',
                  backgroundColor: 'var(--dashboard-bg-secondary)',
                  backdropFilter: 'blur(4px)',
                  borderWidth: '1px',
                }}
              >
                <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mx-auto">
                  <Users size={32} className="text-violet-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Add New Mentor</h3>
                <p className="text-sm text-white/50">Create login credentials for a mentor to guide students.</p>
                <button onClick={() => setCreateMentorOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-violet-500/20 text-violet-400 px-4 py-3 rounded-lg font-bold hover:bg-violet-500/30 transition">
                  <Plus size={18} /> Create Mentor
                </button>
              </div>
            </div>

            {/* Enrollment Summary */}
            <div className="grid md:grid-cols-2 gap-6">
              <div
                className="rounded-2xl p-6"
                style={{
                  borderColor: 'var(--dashboard-border)',
                  backgroundColor: 'var(--dashboard-bg-secondary)',
                  borderWidth: '1px',
                }}
              >
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <GraduationCap size={16} className="text-cyan-400" /> Created Students ({storedStudents.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {storedStudents.length === 0 ? (
                    <p className="text-xs text-white/30 text-center py-4">No custom students yet</p>
                  ) : (
                    storedStudents.map(s => (
                      <div key={s.id} className="flex items-center justify-between rounded-lg bg-white/5 p-3 text-xs border border-white/5">
                        <div>
                          <p className="font-semibold text-white truncate">{s.name}</p>
                          <p className="text-white/40 truncate">{s.id}</p>
                        </div>
                        <button onClick={() => { deleteStudent(s.id); setTick(t => t + 1); }}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div
                className="rounded-2xl p-6"
                style={{
                  borderColor: 'var(--dashboard-border)',
                  backgroundColor: 'var(--dashboard-bg-secondary)',
                  borderWidth: '1px',
                }}
              >
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Users size={16} className="text-violet-400" /> Created Mentors ({storedMentors.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {storedMentors.length === 0 ? (
                    <p className="text-xs text-white/30 text-center py-4">No custom mentors yet</p>
                  ) : (
                    storedMentors.map(m => (
                      <div key={m.id} className="flex items-center justify-between rounded-lg bg-white/5 p-3 text-xs border border-white/5">
                        <div>
                          <p className="font-semibold text-white truncate">{m.name}</p>
                          <p className="text-white/40 truncate">{m.specialty}</p>
                        </div>
                        <button onClick={() => { deleteMentor(m.id); setTick(t => t + 1); }}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <CreateStudentModal open={createStudentOpen} onClose={() => setCreateStudentOpen(false)} onCreated={handleStudentCreated} />
      <CreateMentorModal open={createMentorOpen} onClose={() => setCreateMentorOpen(false)} onCreated={handleMentorCreated} />
    </div>
  );
}
