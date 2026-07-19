import { useCallback, useEffect, useRef, useState } from 'react';
import { createVoiceInterviewSession, normalizeClientSecret } from './voiceInterviewApi';

function micErrorMessage(err) {
  if (err?.name === 'NotAllowedError') {
    return 'Microphone permission denied. Allow mic access and try again.';
  }
  if (err?.name === 'NotFoundError') {
    return 'No microphone found. Connect a mic and try again.';
  }
  if (err?.name === 'NotReadableError') {
    return 'Microphone is in use by another app. Close it and try again.';
  }
  return err?.message || 'Failed to start the voice interview.';
}

/**
 * OpenAI Realtime WebRTC session for MentorMuni voice interviews.
 * Collects transcript turns from the oai-events data channel while the call is active.
 */
export function useRealtimeVoiceSession() {
  const [status, setStatus] = useState('idle'); // idle | connecting | live | muted | ending | error
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [needsAudioUnlock, setNeedsAudioUnlock] = useState(false);

  const pcRef = useRef(null);
  const micStreamRef = useRef(null);
  const audioElRef = useRef(null);
  const dcRef = useRef(null);
  const transcriptRef = useRef([]);
  const remoteAudioAnalyserRef = useRef(null);
  const localAudioAnalyserRef = useRef(null);
  const audioCtxRef = useRef([]);
  const rafRef = useRef(null);
  const mountedRef = useRef(true);
  const lastSpeakUpdateRef = useRef(0);
  const speakingRef = useRef({ agent: false, user: false });

  const appendTurn = useCallback((role, text) => {
    const cleaned = text?.trim();
    if (!cleaned) return;
    setTranscript((prev) => {
      const next = [...prev, { role, text: cleaned }];
      transcriptRef.current = next;
      return next;
    });
  }, []);

  const stopSpeakingPoll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    speakingRef.current = { agent: false, user: false };
    setAgentSpeaking(false);
    setUserSpeaking(false);
  }, []);

  const startSpeakingPoll = useCallback(() => {
    const tick = () => {
      const now = performance.now();
      const remote = remoteAudioAnalyserRef.current;
      const local = localAudioAnalyserRef.current;
      let agent = false;
      let user = false;

      if (remote) {
        const data = new Uint8Array(remote.frequencyBinCount);
        remote.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        agent = avg > 12;
      }
      if (local) {
        const data = new Uint8Array(local.frequencyBinCount);
        local.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        user = avg > 14;
      }

      if (now - lastSpeakUpdateRef.current > 120) {
        lastSpeakUpdateRef.current = now;
        if (speakingRef.current.agent !== agent) {
          speakingRef.current.agent = agent;
          setAgentSpeaking(agent);
        }
        if (speakingRef.current.user !== user) {
          speakingRef.current.user = user;
          setUserSpeaking(user);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const handleRealtimeEvent = useCallback(
    (raw) => {
      let event;
      try {
        event = JSON.parse(raw);
      } catch {
        return;
      }

      const type = event?.type;
      if (!type) return;

      if (type === 'error') {
        const msg =
          event.error?.message ||
          event.message ||
          'The live session hit an error. End to score what you have, or start again.';
        if (mountedRef.current) {
          setError(msg);
          setStatus('error');
        }
        return;
      }

      if (type === 'conversation.item.input_audio_transcription.failed') {
        if (mountedRef.current) {
          setError('Speech transcription failed for a turn. You can still continue or End for partial scoring.');
        }
        return;
      }

      if (type === 'conversation.item.input_audio_transcription.completed') {
        const text = event.transcript ?? event.item?.content?.[0]?.transcript;
        appendTurn('user', text);
        return;
      }

      if (
        type === 'response.output_audio_transcript.done' ||
        type === 'response.audio_transcript.done'
      ) {
        const text = event.transcript ?? event.text;
        appendTurn('assistant', text);
        return;
      }

      if (type === 'response.created' || type === 'output_audio_buffer.started') {
        setAgentSpeaking(true);
      }
      if (
        type === 'response.done' ||
        type === 'output_audio_buffer.stopped' ||
        type === 'response.output_audio.done'
      ) {
        setAgentSpeaking(false);
      }
    },
    [appendTurn]
  );

  const trackAudioContext = useCallback((ctx) => {
    if (ctx) audioCtxRef.current.push(ctx);
  }, []);

  const teardown = useCallback(() => {
    stopSpeakingPoll();

    try {
      dcRef.current?.close();
    } catch {
      /* ignore */
    }
    dcRef.current = null;

    try {
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
    } catch {
      /* ignore */
    }
    micStreamRef.current = null;

    try {
      pcRef.current?.getSenders().forEach((s) => {
        try {
          s.track?.stop();
        } catch {
          /* ignore */
        }
      });
      pcRef.current?.close();
    } catch {
      /* ignore */
    }
    pcRef.current = null;

    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
      audioElRef.current.remove();
      audioElRef.current = null;
    }

    audioCtxRef.current.forEach((ctx) => {
      try {
        ctx.close();
      } catch {
        /* ignore */
      }
    });
    audioCtxRef.current = [];
    remoteAudioAnalyserRef.current = null;
    localAudioAnalyserRef.current = null;
    setNeedsAudioUnlock(false);
  }, [stopSpeakingPoll]);

  const unlockAudio = useCallback(async () => {
    const el = audioElRef.current;
    if (!el) return;
    try {
      await el.play();
      setNeedsAudioUnlock(false);
    } catch {
      setNeedsAudioUnlock(true);
    }
  }, []);

  const startSession = useCallback(
    async ({ interview_focus, target_role, target_companies, extra_context, voice }) => {
      setError(null);
      setTranscript([]);
      transcriptRef.current = [];
      setNeedsAudioUnlock(false);
      setStatus('connecting');

      try {
        const session = await createVoiceInterviewSession({
          interview_focus,
          ...(target_role ? { target_role } : {}),
          ...(target_companies ? { target_companies } : {}),
          ...(extra_context ? { extra_context } : {}),
          ...(voice ? { voice } : {}),
        });

        if (!mountedRef.current) return null;

        const secret = normalizeClientSecret(session.client_secret);
        const realtimeUrl = session.realtime_calls_url;
        if (!secret || !realtimeUrl) {
          throw new Error('Session response missing client_secret or realtime_calls_url');
        }

        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        pc.onconnectionstatechange = () => {
          const state = pc.connectionState;
          if (state === 'failed' || state === 'disconnected') {
            if (mountedRef.current) {
              setError('Connection lost. End to score what you have, or start a new round.');
              setStatus('error');
            }
          }
        };

        const audioEl = document.createElement('audio');
        audioEl.autoplay = true;
        audioEl.setAttribute('playsinline', 'true');
        document.body.appendChild(audioEl);
        audioElRef.current = audioEl;

        pc.ontrack = (e) => {
          const [stream] = e.streams;
          audioEl.srcObject = stream;
          audioEl.play().catch(() => {
            if (mountedRef.current) setNeedsAudioUnlock(true);
          });
          try {
            const ctx = new AudioContext();
            trackAudioContext(ctx);
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            remoteAudioAnalyserRef.current = analyser;
          } catch {
            /* analyser optional */
          }
        };

        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        if (!mountedRef.current) {
          micStream.getTracks().forEach((t) => t.stop());
          pc.close();
          return null;
        }

        micStreamRef.current = micStream;
        micStream.getTracks().forEach((track) => pc.addTrack(track, micStream));

        try {
          const ctx = new AudioContext();
          trackAudioContext(ctx);
          const source = ctx.createMediaStreamSource(micStream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          localAudioAnalyserRef.current = analyser;
        } catch {
          /* analyser optional */
        }

        const dc = pc.createDataChannel('oai-events');
        dcRef.current = dc;
        dc.addEventListener('message', (e) => handleRealtimeEvent(e.data));
        // Do not send session.update here — OpenAI GA requires session.type "realtime",
        // and /session already configures instructions + transcription on the ephemeral key.

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const sdpRes = await fetch(realtimeUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${secret}`,
            'Content-Type': 'application/sdp',
          },
          body: offer.sdp,
        });

        if (!sdpRes.ok) {
          const detail = await sdpRes.text().catch(() => '');
          throw new Error(detail || `WebRTC handshake failed (${sdpRes.status})`);
        }

        const answerSdp = await sdpRes.text();
        await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

        if (!mountedRef.current) {
          teardown();
          return null;
        }

        startSpeakingPoll();
        setStatus('live');
        return session;
      } catch (err) {
        teardown();
        const message = micErrorMessage(err);
        if (mountedRef.current) {
          setError(message);
          setStatus('error');
        }
        throw err;
      }
    },
    [handleRealtimeEvent, startSpeakingPoll, teardown, trackAudioContext]
  );

  const setMicEnabled = useCallback((enabled) => {
    const tracks = micStreamRef.current?.getAudioTracks() ?? [];
    tracks.forEach((t) => {
      t.enabled = enabled;
    });
    setStatus(enabled ? 'live' : 'muted');
  }, []);

  const stopMic = useCallback(() => setMicEnabled(false), [setMicEnabled]);
  const resumeMic = useCallback(() => setMicEnabled(true), [setMicEnabled]);

  /**
   * Close WebRTC and return the transcript collected so far.
   * Brief flush wait helps capture in-flight transcript events.
   */
  const endSession = useCallback(async () => {
    setStatus('ending');
    try {
      micStreamRef.current?.getAudioTracks().forEach((t) => {
        t.enabled = false;
      });
    } catch {
      /* ignore */
    }
    await new Promise((r) => setTimeout(r, 450));
    const turns = [...transcriptRef.current];
    teardown();
    return turns;
  }, [teardown]);

  const reset = useCallback(() => {
    teardown();
    setTranscript([]);
    transcriptRef.current = [];
    setError(null);
    setStatus('idle');
  }, [teardown]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      teardown();
    };
  }, [teardown]);

  return {
    status,
    error,
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
    setError,
  };
}
