import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchKnowledgeBase } from '../data/aiChatKnowledgeBase';
import { fetchWikipediaSummaryForQuery } from '../utils/wikipediaSummary';

const FALLBACK_REPLY =
  "I don't have a strong match — try rephrasing, or ask about **prompting**, **Gen AI**, **AI vs ML**, **LLMs**, or **RAG**. " +
  'You can also scroll this page for LLM cards and tools.';

/**
 * Regex + interview rules (no network). Returns null if no rule matched.
 */
function matchRegexRules(userText) {
  const q = userText.toLowerCase().trim();
  if (!q) return null;

  // ── Playful / “silly” ─────────────────────────────────────────
  if (/^(hi|hello|hey|hii|yo|sup|namaste)\b/.test(q)) {
    return "Hey! I'm your AI-tools guide on this page. Ask me about LLMs, Copilot vs Cursor, or whether free ChatGPT is enough for placements.";
  }
  if (/bored|joke|funny|silly/.test(q)) {
    return "Why did the developer break up with GitHub Copilot? Too many *commit*ment issues. …Now ask me something useful about AI tools 🙂";
  }
  if (/love|marry|date|crush/.test(q)) {
    return "I only have a professional relationship with transformers (the neural kind). But I *love* explaining why Cursor is hot in hiring conversations right now.";
  }
  if (/who (are|r) you|what are you/.test(q)) {
    return "I'm a tiny on-page assistant — not ChatGPT. I answer using MentorMuni's AI Tools Knowledge Base: LLMs, coding tools, and interview prep.";
  }
  if (/thank/.test(q)) {
    return "You're welcome! Scroll the page for deep dives, or keep asking here.";
  }

  // ── Core concepts (common interview / campus questions) ──────
  if (
    /\bai\b vs \bml\b|\bml\b vs \bai\b/.test(q) ||
    /difference between.*(\bai\b|\bartificial intelligence\b).*(\bml\b|\bmachine learning\b)/.test(q) ||
    /difference between.*(\bml\b|\bmachine learning\b).*(\bai\b|\bartificial intelligence\b)/.test(q)
  ) {
    return "AI (Artificial Intelligence) is the big umbrella: getting machines to do tasks that need human-like intelligence. ML (Machine Learning) is one approach inside AI: systems learn from data instead of only hand-written rules. So all ML is AI, but not all AI is ML (e.g. classical search, expert systems). Deep learning is a subset of ML using neural networks.";
  }
  if (/^what (is|are) (machine learning|ml)\??$/i.test(q) || /\bwhat (is|are) machine learning\b/.test(q)) {
    return "Machine Learning (ML) means the computer finds patterns in data and improves from examples — think spam filters, recommendations, image classifiers. It's the main way modern AI is built, but it's still only one part of the wider AI field.";
  }
  if (/what (is|are) artificial intelligence\b/.test(q) || /^what (is|are) ai\??$/i.test(q)) {
    return "Artificial Intelligence (AI) is any technique where computers perform tasks that usually need human intelligence — reasoning, language, vision, planning. It includes ML, rules-based systems, robotics, and more.";
  }
  if (/generative ai|gen\s*ai|genai|\bgen ai\b|what (is|are) generative/.test(q)) {
    return "Generative AI (Gen AI) creates new content: text, code, images, audio — not just labeling or ranking. ChatGPT, Copilot, and Midjourney are Gen AI. Under the hood it's usually large models (often transformers) trained to generate the next token or pixel from a prompt.";
  }
  if (/agentic ai|agentic artificial|what (is|are) agentic|\bai agents?\b|autonomous agents?/.test(q)) {
    return "Agentic AI = systems that behave like agents: they break a goal into steps, call tools (search, APIs, code, browsers), and loop or retry — not just one reply. Think 'assistant that plans and acts.' It's LLMs + tooling + orchestration; a big recent interview topic.";
  }

  // ── Basics ───────────────────────────────────────────────────
  if (/what (is|are) (an? )?llm|large language model/.test(q)) {
    return "An LLM (Large Language Model) is AI trained on huge text/code datasets to predict the next token. It doesn't 'look up' the web — it generates from patterns. Examples: GPT-4o, Claude, Gemini.";
  }
  if (/what (is|are) (chatgpt|gpt)/.test(q)) {
    return "ChatGPT is a *product* by OpenAI that *uses* models like GPT-4o. You chat with it; behind the scenes it's an LLM plus safety and tooling.";
  }
  if (/copilot.*cursor|cursor.*copilot|copilot vs cursor|cursor vs copilot/.test(q)) {
    return "Copilot: AI completions inside your IDE (GitHub/Microsoft). Cursor: AI-native editor (VS Code–based) with repo-wide chat and refactors. Both use LLMs — Cursor leans into agent-style workflows; Copilot is lighter inline help.";
  }
  if (/copilot|github copilot/.test(q) && !/cursor/.test(q)) {
    return "GitHub Copilot is an AI pair programmer inside your IDE — suggests whole lines/functions from context. Paid for individuals; many companies pay for it. Great to mention in interviews.";
  }
  if (/cursor\b/.test(q)) {
    return "Cursor is an AI-first code editor (VS Code–based). You can chat with your whole repo, not just one file. Very popular for serious dev work.";
  }
  if (/codeium|tabnine/.test(q)) {
    return "Codeium and Tabnine are Copilot-style assistants. Codeium has a solid free tier; Tabnine stresses privacy/local mode. Good free alternatives for students.";
  }
  if (/free (enough|tier)|is free/.test(q)) {
    return "For placement prep, free ChatGPT / Claude / Gemini + MentorMuni's free tools (readiness, mocks, ATS) are often enough. Paid tiers remove limits and add speed — nice once you're earning.";
  }

  // ── Intermediate ─────────────────────────────────────────────
  if (/difference between.*(llm|model).*(tool|chatgpt)|llm vs (ai )?tool/.test(q)) {
    return "The LLM is the *engine* (e.g. GPT-4o). The *tool* is the app around it — ChatGPT, Copilot, Cursor add UI, rules, and integrations. Engine vs car.";
  }
  if (/which (llm|model)|best (llm|model)|should i use/.test(q)) {
    return "No single winner: GPT-4o is all-round; Claude is strong for long docs; Gemini has huge context; LLaMA/Mistral if you need open-source. Pick by task: coding vs writing vs privacy.";
  }
  if (/interview|placement|campus/.test(q)) {
    return "Interviewers increasingly ask how you use AI. Minimum story: one coding assistant (Copilot/Cursor) + one chat LLM (ChatGPT/Claude) + MentorMuni readiness/mock for practice.";
  }
  if (/mentormuni|readiness|mock|resume|ats/.test(q)) {
    return "MentorMuni offers Interview Readiness Score, AI Mock Interviews, and Resume ATS — all built for placements. Links are on this page and in the nav.";
  }

  // ── Advanced ─────────────────────────────────────────────────
  if (/transformer|attention|self-attention/.test(q)) {
    return "Transformers (2017) use self-attention: each token attends to all others in context. That's why modern LLMs scale so well. It's the architecture behind GPT, Claude, etc.";
  }
  if (/\brag\b|retrieval augmented|grounding/.test(q)) {
    return "RAG = Retrieval-Augmented Generation: fetch relevant docs/chunks, then the LLM answers using them. Better facts + citations than raw parametric memory — common in enterprise search.";
  }
  if (/context window|tokens?|how long/.test(q)) {
    return "Context window = how many tokens the model can 'see' at once (roughly 4 chars ≈ 1 token). Bigger = more code/docs in one shot — Gemini 1.5 goes to 1M+ tokens on some tiers.";
  }
  if (/rlhf|human feedback|alignment/.test(q)) {
    return "RLHF = Reinforcement Learning from Human Feedback: humans rank model outputs, then the policy is tuned to prefer helpful/safe answers. Post-training step after base pretraining.";
  }
  if (/parameters|weights|billion/.test(q)) {
    return "Parameters are learned numbers in the network; '70B model' ≈ 70 billion weights. More params ≠ always better for you — latency, cost, and task fit matter.";
  }
  if (/fine.?tun|lora|adapter/.test(q)) {
    return "Fine-tuning adapts a base model to your domain/data. LoRA/adapters train small extra layers — cheaper than full fine-tunes. Common for enterprise or niche tasks.";
  }
  if (/hallucinate|wrong|fact/.test(q)) {
    return "LLMs can confidently generate wrong facts — they optimize for plausible text, not truth. Use RAG, citations (e.g. Perplexity), or verify critical facts yourself.";
  }
  if (/open.?source|llama|meta|mistral/.test(q)) {
    return "Open weights (e.g. LLaMA 3, Mistral) let you self-host and customize — privacy and control. Trade-off: you run infra and may need GPUs for big models.";
  }

  // Keyword fallbacks (broader net)
  if (q.includes('gpt') || q.includes('openai')) {
    return "OpenAI's GPT models power ChatGPT and many APIs. GPT-4o is a strong default for reasoning + code — subject to usage limits on free tier.";
  }
  if (q.includes('claude') || q.includes('anthropic')) {
    return "Anthropic's Claude excels at long context and careful writing. Great for code review and documents — compare free claude.ai vs paid Pro for limits.";
  }
  if (q.includes('gemini') || q.includes('google')) {
    return "Google's Gemini integrates with Google products and offers very large context on Pro. Good if you already live in the Google ecosystem.";
  }

  return null;
}

/**
 * 1) Curated knowledge base (prompting, usage, Gen AI topics)
 * 2) Local regex rules
 * 3) Wikipedia summary (CC BY-SA) when the question matches a topic we map
 */
async function resolveReplyAsync(userText) {
  const trimmed = userText.trim();
  if (!trimmed) {
    return 'Ask anything — Gen AI, prompting, AI vs ML, LLMs, RAG, or tools. I keep answers short.';
  }

  const kb = searchKnowledgeBase(trimmed);
  if (kb) return kb;

  const reg = matchRegexRules(trimmed);
  if (reg) return reg;

  const wiki = await fetchWikipediaSummaryForQuery(trimmed);
  if (wiki) {
    return `${wiki}\n\n_(Short summary from Wikipedia — verify important facts.)_`;
  }

  return FALLBACK_REPLY;
}

export default function AIToolsChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => [
    {
      role: 'bot',
      text: "Hi — I'm your **AI Tools** helper. Ask **Gen AI**, **Agentic AI**, **AI vs ML**, or how **RAG** / **Transformers** work. Short answers only.",
    },
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const pushExchange = async (userText) => {
    const trimmed = userText.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { role: 'user', text: trimmed }, { role: 'bot', text: '__LOADING__' }]);
    try {
      const reply = await resolveReplyAsync(trimmed);
      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last?.role === 'bot' && last.text === '__LOADING__') {
          last.text = reply;
        }
        return next;
      });
    } catch {
      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last?.role === 'bot' && last.text === '__LOADING__') {
          last.text = FALLBACK_REPLY;
        }
        return next;
      });
    }
  };

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput('');
    pushExchange(trimmed);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3 pointer-events-none">
      {open && (
        <div
          id="ai-tools-chatbot-panel"
          className="pointer-events-auto w-[min(100vw-2rem,400px)] rounded-2xl border border-border bg-white/95 shadow-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl flex flex-col overflow-hidden max-h-[min(520px,70vh)]"
          role="dialog"
          aria-label="AI Tools chat assistant"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border bg-gradient-to-r from-accent-soft/95 to-secondary px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
                <Bot size={18} className="text-cta" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">AI Tools Assistant</p>
                <p className="truncate text-[10px] text-muted-foreground">KB + rules + Wikipedia summaries</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-br-md bg-cta text-white'
                      : 'rounded-bl-md border border-border bg-secondary text-foreground'
                  }`}
                >
                  {msg.role === 'bot' ? (
                    msg.text === '__LOADING__' ? (
                      <span className="text-muted-foreground italic">Looking up…</span>
                    ) : (
                      <span className="whitespace-pre-wrap [&_strong]:font-semibold [&_strong]:text-warning-text">
                        {msg.text.split('**').map((part, j) =>
                          j % 2 === 1 ? (
                            <strong key={j}>{part}</strong>
                          ) : (
                            <span key={j}>{part}</span>
                          )
                        )}
                      </span>
                    )
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-border bg-secondary/90 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Prompting, Gen AI, LLMs, tools…"
                className="min-w-0 flex-1 rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-cta/50"
              />
              <button
                type="button"
                onClick={send}
                className="shrink-0 rounded-xl bg-cta px-3 py-2.5 text-white transition-colors hover:bg-cta-hover"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                'What is Generative AI?',
                'What is Agentic AI?',
                'Difference between AI and ML',
                'What is an LLM?',
              ].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => pushExchange(s)}
                  className="rounded-full border border-border bg-card px-2 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:border-cta/35 hover:text-warning-text"
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground text-center leading-snug">
              Local knowledge base + rules; may add a Wikipedia excerpt (not ChatGPT).{' '}
              <Link to="/start-assessment" className="font-semibold text-cta hover:underline">
                Readiness test
              </Link>
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="pointer-events-auto group flex items-center gap-2 rounded-full border border-[#FF9500]/45 bg-gradient-to-r from-[#FF9500] to-[#FFB347] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:from-[#FF9500] hover:to-[#FFB347] transition-all"
        aria-expanded={open}
        aria-controls="ai-tools-chatbot-panel"
      >
        {open ? (
          <>
            <X size={20} />
            Close
          </>
        ) : (
          <>
            <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
            Ask AI tools
            <Sparkles size={16} className="text-amber-200 opacity-90" />
          </>
        )}
      </button>
    </div>
  );
}
