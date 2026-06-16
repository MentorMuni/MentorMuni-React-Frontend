import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  Star,
  Video,
  Clock,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { getAllStudents } from '../../../utils/auth';
import { getWorkflowState, getStudentStats } from '../../../utils/agentWorkflow';

const EASE = [0.22, 1, 0.36, 1];

function StatCard({ icon: Icon, label, value, sub, color, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6 flex flex-col gap-3"
      style={{
        borderColor: 'var(--dashboard-border)',
        backgroundColor: 'var(--dashboard-bg-secondary)',
        backdropFilter: 'blur(4px)',
        borderWidth: '1px',
      }}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-3xl font-bold" style={{ color: 'var(--dashboard-text)' }}>
          {value}
        </p>
        <p className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
          {label}
        </p>
      </div>
      {(sub || trend) && (
        <div className="flex items-center gap-2">
          {trend && (
            <>
              <TrendingUp size={14} className="text-emerald-400" />
              <span className="text-xs text-emerald-400">{trend}</span>
            </>
          )}
          {sub && (
            <p className="text-xs text-white/50">{sub}</p>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function DashboardSection({ mentor, currentTab, onTabChange }) {
  const students = getAllStudents();
  const myStudents = students.filter(s => {
    const wf = getWorkflowState(s.id);
    return wf && (wf.assignedMentor === mentor.name || wf.industryExpert === mentor.name);
  });

  // Get upcoming sessions
  const upcomingSessions = [];
  myStudents.forEach(s => {
    const wf = getWorkflowState(s.id);
    if (!wf) return;
    wf.sessions.filter(ss => ss.status === 'scheduled' && ss.assignedMentor === mentor.name).forEach(ss => {
      upcomingSessions.push({ ...ss, studentName: s.name, studentId: s.id });
    });
  });

  const completedSessions = myStudents.reduce((acc, s) => {
    const wf = getWorkflowState(s.id);
    if (!wf) return acc;
    return acc + wf.sessions.filter(ss => ss.status === 'completed' && ss.assignedMentor === mentor.name).length;
  }, 0);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'upcoming', label: 'Upcoming' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          Your mentorship overview and upcoming sessions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b" style={{ borderColor: 'var(--dashboard-border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
              currentTab === tab.id
                ? 'border-[#FF9500] text-[#FF9500]'
                : 'border-transparent text-white/50 hover:text-white/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {currentTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              icon={Users}
              label="My Students"
              value={myStudents.length}
              color="bg-cyan-500/20 text-cyan-400"
              trend="+2 this month"
            />
            <StatCard
              icon={Calendar}
              label="Sessions Completed"
              value={completedSessions}
              color="bg-emerald-500/20 text-emerald-400"
              sub={`${upcomingSessions.length} upcoming`}
            />
            <StatCard
              icon={Star}
              label="Your Rating"
              value={`${mentor.rating}★`}
              color="bg-amber-500/20 text-amber-400"
              trend="4.9 avg rating"
            />
          </div>

          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6"
            style={{
              borderColor: 'var(--dashboard-border)',
              backgroundColor: 'var(--dashboard-bg-secondary)',
              borderWidth: '1px',
            }}
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--dashboard-text)' }}>
              <Clock size={20} style={{ color: '#FF9500' }} /> Upcoming Sessions
            </h2>
            {upcomingSessions.length === 0 ? (
              <p style={{ color: 'var(--dashboard-text-secondary)' }}>No upcoming sessions scheduled.</p>
            ) : (
              <div className="space-y-3">
                {upcomingSessions.slice(0, 3).map((session, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 transition"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      session.type === 'mock-interview' ? 'bg-cyan-500/20 text-cyan-400' :
                      session.type === 'mentorship' ? 'bg-violet-500/20 text-violet-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      <Calendar size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--dashboard-text)' }}>
                        {session.label} — {session.studentName}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
                        {session.scheduledDate ? new Date(session.scheduledDate).toLocaleString('en-IN') : 'No date set'}
                      </p>
                    </div>
                    {session.meetLink && (
                      <button className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition text-xs font-medium whitespace-nowrap">
                        Join
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Earnings Summary */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6"
            style={{
              borderColor: 'var(--dashboard-border)',
              backgroundColor: 'var(--dashboard-bg-secondary)',
              borderWidth: '1px',
            }}
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--dashboard-text)' }}>
              <TrendingUp size={20} style={{ color: '#FF9500' }} /> Earnings This Month
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>Total Earned</p>
                <p className="text-3xl font-bold text-emerald-400 mt-2">$1,050</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>Goal</p>
                <p className="text-3xl font-bold text-white/70 mt-2">$1,500</p>
              </div>
            </div>
            <div className="mt-4 w-full h-2 rounded-full bg-white/10">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"></div>
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--dashboard-text-secondary)' }}>70% of monthly goal</p>
          </motion.div>
        </div>
      )}

      {currentTab === 'upcoming' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl p-6"
          style={{
            borderColor: 'var(--dashboard-border)',
            backgroundColor: 'var(--dashboard-bg-secondary)',
            borderWidth: '1px',
          }}
        >
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--dashboard-text)' }}>
            All Upcoming Sessions
          </h2>
          {upcomingSessions.length === 0 ? (
            <p style={{ color: 'var(--dashboard-text-secondary)' }}>No upcoming sessions.</p>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((session, i) => (
                <div key={i} className="p-4 rounded-lg" style={{
                  borderColor: 'var(--dashboard-border)',
                  backgroundColor: 'var(--dashboard-bg)',
                  borderWidth: '1px',
                }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--dashboard-text)' }}>{session.label}</p>
                      <p className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>{session.studentName}</p>
                      <p className="text-xs mt-2" style={{ color: 'var(--dashboard-text-secondary)' }}>
                        {session.scheduledDate ? new Date(session.scheduledDate).toLocaleString('en-IN') : 'No date'}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
                      {session.duration} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
