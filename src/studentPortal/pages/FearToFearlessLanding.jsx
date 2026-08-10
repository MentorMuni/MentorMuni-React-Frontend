import { Lock, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import '../styles/fear-to-fearless-landing.css';

export default function FearToFearlessLanding({
  onStartJourney,
  onViewProgress,
  loading = false,
  error = '',
}) {
  return (
    <div className="ftf-landing">
      <div className="ftf-landing__background">
        <div className="ftf-landing__gradient-1" />
        <div className="ftf-landing__gradient-2" />
        <div className="ftf-landing__gradient-3" />
      </div>

      <div className="ftf-landing__container">
        <div className="ftf-landing__hero">
          <div className="ftf-landing__icon-wrapper">
            <div className="ftf-landing__lock-icon">
              <Lock size={48} strokeWidth={1.5} />
            </div>
            <div className="ftf-landing__icon-glow" />
          </div>

          <div className="ftf-landing__headline">
            <span className="ftf-landing__overline">🔒 Private to you</span>
            <h1 className="ftf-landing__title">
              Fear <span className="ftf-landing__arrow">→</span> Fearless
            </h1>
            <p className="ftf-landing__subtitle">
              Your private 6-week AI coaching journey
              <br />
              <span className="ftf-landing__subtitle-accent">
                From placement anxiety to interview confidence
              </span>
            </p>
          </div>

          <div className="ftf-landing__privacy-section">
            <div className="ftf-landing__privacy-card">
              <p className="ftf-landing__privacy-headline">
                A private space to understand what&apos;s really holding you back.
              </p>

              <div className="ftf-landing__privacy-details">
                <div className="ftf-landing__privacy-item ftf-landing__privacy-item--fade-in-1">
                  <span className="ftf-landing__check">✓</span>
                  <span>You don&apos;t have to impress anyone here</span>
                </div>
                <div className="ftf-landing__privacy-item ftf-landing__privacy-item--fade-in-2">
                  <span className="ftf-landing__check">✓</span>
                  <span>You don&apos;t have to sound confident</span>
                </div>
                <div className="ftf-landing__privacy-item ftf-landing__privacy-item--fade-in-3">
                  <span className="ftf-landing__check">✓</span>
                  <span>You don&apos;t have to know the right answer</span>
                </div>
                <div className="ftf-landing__privacy-item ftf-landing__privacy-item--fade-in-4">
                  <span className="ftf-landing__check">✓</span>
                  <span>Just tell us what&apos;s actually going on</span>
                </div>
              </div>

              <div className="ftf-landing__divider" />

              <p className="ftf-landing__privacy-footer">
                <Lock size={14} className="ftf-landing__privacy-lock-icon" />
                Your answers are private and aren&apos;t shown to your TPO, HOD, classmates, or
                leaderboard.
              </p>

              <p className="ftf-landing__no-judgment">
                No judgment. No marks. No right or wrong answers.
              </p>
            </div>
          </div>

          <div className="ftf-landing__journey-preview">
            <h3 className="ftf-landing__journey-title">Your 6-Week Transformation</h3>
            <div className="ftf-landing__journey-steps">
              <div className="ftf-landing__journey-step ftf-landing__journey-step--week-1">
                <div className="ftf-landing__journey-number">1-2</div>
                <div className="ftf-landing__journey-label">Foundation</div>
                <div className="ftf-landing__journey-fear">Fear: 8→5</div>
              </div>

              <div className="ftf-landing__journey-arrow">→</div>

              <div className="ftf-landing__journey-step ftf-landing__journey-step--week-3">
                <div className="ftf-landing__journey-number">3-4</div>
                <div className="ftf-landing__journey-label">Growth</div>
                <div className="ftf-landing__journey-fear">Fear: 5→2</div>
              </div>

              <div className="ftf-landing__journey-arrow">→</div>

              <div className="ftf-landing__journey-step ftf-landing__journey-step--week-6">
                <div className="ftf-landing__journey-number">5-6</div>
                <div className="ftf-landing__journey-label">Fearless!</div>
                <div className="ftf-landing__journey-fear">Fear: 2→0 ✅</div>
              </div>
            </div>
          </div>

          {error ? (
            <p className="ftf-landing__error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="ftf-landing__cta-section">
            <button
              type="button"
              className="ftf-landing__cta ftf-landing__cta--primary"
              onClick={onStartJourney}
              disabled={loading}
            >
              <span className="ftf-landing__cta-text">
                {loading ? 'Starting…' : 'Start your journey'}
              </span>
              {!loading ? <ArrowRight size={18} className="ftf-landing__cta-arrow" /> : null}
              <span className="ftf-landing__cta-subtext">Takes 5–7 minutes</span>
            </button>

            <p className="ftf-landing__cta-secondary">
              Or{' '}
              <button type="button" className="ftf-landing__link" onClick={onViewProgress}>
                view my progress
              </button>{' '}
              if you&apos;ve already started
            </p>
          </div>

          <div className="ftf-landing__features">
            <div className="ftf-landing__feature ftf-landing__feature--animate-1">
              <div className="ftf-landing__feature-icon">
                <Zap size={20} />
              </div>
              <div className="ftf-landing__feature-text">
                <strong>Personalized</strong>
                <span>AI understands YOUR fears</span>
              </div>
            </div>

            <div className="ftf-landing__feature ftf-landing__feature--animate-2">
              <div className="ftf-landing__feature-icon">
                <CheckCircle size={20} />
              </div>
              <div className="ftf-landing__feature-text">
                <strong>Actionable</strong>
                <span>Concrete plans, not generic advice</span>
              </div>
            </div>

            <div className="ftf-landing__feature ftf-landing__feature--animate-3">
              <div className="ftf-landing__feature-icon">
                <Lock size={20} />
              </div>
              <div className="ftf-landing__feature-text">
                <strong>Private</strong>
                <span>100% confidential journey</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
