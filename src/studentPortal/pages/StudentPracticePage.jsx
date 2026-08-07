import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPracticeUsageMap, isPracticeLockedToday } from '../practiceDailyLock';
import { PRACTICE_TOOLS } from '../practiceTools';
import { practiceUserKey } from '../roadmap/completeAndReturn';
import { useStudentShell } from '../shellContext';

import PracticeToolsGrid from '../components/practice/PracticeToolsGrid';

import '../styles/practice.css';

export default function StudentPracticePage() {
  const navigate = useNavigate();
  const { refreshStreak } = useStudentShell();
  const userKey = practiceUserKey();
  const [usage, setUsage] = useState(() => getPracticeUsageMap(userKey));

  const refreshLocal = useCallback(() => {
    setUsage(getPracticeUsageMap(userKey));
    refreshStreak();
  }, [userKey, refreshStreak]);

  // Practice locks are per-calendar-day, so re-read them whenever the tab
  // regains focus — a student can leave this open across midnight.
  useEffect(() => {
    const onFocus = () => refreshLocal();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [refreshLocal]);

  const handleStart = useCallback(
    (tool) => {
      if (!tool?.href) return;
      if (isPracticeLockedToday(tool.tool_code, userKey)) {
        refreshLocal();
        return;
      }
      navigate(tool.href);
    },
    [navigate, userKey, refreshLocal]
  );

  return (
    <main className="stu-main">
      <PracticeToolsGrid tools={PRACTICE_TOOLS} usage={usage} onStart={handleStart} />
    </main>
  );
}
