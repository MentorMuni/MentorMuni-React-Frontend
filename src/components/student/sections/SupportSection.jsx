import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

export default function SupportSection() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          Help & Support
        </h1>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          FAQ and support resources
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
        <HelpCircle size={48} className="mx-auto mb-4 text-white/20" />
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          Support Center Coming Soon
        </h2>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          FAQ, tutorials, and support documentation.
        </p>
      </motion.div>
    </div>
  );
}
