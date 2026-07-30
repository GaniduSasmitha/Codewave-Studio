import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import Hero3D from '../../components/Hero3D';
import AnimatedButton from '../../components/AnimatedButton';
import GlassCard from '../../components/GlassCard';
import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';

const testimonials = [
  {
    text: "Codewave transformed our legacy dashboard into a beautiful, lightning-fast 3D product catalog. Our conversion rate increased by 40%!",
    author: "Sarah Jenkins",
    role: "VP of Product, Acme Corp"
  },
  {
    text: "The glassmorphic layouts, micro-animations, and overall dark theme design guidelines matched our branding perfectly. An absolute work of art.",
    author: "Michael Chang",
    role: "Co-Founder, Fintech Lab"
  },
  {
    text: "Professional WebGL interactive developers. They took our complex wireframes and converted them into high-fidelity fluid motion states on time.",
    author: "Elena Rostova",
    role: "Technical Lead, Cyberdyne Systems"
  }
];

const features = [
  {
    title: "Lightning Performance",
    desc: "Built on top of Vite and highly optimized custom React components. Score 100 on Google PageSpeed out of the box.",
    icon: "⚡"
  },
  {
    title: "Immersive 3D Elements",
    desc: "Interactive low-poly WebGL shapes and 3D product views custom-crafted using React Three Fiber and GSAP animations.",
    icon: "📦"
  },
  {
    title: "Secure & Scalable",
    desc: "Complete database operations, authentication routines, and secure file uploads handled via Supabase API engines.",
    icon: "🔒"
  },
  {
    title: "Responsive Design",
    desc: "Curated dark mode colors, glassmorphic blur overlays, and responsive mobile grids that look stunning on any resolution.",
    icon: "📱"
  }
];

const previewProjects = [
  {
    title: "Metaverse Showroom",
    category: "3D Interaction / WebGL",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Nova Fintech Suite",
    category: "SaaS App / Dashboard",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
  }
];

export default function Home() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/portal');
      }
    }
  }, [user, profile, navigate]);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="space-y-32 pb-24 overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 text-left">
          <div className="inline-flex items-center gap-2 border border-primary/30 px-3.5 py-1.5 rounded-full bg-primary/5 backdrop-blur text-xs font-semibold text-accent uppercase tracking-wider">
            <span>✨ Code meets Craft</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Elevate Your <br />
            <span className="gradient-brand bg-clip-text text-transparent">Digital Wave</span>
          </h1>
          <p className="max-w-xl text-lg text-slate-400 leading-relaxed">
            We build immersive 3D experiences, stunning interfaces, and high-performance applications custom tailored to your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <AnimatedButton onClick={() => navigate('/pricing')} variant="primary" className="w-full sm:w-auto">
              Get a Website
            </AnimatedButton>
            <AnimatedButton onClick={() => navigate('/portfolio')} variant="glass" className="w-full sm:w-auto">
              View Our Work
            </AnimatedButton>
          </div>
        </div>
        <div className="flex justify-center items-center relative">
          <div className="absolute -inset-4 gradient-brand opacity-10 blur-3xl pointer-events-none"></div>
          <Hero3D />
        </div>
      </section>

      {/* Why Trust Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            title="Why Partner With"
            gradientWord="Codewave?"
            subtitle="We blend state-of-the-art technologies with award-winning design aesthetics."
            align="center"
          />
        </ScrollReveal>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-16">
          {features.map((feat, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <GlassCard className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-slate-900 font-bold mb-6 text-xl">
                    {feat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Condensed Portfolio Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeading
            title="Featured"
            gradientWord="Showcase"
            subtitle="Explore a handpicked preview of our premium design layouts."
          />
          <Link
            to="/portfolio"
            className="text-sm font-semibold text-accent hover:underline mb-8 md:mb-0 flex items-center gap-1.5 self-start md:self-auto"
          >
            Explore Full Portfolio <span>→</span>
          </Link>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 mt-8">
          {previewProjects.map((project, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <GlassCard hoverEffect={false} className="group overflow-hidden p-0 relative rounded-2xl border border-white/5 bg-slate-950/20">
                <div className="aspect-video w-full overflow-hidden relative">
                  {/* Subtle placeholder fallback for images using absolute overlays */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 to-primary/20 z-0"></div>
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-black text-6xl tracking-widest select-none z-0 opacity-20">
                    CODEWAVE
                  </div>
                </div>
                <div className="p-6 bg-slate-950/40 backdrop-blur border-t border-white/5 relative z-20">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider">{project.category}</span>
                  <h3 className="text-2xl font-bold text-white mt-2 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <SectionHeading
            title="Client"
            gradientWord="Feedback"
            subtitle="Hear directly from business owners who partnered with us."
            align="center"
          />
        </ScrollReveal>

        <div className="mt-12 relative">
          <GlassCard className="min-h-[220px] flex flex-col justify-between relative overflow-hidden" hoverEffect={false}>
            <div className="absolute top-6 left-6 text-7xl font-serif text-primary/10 select-none">“</div>
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-lg md:text-xl text-slate-200 leading-relaxed italic"
                >
                  {testimonials[activeTestimonial].text}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center mt-8 border-t border-slate-800 pt-6">
              <div>
                <h4 className="font-bold text-white">{testimonials[activeTestimonial].author}</h4>
                <p className="text-xs text-slate-500">{testimonials[activeTestimonial].role}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-lg border border-slate-800 hover:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-lg border border-slate-800 hover:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  →
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="max-w-5xl mx-auto px-4">
        <ScrollReveal>
          <GlassCard className="relative overflow-hidden p-12 text-center border border-primary/20 bg-gradient-to-tr from-slate-950 to-primary/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Ready to Start Your Project?</h2>
            <p className="mt-4 max-w-xl mx-auto text-slate-400">
              Let's craft an industry-leading digital presence custom tailored to your business rules.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <AnimatedButton onClick={() => navigate('/contact')} variant="primary" className="w-full sm:w-auto">
                Get Started Today
              </AnimatedButton>
              <AnimatedButton onClick={() => navigate('/pricing')} variant="glass" className="w-full sm:w-auto">
                Compare Packages
              </AnimatedButton>
            </div>
          </GlassCard>
        </ScrollReveal>
      </section>
    </div>
  );
}
