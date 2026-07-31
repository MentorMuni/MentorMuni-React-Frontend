import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrgThemeToggle({ theme, onToggle, className = '' }) {
  const isLight = theme === 'light';
  return (
    <motion.button
      type="button"
      className={`mm-org-theme-toggle ${className}`}
      onClick={onToggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-pressed={isLight}
      title={isLight ? 'Dark mode' : 'Light mode'}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
    >
      <span className={`mm-org-theme-toggle__track ${isLight ? 'is-light' : 'is-dark'}`}>
        <span className="mm-org-theme-toggle__knob">
          {isLight ? <Sun size={14} strokeWidth={2.4} /> : <Moon size={14} strokeWidth={2.4} />}
        </span>
      </span>
    </motion.button>
  );
}
