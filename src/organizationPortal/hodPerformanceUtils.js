/**
 * HOD performance drill-down — filter students by chart slice / area / band.
 */

export const READINESS_BANDS = {
  strong: {
    id: 'band_strong',
    label: 'Drive-ready (≥75%)',
    hint: 'Students ready for company drives and final interviews.',
    filter: (s) => Number(s.readiness) >= 75,
  },
  mid: {
    id: 'band_mid',
    label: 'Developing (50–74%)',
    hint: 'On track — assign mocks and gap drills to push above 75%.',
    filter: (s) => {
      const r = Number(s.readiness);
      return r >= 50 && r < 75;
    },
  },
  weak: {
    id: 'band_weak',
    label: 'Needs coaching (<50%)',
    hint: 'Priority cohort for aptitude, skill, and mock interview support.',
    filter: (s) => s.readiness != null && Number(s.readiness) > 0 && Number(s.readiness) < 50,
  },
  unscored: {
    id: 'band_unscored',
    label: 'Not assessed yet',
    hint: 'Invite to complete baseline readiness checks.',
    filter: (s) => s.readiness == null || Number(s.readiness) <= 0,
  },
};

export const ACTIVITY_BANDS = {
  active: {
    id: 'activity_active',
    label: 'Active this week',
    filter: (s) => String(s.activityStatus || '').toLowerCase() === 'active',
  },
  idle: {
    id: 'activity_idle',
    label: 'Quiet (8–14 days)',
    filter: (s) => String(s.activityStatus || '').toLowerCase() === 'idle',
  },
  inactive: {
    id: 'activity_inactive',
    label: 'Inactive (2+ weeks)',
    filter: (s) => String(s.activityStatus || '').toLowerCase() === 'inactive',
  },
  never: {
    id: 'activity_never',
    label: 'Never started',
    filter: (s) => !s.activityStatus || String(s.activityStatus).toLowerCase() === 'never',
  },
};

export const DISTRIBUTION_BUCKETS = {
  '90–100%': { min: 90, max: 100 },
  '75–89%': { min: 75, max: 89 },
  '50–74%': { min: 50, max: 74 },
  'Below 50%': { min: 0, max: 49 },
  'Not scored': { min: null, max: null },
};

function pillarScore(s, pillar) {
  const t = s.scoresByTool || {};
  if (pillar === 'aptitude') return t.aptitude;
  if (pillar === 'skills') {
    const vals = [t.skill_readiness, t.skill_mock, t.coding].filter((v) => v != null);
    return vals.length ? vals.reduce((a, b) => a + Number(b), 0) / vals.length : null;
  }
  if (pillar === 'interview') {
    const vals = [t.interview_readiness, t.interview_mock, t.project_mock, t.hr_mock].filter(
      (v) => v != null
    );
    return vals.length ? vals.reduce((a, b) => a + Number(b), 0) / vals.length : null;
  }
  if (pillar === 'voiceMock') return s.mockScore;
  if (pillar === 'communication') return s.communicationScore;
  return null;
}

export function filterStudentsByDrill(students = [], drill) {
  if (!drill?.type) return students;
  const list = students || [];

  if (drill.type === 'band') {
    const band = READINESS_BANDS[drill.key];
    return band ? list.filter(band.filter) : list;
  }
  if (drill.type === 'activity') {
    const band = ACTIVITY_BANDS[drill.key];
    return band ? list.filter(band.filter) : list;
  }
  if (drill.type === 'distribution') {
    const bucket = DISTRIBUTION_BUCKETS[drill.key];
    if (!bucket) return list;
    if (drill.key === 'Not scored') {
      return list.filter((s) => s.readiness == null || Number(s.readiness) <= 0);
    }
    return list.filter((s) => {
      const r = Number(s.readiness);
      return r >= bucket.min && r <= bucket.max;
    });
  }
  if (drill.type === 'gap') {
    const label = drill.key;
    return list.filter(
      (s) =>
        s.weakness === label ||
        (s.weaknesses || []).includes(label) ||
        String(s.weakness || '').toLowerCase() === String(label).toLowerCase()
    );
  }
  if (drill.type === 'strength') {
    const label = drill.key;
    return list.filter(
      (s) =>
        s.strength === label ||
        (s.strengths || []).includes(label) ||
        String(s.strength || '').toLowerCase() === String(label).toLowerCase()
    );
  }
  if (drill.type === 'pillar') {
    const { pillar, tier } = drill;
    return list.filter((s) => {
      const score = pillarScore(s, pillar);
      if (score == null) return tier === 'unscored';
      const n = Number(score);
      if (tier === 'strong') return n >= 75;
      if (tier === 'mid') return n >= 50 && n < 75;
      if (tier === 'weak') return n < 50;
      return true;
    });
  }
  if (drill.type === 'area_board') {
    const ids = new Set((drill.studentIds || []).map(String));
    if (ids.size) return list.filter((s) => ids.has(String(s.id)));
    if (drill.tier === 'top') {
      return list.filter((s) => Number(s.readiness) >= 75);
    }
    if (drill.tier === 'less') {
      return list.filter((s) => s.readiness != null && Number(s.readiness) < 50);
    }
    return list;
  }
  if (drill.type === 'all') return list;
  return list;
}

export function drillLabel(drill) {
  if (!drill) return 'All students';
  if (drill.title) return drill.title;
  if (drill.type === 'band') return READINESS_BANDS[drill.key]?.label || drill.key;
  if (drill.type === 'activity') return ACTIVITY_BANDS[drill.key]?.label || drill.key;
  if (drill.type === 'distribution') return drill.key;
  if (drill.type === 'gap' || drill.type === 'strength') return drill.key;
  return 'Filtered students';
}
