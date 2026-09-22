import GlassCard from '../../components/GlassCard';
import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';
import mininduImg from '../../assets/minindu.jpg';
import ganiduImg from '../../assets/ganidu.jpg';
import asekaImg from '../../assets/aseka.png';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  image?: string | null;
  imagePosition?: string;
  imageScale?: string;
  linkedin?: string;
}

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
          <GlassCard className="p-8 border border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/10 text-left">
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

        <ScrollReveal delay={0.1}>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {team.map((member, i) => (
              <GlassCard key={i} className="h-full flex flex-col justify-between items-center text-center p-6 sm:p-8 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/20 hover:border-primary/40 transition-all duration-300 group">
                <div className="flex flex-col items-center text-center w-full">
                  {/* Centered Large Stylized Avatar Display with LinkedIn Link */}
                  {member.linkedin ? (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 bg-gradient-to-br from-primary/40 via-slate-200 dark:via-slate-800 to-accent/40 shadow-xl shadow-primary/10 mb-6 mx-auto flex-shrink-0 group-hover:shadow-primary/20 group-hover:scale-[1.02] transition-all duration-300 block cursor-pointer"
                      title={`Visit ${member.name}'s LinkedIn profile`}
                    >
                      <div className="w-full h-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950/90 flex items-center justify-center border border-slate-300 dark:border-white/10 relative">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className={`w-full h-full object-cover ${member.imagePosition || 'object-top'} ${member.imageScale || 'scale-100'} transition-transform duration-500 group-hover:scale-[1.2]`}
                          />
                        ) : (
                          <span className="text-4xl sm:text-5xl select-none filter drop-shadow">
                            {member.avatar}
                          </span>
                        )}
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-[11px] font-bold text-white bg-primary/90 px-2.5 py-1 rounded-full backdrop-blur border border-white/20 shadow-md">
                            LinkedIn ↗
                          </span>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 bg-gradient-to-br from-primary/40 via-slate-200 dark:via-slate-800 to-accent/40 shadow-xl shadow-primary/10 mb-6 mx-auto flex-shrink-0 group-hover:shadow-primary/20 group-hover:scale-[1.02] transition-all duration-300">
                      <div className="w-full h-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950/90 flex items-center justify-center border border-slate-300 dark:border-white/10">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className={`w-full h-full object-cover ${member.imagePosition || 'object-top'} ${member.imageScale || 'scale-100'} transition-transform duration-500 group-hover:scale-[1.35]`}
                          />
                        ) : (
                          <span className="text-4xl sm:text-5xl select-none filter drop-shadow">
                            {member.avatar}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Name with LinkedIn Link */}
                  {member.linkedin ? (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/name inline-flex items-center gap-1.5 text-xl font-bold text-slate-900 dark:text-white hover:text-primary dark:hover:text-accent transition-colors duration-200 text-center"
                    >
                      <span>{member.name}</span>
                      <span className="text-xs text-primary dark:text-accent opacity-70 group-hover/name:opacity-100 transition-opacity">↗</span>
                    </a>
                  ) : (
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-200 text-center">
                      {member.name}
                    </h4>
                  )}

                  <span className="text-xs text-primary dark:text-accent font-semibold block mt-1.5 uppercase tracking-wider text-center">
                    {member.role}
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mt-4 text-center">
                    {member.bio}
                  </p>

                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-950/60 hover:bg-primary/20 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-white/10 hover:border-primary/40 transition-all duration-200 shadow-sm"
                    >
                      <span>LinkedIn Profile</span>
                      <span>↗</span>
                    </a>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
