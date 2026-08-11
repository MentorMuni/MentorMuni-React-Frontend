import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Plus } from 'lucide-react';
import { useStudentShell } from '../shellContext';
import { enterProps } from '../motion';
import { whiteboardApi } from '../whiteboardApi';
import MorningDrop from '../components/whiteboard/MorningDrop';
import StickyNote from '../components/whiteboard/StickyNote';
import NoteComposer from '../components/whiteboard/NoteComposer';
import WhiteboardScrollCues from '../components/whiteboard/WhiteboardScrollCues';
import '../styles/whiteboard.css';

function mergeNote(notes, next) {
  const rest = notes.filter((item) => item.id !== next.id);
  return [...rest, next];
}

export default function StudentWhiteboardPage() {
  const { session } = useStudentShell();
  const reduce = useReducedMotion();
  const boardRef = useRef(null);
  const wallRef = useRef(null);
  const [board, setBoard] = useState(null);
  const [error, setError] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState('');
  const [showSolved, setShowSolved] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [historyDrop, setHistoryDrop] = useState(null);
  const [dropBusy, setDropBusy] = useState(false);
  const fabRef = useRef(null);

  const loadBoard = useCallback(async () => {
    const next = await whiteboardApi.getBoard(session);
    setBoard(next);
    setSelectedDate((current) => current || next.today);
    return next;
  }, [session]);

  useEffect(() => {
    let cancelled = false;
    setError('');
    loadBoard().catch((err) => {
      if (!cancelled) setError(err?.message || 'Could not open the White Board.');
    });
    return () => {
      cancelled = true;
    };
  }, [loadBoard]);

  useEffect(() => {
    if (!board?.generating) return undefined;
    let ticks = 0;
    const timer = setInterval(async () => {
      ticks += 1;
      try {
        const next = await whiteboardApi.getBoard(session, { silent: true });
        setBoard(next);
        if (!next.generating || ticks >= 24) clearInterval(timer);
      } catch {
        if (ticks >= 8) clearInterval(timer);
      }
    }, 2500);
    return () => clearInterval(timer);
  }, [board?.generating, session]);

  async function handleSelectDate(date) {
    setSelectedDate(date);
    if (!board) return;
    if (date === board.today) {
      setHistoryDrop(null);
      setDropBusy(false);
      return;
    }
    setHistoryDrop(null);
    setDropBusy(true);
    try {
      const drop = await whiteboardApi.getMentorship(session, date);
      setHistoryDrop(drop);
    } catch (err) {
      setError(err?.message || 'Could not open that morning drop.');
    } finally {
      setDropBusy(false);
    }
  }

  async function handleCreate(payload) {
    try {
      const note = await whiteboardApi.createNote(session, payload);
      setBoard((prev) =>
        prev
          ? {
              ...prev,
              notes: [...(prev.notes || []), note],
              open_note_count: (prev.open_note_count || 0) + 1,
            }
          : prev,
      );
    } catch (err) {
      setError(err?.message || 'Could not stick that note.');
      throw err;
    }
  }

  async function handleMove(noteId, patch) {
    setBoard((prev) => {
      if (!prev) return prev;
      const current = prev.notes.find((item) => item.id === noteId);
      if (!current) return prev;
      return { ...prev, notes: mergeNote(prev.notes, { ...current, ...patch }) };
    });
    try {
      const next = await whiteboardApi.updateNote(session, noteId, patch);
      setBoard((prev) => (prev ? { ...prev, notes: mergeNote(prev.notes, next) } : prev));
    } catch {
      /* keep optimistic pin */
    }
  }

  async function handlePeel(note) {
    try {
      const next = await whiteboardApi.resolveNote(session, note.id);
      setBoard((prev) =>
        prev
          ? {
              ...prev,
              notes: mergeNote(prev.notes, next),
              open_note_count: Math.max(0, (prev.open_note_count || 1) - 1),
            }
          : prev,
      );
      if (!reduce) {
        confetti({
          particleCount: 72,
          spread: 68,
          origin: { y: 0.72 },
          colors: ['#ffe56a', '#ff9ecf', '#7dffc3', '#cbb6ff', '#7ecbff'],
        });
      }
      return true;
    } catch (err) {
      setError(err?.message || 'Could not peel that note.');
      return false;
    }
  }

  async function handleReopen(note) {
    try {
      const next = await whiteboardApi.reopenNote(session, note.id);
      setBoard((prev) =>
        prev
          ? {
              ...prev,
              notes: mergeNote(prev.notes, next),
              open_note_count: (prev.open_note_count || 0) + 1,
            }
          : prev,
      );
    } catch (err) {
      setError(err?.message || 'Could not put that note back.');
    }
  }

  async function saveEdit() {
    if (!editing) return;
    const text = draft.trim();
    if (!text) return;
    try {
      const next = await whiteboardApi.updateNote(session, editing.id, { body: text });
      setBoard((prev) => (prev ? { ...prev, notes: mergeNote(prev.notes, next) } : prev));
      setEditing(null);
    } catch (err) {
      setError(err?.message || 'Could not update that note.');
    }
  }

  const openNotes = useMemo(
    () => (board?.notes || []).filter((note) => note.status === 'OPEN'),
    [board],
  );
  const solvedNotes = useMemo(
    () => (board?.notes || []).filter((note) => note.status === 'RESOLVED'),
    [board],
  );
  const boardHeight = useMemo(() => {
    if (!openNotes.length) return 560;
    const maxY = Math.max(...openNotes.map((note) => Number(note.pin_y) || 0));
    return Math.max(560, Math.round((maxY / 100) * 560 + 240));
  }, [openNotes]);

  const selectedDrop =
    selectedDate && board && selectedDate !== board.today
      ? historyDrop
      : board?.today_mentorship || null;
  const sheetOpen = composerOpen || Boolean(editing);

  useEffect(() => {
    if (!editing) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setEditing(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [editing]);

  return (
    <main className={`stu-main wb-page${sheetOpen ? ' is-sheet' : ''}`}>
      <motion.header className="wb-hero" {...enterProps(reduce)}>
        <p className="wb-hero__kicker">your wall · not a ticket</p>
        <h1 className="wb-hero__title">White Board</h1>
        <svg className="wb-hero__scribble" viewBox="0 0 280 14" aria-hidden>
          <path
            d="M2 9 C 40 2, 80 13, 120 7 S 200 2, 278 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <p className="wb-hero__sub">Write your issues, problems and what you want here</p>
      </motion.header>

      {error ? <p className="wb-alert">{error}</p> : null}

      {!board && !error ? (
        <section className="wb-drop">
          <div className="wb-drop__brew">
            <strong>Opening your wall…</strong>
            <p>Checking yesterday’s notes for this morning’s drop.</p>
          </div>
        </section>
      ) : null}

      {board ? (
        <>
          <MorningDrop
            reduce={reduce}
            today={board.today}
            generating={Boolean(board.generating)}
            selectedDate={selectedDate || board.today}
            mentorships={board.mentorships || []}
            drop={selectedDrop}
            dropBusy={dropBusy}
            onSelectDate={handleSelectDate}
          />

          <section ref={wallRef} className="wb-wall-wrap">
            <div className="wb-wall-head">
              <h2>The wall</h2>
              <p>
                {openNotes.length} open · yesterday {board.yesterday_note_count || 0} notes feed tomorrow’s drop
              </p>
            </div>

            <div ref={boardRef} className="wb-wall" style={{ minHeight: boardHeight }}>
              <div className="wb-wall__grid" aria-hidden />
              <div className="wb-wall__grain" aria-hidden />
              {!openNotes.length ? (
                <div className="wb-wall__empty">
                  <h3>This wall wants your actual mess.</h3>
                  <p>Slap the thing you are stuck on. Tomorrow morning I will tell you the exact move that peels it.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {openNotes.map((note) => (
                    <StickyNote
                      key={note.id}
                      note={note}
                      reduce={reduce}
                      boardRef={boardRef}
                      open={editing?.id === note.id}
                      onOpen={(item) => {
                        setEditing(item);
                        setDraft(item.body);
                      }}
                      onMove={handleMove}
                      onPeel={handlePeel}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </section>

          {solvedNotes.length ? (
            <div className="wb-solved">
              <button type="button" className="wb-solved__toggle" onClick={() => setShowSolved((v) => !v)}>
                {showSolved ? 'Hide' : 'Show'} peeled notes ({solvedNotes.length})
              </button>
              {showSolved ? (
                <div className="wb-solved__list">
                  {solvedNotes.map((note) => (
                    <div key={note.id} className="wb-solved__chip">
                      <span>{note.body}</span>
                      <button type="button" onClick={() => handleReopen(note)}>
                        Unpeel
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          <button
            ref={fabRef}
            type="button"
            className="wb-fab"
            aria-expanded={composerOpen}
            onClick={() => setComposerOpen(true)}
          >
            <Plus size={18} strokeWidth={2.6} aria-hidden />
            Slap a note
          </button>
        </>
      ) : null}

      <WhiteboardScrollCues wallRef={wallRef} hidden={sheetOpen || !board} />

      <NoteComposer
        open={composerOpen}
        reduce={reduce}
        onClose={() => {
          setComposerOpen(false);
          fabRef.current?.focus();
        }}
        onSubmit={handleCreate}
      />

      <AnimatePresence>
        {editing ? (
          <motion.div
            className="wb-editor"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            onClick={() => setEditing(null)}
          >
            <motion.div
              className={`wb-editor__card wb-note--${editing.color || 'canary'}`}
              role="dialog"
              aria-modal="true"
              aria-label="Edit sticky"
              initial={reduce ? false : { scale: 0.92, rotate: -4 }}
              animate={{ scale: 1, rotate: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <textarea value={draft} maxLength={600} onChange={(event) => setDraft(event.target.value)} />
              <div className="wb-editor__actions">
                <button
                  type="button"
                  className="wb-editor__peel"
                  onClick={async () => {
                    const ok = await handlePeel(editing);
                    if (ok) setEditing(null);
                  }}
                >
                  Peel — it’s done
                </button>
                <button type="button" className="wb-editor__save" onClick={saveEdit}>
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
