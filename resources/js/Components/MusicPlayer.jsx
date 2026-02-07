"use client";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MusicPlayer({ url, displayName, start, onComplete, skipCountdown, theme = "default" }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const [count, setCount] = useState(3);
    const audioRef = useRef(null);
    const constraintsRef = useRef(null);

    const audioSrc = url || "/music/bg-track.mp3";
    const songLabel = displayName || "Sunshine";

    // --- THEME CONFIGURATION ---
    const themeConfig = {
        nature: {
            loaderBg: "bg-[#FDFEFB]",
            loaderText: "text-[#7C9473]",
            playerBg: "from-green-50 to-emerald-50",
            playerBorder: "border-[#7C9473]",
            accent: "bg-[#7C9473]/20",
            icons: { walk1: "🌿", walk2: "🍃", heart: "🌸", note: "♩" },
            loaderIcon: "🌱"
        },
        classy: {
            loaderBg: "bg-[#FAF9F6]",
            loaderText: "text-[#A68966]",
            playerBg: "from-stone-50 to-neutral-100",
            playerBorder: "border-[#A68966]",
            accent: "bg-[#A68966]/10",
            icons: { walk1: "🥂", walk2: "✨", heart: "✦", note: "♬" },
            loaderIcon: "✦"
        },
        midnight: {
            loaderBg: "bg-[#0B0E14]",
            loaderText: "text-indigo-400",
            playerBg: "from-slate-900 to-indigo-950",
            playerBorder: "border-indigo-500",
            accent: "bg-indigo-500/20",
            icons: { walk1: "🌙", walk2: "🪐", heart: "✨", note: "🎵" },
            loaderIcon: "🌑"
        },
        vintage: {
            loaderBg: "bg-[#F4EBD0]",
            loaderText: "text-[#5D4037]",
            playerBg: "from-[#F4EBD0] to-[#E6D5B8]",
            playerBorder: "border-[#8B4513]",
            accent: "bg-[#8B4513]/10",
            icons: { walk1: "📜", walk2: "🎞️", heart: "🤎", note: "🎼" },
            loaderIcon: "🕰️"
        },
        default: {
            loaderBg: "bg-[#FFFBF0]",
            loaderText: "text-yellow-500",
            playerBg: "from-blue-50 to-yellow-50",
            playerBorder: "border-white",
            accent: "bg-yellow-200",
            icons: { walk1: "🚶‍♂️", walk2: "🚶‍♀️", heart: "❤️", note: "♫" },
            loaderIcon: "☀️"
        }
    };

    const s = themeConfig[theme] || themeConfig.default;

    // 1. PERSISTENT AUDIO HANDLING
    useEffect(() => {
        if (audioRef.current) {
            if (audioRef.current.src !== window.location.origin + audioSrc) {
                audioRef.current.load();
                if (isPlaying) {
                    audioRef.current.play().catch(e => console.log("Playback interrupted"));
                }
            }
        }
    }, [audioSrc]);

    // 2. ENTRY LOGIC
    useEffect(() => {
        if (start) {
            if (skipCountdown) {
                if (audioRef.current && audioRef.current.paused && isPlaying) {
                    audioRef.current.play().catch(() => console.log("Autoplay blocked"));
                }
                onComplete();
            } else {
                setShowCountdown(true);
            }
        }
    }, [start, skipCountdown]);

    // 3. COUNTDOWN TIMER
    useEffect(() => {
        let timer;
        if (showCountdown && count > 0) {
            timer = setTimeout(() => setCount(count - 1), 1000);
        } else if (showCountdown && count === 0) {
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.log("Audio blocked"));
                setIsPlaying(true);
            }
            timer = setTimeout(() => {
                setShowCountdown(false);
                onComplete();
            }, 800);
        }
        return () => clearTimeout(timer);
    }, [showCountdown, count, onComplete]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.log("Failed to play"));
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <>
            <audio ref={audioRef} src={audioSrc} loop />
            
            {/* THEMED COUNTDOWN */}
            <AnimatePresence>
                {showCountdown && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`fixed inset-0 z-[500] ${s.loaderBg} flex items-center justify-center`}
                    >
                        <motion.span 
                            key={count}
                            initial={{ scale: 2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className={`font-serif text-8xl md:text-[12rem] ${s.loaderText}`}
                        >
                            {count === 0 ? s.loaderIcon : count}
                        </motion.span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-[100]" />

            {/* THEMED PLAYER */}
            <AnimatePresence>
                {start && !showCountdown && (
                    <motion.div 
                        drag
                        dragConstraints={constraintsRef}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="fixed bottom-6 left-6 z-[101] pointer-events-auto cursor-grab active:cursor-grabbing touch-none"
                    >
                        <motion.div
                            onClick={togglePlay}
                            className={`relative w-32 h-14 md:w-48 md:h-20 bg-gradient-to-b ${s.playerBg} rounded-full border-[3px] md:border-4 ${s.playerBorder} shadow-2xl overflow-hidden flex items-center justify-center px-2 md:px-4 select-none`}
                        >
                            <motion.div 
                                animate={isPlaying ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0.1 }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className={`absolute inset-0 ${s.accent}`}
                            />

                            <div className="relative flex items-end justify-center gap-0.5 md:gap-1 pointer-events-none">
                                <motion.span
                                    animate={isPlaying ? { y: [0, -4, 0], rotate: [0, 5, -5, 0] } : {}}
                                    transition={{ duration: 0.6, repeat: Infinity }}
                                    className="text-2xl md:text-4xl"
                                >{s.icons.walk1}</motion.span>

                                <motion.span
                                    animate={isPlaying ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                    className="text-[10px] md:text-sm absolute -top-1 md:-top-2"
                                >{s.icons.heart}</motion.span>

                                <motion.span
                                    animate={isPlaying ? { y: [0, -4, 0], rotate: [0, -5, 5, 0] } : {}}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                                    className="text-2xl md:text-4xl"
                                >{s.icons.walk2}</motion.span>

                                {isPlaying && [1, 2].map((i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, x: 0, y: 0 }}
                                        animate={{ opacity: 1, x: -20, y: -15 }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.5 }}
                                        className={`absolute right-0 ${s.loaderText} text-[10px] md:text-sm`}
                                    >
                                        {s.icons.note}
                                    </motion.span>
                                ))}
                            </div>

                            <div className="absolute bottom-1 md:bottom-2 w-full text-center pointer-events-none px-2">
                                <span className="font-handwriting text-[8px] md:text-[10px] uppercase tracking-tighter md:tracking-widest text-gray-500 block truncate leading-none">
                                    {isPlaying ? songLabel : "Paused"}
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}