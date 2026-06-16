import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { getAllStudents } from '../../../utils/auth';
import { getWorkflowState, getStudentStats } from '../../../utils/agentWorkflow';

export default function StudentsSection({ mentor }) {
  const students = getAllStudents();
  const myStudents = students.filter(s => {
    const wf = getWorkflowState(s.id);
    return wf && (wf.assignedMentor === mentor.name || wf.industryExpert === mentor.name);
  });

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          My Students
        </h1>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          Track progress of your assigned students
        </p>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myStudents.map((student, idx) => {
          const stats = getStudentStats(student.id);
          return (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl p-6"
              style={{
                borderColor: 'var(--dashboard-border)',
                backgroundColor: 'var(--dashboard-bg-secondary)',
                borderWidth: '1px',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: 'var(--dashboard-text)' }}>
                    {student.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
                    {student.college}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>Progress</p>
                  <p className="text-2xl font-bold text-cyan-400 mt-1">
                    {stats?.completionPercent || 0}%
                  </p>
                </div>

                <div className="w-full h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all"
                    style={{ width: `${stats?.completionPercent || 0}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--dashboard-text-secondary)' }}>
                    {stats?.completed || 0}/{stats?.totalSessions || 0} sessions
                  </span>
                  <span className={`px-2 py-1 rounded-full ${
                    stats?.phase === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    stats?.phase === 'advanced' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {stats?.phase || 'beginner'}
                  </span>
                </div>
              </div>

              <button className="w-full mt-4 px-3 py-2 rounded-lg bg-[#FF9500]/20 text-[#FF9500] hover:bg-[#FF9500]/30 transition text-sm font-medium">
                View Details
              </button>
            </motion.div>
          );
        })}
      </div>

      {myStudents.length === 0 && (
        <div className="rounded-2xl p-12 text-center" style={{
          borderColor: 'var(--dashboard-border)',
          backgroundColor: 'var(--dashboard-bg-secondary)',
          borderWidth: '1px',
        }}>
          <Users size={48} className="mx-auto mb-4 text-white/20" />
          <p style={{ color: 'var(--dashboard-text-secondary)' }}>
            No students assigned yet
          </p>
        </div>
      )}
    </div>
  );
}
