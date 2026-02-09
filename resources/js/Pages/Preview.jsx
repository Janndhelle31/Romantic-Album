"use client";

import { useMemo, useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Countdown from '@/Components/Countdown';
import AppLayout from '@/Layouts/AppLayout';
import { getAllAlbums, sampleSettings, getSampleAlbumUrl } from '@/lib/data';

export default function Preview() {
    const [isLoading, setIsLoading] = useState(true);
    
    // In Preview, we strictly use dummy data from our library
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
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AppLayout hideControls={false}>
            <Head title={`${settings.story_title} | Guest Preview`} />

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
                        <p className="mt-4 text-[10px] uppercase tracking-widest opacity-40">Loading Preview</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isLoading && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="relative bg-white text-zinc-900"
                >
                    {/* Progress Bar */}
                    <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-zinc-900 z-[500] origin-left opacity-10" style={{ scaleX }} />

                    <main className="min-h-screen px-6 md:px-12 py-20 relative">
                        <div className="max-w-7xl mx-auto z-10 relative">
                            
                            {/* HEADER */}
                            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-32">
                                <div className="max-w-2xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="font-serif uppercase tracking-[0.3em] text-xs opacity-40">
                                            {greeting} — Guest Visitor
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full border border-zinc-200 text-[8px] uppercase tracking-tighter text-zinc-400 font-bold">
                                            Demo Mode
                                        </span>
                                    </div>
                                    <h1 className="text-5xl md:text-8xl font-serif tracking-tighter leading-[0.9]">
                                        {settings.story_title}
                                    </h1>
                                    <p className="font-handwriting text-2xl opacity-60 mt-6 italic">
                                        {settings.story_subtitle}
                                    </p>
                                </div>
                                <div className="md:text-right">
                                    <Countdown anniversaryDate={settings.anniversary_date} />
                                </div>
                            </header>

                            {/* ALBUM GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-32 md:gap-y-48">
                                {displayAlbums.map((album, index) => (
                                    <motion.div 
                                        key={album.id}
                                        initial={{ opacity: 0, y: 40 }} 
                                        whileInView={{ opacity: 1, y: 0 }} 
                                        viewport={{ once: true }}
                                        className={`md:col-span-8 ${index % 2 === 0 ? 'md:col-start-1' : 'md:col-start-5 md:text-right'}`}
                                    >
                                        <Link 
                                            href={getSampleAlbumUrl(album.slug)} 
                                            className={`group flex flex-col gap-6 ${index % 2 !== 0 ? 'md:items-end' : 'md:items-start'}`}
                                        >
                                            <AlbumCard album={album} index={index} />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* PUBLIC CALL TO ACTION */}
                            <section className="mt-64 py-24 border-y border-zinc-100 text-center">
                                <h2 className="text-4xl font-serif mb-6 italic">Ready to document your own story?</h2>
                                <p className="text-zinc-500 mb-10 max-w-lg mx-auto font-serif">
                                    Join us today to start creating your personal archive of memories, music, and milestones.
                                </p>
                                <Link 
                                    href={route('register')} 
                                    className="inline-block px-12 py-5 bg-zinc-900 text-white text-[10px] uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all rounded-sm shadow-xl"
                                >
                                    Create Your Archive
                                </Link>
                            </section>

                            <ArchiveFooter />
                        </div>
                    </main>
                </motion.div>
            )}
        </AppLayout>
    );
}

function AlbumCard({ album, index }) {
    // Hardcoded to always use sample image logic
    const displayImages = album.images?.slice(0, 3).map(img => img.img) || [];

    return (
        <>
            <div className="flex items-center gap-4">
                <span className="font-serif text-sm italic opacity-30">{(index + 1).toString().padStart(2, '0')}</span>
                <div className="h-[1px] w-8 bg-zinc-900 opacity-20" />
                <span className="font-serif uppercase tracking-[0.3em] text-[10px] opacity-40">Sample Collection</span>
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

            <div className="mt-6 flex gap-3">
                {displayImages.map((src, i) => (
                    <div key={i} className="relative w-28 h-20 rounded-lg overflow-hidden border border-zinc-100 shadow-sm group/img">
                        <img src={src} className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-700" alt="" />
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-4 mt-6">
                <div className="h-[1px] bg-zinc-900 opacity-20 w-12 group-hover:w-24 transition-all duration-700" />
                <span className="font-serif uppercase tracking-[0.2em] text-[10px] opacity-40 group-hover:opacity-100 transition-opacity">
                    View Demo Story
                </span>
            </div>
        </>
    );
}

function ArchiveFooter() {
    return (
        <footer className="mt-32 pt-20 flex flex-col md:flex-row justify-between items-center gap-8 pb-12">
            <div className="font-serif text-[10px] uppercase tracking-[0.3em] opacity-30 text-zinc-900">
                &copy; {new Date().getFullYear()} — Guest Preview
            </div>
            <div className="font-serif text-xl italic opacity-40 hover:opacity-100 transition-opacity cursor-default text-zinc-900">
                Finis
            </div>
            <Link href={route('login')} className="font-serif text-[10px] uppercase tracking-[0.3em] opacity-30 hover:opacity-100 transition-opacity text-zinc-900">
                Member Sign In
            </Link>
        </footer>
    );
}