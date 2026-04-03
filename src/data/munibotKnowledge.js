/**
 * MuniBot — keyword-scored knowledge: MentorMuni product, interview prep, AI, learning links.
 * Matched by src/utils/munibotEngine.js (merged with aiChatKnowledgeBase KNOWLEDGE_CHUNKS).
 */

import {
  MISSION_TAGLINE,
  PRODUCT_READINESS_SCORE,
  CONTACT_PHONE_DISPLAY,
  READINESS_TEST_COUPON_PROMO,
  HERO_PROOF_STAT,
  PRIMARY_CTA_LABEL,
} from '../constants/brandCopy';

/** Site & programme */
export const MUNIBOT_CHUNKS = [
  {
    id: 'mm-intro',
    keywords: [
      'what is mentormuni',
      'mentormuni',
      'who are you',
      'what do you do',
      'munibot',
      'about mentormuni',
    ],
    text:
      `**MentorMuni** is an interview-readiness platform for **engineering students in India**: AI + mentors so you know your **gaps before** the real panel.\n\n` +
      `**Mission:** ${MISSION_TAGLINE}\n\n` +
      `Start with the free **${PRODUCT_READINESS_SCORE}** (~5 min), then use AI mocks, resume ATS, skill gap tools, and mentorship when you are ready.`,
  },
  {
    id: 'readiness-score',
    keywords: [
      'readiness',
      'readiness score',
      'interview readiness',
      'assessment',
      'placement readiness',
      'gaps',
      'test',
      'check my readiness',
    ],
    text:
      `The **${PRODUCT_READINESS_SCORE}** gives you a **score out of 100** with **topic-level gaps** (e.g. DSA, system design, HR) and **what to fix first** — not everything at once.\n\n` +
      `**${HERO_PROOF_STAT}**\n` +
      `${READINESS_TEST_COUPON_PROMO}\n\n` +
      `Use the **Readiness** flow from the nav or homepage — same promise as **"${PRIMARY_CTA_LABEL}"**.`,
  },
  {
    id: 'tools',
    keywords: ['tools', 'what tools', 'features', 'offer', 'services', 'ats', 'resume checker'],
    text:
      `**MentorMuni tools** (high level):\n` +
      `• **${PRODUCT_READINESS_SCORE}** — measure gaps\n` +
      `• **AI mock interviews** — practice with feedback\n` +
      `• **Resume ATS checker** — how recruiters’ systems see your CV\n` +
      `• **Skill gap analyzer** — where to focus next\n` +
      `• **AI tools knowledge base** — Copilot, ChatGPT, Cursor for interviews\n` +
      `• **Learning paths & tutorials** on the site\n\n` +
      `Open **Tools** in the nav for shortcuts.`,
  },
  {
    id: 'mentors-waitlist',
    keywords: ['mentor', 'mentorship', 'waitlist', 'cohort', '1:1', 'guidance'],
    text:
      `**Mentors** are industry professionals who help you close gaps after the score and mocks show where to focus. **Cohort / waitlist** batches run with limited seats — use **Join Waitlist** in the nav or **Contact** for questions.\n\n` +
      `We **stay with you until you get placed** as part of the paid programme (no fake “guaranteed job” promises — real support).`,
  },
  {
    id: 'mock-interviews',
    keywords: ['mock interview', 'ai mock', 'practice interview', 'voice'],
    text:
      `**AI mock interviews** simulate real pressure: you speak, get feedback on clarity, depth, and structure. Great alongside the **readiness score** so you practice **what you actually need**.\n\n` +
      `From the nav: **Mock Interviews** — pair with mentor sessions for best results.`,
  },
  {
    id: 'contact-nav',
    keywords: ['contact', 'email', 'phone', 'reach', 'support', 'hello'],
    text:
      `**Contact us:** hello@mentormuni.com · **Phone:** ${CONTACT_PHONE_DISPLAY} (Mon–Fri, IST). Use the **Contact** link in the nav or the contact form for partnerships and student questions.`,
  },
  {
    id: 'recruiters',
    keywords: ['recruiter', 'campus', 'college', 'tpo', 'hiring', 'employer'],
    text:
      `For **employers and campuses**, we have a **For Recruiters** page (nav) — hiring partnerships and student programmes. For general student prep, start with the **readiness score** and **Tools**.`,
  },
  {
    id: 'how-it-works',
    keywords: ['how it works', 'workflow', 'steps', 'process'],
    text:
      `Typical flow: **(1)** Free **readiness score** → see gaps · **(2)** Fix basics with AI tools and mocks · **(3)** Join **mentorship / waitlist** for structured support · **(4)** Iterate until interviews feel solid.\n\n` +
      `See **How It Works** in the nav for the full story.`,
  },

  /* Interview basics — engineering */
  {
    id: 'dsa',
    keywords: ['dsa', 'data structure', 'leetcode', 'coding round', 'algorithms', 'two pointer', 'dynamic programming', 'graphs'],
    text:
      `**DSA rounds** test problem-solving under time. Tips:\n` +
      `• Learn **patterns** (two pointers, sliding window, trees, graphs, DP) — not 500 random problems.\n` +
      `• **Think out loud**: approach → complexity → code → tests.\n` +
      `• Use **MentorMuni readiness** to see which topics to prioritise.\n\n` +
      `Practice: **LeetCode**, **NeetCode** (roadmaps), **InterviewBit** — pair with our mocks for communication.`,
  },
  {
    id: 'system-design',
    keywords: ['system design', 'scalability', 'microservices', 'load balancer', 'cap theorem', 'design round'],
    text:
      `**System design** interviews: clarify requirements, estimate scale, draw **high-level architecture**, deep-dive on 1–2 components, discuss trade-offs.\n\n` +
      `Resources: **System Design Primer** (GitHub), **ByteByteGo** (articles/YouTube), company engineering blogs. Speak in **layers**: API → services → data stores → caching → async.`,
  },
  {
    id: 'star',
    keywords: ['star', 'behavioral', 'hr round', 'tell me about', 'situation'],
    text:
      `**STAR** for behavioral HR answers: **S**ituation → **T**ask → **A**ction → **R**esult. One story per competency (leadership, conflict, failure). Keep it **2–3 minutes**, real metrics when possible.\n\n` +
      `Practice with **AI mocks** for HR-style prompts.`,
  },
  {
    id: 'resume',
    keywords: ['resume', 'cv', 'ats', 'projects', 'internship'],
    text:
      `**Resume tips:** One page for most students, **impact bullets** (metrics), **projects** with stack + outcome, **ATS-friendly** layout (no fancy tables that break parsing). Use MentorMuni’s **Resume ATS checker** before you apply.\n\n` +
      `Tailor slightly per role — keywords from the JD.`,
  },
  {
    id: 'final-year',
    keywords: ['final year', 'fresher', 'campus placement', 'off campus', 'intern'],
    text:
      `**Campus / fresher** prep: lock **DSA + CS fundamentals**, 1 **strong project**, **HR stories** (STAR), and **company research**. Off-campus adds **referrals** and **LinkedIn** — same skills, more networking.\n\n` +
      `MentorMuni maps **readiness** so you don’t prep everything at once.`,
  },

  /* AI — LLM, RAG, concepts */
  {
    id: 'llm-basics',
    keywords: ['llm', 'large language model', 'gpt', 'chatgpt', 'claude', 'gemini', 'what is an llm'],
    text:
      `An **LLM** (large language model) is a neural net trained on huge text/code to **predict** the next tokens — it “knows” patterns, not a live database. **GPT**, **Claude**, **Gemini** are examples.\n\n` +
      `**Limits:** can **hallucinate**; training has a cutoff; use **verification** for facts. Great for drafts, explanations, and mock answers when you still **practice** yourself.`,
  },
  {
    id: 'rag',
    keywords: ['rag', 'retrieval augmented', 'vector', 'embedding', 'chunk'],
    text:
      `**RAG (Retrieval-Augmented Generation)** = **retrieve** relevant docs (often via **vector search** on **embeddings**) + **pass them to the LLM** so answers stay **grounded** in your data. Used for company docs, support bots, and interview prep on *your* notes.\n\n` +
      `We have a **RAG systems** tutorial on MentorMuni (**/rag-systems**) if you want depth.`,
  },
  {
    id: 'transformer',
    keywords: ['transformer', 'attention', 'self-attention', 'bert'],
    text:
      `**Transformers** use **self-attention** to relate all tokens in a sequence — foundation of modern LLMs. **BERT** (encoder), **GPT** (decoder-style) — different training objectives, same family.\n\n` +
      `For interviews: know **high-level**: tokens, context length, pretraining vs fine-tuning.`,
  },
  {
    id: 'hallucination',
    keywords: ['hallucination', 'wrong answer', 'fact check', 'grounding'],
    text:
      `**Hallucination** = plausible but false outputs. Mitigate with: **RAG** over trusted docs, **lower temperature** for APIs, **ask for citations**, and **run/verify** code. Never trust model output for **legal/medical** decisions without review.`,
  },
  {
    id: 'fine-tuning',
    keywords: ['fine-tuning', 'finetune', 'lora', 'pretrain'],
    text:
      `**Pretraining** = broad internet-scale training. **Fine-tuning** = extra training on a smaller dataset for **style or domain** (e.g. support tone). **LoRA** = cheap adapter layers — common in production. Distinct from **prompting** alone.`,
  },

  /* Learning resources (external) */
  {
    id: 'learn-resources',
    keywords: [
      'resource',
      'resources',
      'learn online',
      'tutorial',
      'course',
      'youtube',
      'book',
      'where to learn',
      'study material',
      'best site',
      'free course',
    ],
    text:
      `**Curated learning links** (external — verify freshness yourself):\n\n` +
      `**DSA / coding:** https://leetcode.com · https://neetcode.io/roadmap · https://www.interviewbit.com\n` +
      `**CS foundations:** https://cs50.harvard.edu · https://ocw.mit.edu\n` +
      `**Web docs:** https://developer.mozilla.org · https://web.dev\n` +
      `**System design:** search “System Design Primer” on GitHub · https://bytebytego.com\n` +
      `**AI / ML intro:** https://www.coursera.org (Andrew Ng ML) · https://huggingface.co/learn\n\n` +
      `Pair any course with **MentorMuni readiness + mocks** so you know what recruiters actually test.`,
  },
];
