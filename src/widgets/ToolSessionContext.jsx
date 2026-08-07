import { createContext, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createToolSession } from './createToolSession';
import { getRoadmapQuery } from '../studentPortal/roadmap/completeAndReturn';

const ToolSessionContext = createContext(null);

export function ToolSessionProvider({ value, children }) {
  return <ToolSessionContext.Provider value={value}>{children}</ToolSessionContext.Provider>;
}

export function useToolSessionOptional() {
  return useContext(ToolSessionContext);
}

/**
 * Legacy full-page routes: derive session from URL ?from=&tool=&mode=
 * so existing portal deep-links keep working without wrapping MmToolWidget.
 */
function useLegacyUrlSession() {
  const navigate = useNavigate();
  return useMemo(() => {
    const q = getRoadmapQuery();
    const source = q.fromPractice
      ? 'practice'
      : q.fromCompanyPrep
        ? 'company-prep'
        : q.fromJourney
          ? 'journey'
          : q.fromRoadmap
            ? 'roadmap'
            : 'standalone';
    return createToolSession({
      toolCode: q.toolCode,
      mode: q.mode,
      source,
      chrome: 'full',
      navigate,
    });
  }, [navigate]);
}

/**
 * Prefer host-provided session (widget). Fall back to URL/portal query protocol.
 */
export function useToolSession() {
  const ctx = useContext(ToolSessionContext);
  const legacy = useLegacyUrlSession();
  return ctx || legacy;
}
