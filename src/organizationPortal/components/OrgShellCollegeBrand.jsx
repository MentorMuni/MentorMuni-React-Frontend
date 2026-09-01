import CollegeOrgBrand from '../../tenant/CollegeOrgBrand';
import '../../tenant/college-org-brand.css';

/**
 * Compact college identity for org portal sidebar.
 * @param {{ college?: object|null, className?: string }} props
 */
export default function OrgShellCollegeBrand({ college = null, className = '' }) {
  if (!college?.name && !college?.code) return null;

  return (
    <div className={`mm-org-side-college ${className}`.trim()} aria-label={college.name || 'College'}>
      <CollegeOrgBrand
        college={college}
        size="sm"
        className="mm-org-side-college__brand"
      />
    </div>
  );
}
