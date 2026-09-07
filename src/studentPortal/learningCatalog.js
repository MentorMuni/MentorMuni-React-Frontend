/** Learning catalog for student portal sidebar — free tutorials + AI tools. */

export const LEARNING_TUTORIAL_GROUPS = [
  {
    id: 'programming-foundations',
    label: 'Programming foundations',
    description: 'Core languages and databases every campus candidate needs.',
    items: [
      {
        id: 'python',
        title: 'Python For Beginners',
        description: 'Fundamentals with interactive lessons — syntax to intermediate concepts.',
        contentPath: '/python-for-beginners',
        tag: 'Language',
      },
      {
        id: 'java',
        title: 'Java for Beginners',
        description: 'Java from scratch with hands-on examples and OOP best practices.',
        contentPath: '/java-for-beginners',
        tag: 'Language',
      },
      {
        id: 'sql',
        title: 'SQL Basics',
        description: 'Queries, joins, and data manipulation for campus tech rounds.',
        contentPath: '/sql-for-beginners',
        tag: 'Database',
      },
    ],
  },
  {
    id: 'ai-emerging',
    label: 'AI & emerging tech',
    description: 'LLMs, prompts, RAG, and quantum — beginner to practical.',
    items: [
      {
        id: 'generative-ai',
        title: 'Generative AI for Beginners',
        description: 'GPT, LLMs, and prompt engineering with practical examples.',
        contentPath: '/tutorials/generative-ai-for-beginners',
        tag: 'AI',
      },
      {
        id: 'prompt-engineering',
        title: 'Prompt Engineering Masterclass',
        description: 'Beginner to advanced ChatGPT prompts and LLM strategies.',
        contentPath: '/courses/prompt-engineering-masterclass',
        tag: 'AI',
      },
      {
        id: 'rag-systems',
        title: 'RAG Systems Tutorial',
        description: 'Retrieval-Augmented Generation from fundamentals to production.',
        contentPath: '/courses/rag-systems',
        tag: 'AI',
      },
      {
        id: 'quantum-computing',
        title: 'Quantum Computing',
        description: 'Qubits, gates, and Python Qiskit — math foundations to algorithms.',
        contentPath: '/courses/quantum-computing',
        tag: 'Emerging',
      },
    ],
  },
  {
    id: 'career-tracks',
    label: 'Career tracks',
    description: 'Role roadmaps for placement-season focus.',
    items: [
      {
        id: 'devops',
        title: 'DevOps Roadmap for Beginners',
        description: 'Linux, Git, CI/CD, Docker, Kubernetes, Cloud, and IaC.',
        contentPath: '/courses/devops-roadmap-for-beginners',
        tag: 'Track',
      },
    ],
  },
];

export const LEARNING_AI_SECTIONS = [
  { id: 'llms', label: 'Major LLMs' },
  { id: 'coding-tools', label: 'Coding AI tools' },
  { id: 'mentormuni-tools', label: 'MentorMuni tools' },
  { id: 'faq', label: 'FAQ' },
];

export function findLearningTutorial(id) {
  for (const group of LEARNING_TUTORIAL_GROUPS) {
    const hit = group.items.find((item) => item.id === id);
    if (hit) return hit;
  }
  return null;
}
