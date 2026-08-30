import { useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { apexOrigin, hostnamePortalSlug } from '../tenant/resolveTenant';

/**
 * Platform admin is apex-only (localhost / www.mentormuni.com).
 * College hosts like iit01.localhost or iit01.mentormuni.com must never serve it.
 */
export default function PlatformApexOnly({ children }) {
  const location = useLocation();
  const [blocked] = useState(() => Boolean(hostnamePortalSlug()));

  useLayoutEffect(() => {
    const slug = hostnamePortalSlug();
    if (!slug) return;
    const { pathname, search, hash } = window.location;
    window.location.replace(`${apexOrigin()}${pathname}${search || ''}${hash || ''}`);
  }, [location.pathname, location.search, location.hash]);

  if (blocked || hostnamePortalSlug()) {
    return (
      <div className="mm-pa-root flex min-h-screen items-center justify-center px-4 text-sm text-muted-foreground">
        Opening platform admin on the main MentorMuni host…
      </div>
    );
  }

  return children;
}
