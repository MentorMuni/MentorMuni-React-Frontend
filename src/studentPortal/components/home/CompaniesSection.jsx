import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { companyLogo, companyMonogram } from '../../companyLogos';
import { driveCountdown } from '../../drives';
import { studentPaths } from '../../paths';
import EmptyState from './EmptyState';

/**
 * Drives your college has actually published, matched against your
 * readiness.
 *
 * This used to be five invented employers with invented scores (TCS 82,
 * Amazon 28…). Every row here comes from GET /student/upcoming-drives,
 * and the readiness figure is the student's real one — so the tier is a
 * claim we can stand behind.
 */

function tier(score) {
  if (score >= 80) return { key: 'ready', label: 'Ready' };
  if (score >= 70) return { key: 'almost', label: 'Almost' };
  if (score >= 50) return { key: 'practice', label: 'Practice' };
  return { key: 'gap', label: 'Needs work' };
}

function CompanyMark({ name }) {
  const logo = companyLogo(name);
  return (
    <span className="stu-co__mark" aria-hidden>
      {logo ? <img src={logo} alt="" loading="lazy" /> : companyMonogram(name)}
    </span>
  );
}

export default function CompaniesSection({ drives = [], readiness = 0, isDemo = false }) {
  const rows = drives.filter((d) => d && !d.is_past).slice(0, 5);
  const score = Math.round(readiness);

  return (
    <section className="stu-card stu-companies">
      <header className="stu-card__head">
        <div>
          <h2 className="stu-card__title">Drives you can target</h2>
          <p className="stu-card__sub">
            {rows.length
              ? `Your ${score}% readiness against the drives your college has posted`
              : 'Posted by your training & placement office'}
          </p>
        </div>
        {rows.length ? (
          <div className="stu-co__actions">
            <Link className="stu-link-btn" to={studentPaths.companies}>
              Company intel <ArrowRight size={16} strokeWidth={2} aria-hidden focusable="false" />
            </Link>
            <Link className="stu-link-btn" to={studentPaths.companyPrep}>
              Prep daily <ArrowRight size={16} strokeWidth={2} aria-hidden focusable="false" />
            </Link>
          </div>
        ) : (
          <Link className="stu-link-btn" to={studentPaths.companies}>
            Browse companies <ArrowRight size={16} strokeWidth={2} aria-hidden focusable="false" />
          </Link>
        )}
      </header>

      {rows.length ? (
        <>
          {isDemo ? (
            <p className="stu-alert stu-alert--info" role="status">
              Sample drive — your college has not published its calendar yet.
            </p>
          ) : null}

          <ul className="stu-co__list">
            {rows.map((drive) => {
              const t = tier(score);
              const intelTo = `${studentPaths.companies}?company=${encodeURIComponent(drive.company_name || '')}`;
              return (
                <li key={drive.id} className="stu-co">
                  <CompanyMark name={drive.company_name} />

                  <span className="stu-co__id">
                    <strong>{drive.company_name}</strong>
                    <em>{driveCountdown(drive) || drive.eligibility_criteria || 'Date to be announced'}</em>
                    <Link className="stu-co__intel" to={intelTo}>
                      How they hire
                    </Link>
                  </span>

                  {/* Width is declared, not animated in JS, so the bar is
                      correct even if the grow animation never runs. */}
                  <span className="stu-co__bar" aria-hidden>
                    <span className="stu-co__fill" data-tier={t.key} style={{ width: `${score}%` }} />
                  </span>

                  <span className="stu-co__score">{score}%</span>
                  <span className={`stu-tier stu-tier--${t.key}`}>{t.label}</span>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <EmptyState art="drives" title="No drives posted yet">
          When your training & placement office publishes the campus calendar, each drive shows
          up here with your readiness against it. You can still browse{' '}
          <Link to={studentPaths.companies}>company hiring intelligence</Link>.
        </EmptyState>
      )}
    </section>
  );
}
