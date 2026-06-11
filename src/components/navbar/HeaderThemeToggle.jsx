import { Sun, Moon } from 'lucide-react';
import { useNewUI } from '../../context/NewUIContext';

/**
 * Compact day/night theme control — lives in the header row after primary CTA.
 */
export default function HeaderThemeToggle() {
  const { newUI, setNewUI } = useNewUI();

  return (
    <button
      type="button"
      onClick={() => setNewUI(!newUI)}
      className="mm-header-theme-toggle"
      aria-label={newUI ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={newUI}
      title={newUI ? 'Light mode' : 'Dark mode'}
    >
      {newUI ? (
        <Sun size={18} strokeWidth={2} aria-hidden />
      ) : (
        <Moon size={18} strokeWidth={2} aria-hidden />
      )}
    </button>
  );
}
