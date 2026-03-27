import React, { Suspense, lazy } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar";
import HomePage from "./components/homepage";
import "./index.css";

// Lazy-load all other pages so only Home + Navbar load on first visit
const InterviewReady = lazy(() => import("./components/interviewready"));
const OutcomesPage = lazy(() => import("./components/outcomes"));
const Pricing   = lazy(() => import("./components/pricing"));
const Waitlist  = lazy(() => import("./components/waitlist"));
const ResultPage = lazy(() => import("./components/result"));
const MentorDashboard = lazy(() => import("./components/mentordashboard"));
const HowItWorks = lazy(() => import("./components/HowItWorks"));
const Tools = lazy(() => import("./components/Tools"));
const Mentorship = lazy(() => import("./components/Mentorship"));
const Mentors    = lazy(() => import("./components/Mentors"));
const JavaTutorial = lazy(() => import("./components/javaTutorial"));
const SqlTutorial = lazy(() => import("./components/sqlTutorial"));
const PythonTutorial = lazy(() => import("./components/pythonTutorial"));
const GenerativeAITutorial = lazy(() => import("./components/generativeAITutorial"));
const PromptEngineeringMasterclass = lazy(() => import("./components/promptEngineeringMasterclass"));
const RAGSystemsTutorial = lazy(() => import("./components/ragSystemsTutorial"));
const QuantumComputingTutorial = lazy(() => import("./components/quantumComputingTutorial"));
const DevOpsRoadmap = lazy(() => import("./components/devopsRoadmap"));
const MockInterviews = lazy(() => import("./components/mockInterviews"));
const SkillGapAnalyzer = lazy(() => import("./components/skillGapAnalyzer"));
const ForRecruiters = lazy(() => import("./components/forRecruiters"));
const LearningPaths = lazy(() => import("./components/learningPaths"));
const PlacementTracks = lazy(() => import("./components/placementTracks"));
const FreeTutorials = lazy(() => import("./components/freeTutorials"));
const ResumeAnalyzer = lazy(() => import("./components/resumeAnalyzer"));
const ContactPage = lazy(() => import("./components/contactPage"));
const DesignSystemDemo = lazy(() => import("./components/DesignSystemDemo"));
const CareerHealthDashboard = lazy(() => import("./components/CareerHealthDashboard"));
const AIToolsKnowledgeBase = lazy(() => import("./components/AIToolsKnowledgeBase"));
const InterviewReadinessToolsPage = lazy(() => import("./components/InterviewReadinessToolsPage"));

function PageFallback() {
  return <div className="min-h-[60vh] bg-background" />;
}

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-background text-foreground-muted">
        <Navbar />
        <main className="flex-grow relative z-0">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              {/* Specific /tools/* routes must be listed before /tools so they match first */}
              <Route path="/tools/interview-readiness" element={<InterviewReadinessToolsPage />} />
              <Route path="/interview-readiness-tools" element={<InterviewReadinessToolsPage />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/mentors" element={<Mentors />} />
              <Route path="/start-assessment" element={<InterviewReady />} />
              <Route path="/readiness" element={<InterviewReady />} />
              <Route path="/interview-ready" element={<InterviewReady />} />
              <Route path="/learning-paths" element={<LearningPaths />} />
              <Route path="/placement-tracks" element={<PlacementTracks />} />
              <Route path="/free-tutorials" element={<FreeTutorials />} />
              <Route path="/mock-interviews" element={<MockInterviews />} />
              <Route path="/skill-gap-analyzer" element={<SkillGapAnalyzer />} />
              <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
              <Route path="/success-stories" element={<OutcomesPage />} />
              <Route path="/outcomes" element={<OutcomesPage />} />
              <Route path="/upgrade" element={<Pricing />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/waitlist" element={<Waitlist />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/for-recruiters" element={<ForRecruiters />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/dashboard" element={<MentorDashboard />} />
              <Route path="/java-tutorial" element={<JavaTutorial />} />
              <Route path="/java-for-beginners" element={<JavaTutorial />} />
              <Route path="/sql-tutorial" element={<SqlTutorial />} />
              <Route path="/sql-for-beginners" element={<SqlTutorial />} />
              <Route path="/python-tutorial" element={<PythonTutorial />} />
              <Route path="/python-for-beginners" element={<PythonTutorial />} />
              <Route path="/generative-ai-tutorial" element={<GenerativeAITutorial />} />
              <Route path="/tutorials/generative-ai-for-beginners" element={<GenerativeAITutorial />} />
              <Route path="/prompt-engineering" element={<PromptEngineeringMasterclass />} />
              <Route path="/courses/prompt-engineering-masterclass" element={<PromptEngineeringMasterclass />} />
              <Route path="/rag-systems" element={<RAGSystemsTutorial />} />
              <Route path="/courses/rag-systems" element={<RAGSystemsTutorial />} />
              <Route path="/quantum-computing" element={<QuantumComputingTutorial />} />
              <Route path="/courses/quantum-computing" element={<QuantumComputingTutorial />} />
              <Route path="/courses/devops-roadmap-for-beginners" element={<DevOpsRoadmap />} />
              {/* User Dashboard Routes */}
              <Route path="/career-health" element={<CareerHealthDashboard />} />
              <Route path="/dashboard/health" element={<CareerHealthDashboard />} />
              <Route path="/ai-tools" element={<AIToolsKnowledgeBase />} />
              {/* Design System Demo - For Development Only */}
              <Route path="/design-system" element={<DesignSystemDemo />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;