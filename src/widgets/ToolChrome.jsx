import RoutePageShell from '../components/layout/RoutePageShell';
import { useToolSessionOptional } from './ToolSessionContext';

/**
 * Full-page tools keep RoutePageShell; embedded widgets render a plain container.
 */
export default function ToolChrome({ children, scope = 'tool', className = '' }) {
  const session = useToolSessionOptional();
  const chrome = session?.chrome ?? 'full';

  if (chrome === 'none' || chrome === 'minimal') {
    return (
      <div
        className={['mm-tool-widget', chrome === 'minimal' ? 'mm-site-theme' : '', className]
          .filter(Boolean)
          .join(' ')}
        data-mm-chrome={chrome}
      >
        {children}
      </div>
    );
  }

  return (
    <RoutePageShell scope={scope} className={className}>
      {children}
    </RoutePageShell>
  );
}
