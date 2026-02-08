"use client";

import { useMemo, useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Countdown from '@/Components/Countdown';
import AppLayout from '@/Layouts/AppLayout';
import { getAllAlbums, sampleSettings as fallbackSettings, getSampleAlbumUrl } from '@/lib/data';

export default function Dashboard({ albums = [], settings = null }) {
    const [isLoading, setIsLoading] = useState(true);
    
    // Logic Gate: Do we have real data?
    const hasUserAlbums = useMemo(() => albums && albums.length > 0, [albums]);
    
    // Toggle for samples
    const [showSampleData, setShowSampleData] = useState(false);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const mergedSettings = useMemo(() => ({
        ...fallbackSettings,
        ...(settings || {})
    }), [settings]);

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            if (!hasUserAlbums) setShowSampleData(true);
        }, 1200);
        return () => clearTimeout(timer);
    }, [hasUserAlbums]);

    // Data Source Selection
    const displayAlbums = hasUserAlbums ? albums : (showSampleData ? getAllAlbums() : []);

    return (
        /* CRITICAL FIX: Pass hideControls=false so AppLayout renders ONE MusicPlayer */
        <AppLayout hideControls={false}>
            <Head title={mergedSettings.story_title} />

            {/* INITIAL LOADING COVER - This should hide the MusicPlayer temporarily */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-[600] bg-white flex flex-col items-center justify-center"
                    >
                        <h2 className="font-serif text-2xl tracking-[0.2em] uppercase opacity-80">
                            {mergedSettings.story_title}
                        </h2>
                        <div className="mt-4 h-[1px] w-12 bg-current opacity-20 animate-pulse" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress Bar - Only show after loading */}
            {!isLoading && (
                <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-current z-[500] origin-left opacity-10" style={{ scaleX }} />
            )}

            {/* Main Content - Only show after loading */}
            {!isLoading && (
                <main className="min-h-screen px-6 md:px-12 py-20 relative">
                    <div className="max-w-7xl mx-auto z-10 relative">
                        
                        {/* EDITORIAL HEADER */}
                        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-32">
                            <div className="max-w-2xl">
                                <span className="font-serif uppercase tracking-[0.3em] text-xs opacity-40 mb-4 block">
                                    {greeting} — {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </span>
                                <h1 className="text-5xl md:text-8xl font-serif tracking-tighter leading-[0.9]">
                                    {mergedSettings.story_title}
                                </h1>
                                <p className="font-handwriting text-2xl opacity-60 mt-6 italic">
                                    {mergedSettings.story_subtitle}
                                </p>
                            </div>
                            <div className="md:text-right">
                                <Countdown anniversaryDate={mergedSettings.anniversary_date} />
                            </div>
                        </header>

                        {/* MAIN CONTENT GRID */}
                        {displayAlbums.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-32 md:gap-y-48">
                                {displayAlbums.map((album, index) => (
                                    <motion.div 
                                        key={album.id || `sample-${index}`}
                                        initial={{ opacity: 0, y: 40 }} 
                                        whileInView={{ opacity: 1, y: 0 }} 
                                        viewport={{ once: true }}
                                        className={`md:col-span-8 ${index % 2 === 0 ? 'md:col-start-1' : 'md:col-start-5 md:text-right'}`}
                                    >
                                        <Link 
                                            href={hasUserAlbums ? `/albums/${album.slug}` : getSampleAlbumUrl(album.slug)} 
                                            className={`group flex flex-col gap-6 ${index % 2 !== 0 ? 'md:items-end' : 'md:items-start'}`}
                                        >
                                            <AlbumCard album={album} index={index} isSample={!hasUserAlbums} />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <EmptyArchiveState onShowSamples={() => setShowSampleData(true)} />
                        )}

                        {/* SAMPLE GALLERY */}
                        {!hasUserAlbums && showSampleData && (
                            <div className="mt-32 pt-16 border-t border-zinc-100">
                                <div className="text-center mb-12">
                                    <h3 className="text-2xl font-serif mb-4">Sample Gallery</h3>
                                    <p className="text-zinc-500 mb-8 font-serif italic">Inspiration for your first collection.</p>
                                    <button 
                                        onClick={() => setShowSampleData(false)} 
                                        className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                                    >
                                        Dismiss Samples
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {getAllAlbums().slice(0, 4).map((sample) => (
                                        <Link key={sample.id} href={getSampleAlbumUrl(sample.slug)} className="group space-y-3">
                                            <div className="aspect-[4/5] bg-zinc-50 rounded-lg overflow-hidden border border-zinc-100">
                                                <img 
                                                    src={sample.images?.[0]?.img} 
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" 
                                                    alt="" 
                                                />
                                            </div>
                                            <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">{sample.title}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        <ArchiveFooter />
                    </div>
                </main>
            )}
        </AppLayout>
    );
}

function AlbumCard({ album, index, isSample }) {
    const displayImages = useMemo(() => {
        if (isSample) {
            return album.images?.slice(0, 3).map(img => img.img) || [];
        }
        return album.preview_images?.slice(0, 3) || [];
    }, [album, isSample]);

    return (
        <>
            <div className="flex items-center gap-4">
                <span className="font-serif text-sm italic opacity-30">{(index + 1).toString().padStart(2, '0')}</span>
                <div className="h-[1px] w-8 bg-current opacity-20" />
                <span className="font-serif uppercase tracking-[0.3em] text-[10px] opacity-40">
                    {isSample ? 'Inspiration' : 'Archive'}
                </span>
            </div>
            
            <div className="relative">
                <h2 className="text-5xl md:text-7xl font-serif tracking-tight group-hover:italic transition-all duration-500">
                    {album.title}
                </h2>
                {album.icon && (
                    <span className="absolute -top-6 -right-8 text-3xl opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500">
                        {album.icon}
                    </span>
                )}
            </div>

            <p className="font-handwriting text-2xl md:text-3xl opacity-50 max-w-xl leading-relaxed">
                {album.description}
            </p>

            {displayImages.length > 0 && (
                <div className="mt-6 flex gap-3">
                    {displayImages.map((src, i) => (
                        <div 
                            key={i} 
                            className="relative w-28 h-20 rounded-lg overflow-hidden border border-zinc-100 shadow-sm group/img"
                        >
                            <img 
                                src={src} 
                                alt="" 
                                className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-700" 
                            />
                            <div className="absolute inset-0 bg-black/5 group-hover/img:bg-transparent transition-colors" />
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-4 mt-6">
                <div className="h-[1px] bg-current opacity-20 w-12 group-hover:w-24 transition-all duration-700" />
                <span className="font-serif uppercase tracking-[0.2em] text-[10px] opacity-40 group-hover:opacity-100 transition-opacity">
                    Explore {isSample ? 'Demo' : 'Memories'} {album.memories_count > 0 && `(${album.memories_count})`}
                </span>
            </div>
        </>
    );
}

function EmptyArchiveState({ onShowSamples }) {
    return (
        <div className="text-center py-32">
            <div className="text-6xl mb-8 opacity-10">📔</div>
            <h3 className="text-2xl font-serif mb-4 italic">A story yet to be told...</h3>
            <p className="text-zinc-500 max-w-md mx-auto mb-10 font-serif">
                Create your first album to begin documenting your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href={route('manage.index')} className="px-10 py-4 bg-black text-white text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all">
                    Create First Album
                </Link>
                <button onClick={onShowSamples} className="text-[10px] uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">
                    View Inspiration
                </button>
            </div>
        </div>
    );
}

function ArchiveFooter() {
    return (
        <footer className="mt-64 pt-20 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-8 pb-12">
            <div className="font-serif text-[10px] uppercase tracking-[0.3em] opacity-30">
                Volume {new Date().getFullYear()}
            </div>
            <div className="font-serif text-xl italic opacity-40 hover:opacity-100 transition-opacity cursor-default">
                Finis
            </div>
            <div className="font-serif text-[10px] uppercase tracking-[0.3em] opacity-30">
                Handcrafted Together
            </div>
        </footer>
    );
}