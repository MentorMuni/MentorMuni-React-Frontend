import { Suspense, lazy, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToolMeta, resolveToolMode } from './catalog';
import { createToolSession } from './createToolSession';
import { ToolSessionProvider } from './ToolSessionContext';
import ToolTabGuard from './ToolTabGuard';

const SnapReadinessTest = lazy(() => import('../components/snapTest/SnapReadinessTest'));
const InterviewReady = lazy(() => import('../components/interviewready'));
const VoiceInterviewCoach = lazy(() => import('../components/voiceInterview/VoiceInterviewCoach'));
const ResumeAnalyzer = lazy(() => import('../components/resumeAnalyzer'));
const CodingAssessment = lazy(() => import('../components/coding/CodingAssessment'));

function familyComponent(family) {
  if (family === 'snap') return SnapReadinessTest;
  if (family === 'readiness') return InterviewReady;
  if (family === 'voice') return VoiceInterviewCoach;
  if (family === 'resume') return ResumeAnalyzer;
  if (family === 'coding') return CodingAssessment;
  return null;
}

function WidgetFallback() {
  return (
    <div className="mm-tool-widget-fallback" style={{ padding: 32, textAlign: 'center', opacity: 0.7 }}>
      Loading tool…
    </div>
  );
}

/**
 * Plug-and-play MentorMuni tool widget.
 *
 * @example
 * <MmToolWidget
 *   tool="aptitude"
 *   chrome="none"
 *   source="embed"
 *   onComplete={({ toolCode, result }) => console.log(toolCode, result)}
 *   onCancel={() => setOpen(false)}
 * />
 */
export default function MmToolWidget({
  tool,
  mode: modeProp,
  skill,
  source = 'embed',
  chrome = 'none',
  lockMode = 'none',
  returnTo,
  onComplete,
  onCancel,
  onError,
  className = '',
  style,
}) {
  const navigate = useNavigate();
  const meta = getToolMeta(tool);
  const mode = resolveToolMode(tool, modeProp);

  const session = useMemo(
    () =>
      createToolSession({
        toolCode: tool,
        mode,
        skill,
        source,
        chrome,
        lockMode,
        returnTo,
        onComplete,
        onCancel,
        onError,
        navigate,
      }),
    [
      tool,
      mode,
      skill,
      source,
      chrome,
      lockMode,
      returnTo,
      onComplete,
      onCancel,
      onError,
      navigate,
    ]
  );

  if (!meta) {
    return (
      <div className={className} style={style} role="alert">
        Unknown MentorMuni tool: <code>{String(tool)}</code>
      </div>
    );
  }

  const Comp = familyComponent(meta.family);
  if (!Comp) {
    return (
      <div className={className} style={style} role="alert">
        No renderer for tool family: {meta.family}
      </div>
    );
  }

  return (
    <ToolSessionProvider value={session}>
      <div
        className={['mm-tool-widget-root', className].filter(Boolean).join(' ')}
        style={style}
        data-mm-tool={tool}
        data-mm-family={meta.family}
      >
        <ToolTabGuard enabled label={meta.title || 'this tool'} />
        <Suspense fallback={<WidgetFallback />}>
          <Comp />
        </Suspense>
      </div>
    </ToolSessionProvider>
  );
}
