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
  personalization = null,
} = {}) {
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [budgetMinutes, setBudgetMinutes] = useState(() => getTodayBudget(userKey).minutes);
  const [today, setToday] = useState(() => todayKey());

  // Guards a late response from overwriting a newer one.
  const requestRef = useRef(0);
  const syncingRef = useRef(0);

  const weakTopics = useMemo(() => deriveWeakTopics(analysis), [analysis]);
  const planIdFromPlan = plan?.id ?? null;

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
          personalization,
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
    [userKey, plan, roadmap, weakTopics, budgetMinutes, drive, day0Complete, today, personalization]
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
      else if (syncingRef.current === 0) load({ silent: true });
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
      const planId = mission?.planId ?? mission?.plan_id ?? planIdFromPlan;
      setMission((prev) => {
        if (!prev) return prev;
        const tasks = prev.tasks.map((t) =>
          t.task_key === task.task_key
            ? {
                ...t,
                status: 'done',
                score,
                completed_at: new Date().toISOString(),
              }
            : t
        );
        const doneCount = tasks.filter((t) => t.status === 'done').length;
        const requiredCount = tasks.filter((t) => t.required).length;
        recordDailyActivity(userKey, today, {
          tasksDone: doneCount,
          tasksTotal: requiredCount,
        });
        return { ...prev, tasks, doneCount, requiredCount };
      });
      syncingRef.current += 1;
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
        console.error('Task sync failed', err);
        patchTask(task.task_key, { pending_sync: true });
      } finally {
        syncingRef.current = Math.max(0, syncingRef.current - 1);
      }
    },
    [patchTask, userKey, today, planIdFromPlan, mission?.planId, mission?.plan_id]
  );

  const skipTask = useCallback(
    async (task, reason = 'manual') => {
      if (!task?.task_key) return;
      const planId = mission?.planId ?? mission?.plan_id ?? planIdFromPlan;
      patchTask(task.task_key, { status: 'skipped' });
      syncingRef.current += 1;
      try {
        await skipMissionTask(
          task.task_key,
          { local_date: today, text_hash: task.text_hash, reason },
          { userKey, planId }
        );
      } catch (err) {
        console.error('Task skip sync failed', err);
      } finally {
        syncingRef.current = Math.max(0, syncingRef.current - 1);
      }
    },
    [patchTask, userKey, today, planIdFromPlan, mission?.planId, mission?.plan_id]
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
