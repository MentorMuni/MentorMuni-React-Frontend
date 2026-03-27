import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const BOT_AVATAR = "🤖";
const GREETING = "Hi! I'm your MentorMuni guide. Ask me anything about what we do, our tools, or how we help students crack placements.";

const QUICK_QUESTIONS = [
  "What is MentorMuni?",
  "What do you offer?",
  "Placement readiness?",
  "AI Mock Interviews?",
  "Mentors?",
  "For colleges?",
  "Contact / Demo",
];

const RESPONSES = {
  "what is mentormuni?": "MentorMuni is an **AI-powered placement preparation platform** for college students. We help you understand your placement readiness, practice with AI mock interviews, and improve with guidance from industry mentors. Think of us as your placement prep partner — we're here so you can crack campus and off-campus interviews with confidence.",
  "what do you offer?": "We offer:\n\n• **AI Placement Readiness** — Get a clear score and feedback on your resume, communication, and technical readiness.\n• **AI Mock Interviews** — Practice HR, technical, and behavioral rounds with instant feedback.\n• **Mentor Guidance** — Learn from software engineers, PMs, and industry experts.\n• **Free tools** — Resume ATS checker, skill gap analyzer, and more.\n\nStart with free tools, then level up with mentors!",
  "placement readiness?": "Our **AI Placement Readiness Analyzer** evaluates your resume quality, communication skills, technical interview readiness, and confidence. You get a readiness score (e.g. 72%) with strengths and areas to improve — so you know exactly where you stand. No guesswork. Try it free: **Check My Placement Readiness** on our homepage!",
  "ai mock interviews?": "Yes! You can **practice real interviews with AI**. We offer HR, technical, and behavioral mock interviews. The AI gives you instant feedback on answer clarity, communication, structure, and confidence. It's like having a practice partner available 24/7. Click **Start AI Mock Interview** to begin!",
  "mentors?": "After AI identifies your gaps, **industry mentors** help you improve. We have software engineer mentors (ex-FAANG), product manager mentors, and industry experts who've been on real interview panels. They give personalized guidance so you can crack actual placement interviews.",
  "for colleges?": "**MentorMuni for Colleges** helps TPOs and placement cells track student readiness, run AI mock interviews at scale, and use analytics to strengthen placement prep. Request a **College Demo** and we'll show you how it works for your campus.",
  "contact / demo": "You can reach us at **enroll@mentormuni.com** or call **+91 91464 21302**. For college demos, use the **Request College Demo** button on our site. We're happy to help!",
};

function getBotResponse(userText) {
  const key = userText.toLowerCase().trim();
  if (RESPONSES[key]) return RESPONSES[key];
  // Fuzzy match
  for (const [k, v] of Object.entries(RESPONSES)) {
    if (key.includes(k.slice(0, 8)) || k.includes(key.slice(0, 10))) return v;
  }
  return "I can tell you about MentorMuni: what we are, placement readiness, AI mock interviews, mentors, and our offerings for colleges. Try one of the quick questions below, or ask in your own words!";
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2 rounded-2xl rounded-bl-md bg-slate-700 w-fit">
      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
}

function MessageBubble({ text, isBot, isMarkdown }) {
  const parts = isMarkdown ? text.split(/(\*\*[^*]+\*\*)/g) : [text];
  return (
    <div className={`flex gap-2 ${isBot ? "" : "flex-row-reverse"}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF9500] to-[#FFB347] flex items-center justify-center text-sm flex-shrink-0">
          {BOT_AVATAR}
        </div>
      )}
      <div
        className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${
          isBot
            ? "rounded-bl-md bg-slate-700/90 text-slate-100"
            : "rounded-br-md bg-[#FF9500] text-white"
        }`}
      >
        {isMarkdown ? (
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {parts.map((part, i) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={i}>{part.slice(2, -2)}</strong>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-line">{text}</p>
        )}
      </div>
    </div>
  );
}

export default function MentorMuniChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: GREETING, isBot: true, isMarkdown: false }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = (text) => {
    const msg = text?.trim() || input.trim();
    if (!msg) return;

    setInput("");
    setShowQuickReplies(false);
    setMessages((m) => [...m, { text: msg, isBot: false }]);
    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotResponse(msg);
      setMessages((m) => [...m, { text: reply, isBot: true, isMarkdown: true }]);
      setIsTyping(false);
    }, 800 + Math.min(msg.length * 20, 600));
  };

  const handleQuickQuestion = (q) => {
    const key = q.toLowerCase().replace(/\?/g, "").trim();
    const map = {
      "what is mentormuni?": "what is MentorMuni?",
      "what do you offer?": "what do you offer?",
      "placement readiness?": "placement readiness?",
      "ai mock interviews?": "AI Mock Interviews?",
      "mentors?": "mentors?",
      "for colleges?": "for colleges?",
      "contact / demo": "contact / demo",
    };
    const normalized = map[key] || key;
    sendMessage(normalized);
  };

  return (
    <>
      {/* Teaser label - encourages click */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.4 }}
        className="fixed bottom-6 right-20 z-[9998] hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/95 border border-slate-600/50 shadow-lg backdrop-blur"
      >
        <Sparkles className="w-4 h-4 text-[#FF9500]" />
        <span className="text-sm font-medium text-white">Ask me about MentorMuni</span>
      </motion.div>

      {/* Floating chat button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9998] flex items-center justify-center w-14 h-14 rounded-2xl shadow-xl text-white focus:outline-none focus:ring-4 focus:ring-[#FF9500]/35"
        style={{
          background: "linear-gradient(135deg, #FF9500 0%, #E88600 50%, #CC7000 100%)",
          boxShadow: "0 10px 40px -10px rgba(255, 149, 0, 0.45)",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        initial={false}
        animate={{
          boxShadow: [
            "0 10px 40px -10px rgba(255, 149, 0, 0.45)",
            "0 10px 50px -5px rgba(232, 134, 0, 0.5)",
            "0 10px 40px -10px rgba(255, 149, 0, 0.45)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-label="Open MentorMuni assistant"
      >
        <MessageCircle className="w-7 h-7" strokeWidth={2} />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80 opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-400 border-2 border-white" />
        </span>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-[9999] w-[calc(100vw-3rem)] max-w-md h-[min(70vh,520px)] rounded-2xl border border-slate-700/50 bg-slate-900 shadow-2xl flex flex-col overflow-hidden"
            style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-slate-700/80"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.2) 100%)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9500] to-[#FFB347] flex items-center justify-center text-lg">
                  {BOT_AVATAR}
                </div>
                <div>
                  <p className="font-semibold text-white">MentorMuni Assistant</p>
                  <p className="text-xs text-slate-400">Ask me anything</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <MessageBubble key={i} text={m.text} isBot={m.isBot} isMarkdown={m.isMarkdown} />
              ))}
              {isTyping && <TypingIndicator />}
              {showQuickReplies && (
                <div className="pt-2">
                  <p className="text-xs text-slate-500 mb-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleQuickQuestion(q)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-700/80 text-slate-200 hover:bg-[#FF9500] hover:text-white transition-colors border border-slate-600/50"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* CTAs in chat */}
            <div className="px-4 pb-2 flex gap-2">
              <Link
                to="/start-assessment"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#FF9500] hover:bg-[#E88600] text-white text-sm font-semibold transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Readiness
              </Link>
              <Link
                to="/mock-interviews"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold transition-colors"
              >
                Mock Interview
              </Link>
            </div>

            {/* Input */}
            <div className="p-4 pt-0 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about MentorMuni..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:border-transparent text-sm"
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                className="p-3 rounded-xl bg-[#FF9500] hover:bg-[#E88600] text-white transition-colors disabled:opacity-50"
                aria-label="Send"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
