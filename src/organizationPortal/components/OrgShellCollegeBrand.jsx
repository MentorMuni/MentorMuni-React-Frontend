import CollegeOrgBrand from '../../tenant/CollegeOrgBrand';
import '../../tenant/college-org-brand.css';

/**
 * College identity for org portal chrome (topbar).
 * @param {{ college?: object|null, variant?: 'topbar', className?: string }} props
 */
export default function OrgShellCollegeBrand({
  college = null,
  variant = 'topbar',
  className = '',
}) {
  if (!college?.name && !college?.code) return null;

  if (variant === 'topbar') {
    return (
      <div className={`mm-org-topbar-college ${className}`.trim()} title={college.name}>
        <CollegeOrgBrand
          college={college}
          size="sm"
          className="mm-org-topbar-college__brand"
        />
      </div>
    );
  }

  return null;
}
