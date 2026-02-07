import { motion } from 'framer-motion';

export default function Header({ theme, greeting, title, subtitle }) {
  return (
    <header className="mb-20 relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-white/60 backdrop-blur-md text-xs font-bold tracking-[0.2em] mb-6 uppercase ${theme.accent}`}
      >
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current`}></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
        {greeting}
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-7xl sm:text-8xl md:text-9xl leading-none mb-4 tracking-tighter ${theme.fontSerif} ${theme.accent}`}
      >
        {title}
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`text-2xl md:text-3xl italic ${theme.fontAccent} ${theme.textMuted}`}
      >
        {subtitle}
      </motion.p>
    </header>
  );
}