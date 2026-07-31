import { getOrgSession } from '../../orgPortal';
import { roleLabel } from '../roles';

export default function SettingsPage() {
  const session = getOrgSession();
  return (
    <div className="mx-auto max-w-2xl">
      <section className="mm-org-panel">
        <h2 className="m-0 text-xl font-extrabold">Settings</h2>
        <dl className="mt-5 space-y-3 text-sm">
          {[
            ['Name', session?.name || '—'],
            ['Email', session?.email || '—'],
            ['Role', roleLabel(session?.role)],
            ['Organization', session?.organization_name || session?.organization_code || '—'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <dt className="font-semibold" style={{ color: 'var(--org-muted)' }}>
                {k}
              </dt>
              <dd className="m-0 font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
