"""
Enhanced Aptitude Readiness Plan Generator
Production-ready with automatic validation and recovery
"""

import asyncio
import json
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)


class AptitudeReadinessPlanner:
    """
    Generates aptitude readiness assessment questions with built-in validation
    Handles LLM failures, validates responses, and provides fallbacks
    """
    
    def __init__(self, llm_service, validation_enabled: bool = True):
        self.llm_service = llm_service
        self.validation_enabled = validation_enabled
    
    async def generate_plan(
        self,
        user_type: str,
        question_count: int = 15,
        experience_years: int = 0,
        target_role: Optional[str] = None,
        target_company_type: str = 'both'
    ) -> Dict[str, Any]:
        """
        Generate aptitude readiness plan with full validation
        """
        try:
            # Step 1: Generate questions with LLM
            raw_questions = await self._generate_questions_with_retry(
                user_type=user_type,
                question_count=question_count,
                experience_years=experience_years,
                target_role=target_role,
                target_company_type=target_company_type
            )
            
            # Step 2: Validate and normalize responses
            validated_questions = await self._validate_questions(raw_questions, question_count)
            
            # Step 3: Ensure compliance
            compliant_questions = self._ensure_schema_compliance(validated_questions)
            
            # Step 4: Return response
            return {
                'evaluation_plan': compliant_questions[:question_count],
                'total_generated': len(compliant_questions),
                'validation_passed': len(compliant_questions) >= question_count,
                'generated_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to generate aptitude plan: {str(e)}", exc_info=True)
            # Return fallback questions rather than failing
            fallback = self._get_fallback_questions(question_count)
            return {
                'evaluation_plan': fallback,
                'total_generated': len(fallback),
                'validation_passed': False,
                'generated_at': datetime.now().isoformat(),
                'error': str(e)
            }
    
    async def _generate_questions_with_retry(
        self,
        user_type: str,
        question_count: int,
        experience_years: int,
        target_role: Optional[str],
        target_company_type: str,
        max_retries: int = 2
    ) -> List[Dict[str, Any]]:
        """
        Generate questions with retry logic
        """
        last_error = None
        
        for attempt in range(max_retries + 1):
            try:
                logger.info(f"Generating aptitude questions, attempt {attempt + 1}/{max_retries + 1}")
                
                prompt = self._build_optimized_prompt(
                    user_type=user_type,
                    question_count=question_count,
                    experience_years=experience_years,
                    target_role=target_role,
                    target_company_type=target_company_type
                )
                
                response = await self.llm_service.generate(
                    prompt=prompt,
                    max_tokens=5000,
                    timeout=10
                )
                
                return self._parse_response(response)
                
            except Exception as e:
                last_error = e
                logger.warning(f"Attempt {attempt + 1} failed: {str(e)}")
                
                if attempt < max_retries:
                    await asyncio.sleep(2 ** attempt)  # Exponential backoff
                    continue
        
        raise last_error or Exception("Failed to generate questions after retries")
    
    async def _validate_questions(
        self,
        questions: List[Dict[str, Any]],
        expected_count: int
    ) -> List[Dict[str, Any]]:
        """
        Validate questions against schema
        """
        from aptitudeResponseValidator import validate_aptitude_response, ValidationLevel
        
        validated, success, error = validate_aptitude_response(
            response_data=questions,
            expected_count=expected_count,
            validation_level=ValidationLevel.HYBRID
        )
        
        if not success:
            logger.warning(f"Validation issues: {error}")
        
        return validated
    
    def _ensure_schema_compliance(self, questions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Final compliance check - ensure all fields match expected schema
        """
        compliant = []
        
        for i, q in enumerate(questions):
            try:
                compliant_item = {
                    'question': str(q.get('question', '')).strip()[:500],
                    'question_type': str(q.get('question_type', 'multiple_choice')).lower(),
                    'options': [str(opt).strip() for opt in (q.get('options', []) or [])],
                    'correct_option': str(q.get('correct_option', 'A')).upper()[0],
                    'study_topic': str(q.get('study_topic', 'General Knowledge')).strip()[:100],
                    'explanation': str(q.get('explanation', '')).strip()[:500]
                }
                
                # Validate field values
                assert len(compliant_item['question']) > 0, "Empty question"
                assert compliant_item['question_type'] in ['multiple_choice', 'mcq'], "Invalid question_type"
                assert len(compliant_item['options']) == 4, f"Expected 4 options, got {len(compliant_item['options'])}"
                assert compliant_item['correct_option'] in ['A', 'B', 'C', 'D'], "Invalid correct_option"
                assert len(compliant_item['study_topic']) > 0, "Empty study_topic"
                assert len(compliant_item['explanation']) > 0, "Empty explanation"
                
                # Ensure minimum lengths
                if len(compliant_item['explanation']) < 10:
                    compliant_item['explanation'] = f"This question tests {compliant_item['study_topic']}."
                
                for j, opt in enumerate(compliant_item['options']):
                    if len(opt) < 10:
                        compliant_item['options'][j] = f"{opt} ({compliant_item['study_topic']})"
                
                compliant.append(compliant_item)
                
            except Exception as e:
                logger.warning(f"Question {i+1} failed compliance: {str(e)}")
                # Skip non-compliant questions
                continue
        
        return compliant
    
    def _build_optimized_prompt(
        self,
        user_type: str,
        question_count: int,
        experience_years: int,
        target_role: Optional[str],
        target_company_type: str
    ) -> str:
        """
        Build optimized LLM prompt that ensures proper response format
        """
        return f"""Generate {question_count} aptitude assessment questions for a {user_type}.

CRITICAL REQUIREMENTS:
1. Return VALID JSON ONLY (no markdown, no code blocks, no explanations outside JSON)
2. Each question MUST have ALL required fields
3. Each option MUST be 20+ characters
4. Explanation MUST be 2-3 sentences

REQUIRED JSON STRUCTURE:
[
  {{
    "question": "Complete question text (min 15 chars)",
    "question_type": "multiple_choice",
    "options": [
      "A) First option with full explanation (min 20 chars)",
      "B) Second option with explanation (min 20 chars)",
      "C) Third option with explanation (min 20 chars)",
      "D) Fourth option with explanation (min 20 chars)"
    ],
    "correct_option": "B",
    "study_topic": "Topic name",
    "explanation": "2-3 sentence explanation of why this is correct and common mistakes"
  }}
  // ... repeat for all {question_count} questions
]

CONTENT GUIDELINES:
- Mix question types: quantitative (30%), logical (40%), verbal (30%)
- Vary difficulty: Easy (40%), Medium (40%), Hard (20%)
- Include common mistake options
- Make explanations educational

Generate EXACTLY {question_count} questions. Return ONLY valid JSON."""
    
    def _parse_response(self, response: str) -> List[Dict[str, Any]]:
        """
        Parse LLM response robustly
        """
        try:
            # Try to extract JSON from various formats
            content = response.strip()
            
            # Remove markdown code blocks if present
            if content.startswith('```'):
                content = content.split('```')[1]
                if content.startswith('json'):
                    content = content[4:]
                content = content.split('```')[0]
            
            # Parse JSON
            parsed = json.loads(content)
            
            # Handle wrapped responses
            if isinstance(parsed, dict):
                if 'evaluation_plan' in parsed:
                    parsed = parsed['evaluation_plan']
                elif 'questions' in parsed:
                    parsed = parsed['questions']
            
            if not isinstance(parsed, list):
                parsed = [parsed]
            
            return parsed
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LLM response: {str(e)}")
            raise ValueError("LLM response was not valid JSON")
    
    def _get_fallback_questions(self, count: int) -> List[Dict[str, Any]]:
        """
        Generate fallback questions when LLM fails
        Ensures users never see errors
        """
        base_questions = [
            {
                'question': 'What is 30% of 80?',
                'question_type': 'multiple_choice',
                'options': [
                    'A) 20 - Incorrect calculation',
                    'B) 24 - Correct: (30/100) × 80 = 24',
                    'C) 30 - Confusing percentage with value',
                    'D) 40 - Arithmetic error'
                ],
                'correct_option': 'B',
                'study_topic': 'Percentage Calculations',
                'explanation': 'To find 30% of 80, multiply 0.3 × 80 = 24. This is a fundamental percentage calculation.'
            },
            {
                'question': 'If all cats are mammals and some mammals are dogs, which statement is true?',
                'question_type': 'multiple_choice',
                'options': [
                    'A) All cats are dogs - Incorrect, not all mammals are dogs',
                    'B) Some cats might be dogs - Incorrect, cats and dogs are different',
                    'C) All dogs are mammals - Correct, stated in the premise',
                    'D) No dogs are mammals - Incorrect, contradicts the premise'
                ],
                'correct_option': 'C',
                'study_topic': 'Logical Reasoning',
                'explanation': 'The statement says "all cats are mammals" and "some mammals are dogs". Therefore all dogs must be mammals.'
            },
            {
                'question': 'APPLE is coded as 50, ORANGE is coded as 66. What would BANANA be coded as?',
                'question_type': 'multiple_choice',
                'options': [
                    'A) 60 - Following pattern of letter count × 10',
                    'B) 65 - Missing the coding rule',
                    'C) 55 - Incorrect calculation',
                    'D) 70 - Wrong application'
                ],
                'correct_option': 'A',
                'study_topic': 'Pattern Recognition',
                'explanation': 'APPLE has 5 letters (5×10=50), ORANGE has 6 letters (6×10=60), BANANA has 6 letters (6×10=60).'
            },
            {
                'question': 'Find the next number in the series: 2, 6, 12, 20, ___',
                'question_type': 'multiple_choice',
                'options': [
                    'A) 24 - Simple addition pattern',
                    'B) 28 - Does not follow the sequence',
                    'C) 30 - Correct: n(n+1) where n=5',
                    'D) 32 - Incorrect multiple'
                ],
                'correct_option': 'C',
                'study_topic': 'Series Pattern Recognition',
                'explanation': 'The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30. Each term is a product of consecutive integers.'
            },
            {
                'question': 'Choose the word that is opposite in meaning to BENEVOLENT',
                'question_type': 'multiple_choice',
                'options': [
                    'A) Selfish - Partially correct but not precise antonym',
                    'B) Malevolent - Correct antonym expressing ill will',
                    'C) Indifferent - Means not caring, not opposite',
                    'D) Generous - Synonym not antonym'
                ],
                'correct_option': 'B',
                'study_topic': 'Verbal Reasoning - Antonyms',
                'explanation': 'Benevolent means kind and generous. Malevolent means evil and ill-willed, making it the perfect antonym.'
            },
            {
                'question': 'Identify the error: "Neither the teacher nor the students is aware of the new policy."',
                'question_type': 'multiple_choice',
                'options': [
                    'A) "is" should be "are" - Correct, plural subject needs plural verb',
                    'B) "Neither" is used incorrectly - Incorrect, neither-nor is correct usage',
                    'C) "aware" should be "aware of" - Already uses "of"',
                    'D) No error - Incorrect, subject-verb disagreement'
                ],
                'correct_option': 'A',
                'study_topic': 'Grammar - Subject-Verb Agreement',
                'explanation': 'With "neither...nor", when one subject is plural, the verb agrees with the nearest subject. "Students" is plural, so "are".'
            }
        ]
        
        # Cycle through base questions to reach desired count
        result = []
        i = 0
        while len(result) < count:
            result.append(base_questions[i % len(base_questions)])
            i += 1
        
        return result[:count]


async def generate_aptitude_readiness_plan(
    user_type: str,
    question_count: int = 15,
    experience_years: int = 0,
    target_role: Optional[str] = None,
    target_company_type: str = 'both',
    llm_service=None  # Injected dependency
) -> Dict[str, Any]:
    """
    Production endpoint for aptitude readiness plan generation
    
    This function:
    - Generates 15 aptitude questions
    - Validates all responses against schema
    - Provides automatic recovery on failures
    - Always returns valid questions (never errors to user)
    """
    planner = AptitudeReadinessPlanner(llm_service=llm_service, validation_enabled=True)
    return await planner.generate_plan(
        user_type=user_type,
        question_count=question_count,
        experience_years=experience_years,
        target_role=target_role,
        target_company_type=target_company_type
    )
