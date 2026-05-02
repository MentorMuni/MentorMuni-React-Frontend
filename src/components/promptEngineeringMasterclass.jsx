import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Menu, X, Check, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';

const PromptEngineeringMasterclass = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const topics = [
    { id: 'intro', title: 'Introduction & Overview' },
    { id: 'how-llms-work', title: 'How LLMs Work' },
    { id: 'prompt-types', title: 'Types of Prompts' },
    { id: 'prompt-structure', title: 'Prompt Structure Formula' },
    { id: 'real-world', title: 'Real-World Examples' },
    { id: 'role-based', title: 'Role-Based Prompting' },
    { id: 'evaluation', title: 'Evaluation & Iteration' },
    { id: 'mistakes', title: 'Common Mistakes' },
    { id: 'templates', title: 'Prompt Templates' },
    { id: 'projects', title: 'Mini Projects' },
    { id: 'interview', title: 'Interview Questions' },
    { id: 'faq', title: 'FAQ & Resources' },
  ];

  const faqItems = [
    {
      question: "What's the difference between prompt engineering and just writing instructions?",
      answer: "Prompt engineering is a strategic discipline that uses specific techniques to get optimal results from LLMs. It considers model behavior, tone, structure, and iteration. Random instructions might work sometimes, but prompt engineering ensures consistent, high-quality outputs."
    },
    {
      question: "Do different AI models require different prompting strategies?",
      answer: "Yes, different models have different strengths and training data. ChatGPT, Claude, and Gemini may respond differently to the same prompt. However, core principles like clarity, context, and specificity work across all models. It's best to test prompts with your specific model."
    },
    {
      question: "How do I know if my prompt is effective?",
      answer: "Evaluate prompts by: 1) Consistency - does it produce similar quality repeatedly? 2) Relevance - does the output match your requirements? 3) Completeness - are all aspects addressed? 4) Clarity - can you understand the output easily? 5) Efficiency - did it achieve the goal?"
    },
    {
      question: "Can I use prompt engineering commercially?",
      answer: "Yes, prompt engineering is increasingly used in business. Most terms of service allow commercial use of generated content, but always verify with your specific AI provider. Be aware of data privacy concerns when sharing sensitive information."
    },
    {
      question: "How often should I iterate on prompts?",
      answer: "Iterate until you get consistent results that meet your quality standards. For critical applications, test at least 5-10 variations. Document what works and why to build a knowledge base of effective prompts for your use cases."
    },
    {
      question: "What's the relationship between prompt engineering and AI training?",
      answer: "They're complementary but different. Training involves teaching the model new knowledge. Prompt engineering works within a model's existing capabilities to elicit better outputs. Think of training as improving the student, and prompt engineering as asking better questions."
    },
    {
      question: "Are there industry certifications for prompt engineering?",
      answer: "The field is new, but certifications are emerging from platforms like Deeplearning.AI and OpenAI. However, a strong portfolio demonstrating your prompting skills is often more valuable than certificates right now."
    },
    {
      question: "How do I prompt for code generation safely?",
      answer: "Always review generated code for security issues. Specify: 1) Libraries/frameworks you're using, 2) Error handling requirements, 3) Security considerations, 4) Code style preferences. Never deploy AI-generated code without thorough testing and review."
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

  const CodeBlock = ({ code, language = 'plaintext' }) => {
    const copyToClipboard = () => {
      navigator.clipboard.writeText(code);
      alert('Copied to clipboard!');
    };

    return (
      <div className="bg-[#1e1e1e] rounded-lg border border-border my-4">
        <div className="flex justify-between items-center px-4 py-2 border-b border-border">
          <span className="text-xs text-slate-400">{language}</span>
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
    <div className="min-h-screen mm-site-theme">
      {/* Meta Tags for SEO */}
      <head>
        <title>Prompt Engineering Masterclass - From Beginner to Advanced | Complete Tutorial</title>
        <meta name="description" content="Master prompt engineering with our comprehensive tutorial. Learn prompt engineering techniques, ChatGPT prompts, LLM strategies, and real-world examples. From beginner to advanced." />
        <meta name="keywords" content="prompt engineering, prompt engineering tutorial, prompt engineering for beginners, chatgpt prompt techniques, generative ai prompts, llm prompting strategies, prompt optimization" />
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
      <header className="mm-sticky-header px-5">
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
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-[#FF9500]">Course Contents</h3>
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
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-[#4F46E5] via-[#9333EA] to-[#06B6D4] bg-clip-text text-transparent">
              Prompt Engineering Masterclass
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-4">
              Master the art and science of prompt engineering. Learn ChatGPT prompts, LLM prompting strategies, and advanced techniques used by AI professionals. Go from beginner to advanced level with practical, real-world examples.
            </p>
            <div className="flex gap-4 flex-wrap mb-8">
              <div className="px-4 py-2 bg-[#FF9500]/20 border border-[#4F46E5]/50 rounded-lg text-sm">4-5 hours comprehensive course</div>
              <div className="px-4 py-2 bg-cyan-600/20 border border-cyan-600/50 rounded-lg text-sm">Beginner to Advanced</div>
              <div className="px-4 py-2 bg-green-600/20 border border-green-600/50 rounded-lg text-sm">Industry Best Practices</div>
            </div>
          </div>

          {/* TABLE OF CONTENTS */}
          <div className="mb-16 bg-white border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {topics.slice(0, -1).map((topic, idx) => (
                <button
                  key={topic.id}
                  onClick={() => scrollToSection(topic.id)}
                  className="text-left p-3 bg-white hover:bg-white/10 rounded-lg transition-all border border-border hover:border-[#FFB347]/40"
                >
                  <span className="text-cyan-400 font-bold">{idx + 1}.</span> {topic.title}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 1: INTRODUCTION */}
          <section id="intro" className="mb-16">
            <h2 className="text-4xl font-black mb-6">Introduction to Prompt Engineering</h2>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">What is Prompt Engineering?</h3>
              <p className="text-muted-foreground mb-4">
                Prompt engineering is the practice of crafting, refining, and optimizing text inputs (prompts) to elicit the best possible outputs from Large Language Models (LLMs). It's the bridge between human intent and machine understanding.
              </p>
              <p className="text-muted-foreground mb-4">
                Think of it as learning to communicate effectively with AI. Just as managers get better results by asking employees the right questions, you get better AI results by asking models the right prompts.
              </p>
            </div>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Why Prompt Engineering Matters</h3>
              <div className="space-y-4">
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-green-400/30 text-slate-200 [&_p]:!text-slate-300">
                  <strong className="text-green-400">Quality Control</strong>
                  <p className="text-muted-foreground text-sm mt-2">Better prompts = better outputs. Small changes in wording can significantly impact results.</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-green-400/30 text-slate-200 [&_p]:!text-slate-300">
                  <strong className="text-green-400">Cost Efficiency</strong>
                  <p className="text-muted-foreground text-sm mt-2">Well-engineered prompts reduce the need for API calls and iterations, saving money.</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-green-400/30 text-slate-200 [&_p]:!text-slate-300">
                  <strong className="text-green-400">Speed</strong>
                  <p className="text-muted-foreground text-sm mt-2">Getting the right answer on the first try is faster than iterating multiple times.</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-green-400/30 text-slate-200 [&_p]:!text-slate-300">
                  <strong className="text-green-400">Reliability</strong>
                  <p className="text-muted-foreground text-sm mt-2">Professional prompt engineering ensures consistent, predictable results for production systems.</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Who Should Learn Prompt Engineering?</h3>
              <ul className="text-muted-foreground space-y-3">
                <li className="flex gap-3">
                  <Check size={20} className="text-cyan-400 flex-shrink-0" />
                  <span><strong>Content Creators:</strong> Generate blog posts, social media content, marketing copy</span>
                </li>
                <li className="flex gap-3">
                  <Check size={20} className="text-cyan-400 flex-shrink-0" />
                  <span><strong>Developers:</strong> Use ChatGPT Prompt techniques for code generation and debugging</span>
                </li>
                <li className="flex gap-3">
                  <Check size={20} className="text-cyan-400 flex-shrink-0" />
                  <span><strong>Business Professionals:</strong> Create reports, analyses, and business intelligence</span>
                </li>
                <li className="flex gap-3">
                  <Check size={20} className="text-cyan-400 flex-shrink-0" />
                  <span><strong>Educators:</strong> Develop personalized learning content for students</span>
                </li>
                <li className="flex gap-3">
                  <Check size={20} className="text-cyan-400 flex-shrink-0" />
                  <span><strong>Product Teams:</strong> Implement AI-powered features in applications</span>
                </li>
              </ul>
            </div>
          </section>

          {/* SECTION 2: HOW LLMS WORK */}
          <section id="how-llms-work" className="mb-16">
            <h2 className="text-4xl font-black mb-6">⚙️ How Large Language Models Work</h2>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">The Basics of LLM Architecture</h3>
              <p className="text-muted-foreground mb-4">
                LLMs are deep learning models built on Transformer architecture. They process language by predicting the probability of the next token (word fragment) based on all preceding tokens.
              </p>
              <div className="space-y-4">
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border text-slate-200 [&_p]:!text-slate-300">
                  <strong className="text-[#FF9500]">Token</strong>
                  <p className="text-muted-foreground text-sm mt-2">Small units of text (roughly 1 token ≈ 4 characters). "Hello world" = ~3 tokens.</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border text-slate-200 [&_p]:!text-slate-300">
                  <strong className="text-[#FF9500]">Embedding</strong>
                  <p className="text-muted-foreground text-sm mt-2">Each token is converted to a vector (list of numbers) representing its meaning in context.</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border text-slate-200 [&_p]:!text-slate-300">
                  <strong className="text-[#FF9500]">Attention Mechanism</strong>
                  <p className="text-muted-foreground text-sm mt-2">The model weighs the importance of different tokens when predicting the next one. "The cat sat on the mat" - 'mat' depends more on 'cat' and 'sat' than 'the'.</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border text-slate-200 [&_p]:!text-slate-300">
                  <strong className="text-[#FF9500]">Probability Distribution</strong>
                  <p className="text-muted-foreground text-sm mt-2">The model outputs probabilities for thousands of possible next tokens. Temperature controls randomness (0 = deterministic, 1 = creative).</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">How a Model Responds to Your Prompt</h3>
              <ol className="text-muted-foreground space-y-4 ml-4">
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">1.</span>
                  <span><strong>Tokenization:</strong> Your prompt is split into tokens</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">2.</span>
                  <span><strong>Embedding:</strong> Each token converted to vectors</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">3.</span>
                  <span><strong>Processing:</strong> Transformer layers analyze relationships between tokens</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">4.</span>
                  <span><strong>Prediction:</strong> Model outputs probability for next token</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">5.</span>
                  <span><strong>Selection:</strong> Most probable token selected (or sampled based on temperature)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">6.</span>
                  <span><strong>Repetition:</strong> Process repeats with new token added to sequence, until completion</span>
                </li>
              </ol>
            </div>

            <div className="bg-white border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Key Constraints to Know</h3>
              <ul className="text-muted-foreground space-y-3">
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">⚠️</span>
                  <span><strong>Context Window Limit:</strong> Each model has max tokens it can process (ChatGPT-4: 128K tokens)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">⚠️</span>
                  <span><strong>Knowledge Cutoff:</strong> Model's training data only goes to a certain date</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">⚠️</span>
                  <span><strong>Hallucinations:</strong> Models can generate false information confidently</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">⚠️</span>
                  <span><strong>Probabilistic Nature:</strong> Same prompt may produce different outputs each time</span>
                </li>
              </ul>
            </div>
          </section>

          {/* SECTION 3: TYPES OF PROMPTS */}
          <section id="prompt-types" className="mb-16">
            <h2 className="text-4xl font-black mb-6">📋 Types of Prompts</h2>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Zero-Shot Prompting</h3>
              <p className="text-muted-foreground mb-4">
                You ask the model to perform a task without providing any examples. The model relies on its general knowledge.
              </p>
              <p className="text-muted-foreground mb-4"><strong>When to use:</strong> General tasks, creative work, or when you don't have examples.</p>
              <p className="text-muted-foreground mb-2 font-semibold">Example:</p>
              <CodeBlock
                code={`Prompt: "Generate a product description for a waterproof smartwatch in 50 words."\n\nModel generates description without seeing examples.`}
                language="plaintext"
              />
            </div>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Few-Shot Prompting</h3>
              <p className="text-muted-foreground mb-4">
                You provide a few examples before asking the actual task. This helps the model understand the pattern and desired output format.
              </p>
              <p className="text-muted-foreground mb-4"><strong>When to use:</strong> When you want specific format or style. Usually 2-5 examples work best.</p>
              <p className="text-muted-foreground mb-2 font-semibold">Example:</p>
              <CodeBlock
                code={`Example 1:
Input: "Mango"
Output: "Color: Yellow/Orange, Taste: Sweet, Origin: Tropical"

Example 2:
Input: "Apple"
Output: "Color: Red/Green, Taste: Sweet/Tart, Origin: Temperate"

Now classify:
Input: "Banana"\nOutput: ?`}
                language="plaintext"
              />
            </div>

            <div className="bg-white border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Chain-of-Thought Prompting</h3>
              <p className="text-muted-foreground mb-4">
                You ask the model to explain its reasoning step-by-step before giving the answer. This improves accuracy for complex tasks.
              </p>
              <p className="text-muted-foreground mb-4"><strong>When to use:</strong> Math problems, logic puzzles, complex reasoning tasks.</p>
              <p className="text-muted-foreground mb-2 font-semibold">Example:</p>
              <CodeBlock
                code={`Prompt: "Solve this step by step:\n\nIf Sarah has 3 apples and buys 2 more, \nthen eats 1, how many does she have?\n\nThink through this carefully."\n\nModel explains: "Sarah starts with 3 apples + 2 = 5 apples. \nThen eats 1, so 5 - 1 = 4 apples remaining."`}
                language="plaintext"
              />
            </div>
          </section>

          {/* SECTION 4: PROMPT STRUCTURE FORMULA */}
          <section id="prompt-structure" className="mb-16">
            <h2 className="text-4xl font-black mb-6">🏗️ The Prompt Structure Formula</h2>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">The CRISPR Framework</h3>
              <p className="text-muted-foreground mb-4">A proven structure for effective prompts:</p>
              <div className="space-y-4">
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-[#FFB347]/40 text-slate-200 [&_p]:!text-slate-300">
                  <strong className="text-[#FF9500]">C - Context</strong>
                  <p className="text-muted-foreground text-sm mt-2">Provide background information. "You are a marketing expert with 10 years of experience..."</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-[#FFB347]/40 text-slate-200 [&_p]:!text-slate-300">
                  <strong className="text-[#FF9500]">R - Role</strong>
                  <p className="text-muted-foreground text-sm mt-2">Specify what role the model should take. "Act as a technical writer..."</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-[#FFB347]/40 text-slate-200 [&_p]:!text-slate-300">
                  <strong className="text-[#FF9500]">I - Input</strong>
                  <p className="text-muted-foreground text-sm mt-2">Provide the material to work with. "Here is the product: [details]"</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-[#FFB347]/40 text-slate-200 [&_p]:!text-slate-300">
                  <strong className="text-[#FF9500]">S - Steps</strong>
                  <p className="text-muted-foreground text-sm mt-2">Break down what you want. "First analyze, then create, finally summarize"</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-[#FFB347]/40 text-slate-200 [&_p]:!text-slate-300">
                  <strong className="text-[#FF9500]">P - Process</strong>
                  <p className="text-muted-foreground text-sm mt-2">Specify output format. "Return as JSON, bullet points, or essay format"</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-[#FFB347]/40 text-slate-200 [&_p]:!text-slate-300">
                  <strong className="text-[#FF9500]">R - Review</strong>
                  <p className="text-muted-foreground text-sm mt-2">Ask for quality checks. "Check for accuracy and tone before responding"</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Complete CRISPR Prompt Example</h3>
              <CodeBlock
                code={`Context: You are an expert UX writer with 7 years of experience designing user experiences for SaaS products.

Role: Act as a technical writer creating help documentation.

Input: Feature: "Dark Mode Toggle" - allows users to switch between light and dark interface themes.

Steps:
1. Analyze the feature purpose and user benefits
2. Write clear, jargon-free instructions
3. Include edge cases and troubleshooting
4. Format with headers and subheaders

Process: Return as markdown with H2 for sections, bullet points, and code blocks where relevant.

Review: Before responding, ensure the tone is professional but friendly, and instructions are complete enough for non-technical users.

Now write the documentation.`}
                language="plaintext"
              />
            </div>
          </section>

          {/* SECTION 5: REAL-WORLD EXAMPLES */}
          <section id="real-world" className="mb-16">
            <h2 className="text-4xl font-black mb-6">💼 Real-World ChatGPT Prompt Examples</h2>

            <div className="space-y-6">
              <div className="bg-white border border-border rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4">Example 1: Content Creation</h3>
                <p className="text-muted-foreground mb-3 font-semibold">Task: Write LinkedIn post about AI</p>
                <CodeBlock
                  code={`You are a LinkedIn marketing expert. Write an engaging LinkedIn post (100-150 words) about "The Future of AI in 2026" for a tech professional audience.

Requirements:
- Start with a thought-provoking question
- Include 2 actionable insights
- Add 3 relevant hashtags
- Professional yet conversational tone

Post for maximum engagement and shares.`}
                  language="plaintext"
                />
              </div>

              <div className="bg-white border border-border rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4">Example 2: Code Generation</h3>
                <p className="text-muted-foreground mb-3 font-semibold">Task: Generate Python function</p>
                <CodeBlock
                  code={`You are a senior Python developer. Write a production-ready function with the following specifications:

Function: validate_email(email: str) -> bool

Requirements:
- Check for valid email format
- Handle edge cases (empty strings, special characters)
- Include comprehensive docstring with examples
- Add error handling and meaningful error messages
- Write unit tests

Return only the function code with tests. No explanation needed.`}
                  language="plaintext"
                />
              </div>

              <div className="bg-white border border-border rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4">Example 3: Data Analysis</h3>
                <p className="text-muted-foreground mb-3 font-semibold">Task: Analyze customer data</p>
                <CodeBlock
                  code={`You are a data analyst. Analyze the following customer satisfaction survey results:

Data:
- Total respondents: 500
- Satisfied (4-5 stars): 420
- Dissatisfied (1-3 stars): 80
- Common complaints: Shipping time (35%), Product quality (28%), Customer service (22%)

Provide:
1. Key insights in 3-5 bullet points
2. Root cause analysis for top 2 issues
3. 3 actionable recommendations to improve satisfaction
4. Estimated impact of each recommendation

Focus on business value and implementability.`}
                  language="plaintext"
                />
              </div>
            </div>
          </section>

          {/* SECTION 6: ROLE-BASED PROMPTING */}
          <section id="role-based" className="mb-16">
            <h2 className="text-4xl font-black mb-6">🎭 Role-Based Prompting</h2>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Why Assign Roles?</h3>
              <p className="text-muted-foreground mb-4">
                When you assign a specific role to the LLM, it activates relevant knowledge and communication patterns from its training. The model adjust its response style, expertise level, and focus accordingly.
              </p>
              <p className="text-muted-foreground mb-4">
                Compare "Explain quantum computing" to "You are a quantum physicist. Explain quantum computing to a high school student." The second prompt will get much better results.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border text-slate-200 [&_p]:!text-slate-300">
                <strong className="text-cyan-400">Software Engineer Role</strong>
                <p className="text-muted-foreground text-sm mt-2">"You are a senior software engineer with 15 years of backend development experience..." - Gets technical, architecture-focused responses</p>
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border text-slate-200 [&_p]:!text-slate-300">
                <strong className="text-cyan-400">Teacher Role</strong>
                <p className="text-muted-foreground text-sm mt-2">"You are an experienced high school teacher..." - Gets simplified, educational responses with examples</p>
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border text-slate-200 [&_p]:!text-slate-300">
                <strong className="text-cyan-400">Project Manager Role</strong>
                <p className="text-muted-foreground text-sm mt-2">"You are a project manager at a Fortune 500 company..." - Gets business-focused, stakeholder-aware responses</p>
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border text-slate-200 [&_p]:!text-slate-300">
                <strong className="text-cyan-400">Creative Writer Role</strong>
                <p className="text-muted-foreground text-sm mt-2">"You are a bestselling fiction author..." - Gets creative, narrative-driven responses</p>
              </div>
            </div>
          </section>

          {/* SECTION 7: EVALUATION & ITERATION */}
          <section id="evaluation" className="mb-16">
            <h2 className="text-4xl font-black mb-6">✅ Prompt Evaluation & Iteration</h2>

            <div className="bg-white border border-border rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">How to Evaluate Prompt Quality</h3>
              <div className="space-y-4">
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-green-400/30 text-slate-200 [&_p]:!text-slate-300">
                  <strong className="text-green-400 flex items-center gap-1"><Check size={16} /> Accuracy</strong>
                  <p className="text-muted-foreground text-sm mt-2">Is the output factually correct? Verify against known sources.</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-green-400/30 text-slate-200 [&_p]:!text-slate-300">
                  <strong className="text-green-400 flex items-center gap-1"><Check size={16} /> Relevance</strong>
                  <p className="text-muted-foreground text-sm mt-2">Does it address your specific need? No unnecessary info?</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-green-400/30 text-slate-200 [&_p]:!text-slate-300">
                  <strong className="text-green-400 flex items-center gap-1"><Check size={16} /> Completeness</strong>
                  <p className="text-muted-foreground text-sm mt-2">Are all aspects of your request covered?</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-green-400/30 text-slate-200 [&_p]:!text-slate-300">
                  <strong className="text-green-400 flex items-center gap-1"><Check size={16} /> Consistency</strong>
                  <p className="text-muted-foreground text-sm mt-2">Does it produce similar quality repeatedly?</p>
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-green-400/30 text-slate-200 [&_p]:!text-slate-300">
                  <strong className="text-green-400 flex items-center gap-1"><Check size={16} /> Tone</strong>
                  <p className="text-muted-foreground text-sm mt-2">Does it match the intended audience and context?</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Iteration Strategy</h3>
              <ol className="text-muted-foreground space-y-3 ml-4">
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">1.</span>
                  <span><strong>Test Initial Prompt:</strong> Get baseline response</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">2.</span>
                  <span><strong>Evaluate:</strong> Check against criteria above</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">3.</span>
                  <span><strong>Identify Issue:</strong> What's missing or wrong?</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">4.</span>
                  <span><strong>Refine:</strong> Add clarity, context, or constraints</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">5.</span>
                  <span><strong>Re-test:</strong> Try refined prompt 2-3 times</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">6.</span>
                  <span><strong>Document:</strong> Save what works for future use</span>
                </li>
              </ol>
            </div>
          </section>

          {/* SECTION 8: COMMON MISTAKES */}
          <section id="mistakes" className="mb-16">
            <h2 className="text-4xl font-black mb-6">⚠️ Common Prompt Engineering Mistakes</h2>

            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2"><AlertCircle size={20} className="flex-shrink-0" /> Mistake 1: Vague Prompts</h3>
                <p className="text-muted-foreground mb-3">
                  <strong>Wrong:</strong> "Write something about marketing"<br/>
                  <strong>Right:</strong> "Write a 500-word blog post about email marketing best practices for SaaS companies, targeting marketing managers"
                </p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2"><AlertCircle size={20} className="flex-shrink-0" /> Mistake 2: No Format Specification</h3>
                <p className="text-muted-foreground mb-3">
                  <strong>Wrong:</strong> "Give me ideas for a new app"<br/>
                  <strong>Right:</strong> "Give me 5 app ideas. For each, provide: name, target user, core feature, 1-line description. Format as bullet points."
                </p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2"><AlertCircle size={20} className="flex-shrink-0" /> Mistake 3: Asking Multiple Unrelated Questions</h3>
                <p className="text-muted-foreground mb-3">
                  <strong>Wrong:</strong> "Explain React hooks, write me a function, and how do I deploy?"<br/>
                  <strong>Right:</strong> Use separate prompts for each topic to get better focused responses
                </p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2"><AlertCircle size={20} className="flex-shrink-0" /> Mistake 4: Not Providing Context</h3>
                <p className="text-muted-foreground mb-3">
                  <strong>Wrong:</strong> "Optimize this code"<br/>
                  <strong>Right:</strong> "Optimize this Python function for readability and performance. Context: It's used in a real-time data processing pipeline that handles 10K events/second"
                </p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2"><AlertCircle size={20} className="flex-shrink-0" /> Mistake 5: Sharing Sensitive Information</h3>
                <p className="text-muted-foreground mb-3">
                  <strong>Wrong:</strong> Pasting customer data, passwords, API keys, or confidential information<br/>
                  <strong>Right:</strong> Redact or anonymize sensitive data. Use placeholders: "[CUSTOMER_EMAIL]", "[API_KEY]"
                </p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2"><AlertCircle size={20} className="flex-shrink-0" /> Mistake 6: Not Setting Length Constraints</h3>
                <p className="text-muted-foreground mb-3">
                  <strong>Wrong:</strong> "Summarize this article"<br/>
                  <strong>Right:</strong> "Summarize this 2000-word article in exactly 150 words, keeping the 3 main points"
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 9: PROMPT TEMPLATES */}
          <section id="templates" className="mb-16">
            <h2 className="text-4xl font-black mb-6">📝 Ready-to-Use Prompt Templates</h2>

            <div className="space-y-6">
              <div className="bg-white border border-border rounded-xl p-8">
                <h3 className="text-xl font-bold mb-4">Content Creation Template</h3>
                <CodeBlock
                  code={`You are [ROLE]. Create [CONTENT_TYPE] about [TOPIC] for [AUDIENCE].

Specific requirements:
- Length: [LENGTH]
- Tone: [TONE - formal/casual/technical/friendly]
- Include: [REQUIREMENTS]
- Exclude: [EXCLUSIONS]
- Format: [FORMAT - bullet points/essay/list/etc]
- Purpose: [WHY - why is this content needed?]

Deliver [CONTENT_TYPE] that resonates with [AUDIENCE].`}
                  language="plaintext"
                />
              </div>

              <div className="bg-white border border-border rounded-xl p-8">
                <h3 className="text-xl font-bold mb-4">Analysis Template</h3>
                <CodeBlock
                  code={`You are [EXPERT_ROLE]. Analyze [SUBJECT] from these perspectives:

1. Technical aspects - What technologies involved?
2. Business impact - How does this affect business?
3. User experience - How do users feel about this?
4. Risks - What could go wrong?
5. Opportunities - What's the upside?

Provide 2-3 sentences per perspective.
Conclude with top 3 recommendations.`}
                  language="plaintext"
                />
              </div>

              <div className="bg-white border border-border rounded-xl p-8">
                <h3 className="text-xl font-bold mb-4">Problem Solving Template</h3>
                <CodeBlock
                  code={`You are [EXPERT]. Help me solve this problem:

Problem: [DESCRIBE PROBLEM]
Context: [BACKGROUND INFO]
What I've tried: [PREVIOUS ATTEMPTS]
Constraints: [LIMITATIONS - budget/time/resources]
Success criteria: [WHAT DOES SUCCESS LOOK LIKE?]

Please provide:
1. Root cause analysis
2. 3 possible solutions with pros/cons
3. My recommendation with step-by-step implementation
4. Potential pitfalls to watch for`}
                  language="plaintext"
                />
              </div>
            </div>
          </section>

          {/* SECTION 10: MINI PROJECTS */}
          <section id="projects" className="mb-16">
            <h2 className="text-4xl font-black mb-6">🛠️ Mini Projects to Practice</h2>

            <div className="space-y-6">
              <div className="bg-white border border-border rounded-xl p-8">
                <h3 className="text-xl font-bold mb-4">Project 1: Personal Brand Content Generator</h3>
                <p className="text-muted-foreground mb-4">
                  <strong>Goal:</strong> Create a prompt that generates personalized LinkedIn content consistently
                </p>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border mb-4 text-slate-200 [&_p]:!text-slate-300">
                  <p className="text-muted-foreground text-sm">
                    Create a prompt that generates LinkedIn posts about your niche (e.g., AI, marketing, design). The prompt should ensure consistent tone, mention industry insights, include engagement-driving elements, and be original each time.
                  </p>
                </div>
                <p className="text-muted-foreground font-semibold">💡 Tip:</p>
                <ul className="text-muted-foreground text-sm space-y-1 ml-4">
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Define your unique perspective/insights</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Specify the format (question, story, insight)</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Include brand voice guidelines</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Test with 3-5 variations, document best practices</li>
                </ul>
              </div>

              <div className="bg-white border border-border rounded-xl p-8">
                <h3 className="text-xl font-bold mb-4">Project 2: Tutorial Maker</h3>
                <p className="text-muted-foreground mb-4">
                  <strong>Goal:</strong> Create a prompt that turns complex topics into step-by-step tutorials
                </p>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border mb-4 text-slate-200 [&_p]:!text-slate-300">
                  <p className="text-muted-foreground text-sm">
                    Create a prompt that transforms a complex concept (e.g., "Docker containers") into a beginner-friendly tutorial with steps, examples, and a practice exercise.
                  </p>
                </div>
                <p className="text-muted-foreground font-semibold">💡 Tip:</p>
                <ul className="text-muted-foreground text-sm space-y-1 ml-4">
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Break complexity into digestible chunks</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Include real, runnable examples</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Add prerequisites and common mistakes</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> End with practice problems</li>
                </ul>
              </div>

              <div className="bg-white border border-border rounded-xl p-8">
                <h3 className="text-xl font-bold mb-4">Project 3: Customer Support Optimizer</h3>
                <p className="text-muted-foreground mb-4">
                  <strong>Goal:</strong> Create a prompt that generates helpful, consistent customer support responses
                </p>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border mb-4 text-slate-200 [&_p]:!text-slate-300">
                  <p className="text-muted-foreground text-sm">
                    Create a prompt that takes a customer question and generates a support response that's helpful, on-brand, offers solutions, and includes follow-up options.
                  </p>
                </div>
                <p className="text-muted-foreground font-semibold">💡 Tip:</p>
                <ul className="text-muted-foreground text-sm space-y-1 ml-4">
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Specify company tone and values</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Include empathy guidelines</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Provide company knowledge base references</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Require human review before sending</li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 11: INTERVIEW QUESTIONS */}
          <section id="interview" className="mb-16">
            <h2 className="text-4xl font-black mb-6">💪 Interview Questions on Prompt Engineering</h2>

            <div className="space-y-6">
              <details className="group cursor-pointer bg-white border border-border rounded-xl p-6">
                <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4 cursor-pointer">
                  1️⃣ Explain the difference between temperature and top_p parameters in LLM generation.
                </summary>
                <p className="text-muted-foreground text-sm">
                  <strong>Answer:</strong> Temperature controls randomness on a scale of 0-2 (0=deterministic, 1=balanced, 2=random). Top_p controls diversity by only considering tokens with cumulative probability up to p. Temperature affects all probabilities equally, while top_p filters low-probability tokens. For factual tasks use low temperature (0.3), for creative tasks use higher (0.8-1.0).
                </p>
              </details>

              <details className="group cursor-pointer bg-white border border-border rounded-xl p-6">
                <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4 cursor-pointer">
                  2️⃣ How would you debug a prompt that's producing inconsistent results?
                </summary>
                <p className="text-muted-foreground text-sm">
                  <strong>Answer:</strong> 1) Test with same prompt 5-10 times to establish baseline variations, 2) Lower temperature to increase consistency, 3) Add more constraints/specificity to the prompt, 4) Use few-shot examples to guide behavior, 5) Check if results are legitimately random or actually inconsistent, 6) Test with different models to rule out model issues, 7) Document variations and patterns.
                </p>
              </details>

              <details className="group cursor-pointer bg-white border border-border rounded-xl p-6">
                <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4 cursor-pointer">
                  3️⃣ Describe a scenario where chain-of-thought prompting would significantly improve results.
                </summary>
                <p className="text-muted-foreground text-sm">
                  <strong>Answer:</strong> Math word problems, logical reasoning tasks, or complex multi-step analysis. Without CoT, model might guess. With CoT ("Let's think step by step…"), model explains reasoning before answering, improving accuracy 5-50% depending on complexity. Example: asking for step-by-step derivation of physics equations much better than direct answer.
                </p>
              </details>

              <details className="group cursor-pointer bg-white border border-border rounded-xl p-6">
                <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4 cursor-pointer">
                  4️⃣ How do you handle prompt injection attacks in production?
                </summary>
                <p className="text-muted-foreground text-sm">
                  <strong>Answer:</strong> 1) Never concatenate user input directly into prompts, 2) Use templating with clear delimiters between system instructions and user content, 3) Sanitize inputs for suspicious patterns, 4) Implement output validation/filtering, 5) Set clear system instructions that model should follow, 6) Use lower temperature for sensitive tasks, 7) Audit logs for suspicious patterns.
                </p>
              </details>

              <details className="group cursor-pointer bg-white border border-border rounded-xl p-6">
                <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4 cursor-pointer">
                  5️⃣ What metrics would you use to measure prompt engineering effectiveness?
                </summary>
                <p className="text-muted-foreground text-sm">
                  <strong>Answer:</strong> 1) Accuracy - correct outputs/total outputs, 2) Relevance - rated by human or automated metric, 3) Cost efficiency - tokens used per query, 4) Latency - time to response, 5) User satisfaction - NPS or survey scores, 6) Consistency - variance across repeated prompts, 7) Failure rate - prompts that produce unusable outputs. Track these over time to show improvement.
                </p>
              </details>
            </div>
          </section>

          {/* SECTION 12: FAQ & RESOURCES */}
          <section id="faq" className="mb-16">
            <h2 className="text-4xl font-black mb-6">❓ Frequently Asked Questions</h2>

            <div className="space-y-4">
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

            {/* INTERNAL LINKS SECTION */}
            <div className="mt-16 bg-gradient-to-r from-[#FF9500]/20 to-purple-600/20 border border-[#FFB347]/40 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Continue Your Learning Journey</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <a 
                  href="/tutorials/generative-ai-for-beginners"
                  className="group bg-white hover:bg-white/10 border border-border hover:border-[#FFB347]/40 rounded-lg p-6 transition-all"
                >
                  <div className="text-3xl mb-3">🤖</div>
                  <h4 className="font-bold mb-2 group-hover:text-[#FF9500] transition-colors">Generative AI for Beginners</h4>
                  <p className="text-muted-foreground text-sm">Master the fundamentals of generative AI, LLMs, and how they work.</p>
                </a>

                <a 
                  href="/start-assessment"
                  className="group bg-white hover:bg-white/10 border border-border hover:border-cyan-400/30 rounded-lg p-6 transition-all"
                >
                  <div className="text-3xl mb-3">📊</div>
                  <h4 className="font-bold mb-2 group-hover:text-cyan-400 transition-colors">Interview Assessment</h4>
                  <p className="text-muted-foreground text-sm">Test your AI and prompt engineering knowledge with our assessment.</p>
                </a>

                <a 
                  href="/resume-analyzer"
                  className="group bg-white hover:bg-white/10 border border-border hover:border-green-400/30 rounded-lg p-6 transition-all"
                >
                  <div className="text-3xl mb-3">📄</div>
                  <h4 className="font-bold mb-2 group-hover:text-green-400 transition-colors">Resume Analyzer</h4>
                  <p className="text-muted-foreground text-sm">Get AI feedback on your resume and improve your interview readiness.</p>
                </a>
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-[#4F46E5] via-[#9333EA] to-[#06B6D4] rounded-2xl p-12 text-center border border-border">
              <h2 className="text-3xl font-black mb-4">Ready to Master Prompt Engineering?</h2>
              <p className="text-lg mb-8 text-white/90">
                Take the next step in your AI journey. Assess your knowledge and identify areas for improvement.
              </p>
              <button 
                onClick={() => window.location.href = '/start-assessment'}
                className="bg-white text-[#4F46E5] px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-all text-lg"
              >
                Take the AI Assessment →
              </button>
            </div>
          </section>
        </main>
      </div>

      <footer className="py-10 text-center text-muted-foreground text-sm border-t border-border mt-16">
        © 2026 MentorMuni. Prompt Engineering Masterclass - Complete Tutorial with Real-World Examples.
      </footer>
    </div>
  );
};

export default PromptEngineeringMasterclass;
