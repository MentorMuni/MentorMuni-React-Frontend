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
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF8] to-[#FFF8EE] text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen size={40} className="text-[#FF9500]" />
            <h1 className="text-5xl md:text-6xl font-black text-foreground">Free Tutorials</h1>
          </div>
          <p className="text-lg sm:text-xl text-foreground/85 max-w-2xl mx-auto leading-relaxed">
            Self-paced learning modules designed for beginners. Start learning for free and upgrade to advanced courses when you&apos;re ready.
          </p>
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {tutorials.map((tutorial) => (
            <div 
              key={tutorial.id} 
              className="group bg-white p-8 rounded-3xl border border-border hover:border-[#FF9500]/50 transition-all hover:shadow-lg"
            >
              <div className="w-12 h-1 bg-gradient-to-r from-[#FF9500] to-[#FFB347] mb-6 rounded-full"></div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">{tutorial.title}</h3>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">{tutorial.description}</p>
              <button
                type="button"
                onClick={() => navigate(tutorial.route)}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#E88600] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#FF9500]/25 transition-all hover:from-[#E88600] hover:to-[#CC7000] hover:shadow-lg sm:justify-start"
              >
                <Code size={18} className="shrink-0" aria-hidden />
                Start Learning
                <ArrowRight size={18} className="shrink-0" aria-hidden />
              </button>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="bg-white border border-border rounded-3xl p-12 shadow-sm">
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
                className="bg-gradient-to-r from-[#FF9500] to-[#E88600] text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-[0_4px_14px_rgba(255,149,0,0.2)] transition-all flex items-center gap-2"
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
