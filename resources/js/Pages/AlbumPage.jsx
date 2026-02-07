"use client";
import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout'; 
import Polaroid from '@/Components/Polaroid';

export default function AlbumPage({ album, photos }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6); 
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanding, setIsExpanding] = useState(false);

  // Drag Interaction for the Lightbox
  const dragX = useMotionValue(0);
  const rotateWheel = useTransform(dragX, [-250, 250], [-30, 30]);
  const verticalSlope = useTransform(dragX, [-250, 0, 250], [60, 0, 60]);
  const opacityWheel = useTransform(dragX, [-300, -200, 0, 200, 300], [0, 0.5, 1, 0.5, 0]);

  useEffect(() => {
    // Shorter timer to respect the AppLayout's own entrance animations
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSeeMore = () => {
    setIsExpanding(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 6);
      setIsExpanding(false);
    }, 800);
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -100) setSelectedIndex(prev => (prev + 1) % photos.length);
    if (info.offset.x > 100) setSelectedIndex(prev => (prev - 1 + photos.length) % photos.length);
  };

  return (
    // We pass the album theme directly to the layout
    <AppLayout theme={album.theme}>
      <Head title={album.title} />
      
      {/* 1. ADAPTIVE LOADING SCREEN */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            exit={{ opacity: 0 }} 
            // We use 'bg-inherit' or transparent to let AppLayout's background stay visible
            className="fixed inset-0 z-[500] bg-white/10 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 1.5 }} 
              className="text-6xl mb-6"
            >
              {album.icon || "✨"}
            </motion.div>
            <h2 className="font-serif text-xl tracking-widest uppercase opacity-60">
              {album.title}
            </h2>
            <p className="font-handwriting text-lg mt-2 italic opacity-40">Opening archive...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-screen p-4 md:p-12 relative">
        
        {/* 2. THE LIGHTBOX */}
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              {/* Overlay that adapts to light/dark themes via mix-blend-mode */}
              <div className="absolute inset-0 bg-black/20 backdrop-blur-3xl z-0" onClick={() => setSelectedIndex(null)} />
              
              <button onClick={() => setSelectedIndex(null)} className="absolute top-8 right-8 z-[170] text-4xl hover:scale-125 transition-transform opacity-50 hover:opacity-100">×</button>

              <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-12 z-10 pointer-events-none text-left">
                <motion.div 
                  key={photos[selectedIndex].id}
                  drag="x" dragConstraints={{ left: 0, right: 0 }}
                  style={{ x: dragX, rotate: rotateWheel, y: verticalSlope, opacity: opacityWheel }}
                  onDragEnd={handleDragEnd}
                  className="pointer-events-auto cursor-grab active:cursor-grabbing"
                >
                  <Polaroid 
                    image={photos[selectedIndex].img} 
                    date={photos[selectedIndex].date} 
                    note={photos[selectedIndex].note} 
                    rotation={0} 
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 pointer-events-auto">
                  <span className="font-bold uppercase tracking-[0.3em] text-[10px] opacity-50">{album.title}</span>
                  <h2 className="text-5xl md:text-7xl font-serif mt-2 mb-6">{photos[selectedIndex].date}</h2>
                  <p className="font-handwriting text-3xl md:text-4xl italic opacity-80">"{photos[selectedIndex].note}"</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. MAIN GALLERY CONTENT */}
        <div className={`max-w-6xl mx-auto z-10 relative transition-all duration-700 ${selectedIndex !== null ? 'blur-xl scale-95 opacity-50' : ''}`}>
          
          <Link href={route('dashboard')} className="font-handwriting text-2xl opacity-60 hover:opacity-100 mb-12 inline-block transition-all">
            ← Return to Library
          </Link>

          <header className="text-center mb-24">
            <motion.span 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className="text-6xl block mb-6"
            >
              {album.icon}
            </motion.span>
            <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter mb-4">
              {album.title}
            </h1>
            <p className="font-handwriting text-2xl opacity-60 mt-4 max-w-2xl mx-auto">
              {album.description}
            </p>
          </header>

          {/* GALLERY GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 justify-items-center">
            {photos.slice(0, visibleCount).map((p, index) => (
              <motion.div 
                key={p.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                onClick={() => setSelectedIndex(index)}
                className="cursor-pointer hover:z-20"
              >
                <Polaroid image={p.img} date={p.date} note={p.note} rotation={p.rot} />
              </motion.div>
            ))}
          </div>

          {/* LOAD MORE */}
          {visibleCount < photos.length && (
              <div className="mt-32 flex justify-center pb-24">
                  <button 
                    onClick={handleSeeMore} 
                    className="group flex flex-col items-center gap-4 transition-all"
                  >
                    <span className="font-serif uppercase tracking-[0.4em] text-[10px] opacity-40 group-hover:opacity-100">
                      {isExpanding ? 'Loading...' : 'Deepen the story'}
                    </span>
                    <div className="h-12 w-[1px] bg-current opacity-20 group-hover:h-20 transition-all duration-500" />
                  </button>
              </div>
          )}
        </div>
      </main>
    </AppLayout>
  );
}