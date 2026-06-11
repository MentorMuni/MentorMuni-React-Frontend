import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Send, Sparkles, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMuniBotReply } from '../utils/munibotEngine';

const LOGO_SRC = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;
const POSITION_KEY = 'mm-munibot-anchor';
const MOBILE_BREAKPOINT = 640;
const VIEWPORT_MARGIN = 20;
const DRAG_THRESHOLD = 8;

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function loadAnchor() {
  try {
    const raw = localStorage.getItem(POSITION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed.right === 'number' && typeof parsed.bottom === 'number') {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function clampAnchor(anchor, rootEl) {
  if (typeof window === 'undefined' || !rootEl) return anchor;
  const w = rootEl.offsetWidth;
  const h = rootEl.offsetHeight;
  return {
    right: clamp(anchor.right, VIEWPORT_MARGIN, window.innerWidth - w - VIEWPORT_MARGIN),
    bottom: clamp(anchor.bottom, VIEWPORT_MARGIN, window.innerHeight - h - VIEWPORT_MARGIN),
  };
}

const GREETING =
  "Hi — I'm **MuniBot**, your MentorMuni assistant.\n\nAsk about our **programme**, **interview readiness**, **AI & LLM topics**, **prompting**, or **where to learn** online.";

const QUICK_QUESTIONS = [
  'What is MentorMuni?',
  'Interview readiness score',
  'DSA interview tips',
  'What is RAG?',
  'Prompt engineering tips',
  'Free learning resources',
  'How do I contact you?',
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return isMobile;
}

function TypingIndicator() {
  return (
    <div
      className="mm-munibot-typing flex w-fit items-center gap-1 rounded-2xl rounded-bl-md px-3.5 py-3"
      role="status"
      aria-label="MuniBot is typing"
    >
      <span
        className="mm-munibot-typing__dot h-1.5 w-1.5 rounded-full animate-bounce"
        style={{ animationDelay: '0ms' }}
      />
      <span
        className="mm-munibot-typing__dot h-1.5 w-1.5 rounded-full animate-bounce"
        style={{ animationDelay: '150ms' }}
      />
      <span
        className="mm-munibot-typing__dot h-1.5 w-1.5 rounded-full animate-bounce"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
}

function renderBoldSegments(line) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function MessageBody({ text, isMarkdown, variant = 'bot' }) {
  const isUser = variant === 'user';
  const msgClass = isUser ? 'mm-munibot-msg mm-munibot-msg--user' : 'mm-munibot-msg mm-munibot-msg--bot';

  const renderLine = (line, key) => {
    if (!isMarkdown) {
      return (
        <p key={key} className={`${msgClass} whitespace-pre-line`}>
          {line}
        </p>
      );
    }
    const segments = line.split(/(https?:\/\/[^\s]+)/g);
    return (
      <p key={key} className={msgClass}>
        {segments.map((segment, i) => {
          if (/^https?:\/\//.test(segment)) {
            return (
              <a key={i} href={segment} target="_blank" rel="noopener noreferrer">
                {segment}
              </a>
            );
          }
          return <span key={i}>{renderBoldSegments(segment)}</span>;
        })}
      </p>
    );
  };

  if (!isMarkdown) {
    const blocks = text.split(/\n\n+/);
    return blocks.map((block, i) => renderLine(block, i));
  }

  const paragraphs = text.split(/\n\n+/);
  return paragraphs.map((para, i) => {
    const lines = para.split('\n');
    return (
      <div key={i} className={i > 0 ? 'mt-2' : undefined}>
        {lines.map((line, j) => renderLine(line, `${i}-${j}`))}
      </div>
    );
  });
}

function MessageBubble({ text, isBot, isMarkdown, animate }) {
  return (
    <div
      className={`flex gap-2.5 ${animate ? 'mm-munibot-msg-enter' : ''} ${isBot ? '' : 'flex-row-reverse'}`}
    >
      {isBot && (
        <div className="mm-munibot-avatar flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full">
          <img
            src={LOGO_SRC}
            alt="MuniBot"
            className="h-full w-full object-contain"
            width={32}
            height={32}
          />
        </div>
      )}
      <div
        className={`max-w-[86%] rounded-[1.125rem] px-3.5 py-2.5 sm:max-w-[82%] ${
          isBot ? 'mm-munibot-bubble--bot rounded-bl-md' : 'mm-munibot-bubble--user rounded-br-md'
        }`}
      >
        <MessageBody text={text} isMarkdown={isMarkdown && isBot} variant={isBot ? 'bot' : 'user'} />
      </div>
    </div>
  );
}

export default function MuniBot() {
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const dialogTitleId = useId();
  const liveRegionId = useId();
  const panelId = 'mm-munibot-panel';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: GREETING, isBot: true, isMarkdown: true }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [lastAnnounced, setLastAnnounced] = useState('');
  const [customAnchor, setCustomAnchor] = useState(loadAnchor);
  const [isDragging, setIsDragging] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const replyTimeoutRef = useRef(null);
  const rootRef = useRef(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    startRight: 0,
    startBottom: 0,
  });

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) window.clearTimeout(replyTimeoutRef.current);
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [reduceMotion]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const t = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 104)}px`;
  }, [input]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    const lastBot = [...messages].reverse().find((m) => m.isBot);
    if (lastBot && !isTyping) {
      const plain = lastBot.text.replace(/\*\*/g, '').slice(0, 120);
      setLastAnnounced(plain);
    }
  }, [messages, isTyping]);

  const persistAnchor = useCallback((anchor) => {
    const clamped = clampAnchor(anchor, rootRef.current);
    try {
      localStorage.setItem(POSITION_KEY, JSON.stringify(clamped));
    } catch {
      /* ignore */
    }
    return clamped;
  }, []);

  useEffect(() => {
    if (!customAnchor) return undefined;
    const onResize = () => {
      setCustomAnchor((prev) => (prev ? clampAnchor(prev, rootRef.current) : prev));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [customAnchor]);

  useEffect(() => {
    if (!rootRef.current) return;
    setCustomAnchor((prev) => (prev ? clampAnchor(prev, rootRef.current) : prev));
  }, [isOpen]);

  const getAnchorFromRect = useCallback(() => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return { right: VIEWPORT_MARGIN, bottom: VIEWPORT_MARGIN };
    return {
      right: window.innerWidth - rect.right,
      bottom: window.innerHeight - rect.bottom,
    };
  }, []);

  const onLauncherPointerDown = (e) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const anchor = customAnchor ?? getAnchorFromRect();
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      startRight: anchor.right,
      startBottom: anchor.bottom,
    };
    setIsDragging(true);
  };

  const onLauncherPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (!dragRef.current.moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      dragRef.current.moved = true;
    }
    if (dragRef.current.moved) {
      const next = {
        right: dragRef.current.startRight - dx,
        bottom: dragRef.current.startBottom - dy,
      };
      setCustomAnchor(clampAnchor(next, rootRef.current));
    }
  };

  const onLauncherPointerUp = (e) => {
    if (!dragRef.current.active) return;
    const wasDrag = dragRef.current.moved;
    dragRef.current.active = false;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    if (wasDrag) {
      setCustomAnchor((prev) => (prev ? persistAnchor(prev) : prev));
    } else {
      setIsOpen((open) => !open);
    }
  };

  const onLauncherPointerCancel = () => {
    dragRef.current.active = false;
    dragRef.current.moved = false;
    setIsDragging(false);
    if (customAnchor) {
      setCustomAnchor((prev) => (prev ? persistAnchor(prev) : prev));
    }
  };

  const resetChat = () => {
    if (replyTimeoutRef.current) window.clearTimeout(replyTimeoutRef.current);
    setIsTyping(false);
    setMessages([{ text: GREETING, isBot: true, isMarkdown: true }]);
    setShowQuickReplies(true);
    setInput('');
    inputRef.current?.focus();
  };

  const sendMessage = (text) => {
    const msg = text?.trim() || input.trim();
    if (!msg || isTyping) return;

    setInput('');
    setShowQuickReplies(false);
    setMessages((m) => [...m, { text: msg, isBot: false, isMarkdown: false }]);
    setIsTyping(true);

    const delay = 450 + Math.min(msg.length * 10, 450);
    replyTimeoutRef.current = window.setTimeout(() => {
      const reply = getMuniBotReply(msg);
      setMessages((m) => [...m, { text: reply, isBot: true, isMarkdown: true }]);
      setIsTyping(false);
      replyTimeoutRef.current = null;
    }, delay);
  };

  const handleComposerKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickQuestion = (q) => {
    sendMessage(q);
  };

  const goToReadiness = () => {
    navigate('/start-assessment');
    setIsOpen(false);
  };

  const goToContact = () => {
    navigate('/contact');
    setIsOpen(false);
  };

  const canSend = input.trim().length > 0 && !isTyping;
  const panelClass = isMobile ? 'mm-munibot-panel mm-munibot-panel--mobile' : 'mm-munibot-panel';
  const rootStyle = customAnchor
    ? { right: `${customAnchor.right}px`, bottom: `${customAnchor.bottom}px` }
    : undefined;

  return (
    <div ref={rootRef} className="mm-munibot-root" style={rootStyle}>
      <div id={liveRegionId} className="sr-only" aria-live="polite" aria-atomic="true">
        {isTyping ? 'MuniBot is typing' : lastAnnounced}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className={`${panelClass} mm-munibot-panel--anchored flex flex-col overflow-hidden`}
            role="dialog"
            aria-modal="false"
            aria-labelledby={dialogTitleId}
          >
            <header className="mm-munibot-header flex shrink-0 items-center justify-between gap-2 px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="mm-munibot-avatar flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full">
                  <img
                    src={LOGO_SRC}
                    alt=""
                    className="h-full w-full object-cover"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="min-w-0">
                  <p id={dialogTitleId} className="mm-munibot-header__title truncate">
                    MuniBot
                  </p>
                  <p className="mm-munibot-header__meta truncate">
                    <span className="mm-munibot-status__dot" aria-hidden />
                    Online · MentorMuni assistant
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  onClick={resetChat}
                  className="mm-munibot-icon-btn"
                  aria-label="Start new conversation"
                  title="New chat"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mm-munibot-icon-btn"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </header>

            <div className="mm-munibot-messages-wrap">
              <div
                className="mm-munibot-messages flex-1 space-y-3.5 overflow-y-auto px-3.5 py-3.5"
                role="log"
                aria-label="Chat messages"
                aria-relevant="additions"
              >
                {messages.map((m, i) => (
                  <MessageBubble
                    key={`${i}-${m.text.slice(0, 24)}`}
                    text={m.text}
                    isBot={m.isBot}
                    isMarkdown={m.isMarkdown}
                    animate={i === messages.length - 1 && !reduceMotion}
                  />
                ))}
                {isTyping && (
                  <div className="flex gap-2.5 mm-munibot-msg-enter">
                    <div className="mm-munibot-avatar flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full">
                      <img
                        src={LOGO_SRC}
                        alt=""
                        className="h-full w-full object-cover"
                        width={32}
                        height={32}
                      />
                    </div>
                    <TypingIndicator />
                  </div>
                )}
                {showQuickReplies && !isTyping && (
                  <div className="pt-1">
                    <p className="mm-munibot-quick-label mb-2">Suggested</p>
                    <div className="mm-munibot-chips">
                      {QUICK_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => handleQuickQuestion(q)}
                          className="mm-munibot-chip rounded-full px-3 py-2"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-px shrink-0" aria-hidden />
              </div>
            </div>

            <footer className="mm-munibot-footer shrink-0">
              <div className="mm-munibot-cta-row">
                <button
                  type="button"
                  onClick={goToReadiness}
                  className="mm-munibot-cta mm-munibot-cta--primary"
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  Readiness test
                </button>
                <button
                  type="button"
                  onClick={goToContact}
                  className="mm-munibot-cta mm-munibot-cta--secondary"
                >
                  Contact
                </button>
              </div>

              <div className="mm-munibot-composer">
                <div className="mm-munibot-composer__inner">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    placeholder="Message MuniBot…"
                    className="mm-munibot-input min-w-0 flex-1 border-0 outline-none focus:ring-0"
                    autoComplete="off"
                    aria-label="Message"
                  />
                  <button
                    type="button"
                    onClick={() => sendMessage()}
                    disabled={!canSend}
                    className={`mm-munibot-send flex items-center justify-center ${canSend ? 'mm-munibot-send--ready' : ''}`}
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <p className="mm-munibot-disclaimer">
                  Knowledge-base answers — not a live LLM.{' '}
                  <button type="button" className="font-semibold underline" onClick={resetChat}>
                    New chat
                  </button>
                </p>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onPointerDown={onLauncherPointerDown}
        onPointerMove={onLauncherPointerMove}
        onPointerUp={onLauncherPointerUp}
        onPointerCancel={onLauncherPointerCancel}
        className={`mm-munibot-launcher group${isDragging ? ' mm-munibot-launcher--dragging' : ''}`}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-haspopup="dialog"
        aria-label={isOpen ? 'Close MuniBot chat' : 'Open MuniBot chat — drag to move'}
      >
        {isOpen ? (
          <>
            <X size={20} aria-hidden />
            Close
          </>
        ) : (
          <>
            <span className="mm-munibot-launcher__icon" aria-hidden>
              <img
                src={LOGO_SRC}
                alt=""
                className="h-full w-full rounded-full object-contain"
                width={24}
                height={24}
                draggable={false}
              />
            </span>
            Ask MuniBot
            <Sparkles size={16} className="mm-munibot-launcher__sparkle" aria-hidden />
          </>
        )}
      </button>
    </div>
  );
}
