import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from '../../components/GlassCard';
import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';
import AnimatedButton from '../../components/AnimatedButton';

const services = [
  {
    id: "starter",
    title: "Business Website",
    icon: "🏢",
    price: "$79",
    desc: "A premium corporate presence custom tailored to display your services, build brand authority, and capture leads.",
    features: [
      "Custom responsive design",
      "Up to 5 included pages",
      "Lead generation contact form",
      "Basic SEO optimizations"
    ]
  },
  {
    id: "business",
    title: "E-commerce Store",
    icon: "🛒",
    price: "$199",
    desc: "A fully custom digital store complete with product catalog, CMS/blog, custom contact forms, and SEO setup.",
    features: [
      "Up to 10 included pages",
      "CMS & Blog integration",
      "SEO setup & metadata",
      "Custom contact forms & dashboards"
    ]
  },
  {
    id: "custom",
    title: "Web App / Custom Software",
    icon: "⚡",
    price: "starting at $399",
    desc: "Full-stack web application featuring custom database architecture, user authentication, admin dashboards, and custom logic.",
    features: [
      "Full-stack web app & database",
      "User auth & admin dashboard",
      "Custom business logic & APIs",
      "Unlimited revisions during build"
    ]
  },
  {
    id: "maintenance",
    title: "Maintenance & Support",
    icon: "🔧",
    price: "$15/month",
    desc: "Keep your application secure, up-to-date, and lightning-fast with dedicated support and server health checks.",
    features: [
      "24/7 server monitoring checks",
      "Weekly security patches & updates",
      "Dedicated developer support hours",
      "Performance & speed audit reports"
    ]
  }
];

export default function Services() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleSelectPackage = (packageId: string) => {
    if (packageId === 'custom') {
      navigate('/contact?package=custom');
    } else if (user && profile?.role === 'customer') {
      navigate(`/?package=${packageId}#orders-dashboard`);
    } else {
      navigate(`/signup?package=${packageId}`);
    }
  };

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
            <GlassCard className="h-full flex flex-col justify-between p-8 border border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/30">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-4xl">{service.icon}</div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Starting from</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{service.price}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{service.desc}</p>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-800/60">
                  {service.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="text-primary dark:text-accent">✔</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <AnimatedButton
                  onClick={() => handleSelectPackage(service.id)}
                  variant={i === 1 || i === 2 ? 'primary' : 'glass'}
                  className="w-full py-3 cursor-pointer"
                >
                  {service.id === 'custom' ? 'Get a Quote' : `Order ${service.title}`}
                </AnimatedButton>
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
