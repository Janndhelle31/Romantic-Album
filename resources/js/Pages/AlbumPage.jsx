"use client";
import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout'; 
import Polaroid from '@/Components/Polaroid';
import { getSampleAlbumBySlug } from '@/lib/data';

export default function AlbumPage({ album, photos, isSample = false, sampleSlug = null }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6); 
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanding, setIsExpanding] = useState(false);
  const [displayAlbum, setDisplayAlbum] = useState(album);
  const [displayPhotos, setDisplayPhotos] = useState(photos);
  const [isSampleAlbum, setIsSampleAlbum] = useState(false);

  // Drag Interaction for the Lightbox
  const dragX = useMotionValue(0);
  const rotateWheel = useTransform(dragX, [-250, 250], [-30, 30]);
  const verticalSlope = useTransform(dragX, [-250, 0, 250], [60, 0, 60]);
  const opacityWheel = useTransform(dragX, [-300, -200, 0, 200, 300], [0, 0.5, 1, 0.5, 0]);

  useEffect(() => {
    // Check URL to determine if this is a sample album
    const path = window.location.pathname;
    const isSampleRoute = path.includes('/sample-albums/');
    
    if (isSampleRoute && sampleSlug) {
      // This is a sample album route - load from lib/data
      const sampleAlbum = getSampleAlbumBySlug(sampleSlug);
      if (sampleAlbum) {
        setDisplayAlbum({
          id: sampleAlbum.id,
          title: sampleAlbum.title,
          slug: sampleAlbum.slug,
          description: sampleAlbum.description,
          icon: sampleAlbum.icon,
          theme: sampleAlbum.theme,
        });
        setDisplayPhotos(sampleAlbum.images || []);
        setIsSampleAlbum(true);
      }
    } else if (album) {
      // This is a real user album - use data from database
      setDisplayAlbum(album);
      setDisplayPhotos(photos || []);
      setIsSampleAlbum(false);
    }

    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [album, photos, isSample, sampleSlug]);

  const handleSeeMore = () => {
    setIsExpanding(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 6);
      setIsExpanding(false);
    }, 800);
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -100) setSelectedIndex(prev => (prev + 1) % displayPhotos.length);
    if (info.offset.x > 100) setSelectedIndex(prev => (prev - 1 + displayPhotos.length) % displayPhotos.length);
  };

  // If no album to display
  if (!displayAlbum && !isLoading) {
    return (
      <AppLayout hideControls={true}>
        <Head title="Album Not Found" />
        <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-6 opacity-30">📔</div>
          <h1 className="text-3xl font-serif mb-4">Album Not Found</h1>
          <p className="text-gray-600 mb-8 max-w-md">
            This album doesn't exist yet. You can create it or explore sample albums.
          </p>
          <div className="flex gap-4">
            <Link 
              href={route('dashboard')}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Return to Library
            </Link>
            <Link 
              href={route('manage.index')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Create New Album
            </Link>
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout hideControls={true}>
      <Head title={displayAlbum?.title || "Album"} />
      
     
      
      {/* LOADING SCREEN */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[500] bg-white/10 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 1.5 }} 
              className="text-6xl mb-6"
            >
              {displayAlbum?.icon || "✨"}
            </motion.div>
            <h2 className="font-serif text-xl tracking-widest uppercase opacity-60">
              {displayAlbum?.title || "Loading..."}
            </h2>
            <p className="font-handwriting text-lg mt-2 italic opacity-40">
              {isSampleAlbum ? "Loading sample content..." : "Opening archive..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-screen p-4 md:p-12 relative">
        
        {/* LIGHTBOX */}
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-3xl z-0" onClick={() => setSelectedIndex(null)} />
              
              <button onClick={() => setSelectedIndex(null)} className="absolute top-8 right-8 z-[170] text-4xl hover:scale-125 transition-transform opacity-50 hover:opacity-100">×</button>

              <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-12 z-10 pointer-events-none text-left">
                <motion.div 
                  key={displayPhotos[selectedIndex]?.id}
                  drag="x" dragConstraints={{ left: 0, right: 0 }}
                  style={{ x: dragX, rotate: rotateWheel, y: verticalSlope, opacity: opacityWheel }}
                  onDragEnd={handleDragEnd}
                  className="pointer-events-auto cursor-grab active:cursor-grabbing"
                >
                  <Polaroid 
                    image={displayPhotos[selectedIndex]?.img} 
                    date={displayPhotos[selectedIndex]?.date} 
                    note={displayPhotos[selectedIndex]?.note} 
                    rotation={0} 
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 pointer-events-auto">
                  <span className="font-bold uppercase tracking-[0.3em] text-[10px] opacity-50">{displayAlbum?.title}</span>
                  <h2 className="text-5xl md:text-7xl font-serif mt-2 mb-6">{displayPhotos[selectedIndex]?.date}</h2>
                  <p className="font-handwriting text-3xl md:text-4xl italic opacity-80">"{displayPhotos[selectedIndex]?.note}"</p>
                  {isSampleAlbum && (
                    <div className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg inline-block text-sm">
                      Sample Image • {selectedIndex + 1} of {displayPhotos.length}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT */}
        {displayAlbum && (
          <div className={`max-w-6xl mx-auto z-10 relative transition-all duration-700 ${selectedIndex !== null ? 'blur-xl scale-95 opacity-50' : ''}`}>
            
            <div className="flex items-center justify-between mb-12">
              <Link href={route('dashboard')} className="font-handwriting text-2xl opacity-60 hover:opacity-100 transition-all flex items-center gap-2">
                <span>←</span>
                <span>Return to Library</span>
              </Link>
              
              {isSampleAlbum && (
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  <span>Sample Content • {displayPhotos.length} images</span>
                </div>
              )}
              
              {/* For real albums, show memory count */}
              {!isSampleAlbum && album?.memories_count && (
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>{album.memories_count} memories</span>
                </div>
              )}
            </div>

            <header className="text-center mb-24">
              <motion.span 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="text-6xl block mb-6"
              >
                {displayAlbum.icon}
              </motion.span>
              <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter mb-4">
                {displayAlbum.title}
              </h1>
              <p className="font-handwriting text-2xl opacity-60 mt-4 max-w-2xl mx-auto">
                {displayAlbum.description}
              </p>
              
              {/* Only show sample CTA for sample albums */}
              {isSampleAlbum && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 inline-flex flex-col gap-4 items-center"
                >
                  <div className="text-sm text-gray-600 max-w-md">
                    This is a sample album using Unsplash images. Replace with your own memories!
                  </div>
                  <Link 
                    href={route('manage.index')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl"
                  >
                    ✨ Create Your Own Album
                  </Link>
                </motion.div>
              )}
            </header>

            {/* GALLERY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 justify-items-center">
              {displayPhotos.slice(0, visibleCount).map((p, index) => (
                <motion.div 
                  key={p.id} 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  onClick={() => setSelectedIndex(index)}
                  className="cursor-pointer hover:z-20 group relative"
                >
                  <Polaroid image={p.img} date={p.date} note={p.note} rotation={p.rot} />
                  {isSampleAlbum && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      Sample
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* LOAD MORE */}
            {visibleCount < displayPhotos.length && (
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

            {/* CREATE YOUR OWN CTA - Only for sample albums */}
            {isSampleAlbum && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-32 mb-24 p-12 bg-gradient-to-br from-white to-blue-50 rounded-3xl border border-blue-100 shadow-lg text-center max-w-4xl mx-auto"
              >
                <div className="text-5xl mb-6">🎁</div>
                <h3 className="text-3xl font-serif mb-6">Ready to Tell Your Own Story?</h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                  This sample shows what's possible. Imagine replacing these images with your own photos, 
                  your own dates, your own memories. Your love story is unique - let's preserve it.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link 
                    href={route('manage.index')}
                    className="px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-lg flex items-center gap-3"
                  >
                    <span>📸</span>
                    Start Creating Your Album
                  </Link>
                  <Link 
                    href={route('dashboard')}
                    className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 transition-colors font-medium"
                  >
                    Explore More Samples
                  </Link>
                </div>
                <p className="text-sm text-gray-500 mt-6">
                  Your first album takes just 2 minutes to create
                </p>
              </motion.div>
            )}
          </div>
        )}
      </main>
    </AppLayout>
  );
}