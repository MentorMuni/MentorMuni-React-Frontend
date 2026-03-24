import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AIToolsChatbot from './AIToolsChatbot';
import {
  ChevronDown, ChevronRight, ExternalLink, Search, Zap, Brain,
  Code2, MessageSquare, FileSearch, BarChart2, Shield, Globe,
  BookOpen, Star, CheckCircle,
} from 'lucide-react';

/* ─── LLM DATA ───────────────────────────────────────────────── */
const LLMS = [
  {
    name: 'GPT-4o', maker: 'OpenAI', color: '#10a37f', tier: 'paid',
    free: 'Limited (ChatGPT free)', release: '2024', badge: 'Most Popular',
    best_for: 'All-round tasks, coding, analysis',
    expertise: ['General reasoning', 'Code generation', 'Image understanding', 'Long context (128k)', 'Function calling'],
  },
  {
    name: 'Claude 3.5 Sonnet', maker: 'Anthropic', color: '#c96442', tier: 'paid',
    free: 'Limited (Claude.ai)', release: '2024', badge: 'Best for Writing',
    best_for: 'Document analysis, professional writing',
    expertise: ['200k context window', 'Nuanced writing', 'Code review', 'Safety & alignment', 'Research analysis'],
  },
  {
    name: 'Gemini 1.5 Pro', maker: 'Google DeepMind', color: '#4285f4', tier: 'paid',
    free: 'Yes (gemini.google.com)', release: '2024', badge: 'Largest Context',
    best_for: 'Huge documents, multimodal tasks',
    expertise: ['1M token context', 'Text + image + video', 'Google Search integration', 'Code execution', 'Multilingual'],
  },
  {
    name: 'LLaMA 3.1 405B', maker: 'Meta', color: '#0668e1', tier: 'free',
    free: 'Yes (open weights)', release: '2024', badge: 'Best Open Source',
    best_for: 'Developers needing full control',
    expertise: ['Open source', 'Self-hostable', 'Research & fine-tuning', 'Multilingual', 'On-premise deployment'],
  },
  {
    name: 'Mistral Large', maker: 'Mistral AI', color: '#ff7000', tier: 'paid',
    free: 'Mistral 7B is free', release: '2024', badge: 'Fastest EU Model',
    best_for: 'Speed-sensitive apps, EU compliance',
    expertise: ['Fast inference', 'EU data privacy', 'Function calling', 'Code generation', 'Instruction following'],
  },
  {
    name: 'Grok 2', maker: 'xAI', color: '#1da1f2', tier: 'paid',
    free: 'Limited (X Premium)', release: '2024', badge: 'Real-time Knowledge',
    best_for: 'Up-to-date info, current events',
    expertise: ['Real-time web data', 'Current events', 'STEM reasoning', 'X/Twitter data access', 'Witty conversation'],
  },
  {
    name: 'Command R+', maker: 'Cohere', color: '#39d353', tier: 'paid',
    free: 'API trial credits', release: '2024', badge: 'Best for RAG',
    best_for: 'Enterprise search & RAG pipelines',
    expertise: ['RAG pipelines', 'Enterprise search', 'Tool use', 'Citation grounding', 'Business documents'],
  },
  {
    name: 'Phi-3 Mini', maker: 'Microsoft', color: '#00a4ef', tier: 'free',
    free: 'Yes (open weights)', release: '2024', badge: 'Best Small Model',
    best_for: 'Offline apps, mobile, IoT',
    expertise: ['Edge / mobile', 'Low latency', 'Runs on small hardware', 'Privacy (local)', 'Lightweight code'],
  },
];

/* ─── CODING TOOLS ───────────────────────────────────────────── */
const CODING_TOOLS = [
  { name: 'GitHub Copilot',  type: 'paid',     desc: 'AI pair programmer in VS Code & IntelliJ. Autocompletes entire functions and explains code.', url: 'https://github.com/features/copilot' },
  { name: 'Cursor',          type: 'freemium', desc: 'AI-first code editor built on VS Code. Chat with your entire codebase and generate with GPT-4o.', url: 'https://cursor.sh' },
  { name: 'Codeium',         type: 'free',     desc: 'Free GitHub Copilot alternative. Works in 70+ IDEs with fast, accurate completions.', url: 'https://codeium.com' },
  { name: 'Tabnine',         type: 'freemium', desc: 'Privacy-focused AI code completion. Runs locally on your machine — no code leaves your system.', url: 'https://tabnine.com' },
  { name: 'Replit AI',       type: 'freemium', desc: 'Browser-based IDE with built-in AI. Write, explain and debug code without any local setup.', url: 'https://replit.com' },
  { name: 'ChatGPT',         type: 'freemium', desc: 'GPT-4o is excellent for explaining DSA concepts, debugging, and writing boilerplate code.', url: 'https://chat.openai.com' },
  { name: 'Claude.ai',       type: 'freemium', desc: 'Understands large codebases. Great for code review, architecture questions and documentation.', url: 'https://claude.ai' },
  { name: 'Perplexity AI',   type: 'freemium', desc: 'AI search with cited sources. Use it to quickly understand algorithms and compare approaches.', url: 'https://perplexity.ai' },
];

/* ─── MENTORMUNI TOOLS ───────────────────────────────────────── */
const MM_TOOLS = [
  {
    icon: BarChart2, color: 'text-indigo-400', bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/25', hover: 'hover:border-indigo-500/50',
    badge: 'START HERE', badgeCls: 'bg-indigo-500/15 text-indigo-300',
    title: 'Interview Readiness Score',
    desc: 'Answer questions across DSA, System Design and HR. Get a personalised score out of 100 broken down by category — know exactly what to fix first, not everything at once.',
    highlight: 'Free · 5 minutes · Instant result',
    cta: 'Check my score',
    href: '/start-assessment',
  },
  {
    icon: MessageSquare, color: 'text-violet-400', bg: 'bg-violet-500/10',
    border: 'border-violet-500/25', hover: 'hover:border-violet-500/50',
    badge: 'MOST USEFUL', badgeCls: 'bg-violet-500/15 text-violet-300',
    title: 'AI Mock Interviews',
    desc: 'The AI interviews you in real-time — just like a recruiter would. Get feedback on why each answer would get rejected and exactly what to say instead.',
    highlight: 'Simulates TCS, Wipro, Infosys patterns',
    cta: 'Start mock interview',
    href: '/mock-interviews',
  },
  {
    icon: FileSearch, color: 'text-pink-400', bg: 'bg-pink-500/10',
    border: 'border-pink-500/25', hover: 'hover:border-pink-500/50',
    badge: 'HIDDEN FILTER', badgeCls: 'bg-pink-500/15 text-pink-300',
    title: 'Resume ATS Checker',
    desc: '75% of resumes are rejected before a human sees them — by software. Paste yours in, get your ATS score instantly, and see exactly which lines are filtering you out.',
    highlight: 'Instant ATS score + fix suggestions',
    cta: 'Check my resume',
    href: '/resume-analyzer',
  },
];

/* ─── FAQ DATA ───────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'What is an LLM (Large Language Model)?',
    a: 'A Large Language Model (LLM) is an AI system trained on vast amounts of text — books, websites, code, research papers — to understand and generate human language. It uses a neural network architecture called a Transformer, introduced by Google in 2017. The model learns statistical patterns of language and can predict the next word, answer questions, write code or summarise documents. When you type a prompt, the LLM does not "look things up" — it generates responses from patterns internalised during training across trillions of words.',
  },
  {
    q: 'How many LLMs exist in 2025?',
    a: 'There are over 1,000 LLMs publicly available on Hugging Face alone, with hundreds more proprietary ones. However, only a dozen or so are widely used in production. The major commercial ones are GPT-4o (OpenAI), Claude 3.5 (Anthropic), Gemini 1.5 (Google), and Grok 2 (xAI). Open-source leaders include LLaMA 3 (Meta), Mistral, Phi-3 (Microsoft) and Falcon. The number grows every month as new models and fine-tuned variants are released.',
  },
  {
    q: 'What is the difference between an LLM and an AI tool?',
    a: 'An LLM is the underlying AI model — the "brain." An AI tool is a product built on top of one or more LLMs, with a user interface, specific features and guardrails. For example, ChatGPT is an AI tool built on GPT-4o. GitHub Copilot is an AI tool built on OpenAI Codex. Think of it this way: the LLM is the engine, the AI tool is the car.',
  },
  {
    q: 'Are free AI tools good enough for interview preparation?',
    a: 'Yes. For interview prep, free-tier ChatGPT (GPT-4o), Claude.ai and Gemini are more than capable. You can use them to explain DSA concepts, review your code, simulate HR questions and get feedback. MentorMuni\'s readiness score, AI mock interviews and ATS checker are completely free and purpose-built for campus placement preparation.',
  },
  {
    q: 'What AI tools should an engineering student know in 2025?',
    a: 'Interviewers now ask: "How do you use AI in your workflow?" The minimum you should know: (1) GitHub Copilot or Cursor for coding — understand how they work and their limitations; (2) ChatGPT or Claude for research and concept explanation; (3) Perplexity for quick factual searches with sources. Being able to speak confidently about AI tools is now a baseline expectation at product companies.',
  },
];

const typeBadge = {
  free:     'bg-green-500/15 text-green-400 border border-green-500/25',
  freemium: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
  paid:     'bg-red-500/15 text-red-400 border border-red-500/25',
};

/* ─── SUB-COMPONENTS ─────────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${open ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-white/10 bg-white/5'}`}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-semibold text-white text-sm leading-snug">{q}</span>
        <ChevronDown size={16} className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function AIToolsKnowledgeBase() {
  const [search, setSearch] = useState('');

  const filteredCoding = CODING_TOOLS.filter(t =>
    !search ||
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#050b18] text-white min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/15 rounded-full blur-[130px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-violet-900/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-12">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Free Resource</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4 tracking-tight">
            AI Tools{' '}
            <span style={{ background: 'linear-gradient(90deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Knowledge Base
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed mb-8">
            Everything an engineering student needs to know about LLMs and AI tools — from first principles to the tools interviewers now expect you to know in 2025.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Brain,        color: 'text-indigo-400', label: '8 major LLMs explained' },
              { icon: Zap,          color: 'text-amber-400',  label: 'Coding tools for placement' },
              { icon: CheckCircle,  color: 'text-green-400',  label: 'Free & paid clearly marked' },
            ].map(({ icon: Icon, color, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                <Icon size={14} className={color} />
                <span className="text-sm font-semibold text-slate-300">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What is an LLM ── */}
      <section className="py-14 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-3">Foundation</span>
              <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">What is an LLM?</h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                A <span className="text-white font-semibold">Large Language Model (LLM)</span> is an AI system trained on massive amounts of text — books, websites, code, scientific papers — to understand and generate human language.
              </p>
              <p className="text-slate-400 leading-relaxed mb-4">
                It uses a neural network architecture called a <span className="text-indigo-300 font-semibold">Transformer</span>, introduced by Google in 2017. The model learns the statistical patterns of language and can predict the next word, answer questions, write code or summarise documents.
              </p>
              <p className="text-slate-400 leading-relaxed">
                When you type a prompt, the LLM does not look things up — it generates a response from patterns internalised during training across trillions of words.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Brain,     color: 'text-indigo-400', bg: 'bg-indigo-500/10', title: 'Trained on text',          desc: 'Trillions of words: books, web, code' },
                { icon: Globe,     color: 'text-green-400',  bg: 'bg-green-500/10',  title: 'Transformer architecture', desc: 'Self-attention mechanism, Google 2017' },
                { icon: Code2,     color: 'text-violet-400', bg: 'bg-violet-500/10', title: 'Predicts tokens',           desc: 'Generates one word at a time probabilistically' },
                { icon: Shield,    color: 'text-amber-400',  bg: 'bg-amber-500/10',  title: 'Fine-tuned with RLHF',     desc: 'Human feedback makes it safe & helpful' },
                { icon: Zap,       color: 'text-pink-400',   bg: 'bg-pink-500/10',   title: 'Context window',           desc: 'How many words it "sees" at once (4k–1M tokens)' },
                { icon: BarChart2, color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   title: 'Parameters',               desc: 'Billions of weights that determine intelligence' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className={`flex flex-col gap-2 p-4 rounded-xl border border-white/10 ${item.bg}`}>
                    <Icon size={18} className={item.color} />
                    <span className="text-sm font-bold text-white">{item.title}</span>
                    <span className="text-xs text-slate-500 leading-snug">{item.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── LLM Comparison ── */}
      <section className="py-14 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest block mb-3">2025 Landscape</span>
          <h2 className="text-2xl md:text-3xl font-black mb-2 leading-tight">Major LLMs compared</h2>
          <p className="text-slate-400 text-sm mb-8 max-w-xl">There are 1,000+ LLMs publicly available. Here are the 8 you actually need to know.</p>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {LLMS.map((llm) => (
              <div key={llm.name} className="flex flex-col gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-indigo-500/25 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: llm.color }} />
                      <span className="text-sm font-black text-white">{llm.name}</span>
                    </div>
                    <span className="text-xs text-slate-500">{llm.maker}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${typeBadge[llm.tier]}`}>
                    {llm.tier === 'free' ? 'FREE' : 'PAID'}
                  </span>
                </div>
                {llm.badge && (
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 w-fit">
                    {llm.badge}
                  </span>
                )}
                <div className="flex flex-col gap-1">
                  {llm.expertise.map((e, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ background: llm.color }} />
                      <span className="text-[11px] text-slate-400 leading-snug">{e}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-2 border-t border-white/5 flex flex-col gap-1">
                  <div className="flex justify-between gap-2">
                    <span className="text-[10px] text-slate-600 shrink-0">Best for</span>
                    <span className="text-[10px] text-slate-400 font-medium text-right">{llm.best_for}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[10px] text-slate-600 shrink-0">Free tier</span>
                    <span className="text-[10px] text-slate-400 font-medium text-right">{llm.free}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[10px] text-slate-600 shrink-0">Released</span>
                    <span className="text-[10px] text-slate-400 font-medium">{llm.release}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MentorMuni Interview Tools ── */}
      <section className="py-14 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold text-green-400 uppercase tracking-widest">MentorMuni · Free</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black mb-2 leading-tight">Interview & Career Tools</h2>
          <p className="text-slate-400 text-sm mb-8 max-w-xl">
            Purpose-built AI tools for engineering students preparing for campus placements. All free, no signup required.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {MM_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.title}
                  to={tool.href}
                  className={`group flex flex-col gap-4 p-5 rounded-2xl border ${tool.border} ${tool.hover} bg-white/5 transition-all`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tool.bg}`}>
                      <Icon size={20} className={tool.color} />
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${tool.badgeCls}`}>{tool.badge}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white mb-1.5 group-hover:text-indigo-300 transition-colors">{tool.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{tool.desc}</p>
                  </div>
                  <div className="mt-auto">
                    <div className="text-[11px] text-slate-500 mb-3">{tool.highlight}</div>
                    <div className={`inline-flex items-center gap-1.5 text-xs font-bold ${tool.color} group-hover:gap-2.5 transition-all`}>
                      {tool.cta} <ChevronRight size={13} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Coding Tools ── */}
      <section className="py-14 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-3">For Developers</span>
          <h2 className="text-2xl font-black mb-2 leading-tight">Coding & Development AI Tools</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-xl">
            Tools every engineering student should know — and be able to talk about in a 2025 interview.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { label: 'Free',            cls: typeBadge.free },
              { label: 'Free + Paid',     cls: typeBadge.freemium },
              { label: 'Paid',            cls: typeBadge.paid },
            ].map(b => (
              <span key={b.label} className={`text-xs font-semibold px-3 py-1 rounded-full ${b.cls}`}>{b.label}</span>
            ))}
          </div>
          <div className="relative mb-6 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search tools…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredCoding.map(tool => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2.5 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight">{tool.name}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeBadge[tool.type]}`}>
                      {tool.type === 'freemium' ? 'Free+' : tool.type === 'free' ? 'Free' : 'Paid'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{tool.desc}</p>
                <div className="flex items-center gap-1 text-xs text-slate-600 group-hover:text-indigo-400 transition-colors mt-auto pt-1">
                  <ExternalLink size={11} /> <span>Visit</span>
                </div>
              </a>
            ))}
          </div>
          {filteredCoding.length === 0 && (
            <p className="text-sm text-slate-500 py-6 text-center">No tools match "{search}"</p>
          )}
        </div>
      </section>

      {/* ── Free vs Paid ── */}
      <section className="py-14 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-3">Quick Reference</span>
          <h2 className="text-2xl font-black mb-8 leading-tight">Free vs Paid — what students actually need</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={16} className="text-green-400" />
                <span className="font-black text-green-300">100% Free — start here</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  { name: 'MentorMuni Readiness Score',  use: 'Your personalised gap analysis' },
                  { name: 'MentorMuni AI Mock Interview', use: 'Real-time recruiter simulation' },
                  { name: 'MentorMuni Resume ATS',        use: 'ATS score + fix suggestions' },
                  { name: 'ChatGPT (free tier)',          use: 'GPT-4o, DSA explanations, code help' },
                  { name: 'Claude.ai (free tier)',        use: 'Code review, document understanding' },
                  { name: 'Gemini (Google)',              use: 'Google-integrated AI assistant' },
                  { name: 'Codeium',                     use: 'Free AI code completion in any IDE' },
                  { name: 'LLaMA 3 (self-hosted)',        use: 'Open source, no usage limits' },
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-green-400" />
                    <span>
                      <span className="text-sm font-semibold text-white">{t.name}</span>
                      <span className="text-xs text-slate-500 ml-2">{t.use}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Star size={16} className="text-amber-400" />
                <span className="font-black text-amber-300">Worth paying for (once employed)</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  { name: 'ChatGPT Plus ($20/mo)',      use: 'No limits, GPT-4o, DALL·E, browsing' },
                  { name: 'GitHub Copilot ($10/mo)',    use: 'Essential once you join a company' },
                  { name: 'Claude Pro ($20/mo)',        use: 'Priority access, 5× more usage' },
                  { name: 'Cursor Pro ($20/mo)',        use: 'Best AI-native coding IDE' },
                  { name: 'Perplexity Pro ($20/mo)',    use: 'GPT-4o + Claude in search interface' },
                  { name: 'Grammarly Premium',          use: 'Tone, clarity across all work apps' },
                  { name: 'Notion AI (add-on)',         use: 'AI across your entire workspace' },
                  { name: 'Microsoft Copilot 365',      use: 'Word, Excel, PowerPoint AI assistant' },
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-amber-400" />
                    <span>
                      <span className="text-sm font-semibold text-white">{t.name}</span>
                      <span className="text-xs text-slate-500 ml-2">{t.use}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-14 px-6 border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-3">Common Questions</span>
          <h2 className="text-2xl font-black mb-8">Frequently asked</h2>
          <div className="flex flex-col gap-3">
            {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-3">Ready to put AI to work for your placement?</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Check your interview readiness score in 5 minutes — free. Get a personalised gap analysis and a study plan built specifically around your strengths and timeline.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/start-assessment"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
            >
              Check My Interview Score — Free
              <ChevronRight size={16} />
            </Link>
            <Link
              to="/mock-interviews"
              className="inline-flex items-center justify-center gap-2 border border-indigo-500/40 text-indigo-400 hover:text-indigo-300 hover:border-indigo-400/60 font-semibold px-7 py-3.5 rounded-xl transition-all"
            >
              Try AI Mock Interview
            </Link>
          </div>
        </div>
      </section>

      <AIToolsChatbot />
    </div>
  );
}
