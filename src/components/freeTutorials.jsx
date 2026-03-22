import React from 'react';
import { ArrowRight, BookOpen, Code, Check } from 'lucide-react';

const FreeTutorials = () => {
  const tutorials = [
    {
      id: 'generative-ai',
      title: 'Generative AI for Beginners',
      icon: null,
      description: 'Learn how GPT, LLMs, and prompt engineering work with practical beginner examples. Perfect for entering the AI revolution.',
      route: '/tutorials/generative-ai-for-beginners',
      color: 'from-indigo-600 to-purple-600'
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
      color: 'from-cyan-600 to-indigo-600'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen size={40} className="text-cyan-400" />
            <h1 className="text-5xl md:text-6xl font-black">Free Tutorials</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Self-paced learning modules designed for beginners. Start learning for free and upgrade to advanced courses when you're ready.
          </p>
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {tutorials.map((tutorial) => (
            <div 
              key={tutorial.id} 
              className="group bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-indigo-400 mb-6 rounded-full"></div>
              <h3 className="text-2xl font-bold mb-3">{tutorial.title}</h3>
              <p className="text-slate-300 text-sm mb-8 leading-relaxed">{tutorial.description}</p>
              <button 
                onClick={() => window.location.href = tutorial.route}
                className="text-cyan-400 font-bold flex items-center gap-2 hover:gap-3 transition-all group-hover:text-cyan-300"
              >
                <Code size={18} />
                Start Learning
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-white/10 rounded-3xl p-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Why Our Free Tutorials?</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Check size={24} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Learn at your own pace with lifetime access</span>
                </li>
                <li className="flex gap-3">
                  <Check size={24} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Interactive coding challenges and exercises</span>
                </li>
                <li className="flex gap-3">
                  <Check size={24} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Real-world examples and best practices</span>
                </li>
                <li className="flex gap-3">
                  <Check size={24} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Community support and peer learning</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Next Steps</h3>
              <p className="text-slate-300 mb-6">
                After completing these free tutorials, you'll be prepared to join our comprehensive Placement Tracks where you can specialize and get ready for interviews.
              </p>
              <button
                onClick={() => window.location.href = '/learning-paths'}
                className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2"
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
