import React, { Suspense, lazy, useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ROUTE_TITLES } from "./constants/brandCopy";
import { goToStartAssessment } from "./utils/startAssessmentNavigation";

import Navbar from "./components/navbar";
import HomePage from "./components/homepage";
import MuniBot from "./components/MuniBot";
import StickyConversionBar from "./components/StickyConversionBar";
import "./index.css";

const MotionMain = motion.main;

// Lazy-load all other pages so only Home + Navbar load on first visit
const InterviewReady = lazy(() => import("./components/interviewready"));
const OutcomesPage = lazy(() => import("./components/outcomes"));
const Pricing   = lazy(() => import("./components/pricing"));
const Waitlist  = lazy(() => import("./components/waitlist"));
const ResultPage = lazy(() => import("./components/result"));
const MentorDashboard = lazy(() => import("./components/mentordashboard"));
const HowItWorks = lazy(() => import("./components/HowItWorks"));
const Tools = lazy(() => import("./components/Tools"));
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
const Colleges = lazy(() => import("./components/colleges"));
const LearningPaths = lazy(() => import("./components/learningPaths"));
const PlacementTracks = lazy(() => import("./components/placementTracks"));
const FreeTutorials = lazy(() => import("./components/freeTutorials"));
const ResumeAnalyzer = lazy(() => import("./components/resumeAnalyzer"));
const ContactPage = lazy(() => import("./components/contactPage"));
const AboutUs = lazy(() => import("./components/aboutUs"));
const DesignSystemDemo = lazy(() => import("./components/DesignSystemDemo"));
const CareerHealthDashboard = lazy(() => import("./components/CareerHealthDashboard"));
const AIToolsKnowledgeBase = lazy(() => import("./components/AIToolsKnowledgeBase"));
const InterviewReadinessToolsPage = lazy(() => import("./components/InterviewReadinessToolsPage"));
const LeadershipBoard = lazy(() => import("./components/leadershipBoard"));

function PageFallback() {
  return (
    <div className="min-h-[60vh] bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="h-9 w-2/3 max-w-md animate-pulse rounded-xl bg-[#F0ECE0]" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-[#F5F0E8]/90" />
        <div className="h-4 w-5/6 animate-pulse rounded-lg bg-[#F5F0E8]/90" />
        <div className="h-4 w-4/6 animate-pulse rounded-lg bg-[#F5F0E8]/80" />
        <div className="mt-10 h-52 animate-pulse rounded-2xl bg-gradient-to-br from-[#FFF4E0]/90 via-[#FFFDF8] to-[#F0ECE0]/80" />
      </div>
    </div>
  );
}

/** Subtle route transition — skip enter animation on home to protect LCP. */
function AnimatedMain({ children, className = "" }) {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  return (
    <MotionMain
      key={pathname}
      initial={isHome ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={`relative z-0 w-full min-w-0 flex-grow ${className}`}
    >
      {children}
    </MotionMain>
  );
}

/** Reset scroll position on every route change. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

/**
 * Dismissible announcement bar — shown on every page, persists across routes,
 * dismissed for the session via sessionStorage (returns on new tab/session).
 */
function AnnouncementBar() {
  const [visible, setVisible] = useState(() => {
    try { return !sessionStorage.getItem('mm-promo-dismissed-v2'); }
    catch { return true; }
  });

  if (!visible) return null;

  return (
    <div
      role="banner"
      aria-label="Early bird promotional offer"
      className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-[#E88600] via-[#FF9500] to-[#FFB347] px-10 py-2 text-center text-[11px] font-semibold text-white sm:text-xs"
    >
      <span aria-hidden className="shrink-0 text-sm">🎁</span>
      <span>
        <strong>Early Bird:</strong> 1 free 1:1 mentorship + 1 AI mock — take the free 5-min readiness test to claim.
      </span>
      <button
        type="button"
        onClick={goToStartAssessment}
        className="ml-1 shrink-0 rounded-full bg-white/25 px-2.5 py-0.5 text-[11px] font-bold transition hover:bg-white/35 sm:text-xs"
      >
        Claim →
      </button>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          setVisible(false);
          try {
            sessionStorage.setItem('mm-promo-dismissed-v2', '1');
          } catch {
            /* ignore storage errors */
          }
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 transition hover:bg-white/20 sm:right-3"
      >
        <span className="text-white/90 text-base leading-none">×</span>
      </button>
    </div>
  );
}

/** Update document.title per route for better SEO and browser tab clarity. */
function RouteTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    const title = ROUTE_TITLES[pathname] ?? 'MentorMuni — Interview Readiness for Engineers';
    document.title = title;
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <RouteTitle />
      <div className="flex min-h-screen w-full min-w-0 flex-col bg-background text-muted-foreground font-sans antialiased">
        <AnnouncementBar />
        <Navbar />
        <AnimatedMain>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/leadership-board" element={<LeadershipBoard />} />
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
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/about" element={<AboutUs />} />
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
        </AnimatedMain>
        <StickyConversionBar />
        <MuniBot />
      </div>
    </Router>
  );
}

export default App;