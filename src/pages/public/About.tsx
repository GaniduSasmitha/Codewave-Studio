import GlassCard from '../../components/GlassCard';
import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';

const team = [
  {
    name: "Alex Vane",
    role: "Lead Creative Developer",
    bio: "Specialist in Three.js, shaders, and browser animations. Alex bridges design files and raw execution code.",
    avatar: "🎨"
  },
  {
    name: "Sarah Jenkins",
    role: "Chief Architect / Full Stack",
    bio: "Auth expert and database engineer. Sarah manages our API setups, Stripe checkout portals, and database safety.",
    avatar: "💻"
  },
  {
    name: "Elena Rostova",
    role: "UI/UX & Brand Director",
    bio: "Glassmorphic stylist. Elena sets our curated dark color palettes, typography, and responsive grid layouts.",
    avatar: "✏️"
  }
];

export default function About() {
  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      <ScrollReveal>
        <SectionHeading
          title="We Are Creative"
          gradientWord="Codewave"
          subtitle="Our company story and the team behind the next-generation digital products."
          align="center"
        />
      </ScrollReveal>

      {/* Story Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <ScrollReveal className="space-y-6 text-left">
          <h3 className="text-2xl font-bold text-white">Our Mission</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Codewave Studio was founded in 2025 to disrupt standard cookie-cutter web agency designs. We believe a website is the digital headquarters of a business and should wow visitors immediately.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed">
            By leveraging state-of-the-art architectures like React, Vite, Supabase, GSAP, and WebGL, we create high-performance web applications that are as visually premium as they are fast.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <GlassCard className="p-8 border border-white/5 bg-slate-900/10 text-left">
            <h4 className="text-lg font-bold text-accent mb-4">Core Numbers</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-black text-white">40+</p>
                <p className="text-xs text-slate-500 mt-1">Projects Built</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">99%</p>
                <p className="text-xs text-slate-500 mt-1">Client Reviews</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">&lt;4s</p>
                <p className="text-xs text-slate-500 mt-1">Average Load</p>
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>
      </section>

      {/* Team Section */}
      <section className="space-y-12">
        <ScrollReveal>
          <SectionHeading
            title="The Creative"
            gradientWord="Collective"
            subtitle="Meet the elite developers and designers leading our custom builds."
          />
        </ScrollReveal>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {team.map((member, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <GlassCard className="h-full flex flex-col justify-between text-left p-6 border border-white/5 bg-slate-900/15">
                <div>
                  <div className="w-14 h-14 rounded-full bg-slate-950/80 flex items-center justify-center text-2xl border border-white/10 mb-6 shadow-inner">
                    {member.avatar}
                  </div>
                  <h4 className="text-lg font-bold text-white">{member.name}</h4>
                  <span className="text-xs text-accent font-semibold block mt-1 uppercase tracking-wider">
                    {member.role}
                  </span>
                  <p className="text-slate-400 text-xs leading-relaxed mt-4">
                    {member.bio}
                  </p>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
