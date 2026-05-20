/**
 * API Optimization Utilities
 * Implements request deduplication, caching, and streaming support
 * for faster readiness assessment responses (target: 0.5-1.2s)
 */

/**
 * In-flight request deduplication cache
 * Prevents duplicate simultaneous API calls for identical requests
 */
const inflightRequests = new Map();

/**
 * Session-level response cache
 * Stores successful responses for reuse within session
 * Automatically cleared on page unload
 */
const sessionCache = new Map();

/**
 * Generate cache key from endpoint and payload
 */
function generateCacheKey(endpoint, payload) {
  try {
    return `${endpoint}:${JSON.stringify(payload)}`;
  } catch {
    return `${endpoint}:${Math.random()}`;
  }
}

/**
 * Fetch with request deduplication
 * If the same request is already in flight, returns the same promise
 * Prevents duplicate API calls when user rapidly retries or multiple components request same data
 */
export async function fetchWithDeduplication(
  endpoint,
  payload,
  options = {}
) {
  const cacheKey = generateCacheKey(endpoint, payload);
  
  // Return existing promise if request is in flight
  if (inflightRequests.has(cacheKey)) {
    if (options.debug) {
      console.log('[API Cache] Returning deduplicated request:', endpoint);
    }
    return inflightRequests.get(cacheKey);
  }
  
  // Create new request promise
  const requestPromise = performFetch(endpoint, payload, options);
  inflightRequests.set(cacheKey, requestPromise);
  
  // Remove from in-flight cache after completion
  requestPromise.finally(() => {
    inflightRequests.delete(cacheKey);
  });
  
  return requestPromise;
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

    if (!response.ok) {
      const data = await safeParseJson(response);
      throw new Error(`HTTP ${response.status}: ${data?.detail || data?.error || 'Unknown error'}`);
    }

    const data = await response.json();

    // Cache successful response if enabled
    if (allowCache && cacheKey) {
      sessionCache.set(cacheKey, { data, timestamp: Date.now() });
      if (debug) {
        console.log('[API Cache] Cached response for:', cacheKey);
      }
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
 * Get cached response if available and fresh
 */
export function getCachedResponse(cacheKey, maxAgeSec = 3600) {
  const cached = sessionCache.get(cacheKey);

  if (!cached) {
    return null;
  }

  const ageMs = Date.now() - cached.timestamp;
  const maxAgeMs = maxAgeSec * 1000;

  if (ageMs > maxAgeMs) {
    sessionCache.delete(cacheKey);
    return null;
  }

  return cached.data;
}

/**
 * Clear all caches
 */
export function clearAllCaches() {
  inflightRequests.clear();
  sessionCache.clear();
  console.log('[API Cache] All caches cleared');
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
 * Clear cache on page unload to avoid memory leaks
 */
if (typeof window !== 'undefined') {
  window.addEventListener('unload', () => {
    clearAllCaches();
  });
}

/**
 * Export useful utilities for component usage
 */
export { generateCacheKey };
