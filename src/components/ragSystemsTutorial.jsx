import React, { useState, useEffect } from 'react';
import { Copy, Menu, X, Check, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';

const RAGSystemsTutorial = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const topics = [
    { id: 'intro', title: 'Introduction to RAG' },
    { id: 'how-rag-works', title: 'How RAG Works' },
    { id: 'architecture', title: 'RAG Architecture Deep Dive' },
    { id: 'vector-db', title: 'Vector Databases Explained' },
    { id: 'implementation', title: 'Python Implementation' },
    { id: 'chunking', title: 'Chunking Strategies' },
    { id: 'evaluation', title: 'RAG Evaluation' },
    { id: 'advanced', title: 'Advanced Techniques' },
    { id: 'production', title: 'Production Considerations' },
    { id: 'mistakes', title: 'Common Mistakes' },
    { id: 'usecases', title: 'Real-World Use Cases' },
    { id: 'interview', title: 'Interview Questions' },
    { id: 'project', title: 'Mini Project' },
    { id: 'faq', title: 'FAQ & Resources' },
  ];

  const faqItems = [
    {
      question: "What is RAG and why is it important?",
      answer: "RAG (Retrieval-Augmented Generation) combines retrieval systems with LLMs to fetch relevant documents and generate answers based on them. It addresses LLM limitations like hallucinations, outdated knowledge, and domain-specific information by grounding responses in actual data."
    },
    {
      question: "How is RAG different from fine-tuning?",
      answer: "Fine-tuning modifies the model weights with new data (expensive, time-consuming, risky). RAG retrieves relevant context at query time without modifying the model (cheaper, faster, safer, updatable). RAG is better for dynamic knowledge; fine-tuning for style changes."
    },
    {
      question: "What's the difference between RAG and vector search?",
      answer: "Vector search is just similarity-based retrieval. RAG is a complete system combining retrieval (finding relevant docs) + generation (LLM creating answers). RAG uses vector search as part of its retrieval layer."
    },
    {
      question: "Which vector database is best?",
      answer: "There's no universal 'best'. FAISS for speed (local), Pinecone for managed simplicity, Weaviate for hybrid search, Chroma for lightweight prototyping. Choose based on: scale, budget, ease-of-use, and specific features needed."
    },
    {
      question: "Is RAG better than training my own model?",
      answer: "For most use cases, yes. RAG is faster (weeks vs months), cheaper (no GPU training), safer (no data leakage), and more maintainable (update knowledge without retraining). Train only if you need specific linguistic behavior or have massive proprietary data."
    },
    {
      question: "How do you prevent hallucinations in RAG?",
      answer: "Use high-quality retrieval with good chunking, implement strict context injection, set model temperature low, use citation/grounding techniques, add fallback responses when confidence is low, and carefully measure retrieval quality metrics."
    },
    {
      question: "What's the cost of running a RAG system?",
      answer: "Costs depend on: LLM API calls (main cost), vector DB storage/queries, embeddings generation (usually one-time), and infrastructure. RAG is cheaper than fine-tuning because you don't retrain, only retrieve and prompt."
    },
    {
      question: "Can I use open-source models with RAG?",
      answer: "Yes! RAG works with any LLM. Use Llama 2, Mistral, or Falcon locally or via APIs. Open-source models + RAG is cost-effective, gives you control, and can be privacy-compliant since data stays local."
    },
    {
      question: "How do you handle multi-language RAG systems?",
      answer: "Use multilingual embedding models (e.g., multilingual-e5-large). Chunk documents in their original language. Consider separate vector spaces for each language or use a single multilingual space. Evaluate retrieval quality per language."
    },
    {
      question: "What's the latency of a RAG system?",
      answer: "Typical: 100-500ms for retrieval + 1-10s for generation. Optimize with: caching, batch retrieval, pre-computed embeddings, and lightweight embedding models. Trade-off accuracy vs speed based on use case."
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      for (let topic of topics) {
        const element = document.getElementById(topic.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(topic.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [topics]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const CodeBlock = ({ code, language = 'python' }) => {
    const copyToClipboard = () => {
      navigator.clipboard.writeText(code);
      alert('Copied to clipboard!');
    };

    return (
      <div className="bg-[#1e1e1e] rounded-lg border border-white/10 my-4">
        <div className="flex justify-between items-center px-4 py-2 border-b border-white/10">
          <span className="text-xs text-[#94A3B8]">{language}</span>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1 bg-[#4F46E5] hover:bg-[#4F46E5]/80 rounded text-white text-xs transition-all"
          >
            <Copy size={14} /> Copy
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-sm text-[#e0e0e0]">
          <code>{code}</code>
        </pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F1F5F9] font-sans antialiased">
      {/* Meta Tags for SEO */}
      <head>
        <title>RAG Systems Tutorial - Retrieval-Augmented Generation Explained | Complete Guide</title>
        <meta name="description" content="Master RAG (Retrieval-Augmented Generation) systems from basics to production. Learn vector databases, RAG architecture, Python implementation, and real-world use cases." />
        <meta name="keywords" content="RAG tutorial, Retrieval-Augmented Generation, RAG architecture, vector database, LLM RAG, building RAG systems, vector search, semantic search" />
      </head>

      {/* JSON-LD Schema for FAQ */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqItems.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
        })}
      </script>

      {/* HEADER */}
      <header className="sticky top-0 z-[100] bg-[#0F1419]/95 backdrop-blur-md border-b border-white/5 px-5">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between py-4">
          <a href="/" className="transition-transform hover:scale-[1.02]">
            <img src={logo} alt="MentorMuni" className="h-10 w-auto" />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a href="/free-tutorials" className="text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2">
              ← Back to Free Tutorials
            </a>
          </nav>

          <button onClick={() => setIsNavOpen(!isNavOpen)} className="md:hidden text-white">
            {isNavOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex gap-8 max-w-[1400px] mx-auto px-6 py-16">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="hidden lg:block w-64 sticky top-24 h-[calc(100vh-100px)] overflow-y-auto">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-6 text-indigo-400">📑 Course Contents</h3>
            <nav className="space-y-2">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => scrollToSection(topic.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm font-semibold ${
                    activeSection === topic.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {topic.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0">

          {/* HERO SECTION */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-[#4F46E5] via-[#06B6D4] to-[#9333EA] bg-clip-text text-transparent">
              RAG Systems Tutorial
            </h1>
            <p className="text-xl text-[#94A3B8] leading-relaxed mb-4">
              Master Retrieval-Augmented Generation from fundamentals to production. Learn RAG architecture, vector databases, and build intelligent document Q&A systems that combine retrieval with LLMs.
            </p>
            <div className="flex gap-4 flex-wrap mb-8">
              <div className="px-4 py-2 bg-[#4F46E5]/20 border border-[#4F46E5]/50 rounded-lg text-sm">⏱️ 5-6 hours comprehensive</div>
              <div className="px-4 py-2 bg-cyan-600/20 border border-cyan-600/50 rounded-lg text-sm flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Beginner to Advanced</div>
              <div className="px-4 py-2 bg-green-600/20 border border-green-600/50 rounded-lg text-sm">💼 Production Ready</div>
            </div>
          </div>

          {/* TABLE OF CONTENTS */}
          <div className="mb-16 bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {topics.map((topic, idx) => (
                <button
                  key={topic.id}
                  onClick={() => scrollToSection(topic.id)}
                  className="text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/5 hover:border-cyan-400/30"
                >
                  <span className="text-cyan-400 font-bold">{idx + 1}.</span> {topic.title}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 1: INTRODUCTION */}
          <section id="intro" className="mb-16">
            <h2 className="text-4xl font-black mb-6">Introduction to RAG</h2>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">What is Retrieval-Augmented Generation?</h3>
              <p className="text-[#94A3B8] mb-4">
                RAG (Retrieval-Augmented Generation) is an architecture that combines a retrieval system with a generative language model. Instead of relying solely on the LLM's pre-trained knowledge, RAG retrieves relevant documents from your data, injects them as context into the prompt, and then generates accurate responses grounded in actual information.
              </p>
              <p className="text-[#94A3B8] mb-4">
                Think of it as giving an LLM access to a reference library. Without RAG, the LLM relies on memory. With RAG, it can look up current information before answering.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Why RAG is Essential</h3>
              <div className="space-y-4">
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-red-400/30">
                  <strong className="text-red-400 flex items-center gap-1"><AlertCircle size={16} className="flex-shrink-0" /> Pure LLM Problems</strong>
                  <p className="text-[#94A3B8] text-sm mt-2">• Hallucinations (making up facts) • Outdated knowledge • No domain-specific info • Can't access your private data • Can't cite sources</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-green-400/30">
                  <strong className="text-green-400">✅ RAG Solutions</strong>
                  <p className="text-[#94A3B8] text-sm mt-2">• Grounded in real data • Always current • Handles proprietary information • Accesses private documents • Provides citations</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">RAG vs Other Approaches</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-[#94A3B8]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-3 text-white font-bold">Approach</th>
                      <th className="text-left p-3 text-white font-bold">Cost</th>
                      <th className="text-left p-3 text-white font-bold">Speed</th>
                      <th className="text-left p-3 text-white font-bold">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="p-3">Pure LLM</td>
                      <td className="p-3">Low</td>
                      <td className="p-3">Fast</td>
                      <td className="p-3">Low</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="p-3">Fine-tuning</td>
                      <td className="p-3">Very High</td>
                      <td className="p-3">Slow</td>
                      <td className="p-3">High</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="p-3">RAG</td>
                      <td className="p-3">Medium</td>
                      <td className="p-3">Medium</td>
                      <td className="p-3">Medium-High</td>
                    </tr>
                    <tr>
                      <td className="p-3">RAG + Fine-tune</td>
                      <td className="p-3">High</td>
                      <td className="p-3">Medium</td>
                      <td className="p-3">Very High</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* SECTION 2: HOW RAG WORKS */}
          <section id="how-rag-works" className="mb-16">
            <h2 className="text-4xl font-black mb-6">⚙️ How RAG Works: The Complete Flow</h2>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">The RAG Pipeline: Step-by-Step</h3>
              <ol className="text-[#94A3B8] space-y-4 ml-4">
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">1.</span>
                  <span><strong>User Query:</strong> "What are the benefits of machine learning?" User types a question or prompt.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">2.</span>
                  <span><strong>Query Encoding:</strong> Convert the query to embeddings using an embedding model.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">3.</span>
                  <span><strong>Retrieval:</strong> Search vector database for top-K similar documents/chunks.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">4.</span>
                  <span><strong>Context Preparation:</strong> Format retrieved documents as context string.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">5.</span>
                  <span><strong>Prompt Construction:</strong> Create augmented prompt: [System] + [Retrieved Context] + [User Query]</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">6.</span>
                  <span><strong>Generation:</strong> LLM generates response grounded in the retrieved context.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">7.</span>
                  <span><strong>Response:</strong> Return generated answer with optional citations.</span>
                </li>
              </ol>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Key Components Explained</h3>
              <div className="space-y-4">
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-white/10">
                  <strong className="text-indigo-400">Embedding Model</strong>
                  <p className="text-[#94A3B8] text-sm mt-2">Converts text (documents, queries) into numerical vectors. Examples: text-embedding-ada-002, Sentence-BERT, multilingual-e5-large. Higher quality embeddings = better retrieval.</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-white/10">
                  <strong className="text-indigo-400">Vector Database</strong>
                  <p className="text-[#94A3B8] text-sm mt-2">Stores embeddings and enable fast similarity search. Examples: FAISS, Pinecone, Weaviate. Optimized for billions of vectors with millisecond retrieval.</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-white/10">
                  <strong className="text-indigo-400">Similarity Search</strong>
                  <p className="text-[#94A3B8] text-sm mt-2">Finds vectors closest to query embedding using cosine similarity or L2 distance. retrieves most relevant documents for context injection.</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-white/10">
                  <strong className="text-indigo-400">Context Window</strong>
                  <p className="text-[#94A3B8] text-sm mt-2">The LLM's maximum input length. Retrieved documents must fit (typically 4K-100K tokens). Careful chunking and selection ensures quality context.</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: ARCHITECTURE */}
          <section id="architecture" className="mb-16">
            <h2 className="text-4xl font-black mb-6">🏗️ RAG Architecture Deep Dive</h2>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Data Ingestion Pipeline</h3>
              <p className="text-[#94A3B8] mb-4">Before RAG can retrieve, your data must be prepared:</p>
              <ol className="text-[#94A3B8] space-y-3 ml-4">
                <li className="flex gap-3"><span className="text-cyan-400 font-bold">1.</span> <span><strong>Data Collection:</strong> Gather PDFs, websites, databases, documents</span></li>
                <li className="flex gap-3"><span className="text-cyan-400 font-bold">2.</span> <span><strong>Cleaning:</strong> Remove noise, fix formatting, handle special characters</span></li>
                <li className="flex gap-3"><span className="text-cyan-400 font-bold">3.</span> <span><strong>Chunking:</strong> Split documents into manageable pieces (typically 256-1024 tokens)</span></li>
                <li className="flex gap-3"><span className="text-cyan-400 font-bold">4.</span> <span><strong>Embedding:</strong> Convert each chunk to vector embeddings</span></li>
                <li className="flex gap-3"><span className="text-cyan-400 font-bold">5.</span> <span><strong>Storage:</strong> Index vectors in database with metadata</span></li>
                <li className="flex gap-3"><span className="text-cyan-400 font-bold">6.</span> <span><strong>Verification:</strong> Test retrieval quality on sample queries</span></li>
              </ol>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Complete RAG Architecture Diagram (Text Description)</h3>
              <div className="bg-[#1e1e1e] p-6 rounded-lg border border-white/10 text-sm text-[#94A3B8] space-y-3">
                <div className="font-bold text-cyan-400">OFFLINE PHASE (Data Preparation):</div>
                <div>📄 Documents → 🔄 Chunking → 🧮 Embeddings → 📦 Vector DB</div>
                
                <div className="border-t border-white/10 pt-3 mt-3 font-bold text-cyan-400">ONLINE PHASE (Query Time):</div>
                <div>❓ User Query → 🧮 Embed Query → 🔍 Search Vector DB → 📋 Get Top-K</div>
                <div>📋 Retrieved Docs → 📝 Create Prompt → 🤖 LLM → 💬 Response</div>
              </div>
            </div>
          </section>

          {/* SECTION 4: VECTOR DATABASES */}
          <section id="vector-db" className="mb-16">
            <h2 className="text-4xl font-black mb-6">🗂️ Vector Databases Explained</h2>

            <div className="space-y-4 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">FAISS (Facebook AI Similarity Search)</h3>
                <p className="text-[#94A3B8] text-sm mb-3">Open-source, CPU/GPU optimized. Best for:</p>
                <ul className="text-[#94A3B8] text-sm space-y-1 ml-4">
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Prototyping and research</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Local deployment</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Millions of vectors</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Cost-free</li>
                  <li>✗ No managed service</li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Pinecone</h3>
                <p className="text-[#94A3B8] text-sm mb-3">Managed vector database. Best for:</p>
                <ul className="text-[#94A3B8] text-sm space-y-1 ml-4">
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Production applications</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Minimal ops burden</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Millions of vectors</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Easy scaling</li>
                  <li>✗ Monthly cost</li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Weaviate</h3>
                <p className="text-[#94A3B8] text-sm mb-3">Open-source + managed. Best for:</p>
                <ul className="text-[#94A3B8] text-sm space-y-1 ml-4">
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Hybrid search (BM25 + vector)</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> GraphQL API</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Self-hosted or cloud</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Metadata filtering</li>
                  <li>✗ Steeper learning curve</li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Chroma</h3>
                <p className="text-[#94A3B8] text-sm mb-3">Lightweight & embeddable. Best for:</p>
                <ul className="text-[#94A3B8] text-sm space-y-1 ml-4">
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Quick prototyping</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Embedded in Python apps</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Small to medium datasets</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Simple API</li>
                  <li>✗ Limited scaling</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Choosing the Right Vector Database</h3>
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-white/10">
                <p className="text-[#94A3B8] text-sm mb-3"><strong>For Prototyping:</strong> Chroma or FAISS (free, simple)</p>
                <p className="text-[#94A3B8] text-sm mb-3"><strong>For Production (small):</strong> Pinecone or self-hosted Weaviate</p>
                <p className="text-[#94A3B8] text-sm mb-3"><strong>For Production (large):</strong> Pinecone, Weaviate, or Elasticsearch with vectors</p>
                <p className="text-[#94A3B8] text-sm"><strong>For Hybrid Search:</strong> Weaviate, Elasticsearch, Milvus</p>
              </div>
            </div>
          </section>

          {/* SECTION 5: PYTHON IMPLEMENTATION */}
          <section id="implementation" className="mb-16">
            <h2 className="text-4xl font-black mb-6">💻 Step-by-Step Python Implementation</h2>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Building a Simple RAG System with LangChain</h3>
              <p className="text-[#94A3B8] mb-4">Here's a complete example using OpenAI and Chroma:</p>
              <CodeBlock
                code={`# Install required packages
# pip install langchain openai chromadb sentence-transformers

from langchain.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA

# 1. Load documents
loader = TextLoader("documents/knowledge_base.txt")
documents = loader.load()

# 2. Split into chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
chunks = text_splitter.split_documents(documents)

# 3. Create embeddings
embeddings = OpenAIEmbeddings(
    openai_api_key="your-key"
)

# 4. Store in vector database
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# 5. Create RAG chain
llm = OpenAI(temperature=0.7, model="gpt-3.5-turbo")
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# 6. Query
response = qa_chain.run("What is machine learning?")
print(response)`}
                language="python"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Using LlamaIndex for RAG</h3>
              <CodeBlock
                code={`from llama_index import SimpleDirectoryReader, GPTVectorStoreIndex, ServiceContext
from llama_index.llms import OpenAI

# 1. Load documents
documents = SimpleDirectoryReader('./data').load_data()

# 2. Create index (handles chunking, embedding, storage)
service_context = ServiceContext.from_defaults(
    llm=OpenAI(model="gpt-3.5-turbo")
)
index = GPTVectorStoreIndex.from_documents(
    documents,
    service_context=service_context
)

# 3. Query
query_engine = index.as_query_engine()
response = query_engine.query("What is the main topic?")
print(response)`}
                language="python"
              />
            </div>
          </section>

          {/* SECTION 6: CHUNKING STRATEGIES */}
          <section id="chunking" className="mb-16">
            <h2 className="text-4xl font-black mb-6">✂️ Chunking Strategies</h2>

            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Fixed-Size Chunking</h3>
                <p className="text-[#94A3B8] text-sm mb-3">Split documents into fixed token chunks (e.g., 512 tokens).</p>
                <p className="text-[#94A3B8] text-sm"><span className="flex items-center gap-1 inline-flex"><Check size={14} className="text-green-400" /> Simple, fast</span> | <span className="flex items-center gap-1 inline-flex"><AlertCircle size={14} className="text-red-400" /> May break sentences, loses context</span></p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Overlap Chunking (Sliding Window)</h3>
                <p className="text-[#94A3B8] text-sm mb-3">Use overlap between chunks (e.g., 512 tokens with 50-token overlap).</p>
                <p className="text-[#94A3B8] text-sm"><span className="flex items-center gap-1 inline-flex"><Check size={14} className="text-green-400" /> Preserves context</span> | <span className="flex items-center gap-1 inline-flex"><AlertCircle size={14} className="text-red-400" /> Redundant data, slightly larger index</span></p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Semantic Chunking</h3>
                <p className="text-[#94A3B8] text-sm mb-3">Split based on meaning (sentences, paragraphs, sections).</p>
                <p className="text-[#94A3B8] text-sm"><span className="flex items-center gap-1 inline-flex"><Check size={14} className="text-green-400" /> Preserves semantics</span> | <span className="flex items-center gap-1 inline-flex"><AlertCircle size={14} className="text-red-400" /> Variable sizes, slower processing</span></p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Hierarchical Chunking</h3>
                <p className="text-[#94A3B8] text-sm mb-3">Build hierarchy: Document → Sections → Paragraphs → Sentences.</p>
                <p className="text-[#94A3B8] text-sm"><span className="flex items-center gap-1 inline-flex"><Check size={14} className="text-green-400" /> Rich context</span> | <span className="flex items-center gap-1 inline-flex"><AlertCircle size={14} className="text-red-400" /> Complex, requires meta setup</span></p>
              </div>
            </div>
          </section>

          {/* SECTION 7: EVALUATION */}
          <section id="evaluation" className="mb-16">
            <h2 className="text-4xl font-black mb-6">📊 RAG Evaluation Metrics</h2>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Key Metrics to Measure</h3>
              <div className="space-y-4">
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-white/10">
                  <strong className="text-cyan-400">Retrieval Accuracy (Recall@K)</strong>
                  <p className="text-[#94A3B8] text-sm mt-2">What % of relevant documents were retrieved in top-K results? Goal: {'>'} 80% recall@5</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-white/10">
                  <strong className="text-cyan-400">Precision</strong>
                  <p className="text-[#94A3B8] text-sm mt-2">What % of retrieved documents are actually relevant? Goal: {'>'} 70% precision</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-white/10">
                  <strong className="text-cyan-400">Hallucination Rate</strong>
                  <p className="text-[#94A3B8] text-sm mt-2">How often does LLM generate false info not in retrieved docs? Goal: {'<'} 10% hallucination</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-white/10">
                  <strong className="text-cyan-400">Answer Relevance</strong>
                  <p className="text-[#94A3B8] text-sm mt-2">How relevant is generated answer to query? Use LLM-based evaluation or human scores</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Measuring Hallucination</h3>
              <CodeBlock
                code={`def check_hallucination(retrieved_docs, generated_answer):
    """
    Simple hallucination check: Does answer only use info from docs?
    """
    # 1. Extract factual claims from answer
    claims = extract_claims(generated_answer)
    
    # 2. Check if each claim appears in retrieved docs
    hallucination_count = 0
    for claim in claims:
        if not any(claim in doc for doc in retrieved_docs):
            hallucination_count += 1
    
    hallucination_rate = hallucination_count / len(claims)
    return hallucination_rate  # Goal: < 0.1 (10%)`}
                language="python"
              />
            </div>
          </section>

          {/* SECTION 8: ADVANCED TECHNIQUES */}
          <section id="advanced" className="mb-16">
            <h2 className="text-4xl font-black mb-6">🚀 Advanced RAG Techniques</h2>

            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Hybrid Search (BM25 + Vector)</h3>
                <p className="text-[#94A3B8] text-sm">Combine keyword search + vector similarity. BM25 for lexical matches, vectors for semantic. Better recall.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Re-ranking</h3>
                <p className="text-[#94A3B8] text-sm">Retrieve top-100 candidates, re-rank with expensive model. Trade cost for accuracy.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Metadata Filtering</h3>
                <p className="text-[#94A3B8] text-sm">Filter by date, source, category before retrieval. Reduces irrelevant results.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Multi-Query Retrieval</h3>
                <p className="text-[#94A3B8] text-sm">Generate multiple query variations, retrieve for each, deduplicate. Improves coverage.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Conversational Memory RAG</h3>
                <p className="text-[#94A3B8] text-sm">Keep conversation history, use multi-turn queries. Better for dialogues.</p>
              </div>
            </div>
          </section>

          {/* SECTION 9: PRODUCTION */}
          <section id="production" className="mb-16">
            <h2 className="text-4xl font-black mb-6">⚡ Production Considerations</h2>

            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Scaling</h3>
                <ul className="text-[#94A3B8] text-sm space-y-2 ml-4">
                  <li>• Use managed vector DB (Pinecone, Weaviate cloud)</li>
                  <li>• Implement caching for frequent queries</li>
                  <li>• Use async/batch processing for indexing</li>
                  <li>• Shard data across multiple indices if needed</li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Cost Optimization</h3>
                <ul className="text-[#94A3B8] text-sm space-y-2 ml-4">
                  <li>• Use cheaper embedding models where possible</li>
                  <li>• Cache embeddings to avoid re-computing</li>
                  <li>• Batch API calls to LLMs</li>
                  <li>• Consider local models to reduce API costs</li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Monitoring & Logging</h3>
                <ul className="text-[#94A3B8] text-sm space-y-2 ml-4">
                  <li>• Track retrieval latency and quality</li>
                  <li>• Monitor hallucination rates</li>
                  <li>• Log failed queries for debugging</li>
                  <li>• Implement user feedback loops</li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Security & Privacy</h3>
                <ul className="text-[#94A3B8] text-sm space-y-2 ml-4">
                  <li>• Encrypt data at rest and in transit</li>
                  <li>• Implement access controls on document corpus</li>
                  <li>• Audit API usage and logging</li>
                  <li>• Be careful with PII in documents</li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 10: COMMON MISTAKES */}
          <section id="mistakes" className="mb-16">
            <h2 className="text-4xl font-black mb-6">⚠️ Common Mistakes in RAG Systems</h2>

            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2"><AlertCircle size={20} className="flex-shrink-0" /> Poor Chunking Choices</h3>
                <p className="text-[#94A3B8] text-sm">Chunks too large = misses specific info. Too small = loses context. Use 512-1024 tokens with overlap.</p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2"><AlertCircle size={20} className="flex-shrink-0" /> Not Testing Retrieval Quality</h3>
                <p className="text-[#94A3B8] text-sm">Assuming your retriever works. Always measure recall/precision on sample queries before deploying.</p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2"><AlertCircle size={20} className="flex-shrink-0" /> Ignoring Embedding Quality</h3>
                <p className="text-[#94A3B8] text-sm">Using weak embeddings makes retrieval poor. Invest in good embedding models (MPNet, E5, etc).</p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2"><AlertCircle size={20} className="flex-shrink-0" /> Not Handling Stale Data</h3>
                <p className="text-[#94A3B8] text-sm">Vector index gets outdated. Implement periodic re-indexing or incremental updates.</p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2"><AlertCircle size={20} className="flex-shrink-0" /> Including Too Much Context</h3>
                <p className="text-[#94A3B8] text-sm">Overloading LLM context = confusion, higher costs, slower. Be selective with relevance thresholds.</p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2"><AlertCircle size={20} className="flex-shrink-0" /> No Citation/Traceability</h3>
                <p className="text-[#94A3B8] text-sm">Users can't verify answers. Always return source documents and positions.</p>
              </div>
            </div>
          </section>

          {/* SECTION 11: USE CASES */}
          <section id="usecases" className="mb-16">
            <h2 className="text-4xl font-black mb-6">💼 Real-World RAG Use Cases</h2>

            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Enterprise Knowledge Base</h3>
                <p className="text-[#94A3B8] text-sm">Employees query internal docs, policies, FAQs. RAG finds relevant sections and generates contextual answers.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Legal Document Assistant</h3>
                <p className="text-[#94A3B8] text-sm">Search contracts, legal precedents, case law. RAG retrieves relevant clauses and explains implications.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Healthcare Documentation Search</h3>
                <p className="text-[#94A3B8] text-sm">Doctors query medical records, research papers, treatment guidelines. RAG returns evidence-based recommendations.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Customer Support AI</h3>
                <p className="text-[#94A3B8] text-sm">Support bot retrieves relevant FAQs, tickets, product docs. Generates personalized, accurate responses.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Academic Research Assistant</h3>
                <p className="text-[#94A3B8] text-sm">Students/researchers ask questions about papers, textbooks. RAG retrieves citations and generates summaries.</p>
              </div>
            </div>
          </section>

          {/* SECTION 12: INTERVIEW QUESTIONS */}
          <section id="interview" className="mb-16">
            <h2 className="text-4xl font-black mb-6">💪 Interview Questions on RAG Systems</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-indigo-400 mb-3 text-lg">Beginner Level</h3>
                <details className="group cursor-pointer bg-white/5 border border-white/10 rounded-xl p-6 mb-4">
                  <summary className="font-bold text-indigo-400 cursor-pointer">1. What is the main purpose of RAG?</summary>
                  <p className="text-[#94A3B8] text-sm mt-3">RAG grounds LLM responses in retrieved documents to improve accuracy, reduce hallucinations, and provide up-to-date information without retraining.</p>
                </details>
              </div>

              <div>
                <h3 className="font-bold text-cyan-400 mb-3 text-lg">Intermediate Level</h3>
                <details className="group cursor-pointer bg-white/5 border border-white/10 rounded-xl p-6 mb-4">
                  <summary className="font-bold text-cyan-400 cursor-pointer">2. How would you optimize retrieval performance for a RAG system with 10M documents?</summary>
                  <p className="text-[#94A3B8] text-sm mt-3">Use hierarchical indexing, implement caching for frequent queries, employ hybrid search (BM25+vectors), apply metadata filtering, re-rank top candidates with expensive models, and monitor latency continuously.</p>
                </details>
              </div>

              <div>
                <h3 className="font-bold text-green-400 mb-3 text-lg">Advanced Level</h3>
                <details className="group cursor-pointer bg-white/5 border border-white/10 rounded-xl p-6">
                  <summary className="font-bold text-green-400 cursor-pointer">3. Design a production RAG system that handles multi-lingual documents and real-time updates.</summary>
                  <p className="text-[#94A3B8] text-sm mt-3">Use multilingual embedding model, maintain separate or unified vector spaces per language, implement streaming ingestion pipeline, use message queues for async updates, employ distributed vector DB for scaling, add language detection at query time, implement monitoring per language, and include cross-language retrieval capability.</p>
                </details>
              </div>
            </div>
          </section>

          {/* SECTION 13: MINI PROJECT */}
          <section id="project" className="mb-16">
            <h2 className="text-4xl font-black mb-6">🛠️ Mini Project: Build Your Own RAG Chatbot</h2>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Project: Document Q&A Chatbot</h3>
              <p className="text-[#94A3B8] mb-6">Build a chatbot that answers questions about any PDF documents you upload.</p>

              <div className="space-y-4">
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-white/10">
                  <strong className="text-cyan-400">📋 Requirements:</strong>
                  <p className="text-[#94A3B8] text-sm mt-2">• Accept PDF uploads • Extract and chunk text • Create embeddings • Store in vector DB • Enable conversational queries • Show source citations</p>
                </div>

                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-white/10">
                  <strong className="text-cyan-400">🛠️ Tech Stack:</strong>
                  <p className="text-[#94A3B8] text-sm mt-2">• Python + LangChain • OpenAI API • Chroma vector DB • Streamlit UI • PyPDF2 for extraction</p>
                </div>

                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-white/10">
                  <strong className="text-cyan-400">Challenge Goals:</strong>
                  <p className="text-[#94A3B8] text-sm mt-2">1. Support multi-document queries • 2. Add conversation memory • 3. Implement metadata filtering • 4. Add response evaluation • 5. Deploy on Hugging Face Spaces</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Starter Code</h3>
              <CodeBlock
                code={`import streamlit as st
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
import os

st.title("📄 RAG Document Q&A")

# Upload PDF
uploaded_file = st.file_uploader("Upload PDF", type="pdf")

if uploaded_file:
    with st.spinner("Processing..."):
        # Save temporarily
        temp_file = f"temp_{uploaded_file.name}"
        with open(temp_file, "wb") as f:
            f.write(uploaded_file.getbuffer())
        
        # Load and process
        loader = PyPDFLoader(temp_file)
        docs = loader.load()
        
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200
        )
        chunks = splitter.split_documents(docs)
        
        embeddings = OpenAIEmbeddings(openai_api_key=st.secrets["openai_api_key"])
        vectorstore = Chroma.from_documents(chunks, embeddings)
        
        qa = RetrievalQA.from_chain_type(
            llm=OpenAI(),
            retriever=vectorstore.as_retriever()
        )
        
        st.success("✅ Document loaded!")
        
        # Query
        query = st.text_input("Ask a question about the document:")
        if query:
            response = qa.run(query)
            st.write(f"**Answer:** {response}")`}
                language="python"
              />
            </div>
          </section>

          {/* SECTION 14: FAQ */}
          <section id="faq" className="mb-16">
            <h2 className="text-4xl font-black mb-6">❓ Frequently Asked Questions</h2>

            <div className="space-y-4 mb-8">
              {faqItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full text-left"
                >
                  <div className="bg-white/5 border border-white/10 hover:border-indigo-400/30 rounded-xl p-6 transition-all cursor-pointer">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-bold text-indigo-400 text-lg">{item.question}</h3>
                      <span className="text-cyan-400 text-2xl font-bold flex-shrink-0">
                        {expandedFAQ === index ? '−' : '+'}
                      </span>
                    </div>
                    {expandedFAQ === index && (
                      <p className="text-[#94A3B8] text-sm mt-4 leading-relaxed">{item.answer}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* INTERNAL LINKS */}
            <div className="mt-16 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-400/30 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Continue Your Learning Journey</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <a 
                  href="/tutorials/generative-ai-for-beginners"
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/30 rounded-lg p-6 transition-all"
                >
                  <div className="text-3xl mb-3">🤖</div>
                  <h4 className="font-bold mb-2 group-hover:text-indigo-400 transition-colors">Generative AI for Beginners</h4>
                  <p className="text-[#94A3B8] text-sm">Master LLM fundamentals before diving into RAG.</p>
                </a>

                <a 
                  href="/courses/prompt-engineering-masterclass"
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/30 rounded-lg p-6 transition-all"
                >
                  <div className="text-3xl mb-3">✍️</div>
                  <h4 className="font-bold mb-2 group-hover:text-cyan-400 transition-colors">Prompt Engineering Masterclass</h4>
                  <p className="text-[#94A3B8] text-sm">Optimize how RAG systems generate responses.</p>
                </a>

                <a 
                  href="/start-assessment"
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-400/30 rounded-lg p-6 transition-all"
                >
                  <div className="text-3xl mb-3">📊</div>
                  <h4 className="font-bold mb-2 group-hover:text-green-400 transition-colors">Interview Assessment</h4>
                  <p className="text-[#94A3B8] text-sm">Test your RAG and AI knowledge.</p>
                </a>
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-[#4F46E5] via-[#06B6D4] to-[#9333EA] rounded-2xl p-12 text-center border border-white/20">
              <h2 className="text-3xl font-black mb-4">Ready to Build RAG Systems?</h2>
              <p className="text-lg mb-8 text-white/90">
                Take your skills further. Test your understanding with our interview assessment.
              </p>
              <button 
                onClick={() => window.location.href = '/start-assessment'}
                className="bg-white text-[#4F46E5] px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-all text-lg"
              >
                Take the Assessment →
              </button>
            </div>
          </section>
        </main>
      </div>

      <footer className="py-10 text-center text-slate-500 text-sm border-t border-white/5 mt-16">
        © 2026 MentorMuni. RAG Systems Tutorial - Complete Guide from Basics to Production.
      </footer>
    </div>
  );
};

export default RAGSystemsTutorial;
