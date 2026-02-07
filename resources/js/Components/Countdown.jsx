import { useEffect, useState } from "react";
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from "framer-motion";

export default function Countdown({ anniversaryDate, theme }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

    useEffect(() => {
        if (!anniversaryDate) return;

        const calculateTime = () => {
            // FIX: Use proper Date parsing with UTC
            const [year, month, day] = anniversaryDate.split('-').map(Number);
            
            // Create date in local timezone (not UTC)
            const target = new Date(year, month - 1, day).getTime();
            const now = new Date().getTime();
            const distance = target - now;

            // Debug logging
            console.log('Anniversary Date:', anniversaryDate);
            console.log('Target:', new Date(year, month - 1, day));
            console.log('Now:', new Date(now));
            console.log('Distance (ms):', distance);
            console.log('Distance (days):', distance / (1000 * 60 * 60 * 24));

            if (isNaN(distance) || distance <= 0) {
                // If anniversary has passed, calculate for next year
                const nextYear = new Date(year + 1, month - 1, day).getTime();
                const nextDistance = nextYear - now;
                
                if (nextDistance > 0) {
                    setTimeLeft({
                        days: Math.floor(nextDistance / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((nextDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        mins: Math.floor((nextDistance % (1000 * 60 * 60)) / (1000 * 60)),
                        secs: Math.floor((nextDistance % (1000 * 60)) / 1000),
                    });
                } else {
                    setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
                }
                return;
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

    // If no anniversary date, show setup prompt
    if (!anniversaryDate) {
        return (
            <div className="text-center py-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-md mx-auto p-8 rounded-[2rem] border ${theme.card}`}
                >
                    <div className={`text-6xl mb-4 ${theme.accentText}`}>🎉</div>
                    <h3 className={`text-2xl font-serif font-bold mb-2 ${theme.titleText}`}>
                        No Anniversary Set Yet
                    </h3>
                    <p className={`mb-6 ${theme.bodyText}`}>
                        Celebrate your love story! Set your anniversary date to start the countdown.
                    </p>
                    <Link 
                        href="/settings" 
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 ${theme.accentBg} text-white`}
                    >
                        <span>Set Anniversary Date</span>
                        <span>→</span>
                    </Link>
                </motion.div>
            </div>
        );
    }

    // If the countdown shows crazy numbers, show error
    if (timeLeft.days > 36500) { // More than 100 years
        return (
            <div className="text-center py-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-md mx-auto p-8 rounded-[2rem] border ${theme.card}`}
                >
                    <div className={`text-6xl mb-4 ${theme.accentText}`}>⚠️</div>
                    <h3 className={`text-2xl font-serif font-bold mb-2 ${theme.titleText}`}>
                        Invalid Date Format
                    </h3>
                    <p className={`mb-6 ${theme.bodyText}`}>
                        Please check your anniversary date format. It should be YYYY-MM-DD.
                    </p>
                    <Link 
                        href="/settings" 
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 ${theme.accentBg} text-white`}
                    >
                        <span>Fix Anniversary Date</span>
                        <span>→</span>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex gap-3 md:gap-4 justify-center my-8">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div 
                    key={unit} 
                    className={`flex flex-col items-center p-3 md:p-5 rounded-[2rem] border transition-all duration-500 shadow-sm min-w-[80px] md:min-w-[100px] ${theme.card}`}
                >
                    <div className="overflow-hidden h-10 md:h-12">
                        <AnimatePresence mode="wait">
                            <motion.span 
                                key={value}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`block text-3xl md:text-5xl font-bold font-serif leading-none ${theme.accentText}`}
                            >
                                {value}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                    <span className={`text-[10px] uppercase tracking-[0.2em] font-bold mt-2 opacity-60 ${theme.bodyText}`}>
                        {unit}
                    </span>
                </div>
            ))}
        </div>
    );
}