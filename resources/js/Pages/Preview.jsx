"use client";

import { useMemo, useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Countdown from '@/Components/Countdown';
import AppLayout from '@/Layouts/AppLayout';
import { getAllAlbums, sampleSettings, getSampleAlbumUrl } from '@/lib/data';

export default function Preview() {
    const [isLoading, setIsLoading] = useState(true);
    const displayAlbums = useMemo(() => getAllAlbums(), []);
    const settings = sampleSettings;

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Morning";
        if (hour < 18) return "Afternoon";
        return "Evening";
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AppLayout hideControls={false}>
            <Head title={`${settings.story_title} | Guest Preview`} />

            <AnimatePresence>
                {isLoading && (
                    <motion.div 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-[600] bg-zinc-50 flex flex-col items-center justify-center text-zinc-900"
                    >
                        <h2 className="font-serif text-xl tracking-[0.2em] uppercase opacity-80 text-center px-6">
                            {settings.story_title}
                        </h2>
                        <div className="mt-4 h-[1px] w-8 bg-zinc-900 opacity-20 animate-pulse" />
                        <p className="mt-4 text-[9px] uppercase tracking-[0.2em] opacity-40">Opening Archive</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative transition-colors duration-700">
                    {/* Progress Bar */}
                    <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-current z-[500] origin-left opacity-20" style={{ scaleX }} />

                    {/* TOP THEME SELECTOR */}
                    <div className="sticky top-0 z-[400] w-full pt-4 pb-2 px-5 bg-inherit backdrop-blur-sm border-b border-current border-opacity-5">
                        <p className="text-[8px] uppercase tracking-[0.3em] opacity-40 mb-3 text-center md:text-left md:ml-2">Select Archive Aesthetic</p>
                        <ThemeToggle />
                    </div>

                    <main className="min-h-screen px-5 md:px-12 py-12 md:py-20 relative">
                        <div className="max-w-7xl mx-auto z-10 relative">
                            
                            {/* HEADER */}
                            <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 md:mb-32">
                                <div className="max-w-2xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="font-serif uppercase tracking-[0.3em] text-[9px] md:text-xs opacity-50">
                                            {greeting} — Guest
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full border border-current opacity-30 text-[7px] uppercase font-bold">
                                            Previewing
                                        </span>
                                    </div>
                                    <h1 className="text-5xl md:text-8xl font-serif tracking-tighter leading-[0.85] break-words">
                                        {settings.story_title}
                                    </h1>
                                    <p className="font-handwriting text-xl md:text-2xl opacity-60 mt-6 italic">
                                        {settings.story_subtitle}
                                    </p>
                                </div>
                                <div className="md:text-right scale-90 origin-left md:origin-right">
                                    <Countdown anniversaryDate={settings.anniversary_date} />
                                </div>
                            </header>

                            {/* ALBUM GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24 md:gap-y-48">
                                {displayAlbums.map((album, index) => (
                                    <motion.div 
                                        key={album.id}
                                        initial={{ opacity: 0, y: 20 }} 
                                        whileInView={{ opacity: 1, y: 0 }} 
                                        viewport={{ once: true, margin: "-10%" }}
                                        className={`md:col-span-8 ${index % 2 === 0 ? 'md:col-start-1' : 'md:col-start-5 md:text-right'}`}
                                    >
                                        <Link href={getSampleAlbumUrl(album.slug)} className={`group flex flex-col gap-5 ${index % 2 !== 0 ? 'md:items-end' : 'md:items-start'}`}>
                                            <AlbumCard album={album} index={index} />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* CTA SECTION - Revised Button Colors */}
                            <section className="mt-40 md:mt-64 py-16 md:py-24 border-y border-current border-opacity-10 text-center">
                                <h2 className="text-3xl md:text-4xl font-serif mb-4 md:mb-6 italic">Document your own story?</h2>
                                <p className="opacity-60 mb-8 md:mb-10 max-w-xs md:max-w-lg mx-auto font-serif text-sm px-4">
                                    Join us today to start creating your personal archive.
                                </p>
                                <Link 
                                    href={route('register')} 
                                    className="inline-block px-10 md:px-12 py-4 md:py-5 bg-zinc-900 text-white hover:bg-zinc-800 transition-colors text-[9px] md:text-[10px] uppercase tracking-[0.3em] rounded-sm"
                                >
                                    Create Archive
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

function ThemeToggle() {
    const themes = [
        { id: 'default', label: '🤍 Default' },
        { id: 'midnight', label: '🌙 Midnight' },
        { id: 'vintage', label: '📜 Vintage' },
        { id: 'nature', label: '🌿 Nature' },
        { id: 'classy', label: '💎 Classy' },
    ];

    const [currentTheme, setCurrentTheme] = useState('default');

    useEffect(() => {
        const saved = localStorage.getItem('userTheme');
        if (saved) setCurrentTheme(saved);
    }, []);

    const handleThemeChange = (id) => {
        localStorage.setItem('userTheme', id);
        window.location.reload(); 
    };

    return (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {themes.map((t) => (
                <button
                    key={t.id}
                    onClick={() => handleThemeChange(t.id)}
                    className={`
                        whitespace-nowrap px-5 py-2 rounded-full text-[9px] uppercase tracking-widest font-bold transition-all border
                        ${currentTheme === t.id 
                            ? 'bg-zinc-900 text-white border-transparent scale-105' 
                            : 'bg-transparent border-current border-opacity-10 opacity-60 hover:opacity-100'}
                    `}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
}

function AlbumCard({ album, index }) {
    const displayImages = album.images?.slice(0, 3).map(img => img.img) || [];
    return (
        <>
            <div className="flex items-center gap-3">
                <span className="font-serif text-xs italic opacity-30">{(index + 1).toString().padStart(2, '0')}</span>
                <div className="h-[1px] w-6 bg-current opacity-20" />
                <span className="font-serif uppercase tracking-[0.2em] text-[8px] opacity-40">Collection</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-serif tracking-tight leading-none transition-all group-hover:italic">{album.title}</h2>
            <p className="font-handwriting text-lg md:text-3xl opacity-50 max-w-xs md:max-w-xl leading-relaxed">{album.description}</p>
            <div className="mt-2 flex gap-2 md:gap-3 overflow-hidden">
                {displayImages.map((src, i) => (
                    <div key={i} className="relative w-20 h-14 md:w-28 md:h-20 rounded-md overflow-hidden border border-current border-opacity-10 flex-shrink-0">
                        <img src={src} className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0" alt="" />
                    </div>
                ))}
            </div>
        </>
    );
}

function ArchiveFooter() {
    return (
        <footer className="mt-24 md:mt-32 pt-10 pb-20 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 font-serif text-[9px] uppercase tracking-[0.2em]">
            <div>&copy; {new Date().getFullYear()} — Guest Preview</div>
            <div className="text-lg italic lowercase">finis</div>
            <Link href={route('login')} className="underline decoration-1 underline-offset-4">Member Sign In</Link>
        </footer>
    );
}