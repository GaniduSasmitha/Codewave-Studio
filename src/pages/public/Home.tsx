export default function Home() {
  return (
    <div className="py-20 text-center max-w-4xl mx-auto px-4">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
        <span className="block text-white mb-2">Welcome to</span>
        <span className="block gradient-brand bg-clip-text text-transparent">Codewave Studio</span>
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-400 md:text-xl leading-relaxed">
        Premium web applications, stunning design, and next-generation code custom tailored to your business needs.
      </p>
      <div className="mt-10 flex justify-center gap-4">
        <a href="/services" className="bg-primary hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors">
          Our Services
        </a>
        <a href="/contact" className="border border-slate-800 hover:bg-slate-900 px-6 py-3 rounded-lg font-medium transition-colors">
          Contact Us
        </a>
      </div>
    </div>
  );
}
