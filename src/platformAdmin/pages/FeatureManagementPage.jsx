import { useEffect, useState } from 'react';
import {
  getOrganizations,
  getOrgFeatures,
  saveOrgFeatures,
  getFeatureCatalog,
} from '../store';

export default function FeatureManagementPage() {
  const [orgs, setOrgs] = useState(() => getOrganizations());
  const [orgId, setOrgId] = useState(() => getOrganizations()[0]?.id || '');
  const [featureMap, setFeatureMap] = useState({});
  const [catalog] = useState(() => getFeatureCatalog());
  const [saved, setSaved] = useState(false);

  const loadFeatures = (id) => {
    if (!id) return;
    const rows = getOrgFeatures(id);
    const map = {};
    rows.forEach((r) => {
      map[r.id] = r.enabled;
    });
    setFeatureMap(map);
  };

  useEffect(() => {
    const refresh = () => {
      const list = getOrganizations();
      setOrgs(list);
      if (!list.find((o) => o.id === Number(orgId)) && list[0]) {
        setOrgId(list[0].id);
        loadFeatures(list[0].id);
      }
    };
    window.addEventListener('mm-platform-db-updated', refresh);
    return () => window.removeEventListener('mm-platform-db-updated', refresh);
  }, [orgId]);

  useEffect(() => {
    loadFeatures(orgId);
  }, [orgId]);

  const save = () => {
    saveOrgFeatures(orgId, featureMap);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="space-y-5">
      <div className="mm-pa-panel">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full max-w-sm">
            <label className="mm-pa-label">Organization</label>
            <select
              className="mm-pa-select"
              value={orgId}
              onChange={(e) => setOrgId(Number(e.target.value))}
            >
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.code})
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="mm-pa-btn mm-pa-btn--primary" onClick={save} disabled={!orgId}>
            Save Features
          </button>
        </div>

        {saved && <div className="mm-pa-success">organization_features updated for this tenant.</div>}

        <div className="grid gap-3 md:grid-cols-2">
          {catalog.map((feature) => (
            <div key={feature.id} className="mm-pa-feature-row">
              <div>
                <p className="text-sm font-bold text-slate-100">{feature.feature_name}</p>
                <p className="text-[11px] text-slate-500">
                  {feature.feature_code} · {feature.category}
                </p>
                <p className="mt-1 text-xs text-slate-400">{feature.description}</p>
              </div>
              <button
                type="button"
                className={`mm-pa-toggle ${featureMap[feature.id] ? 'mm-pa-toggle--on' : ''}`}
                aria-pressed={Boolean(featureMap[feature.id])}
                onClick={() =>
                  setFeatureMap((m) => ({ ...m, [feature.id]: !m[feature.id] }))
                }
              >
                <span className="mm-pa-toggle__knob" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mm-pa-panel">
        <h2 className="mb-2 text-sm font-extrabold">feature_catalog</h2>
        <p className="mb-4 text-xs text-slate-400">
          Master list of platform capabilities. Rarely changes. Toggle state is stored in{' '}
          <code className="rounded bg-white/5 px-1">organization_features</code>.
        </p>
        <div className="overflow-x-auto">
          <table className="mm-pa-table min-w-[640px]">
            <thead>
              <tr>
                <th>ID</th>
                <th>Code</th>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {catalog.map((f) => (
                <tr key={f.id}>
                  <td>{f.id}</td>
                  <td className="font-mono text-xs text-sky-300">{f.feature_code}</td>
                  <td className="font-semibold">{f.feature_name}</td>
                  <td>{f.category}</td>
                  <td>
                    <span className="mm-pa-badge mm-pa-badge--active">{f.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
