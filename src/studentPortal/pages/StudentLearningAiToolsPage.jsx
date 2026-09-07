import { Suspense, lazy, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { LEARNING_AI_SECTIONS } from '../learningCatalog';
import { studentPaths } from '../paths';
import '../styles/tool-host.css';
import './learning.css';

const AIToolsKnowledgeBase = lazy(() => import('../../components/AIToolsKnowledgeBase'));

export default function StudentLearningAiToolsPage() {
  const [active, setActive] = useState(LEARNING_AI_SECTIONS[0]?.id || '');

  useEffect(() => {
    const ids = LEARNING_AI_SECTIONS.map((s) => s.id);
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!nodes.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target?.id) return;
        setActive(visible.target.id);
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.15, 0.4] },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <main className="stu-main stu-main--tool stu-learning stu-learning--embed">
      <div className="stu-learning__embed-bar">
        <Link to={studentPaths.learning} className="stu-learning__back no-underline">
          <ArrowLeft size={16} aria-hidden /> Learning
        </Link>
        <div className="stu-learning__embed-meta">
          <strong>
            <Sparkles size={18} aria-hidden />
            AI Tools
          </strong>
          <p className="stu-learning__sub stu-learning__sub--bar">
            LLMs, coding assistants, and FAQ for placement interviews.
          </p>
        </div>
      </div>

      <nav className="stu-learning__chips" aria-label="Jump to section">
        {LEARNING_AI_SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`stu-learning__chip${active === section.id ? ' is-on' : ''}`}
            aria-current={active === section.id ? 'true' : undefined}
            onClick={() => {
              setActive(section.id);
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
        <AIToolsKnowledgeBase hideMentorMuniPromo portalEmbed />
      </Suspense>
    </main>
  );
}
