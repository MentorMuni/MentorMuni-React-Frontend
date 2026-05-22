/**
 * API Optimization Utilities
 * Implements streaming support and performance monitoring
 * for faster readiness assessment responses (target: 0.5-1.2s)
 * 
 * NOTE: Caching has been disabled per architecture decision.
 * All requests go directly to the backend.
 */

/**
 * Fetch without caching - all requests go directly to backend
 * Provides timeout, error handling, and performance monitoring
 */
export async function fetchWithDeduplication(
  endpoint,
  payload,
  options = {}
) {
  // Direct fetch without deduplication or caching
  return performFetch(endpoint, payload, options);
}

/**
 * Perform actual fetch with timeout and error handling
 */
async function performFetch(endpoint, payload, options = {}) {
  const {
    timeout = 3000,
    debug = false,
    allowCache = true,
    cacheKey = null,
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  const startTime = performance.now();

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const duration = performance.now() - startTime;

    if (debug) {
      console.log(`[API] ${endpoint} completed in ${duration.toFixed(0)}ms (status: ${response.status})`);
    }

    // Track performance metrics
    trackApiMetric(endpoint, duration, response.status, false);

    const data = await response.json();

    // Even if status is not OK, check if we got valid data
    // Some backends return 422 with valid data due to validation warnings
    if (!response.ok) {
      // If we have valid evaluation_plan data, treat it as success
      if (data?.evaluation_plan && Array.isArray(data.evaluation_plan) && data.evaluation_plan.length > 0) {
        if (debug) {
          console.warn(`[API] ${endpoint} returned ${response.status} but has valid data - treating as success`);
        }
        return { ok: true, data, status: response.status };
      }
      
      // Otherwise, throw the error
      const errorMsg = data?.detail || data?.error || data?.message || 'Unknown error';
      throw new Error(`HTTP ${response.status}: ${typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg}`);
    }

    return { ok: true, data, status: response.status };
  } catch (error) {
    const duration = performance.now() - startTime;

    if (error.name === 'AbortError') {
      console.warn(`[API] ${endpoint} timed out after ${timeout}ms`);
      trackApiMetric(endpoint, duration, 0, true);
      throw new Error(`Request timeout after ${timeout}ms. API is slow — try again or check your connection.`);
    }

    console.error(`[API] ${endpoint} failed:`, error.message);
    trackApiMetric(endpoint, duration, 0, true);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch with streaming support (Server-Sent Events)
 * Progressive rendering as data arrives from server
 */
export async function fetchWithStreaming(
  endpoint,
  payload,
  onChunk = null,
  options = {}
) {
  const { timeout = 3000, debug = false } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  const startTime = performance.now();

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') || '';

    // If server supports streaming, process line by line
    if (contentType.includes('text/event-stream')) {
      return handleStreamingResponse(response, onChunk, debug);
    }

    // Otherwise, return full response
    const data = await response.json();
    const duration = performance.now() - startTime;

    if (debug) {
      console.log(`[API] ${endpoint} (non-streaming) completed in ${duration.toFixed(0)}ms`);
    }

    trackApiMetric(endpoint, duration, response.status, false);

    return { ok: true, data, duration };
  } catch (error) {
    const duration = performance.now() - startTime;

    if (error.name === 'AbortError') {
      throw new Error(`Streaming request timeout after ${timeout}ms`);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Handle streaming responses (Server-Sent Events)
 */
async function handleStreamingResponse(response, onChunk, debug) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const chunks = [];

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      const lines = text.split('\n');

      for (const line of lines) {
        if (!line.trim() || !line.startsWith('data: ')) continue;

        try {
          const jsonStr = line.slice(6).trim();
          const chunk = JSON.parse(jsonStr);
          chunks.push(chunk);

          if (onChunk) {
            onChunk(chunk);
          }

          if (debug && chunk.index !== undefined) {
            console.log(`[Stream] Received chunk ${chunk.index + 1}`);
          }
        } catch (e) {
          console.warn('[Stream] Failed to parse chunk:', e);
        }
      }
    }

    return { ok: true, data: { evaluation_plan: chunks }, isStreaming: true };
  } finally {
    reader.releaseLock();
  }
}

/**
 * No-op function for backward compatibility
 * Caching has been disabled
 */
export function getCachedResponse() {
  return null;
}

/**
 * No-op function for backward compatibility
 * Caching has been disabled
 */
export function clearAllCaches() {
  console.log('[API] No caches to clear (caching disabled)');
}

/**
 * Safe JSON parsing with fallback
 */
async function safeParseJson(response) {
  try {
    return await response.json();
  } catch {
    return { error: 'Invalid JSON response' };
  }
}

/**
 * Track API performance metrics
 * Sends to analytics if available
 */
function trackApiMetric(endpoint, durationMs, status, isError) {
  // Log to console in dev
  if (import.meta.env.DEV) {
    const label = isError ? '❌' : '✓';
    console.log(
      `${label} [METRIC] ${endpoint.split('/').pop()} — ${durationMs.toFixed(0)}ms (${status})`
    );
  }

  // Send to analytics if available (e.g., Mixpanel, Segment)
  if (typeof window !== 'undefined' && window.analytics) {
    try {
      window.analytics.track('api_call', {
        endpoint,
        duration_ms: Math.round(durationMs),
        status_code: status,
        is_error: isError,
      });
    } catch (e) {
      // Silently fail if analytics not available
    }
  }
}


/**
 * No-op function for backward compatibility
 */
export function generateCacheKey() {
  return null;
}
