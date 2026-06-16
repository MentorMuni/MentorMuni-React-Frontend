import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  ChevronRight,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { getAllStudents } from '../../../utils/auth';
import { getWorkflowState, getStudentStats, initializeStudentWorkflow } from '../../../utils/agentWorkflow';
import { deleteStudent } from '../../../utils/authManager';

export default function StudentsSection({ currentTab, onTabChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const students = getAllStudents();
  const [isLoading, setIsLoading] = useState(false);

  // Filter students by status
  const getFilteredStudents = () => {
    const filtered = students.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.college.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (currentTab === 'active') {
      return filtered.filter(s => getWorkflowState(s.id));
    } else if (currentTab === 'completed') {
      return filtered.filter(s => {
        const wf = getWorkflowState(s.id);
        return wf && wf.sessions.every(ss => ss.status === 'completed');
      });
    } else if (currentTab === 'at-risk') {
      return filtered.filter(s => {
        const wf = getWorkflowState(s.id);
        const stats = wf ? getStudentStats(s.id) : null;
        return stats && stats.completionPercent < 50;
      });
    }
    return filtered;
  };

  const filteredStudents = getFilteredStudents();

  const tabs = [
    { id: 'all', label: 'All Students', count: students.length },
    { id: 'active', label: 'Active', count: students.filter(s => getWorkflowState(s.id)).length },
    { id: 'completed', label: 'Completed', count: students.filter(s => {
      const wf = getWorkflowState(s.id);
      return wf && wf.sessions.every(ss => ss.status === 'completed');
    }).length },
    { id: 'at-risk', label: 'At Risk', count: students.filter(s => {
      const wf = getWorkflowState(s.id);
      const stats = wf ? getStudentStats(s.id) : null;
      return stats && stats.completionPercent < 50;
    }).length },
  ];

  const handleEnroll = async (studentId) => {
    setIsLoading(true);
    try {
      initializeStudentWorkflow(studentId);
      // Trigger re-render
      window.location.reload();
    } catch (err) {
      console.error('Error enrolling student:', err);
    }
    setIsLoading(false);
  };

  const handleDelete = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(studentId);
      window.location.reload();
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          Students Management
        </h1>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          Manage and monitor all enrolled students
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
            {tab.label} <span className="ml-1 text-xs opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            type="text"
            placeholder="Search by name or college..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border transition-all focus:outline-none focus:ring-2 focus:ring-[#FF9500]/50"
            style={{
              borderColor: 'var(--dashboard-border)',
              color: 'var(--dashboard-text)',
            }}
          />
        </div>
        <button className="px-4 py-2 rounded-lg bg-[#FF9500]/20 text-[#FF9500] hover:bg-[#FF9500]/30 transition flex items-center gap-2 text-sm font-medium">
          <Plus size={16} /> Add Student
        </button>
      </div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl overflow-hidden"
        style={{
          borderColor: 'var(--dashboard-border)',
          backgroundColor: 'var(--dashboard-bg-secondary)',
          borderWidth: '1px',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottomColor: 'var(--dashboard-border)', borderBottomWidth: '1px' }}>
                <th className="px-6 py-3 text-left">
                  <span className="text-sm font-semibold" style={{ color: 'var(--dashboard-text-secondary)' }}>
                    Student
                  </span>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-sm font-semibold" style={{ color: 'var(--dashboard-text-secondary)' }}>
                    College
                  </span>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-sm font-semibold" style={{ color: 'var(--dashboard-text-secondary)' }}>
                    Role
                  </span>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-sm font-semibold" style={{ color: 'var(--dashboard-text-secondary)' }}>
                    Progress
                  </span>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-sm font-semibold" style={{ color: 'var(--dashboard-text-secondary)' }}>
                    Status
                  </span>
                </th>
                <th className="px-6 py-3 text-right">
                  <span className="text-sm font-semibold" style={{ color: 'var(--dashboard-text-secondary)' }}>
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, idx) => {
                const wf = getWorkflowState(student.id);
                const stats = wf ? getStudentStats(student.id) : null;

                return (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{
                      borderBottomColor: 'var(--dashboard-border)',
                      borderBottomWidth: idx < filteredStudents.length - 1 ? '1px' : '0px',
                    }}
                    className="hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--dashboard-text)' }}>
                            {student.name}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
                            {student.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
                        {student.college}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
                        {student.targetRole}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {stats ? (
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 rounded-full bg-white/10 flex-shrink-0">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all"
                              style={{ width: `${stats.completionPercent}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold whitespace-nowrap">
                            {stats.completionPercent}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-white/40">Not started</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {wf ? (
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${
                            stats?.phase === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : stats?.phase === 'advanced'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {stats?.phase || 'Enrolled'}
                        </span>
                      ) : (
                        <span className="text-xs text-white/40">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {!wf ? (
                          <button
                            onClick={() => handleEnroll(student.id)}
                            disabled={isLoading}
                            className="p-1.5 rounded-lg bg-[#FF9500]/20 text-[#FF9500] hover:bg-[#FF9500]/30 transition disabled:opacity-50"
                            title="Enroll Student"
                          >
                            <UserPlus size={16} />
                          </button>
                        ) : null}
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition"
                          title="Delete Student"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p style={{ color: 'var(--dashboard-text-secondary)' }}>
              No students found matching your criteria.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
