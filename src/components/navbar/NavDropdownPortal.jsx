import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const MENU_Z = 10000;

/**
 * Renders nav flyouts on document.body so header overflow/containment cannot clip them.
 */
export default function NavDropdownPortal({
  open,
  anchorRef,
  panelRef,
  align = 'left',
  className = '',
  children,
}) {
  const [style, setStyle] = useState(null);

  useEffect(() => {
    if (!open || !anchorRef?.current) {
      setStyle(null);
      return undefined;
    }

    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const gap = 8;
      const next = {
        position: 'fixed',
        top: rect.bottom + gap,
        zIndex: MENU_Z,
      };
      if (align === 'right') {
        next.right = Math.max(16, window.innerWidth - rect.right);
        next.left = 'auto';
      } else {
        next.left = Math.max(16, rect.left);
        next.right = 'auto';
      }
      setStyle(next);
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchorRef, align]);

  if (!open || !style) return null;

  return createPortal(
    <div ref={panelRef} className={`mm-nav-dropdown-portal ${className}`.trim()} style={style} role="menu">
      {children}
    </div>,
    document.body,
  );
}
