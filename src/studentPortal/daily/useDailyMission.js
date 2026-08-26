/**
 * Today's mission, wired to the page.
 *
 * Completion is optimistic and one-way: the local ledger is written before the
 * request goes out and is never rolled back if that request fails. A student
 * on campus wifi who watches a task tick and then un-tick will stop trusting
 * the product, and a lost tick costs far less than a lost student.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  completeMissionTask,
  fetchDailyMission,
  skipMissionTask,
} from './dailyApi';
import { todayKey } from './dayKeys';
import { getTodayBudget, setTodayBudget } from './timeBudget';
import { recordDailyActivity } from './dailyLocal';

/**
 * Interim weak-topic source until the Leitner queue lands.
 * Baseline analysis already names the gaps; this makes them actionable today
 * instead of leaving them as a list nobody returns to.
 */
function deriveWeakTopics(analysis, limit = 3) {
  const labels = analysis?.top_weaknesses || [];
  return labels.slice(0, limit).map((label) => ({
    topic_id: String(label).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 48),
    label: String(label),
    minutes: 10,
  }));
}

export function useDailyMission({
  plan = null,
  roadmap = null,
  analysis = null,
  drive = null,
  userKey = 'anon',
  day0Complete = true,
} = {}) {
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [budgetMinutes, setBudgetMinutes] = useState(() => getTodayBudget(userKey).minutes);
  const [today, setToday] = useState(() => todayKey());

  // Guards a late response from overwriting a newer one.
  const requestRef = useRef(0);

  const weakTopics = useMemo(() => deriveWeakTopics(analysis), [analysis]);
  const planId = plan?.id ?? null;

  const load = useCallback(
    async ({ silent = false } = {}) => {
      const ticket = ++requestRef.current;
      if (!silent) setLoading(true);
      try {
        const next = await fetchDailyMission({
          userKey,
          plan,
          roadmap,
          weakTopics,
          budgetMinutes,
          drive,
          day0Complete,
          today,
          silent: true,
        });
        if (ticket !== requestRef.current) return;
        setMission(next);
        setError('');
      } catch (err) {
        if (ticket !== requestRef.current) return;
        console.error('Daily mission failed', err);
        setError(err?.message || 'Could not load today’s mission');
      } finally {
        if (ticket === requestRef.current) setLoading(false);
      }
    },
    [userKey, plan, roadmap, weakTopics, budgetMinutes, drive, day0Complete, today]
  );

  useEffect(() => {
    load();
  }, [load]);

  // A tab left open overnight must roll to the new day, and a student who
  // finishes a tool in another tab should come back to a ticked mission.
  useEffect(() => {
    const sync = () => {
      const now = todayKey();
      if (now !== today) setToday(now);
      else load({ silent: true });
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') sync();
    };
    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', sync);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [load, today]);

  /** Apply a status change to local state immediately. */
  const patchTask = useCallback((taskKeyValue, patch) => {
    setMission((prev) => {
      if (!prev) return prev;
      const tasks = prev.tasks.map((t) =>
        t.task_key === taskKeyValue ? { ...t, ...patch } : t
      );
      const required = tasks.filter((t) => t.required);
      const doneCount = tasks.filter((t) => t.status === 'done').length;
      return {
        ...prev,
        tasks,
        doneCount,
        totalMinutes: tasks
          .filter((t) => t.status !== 'done')
          .reduce((sum, t) => sum + t.minutes, 0),
        complete: required.length > 0 && required.every((t) => t.status === 'done'),
      };
    });
  }, []);

  const completeTask = useCallback(
    async (task, { score = null } = {}) => {
      if (!task?.task_key) return;
      patchTask(task.task_key, {
        status: 'done',
        score,
        completed_at: new Date().toISOString(),
      });
      recordDailyActivity(userKey, today, {
        tasksDone: (mission?.doneCount ?? 0) + 1,
        tasksTotal: mission?.requiredCount ?? 0,
      });
      try {
        await completeMissionTask(
          task.task_key,
          {
            local_date: today,
            text_hash: task.text_hash,
            tool_code: task.tool_code,
            minutes: task.minutes,
            source: task.kind === 'tool' ? 'tool' : 'manual',
            score,
          },
          { userKey, planId }
        );
      } catch (err) {
        // Local ledger already holds it; flag the sync, keep the tick.
        console.error('Task sync failed', err);
        patchTask(task.task_key, { pending_sync: true });
      }
    },
    [patchTask, userKey, today, planId, mission?.doneCount, mission?.requiredCount]
  );

  const skipTask = useCallback(
    async (task, reason = 'manual') => {
      if (!task?.task_key) return;
      patchTask(task.task_key, { status: 'skipped' });
      try {
        await skipMissionTask(
          task.task_key,
          { local_date: today, text_hash: task.text_hash, reason },
          { userKey, planId }
        );
      } catch (err) {
        console.error('Task skip sync failed', err);
      }
    },
    [patchTask, userKey, today, planId]
  );

  const chooseBudget = useCallback(
    (minutes) => {
      const value = setTodayBudget(minutes, userKey);
      setBudgetMinutes(value);
      return value;
    },
    [userKey]
  );

  return {
    mission,
    loading,
    error,
    budgetMinutes,
    chooseBudget,
    completeTask,
    skipTask,
    refresh: load,
    source: mission?.source || 'local',
  };
}
