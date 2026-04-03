/**
 * Curated snippets for the AI Tools chatbot (prompting, Gen AI, usage).
 * Matched by keyword overlap — extend this file or set VITE_AI_CHAT_KNOWLEDGE_URL
 * to a JSON URL that returns { chunks: [{ keywords: [], text: "" }] }.
 */

/** Exported for MuniBot merged search — keep chunks self-contained { keywords, text } */
export const KNOWLEDGE_CHUNKS = [
  {
    id: 'prompting-basics',
    keywords: [
      'prompt',
      'prompting',
      'how to prompt',
      'write a prompt',
      'good prompt',
      'prompt tips',
      'better prompt',
    ],
    text:
      '**Prompting basics:** Be specific (goal, format, audience). Give **context** (what stack, what error). Use **roles** ("You are a senior engineer…"). For code: paste minimal repro. Iterate: ask for a draft, then "make it shorter" / "add edge cases." Free tools: ChatGPT, Claude — same ideas apply.',
  },
  {
    id: 'few-shot',
    keywords: ['few-shot', 'few shot', 'example in prompt', 'show example'],
    text:
      '**Few-shot prompting:** Put 2–5 **input → output examples** in the prompt so the model copies the pattern (format, tone, JSON shape). Works better than long instructions alone. Great for classification, extraction, and structured answers.',
  },
  {
    id: 'chain-of-thought',
    keywords: ['chain of thought', 'cot', 'step by step', 'reasoning', 'think step'],
    text:
      '**Chain-of-thought (CoT):** Ask the model to **reason step by step** before the final answer ("Let\'s think step by step"). Improves math, logic, and debugging — but can hallucinate; still verify critical facts.',
  },
  {
    id: 'system-vs-user',
    keywords: ['system message', 'system prompt', 'user message', 'assistant message'],
    text:
      'In chat APIs: **system** = rules/persona (stable). **user** = your ask. **assistant** = prior replies. Put non-negotiable rules in **system**; put the actual task in **user**. Not all UIs expose "system" — ChatGPT "Custom instructions" is similar.',
  },
  {
    id: 'zero-shot',
    keywords: ['zero-shot', 'zero shot', 'no example'],
    text:
      '**Zero-shot:** Ask without examples — the model relies on pretraining only. Fine for simple tasks. For tricky formats, switch to **few-shot** or describe the output schema explicitly (e.g. "Return JSON with keys…").',
  },
  {
    id: 'ai-usage-students',
    keywords: [
      'how to use ai',
      'use ai for',
      'student',
      'study',
      'placement',
      'interview prep',
      'learning',
    ],
    text:
      '**Using AI as a student:** Explain concepts you didn\'t understand in class; **debug** with pasted errors; mock **HR/tech** questions; outline a **study plan** — but you must still **practice** (write code without AI sometimes). For placements, also use MentorMuni readiness + mocks so you\'re not only chatting with a generic bot.',
  },
  {
    id: 'ai-usage-work',
    keywords: ['workflow', 'productivity', 'at work', 'daily', 'professional'],
    text:
      '**Professional use:** Draft emails/docs; summarize meetings; **code review** suggestions; **test cases**; research with **citations** (Perplexity). Keep **secrets** out of public tools; follow company policy on customer data.',
  },
  {
    id: 'hallucination-prompt',
    keywords: ['reduce hallucination', 'more accurate', 'cite source', 'grounding'],
    text:
      '**Safer answers:** Ask for **"only use the text I paste"**; request **bullet sources** or "say I don\'t know"; use **RAG** tools or Perplexity for facts; for code, **run and test** outputs. Temperature lower = often more conservative (in APIs).',
  },
  {
    id: 'temperature',
    keywords: ['temperature', 'top p', 'top-p', 'sampling'],
    text:
      '**Temperature / Top-p** (API settings): Higher = more creative, more random. Lower = more focused and repetitive — good for factual/code tasks. Chat UIs hide these; devs set them in API calls.',
  },
  {
    id: 'tokens-cost',
    keywords: ['token', 'cost', 'pricing', 'cheap', 'api cost'],
    text:
      '**Tokens** ≈ pieces of text billed by APIs. Long prompts + long replies = more cost. **Tip:** Trim pasted logs; ask for concise answers; use smaller models for simple tasks if your platform allows.',
  },
  {
    id: 'multimodal',
    keywords: ['image', 'pdf', 'upload', 'screenshot', 'multimodal', 'vision'],
    text:
      '**Multimodal models** accept images/PDFs (GPT-4o, Gemini). Use for UI bugs (screenshot), diagrams, handwritten notes. Check each tool\'s limits on file size and privacy.',
  },
  {
    id: 'responsible-use',
    keywords: ['cheat', 'plagiarism', 'ethical', 'responsible', 'academic integrity'],
    text:
      '**Responsible use:** Many schools/jobs ban **undisclosed** AI on assessments. Use AI to **learn**, not to submit generated work as your own unless allowed. When in doubt, ask your instructor or manager.',
  },
];

const FALLBACK_SCORE = 0;

function tokenize(s) {
  return s
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

/**
 * Score chunks by keyword hits + light word overlap with query.
 */
export function searchKnowledgeBase(query) {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  let best = null;
  let bestScore = FALLBACK_SCORE;

  for (const chunk of KNOWLEDGE_CHUNKS) {
    let score = 0;
    for (const kw of chunk.keywords) {
      const k = kw.toLowerCase();
      if (q.includes(k)) score += 3 + Math.min(k.length / 20, 2);
    }
    const qTokens = new Set(tokenize(q));
    for (const w of tokenize(chunk.text)) {
      if (w.length > 4 && qTokens.has(w)) score += 0.4;
    }
    if (score > bestScore) {
      bestScore = score;
      best = chunk.text;
    }
  }

  // Need a clear signal — at least one keyword match or strong score
  if (bestScore >= 3) return best;
  return null;
}
