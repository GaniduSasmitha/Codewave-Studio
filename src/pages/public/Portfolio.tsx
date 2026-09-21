import GlassCard from '../../components/GlassCard';
import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  link?: string | null;
  image?: string;
  badge?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Beadoria",
    category: "E-COMMERCE / JEWELRY",
    description: "A jewelry e-commerce storefront with product browsing and a polished shopping experience.",
    tags: ["React", "Tailwind", "E-Commerce"],
    link: "https://ganidusasmitha.github.io/Beadoria/",
    badge: "Personal Project"
  },
  {
    id: 2,
    title: "Personal Fitness Tracker",
    category: "SAAS APP / FITNESS",
    description: "Full-stack fitness tracking app with workout logging, streaks, and progress analytics.",
    tags: ["React", "Supabase", "Node.js"],
    link: "https://personal-fitness-tracker-cyan.vercel.app/",
    badge: "Personal Project"
  },
  {
    id: 3,
    title: "Portfolio",
    category: "PERSONAL PORTFOLIO",
    description: "A personal portfolio site showcasing projects and skills.",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "https://ganidusasmitha.42web.io/",
    badge: "Personal Project"
  },
  {
    id: 4,
    title: "Gamig4World",
    category: "GAMING / COMMUNITY",
    description: "A gaming community platform built around game discovery and player engagement.",
    tags: ["JavaScript", "Web Design"],
    link: "https://ganidusasmitha.github.io/gamig4world/",
    badge: "Personal Project"
  },
  {
    id: 5,
    title: "Nestlé CommHub",
    category: "INTERNAL PLATFORM",
    description: "An internal communication hub platform built as a university group project, covering team collaboration and workflow tracking.",
    tags: ["React", "QA Automation", "Sprint Delivery"],
    link: "https://github.com/nestle-commhub-group1/nestle-commhub.git",
    badge: "Personal Project"
  },
  {
    id: 6,
    title: "Evora",
    category: "EV CHARGING / DESIGNATHON",
    description: "EV charging station finder concept — designed as curunt problem soliving project",
    tags: ["Figma", "UX Design", "Concept"],
    link: null,
    badge: "Personal Project"
  }
];

export default function Portfolio() {
  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <ScrollReveal>
        <SectionHeading
          title="Our Completed"
          gradientWord="Portfolio"
          subtitle="Discover our history of building high-performance, visually gorgeous web systems."
          align="center"
        />
      </ScrollReveal>

      {/* Grid Layout with hover scale and gradient overlay */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-12">
        {projects.map((project, i) => (
          <ScrollReveal key={project.id} delay={i * 0.08}>
            <GlassCard
              hoverEffect={false}
              className="group h-full flex flex-col justify-between overflow-hidden p-0 border border-white/5 bg-slate-900/20 hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(99,102,241,0.2)]"
            >
              {/* Image Area with Fallback Watermark Structure */}
              <div className="aspect-video w-full overflow-hidden relative border-b border-slate-800">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <>
                    {/* Fallback pattern with animated gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 to-primary/10 z-0"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-black text-4xl tracking-widest select-none z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                      CODEWAVE
                    </div>
                  </>
                )}

                {/* Subtle Personal Project Badge */}
                {project.badge && (
                  <span className="absolute top-3 right-3 z-20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-amber-400 border border-amber-400/30 backdrop-blur-md shadow-md">
                    {project.badge}
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider">{project.category}</span>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{project.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-semibold text-slate-400 bg-slate-950/40 px-2 py-0.5 rounded border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* External Link or Disabled Case Study Button */}
                  <div className="pt-2 border-t border-slate-800/60">
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-white transition-colors group/link"
                      >
                        <span>View Project</span>
                        <span className="transition-transform group-hover/link:translate-x-1">→</span>
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-950/50 px-3 py-1 rounded border border-slate-800/80 cursor-not-allowed select-none">
                        <span>Case Study Coming Soon</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
