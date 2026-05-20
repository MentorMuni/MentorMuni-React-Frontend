/**
 * Performance Monitoring & Logging
 * Tracks API response times and helps identify bottlenecks
 * 
 * Usage:
 *   const monitor = new PerformanceMonitor('interview_readiness');
 *   monitor.start();
 *   // ... API call ...
 *   monitor.end({ status: 200, cached: false });
 */

class PerformanceMonitor {
  constructor(label) {
    this.label = label;
    this.startTime = null;
    this.marks = [];
    this.metrics = {
      duration_ms: 0,
      status: null,
      cached: false,
      error: null,
      percentile: null,
    };
  }

  start() {
    this.startTime = performance.now();
  }

  mark(name) {
    const elapsed = performance.now() - this.startTime;
    this.marks.push({ name, elapsed_ms: Math.round(elapsed) });
    if (import.meta.env.DEV) {
      console.log(`  [${name}] +${Math.round(elapsed - (this.marks[this.marks.length - 2]?.elapsed_ms || 0))}ms`);
    }
  }

  end(metadata = {}) {
    if (!this.startTime) {
      console.warn('[PERF] end() called without start()');
      return;
    }

    const duration = performance.now() - this.startTime;
    this.metrics = {
      duration_ms: Math.round(duration),
      label: this.label,
      ...metadata,
    };

    this.logMetrics();
    return this.metrics;
  }

  logMetrics() {
    const { duration_ms, status, cached, error } = this.metrics;
    const color = duration_ms < 500 ? '🟢' : duration_ms < 1000 ? '🟡' : '🔴';
    const cacheTag = cached ? '[CACHED]' : '';
    const errorTag = error ? `[ERROR: ${error}]` : '';

    console.log(
      `${color} [PERF] ${this.label} — ${duration_ms}ms ${cacheTag} ${errorTag}`
    );

    if (this.marks.length > 0 && import.meta.env.DEV) {
      console.table(this.marks);
    }

    // Send to analytics if available
    this.sendToAnalytics();
  }

  sendToAnalytics() {
    const { duration_ms, status, cached, error, label } = this.metrics;

    if (typeof window === 'undefined') return;

    // Segment.io / Mixpanel
    if (window.analytics?.track) {
      try {
        window.analytics.track('api_performance', {
          endpoint: label,
          duration_ms,
          status_code: status,
          cached,
          has_error: !!error,
          error_message: error,
        });
      } catch (e) {
        // Silently fail
      }
    }

    // Google Analytics
    if (window.gtag) {
      try {
        window.gtag('event', 'api_call', {
          event_category: 'performance',
          event_label: label,
          value: duration_ms,
          cached: cached ? 1 : 0,
        });
      } catch (e) {
        // Silently fail
      }
    }
  }

  getPercentile() {
    // Simulate percentile calculation
    // In production, collect 100+ requests and calculate actual percentiles
    const { duration_ms } = this.metrics;
    if (duration_ms < 500) return 'P50';
    if (duration_ms < 1000) return 'P95';
    return 'P99';
  }

  static createBatch(label) {
    return new PerformanceMonitorBatch(label);
  }
}

/**
 * Batch monitoring for multiple operations
 */
class PerformanceMonitorBatch {
  constructor(label) {
    this.label = label;
    this.monitors = [];
    this.startTime = performance.now();
  }

  createMonitor(name) {
    const monitor = new PerformanceMonitor(`${this.label}/${name}`);
    monitor.start();
    this.monitors.push(monitor);
    return monitor;
  }

  endAll() {
    const results = this.monitors.map((m) => {
      m.end();
      return m.metrics;
    });

    const totalDuration = performance.now() - this.startTime;
    console.log(
      `[BATCH] ${this.label} completed in ${Math.round(totalDuration)}ms (${results.length} items)`
    );

    return {
      total_duration_ms: Math.round(totalDuration),
      items: results,
    };
  }
}

/**
 * Global performance tracker for the entire assessment
 */
class AssessmentPerformanceTracker {
  constructor(assessmentId) {
    this.assessmentId = assessmentId;
    this.events = [];
    this.startTime = performance.now();
    this.stepMetrics = {};
  }

  logStep(stepName, metadata = {}) {
    const timestamp = performance.now() - this.startTime;
    this.events.push({
      step: stepName,
      timestamp_ms: Math.round(timestamp),
      ...metadata,
    });

    if (import.meta.env.DEV) {
      console.log(`[STEP] ${stepName} at ${Math.round(timestamp)}ms`);
    }
  }

  logApiCall(endpoint, duration_ms, status, cached) {
    this.logStep('api_call', {
      endpoint,
      duration_ms,
      status,
      cached,
    });

    if (!this.stepMetrics[endpoint]) {
      this.stepMetrics[endpoint] = [];
    }
    this.stepMetrics[endpoint].push({ duration_ms, status, cached });
  }

  getReport() {
    const totalDuration = performance.now() - this.startTime;
    const apiCalls = this.events.filter((e) => e.step === 'api_call');
    const avgApiDuration = apiCalls.length > 0
      ? apiCalls.reduce((sum, e) => sum + e.duration_ms, 0) / apiCalls.length
      : 0;

    return {
      assessment_id: this.assessmentId,
      total_duration_ms: Math.round(totalDuration),
      api_calls: apiCalls.length,
      avg_api_duration_ms: Math.round(avgApiDuration),
      events: this.events,
      step_metrics: this.stepMetrics,
    };
  }

  sendToAnalytics() {
    const report = this.getReport();

    if (window.analytics?.track) {
      try {
        window.analytics.track('assessment_completed', report);
      } catch (e) {
        // Silently fail
      }
    }
  }
}

/**
 * Performance budgets - warn if operations exceed thresholds
 */
const PERFORMANCE_BUDGETS = {
  'interview_readiness_plan': { max_ms: 1200, target_ms: 800 },
  'skill_readiness_plan': { max_ms: 1200, target_ms: 800 },
  'aptitude_readiness_plan': { max_ms: 1200, target_ms: 800 },
  'evaluate': { max_ms: 500, target_ms: 300 },
};

function checkPerformanceBudget(label, duration_ms) {
  const budget = PERFORMANCE_BUDGETS[label];
  if (!budget) return;

  if (duration_ms > budget.max_ms) {
    console.warn(
      `⚠️  [BUDGET EXCEEDED] ${label} took ${duration_ms}ms (max: ${budget.max_ms}ms)`
    );
  } else if (duration_ms > budget.target_ms) {
    console.warn(
      `⚠️  [BUDGET EXCEEDED] ${label} took ${duration_ms}ms (target: ${budget.target_ms}ms)`
    );
  } else {
    console.log(
      `✅ [BUDGET OK] ${label} took ${duration_ms}ms (target: ${budget.target_ms}ms)`
    );
  }
}

/**
 * React Hook for performance monitoring
 */
import { useEffect, useRef } from 'react';

export function usePerformanceMonitor(label) {
  const monitorRef = useRef(null);

  useEffect(() => {
    monitorRef.current = new PerformanceMonitor(label);
    monitorRef.current.start();

    return () => {
      if (monitorRef.current) {
        monitorRef.current.end();
      }
    };
  }, [label]);

  return {
    monitor: monitorRef.current,
    mark: (name) => monitorRef.current?.mark(name),
    end: (metadata) => monitorRef.current?.end(metadata),
  };
}

export {
  PerformanceMonitor,
  PerformanceMonitorBatch,
  AssessmentPerformanceTracker,
  checkPerformanceBudget,
  PERFORMANCE_BUDGETS,
};
