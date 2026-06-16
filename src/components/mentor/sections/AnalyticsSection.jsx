import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsSection() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          Analytics & Insights
        </h1>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          View detailed performance analytics and student insights
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
          <BarChart3 size={32} className="text-[#FF9500]" />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          Analytics Dashboard Coming Soon
        </h2>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          Charts, performance metrics, and student progress insights coming soon.
        </p>
      </motion.div>
    </div>
  );
}
