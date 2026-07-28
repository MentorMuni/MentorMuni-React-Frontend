import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Dark / Light toggle for MentorMuni Platform Admin.
 */
export default function PlatformThemeToggle({ theme, onToggle, className = '' }) {
  const isLight = theme === 'light';

  return (
    <motion.button
      type="button"
      className={`mm-pa-theme-toggle ${className}`}
      onClick={onToggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-pressed={isLight}
      title={isLight ? 'Dark mode' : 'Light mode'}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
    >
      <span className={`mm-pa-theme-toggle__track ${isLight ? 'is-light' : 'is-dark'}`}>
        <span className="mm-pa-theme-toggle__knob">
          {isLight ? <Sun size={14} strokeWidth={2.4} /> : <Moon size={14} strokeWidth={2.4} />}
        </span>
      </span>
    </motion.button>
  );
}
