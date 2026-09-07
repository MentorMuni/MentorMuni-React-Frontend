import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { studentPaths } from '../paths';
import './learning.css';

export default function StudentLearningPage() {
  return (
    <main className="stu-main stu-learning">
      <header className="stu-learning__hero">
        <p className="stu-learning__eyebrow">Learning</p>
        <h1 className="stu-learning__title">Learn systematically</h1>
        <p className="stu-learning__sub">
          Free tutorials and AI tools — the same content as mentormuni.com, organized for
          placement prep inside your portal.
        </p>
      </header>

      <div className="stu-learning__grid">
        <Link to={studentPaths.learningTutorials} className="stu-learning__card no-underline">
          <span className="stu-learning__card-icon" aria-hidden>
            <BookOpen size={20} strokeWidth={2} />
          </span>
          <h2>Free Tutorials</h2>
          <p>
            Programming foundations, AI &amp; emerging tech, and career tracks — self-paced
            beginner modules.
          </p>
          <span className="stu-learning__card-cta">
            Browse tutorials <ArrowRight size={16} aria-hidden />
          </span>
        </Link>

        <Link to={studentPaths.learningAiTools} className="stu-learning__card no-underline">
          <span className="stu-learning__card-icon stu-learning__card-icon--spark" aria-hidden>
            <Sparkles size={20} strokeWidth={2} />
          </span>
          <h2>AI Tools</h2>
          <p>
            Major LLMs, coding assistants, MentorMuni placement tools, and FAQ — what interviewers
            expect you to know.
          </p>
          <span className="stu-learning__card-cta">
            Open knowledge base <ArrowRight size={16} aria-hidden />
          </span>
        </Link>
      </div>
    </main>
  );
}
