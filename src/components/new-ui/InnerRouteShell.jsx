const SCOPE_CLASS = {
  inner: 'mm-inner-route',
  marketing: 'mm-marketing-flow',
  tool: 'mm-tool-flow',
};

/**
 * Wraps routes for fluid width guards + optional New UI semantic scope.
 * Always applies mm-route-root (Classic + Dark).
 */
export default function InnerRouteShell({ children, className = '', scope = 'inner' }) {
  const scopeClass = SCOPE_CLASS[scope] ?? SCOPE_CLASS.inner;
  const rootClass = ['mm-route-root', scopeClass, className].filter(Boolean).join(' ');
  return <div className={rootClass}>{children}</div>;
}
