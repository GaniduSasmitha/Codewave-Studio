import Hero3D from '../../components/Hero3D';
import AnimatedButton from '../../components/AnimatedButton';
import GlassCard from '../../components/GlassCard';
import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 text-left">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Next-Gen <br />
            <span className="gradient-brand bg-clip-text text-transparent">Digital Craft</span>
          </h1>
          <p className="max-w-xl text-lg text-slate-400 leading-relaxed">
            We build immersive 3D experiences, stunning interfaces, and high-performance applications custom tailored to your goals.
          </p>
          <div className="flex gap-4">
            <AnimatedButton onClick={() => navigate('/services')} variant="primary">
              Explore Services
            </AnimatedButton>
            <AnimatedButton onClick={() => navigate('/contact')} variant="glass">
              Get in Touch
            </AnimatedButton>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <Hero3D />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            title="Our Digital"
            gradientWord="Principles"
            subtitle="How we create digital solutions that stand out."
            align="center"
          />
        </ScrollReveal>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-3 mt-12">
          <ScrollReveal delay={0.1}>
            <GlassCard className="h-full">
              <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-slate-900 font-bold mb-6">
                3D
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Interactive WebGL</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Bring your products to life with custom 3D models and interactive web environments that run smoothly on all devices.
              </p>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <GlassCard className="h-full">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold mb-6 border border-white/10">
                UI
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Premium Design</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Beautiful glassmorphism aesthetics, curated colors, and tailored dark mode layouts designed to impress at first glance.
              </p>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <GlassCard className="h-full">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold mb-6 border border-primary/25">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fluid Motion</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Smooth route transitions and micro-interactions powered by GSAP and Framer Motion for high-fidelity responsive feel.
              </p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
