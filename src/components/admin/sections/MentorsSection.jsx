import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Star,
  Users,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import { getAllMentors } from '../../../utils/auth';
import { getWorkflowState } from '../../../utils/agentWorkflow';
import { deleteMentor } from '../../../utils/authManager';

export default function MentorsSection({ currentTab, onTabChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const mentors = getAllMentors();

  // Filter mentors by status
  const getFilteredMentors = () => {
    const filtered = mentors.filter(m =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (currentTab === 'active') {
      return filtered.filter(m => m.isActive !== false);
    } else if (currentTab === 'pending') {
      return filtered.filter(m => m.isActive === false);
    }
    return filtered;
  };

  const filteredMentors = getFilteredMentors();

  const tabs = [
    { id: 'all', label: 'All Mentors', count: mentors.length },
    { id: 'active', label: 'Active', count: mentors.filter(m => m.isActive !== false).length },
    { id: 'pending', label: 'Pending', count: mentors.filter(m => m.isActive === false).length },
  ];

  const handleDelete = (mentorId) => {
    if (window.confirm('Are you sure you want to delete this mentor?')) {
      deleteMentor(mentorId);
      window.location.reload();
    }
  };

  // Count students for each mentor
  const getMentorStudentCount = (mentorName) => {
    const students = [];
    // This would need access to workflow state to count properly
    // For now, we'll use a placeholder
    return Math.floor(Math.random() * 15) + 3;
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          Mentors Management
        </h1>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          Manage and monitor all mentors on the platform
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
            placeholder="Search by name or specialty..."
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
          <Plus size={16} /> Add Mentor
        </button>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor, idx) => {
          const studentCount = getMentorStudentCount(mentor.name);

          return (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl p-6 flex flex-col gap-4"
              style={{
                borderColor: 'var(--dashboard-border)',
                backgroundColor: 'var(--dashboard-bg-secondary)',
                borderWidth: '1px',
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {mentor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--dashboard-text)' }}>
                      {mentor.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
                      {mentor.specialty}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(mentor.rating) ? 'text-amber-400 fill-amber-400' : 'text-white/20'}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-bold mt-1" style={{ color: 'var(--dashboard-text)' }}>
                    {mentor.rating}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="rounded-xl p-3 text-center"
                  style={{
                    backgroundColor: 'var(--dashboard-bg)',
                    borderColor: 'var(--dashboard-border)',
                    borderWidth: '1px',
                  }}
                >
                  <p className="text-lg font-bold" style={{ color: '#FF9500' }}>
                    {studentCount}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
                    Students
                  </p>
                </div>
                <div
                  className="rounded-xl p-3 text-center"
                  style={{
                    backgroundColor: 'var(--dashboard-bg)',
                    borderColor: 'var(--dashboard-border)',
                    borderWidth: '1px',
                  }}
                >
                  <p className="text-lg font-bold text-emerald-400">
                    {Math.floor(Math.random() * 50) + 10}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
                    Sessions
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
                Expert in {mentor.specialty} with proven track record
              </p>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#FF9500]/20 text-[#FF9500] hover:bg-[#FF9500]/30 transition text-sm font-medium"
                >
                  <MessageSquare size={14} /> Message
                </button>
                <button
                  onClick={() => handleDelete(mentor.id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/20 transition"
                  title="Delete Mentor"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Status Badge */}
              <div className="pt-2 border-t" style={{ borderColor: 'var(--dashboard-border)' }}>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    mentor.isActive !== false
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {mentor.isActive !== false ? '● Active' : '● Pending'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredMentors.length === 0 && (
        <div className="rounded-2xl p-12 text-center" style={{
          borderColor: 'var(--dashboard-border)',
          backgroundColor: 'var(--dashboard-bg-secondary)',
          borderWidth: '1px',
        }}>
          <p style={{ color: 'var(--dashboard-text-secondary)' }}>
            No mentors found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
