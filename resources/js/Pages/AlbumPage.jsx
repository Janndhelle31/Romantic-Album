"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout'; 
import Polaroid from '@/Components/Polaroid';
import { getAlbumBySlug } from '@/lib/data';

const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 600 : -600,
        opacity: 0,
        scale: 0.9,
        rotate: direction > 0 ? 12 : -12,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
            x: { type: "spring", stiffness: 300, damping: 32 },
            opacity: { duration: 0.4 }
        }
    },
    exit: (direction) => ({
        x: direction < 0 ? 600 : -600,
        opacity: 0,
        scale: 0.9,
        rotate: direction < 0 ? 12 : -12,
        transition: {
            x: { type: "spring", stiffness: 300, damping: 32 },
            opacity: { duration: 0.4 }
        }
    })
};

// Fast color extraction using tiny image
const extractDominantColor = (imgUrl) => {
    return new Promise((resolve) => {
        // Return a default warm color immediately (fallback)
        const fallbackColor = '#FFFBF0';
        
        // If no URL or it's a small placeholder, return fallback
        if (!imgUrl || imgUrl.includes('placeholder')) {
            resolve(fallbackColor);
            return;
        }
        
        const img = new Image();
        img.crossOrigin = "Anonymous";
        
        // Set timeout for safety
        const timeout = setTimeout(() => {
            resolve(fallbackColor);
        }, 300);
        
        img.onload = () => {
            clearTimeout(timeout);
            
            try {
                // Create a tiny canvas for performance
                const canvas = document.createElement('canvas');
                canvas.width = 10;
                canvas.height = 10;
                const ctx = canvas.getContext('2d');
                
                // Draw scaled down version for speed
                ctx.drawImage(img, 0, 0, 10, 10);
                
                // Sample 4 corner pixels and center
                const pixels = [
                    ctx.getImageData(0, 0, 1, 1).data,
                    ctx.getImageData(9, 0, 1, 1).data,
                    ctx.getImageData(0, 9, 1, 1).data,
                    ctx.getImageData(9, 9, 1, 1).data,
                    ctx.getImageData(5, 5, 1, 1).data
                ];
                
                // Average the colors
                let r = 0, g = 0, b = 0;
                pixels.forEach(pixel => {
                    r += pixel[0];
                    g += pixel[1];
                    b += pixel[2];
                });
                
                r = Math.floor(r / pixels.length);
                g = Math.floor(g / pixels.length);
                b = Math.floor(b / pixels.length);
                
                // Convert to hex
                const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                resolve(hexColor);
                
            } catch (error) {
                console.warn('Color extraction failed:', error);
                resolve(fallbackColor);
            }
        };
        
        img.onerror = () => {
            clearTimeout(timeout);
            resolve(fallbackColor);
        };
        
        img.src = imgUrl;
    });
};

export default function AlbumPage({ album, photos, sampleSlug = null }) {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [direction, setDirection] = useState(0); 
    const [visibleCount, setVisibleCount] = useState(6); 
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanding, setIsExpanding] = useState(false);
    const [displayAlbum, setDisplayAlbum] = useState(album);
    const [displayPhotos, setDisplayPhotos] = useState(photos);
    const [hasSwiped, setHasSwiped] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('#FFFBF0');
    const colorCache = useRef({});
    const isMounted = useRef(true);

    // Optimized handlers
    const paginate = useCallback((newDirection) => {
        if (!displayPhotos.length) return;
        setDirection(newDirection);
        setSelectedIndex((prev) => (prev + newDirection + displayPhotos.length) % displayPhotos.length);
    }, [displayPhotos.length]);

    const handleImageClick = useCallback((index) => {
        setDirection(0);
        setSelectedIndex(index);
        setHasSwiped(false);
    }, []);

    const handleLoadMore = useCallback(() => {
        setIsExpanding(true);
        setTimeout(() => {
            if (isMounted.current) {
                setVisibleCount(v => v + 6);
                setIsExpanding(false);
            }
        }, 600);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedIndex(null);
        setHasSwiped(false);
    }, []);

    useEffect(() => {
        isMounted.current = true;
        
        const path = window.location.pathname;
        if (path.includes('/sample-albums/') && sampleSlug) {
            const sampleAlbum = getAlbumBySlug(sampleSlug);
            if (sampleAlbum) {
                setDisplayAlbum(sampleAlbum);
                setDisplayPhotos(sampleAlbum.images || []);
            }
        } else if (album) {
            setDisplayAlbum(album);
            setDisplayPhotos(photos || []);
        }
        
        const timer = setTimeout(() => {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }, 1000);
        
        return () => {
            isMounted.current = false;
            clearTimeout(timer);
        };
    }, [album, photos, sampleSlug]);

    // Optimized background color update with debouncing
    useEffect(() => {
        if (selectedIndex !== null && displayPhotos[selectedIndex]?.img) {
            const updateColor = async () => {
                const imgUrl = displayPhotos[selectedIndex].img;
                
                // Check cache first
                if (colorCache.current[imgUrl]) {
                    setBackgroundColor(colorCache.current[imgUrl]);
                    return;
                }
                
                try {
                    const color = await extractDominantColor(imgUrl);
                    if (isMounted.current) {
                        colorCache.current[imgUrl] = color;
                        setBackgroundColor(color);
                    }
                } catch (error) {
                    if (isMounted.current) {
                        setBackgroundColor('#FFFBF0');
                    }
                }
            };
            
            updateColor();
        } else {
            // Reset to default when modal closes
            setBackgroundColor('#FFFBF0');
        }
    }, [selectedIndex, displayPhotos]);

    // Keyboard navigation - optimized with useCallback
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedIndex === null) return;
            
            switch(e.key) {
                case "ArrowRight":
                    setHasSwiped(true);
                    paginate(1);
                    break;
                case "ArrowLeft":
                    setHasSwiped(true);
                    paginate(-1);
                    break;
                case "Escape":
                    handleCloseModal();
                    break;
                default:
                    break;
            }
        };
        
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, paginate, handleCloseModal]);

    // Handle drag for swipe navigation
    const handleDragEnd = useCallback((_, info) => {
        const swipe = info.offset.x;
        if (Math.abs(swipe) > 50) {
            setHasSwiped(true);
            paginate(swipe < 0 ? 1 : -1);
        }
    }, [paginate]);

    return (
        <AppLayout hideControls={true}>
            <Head title={displayAlbum?.title || "Album"} />
            
            <AnimatePresence>
                {isLoading && (
                    <motion.div 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-[500] bg-[#FFFBF0] flex flex-col items-center justify-center"
                    >
                        <motion.div 
                            animate={{ y: [0, -10, 0] }} 
                            transition={{ repeat: Infinity, duration: 1.5 }} 
                            className="text-6xl mb-4"
                        >
                            {displayAlbum?.icon || "✨"}
                        </motion.div>
                        <h2 className="font-serif tracking-widest uppercase opacity-40">
                            Opening Archive
                        </h2>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background color layer */}
            <motion.div 
                className="fixed inset-0 z-0 transition-colors duration-1000 ease-in-out"
                style={{ backgroundColor }}
                animate={{ backgroundColor }}
            />

            {/* FUCKING RETURN TO LIBRARY BUTTON */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="fixed top-6 left-6 z-40"
            >
                <Link
                    href="/"
                    className="group flex items-center gap-2 text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors font-serif uppercase tracking-widest"
                >
                    <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                    Return to Library
                </Link>
            </motion.div>

            <main className="min-h-screen p-4 md:p-12 relative z-10">
                
                {/* MODAL VIEW */}
                <AnimatePresence initial={false} custom={direction}>
                    {selectedIndex !== null && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6"
                        >
                            {/* Semi-transparent overlay with reduced blur for performance */}
                            <div 
                                className="absolute inset-0 bg-black/50 backdrop-blur-md md:backdrop-blur-lg" 
                                onClick={handleCloseModal}
                            />
                            
                            <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-6 md:gap-12 z-10 pointer-events-none">
                                
                                {/* Photo Section */}
                                <div className="flex flex-col items-center gap-6 md:gap-8">
                                    <motion.div 
                                        key={selectedIndex}
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={0.8}
                                        onDragEnd={handleDragEnd}
                                        className="pointer-events-auto cursor-grab active:cursor-grabbing will-change-transform"
                                    >
                                        <Polaroid 
                                            image={displayPhotos[selectedIndex].img} 
                                            date={displayPhotos[selectedIndex].date} 
                                            note={displayPhotos[selectedIndex].note} 
                                            rotation={0} 
                                        />
                                    </motion.div>

                                    {/* HINT BELOW IMAGE */}
                                    <AnimatePresence>
                                        {!hasSwiped && (
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 0.4 }}
                                                exit={{ opacity: 0 }}
                                                className="pointer-events-none"
                                            >
                                                <span className="text-white text-[10px] uppercase tracking-[0.6em] font-serif">
                                                    « Swipe to navigate »
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Text Info Section */}
                                <motion.div 
                                    key={`text-${selectedIndex}`}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-1 pointer-events-auto text-center md:text-left px-4 md:px-0"
                                >
                                    <span className="text-white/70 uppercase tracking-[0.3em] text-[10px] mb-4 block">
                                        Memory {selectedIndex + 1} of {displayPhotos.length}
                                    </span>
                                    <h2 className="text-3xl md:text-5xl lg:text-8xl font-serif text-white mb-4 md:mb-6 leading-tight">
                                        {displayPhotos[selectedIndex].date}
                                    </h2>
                                    <p className="font-handwriting text-xl md:text-3xl lg:text-5xl italic text-white/90 leading-relaxed max-w-xl">
                                        "{displayPhotos[selectedIndex].note}"
                                    </p>
                                </motion.div>
                            </div>

                            <button 
                                onClick={handleCloseModal}
                                className="absolute top-6 md:top-10 right-6 md:right-10 z-[200] text-white/50 hover:text-white text-2xl md:text-3xl transition-colors"
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* MAIN GALLERY */}
                <motion.div
                    initial="hidden"
                    animate={isLoading ? "hidden" : "visible"}
                    className={`max-w-6xl mx-auto relative transition-all duration-500 ${
                        selectedIndex !== null ? 'blur-sm opacity-20' : 'opacity-100'
                    }`}
                >
                    <header className="text-center mb-16 md:mb-32 pt-8 md:pt-16">
                        <span className="text-5xl md:text-7xl block mb-6 md:mb-8">
                            {displayAlbum?.icon}
                        </span>
                        <h1 className="text-4xl md:text-7xl lg:text-9xl font-serif italic mb-4 md:mb-6 tracking-tighter text-gray-900">
                            {displayAlbum?.title}
                        </h1>
                        <p className="font-handwriting text-xl md:text-3xl text-gray-400 max-w-2xl mx-auto italic px-4">
                            {displayAlbum?.description}
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-16 md:gap-y-24 justify-items-center">
                        {displayPhotos.slice(0, visibleCount).map((p, index) => (
                            <motion.div 
                                key={p.id} 
                                onClick={() => handleImageClick(index)}
                                className="cursor-pointer hover:z-20 will-change-transform"
                                whileHover={{ y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Polaroid 
                                    image={p.img} 
                                    date={p.date} 
                                    note={p.note} 
                                    rotation={p.rot} 
                                />
                            </motion.div>
                        ))}
                    </div>

                    {visibleCount < displayPhotos.length && (
                        <div className="mt-24 md:mt-40 flex justify-center pb-20 md:pb-40">
                            <button 
                                onClick={handleLoadMore}
                                disabled={isExpanding}
                                className="group flex flex-col items-center gap-6 disabled:opacity-50"
                                aria-label="Load more memories"
                            >
                                <span className="font-serif uppercase tracking-[0.5em] text-[10px] text-gray-400 group-hover:text-gray-900 transition-colors">
                                    {isExpanding ? 'Revealing...' : 'More Memories'}
                                </span>
                                <div className="h-20 w-[1px] bg-gray-200 group-hover:bg-gray-900 group-hover:h-24 md:group-hover:h-32 transition-all duration-700" />
                            </button>
                        </div>
                    )}
                </motion.div>
            </main>
        </AppLayout>
    );
}