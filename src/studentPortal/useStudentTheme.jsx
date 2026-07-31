import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export const STUDENT_THEME_KEY = 'mm-student-login-theme';

export function readStudentTheme() {
  try {
    return localStorage.getItem(STUDENT_THEME_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function useStudentTheme() {
  const [theme, setTheme] = useState(readStudentTheme);

  const toggle = () => {
    setTheme((t) => {
      const next = t === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(STUDENT_THEME_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  return { theme, toggle, rootClass: theme === 'dark' ? 'is-dark' : 'is-light' };
}

export function StudentThemeFab({ theme, onToggle }) {
  return (
    <button
      type="button"
      className="mm-stu-theme-fab"
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
      <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
}
