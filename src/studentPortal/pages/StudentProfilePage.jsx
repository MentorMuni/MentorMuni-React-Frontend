import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  Mail,
  Phone,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useStudentShell } from '../shellContext';
import { enterProps, MOTION } from '../motion';
import {
  fetchStudentProfile,
  readinessBand,
  SECTION_META,
  TARGET_SCORE,
} from '../profileApi';
import { studentPaths } from '../paths';
import EmptyState from '../components/home/EmptyState';
import { isIndividualStudent } from '../accountType';
import StudentAvatar from '../components/StudentAvatar';

import '../styles/profile.css';

/** Order the scorecard by area rather than by the order tools unlock. */
const GROUP_ORDER = ['Profile', 'Aptitude', 'Technical', 'Interview'];

function scoreTone(score) {
  if (score == null) return 'none';
  if (score >= 70) return 'good';
  if (score >= 45) return 'mid';
  return 'low';
}

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function ScoreRow({ section }) {
  const meta = SECTION_META[section.tool_code] || {
    title: section.tool_code,
    blurb: '',
  };
  const tone = scoreTone(section.score);
  const done = section.status === 'done';
  const date = formatDate(section.completed_at);

  return (
    <li className="stu-pf__row">
      <div className="stu-pf__row-main">
        <p className="stu-pf__row-title">{meta.title}</p>
        <p className="stu-pf__row-blurb">{meta.blurb}</p>
      </div>

      <div className="stu-pf__row-track" aria-hidden>
        {section.score != null ? (
          <span className="stu-pf__row-fill" data-tone={tone} style={{ width: `${section.score}%` }} />
        ) : null}
      </div>

      <div className="stu-pf__row-value">
        {section.score != null ? (
          <span className={`stu-pf__score is-${tone}`}>{Math.round(section.score)}%</span>
        ) : done && section.label ? (
          <span className="stu-pf__score is-none">{section.label}</span>
        ) : (
          /* Never leave a blank cell on a document someone else reads —
             "not attempted" is information, an empty space is a question. */
          <span className="stu-pf__score is-pending">Not attempted</span>
        )}
        {date ? <span className="stu-pf__row-date">{date}</span> : null}
      </div>
    </li>
  );
}

export default function StudentProfilePage() {
  const { session } = useStudentShell();
  const reduce = useReducedMotion();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setProfile(await fetchStudentProfile());
      setError('');
    } catch (err) {
      setError(err?.message || 'Could not load your profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = useMemo(() => {
    const sections = profile?.sections || [];
    const map = new Map();
    for (const s of sections) {
      const group = SECTION_META[s.tool_code]?.group || 'Other';
      if (!map.has(group)) map.set(group, []);
      map.get(group).push(s);
    }
    return [...map.entries()].sort(
      (a, b) => GROUP_ORDER.indexOf(a[0]) - GROUP_ORDER.indexOf(b[0])
    );
  }, [profile?.sections]);

  if (loading) {
    return (
      <main className="stu-main">
        <p className="stu-pf__loading">Loading your profile…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="stu-main">
        <p className="stu-alert stu-alert--bad" role="alert">
          {error}
        </p>
        <button type="button" className="stu-btn stu-btn--soft" onClick={load}>
          Try again
        </button>
      </main>
    );
  }

  const student = profile?.student || {};
  const readiness = profile?.readiness || {};
  const activity = profile?.activity || {};
  const score = readiness.overall_score;
  const band = readinessBand(score);
  const target = readiness.target_score ?? TARGET_SCORE;
  const strengths = profile?.strengths || [];
  const gaps = profile?.gaps || [];
  const assessed = (profile?.sections || []).filter((s) => s.status === 'done').length;
  const total = (profile?.sections || []).length || 8;
  const lastUpdated = formatDate(readiness.last_updated_at);

  const name = student.name || session?.name || 'Student';
  const individual = isIndividualStudent(session) || isIndividualStudent(student);
  const orgLine = individual
    ? [student.college_name || session?.college_name, student.course_or_branch || session?.course_or_branch]
        .filter(Boolean)
        .join(' · ') || 'Individual student'
    : [student.organization_name, student.department_name].filter(Boolean).join(' · ') ||
      'College not set';

  return (
    <main className="stu-main stu-pf">
      {/* ---- Identity: the part someone else reads first ---- */}
      <motion.section className="stu-pf__id" {...enterProps(reduce)}>
        <div className="stu-pf__id-main">
          <StudentAvatar
            student={{ ...student, ...session, name }}
            className="stu-pf__avatar"
          />

          <div className="stu-pf__id-text">
            <h1 className="stu-pf__name">{name}</h1>
            {student.headline ? <p className="stu-pf__headline">{student.headline}</p> : null}

            <p className="stu-pf__org">
              <GraduationCap size={16} strokeWidth={2} aria-hidden focusable="false" />
              {orgLine}
              {student.year || student.batch_year || session?.batch_year
                ? ` · Year ${student.year || student.batch_year || session?.batch_year}`
                : ''}
            </p>

            <ul className="stu-pf__meta">
              {!individual && student.college_id ? (
                <li>
                  <span className="stu-pf__meta-key">Roll no.</span>
                  {student.college_id}
                </li>
              ) : null}
              {individual && (student.roll_number || session?.roll_number) ? (
                <li>
                  <span className="stu-pf__meta-key">Roll no.</span>
                  {student.roll_number || session?.roll_number}
                </li>
              ) : null}
              {student.email ? (
                <li>
                  <Mail size={13} strokeWidth={2} aria-hidden focusable="false" />
                  {student.email}
                </li>
              ) : null}
              {student.phone ? (
                <li>
                  <Phone size={13} strokeWidth={2} aria-hidden focusable="false" />
                  {student.phone}
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        {/* ---- The headline number ---- */}
        <div className={`stu-pf__score-card is-${band.key}`}>
          <p className="stu-pf__score-label">Placement readiness</p>
          <p className="stu-pf__score-value">
            {score != null ? Math.round(score) : '—'}
            {score != null ? <em>%</em> : null}
          </p>
          <p className="stu-pf__band">{band.label}</p>
          <div className="stu-pf__score-track" aria-hidden>
            <motion.span
              className="stu-pf__score-fill"
              initial={reduce ? false : { width: 0 }}
              animate={{ width: `${score ?? 0}%` }}
              transition={{ duration: MOTION.duration.meter, ease: MOTION.easeOut }}
            />
            <span className="stu-pf__score-tick" style={{ left: `${target}%` }} />
          </div>
          <p className="stu-pf__score-foot">
            {assessed} of {total} assessments completed · target {target}%
          </p>
        </div>
      </motion.section>

      {/* A reader who is not the student needs to know what this is. */}
      <p className="stu-pf__provenance">
        <ShieldCheck size={15} strokeWidth={2} aria-hidden focusable="false" />
        <span>
          Scores are produced by MentorMuni assessments and AI mock interviews taken by the
          student. They are not self-reported.
          {lastUpdated ? ` Last assessment ${lastUpdated}.` : ''}
        </span>
        <button type="button" className="stu-link-btn stu-pf__print" onClick={() => window.print()}>
          <Printer size={14} strokeWidth={2} aria-hidden focusable="false" />
          Print / save PDF
        </button>
      </p>

      {/* ---- Scorecard ---- */}
      <section className="stu-card stu-pf__block">
        <header className="stu-card__head">
          <div>
            <h2 className="stu-card__title">Assessment scorecard</h2>
            <p className="stu-card__sub">
              Every check in the placement baseline, with the date it was taken.
            </p>
          </div>
        </header>

        {assessed === 0 ? (
          <EmptyState art="complete" title="No assessments completed yet">
            Once {name.split(' ')[0]} finishes the first baseline check, each score appears here
            with the date it was earned.
          </EmptyState>
        ) : (
          <div className="stu-pf__groups">
            {grouped.map(([group, sections]) => (
              <div key={group} className="stu-pf__group">
                <h3 className="stu-pf__group-title">{group}</h3>
                <ul className="stu-pf__rows">
                  {sections.map((s) => (
                    <ScoreRow key={s.tool_code} section={s} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---- Strengths and gaps ---- */}
      {strengths.length || gaps.length ? (
        <section className="stu-card stu-pf__block">
          <header className="stu-card__head">
            <div>
              <h2 className="stu-card__title">Assessed strengths and development areas</h2>
              <p className="stu-card__sub">
                Drawn from the same assessments — not entered by the student.
              </p>
            </div>
          </header>

          <div className="stu-pf__cols">
            <div>
              <h3 className="stu-pf__col-title">
                <CheckCircle2 size={16} strokeWidth={2} aria-hidden focusable="false" />
                Strengths
              </h3>
              {strengths.length ? (
                <ul className="stu-pf__tags is-good">
                  {strengths.slice(0, 8).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p className="stu-pf__tag-empty">Not enough assessments yet.</p>
              )}
            </div>

            <div>
              <h3 className="stu-pf__col-title">
                <AlertTriangle size={16} strokeWidth={2} aria-hidden focusable="false" />
                Working on
              </h3>
              {gaps.length ? (
                <ul className="stu-pf__tags is-warn">
                  {gaps.slice(0, 8).map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              ) : (
                <p className="stu-pf__tag-empty">Not enough assessments yet.</p>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* ---- Consistency: effort, which a score alone does not show ---- */}
      <section className="stu-card stu-pf__block">
        <header className="stu-card__head">
          <div>
            <h2 className="stu-card__title">Preparation record</h2>
            <p className="stu-card__sub">How consistently this preparation has been kept up.</p>
          </div>
        </header>

        <dl className="stu-pf__stats">
          <div>
            <dt>Assessments completed</dt>
            <dd>
              {activity.completed_count ?? 0}
              <em>of {activity.total_count ?? total}</em>
            </dd>
          </div>
          <div>
            <dt>Current daily streak</dt>
            <dd>
              {activity.consecutive_days ?? 0}
              <em>{(activity.consecutive_days ?? 0) === 1 ? 'day' : 'days'}</em>
            </dd>
          </div>
          <div>
            <dt>Active days this week</dt>
            <dd>
              {activity.active_days_this_week ?? 0}
              <em>of 7</em>
            </dd>
          </div>
        </dl>
      </section>

      <footer className="stu-pf__foot">
        <p>
          <Calendar size={14} strokeWidth={2} aria-hidden focusable="false" />
          Profile generated {formatDate(new Date().toISOString())} · MentorMuni
        </p>
        <Link className="stu-link-btn" to={studentPaths.changePassword}>
          <KeyRound size={14} strokeWidth={2} aria-hidden focusable="false" />
          Change password
        </Link>
      </footer>
    </main>
  );
}
