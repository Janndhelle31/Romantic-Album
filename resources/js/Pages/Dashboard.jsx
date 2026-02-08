"use client";
import { useMemo, useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Countdown from '@/Components/Countdown';
import AppLayout from '@/Layouts/AppLayout';

export default function Dashboard({ albums, settings }) {
    const [isLoading, setIsLoading] = useState(true);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    }, []);

    return (
        <AppLayout hideControls={true}>
            <Head title={settings?.story_title || "The Archive"} />

            <AnimatePresence>
                {isLoading && (
                    <motion.div 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-[500] bg-white backdrop-blur-xl flex flex-col items-center justify-center"
                    >
                        <h2 className="font-serif text-2xl tracking-[0.2em] uppercase opacity-80">
                            {settings?.story_title || "The Archive"}
                        </h2>
                        <div className="mt-4 h-[1px] w-12 bg-current opacity-20 animate-pulse" />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div 
                className="fixed top-0 left-0 right-0 h-[2px] bg-current z-[100] origin-left opacity-10" 
                style={{ scaleX }} 
            />

            <main className="min-h-screen px-6 md:px-12 py-20 relative">
                <div className="max-w-7xl mx-auto z-10 relative">
                    
                    {/* MINIMALIST HEADER */}
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-32">
                        <div className="max-w-2xl">
                            <motion.span 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-serif uppercase tracking-[0.3em] text-xs opacity-40 mb-4 block"
                            >
                                {greeting} — {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </motion.span>
                            <h1 className="text-5xl md:text-8xl font-serif tracking-tighter leading-[0.9]">
                                {settings?.story_title || "The Archive"}
                            </h1>
                            <p className="font-handwriting text-2xl opacity-60 mt-6 italic">
                                {settings?.story_subtitle || "A curated collection of shared moments."}
                            </p>
                        </div>
                        
                        <div className="md:text-right">
                             <Countdown anniversaryDate={settings?.anniversary_date} />
                        </div>
                    </header>

                    {/* ASYMMETRIC CATALOG GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-y-32 md:gap-y-48">
                        {albums.map((album, index) => (
                            <motion.div 
                                key={album.id}
                                initial={{ opacity: 0, y: 40 }} 
                                whileInView={{ opacity: 1, y: 0 }} 
                                viewport={{ once: true, margin: "-10%" }}
                                className={`md:col-span-8 ${index % 2 === 0 ? 'md:col-start-1' : 'md:col-start-5 md:text-right'}`}
                            >
                                <Link 
                                    href={`/albums/${album.slug}`} 
                                    className={`group flex flex-col gap-6 ${index % 2 !== 0 ? 'md:items-end' : 'md:items-start'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="font-serif text-sm italic opacity-30">0{index + 1}</span>
                                        <div className="h-[1px] w-8 bg-current opacity-20" />
                                        <span className="font-serif uppercase tracking-[0.3em] text-[10px] opacity-40">
                                            Collection
                                        </span>
                                    </div>

                                    <div className="relative">
                                        <h2 className="text-5xl md:text-7xl font-serif tracking-tight group-hover:italic transition-all duration-500">
                                            {album.title}
                                        </h2>
                                        {/* Subtle floating icon */}
                                        <span className="absolute -top-6 -right-8 text-3xl opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500">
                                            {album.icon || '✦'}
                                        </span>
                                    </div>

                                    <p className="font-handwriting text-2xl md:text-3xl opacity-50 max-w-xl leading-relaxed">
                                        {album.description}
                                    </p>

                                    <div className="flex items-center gap-4 mt-4">
                                        <div className={`h-[1px] bg-current opacity-20 w-12 group-hover:w-24 transition-all duration-700`} />
                                        <span className="font-serif uppercase tracking-[0.2em] text-[10px] opacity-40 group-hover:opacity-100 transition-opacity">
                                            View Chapter
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* STRUCTURED FOOTER */}
                    <footer className="mt-64 pt-20 border-t border-current border-opacity-5 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="font-serif text-sm uppercase tracking-[0.3em] opacity-30">
                            Volume {new Date().getFullYear()}
                        </div>
                        <div className="font-serif text-xl italic opacity-60 group cursor-default">
                             End of <span className="group-hover:not-italic transition-all">Current Archive</span>
                        </div>
                        <div className="font-serif text-[10px] uppercase tracking-[0.3em] opacity-30">
                            Handcrafted with Love
                        </div>
                    </footer>
                </div>
            </main>
        </AppLayout>
    );
}