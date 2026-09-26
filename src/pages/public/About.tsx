import GlassCard from '../../components/GlassCard';
import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';
import TeamCarousel, { type TeamMember } from '../../components/TeamCarousel';
import mininduImg from '../../assets/minindu.jpg';
import ganiduImg from '../../assets/ganidu.jpg';
import asekaImg from '../../assets/aseka.png';

const team: TeamMember[] = [
  {
    name: "Minindu Nuwantha",
    role: "Lead Creative Developer",
    bio: "Specialist in Three.js, shaders, and browser animations. Minindu bridges design files and raw execution code.",
    avatar: "🎨",
    image: mininduImg,
    imagePosition: "object-top",
    imageScale: "scale-100",
    linkedin: "https://www.linkedin.com/in/minindu-nuwantha-242292213/"
  },
  {
    name: "Ganidu Sasmitha",
    role: "Chief Architect / Full Stack",
    bio: "Auth expert and database engineer. Ganidu manages our API setups, Stripe checkout portals, and database safety.",
    avatar: "💻",
    image: ganiduImg,
    imagePosition: "object-top",
    imageScale: "scale-100",
    linkedin: "https://www.linkedin.com/in/ganidu-sasmitha-0b5976392"
  },
  {
    name: "Aseka Kasundi",
    role: "UI/UX & Brand Director",
    bio: "Glassmorphic stylist. Aseka sets our curated dark color palettes, typography, and responsive grid layouts.",
    avatar: "✏️",
    image: asekaImg,
    imagePosition: "object-[center_28%]",
    imageScale: "scale-[1.3]",
    linkedin: "https://www.linkedin.com/in/aseka-kasundi-0094672aa/"
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
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Our Mission</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Codewave Studio was founded in 2025 to disrupt standard cookie-cutter web agency designs. We believe a website is the digital headquarters of a business and should wow visitors immediately.
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            By leveraging state-of-the-art architectures like React, Vite, Supabase, GSAP, and WebGL, we create high-performance web applications that are as visually premium as they are fast.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <GlassCard className="p-8 border border-slate-300 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/10 text-left">
            <h4 className="text-lg font-bold text-primary dark:text-accent mb-4">Core Numbers</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-black text-slate-900 dark:text-white">40+</p>
                <p className="text-xs text-slate-500 mt-1">Projects Built</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 dark:text-white">99%</p>
                <p className="text-xs text-slate-500 mt-1">Client Reviews</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 dark:text-white">&lt;4s</p>
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

        {/* 3D Coverflow Team Carousel */}
        <ScrollReveal delay={0.1}>
          <TeamCarousel members={team} />
        </ScrollReveal>
      </section>
    </div>
  );
}
