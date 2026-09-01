import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle, KeyRound } from 'lucide-react';
import { getOrgSession } from '../../orgPortal';
import { isHodRole, sessionDisplayRole } from '../roles';
import { orgPaths } from '../paths';
import CollegeOrgBrand from '../../tenant/CollegeOrgBrand';
import { useOrgCollegeBrand } from '../useOrgCollegeBrand';

function profileInitials(session) {
  const name = String(session?.name || '').trim();
  if (!name) return sessionDisplayRole(session).slice(0, 2).toUpperCase();
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function accountDetailRows(session) {
  const rows = [
    { label: 'Full name', value: session?.name || '—' },
    { label: 'Email', value: session?.email || session?.username || '—' },
    { label: 'Role', value: sessionDisplayRole(session) },
    {
      label: 'Organization',
      value: session?.organization_name || session?.organization_code || '—',
    },
  ];

  if (isHodRole(session?.role) && session?.department_name) {
    rows.push({ label: 'Department', value: session.department_name });
  }

  return rows;
}

function useProfileCollege(session) {
  const college = useOrgCollegeBrand(session);
  if (college) return college;
  return {
    id: session?.organization_id,
    name: session?.organization_name || session?.organization_code || 'Your college',
    code: session?.organization_code || '',
    has_logo: false,
  };
}

export default function ProfilePage() {
  const session = getOrgSession();
  const college = useProfileCollege(session);
  const role = sessionDisplayRole(session);
  const collegeCode = String(session?.organization_code || college?.code || '').trim();

  return (
    <div className="mm-org-profile">
      <section className="mm-org-panel mm-org-profile__hero" aria-label="Account overview">
        <div className="mm-org-profile__campus">
          <CollegeOrgBrand
            college={college}
            size="lg"
            eyebrow="Your campus"
            className="mm-org-profile__campus-brand"
          />
          {collegeCode ? (
            <p className="mm-org-profile__campus-code">
              College code <span>{collegeCode}</span>
            </p>
          ) : null}
        </div>

        <div className="mm-org-profile__hero-divider" aria-hidden="true" />

        <div className="mm-org-profile__hero-main">
          <div className="mm-org-profile__avatar" aria-hidden="true">
            {profileInitials(session)}
          </div>
          <div className="mm-org-profile__hero-copy">
            <p className="mm-org-profile__eyebrow">Signed in as</p>
            <h2 className="mm-org-profile__name">{session?.name || role}</h2>
            <p className="mm-org-profile__email">{session?.email || session?.username || '—'}</p>
            <span className="mm-org-profile__badge">{role}</span>
          </div>
        </div>
      </section>

      <div className="mm-org-profile__grid">
        <section className="mm-org-panel mm-org-profile__details">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">Account details</h2>
              <p className="mm-org-panel__meta">Your campus portal identity (read only).</p>
            </div>
          </div>
          <dl className="mm-org-profile__rows">
            {accountDetailRows(session).map((row) => (
              <div key={row.label} className="mm-org-settings-row">
                <dt>{row.label}</dt>
                <dd className={row.mono ? 'mm-org-profile__mono' : undefined}>{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mm-org-panel mm-org-profile__actions">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">Security &amp; support</h2>
              <p className="mm-org-panel__meta">Manage credentials or get help with the portal.</p>
            </div>
          </div>
          <div className="mm-org-profile__links">
            <Link to={orgPaths.changePassword} className="mm-org-profile__link">
              <span className="mm-org-profile__link-icon" aria-hidden="true">
                <KeyRound size={18} />
              </span>
              <span className="mm-org-profile__link-copy">
                <strong>Change password</strong>
                <span>Update your sign-in credentials</span>
              </span>
              <ArrowRight size={16} className="mm-org-profile__link-arrow" aria-hidden="true" />
            </Link>
            <Link to={orgPaths.help} className="mm-org-profile__link">
              <span className="mm-org-profile__link-icon" aria-hidden="true">
                <HelpCircle size={18} />
              </span>
              <span className="mm-org-profile__link-copy">
                <strong>Help Center</strong>
                <span>Guides, FAQs, and campus support</span>
              </span>
              <ArrowRight size={16} className="mm-org-profile__link-arrow" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
