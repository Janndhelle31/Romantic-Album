"use client";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

export default function FloatingVintage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const heartData = useMemo(() => {
        const vintageSymbols = ["♥", "❦", "❧", "♡"];
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const count = isMobile ? 6 : 12;
        
        return [...Array(count)].map((_, i) => ({
            id: i,
            symbol: vintageSymbols[i % vintageSymbols.length],
            left: Math.random() * 100,
            size: Math.random() * 10 + 20,
            duration: Math.random() * 10 + 15,
            delay: Math.random() * 15,
            initialRotate: Math.random() * 360
        }));
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div 
            className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
            style={{ 
                contain: 'strict', // Massive performance boost for scrolling
                transform: 'translateZ(0)' // Explicitly create a new GPU compositor layer
            }}
        >
            {heartData.map((heart) => (
                <motion.div
                    key={heart.id}
                    initial={{ 
                        y: "110vh", 
                        x: `${heart.left}vw`, 
                        opacity: 0,
                        scale: 0.4,
                        rotate: heart.initialRotate
                    }}
                    animate={{ 
                        y: "-15vh", 
                        opacity: [0, 0.25, 0.25, 0],
                        scale: [0.4, 1, 0.8],
                        rotate: heart.initialRotate + 360
                    }}
                    transition={{ 
                        duration: heart.duration, 
                        repeat: Infinity, 
                        delay: heart.delay, 
                        ease: "linear"
                    }}
                    className="absolute will-change-transform transform-gpu"
                    style={{ 
                        fontSize: `${heart.size}px`,
                        fontFamily: 'serif',
                        left: 0,
                        top: 0,
                        color: 'rgba(139, 69, 19, 0.25)' 
                    }}
                >
                    {heart.symbol}
                </motion.div>
            ))}
        </div>,
        document.body
    );
}