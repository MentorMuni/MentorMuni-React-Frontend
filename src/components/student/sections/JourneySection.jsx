import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Video, Users, MessageSquare, Lock } from 'lucide-react';
import { getWorkflowState, getStudentStats } from '../../../utils/agentWorkflow';

export default function JourneySection({ student }) {
  const wf = getWorkflowState(student.id);
  const stats = getStudentStats(student.id);

  if (!wf) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
            Your Placement Journey
          </h1>
          <p style={{ color: 'var(--dashboard-text-secondary)' }}>
            Start your 12-week journey to placement success
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-12 text-center"
          style={{
            borderColor: 'var(--dashboard-border)',
            backgroundColor: 'var(--dashboard-bg-secondary)',
            borderWidth: '1px',
          }}
        >
          <p style={{ color: 'var(--dashboard-text-secondary)' }}>
            Not yet enrolled. Contact your mentor to start your journey.
          </p>
        </motion.div>
      </div>
    );
  }

  const sessions = wf.sessions || [];
  const completedCount = sessions.filter(s => s.status === 'completed').length;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          Your Placement Journey
        </h1>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          12-week program to placement success
        </p>
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 mb-8"
        style={{
          borderColor: 'var(--dashboard-border)',
          backgroundColor: 'var(--dashboard-bg-secondary)',
          borderWidth: '1px',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: 'var(--dashboard-text)' }}>
            Overall Progress
          </h2>
          <span className="text-2xl font-bold text-cyan-400">{stats?.completionPercent || 0}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats?.completionPercent || 0}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
          />
        </div>
        <p className="text-sm mt-3" style={{ color: 'var(--dashboard-text-secondary)' }}>
          {completedCount} of {sessions.length} sessions completed
        </p>
      </motion.div>

      {/* Session Cards */}
      <div className="space-y-4">
        {sessions.map((session, idx) => {
          const isCompleted = session.status === 'completed';
          const isScheduled = session.status === 'scheduled';
          const isLocked = session.status === 'not-started' && idx > completedCount;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl p-6 border"
              style={{
                borderColor: isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'var(--dashboard-border)',
                backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'var(--dashboard-bg-secondary)',
              }}
            >
              <div className="flex items-start gap-4">
                {/* Session Number / Status */}
                <div className="flex-shrink-0 pt-1">
                  {isCompleted ? (
                    <CheckCircle2 size={24} className="text-emerald-400" />
                  ) : isScheduled ? (
                    <Clock size={24} className="text-amber-400" />
                  ) : isLocked ? (
                    <Lock size={24} className="text-white/40" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-cyan-400 flex items-center justify-center text-xs font-bold text-cyan-400">
                      {idx + 1}
                    </div>
                  )}
                </div>

                {/* Session Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg" style={{ color: 'var(--dashboard-text)' }}>
                    {session.label}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--dashboard-text-secondary)' }}>
                    {session.description || 'Session ' + (idx + 1) + ' of ' + sessions.length}
                  </p>

                  {/* Session Metadata */}
                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="text-xs flex items-center gap-1" style={{ color: 'var(--dashboard-text-secondary)' }}>
                      {session.type === 'mock-interview' ? (
                        <>
                          <Video size={14} /> Mock Interview
                        </>
                      ) : session.type === 'mentorship' ? (
                        <>
                          <Users size={14} /> Mentorship
                        </>
                      ) : (
                        <>
                          <MessageSquare size={14} /> Doubt Clear
                        </>
                      )}
                    </span>
                    <span className="text-xs flex items-center gap-1" style={{ color: 'var(--dashboard-text-secondary)' }}>
                      {session.duration || 60} minutes
                    </span>
                  </div>

                  {/* Feedback or Status */}
                  {isCompleted && session.feedback && (
                    <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--dashboard-bg)', borderColor: 'var(--dashboard-border)', borderWidth: '1px' }}>
                      <p className="text-xs font-semibold text-emerald-400 mb-1">Feedback</p>
                      <p className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
                        {session.feedback}
                      </p>
                    </div>
                  )}

                  {isScheduled && session.scheduledDate && (
                    <div className="mt-3 text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
                      Scheduled: <strong>{new Date(session.scheduledDate).toLocaleString('en-IN')}</strong>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {isScheduled && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition text-xs font-medium whitespace-nowrap">
                      Join Now
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Mentor Message */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl p-6 mt-8"
        style={{
          borderColor: '#FF9500',
          backgroundColor: 'rgba(255, 149, 0, 0.05)',
          borderWidth: '2px',
        }}
      >
        <p className="text-sm font-semibold text-[#FF9500] mb-2">💡 AI Mentor Tip</p>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          You're doing great! Keep up the momentum. Complete the next session to unlock advanced materials and boost your chances of placement success.
        </p>
      </motion.div>
    </div>
  );
}
