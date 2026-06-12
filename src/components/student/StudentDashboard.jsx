import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Bot,
  Building2,
  ChevronRight,
  Clock,
  GraduationCap,
  HelpCircle,
  LogOut,
  MessageSquare,
  Mic,
  Send,
  Sparkles,
  Target,
  User,
  Users,
  X,
} from 'lucide-react';
import RoutePageShell from '../layout/RoutePageShell';
import {
  clearStudentSession,
  FEEDBACK_THREADS,
  getStudentProgress,
  getStudentSession,
  saveStudentProgress,
  STUDENT_BENEFITS,
} from '../../utils/studentAuth';

const EASE = [0.22, 1, 0.36, 1];

const BENEFIT_ICONS = {
  users: Users,
  mic: Mic,
  help: HelpCircle,
  building: Building2,
  clock: Clock,
};

const HELP_ITEMS = [
  {
    q: 'How do I book my next 1:1 mentorship session?',
    a: 'Use the progress card below — when a slot is available, your mentor will share a calendar link in your feedback thread.',
  },
  {
    q: 'Can I reschedule a mock interview?',
    a: 'Yes. Raise it in Help & concerns or reply in your mock feedback thread at least 24 hours before the slot.',
  },
  {
    q: 'Who do I contact for technical issues?',
    a: 'Use Help & concerns or email support via the contact page. Include your student ID (MM101).',
  },
];

function ProgressRing({ pct, size = 88 }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width={size} height={size} className="mm-student-ring" aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={7} className="mm-student-ring__track" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        className="mm-student-ring__fill"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

function BenefitCard({ benefit, completed, onMarkComplete, reduceMotion }) {
  const Icon = BENEFIT_ICONS[benefit.icon] || Target;
  const pct = Math.round((completed / benefit.total) * 100);
  const done = completed >= benefit.total;

  return (
    <motion.article
      className={`mm-student-benefit${done ? ' mm-student-benefit--done' : ''}`}
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div className="mm-student-benefit__head">
        <span className="mm-student-benefit__icon">
          <Icon size={18} strokeWidth={2.25} aria-hidden />
        </span>
        <div className="mm-student-benefit__titles">
          <h3 className="mm-student-benefit__title">{benefit.title}</h3>
          {benefit.subtitle && (
            <p className="mm-student-benefit__subtitle">{benefit.subtitle}</p>
          )}
        </div>
        <span className={`mm-student-benefit__count${done ? ' mm-student-benefit__count--done' : ''}`}>
          {completed}/{benefit.total}
        </span>
      </div>
      <p className="mm-student-benefit__desc">{benefit.desc}</p>
      <div className="mm-student-benefit__bar" role="progressbar" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={benefit.total}>
        <motion.div
          className="mm-student-benefit__bar-fill"
          initial={reduceMotion ? false : { width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        />
      </div>
      <div className="mm-student-benefit__footer">
        <span className="mm-student-benefit__status">
          {done ? 'Completed' : `${benefit.total - completed} remaining`}
        </span>
        {!done && (
          <button
            type="button"
            className="mm-student-benefit__action"
            onClick={() => onMarkComplete(benefit.id)}
          >
            Mark session done
            <ChevronRight size={14} aria-hidden />
          </button>
        )}
      </div>
    </motion.article>
  );
}

function FeedbackThread({ thread, active, onSelect, reply, onReplyChange, onSend, reduceMotion }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (active && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [active, thread.messages.length]);

  return (
    <article
      className={`mm-student-thread${active ? ' mm-student-thread--active' : ''}`}
      onClick={() => onSelect(thread.id)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(thread.id)}
      role="button"
      tabIndex={0}
    >
      <div className="mm-student-thread__head">
        <h3 className="mm-student-thread__title">{thread.title}</h3>
        <p className="mm-student-thread__meta">
          {thread.mentor} · {thread.lastActive}
        </p>
      </div>

      {active && (
        <motion.div
          className="mm-student-thread__body"
          initial={reduceMotion ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <div className="mm-student-thread__messages" ref={scrollRef}>
            {thread.messages.map((msg) => (
              <div
                key={msg.id}
                className={`mm-student-thread-msg mm-student-thread-msg--${msg.role}`}
              >
                <span className="mm-student-thread-msg__role">
                  {msg.role === 'mentor' ? (
                    <>
                      <Bot size={12} aria-hidden /> Mentor
                    </>
                  ) : (
                    <>
                      <User size={12} aria-hidden /> You
                    </>
                  )}
                </span>
                <p className="mm-student-thread-msg__text">{msg.text}</p>
                <time className="mm-student-thread-msg__time">{msg.time}</time>
              </div>
            ))}
          </div>
          <form
            className="mm-student-thread__composer"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSend(thread.id);
            }}
          >
            <input
              type="text"
              value={reply}
              onChange={(e) => onReplyChange(e.target.value)}
              placeholder="Reply to your mentor…"
              className="mm-student-thread__input"
              onClick={(e) => e.stopPropagation()}
            />
            <button type="submit" className="mm-student-thread__send" aria-label="Send reply">
              <Send size={16} aria-hidden />
            </button>
          </form>
        </motion.div>
      )}
    </article>
  );
}

function HelpModal({ open, onClose }) {
  const reduceMotion = useReducedMotion();
  const [concern, setConcern] = useState('');
  const [sent, setSent] = useState(false);

  const handleClose = () => {
    setSent(false);
    setConcern('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="mm-student-help-backdrop"
            aria-label="Close help dialog"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-modal-title"
            className="mm-student-help-modal"
            initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.99 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <button type="button" className="mm-student-help-modal__close" onClick={handleClose} aria-label="Close">
              <X size={18} />
            </button>
            <h2 id="help-modal-title" className="mm-student-help-modal__title">
              Help & concerns
            </h2>
            <p className="mm-student-help-modal__sub">
              Questions about sessions, scheduling, or your plan? We&apos;re here.
            </p>

            <div className="mm-student-help-faq">
              {HELP_ITEMS.map((item) => (
                <details key={item.q} className="mm-student-help-faq__item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>

            {!sent ? (
              <form
                className="mm-student-help-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!concern.trim()) return;
                  setSent(true);
                }}
              >
                <label htmlFor="student-concern" className="mm-student-help-form__label">
                  Share a concern or question
                </label>
                <textarea
                  id="student-concern"
                  rows={3}
                  value={concern}
                  onChange={(e) => setConcern(e.target.value)}
                  placeholder="e.g. Need to reschedule Mock #3, or confused about placement drive prep…"
                  className="mm-student-help-form__input"
                />
                <button type="submit" className="mm-student-help-form__submit">
                  Submit concern
                </button>
              </form>
            ) : (
              <div className="mm-student-help-success">
                <Sparkles size={20} aria-hidden />
                <p>Got it — your mentor team will respond within 24 hours in your feedback threads.</p>
              </div>
            )}

            <Link to="/contact" className="mm-student-help-modal__contact" onClick={handleClose}>
              Contact support →
            </Link>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState({});
  const [threads, setThreads] = useState(FEEDBACK_THREADS);
  const [activeThread, setActiveThread] = useState(FEEDBACK_THREADS[0].id);
  const [replyDraft, setReplyDraft] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);

  const selectThread = (id) => {
    setActiveThread(id);
    setReplyDraft('');
  };

  useEffect(() => {
    const session = getStudentSession();
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }
    setProfile(session);
    setProgress(getStudentProgress());
  }, [navigate]);

  const handleLogout = () => {
    clearStudentSession();
    navigate('/login');
  };

  const handleMarkComplete = (benefitId) => {
    setProgress((prev) => {
      const benefit = STUDENT_BENEFITS.find((b) => b.id === benefitId);
      if (!benefit) return prev;
      const current = prev[benefitId] ?? 0;
      if (current >= benefit.total) return prev;
      const next = { ...prev, [benefitId]: current + 1 };
      saveStudentProgress(next);
      return next;
    });
  };

  const handleSendReply = (threadId) => {
    const text = replyDraft.trim();
    if (!text) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              lastActive: 'Just now',
              messages: [
                ...t.messages,
                {
                  id: `s-${Date.now()}`,
                  role: 'student',
                  text,
                  time: 'Just now',
                },
              ],
            }
          : t,
      ),
    );
    setReplyDraft('');
  };

  if (!profile) {
    return (
      <RoutePageShell className="mm-student-dashboard-root">
        <div className="mm-student-loading">Loading your dashboard…</div>
      </RoutePageShell>
    );
  }

  const totalSessions = STUDENT_BENEFITS.reduce((sum, b) => sum + b.total, 0);
  const completedSessions = STUDENT_BENEFITS.reduce(
    (sum, b) => sum + Math.min(progress[b.id] ?? 0, b.total),
    0,
  );
  const overallPct = Math.round((completedSessions / totalSessions) * 100);

  return (
    <RoutePageShell scope="inner" className="mm-student-dashboard-root">
      <div className="mm-student-dashboard">
        <div className="mm-student-dashboard__mesh" aria-hidden />

        <div className="mm-container mm-student-dashboard__inner">
          <motion.header
            className="mm-student-profile"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="mm-student-profile__main">
              <span className="mm-student-profile__avatar" aria-hidden>
                {profile.name.charAt(0)}
              </span>
              <div>
                <p className="mm-student-profile__eyebrow">
                  <GraduationCap size={14} aria-hidden />
                  Student portal
                </p>
                <h1 className="mm-student-profile__name">{profile.name}</h1>
                <p className="mm-student-profile__meta">
                  ID {profile.studentId} · {profile.batch} · Target: {profile.targetRole}
                </p>
                <p className="mm-student-profile__mentor">
                  Mentor: <strong>{profile.mentor}</strong>
                </p>
              </div>
            </div>

            <div className="mm-student-profile__actions">
              <button type="button" className="mm-student-help-btn" onClick={() => setHelpOpen(true)}>
                <HelpCircle size={18} aria-hidden />
                Help & concerns
              </button>
              <button type="button" className="mm-student-logout-btn" onClick={handleLogout}>
                <LogOut size={16} aria-hidden />
                Logout
              </button>
            </div>

            <div className="mm-student-profile__progress">
              <div className="mm-student-profile__ring-wrap">
                <ProgressRing pct={overallPct} />
                <span className="mm-student-profile__ring-label">{overallPct}%</span>
              </div>
              <div>
                <p className="mm-student-profile__progress-title">Plan progress</p>
                <p className="mm-student-profile__progress-sub">
                  {completedSessions} of {totalSessions} sessions completed
                </p>
              </div>
            </div>
          </motion.header>

          <section className="mm-student-section" aria-labelledby="benefits-heading">
            <div className="mm-student-section__head">
              <h2 id="benefits-heading" className="mm-student-section__title">
                Your mentorship plan
              </h2>
              <p className="mm-student-section__sub">
                Track every session — 1:1 mentorship, mocks, doubt clearing, and placement drive prep.
              </p>
            </div>
            <div className="mm-student-benefits-grid">
              {STUDENT_BENEFITS.map((benefit) => (
                <BenefitCard
                  key={benefit.id}
                  benefit={benefit}
                  completed={progress[benefit.id] ?? 0}
                  onMarkComplete={handleMarkComplete}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
          </section>

          <section className="mm-student-section" aria-labelledby="feedback-heading">
            <div className="mm-student-section__head mm-student-section__head--row">
              <div>
                <h2 id="feedback-heading" className="mm-student-section__title">
                  <MessageSquare size={20} aria-hidden />
                  Mentor feedback threads
                </h2>
                <p className="mm-student-section__sub">
                  Interactive threads — you and your mentor (or AI) in ongoing conversation.
                </p>
              </div>
              <button type="button" className="mm-student-help-btn mm-student-help-btn--compact" onClick={() => setHelpOpen(true)}>
                <HelpCircle size={16} aria-hidden />
                Questions?
              </button>
            </div>
            <div className="mm-student-threads">
              {threads.map((thread) => (
                <FeedbackThread
                  key={thread.id}
                  thread={thread}
                  active={activeThread === thread.id}
                  onSelect={selectThread}
                  reply={replyDraft}
                  onReplyChange={setReplyDraft}
                  onSend={handleSendReply}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
          </section>

          <motion.aside
            className="mm-student-cta-strip"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45, ease: EASE }}
          >
            <div>
              <p className="mm-student-cta-strip__title">AI mentor — 24×7, one click</p>
              <p className="mm-student-cta-strip__sub">
                Practice HR, technical, and communication anytime. Instant feedback between live sessions.
              </p>
            </div>
            <Link to="/mock-interviews" className="mm-student-cta-strip__link">
              Start AI mock
              <ChevronRight size={16} aria-hidden />
            </Link>
          </motion.aside>
        </div>
      </div>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </RoutePageShell>
  );
}
