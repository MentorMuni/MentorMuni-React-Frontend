/**
 * Per-route SEO: title, description, keywords.
 * Used by RouteTitle (App.jsx) and usePageMeta on key pages.
 */

import { DEFAULT_META_DESCRIPTION } from './brandCopy';

export const DEFAULT_META_KEYWORDS =
  'placement mentor, placement preparation, campus placement, interview readiness, engineering students India, MentorMuni';

/** @type {Record<string, { title: string; description: string; keywords: string }>} */
export const ROUTE_SEO = {
  '/': {
    title: 'Placement Mentor & Interview Readiness for Engineering Students | MentorMuni',
    description: DEFAULT_META_DESCRIPTION,
    keywords:
      'placement mentor, placement preparation, campus placement, interview readiness, TCS placement, Infosys campus hiring, AI mock interview, MentorMuni',
  },
  '/how-it-works': {
    title: 'Campus Placement Prep — How MentorMuni Works | MentorMuni',
    description:
      'See how MentorMuni works as your placement mentor — free readiness check, gap report, AI mocks, and 1:1 mentors for campus and off-campus drives in India.',
    keywords: 'how placement prep works, campus placement guide, interview readiness process, MentorMuni',
  },
  '/roadmap': {
    title: 'Placement Preparation Roadmap 2026 | MentorMuni',
    description:
      'Complete placement preparation roadmap for 1st, 2nd, 3rd and 4th year engineering students — year-wise plan for campus hiring in India.',
    keywords:
      'placement roadmap, placement preparation 2026, engineering student roadmap, campus placement plan, 4 year placement guide',
  },
  '/placement-roadmap': {
    title: 'Placement Preparation Roadmap 2026 | MentorMuni',
    description:
      'Complete placement preparation roadmap for 1st, 2nd, 3rd and 4th year engineering students. Start early, fix gaps, and get interview-ready before drive season.',
    keywords:
      'placement roadmap, placement preparation roadmap 2026, 1st year placement prep, final year placement, engineering placement India',
  },
  '/dsa-roadmap': {
    title: 'DSA Roadmap for Placement — Data Structures & Algorithms | MentorMuni',
    description:
      'Structured DSA roadmap for campus placement and product interviews — topics, order, and practice plan for engineering students in India.',
    keywords:
      'DSA roadmap, data structures placement, algorithms interview prep, coding interview roadmap, DSA for campus placement',
  },
  '/mock-interview': {
    title: 'AI Mock Interview for Campus Placement — Free Practice | MentorMuni',
    description:
      'Practice mock interviews with AI feedback before campus drives — technical, HR, and aptitude-style pressure for engineering students.',
    keywords:
      'mock interview, AI mock interview, campus placement mock, interview practice online, technical mock interview India',
  },
  '/mock-interviews': {
    title: 'AI Mock Interviews — Practice Under Real Pressure | MentorMuni',
    description:
      'AI mock interviews for campus placement prep — practise technical and HR rounds under time pressure before real drives.',
    keywords:
      'mock interviews, AI interview practice, placement mock test, HR mock interview, coding interview practice',
  },
  '/ai-interview-preparation': {
    title: 'AI Interview Preparation for Engineering Students | MentorMuni',
    description:
      'AI-powered interview preparation — readiness scoring, mock interviews, and gap reports so you know what to fix before TCS, Infosys, and product companies.',
    keywords:
      'AI interview preparation, AI interview prep India, campus interview AI, placement interview practice, interview readiness AI',
  },
  '/resume-ats-checker': {
    title: 'Resume ATS Checker — Free ATS Score for Campus Placement | MentorMuni',
    description:
      'Check how ATS and recruiters read your resume — keyword gaps, formatting issues, and role fit for campus and off-campus engineering hiring.',
    keywords:
      'resume ATS checker, ATS resume score, resume analyzer placement, campus resume tips, engineering resume ATS',
  },
  '/resume-analyzer': {
    title: 'Resume ATS Checker — See How Screeners Read Your Resume | MentorMuni',
    description:
      'AI resume analysis for engineering students — ATS-style scoring, keyword matching, and improvements before campus placement season.',
    keywords:
      'resume analyzer, ATS resume checker, resume score, placement resume, engineering resume review',
  },
  '/software-engineer-interview-questions': {
    title: 'Software Engineer Interview Questions — Campus & Product | MentorMuni',
    description:
      'Common software engineer interview questions for campus placement and product roles — DSA, OOP, HR, and system design topics with free readiness check.',
    keywords:
      'software engineer interview questions, coding interview questions, campus technical interview, DSA interview questions, HR interview questions engineering',
  },
  '/start-assessment': {
    title: 'Free Placement Readiness Check — 5 Minutes | MentorMuni',
    description:
      'Take the free campus placement readiness check in ~5 minutes — instant score, topic gaps, no signup. Start placement preparation with data.',
    keywords:
      'placement readiness test, free interview readiness check, campus placement score, placement preparation test',
  },
  '/readiness': {
    title: 'Free Placement Readiness Check — 5 Minutes | MentorMuni',
    description:
      'Free placement readiness check for engineering students — scored assessment, gap report, and next steps before your campus drive.',
    keywords: 'interview readiness check, placement readiness score, free assessment engineering',
  },
  '/interview-ready': {
    title: 'Free Placement Readiness Check — 5 Minutes | MentorMuni',
    description:
      'Free placement readiness check for engineering students — scored assessment, gap report, and next steps before your campus drive.',
    keywords: 'interview ready test, placement readiness, campus hiring readiness',
  },
  '/mentors': {
    title: 'Expert Industry Mentors — 12–15 Yrs Experience | MentorMuni',
    description:
      'Industry mentors with 12–15 years experience for placement interview prep, mock feedback, and campus hiring strategy.',
    keywords: 'placement mentor, interview mentor India, campus placement coaching, industry mentor engineering',
  },
  '/outcomes': {
    title: 'Student Outcomes & Success Stories | MentorMuni',
    description:
      'See how engineering students improved interview readiness and placement outcomes with MentorMuni mocks and mentorship.',
    keywords: 'placement success stories, interview readiness outcomes, MentorMuni results',
  },
  '/success-stories': {
    title: 'Student Outcomes & Success Stories | MentorMuni',
    description:
      'Placement and interview readiness success stories from engineering students using MentorMuni.',
    keywords: 'placement success, student outcomes, campus placement stories',
  },
  '/pricing': {
    title: 'Plans & Pricing | MentorMuni',
    description:
      'MentorMuni plans for placement preparation — readiness check, mocks, and mentor sessions for campus hiring season.',
    keywords: 'placement prep pricing, interview coaching plans, MentorMuni pricing',
  },
  '/upgrade': {
    title: 'Plans & Pricing | MentorMuni',
    description: 'Upgrade your MentorMuni plan for more mocks, mentor sessions, and placement prep support.',
    keywords: 'MentorMuni upgrade, placement prep plans',
  },
  '/waitlist': {
    title: 'Join the Mentorship Waitlist — Limited Seats | MentorMuni',
    description:
      'Join the MentorMuni mentorship waitlist — limited seats for placement-focused mock interviews and 1:1 mentors.',
    keywords: 'placement mentorship waitlist, interview mentor batch, MentorMuni waitlist',
  },
  '/tools': {
    title: 'All Interview Prep Tools | MentorMuni',
    description:
      'Free and premium interview prep tools — readiness check, resume ATS, skill gap analyzer, and AI mock interviews.',
    keywords: 'interview prep tools, placement tools engineering, campus hiring tools',
  },
  '/tools/interview-readiness': {
    title: 'Interview Readiness Score Tool | MentorMuni',
    description:
      'Interview readiness score tool for campus placement — measure gaps before TCS, Infosys, and product company interviews.',
    keywords: 'interview readiness score, placement readiness tool, technical interview assessment',
  },
  '/interview-readiness-tools': {
    title: 'Interview Readiness Tools | MentorMuni',
    description: 'Interview readiness tools — scored check, gap report, and next steps for campus placement prep.',
    keywords: 'interview readiness tools, placement assessment tools',
  },
  '/skill-gap-analyzer': {
    title: 'Skill Gap Analyzer for Engineers | MentorMuni',
    description:
      'Identify skill gaps vs campus and product interview expectations — prioritized topics for placement preparation.',
    keywords: 'skill gap analyzer, placement skill gap, engineering skill assessment',
  },
  '/ai-tools': {
    title: 'AI Tools Knowledge Base for Engineers | MentorMuni',
    description: 'AI tools and concepts for engineering students — interview prep and modern tech hiring topics.',
    keywords: 'AI tools engineering, generative AI interview, AI interview prep',
  },
  '/learning-paths': {
    title: 'Learning Paths for Campus Placements | MentorMuni',
    description:
      'Structured learning paths for campus placement preparation — DSA, aptitude, HR, and role skills aligned to Indian engineering hiring.',
    keywords: 'learning paths placement, campus prep paths, engineering interview learning',
  },
  '/placement-tracks': {
    title: 'Campus Placement Tracks — TCS, Infosys, Wipro & More | MentorMuni',
    description:
      'Company-wise campus placement tracks for TCS, Infosys, Wipro, Cognizant, and product roles — aptitude, technical, and HR prep.',
    keywords: 'TCS placement prep, Infosys campus track, Wipro placement, placement tracks India',
  },
  '/free-tutorials': {
    title: 'Free Tutorials for Engineering Students | MentorMuni',
    description: 'Free tutorials — Java, Python, C++ OOP, SQL, Generative AI, and more for placement and interview preparation.',
    keywords: 'free coding tutorials, Java tutorial placement, Python tutorial beginners, C++ OOP tutorial',
  },
  '/leadership-board': {
    title: 'Interview Readiness Leaderboard | MentorMuni',
    description: 'See top readiness scores and motivate your batch before campus placement season.',
    keywords: 'placement leaderboard, interview readiness ranking',
  },
  '/colleges': {
    title: 'MentorMuni for Colleges — Batch Readiness Dashboard',
    description: 'Campus placement readiness dashboards and batch analytics for colleges and TPO teams.',
    keywords: 'college placement dashboard, TPO tools, campus hiring analytics',
  },
  '/for-recruiters': {
    title: 'For Recruiters — Pre-Screened Interview-Ready Talent | MentorMuni',
    description: 'Hire pre-screened, interview-ready engineering talent — campus and early-career partnerships.',
    keywords: 'campus recruiters, engineering hiring India, interview-ready candidates',
  },
  '/about': {
    title: 'About MentorMuni — Placement Mentor for Engineering Students',
    description:
      'About MentorMuni — a placement mentor platform helping engineering students in India prepare for campus hiring with measurable readiness.',
    keywords: 'about MentorMuni, placement mentor platform, interview readiness India',
  },
  '/contact': {
    title: 'Contact MentorMuni — Placement Mentorship Enquiries',
    description:
      'Contact MentorMuni for placement mentorship, college partnerships, and student enrolment — enroll@mentormuni.com.',
    keywords: 'contact MentorMuni, placement mentorship enquiry, enroll MentorMuni',
  },
  '/terms': {
    title: 'Terms of Service | MentorMuni',
    description: 'MentorMuni terms of service for students, mentors, and platform use.',
    keywords: 'MentorMuni terms',
  },
  '/privacy': {
    title: 'Privacy Policy | MentorMuni',
    description: 'MentorMuni privacy policy — how we handle student data and assessments.',
    keywords: 'MentorMuni privacy',
  },
  '/career-health': {
    title: 'Career Health Dashboard | MentorMuni',
    description: 'Track your career readiness health — skills, gaps, and placement prep progress in one view.',
    keywords: 'career health dashboard, placement progress tracker',
  },
  '/dashboard/health': {
    title: 'Career Health Dashboard | MentorMuni',
    description: 'Track your career readiness health — skills, gaps, and placement prep progress.',
    keywords: 'career health dashboard',
  },
  '/dashboard': {
    title: 'Dashboard | MentorMuni',
    description: 'Your MentorMuni mentor dashboard.',
    keywords: 'MentorMuni dashboard',
  },
  '/result': {
    title: 'Your Placement Readiness Score & Gap Report | MentorMuni',
    description: 'View your readiness score, topic gaps, and recommended next steps after the free check.',
    keywords: 'readiness score result, placement gap report, interview readiness results',
  },
  '/java-tutorial': {
    title: 'Java Tutorial for Beginners — Free | MentorMuni',
    description: 'Free Java tutorial for engineering students — fundamentals for placement and coding interviews.',
    keywords: 'Java tutorial, Java for placement, learn Java beginners',
  },
  '/java-for-beginners': {
    title: 'Java Tutorial for Beginners — Free | MentorMuni',
    description: 'Free Java tutorial for beginners — placement and interview focused.',
    keywords: 'Java beginners, Java interview prep',
  },
  '/python-tutorial': {
    title: 'Python Tutorial for Beginners — Free | MentorMuni',
    description: 'Free Python tutorial for engineering students and campus placement preparation.',
    keywords: 'Python tutorial, Python placement prep',
  },
  '/python-for-beginners': {
    title: 'Python Tutorial for Beginners — Free | MentorMuni',
    description: 'Free Python tutorial for beginners.',
    keywords: 'Python beginners tutorial',
  },
  '/sql-tutorial': {
    title: 'SQL Tutorial for Beginners — Free | MentorMuni',
    description: 'Free SQL tutorial — queries and concepts for technical interviews and placements.',
    keywords: 'SQL tutorial, SQL interview questions',
  },
  '/sql-for-beginners': {
    title: 'SQL Tutorial for Beginners — Free | MentorMuni',
    description: 'Free SQL tutorial for beginners.',
    keywords: 'SQL beginners',
  },
  '/cpp-oop-tutorial': {
    title: 'OOP with C++ — Free Tutorial | MentorMuni',
    description: 'Free C++ OOP tutorial — classes, inheritance, polymorphism, and STL for placement and DSA interviews.',
    keywords: 'C++ OOP tutorial, C++ classes beginners, OOP C++ placement',
  },
  '/cpp-oop-for-beginners': {
    title: 'OOP with C++ for Beginners — Free | MentorMuni',
    description: 'Learn Object-Oriented Programming in C++ step by step — free tutorial for engineering students.',
    keywords: 'C++ OOP beginners, learn C++ OOP, campus placement C++',
  },
  '/generative-ai-tutorial': {
    title: 'Generative AI for Beginners — Free Tutorial | MentorMuni',
    description: 'Learn Generative AI, LLMs, and prompt basics — free tutorial for engineering students.',
    keywords: 'generative AI tutorial, LLM beginners, AI interview topics',
  },
  '/tutorials/generative-ai-for-beginners': {
    title: 'Generative AI for Beginners — Free | MentorMuni',
    description: 'Generative AI beginner tutorial for engineering students.',
    keywords: 'generative AI beginners',
  },
  '/prompt-engineering': {
    title: 'Prompt Engineering Masterclass — Free | MentorMuni',
    description: 'Free prompt engineering masterclass — practical AI skills for students and interviews.',
    keywords: 'prompt engineering tutorial, prompt engineering interview',
  },
  '/courses/prompt-engineering-masterclass': {
    title: 'Prompt Engineering Masterclass | MentorMuni',
    description: 'Prompt engineering masterclass for engineering students.',
    keywords: 'prompt engineering course',
  },
  '/rag-systems': {
    title: 'RAG Systems Tutorial — Build AI Apps | MentorMuni',
    description: 'Learn RAG systems — retrieval-augmented generation for modern AI interviews and projects.',
    keywords: 'RAG tutorial, RAG interview questions',
  },
  '/courses/rag-systems': {
    title: 'RAG Systems Tutorial | MentorMuni',
    description: 'RAG systems tutorial for engineering students.',
    keywords: 'RAG systems course',
  },
  '/quantum-computing': {
    title: 'Quantum Computing for Engineers — Free | MentorMuni',
    description: 'Quantum computing basics for curious engineering students.',
    keywords: 'quantum computing tutorial',
  },
  '/courses/quantum-computing': {
    title: 'Quantum Computing Tutorial | MentorMuni',
    description: 'Quantum computing tutorial.',
    keywords: 'quantum computing course',
  },
  '/courses/devops-roadmap-for-beginners': {
    title: 'DevOps Roadmap for Beginners — Free | MentorMuni',
    description: 'DevOps roadmap for beginners — tools and concepts for modern engineering roles.',
    keywords: 'DevOps roadmap, DevOps beginners',
  },
  '/design-system': {
    title: 'Design System | MentorMuni',
    description: 'MentorMuni internal design system reference.',
    keywords: 'MentorMuni design system',
  },
};

export function getRouteSeo(pathname) {
  return (
    ROUTE_SEO[pathname] ?? {
      title: 'MentorMuni — Placement Mentor & Interview Readiness',
      description: DEFAULT_META_DESCRIPTION,
      keywords: DEFAULT_META_KEYWORDS,
    }
  );
}

/** Backward-compatible maps for existing imports */
export const ROUTE_TITLES = Object.fromEntries(
  Object.entries(ROUTE_SEO).map(([path, meta]) => [path, meta.title])
);
export const ROUTE_DESCRIPTIONS = Object.fromEntries(
  Object.entries(ROUTE_SEO).map(([path, meta]) => [path, meta.description])
);
export const ROUTE_KEYWORDS = Object.fromEntries(
  Object.entries(ROUTE_SEO).map(([path, meta]) => [path, meta.keywords])
);
