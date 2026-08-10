import { useEffect, useState } from 'react';
import {
  Loader2,
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
} from 'lucide-react';
import { useRealtimeVoiceSession } from '../../../components/voiceInterview/useRealtimeVoiceSession';
import { createMentorVoiceSession, fetchMentorContext, StudentApiError } from '../../mentor/mentorApi';

/**
 * Live voice mentor — same Realtime WebRTC stack as AI mock interview.
 * @param {{ compact?: boolean }} props
 */
export default function MentorVoicePanel({ compact = false }) {
  const [context, setContext] = useState(null);
  const [uiError, setUiError] = useState('');
  const [starting, setStarting] = useState(false);

  const {
    status,
    error: sessionError,
    transcript,
    agentSpeaking,
    userSpeaking,
    needsAudioUnlock,
    unlockAudio,
    startSession,
    stopMic,
    resumeMic,
    endSession,
    reset,
  } = useRealtimeVoiceSession();

  const live = status === 'live' || status === 'muted';
  const muted = status === 'muted';
  const busy = starting || status === 'connecting' || status === 'ending';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ctx = await fetchMentorContext();
        if (!cancelled) setContext(ctx);
      } catch {
        /* chips optional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => () => {
    reset();
  }, [reset]);

  async function handleStart() {
    setUiError('');
    setStarting(true);
    try {
      await startSession({
        promptFirstResponse: true,
        mintSession: () => createMentorVoiceSession({}),
      });
    } catch (err) {
      const msg =
        err instanceof StudentApiError
          ? err.message
          : err?.message || 'Could not start the voice mentor.';
      setUiError(msg);
    } finally {
      setStarting(false);
    }
  }

  async function handleEnd() {
    setUiError('');
    try {
      await endSession();
      reset();
    } catch (err) {
      setUiError(err?.message || 'Could not end the call.');
      reset();
    }
  }

  const error = uiError || sessionError;
  const weakness = context?.top_weaknesses?.[0];
  const score =
    context?.overall_score != null && !Number.isNaN(Number(context.overall_score))
      ? Math.round(Number(context.overall_score))
      : null;

  const statusLabel =
    status === 'connecting' || starting
      ? 'Connecting…'
      : live
        ? agentSpeaking
          ? 'Mentor speaking…'
          : userSpeaking
            ? 'Listening…'
            : muted
              ? 'Mic muted'
              : 'Live'
        : status === 'error'
          ? 'Interrupted'
          : 'Ready';

  return (
    <div className={`stu-mentor-voice${compact ? ' is-compact' : ''}${live ? ' is-live' : ''}`}>
      {!compact ? (
        <div className="stu-mentor-chat__meta" aria-live="polite">
          {score != null ? <span className="stu-mentor-chip">Baseline {score}</span> : null}
          {context?.week_status ? (
            <span className="stu-mentor-chip">Week: {String(context.week_status).replace('_', ' ')}</span>
          ) : null}
          {weakness ? <span className="stu-mentor-chip stu-mentor-chip--warn">Focus: {weakness}</span> : null}
          {context?.next_drive?.company_name ? (
            <span className="stu-mentor-chip">
              Drive: {context.next_drive.company_name}
              {context.next_drive.days_until != null ? ` · ${context.next_drive.days_until}d` : ''}
            </span>
          ) : null}
        </div>
      ) : null}

      {!compact ? (
        <div className={`stu-mentor-voice__stage${live ? ' is-live' : ''}`}>
          <div className="stu-mentor-voice__orb-wrap" aria-hidden>
            <span
              className={`stu-mentor-voice__ring${agentSpeaking ? ' is-agent' : ''}${userSpeaking ? ' is-user' : ''}`}
            />
            <span className="stu-mentor-voice__orb" />
          </div>
          <p className="stu-mentor-voice__status">{statusLabel}</p>
          <p className="stu-mentor-voice__hint">
            {live
              ? 'Ask about OOP, projects, mocks, coding rounds, or what to practice next.'
              : context?.greeting_hint ||
                'Your mentor knows your scores and plan. Start a voice call anytime.'}
          </p>
        </div>
      ) : live ? (
        <p className="stu-mentor-voice__compact-status" aria-live="polite">
          {statusLabel}
        </p>
      ) : null}

      {needsAudioUnlock ? (
        <button type="button" className="stu-mentor-voice__unlock" onClick={unlockAudio}>
          <Volume2 size={14} strokeWidth={2.2} aria-hidden /> Hear audio
        </button>
      ) : null}

      {error ? (
        <p className="stu-mentor-chat__error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="stu-mentor-voice__controls">
        {!live ? (
          <button
            type="button"
            className="stu-mentor-voice__start"
            disabled={busy}
            onClick={handleStart}
          >
            {busy ? (
              <>
                <Loader2 size={15} className="spin" aria-hidden /> Connecting…
              </>
            ) : (
              <>
                <Mic size={15} strokeWidth={2.2} aria-hidden /> {compact ? 'Talk' : 'Start voice mentor'}
              </>
            )}
          </button>
        ) : (
          <>
            <button
              type="button"
              className="stu-mentor-voice__mute"
              onClick={() => (muted ? resumeMic() : stopMic())}
            >
              {muted ? (
                <>
                  <Mic size={15} aria-hidden /> Unmute
                </>
              ) : (
                <>
                  <MicOff size={15} aria-hidden /> Mute
                </>
              )}
            </button>
            <button type="button" className="stu-mentor-voice__end" onClick={handleEnd}>
              <PhoneOff size={15} aria-hidden /> End
            </button>
          </>
        )}
      </div>

      {!compact && live && transcript.length > 0 ? (
        <div className="stu-mentor-voice__transcript" aria-label="Live transcript">
          {transcript.slice(-6).map((t, i) => (
            <p key={`${t.role}-${i}`}>
              <strong>{t.role === 'user' ? 'You' : 'Mentor'}:</strong> {t.text}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
