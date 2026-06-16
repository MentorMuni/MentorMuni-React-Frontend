import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

export default function CertificatesSection() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          My Certificates
        </h1>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          View your achievements and certificates
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
        <Award size={48} className="mx-auto mb-4 text-white/20" />
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          No Certificates Yet
        </h2>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          Complete your learning journey to earn certificates.
        </p>
      </motion.div>
    </div>
  );
}
