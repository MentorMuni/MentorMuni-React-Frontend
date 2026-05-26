import InnerRouteShell from '../new-ui/InnerRouteShell';

/**
 * Standard page wrapper: fluid width guards + marketing/inner/tool scope.
 */
export default function RoutePageShell({ children, scope = 'inner', className = '' }) {
  const base = 'min-h-screen mm-site-theme overflow-x-hidden';
  return (
    <InnerRouteShell scope={scope} className={[base, className].filter(Boolean).join(' ')}>
      {children}
    </InnerRouteShell>
  );
}
