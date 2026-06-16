import { motion } from 'framer-motion';
import { TrendingUp, Target, Clock, CheckCircle2 } from 'lucide-react';
import { getStudentStats } from '../../../utils/agentWorkflow';

export default function ProgressSection({ student }) {
  const stats = getStudentStats(student.id);

  const progressItems = [
    { label: 'Sessions Completed', value: stats?.completed || 0, total: stats?.totalSessions || 12, icon: CheckCircle2, color: 'emerald' },
    { label: 'In Progress', value: 2, total: 12, icon: Clock, color: 'amber' },
    { label: 'Avg Session Score', value: stats?.avgScore ? `${stats.avgScore}/100` : 'N/A', icon: Target, color: 'cyan' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          Your Progress
        </h1>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          Track your learning and skill development
        </p>
      </div>

      {/* Progress Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {progressItems.map((item, i) => {
          const Icon = item.icon;
          const colorMap = {
            emerald: 'bg-emerald-500/20 text-emerald-400',
            amber: 'bg-amber-500/20 text-amber-400',
            cyan: 'bg-cyan-500/20 text-cyan-400',
          };

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-6"
              style={{
                borderColor: 'var(--dashboard-border)',
                backgroundColor: 'var(--dashboard-bg-secondary)',
                borderWidth: '1px',
              }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[item.color]} mb-4`}>
                <Icon size={24} />
              </div>
              <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
                {item.label}
              </p>
              <p className="text-3xl font-bold mt-2" style={{ color: 'var(--dashboard-text)' }}>
                {item.value}
              </p>
              {item.total && (
                <p className="text-xs mt-1" style={{ color: 'var(--dashboard-text-secondary)' }}>
                  of {item.total}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Progress */}
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
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--dashboard-text)' }}>
          <TrendingUp size={20} style={{ color: '#FF9500' }} /> Learning Path Progress
        </h2>

        <div className="space-y-4">
          {[
            { name: 'DSA Fundamentals', progress: 100, status: 'Completed' },
            { name: 'System Design', progress: 75, status: 'In Progress' },
            { name: 'Mock Interviews', progress: 60, status: 'In Progress' },
            { name: 'HR Preparation', progress: 40, status: 'Not Started' },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between mb-2">
                <p style={{ color: 'var(--dashboard-text)' }} className="text-sm font-semibold">
                  {item.name}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' :
                  item.status === 'In Progress' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-white/10 text-white/50'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.1 }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                />
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--dashboard-text-secondary)' }}>
                {item.progress}% complete
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
