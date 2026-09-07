import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { LEARNING_AI_SECTIONS } from '../learningCatalog';
import { studentPaths } from '../paths';
import './learning.css';

const AIToolsKnowledgeBase = lazy(() => import('../../components/AIToolsKnowledgeBase'));

export default function StudentLearningAiToolsPage() {
  return (
    <main className="stu-main stu-learning stu-learning--embed">
      <div className="stu-learning__embed-bar">
        <Link to={studentPaths.learning} className="stu-learning__back no-underline">
          <ArrowLeft size={16} aria-hidden /> Learning
        </Link>
        <div className="stu-learning__title-row">
          <Sparkles size={18} aria-hidden />
          <strong>AI Tools</strong>
        </div>
      </div>
      <p className="stu-learning__sub stu-learning__sub--bar">
        Knowledge base from mentormuni.com/ai-tools — LLMs, coding assistants, MentorMuni tools, FAQ.
      </p>
      <nav className="stu-learning__chips" aria-label="AI Tools sections">
        {LEARNING_AI_SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            className="stu-learning__chip"
            onClick={() => {
              document.getElementById(section.id)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }}
          >
            {section.label}
          </button>
        ))}
      </nav>
      <Suspense fallback={<p className="stu-learning__loading">Loading AI tools…</p>}>
        <AIToolsKnowledgeBase />
      </Suspense>
    </main>
  );
}
