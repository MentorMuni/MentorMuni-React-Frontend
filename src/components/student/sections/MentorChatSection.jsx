import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export default function MentorChatSection() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          Mentor Chat
        </h1>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          Chat with your AI mentor and assigned mentor 24/7
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
        <MessageSquare size={48} className="mx-auto mb-4 text-white/20" />
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          Chat Coming Soon
        </h2>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          Connect with your mentor for guidance and support.
        </p>
      </motion.div>
    </div>
  );
}
