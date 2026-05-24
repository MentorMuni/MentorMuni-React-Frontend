import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Send, Sparkles, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMuniBotReply } from '../utils/munibotEngine';

const LOGO_SRC = `${import.meta.env.BASE_URL}mentormuni-logo.png`;
const POSITION_KEY = 'mm-munibot-position';
const MOBILE_NUDGE_KEY = 'mm-munibot-mobile-nudge-seen';
const MOBILE_NUDGE_MS = 4500;
const FAB_SIZE = 56;
const VIEWPORT_MARGIN = 12;
const DRAG_THRESHOLD = 6;
const PANEL_MAX_H = 580;
const MOBILE_PANEL_MAX_H = 420;
const MOBILE_PANEL_VH = 0.52;
const MOBILE_BREAKPOINT = 640;

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

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

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

function getDefaultFabPosition() {
  if (typeof window === 'undefined') return { left: 16, top: 400 };
  const margin = window.innerWidth >= 768 ? 24 : 16;
  const bottomOffset = window.innerWidth >= 768 ? 24 : 88;
  return {
    left: window.innerWidth - margin - FAB_SIZE,
    top: window.innerHeight - bottomOffset - FAB_SIZE,
  };
}

function loadFabPosition() {
  try {
    const raw = localStorage.getItem(POSITION_KEY);
    if (!raw) return getDefaultFabPosition();
    const parsed = JSON.parse(raw);
    if (typeof parsed.left !== 'number' || typeof parsed.top !== 'number') {
      return getDefaultFabPosition();
    }
    return parsed;
  } catch {
    return getDefaultFabPosition();
  }
}

function clampFabPosition(pos) {
  if (typeof window === 'undefined') return pos;
  return {
    left: clamp(pos.left, VIEWPORT_MARGIN, window.innerWidth - FAB_SIZE - VIEWPORT_MARGIN),
    top: clamp(pos.top, VIEWPORT_MARGIN, window.innerHeight - FAB_SIZE - VIEWPORT_MARGIN),
  };
}

function getPanelLayout(fabPos, isMobile) {
  if (typeof window === 'undefined') {
    return { left: 12, top: 80, width: 360, maxHeight: MOBILE_PANEL_MAX_H };
  }

  const width = isMobile
    ? Math.min(360, window.innerWidth - VIEWPORT_MARGIN * 2)
    : Math.min(400, window.innerWidth - VIEWPORT_MARGIN * 2);
  const maxHeight = isMobile
    ? Math.min(window.innerHeight * MOBILE_PANEL_VH, MOBILE_PANEL_MAX_H)
    : Math.min(window.innerHeight * 0.8, PANEL_MAX_H);

  let left = fabPos.left + FAB_SIZE / 2 - width / 2;
  left = clamp(left, VIEWPORT_MARGIN, window.innerWidth - width - VIEWPORT_MARGIN);

  let top = fabPos.top - maxHeight - 12;
  if (top < VIEWPORT_MARGIN) {
    top = fabPos.top + FAB_SIZE + 12;
  }
  top = clamp(top, VIEWPORT_MARGIN, window.innerHeight - maxHeight - VIEWPORT_MARGIN);

  return { left, top, width, maxHeight };
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
            className="h-full w-full object-cover"
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

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: GREETING, isBot: true, isMarkdown: true }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [fabPos, setFabPos] = useState(loadFabPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [panelLayout, setPanelLayout] = useState(() =>
    getPanelLayout(
      loadFabPosition(),
      typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT,
    ),
  );
  const [showMobileNudge, setShowMobileNudge] = useState(false);
  const [lastAnnounced, setLastAnnounced] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const replyTimeoutRef = useRef(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
  });

  const persistPosition = useCallback((pos) => {
    const clamped = clampFabPosition(pos);
    try {
      localStorage.setItem(POSITION_KEY, JSON.stringify(clamped));
    } catch {
      /* ignore */
    }
    return clamped;
  }, []);

  const updateFabPos = useCallback((next) => {
    setFabPos((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      return clampFabPosition(resolved);
    });
  }, []);

  useEffect(() => {
    setPanelLayout(getPanelLayout(fabPos, isMobile));
  }, [fabPos, isOpen, isMobile]);

  useEffect(() => {
    const onResize = () => {
      setFabPos((prev) => persistPosition(prev));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [persistPosition]);

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

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const maybeShow = () => {
      if (!mq.matches || isOpen) {
        setShowMobileNudge(false);
        return;
      }
      try {
        if (sessionStorage.getItem(MOBILE_NUDGE_KEY) === '1') return;
      } catch {
        /* ignore */
      }
      setShowMobileNudge(true);
    };
    maybeShow();
    mq.addEventListener('change', maybeShow);
    return () => mq.removeEventListener('change', maybeShow);
  }, [isOpen]);

  useEffect(() => {
    if (!showMobileNudge) return undefined;
    const t = window.setTimeout(() => {
      setShowMobileNudge(false);
      try {
        sessionStorage.setItem(MOBILE_NUDGE_KEY, '1');
      } catch {
        /* ignore */
      }
    }, MOBILE_NUDGE_MS);
    return () => window.clearTimeout(t);
  }, [showMobileNudge]);

  const dismissMobileNudge = useCallback(() => {
    setShowMobileNudge(false);
    try {
      sessionStorage.setItem(MOBILE_NUDGE_KEY, '1');
    } catch {
      /* ignore */
    }
  }, []);

  const onFabPointerDown = (e) => {
    if (e.button !== 0 || isOpen) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: fabPos.left,
      startTop: fabPos.top,
    };
    setIsDragging(true);
  };

  const onFabPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (!dragRef.current.moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      dragRef.current.moved = true;
    }
    if (dragRef.current.moved) {
      updateFabPos({
        left: dragRef.current.startLeft + dx,
        top: dragRef.current.startTop + dy,
      });
    }
  };

  const onFabPointerUp = (e) => {
    if (!dragRef.current.active) return;
    const wasDrag = dragRef.current.moved;
    dragRef.current.active = false;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    setFabPos((prev) => persistPosition(prev));
    if (!wasDrag) {
      dismissMobileNudge();
      setIsOpen(true);
    }
  };

  const onFabPointerCancel = () => {
    dragRef.current.active = false;
    dragRef.current.moved = false;
    setIsDragging(false);
    setFabPos((prev) => persistPosition(prev));
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

  const showFab = !isOpen;
  const showHint = showFab && !isDragging;
  const showCompactMobileNudge = showHint && showMobileNudge;
  const canSend = input.trim().length > 0 && !isTyping;
  const panelClass = isMobile ? 'mm-munibot-panel mm-munibot-panel--mobile' : 'mm-munibot-panel';

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mm-munibot-backdrop fixed inset-0 z-[9998] cursor-default"
            aria-label="Close chat"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {showFab && (
        <div
          className="fixed z-[9998] touch-none select-none"
          style={{ left: fabPos.left, top: fabPos.top, width: FAB_SIZE, height: FAB_SIZE }}
        >
          <AnimatePresence>
            {showCompactMobileNudge && (
              <motion.span
                initial={{ opacity: 0, y: 4, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.92 }}
                transition={{ duration: 0.25 }}
                className="mm-munibot-fab-hint-mobile pointer-events-none absolute bottom-full left-1/2 z-[1] mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold tracking-tight shadow-lg ring-2 ring-white/20 sm:hidden"
                aria-hidden
              >
                Ask MuniBot
              </motion.span>
            )}
          </AnimatePresence>

          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={
                reduceMotion
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 1, y: [0, -4, 0], scale: 1 }
              }
              transition={
                reduceMotion
                  ? { delay: 0.9, duration: 0.45 }
                  : {
                      opacity: { delay: 0.9, duration: 0.45 },
                      scale: { delay: 0.9, duration: 0.45 },
                      y: { delay: 1.35, duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
                    }
              }
              className="pointer-events-none absolute bottom-full right-0 mb-2 hidden whitespace-nowrap sm:block sm:mb-2.5"
              aria-hidden
            >
              <div className="mm-munibot-fab-hint relative inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3 backdrop-blur-sm">
                <span className="mm-munibot-fab-hint__accent relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full shadow-sm">
                  <Sparkles className="h-3 w-3 text-white" strokeWidth={2.25} aria-hidden />
                  <span className="absolute -right-px -top-px h-1.5 w-1.5 rounded-full border border-white bg-emerald-400" />
                </span>
                <span className="text-xs font-bold tracking-tight">Ask MuniBot</span>
              </div>
            </motion.div>
          )}

          <motion.button
            type="button"
            onPointerDown={onFabPointerDown}
            onPointerMove={onFabPointerMove}
            onPointerUp={onFabPointerUp}
            onPointerCancel={onFabPointerCancel}
            className={`mm-munibot-fab relative flex h-14 w-14 items-center justify-center rounded-2xl text-white ${
              isDragging ? 'mm-munibot-fab--dragging cursor-grabbing scale-[1.02]' : 'cursor-grab'
            }`}
            style={{ touchAction: 'none' }}
            whileHover={isDragging ? undefined : { scale: 1.05 }}
            whileTap={isDragging ? undefined : { scale: 0.98 }}
            aria-label="Open MuniBot chat"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
          >
            <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl">
              <img
                src={LOGO_SRC}
                alt=""
                className="h-10 w-10 rounded-full object-cover ring-2 ring-white/50"
                width={40}
                height={40}
                draggable={false}
              />
            </span>
            <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/80 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
            </span>
          </motion.button>
        </div>
      )}

      <div id={liveRegionId} className="sr-only" aria-live="polite" aria-atomic="true">
        {isTyping ? 'MuniBot is typing' : lastAnnounced}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className={`${panelClass} fixed z-[9999] flex flex-col overflow-hidden`}
            style={{
              left: panelLayout.left,
              top: panelLayout.top,
              width: panelLayout.width,
              height: panelLayout.maxHeight,
            }}
            role="dialog"
            aria-modal="true"
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
    </>
  );
}
