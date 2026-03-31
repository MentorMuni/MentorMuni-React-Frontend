import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, RotateCcw, Loader2, MessageSquare, Check } from 'lucide-react';
import { API_BASE } from '../config';
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF } from '../constants/brandCopy';

const ContactPage = () => {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get('topic');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
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
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (formData.phone.replace(/[^\d]/g, '').length < 10) newErrors.phone = 'Phone must be at least 10 digits';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
          message: formData.message.trim()
        })
      });

      const data = response.ok ? await response.json().catch(() => ({})) : null;

      if (response.ok && (data?.success !== false)) {
        setSubmitStatus({
          type: 'success',
          message: '✅ Thank you! A MentorMuni counselor will reach out shortly.'
        });
        handleReset();
      } else {
        const msg = data?.message || (response.status === 404
          ? 'Contact endpoint not configured on server. Please email us at hello@mentormuni.com'
          : 'Failed to send message. Please try again or email us at hello@mentormuni.com');
        setSubmitStatus({ type: 'error', message: `⚠️ ${msg}` });
      }
    } catch (err) {
      const isCorsOrNetwork = err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError');
      setSubmitStatus({
        type: 'error',
        message: isCorsOrNetwork
          ? '⚠️ Cannot reach server (check CORS and network). Please email us at hello@mentormuni.com'
          : '⚠️ Failed to send message. Please try again or email us at hello@mentormuni.com'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', phone: '', message: '' });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare size={40} className="text-[#FF9500]" />
            <h1 className="text-5xl md:text-6xl font-black">Get in Touch</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Have questions? Our team is here to help. Reach out and let's start your journey toward your dream offer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur border border-[#E0DCCF] rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-8">Contact Information</h2>

              {/* Email */}
              <div className="flex gap-4 mb-8">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#FF9500]/20 border border-[#FF9500]/35">
                    <Mail size={24} className="text-[#FF9500]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Email</h3>
                  <p className="text-slate-300">hello@mentormuni.com</p>
                  <p className="text-slate-400 text-sm">We'll respond within 24 hours</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 mb-8">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-cyan-600/20 border border-cyan-500/30">
                    <Phone size={24} className="text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Phone</h3>
                  <a href={CONTACT_PHONE_HREF} className="text-slate-300 hover:text-[#FF9500] transition-colors">
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                  <p className="text-slate-400 text-sm">Mon-Fri, 9AM-6PM IST</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30">
                    <MapPin size={24} className="text-emerald-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Location</h3>
                  <p className="text-slate-300">Bangalore, India</p>
                  <p className="text-slate-400 text-sm">Serving students globally</p>
                </div>
              </div>
            </div>

            {/* Why Contact Us */}
            <div className="bg-white/5 backdrop-blur border border-[#E0DCCF] rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Why Contact MentorMuni?</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Check size={20} className="text-[#FF9500] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Expert guidance from industry professionals</span>
                </li>
                <li className="flex gap-3">
                  <Check size={20} className="text-[#FF9500] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Personalized learning paths for your goals</span>
                </li>
                <li className="flex gap-3">
                  <Check size={20} className="text-[#FF9500] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Flexible pricing and payment options</span>
                </li>
                <li className="flex gap-3">
                  <Check size={20} className="text-[#FF9500] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Free assessment and career counseling</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/5 backdrop-blur border border-[#E0DCCF] rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-8">Send us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-3">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${
                    errors.name
                      ? 'border-rose-500 bg-rose-500/10'
                      : 'border-[#E0DCCF] bg-white/5 focus:border-[#FFB347] focus:bg-white/10'
                  }`}
                />
                {errors.name && (
                  <p className="text-rose-400 text-sm font-semibold mt-2">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-3">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${
                    errors.email
                      ? 'border-rose-500 bg-rose-500/10'
                      : 'border-[#E0DCCF] bg-white/5 focus:border-[#FFB347] focus:bg-white/10'
                  }`}
                />
                {errors.email && (
                  <p className="text-rose-400 text-sm font-semibold mt-2">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold mb-3">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 00000 00000"
                  className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${
                    errors.phone
                      ? 'border-rose-500 bg-rose-500/10'
                      : 'border-[#E0DCCF] bg-white/5 focus:border-[#FFB347] focus:bg-white/10'
                  }`}
                />
                {errors.phone && (
                  <p className="text-rose-400 text-sm font-semibold mt-2">{errors.phone}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold mb-3">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help..."
                  rows="5"
                  className={`w-full px-4 py-3 rounded-xl border transition-all outline-none resize-none ${
                    errors.message
                      ? 'border-rose-500 bg-rose-500/10'
                      : 'border-[#E0DCCF] bg-white/5 focus:border-[#FFB347] focus:bg-white/10'
                  }`}
                />
                {errors.message && (
                  <p className="text-rose-400 text-sm font-semibold mt-2">{errors.message}</p>
                )}
              </div>

              {/* Status Message */}
              {submitStatus.message && (
                <div
                  className={`p-4 rounded-xl border ${
                    submitStatus.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-[#FF9500] to-cyan-600 hover:from-[#E88600] hover:to-cyan-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 bg-white/10 hover:bg-white/20 border border-[#E0DCCF] text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} />
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 bg-white/5 backdrop-blur border border-[#E0DCCF] rounded-3xl p-12">
          <h2 className="text-3xl font-black mb-12 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-3 text-[#FF9500]">How quickly will I get a response?</h3>
              <p className="text-slate-300">
                We typically respond to all inquiries within 24 hours during business days. For urgent matters, call us directly.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 text-[#FF9500]">What is your refund policy?</h3>
              <p className="text-slate-300">
                We offer a 7-day money-back guarantee on all paid plans. No questions asked if you're not satisfied.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 text-[#FF9500]">Do you offer corporate training?</h3>
              <p className="text-slate-300">
                Yes! We provide custom training solutions for companies. Contact our enterprise team for details.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 text-[#FF9500]">Can I schedule a demo?</h3>
              <p className="text-slate-300">
                Absolutely. Use the contact form above or call us to schedule a personalized demo of our platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
