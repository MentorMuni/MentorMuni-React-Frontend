# Production Error Fix: Quick Implementation Guide

## 🔴 Problem Summary

**Error:** `POST /interview-ready/aptitude-readiness/plan` returns **422/500** errors

**Root Cause:** LLM response missing `explanation` field → Pydantic validation fails → 500 error

**Status:** 🔴 **CRITICAL** - Users cannot generate aptitude questions

---

## ✅ Quick Fix (15 minutes)

### Step 1: Update LLM Prompt (Immediate Fix)

**File:** `app/services/llm_service.py` → `generate_aptitude_questions()` function

**Change:**
```python
# BEFORE
prompt = f"""Generate {question_count} aptitude questions..."""

# AFTER - Add explicit requirement for explanation field
prompt = f"""Generate {question_count} aptitude questions.

CRITICAL JSON STRUCTURE:
{{
  "question": "text",
  "question_type": "multiple_choice",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "correct_option": "A",
  "study_topic": "topic",
  "explanation": "2-3 sentence explanation"  ← REQUIRED
}}

Return VALID JSON ONLY."""
```

**Time:** 5 minutes

---

### Step 2: Add Response Validation (Immediate Fix)

**File:** `app/main.py` → `aptitude_readiness_plan()` function

**Add:**
```python
# After LLM returns response
def validate_and_sanitize(items):
    """Ensure all required fields exist"""
    validated = []
    for item in items:
        # Add missing fields with defaults
        sanitized = {
            "question": item.get("question", ""),
            "question_type": item.get("question_type", "multiple_choice"),
            "options": item.get("options", ["A) ", "B) ", "C) ", "D) "]),
            "correct_option": item.get("correct_option", "A"),
            "study_topic": item.get("study_topic", "General"),
            "explanation": item.get("explanation", "This tests the concept.")  ← Provide default
        }
        validated.append(sanitized)
    return validated

# In endpoint
evaluation_plan = validate_and_sanitize(evaluation_plan)
return AptitudeReadinessPlanResponse(evaluation_plan=evaluation_plan)
```

**Time:** 10 minutes

---

## 🔍 Detailed Fix (30 minutes)

See: `BACKEND_ERROR_FIX.md` for complete implementation with:
- Full LLM prompt update
- Response validation logic
- Pydantic schema updates
- Error handling
- Logging

---

## 🧪 Testing After Fix

```bash
# Test endpoint
curl -X POST http://localhost:8000/interview-ready/aptitude-readiness/plan \
  -H "Content-Type: application/json" \
  -d '{
    "user_type": "college_student_year_4",
    "primary_skill": "python"
  }'

# Expected: 200 OK with 15 questions (each with explanation field)
# NOT: 422/500 error
```

---

## 📊 Monitoring

**Add to logs:**
```python
logger.info(f"Generated {len(questions)}/15 questions")
if len(questions) < 15:
    logger.error("CRITICAL: Fewer than 15 questions generated")
if "explanation" not in question:
    logger.error("CRITICAL: Missing explanation field")
```

---

## 🚀 Deployment

1. **Staging:** Deploy fix to staging first (5 min)
2. **Test:** Verify 200 OK responses (5 min)
3. **Production:** Deploy to production (5 min)
4. **Monitor:** Watch error logs for 30 minutes (30 min)

**Total time:** ~45 minutes

---

## ✨ Result

**Before:**
```
POST /interview-ready/aptitude-readiness/plan
→ 422 Unprocessable Entity
→ 500 Internal Server Error
✗ Users get error, no questions
```

**After:**
```
POST /interview-ready/aptitude-readiness/plan
→ 200 OK
→ 15 fresh questions with explanations
✓ Users get complete assessment
```

---

**Priority:** 🔴 **CRITICAL** - Deploy immediately

See `BACKEND_ERROR_FIX.md` for complete implementation details.
