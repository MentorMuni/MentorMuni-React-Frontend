import { useNewUI } from '../../context/NewUIContext';

const SCOPE_CLASS = {
  inner: 'mm-inner-route',
  marketing: 'mm-marketing-flow',
  tool: 'mm-tool-flow',
};

/**
 * Wraps routes so New UI semantic tokens apply without global .bg-white remaps.
 * @param {'inner' | 'marketing' | 'tool'} scope
 */
export default function InnerRouteShell({ children, className = '', scope = 'inner' }) {
  const { newUI } = useNewUI();
  const scopeClass = newUI ? SCOPE_CLASS[scope] ?? SCOPE_CLASS.inner : null;
  const rootClass = [scopeClass, className].filter(Boolean).join(' ');
  if (!rootClass) return children;
  return <div className={rootClass}>{children}</div>;
}
