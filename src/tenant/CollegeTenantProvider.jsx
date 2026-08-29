import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { saveCollegeCode } from '../orgPortal';
import {
  activePortalSlug,
  hostnamePortalSlug,
  isCollegeTenantHost,
  readTenantCache,
  resolveTenantFromHostname,
} from './resolveTenant';

const CollegeTenantContext = createContext(null);

function toCollege(tenant) {
  if (!tenant?.code) return null;
  return {
    id: tenant.id,
    name: tenant.name,
    code: tenant.code,
    portal_slug: tenant.portal_slug,
    portal_url: tenant.portal_url,
    status: tenant.status,
  };
}

export function CollegeTenantProvider({ children }) {
  const slug = activePortalSlug();
  const isTenantHost = isCollegeTenantHost();
  const locked = Boolean(hostnamePortalSlug()) || Boolean(slug);

  const [college, setCollege] = useState(() => {
    if (!slug) return null;
    const cached = readTenantCache(slug);
    // Require name+code so the login header never shows a blank campus.
    return cached?.code && cached?.name ? toCollege(cached) : null;
  });
  const [loading, setLoading] = useState(() => {
    if (!slug) return false;
    const cached = readTenantCache(slug);
    return !(cached?.code && cached?.name);
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) {
      setCollege(null);
      setLoading(false);
      setError('');
      return undefined;
    }

    const cached = readTenantCache(slug);
    const cacheComplete = Boolean(cached?.code && cached?.name);
    if (cacheComplete) {
      setCollege(toCollege(cached));
    }

    let cancelled = false;
    setLoading(!cacheComplete);
    setError('');

    (async () => {
      try {
        const tenant = await resolveTenantFromHostname();
        if (cancelled) return;
        if (!tenant?.code || !tenant?.name) {
          setError('This college portal was not found.');
          setCollege(null);
          return;
        }
        const next = toCollege(tenant);
        setCollege(next);
        saveCollegeCode(tenant.code);
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || 'Could not load this college portal.');
        if (!cacheComplete) setCollege(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const value = useMemo(
    () => ({
      slug,
      college,
      organizationCode: String(college?.code || '').trim().toUpperCase(),
      locked,
      loading,
      error,
      isTenantHost,
      ready: !loading && Boolean(college?.code) && !error,
    }),
    [slug, college, locked, loading, error, isTenantHost]
  );

  return (
    <CollegeTenantContext.Provider value={value}>{children}</CollegeTenantContext.Provider>
  );
}

export function useCollegeTenantContext() {
  const ctx = useContext(CollegeTenantContext);
  if (!ctx) {
    throw new Error('useCollegeTenantContext must be used within CollegeTenantProvider');
  }
  return ctx;
}

/** Safe hook when provider may be absent (returns null). */
export function useCollegeTenantOptional() {
  return useContext(CollegeTenantContext);
}
