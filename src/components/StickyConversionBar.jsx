import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { goToStartAssessment } from "../utils/startAssessmentNavigation";
import {
  PRIMARY_CTA_LABEL,
  WAITLIST_STICKY_TEASER,
} from "../constants/brandCopy";

/** Full-screen flows — no competing bottom bar */
const HIDE_STICKY_PATHS = new Set([
  "/start-assessment",
  "/readiness",
  "/interview-ready",
  "/result",
  "/dashboard",
  "/design-system",
  "/career-health",
  "/dashboard/health",
  "/roadmap",
]);

const STORAGE_KEY = "mm-sticky-cta-dismissed-session";

export default function StickyConversionBar() {
  const { pathname } = useLocation();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [wide, setWide] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
  );

  const showRoute = !HIDE_STICKY_PATHS.has(pathname);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const fn = () => setWide(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useEffect(() => {
    const applyPad = showRoute && !dismissed && !wide;
    document.body.style.paddingBottom = applyPad ? "5.25rem" : "";
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [showRoute, dismissed, wide]);

  if (!showRoute || dismissed || wide) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[85] border-t border-border bg-white/95 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      role="region"
      aria-label="Quick actions"
    >
      <div className="mx-auto flex max-w-lg items-stretch gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={goToStartAssessment}
          className="mm-focus flex min-h-[48px] min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,149,0,0.3)] transition-all hover:bg-[#E88600] active:scale-[0.98]"
        >
          {PRIMARY_CTA_LABEL}
        </button>
        <Link
          to="/waitlist"
          className="mm-focus flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center rounded-xl border-2 border-[#1A8FC4] bg-background px-2 py-1.5 text-center text-[11px] font-bold leading-tight text-[#15799F] transition-colors hover:bg-accent-soft active:scale-[0.98]"
        >
          <span>Join waitlist</span>
          <span className="text-[9px] font-semibold text-muted-foreground">{WAITLIST_STICKY_TEASER}</span>
        </Link>
        <button
          type="button"
          aria-label="Dismiss quick actions"
          onClick={() => {
            setDismissed(true);
            try {
              sessionStorage.setItem(STORAGE_KEY, "1");
            } catch {
              /* ignore */
            }
          }}
          className="mm-focus flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground transition hover:bg-secondary"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
