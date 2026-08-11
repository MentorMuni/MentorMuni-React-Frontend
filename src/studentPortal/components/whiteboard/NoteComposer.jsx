import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const COLORS = ['canary', 'pink', 'mint', 'lilac', 'peach', 'sky', 'coral', 'butter'];

export default function NoteComposer({ open, reduce, onClose, onSubmit }) {
  const [body, setBody] = useState('');
  const [color, setColor] = useState('canary');
  const [busy, setBusy] = useState(false);
  const titleId = useId();
  const fieldRef = useRef(null);

  useEffect(() => {
    if (open) {
      setBody('');
      setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
      setBusy(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const timer = window.setTimeout(() => fieldRef.current?.focus(), 30);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  async function submit(event) {
    event.preventDefault();
    const text = body.trim();
    if (!text || busy) return;
    setBusy(true);
    try {
      await onSubmit({ body: text, color });
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="wb-composer"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          onClick={onClose}
        >
          <motion.form
            className="wb-composer__card"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduce ? false : { y: 40 }}
            animate={{ y: 0 }}
            exit={reduce ? undefined : { y: 30 }}
            onClick={(event) => event.stopPropagation()}
            onSubmit={submit}
          >
            <div className="wb-composer__head">
              <h3 id={titleId}>Slap a note</h3>
              <button type="button" className="wb-composer__close" onClick={onClose} aria-label="Close">
                <X size={18} strokeWidth={2.4} aria-hidden />
              </button>
            </div>
            <p>The actual problem. What “fixed” looks like tonight. No essays.</p>
            <textarea
              ref={fieldRef}
              className={`wb-note--${color}`}
              value={body}
              maxLength={600}
              placeholder="e.g. Arrays freeze me — 2 easy problems submitted without a video"
              onChange={(event) => setBody(event.target.value)}
            />
            <div className="wb-swatches" role="group" aria-label="Note color">
              {COLORS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`wb-swatch wb-swatch--${item}${item === color ? ' is-on' : ''}`}
                  aria-label={item}
                  aria-pressed={item === color}
                  onClick={() => setColor(item)}
                />
              ))}
            </div>
            <div className="wb-composer__row">
              <span className="wb-composer__count">{body.length}/600</span>
              <button type="submit" className="wb-btn" disabled={!body.trim() || busy}>
                {busy ? 'Sticking…' : 'Stick it'}
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
