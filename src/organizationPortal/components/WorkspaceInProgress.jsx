import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, NotebookPen } from 'lucide-react';
import { orgPaths } from '../paths';
import { isHodRole, isViewerRole, sessionDisplayRole } from '../roles';
import './workspace-in-progress.css';

const TPO_TIPS = [
  {
    title: 'Keep campus ops in one list',
    body: 'Call Infosys HR, CSE mock deadline, Meet Dean Friday — capture it here instead of a personal notebook.',
  },
  {
    title: 'Private to you',
    body: 'Todos, reminders, and notes stay on your account. HODs and students cannot see this workspace.',
  },
  {
    title: 'Same list on any device',
    body: 'Workspace is API-backed. Start a reminder on campus, tick it off from home.',
  },
  {
    title: 'Stay on the platform',
    body: 'Drives, enrollment, and your personal follow-ups live in one place — no more scattered WhatsApp notes.',
  },
];

const HOD_TIPS = [
  {
    title: 'Your branch mentor notepad',
    body: 'Track mock deadlines, weak-student follow-ups, and Dean meetings without mixing them into the roster.',
  },
  {
    title: 'Private to you',
    body: 'Workspace is not a student record. TPO and other HODs cannot open your list.',
  },
  {
    title: 'Reminders with dates',
    body: 'Pin “CSE aptitude retest Friday” and come back when the week gets noisy.',
  },
  {
    title: 'Open, done, all',
    body: 'Close the loop on mentoring actions the same way you close a placement week.',
  },
];

const VIEWER_TIPS = [
  {
    title: 'Campus pulse, read-only',
    body: 'Readiness, department trends, and leaderboards — no edits, no accidental changes.',
  },
  {
    title: 'See the season, not the noise',
    body: 'Use Performance to spot which branches need attention before the next drive.',
  },
];

function firstName(session) {
  const raw = String(session?.name || '').trim();
  if (!raw) return sessionDisplayRole(session) || 'there';
  return raw.split(/\s+/)[0];
}

export default function WorkspaceInProgress({ session }) {
  const viewer = isViewerRole(session?.role);
  const hod = isHodRole(session?.role);
  const tips = viewer ? VIEWER_TIPS : hod ? HOD_TIPS : TPO_TIPS;
  const [index, setIndex] = useState(0);
  const tip = tips[index % tips.length];
  const roleLabel = sessionDisplayRole(session);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((n) => (n + 1) % tips.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [tips.length]);

  return (
    <div
      className="mm-wait mm-wait--org"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mm-wait__card">
        <p className="mm-wait__overline">
          <NotebookPen size={13} strokeWidth={2.2} aria-hidden />
          {viewer ? 'Analytics' : 'My workspace'}
          {roleLabel ? ` · ${roleLabel}` : ''}
        </p>
        <h2 className="mm-wait__title">{firstName(session)}, while this loads…</h2>
        <p className="mm-wait__lead">
          {viewer
            ? 'Campus readiness is coming up. Meanwhile, here is what this portal is built for.'
            : hod
              ? 'Your private workspace keeps branch mentoring actions off the student roster.'
              : 'Your private workspace keeps placement follow-ups on this platform — not in a side notebook.'}
        </p>

        <div key={tip.title} className="mm-wait__tip">
          <NotebookPen size={16} strokeWidth={2} aria-hidden />
          <div>
            <strong>{tip.title}</strong>
            <p>{tip.body}</p>
          </div>
        </div>

        <div className="mm-wait__dots" aria-hidden>
          {tips.map((item, i) => (
            <span key={item.title} className={i === index ? 'is-on' : ''} />
          ))}
        </div>

        <div className="mm-wait__row">
          <span className="mm-wait__spinner" aria-hidden />
          <span className="mm-wait__status">Getting your page ready</span>
          {viewer ? (
            <Link className="mm-wait__cta" to={orgPaths.performance}>
              Open Performance
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden />
            </Link>
          ) : (
            <Link className="mm-wait__cta" to={orgPaths.workspace}>
              Open My workspace
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
