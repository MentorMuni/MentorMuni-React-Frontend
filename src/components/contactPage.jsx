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
  Sparkles,
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
  'w-full rounded-2xl border bg-white px-4 py-3.5 text-[#1a1a1a] shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-[box-shadow,border-color,transform] duration-200 outline-none placeholder:text-neutral-400';

const ContactPage = () => {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get('topic');
  const reduceMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    if (topic !== 'recruiters') return;
    setFormData((prev) => {
      if (prev.message.trim()) return prev;
      return {
        ...prev,
        message:
          "Hello — I'm reaching out from the For Recruiters page. I'd like to discuss hiring / partnership.",
      };
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
        : 'border-[#E0DCCF] focus:border-[#FFB347] focus:ring-2 focus:ring-[#FF9500]/25'
    }`;

  const linkClass =
    'font-semibold text-[#FF9500] underline decoration-[#FF9500]/30 underline-offset-2 transition hover:text-[#E88600]';

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
          We partner with hiring teams and colleges. If you are a recruiter or institution, see{' '}
          <Link to="/for-recruiters" className={linkClass}>
            For Recruiters
          </Link>{' '}
          or use this form—we will connect you with the right contact.
        </>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFFDF8] text-[#1a1a1a]">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#FF9500]/12 blur-3xl" />
        <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-[120%] -translate-x-1/2 rounded-[100%] bg-gradient-to-t from-[#FFF4E6]/80 to-transparent blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-6 sm:pt-20 md:pb-28">
        {/* Hero */}
        <motion.header
          className="mx-auto mb-14 max-w-3xl text-center md:mb-16"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: easeOut }}
        >
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E0DCCF] bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600 shadow-[0_2px_12px_-4px_rgba(255,149,0,0.18)]"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.08, duration: 0.45, ease: easeOut }}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#FF9500]" aria-hidden />
            We reply within 24h · IST
          </motion.div>
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E0DCCF] bg-gradient-to-br from-white to-[#FFF8EE] shadow-[0_8px_24px_-12px_rgba(255,149,0,0.35)]">
              <MessageSquare className="h-6 w-6 text-[#FF9500]" strokeWidth={2} />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-[#111] sm:text-5xl md:text-6xl">
              Get in touch
            </h1>
          </div>
          <p className="mx-auto text-lg leading-relaxed text-neutral-600 md:text-xl">
            {MISSION_TAGLINE}
          </p>
          <p className="mt-3 text-sm text-neutral-500">
            Prefer to explore first?{' '}
            <Link
              to="/interview-ready"
              className="font-semibold text-[#FF9500] underline decoration-[#FF9500]/30 underline-offset-2 transition hover:text-[#E88600]"
            >
              See how readiness scoring works
            </Link>
          </p>
        </motion.header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
          {/* Left column */}
          <div className="space-y-6">
            <FadeUp>
              <motion.div
                className="rounded-3xl border border-[#E0DCCF] bg-white/90 p-7 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.12)] backdrop-blur-sm"
                whileHover={reduceMotion ? undefined : { y: -2 }}
                transition={{ duration: 0.22 }}
              >
                <h2 className="mb-6 text-xl font-bold text-[#111]">Contact information</h2>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#FFE0B8] bg-gradient-to-br from-[#FFF4E6] to-white">
                      <Mail className="h-5 w-5 text-[#FF9500]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                        Email
                      </p>
                      <a
                        href="mailto:hello@mentormuni.com"
                        className="font-semibold text-[#111] transition hover:text-[#FF9500]"
                      >
                        hello@mentormuni.com
                      </a>
                      <p className="mt-0.5 text-sm text-neutral-500">We respond within 24 hours</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/80 bg-gradient-to-br from-cyan-50 to-white">
                      <Phone className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                        Phone
                      </p>
                      <a
                        href={CONTACT_PHONE_HREF}
                        className="font-semibold text-[#111] transition hover:text-[#FF9500]"
                      >
                        {CONTACT_PHONE_DISPLAY}
                      </a>
                      <p className="mt-0.5 text-sm text-neutral-500">Mon–Fri · 9am–6pm IST</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                        Location
                      </p>
                      <p className="font-semibold text-[#111]">Bangalore, India</p>
                      <p className="mt-0.5 text-sm text-neutral-500">Serving students globally</p>
                    </div>
                  </li>
                </ul>
              </motion.div>
            </FadeUp>

            <FadeUp delay={0.08}>
              <div className="rounded-3xl border border-[#E0DCCF] bg-gradient-to-br from-[#FFFCF7] to-white p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <h3 className="mb-5 text-lg font-bold text-[#111]">Why reach out?</h3>
                <ul className="space-y-3.5">
                  {[
                    'Guidance from industry mentors',
                    'Clear gaps and what to fix first',
                    'Flexible plans and payment options',
                    'Free assessment and counseling',
                  ].map((line) => (
                    <li key={line} className="flex gap-3 text-neutral-700">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FF9500]/15">
                        <Check className="h-3.5 w-3.5 text-[#E88600]" strokeWidth={3} />
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>

          {/* Form */}
          <FadeUp delay={0.05}>
            <motion.div
              className="rounded-3xl border border-[#E0DCCF] bg-white p-7 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.14)] sm:p-8"
              initial={reduceMotion ? false : { opacity: 0.98 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="mb-2 text-2xl font-bold text-[#111]">Send a message</h2>
              <p className="mb-8 text-sm text-neutral-500">
                Share a bit about your goals—we will route you to the right counselor.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-[#333]">
                    Full name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    placeholder="Your name"
                    className={fieldClass('name')}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm font-medium text-rose-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-[#333]">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    placeholder="you@university.edu"
                    className={fieldClass('email')}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm font-medium text-rose-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-phone" className="mb-2 block text-sm font-semibold text-[#333]">
                    Phone
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    placeholder="+91 00000 00000"
                    className={fieldClass('phone')}
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm font-medium text-rose-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-[#333]">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    rows={5}
                    className={`${fieldClass('message')} resize-none`}
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm font-medium text-rose-600">{errors.message}</p>
                  )}
                </div>

                {submitStatus.message && (
                  <motion.div
                    role="status"
                    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${
                      submitStatus.type === 'success'
                        ? 'border-emerald-200 bg-emerald-50/90 text-emerald-900'
                        : 'border-rose-200 bg-rose-50/90 text-rose-900'
                    }`}
                  >
                    {submitStatus.type === 'success' ? (
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    ) : (
                      <span className="mt-0.5 shrink-0 font-bold text-rose-600">!</span>
                    )}
                    <span>{submitStatus.message}</span>
                  </motion.div>
                )}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-3">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF9500] to-[#E88600] px-6 py-3.5 text-base font-bold text-white shadow-[0_12px_28px_-8px_rgba(255,149,0,0.45)] transition hover:from-[#E88600] hover:to-[#D67A00] disabled:cursor-not-allowed disabled:opacity-55"
                    whileHover={reduceMotion || isSubmitting ? undefined : { scale: 1.01 }}
                    whileTap={reduceMotion || isSubmitting ? undefined : { scale: 0.99 }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send message
                      </>
                    )}
                  </motion.button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E0DCCF] bg-[#FFFDF8] px-6 py-3.5 text-base font-bold text-[#444] transition hover:border-[#D4CFC0] hover:bg-white"
                  >
                    <RotateCcw className="h-5 w-5" />
                    Clear
                  </button>
                </div>
              </form>
            </motion.div>
          </FadeUp>
        </div>

        {/* FAQ */}
        <FadeUp className="mt-16 md:mt-20">
          <div className="rounded-3xl border border-[#E0DCCF] bg-gradient-to-b from-white to-[#FFFCF7] px-6 py-10 sm:px-10 sm:py-12">
            <h2 className="mb-10 text-center text-2xl font-black tracking-tight text-[#111] md:text-3xl">
              Frequently asked questions
            </h2>
            <motion.ul
              className="grid gap-6 md:grid-cols-2 md:gap-8"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: reduceMotion ? 0 : 0.08 },
                },
              }}
            >
              {faqItems.map((item) => (
                <motion.li
                  key={item.q}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
                  }}
                  className="rounded-2xl border border-[#F0EBE0] bg-white/80 p-5 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.08)]"
                >
                  <h3 className="mb-2 font-bold text-[#FF9500]">{item.q}</h3>
                  <p className="text-sm leading-relaxed text-neutral-600">{item.a}</p>
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
