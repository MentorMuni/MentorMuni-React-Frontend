import { Maximize2 } from 'lucide-react';
import { ChartCard } from './AnalyticsCharts';

/**
 * Chart wrapper for HOD — expand to full analysis with student list.
 */
export default function DrillableChartCard({
  title,
  meta,
  tall,
  drillable = true,
  onDrillDown,
  children,
}) {
  return (
    <ChartCard title={title} meta={meta} tall={tall}>
      <div className={drillable ? 'mm-org-chart-drillable' : ''}>
        {children}
        {drillable && onDrillDown ? (
          <button type="button" className="mm-org-chart-drillable__btn" onClick={onDrillDown}>
            <Maximize2 size={14} aria-hidden />
            Expand &amp; see students
          </button>
        ) : null}
      </div>
    </ChartCard>
  );
}
