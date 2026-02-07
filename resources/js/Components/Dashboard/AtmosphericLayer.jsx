import { motion } from 'framer-motion';

export default function AtmosphericLayer({ images = [], opacity = 0.15 }) {
  if (!images.length) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {images.map((p, idx) => (
        <motion.div
          key={p.id || idx}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: opacity, scale: 1 }}
          transition={{ duration: 1, delay: idx * 0.2 }}
          className="absolute w-32 md:w-64 bg-white p-2 pb-10 shadow-xl border border-white/50 rounded-sm"
          style={{ top: p.top, left: p.left, rotate: `${p.rotate}deg` }}
        >
          <img 
            src={p.src} 
            alt="" 
            className="w-full h-full object-cover grayscale-[30%]" 
          />
        </motion.div>
      ))}
    </div>
  );
}