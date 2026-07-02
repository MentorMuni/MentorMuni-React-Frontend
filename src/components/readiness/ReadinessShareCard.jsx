import React from 'react';
import { BRAND_MEME_LINE } from '../../constants/brandCopy';
import { percentileAheadFromScore } from '../../utils/readinessPercentile';

const scoreColor = (s) => (s >= 75 ? '#16a34a' : s >= 50 ? '#d97706' : '#dc2626');

/**
 * Off-screen DOM node rendered for html2canvas export.
 * 1080×1920 — WhatsApp status; also crops cleanly for LinkedIn posts.
 */
const ReadinessShareCard = React.forwardRef(function ReadinessShareCard(
  { score, percentileAhead, roleLabel = 'Student', readinessLabel },
  ref,
) {
  const pct = percentileAhead ?? percentileAheadFromScore(score);

  return (
    <div
      ref={ref}
      style={{
        width: 1080,
        height: 1920,
        background: 'linear-gradient(165deg, #0f172a 0%, #1e293b 42%, #0f172a 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        padding: '72px 64px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: '#FF9500',
            textTransform: 'uppercase',
          }}
        >
          MentorMuni
        </p>
        <p style={{ margin: '12px 0 0', fontSize: 22, color: '#94a3b8', fontWeight: 600 }}>
          Interview readiness check
        </p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 320,
            height: 320,
            borderRadius: '50%',
            border: `12px solid ${scoreColor(score)}`,
            margin: '0 auto 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          <span style={{ fontSize: 120, fontWeight: 900, lineHeight: 1, color: scoreColor(score) }}>
            {score}
          </span>
          <span style={{ fontSize: 28, color: '#94a3b8', marginTop: 8 }}>/ 100</span>
        </div>

        {readinessLabel ? (
          <p style={{ margin: '0 0 24px', fontSize: 36, fontWeight: 800, color: '#f1f5f9' }}>
            {readinessLabel}
          </p>
        ) : null}

        <p
          style={{
            margin: 0,
            fontSize: 40,
            fontWeight: 800,
            lineHeight: 1.25,
            color: '#FF9500',
          }}
        >
          Ahead of {pct}% of students
        </p>
        <p style={{ margin: '20px 0 0', fontSize: 26, color: '#cbd5e1' }}>Role: {roleLabel}</p>
      </div>

      <div>
        <p style={{ margin: 0, fontSize: 26, color: '#94a3b8', lineHeight: 1.5 }}>{BRAND_MEME_LINE}</p>
        <p style={{ margin: '16px 0 0', fontSize: 32, fontWeight: 800, color: '#FF9500' }}>
          mentormuni.com
        </p>
        <p style={{ margin: '12px 0 0', fontSize: 20, color: '#64748b' }}>
          Free ~5 min check · No signup
        </p>
      </div>
    </div>
  );
});

export default ReadinessShareCard;
