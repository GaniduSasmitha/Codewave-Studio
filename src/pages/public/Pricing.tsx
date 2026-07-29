import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';
import AnimatedButton from '../../components/AnimatedButton';

const tiers = [
  {
    id: "starter",
    name: "Starter Package",
    price: "$499",
    billing: "One-time payment",
    desc: "Perfect for establishing brand authority and showcasing services.",
    popular: false
  },
  {
    id: "business",
    name: "Business Suite",
    price: "$999",
    billing: "One-time payment",
    desc: "Full client portal integration and backend ordering database.",
    popular: true
  },
  {
    id: "custom",
    name: "Custom WebGL App",
    price: "$1999",
    billing: "Starting price",
    desc: "Breathtaking interactive 3D WebGL scenes and custom animation physics.",
    popular: false
  }
];

const featuresList = [
  { name: "Custom Responsive Design", starter: true, business: true, custom: true },
  { name: "Page Limit", starter: "Up to 5", business: "Up to 15", custom: "Unlimited" },
  { name: "Supabase Database & API", starter: false, business: "Basic Integration", custom: "Custom Schema" },
  { name: "Client Portal & Orders list", starter: false, business: true, custom: true },
  { name: "Stripe Checkout Setup", starter: false, business: true, custom: true },
  { name: "Interactive 3D WebGL Scene", starter: false, business: false, custom: "Premium Fiber Scene" },
  { name: "GSAP Motion Transitions", starter: "Basic", business: "Advanced", custom: "Fully Customized" },
  { name: "Monthly Support Hours", starter: "1 Hour", business: "5 Hours", custom: "24/7 Priority Support" }
];

export default function Pricing() {
  const navigate = useNavigate();

  const handleSelectPackage = (packageId: string) => {
    navigate(`/signup?package=${packageId}`);
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
              className={`h-full flex flex-col justify-between p-8 border relative ${
                tier.popular ? 'border-primary/50 bg-slate-900/50' : 'border-white/5 bg-slate-900/20'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full border border-primary/20">
                  Most Popular
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  <p className="text-slate-400 text-xs mt-2">{tier.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/60">
                  <span className="text-4xl font-black text-white">{tier.price}</span>
                  <span className="text-slate-500 text-xs block mt-1">{tier.billing}</span>
                </div>
              </div>

              <div className="mt-8">
                <AnimatedButton
                  onClick={() => handleSelectPackage(tier.id)}
                  variant={tier.popular ? 'primary' : 'glass'}
                  className="w-full py-3"
                >
                  Order {tier.name.split(' ')[0]}
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
          <div className="mt-8 bg-slate-950/20 backdrop-blur-lg border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 text-xs uppercase text-slate-400 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Features</th>
                    <th className="px-6 py-4">Starter</th>
                    <th className="px-6 py-4">Business</th>
                    <th className="px-6 py-4">Custom</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {featuresList.map((feature, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/10">
                      <td className="px-6 py-4 font-medium text-white">{feature.name}</td>
                      <td className="px-6 py-4">
                        {typeof feature.starter === 'boolean' ? (
                          feature.starter ? <span className="text-accent text-lg">✔</span> : <span className="text-red-500 text-lg">✘</span>
                        ) : (
                          feature.starter
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {typeof feature.business === 'boolean' ? (
                          feature.business ? <span className="text-accent text-lg">✔</span> : <span className="text-red-500 text-lg">✘</span>
                        ) : (
                          feature.business
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {typeof feature.custom === 'boolean' ? (
                          feature.custom ? <span className="text-accent text-lg">✔</span> : <span className="text-red-500 text-lg">✘</span>
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
