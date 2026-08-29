import { useEffect, useState } from 'react';
import {
  getOrganizations,
  getOrgFeatures,
  saveOrgFeatures,
  getFeatureCatalog,
} from '../store';

export default function FeatureManagementPage() {
  const [orgs, setOrgs] = useState([]);
  const [orgId, setOrgId] = useState('');
  const [featureMap, setFeatureMap] = useState({});
  const [catalog, setCatalog] = useState([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadFeatures = async (id) => {
    if (!id) {
      setFeatureMap({});
      return;
    }
    const rows = await getOrgFeatures(id);
    const map = {};
    rows.forEach((r) => {
      map[r.feature_id ?? r.id] = r.enabled;
    });
    setFeatureMap(map);
  };

  useEffect(() => {
    const refresh = async () => {
      setLoading(true);
      try {
        const [list, cat] = await Promise.all([getOrganizations(), getFeatureCatalog()]);
        setOrgs(list);
        setCatalog(cat);
        setOrgId((current) => {
          if (list.find((o) => o.id === Number(current))) return current;
          return list[0]?.id || '';
        });
        setError('');
      } catch (e) {
        setError(e.message || 'Failed to load feature management data.');
      } finally {
        setLoading(false);
      }
    };
    refresh();
    window.addEventListener('mm-platform-db-updated', refresh);
    return () => window.removeEventListener('mm-platform-db-updated', refresh);
  }, []);

  useEffect(() => {
    loadFeatures(orgId).catch((e) =>
      setError(e.message || 'Failed to load organization features.')
    );
  }, [orgId]);

  useEffect(() => {
    if (!error) return undefined;
    const timer = window.setTimeout(() => setError(''), 3500);
    return () => window.clearTimeout(timer);
  }, [error]);

  const save = async () => {
    try {
      await saveOrgFeatures(orgId, featureMap);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    } catch (e) {
      setError(e.message || 'Failed to save organization features.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="mm-pa-panel">
        {error && <div className="mm-pa-inline-toast mm-pa-inline-toast--error">{error}</div>}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full max-w-sm">
            <label className="mm-pa-label">Organization</label>
            <select
              className="mm-pa-select"
              value={orgId}
              onChange={(e) => setOrgId(Number(e.target.value))}
              disabled={loading || !orgs.length}
            >
              {!orgs.length ? <option value="">No organizations</option> : null}
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.code})
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="mm-pa-btn mm-pa-btn--primary"
            onClick={save}
            disabled={!orgId || loading}
          >
            Save Features
          </button>
        </div>

        {saved && <div className="mm-pa-success">organization_features updated for this tenant.</div>}

        {!orgId && !loading ? (
          <div className="mm-pa-empty">Create an organization first, then enable features here.</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {(loading
              ? Array.from({ length: 6 }, (_, i) => ({ id: `loading-feature-${i}` }))
              : catalog
            ).map((feature) => (
              <div key={feature.id} className="mm-pa-feature-row">
                {loading ? (
                  <div className="w-full space-y-2">
                    <div className="mm-pa-skeleton h-4 w-1/2" />
                    <div className="mm-pa-skeleton h-3 w-2/3" />
                    <div className="mm-pa-skeleton h-3 w-full" />
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="mm-pa-feature-row__title">{feature.feature_name}</p>
                      <p className="mm-pa-feature-row__meta">
                        {feature.feature_code} · {feature.category}
                      </p>
                      <p className="mm-pa-feature-row__desc">{feature.description}</p>
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
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mm-pa-panel">
        <h2 className="mb-2 text-sm font-extrabold">feature_catalog</h2>
        <p className="mb-4 text-xs text-slate-400">
          Master list of platform capabilities. Rarely changes. Toggle state is stored in{' '}
          <code className="mm-pa-code">organization_features</code>.
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
              {(loading
                ? Array.from({ length: 5 }, (_, i) => ({ id: `loading-catalog-${i}` }))
                : catalog
              ).map((f) => (
                <tr key={f.id}>
                  {loading ? (
                    <>
                      <td>
                        <div className="mm-pa-skeleton h-4 w-12" />
                      </td>
                      <td>
                        <div className="mm-pa-skeleton h-4 w-24" />
                      </td>
                      <td>
                        <div className="mm-pa-skeleton h-4 w-32" />
                      </td>
                      <td>
                        <div className="mm-pa-skeleton h-4 w-24" />
                      </td>
                      <td>
                        <div className="mm-pa-skeleton h-6 w-24" />
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{f.id}</td>
                      <td className="font-mono text-xs text-sky-300">{f.feature_code}</td>
                      <td className="font-semibold">{f.feature_name}</td>
                      <td>{f.category}</td>
                      <td>
                        <span
                          className={`mm-pa-badge ${
                            String(f.status || '').toUpperCase() === 'ACTIVE'
                              ? 'mm-pa-badge--active'
                              : 'mm-pa-badge--suspended'
                          }`}
                        >
                          {String(f.status || '').toUpperCase() || 'ACTIVE'}
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
