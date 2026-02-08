import { useEffect, useState } from "react";
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from "framer-motion";

export default function Countdown({ anniversaryDate }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

    useEffect(() => {
        if (!anniversaryDate) return;

        const calculateTime = () => {
            const [year, month, day] = anniversaryDate.split('-').map(Number);
            const target = new Date(year, month - 1, day).getTime();
            const now = new Date().getTime();
            let distance = target - now;

            // If anniversary has passed, calculate for next year
            if (isNaN(distance) || distance <= 0) {
                const nextYear = new Date(year + 1, month - 1, day).getTime();
                distance = nextYear - now;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                secs: Math.floor((distance % (1000 * 60)) / 1000),
            });
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [anniversaryDate]);

    // 1. SETUP PROMPT (When no date is set)
    if (!anniversaryDate) {
        return (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-12"
            >
                <Link href="/settings" className="group inline-flex flex-col items-center gap-3">
                    <span className="font-serif uppercase tracking-[0.3em] text-[10px] opacity-40 group-hover:opacity-100 transition-opacity">
                        Initialize Anniversary
                    </span>
                    <div className="h-10 w-[1px] bg-current opacity-20 group-hover:h-16 transition-all duration-500" />
                    <span className="font-handwriting text-xl italic opacity-60">Set your date →</span>
                </Link>
            </motion.div>
        );
    }

    // 2. MAIN COUNTDOWN (Minimalist Archival Style)
    return (
        <div className="flex flex-col items-center gap-8">
            <span className="font-serif uppercase tracking-[0.4em] text-[10px] opacity-40">
                Next Celebration In
            </span>

            <div className="flex gap-8 md:gap-16 justify-center">
                {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="flex flex-col items-center min-w-[60px]">
                        <div className="overflow-hidden h-12 md:h-16">
                            <AnimatePresence mode="wait">
                                <motion.span 
                                    key={value}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: "circOut" }}
                                    className="block text-4xl md:text-6xl font-serif italic opacity-80"
                                >
                                    {value}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                        <span className="font-handwriting text-lg md:text-xl opacity-40 lowercase mt-2">
                            {unit}
                        </span>
                    </div>
                ))}
            </div>

            <div className="h-[1px] w-12 bg-current opacity-10" />
        </div>
    );
}