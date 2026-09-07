import { Suspense, lazy } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import {
  LEARNING_TUTORIAL_GROUPS,
  findLearningTutorial,
} from '../learningCatalog';
import { studentPaths } from '../paths';
import './learning.css';

const CONTENT = {
  python: lazy(() => import('../../components/pythonTutorial')),
  java: lazy(() => import('../../components/javaTutorial')),
  sql: lazy(() => import('../../components/sqlTutorial')),
  'generative-ai': lazy(() => import('../../components/generativeAITutorial')),
  'prompt-engineering': lazy(() => import('../../components/promptEngineeringMasterclass')),
  'rag-systems': lazy(() => import('../../components/ragSystemsTutorial')),
  'quantum-computing': lazy(() => import('../../components/quantumComputingTutorial')),
  devops: lazy(() => import('../../components/devopsRoadmap')),
};

function TutorialsIndex() {
  return (
    <main className="stu-main stu-learning">
      <Link to={studentPaths.learning} className="stu-learning__back no-underline">
        <ArrowLeft size={16} aria-hidden /> Learning
      </Link>
      <header className="stu-learning__hero">
        <div className="stu-learning__title-row">
          <BookOpen size={22} aria-hidden />
          <h1 className="stu-learning__title">Free Tutorials</h1>
        </div>
        <p className="stu-learning__sub">
          Self-paced modules from mentormuni.com/free-tutorials — grouped for systematic learning.
        </p>
      </header>

      <div className="stu-learning__sections">
        {LEARNING_TUTORIAL_GROUPS.map((group) => (
          <section key={group.id} className="stu-learning__section" aria-labelledby={`g-${group.id}`}>
            <h2 id={`g-${group.id}`} className="stu-learning__section-title">
              {group.label}
            </h2>
            <p className="stu-learning__section-sub">{group.description}</p>
            <div className="stu-learning__grid stu-learning__grid--tight">
              {group.items.map((item) => (
                <Link
                  key={item.id}
                  to={`${studentPaths.learningTutorials}/${item.id}`}
                  className="stu-learning__card no-underline"
                >
                  {item.tag ? <span className="stu-learning__tag">{item.tag}</span> : null}
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="stu-learning__card-cta">
                    Start learning <ArrowRight size={16} aria-hidden />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

export default function StudentLearningTutorialsPage() {
  const { tutorialId } = useParams();

  if (!tutorialId) return <TutorialsIndex />;

  const meta = findLearningTutorial(tutorialId);
  const Content = CONTENT[tutorialId];

  if (!meta || !Content) {
    return (
      <main className="stu-main stu-learning">
        <p>Tutorial not found.</p>
        <Link to={studentPaths.learningTutorials} className="stu-learning__back no-underline">
          Back to tutorials
        </Link>
      </main>
    );
  }

  return (
    <main className="stu-main stu-learning stu-learning--embed">
      <div className="stu-learning__embed-bar">
        <Link to={studentPaths.learningTutorials} className="stu-learning__back no-underline">
          <ArrowLeft size={16} aria-hidden /> All tutorials
        </Link>
        <strong>{meta.title}</strong>
      </div>
      <Suspense fallback={<p className="stu-learning__loading">Loading tutorial…</p>}>
        <Content />
      </Suspense>
    </main>
  );
}
