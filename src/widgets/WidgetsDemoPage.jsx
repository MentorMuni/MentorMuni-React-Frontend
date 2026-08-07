import { useMemo, useState } from 'react';
import { TOOL_LIST } from './catalog';
import MmToolWidget from './MmToolWidget';

/**
 * Dev / QA surface: pick any tool and run it as an embedded widget.
 * Route: /widgets
 */
export default function WidgetsDemoPage() {
  const [tool, setTool] = useState(TOOL_LIST[0]?.id || '5_sec');
  const [lastResult, setLastResult] = useState(null);
  const [skill, setSkill] = useState('java');

  const meta = useMemo(() => TOOL_LIST.find((t) => t.id === tool), [tool]);
  const needsSkill = meta?.family === 'voice' && meta?.mode === 'skill';

  return (
    <div className="mm-site-theme min-h-screen bg-background text-foreground">
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          borderBottom: '1px solid var(--border, #e5e7eb)',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          padding: '12px 16px',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', opacity: 0.6 }}>
            MENTORMUNI WIDGETS
          </p>
          <h1 style={{ margin: '4px 0 12px', fontSize: 20, fontWeight: 800 }}>
            Plug-and-play tool host
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <label style={{ fontSize: 13, fontWeight: 600 }}>
              Tool{' '}
              <select
                value={tool}
                onChange={(e) => {
                  setTool(e.target.value);
                  setLastResult(null);
                }}
                style={{ marginLeft: 6, padding: '6px 10px', borderRadius: 8 }}
              >
                {TOOL_LIST.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </label>
            {needsSkill ? (
              <label style={{ fontSize: 13, fontWeight: 600 }}>
                Skill{' '}
                <select
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  style={{ marginLeft: 6, padding: '6px 10px', borderRadius: 8 }}
                >
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="dotnet">.NET</option>
                  <option value="sql">SQL</option>
                  <option value="python">python</option>
                </select>
              </label>
            ) : null}
          </div>
          {lastResult ? (
            <pre
              style={{
                marginTop: 12,
                maxHeight: 120,
                overflow: 'auto',
                fontSize: 11,
                background: '#0f172a',
                color: '#e2e8f0',
                padding: 10,
                borderRadius: 8,
              }}
            >
              {JSON.stringify(lastResult, null, 2)}
            </pre>
          ) : null}
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '16px' }}>
        <MmToolWidget
          key={`${tool}-${skill}`}
          tool={tool}
          skill={needsSkill ? skill : undefined}
          chrome="none"
          source="embed"
          lockMode="none"
          onComplete={(payload) => setLastResult(payload)}
          onCancel={() => setLastResult({ cancelled: true })}
        />
      </main>
    </div>
  );
}
