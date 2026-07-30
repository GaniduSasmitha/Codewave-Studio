import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';
import AnimatedButton from '../../components/AnimatedButton';

const services = [
  {
    id: "starter",
    title: "Business Website",
    icon: "🏢",
    price: "$499",
    desc: "A premium corporate presence custom tailored to display your services, build brand authority, and capture leads.",
    features: [
      "Custom responsive design (Tailwind CSS)",
      "Standard sub-pages (Home, About, Services, Contact)",
      "Basic SEO optimizations",
      "Lead generation forms"
    ]
  },
  {
    id: "business",
    title: "E-Commerce Suite",
    icon: "🛒",
    price: "$999",
    desc: "A fully custom digital store complete with checkout systems, inventory dashboards, and high-converting product pages.",
    features: [
      "Secure payment integration (Stripe, etc.)",
      "Client order dashboard (/)",
      "Admin verification dashboard (/admin)",
      "Dynamic catalog search and filtering"
    ]
  },
  {
    id: "custom",
    title: "WebGL Web App",
    icon: "⚡",
    price: "$1999",
    desc: "Breathtaking interactive experiences incorporating Three.js 3D models, GSAP physics animations, and custom cloud database actions.",
    features: [
      "Low-poly interactive 3D scene layers",
      "Full database operations (Supabase)",
      "Fluid state-controlled animations",
      "High performance indexing"
    ]
  },
  {
    id: "maintenance",
    title: "Active Maintenance",
    icon: "🔧",
    price: "$99/mo",
    desc: "Keep your application secure, up-to-date, and lightning-fast with dedicated support and server health checks.",
    features: [
      "24/7 server monitoring checks",
      "Weekly security patches and updates",
      "Dedicated developer support hours",
      "Speed audit reports"
    ]
  }
];

export default function Services() {
  const navigate = useNavigate();

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <ScrollReveal>
        <SectionHeading
          title="Our Premium"
          gradientWord="Services"
          subtitle="Explore our design and development packages tailored to accelerate your business growth."
          align="center"
        />
      </ScrollReveal>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-12">
        {services.map((service, i) => (
          <ScrollReveal key={i} delay={i * 0.1}>
            <GlassCard className="h-full flex flex-col justify-between p-8 border border-white/5 bg-slate-900/30">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-4xl">{service.icon}</div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Starting from</span>
                    <span className="text-2xl font-black text-white">{service.price}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{service.desc}</p>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-slate-800/60">
                  {service.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="text-accent">✔</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <AnimatedButton
                  onClick={() => navigate(`/signup?package=${service.id}`)}
                  variant={i === 1 || i === 2 ? 'primary' : 'glass'}
                  className="w-full py-3"
                >
                  Order {service.title}
                </AnimatedButton>
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
