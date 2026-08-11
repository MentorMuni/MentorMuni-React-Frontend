/**
 * In-flight API counter. Overlay shows only after a short delay so
 * fast requests never flash a full-screen wait.
 */

import { useEffect, useState } from 'react';

const SHOW_AFTER_MS = 400;
const MIN_VISIBLE_MS = 750;

export function createApiBusyTracker() {
  let count = 0;
  const listeners = new Set();

  function emit() {
    const busy = count > 0;
    listeners.forEach((fn) => fn(busy));
  }

  return {
    begin() {
      count += 1;
      emit();
    },
    end() {
      count = Math.max(0, count - 1);
      emit();
    },
    subscribe(fn) {
      listeners.add(fn);
      fn(count > 0);
      return () => listeners.delete(fn);
    },
  };
}

export const studentApiBusy = createApiBusyTracker();
export const orgApiBusy = createApiBusyTracker();

export function useApiBusy(tracker, { showAfterMs = SHOW_AFTER_MS, minVisibleMs = MIN_VISIBLE_MS } = {}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let showTimer = 0;
    let hideTimer = 0;
    let shownAt = 0;

    const unsub = tracker.subscribe((busy) => {
      if (busy) {
        if (hideTimer) {
          window.clearTimeout(hideTimer);
          hideTimer = 0;
        }
        if (!shownAt && !showTimer) {
          showTimer = window.setTimeout(() => {
            showTimer = 0;
            shownAt = Date.now();
            setVisible(true);
          }, showAfterMs);
        }
        return;
      }

      if (showTimer) {
        window.clearTimeout(showTimer);
        showTimer = 0;
      }
      if (!shownAt) return;

      const wait = Math.max(0, minVisibleMs - (Date.now() - shownAt));
      hideTimer = window.setTimeout(() => {
        hideTimer = 0;
        shownAt = 0;
        setVisible(false);
      }, wait);
    });

    return () => {
      unsub();
      if (showTimer) window.clearTimeout(showTimer);
      if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, [tracker, showAfterMs, minVisibleMs]);

  return visible;
}
