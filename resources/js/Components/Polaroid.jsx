"use client";
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Polaroid({ image, date, rotation }) {
  const [isLandscape, setIsLandscape] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      // Check if image is landscape (width > height)
      setIsLandscape(img.naturalWidth > img.naturalHeight);
      setIsLoaded(true);
    };
  }, [image]);

  // Dynamic dimensions based on image orientation
  const polaroidClass = isLandscape 
    ? "w-96 h-72"  // Landscape: wider (96) than tall (72)
    : "w-72 h-96"; // Portrait: taller (96) than wide (72)

  // Dynamic photo container height based on orientation
  const photoHeightClass = isLandscape ? "h-[85%]" : "h-[85%]";
  const bottomPadding = isLandscape ? "pb-10" : "pb-12";
  
  // Adjust font size for landscape orientation
  const fontSizeClass = isLandscape ? "text-2xl" : "text-3xl";
  
  // Adjust margins
  const marginClass = isLandscape ? "mt-4" : "mt-6";

  return (
    <div className={`relative ${polaroidClass} m-6`}>
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
        <div className={`absolute inset-0 bg-white p-4 ${bottomPadding} shadow-[0_10px_30px_rgba(0,0,0,0.15)] rounded-sm border border-gray-100`}>
          <div className={`w-full ${photoHeightClass} bg-gray-100 overflow-hidden relative group`}>
            {isLoaded ? (
              <img 
                src={image} 
                alt="Memory" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            ) : (
              <div className="w-full h-full bg-gray-200 animate-pulse" />
            )}
            {/* Subtle gloss overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
          </div>
          
          <p className={`${marginClass} text-center font-handwriting ${fontSizeClass} text-gray-800 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis px-2`}>
            {date}
          </p>
        </div>
      </motion.div>
    </div>
  );
}