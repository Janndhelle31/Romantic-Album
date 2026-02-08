"use client";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

export default function FloatingClassy() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const heartData = useMemo(() => {
        const heartColors = ["text-amber-500", "text-yellow-600", "text-stone-400", "text-amber-300", "text-stone-300"];
        const heartShapes = ["♥", "💎", "✨", "🌟", "💫"];
        
        // Strict limit for mobile to ensure smooth scrolling
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const count = isMobile ? 8 : 15;

        return [...Array(count)].map((_, i) => ({
            id: i,
            size: Math.random() * 12 + 16,
            color: heartColors[Math.floor(Math.random() * heartColors.length)],
            shape: heartShapes[Math.floor(Math.random() * heartShapes.length)],
            left: Math.random() * 100,
            duration: Math.random() * 6 + 14, // Slower is more "classy" and easier on the CPU
            delay: Math.random() * 10,
        }));
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div 
            className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
            style={{ contain: 'strict' }}
        >
            {heartData.map((heart) => {
                const isSparkle = ["✨", "🌟", "💫"].includes(heart.shape);
                
                return (
                    <motion.div
                        key={heart.id}
                        initial={{ 
                            y: "110vh", 
                            x: `${heart.left}vw`, 
                            opacity: 0,
                            scale: 0.5 
                        }}
                        animate={{ 
                            y: "-15vh", 
                            opacity: [0, 0.7, 0.7, 0],
                            scale: [0.5, 1, 0.7],
                            rotate: isSparkle ? 360 : 0
                        }}
                        transition={{ 
                            duration: heart.duration,
                            repeat: Infinity, 
                            delay: heart.delay,
                            ease: "linear"
                        }}
                        // GPU acceleration
                        className={`absolute ${heart.color} will-change-transform transform-gpu`}
                        style={{ 
                            fontSize: `${heart.size}px`,
                            left: 0,
                            top: 0,
                            // CRITICAL: We avoid 'filter' and 'drop-shadow' here.
                            // If you need a glow, use a text-shadow which is slightly cheaper, 
                            // but for zero lag, no shadow is best.
                        }}
                    >
                        {heart.shape}
                    </motion.div>
                );
            })}
            
            {/* Overlay lines - static and high performance */}
            <div className="absolute top-0 left-0 right-0 h-px bg-amber-400/20" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-amber-400/20" />
            
            {/* Dot pattern - low opacity ensures it doesn't fight with the GPU layers */}
            <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(251,191,36,0.3) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}
            />
        </div>,
        document.body
    );
}