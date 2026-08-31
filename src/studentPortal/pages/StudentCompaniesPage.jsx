import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Building2, Loader2 } from 'lucide-react';
import {
  COMPANY_INTEL_CATALOG,
  ensureCompanyIntelligence,
  listCompanyIntelligence,
  pollUntilReady,
} from '../companyIntelligenceApi';
import { studentPaths } from '../paths';
import { companyLogo, companyMonogram } from '../companyLogos';
import '../styles/company-intel.css';
import { useTableQuery } from '../../hooks/useTableQuery';
import { TableToolbar } from '../../components/table/TableToolbar';

function Mark({ name }) {
  const logo = companyLogo(name);
  return (
    <span className="stu-ci__mark" aria-hidden>
      {logo ? <img src={logo} alt="" loading="lazy" /> : companyMonogram(name)}
    </span>
  );
}

export default function StudentCompaniesPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [company, setCompany] = useState(params.get('company') || '');
  const [role, setRole] = useState(params.get('role') || 'Software Engineer');
  const [catalog, setCatalog] = useState(COMPANY_INTEL_CATALOG);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadCatalog = useCallback(async () => {
    try {
      const data = await listCompanyIntelligence('');
      if (data?.catalog?.length) setCatalog(data.catalog);
    } catch {
      // Keep curated defaults.
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    const prefill = params.get('company');
    if (prefill) setCompany(prefill);
  }, [params]);

  const tiles = useMemo(() => catalog || COMPANY_INTEL_CATALOG, [catalog]);

  const catalogTable = useTableQuery(tiles, {
    searchKeys: ['company', 'role', 'sector'],
    initialSort: { key: 'company', direction: 'asc' },
    getSortValue: (row, key) => {
      if (key === 'company') return (row.company || '').toLowerCase();
      if (key === 'role') return (row.role || '').toLowerCase();
      return row[key];
    },
  });

  const openIntel = async (target) => {
    const c = (target.company || company).trim();
    if (!c) {
      setError('Enter a company name.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      let row = await ensureCompanyIntelligence({
        company: c,
        role: target.role || role,
      });
      if (row.status === 'generating') {
        row = await pollUntilReady(row.id);
      }
      if (row.status === 'failed') {
        setError(row.error_message || 'Could not build company intelligence.');
        return;
      }
      navigate(`${studentPaths.companies}/${encodeURIComponent(row.slug)}`);
    } catch (err) {
      setError(err?.message || 'Could not open company intelligence.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="stu-main">
      <div className="stu-ci">
        <header className="stu-ci__hero">
          <p className="stu-ci__eyebrow">
            <Building2 size={14} strokeWidth={2.4} aria-hidden /> Company Intelligence
          </p>
          <h1 className="stu-ci__title">How companies hire engineers</h1>
          <p className="stu-ci__sub">
            Recurring rounds, evaluation focus, and rejection patterns — shared intelligence, not a personal study plan.
          </p>
        </header>

        <section className="stu-card stu-ci__search">
          <label className="stu-ci__field">
            <span>Company</span>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. TCS, Persistent, Microsoft"
              autoComplete="organization"
            />
          </label>
          <label className="stu-ci__field">
            <span>Role</span>
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Software Engineer" />
          </label>
          {error ? (
            <p className="stu-ci__error" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="button"
            className="stu-btn stu-btn--primary"
            disabled={busy}
            onClick={() => openIntel({ company, role })}
          >
            {busy ? (
              <>
                <Loader2 size={16} className="spin" aria-hidden /> Building intelligence…
              </>
            ) : (
              <>
                View hiring process <ArrowRight size={16} aria-hidden />
              </>
            )}
          </button>
        </section>

        <section className="stu-card">
          <header className="stu-card__head">
            <div>
              <h2 className="stu-card__title">Popular campus targets</h2>
              <p className="stu-card__sub">Open any company to see how they typically evaluate students</p>
            </div>
          </header>
          <TableToolbar
            variant="stu"
            query={catalogTable.query}
            onQueryChange={catalogTable.setQuery}
            placeholder="Filter companies…"
            count={catalogTable.count}
            total={catalogTable.total}
          />
          <ul className="stu-ci__grid">
            {catalogTable.rows.length ? catalogTable.rows.map((c) => (
              <li key={`${c.company}-${c.role}`}>
                <button
                  type="button"
                  className="stu-ci__tile"
                  disabled={busy}
                  onClick={() => {
                    setCompany(c.company);
                    setRole(c.role);
                    openIntel(c);
                  }}
                >
                  <Mark name={c.company} />
                  <span>
                    <strong>{c.company}</strong>
                    <em>{c.role}</em>
                  </span>
                  <ArrowRight size={16} aria-hidden />
                </button>
              </li>
            )) : (
              <li className="stu-ci__empty">No companies match this filter.</li>
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}
