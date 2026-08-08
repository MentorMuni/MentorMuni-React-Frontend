import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import {
  ensureCompanyIntelligence,
  getCompanyIntelligenceBySlug,
  pollUntilReady,
} from '../companyIntelligenceApi';
import { studentPaths } from '../paths';
import { companyLogo, companyMonogram } from '../companyLogos';
import '../styles/company-intel.css';

function Mark({ name }) {
  const logo = companyLogo(name);
  return (
    <span className="stu-ci__mark stu-ci__mark--lg" aria-hidden>
      {logo ? <img src={logo} alt="" loading="lazy" /> : companyMonogram(name)}
    </span>
  );
}

function Confidence({ value, strength }) {
  if (value == null && !strength) return null;
  const pct = value != null ? Math.round(Number(value) * 100) : null;
  return (
    <span className="stu-ci__chip">
      {pct != null ? `${pct}% confidence` : null}
      {pct != null && strength ? ' · ' : null}
      {strength || null}
    </span>
  );
}

export default function StudentCompanyIntelPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [row, setRow] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      setError('');
      try {
        let data = await getCompanyIntelligenceBySlug(decodeURIComponent(slug || ''));
        if (data.status === 'generating') {
          data = await pollUntilReady(data.id);
        }
        if (!cancelled) setRow(data);
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Could not load company intelligence.');
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const payload = row?.payload || null;
  const profile = payload?.company_profile || {};
  const process = Array.isArray(payload?.hiring_process) ? payload.hiring_process : [];
  const dimensions = Array.isArray(payload?.evaluation_dimensions) ? payload.evaluation_dimensions : [];
  const reasons = Array.isArray(payload?.common_rejection_reasons) ? payload.common_rejection_reasons : [];
  const blueprint = Array.isArray(payload?.mock_interview_blueprint) ? payload.mock_interview_blueprint : [];
  const interviewProfile = payload?.interview_profile || {};
  const projectEval = payload?.project_evaluation || {};

  const refresh = async () => {
    if (!row) return;
    setRefreshing(true);
    setError('');
    try {
      let next = await ensureCompanyIntelligence({
        company: row.company,
        role: row.role,
        forceRefresh: true,
      });
      if (next.status === 'generating') next = await pollUntilReady(next.id);
      setRow(next);
      if (next.slug && next.slug !== slug) {
        navigate(`${studentPaths.companies}/${encodeURIComponent(next.slug)}`, { replace: true });
      }
    } catch (err) {
      setError(err?.message || 'Refresh failed.');
    } finally {
      setRefreshing(false);
    }
  };

  if (busy) {
    return (
      <main className="stu-main">
        <div className="stu-ci stu-ci--detail">
          <p className="stu-ci__muted">
            <Loader2 size={16} className="spin" aria-hidden /> Loading company intelligence…
          </p>
        </div>
      </main>
    );
  }

  if (error && !row) {
    return (
      <main className="stu-main">
        <div className="stu-ci stu-ci--detail">
          <Link className="stu-link-btn" to={studentPaths.companies}>
            <ArrowLeft size={14} aria-hidden /> Back to Companies
          </Link>
          <p className="stu-ci__error" role="alert">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="stu-main">
      <div className="stu-ci stu-ci--detail">
        <div className="stu-ci__toolbar">
          <Link className="stu-link-btn" to={studentPaths.companies}>
            <ArrowLeft size={14} aria-hidden /> Companies
          </Link>
          <button type="button" className="stu-link-btn" onClick={refresh} disabled={refreshing}>
            <RefreshCw size={14} aria-hidden /> {refreshing ? 'Refreshing…' : 'Refresh intel'}
          </button>
        </div>

        <header className="stu-ci__detail-head">
          <Mark name={row.company} />
          <div>
            <h1 className="stu-ci__title">{row.company}</h1>
            <p className="stu-ci__sub">
              {row.role} · India
            </p>
            <div className="stu-ci__chips">
              <Confidence value={row.overall_confidence} strength={row.evidence_strength} />
              {row.last_updated_estimate ? (
                <span className="stu-ci__chip">Evidence ~{row.last_updated_estimate}</span>
              ) : null}
              {profile.hiring_type ? <span className="stu-ci__chip">{profile.hiring_type}</span> : null}
            </div>
          </div>
        </header>

        {error ? (
          <p className="stu-ci__error" role="alert">
            {error}
          </p>
        ) : null}

        {row.status === 'failed' ? (
          <p className="stu-ci__error" role="alert">
            {row.error_message || 'Intelligence generation failed.'}
          </p>
        ) : null}

        {row.status === 'unknown' || (!process.length && row.status === 'ready') ? (
          <p className="stu-alert stu-alert--info" role="status">
            Evidence is thin for this company/role. Treat details as provisional.
          </p>
        ) : null}

        {payload ? (
          <>
            <section className="stu-card stu-ci__panel stu-ci__panel--profile">
              <header className="stu-card__head">
                <div>
                  <h2 className="stu-card__title">Company profile</h2>
                  <p className="stu-card__sub">How this employer typically weighs engineering candidates</p>
                </div>
              </header>
              <dl className="stu-ci__stats">
                {[
                  ['Technical depth', profile.technical_depth],
                  ['Coding', profile.coding_importance],
                  ['Aptitude', profile.aptitude_importance],
                  ['Projects', profile.project_importance],
                  ['Communication', profile.communication_importance],
                  ['Behavioral', profile.behavioral_importance],
                ].map(([label, val]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{val || 'Unknown'}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="stu-card stu-ci__panel stu-ci__panel--process">
              <header className="stu-card__head">
                <div>
                  <h2 className="stu-card__title">Hiring process</h2>
                  <p className="stu-card__sub">Recurring rounds (variants included when known)</p>
                </div>
              </header>
              {process.length ? (
                <ol className="stu-ci__rounds">
                  {process
                    .slice()
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((r, idx) => (
                      <li key={`${r.round_name}-${idx}`}>
                        <strong>
                          {r.order || idx + 1}. {r.round_name || 'Round'}
                        </strong>
                        <em>
                          {[r.duration, r.elimination ? 'Elimination' : null, r.importance]
                            .filter(Boolean)
                            .join(' · ')}
                        </em>
                        <p>{r.evaluation_goal || ''}</p>
                      </li>
                    ))}
                </ol>
              ) : (
                <p className="stu-ci__muted">Unknown</p>
              )}
            </section>

            <section className="stu-card stu-ci__panel stu-ci__panel--evaluate">
              <header className="stu-card__head">
                <div>
                  <h2 className="stu-card__title">What they evaluate</h2>
                </div>
              </header>
              <ul className="stu-ci__pills">
                {dimensions.map((d) => (
                  <li key={d.dimension}>
                    <strong>{d.dimension}</strong>
                    <span>{d.importance || ''}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="stu-card stu-ci__panel stu-ci__panel--interview">
              <header className="stu-card__head">
                <div>
                  <h2 className="stu-card__title">Interview profile</h2>
                </div>
              </header>
              <dl className="stu-ci__stats">
                {Object.entries(interviewProfile).map(([key, val]) => (
                  <div key={key}>
                    <dt>{key.replace(/_/g, ' ')}</dt>
                    <dd>{typeof val === 'object' ? val?.value || 'Unknown' : val || 'Unknown'}</dd>
                  </div>
                ))}
              </dl>
              {projectEval?.importance ? (
                <p className="stu-ci__muted">
                  Projects: {projectEval.importance}
                  {projectEval.discussion_depth ? ` · depth ${projectEval.discussion_depth}` : ''}
                  {Array.isArray(projectEval.focus_areas) && projectEval.focus_areas.length
                    ? ` · focus: ${projectEval.focus_areas.join(', ')}`
                    : ''}
                </p>
              ) : null}
            </section>

            <section className="stu-card stu-ci__panel stu-ci__panel--reject">
              <header className="stu-card__head">
                <div>
                  <h2 className="stu-card__title">Common rejection reasons</h2>
                </div>
              </header>
              <ol className="stu-ci__reasons">
                {reasons.map((r) => (
                  <li key={`${r.rank}-${r.reason}`}>
                    <strong>{r.rank ? `${r.rank}. ` : ''}{r.reason}</strong>
                  </li>
                ))}
              </ol>
            </section>

            {blueprint.length ? (
              <section className="stu-card stu-ci__panel stu-ci__panel--blueprint">
                <header className="stu-card__head">
                  <div>
                    <h2 className="stu-card__title">Mock blueprint</h2>
                    <p className="stu-card__sub">Round shapes only — no sample questions</p>
                  </div>
                </header>
                <ul className="stu-ci__blueprint">
                  {blueprint.map((b, i) => (
                    <li key={`${b.round}-${i}`}>
                      <strong>{b.round}</strong>
                      <em>
                        {[b.difficulty, b.duration].filter(Boolean).join(' · ')}
                      </em>
                      <p>
                        {(b.question_types || []).join(', ')}
                        {b.evaluation_dimensions?.length
                          ? ` · evaluates ${b.evaluation_dimensions.join(', ')}`
                          : ''}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="stu-ci__cta">
              <Link className="stu-btn stu-btn--primary" to={studentPaths.companyPrep}>
                Practice with Company Prep <ArrowRight size={16} aria-hidden />
              </Link>
              <Link className="stu-link-btn" to={studentPaths.practice}>
                Open Practice tools
              </Link>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
