export default function Portfolio() {
  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        Our <span className="gradient-brand bg-clip-text text-transparent">Portfolio</span>
      </h1>
      <p className="mt-4 max-w-2xl text-slate-400 text-lg">
        A gallery of our elite web designs and client success stories.
      </p>
      <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2">
        {['E-Commerce Redesign', 'FinTech Dashboard', '3D Interactive Product Catalog'].map((project, i) => (
          <div key={i} className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <h3 className="text-xl font-bold text-white mb-2">{project}</h3>
            <p className="text-slate-400 text-sm">
              An award-winning design utilizing smooth transitions and micro-animations.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
