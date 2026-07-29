import GlassCard from '../../components/GlassCard';
import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';

const projects = [
  {
    id: 1,
    title: "Metaverse Showroom",
    category: "3D Interaction / WebGL",
    tags: ["React Three Fiber", "GSAP", "Tailwind"],
    description: "An interactive, low-poly showroom allowing clients to explore interior design elements in full 3D."
  },
  {
    id: 2,
    title: "Nova Fintech Suite",
    category: "SaaS App / Dashboard",
    tags: ["React", "Supabase DB", "Tailwind CSS"],
    description: "High-performance financial auditing panel containing secure login, real-time charts, and logs."
  },
  {
    id: 3,
    title: "Apex Market Platform",
    category: "E-Commerce",
    tags: ["Stripe API", "React Router", "Postgres"],
    description: "Custom digital marketplace offering inventory checks, instant payment flows, and email notifications."
  },
  {
    id: 4,
    title: "Aether Portal",
    category: "Custom Animation UI",
    tags: ["Framer Motion", "GSAP", "Vite"],
    description: "Brand landing showcasing high-fidelity entrance reveals, slide overlays, and responsive typography."
  },
  {
    id: 5,
    title: "Vortex Gaming Network",
    category: "Web Application",
    tags: ["Supabase Auth", "Tailwind CSS", "React"],
    description: "Matchmaking lobby client linking multiple user roles, chat logs, and active status tracking."
  },
  {
    id: 6,
    title: "Solaria Architecture",
    category: "3D Visual Product Showcase",
    tags: ["WebGL", "Three.js", "MathUtils"],
    description: "An architectural showcase utilizing custom vertex distortions and ambient colored spotlights."
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
              <div className="aspect-video w-full overflow-hidden relative border-b border-slate-800">
                {/* Fallback pattern with animated gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 to-primary/10 z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-black text-4xl tracking-widest select-none z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  CODEWAVE
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider">{project.category}</span>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{project.description}</p>
                </div>

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
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
