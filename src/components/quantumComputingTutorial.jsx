import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Menu, X, Check } from 'lucide-react';
import logo from '../assets/logo.png';

const QuantumComputingTutorial = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const topics = [
    { id: 'intro', title: 'Introduction to Quantum Computing' },
    { id: 'foundations', title: 'Quantum Mechanics Foundations' },
    { id: 'classical-vs-quantum', title: 'Classical vs Quantum' },
    { id: 'qubits', title: 'Qubits in Depth' },
    { id: 'multiqubit', title: 'Multi-Qubit Systems' },
    { id: 'gates', title: 'Quantum Gates' },
    { id: 'circuits', title: 'Quantum Circuits' },
    { id: 'algorithms', title: 'Quantum Algorithms' },
    { id: 'error-correction', title: 'Error Correction' },
    { id: 'hardware', title: 'Quantum Hardware' },
    { id: 'python', title: 'Programming with Qiskit' },
    { id: 'complexity', title: 'Complexity Theory' },
    { id: 'applications', title: 'Real-World Applications' },
    { id: 'interview', title: 'Interview Questions' },
    { id: 'projects', title: 'Mini Projects' },
    { id: 'faq', title: 'FAQ & Resources' },
  ];

  const faqItems = [
    {
      question: "What is quantum computing?",
      answer: "Quantum computing leverages quantum mechanics principles (superposition, entanglement, interference) to process information. Unlike classical computers using bits (0 or 1), quantum computers use qubits that can be 0, 1, or both simultaneously, enabling exponential parallelism for certain problems."
    },
    {
      question: "Is quantum computing practical today?",
      answer: "Current quantum computers are in NISQ (Noisy Intermediate-Scale Quantum) era: 50-1000 qubits with high error rates. They're useful for research and optimization tasks but not yet superior to classical computers for most real-world problems. True practical advantage is 5-10 years away."
    },
    {
      question: "Do I need physics to learn quantum computing?",
      answer: "Not necessarily. While physics intuition helps, you can learn quantum computing mathematically using linear algebra, complex numbers, and probability. The programming aspects don't require deep physics knowledge. Start with math, add physics intuition gradually."
    },
    {
      question: "Can quantum computers break encryption?",
      answer: "Shor's algorithm (if implemented on fault-tolerant quantum computer with millions of qubits) can break RSA encryption. This is why post-quantum cryptography is being developed. Current quantum computers are nowhere near this capability."
    },
    {
      question: "What does 'superposition' really mean?",
      answer: "Superposition means a qubit exists in multiple states simultaneously until measured. It's not that we don't know the state—the qubit literally exists in a mathematical combination of all possible states, described by probability amplitudes (complex numbers)."
    },
    {
      question: "How is entanglement different from correlation?",
      answer: "Correlation: knowing one particle tells you about another (classical). Entanglement: particles are quantum-mechanically linked such that measuring one instantly affects the state of the other, regardless of distance. Bell inequalities prove it's not just hidden variables."
    },
    {
      question: "Which programming language should I use?",
      answer: "Qiskit (Python, IBM) is most popular for learning and industry. Cirq (Google), Q# (Microsoft), and Silq are alternatives. Python + Qiskit is recommended for beginners due to community, documentation, and free cloud access."
    },
    {
      question: "How long does it take to master quantum computing?",
      answer: "Foundations: 2-3 months. Intermediate algorithms: 6 months. Advanced research level: 2-3 years. The pace depends on your math background and time commitment. Most courses cover fundamentals in 100-150 hours."
    },
    {
      question: "What career opportunities exist in quantum computing?",
      answer: "Quantum Software Engineer, Quantum Algorithm Designer, Quantum Hardware Engineer, Quantum Application Developer. Companies: IBM, Google, Microsoft, Amazon (AWS), startups. Growing field with increasing job opportunities, especially for PhDs currently."
    },
    {
      question: "How does Grover's algorithm actually work?",
      answer: "Grover's algorithm searches an unsorted database of N items in O(√N) time vs O(N) classically. It uses amplitude amplification: superposition over all states, mark the target (phase flip), then amplify the marked state's amplitude through constructive interference."
    },
    {
      question: "What's the difference between NISQ and fault-tolerant quantum?",
      answer: "NISQ: Current era with errors, limited qubits, no error correction. Fault-tolerant: Distant future, error correction works, 1M+ perfect logical qubits. NISQ computers can't run Shor's algo. Game-changer comes with fault tolerance."
    },
    {
      question: "Is quantum computing replacing classical computing?",
      answer: "No. Quantum caters to specific problems (optimization, simulation, factorization). Classical computers excel at general-purpose tasks. Future: hybrid systems combining both. Quantum accelerators for specific workloads, classical for everything else."
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
      <div className="bg-[#1e1e1e] rounded-lg border border-border my-4">
        <div className="flex justify-between items-center px-4 py-2 border-b border-border">
          <span className="text-xs text-muted-foreground">{language}</span>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1 bg-[#FF9500] hover:bg-[#FF9500]/80 rounded text-white text-xs transition-all"
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
    <div className="min-h-screen bg-[#FFFDF8] text-foreground font-sans antialiased">
      {/* Meta Tags for SEO */}
      <head>
        <title>Quantum Computing Tutorial - Complete Guide from Foundations to Algorithms</title>
        <meta name="description" content="Master quantum computing from basics to advanced algorithms. Learn qubits, quantum gates, superposition, entanglement, Shor's algorithm, and Python Qiskit implementation." />
        <meta name="keywords" content="quantum computing course, quantum computing tutorial, qubits explained, quantum gates, quantum algorithms, quantum computing Python, Qiskit, quantum mechanics" />
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
      <header className="sticky top-0 z-[100] bg-[#FFFDF8]/95 backdrop-blur-md border-b border-border px-5">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between py-4">
          <Link to="/" className="transition-transform hover:scale-[1.02]">
            <img src={logo} alt="MentorMuni" className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/free-tutorials" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              ← Back to Free Tutorials
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="md:hidden rounded-lg p-2 text-foreground hover:bg-[#FFF4E0] transition-colors"
            aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
          >
            {isNavOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex gap-8 max-w-[1400px] mx-auto px-6 py-16">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="hidden lg:block w-64 sticky top-24 h-[calc(100vh-100px)] overflow-y-auto">
          <div className="bg-white border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-6 text-[#FF9500]">📑 Course Contents</h3>
            <nav className="space-y-2">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => scrollToSection(topic.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm font-semibold ${
                    activeSection === topic.id
                      ? 'bg-[#FF9500] text-white'
                      : 'text-muted-foreground hover:text-foreground hover:bg-[#FFF4E0]'
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
              Quantum Computing Tutorial
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-4">
              Master quantum computing from mathematical foundations to practical algorithms. Learn qubits, superposition, entanglement, quantum gates, and build quantum circuits using Python and Qiskit.
            </p>
            <div className="flex gap-4 flex-wrap mb-8">
              <div className="px-4 py-2 bg-[#FF9500]/20 border border-[#4F46E5]/50 rounded-lg text-sm">⏱️ 6-8 hours comprehensive</div>
              <div className="px-4 py-2 bg-cyan-600/20 border border-cyan-600/50 rounded-lg text-sm flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Beginner to Advanced</div>
              <div className="px-4 py-2 bg-green-600/20 border border-green-600/50 rounded-lg text-sm">🔬 Mathematics + Code</div>
            </div>
          </div>

          {/* TABLE OF CONTENTS */}
          <div className="mb-16 bg-white border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {topics.map((topic, idx) => (
                <button
                  key={topic.id}
                  onClick={() => scrollToSection(topic.id)}
                  className="text-left p-3 bg-white hover:bg-white/10 rounded-lg transition-all border border-border hover:border-cyan-400/30"
                >
                  <span className="text-cyan-400 font-bold">{idx + 1}.</span> {topic.title}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 1: INTRODUCTION */}
          <section id="intro" className="mb-16">
            <h2 className="text-4xl font-black mb-6">🌌 Introduction to Quantum Computing</h2>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Welcome to the Quantum Revolution</h3>
              <p className="text-muted-foreground mb-4">
                Quantum computing represents a paradigm shift in computation. While classical computers process information using bits (0 or 1), quantum computers harness the principles of quantum mechanics to use qubits that can exist in superposition of both states simultaneously.
              </p>
              <p className="text-muted-foreground mb-4">
                This tutorial takes you from quantum mechanics fundamentals through practical algorithm implementation. By the end, you'll understand how quantum computers work, why they're revolutionary for specific problems, and how to program them using Qiskit.
              </p>
            </div>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Why Learn Quantum Computing Now?</h3>
              <div className="space-y-4">
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-green-400/30">
                  <strong className="text-green-400">📈 Career Opportunity</strong>
                  <p className="text-muted-foreground text-sm mt-2">Growing field with increasing demand. IBM, Google, Microsoft investing billions. Early adopters have significant career advantage.</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-blue-400/30">
                  <strong className="text-blue-400">🚀 Exponential Problem Solving</strong>
                  <p className="text-muted-foreground text-sm mt-2">Quantum computers can solve certain problems (optimization, factorization, simulation) exponentially faster than classical computers.</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-purple-400/30">
                  <strong className="text-purple-400">🔬 Scientific Impact</strong>
                  <p className="text-muted-foreground text-sm mt-2">Revolutionize drug discovery, materials science, artificial intelligence, and cryptography.</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Course Structure</h3>
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <p className="text-muted-foreground text-sm mb-3"><strong>Part 1: Theory (Sections 1-6)</strong> - Quantum mechanics foundations, qubits, gates, circuits</p>
                <p className="text-muted-foreground text-sm mb-3"><strong>Part 2: Algorithms (Sections 7-8)</strong> - Major quantum algorithms with detailed explanations</p>
                <p className="text-muted-foreground text-sm mb-3"><strong>Part 3: Practice (Sections 9-15)</strong> - Hardware, Python programming, applications, interview prep, projects</p>
                <p className="text-muted-foreground text-sm"><strong>Part 4: Resources (Section 16)</strong> - FAQ, career guidance, further learning</p>
              </div>
            </div>
          </section>

          {/* SECTION 2: FOUNDATIONS */}
          <section id="foundations" className="mb-16">
            <h2 className="text-4xl font-black mb-6">📐 Quantum Mechanics Foundations</h2>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Essential Linear Algebra</h3>
              <div className="space-y-4">
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                  <strong className="text-cyan-400">Vectors & State Representation</strong>
                  <p className="text-muted-foreground text-sm mt-2">Quantum states are represented as vectors in complex Hilbert space. |0⟩ = [1, 0]ᵀ and |1⟩ = [0, 1]ᵀ are basis states.</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                  <strong className="text-cyan-400">Complex Numbers</strong>
                  <p className="text-muted-foreground text-sm mt-2">Quantum amplitudes are complex numbers α = a + bi. Probability = |α|² = a² + b². Phase (angle) matters for interference.</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                  <strong className="text-cyan-400">Tensor Products</strong>
                  <p className="text-muted-foreground text-sm mt-2">Multi-qubit states combine via tensor product (⊗). Two qubits: |ψ₁⟩ ⊗ |ψ₂⟩</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Key Quantum Postulates</h3>
              <ol className="text-muted-foreground space-y-3 ml-4">
                <li className="flex gap-3"><span className="text-cyan-400 font-bold">1.</span> <span><strong>State Postulate:</strong> Quantum system state is vector in Hilbert space</span></li>
                <li className="flex gap-3"><span className="text-cyan-400 font-bold">2.</span> <span><strong>Evolution:</strong> Closed system evolves via unitary operators (reversible)</span></li>
                <li className="flex gap-3"><span className="text-cyan-400 font-bold">3.</span> <span><strong>Measurement:</strong> Only eigenvalues are possible outcomes. Measurement collapses state</span></li>
                <li className="flex gap-3"><span className="text-cyan-400 font-bold">4.</span> <span><strong>Composite Systems:</strong> Multi-system state is tensor product of subsystem states</span></li>
              </ol>
            </div>
          </section>

          {/* SECTION 3: CLASSICAL VS QUANTUM */}
          <section id="classical-vs-quantum" className="mb-16">
            <h2 className="text-4xl font-black mb-6">⚡ Classical vs Quantum Computation</h2>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">The Fundamental Difference</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-muted-foreground">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-white font-bold">Property</th>
                      <th className="text-left p-3 text-white font-bold">Classical</th>
                      <th className="text-left p-3 text-white font-bold">Quantum</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="p-3">Unit of Info</td>
                      <td className="p-3">Bit (0 or 1)</td>
                      <td className="p-3">Qubit (0, 1, or both)</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">State Space (n bits)</td>
                      <td className="p-3">n possible states</td>
                      <td className="p-3">2ⁿ superpositional states</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">Parallelism</td>
                      <td className="p-3">Sequential</td>
                      <td className="p-3">Exponential parallelism</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">Gate Reversibility</td>
                      <td className="p-3">Usually irreversible</td>
                      <td className="p-3">Always reversible (unitary)</td>
                    </tr>
                    <tr>
                      <td className="p-3">Information Copying</td>
                      <td className="p-3">Trivial</td>
                      <td className="p-3">No-cloning theorem (impossible)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Exponential State Representation</h3>
              <p className="text-muted-foreground mb-4">The key advantage: superposition gives exponential scaling.</p>
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <p className="text-muted-foreground text-sm"><strong>Classical:</strong> 3 bits = 8 possible values (one at a time)</p>
                <p className="text-muted-foreground text-sm"><strong>Quantum:</strong> 3 qubits = can represent all 8 states simultaneously</p>
                <p className="text-muted-foreground text-sm mt-3"><strong>Scaling:</strong> n qubits represent 2ⁿ states simultaneously</p>
                <p className="text-muted-foreground text-sm">→ 300 qubits: 2³⁰⁰ (more than atoms in universe) classical states at once!</p>
              </div>
            </div>
          </section>

          {/* SECTION 4: QUBITS IN DEPTH */}
          <section id="qubits" className="mb-16">
            <h2 className="text-4xl font-black mb-6">💎 Qubits in Depth</h2>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Superposition Mathematically</h3>
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border mb-4">
                <p className="text-muted-foreground text-sm mb-3"><strong>General single-qubit state:</strong></p>
                <p className="text-muted-foreground text-sm font-mono">|ψ⟩ = α|0⟩ + β|1⟩</p>
                <p className="text-muted-foreground text-sm mt-3">Where α and β are complex numbers with constraint: |α|² + |β|² = 1</p>
                <p className="text-muted-foreground text-sm mt-3"><strong>What it means:</strong> Qubit is literally both 0 and 1 until measured, with probabilities |α|² for 0 and |β|² for 1.</p>
              </div>
              <p className="text-muted-foreground mb-4">
                Equal superposition: |+⟩ = (1/√2)(|0⟩ + |1⟩) means 50% chance of each outcome. Minus state: |-⟩ = (1/√2)(|0⟩ - |1⟩) is different because phase (-1 vs +1) affects interference.
              </p>
            </div>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">The Bloch Sphere</h3>
              <p className="text-muted-foreground mb-4">
                Visualize single-qubit states as points on a unit sphere. North pole = |0⟩, South pole = |1⟩, equator = superpositions. Important: Any point on sphere is a valid quantum state.
              </p>
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <p className="text-muted-foreground text-sm mb-2"><strong>Bloch Sphere Representation:</strong></p>
                <p className="text-muted-foreground text-sm font-mono">|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩</p>
                <p className="text-muted-foreground text-sm mt-2">θ (theta): polar angle, φ (phi): azimuthal angle</p>
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Measurement Postulate</h3>
              <div className="space-y-3 text-muted-foreground">
                <p>Measuring |ψ⟩ = α|0⟩ + β|1⟩ in computational basis:</p>
                <div className="bg-[#1e1e1e] p-3 rounded border border-border">
                  <p className="text-sm">Get outcome 0 with probability |α|²</p>
                  <p className="text-sm">Get outcome 1 with probability |β|²</p>
                  <p className="text-sm">After measurement: state collapses to measured outcome</p>
                </div>
                <p className="text-sm"><strong>Key insight:</strong> Superposition is destroyed by measurement. You can't copy a qubit's state without destroying superposition (no-cloning theorem).</p>
              </div>
            </div>
          </section>

          {/* SECTION 5: MULTI-QUBIT SYSTEMS */}
          <section id="multiqubit" className="mb-16">
            <h2 className="text-4xl font-black mb-6">🔗 Multi-Qubit Systems</h2>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Tensor Products & Entanglement</h3>
              <p className="text-muted-foreground mb-4">
                Two independent qubits: |ψ₁⟩ = α|0⟩ + β|1⟩ and |ψ₂⟩ = γ|0⟩ + δ|1⟩
                Combined state via tensor product:
              </p>
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border mb-4">
                <p className="text-muted-foreground text-sm font-mono">|ψ₁⟩ ⊗ |ψ₂⟩ = αγ|00⟩ + αδ|01⟩ + βγ|10⟩ + βδ|11⟩</p>
                <p className="text-muted-foreground text-sm mt-3">4 basis states, coefficients factorizable = unentangled (separable)</p>
              </div>
              <p className="text-muted-foreground">
                <strong>Entanglement:</strong> When coefficients can't be factored. Bell state: (1/√2)(|00⟩ + |11⟩). Measuring qubit 1 instantly determines qubit 2's outcome—nonlocal correlation.
              </p>
            </div>

            <div className="bg-white border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Bell States (Maximally Entangled)</h3>
              <div className="space-y-3">
                <div className="bg-[#1e1e1e] p-3 rounded border border-border">
                  <p className="text-muted-foreground text-sm font-mono">|Φ+⟩ = (1/√2)(|00⟩ + |11⟩)</p>
                  <p className="text-muted-foreground text-sm mt-1">Perfect correlation: same outcome always</p>
                </div>
                <div className="bg-[#1e1e1e] p-3 rounded border border-border">
                  <p className="text-muted-foreground text-sm font-mono">|Φ-⟩ = (1/√2)(|00⟩ - |11⟩)</p>
                  <p className="text-muted-foreground text-sm mt-1">Perfect anti-correlation with phase</p>
                </div>
                <div className="bg-[#1e1e1e] p-3 rounded border border-border">
                  <p className="text-muted-foreground text-sm font-mono">|Ψ±⟩ = (1/√2)(|01⟩ ± |10⟩)</p>
                  <p className="text-muted-foreground text-sm mt-1">Anti-correlation in different basis</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: QUANTUM GATES */}
          <section id="gates" className="mb-16">
            <h2 className="text-4xl font-black mb-6">🎛️ Quantum Gates</h2>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Single-Qubit Gates (Unitary Matrices)</h3>
              <div className="space-y-4">
                <div className="bg-[#1e1e1e] p-4 rounded border border-border">
                  <p className="text-cyan-400 font-bold text-sm">Pauli Gates (X, Y, Z)</p>
                  <p className="text-muted-foreground text-sm mt-2">X (NOT gate): Flips |0⟩ ↔ |1⟩. Y, Z rotations around y, z axes by π</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded border border-border">
                  <p className="text-cyan-400 font-bold text-sm">Hadamard (H)</p>
                  <p className="text-muted-foreground text-sm mt-2">Creates superposition. H|0⟩ = |+⟩ = (1/√2)(|0⟩+|1⟩). H² = I (involutory)</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded border border-border">
                  <p className="text-cyan-400 font-bold text-sm">Phase Gates (S, T, Rz)</p>
                  <p className="text-muted-foreground text-sm mt-2">Modify phase. S adds π/2, T adds π/4. Don't flip basis state, change relative phase</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Multi-Qubit Gates (Two-Qubit)</h3>
              <div className="space-y-4">
                <div className="bg-[#1e1e1e] p-4 rounded border border-border">
                  <p className="text-cyan-400 font-bold text-sm">CNOT (Controlled-NOT)</p>
                  <p className="text-muted-foreground text-sm mt-2">If control qubit is |1⟩, apply X to target. Creates entanglement. Essential for quantum algorithms</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded border border-border">
                  <p className="text-cyan-400 font-bold text-sm">Toffoli (CCX)</p>
                  <p className="text-muted-foreground text-sm mt-2">Controlled-controlled-X. If both controls are |1⟩, flip target. Universal for classical logic</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded border border-border">
                  <p className="text-cyan-400 font-bold text-sm">Swap Gate</p>
                  <p className="text-muted-foreground text-sm mt-2">Exchanges two qubits' states. Swap = 3 CNOTs</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 7: QUANTUM CIRCUITS */}
          <section id="circuits" className="mb-16">
            <h2 className="text-4xl font-black mb-6">⚙️ Quantum Circuits</h2>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Circuit Representation & Depth</h3>
              <p className="text-muted-foreground mb-4">
                Quantum circuits visualize sequences of gates. Each horizontal line = qubit. Gates represented as boxes/symbols.
              </p>
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border mb-4">
                <p className="text-muted-foreground text-sm font-mono">q₀ ──[H]──●──[M]──</p>
                <p className="text-muted-foreground text-sm font-mono">q₁ ────────⊕──[M]──</p>
                <p className="text-muted-foreground text-sm mt-3">Simple Bell state preparation: Hadamard on q₀, CNOT with q₀ control, measure both</p>
              </div>
              <p className="text-muted-foreground">
                <strong>Circuit Depth:</strong> Minimum number of time steps if parallel gates = depth. Shallow circuits are preferred (less decoherence).
              </p>
            </div>

            <div className="bg-white border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Reversibility & Quantum Advantage</h3>
              <p className="text-muted-foreground">
                All quantum gates are unitary (reversible). This is fundamental constraint. Unlike classical computing where information is lost (irreversible), quantum operations preserve state completely.
              </p>
            </div>
          </section>

          {/* SECTION 8: QUANTUM ALGORITHMS */}
          <section id="algorithms" className="mb-16">
            <h2 className="text-4xl font-black mb-6">🧮 Quantum Algorithms</h2>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Deutsch-Jozsa Algorithm</h3>
              <p className="text-muted-foreground mb-4">
                Determines if function is constant or balanced with single query (vs 2ⁿ⁻¹ + 1 classical queries).
              </p>
              <CodeBlock code={`# Deutsch algorithm (1 qubit special case)
# Problem: Is f(0) = f(1)? (balanced) or f(0) != f(1)? (constant)
# Quantum: 1 query. Classical: 2 queries

# Setup: |ψ⟩ = |0⟩, phase qubit in |-⟩
# Apply H to data qubit → superposition
# Apply oracle Uf (function dependent)
# Apply H again
# Measure: 0 = constant, 1 = balanced`} language="python" />
            </div>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Grover's Search Algorithm</h3>
              <p className="text-muted-foreground mb-4">
                Searches unsorted database of N items in O(√N) vs O(N) classically. Works via amplitude amplification.
              </p>
              <CodeBlock code={`# Grover algorithm concept
# Goal: Find marked element in N items
# Steps:
# 1. Initialize superposition: H^n |0⟩ (all N states equally)
# 2. Oracle: Mark target. Phase flip: -|target⟩
# 3. Diffusion: Reflect about average (amplify marked state)
# 4. Repeat steps 2-3 O(√N) times
# 5. Measure: High probability of marked state

# Time: O(√N) iterations
# Classical exhaustive search: O(N)`} language="python" />
            </div>

            <div className="bg-white border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Shor's Factorization Algorithm</h3>
              <p className="text-muted-foreground mb-4">
                Factors N-bit integers in polynomial time O(n³) vs classical exponential. Breaks RSA cryptography. Requires millions of qubits with error correction.
              </p>
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <p className="text-muted-foreground text-sm mb-2"><strong>Key Insight:</strong> Uses Quantum Fourier Transform to find period of modular exponentiation function.</p>
                <p className="text-muted-foreground text-sm">Period finding generates superposition, QFT extracts period classically (interference amplifies success probability)</p>
              </div>
            </div>
          </section>

          {/* SECTION 9: ERROR CORRECTION */}
          <section id="error-correction" className="mb-16">
            <h2 className="text-4xl font-black mb-6">🛡️ Quantum Error Correction</h2>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">The Decoherence Problem</h3>
              <p className="text-muted-foreground mb-4">
                Quantum states are fragile. Interaction with environment causes:
              </p>
              <div className="space-y-3">
                <div className="bg-[#1e1e1e] p-3 rounded border border-red-400/30">
                  <p className="text-muted-foreground text-sm"><strong>T1 Relaxation:</strong> Excited state decays to ground. Energy loss.</p>
                </div>
                <div className="bg-[#1e1e1e] p-3 rounded border border-red-400/30">
                  <p className="text-muted-foreground text-sm"><strong>T2 Dephasing:</strong> Relative phase information lost. Superposition destroyed.</p>
                </div>
                <div className="bg-[#1e1e1e] p-3 rounded border border-red-400/30">
                  <p className="text-muted-foreground text-sm"><strong>Gate Errors:</strong> Imperfect gate implementations. ~0.1-1% error per gate today.</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Error Correction Code Concept</h3>
              <p className="text-muted-foreground mb-4">
                Encode 1 logical qubit across multiple physical qubits. Errors can be detected and corrected via syndrome measurement (non-destructive).
              </p>
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <p className="text-muted-foreground text-sm"><strong>Surface Codes:</strong> 2D grid of qubits. Error threshold ~1%. Scalable with fabrication improvements.</p>
                <p className="text-muted-foreground text-sm mt-2"><strong>Resource Overhead:</strong> 1 logical qubit ≈ 1000-10000 physical qubits today. Major challenge.</p>
              </div>
            </div>
          </section>

          {/* SECTION 10: QUANTUM HARDWARE */}
          <section id="hardware" className="mb-16">
            <h2 className="text-4xl font-black mb-6">🔬 Quantum Hardware Landscape</h2>

            <div className="space-y-4">
              <div className="bg-white border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Superconducting Qubits</h3>
                <p className="text-muted-foreground text-sm">IBM, Google, Rigetti. Transmons: artificial atoms at mK temperature. Easy control but cooling expensive. Fastest decoherence times (microseconds).</p>
              </div>

              <div className="bg-white border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Trapped Ions</h3>
                <p className="text-muted-foreground text-sm">IonQ, Honeywell. Individual atoms trapped by electric fields. Excellent coherence (seconds). Slower operations but higher fidelity.</p>
              </div>

              <div className="bg-white border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Photonic Systems</h3>
                <p className="text-muted-foreground text-sm">Xanadu, PsiQuantum. Photons as qubits. Room temperature operation. Challenging to create deterministic gates.</p>
              </div>

              <div className="bg-white border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Neutral Atoms</h3>
                <p className="text-muted-foreground text-sm">Atom Computing, Pasqal. Scalable, good coherence. Promising for near-term devices.</p>
              </div>
            </div>
          </section>

          {/* SECTION 11: PYTHON PROGRAMMING */}
          <section id="python" className="mb-16">
            <h2 className="text-4xl font-black mb-6">🐍 Quantum Programming with Qiskit</h2>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Get Started with Qiskit</h3>
              <CodeBlock code={`# Install Qiskit
# pip install qiskit qiskit-aer

from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit_aer import AerSimulator
from qiskit.circuit import Parameter

# Create quantum circuit with 2 qubits
qc = QuantumCircuit(2)

# Apply Hadamard to create superposition
qc.h(0)

# Apply CNOT for entanglement
qc.cx(0, 1)

# Add measurement
qc.measure_all()

# Simulate
simulator = AerSimulator()
job = simulator.run(qc, shots=1000)
result = job.result()
counts = result.get_counts()

print(counts)  # Output: {'00': ~500, '11': ~500}`} language="python" />
            </div>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Implementing Grover's Algorithm</h3>
              <CodeBlock code={`# Simple Grover search (marking |11⟩) from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit_aer import AerSimulator
import numpy as np

# Create circuit
qc = QuantumCircuit(2, 2)

# Initialize superposition
qc.h([0, 1])

# Oracle: Mark |11⟩
qc.cz(0, 1)  # Phase flip target

# Diffusion operator (reflection about average)
qc.h([0, 1])
qc.x([0, 1])
qc.cz(0, 1)
qc.x([0, 1])
qc.h([0, 1])

# Measure
qc.measure([0, 1], [0, 1])

# Simulate
sim = AerSimulator()
job = sim.run(qc, shots=1000)
result = job.result()
counts = result.get_counts()

print(counts)  # Mostly |11⟩ (marked state)`} language="python" />
            </div>

            <div className="bg-white border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Running on IBM Quantum Hardware</h3>
              <CodeBlock code={`# Access IBM Quantum computers (free tier)
from qiskit_ibm_runtime import QiskitRuntimeService

# Authenticate (get token from IBM Quantum)
service = QiskitRuntimeService.save_account(channel="ibm_quantum", token="YOUR_TOKEN")

# List available backends
service = QiskitRuntimeService(channel="ibm_quantum")
backends = service.backends()

# Submit to real hardware
from qiskit_ibm_runtime import Session, Options
with Session(service=service, backend="ibm_nairobi") as session:
    # Run circuit on real quantum computer
    job = session.run(circuit)`} language="python" />
            </div>
          </section>

          {/* SECTION 12: COMPLEXITY THEORY */}
          <section id="complexity" className="mb-16">
            <h2 className="text-4xl font-black mb-6">📊 Quantum Complexity Theory</h2>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">BQP (Bounded-error Quantum Polynomial)</h3>
              <p className="text-muted-foreground mb-4">
                Complexity class for problems solvable by quantum computers in polynomial time with bounded error (success probability {'>'} 2/3).
              </p>
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <p className="text-muted-foreground text-sm mb-2"><strong>Known relationships:</strong></p>
                <p className="text-muted-foreground text-sm">P ⊆ BQP (classic is subset of quantum)</p>
                <p className="text-muted-foreground text-sm">BQP ⊆ PSPACE (quantum is subset of polynomial space)</p>
                <p className="text-muted-foreground text-sm">BQP might contain NP (not proven equal)</p>
                <p className="text-muted-foreground text-sm mt-2"><strong>Unsolved:</strong> P = BQP? BQP = NP?</p>
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Quantum Advantage</h3>
              <p className="text-muted-foreground">
                Problems in BQP but not in P (or outside efficient P approximation) show quantum advantage. Examples: factoring (Shor), unstructured search (Grover), simulating quantum systems.
              </p>
            </div>
          </section>

          {/* SECTION 13: APPLICATIONS */}
          <section id="applications" className="mb-16">
            <h2 className="text-4xl font-black mb-6">Real-World Applications</h2>

            <div className="space-y-4">
              <div className="bg-white border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Cryptography & Security</h3>
                <p className="text-muted-foreground text-sm">Threat: Shor breaks RSA. Solution: Post-quantum cryptography (lattice-based, hash-based codes). Opportunity: Quantum Key Distribution (QKD) for theoretically secure communication.</p>
              </div>

              <div className="bg-white border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Optimization</h3>
                <p className="text-muted-foreground text-sm">QAOA, VQE solve combinatorial optimization faster. Applications: portfolio optimization, drug discovery, logistics, supply chain.</p>
              </div>

              <div className="bg-white border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">AI & Machine Learning</h3>
                <p className="text-muted-foreground text-sm">Quantum ML might accelerate certain algorithms. Variational autoencoders, classification, feature mapping research.</p>
              </div>

              <div className="bg-white border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Chemistry & Materials</h3>
                <p className="text-muted-foreground text-sm">Simulate molecular systems (exponential classical complexity). Drug discovery, catalyst design, materials properties.</p>
              </div>

              <div className="bg-white border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Financial Modeling</h3>
                <p className="text-muted-foreground text-sm">Monte Carlo simulations, portfolio optimization, risk analysis with quantum acceleration.</p>
              </div>
            </div>
          </section>

          {/* SECTION 14: INTERVIEW QUESTIONS */}
          <section id="interview" className="mb-16">
            <h2 className="text-4xl font-black mb-6">💪 Interview Questions on Quantum Computing</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#FF9500] mb-3 text-lg">Beginner Level</h3>
                <details className="group cursor-pointer bg-white border border-border hover:border-[#FFB347]/40 rounded-xl p-6 mb-4">
                  <summary className="font-bold text-[#FF9500] cursor-pointer">1. What's the difference between a qubit and a bit?</summary>
                  <p className="text-muted-foreground text-sm mt-3">A bit is 0 or 1. A qubit can be 0, 1, or superposition (both simultaneously) described by |ψ⟩ = α|0⟩ + β|1⟩. Measurement collapses to 0 or 1 with probabilities |α|² and |β|².</p>
                </details>
              </div>

              <div>
                <h3 className="font-bold text-cyan-400 mb-3 text-lg">Intermediate Level</h3>
                <details className="group cursor-pointer bg-white border border-border hover:border-cyan-400/30 rounded-xl p-6 mb-4">
                  <summary className="font-bold text-cyan-400 cursor-pointer">2. Explain entanglement and why it's important.</summary>
                  <p className="text-muted-foreground text-sm mt-3">Entanglement: qubits are quantum-mechanically linked such that measuring one instantly determines the other. Bell state: (1/√2)(|00⟩ + |11⟩). Importance: enables nonlocal correlations, exponential state space for distributed information, crucial for quantum algorithms (CNOT creates entanglement).</p>
                </details>
              </div>

              <div>
                <h3 className="font-bold text-green-400 mb-3 text-lg">Advanced Level</h3>
                <details className="group cursor-pointer bg-white border border-border hover:border-green-400/30 rounded-xl p-6">
                  <summary className="font-bold text-green-400 cursor-pointer">3. Design a quantum algorithm to solve a specific problem X. What gates would you use?</summary>
                  <p className="text-muted-foreground text-sm mt-3">Approach: (1) Understand classical complexity. (2) Identify quantum advantage (superposition, entanglement, interference). (3) Select appropriate gate set (Hadamard for superposition, CNOT for entanglement, phase gates for interference). (4) Design oracle if needed. (5) Analyze circuit depth, qubit count, error tolerance. Example Grover: Hadamard (superposition), oracle (mark), diffusion (amplify).</p>
                </details>
              </div>
            </div>
          </section>

          {/* SECTION 15: MINI PROJECTS */}
          <section id="projects" className="mb-16">
            <h2 className="text-4xl font-black mb-6">🛠️ Mini Projects</h2>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Project 1: Bell State Simulator</h3>
              <p className="text-muted-foreground mb-4">Build circuit that creates Bell states and verify entanglement.</p>
              <CodeBlock code={`# Bell state creator
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

def create_bell_state(state_type='phi_plus'):
    """
    Create Bell states
    phi_plus: (|00⟩ + |11⟩) / √2
    phi_minus: (|00⟩ - |11⟩) / √2
    psi_plus: (|01⟩ + |10⟩) / √2
    psi_minus: (|01⟩ - |10⟩) / √2
    """
    qc = QuantumCircuit(2, 2)
    
    # Create superposition + entanglement
    qc.h(0)
    qc.cx(0, 1)
    
    if state_type == 'phi_minus':
        qc.z(0)
    elif state_type == 'psi_plus':
        qc.x(0)
    elif state_type == 'psi_minus':
        qc.x(0)
        qc.z(0)
    
    qc.measure([0, 1], [0, 1])
    return qc

# Verify: measure entanglement
sim = AerSimulator()
for state in ['phi_plus', 'phi_minus', 'psi_plus', 'psi_minus']:
    qc = create_bell_state(state)
    result = sim.run(qc, shots=1000).result()
    print(f"{state}: {result.get_counts()}")`} language="python" />
            </div>

            <div className="bg-white border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Project 2: Grover Search Implementation</h3>
              <p className="text-muted-foreground mb-4">Implement Grover's algorithm for 3-qubit search marking |101⟩.</p>
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <p className="text-muted-foreground text-sm mb-2"><strong>Challenge:</strong> Modify code to mark different states, count iterations needed, compare success rates.</p>
              </div>
            </div>
          </section>

          {/* SECTION 16: FAQ */}
          <section id="faq" className="mb-16">
            <h2 className="text-4xl font-black mb-6">❓ Frequently Asked Questions</h2>

            <div className="space-y-4 mb-8">
              {faqItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full text-left"
                >
                  <div className="bg-white border border-border hover:border-[#FFB347]/40 rounded-xl p-6 transition-all cursor-pointer">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-bold text-[#FF9500] text-lg">{item.question}</h3>
                      <span className="text-cyan-400 text-2xl font-bold flex-shrink-0">
                        {expandedFAQ === index ? '−' : '+'}
                      </span>
                    </div>
                    {expandedFAQ === index && (
                      <p className="text-muted-foreground text-sm mt-4 leading-relaxed">{item.answer}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* INTERNAL LINKS */}
            <div className="mt-16 bg-gradient-to-r from-[#FF9500]/20 to-purple-600/20 border border-[#FFB347]/40 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Continue Your AI & Quantum Journey</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <a 
                  href="/tutorials/generative-ai-for-beginners"
                  className="group bg-white hover:bg-white/10 border border-border hover:border-[#FFB347]/40 rounded-lg p-6 transition-all"
                >
                  <div className="text-3xl mb-3">🤖</div>
                  <h4 className="font-bold mb-2 group-hover:text-[#FF9500] transition-colors">Generative AI for Beginners</h4>
                  <p className="text-muted-foreground text-sm">Understand LLMs before exploring quantum AI applications.</p>
                </a>

                <a 
                  href="/courses/rag-systems"
                  className="group bg-white hover:bg-white/10 border border-border hover:border-cyan-400/30 rounded-lg p-6 transition-all"
                >
                  <div className="text-3xl mb-3">🔍</div>
                  <h4 className="font-bold mb-2 group-hover:text-cyan-400 transition-colors">RAG Systems Tutorial</h4>
                  <p className="text-muted-foreground text-sm">Learn retrieval systems for advanced AI.</p>
                </a>

                <a 
                  href="/start-assessment"
                  className="group bg-white hover:bg-white/10 border border-border hover:border-green-400/30 rounded-lg p-6 transition-all"
                >
                  <div className="text-3xl mb-3">📊</div>
                  <h4 className="font-bold mb-2 group-hover:text-green-400 transition-colors">Interview Assessment</h4>
                  <p className="text-muted-foreground text-sm">Test your quantum & AI knowledge.</p>
                </a>
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-[#4F46E5] via-[#06B6D4] to-[#9333EA] rounded-2xl p-12 text-center border border-border">
              <h2 className="text-3xl font-black mb-4">Ready to Explore Quantum Computing?</h2>
              <p className="text-lg mb-8 text-white/90">
                You've learned foundations to algorithms. Now test your knowledge and prepare for quantum careers.
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

      <footer className="py-10 text-center text-muted-foreground text-sm border-t border-border mt-16">
        © 2026 MentorMuni. Quantum Computing Tutorial - Complete Guide from Foundations to Algorithms.
      </footer>
    </div>
  );
};

export default QuantumComputingTutorial;
