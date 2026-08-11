import { useMemo } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MmToolWidget from '../../widgets/MmToolWidget';
import { getToolMeta } from '../../widgets/catalog';
import { studentPaths, studentToolPath } from '../paths';
import '../styles/tool-host.css';

const VALID_FROM = new Set([
  'roadmap',
  'practice',
  'company-prep',
  'journey',
  'embed',
  'coding',
  'fear-to-fearless',
]);

function returnPathFor(from, search) {
  if (from === 'practice') return studentPaths.practice;
  if (from === 'coding') return studentPaths.coding;
  if (from === 'company-prep') return studentPaths.companyPrep;
  if (from === 'journey') return `${studentPaths.home}#stu-90day-plan`;
  if (from === 'fear-to-fearless') {
    const checkin = search?.get?.('checkin') || '';
    const q = new URLSearchParams({ open: 'plan' });
    if (checkin) q.set('checkin', checkin);
    return `${studentPaths.fearToFearless}?${q.toString()}`;
  }
  return studentPaths.home;
}

function lockModeFor(from) {
  if (from === 'practice') return 'practice-daily';
  if (from === 'roadmap') return 'roadmap-sequential';
  return 'none';
}

/**
 * Hosts any MentorMuni assessment / mock inside the student portal shell.
 * Route: /studentportal/tools/:toolCode?from=roadmap|practice|company-prep&skill=
 */
export default function StudentToolPage() {
  const navigate = useNavigate();
  const { toolCode: rawCode } = useParams();
  const [search] = useSearchParams();

  const toolCode = decodeURIComponent(String(rawCode || '').trim());
  const fromRaw = search.get('from') || 'roadmap';
  const from = VALID_FROM.has(fromRaw) ? fromRaw : 'roadmap';
  const skill = (search.get('skill') || '').trim() || undefined;
  const modeOverride = (search.get('mode') || '').trim() || undefined;

  const meta = getToolMeta(toolCode);
  const returnTo = returnPathFor(from, search);
  const lockMode = lockModeFor(from);

  const backLabel = useMemo(() => {
    if (from === 'practice') return 'Back to Practice';
    if (from === 'coding') return 'Back to Coding Round';
    if (from === 'company-prep') return 'Back to Company Prep';
    if (from === 'journey') return 'Back to your 90-day plan';
    if (from === 'fear-to-fearless') return 'Back to Fear → Fearless';
    if (from === 'roadmap') return 'Back to Home';
    return 'Back to Home';
  }, [from]);

  if (!meta) {
    return (
      <main className="stu-main">
        <div className="stu-tool-host">
          <p className="stu-tool-host__error">
            Unknown tool <code>{toolCode || '—'}</code>.
          </p>
          <Link className="stu-link-btn" to={studentPaths.home}>
            Go home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="stu-main stu-main--tool">
      <div className="stu-tool-host">
        <header className="stu-tool-host__bar">
          <button
            type="button"
            className="stu-tool-host__back"
            onClick={() => navigate(returnTo)}
          >
            <ArrowLeft size={16} strokeWidth={2.4} aria-hidden />
            {backLabel}
          </button>
          <div className="stu-tool-host__title-wrap">
            <p className="stu-tool-host__eyebrow">
              {from === 'practice'
                ? 'Practice'
                : from === 'coding'
                  ? 'Coding Round'
                  : from === 'company-prep'
                    ? 'Company Prep'
                    : from === 'journey'
                      ? '90-day journey'
                      : from === 'fear-to-fearless'
                        ? 'Fear → Fearless'
                        : from === 'roadmap'
                          ? 'Week 1 roadmap'
                          : 'Tool'}
            </p>
            <h1 className="stu-tool-host__title">{meta.title}</h1>
          </div>
        </header>

        <MmToolWidget
          key={`${toolCode}-${from}-${skill || ''}-${modeOverride || ''}`}
          tool={toolCode}
          mode={modeOverride}
          skill={skill}
          source={from === 'embed' ? 'embed' : from}
          chrome="none"
          lockMode={lockMode}
          returnTo={returnTo}
          onCancel={() => navigate(returnTo)}
        />
      </div>
    </main>
  );
}

// Re-export helper for callers that import the page module by mistake
export { studentToolPath };
