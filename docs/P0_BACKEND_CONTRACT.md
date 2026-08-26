# P0 Intelligence Foundation — Backend Contract

## Overview
The frontend has implemented 5/7 P0 components. This document specifies what the backend must provide to complete the integration.

## Frontend Components (Completed ✅)
1. **computeStudentReadiness()** — pure function combining attempts + mission completion
2. **Syllabus Map** — 60+ topics, 6 pillars, company-tagged
3. **Topic Mastery** — 3 modalities × 4 levels, independent progression
4. **Coverage Ledger** — NEW/RETRY/VERIFY pool tracking
5. **Slate Selector** — deterministic topic picker (no LLM in selection)

## Frontend Components (Still Needed)
- **Priority Engine** (`daily/priority.js`) — returns today's focus topic

## Database Changes Required

### 1. attempt table
```sql
CREATE TABLE attempt (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL,
  tool_code VARCHAR(50),           -- 'aptitude', 'coding', 'skill_mock', etc.
  widget_spec JSONB,               -- full WidgetSpec (topic_nodes, difficulty, modality, etc.)
  topic_nodes TEXT[],              -- e.g., ['apt.quant.ratios', 'apt.quant.mixtures']
  modality VARCHAR(20),            -- 'recognition' | 'application' | 'explanation'
  difficulty INT,                  -- 1-5
  score NUMERIC(5,2),              -- 0-100
  accuracy NUMERIC(3,2),           -- 0-1
  time_taken_s INT,
  technical_score NUMERIC(5,2),
  communication_score NUMERIC(5,2),
  mistakes TEXT[],                 -- list of mistake descriptions
  attempt_number INT,              -- which attempt on this topic this session
  item_embeddings FLOAT8[],        -- for cosine similarity filtering
  transcript_ref UUID,             -- foreign key to transcripts if voice
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_attempt_student_date ON attempt(student_id, completed_at DESC);
CREATE INDEX idx_attempt_topic ON attempt(topic_nodes);
```

### 2. topic_mastery table
```sql
CREATE TABLE topic_mastery (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL,
  topic_id VARCHAR(100),           -- e.g., 'apt.quant.ratios'
  
  -- Modalities: recognition, application, explanation
  recognition_level INT,           -- 0-4 (L1-L4)
  recognition_attempts INT,
  recognition_last_at TIMESTAMP,
  recognition_consecutive_passes INT,
  
  application_level INT,
  application_attempts INT,
  application_last_at TIMESTAMP,
  application_consecutive_passes INT,
  
  explanation_level INT,
  explanation_attempts INT,
  explanation_last_at TIMESTAMP,
  explanation_consecutive_passes INT,
  
  assessed_at TIMESTAMP,
  next_review_at TIMESTAMP,        -- Leitner scheduling
  
  UNIQUE(student_id, topic_id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_topic_mastery_student ON topic_mastery(student_id);
CREATE INDEX idx_topic_mastery_due ON topic_mastery(student_id, next_review_at);
```

### 3. coverage_ledger table
```sql
CREATE TABLE coverage_ledger (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL,
  topic_id VARCHAR(100),
  pool VARCHAR(10),                -- 'NEW' | 'RETRY' | 'VERIFY'
  first_tested_at TIMESTAMP,
  last_tested_at TIMESTAMP,
  attempts INT,
  correct INT,
  never_return_to_new BOOLEAN DEFAULT FALSE,
  
  UNIQUE(student_id, topic_id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_coverage_student ON coverage_ledger(student_id);
CREATE INDEX idx_coverage_pool ON coverage_ledger(student_id, pool);
```

### 4. student_memory table
```sql
CREATE TABLE student_memory (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL,
  fact_type VARCHAR(50),           -- 'strength', 'weakness', 'learning_pattern', etc.
  topic_id VARCHAR(100),           -- optional, if fact is about a specific topic
  fact TEXT,                       -- e.g., "struggles with recursion base cases"
  confidence NUMERIC(3,2),         -- 0-1
  evidence_count INT,              -- how many observations support this
  last_observed TIMESTAMP,
  resolved_at TIMESTAMP,           -- null if active, set when resolved
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_student_memory_student ON student_memory(student_id);
CREATE INDEX idx_student_memory_active ON student_memory(student_id, resolved_at) WHERE resolved_at IS NULL;
```

### 5. student_target table
```sql
CREATE TABLE student_target (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL,
  target_companies TEXT[],         -- ['tcs_ninja', 'infosys_sp', ...]
  target_tier VARCHAR(50),         -- 'mass_recruiter' | 'product'
  target_readiness INT,            -- 85 (default)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id)
);
```

### 6. readiness_snapshot table (daily rollup)
```sql
CREATE TABLE readiness_snapshot (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL,
  snapshot_date DATE,
  
  overall INT,
  base INT,
  execution_multiplier NUMERIC(4,2),
  coverage NUMERIC(3,2),
  measured_pillars INT,
  total_pillars INT,
  eta_days INT,
  
  pillars JSONB,                   -- { aptitude: {score, level, hasData}, ... }
  focus_pillar VARCHAR(50),
  weakest_pillar VARCHAR(50),
  gates JSONB,                     -- gate decisions
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_readiness_snapshot_student_date ON readiness_snapshot(student_id, snapshot_date DESC);
```

### 7. daily_task_ledger table (existing, extend)
Columns to add:
- `skill_demand_score INT` — what pillar was most needed today
- `completion_rate_7d NUMERIC(3,2)` — for execution_multiplier in readiness

## API Endpoints Required

### 1. Readiness (Wire computeReadiness server-side)
```
GET /student/readiness
  → returns object from computeReadiness():
    {
      overall, base, execution_multiplier, coverage,
      measured_pillars, total_pillars, target, target_tier,
      eta_days, pillars{}, focus_pillar, gates[], computed_at
    }
```

### 2. Topic Mastery
```
GET /student/mastery[?due_before=2026-09-15]
  → returns array of topic_mastery objects
    [
      {
        topic_id, 
        recognition: {level, attempts, consecutive_passes, last_at},
        application: {level, attempts, consecutive_passes, last_at},
        explanation: {level, attempts, consecutive_passes, last_at},
        assessed_at, next_review_at
      }
    ]
```

### 3. Student Memory
```
GET /student/memory
  → returns active facts
    [
      {
        fact_type, topic_id, fact, confidence, evidence_count, last_observed
      }
    ]
```

### 4. Coverage Ledger (internal, optional to expose)
```
GET /student/coverage
  → returns coverage state
    {
      tested: {topic_id: {pool, attempts, correct, last_tested_at}},
      in_retry: [topic_ids],
      in_verify: [topic_ids]
    }
```

### 5. Daily Mission (Enhance existing)
```
GET /student/daily
  → tasks should include WidgetSpec + why_this:
    {
      tool_code, topic_nodes[], modality, question_count,
      time_limit_s, difficulty, attempt_number,
      why_this: "Ratios cost you 4 marks on Monday."
    }
```

### 6. Student Target
```
POST /student/target
  {target_companies, target_tier, target_readiness}
  
GET /student/target
  → returns current target
```

## Server-Side Functions (Must Implement Identically)

### 1. computeReadiness(input)
**Location in frontend:** `src/studentPortal/readiness/readinessScore.js`

Copy to backend. Must be byte-identical to avoid score divergence.
- Input: `{attempts[], today, completionRate7d, targetTier, targetCompanies, target}`
- Output: `{overall, base, execution_multiplier, coverage, pillars{}, gates[], ...}`

### 2. resolveMission(input)
**Location in frontend:** `src/studentPortal/daily/missionResolver.js`

Already exists on backend; wire to use new slate selector.
- Input: `{dayInPlan, plan, ledger, topicMastery, prunedSyllabus}`
- Output: `{mode, tasks[], complete, totalMinutes}`

### 3. slateSelector(input)
**Location in frontend:** `src/studentPortal/intelligence/slateSelector.js`

Copy to backend. Called daily to pick topics for today's questions.
- Input: `{dayInPlan, numQuestionsNeeded, ledger, topicMastery, prunedSyllabus, recentQuestions}`
- Output: `[topic_ids]` in preference order

## Data Flow

```
Day 1 login
  ↓
/student/readiness → {overall: 0, coverage: 0, focus_pillar: 'aptitude'}
/student/mastery → []  (empty, no assessments yet)
/student/daily → Week 0 baseline task
  ↓
Student completes widget → POST /attempt (log to attempt table)
  ↓
Backend updates topic_mastery, coverage_ledger
  ↓
Day 2 /student/daily calls slateSelector()
  ↓
Server picks topics based on NEW/RETRY/VERIFY pools
  ↓
LLM writes questions for selected topics
```

## Testing Strategy (Frontend)

All P0 modules are pure functions — test with fixtures:
```javascript
// Fixture data
const students = {
  arjun: {roadmap: {...}, topicMastery: {...}, ledger: {...}},
  priya: {...},
  rohan: {...}
};

// Test coverage handshake
const day45Ledger = slateSelector({
  dayInPlan: 45,
  prunedSyllabus: getAllTopics().map(t => t.id),
  ...
});
// Assert: 100% of pruned syllabus covered, no repeats
```

## Deployment Notes

1. Backend must run `computeReadiness()` daily to populate `readiness_snapshot`
2. Frontend calls `/student/readiness` on Home page load (replaces flat analysis)
3. `daily/priority.js` (once built) calls `slateSelector()` server-side
4. No breaking changes to existing endpoints — all new tables/fields are additive

## Related Sections in P1-P4

- **P1:** Student Memory confidence asymmetry, why_this prose, difficulty adaptation
- **P2:** AI-1 Question Generator (uses topics from slate), AI-2 Evaluator, AI-4 Mentor
- **P3:** Week 0, operating modes, leaderboards
- **P4:** Mock Drives, placement outcomes
