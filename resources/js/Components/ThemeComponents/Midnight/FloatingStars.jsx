"use client";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

export default function FloatingStars() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 1. CONFIGURATION (Memoized to prevent calculation during scroll)
    const cosmicData = useMemo(() => {
        const starColors = ["#ffffff", "#c7d2fe", "#dbeafe", "#e9d5ff", "#cffafe"];
        const starShapes = ["✦", "✧", "★", "✷", "•"];
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        
        // Drifting Orbs
        const driftCount = isMobile ? 8 : 18;
        const drift = [...Array(driftCount)].map((_, i) => ({
            id: `drift-${i}`,
            size: Math.random() * 8 + 10,
            color: starColors[i % starColors.length],
            shape: starShapes[i % starShapes.length],
            left: Math.random() * 100,
            duration: Math.random() * 15 + 20,
            delay: Math.random() * 15,
        }));

        // Static Twinklers (Simplified to dots)
        const staticCount = isMobile ? 15 : 30;
        const staticStars = [...Array(staticCount)].map((_, i) => ({
            id: `static-${i}`,
            left: Math.random() * 100,
            top: Math.random() * 100,
            duration: 2 + Math.random() * 3,
            delay: Math.random() * 5,
        }));

        return { drift, staticStars };
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div 
            className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
            style={{ contain: 'strict', transform: 'translateZ(0)' }}
        >
            {/* 1. DRIFTING COSMIC ORBS */}
            {cosmicData.drift.map((star) => (
                <motion.div
                    key={star.id}
                    initial={{ y: "110vh", x: `${star.left}vw`, opacity: 0, scale: 0.3 }}
                    animate={{ 
                        y: "-15vh", 
                        opacity: [0, 0.6, 0.6, 0],
                        scale: [0.3, 1, 0.3],
                        rotate: 360
                    }}
                    transition={{ 
                        duration: star.duration,
                        repeat: Infinity, 
                        delay: star.delay,
                        ease: "linear"
                    }}
                    className="absolute will-change-transform transform-gpu"
                    style={{ 
                        fontSize: `${star.size}px`, 
                        color: star.color,
                        left: 0, top: 0 
                    }}
                >
                    {star.shape}
                </motion.div>
            ))}
            
            {/* 2. STATIC TWINKLING BACKGROUND STARS (No box-shadow) */}
            {cosmicData.staticStars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute w-[3px] h-[3px] bg-indigo-200 rounded-full will-change-transform transform-gpu"
                    style={{ left: `${star.left}%`, top: `${star.top}%` }}
                    animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.4, 1] }}
                    transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
                />
            ))}

            {/* 3. SHOOTING STARS (Single optimized streak) */}
            <motion.div
                initial={{ x: "-20vw", y: "20vh", opacity: 0 }}
                animate={{ x: "110vw", y: "60vh", opacity: [0, 1, 0] }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 12,
                    ease: "easeIn"
                }}
                className="absolute w-32 h-[1px] bg-gradient-to-r from-transparent via-indigo-300 to-white -rotate-[25deg] will-change-transform transform-gpu"
                style={{ left: 0, top: 0 }}
            />
        </div>,
        document.body
    );
}