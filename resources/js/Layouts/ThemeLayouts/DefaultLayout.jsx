"use client";

import { useMemo, useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';

// UPDATED PATHS BASED ON YOUR DIRECTORY
import MidnightLayout from '@/Layouts/ThemeLayouts/MidnightLayout';
import ClassyLayout from '@/Layouts/ThemeLayouts/ClassyLayout';
import VintageLayout from '@/Layouts/ThemeLayouts/VintageLayout';
import NatureLayout from '@/Layouts/ThemeLayouts/NatureLayout';
import DefaultLayout from '@/Layouts/ThemeLayouts/DefaultLayout';

import { getAllAlbums, sampleSettings } from '@/lib/data';

export default function Preview({ settings = null }) {
    const [isLoading, setIsLoading] = useState(true);
    const [currentTheme, setCurrentTheme] = useState('default'); 
    
    const displayAlbums = useMemo(() => getAllAlbums(), []);
    const mergedSettings = useMemo(() => ({ ...sampleSettings, ...settings }), [settings]);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    const layoutProps = {
        albums: displayAlbums,
        settings: mergedSettings,
        isDemo: true 
    };

    const themeOptions = [
        { id: 'default', label: 'Default', color: 'bg-zinc-400' },
        { id: 'midnight', label: 'Midnight', color: 'bg-slate-900' },
        { id: 'classy', label: 'Classy', color: 'bg-stone-800' },
        { id: 'vintage', label: 'Vintage', color: 'bg-amber-200' },
        { id: 'nature', label: 'Nature', color: 'bg-emerald-800' },
    ];

    return (
        <AppLayout hideControls={false}>
            <Head title={`${mergedSettings.story_title} | Experience Demo`} />

            {/* UPPER LEFT CONTROLS */}
            {!isLoading && (
                <div className="fixed top-6 left-6 z-[1000] flex flex-col gap-3">
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-zinc-200 shadow-2xl min-w-[190px]"
                    >
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-3 ml-2">
                            Switch Aesthetic
                        </p>
                        <div className="flex flex-col gap-1">
                            {themeOptions.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setCurrentTheme(t.id)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                                        currentTheme === t.id 
                                        ? 'bg-zinc-900 text-white shadow-lg scale-[1.02]' 
                                        : 'text-zinc-500 hover:bg-zinc-100'
                                    }`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${t.color} border border-black/10`} />
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-zinc-900 px-4 py-3 rounded-2xl shadow-xl max-w-[210px]"
                    >
                        <div className="flex items-start gap-2">
                            <span className="text-indigo-400 animate-pulse mt-0.5 text-xs">●</span>
                            <p className="text-[9px] uppercase tracking-wider leading-relaxed font-bold text-zinc-400">
                                Managed in Dashboard
                                <span className="block mt-1 normal-case font-medium text-zinc-500 italic">
                                    Users can switch between these themes instantly in their settings.
                                </span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* INITIAL LOADING COVER */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-[1100] bg-white flex flex-col items-center justify-center text-zinc-900"
                    >
                        <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mb-4" />
                        <h2 className="font-serif text-sm tracking-[0.2em] uppercase opacity-40">Loading Archive Demo</h2>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* DYNAMIC THEME ENGINE WITH CROSS-FADE */}
            <main className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentTheme}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                    >
                        {currentTheme === 'default' && <DefaultLayout {...layoutProps} />}
                        {currentTheme === 'midnight' && <MidnightLayout {...layoutProps} />}
                        {currentTheme === 'classy' && <ClassyLayout {...layoutProps} />}
                        {currentTheme === 'vintage' && <VintageLayout {...layoutProps} />}
                        {currentTheme === 'nature' && <NatureLayout {...layoutProps} />}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* JOIN CTA BUTTON */}
            {!isLoading && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] w-full flex justify-center px-4">
                    <Link 
                        href={route('register')}
                        className="bg-zinc-900 text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-zinc-800 hover:-translate-y-1 transition-all active:scale-95 whitespace-nowrap"
                    >
                        Create Your Own Story ✨
                    </Link>
                </div>
            )}
        </AppLayout>
    );
}