import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from '../../components/GlassCard';
import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';
import AnimatedButton from '../../components/AnimatedButton';

const tiers = [
  {
    id: "starter",
    name: "Starter",
    price: "$79",
    billing: "One-time payment",
    desc: "Up to 5 pages, responsive design, contact form, basic SEO, 1 revision round, 5-day delivery.",
    popular: false
  },
  {
    id: "business",
    name: "Business",
    price: "$199",
    billing: "One-time payment",
    desc: "Up to 10 pages, CMS/blog, SEO setup, custom contact forms, 2 revision rounds, 10-day delivery.",
    popular: true
  },
  {
    id: "custom",
    name: "Custom",
    price: "starting at $399",
    billing: "Quote-based",
    desc: "Full-stack web app, database, user auth, admin dashboard, unlimited revisions during build, timeline based on scope.",
    popular: false
  }
];

const featuresList = [
  { name: "Pages Included", starter: "Up to 5 pages", business: "Up to 10 pages", custom: "Scope-based" },
  { name: "Responsive Design", starter: true, business: true, custom: true },
  { name: "Contact & Lead Forms", starter: "Contact form", business: "Custom contact forms", custom: "Advanced & Automated" },
  { name: "SEO Optimization", starter: "Basic SEO", business: "SEO setup", custom: "Full SEO & Indexing" },
  { name: "CMS / Blog Integration", starter: false, business: true, custom: true },
  { name: "Full-Stack Web App & Database", starter: false, business: false, custom: true },
  { name: "User Auth & Admin Dashboard", starter: false, business: false, custom: true },
  { name: "Revision Rounds", starter: "1 revision round", business: "2 revision rounds", custom: "Unlimited during build" },
  { name: "Delivery Time", starter: "5-day delivery", business: "10-day delivery", custom: "Based on scope" },
  { name: "Support & Maintenance", starter: "Standard Support", business: "Priority Support", custom: "Dedicated Support" }
];

export default function Pricing() {
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
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      <ScrollReveal>
        <SectionHeading
          title="Flexible Plans for"
          gradientWord="Your Goals"
          subtitle="Simple, flat pricing packages with no hidden setup fees."
          align="center"
        />
      </ScrollReveal>

      {/* Tier Cards Grid */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-12">
        {tiers.map((tier, i) => (
          <ScrollReveal key={i} delay={i * 0.1}>
            <GlassCard
              className={`h-full flex flex-col justify-between p-8 border relative ${tier.popular
                  ? 'border-primary/50 bg-indigo-50/50 dark:bg-slate-900/50 shadow-md'
                  : 'border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/20'
                }`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full border border-primary/20 shadow-sm">
                  Most Popular
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tier.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 leading-relaxed">{tier.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800/60">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">{tier.price}</span>
                  <span className="text-slate-500 text-xs block mt-1">{tier.billing}</span>
                </div>
              </div>

              <div className="mt-8">
                <AnimatedButton
                  onClick={() => handleSelectPackage(tier.id)}
                  variant={tier.popular ? 'primary' : 'glass'}
                  className="w-full py-3 cursor-pointer"
                >
                  {tier.id === 'custom' ? 'Get a Quote' : `Order ${tier.name}`}
                </AnimatedButton>
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>

      {/* Full Features Comparison Table */}
      <section className="pt-12">
        <ScrollReveal>
          <SectionHeading
            title="Feature"
            gradientWord="Comparison"
            subtitle="Compare all features across packages to select the best fit."
          />
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-8 bg-white/80 dark:bg-slate-950/20 backdrop-blur-lg border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-950/60 text-xs uppercase text-slate-600 dark:text-slate-400 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Features</th>
                    <th className="px-6 py-4">Starter</th>
                    <th className="px-6 py-4">Business</th>
                    <th className="px-6 py-4">Custom</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                  {featuresList.map((feature, idx) => (
                    <tr key={idx} className="hover:bg-slate-100/60 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{feature.name}</td>
                      <td className="px-6 py-4">
                        {typeof feature.starter === 'boolean' ? (
                          feature.starter ? <span className="text-primary dark:text-accent text-lg">✔</span> : <span className="text-red-500 text-lg">✘</span>
                        ) : (
                          feature.starter
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {typeof feature.business === 'boolean' ? (
                          feature.business ? <span className="text-primary dark:text-accent text-lg">✔</span> : <span className="text-red-500 text-lg">✘</span>
                        ) : (
                          feature.business
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {typeof feature.custom === 'boolean' ? (
                          feature.custom ? <span className="text-primary dark:text-accent text-lg">✔</span> : <span className="text-red-500 text-lg">✘</span>
                        ) : (
                          feature.custom
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
