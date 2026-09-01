import { useEffect, useMemo, useState } from 'react';
import { getOrgSession } from '../orgPortal';
import { useCollegeTenantOptional } from '../tenant/CollegeTenantProvider';
import { organizationLogoUrl } from '../tenant/orgLogo';

/** Resolve college logo + name for the signed-in org (tenant + session). */
export function useOrgCollegeBrand(session = getOrgSession()) {
  const tenant = useCollegeTenantOptional();
  const sessionCode = String(session?.organization_code || '').trim().toUpperCase();
  const sessionOrgId = Number(session?.organization_id);
  const tenantCollege = tenant?.college;

  const matchedTenant =
    tenantCollege &&
    (String(tenantCollege.code || '').trim().toUpperCase() === sessionCode ||
      (Number.isFinite(sessionOrgId) &&
        sessionOrgId > 0 &&
        Number(tenantCollege.id) === sessionOrgId))
      ? tenantCollege
      : null;

  const baseCollege = useMemo(
    () => ({
      id: matchedTenant?.id || session?.organization_id,
      name:
        matchedTenant?.name ||
        session?.organization_name ||
        session?.organization_code ||
        '',
      code: matchedTenant?.code || session?.organization_code || '',
      has_logo: Boolean(matchedTenant?.has_logo),
      logo_updated_at: matchedTenant?.logo_updated_at || null,
    }),
    [matchedTenant, session]
  );

  const [logoAvailable, setLogoAvailable] = useState(Boolean(baseCollege.has_logo));

  useEffect(() => {
    setLogoAvailable(Boolean(baseCollege.has_logo));
    if (baseCollege.has_logo || !baseCollege.id) return undefined;

    const probe = new Image();
    let cancelled = false;
    probe.onload = () => {
      if (!cancelled) setLogoAvailable(true);
    };
    probe.onerror = () => {
      if (!cancelled) setLogoAvailable(false);
    };
    probe.src = organizationLogoUrl(baseCollege.id);
    return () => {
      cancelled = true;
    };
  }, [baseCollege.has_logo, baseCollege.id]);

  const college = useMemo(() => {
    if (!baseCollege.name && !baseCollege.code) return null;
    return {
      ...baseCollege,
      has_logo: logoAvailable,
    };
  }, [baseCollege, logoAvailable]);

  return college;
}
