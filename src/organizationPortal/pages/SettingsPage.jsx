import { getOrgSession } from '../../orgPortal';
import { sessionDisplayRole } from '../roles';

export default function SettingsPage() {
  const session = getOrgSession();
  return (
    <div className="mx-auto max-w-2xl">
      <section className="mm-org-panel">
        <h2 className="mm-org-section-title">Settings</h2>
        <dl className="mt-5 space-y-3 text-sm">
          {[
            ['Name', session?.name || '—'],
            ['Email', session?.email || '—'],
            ['Role', sessionDisplayRole(session)],
            ['Organization', session?.organization_name || session?.organization_code || '—'],
          ].map(([k, v]) => (
            <div key={k} className="mm-org-settings-row">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
