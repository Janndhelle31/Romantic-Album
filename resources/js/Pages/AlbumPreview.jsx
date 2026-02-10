"use client";
import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import AppLayout from '@/Layouts/DemoLayout'; 
import Polaroid from '@/Components/Polaroid';
import { getAlbumBySlug, getAllAlbums } from '@/lib/data';

export default function AlbumPreview({ slug }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6); 
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanding, setIsExpanding] = useState(false);
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [allAlbums, setAllAlbums] = useState([]);

  // Drag Interaction for the Lightbox
  const dragX = useMotionValue(0);
  const rotateWheel = useTransform(dragX, [-200, 200], [-20, 20]);

  // Load album data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load current album
        const albumData = getAlbumBySlug(slug);
        if (albumData) {
          setAlbum({
            id: albumData.id,
            title: albumData.title,
            slug: albumData.slug,
            description: albumData.description,
            icon: albumData.icon,
          });
          setPhotos(albumData.images || []);
        }

        // Load all albums for navigation
        const albums = getAllAlbums();
        setAllAlbums(albums);

      } catch (error) {
        console.error('Error loading album:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    loadData();
  }, [slug]);

  const handleSeeMore = () => {
    setIsExpanding(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 6, photos.length));
      setIsExpanding(false);
    }, 500);
  };

  const handleDragEnd = (_, info) => {
    if (!photos.length) return;
    
    if (info.offset.x < -80) {
      setSelectedIndex(prev => (prev + 1) % photos.length);
    }
    if (info.offset.x > 80) {
      setSelectedIndex(prev => (prev - 1 + photos.length) % photos.length);
    }
  };

  // If no album found
  if (!album && !isLoading) {
    return (
      <AppLayout hideControls={false} isPreview={true}>
        <Head title="Sample Not Found" />
        <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-6 opacity-30">🔍</div>
          <h1 className="text-3xl font-serif mb-4">Sample Album Not Found</h1>
          <p className="text-gray-600 mb-8 max-w-md">
            The sample album "{slug}" doesn't exist. Try one of these:
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {allAlbums.map(a => (
              <Link 
                key={a.slug}
                href={`/preview/album/${a.slug}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {a.title}
              </Link>
            ))}
          </div>
          <Link 
            href="/preview"
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            ← Back to All Samples
          </Link>
        </main>
      </AppLayout>
    );
  }

  // Find current album index for navigation
  const currentIndex = allAlbums.findIndex(a => a.slug === slug);
  const prevAlbum = currentIndex > 0 ? allAlbums[currentIndex - 1] : null;
  const nextAlbum = currentIndex < allAlbums.length - 1 ? allAlbums[currentIndex + 1] : null;

  return (
    <AppLayout hideControls={true} isPreview={true}>
      <Head title={`${album?.title || "Sample"} | Preview`} />
      
      {/* LOADING SCREEN */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[500] bg-white flex flex-col items-center justify-center"
          >
            <motion.div 
              animate={{ rotate: [0, 360] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }} 
              className="text-5xl mb-4 opacity-60"
            >
              📸
            </motion.div>
            <h2 className="font-serif text-lg tracking-wide opacity-60">
              Loading Sample Album...
            </h2>
            <div className="mt-4 h-1 w-32 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gray-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-screen p-4 md:p-8 relative">
        
        {/* LIGHTBOX */}
        <AnimatePresence>
          {selectedIndex !== null && photos[selectedIndex] && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[150] flex items-center justify-center p-4"
            >
              <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-md z-0" 
                onClick={() => setSelectedIndex(null)} 
              />
              
              <button 
                onClick={() => setSelectedIndex(null)} 
                className="absolute top-4 right-4 md:top-8 md:right-8 z-[170] text-3xl hover:scale-125 transition-transform opacity-60 hover:opacity-100 bg-white/80 rounded-full w-10 h-10 flex items-center justify-center"
              >
                ×
              </button>

              <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-8 md:gap-12 z-10">
                <motion.div 
                  key={photos[selectedIndex].id}
                  drag="x" 
                  dragConstraints={{ left: 0, right: 0 }}
                  style={{ x: dragX, rotate: rotateWheel }}
                  onDragEnd={handleDragEnd}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <Polaroid 
                    image={photos[selectedIndex].img} 
                    date={photos[selectedIndex].date} 
                    note={photos[selectedIndex].note} 
                    rotation={0} 
                    size="lg"
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl max-w-md"
                >
                  <span className="font-bold uppercase tracking-[0.2em] text-xs opacity-50 block mb-2">
                    Sample Photo • {selectedIndex + 1} of {photos.length}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif mb-4">{photos[selectedIndex].date}</h2>
                  <p className="font-handwriting text-2xl italic opacity-80 mb-6">"{photos[selectedIndex].note}"</p>
                  <div className="text-sm text-gray-600">
                    <p>This is a sample image from Unsplash. In the full version, you would see your own photos with personal dates and notes.</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT */}
        {album && (
          <div className={`max-w-6xl mx-auto transition-all duration-300 ${selectedIndex !== null ? 'blur-sm opacity-30' : ''}`}>
            
            {/* HEADER NAVIGATION */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-12">
              <Link 
                href="/preview" 
                className="font-handwriting text-xl opacity-60 hover:opacity-100 transition-all flex items-center gap-2 group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                <span>All Sample Albums</span>
              </Link>
              
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                <span>Preview Mode • {photos.length} sample images</span>
              </div>
              
              {/* Navigation between sample albums */}
              <div className="flex gap-2">
                {prevAlbum && (
                  <Link 
                    href={`/preview/album/${prevAlbum.slug}`}
                    className="px-3 py-1 text-xs border border-gray-200 rounded-full hover:border-gray-300 transition-colors"
                  >
                    ← Previous
                  </Link>
                )}
                {nextAlbum && (
                  <Link 
                    href={`/preview/album/${nextAlbum.slug}`}
                    className="px-3 py-1 text-xs border border-gray-200 rounded-full hover:border-gray-300 transition-colors"
                  >
                    Next →
                  </Link>
                )}
              </div>
            </div>

            {/* ALBUM HEADER */}
            <header className="text-center mb-16 md:mb-24">
              <motion.span 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: "spring" }}
                className="text-5xl md:text-6xl block mb-4"
              >
                {album.icon}
              </motion.span>
              <h1 className="text-4xl md:text-6xl font-serif italic tracking-tighter mb-3">
                {album.title}
              </h1>
              <p className="font-handwriting text-xl opacity-60 mt-3 max-w-2xl mx-auto px-4">
                {album.description}
              </p>
              
              {/* Preview Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Sample Album • Preview Only
              </motion.div>
            </header>

            {/* GALLERY GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 justify-items-center">
              {photos.slice(0, visibleCount).map((p, index) => (
                <motion.div 
                  key={p.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5 }}
                  onClick={() => setSelectedIndex(index)}
                  className="cursor-pointer hover:scale-[1.02] transition-transform duration-300 relative group"
                >
                  <Polaroid 
                    image={p.img} 
                    date={p.date} 
                    note={p.note} 
                    rotation={p.rot || 0}
                    size="md"
                  />
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    Click to preview
                  </div>
                </motion.div>
              ))}
            </div>

            {/* LOAD MORE */}
            {visibleCount < photos.length && (
              <div className="mt-20 md:mt-32 flex justify-center pb-16">
                <button 
                  onClick={handleSeeMore} 
                  disabled={isExpanding}
                  className="group flex flex-col items-center gap-3 transition-all disabled:opacity-50"
                >
                  <span className="font-serif uppercase tracking-[0.3em] text-xs opacity-40 group-hover:opacity-100 group-hover:tracking-[0.4em] transition-all">
                    {isExpanding ? 'Loading more samples...' : `Load ${Math.min(6, photos.length - visibleCount)} more`}
                  </span>
                  <div className="h-8 w-[1px] bg-current opacity-20 group-hover:h-12 group-hover:opacity-40 transition-all duration-500" />
                </button>
              </div>
            )}

            {/* PREVIEW CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 md:mt-24 mb-12 md:mb-20 p-6 md:p-10 bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-100 shadow-lg text-center max-w-3xl mx-auto"
            >
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-2xl md:text-3xl font-serif mb-4">Ready to Create Your Own?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                This is just a preview. Imagine this with <span className="font-semibold">your own photos</span>, 
                <span className="font-semibold"> your own memories</span>, and <span className="font-semibold">your own stories</span>.
                Create your personal memory archive today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link 
                  href={route('register')}
                  className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
                >
                  <span>📸</span>
                  Get Started
                </Link>
                <Link 
                  href="/preview"
                  className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 transition-colors font-medium"
                >
                  Explore More Samples
                </Link>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Create your account and start building your photo albums
              </p>
            </motion.div>

            {/* SAMPLE ALBUM NAVIGATION */}
            {allAlbums.length > 1 && (
              <div className="mb-16">
                <h4 className="font-serif text-lg text-center mb-6 opacity-60">Browse Other Sample Albums</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {allAlbums.map((a) => (
                    <Link
                      key={a.id}
                      href={`/preview/album/${a.slug}`}
                      className={`p-3 rounded-lg border transition-all text-center hover:shadow-md ${a.slug === slug ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className="text-2xl mb-2">{a.icon}</div>
                      <div className="font-serif text-sm truncate">{a.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{a.images?.length || 0} images</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </AppLayout>
  );
}