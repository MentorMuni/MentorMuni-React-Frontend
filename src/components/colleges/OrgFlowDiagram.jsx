/**
 * OrgFlowDiagram — "one system, four views", drawn.
 *
 * Replaces the cropped live-dashboard embed that used to sit in the hero.
 * That embed rendered the student readiness component at roughly a third of
 * its design width, so its two-column layout collapsed and the summary text
 * wrapped one or two words per line — it read as a broken screenshot.
 *
 * The roles and their scopes here are not marketing invention; they mirror
 * organizationPortal/roles.js:
 *   TPO     canMutateCampus        — campus-wide
 *   HOD     canManageBranch        — department-scoped
 *   VIEWER  canViewAnalytics only  — read-only, exports
 *   STUDENT the student portal
 *
 * The point the drawing has to make is that this is a LOOP, not a hand-off:
 * assignments travel down, evidence travels back up. That is what "one
 * system" actually means, and it is the thing a flat list of portals fails
 * to say. Hence exactly two colours — one per direction — and neutral cards,
 * rather than a different hue per role.
 *
 * SVG rather than a raster asset: it stays crisp, weighs nothing, inherits
 * the band's own tokens in both themes, and cannot 404.
 */

const ROLES = [
  {
    id: 'tpo',
    name: 'TPO',
    scope: 'Campus-wide',
    caps: 'Roster & departments · assign to any batch · announce drives',
  },
  {
    id: 'hod',
    name: 'HOD',
    scope: 'One department',
    caps: 'Branch readiness · at-risk students · targeted practice',
  },
  {
    id: 'student',
    name: 'Student',
    scope: 'Does the work',
    caps: 'Readiness score · AI mocks · coding rounds · 90-day plan',
  },
];

/** Card geometry, kept here so the connector maths below stays readable. */
const CARD_X = 40;
const CARD_W = 480;
const CARD_H = 96;
const CARD_Y = [64, 224, 384];
const GAP_MID = [192, 352];

function RoleCard({ role, y, index }) {
  return (
    <g>
      <rect
        x={CARD_X}
        y={y}
        width={CARD_W}
        height={CARD_H}
        rx="16"
        className="mmc-flow__card"
      />
      <circle cx={CARD_X + 28} cy={y + 34} r="5" className="mmc-flow__dot" />
      <text x={CARD_X + 46} y={y + 39} className="mmc-flow__name">
        {role.name}
      </text>
      <text
        x={CARD_X + CARD_W - 22}
        y={y + 38}
        textAnchor="end"
        className="mmc-flow__scope"
      >
        {role.scope}
      </text>
      <text x={CARD_X + 26} y={y + 68} className="mmc-flow__caps">
        {role.caps}
      </text>
      <text x={CARD_X + CARD_W - 22} y={y + 68} textAnchor="end" className="mmc-flow__idx">
        {`0${index + 1}`}
      </text>
    </g>
  );
}

/** One connector gap: assignments down the left, evidence back up the right. */
function Connector({ mid, withLabels }) {
  const top = mid - 26;
  const bottom = mid + 26;

  return (
    <g>
      {/* down — assignments */}
      <line x1="150" y1={top} x2="150" y2={bottom - 7} className="mmc-flow__down" />
      <polygon points={`150,${bottom} 145.5,${bottom - 8} 154.5,${bottom - 8}`} className="mmc-flow__down-head" />

      {/* up — evidence */}
      <line x1="410" y1={bottom} x2="410" y2={top + 7} className="mmc-flow__up" />
      <polygon points={`410,${top} 405.5,${top + 8} 414.5,${top + 8}`} className="mmc-flow__up-head" />

      {withLabels ? (
        <>
          <text x="162" y={mid + 4} className="mmc-flow__flow mmc-flow__flow--down">
            assign · notify
          </text>
          <text x="398" y={mid + 4} textAnchor="end" className="mmc-flow__flow mmc-flow__flow--up">
            scores · readiness
          </text>
        </>
      ) : null}
    </g>
  );
}

export default function OrgFlowDiagram() {
  return (
    <figure className="mmc-flow">
      <svg
        viewBox="0 0 560 600"
        role="img"
        aria-labelledby="mmc-flow-t mmc-flow-d"
        className="mmc-flow__svg"
      >
        <title id="mmc-flow-t">
          How MentorMuni connects a campus
        </title>
        <desc id="mmc-flow-d">
          Assignments flow down from the TPO across the whole campus, to the HOD
          within one department, to each student. Scores and readiness flow back
          up the same path, and feed a read-only principal view with NAAC and NBA
          export.
        </desc>

        <text x="40" y="34" className="mmc-flow__title">
          ONE SYSTEM · FOUR VIEWS
        </text>

        {ROLES.map((role, i) => (
          <RoleCard key={role.id} role={role} y={CARD_Y[i]} index={i} />
        ))}

        <Connector mid={GAP_MID[0]} withLabels />
        <Connector mid={GAP_MID[1]} />

        {/* The read-only view hangs off the returning evidence, not the
            assignment chain — a principal consumes, never assigns. */}
        <line x1="410" y1="480" x2="410" y2="516" className="mmc-flow__up" />
        <rect
          x={CARD_X}
          y="508"
          width={CARD_W}
          height="60"
          rx="14"
          className="mmc-flow__card mmc-flow__card--muted"
        />
        <circle cx={CARD_X + 28} cy="538" r="5" className="mmc-flow__dot mmc-flow__dot--muted" />
        <text x={CARD_X + 46} y="543" className="mmc-flow__name mmc-flow__name--sm">
          Principal
        </text>
        <text
          x={CARD_X + CARD_W - 22}
          y="543"
          textAnchor="end"
          className="mmc-flow__caps"
        >
          Read-only · NAAC &amp; NBA export
        </text>
      </svg>
    </figure>
  );
}
