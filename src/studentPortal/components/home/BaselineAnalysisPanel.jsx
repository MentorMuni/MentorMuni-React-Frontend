import { useMemo } from 'react';
import { ToolIcon } from '../../roadmap/toolIcons';
import { WEEK1_STEPS } from '../../roadmap/week1Steps';

const TOOL_META = Object.fromEntries(WEEK1_STEPS.map((s) => [s.tool_code, s]));

function scoreTone(score) {
  if (score == null) return 'neutral';
  if (score >= 70) return 'good';
  if (score >= 45) return 'mid';
  return 'low';
}

function parseRecommendation(text) {
  const raw = String(text || '').trim();
  if (!raw) return { topic: '', detail: '' };
  const colon = raw.indexOf(':');
  if (colon > 0 && colon < 48) {
    return {
      topic: raw.slice(0, colon).trim(),
      detail: raw.slice(colon + 1).trim(),
    };
  }
  return { topic: raw, detail: '' };
}

function isSignalStrength(text) {
  return /\d+\s*\/\s*\d+\s*ready signals/i.test(text);
}

function uniqueList(items) {
  const seen = new Set();
  const out = [];
  for (const item of items || []) {
    const key = String(item || '').trim();
    if (!key || seen.has(key.toLowerCase())) continue;
    seen.add(key.toLowerCase());
    out.push(key);
  }
  return out;
}

function TagList({ items, tone = 'neutral' }) {
  if (!items.length) return <p className="stu-bmap__empty">Nothing here yet.</p>;
  return (
    <ul className={`stu-bmap__tags is-${tone}`}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function BaselineAnalysisPanel({ analysis, steps = [] }) {
  const doneSteps = useMemo(
    () => [...steps].filter((s) => s.status === 'done').sort((a, b) => a.order - b.order),
    [steps]
  );

  const structured = useMemo(() => {
    const strengths = [];
    const gaps = [];

    for (const item of analysis?.top_strengths || []) {
      if (!isSignalStrength(item)) strengths.push(item);
    }
    for (const item of analysis?.top_weaknesses || []) {
      gaps.push(item);
    }

    const byTool = doneSteps.map((step) => ({
      toolCode: step.tool_code,
      title: TOOL_META[step.tool_code]?.title || step.tool_code,
      score: step.score,
      label: step.label,
      wins: uniqueList(step.strengths).slice(0, 3),
      gaps: uniqueList(step.weaknesses).slice(0, 3),
    }));

    const actions = (analysis?.recommendations || [])
      .slice(0, 4)
      .map((rec, i) => ({ id: `${i}-${rec}`, ...parseRecommendation(rec) }));

    return {
      strengths: uniqueList([...(analysis?.top_strengths || [])]).slice(0, 8),
      gaps: uniqueList(gaps).slice(0, 8),
      byTool,
      actions,
    };
  }, [analysis, doneSteps]);

  const completedCount = doneSteps.length;
  const overall = analysis?.overall_score != null ? Math.round(analysis.overall_score) : null;
  const hasSignal =
    completedCount > 0 || overall != null || structured.strengths.length || structured.gaps.length;

  if (!hasSignal) {
    return (
      <section className="stu-card stu-bmap stu-bmap--empty">
        <h2 className="stu-card__title">Baseline results</h2>
        <p className="stu-card__sub">
          Finish your first check — scores, strengths, and gaps show up here.
        </p>
      </section>
    );
  }

  return (
    <section className="stu-card stu-bmap" aria-labelledby="stu-bmap-title">
      <header className="stu-bmap__head">
        <div>
          <h2 className="stu-card__title" id="stu-bmap-title">
            Baseline results
          </h2>
          <p className="stu-card__sub">
            {overall != null
              ? `${overall}% average from ${completedCount} check${completedCount === 1 ? '' : 's'}. This shapes your prep plan.`
              : `From ${completedCount} completed check${completedCount === 1 ? '' : 's'}.`}
          </p>
        </div>
        {overall != null ? (
          <p className={`stu-bmap__avg is-${scoreTone(overall)}`}>
            {overall}
            <span>%</span>
          </p>
        ) : null}
      </header>

      {doneSteps.length > 0 ? (
        <div className="stu-bmap__scores">
          {doneSteps.map((step) => {
            const meta = TOOL_META[step.tool_code];
            const score = step.score != null ? Math.round(step.score) : null;
            const display =
              step.tool_code === '5_sec'
                ? step.label || 'Done'
                : score != null
                  ? `${score}%`
                  : step.label || 'Done';
            return (
              <div key={step.tool_code} className="stu-bmap__score-row">
                <ToolIcon toolCode={step.tool_code} size={15} strokeWidth={2} />
                <span className="stu-bmap__score-name">{meta?.title || step.tool_code}</span>
                <span className={`stu-bmap__score-val is-${scoreTone(score)}`}>{display}</span>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="stu-bmap__cols">
        <div className="stu-bmap__col">
          <h3 className="stu-bmap__col-title">Going well</h3>
          <TagList items={structured.strengths} tone="good" />
        </div>
        <div className="stu-bmap__col">
          <h3 className="stu-bmap__col-title">Needs work</h3>
          <TagList items={structured.gaps} tone="warn" />
        </div>
      </div>

      {structured.byTool.some((r) => r.wins.length || r.gaps.length) ? (
        <div className="stu-bmap__by-tool">
          <h3 className="stu-bmap__col-title">By check</h3>
          <ul className="stu-bmap__tool-list">
            {structured.byTool.map((row) =>
              row.wins.length || row.gaps.length ? (
                <li key={row.toolCode} className="stu-bmap__tool-item">
                  <div className="stu-bmap__tool-item-head">
                    <ToolIcon toolCode={row.toolCode} size={14} strokeWidth={2} />
                    <span>{row.title}</span>
                  </div>
                  {row.wins.length ? (
                    <p className="stu-bmap__tool-line is-good">
                      <strong>Strong:</strong> {row.wins.join(', ')}
                    </p>
                  ) : null}
                  {row.gaps.length ? (
                    <p className="stu-bmap__tool-line is-warn">
                      <strong>Gap:</strong> {row.gaps.join(', ')}
                    </p>
                  ) : null}
                </li>
              ) : null
            )}
          </ul>
        </div>
      ) : null}

      {structured.actions.length > 0 ? (
        <div className="stu-bmap__focus">
          <h3 className="stu-bmap__col-title">Focus next</h3>
          <ol className="stu-bmap__focus-list">
            {structured.actions.map((action) => (
              <li key={action.id}>
                <strong>{action.topic}</strong>
                {action.detail ? <span>{action.detail}</span> : null}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {analysis?.voice_avg ? (
        <p className="stu-bmap__voice">
          Mock interviews · Technical {analysis.voice_avg.technical ?? '—'}% · Communication{' '}
          {analysis.voice_avg.communication ?? '—'}%
        </p>
      ) : null}
    </section>
  );
}
