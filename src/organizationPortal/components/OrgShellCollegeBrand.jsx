import { Building2 } from 'lucide-react';
import { organizationLogoUrl } from '../../tenant/orgLogo';
import '../../tenant/college-org-brand.css';

/**
 * College identity for org portal chrome (topbar).
 * @param {{ college?: object|null, variant?: 'topbar', className?: string, belowName?: import('react').ReactNode }} props
 */
export default function OrgShellCollegeBrand({
  college = null,
  variant = 'topbar',
  className = '',
  belowName = null,
}) {
  if (!college?.name && !college?.code) return null;

  if (variant === 'topbar') {
    const name = college.name || college.code;
    const logoUrl =
      college?.has_logo && college?.id
        ? organizationLogoUrl(college.id, { updatedAt: college.logo_updated_at })
        : null;

    return (
      <div className={`mm-org-topbar-college ${className}`.trim()} title={name}>
        <div className="mm-org-topbar-college__lockup">
          {logoUrl ? (
            <img className="mm-org-brand__logo" src={logoUrl} alt="" />
          ) : (
            <span className="mm-org-brand__fallback" aria-hidden>
              <Building2 strokeWidth={2} />
            </span>
          )}
          <div className="mm-org-topbar-college__body">
            <strong className="mm-org-brand__name" title={name}>
              {name}
            </strong>
            {belowName}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
