import React, { useState } from 'react';
import { FileText, Target, Zap, TrendingUp, AlertCircle, CheckCircle, ArrowRight, Award } from 'lucide-react';

const CareerHealthDashboard = ({ userMetrics = {} }) => {
  const [expandedMetric, setExpandedMetric] = useState(null);

  // Default sample metrics (can be replaced with real user data)
  const metrics = {
    resumeScore: userMetrics.resumeScore || 62,
    missingSkills: userMetrics.missingSkills || ["Python", "SQL", "System Design"],
    interviewLevel: userMetrics.interviewLevel || "Beginner",
    projectsCompleted: userMetrics.projectsCompleted || 2,
    overallScore: userMetrics.overallScore || 58,
    ...userMetrics
  };

  // Calculate overall career health score
  const calculateOverallScore = () => {
    const resumeWeight = metrics.resumeScore * 0.30;
    const interviewWeight = getInterviewLevelScore() * 0.40;
    const projectsWeight = Math.min((metrics.projectsCompleted / 5) * 100, 100) * 0.30;
    return Math.round(resumeWeight + interviewWeight + projectsWeight);
  };

  const overallScore = calculateOverallScore();

  const getInterviewLevelScore = () => {
    const levelScores = {
      "Beginner": 30,
      "Intermediate": 65,
      "Advanced": 90,
      "Expert": 95
    };
    return levelScores[metrics.interviewLevel] || 30;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return { bg: "from-emerald-500 to-teal-500", text: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700" };
    if (score >= 60) return { bg: "from-amber-500 to-orange-500", text: "text-amber-600", badge: "bg-amber-100 text-amber-700" };
    return { bg: "from-orange-500 to-red-500", text: "text-orange-600", badge: "bg-orange-100 text-orange-700" };
  };

  const getLevelColor = (level) => {
    const colors = {
      "Beginner": { bg: "from-orange-400 to-red-500", text: "text-orange-600", badge: "bg-orange-100 text-orange-700" },
      "Intermediate": { bg: "from-amber-400 to-orange-500", text: "text-amber-600", badge: "bg-amber-100 text-amber-700" },
      "Advanced": { bg: "from-emerald-400 to-teal-500", text: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
      "Expert": { bg: "from-[#FF9500] to-purple-600", text: "text-[#FF9500]", badge: "bg-[#FFF4E0] text-[#CC7000]" }
    };
    return colors[level] || colors["Beginner"];
  };

  const getRecommendation = (metric) => {
    const recommendations = {
      resumeScore: metrics.resumeScore < 70 ? "Add quantifiable achievements and metrics to your resume" : "Your resume looks strong! Keep it updated.",
      interviewLevel: metrics.interviewLevel === "Beginner" ? "Start with basic DSA and coding problems on LeetCode" : metrics.interviewLevel === "Intermediate" ? "Practice system design and mock interviews" : "You're ready for senior-level interviews!",
      projectsCompleted: metrics.projectsCompleted < 3 ? "Build 2-3 portfolio projects to showcase your skills" : "Your project portfolio is impressive!",
      missingSkills: metrics.missingSkills.length > 0 ? `Focus on learning ${metrics.missingSkills[0]} next` : "All core skills covered!"
    };
    return recommendations[metric] || "Keep improving!";
  };

  // Circular Progress Component
  const CircularProgress = ({ percentage, size = 120 }) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={45}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={6}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={45}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth={6}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-center">
          <div className="text-3xl font-black text-foreground">{percentage}</div>
          <div className="text-xs font-semibold text-muted-foreground">out of 100</div>
        </div>
      </div>
    );
  };

  const scoreColor = getScoreColor(metrics.resumeScore);
  const interviewColor = getLevelColor(metrics.interviewLevel);
  const overallColor = getScoreColor(overallScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3">
            Career Health Score
          </h1>
          <p className="text-lg text-foreground-muted">
            Track your progress toward becoming job-ready.
          </p>
        </div>

        {/* Overall Score Card */}
        <div className="bg-gradient-to-br from-[#FF9500] to-purple-600 rounded-2xl p-8 md:p-12 text-white mb-12 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <Award className="w-6 h-6" />
                Overall Career Readiness
              </h2>
              <p className="text-indigo-100 mb-6 max-w-lg">
                Your overall score is based on resume strength, technical interview readiness, and project portfolio. Keep improving!
              </p>
              <div className="flex items-center gap-4">
                <button className="px-6 py-3 bg-white text-[#FF9500] font-bold rounded-lg hover:bg-[#FFF4E0] transition-all">
                  View Improvement Plan
                </button>
                <button className="px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all">
                  Take Assessment
                </button>
              </div>
            </div>
            <div className="flex-shrink-0">
              <CircularProgress percentage={overallScore} size={150} />
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Resume Score Card */}
          <div
            className="bg-white rounded-xl shadow-md p-8 border-2 border-slate-200 hover:border-[#FFB347] hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setExpandedMetric(expandedMetric === 'resume' ? null : 'resume')}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Resume Score</h3>
              <FileText className="w-6 h-6 text-[#FF9500]" />
            </div>

            <div className="mb-6">
              <div className="text-4xl font-black text-foreground mb-2">
                {metrics.resumeScore}
                <span className="text-2xl text-muted-foreground"> / 100</span>
              </div>
              <p className="text-sm text-foreground-muted mb-4">
                How strong your resume is compared to industry expectations.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${scoreColor.bg} transition-all duration-1000 rounded-full`}
                  style={{ width: `${metrics.resumeScore}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-muted-foreground font-medium">0</span>
                <span className={`text-xs font-bold ${scoreColor.text}`}>
                  {metrics.resumeScore >= 80 ? "Excellent" : metrics.resumeScore >= 60 ? "Good" : "Needs Work"}
                </span>
                <span className="text-xs text-muted-foreground font-medium">100</span>
              </div>
            </div>

            {expandedMetric === 'resume' && (
              <div className="pt-6 border-t border-slate-200">
                <p className="text-sm text-foreground-muted mb-4">
                  <strong>Recommendation:</strong> {getRecommendation('resumeScore')}
                </p>
                <button className="w-full px-4 py-2 text-sm bg-[#FFF4E0] text-[#FF9500] font-semibold rounded-lg hover:bg-[#FFF4E0] transition-all flex items-center justify-center gap-2">
                  <span>Improve Resume</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Skill Gap Card */}
          <div
            className="bg-white rounded-xl shadow-md p-8 border-2 border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setExpandedMetric(expandedMetric === 'skills' ? null : 'skills')}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Skill Gaps</h3>
              <Target className="w-6 h-6 text-purple-600" />
            </div>

            <div className="mb-6">
              <div className="text-2xl font-black text-foreground mb-3">
                {metrics.missingSkills.length} skills
              </div>
              <p className="text-sm text-foreground-muted mb-4">
                Key skills missing from your profile.
              </p>
            </div>

            {/* Skills Tags */}
            <div className="mb-6 flex flex-wrap gap-2">
              {metrics.missingSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>

            {expandedMetric === 'skills' && (
              <div className="pt-6 border-t border-slate-200">
                <p className="text-sm text-foreground-muted mb-4">
                  <strong>Recommendation:</strong> {getRecommendation('missingSkills')}
                </p>
                <button className="w-full px-4 py-2 text-sm bg-purple-50 text-purple-600 font-semibold rounded-lg hover:bg-purple-100 transition-all flex items-center justify-center gap-2">
                  <span>Learn Skills</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Interview Readiness Card */}
          <div
            className="bg-white rounded-xl shadow-md p-8 border-2 border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setExpandedMetric(expandedMetric === 'interview' ? null : 'interview')}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Interview Ready</h3>
              <Zap className="w-6 h-6 text-orange-600" />
            </div>

            <div className="mb-6">
              <div className={`text-3xl font-black mb-2 ${interviewColor.text}`}>
                {metrics.interviewLevel}
              </div>
              <p className="text-sm text-foreground-muted mb-4">
                Your current readiness for technical interviews.
              </p>
            </div>

            {/* Level Indicator */}
            <div className="mb-6">
              <div className="flex gap-2">
                {["Beginner", "Intermediate", "Advanced", "Expert"].map((level, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      ["Beginner", "Intermediate", "Advanced", "Expert"].indexOf(metrics.interviewLevel) >= idx
                        ? `bg-gradient-to-r ${interviewColor.bg}`
                        : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground font-medium">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
            </div>

            {expandedMetric === 'interview' && (
              <div className="pt-6 border-t border-slate-200">
                <p className="text-sm text-foreground-muted mb-4">
                  <strong>Next Steps:</strong> {getRecommendation('interviewLevel')}
                </p>
                <button className="w-full px-4 py-2 text-sm bg-orange-50 text-orange-600 font-semibold rounded-lg hover:bg-orange-100 transition-all flex items-center justify-center gap-2">
                  <span>Practice Interviews</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Projects & Portfolio Section */}
        <div className="bg-white rounded-xl shadow-md p-8 border-2 border-slate-200 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">Portfolio & Projects</h3>
            <TrendingUp className="w-6 h-6 text-[#FF9500]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-[#FFF4E0] rounded-lg">
              <div className="text-4xl font-black text-[#FF9500] mb-2">
                {metrics.projectsCompleted}
              </div>
              <p className="text-sm text-foreground-muted font-medium">Projects Completed</p>
              <p className="text-xs text-muted-foreground mt-2">Target: 5 projects</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-4xl font-black text-purple-600 mb-2">
                3
              </div>
              <p className="text-sm text-foreground-muted font-medium">GitHub Repositories</p>
              <p className="text-xs text-muted-foreground mt-2">Public portfolio</p>
            </div>

            <div className="text-center p-6 bg-amber-50 rounded-lg">
              <div className="text-4xl font-black text-amber-600 mb-2">
                12
              </div>
              <p className="text-sm text-foreground-muted font-medium">Contributions</p>
              <p className="text-xs text-muted-foreground mt-2">Open source activity</p>
            </div>
          </div>

          <p className="text-sm text-foreground-muted mt-6 p-4 bg-slate-50 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <span><strong>Recommendation:</strong> Build 2-3 more projects to reach your portfolio goal and make yourself more competitive.</span>
          </p>
        </div>

        {/* Call-to-Action Section */}
        <div className="bg-gradient-to-r from-[#FF9500] to-purple-600 rounded-xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Improve Your Score?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Use our platform tools to strengthen your profile, learn missing skills, and prepare for interviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#FF9500] font-bold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 active:scale-95"
            >
              <span>Resume Analyzer</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Mock Interview
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerHealthDashboard;
