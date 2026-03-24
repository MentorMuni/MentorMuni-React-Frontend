/**
 * Fetches short plain-text summaries from Wikipedia REST API (CC BY-SA).
 * Used when local rules + knowledge base don't match.
 */

const TIMEOUT_MS = 10000;

/** First match wins — put more specific phrases before broad ones. */
const TOPICS = [
  { test: (q) => /prompt engineering|prompting|few-?shot|chain of thought|system prompt/i.test(q), title: 'Prompt_engineering' },
  { test: (q) => /generative artificial|\bgenerative ai\b|gen\s*ai|genai/i.test(q), title: 'Generative_artificial_intelligence' },
  { test: (q) => /\bllm\b|large language model/i.test(q), title: 'Large_language_model' },
  { test: (q) => /\bnlp\b|natural language processing/i.test(q), title: 'Natural_language_processing' },
  { test: (q) => /deep learning|neural network/i.test(q), title: 'Deep_learning' },
  { test: (q) => /reinforcement learning/i.test(q), title: 'Reinforcement_learning' },
  {
    test: (q) => /\btransformer\b/i.test(q) && /attention|neural|architecture|model/i.test(q),
    title: 'Transformer_(machine_learning_model)',
  },
  { test: (q) => /computer vision/i.test(q), title: 'Computer_vision' },
  { test: (q) => /natural language generation/i.test(q), title: 'Natural_language_generation' },
  { test: (q) => /\bmachine learning\b/i.test(q), title: 'Machine_learning' },
  { test: (q) => /\bartificial intelligence\b/i.test(q), title: 'Artificial_intelligence' },
];

export async function fetchWikipediaSummaryForQuery(query) {
  const q = query.trim();
  if (q.length < 3) return null;

  let title = null;
  for (const row of TOPICS) {
    try {
      if (row.test(q)) {
        title = row.title;
        break;
      }
    } catch {
      /* ignore */
    }
  }
  if (!title) return null;

  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return null;
    const data = await res.json();
    const extract = data.extract;
    if (!extract || typeof extract !== 'string') return null;
    const short = extract.length > 900 ? `${extract.slice(0, 897)}…` : extract;
    return `${short}\n\nRead more: ${data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${title}`}`;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}
