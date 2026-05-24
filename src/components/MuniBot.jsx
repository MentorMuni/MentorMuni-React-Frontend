import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMuniBotReply } from '../utils/munibotEngine';

const LOGO_SRC = `${import.meta.env.BASE_URL}mentormuni-logo.png`;
const POSITION_KEY = 'mm-munibot-position';
const MOBILE_NUDGE_KEY = 'mm-munibot-mobile-nudge-seen';
const MOBILE_NUDGE_MS = 4500;
const FAB_SIZE = 56;
const VIEWPORT_MARGIN = 12;
const DRAG_THRESHOLD = 6;
const PANEL_MAX_H = 540;

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

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
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

function getPanelLayout(fabPos) {
  if (typeof window === 'undefined') {
    return { left: 12, top: 80, width: 360, maxHeight: PANEL_MAX_H };
  }
  const width = Math.min(448, window.innerWidth - 24);
  const maxHeight = Math.min(window.innerHeight * 0.72, PANEL_MAX_H);
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
    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-white px-3 py-2.5 shadow-sm w-fit">
      <span
        className="h-2 w-2 rounded-full bg-[#1A8FC4] animate-bounce"
        style={{ animationDelay: '0ms' }}
      />
      <span
        className="h-2 w-2 rounded-full bg-[#1A8FC4] animate-bounce"
        style={{ animationDelay: '150ms' }}
      />
      <span
        className="h-2 w-2 rounded-full bg-[#1A8FC4] animate-bounce"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
}

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
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-white shadow-sm ring-2 ring-[#e0f0fa]">
          <img src={LOGO_SRC} alt="" className="h-full w-full object-cover" width={36} height={36} />
        </div>
      )}
      <div
        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
          isBot
            ? 'rounded-bl-md border border-border bg-white'
            : 'rounded-br-md bg-gradient-to-br from-[#1A8FC4] to-[#15799F] text-white'
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
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: GREETING, isBot: true, isMarkdown: true }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [fabPos, setFabPos] = useState(loadFabPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [panelLayout, setPanelLayout] = useState(() => getPanelLayout(loadFabPosition()));
  const [showMobileNudge, setShowMobileNudge] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
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

  const updateFabPos = useCallback(
    (next) => {
      setFabPos((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        return clampFabPosition(resolved);
      });
    },
    [],
  );

  useEffect(() => {
    setPanelLayout(getPanelLayout(fabPos));
  }, [fabPos, isOpen]);

  useEffect(() => {
    const onResize = () => {
      setFabPos((prev) => persistPosition(prev));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [persistPosition]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  /** Mobile: one short pill per session — FAB is the affordance; no large callout */
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mq = window.matchMedia('(max-width: 639px)');
    const maybeShow = () => {
      if (!mq.matches) {
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
  }, []);

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

  const goToReadiness = () => {
    navigate('/start-assessment');
    setIsOpen(false);
  };

  const goToContact = () => {
    navigate('/contact');
    setIsOpen(false);
  };

  const showHint = !isOpen && !isDragging;
  const showDesktopHint = showHint;
  const showCompactMobileNudge = showHint && showMobileNudge;

  return (
    <>
      {/* Draggable FAB anchor */}
      <div
        className="fixed z-[9998] touch-none select-none"
        style={{ left: fabPos.left, top: fabPos.top, width: FAB_SIZE, height: FAB_SIZE }}
      >
        {/* Mobile — tiny pill, auto-hides (~4.5s), once per session */}
        <AnimatePresence>
          {showCompactMobileNudge && (
            <motion.span
              initial={{ opacity: 0, y: 4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.92 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute bottom-full left-1/2 z-[1] mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-[#1A8FC4] to-[#2AAA8A] px-2.5 py-1 text-[10px] font-bold tracking-tight text-white shadow-[0_4px_14px_rgba(26,143,196,0.45)] ring-2 ring-white/90 sm:hidden"
              aria-hidden
            >
              Ask MuniBot
            </motion.span>
          )}
        </AnimatePresence>

        {/* Tablet/desktop — full callout; hidden on narrow phones */}
        {showDesktopHint && (
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
            <div className="relative inline-flex items-center gap-2 rounded-full border border-sky-200/90 bg-gradient-to-r from-white via-sky-50/95 to-cyan-50/90 py-1 pl-1 pr-3 shadow-[0_6px_20px_-4px_rgba(26,143,196,0.35)] ring-1 ring-[#1A8FC4]/15 backdrop-blur-sm">
              <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1A8FC4] to-[#2AAA8A] shadow-sm">
                <Sparkles className="h-3 w-3 text-white" strokeWidth={2.25} aria-hidden />
                <span className="absolute -right-px -top-px h-1.5 w-1.5 rounded-full border border-white bg-emerald-400" />
              </span>
              <span className="bg-gradient-to-r from-[#0e5e85] via-[#1A8FC4] to-[#2AAA8A] bg-clip-text text-xs font-bold tracking-tight text-transparent">
                Ask MuniBot
              </span>
              <span
                className="absolute -bottom-1 right-5 h-2 w-2 rotate-45 border-b border-r border-sky-200/90 bg-gradient-to-br from-white to-cyan-50"
                aria-hidden
              />
            </div>
          </motion.div>
        )}

        <motion.button
          type="button"
          onPointerDown={onFabPointerDown}
          onPointerMove={onFabPointerMove}
          onPointerUp={onFabPointerUp}
          onPointerCancel={onFabPointerCancel}
          className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white/90 text-white shadow-xl focus:outline-none focus:ring-4 focus:ring-[#1A8FC4]/35 ${
            isDragging ? 'cursor-grabbing scale-[1.02]' : 'cursor-grab'
          }`}
          style={{
            background: 'linear-gradient(135deg, #1A8FC4 0%, #15799F 50%, #0d5f7f 100%)',
            boxShadow: isDragging
              ? '0 16px 48px -8px rgba(26, 143, 196, 0.55)'
              : '0 10px 40px -10px rgba(26, 143, 196, 0.45)',
            touchAction: 'none',
          }}
          whileHover={isDragging ? undefined : { scale: 1.05 }}
          whileTap={isDragging ? undefined : { scale: 0.98 }}
          aria-label="Open MuniBot chat"
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed z-[9999] flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
            style={{
              left: panelLayout.left,
              top: panelLayout.top,
              width: panelLayout.width,
              height: panelLayout.maxHeight,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(26,143,196,0.08)',
            }}
            role="dialog"
            aria-label="MuniBot chat"
          >
            <div className="flex items-center justify-between border-b border-border bg-background px-3 py-2.5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-white shadow-sm ring-2 ring-[#2AAA8A]/25">
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
                        className="rounded-full border border-border bg-white px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition hover:border-[#2AAA8A] hover:bg-[#e0f0fa] hover:text-[#15799F]"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2 border-t border-border bg-white/90 px-3 py-2">
              <button
                type="button"
                onClick={goToReadiness}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#FF9500] py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#15799F]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Readiness
              </button>
              <button
                type="button"
                onClick={goToContact}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-border bg-background py-2.5 text-xs font-bold text-muted-foreground transition hover:border-[#2AAA8A]"
              >
                Contact
              </button>
            </div>

            <div className="flex gap-2 bg-white px-3 pb-3 pt-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about MentorMuni, interviews, AI…"
                className="min-w-0 flex-1 rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#2AAA8A] focus:outline-none focus:ring-2 focus:ring-[#1A8FC4]/25"
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                className="shrink-0 rounded-xl bg-[#FF9500] p-2.5 text-white transition hover:bg-[#15799F] disabled:opacity-50"
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
