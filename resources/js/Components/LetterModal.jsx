import { motion } from "framer-motion";

export default function LetterModal({ onClose, data, theme = "default" }) {
  // Use the data passed via props directly
  // No more static fallbacks here
  const { recipient, message, closing, sender } = data || {};

  // Theme Configuration Object
  const themes = {
    nature: {
      bg: "bg-[#FDFEFB]",
      border: "border-[#7C9473]",
      accent: "text-[#4A5D45]",
      text: "text-[#3D443A]",
      lines: "rgba(124, 148, 115, 0.1)",
      font: "font-serif",
      decor: "🌿"
    },
    classy: {
      bg: "bg-white",
      border: "border-[#1A1A1A]",
      accent: "text-[#A68966]",
      text: "text-[#2D2D2D]",
      lines: "rgba(166, 137, 102, 0.05)",
      font: "font-serif uppercase tracking-tighter",
      decor: "✦"
    },
    midnight: {
      bg: "bg-[#0B0E14]",
      border: "border-[#334155]",
      accent: "text-[#818CF8]",
      text: "text-slate-300",
      lines: "rgba(129, 140, 248, 0.05)",
      font: "font-sans",
      decor: "✨"
    },
    vintage: {
      bg: "bg-[#F4EBD0]",
      border: "border-[#8B4513]",
      accent: "text-[#5D4037]",
      text: "text-[#4E342E]",
      lines: "rgba(139, 69, 19, 0.1)",
      font: "font-serif",
      decor: "📜"
    },
    default: {
      bg: "bg-[#fdfdfd]",
      border: "border-[#FF85A1]",
      accent: "text-[#FF85A1]",
      text: "text-gray-700",
      lines: "rgba(0, 0, 0, 0.1)",
      font: "font-serif",
      decor: "❤️"
    }
  };

  const activeTheme = themes[theme] || themes.default;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        onClick={onClose} 
      />

      {/* Letter Container */}
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg z-[510]"
      >
        <div className={`${activeTheme.bg} p-8 md:p-14 shadow-2xl rounded-sm border-t-[12px] ${activeTheme.border} relative max-h-[90vh] overflow-y-auto`}>
          
          {/* Theme-Specific Lined Paper Effect */}
          <div className="absolute inset-0 pointer-events-none" 
               style={{ 
                 backgroundImage: `linear-gradient(${activeTheme.lines} 1.5px, transparent 1.5px)`, 
                 backgroundSize: '100% 35px',
                 top: '25px' 
               }} />

          {/* Close Button */}
          <button 
            onClick={onClose} 
            className={`absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity ${activeTheme.accent}`}
          >
            ✕
          </button>

          <div className="relative z-10">
            {/* Theme Decor Icon */}
            <div className="text-2xl mb-4 opacity-50">{activeTheme.decor}</div>

            <h2 className={`text-3xl font-bold mb-6 italic ${activeTheme.accent} ${activeTheme.font}`}>
                {recipient},
            </h2>
            
            <div className={`font-handwriting text-2xl leading-[35px] space-y-4 ${activeTheme.text}`}>
              <p className="whitespace-pre-line">
                {message}
              </p>
              
              <div className="pt-8 text-right italic">
                <p className="opacity-70">{closing},</p>
                <p className={`${activeTheme.accent} text-4xl mt-2 font-bold`}>{sender}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}