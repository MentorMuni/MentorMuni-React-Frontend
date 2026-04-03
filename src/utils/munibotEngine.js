/**
 * MuniBot reply engine — merges MentorMuni + AI tools knowledge chunks with keyword scoring.
 */

import { KNOWLEDGE_CHUNKS } from '../data/aiChatKnowledgeBase';
import { MUNIBOT_CHUNKS } from '../data/munibotKnowledge';

const ALL_CHUNKS = [...MUNIBOT_CHUNKS, ...KNOWLEDGE_CHUNKS];

const FALLBACK_SCORE = 0;
const SCORE_THRESHOLD = 2.4;

function tokenize(s) {
  return s
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

function scoreChunk(query, chunk) {
  const q = query.toLowerCase().trim();
  let score = 0;
  for (const kw of chunk.keywords) {
    const k = kw.toLowerCase();
    if (q.includes(k)) score += 3 + Math.min(k.length / 20, 2);
  }
  const qTokens = new Set(tokenize(q));
  for (const w of tokenize(chunk.text)) {
    if (w.length > 4 && qTokens.has(w)) score += 0.35;
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

  /* Light fuzzy: first word / topic match */
  const ql = q.toLowerCase();
  if (ql.length < 2) return FALLBACK_REPLY;

  for (const chunk of ALL_CHUNKS) {
    for (const kw of chunk.keywords) {
      if (kw.length > 3 && (ql.includes(kw.toLowerCase()) || kw.toLowerCase().includes(ql.slice(0, 12)))) {
        return chunk.text;
      }
    }
  }

  return FALLBACK_REPLY;
}
