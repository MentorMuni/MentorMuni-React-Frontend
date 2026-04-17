import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Send, RotateCcw, Loader2, UserRound, GraduationCap, Sparkles } from 'lucide-react';
import { INQUIRIES_URL } from '../config';
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF, MISSION_TAGLINE } from '../constants/brandCopy';

const easeOut = [0.22, 1, 0.36, 1];
const WORD_LIMIT = 50;
const wordCount = (value) => String(value || '').trim().split(/\s+/).filter(Boolean).length;
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
const isValidName = (value) => /^[A-Za-z][A-Za-z\s.'-]{1,}$/.test(String(value || '').trim());
const normalizeName = (value) => value.replace(/[^A-Za-z\s.'-]/g, '');
const normalizePhone = (value) => value.replace(/\D/g, '').slice(0, 10);

const FadeUp = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : reduceMotion ? {} : { opacity: 0, y: 16 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
};

const inputBase =
  'w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-[15px] text-foreground shadow-sm transition-[box-shadow,border-color] outline-none placeholder:text-muted-foreground focus:border-[#FFB347] focus:ring-2 focus:ring-[#FF9500]/20';

const AUDIENCES = [
  { id: 'students', param: null, label: 'Students & learners', short: 'Learners', Icon: UserRound },
  { id: 'colleges', param: 'colleges', label: 'Colleges & TPOs', short: 'Colleges', Icon: GraduationCap },
];

const audienceFromTopic = (topic) => {
  if (topic === 'colleges') return 'colleges';
  return 'students';
};

const MESSAGE_PREFILL_COLLEGES =
  "Hello — I'm reaching out from the For Colleges page (TPO/Placement). I'd like to discuss partnership: leadership board, bulk mentorship, and interview prep for our students. College:";

const isPartnerPrefillMessage = (raw) => {
  const m = (raw || '').trim();
  if (!m) return false;
  if (m === MESSAGE_PREFILL_COLLEGES.trim()) return true;
  if (m.startsWith("Hello — I'm reaching out from the For Colleges page")) return true;
  if (m.startsWith("Hello — I'm reaching out from the For Recruiters page")) return true;
  return false;
};

const ContactPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const topic = searchParams.get('topic');
  const audience = audienceFromTopic(topic);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    if (topic === 'recruiters') {
      setSearchParams({}, { replace: true });
    }
  }, [topic, setSearchParams]);

  useEffect(() => {
    const prefills = {
      colleges: MESSAGE_PREFILL_COLLEGES,
    };

    if (!topic) {
      setFormData((prev) => {
        if (!isPartnerPrefillMessage(prev.message)) return prev;
        return { ...prev, message: '' };
      });
      return;
    }

    const text = prefills[topic];
    if (!text) return;
    setFormData((prev) => {
      if (prev.message.trim()) return prev;
      return { ...prev, message: text };
    });
  }, [topic]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (!isValidName(formData.name)) newErrors.name = 'Enter a valid full name';
    else if (wordCount(formData.name) > WORD_LIMIT) newErrors.name = `Maximum ${WORD_LIMIT} words allowed`;
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!isValidEmail(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (formData.phone.length !== 10) newErrors.phone = 'Phone must be exactly 10 digits';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (wordCount(formData.message) > WORD_LIMIT) newErrors.message = `Maximum ${WORD_LIMIT} words allowed`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === 'phone' ? normalizePhone(value) : name === 'name' ? normalizeName(value) : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await fetch(INQUIRIES_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: 'contact',
          source: 'contact_page',
          submitted_at: new Date().toISOString(),
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          college: null,
          year: null,
          target_role: null,
          whatsapp_opt_in: null,
          message: formData.message.trim(),
          topic: topic || null,
          audience,
          score: null,
        }),
      });

      const data = response.ok ? await response.json().catch(() => ({})) : null;

      if (response.ok && data?.success !== false) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you. Our team will respond shortly.',
        });
        handleReset();
      } else {
        const msg =
          data?.message ||
          (response.status === 404
            ? 'Contact endpoint not configured on server. Please email hello@mentormuni.com'
            : 'Unable to send. Please try again or email hello@mentormuni.com');
        setSubmitStatus({ type: 'error', message: msg });
      }
    } catch (err) {
      const isCorsOrNetwork =
        err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError');
      setSubmitStatus({
        type: 'error',
        message: isCorsOrNetwork
          ? 'Cannot reach server. Please email hello@mentormuni.com'
          : 'Unable to send. Please try again or email hello@mentormuni.com',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', phone: '', message: '' });
    setErrors({});
  };

  const fieldClass = (name) =>
    `${inputBase} ${
      errors[name]
        ? 'border-rose-400/90 ring-2 ring-rose-100 focus:border-rose-500 focus:ring-rose-200/50'
        : ''
    }`;

  const linkClass =
    'font-semibold text-[#c2410c] underline decoration-[#FFB347]/55 underline-offset-[3px] transition hover:text-[#E88600]';

  const selectAudience = (id) => {
    if (id !== audience) {
      setFormData((prev) => ({ ...prev, message: '' }));
      setErrors((prev) => ({ ...prev, message: '' }));
    }
    if (id === 'students') {
      setSearchParams({});
      return;
    }
    if (id === 'colleges') {
      setSearchParams({ topic: 'colleges' });
    }
  };

  const whyReachOutLines = {
    students: [
      'Mentorship and placement guidance from industry mentors',
      'Readiness insight so you know what to fix first',
      'Flexible plans and clear next steps',
      'Complimentary assessment and counseling',
    ],
    colleges: [
      'Leadership board, readiness competitions, and cohort visibility',
      'Interview prep and tooling aligned with your placement calendar',
      'Bulk mentorship and economics scoped to batch size',
      'One partnerships contact for rollout, fairness, and governance',
    ],
  };

  const formLabels = {
    students: {
      title: 'Send a message',
      description:
        'Share your background, goals, and timeline. We route enquiries to the appropriate counselor.',
      submit: 'Submit enquiry',
      placeholders: {
        name: 'Full name',
        email: 'Work or personal email',
        phone: '+91 …',
        message: 'How can we help? Include goals, timeline, and urgency if relevant.',
      },
    },
    colleges: {
      title: 'Partnership enquiry',
      description:
        'Include institution name, your role, approximate batch size, placement season, and programs of interest.',
      submit: 'Submit partnership enquiry',
      placeholders: {
        name: 'Name and title',
        email: 'Official institutional email',
        phone: 'Direct or department line',
        message:
          'College name, cohort size, key dates, and what you would like to pilot.',
      },
    },
  };

  const hero = {
    students: {
      eyebrow: 'Contact',
      title: 'Get in touch',
      subtitle: MISSION_TAGLINE,
    },
    colleges: {
      eyebrow: 'Contact',
      title: 'Campus & partnership enquiries',
      subtitle:
        'We work with placement teams on cohort readiness, leadership board and competition formats, and optional bulk mentorship. We typically respond with a short discovery call.',
    },
  }[audience];

  const fc = formLabels[audience];

  const faqItems = [
    {
      q: 'How soon will I hear back?',
      a: (
        <>
          We aim to reply within 24 hours on business days (IST). For urgent matters, call{' '}
          <a href={CONTACT_PHONE_HREF} className={linkClass}>
            {CONTACT_PHONE_DISPLAY}
          </a>{' '}
          Mon–Fri, 9am–6pm IST.
        </>
      ),
    },
    {
      q: 'Can I try MentorMuni before paid mentorship?',
      a: (
        <>
          Yes. Start with the free Interview Readiness Score, then use resume and mock tools on the free tier. For paid mentorship or cohort support, use this form and we will outline next steps.
        </>
      ),
    },
    {
      q: 'Do you guarantee placement or offer refunds?',
      a: (
        <>
          We do not guarantee placement. Paid programme scope and fees are explained when you speak with our team—use the form to begin.
        </>
      ),
    },
    {
      q: 'What makes MentorMuni different from YouTube and LeetCode?',
      a: 'We combine a readiness score, AI practice, and mentors who understand the interviews you are targeting—so you prioritise what matters.',
    },
    {
      q: 'Do you work with employers or campuses?',
      a: (
        <>
          Recruiters:{' '}
          <Link to="/for-recruiters" className={linkClass}>
            For Recruiters
          </Link>
          . Colleges:{' '}
          <Link to="/colleges" className={linkClass}>
            For Colleges
          </Link>
          .
        </>
      ),
    },
  ];

  const whyReachOutTitle = {
    students: 'Common reasons to contact us',
    colleges: 'What we discuss with institutions',
  }[audience];

  return (
    <div className="min-h-screen bg-background text-muted-foreground">
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-b from-[#f8fbff] via-white to-[#fff8ee]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_75%_-15%,rgba(255,149,0,0.14),transparent)]" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_12%_45%,rgba(34,211,238,0.09),transparent)]" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-cyan-50/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-900">
                <Sparkles className="h-3.5 w-3.5 text-[#FF9500]" aria-hidden />
                AI-assisted routing
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#EA580C]">{hero.eyebrow}</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {hero.title}
              </h1>
              <p className="mt-3 text-base leading-relaxed sm:text-[17px]">{hero.subtitle}</p>
              {audience === 'students' && (
                <p className="mt-4 text-sm text-muted-foreground">
                  <Link to="/start-assessment" className={linkClass}>
                    Free readiness assessment
                  </Link>
                </p>
              )}
              {audience === 'colleges' && (
                <p className="mt-4 text-sm text-muted-foreground">
                  <Link to="/colleges" className={linkClass}>
                    Program overview
                  </Link>
                  <span className="mx-2 text-border">·</span>
                  <Link to="/leadership-board" className={linkClass}>
                    Leadership board
                  </Link>
                </p>
              )}
            </div>

            <div className="w-full max-w-md shrink-0 lg:max-w-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">I am contacting as</p>
              <div
                className="inline-flex w-full rounded-xl border border-border bg-white/90 p-1 shadow-sm backdrop-blur-sm"
                role="tablist"
                aria-label="Contact audience"
              >
                {AUDIENCES.map(({ id, label, short, Icon }) => {
                  const active = audience === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => selectAudience(id)}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                        active
                          ? 'bg-[#FF9500] text-white shadow-[0_4px_14px_rgba(255,149,0,0.35)]'
                          : 'text-muted-foreground hover:bg-[#FFF8EE]'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.75} aria-hidden />
                      <span className="hidden sm:inline">{label}</span>
                      <span className="sm:hidden">{short}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-hint">Response within one business day (IST), typically sooner.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-10">
            <FadeUp>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#EA580C]">Direct contact</h2>
                <ul className="mt-5 space-y-6 border-t border-border pt-6">
                  <li>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</p>
                    <a
                      href="mailto:hello@mentormuni.com"
                      className="mt-1 block text-[15px] font-semibold text-foreground transition hover:text-[#FF9500]"
                    >
                      hello@mentormuni.com
                    </a>
                  </li>
                  <li>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</p>
                    <a
                      href={CONTACT_PHONE_HREF}
                      className="mt-1 block text-[15px] font-semibold text-foreground transition hover:text-[#FF9500]"
                    >
                      {CONTACT_PHONE_DISPLAY}
                    </a>
                    <p className="mt-1 text-xs text-hint">Mon–Fri · 9am–6pm IST</p>
                  </li>
                  <li>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Office</p>
                    <p className="mt-1 text-[15px] font-semibold text-foreground">Bangalore, India</p>
                  </li>
                </ul>
              </div>
            </FadeUp>

            <FadeUp delay={0.06}>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#EA580C]">{whyReachOutTitle}</h2>
                <ul className="mt-5 space-y-3 border-t border-border pt-6 text-sm leading-relaxed">
                  {whyReachOutLines[audience].map((line, i) => (
                    <li key={line} className="flex gap-2.5">
                      <span
                        className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${i % 2 === 0 ? 'bg-[#FF9500]' : 'bg-cyan-500'}`}
                        aria-hidden
                      />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.04}>
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_8px_32px_rgba(15,23,42,0.06)]">
              <div className="border-b border-border bg-gradient-to-br from-[#FFF8EE] via-white to-cyan-50/40 px-6 py-4 sm:px-8">
                <h2 className="text-lg font-bold tracking-tight text-foreground">{fc.title}</h2>
                <p className="mt-1 text-sm leading-relaxed">{fc.description}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Full name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    placeholder={fc.placeholders.name}
                    className={fieldClass('name')}
                  />
                  {errors.name && <p className="mt-1.5 text-sm font-medium text-rose-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    placeholder={fc.placeholders.email}
                    className={fieldClass('email')}
                  />
                  {errors.email && <p className="mt-1.5 text-sm font-medium text-rose-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="contact-phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Phone
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    placeholder={fc.placeholders.phone}
                    className={fieldClass('phone')}
                  />
                  {errors.phone && <p className="mt-1.5 text-sm font-medium text-rose-600">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={fc.placeholders.message}
                    rows={5}
                    className={`${fieldClass('message')} min-h-[140px] resize-y`}
                  />
                  {errors.message && <p className="mt-1.5 text-sm font-medium text-rose-600">{errors.message}</p>}
                </div>

                {submitStatus.message && (
                  <div
                    role="status"
                    className={`rounded-xl border px-4 py-3 text-sm ${
                      submitStatus.type === 'success'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                        : 'border-rose-200 bg-rose-50 text-rose-900'
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex flex-1 min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-button)] transition hover:bg-[#E88600] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" strokeWidth={2} aria-hidden />
                        {fc.submit}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-[#FFB347] hover:bg-[#FFF8EE]"
                  >
                    <RotateCcw className="h-4 w-4" strokeWidth={2} aria-hidden />
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </FadeUp>
        </div>

        <FadeUp className="mt-16 rounded-2xl border border-border bg-[#FFFDF8] px-6 py-10 lg:mt-20 lg:px-10 lg:py-12">
          <h2 className="text-lg font-bold tracking-tight text-foreground">Frequently asked questions</h2>
          <p className="mt-1 text-sm text-muted-foreground">For anything specific, use the form above.</p>
          <ul className="mt-8 divide-y divide-border border-t border-border">
            {faqItems.map((item) => (
              <li key={item.q} className="py-6 first:pt-6">
                <h3 className="text-sm font-semibold text-foreground">{item.q}</h3>
                <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</div>
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>
    </div>
  );
};

export default ContactPage;
