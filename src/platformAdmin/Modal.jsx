import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Centered responsive modal for Platform Admin.
 * Flex overlay centering avoids Framer Motion transform fighting CSS translate(-50%, -50%).
 */
export default function Modal({ open, title, sub, onClose, children, wide }) {
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  const root = document.querySelector('.mm-pa-root');
  const isLight = Boolean(root?.classList.contains('mm-pa-light'));

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="mm-pa-modal-root"
          className={`mm-pa-modal-layer ${isLight ? 'mm-pa-modal-layer--light' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="mm-pa-modal-backdrop"
            aria-label="Close dialog"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mm-pa-modal-title"
            className={`mm-pa-modal ${wide ? 'mm-pa-modal--wide' : ''}`}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mm-pa-modal__header">
              <div>
                <h2 id="mm-pa-modal-title" className="mm-pa-modal__title">
                  {title}
                </h2>
                {sub ? <p className="mm-pa-modal__sub">{sub}</p> : null}
              </div>
              <button
                type="button"
                className="mm-pa-btn mm-pa-btn--ghost !px-2 !py-2"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <div className="mm-pa-modal__body">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
