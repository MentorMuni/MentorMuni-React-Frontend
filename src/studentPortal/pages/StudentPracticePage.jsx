import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPracticeUsageMap, isPracticeLockedToday } from '../practiceDailyLock';
import { PRACTICE_TOOLS } from '../practiceTools';
import { practiceUserKey } from '../roadmap/completeAndReturn';
import { fetchAnalysis } from '../roadmap/roadmapApi';
import { inferToolForGap, pillarToToolCode } from '../placementProfile';
import { fetchStudentReadiness } from '../readiness/readinessApi';
import { useStudentShell } from '../shellContext';

import PracticeToolsGrid from '../components/practice/PracticeToolsGrid';

import '../styles/practice.css';
import '../styles/placement-onboarding.css';

export default function StudentPracticePage() {
  const navigate = useNavigate();
  const { refreshStreak, userKey } = useStudentShell();
  const practiceKey = practiceUserKey();
  const [usage, setUsage] = useState(() => getPracticeUsageMap(practiceKey));
  const [gapLabel, setGapLabel] = useState('');
  const [gapToolCodes, setGapToolCodes] = useState([]);

  const refreshLocal = useCallback(() => {
    setUsage(getPracticeUsageMap(practiceKey));
    refreshStreak();
  }, [practiceKey, refreshStreak]);

  useEffect(() => {
    const onFocus = () => refreshLocal();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [refreshLocal]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [analysis, readiness] = await Promise.all([
          fetchAnalysis(),
          fetchStudentReadiness({ userKey, silent: true }).catch(() => null),
        ]);
        if (cancelled) return;

        const weakness = (analysis?.top_weaknesses || [])[0];
        const focusPillar = readiness?.focus_pillar || readiness?.weakest_pillar;
        const label = weakness || (focusPillar ? String(focusPillar).replace(/_/g, ' ') : '');

        const codes = [];
        if (weakness) codes.push(inferToolForGap(weakness));
        if (focusPillar) {
          const pillarTool = pillarToToolCode(focusPillar);
          if (!codes.includes(pillarTool)) codes.push(pillarTool);
        }
        if (!codes.length && analysis?.scores_by_tool) {
          const entries = Object.entries(analysis.scores_by_tool);
          entries.sort((a, b) => Number(a[1]) - Number(b[1]));
          if (entries[0]?.[0]) codes.push(entries[0][0]);
        }

        setGapLabel(label);
        setGapToolCodes(codes.slice(0, 2));
      } catch {
        if (!cancelled) {
          setGapLabel('');
          setGapToolCodes([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userKey]);

  const gapTools = useMemo(() => {
    const byCode = Object.fromEntries(PRACTICE_TOOLS.map((t) => [t.tool_code, t]));
    return gapToolCodes.map((code) => byCode[code]).filter(Boolean);
  }, [gapToolCodes]);

  const handleStart = useCallback(
    (tool) => {
      if (!tool?.href) return;
      if (isPracticeLockedToday(tool.tool_code, practiceKey)) {
        refreshLocal();
        return;
      }
      navigate(tool.href);
    },
    [navigate, practiceKey, refreshLocal]
  );

  return (
    <main className="stu-main">
      <PracticeToolsGrid
        tools={PRACTICE_TOOLS}
        usage={usage}
        onStart={handleStart}
        gapTools={gapTools}
        gapLabel={gapLabel}
      />
    </main>
  );
}
