import { useState } from 'react';
import GlassCard from '../../components/GlassCard';
import ScrollReveal from '../../components/ScrollReveal';
import AnimatedButton from '../../components/AnimatedButton';
import SocialLinks from '../../components/SocialLinks';
import { supabase } from '../../lib/supabase';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors = { name: '', email: '', message: '' };
    let isValid = true;

    if (!form.name.trim()) {
      newErrors.name = 'Name is required.';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!form.message.trim()) {
      newErrors.message = 'Message is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (validate()) {
      setIsSubmitting(true);
      try {
        const { error } = await supabase.from('contact_messages').insert({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim()
        });

        if (error) {
          setSubmitError(error.message || 'Failed to submit message.');
        } else {
          setIsSuccess(true);
          setForm({ name: '', email: '', message: '' });
          setErrors({ name: '', email: '', message: '' });
        }
      } catch (err: any) {
        setSubmitError(err?.message || 'An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (submitError) {
      setSubmitError('');
    }
  };

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header Section matching Image 2 */}
      <ScrollReveal>
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          {/* Glowing Mail Icon Badge */}
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-cyan-500/10">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>

          {/* Subtitle Badge */}
          <p className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            — GET IN TOUCH —
          </p>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
            Let's Work Together
          </h1>

          {/* Paragraph */}
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-mono max-w-xl mx-auto">
            Whether you have an opportunity, a project idea, or just want to connect – We would love to hear from you. Fill out the form and we will get back to you as soon as possible.
          </p>
        </div>
      </ScrollReveal>

      {/* Contact Details Card matching Image 2 (Excluding University) */}
      <ScrollReveal delay={0.1}>
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-2xl shadow-black/50 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">EMAIL</p>
                <a
                  href="mailto:ganiduudage@gmail.com"
                  className="text-sm font-semibold text-white font-mono hover:text-cyan-400 transition-colors block truncate mt-1"
                >
                  ganiduudage@gmail.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">PHONE</p>
                <a
                  href="tel:0717441420"
                  className="text-sm font-semibold text-white font-mono hover:text-cyan-400 transition-colors block truncate mt-1"
                >
                  071-7441420
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">LOCATION</p>
                <p className="text-sm font-semibold text-white font-mono mt-1 leading-snug">
                  Pitipana, Homagama, Sri Lanka
                </p>
              </div>
            </div>
          </div>

          {/* Social Links inside the card footer */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400 font-mono">Connect on social media:</span>
            <SocialLinks />
          </div>
        </div>
      </ScrollReveal>

      {/* Inquiry Form */}
      <div className="max-w-xl mx-auto">
        <ScrollReveal delay={0.2}>
          <GlassCard className="p-8 border border-white/5 bg-slate-900/10 text-left">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Send Us a Direct Message</h3>

            {isSuccess ? (
              <div className="space-y-6 py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto border border-emerald-500/20 text-2xl">
                  ✓
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Message Sent Successfully!</h3>
                  <p className="text-slate-400 text-sm">
                    Thank you for reaching out. A Codewave representative will review your message shortly.
                  </p>
                </div>
                <AnimatedButton onClick={() => setIsSuccess(false)} variant="glass" className="mx-auto px-8">
                  Send Another Message
                </AnimatedButton>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitError && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm break-words">
                    <strong>Error submitting form:</strong> {submitError}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`mt-2 block w-full px-4 py-3 bg-slate-950 border rounded-lg text-sm text-white focus:outline-none focus:border-primary transition-colors ${
                      errors.name ? 'border-red-500/50' : 'border-slate-800'
                    }`}
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    value={form.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`mt-2 block w-full px-4 py-3 bg-slate-950 border rounded-lg text-sm text-white focus:outline-none focus:border-primary transition-colors ${
                      errors.email ? 'border-red-500/50' : 'border-slate-800'
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`mt-2 block w-full px-4 py-3 bg-slate-950 border rounded-lg text-sm text-white focus:outline-none focus:border-primary transition-colors h-32 ${
                      errors.message ? 'border-red-500/50' : 'border-slate-800'
                    }`}
                    placeholder="Project details, timeline, or questions..."
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1.5">{errors.message}</p>}
                </div>

                <AnimatedButton
                  type="submit"
                  variant="primary"
                  className="w-full py-3 flex items-center justify-center gap-2 cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                </AnimatedButton>
              </form>
            )}
          </GlassCard>
        </ScrollReveal>
      </div>
    </div>
  );
}
