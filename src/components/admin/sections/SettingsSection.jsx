import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

export default function SettingsSection() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          Settings
        </h1>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          Configure platform settings and preferences
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
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#FF9500', backgroundOpacity: 0.1 }}>
          <Settings size={32} className="text-[#FF9500]" />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          Settings Coming Soon
        </h2>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          Platform settings, user management, and configuration options will be available here.
        </p>
      </motion.div>
    </div>
  );
}
