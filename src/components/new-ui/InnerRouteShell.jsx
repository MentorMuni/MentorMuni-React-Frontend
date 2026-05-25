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
  const scopePart = scopeClass || className;
  if (!scopePart) return children;
  const rootClass = ['mm-route-root', scopeClass, className].filter(Boolean).join(' ');
  return <div className={rootClass}>{children}</div>;
}
