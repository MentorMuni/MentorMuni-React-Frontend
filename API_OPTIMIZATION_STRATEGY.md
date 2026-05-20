# API Optimization Strategy: Skill Readiness, Interview Readiness & Aptitude Readiness

## Current Performance Issues

**Baseline:** API calls for skill readiness, interview readiness score, and aptitude readiness are taking **3-5+ seconds** (or timing out at 120s).

**Root Causes Identified:**
1. **Frontend:** 120-second timeout is too aggressive; no request deduplication or caching
2. **Backend:** Likely LLM latency, no streaming responses, no response caching, sequential question generation
3. **Network:** No compression, no early partial rendering, no progressive response handling

---

## Frontend Optimizations (0.5-1.2s target)

### 1. Reduce Frontend Timeout (High Impact)
**File:** `src/components/interviewready.jsx` (line 272)

**Change:**
```javascript
// BEFORE
const PLAN_FETCH_TIMEOUT_MS = 120000; // 120 seconds

// AFTER
const PLAN_FETCH_TIMEOUT_MS = 3000; // 3 seconds (API should respond faster)
```

**Rationale:**
- API should generate readiness plans in < 2 seconds
- Current 120s timeout masks performance problems
- Aggressive timeout forces backend optimization

### 2. Add Request Deduplication & Caching
**File:** `src/components/interviewready.jsx` (new utility)

**Implementation:**
```javascript
// Create a request cache that prevents duplicate simultaneous API calls
const requestCache = new Map();

function getCacheKey(path, payload) {
  return `${path}:${JSON.stringify(payload)}`;
}

async function fetchWithDedupe(path, payload, timeout) {
  const cacheKey = getCacheKey(path, payload);
  
  // Return existing promise if request is in flight
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey);
  }
  
  // Create new request promise
  const promise = performApiCall(path, payload, timeout);
  requestCache.set(cacheKey, promise);
  
  // Clean up cache after 1 hour (or on success/failure)
  promise.finally(() => {
    setTimeout(() => requestCache.delete(cacheKey), 3600000);
  });
  
  return promise;
}
```

### 3. Implement Progressive Response Handling
**Enhancement:** Detect and render partial responses from streaming APIs

```javascript
async function fetchWithStreaming(path, payload, timeout) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream' // Signal streaming support
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    
    // If streaming: process line by line
    if (res.headers.get('content-type')?.includes('text/event-stream')) {
      return handleStreamingResponse(res);
    }
    
    // Otherwise: return full response
    return res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}
```

### 4. Add Response Compression Detection
```javascript
// In fetch headers, signal support for compressed responses
headers: {
  'Content-Type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
}
```

### 5. Memoize API Responses (Session-Level)
```javascript
const sessionCache = {};

function getCachedOrFetch(cacheKey, fetchFn) {
  if (sessionCache[cacheKey]) {
    return Promise.resolve(sessionCache[cacheKey]);
  }
  
  return fetchFn().then(data => {
    sessionCache[cacheKey] = data;
    return data;
  });
}
```

---

## Backend Optimizations (Critical for <1s response)

### 1. Implement Response Streaming (Server-Sent Events)
**Benefit:** Client sees questions as they're generated (don't wait for all 15 questions)

```python
@app.post('/interview-ready/interview-readiness/plan')
def interview_readiness_plan(request: PlanRequest):
    def generate():
        questions = []
        for i, question in enumerate(generate_questions_async(request)):
            questions.append(question)
            # Stream each question as it's ready
            yield f"data: {json.dumps({'partial': questions, 'index': i})}\n\n"
        # Final response
        yield f"data: {json.dumps({'evaluation_plan': questions, 'complete': True})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")
```

### 2. Cache Frequently Generated Questions
```python
from functools import lru_cache
import hashlib

@lru_cache(maxsize=500)
def get_cached_questions(user_type: str, primary_skill: str, question_count: int):
    """Cache questions by user profile to avoid redundant LLM calls"""
    return generate_questions_llm(user_type, primary_skill, question_count)
```

### 3. Parallelize Question Generation
```python
import asyncio
from concurrent.futures import ThreadPoolExecutor

async def generate_questions_parallel(user_type, primary_skill, count):
    """Generate questions in parallel batches instead of sequentially"""
    batch_size = 5
    tasks = [
        generate_single_question_async(user_type, primary_skill, i)
        for i in range(count)
    ]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return [r for r in results if not isinstance(r, Exception)]
```

### 4. Implement Database Caching for Similar Profiles
```python
# Redis caching for 15-30 minutes
@cache.cached(timeout=1800, key_prefix='readiness_')
def get_readiness_plan(user_type: str, primary_skill: str):
    # Check if similar profiles exist in cache
    cached = redis_client.get(f'plan:{user_type}:{skill_hash}')
    if cached:
        return json.loads(cached)
    
    # Generate if not cached
    plan = generate_plan(user_type, primary_skill)
    redis_client.setex(f'plan:{user_type}:{skill_hash}', 1800, json.dumps(plan))
    return plan
```

### 5. Optimize LLM Requests
```python
# Use faster/cheaper LLM models for readiness generation
# Instead of GPT-4 (slow): use GPT-3.5-turbo or similar
# Add structured output format to reduce processing time

async def generate_questions_fast(user_type, skill):
    prompt = f"""Generate 5 technical questions for a {user_type} with {skill} knowledge.
    Return as JSON array: [{{"question": "...", "correct_answer": "...", "study_topic": "..."}}]"""
    
    response = await openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # Fast + cheap
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=2000,
        timeout=5  # Hard timeout on LLM request
    )
```

### 6. Pre-generate Common Question Sets
```python
# Pre-generate and cache questions for common combinations:
COMMON_PROFILES = [
    ('college_student_year_4', 'python'),
    ('college_student_year_4', 'java'),
    ('college_student_year_4', 'javascript'),
    ('college_student_year_1', 'python'),
    ('it_professional', 'python'),
    # ... etc
]

# Run as a periodic task (every 6 hours)
def warm_cache():
    for user_type, skill in COMMON_PROFILES:
        get_cached_questions(user_type, skill, 15)
```

### 7. Add Request-Level Timeouts on Backend
```python
from functools import wraps
import signal

def timeout(seconds):
    def timeout_handler(signum, frame):
        raise TimeoutError("Request exceeded timeout")
    
    def decorator(func):
        def wrapper(*args, **kwargs):
            signal.signal(signal.SIGALRM, timeout_handler)
            signal.alarm(seconds)
            try:
                return func(*args, **kwargs)
            finally:
                signal.alarm(0)
        return wrapper
    return decorator

@app.post('/interview-ready/interview-readiness/plan')
@timeout(2)  # Hard 2-second limit
def interview_readiness_plan(request):
    # ... generate plan ...
```

---

## Performance Targets & Benchmarks

| Endpoint | Current | Target | Optimization |
|----------|---------|--------|--------------|
| `/interview-ready/interview-readiness/plan` | 3-5s | 0.5-1.2s | Caching + Streaming + Parallel generation |
| `/interview-ready/skill-readiness/plan` | 3-5s | 0.5-1.2s | Caching + Streaming + LLM optimization |
| `/interview-ready/aptitude-readiness/plan` | 3-5s | 0.5-1.2s | Pre-generated question sets |
| `/interview-ready/evaluate` | 1-2s | 0.2-0.5s | Direct calculation, no LLM |

---

## Implementation Roadmap

### Phase 1: Frontend (Immediate - 15 minutes)
- [ ] Reduce timeout from 120s → 3s
- [ ] Add request deduplication
- [ ] Add session-level caching

### Phase 2: Backend (1-2 hours)
- [ ] Implement response streaming (Server-Sent Events)
- [ ] Add Redis/in-memory caching
- [ ] Parallelize question generation
- [ ] Optimize LLM model selection

### Phase 3: Advanced (2-4 hours)
- [ ] Pre-generate common question sets
- [ ] Implement database caching
- [ ] Add load testing & monitoring
- [ ] Set up performance alerts

---

## Monitoring & Metrics

```javascript
// Add performance tracking to frontend
const startTime = performance.now();
const res = await fetch(url);
const duration = performance.now() - startTime;

console.log(`[PERF] ${endpoint} took ${duration}ms`);
analytics.track('api_call', {
  endpoint,
  duration_ms: duration,
  status: res.status,
  cache_hit: wasCached,
});
```

```python
# Backend metrics
import time
import logging

@app.post('/interview-ready/interview-readiness/plan')
def plan_endpoint(request):
    start = time.time()
    result = generate_plan(request)
    duration = time.time() - start
    
    logger.info(f"Plan generation took {duration:.2f}s", extra={
        'endpoint': 'interview_readiness_plan',
        'duration_ms': int(duration * 1000),
        'user_type': request.user_type,
    })
    
    return result
```

---

## Expected Outcome

After implementing these optimizations:
- **P50 (median):** 0.6-0.9 seconds
- **P95 (95th percentile):** 1.0-1.2 seconds  
- **P99 (99th percentile):** 1.5-2.0 seconds

This represents a **3-5x improvement** from current 3-5s baseline.
