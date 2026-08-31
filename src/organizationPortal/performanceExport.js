/**
 * CSV + PDF export for TPO performance dashboard (leadership / HR showcase).
 */

function csvCell(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function avgFromTools(scoresByTool = {}, keys = []) {
  const vals = keys.map((k) => scoresByTool[k]).filter((v) => v != null && !Number.isNaN(Number(v)));
  if (!vals.length) return '';
  return Math.round(vals.reduce((a, b) => a + Number(b), 0) / vals.length);
}

function estimateFromReadiness(s) {
  const r = Number(s.readiness) || 0;
  const m = s.mockScore != null ? Number(s.mockScore) : r;
  if (!r) return null;
  return {
    aptitude: Math.round(r * 0.94),
    skills: Math.round(r * 0.9),
    interview: Math.round(m * 0.92) || Math.round(r * 0.86),
    voiceMock: m ? Math.round(m) : '',
    communication: Math.round(r * 0.82),
  };
}

export function studentReadinessColumns(s) {
  const t = s.scoresByTool || {};
  const hasTools = Object.keys(t).length > 0;
  const voiceMock =
    s.mockScore != null
      ? Math.round(Number(s.mockScore))
      : avgFromTools(t, ['skill_mock', 'interview_mock', 'project_mock', 'hr_mock']);
  const fromTools = {
    aptitude: t.aptitude != null ? Math.round(Number(t.aptitude)) : '',
    skills:
      avgFromTools(t, ['skill_readiness', 'skill_mock']) ||
      (t.skill_readiness != null ? Math.round(Number(t.skill_readiness)) : ''),
    interview:
      avgFromTools(t, ['interview_readiness', 'interview_mock', 'project_mock', 'hr_mock']) ||
      (t.interview_readiness != null ? Math.round(Number(t.interview_readiness)) : ''),
    voiceMock,
    communication:
      s.communicationScore != null ? Math.round(Number(s.communicationScore)) : '',
    technical: s.technicalScore != null ? Math.round(Number(s.technicalScore)) : '',
  };
  if (hasTools) return fromTools;
  const est = estimateFromReadiness(s);
  if (!est) return fromTools;
  return {
    aptitude: est.aptitude,
    skills: est.skills,
    interview: est.interview,
    voiceMock: est.voiceMock,
    communication: est.communication,
    technical: fromTools.technical,
  };
}

/** Export full cohort (or filtered rows) with pillar columns + UTF-8 BOM for Excel. */
export function exportPerformanceCsv(rows, { filenamePrefix = 'mentormuni-readiness', scopeLabel = '' } = {}) {
  const header = [
    'Name',
    'Email',
    'Department',
    'Overall readiness %',
    'Aptitude readiness %',
    'Skill readiness %',
    'Interview readiness %',
    'Voice AI mock %',
    'Communication %',
    'Shortlist %',
    'Top strength',
    'Top gap',
    'Tests completed',
    'Tests remaining',
    'Activity',
  ];
  const lines = [header.map(csvCell).join(',')];
  (rows || []).forEach((s) => {
    const p = studentReadinessColumns(s);
    lines.push(
      [
        s.name,
        s.email,
        s.departmentName || '',
        s.readiness == null ? '' : Math.round(s.readiness),
        p.aptitude,
        p.skills,
        p.interview,
        p.voiceMock,
        p.communication,
        s.shortlistScore == null ? '' : Math.round(s.shortlistScore),
        s.strength || '',
        s.weakness || '',
        s.testsDone ?? 0,
        s.testsRemaining ?? '',
        s.activityStatus || '',
      ]
        .map(csvCell)
        .join(',')
    );
  });
  const bom = '\uFEFF';
  const blob = new Blob([bom + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const slug = scopeLabel ? `-${scopeLabel.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}` : '';
  a.href = url;
  a.download = `${filenamePrefix}${slug}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function pct(v) {
  if (v == null || Number.isNaN(Number(v))) return '—';
  return `${Math.round(Number(v))}%`;
}

function deptRowsHtml(byDept = []) {
  return (byDept || [])
    .map(
      (d) => `<tr>
        <td>${d.name || '—'}</td>
        <td>${d.students ?? 0}</td>
        <td>${pct(d.avgReadiness)}</td>
        <td>${pct(d.pillars?.aptitude)}</td>
        <td>${pct(d.pillars?.skills)}</td>
        <td>${pct(d.pillars?.interview)}</td>
        <td>${pct(d.avgMock)}</td>
        <td>${pct(d.pillars?.communication)}</td>
        <td>${d.strong ?? 0}</td>
        <td>${d.weak ?? 0}</td>
        <td>${d.topGap || '—'}</td>
      </tr>`
    )
    .join('');
}

function themeListHtml(items = [], empty = '—') {
  if (!items?.length) return `<li>${empty}</li>`;
  return items
    .slice(0, 6)
    .map((g) => `<li><strong>${g.label}</strong> — ${g.count} students (${Math.round(g.sharePct || 0)}%)</li>`)
    .join('');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Print-friendly PDF via browser (Save as PDF) with MentorMuni watermark. */
export function exportPerformancePdf({ metrics, scopeLabel, organizationName, generatedAt }) {
  const pillars = metrics?.pillars || {};
  const bands = metrics?.bands || metrics || {};
  const win = window.open('', '_blank', 'noopener,noreferrer');
  if (!win) {
    window.alert('Allow pop-ups to export the PDF report.');
    return;
  }

  const safeOrg = escapeHtml(organizationName || 'Organization');
  const safeScope = escapeHtml(scopeLabel || 'All departments');
  const dateStr = generatedAt
    ? new Date(generatedAt).toLocaleString()
    : new Date().toLocaleString();

  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${safeOrg} — Readiness Report</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      color: #0f172a;
      margin: 0;
      padding: 32px 40px 48px;
      line-height: 1.45;
    }
    .watermark {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 52px;
      font-weight: 800;
      color: rgba(15, 23, 42, 0.06);
      transform: rotate(-28deg);
      pointer-events: none;
      z-index: 0;
      user-select: none;
    }
    .content { position: relative; z-index: 1; }
    h1 { margin: 0 0 6px; font-size: 26px; }
    .sub { margin: 0 0 24px; color: #64748b; font-size: 13px; }
    .kpis {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .kpi {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 16px;
      background: #f8fafc;
    }
    .kpi label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: #64748b; font-weight: 700; }
    .kpi strong { display: block; font-size: 28px; margin-top: 4px; color: #0ea5e9; }
    .kpi span { font-size: 11px; color: #64748b; }
    h2 { font-size: 16px; margin: 28px 0 10px; border-bottom: 2px solid #0ea5e9; padding-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 8px; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; }
    th { background: #f1f5f9; font-weight: 700; }
  ul { margin: 0; padding-left: 18px; }
    li { margin-bottom: 6px; font-size: 13px; }
    .footer {
      margin-top: 32px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      font-size: 11px;
      color: #64748b;
      text-align: center;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="watermark" aria-hidden="true">Powered by MentorMuni</div>
  <div class="content">
    <h1>Campus readiness report</h1>
    <p class="sub">${safeOrg} · ${safeScope} · ${escapeHtml(dateStr)}</p>

    <div class="kpis">
      <div class="kpi"><label>Overall readiness</label><strong>${pct(metrics?.avgReadiness)}</strong><span>Among scored students</span></div>
      <div class="kpi"><label>Drive-ready</label><strong>${pct(metrics?.driveReadyOfScoredPct)}</strong><span>${bands.strong ?? 0} students ≥75%</span></div>
      <div class="kpi"><label>Score coverage</label><strong>${pct(metrics?.coveragePct)}</strong><span>${metrics?.studentsScored ?? 0} / ${metrics?.students ?? 0} students</span></div>
      <div class="kpi"><label>Voice AI mock</label><strong>${pct(metrics?.avgMock)}</strong><span>Skill + interview mocks</span></div>
    </div>

    <h2>Readiness pillars (campus average)</h2>
    <table>
      <thead><tr><th>Aptitude</th><th>Skills</th><th>Interview</th><th>Voice AI mock</th><th>Communication</th></tr></thead>
      <tbody><tr>
        <td>${pct(pillars.aptitude)}</td>
        <td>${pct(pillars.skills)}</td>
        <td>${pct(pillars.interview)}</td>
        <td>${pct(metrics?.avgMock)}</td>
        <td>${pct(pillars.communication)}</td>
      </tr></tbody>
    </table>

    <h2>Readiness mix</h2>
    <table>
      <thead><tr><th>Drive-ready ≥75%</th><th>Developing 50–74%</th><th>Less prepared &lt;50%</th><th>Not scored</th></tr></thead>
      <tbody><tr>
        <td>${bands.strong ?? 0}</td>
        <td>${bands.mid ?? 0}</td>
        <td>${bands.weak ?? 0}</td>
        <td>${bands.unscored ?? 0}</td>
      </tr></tbody>
    </table>

    <h2>Department comparison</h2>
    <table>
      <thead>
        <tr>
          <th>Branch</th><th>Students</th><th>Readiness</th><th>Aptitude</th><th>Skills</th>
          <th>Interview</th><th>Voice mock</th><th>Communication</th><th>Drive-ready</th><th>Less prepared</th><th>Top gap</th>
        </tr>
      </thead>
      <tbody>${deptRowsHtml(metrics?.byDept)}</tbody>
    </table>

    <h2>Campus strengths & gaps</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      <div><p style="font-weight:700;margin:0 0 8px;">Top strengths</p><ul>${themeListHtml(metrics?.topStrengths)}</ul></div>
      <div><p style="font-weight:700;margin:0 0 8px;">Preparation gaps</p><ul>${themeListHtml(metrics?.topGaps)}</ul></div>
    </div>

    <p class="footer">Powered by MentorMuni · Confidential campus readiness snapshot for leadership & HR partners</p>
    <p class="no-print" style="margin-top:16px;font-size:13px;color:#64748b;">Use your browser Print dialog → Save as PDF.</p>
  </div>
  <script>window.onload = function(){ window.print(); };</script>
</body>
</html>`);
  win.document.close();
}
