import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TrendingUp, Target, Zap, ArrowRight, AlertCircle, Loader, RefreshCw } from 'lucide-react';
import { API_BASE } from '../config';
import AIAnalysisLoader from './AIAnalysisLoader';
import FreeUsageCounter, { useFreeUsageTracker } from './FreeUsageCounter';
import UpgradePromptModal from './UpgradePromptModal';
import GapSummaryCard from './SkillGap/GapSummaryCard';
import MissingSkillsSection from './SkillGap/MissingSkillsSection';
import RecommendedCoursesSection from './SkillGap/RecommendedCoursesSection';
import TransitionRoadmapTimeline from './SkillGap/TransitionRoadmapTimeline';
import MonetizationOffer from './SkillGap/MonetizationOffer';

/**
 * SkillGapAnalyzer Component
 * Handles role selection, skill gap analysis, and career transition roadmap
 * 
 * Architecture:
 * - Fetches roles from centralized /api/roles endpoint
 * - Validates role selection (prevents same role duplication)
 * - Posts analysis to /api/skill-gap/analyze
 * - Renders results with 4 analysis sections
 */
const SkillGapAnalyzer = () => {
  // Initialize free usage tracker and modal
  const { incrementUsage, getUsageInfo } = useFreeUsageTracker('skill_gap_analyzer');
  
  // ==================== STATE ====================
  const [formData, setFormData] = useState({
    current_role: '',
    target_role: '',
    experience_years: 1,
    resume_text: '',
    self_skills: [],
  });

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [formStep, setFormStep] = useState(0);
  const [skillInput, setSkillInput] = useState('');

  // Fallback roles in case API fails
  const FALLBACK_ROLES = [
    { id: 'frontend_developer', display_name: 'Frontend Developer', category: 'Engineering' },
    { id: 'backend_developer', display_name: 'Backend Developer', category: 'Engineering' },
    { id: 'fullstack_developer', display_name: 'Full Stack Developer', category: 'Engineering' },
    { id: 'qa_engineer', display_name: 'QA Engineer', category: 'QA' },
    { id: 'automation_qa_engineer', display_name: 'Automation Test Engineer', category: 'QA' },
    { id: 'devops_engineer', display_name: 'DevOps Engineer', category: 'Infrastructure' },
    { id: 'data_engineer', display_name: 'Data Engineer', category: 'Data' },
    { id: 'data_scientist', display_name: 'Data Scientist', category: 'Data' },
    { id: 'ai_ml_engineer', display_name: 'AI/ML Engineer', category: 'AI/ML' },
  ];

  // ==================== FETCH ROLES ====================
  const fetchRoles = useCallback(async () => {
    try {
      setRolesLoading(true);
      setRolesError(null);
      
      const response = await fetch(`${API_BASE}/api/roles`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.roles && Array.isArray(data.roles) && data.roles.length > 0) {
        setRoles(data.roles);
        console.log(`✓ Loaded ${data.roles.length} roles`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Failed to fetch roles:', err);
      setRolesError(err.message);
      // Use fallback roles
      setRoles(FALLBACK_ROLES);
      console.warn(`⚠ Using ${FALLBACK_ROLES.length} fallback roles`);
    } finally {
      setRolesLoading(false);
    }
  }, []);

  // Fetch roles on mount
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // ==================== FORM HANDLERS ====================

  // ==================== FORM HANDLERS ====================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null); // Clear error when user inputs
  };

  const handleAddSkill = useCallback(() => {
    const trimmedSkill = skillInput.trim();
    
    if (!trimmedSkill) return;
    if (formData.self_skills.includes(trimmedSkill)) {
      setError('This skill is already added');
      return;
    }

    setFormData(prev => ({
      ...prev,
      self_skills: [...prev.self_skills, trimmedSkill]
    }));
    setSkillInput('');
    setError(null);
  }, [skillInput, formData.self_skills]);

  const handleRemoveSkill = useCallback((skill) => {
    setFormData(prev => ({
      ...prev,
      self_skills: prev.self_skills.filter(s => s !== skill)
    }));
  }, []);

  // ==================== VALIDATION ====================
  const validationErrors = useMemo(() => {
    const errors = [];

    if (!formData.current_role) {
      errors.push('Please select your current role');
    }

    if (!formData.target_role) {
      errors.push('Please select your target role');
    }

    if (formData.current_role && formData.target_role && formData.current_role === formData.target_role) {
      errors.push('Current and target roles must be different');
    }

    if (formData.experience_years < 0 || formData.experience_years > 50) {
      errors.push('Years of experience must be between 0 and 50');
    }

    return errors;
  }, [formData.current_role, formData.target_role, formData.experience_years]);

  const isFormValid = validationErrors.length === 0;

  // ==================== ANALYSIS ====================
  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setError(validationErrors[0]);
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);

      // Find role display names for API payload
      const currentRoleObj = roles.find(r => r.id === formData.current_role);
      const targetRoleObj = roles.find(r => r.id === formData.target_role);

      const payload = {
        current_role: currentRoleObj?.display_name || formData.current_role,
        target_role: targetRoleObj?.display_name || formData.target_role,
        experience_years: parseInt(formData.experience_years, 10),
        resume_text: formData.resume_text.trim(),
        self_skills: formData.self_skills,
      };

      console.log('Sending analysis request:', payload);

      const response = await fetch(`${API_BASE}/api/skill-gap/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setAnalysisResult(data.data);
        setFormStep(2);
        
        // Increment free usage tracker and check if limit reached
        const { isLimitReached } = incrementUsage();
        if (isLimitReached) {
          setShowUpgradeModal(true);
        }
        console.log('✓ Analysis completed');
      } else {
        setError(data.error || 'Analysis failed. Please try again.');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Cannot connect to analysis server. Make sure Flask backend is running.');
      } else {
        setError(err.message || 'Analysis failed. Please check your connection.');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  // ==================== UI: Intro Section ====================
  const IntroSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">


        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp size={40} className="text-emerald-400" />
            <h1 className="text-5xl font-bold">Skill Gap Analyzer</h1>
          </div>
          <p className="text-xl text-slate-300">
            Find your gap and chart your path to your next role
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-800/50 backdrop-blur p-8 rounded-2xl border border-slate-700 hover:border-emerald-500 transition-colors">
            <Target size={32} className="text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Analyze Your Gap</h3>
            <p className="text-slate-400">
              Compare your current role with your target role to identify skill gaps
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur p-8 rounded-2xl border border-slate-700 hover:border-emerald-500 transition-colors">
            <Zap size={32} className="text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Recommended Courses</h3>
            <p className="text-slate-400">
              Get personalized course recommendations to bridge your skill gaps
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur p-8 rounded-2xl border border-slate-700 hover:border-emerald-500 transition-colors">
            <TrendingUp size={32} className="text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Transition Roadmap</h3>
            <p className="text-slate-400">
              Follow a structured 4-phase roadmap to reach your career goal
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 p-1 rounded-2xl">
          <div className="bg-slate-900 p-12 rounded-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transition?</h2>
            <p className="text-slate-300 mb-8">
              Whether you want to switch from QA to Automation, Testing to Development, 
              or explore AI Engineering, we'll show you exactly what you need to learn
            </p>
            <button
              onClick={() => setFormStep(1)}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
            >
              Start Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ==================== UI: FORM SECTION ====================
  const FormSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12">
      <div className="max-w-2xl mx-auto px-6">
        <button
          onClick={() => setFormStep(0)}
          className="text-emerald-400 hover:text-emerald-300 font-semibold mb-8 flex items-center gap-2"
        >
          ← Back
        </button>

        <div className="bg-slate-800/50 backdrop-blur p-8 rounded-2xl border border-slate-700">
          <h2 className="text-3xl font-bold mb-6">Skill Gap Analysis</h2>

          {/* Free Usage Counter */}
          <div className="mb-6 p-4 bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 border border-indigo-500/30 rounded-lg">
            <FreeUsageCounter
              toolName="skill_gap_analyzer"
              onLimitReached={() => setShowUpgradeModal(true)}
              compact={false}
            />
          </div>

          {/* Roles Loading Error Banner */}
          {rolesError && (
            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-yellow-200 font-semibold">Using fallback roles</p>
                <p className="text-yellow-300 text-sm">{rolesError} - Showing sample roles instead</p>
              </div>
              <button
                onClick={fetchRoles}
                className="text-yellow-300 hover:text-yellow-200 transition-colors"
                title="Retry loading roles"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          )}

          {/* Form Error Banner */}
          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* Roles Loading State */}
          {rolesLoading && (
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 mb-6 flex gap-3 items-center">
              <Loader size={20} className="text-emerald-400 animate-spin" />
              <p className="text-slate-300">Loading available roles...</p>
            </div>
          )}

          <form onSubmit={handleAnalyze} className="space-y-6">
            {/* Current Role Dropdown */}
            <div>
              <label htmlFor="current_role" className="block text-sm font-semibold mb-2">
                Current Role <span className="text-red-400">*</span>
              </label>
              <select
                id="current_role"
                name="current_role"
                value={formData.current_role}
                onChange={handleInputChange}
                disabled={rolesLoading}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <option value="">
                  {rolesLoading ? 'Loading roles...' : 'Select your current role...'}
                </option>
                {roles.map(role => (
                  <option 
                    key={role.id} 
                    value={role.id}
                    disabled={role.id === formData.target_role && formData.target_role}
                  >
                    {role.display_name}
                    {role.category ? ` (${role.category})` : ''}
                  </option>
                ))}
              </select>
              {formData.current_role === formData.target_role && formData.target_role && (
                <p className="text-yellow-400 text-sm mt-2">⚠ Cannot select the same role as current</p>
              )}
            </div>

            {/* Target Role Dropdown */}
            <div>
              <label htmlFor="target_role" className="block text-sm font-semibold mb-2">
                Target Role <span className="text-red-400">*</span>
              </label>
              <select
                id="target_role"
                name="target_role"
                value={formData.target_role}
                onChange={handleInputChange}
                disabled={rolesLoading}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <option value="">
                  {rolesLoading ? 'Loading roles...' : 'Select your target role...'}
                </option>
                {roles.map(role => (
                  <option 
                    key={role.id} 
                    value={role.id}
                    disabled={role.id === formData.current_role && formData.current_role}
                  >
                    {role.display_name}
                    {role.category ? ` (${role.category})` : ''}
                  </option>
                ))}
              </select>
              {formData.current_role === formData.target_role && formData.target_role && (
                <p className="text-yellow-400 text-sm mt-2">⚠ Cannot select the same role as target</p>
              )}
            </div>

            {/* Experience Years */}
            <div>
              <label htmlFor="experience_years" className="block text-sm font-semibold mb-2">
                Years of Experience <span className="text-red-400">*</span>
              </label>
              <input
                id="experience_years"
                type="number"
                name="experience_years"
                min="0"
                max="50"
                value={formData.experience_years}
                onChange={handleInputChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors"
              />
              <p className="text-slate-400 text-sm mt-1">0-50 years</p>
            </div>

            {/* Skills Input */}
            <div>
              <label htmlFor="skill-input" className="block text-sm font-semibold mb-2">
                Your Skills <span className="text-slate-500">(Optional)</span>
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  id="skill-input"
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="e.g., React, JavaScript, Node.js..."
                  autoComplete="off"
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleAddSkill();
                    setTimeout(() => document.getElementById('skill-input')?.focus(), 0);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  disabled={!skillInput.trim()}
                >
                  Add
                </button>
              </div>

              {/* Skills Tags */}
              {formData.self_skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.self_skills.map(skill => (
                    <div
                      key={skill}
                      className="bg-emerald-600/30 border border-emerald-600 rounded-full px-3 py-1 text-sm flex items-center gap-2 animate-in fade-in-50 duration-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-red-400 font-bold ml-1 transition-colors"
                        aria-label={`Remove ${skill}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {formData.self_skills.length > 0 && (
                <p className="text-slate-400 text-sm mt-2">
                  {formData.self_skills.length} skill(s) added
                </p>
              )}
            </div>

            {/* Resume Text */}
            <div>
              <label htmlFor="resume_text" className="block text-sm font-semibold mb-2">
                Resume Text <span className="text-slate-500">(Optional)</span>
              </label>
              <textarea
                id="resume_text"
                name="resume_text"
                value={formData.resume_text}
                onChange={handleInputChange}
                placeholder="Paste your resume text here for skill extraction..."
                rows="4"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors resize-none"
              />
              <p className="text-slate-400 text-sm mt-1">
                Helps us extract your existing skills
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={analyzing || !isFormValid || rolesLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              title={!isFormValid ? validationErrors[0] : 'Analyze your skill gap'}
            >
              {analyzing ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze My Gap
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // ==================== UI: Results Section ====================
  const ResultsSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <button
          onClick={() => {
            setFormStep(0);
            setAnalysisResult(null);
          }}
          className="text-emerald-400 hover:text-emerald-300 font-semibold mb-8 flex items-center gap-2"
        >
          ← New Analysis
        </button>

        {analysisResult && (
          <div className="space-y-8">
            {analysisResult.gap_summary && (
              <GapSummaryCard summary={analysisResult.gap_summary} />
            )}
            {analysisResult.missing_skills && (
              <MissingSkillsSection skills={analysisResult.missing_skills} />
            )}
            {analysisResult.recommended_courses && (
              <RecommendedCoursesSection courses={analysisResult.recommended_courses} />
            )}
            {analysisResult.roadmap && (
              <TransitionRoadmapTimeline roadmap={analysisResult.roadmap} />
            )}
            {analysisResult.monetization_offer && (
              <MonetizationOffer offer={analysisResult.monetization_offer} />
            )}
          </div>
        )}
      </div>
    </div>
  );

  // ==================== RENDER ====================
  if (formStep === 0) return <IntroSection />;
  if (formStep === 1) {
    if (analyzing) {
      return (
        <AIAnalysisLoader
          onComplete={() => {
            // Loader completes, results will be displayed automatically
          }}
          duration={4000}
        />
      );
    }
    return <FormSection />;
  }
  if (formStep === 2) {
    return (
      <>
        <ResultsSection />
        <UpgradePromptModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          toolName="Skill Gap Analyzer"
        />
      </>
    );
  }
};

export default SkillGapAnalyzer;
