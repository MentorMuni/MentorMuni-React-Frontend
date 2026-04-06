import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  RotateCcw,
  Loader2,
  MessageSquare,
  Check,
  UserRound,
  GraduationCap,
  Clock,
  Shield,
} from 'lucide-react';
import { API_BASE } from '../config';
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF, MISSION_TAGLINE } from '../constants/brandCopy';

const easeOut = [0.22, 1, 0.36, 1];

const FadeUp = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : reduceMotion ? {} : { opacity: 0, y: 22 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
};

const inputBase =
  'w-full rounded-xl border bg-white px-4 py-3 text-[0.9375rem] text-foreground shadow-sm transition-[box-shadow,border-color] duration-200 outline-none placeholder:text-muted-foreground';

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
  const reduceMotion = useReducedMotion();

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
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (formData.phone.replace(/[^\d]/g, '').length < 10)
      newErrors.phone = 'Phone must be at least 10 digits';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const response = await fetch(`${API_BASE}/contact/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = response.ok ? await response.json().catch(() => ({})) : null;

      if (response.ok && data?.success !== false) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! A MentorMuni counselor will reach out shortly.',
        });
        handleReset();
      } else {
        const msg =
          data?.message ||
          (response.status === 404
            ? 'Contact endpoint not configured on server. Please email us at hello@mentormuni.com'
            : 'Failed to send message. Please try again or email us at hello@mentormuni.com');
        setSubmitStatus({ type: 'error', message: msg });
      }
    } catch (err) {
      const isCorsOrNetwork =
        err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError');
      setSubmitStatus({
        type: 'error',
        message: isCorsOrNetwork
          ? 'Cannot reach server (check CORS and network). Please email us at hello@mentormuni.com'
          : 'Failed to send message. Please try again or email us at hello@mentormuni.com',
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
        ? 'border-rose-400/90 ring-2 ring-rose-100 focus:border-rose-500'
        : 'border-border focus:border-[#FFB347] focus:ring-2 focus:ring-[#FF9500]/25'
    }`;

  const linkClass =
    'font-semibold text-[#1A6FC4] underline decoration-[#1A6FC4]/35 underline-offset-2 transition hover:text-[#155a9e]';

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
        'Share your background, goals, and timeline. We route every enquiry to the right counselor.',
      submit: 'Submit enquiry',
      placeholders: {
        name: 'Your full name',
        email: 'you@email.com',
        phone: '+91 …',
        message: 'How can we help? Target companies, skills, and urgency help us respond faster.',
      },
    },
    colleges: {
      title: 'Partnership enquiry',
      description:
        'Include institution name, your role, approximate batch size, placement season, and any programs you want (e.g. leadership board, readiness sprint).',
      submit: 'Submit partnership enquiry',
      placeholders: {
        name: 'Your name and title (e.g. TPO)',
        email: 'official.institution@domain.edu',
        phone: 'Direct line or department number',
        message:
          'College name, cohort size, key dates, and what you want to pilot—we will reply with a short call plan.',
      },
    },
  };

  const hero = {
    students: {
      eyebrow: 'Contact · Students & learners',
      title: 'Tell us what you are working toward',
      subtitle: MISSION_TAGLINE,
    },
    colleges: {
      eyebrow: 'Contact · Colleges & TPOs',
      title: 'Partnership and campus programs',
      subtitle:
        'We work with placement teams on cohort readiness, leadership board and competition formats, and optional bulk mentorship. Share your context and we will respond with a concise next step—usually a short discovery call.',
    },
  }[audience];

  const fc = formLabels[audience];

  const faqItems = [
    {
      q: 'How soon will I hear back?',
      a: (
        <>
          We aim to reply within 24 hours on business days (IST). For urgent questions, call{' '}
          <a href={CONTACT_PHONE_HREF} className={linkClass}>
            {CONTACT_PHONE_DISPLAY}
          </a>{' '}
          Mon–Fri, 9am–6pm IST—or leave a note in the form and we will route it to the right person.
        </>
      ),
    },
    {
      q: 'Can I try MentorMuni before paying for mentorship?',
      a: (
        <>
          Yes. Start with the free Interview Readiness Score (~5 minutes) to see your gaps by topic, then use tools like the Resume ATS checker and AI mock interviews on the free tier. When you are ready for paid mentorship or cohort support, reach out through this form—we will walk you through the next steps.
        </>
      ),
    },
    {
      q: 'Do you guarantee a job or offer refunds if I am not placed?',
      a: (
        <>
          We do not guarantee placement and we do not offer refunds on that basis—no programme can honestly promise an offer. What we promise is to stay with you: mentorship and placement support continue until you get placed, as part of the paid programme. What is included and how fees work are shared when you speak with our team—use the form above to get started.
        </>
      ),
    },
    {
      q: 'What makes MentorMuni different from YouTube and LeetCode?',
      a: 'YouTube cannot surface your specific interview gaps. LeetCode alone does not prepare you for HR rounds, salary conversations, or referrals. MentorMuni combines a real readiness score, AI practice, and mentors who have cleared the kinds of interviews you are targeting—so you fix what matters first, not everything at once.',
    },
    {
      q: 'Do you work with employers or campuses?',
      a: (
        <>
          We partner with hiring teams and colleges. Recruiters should start on{' '}
          <Link to="/for-recruiters" className={linkClass}>
            For Recruiters
          </Link>
          . Colleges &amp; TPOs:{' '}
          <Link to="/colleges" className={linkClass}>
            For Colleges
          </Link>
          . This contact form is for students, learners, and campus enquiries.
        </>
      ),
    },
  ];

  const whyReachOutTitle = {
    students: 'Why learners contact us',
    colleges: 'What we discuss with institutions',
  }[audience];

  const formAccentClass = {
    students: 'border-l-[#FF9500]',
    colleges: 'border-l-[#1A6FC4]',
  }[audience];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAFAF8] text-muted-foreground">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-neutral-300/20 blur-3xl" />
        <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-[#1A6FC4]/8 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-[120%] -translate-x-1/2 rounded-[100%] bg-gradient-to-t from-[#FFFDF8] to-transparent blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-6 sm:pt-16 md:pb-28">
        <div className="mx-auto mb-10 max-w-3xl">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            I am reaching out as
          </p>
          <div className="flex flex-col gap-2 rounded-2xl border border-neutral-200/90 bg-white p-1.5 shadow-sm sm:flex-row sm:rounded-xl">
            {AUDIENCES.map(({ id, label, short, Icon }) => {
              const active = audience === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectAudience(id)}
                  aria-pressed={active}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-all sm:px-4 ${
                    active
                      ? 'bg-foreground text-white shadow-md'
                      : 'text-muted-foreground hover:bg-neutral-50 hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-90" strokeWidth={2} aria-hidden />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{short}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-hint">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
              Response within 24h · business days (IST)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
              Enquiries routed to the right team
            </span>
          </div>
        </div>

        <motion.header
          className="mx-auto mb-12 max-w-3xl text-center md:mb-14"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: easeOut }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{hero.eyebrow}</p>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl leading-[1.08]">
            {hero.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {hero.subtitle}
          </p>
          {audience === 'students' && (
            <p className="mt-4 text-sm text-hint">
              Prefer to explore first?{' '}
              <Link to="/start-assessment" className={linkClass}>
                Take the free readiness assessment
              </Link>
            </p>
          )}
          {audience === 'colleges' && (
            <p className="mt-4 text-sm text-hint">
              <Link to="/colleges" className={linkClass}>
                College program overview
              </Link>
              <span className="mx-2 text-neutral-300">·</span>
              <Link to="/leadership-board" className={linkClass}>
                Leadership board
              </Link>
            </p>
          )}
        </motion.header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:gap-10 lg:items-start">
          <div className="space-y-6">
            <FadeUp>
              <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-muted-foreground">
                    <MessageSquare className="h-4 w-4" strokeWidth={2} aria-hidden />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">Direct channels</h2>
                </div>
                <ul className="space-y-5">
                  <li className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-muted-foreground">
                      <Mail className="h-[18px] w-[18px]" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email</p>
                      <a
                        href="mailto:hello@mentormuni.com"
                        className="mt-0.5 block text-[0.9375rem] font-semibold text-foreground transition hover:text-[#1A6FC4]"
                      >
                        hello@mentormuni.com
                      </a>
                      <p className="mt-0.5 text-sm text-hint">We respond within 24 hours on business days</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-muted-foreground">
                      <Phone className="h-[18px] w-[18px]" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Phone</p>
                      <a
                        href={CONTACT_PHONE_HREF}
                        className="mt-0.5 block text-[0.9375rem] font-semibold text-foreground transition hover:text-[#1A6FC4]"
                      >
                        {CONTACT_PHONE_DISPLAY}
                      </a>
                      <p className="mt-0.5 text-sm text-hint">Mon–Fri · 9am–6pm IST</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-muted-foreground">
                      <MapPin className="h-[18px] w-[18px]" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Registered office</p>
                      <p className="mt-0.5 text-[0.9375rem] font-semibold text-foreground">Bangalore, India</p>
                      <p className="mt-0.5 text-sm text-hint">Serving learners and partners globally</p>
                    </div>
                  </li>
                </ul>
              </div>
            </FadeUp>

            <FadeUp delay={0.08}>
              <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-base font-semibold text-foreground">{whyReachOutTitle}</h3>
                <ul className="space-y-3">
                  {whyReachOutLines[audience].map((line) => (
                    <li key={line} className="flex gap-3 text-sm leading-snug text-muted-foreground">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.05}>
            <motion.div
              key={audience}
              className={`rounded-2xl border border-neutral-200/90 border-l-4 ${formAccentClass} bg-white p-6 shadow-sm sm:p-8`}
              initial={reduceMotion ? false : { opacity: 0.96 }}
              transition={{ duration: 0.35 }}
            >
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-[1.35rem]">{fc.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{fc.description}</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-foreground">
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
                  <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-foreground">
                    {audience === 'colleges' ? 'Official or institutional email' : 'Email'}
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
                  <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-foreground">
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
                  <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-foreground">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={fc.placeholders.message}
                    rows={5}
                    className={`${fieldClass('message')} min-h-[8.5rem] resize-y`}
                  />
                  {errors.message && <p className="mt-1.5 text-sm font-medium text-rose-600">{errors.message}</p>}
                </div>

                {submitStatus.message && (
                  <motion.div
                    role="status"
                    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
                      submitStatus.type === 'success'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                        : 'border-rose-200 bg-rose-50 text-rose-900'
                    }`}
                  >
                    {submitStatus.type === 'success' ? (
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
                    ) : (
                      <span className="mt-0.5 shrink-0 font-bold text-rose-600" aria-hidden>
                        !
                      </span>
                    )}
                    <span>{submitStatus.message}</span>
                  </motion.div>
                )}

                <div className="flex flex-col gap-3 border-t border-neutral-100 pt-6 sm:flex-row">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-[0.9375rem] font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-55"
                    whileHover={reduceMotion || isSubmitting ? undefined : { scale: 1.005 }}
                    whileTap={reduceMotion || isSubmitting ? undefined : { scale: 0.995 }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                        Sending enquiry…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" aria-hidden />
                        {fc.submit}
                      </>
                    )}
                  </motion.button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3 text-[0.9375rem] font-semibold text-muted-foreground transition hover:border-neutral-300 hover:bg-neutral-50"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden />
                    Clear form
                  </button>
                </div>
              </form>
            </motion.div>
          </FadeUp>
        </div>

        {/* FAQ */}
        <FadeUp className="mt-16 md:mt-20">
          <div className="rounded-2xl border border-neutral-200/90 bg-white px-6 py-10 sm:px-10 sm:py-12">
            <h2 className="mb-2 text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Frequently asked questions
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-center text-sm text-hint">
              Quick answers for students and partners. For anything specific, use the form above.
            </p>
            <motion.ul
              className="grid gap-4 md:grid-cols-2 md:gap-5"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: reduceMotion ? 0 : 0.06 },
                },
              }}
            >
              {faqItems.map((item) => (
                <motion.li
                  key={item.q}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
                  }}
                  className="rounded-xl border border-neutral-200/80 bg-[#FAFAF8] p-5"
                >
                  <h3 className="mb-2 text-sm font-semibold text-foreground">{item.q}</h3>
                  <div className="text-sm leading-relaxed text-muted-foreground">{item.a}</div>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </FadeUp>
      </div>
    </div>
  );
};

export default ContactPage;
