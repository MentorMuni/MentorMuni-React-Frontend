import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { formatNoteDate } from '../../whiteboardDates';

export default function StickyNote({
  note,
  reduce,
  boardRef,
  open,
  onOpen,
  onMove,
  onPeel,
}) {
  const color = note.color || 'canary';
  const dragged = useRef(false);
  const [canDrag, setCanDrag] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 721px)');
    const apply = () => setCanDrag(media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  function handleDragEnd(_event, info) {
    const board = boardRef?.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nextX = Math.min(82, Math.max(0, note.pin_x + (info.offset.x / rect.width) * 100));
    const nextY = Math.min(78, Math.max(0, note.pin_y + (info.offset.y / rect.height) * 100));
    onMove(note.id, { pin_x: nextX, pin_y: nextY });
  }

  return (
    <motion.article
      layout={!reduce}
      className={`wb-note wb-note--${color}${open ? ' is-open' : ''}`}
      style={{ left: `${note.pin_x}%`, top: `${note.pin_y}%` }}
      initial={reduce ? false : { scale: 0.84, opacity: 0, rotate: (canDrag ? note.rotation : 0) - 8 }}
      animate={{ scale: 1, opacity: 1, rotate: canDrag ? note.rotation : 0 }}
      exit={reduce ? undefined : { opacity: 0, y: 40, rotate: 18, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      drag={!reduce && canDrag}
      dragMomentum={false}
      dragConstraints={boardRef}
      dragElastic={0.12}
      onDrag={() => {
        dragged.current = true;
      }}
      onDragEnd={handleDragEnd}
      whileDrag={reduce ? undefined : { scale: 1.06, zIndex: 9, cursor: 'grabbing' }}
    >
      <span className="wb-note__pin" aria-hidden />
      <button
        type="button"
        className="wb-note__hit"
        aria-label="Edit sticky"
        onClick={() => {
          if (dragged.current) {
            dragged.current = false;
            return;
          }
          onOpen(note);
        }}
      >
        <span className="wb-note__body">{note.body}</span>
        <span className="wb-note__meta">{formatNoteDate(note.board_date)}</span>
      </button>
      <button type="button" className="wb-note__peel" onClick={() => onPeel(note)}>
        Peel
      </button>
    </motion.article>
  );
}
