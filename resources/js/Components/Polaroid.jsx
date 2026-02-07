"use client";
import { motion } from 'framer-motion';

export default function Polaroid({ image, date, rotation }) {
  return (
    <div className="relative w-72 h-96 m-6">
      <motion.div
        className="relative w-full h-full"
        initial={{ rotateZ: rotation }}
        whileHover={{ 
          scale: 1.05, 
          rotateZ: 0,
          zIndex: 50,
          transition: { duration: 0.3 } 
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }}
      >
        {/* The Photo Container */}
        <div className="absolute inset-0 bg-white p-4 pb-12 shadow-[0_10px_30px_rgba(0,0,0,0.15)] rounded-sm border border-gray-100">
          <div className="w-full h-[85%] bg-gray-100 overflow-hidden relative group">
            <img 
              src={image} 
              alt="Memory" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            {/* Subtle gloss overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
          </div>
          
          <p className="mt-6 text-center font-handwriting text-3xl text-gray-800 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis px-2">
            {date}
          </p>
        </div>
      </motion.div>
    </div>
  );
}