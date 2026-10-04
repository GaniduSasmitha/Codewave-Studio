import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from '../../components/GlassCard';
import ScrollReveal from '../../components/ScrollReveal';
import AnimatedButton from '../../components/AnimatedButton';
import SocialLinks from '../../components/SocialLinks';
import ContactMascot from '../../components/ContactMascot';
import { supabase } from '../../lib/supabase';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const pkgParam = searchParams.get('package');

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [focusedField, setFocusedField] = useState<'name' | 'email' | 'message' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [legalConsent, setLegalConsent] = useState(false);

  useEffect(() => {
    if (pkgParam === 'custom') {
      setForm((prev) => ({
        ...prev,
        message: "Hi Codewave team, I would like to request a custom quote for a Web App / Custom Software project. Here are details about my project scope:"
      }));
    }
  }, [pkgParam]);

  const validate = () => {
    const newErrors = { name: '', email: '', message: '' };
    let isValid = true;

    if (!form.name.trim()) {
      newErrors.name = 'Name is required.';
      isValid = false;
    } else if (form.name.trim().length > 100) {
      newErrors.name = 'Name must be under 100 characters.';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (form.email.trim().length > 255) {
      newErrors.email = 'Email must be under 255 characters.';
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!form.message.trim()) {
      newErrors.message = 'Message is required.';
      isValid = false;
    } else if (form.message.trim().length > 2000) {
      newErrors.message = 'Message must be under 2000 characters.';
      isValid = false;
    }

    if (!legalConsent) {
      setSubmitError('You must agree to the Privacy Policy and Terms of Service before sending your message.');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // Client-side rate limiting / cooldown check (30 seconds)
    const lastSubmitted = localStorage.getItem('contact_last_submitted');
    if (lastSubmitted) {
      const elapsed = Date.now() - parseInt(lastSubmitted, 10);
      if (elapsed < 30000) {
        const remaining = Math.ceil((30000 - elapsed) / 1000);
        setSubmitError(`Please wait ${remaining} seconds before submitting another inquiry.`);
        return;
      }
    }

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
          localStorage.setItem('contact_last_submitted', Date.now().toString());
          setIsSuccess(true);
          setForm({ name: '', email: '', message: '' });
          setLegalConsent(false);
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
    <div className="font-roboto py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header Section */}
      <ScrollReveal>
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          {/* Glowing Mail Icon Badge with Continuous Idle Animation */}
          <motion.div
            animate={{
              rotate: [0, -3, 3, -3, 3, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatDelay: 2.5,
              ease: "easeInOut"
            }}
            className="w-16 h-16 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#0B132B] dark:text-[#F3C623] mx-auto shadow-lg shadow-[#D4AF37]/20"
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </motion.div>

          {/* Subtitle Badge */}
          <p className="text-xs uppercase tracking-widest text-[#1E3A5F] dark:text-[#8496B8] font-semibold">
            — GET IN TOUCH —
          </p>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0B132B] via-[#1E3A5F] to-[#D4AF37] dark:from-[#F3C623] dark:via-[#D4AF37] dark:to-[#F9E79F]">
            Let's Work Together
          </h1>

          {/* Paragraph */}
          <p className="text-[#1E3A5F] dark:text-[#8496B8] text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Whether you have an opportunity, a project idea, or just want to connect – We would love to hear from you. Fill out the form and we will get back to you as soon as possible.
          </p>
        </div>
      </ScrollReveal>

      {/* Contact Details Card */}
      <ScrollReveal delay={0.1}>
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl border border-[#CBD5E1] dark:border-[#1E3A5F] bg-white/90 dark:bg-[#131B2E] backdrop-blur-xl shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">

            {/* Email Icon Block */}
            <motion.div
              whileHover="hover"
              className="flex items-start gap-4 group"
            >
              <motion.div
                variants={{
                  hover: { scale: 1.1, y: -2 }
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#0B132B] dark:text-[#F3C623] flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-sm"
              >
                <motion.svg
                  className="w-5 h-5 relative z-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <motion.path
                    d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
                    variants={{
                      hover: { y: -1.5, scaleY: 0.8, opacity: 0.85 }
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                </motion.svg>
              </motion.div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-[#1E3A5F] dark:text-[#8496B8] uppercase tracking-widest">EMAIL</p>
                <a
                  href="mailto:codewave.studio.tech@gmail.com"
                  className="text-sm font-semibold text-[#0B132B] dark:text-[#F9E79F] hover:text-[#D4AF37] dark:hover:text-[#F3C623] transition-colors block truncate mt-1"
                >
                  codewave.studio.tech@gmail.com
                </a>
              </div>
            </motion.div>

            {/* Phone Icon Block */}
            <motion.div
              whileHover="hover"
              className="flex items-start gap-4 group"
            >
              <motion.div
                variants={{
                  hover: {
                    rotate: [0, -12, 12, -12, 12, -6, 6, 0],
                    scale: 1.1
                  }
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#0B132B] dark:text-[#F3C623] flex items-center justify-center flex-shrink-0 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </motion.div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-[#1E3A5F] dark:text-[#8496B8] uppercase tracking-widest">PHONE</p>
                <a
                  href="tel:+94717441420"
                  className="text-sm font-semibold text-[#0B132B] dark:text-[#F9E79F] hover:text-[#D4AF37] dark:hover:text-[#F3C623] transition-colors block truncate mt-1"
                >
                  +94 71 744 1420
                </a>
              </div>
            </motion.div>

            {/* Location Icon Block */}
            <motion.div
              whileHover="hover"
              className="flex items-start gap-4 group"
            >
              <motion.div
                variants={{
                  hover: {
                    y: [-6, 0, -3, 0],
                    scale: [1, 1.12, 1.05, 1.1]
                  }
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#0B132B] dark:text-[#F3C623] flex items-center justify-center flex-shrink-0 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </motion.div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-[#1E3A5F] dark:text-[#8496B8] uppercase tracking-widest">LOCATION</p>
                <p className="text-sm font-semibold text-[#0B132B] dark:text-[#F9E79F] mt-1 leading-snug">
                  Pitipana, Homagama, Sri Lanka
                </p>
              </div>
            </motion.div>

          </div>

          {/* Social Links inside the card footer */}
          <div className="pt-6 border-t border-[#CBD5E1] dark:border-[#1E3A5F] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#1E3A5F] dark:text-[#8496B8]">Connect on social media:</span>
            <SocialLinks />
          </div>
        </div>
      </ScrollReveal>

      {/* Inquiry Form */}
      <div className="max-w-xl mx-auto">
        <ScrollReveal delay={0.2}>
          <GlassCard className="p-8 border border-[#CBD5E1] dark:border-[#1E3A5F] bg-white/90 dark:bg-[#131B2E] text-left">
            {/* Animated Character Mascot */}
            <ContactMascot focusedField={focusedField} isSuccess={isSuccess} />

            <h3 className="text-xl font-bold text-[#0B132B] dark:text-[#F9E79F] mb-6 text-center">Send Us a Direct Message</h3>

            {isSuccess ? (
              <div className="space-y-6 py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto border border-emerald-500/20 text-2xl">
                  ✓
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#0B132B] dark:text-[#F9E79F]">Message Sent Successfully!</h3>
                  <p className="text-[#1E3A5F] dark:text-[#8496B8] text-sm">
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
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm break-words">
                    <strong>Error submitting form:</strong> {submitError}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-[#1E3A5F] dark:text-[#F9E79F] uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    disabled={isSubmitting}
                    className={`mt-2 block w-full px-4 py-3 bg-[#F0F4F9] dark:bg-[#0B132B] border rounded-lg text-sm text-[#0B132B] dark:text-[#F9E79F] focus:outline-none focus:border-[#D4AF37] transition-colors ${errors.name ? 'border-red-500/50' : 'border-[#CBD5E1] dark:border-[#1E3A5F]'
                      }`}
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-[#1E3A5F] dark:text-[#F9E79F] uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    disabled={isSubmitting}
                    className={`mt-2 block w-full px-4 py-3 bg-[#F0F4F9] dark:bg-[#0B132B] border rounded-lg text-sm text-[#0B132B] dark:text-[#F9E79F] focus:outline-none focus:border-[#D4AF37] transition-colors ${errors.email ? 'border-red-500/50' : 'border-[#CBD5E1] dark:border-[#1E3A5F]'
                      }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-[#1E3A5F] dark:text-[#F9E79F] uppercase tracking-wider">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    disabled={isSubmitting}
                    className={`mt-2 block w-full px-4 py-3 bg-[#F0F4F9] dark:bg-[#0B132B] border rounded-lg text-sm text-[#0B132B] dark:text-[#F9E79F] focus:outline-none focus:border-[#D4AF37] transition-colors h-32 ${errors.message ? 'border-red-500/50' : 'border-[#CBD5E1] dark:border-[#1E3A5F]'
                      }`}
                    placeholder="Project details, timeline, or questions..."
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1.5">{errors.message}</p>}
                </div>

                <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-[#1E3A5F] dark:text-[#D7DEEC]">
                  <input
                    type="checkbox"
                    required
                    checked={legalConsent}
                    onChange={(e) => { setLegalConsent(e.target.checked); setSubmitError(''); }}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#8A6A00]"
                  />
                  <span>I agree to the <Link to="/privacy" className="font-semibold underline">Privacy Policy</Link> and <Link to="/terms" className="font-semibold underline">Terms of Service</Link>.</span>
                </label>

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
