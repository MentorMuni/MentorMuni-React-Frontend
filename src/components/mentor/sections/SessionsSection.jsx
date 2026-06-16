import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function SessionsSection() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          Session History
        </h1>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          View past and completed mentoring sessions
        </p>
      </div>

      {/* Coming Soon */}
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
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 149, 0, 0.1)' }}>
          <Clock size={32} className="text-[#FF9500]" />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          Session History Coming Soon
        </h2>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          View completed sessions, recordings, and feedback from students.
        </p>
      </motion.div>
    </div>
  );
}
