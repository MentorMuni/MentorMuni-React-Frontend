import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Trophy,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { getAllStudents, getAllMentors } from '../../../utils/auth';
import { getWorkflowState } from '../../../utils/agentWorkflow';

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

export default function OverviewSection({ currentTab, onTabChange }) {
  const students = getAllStudents();
  const mentors = getAllMentors();

  // Calculate stats
  const totalStudents = students.length;
  const totalMentors = mentors.length;

  let activeSessions = 0;
  let totalSessions = 0;
  students.forEach(s => {
    const wf = getWorkflowState(s.id);
    if (wf) {
      activeSessions += wf.sessions.filter(ss => ss.status === 'scheduled').length;
      totalSessions += wf.sessions.length;
    }
  });

  const completionRate = totalStudents > 0
    ? Math.round(
        (students.filter(s => {
          const wf = getWorkflowState(s.id);
          return wf && wf.sessions.some(ss => ss.status === 'completed');
        }).length / totalStudents) * 100
      )
    : 0;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'activity', label: 'Activity' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          Platform overview and key metrics
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

      {/* Content based on tab */}
      {currentTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              label="Total Students"
              value={totalStudents}
              color="bg-cyan-500/20 text-cyan-400"
              trend="+12% this month"
            />
            <StatCard
              icon={Trophy}
              label="Active Mentors"
              value={totalMentors}
              color="bg-violet-500/20 text-violet-400"
              trend="+2 this month"
            />
            <StatCard
              icon={Calendar}
              label="Active Sessions"
              value={activeSessions}
              color="bg-amber-500/20 text-amber-400"
              sub={`${totalSessions} total`}
            />
            <StatCard
              icon={TrendingUp}
              label="Completion Rate"
              value={`${completionRate}%`}
              color="bg-emerald-500/20 text-emerald-400"
              trend="+5% from last month"
            />
          </div>

          {/* Recent Activity */}
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
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--dashboard-text)' }}>
              Recent Activity
            </h2>
            <div className="space-y-3">
              {[
                { icon: Activity, text: 'Student STU001 completed HR Training', time: '2 min ago', color: 'emerald' },
                { icon: Trophy, text: 'Mentor MENTOR03 received 4.9 rating from student', time: '10 min ago', color: 'violet' },
                { icon: Users, text: 'New enrollment: Karan Singh', time: '1 hour ago', color: 'cyan' },
                { icon: Calendar, text: 'Session scheduled: STU002 with MENTOR01', time: '2 hours ago', color: 'amber' },
              ].map((item, i) => {
                const Icon = item.icon;
                const colorMap = {
                  emerald: 'bg-emerald-500/20 text-emerald-400',
                  violet: 'bg-violet-500/20 text-violet-400',
                  cyan: 'bg-cyan-500/20 text-cyan-400',
                  amber: 'bg-amber-500/20 text-amber-400',
                };
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[item.color]}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm" style={{ color: 'var(--dashboard-text)' }}>
                        {item.text}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
                        {item.time}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}

      {currentTab === 'analytics' && (
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
            Analytics & Insights
          </h2>
          <p style={{ color: 'var(--dashboard-text-secondary)' }}>
            Charts and detailed analytics coming soon. This section will display student progress trends, mentor performance, and platform-wide metrics.
          </p>
        </motion.div>
      )}

      {currentTab === 'activity' && (
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
            Activity Log
          </h2>
          <p style={{ color: 'var(--dashboard-text-secondary)' }}>
            Detailed activity log showing all user actions, session completions, and system events.
          </p>
        </motion.div>
      )}
    </div>
  );
}
