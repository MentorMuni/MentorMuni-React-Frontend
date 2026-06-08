import { useNewUI } from '../../context/NewUIContext';

/**
 * Theme bar chrome + edge fade (nav is a sibling in App.jsx so sticky spans the full page).
 * In Dark theme, white chrome block for the theme toggle with fade into dark page body.
 */
export default function SiteChromeShell({ children }) {
  const { newUI } = useNewUI();

  if (!newUI) {
    return <div className="relative z-[2]">{children}</div>;
  }

  return (
    <div className="mm-site-chrome relative z-[2]">
      {children}
      <div className="mm-site-chrome__edge" aria-hidden />
    </div>
  );
}
