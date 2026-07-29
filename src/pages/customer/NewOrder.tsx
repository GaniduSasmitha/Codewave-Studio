import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';

const packages = [
  { id: "starter", name: "Starter Package", price: 499, desc: "Sleek lead generation presence." },
  { id: "business", name: "Business Suite", price: 999, desc: "Portal integration and backends." },
  { id: "custom", name: "Custom WebGL App", price: 1999, desc: "Immersive 3D interactive web." },
  { id: "maintenance", name: "Active Maintenance", price: 99, desc: "Server safety updates." }
];

export default function NewOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState('starter');
  const [selectedPrice, setSelectedPrice] = useState(499);

  // Requirements form fields
  const [businessName, setBusinessName] = useState('');
  const [preferredDomain, setPreferredDomain] = useState('');
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const pkg = searchParams.get('package');
    if (pkg && packages.some((p) => p.id === pkg)) {
      setSelectedPackage(pkg);
      const match = packages.find((p) => p.id === pkg);
      if (match) {
        setSelectedPrice(match.price);
      }
      setStep(2); // Jump directly to step 2 for pre-selected packages
    }
  }, [searchParams]);

  const handleSelectPackage = (pkgId: string, price: number) => {
    setSelectedPackage(pkgId);
    setSelectedPrice(price);
    setStep(2);
  };

  const handleNextStep = () => {
    if (step === 2) {
      if (!businessName.trim() || !description.trim()) {
        setErrorMsg('Please fill in both Business Name and Project Description.');
        return;
      }
      setErrorMsg('');
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    setErrorMsg('');

    const requirements = {
      businessName,
      preferredDomain,
      description
    };

    try {
      const { error } = await supabase.from('orders').insert({
        customer_id: user.id,
        package: selectedPackage,
        price: selectedPrice,
        requirements: JSON.stringify(requirements),
        status: 'pending_payment'
      });

      if (error) throw error;
      navigate('/portal');
    } catch (err: any) {
      console.error('Error creating order:', err);
      setErrorMsg(err.message || 'Failed to create order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const activePlan = packages.find((p) => p.id === selectedPackage);

  return (
    <div className="max-w-2xl mx-auto text-left space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Create a New Project</h1>
        <p className="text-slate-400 mt-2">Request your design and development setup in a few quick steps.</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-4 bg-slate-950/40 p-4 rounded-xl border border-white/5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <span className={step === 1 ? "text-accent" : step > 1 ? "text-primary" : ""}>1. Select Plan</span>
        <span className="text-slate-700">|</span>
        <span className={step === 2 ? "text-accent" : step > 2 ? "text-primary" : ""}>2. Requirements</span>
        <span className="text-slate-700">|</span>
        <span className={step === 3 ? "text-accent" : ""}>3. Review & Submit</span>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-semibold leading-relaxed">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Step 1: Package Selection */}
      {step === 1 && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {packages.map((pkg) => (
            <GlassCard
              key={pkg.id}
              onClick={() => handleSelectPackage(pkg.id, pkg.price)}
              className="p-6 cursor-pointer border border-white/5 bg-slate-900/10 hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">{pkg.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/60 flex justify-between items-center">
                <span className="text-xl font-black text-white">${pkg.price}</span>
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">Select →</span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Step 2: Requirements */}
      {step === 2 && (
        <GlassCard className="p-8 border border-white/5 bg-slate-900/10 space-y-6" hoverEffect={false}>
          <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-2">
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">Selected plan:</span>
            <span className="text-sm font-bold text-white bg-slate-950/60 border border-white/5 px-3 py-1 rounded">
              {activePlan?.name} (${activePlan?.price})
            </span>
          </div>

          <div>
            <label htmlFor="businessName" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Business Name
            </label>
            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="mt-2 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. Acme Corporation"
            />
          </div>

          <div>
            <label htmlFor="preferredDomain" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Preferred Domain
            </label>
            <input
              id="preferredDomain"
              type="text"
              value={preferredDomain}
              onChange={(e) => setPreferredDomain(e.target.value)}
              className="mt-2 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. acme.com (optional)"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Project Description / Design Notes
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-primary transition-colors h-32"
              placeholder="Explain preferred colors, required views, WebGL elements, and integrations..."
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-800/60">
            <AnimatedButton onClick={handlePrevStep} variant="secondary" className="w-1/2 py-3">
              Back to Plans
            </AnimatedButton>
            <AnimatedButton onClick={handleNextStep} variant="primary" className="w-1/2 py-3">
              Review Summary
            </AnimatedButton>
          </div>
        </GlassCard>
      )}

      {/* Step 3: Review & Confirm */}
      {step === 3 && (
        <GlassCard className="p-8 border border-white/5 bg-slate-900/10 space-y-6 animate-fade-in" hoverEffect={false}>
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Review Order Details</h2>

          <div className="grid gap-6 grid-cols-2 text-sm">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Selected Package</span>
              <span className="text-white font-bold block mt-1">{activePlan?.name}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Cost</span>
              <span className="text-white font-bold block mt-1">${activePlan?.price}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Business Name</span>
              <span className="text-white font-bold block mt-1">{businessName}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Preferred Domain</span>
              <span className="text-white font-bold block mt-1">{preferredDomain || "None provided"}</span>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Design Notes & Scope</span>
            <p className="text-slate-300 text-xs mt-2 bg-slate-950/60 p-4 rounded border border-white/5 leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          </div>

          <div className="flex gap-4 pt-6 border-t border-slate-800/60">
            <AnimatedButton onClick={handlePrevStep} variant="secondary" className="w-1/2 py-3">
              Back to Edit
            </AnimatedButton>
            <AnimatedButton
              onClick={handleSubmit}
              variant="primary"
              disabled={submitting}
              className="w-1/2 py-3"
            >
              {submitting ? "Submitting Order..." : "Confirm & Submit"}
            </AnimatedButton>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
