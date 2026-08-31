import { getOrgSession } from '../../orgPortal';
import OrgAccountIdentity from '../components/OrgAccountIdentity';

export default function ProfilePage() {
  const session = getOrgSession();
  return (
    <div className="mx-auto max-w-2xl">
      <section className="mm-org-panel mm-org-profile-panel">
        <h2 className="mm-org-section-title">Profile</h2>
        <p className="mm-org-panel__meta mb-4">Your signed-in account for this college portal.</p>
        <div className="mm-org-profile-card">
          <OrgAccountIdentity session={session} align="left" />
        </div>
      </section>
    </div>
  );
}
