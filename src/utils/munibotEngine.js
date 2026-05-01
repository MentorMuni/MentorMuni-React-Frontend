/**
 * MuniBot reply engine — merges MentorMuni + AI tools knowledge chunks with keyword scoring.
 */

import { KNOWLEDGE_CHUNKS } from '../data/aiChatKnowledgeBase';
import { MUNIBOT_CHUNKS } from '../data/munibotKnowledge';

const ALL_CHUNKS = [...MUNIBOT_CHUNKS, ...KNOWLEDGE_CHUNKS];

const FALLBACK_SCORE = 0;
const SCORE_THRESHOLD = 2.4;
const STOP_WORDS = new Set([
  'what', 'is', 'are', 'the', 'and', 'for', 'with', 'about', 'this', 'that', 'from', 'have', 'how',
  'can', 'you', 'your', 'our', 'why', 'when', 'where', 'which', 'tell', 'me', 'please', 'help',
]);

function tokenize(s) {
  return s
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

function significantTokens(s) {
  return tokenize(s).filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
}

function scoreChunk(query, chunk) {
  const q = query.toLowerCase().trim();
  const qTokens = new Set(significantTokens(q));
  let score = 0;

  // Strongest signal: direct keyword phrase inclusion.
  for (const kw of chunk.keywords) {
    const k = kw.toLowerCase();
    if (q.includes(k)) score += 4 + Math.min(k.length / 24, 1.5);
  }

  // Secondary signal: overlap with keyword tokens (more precise than body text overlap).
  for (const kw of chunk.keywords) {
    for (const token of significantTokens(kw)) {
      if (qTokens.has(token)) score += 0.9;
    }
  }

  // Small tertiary signal from chunk body text for near-misses.
  for (const w of significantTokens(chunk.text)) {
    if (qTokens.has(w)) score += 0.2;
  }

  return score;
}

const FALLBACK_REPLY =
  "I'm **MuniBot** — I can help with **MentorMuni** (readiness score, AI mocks, resume ATS, mentors, waitlist), **interview prep** (DSA, system design, HR/STAR, resume), **AI topics** (LLMs, RAG, transformers, prompting), and **learning resources** on the web.\n\nTry a quick question below or ask something specific!";

/**
 * @param {string} userMessage
 * @returns {string} markdown-ish text with **bold** segments
 */
export function getMuniBotReply(userMessage) {
  const q = (userMessage || '').trim();
  if (!q) return FALLBACK_REPLY;
  const ql = q.toLowerCase();

  if (/^(hi|hello|hey|hii|yo|sup|namaste)\b/.test(ql)) {
    return 'Hey! Ask me about **readiness score**, **AI mock interviews**, **resume ATS**, **DSA prep**, or **RAG/LLMs**.';
  }

  let best = null;
  let bestScore = FALLBACK_SCORE;

  for (const chunk of ALL_CHUNKS) {
    const s = scoreChunk(q, chunk);
    if (s > bestScore) {
      bestScore = s;
      best = chunk.text;
    }
  }

  if (best && bestScore >= SCORE_THRESHOLD) return best;

  /* Light fuzzy: query token appears in a keyword phrase */
  if (ql.length < 2) return FALLBACK_REPLY;
  const qTokens = significantTokens(ql);

  for (const chunk of ALL_CHUNKS) {
    for (const kw of chunk.keywords) {
      const k = kw.toLowerCase();
      if (k.length <= 3) continue;
      if (qTokens.some((t) => t.length > 3 && k.includes(t))) {
        return chunk.text;
      }
    }
  }

  return FALLBACK_REPLY;
}
