/**
 * Recharts-powered analytics for TPO/HOD deep performance analysis.
 */
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from 'recharts';

const COLORS = {
  strong: '#059669',
  mid: '#d97706',
  weak: '#e11d48',
  unscored: '#94a3b8',
  accent: '#0ea5e9',
  accent2: '#14b8a6',
  ink: 'var(--org-ink, #0f172a)',
  muted: 'var(--org-muted, #64748b)',
  grid: 'rgba(148,163,184,0.25)',
};

function ChartCard({ title, meta, children, tall }) {
  return (
    <section className={`mm-org-panel mm-org-chart-card${tall ? ' mm-org-chart-card--tall' : ''}`}>
      <div className="mm-org-panel__head">
        <div>
          <h2 className="mm-org-panel__title">{title}</h2>
          {meta ? <p className="mm-org-panel__meta">{meta}</p> : null}
        </div>
      </div>
      <div className="mm-org-chart-card__body">{children}</div>
    </section>
  );
}

function Empty({ text }) {
  return <div className="mm-org-empty">{text}</div>;
}

export function ReadinessPie({ bands = {}, avgReadiness }) {
  const data = [
    { name: 'Drive-ready ≥75%', value: bands.strong || 0, color: COLORS.strong },
    { name: 'Developing 50–74%', value: bands.mid || 0, color: COLORS.mid },
    { name: 'Less prepared <50%', value: bands.weak || 0, color: COLORS.weak },
    { name: 'Not scored', value: bands.unscored || 0, color: COLORS.unscored },
  ].filter((d) => d.value > 0);

  if (!data.length) return <Empty text="No cohort yet — enroll students to see readiness mix." />;

  return (
    <div className="mm-org-rechart mm-org-rechart--pie">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={92}
            paddingAngle={2}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mm-org-pie-center">
        <strong>{avgReadiness == null ? '—' : `${Math.round(avgReadiness)}%`}</strong>
        <span>avg readiness</span>
      </div>
    </div>
  );
}

export function PillarRadar({ pillars = {} }) {
  const rows = [
    { key: 'aptitude', subject: 'Aptitude' },
    { key: 'skills', subject: 'Skills' },
    { key: 'interview', subject: 'Interview' },
    { key: 'communication', subject: 'Comm' },
    { key: 'technical', subject: 'Technical' },
    { key: 'snap', subject: 'Snap' },
    { key: 'shortlist', subject: 'Shortlist' },
  ]
    .map((r) => ({ subject: r.subject, score: pillars[r.key], fullMark: 100 }))
    .filter((r) => r.score != null);

  if (rows.length < 3) {
    return <Empty text="Pillar radar needs at least 3 scored areas (among completers)." />;
  }

  return (
    <div className="mm-org-rechart">
      <p className="mm-org-chart-caption">Averages among students who completed each area</p>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={rows}>
          <PolarGrid stroke={COLORS.grid} />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Radar
            name="Cohort"
            dataKey="score"
            stroke={COLORS.accent}
            fill={COLORS.accent}
            fillOpacity={0.35}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TestsFunnelChart({ funnel = [] }) {
  const data = (funnel || []).map((f) => ({
    name: `L${f.level}`,
    label: f.label,
    completed: f.completed,
    reached: f.reachedOrBeyond ?? f.reached_or_beyond,
    pct: f.pctCompleted ?? f.pct_completed,
  }));
  if (!data.length) return <Empty text="Test level funnel appears after roadmap steps exist." />;

  return (
    <div className="mm-org-rechart">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value, key) => [value, key === 'completed' ? 'Completed' : 'Reached']}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.label || ''}
          />
          <Legend />
          <Bar dataKey="reached" name="Reached+" fill={COLORS.accent} radius={[4, 4, 0, 0]} />
          <Bar dataKey="completed" name="Completed" fill={COLORS.accent2} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ToolCoverageStacked({ tools = [] }) {
  const data = (tools || []).map((t) => ({
    name: (t.label || t.tool || '').replace(/ readiness| AI mock interview| interview/gi, '').slice(0, 14),
    full: t.label,
    completed: t.completed || 0,
    inProgress: t.inProgress ?? t.in_progress ?? 0,
    remaining: t.remaining || 0,
  }));
  if (!data.length) return <Empty text="Tool coverage appears after baseline attempts." />;

  return (
    <div className="mm-org-rechart">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={88} tick={{ fontSize: 10 }} />
          <Tooltip labelFormatter={(_, p) => p?.[0]?.payload?.full || ''} />
          <Legend />
          <Bar dataKey="completed" stackId="a" name="Done" fill={COLORS.strong} />
          <Bar dataKey="inProgress" stackId="a" name="In progress" fill={COLORS.accent} />
          <Bar dataKey="remaining" stackId="a" name="Remaining" fill={COLORS.unscored} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GapStrengthBars({ gaps = [], strengths = [] }) {
  const gapData = (gaps || []).slice(0, 6).map((g) => ({
    name: g.label.length > 18 ? `${g.label.slice(0, 16)}…` : g.label,
    full: g.label,
    count: g.count,
    share: g.sharePct ?? g.share_pct,
  }));
  const strData = (strengths || []).slice(0, 6).map((g) => ({
    name: g.label.length > 18 ? `${g.label.slice(0, 16)}…` : g.label,
    full: g.label,
    count: g.count,
    share: g.sharePct ?? g.share_pct,
  }));

  if (!gapData.length && !strData.length) {
    return <Empty text="Strength / preparation-gap themes appear after scored attempts." />;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <p className="mm-org-stat__label mb-2">Preparation gaps</p>
        {gapData.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={gapData} layout="vertical" margin={{ left: 4, right: 8 }}>
              <XAxis type="number" allowDecimals={false} hide />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(v, _, item) => [
                  `${v}${item?.payload?.share != null ? ` (${Math.round(item.payload.share)}% of scored)` : ''}`,
                  'Students',
                ]}
                labelFormatter={(_, p) => p?.[0]?.payload?.full || ''}
              />
              <Bar dataKey="count" fill={COLORS.weak} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Empty text="No gap themes yet." />
        )}
      </div>
      <div>
        <p className="mm-org-stat__label mb-2">Strength themes</p>
        {strData.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={strData} layout="vertical" margin={{ left: 4, right: 8 }}>
              <XAxis type="number" allowDecimals={false} hide />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(v, _, item) => [
                  `${v}${item?.payload?.share != null ? ` (${Math.round(item.payload.share)}% of scored)` : ''}`,
                  'Students',
                ]}
                labelFormatter={(_, p) => p?.[0]?.payload?.full || ''}
              />
              <Bar dataKey="count" fill={COLORS.strong} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Empty text="No strength themes yet." />
        )}
      </div>
    </div>
  );
}

export function DeptCompareChart({ departments = [] }) {
  const data = (departments || []).slice(0, 12).map((d) => ({
    name: d.code || d.name,
    full: d.name,
    avg: d.avgReadiness,
    strong: d.strong || 0,
    mid: d.mid || 0,
    weak: d.weak || 0,
    tests: d.avgTestsDone ?? d.avg_tests_done,
  }));
  if (!data.length) return <Empty text="No department data yet." />;

  return (
    <div className="mm-org-rechart">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(v, key) => {
              if (key === 'avg') return [v == null ? '—' : `${Math.round(v)}%`, 'Avg readiness'];
              return [v, key];
            }}
            labelFormatter={(_, p) => p?.[0]?.payload?.full || ''}
          />
          <Legend />
          <Bar dataKey="strong" stackId="b" name="Drive-ready" fill={COLORS.strong} />
          <Bar dataKey="mid" stackId="b" name="Developing" fill={COLORS.mid} />
          <Bar dataKey="weak" stackId="b" name="Less prepared" fill={COLORS.weak} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ActivityArea({ active = 0, idle = 0, inactive = 0, never = 0 }) {
  const data = [
    { name: 'Active 7d', value: active, fill: COLORS.strong },
    { name: 'Idle 8–14d', value: idle, fill: COLORS.accent },
    { name: 'Inactive 14d+', value: inactive, fill: COLORS.mid },
    { name: 'Never started', value: never, fill: COLORS.unscored },
  ];
  if (!data.some((d) => d.value > 0)) {
    return <Empty text="Activity appears once students start baseline tools." />;
  }
  return (
    <div className="mm-org-rechart">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke={COLORS.accent} fill={COLORS.accent} fillOpacity={0.35} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export { ChartCard, COLORS };
