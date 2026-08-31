import { useState } from 'react';
import { ArrowRight, Check, Sparkles, Target, Timer } from 'lucide-react';
import {
  COMPANY_OPTIONS,
  savePlacementProfile,
  STARTING_LEVELS,
  TARGET_TIERS,
} from '../placementProfile';
import { saveStudentTarget } from '../targetApi';
import { setTodayBudget, TIME_BUDGETS, BUDGET_LABELS } from '../daily/timeBudget';
import '../styles/placement-onboarding.css';

const STEPS = ['path', 'companies', 'time', 'level'];

export default function PlacementOnboarding({ userKey = 'anon', onComplete }) {
  const [step, setStep] = useState(0);
  const [targetTier, setTargetTier] = useState('mass_recruiter');
  const [companies, setCompanies] = useState([]);
  const [budgetMinutes, setBudgetMinutes] = useState(25);
  const [startingLevel, setStartingLevel] = useState('some_experience');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const toggleCompany = (name) => {
    setCompanies((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const finish = async () => {
    setBusy(true);
    setErr('');
    try {
      await saveStudentTarget(
        {
          target_tier: targetTier,
          target_companies: companies,
          target_readiness: 85,
          starting_level: startingLevel,
          daily_budget_minutes: budgetMinutes,
          onboarding_completed: true,
        },
        { userKey }
      );
      setTodayBudget(budgetMinutes, userKey);
      savePlacementProfile(userKey, {
        targetTier,
        targetCompanies: companies,
        budgetMinutes,
        startingLevel,
        completedAt: new Date().toISOString(),
      });
      onComplete?.();
    } catch (e) {
      setErr(e?.message || 'Could not save your profile. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const stepId = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="stu-onboard" role="dialog" aria-modal="true" aria-labelledby="stu-onboard-title">
      <div className="stu-onboard__backdrop" />
      <div className="stu-onboard__card">
        <header className="stu-onboard__head">
          <p className="stu-onboard__eyebrow">
            <Sparkles size={14} aria-hidden /> Personalize MentorMuni
          </p>
          <h2 id="stu-onboard-title" className="stu-onboard__title">
            Let&apos;s tailor your placement journey
          </h2>
          <p className="stu-onboard__sub">
            Two minutes now — then a <strong>3-day assessment week</strong> (8 checks across
            calendar days). After that, MentorMuni builds your own <strong>30–45 day plan</strong>{' '}
            from your strengths and gaps. Your TPO and HOD see your progress as each check
            completes.
          </p>
          <ol className="stu-onboard__steps" aria-label="Setup progress">
            {STEPS.map((id, i) => (
              <li
                key={id}
                className={`stu-onboard__step${i === step ? ' is-active' : ''}${i < step ? ' is-done' : ''}`}
              >
                {i < step ? <Check size={12} /> : i + 1}
              </li>
            ))}
          </ol>
        </header>

        {stepId === 'path' ? (
          <div className="stu-onboard__body">
            <p className="stu-onboard__label">
              <Target size={14} aria-hidden /> What kind of roles are you targeting?
            </p>
            <div className="stu-onboard__choices">
              {TARGET_TIERS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`stu-onboard__choice${targetTier === t.id ? ' is-selected' : ''}`}
                  onClick={() => setTargetTier(t.id)}
                >
                  <strong>{t.label}</strong>
                  <span>{t.hint}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {stepId === 'companies' ? (
          <div className="stu-onboard__body">
            <p className="stu-onboard__label">Dream companies (pick any)</p>
            <div className="stu-onboard__chips">
              {COMPANY_OPTIONS.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`stu-onboard__chip${companies.includes(name) ? ' is-on' : ''}`}
                  onClick={() => toggleCompany(name)}
                >
                  {name}
                </button>
              ))}
            </div>
            <p className="stu-onboard__hint">Optional — helps gates and mentor context later.</p>
          </div>
        ) : null}

        {stepId === 'time' ? (
          <div className="stu-onboard__body">
            <p className="stu-onboard__label">
              <Timer size={14} aria-hidden /> Realistic daily time for prep?
            </p>
            <div className="stu-onboard__budgets">
              {TIME_BUDGETS.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`stu-onboard__budget${budgetMinutes === m ? ' is-selected' : ''}`}
                  onClick={() => setBudgetMinutes(m)}
                >
                  <strong>{m} min</strong>
                  <span>{BUDGET_LABELS[m]}</span>
                </button>
              ))}
            </div>
            <p className="stu-onboard__hint">
              Today&apos;s mission will be sized to this — change anytime on Home.
            </p>
          </div>
        ) : null}

        {stepId === 'level' ? (
          <div className="stu-onboard__body">
            <p className="stu-onboard__label">Where are you starting from?</p>
            <div className="stu-onboard__choices">
              {STARTING_LEVELS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className={`stu-onboard__choice${startingLevel === l.id ? ' is-selected' : ''}`}
                  onClick={() => setStartingLevel(l.id)}
                >
                  <strong>{l.label}</strong>
                  <span>{l.hint}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {err ? (
          <p className="stu-onboard__error" role="alert">
            {err}
          </p>
        ) : null}

        <footer className="stu-onboard__foot">
          {step > 0 ? (
            <button
              type="button"
              className="stu-btn stu-btn--ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={busy}
            >
              Back
            </button>
          ) : (
            <span />
          )}
          {!isLast ? (
            <button
              type="button"
              className="stu-btn stu-btn--primary"
              onClick={() => setStep((s) => s + 1)}
            >
              Continue <ArrowRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              className="stu-btn stu-btn--primary"
              onClick={finish}
              disabled={busy}
            >
              {busy ? 'Saving…' : 'Start my journey'}
              {!busy ? <ArrowRight size={15} /> : null}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
