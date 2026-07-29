export default function Contact() {
  return (
    <div className="py-16 max-w-xl mx-auto px-4">
      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl text-center">
        Contact <span className="gradient-brand bg-clip-text text-transparent">Us</span>
      </h1>
      <p className="mt-4 text-slate-400 text-center">
        Send us a message and we will respond within 24 hours.
      </p>
      <form onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300">Name</label>
          <input
            type="text"
            className="mt-1 block w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-primary"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">Email</label>
          <input
            type="email"
            className="mt-1 block w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-primary"
            placeholder="Your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">Message</label>
          <textarea
            className="mt-1 block w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-primary h-32"
            placeholder="How can we help you?"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/95 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
