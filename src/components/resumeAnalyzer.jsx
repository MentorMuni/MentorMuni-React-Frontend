import React, { useState, useEffect } from 'react';
import { Upload, X, Loader, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { API_BASE } from '../config';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [freeAnalysesRemaining, setFreeAnalysesRemaining] = useState(10);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [analyzeError, setAnalyzeError] = useState(null);

  // Check if user is logged in and their plan
  const isLoggedIn = localStorage.getItem('authToken') !== null;
  const userPlan = localStorage.getItem('userPlan') || 'free'; // 'free' or 'pro'

  const roleOptions = [
    // Core Software Engineering
    { value: 'software-engineer', label: 'Software Engineer' },
    { value: 'backend-developer', label: 'Backend Developer' },
    { value: 'frontend-developer', label: 'Frontend Developer' },
    { value: 'full-stack-developer', label: 'Full Stack Developer' },
    { value: 'mobile-app-developer', label: 'Mobile App Developer' },
    
    // Cloud & Infrastructure
    { value: 'devops-engineer', label: 'DevOps Engineer' },
    { value: 'sre', label: 'Site Reliability Engineer (SRE)' },
    { value: 'cloud-engineer', label: 'Cloud Engineer (AWS/Azure/GCP)' },
    
    // Data & AI
    { value: 'data-analyst', label: 'Data Analyst' },
    { value: 'bi-developer', label: 'BI Developer' },
    { value: 'data-engineer', label: 'Data Engineer' },
    { value: 'data-scientist', label: 'Data Scientist' },
    { value: 'ai-ml-engineer', label: 'AI/ML Engineer' },
    { value: 'gen-ai-engineer', label: 'Generative AI Engineer' },
    
    // Testing & Quality
    { value: 'qa-engineer', label: 'QA Engineer' },
    { value: 'performance-test-engineer', label: 'Performance Test Engineer' },
    
    // Enterprise & Platforms
    { value: 'sap-consultant', label: 'SAP Consultant' },
    { value: 'salesforce-developer', label: 'Salesforce Developer' },
    { value: 'servicenow-developer', label: 'ServiceNow Developer' },
    
    // Security & Emerging Tech
    { value: 'cyber-security-analyst', label: 'Cyber Security Analyst' },
    { value: 'blockchain-developer', label: 'Blockchain Developer' },
    
    // Product & Design
    { value: 'ui-ux-designer', label: 'UI/UX Designer' },
    { value: 'product-manager', label: 'Product Manager' },
    { value: 'business-analyst', label: 'Business Analyst' },
    
    // Hardware & Systems
    { value: 'embedded-systems-engineer', label: 'Embedded Systems Engineer' },
    { value: 'iot-engineer', label: 'IoT Engineer' },
    
    // Custom
    { value: 'custom', label: 'Custom Role' },
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (file) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF and DOCX files are allowed');
      return;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(file);
    setError('');
  };

  const handleRemoveFile = () => {
    setFile(null);
    setResults(null);
  };

  const handleAnalyze = async () => {
    if (!file || !selectedRole) {
      setError('Please select both file and role');
      return;
    }

    // FEATURE 2: Enhanced custom role validation
    let finalRole = selectedRole;
    if (selectedRole === 'custom') {
      const trimmedCustomRole = customRole.trim();
      
      // Validation: minimum 3 characters
      if (trimmedCustomRole.length < 3) {
        setError('Role must be at least 3 characters long');
        return;
      }
      
      // Validation: only letters, spaces, hyphens
      if (!/^[a-zA-Z][a-zA-Z\s\-]*$/.test(trimmedCustomRole)) {
        setError('Role must contain only letters, spaces, and hyphens (e.g., Senior DevOps Engineer)');
        return;
      }
      
      // Validation: reject vague roles
      const vagueRoles = ['job', 'position', 'role', 'work', 'career', 'engineer', 'developer'];
      const normalizedInput = trimmedCustomRole.toLowerCase();
      if (vagueRoles.includes(normalizedInput)) {
        setError(`"${trimmedCustomRole}" is too generic. Please enter a specific role like "Backend Developer" or "DevOps Engineer"`);
        return;
      }
      
      finalRole = trimmedCustomRole;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalyzeError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetRole', selectedRole === 'custom' ? 'custom' : selectedRole);
      
      // Add custom role if selected
      if (selectedRole === 'custom') {
        formData.append('customRole', finalRole);
      }
      
      // Add authentication info if available
      if (localStorage.getItem('authToken')) {
        formData.append('authToken', localStorage.getItem('authToken'));
      }
      formData.append('userPlan', localStorage.getItem('userPlan') || 'free');

      // Call backend API endpoint
      const response = await fetch(`${API_BASE}/api/resume/analyze`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      });

      const data = await response.json();

      // Update free analyses remaining from response
      if (data.data?.free_analyses_remaining !== undefined) {
        setFreeAnalysesRemaining(data.data.free_analyses_remaining);
      }

      // FEATURE 1: Handle FREE_LIMIT_EXHAUSTED error
      if (data.error === 'FREE_LIMIT_EXHAUSTED' || data.error === 'FREE_LIMIT_EXCEEDED') {
        setAnalyzeError({
          type: 'FREE_LIMIT_EXHAUSTED',
          message: data.message || 'You have exhausted your free resume analyses. Please upgrade to continue.'
        });
        setShowUpgradeModal(true);
        throw new Error(data.message || 'Free limit exceeded');
      }

      // Handle RATE_LIMIT_EXCEEDED
      if (data.error === 'RATE_LIMIT_EXCEEDED') {
        setAnalyzeError({
          type: 'RATE_LIMIT_EXCEEDED',
          message: data.message || 'Too many requests. Please wait a moment and try again.'
        });
        throw new Error(data.message || 'Rate limit exceeded');
      }

      // Handle INVALID_CUSTOM_ROLE
      if (data.error === 'INVALID_CUSTOM_ROLE') {
        setAnalyzeError({
          type: 'INVALID_CUSTOM_ROLE',
          message: data.message || 'Please enter a valid job role.'
        });
        throw new Error(data.message || 'Invalid custom role');
      }

      // Handle other errors
      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to analyze resume');
      }

      if (data.success) {
        // Map new API response to results format
        setResults({
          // Core data
          id: data.data.id,
          normalizedRole: data.data.normalized_role || data.data.normalizedRole,
          roleNormalizationConfidence: data.data.role_normalization_confidence || data.data.roleNormalizationConfidence || 0,
          
          // Scores (new)
          overall_score: data.data.overall_score || data.data.atsScore || 0,
          ats_score: data.data.ats_score || data.data.atsScore || 0,
          indian_market_score: data.data.indian_market_score || 0,
          
          // Skills
          matchedSkills: data.data.strong_skills || data.data.matchedSkills || [],
          inferred_skills: data.data.inferred_skills || [],
          missingSkills: data.data.missing_skills || [],
          critical_missing_skills: data.data.critical_missing_skills || [],
          skill_clusters: data.data.skill_clusters || {},
          
          // Analysis
          strength_areas: data.data.strength_areas || [],
          market_gaps: data.data.market_gaps || [],
          improvementSuggestions: data.data.improvement_suggestions || data.data.suggestions || [],
          
          // Legacy fields for backward compatibility
          keywordMatchPercent: data.data.skill_match_percentage || 0,
          summaryMessage: `Your resume matches ${data.data.skill_match_percentage || 0}% of ${data.data.normalized_role || data.data.normalizedRole} job descriptions.`,
          
          // Trial & Premium
          freeAnalysesRemaining: data.data.free_analyses_remaining ?? data.data.freeAnalysesRemaining ?? 10,
          isPremiumUnlocked: data.data.is_premium_unlocked ?? data.data.isPremiumUnlocked ?? false,
          
          // Metadata
          experienceLevel: data.data.experience_level,
          scoreInterpretation: data.data.score_interpretation,
          suspiciousFlag: data.data.suspicious_flag || false
        });
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (err) {
      if (!analyzeError) {
        setError(err.message || 'Failed to analyze resume. Please try again.');
      }
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Mock function - replace with actual API call
  const mockAnalyzeResume = async (file, role) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          atsScore: 72,
          keywordMatchPercent: 65,
          matchedSkills: ['Automation', 'Testing', 'Selenium', 'Java', 'API Testing'],
          missingSkills: ['Cypress', 'RestAssured', 'CI/CD Integration', 'Performance Testing'],
          improvementSuggestions: [
            'Add framework design experience',
            'Include CI/CD pipeline automation examples',
            'Highlight API automation projects using RestAssured',
          ],
          summaryMessage: `Your resume matches 65% of ${role} job descriptions.`,
        });
      }, 2000);
    });
  };

  const isPremiumUnlocked = results?.isPremiumUnlocked || (isLoggedIn && userPlan === 'pro');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back to Learning Paths */}
        <a 
          href="/learning-paths"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold mb-8 transition-colors"
        >
          ← Back to Learning Paths
        </a>

        {/* Header with Free Analyses Counter */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Resume Analyzer
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-4">
            Optimize your resume with AI-powered ATS scoring and keyword matching tailored to your target role.
          </p>
          
          {/* FEATURE 1: Display Free Analyses Remaining */}
          {userPlan === 'free' && (
            <div className="inline-block bg-white/5 border border-cyan-500/30 rounded-lg px-4 py-2 text-sm">
              <span className="text-slate-300">Free Analyses Remaining: </span>
              <span className={freeAnalysesRemaining > 3 ? 'text-cyan-400 font-bold' : 'text-amber-400 font-bold'}>
                {freeAnalysesRemaining}/10
              </span>
            </div>
          )}
        </div>

        {/* Upgrade Modal - FEATURE 1 */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-8 max-w-md w-full">
              <div className="text-center mb-6">
                <AlertCircle size={48} className="mx-auto mb-4 text-amber-400" />
                <h2 className="text-2xl font-bold mb-2">Upgrade to Continue</h2>
                <p className="text-slate-300">
                  You've used your 10 free resume analyses. Upgrade to Pro for unlimited analyses and advanced features.
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    Unlimited resume analyses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    Detailed skill recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    AI-powered suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    Save analysis history
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-semibold transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => window.location.href = '/upgrade'}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:shadow-lg hover:shadow-indigo-500/50 py-3 rounded-lg font-semibold transition-all"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        )}

        {!results ? (
          // Upload & Analyze Section
          <div className="space-y-8">
            {/* Upload Section */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                dragActive
                  ? 'border-indigo-400 bg-indigo-400/10'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              <Upload className="mx-auto mb-4 text-indigo-400" size={40} />
              {!file ? (
                <>
                  <h3 className="text-xl font-bold mb-2">Upload Your Resume</h3>
                  <p className="text-slate-400 mb-4">Drag and drop your PDF or DOCX file here</p>
                  <label className="inline-block">
                    <span className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-semibold cursor-pointer transition-colors">
                      Browse File
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-slate-500 mt-4">Max file size: 5MB (PDF or DOCX only)</p>
                </>
              ) : (
                <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg">
                  <div className="text-left flex-grow">
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-sm text-slate-400">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-red-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Role Selection */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <label className="block text-lg font-bold mb-4">Target Role</label>
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  if (e.target.value !== 'custom') setCustomRole('');
                }}
                className="w-full bg-slate-800 border border-white/20 rounded-lg px-4 py-3 text-white mb-4 focus:outline-none focus:border-indigo-400"
              >
                <option value="">Select a role...</option>
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>

              {selectedRole === 'custom' && (
                <input
                  type="text"
                  placeholder="Enter custom role (e.g., Senior DevOps Engineer)"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full bg-slate-800 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              )}
            </div>

            {/* Error Alert */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-grow">
                  <span className="text-red-200">{error}</span>
                  {analyzeError?.type === 'INVALID_CUSTOM_ROLE' && (
                    <p className="text-xs text-red-300 mt-1">Use only letters, spaces, and hyphens (e.g., Senior DevOps Engineer)</p>
                  )}
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!file || !selectedRole || isAnalyzing}
              className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                !file || !selectedRole || isAnalyzing
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:shadow-lg hover:shadow-indigo-500/50'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  Analyze Resume
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        ) : (
          // Results Section
          <div className="space-y-8">
            {/* Top Info Bar - FEATURE 4: Normalized Role and Confidence */}
            <div className="bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 border border-indigo-400/30 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Analyzing for:</p>
                <p className="text-lg font-bold text-indigo-300">{results.normalizedRole}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Confidence</p>
                <p className="text-lg font-bold text-cyan-300">{(results.roleNormalizationConfidence * 100).toFixed(0)}%</p>
              </div>
              {userPlan === 'free' && (
                <div className="text-right border-l border-indigo-400/30 pl-4">
                  <p className="text-sm text-slate-400">Remaining</p>
                  <p className="text-lg font-bold text-cyan-300">{results.freeAnalysesRemaining}/10</p>
                </div>
              )}
            </div>

            {/* ATS Score */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Overall Score */}
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-2xl p-8 flex flex-col items-center justify-center">
                <div className="text-5xl font-black mb-2">{results.overall_score || results.atsScore}</div>
                <div className="text-sm text-slate-400 mb-4">Overall Score</div>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </div>

              {/* ATS Score Circle */}
              <div className="bg-gradient-to-br from-indigo-600/20 to-cyan-600/20 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center">
                <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      strokeDasharray={`${((results.ats_score || results.atsScore) / 100) * 440} 440`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute text-center">
                    <div className="text-5xl font-black">{results.ats_score || results.atsScore || 0}</div>
                    <div className="text-sm text-slate-400">ATS Score</div>
                  </div>
                </div>
                <p className="text-center text-slate-300 text-sm">
                  ATS Compatibility
                </p>
              </div>

              {/* Indian Market Score */}
              <div className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border border-orange-400/30 rounded-2xl p-8 flex flex-col items-center justify-center">
                <div className="text-5xl font-black mb-2">{results.indian_market_score || 0}</div>
                <div className="text-sm text-slate-400 mb-4">Market Readiness</div>
                <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"></div>
                <p className="text-xs text-slate-400 mt-4 text-center">India Market</p>
              </div>
            </div>

            {/* Skill Match & Summary */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Keyword Match */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Skill Match</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-lg font-semibold">{results.keywordMatchPercent || results.skill_match_percentage || 0}%</span>
                      <span className="text-slate-400">Match Rate</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-3 rounded-full transition-all"
                        style={{ width: `${results.keywordMatchPercent || results.skill_match_percentage || 0}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mt-6">{results.summaryMessage}</p>
                </div>
              </div>

              {/* Experience Level & Interpretation */}
              {results.scoreInterpretation && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-6">Assessment</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Level</p>
                      <p className="text-lg font-semibold text-indigo-300">{results.scoreInterpretation.level}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Recommendation</p>
                      <p className="text-slate-300 text-sm">{results.scoreInterpretation.recommendation}</p>
                    </div>
                    {results.experienceLevel && (
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Experience Level</p>
                        <p className="text-slate-300 text-sm capitalize">{results.experienceLevel}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Matched Skills */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle size={24} className="text-emerald-400" />
                Matched Skills ({results.matchedSkills?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-3">
                {(results.matchedSkills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium border border-emerald-500/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              
              {/* Inferred Skills - Premium */}
              {isPremiumUnlocked && results.inferred_skills && results.inferred_skills.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-cyan-300 mb-3">Inferred Skills (from context)</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.inferred_skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-medium border border-cyan-500/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Strength Areas */}
            {results.strength_areas && results.strength_areas.length > 0 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CheckCircle size={24} className="text-green-400" />
                  Strength Areas
                </h3>
                <div className="space-y-3">
                  {results.strength_areas.map((area, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <p className="text-green-300">{area}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills - Premium Gate */}
            <div className="relative">
              <div
                className={`bg-white/5 border border-white/10 rounded-2xl p-8 ${
                  !isPremiumUnlocked ? 'blur-sm opacity-50' : ''
                }`}
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <AlertCircle size={24} className="text-amber-400" />
                  Missing Skills {isPremiumUnlocked && `(${(results.missingSkills || []).length})`}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {(results.missingSkills || []).length > 0 ? (
                    (results.missingSkills || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full text-sm font-medium border border-amber-500/50"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-400">No critical missing skills detected</p>
                  )}
                </div>
              </div>
              {!isPremiumUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
                  <div className="bg-slate-900/95 border border-indigo-500/50 rounded-xl p-8 text-center max-w-sm">
                    <h4 className="text-lg font-bold mb-2">Unlock Detailed Analysis</h4>
                    <p className="text-slate-300 mb-6 text-sm">
                      Get detailed missing skills with Pro plan
                    </p>
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="bg-gradient-to-r from-indigo-600 to-cyan-600 py-2 px-6 rounded-lg font-bold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
                    >
                      Upgrade to Pro
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Improvement Suggestions - Premium Gate */}
            <div className="relative">
              <div
                className={`bg-white/5 border border-white/10 rounded-2xl p-8 ${
                  !isPremiumUnlocked ? 'blur-sm opacity-50' : ''
                }`}
              >
                <h3 className="text-2xl font-bold mb-6">💡 Improvement Suggestions</h3>
                <ul className="space-y-3">
                  {(results.improvementSuggestions || []).map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-indigo-400 font-bold mt-1">•</span>
                      <span className="text-slate-300">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {!isPremiumUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
                  <div className="bg-slate-900/95 border border-indigo-500/50 rounded-xl p-8 text-center max-w-sm">
                    <h4 className="text-lg font-bold mb-2">Unlock Advanced Insights</h4>
                    <p className="text-slate-300 mb-6 text-sm">
                      Get AI-powered improvement suggestions tailored to your resume
                    </p>
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="bg-gradient-to-r from-indigo-600 to-cyan-600 py-2 px-6 rounded-lg font-bold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
                    >
                      Upgrade to Pro
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Back Button */}
            <button
              onClick={() => setResults(null)}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-lg font-semibold transition-all"
            >
              Analyze Another Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
