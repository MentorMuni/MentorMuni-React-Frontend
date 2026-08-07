import { ArrowRight, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { studentPaths } from '../../paths';
import { COMPANY_PREP_TASKS, missionTotalMinutes } from '../../companyPrep';
import { driveCountdown } from '../../drives';
import EmptyState from './EmptyState';

/**
 * The daily company-prep mission.
 *
 * The task list and total used to be a hand-typed string
 * ("Aptitude · SQL · HR · Technical · Daily challenge · ~22 min")
 * that would silently go stale the moment COMPANY_PREP_TASKS changed.
 * Both are derived now.
 */
export default function UpcomingSection({ nextDrive = null }) {
  const taskNames = COMPANY_PREP_TASKS.map((t) => t.title).join(' · ');
  const minutes = missionTotalMinutes();

  return (
    <section className="stu-card stu-up">
      <header className="stu-card__head">
        <div>
          <h2 className="stu-card__title">Daily company mission</h2>
          <p className="stu-card__sub">
            {nextDrive
              ? `${nextDrive.company_name} · ${driveCountdown(nextDrive)}`
              : 'Short daily drill, ready when a drive is announced'}
          </p>
        </div>
        <Link className="stu-link-btn" to={studentPaths.companyPrep}>
          Company Prep <ArrowRight size={16} strokeWidth={2} aria-hidden focusable="false" />
        </Link>
      </header>

      {nextDrive ? (
        <div className="stu-up__promo">
          <span className="stu-up__icon" aria-hidden>
            <Building2 size={16} strokeWidth={2} focusable="false" />
          </span>
          <div className="stu-up__text">
            <strong>Today&rsquo;s mission · ~{minutes} min</strong>
            <em>{taskNames}</em>
          </div>
          <Link className="stu-btn stu-btn--soft" to={studentPaths.companyPrep}>
            Open
          </Link>
        </div>
      ) : (
        <EmptyState art="drives" title="No drive scheduled yet">
          The daily {minutes}-minute mission ({taskNames}) starts automatically once your college
          announces a drive.
        </EmptyState>
      )}
    </section>
  );
}
