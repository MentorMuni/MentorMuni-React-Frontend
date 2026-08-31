import { useMemo, useState } from 'react';
import { ArrowRight, Gauge, Rocket, Sprout } from 'lucide-react';
import {
  BASELINE_PATHS,
  baselinePathHint,
  baselinePathLabel,
  earlyBaselineAverage,
  recommendBaselinePath,
} from '../baselineAdaptive';
import { getPlacementProfile } from '../placementProfile';
import '../styles/baseline-path.css';

const OPTIONS = [
  {
    id: BASELINE_PATHS.FAST_TRACK,
    icon: Rocket,
    title: 'Fast track',
    hint: 'Strong on basics — skip redundant readiness checks and get to mocks sooner.',
  },
  {
    id: BASELINE_PATHS.STANDARD,
    icon: Gauge,
    title: 'Standard',
    hint: 'All eight checks in order — best for most students.',
  },
  {
    id: BASELINE_PATHS.FOUNDATION,
    icon: Sprout,
    title: 'Foundation mode',
    hint: 'Build core skills with shorter drills before mock pressure.',
  },
];

export default function BaselinePathChooser({ steps = [], userKey = 'anon', onChoose, busy = false }) {
  const startingLevel = getPlacementProfile(userKey)?.startingLevel || 'some_experience';
  const suggested = useMemo(
    () => recommendBaselinePath({ steps, startingLevel }),
    [steps, startingLevel]
  );
  const [selected, setSelected] = useState(suggested);
  const avg = earlyBaselineAverage(steps);

  return (
    <div className="stu-path-chooser" role="dialog" aria-modal="true" aria-labelledby="stu-path-title">
      <div className="stu-path-chooser__backdrop" />
      <div className="stu-path-chooser__card">
        <header className="stu-path-chooser__head">
          <p className="stu-path-chooser__eyebrow">Personalized baseline</p>
          <h2 id="stu-path-title" className="stu-path-chooser__title">
            Pick your Week-1 path
          </h2>
          <p className="stu-path-chooser__sub">
            {avg != null
              ? `Your first two checks averaged ${avg}% — choose how the rest of baseline should feel.`
              : 'Choose how the rest of baseline should feel.'}
          </p>
        </header>

        <div className="stu-path-chooser__options">
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSuggested = opt.id === suggested;
            return (
              <button
                key={opt.id}
                type="button"
                className={`stu-path-chooser__opt${selected === opt.id ? ' is-selected' : ''}`}
                onClick={() => setSelected(opt.id)}
                disabled={busy}
              >
                <span className="stu-path-chooser__opt-icon" aria-hidden>
                  <Icon size={18} />
                </span>
                <span className="stu-path-chooser__opt-body">
                  <strong>
                    {opt.title}
                    {isSuggested ? <em className="stu-path-chooser__tag">Suggested</em> : null}
                  </strong>
                  <span>{opt.hint}</span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="stu-path-chooser__note">
          {baselinePathLabel(selected)} — {baselinePathHint(selected)}
        </p>

        <footer className="stu-path-chooser__foot">
          <button
            type="button"
            className="stu-btn stu-btn--primary"
            onClick={() => onChoose?.(selected)}
            disabled={busy}
          >
            {busy ? 'Applying…' : 'Continue baseline'}
            {!busy ? <ArrowRight size={15} /> : null}
          </button>
        </footer>
      </div>
    </div>
  );
}
