import { Building2 } from 'lucide-react';
import { organizationLogoUrl } from '../../tenant/orgLogo';
import { sessionDisplayRole, isViewerRole } from '../roles';

export function orgAccountRoleLine(session) {
  const role = isViewerRole(session?.role) ? 'Viewer' : sessionDisplayRole(session);
  const org = session?.organization_name || session?.organization_code || '';
  return org ? `${role} · ${org}` : role;
}

function profileInitials(session) {
  const name = String(session?.name || '').trim();
  if (!name) return sessionDisplayRole(session).slice(0, 2).toUpperCase();
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function AccountMark({ college, session }) {
  const logoUrl =
    college?.has_logo && college?.id
      ? organizationLogoUrl(college.id, { updatedAt: college.logo_updated_at })
      : null;

  if (logoUrl) {
    return <img className="mm-org-account__logo" src={logoUrl} alt="" />;
  }

  const initials = profileInitials(session);
  if (initials) {
    return <span className="mm-org-account__avatar">{initials}</span>;
  }

  return (
    <span className="mm-org-account__logo mm-org-account__logo--fallback" aria-hidden>
      <Building2 strokeWidth={2} />
    </span>
  );
}

/** Name + role · college — topbar account block (no email). */
export default function OrgAccountIdentity({ session, college = null, className = '' }) {
  return (
    <div className={`mm-org-account__identity ${className}`.trim()}>
      <AccountMark college={college} session={session} />
      <div className="mm-org-account__meta">
        <p className="mm-org-account__name">{session?.name || sessionDisplayRole(session)}</p>
        <p className="mm-org-account__role">{orgAccountRoleLine(session)}</p>
      </div>
    </div>
  );
}
