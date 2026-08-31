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
  RadialBarChart,
  RadialBar,
  LabelList,
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

const tickInk = { fontSize: 11, fill: COLORS.ink };
const tickInkSm = { fontSize: 10, fill: COLORS.ink };

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

const PILLAR_COLORS = {
  aptitude: '#0ea5e9',
  skills: '#14b8a6',
  interview: '#8b5cf6',
  voiceMock: '#f59e0b',
  communication: '#ec4899',
};

const PILLAR_LABELS = {
  aptitude: 'Aptitude',
  skills: 'Skills',
  interview: 'Interview',
  voiceMock: 'Voice AI mock',
  communication: 'Communication',
};

function executivePillarRows(pillars = {}, avgMock) {
  return [
    { key: 'aptitude', name: 'Aptitude', value: pillars.aptitude, fill: PILLAR_COLORS.aptitude },
    { key: 'skills', name: 'Skills', value: pillars.skills, fill: PILLAR_COLORS.skills },
    { key: 'interview', name: 'Interview', value: pillars.interview, fill: PILLAR_COLORS.interview },
    { key: 'voiceMock', name: 'Voice AI mock', value: avgMock, fill: PILLAR_COLORS.voiceMock },
    {
      key: 'communication',
      name: 'Communication',
      value: pillars.communication,
      fill: PILLAR_COLORS.communication,
    },
  ].filter((r) => r.value != null);
}

/** Plain-English one-liner so dean / HR can read charts without training. */
function ChartInsight({ children }) {
  return <p className="mm-org-chart-insight">{children}</p>;
}

/** Readable legend under pies — count + % always visible (not only on hover). */
function PieLegendList({ items = [] }) {
  if (!items.length) return null;
  return (
    <ul className="mm-org-pie-legend" aria-label="Chart legend">
      {items.map((item) => (
        <li key={item.name}>
          <span className="mm-org-pie-legend__swatch" style={{ background: item.color }} aria-hidden />
          <span className="mm-org-pie-legend__label">{item.name}</span>
          <strong>
            {item.value} <span className="mm-org-pie-legend__pct">({item.pct}%)</span>
          </strong>
        </li>
      ))}
    </ul>
  );
}

/** Shared color key for the five readiness pillars. */
export function PillarColorKey() {
  const items = [
    { label: 'Aptitude', color: PILLAR_COLORS.aptitude },
    { label: 'Skills', color: PILLAR_COLORS.skills },
    { label: 'Interview', color: PILLAR_COLORS.interview },
    { label: 'Voice AI mock', color: PILLAR_COLORS.voiceMock },
    { label: 'Communication', color: PILLAR_COLORS.communication },
  ];
  return (
    <ul className="mm-org-pillar-key" aria-label="Pillar color key">
      {items.map((item) => (
        <li key={item.label}>
          <span style={{ background: item.color }} aria-hidden />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

function PillarScoreList({ pillars = {}, avgMock }) {
  const rows = executivePillarRows(pillars, avgMock).sort((a, b) => (b.value || 0) - (a.value || 0));
  if (!rows.length) return null;
  return (
    <ul className="mm-org-pillar-score-list">
      {rows.map((r) => (
        <li key={r.key}>
          <span className="mm-org-pillar-score-list__swatch" style={{ background: r.fill }} />
          <span>{r.name}</span>
          <strong>{Math.round(r.value)}%</strong>
        </li>
      ))}
    </ul>
  );
}

export function ReadinessPie({ bands = {}, avgReadiness, onSliceClick }) {
  const raw = [
    { name: 'Drive-ready ≥75%', value: bands.strong || 0, color: COLORS.strong, drill: { type: 'band', key: 'strong' } },
    { name: 'Developing 50–74%', value: bands.mid || 0, color: COLORS.mid, drill: { type: 'band', key: 'mid' } },
    { name: 'Less prepared <50%', value: bands.weak || 0, color: COLORS.weak, drill: { type: 'band', key: 'weak' } },
    { name: 'Not scored', value: bands.unscored || 0, color: COLORS.unscored, drill: { type: 'band', key: 'unscored' } },
  ];
  const total = raw.reduce((s, d) => s + d.value, 0);
  const data = raw.filter((d) => d.value > 0).map((d) => ({
    ...d,
    pct: total ? Math.round((d.value / total) * 100) : 0,
  }));

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
            className={onSliceClick ? 'mm-org-pie--clickable' : undefined}
            onClick={onSliceClick ? (entry) => onSliceClick(entry?.drill, entry) : undefined}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, _name, item) => [
              `${value} students (${item?.payload?.pct ?? 0}% of roster)`,
              'Students',
            ]}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mm-org-pie-center">
        <strong>{avgReadiness == null ? '—' : `${Math.round(avgReadiness)}%`}</strong>
        <span>campus average</span>
      </div>
      <PieLegendList items={data} />
      <ChartInsight>
        Green = placement-ready (75%+). Orange = improving. Red = needs coaching. Grey = not assessed yet.
      </ChartInsight>
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
          <PolarAngleAxis dataKey="subject" tick={tickInk} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={tickInkSm} />
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
          <XAxis dataKey="name" tick={tickInk} />
          <YAxis allowDecimals={false} tick={tickInk} />
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
          <XAxis type="number" allowDecimals={false} tick={tickInk} />
          <YAxis type="category" dataKey="name" width={88} tick={tickInkSm} />
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

export function CoverageDonut({ studentsScored = 0, students = 0, coveragePct }) {
  const unscored = Math.max(0, students - studentsScored);
  const raw = [
    { name: 'Assessed students', value: studentsScored, color: COLORS.strong },
    { name: 'Not assessed yet', value: unscored, color: COLORS.unscored },
  ];
  const total = raw.reduce((s, d) => s + d.value, 0);
  const data = raw.filter((d) => d.value > 0).map((d) => ({
    ...d,
    pct: total ? Math.round((d.value / total) * 100) : 0,
  }));

  if (!total) return <Empty text="Enroll students to see assessment coverage." />;

  const pct = coveragePct ?? (total ? Math.round((studentsScored / total) * 100) : 0);

  return (
    <div className="mm-org-rechart mm-org-rechart--pie">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={56} outerRadius={84} paddingAngle={3}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v, _, item) => [`${v} students (${item?.payload?.pct ?? 0}% of roster)`, 'Students']} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mm-org-pie-center mm-org-pie-center--sm">
        <strong>{pct}%</strong>
        <span>assessed</span>
      </div>
      <PieLegendList items={data} />
      <ChartInsight>How many enrolled students have completed at least one readiness check.</ChartInsight>
    </div>
  );
}

export function ActivityEngagementPie({ active = 0, idle = 0, inactive = 0, never = 0, onSliceClick }) {
  const raw = [
    { name: 'Active this week', value: active, color: COLORS.strong, drill: { type: 'activity', key: 'active' } },
    { name: 'Quiet (8–14 days)', value: idle, color: COLORS.accent, drill: { type: 'activity', key: 'idle' } },
    { name: 'Inactive (2+ weeks)', value: inactive, color: COLORS.mid, drill: { type: 'activity', key: 'inactive' } },
    { name: 'Never started', value: never, color: COLORS.unscored, drill: { type: 'activity', key: 'never' } },
  ];
  const total = raw.reduce((s, d) => s + d.value, 0);
  const data = raw.filter((d) => d.value > 0).map((d) => ({
    ...d,
    pct: total ? Math.round((d.value / total) * 100) : 0,
  }));

  if (!data.length) {
    return <Empty text="Activity breakdown appears once students start baseline tools." />;
  }

  return (
    <div className="mm-org-rechart">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={48} outerRadius={82} paddingAngle={2}
            className={onSliceClick ? 'mm-org-pie--clickable' : undefined}
            onClick={onSliceClick ? (entry) => onSliceClick(entry?.drill, entry) : undefined}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v, _, item) => [`${v} students (${item?.payload?.pct ?? 0}%)`, 'Students']} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
      <PieLegendList items={data} />
      <ChartInsight>Who is actively preparing vs. who needs a nudge to log in and start checks.</ChartInsight>
    </div>
  );
}

export function PillarComparisonBars({ pillars = {}, avgMock }) {
  const data = executivePillarRows(pillars, avgMock).map((r) => ({
    ...r,
    label: r.name,
  }));

  if (!data.length) {
    return <Empty text="Pillar scores appear after students complete baseline checks." />;
  }

  return (
    <div className="mm-org-rechart">
      <p className="mm-org-chart-caption">Campus average % per readiness pillar</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={tickInkSm} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="name" width={108} tick={tickInkSm} />
          <Tooltip formatter={(v) => [`${Math.round(v)}%`, 'Average']} />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={18}>
            {data.map((d) => (
              <Cell key={d.key} fill={d.fill} />
            ))}
            <LabelList dataKey="value" position="right" formatter={(v) => `${Math.round(v)}%`} fill={COLORS.ink} fontSize={11} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <ChartInsight>Higher bar = stronger campus-wide average for that skill area (0–100%).</ChartInsight>
    </div>
  );
}

export function PillarRadialChart({ pillars = {}, avgMock }) {
  const data = executivePillarRows(pillars, avgMock);
  if (data.length < 2) {
    return <Empty text="Complete at least two pillar assessments to see radial comparison." />;
  }

  return (
    <div className="mm-org-rechart">
      <p className="mm-org-chart-caption">Relative pillar strength (campus average)</p>
      <ResponsiveContainer width="100%" height={280}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="18%"
          outerRadius="95%"
          barSize={14}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar background cornerRadius={6} dataKey="value">
            {data.map((d) => (
              <Cell key={d.key} fill={d.fill} />
            ))}
          </RadialBar>
          <Legend />
          <Tooltip formatter={(v) => [`${Math.round(v)}%`, 'Average']} />
        </RadialBarChart>
      </ResponsiveContainer>
      <p className="mm-org-chart-caption">Same pillar scores — ranked highest to lowest</p>
      <PillarScoreList pillars={pillars} avgMock={avgMock} />
      <ChartInsight>Use the list above for exact %. Rings are a quick visual — longer ring = higher score.</ChartInsight>
    </div>
  );
}

export function ReadinessDistributionChart({ students = [], onBarClick }) {
  const buckets = [
    { name: '90–100%', min: 90, max: 100, color: '#047857', drill: { type: 'distribution', key: '90–100%' } },
    { name: '75–89%', min: 75, max: 89, color: COLORS.strong, drill: { type: 'distribution', key: '75–89%' } },
    { name: '50–74%', min: 50, max: 74, color: COLORS.mid, drill: { type: 'distribution', key: '50–74%' } },
    { name: 'Below 50%', min: 0, max: 49, color: COLORS.weak, drill: { type: 'distribution', key: 'Below 50%' } },
    { name: 'Not scored', min: null, max: null, color: COLORS.unscored, drill: { type: 'distribution', key: 'Not scored' } },
  ];

  const counts = buckets.map((b) => {
    let count = 0;
    if (b.name === 'Not scored') {
      count = students.filter((s) => s.readiness == null || Number(s.readiness) <= 0).length;
    } else {
      count = students.filter((s) => {
        const r = Number(s.readiness);
        return r >= b.min && r <= b.max;
      }).length;
    }
    return { ...b, count };
  });

  const data = counts.filter((d) => d.count > 0);
  const total = students.length;

  if (!total) return <Empty text="Student distribution appears once the roster is enrolled." />;

  return (
    <div className="mm-org-rechart">
      <p className="mm-org-chart-caption">How students spread across readiness bands</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
          <XAxis dataKey="name" tick={tickInkSm} />
          <YAxis allowDecimals={false} tick={tickInk} />
          <Tooltip
            formatter={(v, _, item) => {
              const pct = total ? Math.round((v / total) * 100) : 0;
              return [`${v} students (${pct}%)`, 'Count'];
            }}
          />
          <Bar
            dataKey="count"
            radius={[8, 8, 0, 0]}
            barSize={36}
            className={onBarClick ? 'mm-org-bar--clickable' : undefined}
            onClick={onBarClick ? (data) => onBarClick(data?.drill, data) : undefined}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
            <LabelList dataKey="count" position="top" fontSize={11} fill={COLORS.ink} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <ChartInsight>Taller bar = more students in that score range. Numbers on bars = student count.</ChartInsight>
    </div>
  );
}

export function DeptReadinessRankChart({ departments = [] }) {
  const data = (departments || [])
    .filter((d) => d.avgReadiness != null)
    .map((d) => ({
      name: d.code || d.name,
      full: d.name,
      readiness: Math.round(d.avgReadiness),
      scored: d.scoredStudents ?? 0,
      fill:
        d.avgReadiness >= 75 ? COLORS.strong : d.avgReadiness >= 50 ? COLORS.mid : COLORS.weak,
    }))
    .sort((a, b) => b.readiness - a.readiness);

  if (!data.length) return <Empty text="Branch rankings appear after departments have scored students." />;

  return (
    <div className="mm-org-rechart">
      <p className="mm-org-chart-caption">Branches ranked by average readiness %</p>
      <ResponsiveContainer width="100%" height={Math.max(220, data.length * 36)}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={tickInkSm} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="name" width={72} tick={tickInkSm} />
          <Tooltip
            formatter={(v) => [`${v}%`, 'Avg readiness']}
            labelFormatter={(_, p) => {
              const row = p?.[0]?.payload;
              return row ? `${row.full} · ${row.scored} scored` : '';
            }}
          />
          <Bar dataKey="readiness" radius={[0, 8, 8, 0]} barSize={16}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.fill} />
            ))}
            <LabelList dataKey="readiness" position="right" formatter={(v) => `${v}%`} fontSize={11} fill={COLORS.ink} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <ChartInsight>Top branch = highest average readiness. Bar color: green ≥75%, orange 50–74%, red below 50%.</ChartInsight>
    </div>
  );
}

export function DriveReadyByDeptChart({ departments = [] }) {
  const data = (departments || [])
    .map((d) => {
      const scored = d.scoredStudents ?? (d.strong || 0) + (d.mid || 0) + (d.weak || 0);
      const pct = scored ? Math.round(((d.strong || 0) / scored) * 100) : 0;
      return {
        name: d.code || d.name,
        full: d.name,
        pct,
        strong: d.strong || 0,
        scored,
        fill: pct >= 60 ? COLORS.strong : pct >= 35 ? COLORS.mid : COLORS.weak,
      };
    })
    .filter((d) => d.scored > 0)
    .sort((a, b) => b.pct - a.pct);

  if (!data.length) return <Empty text="Drive-ready share by branch appears after scored cohorts exist." />;

  return (
    <div className="mm-org-rechart">
      <p className="mm-org-chart-caption">% of scored students at drive-ready (≥75%)</p>
      <ResponsiveContainer width="100%" height={Math.max(220, data.length * 36)}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={tickInkSm} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="name" width={72} tick={tickInkSm} />
          <Tooltip
            formatter={(v, _, item) => [`${v}% (${item?.payload?.strong}/${item?.payload?.scored})`, 'Drive-ready']}
            labelFormatter={(_, p) => p?.[0]?.payload?.full || ''}
          />
          <Bar dataKey="pct" radius={[0, 8, 8, 0]} barSize={16}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.fill} />
            ))}
            <LabelList dataKey="pct" position="right" formatter={(v) => `${v}%`} fontSize={11} fill={COLORS.ink} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <ChartInsight>
        Share of assessed students in each branch who are placement-ready (75%+ overall readiness).
      </ChartInsight>
    </div>
  );
}

export function TestsCompletionChart({ tests = {}, studentsScored = 0 }) {
  const avgDone = tests?.avgTestsDone ?? 0;
  const toolsTotal = tests?.toolsTotal ?? 8;
  const pct = toolsTotal ? Math.round((avgDone / toolsTotal) * 100) : 0;
  const data = [
    { name: 'Checks done (avg)', value: Math.round(avgDone * 10) / 10, fill: COLORS.strong },
    { name: 'Checks left (avg)', value: Math.max(0, Math.round((toolsTotal - avgDone) * 10) / 10), fill: COLORS.unscored },
  ].filter((d) => d.value > 0);

  if (!studentsScored || !data.length) {
    return <Empty text="Test completion chart appears after students start the roadmap." />;
  }

  return (
    <div className="mm-org-rechart mm-org-rechart--pie">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={2}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(v, name) => [`${v} of ${toolsTotal} tools`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mm-org-pie-center mm-org-pie-center--sm">
        <strong>{pct}%</strong>
        <span>roadmap done</span>
      </div>
      <ChartInsight>
        Each student has {toolsTotal} baseline checks (aptitude, skills, mocks, etc.). This is the average completion
        across scored students.
      </ChartInsight>
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
              <YAxis type="category" dataKey="name" width={100} tick={tickInkSm} />
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
              <YAxis type="category" dataKey="name" width={100} tick={tickInkSm} />
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
    total: (d.strong || 0) + (d.mid || 0) + (d.weak || 0),
    tests: d.avgTestsDone ?? d.avg_tests_done,
  }));
  if (!data.length) return <Empty text="No department data yet." />;

  return (
    <div className="mm-org-rechart">
      <p className="mm-org-chart-caption">Student counts by readiness band (stacked)</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis dataKey="name" tick={tickInk} interval={0} angle={data.length > 6 ? -24 : 0} textAnchor={data.length > 6 ? 'end' : 'middle'} height={data.length > 6 ? 52 : 30} />
          <YAxis allowDecimals={false} tick={tickInk} />
          <Tooltip
            formatter={(v, key) => {
              const labels = {
                strong: 'Drive-ready',
                mid: 'Developing',
                weak: 'Less prepared',
              };
              return [`${v} students`, labels[key] || key];
            }}
            labelFormatter={(_, p) => {
              const row = p?.[0]?.payload;
              if (!row) return '';
              const avg = row.avg == null ? '—' : `${Math.round(row.avg)}%`;
              return `${row.full} · avg ${avg}`;
            }}
          />
          <Legend />
          <Bar dataKey="strong" stackId="b" name="Drive-ready" fill={COLORS.strong} />
          <Bar dataKey="mid" stackId="b" name="Developing" fill={COLORS.mid} />
          <Bar dataKey="weak" stackId="b" name="Less prepared" fill={COLORS.weak} />
        </BarChart>
      </ResponsiveContainer>
      <ChartInsight>
        Each column is one branch. Stack height = number of students. Green = drive-ready, orange = developing, red =
        needs support.
      </ChartInsight>
    </div>
  );
}

export function DeptPillarCompareChart({ departments = [], showExecutive = false }) {
  const data = (departments || [])
    .filter(
      (d) =>
        d.pillars?.aptitude != null ||
        d.pillars?.skills != null ||
        d.pillars?.interview != null ||
        d.avgMock != null ||
        d.pillars?.communication != null
    )
    .slice(0, 12)
    .map((d) => ({
      name: d.code || d.name,
      full: d.name,
      aptitude: d.pillars?.aptitude ?? null,
      skills: d.pillars?.skills ?? null,
      interview: d.pillars?.interview ?? null,
      voiceMock: d.avgMock ?? null,
      communication: d.pillars?.communication ?? null,
    }));
  if (!data.length) {
    return <Empty text="Branch pillar scores appear after students complete assessment checks." />;
  }

  return (
    <div className="mm-org-rechart">
      <PillarColorKey />
      <p className="mm-org-chart-caption">Each branch = group of colored bars (one per skill area). Taller = higher %.</p>
      <ResponsiveContainer width="100%" height={showExecutive ? 320 : 300}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis dataKey="name" tick={tickInkSm} interval={0} angle={data.length > 5 ? -22 : 0} textAnchor={data.length > 5 ? 'end' : 'middle'} height={data.length > 5 ? 48 : 30} />
          <YAxis domain={[0, 100]} tick={tickInk} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            formatter={(v, key) => [v == null ? '—' : `${Math.round(v)}%`, PILLAR_LABELS[key] || key]}
            labelFormatter={(_, p) => p?.[0]?.payload?.full || ''}
          />
          <Legend />
          <Bar dataKey="aptitude" name="Aptitude" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          <Bar dataKey="skills" name="Skills" fill="#14b8a6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="interview" name="Interview" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          {showExecutive ? (
            <>
              <Bar dataKey="voiceMock" name="Voice AI mock" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="communication" name="Communication" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </>
          ) : null}
        </BarChart>
      </ResponsiveContainer>
      <ChartInsight>Compare branches side-by-side — which department is strongest in aptitude, interview, etc.</ChartInsight>
    </div>
  );
}

export function ExecutivePillarKpis({ pillars = {}, avgMock }) {
  const allKeys = [
    { key: 'aptitude', label: 'Aptitude readiness', value: pillars.aptitude, tone: PILLAR_COLORS.aptitude },
    { key: 'skills', label: 'Skill readiness', value: pillars.skills, tone: PILLAR_COLORS.skills },
    { key: 'interview', label: 'Interview readiness', value: pillars.interview, tone: PILLAR_COLORS.interview },
    { key: 'voiceMock', label: 'Voice AI mock', value: avgMock, tone: PILLAR_COLORS.voiceMock },
    {
      key: 'communication',
      label: 'Communication',
      value: pillars.communication,
      tone: PILLAR_COLORS.communication,
    },
  ];
  const items = allKeys;

  return (
    <div className="mm-org-exec-pillars">
      {items.map((item) => (
        <div key={item.key} className="mm-org-exec-pillar" style={{ '--pillar-tone': item.tone }}>
          <p className="mm-org-exec-pillar__label">{item.label}</p>
          <p className="mm-org-exec-pillar__value">
            {item.value == null ? '—' : `${Math.round(item.value)}%`}
          </p>
          <div className="mm-org-exec-pillar__bar">
            <span style={{ width: `${Math.min(100, Math.max(0, item.value || 0))}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ExecutivePillarRadar({ pillars = {}, avgMock }) {
  const rows = [
    { subject: 'Aptitude', score: pillars.aptitude },
    { subject: 'Skills', score: pillars.skills },
    { subject: 'Interview', score: pillars.interview },
    { subject: 'Voice mock', score: avgMock },
    { subject: 'Communication', score: pillars.communication },
  ]
    .filter((r) => r.score != null)
    .map((r) => ({ ...r, fullMark: 100 }));

  if (rows.length < 3) {
    return <Empty text="Complete baseline assessments to see readiness pillars." />;
  }

  return (
    <div className="mm-org-rechart">
      <p className="mm-org-chart-caption">Campus average among students who completed each check</p>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={rows}>
          <PolarGrid stroke={COLORS.grid} />
          <PolarAngleAxis dataKey="subject" tick={tickInk} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={tickInkSm} />
          <Radar
            name="Campus"
            dataKey="score"
            stroke={COLORS.accent}
            fill={COLORS.accent}
            fillOpacity={0.35}
          />
          <Tooltip formatter={(v) => [`${Math.round(v)}%`, 'Readiness']} />
        </RadarChart>
      </ResponsiveContainer>
      <ChartInsight>
        Larger shape = more balanced campus profile. A spike on one corner means that skill leads; a dip shows where
        to focus training.
      </ChartInsight>
    </div>
  );
}

export function GapStrengthPieCharts({ gaps = [], strengths = [], onSliceClick }) {
  const gapData = (gaps || []).slice(0, 5).map((g, i) => ({
    name: g.label.length > 22 ? `${g.label.slice(0, 20)}…` : g.label,
    full: g.label,
    value: g.count,
    share: g.sharePct ?? g.share_pct,
    color: ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3'][i] || COLORS.weak,
    drill: { type: 'gap', key: g.label },
  }));
  const strData = (strengths || []).slice(0, 5).map((g, i) => ({
    name: g.label.length > 22 ? `${g.label.slice(0, 20)}…` : g.label,
    full: g.label,
    value: g.count,
    share: g.sharePct ?? g.share_pct,
    color: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'][i] || COLORS.strong,
    drill: { type: 'strength', key: g.label },
  }));

  function PieBlock({ title, data, empty }) {
    if (!data.length) return <Empty text={empty} />;
    const total = data.reduce((s, d) => s + d.value, 0);
    return (
      <div className="mm-org-gap-pie">
        <p className="mm-org-stat__label mb-2">{title}</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={48}
              outerRadius={78}
              paddingAngle={2}
              className={onSliceClick ? 'mm-org-pie--clickable' : undefined}
              onClick={onSliceClick ? (entry) => onSliceClick(entry?.drill, entry) : undefined}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v, _, item) => {
                const share =
                  item?.payload?.share ??
                  (total ? Math.round((v / total) * 100) : 0);
                return [`${v} students (${share}%)`, 'Count'];
              }}
              labelFormatter={(_, p) => p?.[0]?.payload?.full || ''}
            />
          </PieChart>
        </ResponsiveContainer>
        <ul className="mm-org-gap-pie__labels">
          {data.map((d) => {
            const share = d.share ?? (total ? Math.round((d.value / total) * 100) : 0);
            return (
              <li key={d.full}>
                <span className="mm-org-gap-pie__swatch" style={{ background: d.color }} />
                <span className="mm-org-gap-pie__text">{d.full}</span>
                <strong>{share}%</strong>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  if (!gapData.length && !strData.length) {
    return <Empty text="Strength and gap themes appear after scored baseline attempts." />;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <PieBlock title="Top preparation gaps" data={gapData} empty="No gap themes yet." />
      <PieBlock title="Top strengths" data={strData} empty="No strength themes yet." />
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
          <XAxis dataKey="name" tick={tickInkSm} />
          <YAxis allowDecimals={false} tick={tickInk} />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke={COLORS.accent} fill={COLORS.accent} fillOpacity={0.35} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PerformanceTrendChart({ points = [] }) {
  const data = (points || []).map((p) => ({
    date: p.date?.slice(5) || p.date,
    fullDate: p.date,
    readiness: p.avgReadiness ?? p.avg_readiness,
    coverage: p.coveragePct ?? p.coverage_pct,
    driveReady: p.driveReadyPct ?? p.drive_ready_of_scored_pct,
  }));

  if (!data.length) {
    return <Empty text="Trend lines appear after daily readiness snapshots are recorded." />;
  }

  return (
    <div className="mm-org-rechart">
      <p className="mm-org-chart-caption">Branch readiness, coverage, and drive-ready % over time</p>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis dataKey="date" tick={tickInkSm} />
          <YAxis domain={[0, 100]} tick={tickInk} unit="%" />
          <Tooltip
            labelFormatter={(_, payload) => payload?.[0]?.payload?.fullDate || ''}
            formatter={(v, name) => [`${Math.round(v)}%`, name]}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="readiness"
            name="Avg readiness"
            stroke={COLORS.accent}
            fill={COLORS.accent}
            fillOpacity={0.2}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="coverage"
            name="Coverage"
            stroke={COLORS.strong}
            fill={COLORS.strong}
            fillOpacity={0.15}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="driveReady"
            name="Drive-ready %"
            stroke={COLORS.accent2}
            fill={COLORS.accent2}
            fillOpacity={0.12}
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
      <ChartInsight>
        Rising lines = improving branch outcomes. Use dips to time interventions before placement season.
      </ChartInsight>
    </div>
  );
}

export { ChartCard, COLORS };
