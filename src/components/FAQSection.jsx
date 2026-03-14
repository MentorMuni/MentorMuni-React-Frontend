import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQSection = () => {
  const [expandedId, setExpandedId] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "Who is MentorMuni for?",
      answer: "MentorMuni is designed for college students preparing for placements, freshers in IT roles looking to transition, and professionals switching into tech careers. Whether you're in your final year, have 1-2 years of experience, or are making a career change, MentorMuni helps you prepare systematically and get hired faster."
    },
    {
      id: 2,
      question: "Is the platform really free?",
      answer: "Yes, MentorMuni offers 3 free analyses per tool (Resume, Skill Gap, Interview Readiness) without requiring a credit card. This allows you to experience the platform's AI-powered feedback before deciding to upgrade to premium features like unlimited analyses, personal mentorship, and career roadmaps."
    },
    {
      id: 3,
      question: "How does AI analysis work?",
      answer: "Our AI engine analyzes your profile against 5000+ real job descriptions, industry standards, and successful tech career profiles. It provides instant feedback on resume optimization, skill benchmarking, interview readiness, and personalized improvement recommendations based on actual hiring patterns."
    },
    {
      id: 4,
      question: "Do mentors guarantee jobs?",
      answer: "While we can't guarantee jobs, our mentors have a proven track record: 85% of students mentored by MentorMuni received interview calls, and 200+ have successfully landed tech roles. Success depends on your commitment to following recommendations and actively preparing using our platform."
    },
    {
      id: 5,
      question: "What tech roles can I prepare for?",
      answer: "MentorMuni supports preparation for roles including Software Engineer, Frontend Developer, Backend Developer, Data Analyst, QA Automation Engineer, DevOps Engineer, Product Manager, and Cloud Engineer. Our AI adapts to your target role with specific skill gaps and interview preparation."
    },
    {
      id: 6,
      question: "How long does the analysis take?",
      answer: "Free AI analyses typically take 5-15 minutes to complete. Our interactive assessments provide immediate feedback with actionable insights. For personalized mentorship and career roadmaps, we schedule 30-minute sessions based on your availability."
    },
    {
      id: 7,
      question: "Can I upgrade or downgrade anytime?",
      answer: "Absolutely! You can upgrade to premium at any time to unlock unlimited analyses, personal mentor sessions, and exclusive career roadmaps. You can also downgrade or cancel your premium subscription anytime without penalties."
    },
    {
      id: 8,
      question: "How do I get started?",
      answer: "Start by checking your interview readiness with our free assessment. Then use the Resume Analyzer to get AI feedback on your profile, and the Skill Gap Analyzer to identify what you need to learn. Based on these insights, we'll recommend a personalized preparation path and mentor guidance."
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 font-semibold text-sm mb-6">
            <HelpCircle className="w-4 h-4" />
            Common Questions
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about MentorMuni and how we help you prepare for your next tech job.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden transition-all duration-300 hover:border-indigo-300 hover:shadow-md"
            >
              {/* Question Button */}
              <button
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <h3 className="text-lg font-bold text-slate-900 pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-6 h-6 text-indigo-600 flex-shrink-0 transition-transform duration-300 ${
                    expandedId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer */}
              {expandedId === faq.id && (
                <div className="px-6 py-5 bg-slate-50 border-t border-slate-200">
                  <p className="text-slate-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-6">
            Still have questions? We're here to help!
          </p>
          <a
            href="/#/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <span>Contact Our Team</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
