/**
 * Recharts analytics for student Progress (placement signal).
 */
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

const COLORS = {
  accent: '#0e6fa8',
  good: '#059669',
  mid: '#d97706',
  weak: '#e11d48',
  track: '#94a3b8',
  teal: '#0d9488',
  grid: 'rgba(148,163,184,0.28)',
};

const TOOL_LABELS = {
  '5_sec': '5-sec snap',
  aptitude: 'Aptitude',
  skill_readiness: 'Skill readiness',
  skill_mock: 'Skill mock',
  project_mock: 'Project mock',
  interview_readiness: 'Interview readiness',
  interview_mock: 'Interview mock',
  hr_mock: 'HR mock',
};

const tick = { fontSize: 11, fill: 'currentColor' };

const TOOLTIP_BOX = {
  background: 'var(--surface, #fff)',
  border: '1px solid var(--line, #e2e8f0)',
  borderRadius: 10,
  fontSize: 12,
  color: 'var(--ink, #0f172a)',
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.1)',
  padding: '8px 12px',
};

function scoreColor(v) {
  if (v >= 75) return COLORS.good;
  if (v >= 50) return COLORS.mid;
  return COLORS.weak;
}

function Empty({ text }) {
  return <p className="stu-progress__empty">{text}</p>;
}

function ChartTip(props) {
  return (
    <Tooltip
      cursor={{ fill: 'rgba(148,163,184,0.1)' }}
      contentStyle={TOOLTIP_BOX}
      labelStyle={{ color: 'var(--ink)', fontWeight: 700 }}
      itemStyle={{ color: 'var(--ink)', fontWeight: 600 }}
      {...props}
    />
  );
}

/** Horizontal bars: score per completed baseline tool. */
export function ToolScoreBars({ scoresByTool = {}, completedSteps = [] }) {
  const titleByCode = Object.fromEntries(
    (completedSteps || []).map((s) => [s.tool_code, s.title])
  );
  const data = Object.entries(scoresByTool || {})
    .map(([code, score]) => ({
      code,
      name: TOOL_LABELS[code] || titleByCode[code] || code,
      score: Number(score),
    }))
    .filter((d) => Number.isFinite(d.score))
    .sort((a, b) => b.score - a.score);

  if (!data.length) {
    return <Empty text="Scores appear after you finish baseline checks." />;
  }

  return (
    <div className="stu-progress__chart">
      <ResponsiveContainer width="100%" height={Math.max(168, data.length * 34)}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 36, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={tick} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="name" width={108} tick={tick} />
          <ChartTip formatter={(v) => [`${Math.round(v)}%`, 'Score']} />
          <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={14}>
            {data.map((d) => (
              <Cell key={d.code} fill={scoreColor(d.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Donut: completed vs remaining baseline checks. */
export function ActivityCompletionPie({ completed = 0, total = 0 }) {
  const remaining = Math.max(0, (total || 0) - (completed || 0));
  const raw = [
    { name: 'Completed', value: completed || 0, color: COLORS.good },
    { name: 'Remaining', value: remaining, color: COLORS.track },
  ];
  const sum = raw.reduce((s, d) => s + d.value, 0);
  if (!sum) return <Empty text="Activity appears once your Week-1 roadmap loads." />;

  const data = raw.filter((d) => d.value > 0);
  const pct = total ? Math.round(((completed || 0) / total) * 100) : 0;

  return (
    <div className="stu-progress__chart stu-progress__chart--pie">
      <div className="stu-progress__chart-plot">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={74}
              paddingAngle={2}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} stroke="transparent" />
              ))}
            </Pie>
            <ChartTip formatter={(v) => [`${v} checks`, 'Count']} />
          </PieChart>
        </ResponsiveContainer>
        <div className="stu-progress__chart-center">
          <strong>{pct}%</strong>
          <span>
            {completed || 0}/{total || 0} done
          </span>
        </div>
      </div>
      <ul className="stu-progress__chart-legend" aria-label="Completion legend">
        {data.map((d) => (
          <li key={d.name}>
            <span style={{ background: d.color }} aria-hidden />
            {d.name}
            <strong>{d.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Voice mock technical vs communication averages. */
export function VoiceScoreBars({ voiceAvg }) {
  const tech = voiceAvg?.technical;
  const comm = voiceAvg?.communication;
  const data = [
    tech != null ? { name: 'Technical', score: Number(tech), fill: COLORS.accent } : null,
    comm != null ? { name: 'Communication', score: Number(comm), fill: COLORS.teal } : null,
  ].filter(Boolean);

  if (!data.length) return null;

  return (
    <div className="stu-progress__chart">
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis dataKey="name" tick={tick} />
          <YAxis domain={[0, 100]} tick={tick} tickFormatter={(v) => `${v}%`} width={36} />
          <ChartTip formatter={(v) => [`${Math.round(v)}%`, 'Avg']} />
          <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={32}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
