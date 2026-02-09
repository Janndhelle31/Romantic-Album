"use client";

import { useMemo, useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Countdown from '@/Components/Countdown';
import DemoLayout from '@/Layouts/DemoLayout';
import { getAllAlbums, sampleSettings, getSampleAlbumUrl } from '@/lib/data';

export default function Preview() {
  const [isLoading, setIsLoading] = useState(true);
  const [showThemeInstructions, setShowThemeInstructions] = useState(false);
  const themeInstructionsRef = useRef(null);
  
  // Get albums and settings
  const displayAlbums = useMemo(() => getAllAlbums(), []);
  const settings = sampleSettings;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    
    // Check if user has seen theme instructions
    const hasSeenThemeTip = localStorage.getItem('hasSeenThemeTip');
    if (!hasSeenThemeTip) {
      // Show instructions after a short delay
      setTimeout(() => setShowThemeInstructions(true), 1200);
    }
    
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss theme instructions after time
  useEffect(() => {
    if (showThemeInstructions) {
      const autoDismiss = setTimeout(() => {
        setShowThemeInstructions(false);
        localStorage.setItem('hasSeenThemeTip', 'true');
      }, 15000); // Dismiss after 15 seconds
      
      return () => clearTimeout(autoDismiss);
    }
  }, [showThemeInstructions]);

  // Close theme instructions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeInstructionsRef.current && !themeInstructionsRef.current.contains(event.target)) {
        setShowThemeInstructions(false);
        localStorage.setItem('hasSeenThemeTip', 'true');
      }
    };

    if (showThemeInstructions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showThemeInstructions]);

  const handleThemeButtonClick = () => {
    setShowThemeInstructions(false);
    localStorage.setItem('hasSeenThemeTip', 'true');
    // Theme switcher logic will be handled by DemoLayout
  };

  return (
    <DemoLayout 
      hideControls={true} 
      isPreview={true}
      onThemeButtonClick={handleThemeButtonClick}
    >
      <Head title={`${settings.story_title} | Preview`} />

      {/* LOADING COVER */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[600] bg-white flex flex-col items-center justify-center text-zinc-900"
          >
            <h2 className="font-serif text-2xl tracking-[0.2em] uppercase opacity-80">
              {settings.story_title}
            </h2>
            <div className="mt-4 h-[1px] w-12 bg-zinc-900 opacity-20 animate-pulse" />
            <p className="mt-4 text-[10px] uppercase tracking-widest opacity-40">Loading</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="relative min-h-screen"
        >
          {/* Progress Bar */}
          <motion.div className="fixed top-0 left-0 right-0 h-1 bg-current z-[500] origin-left opacity-20" style={{ scaleX }} />

          {/* Theme Instructions - Big and Visible */}
          <AnimatePresence>
            {showThemeInstructions && (
              <motion.div
                ref={themeInstructionsRef}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", damping: 25 }}
                className="fixed top-24 right-6 z-40 bg-white/95 backdrop-blur-md rounded-xl border border-zinc-200 shadow-xl p-4 max-w-xs animate-pulse-slow"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎨</span>
                    <div>
                      <h3 className="font-serif font-bold text-sm">Try Different Themes!</h3>
                      <p className="text-xs text-zinc-600 mt-1">
                        Click the theme button in the <strong>top-right corner</strong> to switch between designs
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowThemeInstructions(false);
                      localStorage.setItem('hasSeenThemeTip', 'true');
                    }}
                    className="text-zinc-400 hover:text-zinc-600 text-sm hover:scale-110 transition-transform"
                    aria-label="Close theme instructions"
                  >
                    ×
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-zinc-500">5 unique themes available</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowThemeInstructions(false);
                      localStorage.setItem('hasSeenThemeTip', 'true');
                    }}
                    className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Got it!
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <main className="min-h-screen px-4 sm:px-6 md:px-8 py-16 md:py-20 relative">
            <div className="max-w-6xl mx-auto z-10 relative">
              
              {/* HEADER */}
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-24 pt-12 md:pt-0">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
                    <span className="font-serif uppercase tracking-[0.2em] text-xs opacity-60">
                      {greeting} — Preview
                    </span>
                    <span className="px-2 py-0.5 rounded-full border border-current text-[8px] uppercase tracking-tighter opacity-70 font-bold">
                      Demo
                    </span>
                    {showThemeInstructions && (
                      <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-[8px] uppercase tracking-tighter font-bold flex items-center gap-1 animate-pulse">
                        <span>✨</span>
                        <span>Try Themes!</span>
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif tracking-tighter leading-[0.9]">
                    {settings.story_title}
                  </h1>
                  <p className="font-handwriting text-lg sm:text-xl opacity-60 mt-3 md:mt-4 italic">
                    {settings.story_subtitle}
                  </p>
                </div>
                <div className="md:text-right mt-4 md:mt-0">
                  <Countdown anniversaryDate={settings.anniversary_date} />
                </div>
              </header>

              {/* ALBUM GRID */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 sm:gap-y-20 md:gap-y-24">
                {displayAlbums.map((album, index) => (
                  <motion.div 
                    key={album.id}
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true, margin: "-50px" }}
                    className={`md:col-span-8 ${index % 2 === 0 ? 'md:col-start-1' : 'md:col-start-5 md:text-right'}`}
                  >
                    <Link 
                      href={getSampleAlbumUrl(album.slug)} 
                      className={`group flex flex-col gap-3 sm:gap-4 ${index % 2 !== 0 ? 'md:items-end' : 'md:items-start'}`}
                    >
                      <AlbumCard album={album} index={index} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <section className="mt-32 sm:mt-40 py-12 sm:py-16 border-y border-current/20 text-center">
                <h2 className="text-2xl sm:text-3xl font-serif mb-3 sm:mb-4 italic">Start Your Story</h2>
                <p className="opacity-70 mb-6 sm:mb-8 max-w-md mx-auto font-serif text-sm sm:text-base">
                  Create your personal archive with your own photos and memories.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
            <Link 
    href={route('register')} 
    className="px-6 sm:px-8 py-3 sm:py-4 text-white text-xs sm:text-[10px] uppercase tracking-[0.3em] hover:opacity-90 transition-all rounded-lg sm:rounded-sm shadow-lg hover:shadow-xl bg-blue-600" // Change to specific color
>
    Create Your Archive
</Link>
                  <Link 
                    href={route('login')} 
                    className="px-6 sm:px-8 py-3 sm:py-4 border border-current text-xs sm:text-[10px] uppercase tracking-[0.3em] transition-all rounded-lg sm:rounded-sm opacity-70 hover:opacity-100"
                  >
                    Sign In
                  </Link>
                </div>
                <p className="text-xs opacity-50">
                  First album free • No credit card required
                </p>
              </section>

              <ArchiveFooter />
            </div>
          </main>
          
          {/* Theme reminder when scrolling up */}
          <AnimatePresence>
            {showThemeInstructions && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30"
              >
                <div className="bg-black/80 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm">
                  <span className="flex items-center gap-2">
                    <span>🎨</span>
                    <span>Don't forget to try the themes!</span>
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </DemoLayout>
  );
}

function AlbumCard({ album, index }) {
  // Take first 3 images
  const displayImages = album.images?.slice(0, 3) || [];

  return (
    <div className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-transparent to-transparent/10 border border-current/20 transition-all duration-300 hover:scale-[1.01] group">
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="font-serif text-xs sm:text-sm italic opacity-30">{(index + 1).toString().padStart(2, '0')}</span>
        <div className="h-[1px] w-4 sm:w-6 opacity-20 bg-current" />
        <span className="font-serif uppercase tracking-[0.3em] text-[9px] sm:text-[10px] opacity-40">
          Sample
        </span>
      </div>
      
      <div className="relative mt-3 sm:mt-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-serif tracking-tight group-hover:italic transition-all duration-500">
          {album.title}
        </h2>
        {album.icon && (
          <span className="absolute -top-2 sm:-top-3 -right-3 sm:-right-4 text-xl sm:text-2xl opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500">
            {album.icon}
          </span>
        )}
      </div>

      <p className="font-handwriting text-base sm:text-lg md:text-xl opacity-60 mt-2 sm:mt-3 max-w-lg leading-relaxed">
        {album.description}
      </p>

      <div className="mt-3 sm:mt-4 flex gap-1.5 sm:gap-2">
        {displayImages.map((image, i) => (
          <div 
            key={image.id} 
            className="relative w-20 h-16 rounded-lg overflow-hidden border border-current/20 shadow-sm group/img transition-all duration-300"
          >
            <img 
              src={image.img} 
              className="w-full h-full object-cover grayscale transition-all duration-500 group-hover/img:grayscale-0"
              alt="" 
              loading="lazy"
              width={80}
              height={64}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
        <div className="h-[1px] opacity-20 w-6 sm:w-8 group-hover:w-12 sm:group-hover:w-16 transition-all duration-500 bg-current" />
        <span className="font-serif uppercase tracking-[0.2em] text-[9px] sm:text-[10px] opacity-40 group-hover:opacity-100 transition-opacity">
          View Demo
        </span>
      </div>
    </div>
  );
}

function ArchiveFooter() {
  return (
    <footer className="mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 pb-6 opacity-30 hover:opacity-100 transition-opacity">
      <div className="font-serif text-[9px] uppercase tracking-[0.3em]">
        &copy; {new Date().getFullYear()} — Preview
      </div>
      <div className="font-serif text-lg italic cursor-default">
        Finis
      </div>
      <Link href={route('login')} className="font-serif text-[9px] uppercase tracking-[0.3em]">
        Sign In
      </Link>
    </footer>
  );
}

// Add CSS styles for the animation
const styles = `
@keyframes pulse-slow {
  0%, 100% { 
    opacity: 1;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.1);
  }
  50% { 
    opacity: 0.95;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(59, 130, 246, 0.2);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}
`;

// Add styles to document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}