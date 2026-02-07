import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ClassyHearts() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    const heartColors = [
        "text-amber-500",   // Gold
        "text-yellow-600",  // Dark gold
        "text-stone-400",   // Stone
        "text-amber-300",   // Light gold
        "text-stone-300",   // Light stone
    ];

    const heartShapes = ["♥", "💎", "✨", "🌟", "💫"];

    return (
        /* 1. Ensure Z-index is higher than background but lower than UI */
        <div className="fixed inset-0 pointer-events-none z-[50] overflow-hidden">
            {[...Array(18)].map((_, i) => {
                const size = Math.random() * 20 + 16; 
                const color = heartColors[Math.floor(Math.random() * heartColors.length)];
                const shape = heartShapes[Math.floor(Math.random() * heartShapes.length)];
                const isSparkle = shape === "✨" || shape === "🌟" || shape === "💫";
                const leftPos = Math.random() * 100;
                
                return (
                    <motion.div
                        key={i}
                        initial={{ 
                            y: "110vh", // Start below screen
                            x: `${leftPos}%`, 
                            opacity: 0,
                            scale: 0.4,
                            rotate: -45
                        }}
                        animate={{ 
                            y: "-10vh", // Float upward
                            opacity: [0, 0.9, 0.9, 0],
                            scale: [0.4, 1.1, 1.1, 0.6],
                            rotate: isSparkle ? 720 : 315 
                        }}
                        transition={{ 
                            duration: Math.random() * 8 + 12, // Slow, dignified motion
                            repeat: Infinity, 
                            delay: Math.random() * 10,
                            ease: "linear"
                        }}
                        /* 2. Added a more refined gold glow */
                        className={`absolute ${color} drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]`}
                        style={{ fontSize: `${size}px` }}
                    >
                        {shape}
                    </motion.div>
                );
            })}
            
            {/* 3. Refined Overlay Elements */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>
            
            {/* Polka dot pattern scaled for higher visibility */}
            <div className="absolute inset-0 opacity-[0.07]"
                 style={{
                     backgroundImage: `radial-gradient(circle at 25% 25%, rgba(251,191,36,0.4) 1.5px, transparent 1.5px)`,
                     backgroundSize: '60px 60px'
                 }}>
            </div>
        </div>
    );
}