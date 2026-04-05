import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMuniBotReply } from '../utils/munibotEngine';

const LOGO_SRC = '/MentorMuni-React-Frontend/mentormuni-logo.png';

const GREETING =
  "Hi — I'm **MuniBot**, your MentorMuni assistant. Ask me about our **programme**, **interview readiness**, **AI & LLM topics**, **prompting**, or **where to learn** online.";

const QUICK_QUESTIONS = [
  'What is MentorMuni?',
  'Interview readiness score',
  'DSA interview tips',
  'What is RAG?',
  'Prompt engineering tips',
  'Free learning resources',
  'How do I contact you?',
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-[#E0DCCF] bg-white px-3 py-2.5 shadow-sm w-fit">
      <span
        className="h-2 w-2 rounded-full bg-[#FF9500] animate-bounce"
        style={{ animationDelay: '0ms' }}
      />
      <span
        className="h-2 w-2 rounded-full bg-[#FF9500] animate-bounce"
        style={{ animationDelay: '150ms' }}
      />
      <span
        className="h-2 w-2 rounded-full bg-[#FF9500] animate-bounce"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
}

/** **bold** + plain text segments */
function renderBoldSegments(line) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

/** Linkify https URLs + bold */
function MessageBody({ text, isMarkdown, variant = 'bot' }) {
  const isUser = variant === 'user';
  const textClass = isUser ? 'text-white' : 'text-[#333]';
  const linkClass = isUser
    ? 'break-all font-medium text-white underline decoration-white/50 underline-offset-2 hover:text-white/90'
    : 'break-all font-medium text-[#0891b2] underline decoration-[#0891b2]/40 underline-offset-2 hover:text-[#0e7490]';

  if (!isMarkdown) {
    return <p className={`text-sm leading-relaxed whitespace-pre-line ${textClass}`}>{text}</p>;
  }

  const segments = text.split(/(https?:\/\/[^\s]+)/g);

  return (
    <p className={`text-sm leading-relaxed whitespace-pre-line ${textClass}`}>
      {segments.map((segment, i) => {
        if (/^https?:\/\//.test(segment)) {
          return (
            <a key={i} href={segment} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {segment}
            </a>
          );
        }
        return <span key={i}>{renderBoldSegments(segment)}</span>;
      })}
    </p>
  );
}

function MessageBubble({ text, isBot, isMarkdown }) {
  return (
    <div className={`flex gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}>
      {isBot && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E0DCCF] bg-white shadow-sm ring-2 ring-[#FFF4E0]">
          <img src={LOGO_SRC} alt="" className="h-full w-full object-cover" width={36} height={36} />
        </div>
      )}
      <div
        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
          isBot
            ? 'rounded-bl-md border border-[#E0DCCF] bg-white'
            : 'rounded-br-md bg-gradient-to-br from-[#FF9500] to-[#E88600] text-white'
        }`}
      >
        <MessageBody text={text} isMarkdown={isMarkdown && isBot} variant={isBot ? 'bot' : 'user'} />
      </div>
    </div>
  );
}

export default function MuniBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: GREETING, isBot: true, isMarkdown: true }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = (text) => {
    const msg = text?.trim() || input.trim();
    if (!msg) return;

    setInput('');
    setShowQuickReplies(false);
    setMessages((m) => [...m, { text: msg, isBot: false, isMarkdown: false }]);
    setIsTyping(true);

    const delay = 500 + Math.min(msg.length * 12, 500);
    window.setTimeout(() => {
      const reply = getMuniBotReply(msg);
      setMessages((m) => [...m, { text: reply, isBot: true, isMarkdown: true }]);
      setIsTyping(false);
    }, delay);
  };

  const handleQuickQuestion = (q) => {
    sendMessage(q);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        className="pointer-events-none fixed bottom-[5.5rem] right-6 z-[9997] hidden max-w-[220px] sm:block"
        aria-hidden
      >
        <div className="pointer-events-none rounded-2xl border border-[#E0DCCF] bg-white/95 px-3 py-2 text-xs font-medium text-foreground-muted shadow-lg backdrop-blur">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#FF9500]" />
            Ask MuniBot anything
          </span>
        </div>
      </motion.div>

      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9998] flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white/90 text-white shadow-xl focus:outline-none focus:ring-4 focus:ring-[#FF9500]/35"
        style={{
          background: 'linear-gradient(135deg, #FF9500 0%, #E88600 50%, #CC7000 100%)',
          boxShadow: '0 10px 40px -10px rgba(255, 149, 0, 0.45)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Open MuniBot"
      >
        <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl">
          <img src={LOGO_SRC} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-white/50" width={40} height={40} />
        </span>
        <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/80 opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed bottom-24 right-6 z-[9999] flex h-[min(72vh,540px)] w-[calc(100vw-1.5rem)] max-w-md flex-col overflow-hidden rounded-2xl border border-[#E0DCCF] bg-[#FFFDF8] shadow-2xl"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,149,0,0.08)',
            }}
            role="dialog"
            aria-label="MuniBot chat"
          >
            <div className="flex items-center justify-between border-b border-[#F0ECE0] bg-gradient-to-r from-[#FFFDF8] to-[#FFF8EE] px-3 py-2.5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E0DCCF] bg-white shadow-sm ring-2 ring-[#FFB347]/25">
                  <img src={LOGO_SRC} alt="" className="h-full w-full object-cover" width={44} height={44} />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-bold text-foreground">MuniBot</p>
                  <p className="truncate text-xs text-muted-foreground">MentorMuni · interviews · AI help</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="shrink-0 rounded-xl p-2 text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f7f5f0]/80 p-3">
              {messages.map((m, i) => (
                <MessageBubble key={i} text={m.text} isBot={m.isBot} isMarkdown={m.isMarkdown} />
              ))}
              {isTyping && <TypingIndicator />}
              {showQuickReplies && (
                <div className="pt-1">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Quick questions
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleQuickQuestion(q)}
                        className="rounded-full border border-[#E0DCCF] bg-white px-2.5 py-1.5 text-[11px] font-medium text-foreground-muted transition hover:border-[#FFB347] hover:bg-[#FFF4E0] hover:text-[#CC7000]"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2 border-t border-[#F0ECE0] bg-white/90 px-3 py-2">
              <Link
                to="/start-assessment"
                onClick={() => setIsOpen(false)}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#FF9500] py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#E88600]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Readiness
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-[#E0DCCF] bg-[#FFFDF8] py-2.5 text-xs font-bold text-foreground-muted transition hover:border-[#FFB347]"
              >
                Contact
              </Link>
            </div>

            <div className="flex gap-2 bg-white px-3 pb-3 pt-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about MentorMuni, interviews, AI…"
                className="min-w-0 flex-1 rounded-xl border border-[#E0DCCF] bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#FFB347] focus:outline-none focus:ring-2 focus:ring-[#FF9500]/25"
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                className="shrink-0 rounded-xl bg-[#FF9500] p-2.5 text-white transition hover:bg-[#E88600] disabled:opacity-50"
                aria-label="Send"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
