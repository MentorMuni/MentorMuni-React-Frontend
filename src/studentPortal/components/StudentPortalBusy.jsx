/**
 * Neutral shell-level wait state for any studentApi call.
 * Fear → Fearless keeps its own branded overlay on that flow only.
 */
export default function StudentPortalBusy() {
  return (
    <div className="stu-busy" role="status" aria-live="polite" aria-busy="true">
      <div className="stu-busy__card">
        <span className="stu-busy__spinner" aria-hidden />
        <p className="stu-busy__title">Loading…</p>
        <p className="stu-busy__sub">Getting your page ready</p>
      </div>
    </div>
  );
}
