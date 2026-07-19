import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate, Link } from "react-router-dom";
import { getRouterBasename } from "./utils/appPaths";
import { motion } from "framer-motion";
import { getRouteSeo } from "./constants/routeSeoMeta";
import { SNAP_ANNOUNCEMENT_BAR } from "./constants/snapTestCopy";
import { sanitizeBrokenSpaUrl } from "./utils/sanitizeBrokenSpaUrl";

sanitizeBrokenSpaUrl();

import Navbar from "./components/navbar";
import SkipToContent from "./components/layout/SkipToContent";
import HomePage from "./components/homepage";
import ParticleBackground from "./components/new-ui/ParticleBackground";
import MuniBot from "./components/MuniBot";
import WelcomeLaunchOverlay from "./components/WelcomeLaunchOverlay";
import RouteErrorBoundary from "./components/RouteErrorBoundary";
import "./index.css";

const ASSESSMENT_PATHS = new Set([
  "/start-assessment",
  "/readiness",
  "/interview-ready",
]);

const MotionMain = motion.main;

// Lazy-load all other pages so only Home + Navbar load on first visit
const InterviewReady = lazy(() => import("./components/interviewready"));
const OutcomesPage = lazy(() => import("./components/outcomes"));
const Pricing   = lazy(() => import("./components/pricing"));
const Waitlist  = lazy(() => import("./components/waitlist"));
const ResultPage = lazy(() => import("./components/result"));
const MentorDashboard = lazy(() => import("./components/mentordashboard"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const AdminDashboardNew = lazy(() => import("./components/admin/AdminDashboardNew"));
const MentorDashboardNew = lazy(() => import("./components/mentor/MentorDashboardNew"));
const MentorDashboardRefactored = lazy(() => import("./components/mentor/MentorDashboardRefactored"));
const MentorProfile = lazy(() => import("./components/mentor/MentorProfile"));
const HowItWorks = lazy(() => import("./components/HowItWorks"));
const Tools = lazy(() => import("./components/Tools"));
const Mentors    = lazy(() => import("./components/Mentors"));
const JavaTutorial = lazy(() => import("./components/javaTutorial"));
const SqlTutorial = lazy(() => import("./components/sqlTutorial"));
const CppOopTutorial = lazy(() => import("./components/cppOopTutorial"));
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
const LoginPage = lazy(() => import("./components/login/LoginPage"));
const StudentDashboard = lazy(() => import("./components/student/StudentDashboard"));
const StudentDashboardRefactored = lazy(() => import("./components/student/StudentDashboardRefactored"));
const ContactPage = lazy(() => import("./components/contactPage"));
const AboutUs = lazy(() => import("./components/aboutUs"));
const TermsPage = lazy(() => import("./components/legal/TermsPage"));
const PrivacyPage = lazy(() => import("./components/legal/PrivacyPage"));
const CookiesPage = lazy(() => import("./components/legal/CookiesPage"));
const CareersPage = lazy(() => import("./components/legal/CareersPage"));
const DesignSystemDemo = lazy(() => import("./components/DesignSystemDemo"));
const CareerHealthDashboard = lazy(() => import("./components/CareerHealthDashboard"));
const SoftwareEngineerInterviewQuestionsPage = lazy(
  () => import("./components/SoftwareEngineerInterviewQuestionsPage")
);
const NotFoundPage = lazy(() => import("./components/NotFoundPage"));
const AIToolsKnowledgeBase = lazy(() => import("./components/AIToolsKnowledgeBase"));
const InterviewReadinessToolsPage = lazy(() => import("./components/InterviewReadinessToolsPage"));
const VoiceInterviewCoach = lazy(() => import("./components/voiceInterview/VoiceInterviewCoach"));
const LeadershipBoard = lazy(() => import("./components/leadershipBoard"));
const SnapReadinessTest = lazy(() => import("./components/snapTest/SnapReadinessTest"));
const RoadmapPage = lazy(() => import("./components/RoadmapPage"));
const BlogList = lazy(() => import("./components/Blog/BlogList"));
const BlogPost = lazy(() => import("./components/Blog/BlogPost"));
const GamifiedPlacementPrep = lazy(() => import("./components/GamifiedPlacementPrep"));

function PageFallback() {
  const { pathname } = useLocation();
  const isAssessment = ASSESSMENT_PATHS.has(pathname);
  return (
    <div className="min-h-[60vh] bg-background py-12">
      <div className="mm-container mm-container--narrow space-y-4">
        {isAssessment && (
          <p className="text-center text-sm font-semibold text-muted-foreground">
            Loading assessment…
          </p>
        )}
        <div className="h-9 w-2/3 max-w-md animate-pulse rounded-xl bg-shell-1" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-shell-2" />
        <div className="h-4 w-5/6 animate-pulse rounded-lg bg-shell-2" />
        <div className="h-4 w-4/6 animate-pulse rounded-lg bg-shell-3" />
        <div className="mt-10 h-52 animate-pulse rounded-2xl bg-gradient-to-br from-shell-warm via-shell-cream to-shell-neutral" />
      </div>
    </div>
  );
}

/** Route shell — avoid opacity:0 enter (can look like a blank page if motion fails to run). */
function AnimatedMain({ children, className = "" }) {
  const { pathname } = useLocation();
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <MotionMain
      key={pathname}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      id="main-content"
      tabIndex={-1}
      className={`mm-route-root mm-route-enter relative z-0 w-full min-w-0 flex-grow outline-none ${className}`}
    >
      {children}
    </MotionMain>
  );
}

function AssessmentRoute({ children }) {
  return <RouteErrorBoundary>{children}</RouteErrorBoundary>;
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
      aria-label="5-Sec Test announcement"
      className="mm-announcement-bar relative flex flex-wrap items-center justify-center gap-x-2 gap-y-1 bg-gradient-to-r from-[#15799F] via-[#1A8FC4] to-[#2AAA8A] px-11 py-2 text-center text-[10px] font-semibold leading-snug text-white sm:gap-2 sm:px-12 sm:text-[11px] md:text-xs"
    >
      <span className="mm-announcement-bar__text min-w-0">{SNAP_ANNOUNCEMENT_BAR}</span>
      <Link
        to="/snap-test"
        className="shrink-0 rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] font-bold transition hover:bg-white/35 sm:text-[11px] md:text-xs"
      >
        5-Sec Test →
      </Link>
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

function setMetaTag(name, content) {
  if (!content) return;
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

/** Redirect old HashRouter URLs (#/path) to BrowserRouter paths — keeps bookmarks & shared links working. */
function HashLegacyRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const { hash } = window.location;
    if (!hash.startsWith('#/')) return;
    const raw = hash.slice(1);
    const qi = raw.indexOf('?');
    const path = qi === -1 ? raw : raw.slice(0, qi);
    const search = qi === -1 ? '' : raw.slice(qi);
    navigate(`${path}${search}`, { replace: true });
  }, [navigate]);

  return null;
}

/** Update document title, description, and keywords per route. */
function RouteTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    const { title, description, keywords } = getRouteSeo(pathname);
    document.title = title;
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter basename={getRouterBasename()}>
      <HashLegacyRedirect />
      <ScrollToTop />
      <RouteTitle />
      <div className="mm-app-shell mm-site-theme relative text-foreground">
        <ParticleBackground />
        <AnnouncementBar />
        <SkipToContent />
        <div className="mm-app-body">
          <Navbar />
          <AnimatedMain className="mm-app-main relative z-[1]">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/gamified-placement-prep" element={<GamifiedPlacementPrep />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              {/* SEO landing URLs — same tools, keyword-focused paths for search */}
              <Route path="/placement-roadmap" element={<RoadmapPage />} />
              <Route path="/dsa-roadmap" element={<LearningPaths />} />
              <Route path="/mock-interview" element={<MockInterviews />} />
              <Route path="/resume-ats-checker" element={<ResumeAnalyzer />} />
              <Route path="/ai-interview-preparation" element={<MockInterviews />} />
              <Route
                path="/software-engineer-interview-questions"
                element={<SoftwareEngineerInterviewQuestionsPage />}
              />
              <Route path="/leadership-board" element={<LeadershipBoard />} />
              {/* Specific /tools/* routes must be listed before /tools so they match first */}
              <Route path="/tools/interview-readiness" element={<InterviewReadinessToolsPage />} />
              <Route path="/interview-readiness-tools" element={<InterviewReadinessToolsPage />} />
              <Route path="/tools/voice-interview" element={<VoiceInterviewCoach />} />
              <Route path="/voice-interview-coach" element={<VoiceInterviewCoach />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/mentors" element={<Mentors />} />
              <Route path="/snap-test" element={<SnapReadinessTest />} />
              <Route path="/5-sec-test" element={<SnapReadinessTest />} />
              <Route path="/readiness-snap" element={<SnapReadinessTest />} />
              <Route path="/start-assessment" element={<AssessmentRoute><InterviewReady /></AssessmentRoute>} />
              <Route path="/readiness" element={<AssessmentRoute><InterviewReady /></AssessmentRoute>} />
              <Route path="/interview-ready" element={<AssessmentRoute><InterviewReady /></AssessmentRoute>} />
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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/student/dashboard" element={<StudentDashboardRefactored />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardNew />} />
              <Route path="/mentor/dashboard" element={<MentorDashboardRefactored />} />
              <Route path="/mentor/profile" element={<MentorProfile />} />
              <Route path="/dashboard" element={<MentorDashboard />} />
              <Route path="/java-tutorial" element={<JavaTutorial />} />
              <Route path="/java-for-beginners" element={<JavaTutorial />} />
              <Route path="/sql-tutorial" element={<SqlTutorial />} />
              <Route path="/sql-for-beginners" element={<SqlTutorial />} />
              <Route path="/cpp-oop-tutorial" element={<CppOopTutorial />} />
              <Route path="/cpp-oop-for-beginners" element={<CppOopTutorial />} />
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
              {/* Legacy / marketing URLs → canonical routes */}
              <Route path="/courses" element={<Navigate to="/placement-tracks" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AnimatedMain>
        </div>
        <WelcomeLaunchOverlay />
        <MuniBot />
      </div>
    </BrowserRouter>
  );
}

export default App;