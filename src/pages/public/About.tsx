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
    image: mininduImg,
    imagePosition: "object-top",
    imageScale: "scale-100",
    linkedin: "https://www.linkedin.com/in/minindu-nuwantha-242292213/"
  },
  {
    name: "Ganidu Sasmitha",
    role: "Chief Architect / Full Stack",
    bio: "Auth expert and database engineer. Ganidu manages our API setups, Stripe checkout portals, and database safety.",
    image: ganiduImg,
    imagePosition: "object-top",
    imageScale: "scale-100",
    linkedin: "https://www.linkedin.com/in/ganidu-sasmitha-0b5976392"
  },
  {
    name: "Aseka Kasundi",
    role: "UI/UX & Brand Director",
    bio: "Glassmorphic stylist. Aseka sets our curated dark color palettes, typography, and responsive grid layouts.",
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
          subtitle="Our company story and the team behind our digital products."
          align="center"
        />
      </ScrollReveal>

      {/* Story Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <ScrollReveal className="space-y-6 text-left">
          <h3 className="text-2xl font-bold text-[#0B132B] dark:text-[#F9E79F]">Our Mission</h3>
          <p className="text-[#1E3A5F] dark:text-[#8496B8] text-sm leading-relaxed">
            Codewave Studio was founded in 2025 to disrupt standard cookie-cutter web agency designs. We believe a website is the digital headquarters of a business and should wow visitors immediately.
          </p>
          <p className="text-[#1E3A5F] dark:text-[#8496B8] text-sm leading-relaxed">
            By leveraging state-of-the-art architectures like React, Vite, Supabase, GSAP, and WebGL, we create high-performance web applications that are as visually premium as they are fast.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <GlassCard className="p-8 border border-[#CBD5E1] dark:border-[#1E3A5F] bg-white/90 dark:bg-[#131B2E] text-left">
            <h4 className="text-lg font-bold text-[#725700] dark:text-[#F3C623] mb-4">How we work</h4>
            <p className="text-sm leading-7 text-[#1E3A5F] dark:text-[#D7DEEC]">We define the scope, agree on the price and expected timeline, build in reviewable stages, and collect feedback before delivery. Project-specific commitments are documented before work begins.</p>
          </GlassCard>
        </ScrollReveal>
      </section>

      {/* Team Section */}
      <section className="space-y-12">
        <ScrollReveal>
          <SectionHeading
            title="The Creative"
            gradientWord="Collective"
            subtitle="Meet the developers and designers working on our custom builds."
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
