import { useState } from 'react';
import GlassCard from '../../components/GlassCard';
import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';
import AnimatedButton from '../../components/AnimatedButton';
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
      newErrors.name = "Name is required.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required.";
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
        const { error } = await supabase
          .from('contact_messages')
          .insert({
            name: form.name.trim(),
            email: form.email.trim(),
            message: form.message.trim()
          });

        if (error) {
          console.error('Error inserting contact message:', error);
          setSubmitError(error.message || 'Failed to send message. Please try again.');
        } else {
          setIsSuccess(true);
          setForm({ name: '', email: '', message: '' });
          setErrors({ name: '', email: '', message: '' });
        }
      } catch (err: any) {
        console.error('Error inserting contact message:', err);
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
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <ScrollReveal>
        <SectionHeading
          title="Connect With"
          gradientWord="Our Team"
          subtitle="Get in touch to scope project requirements, request designs, or ask pricing questions."
          align="center"
        />
      </ScrollReveal>

      <div className="max-w-xl mx-auto mt-12">
        <ScrollReveal delay={0.1}>
          <GlassCard className="p-8 border border-white/5 bg-slate-900/10 text-left">
            {isSuccess ? (
              <div className="space-y-6 py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto border border-emerald-500/20 text-2xl">
                  ✓
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">✅ Message sent — we'll get back to you soon</h3>
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
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {submitError}
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
                  className="w-full py-3 flex items-center justify-center gap-2"
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
