export default function Pricing() {
  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl text-center">
        Simple, Transparent <span className="gradient-brand bg-clip-text text-transparent">Pricing</span>
      </h1>
      <p className="mt-4 max-w-2xl text-slate-400 text-lg text-center mx-auto">
        Choose the plan that fits your business needs.
      </p>
      <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
        {['Startup', 'Professional', 'Enterprise'].map((plan, i) => (
          <div key={i} className="p-8 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{plan}</h3>
              <p className="text-3xl font-extrabold text-white mt-4">${(i+1)*99}/mo</p>
              <p className="text-slate-400 text-sm mt-4">
                Full-featured updates, dark theme components, custom integrations, and fast deployments.
              </p>
            </div>
            <button className="mt-8 w-full bg-slate-800 hover:bg-slate-700 py-2 rounded-lg font-medium transition-colors">
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
