import GlassCard from '../../components/GlassCard';
import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';
import ganiduImg from '../../assets/ganidu.jpg';
import asekaImg from '../../assets/aseka.png';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  image?: string | null;
}

const team: TeamMember[] = [
  {
    name: "Minindu Nuwantha",
    role: "Lead Creative Developer",
    bio: "Specialist in Three.js, shaders, and browser animations. Minindu bridges design files and raw execution code.",
    avatar: "🎨",
    image: null
  },
  {
    name: "Ganidu Sasmitha",
    role: "Chief Architect / Full Stack",
    bio: "Auth expert and database engineer. Ganidu manages our API setups, Stripe checkout portals, and database safety.",
    avatar: "💻",
    image: ganiduImg
  },
  {
    name: "Aseka Kasundi",
    role: "UI/UX & Brand Director",
    bio: "Glassmorphic stylist. Aseka sets our curated dark color palettes, typography, and responsive grid layouts.",
    avatar: "✏️",
    image: asekaImg
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
              <GlassCard className="h-full flex flex-col justify-between items-center text-center p-6 sm:p-8 border border-white/10 bg-slate-900/20 hover:border-primary/30 transition-all duration-300 group">
                <div className="flex flex-col items-center text-center w-full">
                  {/* Centered Large Stylized Avatar Display */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 bg-gradient-to-br from-primary/40 via-slate-800 to-accent/40 shadow-xl shadow-primary/10 mb-6 mx-auto flex-shrink-0 group-hover:shadow-primary/20 group-hover:scale-[1.02] transition-all duration-300">
                    <div className="w-full h-full rounded-xl overflow-hidden bg-slate-950/90 flex items-center justify-center border border-white/10">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-4xl sm:text-5xl select-none filter drop-shadow">
                          {member.avatar}
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-200 text-center">
                    {member.name}
                  </h4>
                  <span className="text-xs text-accent font-semibold block mt-1.5 uppercase tracking-wider text-center">
                    {member.role}
                  </span>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-4 text-center">
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


