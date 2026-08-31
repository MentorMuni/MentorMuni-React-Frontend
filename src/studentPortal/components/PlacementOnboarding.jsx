import { useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import {
  COMPANY_OPTIONS,
  savePlacementProfile,
  STARTING_LEVELS,
  TARGET_TIERS,
} from '../placementProfile';
import { saveStudentTarget } from '../targetApi';
import { setTodayBudget, TIME_BUDGETS, BUDGET_LABELS } from '../daily/timeBudget';
import '../styles/placement-onboarding.css';

/** Two short steps — keep it under a minute. */
const STEPS = ['basics', 'level'];

export default function PlacementOnboarding({ userKey = 'anon', onComplete }) {
  const [step, setStep] = useState(0);
  const [targetTier, setTargetTier] = useState('mass_recruiter');
  const [companies, setCompanies] = useState([]);
  const [budgetMinutes, setBudgetMinutes] = useState(25);
  const [startingLevel, setStartingLevel] = useState('some_experience');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [showCompanies, setShowCompanies] = useState(false);

  const toggleCompany = (name) => {
    setCompanies((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const finish = async () => {
    if (busy) return;
    setBusy(true);
    setErr('');

    const body = {
      target_tier: targetTier,
      target_companies: companies,
      target_readiness: 85,
      starting_level: startingLevel,
      daily_budget_minutes: budgetMinutes,
      onboarding_completed: true,
    };

    try {
      // Local-first so we never trap the student on "Saving…" if the API is slow.
      setTodayBudget(budgetMinutes, userKey);
      savePlacementProfile(userKey, {
        targetTier,
        targetCompanies: companies,
        budgetMinutes,
        startingLevel,
        completedAt: new Date().toISOString(),
      });
      await saveStudentTarget(body, { userKey, timeoutMs: 10000, silent: true });
    } catch {
      // Keep going — profile is already on this device.
    } finally {
      setBusy(false);
      onComplete?.();
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
            <Sparkles size={14} aria-hidden /> Quick setup
          </p>
          <h2 id="stu-onboard-title" className="stu-onboard__title">
            Personalize your placement plan
          </h2>
          <p className="stu-onboard__sub">
            About 30 seconds. Then you start a short assessment week — we build your plan from the results.
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

        {stepId === 'basics' ? (
          <div className="stu-onboard__body">
            <p className="stu-onboard__label">What are you aiming for?</p>
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

            <p className="stu-onboard__label stu-onboard__label--spaced">Daily prep time</p>
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

            <button
              type="button"
              className="stu-onboard__linkish"
              onClick={() => setShowCompanies((v) => !v)}
            >
              {showCompanies ? 'Hide companies' : 'Add dream companies (optional)'}
            </button>
            {showCompanies ? (
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
            ) : null}
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
              {busy ? 'Starting…' : 'Start my journey'}
              {!busy ? <ArrowRight size={15} /> : null}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
