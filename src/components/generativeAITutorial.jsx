import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Menu, X, Check } from 'lucide-react';
import logo from '../assets/logo.png';

const GenerativeAITutorial = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');

  const topics = [
    { id: 'intro', title: 'Introduction to Generative AI' },
    { id: 'how-it-works', title: 'How Generative AI Works' },
    { id: 'popular-models', title: 'Popular AI Models' },
    { id: 'applications', title: 'Real-World Applications' },
    { id: 'prompt-engineering', title: 'Prompt Engineering Basics' },
    { id: 'hands-on', title: 'Hands-On Prompt Examples' },
    { id: 'risks', title: 'Risks & Limitations' },
    { id: 'career', title: 'Career Paths in AI' },
    { id: 'practice', title: 'Practice Questions' },
    { id: 'summary', title: 'Summary & Next Steps' },
    { id: 'cta', title: 'Take the Assessment' },
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

  const CodeBlock = ({ code, id }) => {
    const copyToClipboard = () => {
      navigator.clipboard.writeText(code);
      alert('Code copied to clipboard!');
    };

    return (
      <div className="bg-[#1e1e1e] rounded-lg border border-[#E0DCCF] my-4">
        <div className="flex justify-between items-center px-4 py-2 border-b border-[#E0DCCF]">
          <span className="text-xs text-muted-foreground">Prompt Example</span>
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
    <div className="min-h-screen bg-[#FFFDF8] text-foreground-muted font-sans antialiased">
      {/* Meta Tags for SEO */}
      <head>
        <title>Generative AI for Beginners - Learn GPT, LLMs & Prompt Engineering</title>
        <meta name="description" content="Complete beginner guide to Generative AI, GPT models, LLMs, and prompt engineering. Learn how AI works with practical examples and interview questions." />
        <meta name="keywords" content="Generative AI, GPT, LLMs, prompt engineering, AI for beginners, artificial intelligence, machine learning" />
      </head>

      {/* HEADER */}
      <header className="sticky top-0 z-[100] bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#F0ECE0] px-5">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between py-4">
          <Link to="/" className="transition-transform hover:scale-[1.02]">
            <img src={logo} alt="MentorMuni" className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/free-tutorials" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              ← Back to Free Tutorials
            </Link>
          </nav>

          <button onClick={() => setIsNavOpen(!isNavOpen)} className="md:hidden text-white">
            {isNavOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex gap-8 max-w-[1400px] mx-auto px-6 py-16">
        
        {/* LEFT SIDEBAR NAVIGATION - DESKTOP ONLY */}
        <aside className="hidden lg:block w-64 sticky top-24 h-[calc(100vh-100px)] overflow-y-auto">
          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
            <h3 className="text-lg font-bold mb-6 text-[#FF9500]">Topics</h3>
            <nav className="space-y-2">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => scrollToSection(topic.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm font-semibold ${
                    activeSection === topic.id
                      ? 'bg-[#FF9500] text-white'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
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
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] bg-clip-text text-transparent">
              Generative AI for Beginners
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-4">
              Learn how GPT, LLMs, and prompt engineering work with practical beginner examples. Master the fundamentals of Generative AI and prepare for AI-driven careers.
            </p>
            <div className="flex gap-4 flex-wrap">
              <div className="px-4 py-2 bg-[#FF9500]/20 border border-[#4F46E5]/50 rounded-lg text-sm">3-4 hours read</div>
              <div className="px-4 py-2 bg-cyan-600/20 border border-cyan-600/50 rounded-lg text-sm">No Experience Needed</div>
              <div className="px-4 py-2 bg-green-600/20 border border-green-600/50 rounded-lg text-sm">Practical Examples</div>
            </div>
          </div>

          <div className="mb-16 bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
            <ul className="grid md:grid-cols-2 gap-4 text-muted-foreground">
              <li className="flex gap-3">
                <Check size={20} className="text-cyan-400 flex-shrink-0" />
                <span>What Generative AI is and how it differs from other AI</span>
              </li>
              <li className="flex gap-3">
                <Check size={20} className="text-cyan-400 flex-shrink-0" />
                <span>How neural networks and transformers power AI models</span>
              </li>
              <li className="flex gap-3">
                <Check size={20} className="text-cyan-400 flex-shrink-0" />
                <span>Popular models: ChatGPT, Gemini, Claude, LLaMA</span>
              </li>
              <li className="flex gap-3">
                <Check size={20} className="text-cyan-400 flex-shrink-0" />
                <span>Real-world applications across industries</span>
              </li>
              <li className="flex gap-3">
                <Check size={20} className="text-cyan-400 flex-shrink-0" />
                <span>Writing effective prompts for better AI responses</span>
              </li>
              <li className="flex gap-3">
                <Check size={20} className="text-cyan-400 flex-shrink-0" />
                <span>Limitations, risks, and ethical considerations</span>
              </li>
            </ul>
          </div>

          {/* SECTION 1: INTRODUCTION */}
          <section id="intro" className="mb-16">
            <h2 className="text-4xl font-black mb-6">Introduction to Generative AI</h2>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">What is Generative AI?</h3>
              <p className="text-muted-foreground mb-4">
                Generative AI is a type of artificial intelligence that can create new content. Instead of just analyzing or classifying data, it <strong>generates</strong> new text, images, code, music, or other content based on what it learned from training data.
              </p>
              <p className="text-muted-foreground mb-4">
                Think of it like this: If regular AI is a student who can identify if a dog is in a picture, Generative AI is a student who can draw a picture of a dog from scratch.
              </p>
            </div>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Generative AI vs Other AI Types</h3>
              <div className="space-y-4">
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-[#E0DCCF]">
                  <strong className="text-cyan-400">Generative AI</strong> - Creates new content (ChatGPT, DALL-E)
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-[#E0DCCF]">
                  <strong className="text-[#FF9500]">Discriminative AI</strong> - Classifies or recognizes patterns (email spam filter, image recognition)
                </div>
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-[#E0DCCF]">
                  <strong className="text-green-400">Predictive AI</strong> - Forecasts future outcomes (weather prediction, stock prices)
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Key Breakthroughs</h3>
              <ul className="text-muted-foreground space-y-3">
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">2012</span>
                  <span>Deep learning revolution begins with neural networks</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">2017</span>
                  <span>"Attention Is All You Need" paper introduces Transformers</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">2018-2020</span>
                  <span>BERT, GPT-2, GPT-3 show massive improvements in language understanding</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">2022-2024</span>
                  <span>ChatGPT, GPT-4, Gemini, Claude become mainstream</span>
                </li>
              </ul>
            </div>
          </section>

          {/* SECTION 2: HOW IT WORKS */}
          <section id="how-it-works" className="mb-16">
            <h2 className="text-4xl font-black mb-6">⚙️ How Generative AI Works</h2>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">The Three Main Steps</h3>
              <div className="space-y-6">
                <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#FFB347]/40">
                  <h4 className="font-bold text-[#FF9500] mb-2 text-lg">1. Training</h4>
                  <p className="text-muted-foreground text-sm">
                    The AI model learns from billions of text examples. It identifies patterns like "the word 'cat' often appears near words like 'meow' or 'furry'". This creates internal representations of language.
                  </p>
                </div>

                <div className="bg-[#1e1e1e] p-6 rounded-lg border border-cyan-400/30">
                  <h4 className="font-bold text-cyan-400 mb-2 text-lg">2. Encoding</h4>
                  <p className="text-muted-foreground text-sm">
                    When you write a prompt, the model converts your words into mathematical representations (vectors) that it can process and understand the meaning.
                  </p>
                </div>

                <div className="bg-[#1e1e1e] p-6 rounded-lg border border-green-400/30">
                  <h4 className="font-bold text-green-400 mb-2 text-lg">3. Generation</h4>
                  <p className="text-muted-foreground text-sm">
                    Based on the patterns it learned, the model predicts the next word, then the next, and the next—creating a complete response one word at a time.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">What is a Large Language Model (LLM)?</h3>
              <p className="text-muted-foreground mb-4">
                An LLM is a type of Generative AI trained on huge amounts of text data. "Large" means billions of parameters (adjustable weights), and "Language" means it specializes in understanding and generating human language.
              </p>
              <ul className="text-muted-foreground space-y-2 ml-4">
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> <strong>Parameters:</strong> Think of them like the model's "memory knobs"</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> <strong>Context Window:</strong> How much text the model can "remember" at once (e.g., 4K, 100K tokens)</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> <strong>Temperature:</strong> Controls randomness (0 = predictable, 1 = creative)</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Simple Example: Predicting the Next Word</h3>
              <p className="text-muted-foreground mb-4">Imagine you train a model with these sentences:</p>
              <CodeBlock
                code={`"The cat sat on the mat"
"The dog ran in the park"
"The bird flew over the tree"`}
                id="training-data"
              />
              <p className="text-muted-foreground mt-4 mb-4">Now you prompt: "The cat"</p>
              <p className="text-muted-foreground mb-4">The model thinks: "After 'The cat', the word 'sat' appeared 100%, the word 'ran' 0%, the word 'flew' 0%"</p>
              <p className="text-muted-foreground p-4 bg-[#1E293B] rounded-lg border border-cyan-400/30">
                <strong>Output:</strong> "The cat sat..." (continues predicting word by word)
              </p>
            </div>
          </section>

          {/* SECTION 3: POPULAR MODELS */}
          <section id="popular-models" className="mb-16">
            <h2 className="text-4xl font-black mb-6">Popular AI Models</h2>

            <div className="space-y-4 mb-8">
              <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-1 h-12 bg-red-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-2">ChatGPT (OpenAI)</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      The most popular conversational AI. Trained on GPT-3.5 and GPT-4 architectures. Great for writing, coding, brainstorming, and answering questions.
                    </p>
                    <p className="text-cyan-400 text-xs font-semibold">Free version available | Premium ($20/month)</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-1 h-12 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-2">Google Gemini</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      Google's advanced AI model. Known for multimodal capabilities (text, images, video). Integrates with Google services.
                    </p>
                    <p className="text-cyan-400 text-xs font-semibold">Free version available | Gemini API for developers</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-1 h-12 bg-slate-600 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-2">Claude (Anthropic)</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      Focused on safety and accuracy. Excellent at analysis and detailed explanations. Known for being thoughtful and nuanced.
                    </p>
                    <p className="text-cyan-400 text-xs font-semibold">Web interface & API available</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-1 h-12 bg-amber-600 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-2">LLaMA (Meta)</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      Open-source model. Can be run locally on your own computer. Basis for many private AI implementations.
                    </p>
                    <p className="text-cyan-400 text-xs font-semibold">Free & open-source | Self-hosted</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-1 h-12 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-2">DALL-E & Midjourney</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      Image generation models. DALL-E by OpenAI and Midjourney create images from text descriptions. Great for creative design.
                    </p>
                    <p className="text-cyan-400 text-xs font-semibold">Paid services | Pay-per-image or subscription</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: APPLICATIONS */}
          <section id="applications" className="mb-16">
            <h2 className="text-4xl font-black mb-6">Real-World Applications</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
                <h4 className="font-bold text-cyan-400 mb-3">Content Creation</h4>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Blog posts and articles</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Social media content</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Email marketing</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Product descriptions</li>
                </ul>
              </div>

              <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
                <h4 className="font-bold text-cyan-400 mb-3">Software Development</h4>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Code generation (Copilot)</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Bug debugging assistance</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Documentation writing</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Code review suggestions</li>
                </ul>
              </div>

              <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
                <h4 className="font-bold text-cyan-400 mb-3">Healthcare</h4>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Medical report summarization</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Patient symptom analysis</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Drug discovery support</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Clinical trial optimization</li>
                </ul>
              </div>

              <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
                <h4 className="font-bold text-cyan-400 mb-3">Customer Service</h4>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li>✓ AI chatbots (24/7 support)</li>
                  <li>✓ Email response suggestions</li>
                  <li>✓ FAQ automation</li>
                  <li>✓ Complaint resolution</li>
                </ul>
              </div>

              <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
                <h4 className="font-bold text-cyan-400 mb-3">Business Intelligence</h4>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li>✓ Data analysis reports</li>
                  <li>✓ Market trend analysis</li>
                  <li>✓ Decision support</li>
                  <li>✓ Sales forecasting</li>
                </ul>
              </div>

              <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
                <h4 className="font-bold text-cyan-400 mb-3">Creative Industries</h4>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li>✓ Image generation</li>
                  <li>✓ Music composition</li>
                  <li>✓ Video scripts</li>
                  <li>✓ Design concepts</li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 5: PROMPT ENGINEERING BASICS */}
          <section id="prompt-engineering" className="mb-16">
            <h2 className="text-4xl font-black mb-6">✍️ Prompt Engineering Basics</h2>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">What is a Prompt?</h3>
              <p className="text-muted-foreground mb-4">
                A prompt is an instruction or question you give to an AI model. The quality of your prompt directly affects the quality of the response.
              </p>
              <p className="text-muted-foreground mb-4">
                Think of it like asking a human expert: A vague question gets a vague answer. A detailed, well-structured question gets a detailed, useful answer.
              </p>
            </div>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Principles of Good Prompts</h3>
              <div className="space-y-4">
                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-green-400/30">
                  <strong className="text-green-400">Be Clear & Specific</strong>
                  <p className="text-muted-foreground text-sm mt-2">
                    ✓ Bad: "Tell me about AI"<br/>
                    ✓ Good: "Explain machine learning algorithms to a 10-year-old using simple examples"
                  </p>
                </div>

                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-green-400/30">
                  <strong className="text-green-400">Provide Context</strong>
                  <p className="text-muted-foreground text-sm mt-2">
                    ✓ Bad: "Write code for this"<br/>
                    ✓ Good: "Write a Python function that checks if an email address is valid"
                  </p>
                </div>

                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-green-400/30">
                  <strong className="text-green-400">Define the Output Format</strong>
                  <p className="text-muted-foreground text-sm mt-2">
                    ✓ Bad: "Summarize this article"<br/>
                    ✓ Good: "Summarize this article in 3 bullet points, each under 20 words"
                  </p>
                </div>

                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-green-400/30">
                  <strong className="text-green-400">Use Role-Based Prompts</strong>
                  <p className="text-muted-foreground text-sm mt-2">
                    ✓ Bad: "Explain debugging"<br/>
                    ✓ Good: "As an experienced software engineer, explain the top 5 debugging techniques"
                  </p>
                </div>

                <div className="bg-[#1e1e1e] p-4 rounded-lg border border-green-400/30">
                  <strong className="text-green-400">Iterate & Refine</strong>
                  <p className="text-muted-foreground text-sm mt-2">
                    The first response might not be perfect. Ask follow-up questions to improve the answer.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: HANDS-ON PROMPT EXAMPLES */}
          <section id="hands-on" className="mb-16">
            <h2 className="text-4xl font-black mb-6">Hands-On Prompt Examples</h2>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Example 1: Explaining Complex Topics</h3>
              <p className="text-muted-foreground mb-2 font-semibold">Prompt:</p>
              <CodeBlock
                code={`Explain JavaScript closures in simple terms.
Include:
- A simple definition
- A real-world analogy
- A code example
Keep it under 200 words.`}
                id="example-js-closure"
              />
              <p className="text-muted-foreground mt-4 mb-2 font-semibold">What the AI might respond:</p>
              <div className="text-muted-foreground mt-4 p-4 bg-[#1E293B] rounded-lg border border-[#E0DCCF]">
                <p className="mb-2">
                  <strong>Simple Definition:</strong> A closure is a function that remembers values from the scope where it was created, even after that scope is gone.
                </p>
                <p className="mb-2">
                  <strong>Real-World Analogy:</strong> Like a photo that captures a moment in time. Even when that moment passes, the photo remembers what was there.
                </p>
                <p className="mb-2">
                  <strong>Code Example:</strong><br/>
                  function outer() {'{'}let count = 0; return function() {'{'} count++; return count; {'}'}; {'}'}
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Example 2: Content Creation</h3>
              <p className="text-muted-foreground mb-2 font-semibold">Prompt:</p>
              <CodeBlock
                code={`Write a LinkedIn post about learning AI as a beginner.
- Inspirational tone
- Include 1 tip for starting
- Add relevant hashtags
- Keep under 150 words`}
                id="example-linkedin"
              />
              <p className="text-muted-foreground mt-4 mb-2 font-semibold">Why this works:</p>
              <ul className="text-muted-foreground space-y-2 ml-4">
                <li>✓ Specifies the platform (LinkedIn, not generic post)</li>
                <li>✓ Defines tone (inspirational)</li>
                <li>✓ Lists required elements (tip, hashtags, length)</li>
                <li>✓ Gives clear constraints (150 words)</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Example 3: Problem Solving</h3>
              <p className="text-muted-foreground mb-2 font-semibold">Prompt:</p>
              <CodeBlock
                code={`I'm a beginner in data science.
Goal: Build a portfolio project in 2 weeks
Skills: Python basics, Google Sheets
Budget: $0
Time: 5 hours/week

What project should I build and how?`}
                id="example-problem"
              />
              <p className="text-muted-foreground mt-4 mb-2 font-semibold">Why this works:</p>
              <ul className="text-muted-foreground space-y-2 ml-4">
                <li>✓ Gives background (beginning level)</li>
                <li>✓ Lists constraints (2 weeks, $0, 5hrs/week)</li>
                <li>✓ Shows existing skills</li>
                <li>✓ Clear objective (portfolio project)</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Example 4: Interview Preparation</h3>
              <p className="text-muted-foreground mb-2 font-semibold">Prompt:</p>
              <CodeBlock
                code={`I'm interviewing for a Junior AI/ML Developer role.
Background: 2 years Python, 3 months AI learning
Company: Startup focused on chatbots

Generate 5 technical questions they might ask
and brief answers for each (50-75 words).`}
                id="example-interview"
              />
              <p className="text-muted-foreground mt-4 mb-2 font-semibold">This helps because:</p>
              <ul className="text-muted-foreground space-y-2 ml-4">
                <li>✓ Provides your actual experience level</li>
                <li>✓ Specifies the company type matters</li>
                <li>✓ Requests specific format (5 Qs with 50-75 word answers)</li>
              </ul>
            </div>
          </section>

          {/* SECTION 7: RISKS & LIMITATIONS */}
          <section id="risks" className="mb-16">
            <h2 className="text-4xl font-black mb-6">⚠️ Risks & Limitations</h2>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Important Limitations to Know</h3>
              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="font-bold text-red-400 mb-2">Hallucinations (Making Up Facts)</h4>
                  <p className="text-muted-foreground text-sm">
                    AI models sometimes generate plausible-sounding but false information. "Hallucination" is when the AI confidently states something incorrect as fact.
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">Example: The model might invent a fake research paper and cite it as real.</p>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="font-bold text-red-400 mb-2">Bias in Training Data</h4>
                  <p className="text-muted-foreground text-sm">
                    If the training data contains biases, the AI will replicate them. This can result in unfair or discriminatory outputs.
                  </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="font-bold text-red-400 mb-2">Knowledge Cutoff</h4>
                  <p className="text-muted-foreground text-sm">
                    Models are trained on data up to a certain date. They don't know about recent events, new products, or latest discoveries.
                  </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="font-bold text-red-400 mb-2">Privacy & Data Security</h4>
                  <p className="text-muted-foreground text-sm">
                    ChatGPT and other services may store your prompts. Don't share sensitive, personal, or confidential information.
                  </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="font-bold text-red-400 mb-2">Context Limitations</h4>
                  <p className="text-muted-foreground text-sm">
                    Models have limited "memory". In long conversations, they might forget earlier context and become inconsistent.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Best Practices for Safe AI Use</h3>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Always verify important information with reliable sources</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Use AI as a tool, not as a replacement for human judgment</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Be skeptical of outputs, especially for important decisions</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Don't share passwords, API keys, or sensitive data</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Understand AI bias and its potential impact</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Read privacy policies of AI services you use</span>
                </li>
              </ul>
            </div>
          </section>

          {/* SECTION 8: CAREER PATHS */}
          <section id="career" className="mb-16">
            <h2 className="text-4xl font-black mb-6">Career Paths in AI</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 border border-blue-400/30">
                <h4 className="font-bold mb-3 text-lg">AI Research Scientist</h4>
                <p className="text-sm mb-3">Develop new AI models and algorithms</p>
                <ul className="text-xs space-y-1">
                  <li>• PhD preferred in CS/ML</li>
                  <li>• Skills: Deep learning, research papers</li>
                  <li>• Salary: $150K-250K+</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 border border-purple-400/30">
                <h4 className="font-bold mb-3 text-lg">ML Engineer</h4>
                <p className="text-sm mb-3">Build and productionize AI models</p>
                <ul className="text-xs space-y-1">
                  <li>• Strong programming skills needed</li>
                  <li>• Skills: Python, ML frameworks, deployment</li>
                  <li>• Salary: $120K-200K+</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#FF9500] to-[#E88600] rounded-xl p-6 border border-[#FFB347]/40">
                <h4 className="font-bold mb-3 text-lg">✍️ Prompt Engineer</h4>
                <p className="text-sm mb-3">Optimize prompts for better AI outputs</p>
                <ul className="text-xs space-y-1">
                  <li>• Growing field, newer role</li>
                  <li>• Skills: Communication, AI understanding</li>
                  <li>• Salary: $90K-150K+</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 border border-green-400/30">
                <h4 className="font-bold mb-3 text-lg">Data Scientist</h4>
                <p className="text-sm mb-3">Analyze data and build prediction models</p>
                <ul className="text-xs space-y-1">
                  <li>• Statistics & coding skills</li>
                  <li>• Skills: SQL, Python, ML basics</li>
                  <li>• Salary: $110K-180K+</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl p-6 border border-orange-400/30">
                <h4 className="font-bold mb-3 text-lg">AI Product Manager</h4>
                <p className="text-sm mb-3">Guide AI product strategy and features</p>
                <ul className="text-xs space-y-1">
                  <li>• Business + technical knowledge</li>
                  <li>• Skills: Strategy, communication</li>
                  <li>• Salary: $130K-210K+</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-xl p-6 border border-pink-400/30">
                <h4 className="font-bold mb-3 text-lg">AI Consultant</h4>
                <p className="text-sm mb-3">Help businesses implement AI solutions</p>
                <ul className="text-xs space-y-1">
                  <li>• Strategy & implementation focus</li>
                  <li>• Skills: Business acumen, AI knowledge</li>
                  <li>• Salary: $140K-220K+</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Getting Started: Learning Path</h3>
              <ol className="text-muted-foreground space-y-3 ml-4">
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">1.</span>
                  <span><strong>Foundation (Weeks 1-2):</strong> Understand AI basics, try ChatGPT, explore different models</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">2.</span>
                  <span><strong>Python Basics (Weeks 3-6):</strong> Learn programming fundamentals if you don't know yet</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">3.</span>
                  <span><strong>ML Foundations (Weeks 7-12):</strong> Take online course in machine learning</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">4.</span>
                  <span><strong>Build Projects (Ongoing):</strong> Create and share portfolio projects on GitHub</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">5.</span>
                  <span><strong>Network & Apply (Ongoing):</strong> Connect with AI community, apply for jobs</span>
                </li>
              </ol>
            </div>
          </section>

          {/* PRACTICE QUESTIONS */}
          <section id="practice" className="mb-16">
            <h2 className="text-4xl font-black mb-6">Practice Questions</h2>

            <div className="space-y-6 mb-8">
              <details className="group cursor-pointer bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
                <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4 cursor-pointer">
                  1️⃣ What's the main difference between Generative AI and traditional AI?
                </summary>
                <p className="text-muted-foreground text-sm">
                  <strong>Answer:</strong> Traditional AI focuses on recognition, classification, or prediction (identifying if a photo contains a dog). Generative AI creates new content (drawing a picture of a dog). Generative AI produces new outputs while traditional AI analyzes existing data.
                </p>
              </details>

              <details className="group cursor-pointer bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
                <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4 cursor-pointer">
                  2️⃣ Why do we call them "Large Language Models"?
                </summary>
                <p className="text-muted-foreground text-sm">
                  <strong>Answer:</strong> "Large" refers to billions of parameters (adjustable weights), "Language" means they specialize in human language, and "Model" is the trained neural network. Together, LLMs are massive neural networks trained on huge text datasets to understand and generate language.
                </p>
              </details>

              <details className="group cursor-pointer bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
                <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4 cursor-pointer">
                  3️⃣ What is hallucination in AI?
                </summary>
                <p className="text-muted-foreground text-sm">
                  <strong>Answer:</strong> Hallucination is when an AI generates false information that sounds plausible. For example, citing a fake research paper or providing incorrect facts as if they were true. Always verify important information from AI models with trusted sources.
                </p>
              </details>

              <details className="group cursor-pointer bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
                <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4 cursor-pointer">
                  4️⃣ How does a prompt relate to AI output quality?
                </summary>
                <p className="text-muted-foreground text-sm">
                  <strong>Answer:</strong> Output quality directly depends on prompt quality. A vague prompt produces vague answers. A well-structured prompt with context, constraints, and clear instructions produces better, more useful responses. This skill is called "prompt engineering."
                </p>
              </details>

              <details className="group cursor-pointer bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
                <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4 cursor-pointer">
                  5️⃣ What's a knowledge cutoff and why does it matter?
                </summary>
                <p className="text-muted-foreground text-sm">
                  <strong>Answer:</strong> Knowledge cutoff is the date of the last training data. ChatGPT-4, for example, was trained until April 2024. It won't know about events or products released after that date. This is why you should verify recent information with current sources.
                </p>
              </details>
            </div>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Scenario-Based Questions</h3>

              <div className="space-y-6">
                <div className="bg-[#1e1e1e] p-6 rounded-lg border border-cyan-400/30">
                  <h4 className="font-bold text-cyan-400 mb-3">Scenario 1: At Your New Job</h4>
                  <p className="text-muted-foreground text-sm mb-3">
                    <strong>Situation:</strong> Your manager asks you to use AI to generate customer service responses. She wants them to be accurate, on-brand, and professional.
                  </p>
                  <p className="text-muted-foreground text-sm mb-3">
                    <strong>Your Question:</strong> What precautions would you take to ensure the AI-generated responses are safe to send to customers?
                  </p>
                  <p className="text-muted-foreground text-sm p-3 bg-[#FFFDF8] rounded border border-[#E0DCCF]">
                    <strong>Suggested Answer:</strong> Verify accuracy (AI hallucinations), check for brand compliance, test with sensitive topics, have humans review before sending, Set clear guardrails in prompts, monitor for bias, keep backups of original guidelines, and implement a review process.
                  </p>
                </div>

                <div className="bg-[#1e1e1e] p-6 rounded-lg border border-green-400/30">
                  <h4 className="font-bold text-green-400 mb-3">Scenario 2: Comparing Models</h4>
                  <p className="text-muted-foreground text-sm mb-3">
                    <strong>Situation:</strong> Your team needs to choose between ChatGPT, Claude, and Gemini for your app's AI features. Budget is limited.
                  </p>
                  <p className="text-muted-foreground text-sm mb-3">
                    <strong>Your Question:</strong> How would you evaluate which model is best for your use case?
                  </p>
                  <p className="text-muted-foreground text-sm p-3 bg-[#FFFDF8] rounded border border-[#E0DCCF]">
                    <strong>Suggested Answer:</strong> Consider cost per API call, model accuracy for your task, privacy/data retention policies, speed requirements, customization options, support availability, and integration difficulty. Test each with your specific use case before deciding.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SUMMARY & NEXT STEPS */}
          <section id="summary" className="mb-16">
            <h2 className="text-4xl font-black mb-6">Summary & Key Takeaways</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
                <h4 className="font-bold text-[#FF9500] mb-3">What You Learned</h4>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li>✓ Generative AI creates new content</li>
                  <li>✓ LLMs predict text word-by-word</li>
                  <li>✓ Transformers are the key architecture</li>
                  <li>✓ ChatGPT, Gemini, Claude are popular models</li>
                  <li>✓ Prompt engineering improves output</li>
                  <li>✓ AI has limitations and risks</li>
                </ul>
              </div>

              <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
                <h4 className="font-bold text-[#FF9500] mb-3">Career Opportunities</h4>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li>✓ ML Engineers build AI systems</li>
                  <li>✓ Prompt Engineers optimize outputs</li>
                  <li>✓ Data Scientists work with data</li>
                  <li>✓ AI Consultants help businesses</li>
                  <li>✓ Salaries: $90K-250K+ depending on role</li>
                  <li>✓ Field growing rapidly</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Your Next Steps</h3>
              <ol className="space-y-4 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">1.</span>
                  <span><strong>Experiment Daily:</strong> Try ChatGPT, Gemini, and Claude with different prompts. Notice what works.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">2.</span>
                  <span><strong>Learn Python:</strong> If you don't already know it, start learning. Most AI roles require coding.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">3.</span>
                  <span><strong>Take Free Courses:</strong> Explore Coursera, YouTube, or Andrew Ng's ML course.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">4.</span>
                  <span><strong>Build Projects:</strong> Create something using AI APIs. Add to your portfolio on GitHub.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">5.</span>
                  <span><strong>Stay Current:</strong> Follow AI news, read research papers, join AI communities on Reddit/LinkedIn.</span>
                </li>
              </ol>
            </div>
          </section>

          {/* FINAL CTA */}
          <section id="cta" className="mb-16">
            <div className="bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] rounded-2xl p-12 text-center border border-[#E0DCCF]">
              <h2 className="text-3xl font-black mb-4">Ready to Test Your AI Knowledge?</h2>
              <p className="text-lg mb-8 text-white/90">Take our AI interview assessment to evaluate your understanding and get personalized feedback.</p>
              <button 
                onClick={() => window.location.href = '/start-assessment'}
                className="bg-white text-[#4F46E5] px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-all text-lg"
              >
                Take AI Interview Assessment →
              </button>
            </div>
          </section>
        </main>
      </div>

      <footer className="py-10 text-center text-muted-foreground text-sm border-t border-[#F0ECE0] mt-16">
        © 2026 MentorMuni. Generative AI for Beginners - Free Tutorial with Practical Examples.
      </footer>
    </div>
  );
};

export default GenerativeAITutorial;
