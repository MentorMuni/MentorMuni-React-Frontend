"""
Backend Integration Guide for Aptitude Readiness Fix

This file shows how to integrate the validator and planner into your FastAPI backend
"""

# ============================================================================
# INTEGRATION EXAMPLE 1: Using in FastAPI endpoint
# ============================================================================

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import logging

from utils.aptitudeReadinessPlanner import generate_aptitude_readiness_plan
from utils.aptitudeResponseValidator import validate_aptitude_response, ValidationLevel

logger = logging.getLogger(__name__)
app = FastAPI()


class AptitudeReadinessRequest(BaseModel):
    user_type: str
    experience_years: int = 0
    target_role: Optional[str] = None
    target_company_type: str = 'both'


class AptitudeReadinessItem(BaseModel):
    question: str
    question_type: str
    options: List[str]
    correct_option: str
    study_topic: str
    explanation: str


class AptitudeReadinessResponse(BaseModel):
    evaluation_plan: List[AptitudeReadinessItem]
    total_generated: int
    validation_passed: bool
    generated_at: str
    error: Optional[str] = None


@app.post('/interview-ready/aptitude-readiness/plan', response_model=AptitudeReadinessResponse)
async def aptitude_readiness_plan(request: AptitudeReadinessRequest):
    """
    PRODUCTION ENDPOINT - Uses integrated validation and recovery
    
    This endpoint NEVER returns 422/500 errors to users.
    It always returns valid questions or fallbacks.
    """
    try:
        # Use the planner which handles all validation internally
        result = await generate_aptitude_readiness_plan(
            user_type=request.user_type,
            question_count=15,
            experience_years=request.experience_years,
            target_role=request.target_role,
            target_company_type=request.target_company_type,
            llm_service=your_llm_service  # Inject your LLM service
        )
        
        # Result is already validated and formatted
        return AptitudeReadinessResponse(**result)
        
    except Exception as e:
        logger.error(f"Unhandled error: {str(e)}", exc_info=True)
        # Return error response with fallback questions
        from utils.aptitudeReadinessPlanner import AptitudeReadinessPlanner
        planner = AptitudeReadinessPlanner(llm_service=None)
        fallback = planner._get_fallback_questions(15)
        
        return AptitudeReadinessResponse(
            evaluation_plan=fallback,
            total_generated=len(fallback),
            validation_passed=False,
            generated_at=datetime.now().isoformat(),
            error=f"Using fallback questions due to: {str(e)}"
        )


# ============================================================================
# INTEGRATION EXAMPLE 2: Using validator standalone
# ============================================================================

async def validate_external_aptitude_response(raw_llm_response):
    """
    If you already have an LLM response and need to validate it
    """
    validated_questions, success, error_msg = validate_aptitude_response(
        response_data=raw_llm_response,
        expected_count=15,
        validation_level=ValidationLevel.HYBRID  # Auto-fix issues
    )
    
    if not success:
        logger.warning(f"Validation errors: {error_msg}")
    
    return validated_questions


# ============================================================================
# INTEGRATION EXAMPLE 3: Custom LLM wrapper
# ============================================================================

class EnhancedLLMService:
    """
    Wrapper around your existing LLM service
    Adds validation and recovery
    """
    
    def __init__(self, base_llm_service):
        self.base_llm = base_llm_service
        self.validator = AptitudeReadinessPlanner(llm_service=base_llm_service)
    
    async def generate_aptitude_questions(self, user_type, count=15):
        """
        Generate with automatic validation
        """
        try:
            # Call your existing LLM
            raw_response = await self.base_llm.generate_aptitude_questions(user_type)
            
            # Validate response
            validated, success, error = validate_aptitude_response(
                response_data=raw_response,
                expected_count=count,
                validation_level=ValidationLevel.HYBRID
            )
            
            if not success:
                logger.warning(f"Validation issues fixed automatically: {error}")
            
            return validated
            
        except Exception as e:
            logger.error(f"Failed to generate, using fallback: {str(e)}")
            return self.validator._get_fallback_questions(count)


# ============================================================================
# TESTING EXAMPLES
# ============================================================================

import asyncio
from unittest.mock import AsyncMock, MagicMock


async def test_aptitude_endpoint():
    """
    Test the endpoint with mocked LLM
    """
    # Mock LLM response (missing explanation field - common error)
    mock_llm_response = [
        {
            'question': 'What is 30% of 80?',
            'question_type': 'multiple_choice',
            'options': ['A) 20', 'B) 24', 'C) 30', 'D) 40'],
            'correct_option': 'B',
            'study_topic': 'Percentage'
            # ❌ MISSING: 'explanation'
        } for _ in range(15)
    ]
    
    # Test validation
    validated, success, error = validate_aptitude_response(
        response_data=mock_llm_response,
        expected_count=15,
        validation_level=ValidationLevel.HYBRID
    )
    
    # Should auto-fix and return valid questions
    assert len(validated) == 15
    assert all('explanation' in q for q in validated)
    assert all(len(q['explanation']) > 0 for q in validated)
    print("✓ Validation test passed - auto-fixed missing fields")


async def test_short_options():
    """
    Test handling of too-short options
    """
    mock_response = [
        {
            'question': 'What is 30% of 80?',
            'question_type': 'multiple_choice',
            'options': ['A) 20', 'B) 24', 'C) 30', 'D) 40'],  # ❌ Too short
            'correct_option': 'B',
            'study_topic': 'Percentage',
            'explanation': 'This tests percentage knowledge'
        } for _ in range(15)
    ]
    
    validated, success, error = validate_aptitude_response(
        response_data=mock_response,
        expected_count=15,
        validation_level=ValidationLevel.HYBRID
    )
    
    # Should auto-extend options
    assert len(validated) == 15
    assert all(len(q['options'][0]) >= 20 for q in validated)
    print("✓ Option length test passed - auto-extended short options")


async def test_missing_fields():
    """
    Test handling of completely missing fields
    """
    mock_response = [
        {
            'question': 'Test question?'
            # ❌ Missing multiple required fields
        } for _ in range(15)
    ]
    
    validated, success, error = validate_aptitude_response(
        response_data=mock_response,
        expected_count=15,
        validation_level=ValidationLevel.HYBRID
    )
    
    # Should fill in defaults or use fallback
    assert len(validated) >= 10
    print("✓ Missing fields test passed - provided defaults/fallbacks")


# ============================================================================
# MONITORING & LOGGING
# ============================================================================

class AptitudeMetrics:
    """
    Track aptitude endpoint metrics
    """
    def __init__(self):
        self.total_requests = 0
        self.successful = 0
        self.fixed = 0
        self.fallback = 0
    
    def log_generation_result(self, success, fixed, is_fallback):
        self.total_requests += 1
        if success:
            self.successful += 1
        if fixed:
            self.fixed += 1
        if is_fallback:
            self.fallback += 1
    
    def get_stats(self):
        return {
            'total': self.total_requests,
            'success_rate': self.successful / self.total_requests * 100 if self.total_requests > 0 else 0,
            'fixed_rate': self.fixed / self.total_requests * 100 if self.total_requests > 0 else 0,
            'fallback_rate': self.fallback / self.total_requests * 100 if self.total_requests > 0 else 0
        }


# ============================================================================
# DEPLOYMENT CHECKLIST
# ============================================================================

"""
BEFORE DEPLOYING:

1. Copy files to your backend:
   - src/utils/aptitudeResponseValidator.py
   - src/utils/aptitudeReadinessPlanner.py

2. Update your imports in main.py:
   from utils.aptitudeReadinessPlanner import generate_aptitude_readiness_plan

3. Replace your endpoint with the integrated version shown above

4. Test locally:
   python -m pytest tests/test_aptitude.py -v

5. Monitor production:
   - Track error rates (should be 0%)
   - Track validation fix rates (should decrease over time)
   - Track fallback usage (should be < 1%)

6. Verify no 422/500 errors on production

SUCCESS CRITERIA:
✓ No more 422 Unprocessable Entity errors
✓ No more 500 Internal Server errors
✓ All requests return 200 OK
✓ All responses have 15 valid questions
✓ All questions have explanation field
✓ All options are properly formatted
"""
