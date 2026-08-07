import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Check, Flame, Play } from 'lucide-react';
import { recordStudentSession } from '../streak';
import { practiceUserKey } from '../roadmap/completeAndReturn';
import { useStudentShell } from '../shellContext';
import { fetchUpcomingDrives } from '../drives';
import {
  COMPANY_PREP_TASKS,
  demoNearestDrive,
  ensurePrepDay,
  getMissionCompletion,
  markMissionTaskDone,
  missionTotalMinutes,
} from '../companyPrep';

import '../styles/company-prep.css';

function withPrepState(userKey, drive) {
  const day = ensurePrepDay(userKey, drive.id);
  return {
    drive,
    prepDay: day,
    doneMap: getMissionCompletion(userKey, drive.id, day),
  };
}

export default function StudentCompanyPrepPage() {
  const navigate = useNavigate();
  const { refreshStreak } = useStudentShell();
  const userKey = practiceUserKey();

  const seed = useMemo(() => {
    const demo = demoNearestDrive();
    return withPrepState(userKey, demo);
  }, [userKey]);

  const [drives, setDrives] = useState(() => [seed.drive]);
  const [nearest, setNearest] = useState(() => seed.drive);
  const [isDemo, setIsDemo] = useState(true);
  const [prepDay, setPrepDay] = useState(() => seed.prepDay);
  const [doneMap, setDoneMap] = useState(() => seed.doneMap);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUpcomingDrives();
      const near = data.nearest || demoNearestDrive();
      const next = withPrepState(userKey, near);
      setDrives(data.items?.length ? data.items : [near]);
      setNearest(next.drive);
      setPrepDay(next.prepDay);
      setDoneMap(next.doneMap);
      setIsDemo(Boolean(data.demo) || String(near.id).startsWith('demo'));
    } catch {
      const demo = demoNearestDrive();
      const next = withPrepState(userKey, demo);
      setDrives([demo]);
      setNearest(next.drive);
      setPrepDay(next.prepDay);
      setDoneMap(next.doneMap);
      setIsDemo(true);
    } finally {
      refreshStreak();
      setLoading(false);
    }
  }, [userKey, refreshStreak]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const totalMinutes = useMemo(() => missionTotalMinutes(COMPANY_PREP_TASKS), []);
  const doneCount = COMPANY_PREP_TASKS.filter((t) => doneMap[t.id]).length;
  const nextTask = COMPANY_PREP_TASKS.find((t) => !doneMap[t.id]) || COMPANY_PREP_TASKS[0];

  const selectDrive = useCallback(
    (drive) => {
      const next = withPrepState(userKey, drive);
      setNearest(next.drive);
      setPrepDay(next.prepDay);
      setDoneMap(next.doneMap);
      setIsDemo(String(drive.id).startsWith('demo'));
    },
    [userKey]
  );

  const startTask = useCallback(
    (task) => {
      if (!nearest || !task?.href) return;
      markMissionTaskDone(userKey, nearest.id, prepDay, task.id);
      setDoneMap(getMissionCompletion(userKey, nearest.id, prepDay));
      recordStudentSession(userKey);
      refreshStreak();
      navigate(task.href);
    },
    [navigate, nearest, prepDay, userKey, refreshStreak]
  );

  const startMission = useCallback(() => {
    if (nextTask) startTask(nextTask);
  }, [nextTask, startTask]);

  const daysLeft = Math.max(0, nearest?.days_until ?? 0);
  const company = nearest?.company_name || 'Campus';

  return (
    <main className="stu-main">
          <section className="stu-cprep" aria-labelledby="stu-cprep-title">
            <header className="stu-cprep__hero">
              <p className="stu-cprep__day">
                <Flame size={16} strokeWidth={2.4} aria-hidden /> Day {prepDay}
              </p>
              <h1 className="stu-cprep__title" id="stu-cprep-title">
                {company} Drive: {daysLeft} {daysLeft === 1 ? 'Day' : 'Days'}
              </h1>
              <p className="stu-cprep__sub">
                Short daily mission until the drive
                {nearest?.drive_date
                  ? ` · ${new Date(`${nearest.drive_date}T12:00:00`).toLocaleDateString()}`
                  : ''}
                . Finish all five blocks — about {totalMinutes} minutes.
              </p>
            </header>

            {drives.length > 1 ? (
              <div className="stu-cprep__drives" role="list" aria-label="Upcoming drives">
                {drives
                  .filter((d) => !d.is_past)
                  .slice(0, 6)
                  .map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      role="listitem"
                      className={`stu-cprep__drive-chip${d.id === nearest?.id ? ' is-active' : ''}`}
                      onClick={() => selectDrive(d)}
                    >
                      <Building2 size={13} strokeWidth={2.2} aria-hidden />
                      {d.company_name}
                      <em>{Math.max(0, d.days_until)}d</em>
                    </button>
                  ))}
              </div>
            ) : null}

            {isDemo ? (
              <p className="stu-cprep__note">
                {loading
                  ? 'Loading campus drives…'
                  : 'Showing a demo drive until your TPO publishes campus drives.'}
              </p>
            ) : null}

            <div className="stu-cprep__card">
              <div className="stu-cprep__today-label">Today</div>

              <ol className="stu-cprep__tasks">
                {COMPANY_PREP_TASKS.map((task, index) => {
                  const done = Boolean(doneMap[task.id]);
                  return (
                    <li
                      key={task.id}
                      className={`stu-cprep__task${done ? ' is-done' : ''}${nextTask?.id === task.id && !done ? ' is-next' : ''}`}
                    >
                      <span className="stu-cprep__task-num" aria-hidden>
                        {done ? <Check size={14} strokeWidth={2.6} /> : index + 1}
                      </span>
                      <div className="stu-cprep__task-body">
                        <strong>{task.title}</strong>
                      </div>
                      <span className="stu-cprep__task-min">{task.minutes} min</span>
                      <button
                        type="button"
                        className="stu-cprep__task-go"
                        onClick={() => startTask(task)}
                        disabled={done}
                      >
                        {done ? 'Done' : 'Go'}
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className="stu-cprep__divider" aria-hidden />

              <div className="stu-cprep__foot">
                <p className="stu-cprep__total">
                  <strong>{totalMinutes}</strong> minutes
                  <em>
                    · {doneCount}/{COMPANY_PREP_TASKS.length} done today
                  </em>
                </p>
                <button
                  type="button"
                  className="stu-cprep__cta"
                  onClick={startMission}
                  disabled={doneCount === COMPANY_PREP_TASKS.length}
                >
                  <Play size={16} fill="currentColor" strokeWidth={2} aria-hidden />
                  {doneCount === COMPANY_PREP_TASKS.length
                    ? 'Mission complete'
                    : "Start today's mission"}
                  <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
                </button>
              </div>
            </div>
          </section>
    </main>
  );
}
