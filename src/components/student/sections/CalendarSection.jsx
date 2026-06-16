import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

export default function CalendarSection() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          Your Calendar
        </h1>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          View and manage your mentoring sessions
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
        <Calendar size={48} className="mx-auto mb-4 text-white/20" />
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          Calendar Coming Soon
        </h2>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          Calendar integration for viewing and scheduling sessions.
        </p>
      </motion.div>
    </div>
  );
}
