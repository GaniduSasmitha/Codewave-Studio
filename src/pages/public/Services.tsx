export default function Services() {
  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        Our <span className="gradient-brand bg-clip-text text-transparent">Services</span>
      </h1>
      <p className="mt-4 max-w-2xl text-slate-400 text-lg">
        Explore what Codewave Studio can build for you.
      </p>
      <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
        {['Web Development', 'UI/UX Design', '3D & WebGL Experiences'].map((service, i) => (
          <div key={i} className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <h3 className="text-xl font-bold text-white mb-2">{service}</h3>
            <p className="text-slate-400 text-sm">
              Premium development using state-of-the-art technologies and design guidelines.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
