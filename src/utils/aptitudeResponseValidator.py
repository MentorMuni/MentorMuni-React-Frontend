"""
Production-Ready Aptitude Questions Response Validator
Ensures all LLM responses meet schema requirements before returning to clients
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class ValidationLevel(Enum):
    STRICT = "strict"  # Fail if any validation fails
    LENIENT = "lenient"  # Fix issues automatically
    HYBRID = "hybrid"  # Fix what we can, fail on critical


@dataclass
class ValidationResult:
    is_valid: bool
    errors: List[str]
    warnings: List[str]
    fixed_item: Optional[Dict[str, Any]] = None
    fix_applied: bool = False


class AptitudeQuestionValidator:
    """
    Validates and fixes aptitude question responses from LLM
    Ensures 100% schema compliance before returning to clients
    """
    
    REQUIRED_FIELDS = {'question', 'question_type', 'options', 'correct_option', 'study_topic', 'explanation'}
    MIN_EXPLANATION_LENGTH = 10
    MIN_OPTION_LENGTH = 20
    MIN_QUESTION_LENGTH = 10
    VALID_QUESTION_TYPES = {'multiple_choice', 'mcq'}
    VALID_OPTIONS = {'A', 'B', 'C', 'D'}
    
    def __init__(self, level: ValidationLevel = ValidationLevel.HYBRID):
        self.level = level
        self.stats = {
            'total_validated': 0,
            'passed': 0,
            'fixed': 0,
            'failed': 0,
            'errors': []
        }
    
    def validate_single(self, item: Dict[str, Any]) -> ValidationResult:
        """Validate a single question item"""
        errors = []
        warnings = []
        fixed_item = item.copy()
        fix_applied = False
        
        # Check for missing required fields
        missing_fields = self.REQUIRED_FIELDS - set(item.keys())
        if missing_fields:
            error_msg = f"Missing fields: {missing_fields}"
            errors.append(error_msg)
            
            # Attempt to fix missing fields
            for field in missing_fields:
                if field == 'explanation' and self.level in [ValidationLevel.LENIENT, ValidationLevel.HYBRID]:
                    study_topic = item.get('study_topic', 'the concept')
                    fixed_item['explanation'] = f"This question tests your understanding of {study_topic}."
                    fix_applied = True
                    warnings.append(f"Generated default explanation for missing field")
        
        # Validate question length
        question = fixed_item.get('question', '')
        if len(question) < self.MIN_QUESTION_LENGTH:
            errors.append(f"Question too short: {len(question)} chars, min {self.MIN_QUESTION_LENGTH}")
        
        # Validate question_type
        question_type = fixed_item.get('question_type', '').lower()
        if question_type not in self.VALID_QUESTION_TYPES:
            if self.level in [ValidationLevel.LENIENT, ValidationLevel.HYBRID]:
                fixed_item['question_type'] = 'multiple_choice'
                fix_applied = True
                warnings.append("Fixed invalid question_type to 'multiple_choice'")
            else:
                errors.append(f"Invalid question_type: {question_type}")
        
        # Validate options
        options = fixed_item.get('options', [])
        if not isinstance(options, list) or len(options) != 4:
            errors.append(f"Options must be list of 4 items, got {len(options) if isinstance(options, list) else 'not a list'}")
        else:
            fixed_options = []
            for i, opt in enumerate(options):
                if not isinstance(opt, str):
                    opt = str(opt)
                
                if len(opt) < self.MIN_OPTION_LENGTH:
                    if self.level in [ValidationLevel.LENIENT, ValidationLevel.HYBRID]:
                        opt = f"{opt} (option for {fixed_item.get('study_topic', 'this question')})"
                        fix_applied = True
                        warnings.append(f"Extended option {i+1} to meet minimum length")
                    else:
                        errors.append(f"Option {i+1} too short: '{opt}'")
                
                fixed_options.append(opt)
            
            if fixed_options:
                fixed_item['options'] = fixed_options
        
        # Validate correct_option
        correct_option = fixed_item.get('correct_option', '').upper()
        if correct_option not in self.VALID_OPTIONS:
            if self.level in [ValidationLevel.LENIENT, ValidationLevel.HYBRID]:
                fixed_item['correct_option'] = 'A'
                fix_applied = True
                warnings.append("Set correct_option to 'A' (invalid value provided)")
            else:
                errors.append(f"Invalid correct_option: {correct_option}, must be A/B/C/D")
        else:
            fixed_item['correct_option'] = correct_option
        
        # Validate study_topic
        study_topic = fixed_item.get('study_topic', '')
        if not study_topic or len(study_topic) < 3:
            if self.level in [ValidationLevel.LENIENT, ValidationLevel.HYBRID]:
                fixed_item['study_topic'] = 'General Knowledge'
                fix_applied = True
                warnings.append("Set study_topic to default")
            else:
                errors.append(f"Invalid study_topic: {study_topic}")
        
        # Validate explanation
        explanation = fixed_item.get('explanation', '')
        if len(explanation) < self.MIN_EXPLANATION_LENGTH:
            if self.level in [ValidationLevel.LENIENT, ValidationLevel.HYBRID]:
                study_topic = fixed_item.get('study_topic', 'this concept')
                correct_opt = fixed_item.get('correct_option', 'A')
                fixed_item['explanation'] = f"The correct answer is {correct_opt}. This tests your knowledge of {study_topic}."
                fix_applied = True
                warnings.append(f"Generated explanation (was {len(explanation)} chars, min {self.MIN_EXPLANATION_LENGTH})")
            else:
                errors.append(f"Explanation too short: {len(explanation)} chars, min {self.MIN_EXPLANATION_LENGTH}")
        
        is_valid = len(errors) == 0
        
        self.stats['total_validated'] += 1
        if is_valid:
            self.stats['passed'] += 1
        elif fix_applied:
            self.stats['fixed'] += 1
        else:
            self.stats['failed'] += 1
            self.stats['errors'].extend(errors)
        
        return ValidationResult(
            is_valid=is_valid or (fix_applied and self.level != ValidationLevel.STRICT),
            errors=errors,
            warnings=warnings,
            fixed_item=fixed_item if (is_valid or fix_applied) else None,
            fix_applied=fix_applied
        )
    
    def validate_batch(self, items: List[Dict[str, Any]]) -> tuple[List[Dict[str, Any]], List[str]]:
        """
        Validate and fix a batch of questions
        Returns: (validated_items, error_messages)
        """
        validated_items = []
        critical_errors = []
        
        for idx, item in enumerate(items):
            result = self.validate_single(item)
            
            if result.is_valid:
                validated_items.append(result.fixed_item or item)
            elif result.fix_applied and self.level != ValidationLevel.STRICT:
                validated_items.append(result.fixed_item)
                for warning in result.warnings:
                    logger.warning(f"Q{idx+1}: {warning}")
            else:
                error_msg = f"Question {idx+1}: {'; '.join(result.errors)}"
                critical_errors.append(error_msg)
                logger.error(error_msg)
                
                # In HYBRID mode, still try to return a default
                if self.level == ValidationLevel.HYBRID:
                    default_item = self._create_default_question()
                    validated_items.append(default_item)
                    logger.warning(f"Q{idx+1}: Using default question template")
        
        return validated_items, critical_errors
    
    @staticmethod
    def _create_default_question() -> Dict[str, Any]:
        """Create a valid but generic question when validation fails"""
        return {
            'question': 'What is the primary goal of this assessment?',
            'question_type': 'multiple_choice',
            'options': [
                'A) To assess your current knowledge and skills - Assessment',
                'B) To provide entertainment and fun activities - Entertainment',
                'C) To identify areas for improvement - Development',
                'D) To rank you against other students - Comparison'
            ],
            'correct_option': 'A',
            'study_topic': 'Assessment Fundamentals',
            'explanation': 'Assessments are designed to measure current knowledge and identify areas for skill development and improvement.'
        }
    
    def get_stats(self) -> Dict[str, Any]:
        """Return validation statistics"""
        total = self.stats['total_validated']
        return {
            'total': total,
            'passed': self.stats['passed'],
            'fixed': self.stats['fixed'],
            'failed': self.stats['failed'],
            'success_rate': (self.stats['passed'] / total * 100) if total > 0 else 0,
            'fix_rate': (self.stats['fixed'] / total * 100) if total > 0 else 0,
            'errors': self.stats['errors'][:10]  # Last 10 errors
        }


class AptitudeResponseNormalizer:
    """
    Normalizes LLM responses to match expected schema
    Handles various LLM output formats
    """
    
    @staticmethod
    def normalize(raw_response: Any) -> List[Dict[str, Any]]:
        """
        Convert various LLM response formats to standard format
        """
        if isinstance(raw_response, str):
            import json
            try:
                raw_response = json.loads(raw_response)
            except:
                logger.error("Failed to parse LLM response as JSON")
                return []
        
        if isinstance(raw_response, dict):
            # Handle wrapped responses
            if 'evaluation_plan' in raw_response:
                raw_response = raw_response['evaluation_plan']
            elif 'questions' in raw_response:
                raw_response = raw_response['questions']
            elif 'plan' in raw_response:
                raw_response = raw_response['plan']
            else:
                raw_response = [raw_response]
        
        if not isinstance(raw_response, list):
            logger.warning(f"Expected list of questions, got {type(raw_response)}")
            return []
        
        return raw_response


def validate_aptitude_response(
    response_data: Any,
    expected_count: int = 15,
    validation_level: ValidationLevel = ValidationLevel.HYBRID
) -> tuple[List[Dict[str, Any]], bool, str]:
    """
    Production-ready function to validate aptitude response
    
    Args:
        response_data: Raw LLM response
        expected_count: Expected number of questions
        validation_level: How strict to be with validation
    
    Returns:
        (validated_questions, is_success, error_message)
    """
    try:
        # Normalize response format
        normalized = AptitudeResponseNormalizer.normalize(response_data)
        
        if not normalized:
            return [], False, "No questions in response"
        
        # Validate batch
        validator = AptitudeQuestionValidator(level=validation_level)
        validated, errors = validator.validate_batch(normalized)
        
        # Check if we have enough valid questions
        if len(validated) < expected_count:
            shortage = expected_count - len(validated)
            logger.warning(f"Only {len(validated)} questions generated, need {expected_count}")
            
            # Fill with defaults if in HYBRID mode
            if validation_level == ValidationLevel.HYBRID:
                while len(validated) < expected_count:
                    validated.append(validator._create_default_question())
                    logger.info(f"Added default question {len(validated)}/{expected_count}")
        
        # Log stats
        stats = validator.get_stats()
        logger.info(f"Validation stats: {stats}")
        
        # Return result
        success = len(errors) == 0
        error_msg = "; ".join(errors) if errors else ""
        
        return validated[:expected_count], success, error_msg
        
    except Exception as e:
        logger.error(f"Exception in validate_aptitude_response: {str(e)}", exc_info=True)
        return [], False, f"Validation error: {str(e)}"
