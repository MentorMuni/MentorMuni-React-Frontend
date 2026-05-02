import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Code, Check } from 'lucide-react';

const FreeTutorials = () => {
  const navigate = useNavigate();
  const tutorials = [
    {
      id: 'generative-ai',
      title: 'Generative AI for Beginners',
      icon: null,
      description: 'Learn how GPT, LLMs, and prompt engineering work with practical beginner examples. Perfect for entering the AI revolution.',
      route: '/tutorials/generative-ai-for-beginners',
      color: 'from-[#FF9500] to-purple-600'
    },
    {
      id: 'prompt-engineering',
      title: 'Prompt Engineering Masterclass',
      icon: null,
      description: 'Master prompt engineering from beginner to advanced. Learn ChatGPT prompts, LLM strategies, and techniques used by AI professionals.',
      route: '/courses/prompt-engineering-masterclass',
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'rag-systems',
      title: 'RAG Systems Tutorial',
      icon: null,
      description: 'Master Retrieval-Augmented Generation from fundamentals to production. Learn vector databases, RAG architecture, and build intelligent document Q&A systems.',
      route: '/courses/rag-systems',
      color: 'from-cyan-600 to-[#E88600]'
    },
    {
      id: 'quantum-computing',
      title: 'Quantum Computing',
      icon: null,
      description: 'Master quantum computing from mathematical foundations to practical algorithms. Learn qubits, superposition, entanglement, quantum gates, and Python Qiskit implementation.',
      route: '/courses/quantum-computing',
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'devops-roadmap',
      title: 'DevOps Roadmap for Beginners',
      icon: null,
      description: 'Step-by-step roadmap to become a DevOps Engineer in 2026. Master Linux, Git, CI/CD, Docker, Kubernetes, Cloud, and Infrastructure as Code with practical examples.',
      route: '/courses/devops-roadmap-for-beginners',
      color: 'from-orange-600 to-yellow-600'
    },
    {
      id: 'python',
      title: 'Python For Beginners',
      icon: null,
      description: 'Master Python fundamentals with interactive lessons. From basic syntax to advanced concepts. Ideal for beginners and intermediate learners.',
      route: '/python-for-beginners',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'java',
      title: 'Java for Beginners',
      icon: null,
      description: 'Learn Java programming from scratch with hands-on examples and best practices. Perfect for beginners entering the world of object-oriented programming.',
      route: '/java-for-beginners',
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 'sql',
      title: 'SQL Basics',
      icon: null,
      description: 'Learn SQL database fundamentals. Master queries, joins, and data manipulation. Essential for any developer working with databases.',
      route: '/sql-for-beginners',
      color: 'from-purple-600 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen mm-site-theme overflow-x-hidden text-foreground">
      <section className="mm-marketing-hero-backdrop border-b border-border">
        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-20 text-center md:pb-20">
          <div className="mb-4 flex items-center justify-center gap-3">
            <BookOpen size={40} className="text-cta" aria-hidden />
            <h1 className="text-5xl font-black text-foreground md:text-6xl">Free Tutorials</h1>
          </div>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Self-paced learning modules designed for beginners. Start learning for free and upgrade to advanced courses when you&apos;re ready.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        {/* Tutorials Grid */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tutorials.map((tutorial) => (
            <div 
              key={tutorial.id} 
              className="group rounded-3xl border border-border bg-card p-8 transition-all hover:border-cta/40 hover:shadow-lg"
            >
              <div className="mb-6 h-1 w-12 rounded-full bg-gradient-to-r from-cta to-cta-mid" />
              <h3 className="text-2xl font-bold mb-3 text-foreground">{tutorial.title}</h3>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">{tutorial.description}</p>
              <button
                type="button"
                onClick={() => navigate(tutorial.route)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cta to-cta-hover px-5 py-3 text-sm font-bold text-white shadow-md shadow-button transition-all hover:shadow-lg sm:w-auto sm:justify-start"
              >
                <Code size={18} className="shrink-0" aria-hidden />
                Start Learning
                <ArrowRight size={18} className="shrink-0" aria-hidden />
              </button>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="rounded-3xl border border-border bg-card p-12 shadow-[var(--shadow-card)]">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Why Our Free Tutorials?</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 text-muted-foreground">
                  <Check size={24} className="text-[#1A8C55] flex-shrink-0 mt-0.5" />
                  <span>Learn at your own pace with lifetime access</span>
                </li>
                <li className="flex gap-3 text-muted-foreground">
                  <Check size={24} className="text-[#1A8C55] flex-shrink-0 mt-0.5" />
                  <span>Interactive coding challenges and exercises</span>
                </li>
                <li className="flex gap-3 text-muted-foreground">
                  <Check size={24} className="text-[#1A8C55] flex-shrink-0 mt-0.5" />
                  <span>Real-world examples and best practices</span>
                </li>
                <li className="flex gap-3 text-muted-foreground">
                  <Check size={24} className="text-[#1A8C55] flex-shrink-0 mt-0.5" />
                  <span>Community support and peer learning</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Next Steps</h3>
              <p className="text-muted-foreground mb-6">
                After completing these free tutorials, you'll be prepared to join our comprehensive Placement Tracks where you can specialize and get ready for interviews.
              </p>
              <button
                type="button"
                onClick={() => navigate('/learning-paths')}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cta to-cta-hover px-6 py-3 font-bold text-white shadow-button transition-all hover:shadow-lg"
              >
                Explore Placement Tracks
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeTutorials;
