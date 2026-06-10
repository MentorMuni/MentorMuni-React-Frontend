import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code2, MessageCircle, Network } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { getRouteSeo } from '../constants/routeSeoMeta';
import { goToStartAssessment } from '../utils/startAssessmentNavigation';
import { PRIMARY_CTA_LABEL } from '../constants/brandCopy';

const TOPICS = [
  {
    icon: Code2,
    title: 'DSA & coding',
    questions: [
      'Reverse a linked list and explain time/space complexity.',
      'Find the longest substring without repeating characters.',
      'When would you use a heap vs a hash map in an interview?',
      'Explain two-pointer technique with a sample problem.',
    ],
  },
  {
    icon: BookOpen,
    title: 'Core CS & OOP',
    questions: [
      'Explain polymorphism with a real project example.',
      'Difference between process and thread — when does it matter?',
      'What is normalization? Give 2NF vs 3NF in one line each.',
      'How does garbage collection work in Java?',
    ],
  },
  {
    icon: Network,
    title: 'System design (basics)',
    questions: [
      'Design a URL shortener — what tables and APIs would you add?',
      'How would you scale a read-heavy feed for 1M users?',
      'Cache vs database — what goes where and why?',
      'What is load balancing? Name two strategies.',
    ],
  },
  {
    icon: MessageCircle,
    title: 'HR & behavioural',
    questions: [
      'Tell me about a time you failed and what you learned.',
      'Why should we hire you for this role?',
      'Describe a conflict in a team project and how you resolved it.',
      'Where do you see yourself in 3 years after joining?',
    ],
  },
];

const seo = getRouteSeo('/software-engineer-interview-questions');

export default function SoftwareEngineerInterviewQuestionsPage() {
  usePageMeta(seo);

  return (
    <div className="mm-site-theme min-h-screen bg-background">
      <div className="mm-container mm-container--narrow py-12 md:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1A8FC4]">Campus & product roles</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Software engineer interview questions
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Evergreen questions asked in Indian campus drives and early software engineer interviews — use this list to
          practise, then measure gaps with our free readiness check (DSA, HR, aptitude, and role fit).
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={goToStartAssessment}
            className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold"
          >
            {PRIMARY_CTA_LABEL}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          <Link
            to="/mock-interview"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition hover:bg-secondary"
          >
            AI mock interview
          </Link>
        </div>

        <div className="mt-12 space-y-8">
          {TOPICS.map((topic) => {
            const Icon = topic.icon;
            return (
              <section
                key={topic.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
                aria-labelledby={`topic-${topic.title.replace(/\s+/g, '-')}`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A8FC4]/10 text-[#1A8FC4]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h2
                    id={`topic-${topic.title.replace(/\s+/g, '-')}`}
                    className="text-xl font-bold text-foreground"
                  >
                    {topic.title}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {topic.questions.map((q) => (
                    <li key={q} className="flex gap-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1A8FC4]" aria-hidden />
                      {q}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl border border-[#1A8FC4]/20 bg-[#1A8FC4]/[0.06] p-6 text-center sm:p-8">
          <h2 className="text-lg font-bold text-foreground">Don&apos;t guess your readiness</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Lists help you practise — a scored check shows what to fix first before TCS, Infosys, and product company
            panels.
          </p>
          <button
            type="button"
            onClick={goToStartAssessment}
            className="btn-primary mt-5 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold"
          >
            {PRIMARY_CTA_LABEL}
          </button>
        </div>
      </div>
    </div>
  );
}
