import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from '../../components/GlassCard';
import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';
import AnimatedButton from '../../components/AnimatedButton';

const services = [
  {
    id: "starter",
    title: "Business Web",
    price: "LKR 30,000",
    period: "total",
    subtitle: "Service price",
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
    price: "LKR 70,000",
    period: "total",
    subtitle: "Service price",
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
    price: "LKR 120,000",
    period: "starting at",
    subtitle: "Starting from",
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
    price: "LKR 15,000",
    period: "/ month",
    subtitle: "Service price",
    desc: "Keep your application secure, up-to-date, and lightning-fast with dedicated support and server health checks.",
    features: [
      "Scheduled server monitoring checks",
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
            <GlassCard className="h-full flex flex-col justify-between p-8 border border-[#CBD5E1] dark:border-[#1E3A5F] bg-white/80 dark:bg-[#131B2E]/90 hover:border-[#D4AF37]/50">
              <div className="space-y-6">
                <div className="flex items-center justify-end">
                  <div className="flex min-h-[96px] w-full flex-col justify-center rounded-xl border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-3 py-3 text-center shadow-[0_0_24px_rgba(212,175,55,0.14)]">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#725700] dark:text-[#F3C623]">{service.subtitle}</span>
                    <div className="mt-1.5 flex items-baseline justify-center gap-1 flex-wrap">
                      <span className="text-2xl sm:text-[26px] font-black leading-tight text-[#725700] dark:text-[#F9E79F]">{service.price}</span>
                      {service.period && service.period !== 'total' && (
                        <span className="text-xs font-bold text-[#725700]/90 dark:text-[#F3C623]/90">{service.period}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#0B132B] dark:text-[#F9E79F] group-hover:text-[#D4AF37] dark:group-hover:text-[#F3C623] transition-colors">{service.title}</h3>
                  <p className="text-[#1E3A5F] dark:text-[#8496B8] text-sm leading-relaxed">{service.desc}</p>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-[#CBD5E1] dark:border-[#1E3A5F]">
                  {service.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-sm text-[#0B132B] dark:text-[#F9E79F]">
                      <span className="text-[#725700] dark:text-[#F3C623]">✔</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <AnimatedButton
                  onClick={() => handleSelectPackage(service.id)}
                  variant={i === 1 || i === 2 ? 'primary' : 'glass'}
                  className="flex h-16 w-full items-center justify-center px-4 cursor-pointer"
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
