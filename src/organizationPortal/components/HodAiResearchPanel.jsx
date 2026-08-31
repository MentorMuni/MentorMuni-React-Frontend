import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { buildLocalBranchInsight } from '../store';
import { fetchBranchInsight, mapInsight } from '../performanceApi';

/**
 * HOD branch deep-research panel — LLM narrative + recommended actions.
 */
export default function HodAiResearchPanel({ metrics, demo, departmentId, scopeLabel }) {
  const [insight, setInsight] = useState(() => buildLocalBranchInsight(metrics));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadInsight = useCallback(async () => {
    if (demo) {
      setInsight(buildLocalBranchInsight(metrics));
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetchBranchInsight({
        department_id: departmentId || undefined,
        include_leaderboard: true,
        max_actions: 6,
      });
      setInsight(mapInsight(res) || buildLocalBranchInsight(metrics));
    } catch (err) {
      setError(err?.message || 'Could not generate branch insight.');
      setInsight(buildLocalBranchInsight(metrics));
    } finally {
      setLoading(false);
    }
  }, [demo, metrics, departmentId]);

  useEffect(() => {
    loadInsight();
  }, [loadInsight]);

  const brief = insight || buildLocalBranchInsight(metrics);

  return (
    <section className="mm-org-panel mm-org-panel--hod-ai">
      <div className="mm-org-panel__head">
        <div>
          <h2 className="mm-org-panel__title">AI branch research</h2>
          <p className="mm-org-panel__meta">
            Deep analysis of {scopeLabel || 'your department'} — strengths, risks, and coaching priorities
          </p>
        </div>
        <button
          type="button"
          className="mm-org-btn mm-org-btn--ghost"
          onClick={loadInsight}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'mm-org-spin' : ''} />
          {loading ? 'Researching…' : 'Regenerate'}
        </button>
      </div>

      {error ? (
        <div className="mm-org-alert mm-org-alert--warn mb-3" role="status">
          {error} Showing heuristic brief from live metrics.
        </div>
      ) : null}

      <div className="mm-org-ai-box mm-org-ai-box--hod">
        <p className="mm-org-ai-box__title">
          <Sparkles size={14} aria-hidden /> Executive summary
        </p>
        <p className="mm-org-ai-box__body">{brief.summary}</p>

        {brief.goingWell?.length ? (
          <div className="mm-org-hod-ai-cols">
            <div>
              <p className="mm-org-stat__label mb-1">Going well</p>
              <ul className="m-0 list-disc space-y-1 pl-5 text-sm mm-org-text">
                {brief.goingWell.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            {brief.concerns?.length ? (
              <div>
                <p className="mm-org-stat__label mb-1">Watch closely</p>
                <ul className="m-0 list-disc space-y-1 pl-5 text-sm mm-org-text">
                  {brief.concerns.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        {(brief.actions || []).length ? (
          <>
            <p className="mm-org-stat__label mt-3 mb-1">Recommended actions</p>
            <ul className="m-0 list-disc space-y-1 pl-5 text-sm mm-org-text">
              {brief.actions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </>
        ) : null}

        <p className="mm-org-ai-box__meta">
          {brief.source === 'heuristic'
            ? 'Heuristic brief from branch aggregates. Configure OpenAI for richer narrative research.'
            : `Generated with ${brief.model || 'OpenAI'}`}
        </p>
      </div>
    </section>
  );
}
