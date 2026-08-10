/**
 * SVG analytics charts for TPO/HOD performance — no chart library dependency.
 * Prefer readable legends, correct centers, and color-coded meaning.
 */

const BAND = {
  strong: { color: '#059669', label: 'Drive-ready ≥75%' },
  mid: { color: '#d97706', label: 'Developing 50–74%' },
  weak: { color: '#e11d48', label: 'Less prepared <50%' },
  unscored: { color: '#94a3b8', label: 'Not scored' },
};

function ChartLegend({ items }) {
  return (
    <ul className="mm-org-chart-legend">
      {items.map((it) => (
        <li key={it.key}>
          <span className="mm-org-chart-swatch" style={{ background: it.color }} />
          <span className="mm-org-chart-legend__label">{it.label}</span>
          {it.value != null ? <strong>{it.value}</strong> : null}
        </li>
      ))}
    </ul>
  );
}

/** Donut: center = avg readiness (or drive-ready %); ring = band mix. */
export function BandDonut({
  strong = 0,
  mid = 0,
  weak = 0,
  unscored = 0,
  centerValue,
  centerLabel = 'avg readiness',
  size = 168,
  showLegend = true,
}) {
  const parts = [
    { key: 'strong', value: strong, ...BAND.strong },
    { key: 'mid', value: mid, ...BAND.mid },
    { key: 'weak', value: weak, ...BAND.weak },
    { key: 'unscored', value: unscored, ...BAND.unscored },
  ];
  const total = parts.reduce((a, p) => a + (Number(p.value) || 0), 0);
  const scored = strong + mid + weak;
  const display =
    centerValue != null && !Number.isNaN(Number(centerValue))
      ? Math.round(Number(centerValue))
      : null;

  if (!total) {
    return (
      <div className="mm-org-chart-block">
        <div className="mm-org-empty">No cohort yet — enroll students to see readiness mix.</div>
      </div>
    );
  }

  const r = size / 2 - 12;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const denom = total || 1;

  return (
    <div className="mm-org-chart-block">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Readiness bands">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--org-track, #e2e8f0)" strokeWidth="16" />
        {parts.map((p) => {
          const len = (Math.max(0, Number(p.value) || 0) / denom) * c;
          if (len <= 0) return null;
          const el = (
            <circle
              key={p.key}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={p.color}
              strokeWidth="16"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
          offset += len;
          return el;
        })}
        <text
          x="50%"
          y="46%"
          textAnchor="middle"
          style={{ fill: 'var(--org-ink, #0f172a)', fontSize: 26, fontWeight: 800 }}
        >
          {display != null ? `${display}%` : scored ? `${Math.round((scored / denom) * 100)}%` : '—'}
        </text>
        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          style={{ fill: 'var(--org-muted, #64748b)', fontSize: 10, fontWeight: 650 }}
        >
          {display != null ? centerLabel : scored ? 'scored' : 'no scores'}
        </text>
      </svg>
      {showLegend ? (
        <ChartLegend
          items={parts.map((p) => ({
            key: p.key,
            color: p.color,
            label: p.label,
            value: p.value,
          }))}
        />
      ) : null}
    </div>
  );
}

export function PillarBars({ pillars = {}, max = 100 }) {
  const rows = [
    { key: 'aptitude', label: 'Aptitude', value: pillars.aptitude },
    { key: 'skills', label: 'Skills', value: pillars.skills },
    { key: 'interview', label: 'Interview', value: pillars.interview },
    { key: 'snap', label: '5-sec snap', value: pillars.snap },
    { key: 'technical', label: 'Technical', value: pillars.technical },
    { key: 'communication', label: 'Communication', value: pillars.communication },
  ].filter((r) => r.value != null);

  if (!rows.length) {
    return <div className="mm-org-empty">No pillar scores yet — students need to finish baseline tools.</div>;
  }

  return (
    <div className="mm-org-hbar-list" role="img" aria-label="Pillar averages">
      <p className="mm-org-chart-caption">Averages among students who completed each pillar</p>
      {rows.map((r) => {
        const pct = Math.max(0, Math.min(100, (Number(r.value) / max) * 100));
        const tone = pct >= 75 ? 'good' : pct >= 50 ? 'mid' : 'bad';
        return (
          <div key={r.key} className="mm-org-hbar">
            <div className="mm-org-hbar__meta">
              <span>{r.label}</span>
              <strong>{Math.round(Number(r.value))}%</strong>
            </div>
            <div className="mm-org-hbar__track">
              <div className={`mm-org-hbar__fill mm-org-hbar__fill--${tone}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Horizontal frequency bars for gaps / strengths. */
export function FrequencyBars({ items = [], tone = 'bad', empty = 'No themes yet.' }) {
  const rows = (items || []).slice(0, 6);
  if (!rows.length) return <div className="mm-org-empty">{empty}</div>;
  const max = Math.max(...rows.map((r) => Number(r.count) || 0), 1);
  return (
    <div className="mm-org-hbar-list">
      {rows.map((r) => {
        const pct = Math.round(((Number(r.count) || 0) / max) * 100);
        const share =
          r.sharePct != null ? `${Math.round(Number(r.sharePct))}% of scored` : null;
        return (
          <div key={r.label} className="mm-org-hbar">
            <div className="mm-org-hbar__meta">
              <span>{r.label}</span>
              <strong>
                {r.count}
                {share ? <span className="mm-org-hbar__share"> · {share}</span> : null}
              </strong>
            </div>
            <div className="mm-org-hbar__track">
              <div className={`mm-org-hbar__fill mm-org-hbar__fill--${tone}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Stacked activity mix. */
export function ActivityMix({ active = 0, idle = 0, inactive = 0, never = 0 }) {
  const parts = [
    { key: 'active', label: 'Active 7d', value: active, color: '#059669' },
    { key: 'idle', label: 'Idle 8–14d', value: idle, color: '#0ea5e9' },
    { key: 'inactive', label: 'Inactive 14d+', value: inactive, color: '#d97706' },
    { key: 'never', label: 'Never started', value: never, color: '#94a3b8' },
  ];
  const total = parts.reduce((a, p) => a + (Number(p.value) || 0), 0);
  if (!total) {
    return <div className="mm-org-empty">Activity appears once students start baseline tools.</div>;
  }
  return (
    <div className="mm-org-chart-block">
      <div className="mm-org-stack-bar" role="img" aria-label="Activity mix">
        {parts.map((p) => {
          const w = ((Number(p.value) || 0) / total) * 100;
          if (w <= 0) return null;
          return (
            <div
              key={p.key}
              className="mm-org-stack-bar__seg"
              style={{ width: `${w}%`, background: p.color }}
              title={`${p.label}: ${p.value}`}
            />
          );
        })}
      </div>
      <ChartLegend
        items={parts.map((p) => ({
          key: p.key,
          color: p.color,
          label: p.label,
          value: p.value,
        }))}
      />
    </div>
  );
}

/** Tool completion coverage. */
export function ToolCoverageBars({ tools = [] }) {
  const rows = (tools || []).slice(0, 8);
  if (!rows.length) return <div className="mm-org-empty">Tool coverage appears after baseline attempts.</div>;
  return (
    <div className="mm-org-hbar-list">
      {rows.map((t) => {
        const pct = Math.max(0, Math.min(100, Number(t.pct) || 0));
        const tone = pct >= 70 ? 'good' : pct >= 40 ? 'mid' : 'bad';
        return (
          <div key={t.tool || t.label} className="mm-org-hbar">
            <div className="mm-org-hbar__meta">
              <span>{t.label}</span>
              <strong>
                {t.completed}/{t.total} · {Math.round(pct)}%
              </strong>
            </div>
            <div className="mm-org-hbar__track">
              <div className={`mm-org-hbar__fill mm-org-hbar__fill--${tone}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Department compare with stacked readiness bands. */
export function DeptStackedBands({ departments = [] }) {
  const rows = (departments || []).slice(0, 10);
  if (!rows.length) return <div className="mm-org-empty">No department readiness data yet.</div>;

  return (
    <div className="mm-org-dept-stack">
      {rows.map((d) => {
        const strong = Number(d.strong) || 0;
        const mid = Number(d.mid) || 0;
        const weak = Number(d.weak) || 0;
        const unscored = Math.max(0, (Number(d.students) || 0) - strong - mid - weak);
        const total = strong + mid + weak + unscored || 1;
        const avg = d.avgReadiness != null ? Math.round(Number(d.avgReadiness)) : null;
        return (
          <div key={d.id || d.name} className="mm-org-dept-stack__row">
            <div className="mm-org-dept-stack__head">
              <span className="mm-org-dept-stack__name">
                {d.code || d.name}
                {d.topGap ? <em> · gap: {d.topGap}</em> : null}
              </span>
              <span className="mm-org-dept-stack__meta">
                {avg != null ? `${avg}% avg` : 'no scores'} · {d.students || 0} students
                {d.coveragePct != null ? ` · ${Math.round(d.coveragePct)}% scored` : ''}
              </span>
            </div>
            <div className="mm-org-stack-bar mm-org-stack-bar--sm">
              {[
                { k: 's', v: strong, c: BAND.strong.color },
                { k: 'm', v: mid, c: BAND.mid.color },
                { k: 'w', v: weak, c: BAND.weak.color },
                { k: 'u', v: unscored, c: BAND.unscored.color },
              ].map((p) => {
                const w = (p.v / total) * 100;
                if (w <= 0) return null;
                return (
                  <div key={p.k} className="mm-org-stack-bar__seg" style={{ width: `${w}%`, background: p.c }} />
                );
              })}
            </div>
          </div>
        );
      })}
      <ChartLegend
        items={[
          { key: 'strong', color: BAND.strong.color, label: 'Drive-ready' },
          { key: 'mid', color: BAND.mid.color, label: 'Developing' },
          { key: 'weak', color: BAND.weak.color, label: 'Less prepared' },
          { key: 'unscored', color: BAND.unscored.color, label: 'Not scored' },
        ]}
      />
    </div>
  );
}

export function DeptCompareBars({ departments = [] }) {
  const rows = (departments || []).slice(0, 8);
  if (!rows.length) {
    return <div className="mm-org-empty">No department readiness data yet.</div>;
  }
  return (
    <div className="mm-org-hbar-list">
      {rows.map((d) => {
        const hasScore = d.avgReadiness != null;
        const val = hasScore ? Number(d.avgReadiness) : 0;
        const tone = !hasScore ? 'none' : val >= 75 ? 'good' : val >= 50 ? 'mid' : 'bad';
        return (
          <div key={d.id || d.name} className="mm-org-hbar">
            <div className="mm-org-hbar__meta">
              <span>{(d.code || d.name || 'Dept').slice(0, 18)}</span>
              <strong>{hasScore ? `${Math.round(val)}%` : '—'}</strong>
            </div>
            <div className="mm-org-hbar__track">
              <div
                className={`mm-org-hbar__fill mm-org-hbar__fill--${tone === 'none' ? 'mid' : tone}`}
                style={{ width: `${hasScore ? Math.min(100, val) : 0}%`, opacity: hasScore ? 1 : 0.35 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Compact clarity board: going well / concerns / do next. */
export function ClarityBoard({ clarity, insight }) {
  // Prefer deterministic clarity for going/concerns when AI omitted them;
  // prefer AI actions when present (decision narrative).
  const going =
    insight?.goingWell?.length > 0 ? insight.goingWell : clarity?.goingWell || [];
  const concerns =
    insight?.concerns?.length > 0 ? insight.concerns : clarity?.concerns || [];
  const priorities =
    insight?.actions?.length > 0 ? insight.actions : clarity?.priorities || [];
  const status = clarity?.status || 'watch';

  return (
    <div className={`mm-org-clarity mm-org-clarity--${status}`}>
      <div className="mm-org-clarity__status">
        Situation:{' '}
        <strong>
          {status === 'healthy' ? 'On track' : status === 'critical' ? 'Needs action' : 'Watch closely'}
        </strong>
      </div>
      <div className="mm-org-clarity__grid">
        <div className="mm-org-clarity__col mm-org-clarity__col--good">
          <h4>Going well</h4>
          <ul>
            {going.length ? going.map((t) => <li key={t}>{t}</li>) : <li>Collect more scores to surface strengths.</li>}
          </ul>
        </div>
        <div className="mm-org-clarity__col mm-org-clarity__col--bad">
          <h4>Concerns</h4>
          <ul>
            {concerns.length ? concerns.map((t) => <li key={t}>{t}</li>) : <li>No major red flags yet.</li>}
          </ul>
        </div>
        <div className="mm-org-clarity__col mm-org-clarity__col--next">
          <h4>What to do next</h4>
          <ol>
            {priorities.length ? priorities.map((t) => <li key={t}>{t}</li>) : <li>Keep weekly readiness checks running.</li>}
          </ol>
        </div>
      </div>
    </div>
  );
}
