import { motion, type Variants } from 'framer-motion';

export default function AuthMascotsPanel() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const characterVariants: Variants = {
    hidden: { opacity: 0, y: 24, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden text-center select-none shadow-2xl">
      {/* Ambient Radial Gradient Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-accent/15 to-primary/10 blur-3xl pointer-events-none" />

      {/* Decorative Title Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 space-y-2 z-10"
      >
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-[11px] font-mono font-bold uppercase tracking-widest text-accent">
          ⚡ CODEWAVE STUDIO
        </span>
        <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          Build the Future With Us
        </h2>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          Access your project dashboard, manage custom web app orders, and track your builds in real-time.
        </p>
      </motion.div>

      {/* 4 Tech Mascots Standing Group Pose */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-end justify-center gap-3 sm:gap-4 relative z-10 py-4"
      >
        {/* 1. Robot Character */}
        <motion.div
          variants={characterVariants}
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center relative"
        >
          {/* Robot Antenna */}
          <div className="flex flex-col items-center -mb-1 relative z-10">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                boxShadow: [
                  '0 0 6px #22D3EE',
                  '0 0 16px #22D3EE',
                  '0 0 6px #22D3EE',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-3 h-3 rounded-full bg-accent border border-white/40"
            />
            <div className="w-1 h-3 bg-slate-700" />
          </div>

          {/* Robot Head */}
          <div className="w-16 h-14 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/20 flex items-center justify-center relative overflow-hidden">
            {/* Screen Visor */}
            <div className="w-12 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between px-2.5">
              <motion.div
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
                className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]"
              />
              <div className="w-1.5 h-0.5 border-b border-cyan-400 rounded-full" />
              <motion.div
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
                className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]"
              />
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-1.5 font-bold">Bot-X</span>
        </motion.div>

        {/* 2. Laptop Character */}
        <motion.div
          variants={characterVariants}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          className="flex flex-col items-center relative"
        >
          {/* Laptop Screen */}
          <div className="w-20 h-16 rounded-t-xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-indigo-500/60 shadow-lg shadow-indigo-500/20 flex flex-col items-center justify-center p-1.5 relative overflow-hidden">
            <div className="w-full h-full rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col items-center justify-center relative">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#6366F1]"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#6366F1]"
                />
              </div>
              {/* Laptop Smile */}
              <div className="w-3 h-1 border-b-2 border-indigo-400 rounded-full mt-1" />
            </div>
          </div>

          {/* Laptop Base Keyboard */}
          <div className="w-24 h-3 bg-gradient-to-b from-slate-800 to-slate-900 border-x border-b border-indigo-500/40 rounded-b-md shadow-md relative flex items-center justify-center">
            <div className="w-6 h-1 rounded-full bg-slate-700" />
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-1.5 font-bold">Lappy</span>
        </motion.div>

        {/* 3. Tablet Character */}
        <motion.div
          variants={characterVariants}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="flex flex-col items-center relative"
        >
          {/* Tablet Body */}
          <div className="w-18 h-20 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-cyan-400/60 shadow-lg shadow-cyan-500/20 flex flex-col items-center justify-between p-2 relative overflow-hidden">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            {/* Screen */}
            <div className="w-full h-13 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]" />
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]" />
              </div>
              <div className="w-3.5 h-1 border-b-2 border-cyan-400 rounded-full mt-1" />
            </div>
            <div className="w-2 h-2 rounded-full border border-slate-700" />
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-1.5 font-bold">Tabby</span>
        </motion.div>

        {/* 4. Smartphone Character */}
        <motion.div
          variants={characterVariants}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.0, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          className="flex flex-col items-center relative"
        >
          {/* Phone Body */}
          <div className="w-13 h-18 rounded-xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-purple-500/60 shadow-lg shadow-purple-500/20 flex flex-col items-center justify-between p-1.5 relative overflow-hidden">
            <div className="w-3 h-1 rounded-full bg-slate-800" />
            {/* Screen */}
            <div className="w-full h-12 rounded-lg bg-slate-950 border border-slate-800 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2 }}
                  className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#A855F7]"
                />
                <motion.div
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2 }}
                  className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#A855F7]"
                />
              </div>
              <div className="w-2.5 h-0.5 border-b border-purple-400 rounded-full mt-1" />
            </div>
            <div className="w-1.5 h-1.5 rounded-full border border-slate-700" />
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-1.5 font-bold">Phony</span>
        </motion.div>
      </motion.div>

      {/* Decorative Features Pill List */}
      <div className="mt-8 pt-6 border-t border-slate-800/60 grid grid-cols-2 gap-3 text-[11px] font-mono text-slate-400 z-10 w-full max-w-xs">
        <div className="flex items-center gap-1.5 justify-center bg-slate-900/60 py-1.5 px-3 rounded-lg border border-slate-800">
          <span className="text-cyan-400">✓</span> 3D Web Systems
        </div>
        <div className="flex items-center gap-1.5 justify-center bg-slate-900/60 py-1.5 px-3 rounded-lg border border-slate-800">
          <span className="text-cyan-400">✓</span> Live Tracking
        </div>
      </div>
    </div>
  );
}
