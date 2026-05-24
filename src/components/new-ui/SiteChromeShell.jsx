import { useNewUI } from '../../context/NewUIContext';

/**
 * Unified top chrome: promo bar + nav + beta switch.
 * In Dark theme, white chrome block (nav + theme toggle) with fade into dark page body.
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
