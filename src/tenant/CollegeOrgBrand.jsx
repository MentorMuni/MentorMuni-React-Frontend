import { Building2 } from 'lucide-react';
import { organizationLogoUrl } from './orgLogo';
import './college-org-brand.css';

/**
 * Shared campus identity: organization logo + name.
 * Use on college subdomain pages (hub, logins, shells).
 *
 * @param {{
 *   college?: { id?: number, name?: string, has_logo?: boolean, logo_updated_at?: string|null }|null,
 *   slug?: string,
 *   size?: 'sm'|'md'|'lg',
 *   layout?: 'row'|'stack',
 *   eyebrow?: string|null,
 *   className?: string,
 *   showFallbackIcon?: boolean,
 * }} props
 */
export default function CollegeOrgBrand({
  college = null,
  slug = '',
  size = 'md',
  layout = 'row',
  eyebrow = null,
  className = '',
  showFallbackIcon = true,
}) {
  const name = college?.name || slug || 'Your college';
  const logoUrl =
    college?.has_logo && college?.id
      ? organizationLogoUrl(college.id, { updatedAt: college.logo_updated_at })
      : null;

  const sizeClass = `mm-org-brand--${size}`;
  const layoutClass = layout === 'stack' ? ' mm-org-brand--stack' : '';
  const extra = className ? ` ${className}` : '';

  return (
    <div className={`mm-org-brand ${sizeClass}${layoutClass}${extra}`}>
      {logoUrl ? (
        <img className="mm-org-brand__logo" src={logoUrl} alt="" />
      ) : showFallbackIcon ? (
        <span className="mm-org-brand__fallback" aria-hidden>
          <Building2 strokeWidth={2} />
        </span>
      ) : null}
      <div className="mm-org-brand__text">
        {eyebrow ? <p className="mm-org-brand__eyebrow">{eyebrow}</p> : null}
        <strong className="mm-org-brand__name" title={name}>
          {name}
        </strong>
      </div>
    </div>
  );
}
