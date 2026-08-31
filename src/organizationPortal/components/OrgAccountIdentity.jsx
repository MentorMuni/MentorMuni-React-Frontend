import { sessionDisplayRole, isViewerRole } from '../roles';

export function orgAccountRoleLine(session) {
  const role = isViewerRole(session?.role) ? 'Viewer' : sessionDisplayRole(session);
  const org = session?.organization_name || session?.organization_code || '';
  return org ? `${role} · ${org}` : role;
}

/** Name / email / role · college — same block as topbar and profile page. */
export default function OrgAccountIdentity({ session, align = 'right', className = '' }) {
  const alignClass = align === 'left' ? 'mm-org-account__meta--left' : '';
  return (
    <div className={`mm-org-account__meta ${alignClass} ${className}`.trim()}>
      <p className="mm-org-account__name">{session?.name || sessionDisplayRole(session)}</p>
      <p className="mm-org-account__email">{session?.email || session?.username || '—'}</p>
      <p className="mm-org-account__role">{orgAccountRoleLine(session)}</p>
    </div>
  );
}
