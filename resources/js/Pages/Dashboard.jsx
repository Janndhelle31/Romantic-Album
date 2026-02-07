import { useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Countdown from '@/Components/Countdown';
import AppLayout from '@/Layouts/AppLayout';

const THEME_CONFIG = {
    default: {
        mainBg: "bg-[#FFFBF0]",
        accentText: "text-[#FF85A1]",
        accentBg: "bg-pink-500",
        progressBar: "from-pink-200 via-[#FF85A1] to-pink-300",
        card: "bg-white/50 border-white/80 hover:shadow-pink-200/50",
        titleText: "text-gray-800",
        bodyText: "text-gray-500",
        selection: "selection:bg-pink-200"
    },
    midnight: {
        mainBg: "bg-transparent", 
        accentText: "text-indigo-400",
        accentBg: "bg-indigo-600",
        progressBar: "from-indigo-900 via-indigo-500 to-purple-500",
        card: "bg-white/5 border-white/10 hover:shadow-indigo-500/20 backdrop-blur-xl",
        titleText: "text-white",
        bodyText: "text-slate-400",
        selection: "selection:bg-indigo-900"
    }
};

const Dashboard = ({ albums, settings }) => {
    const { props } = usePage();
    
    const currentTheme = props.auth?.user?.theme || 'default';
    const theme = THEME_CONFIG[currentTheme] || THEME_CONFIG.default;

    const { scrollY } = useScroll();
    const scaleX = useSpring(useTransform(scrollY, [0, 1000], [0, 1]), {
        stiffness: 100, damping: 30, restDelta: 0.001
    });

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning, Love";
        if (hour < 18) return "Good Afternoon, Love";
        return "Good Evening, Love";
    }, []);

    return (
        <main className={`relative min-h-screen flex flex-col items-center py-12 md:py-24 px-4 transition-colors duration-1000 ${theme.mainBg} ${theme.selection}`}>
            <Head title={settings?.story_title || "Our Story"} />
            
            {/* Scroll Progress Bar */}
            <motion.div 
                className={`fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r z-[100] origin-left ${theme.progressBar}`} 
                style={{ scaleX }} 
            />

            <div className="z-10 text-center max-w-7xl w-full">
                <header className="mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-bold tracking-[0.2em] mb-6 uppercase ${theme.accentText}`}
                    >
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.accentBg}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.accentBg}`}></span>
                        </span>
                        {greeting}
                    </motion.div>
                    
                    {/* Dynamic Story Title */}
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`text-7xl sm:text-8xl md:text-9xl font-serif leading-none mb-4 tracking-tighter ${theme.accentText}`}
                    >
                        {settings?.story_title || "Our Story"}
                    </motion.h1>

                    {/* Dynamic Subtitle */}
                    <motion.p className={`font-handwriting text-2xl md:text-3xl italic ${theme.bodyText}`}>
                        {settings?.story_subtitle || "Every chapter with you is my favorite."}
                    </motion.p>
                </header>
                
                {/* Dynamic Anniversary Date - Countdown will show prompt if no date */}
                <div className="mb-24">
                    <Countdown 
                        anniversaryDate={settings?.anniversary_date} 
                        theme={theme} 
                    />
                </div>

                {/* Albums Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
                    {albums.map((album) => (
                        <Link href={`/albums/${album.slug}`} key={album.id} className="group">
                            <motion.div 
                                whileHover={{ y: -10 }}
                                className={`relative p-10 rounded-[3rem] border transition-all duration-500 ${theme.card}`}
                            >
                                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                                    {album.icon || '📸'}
                                </div>
                                <h2 className={`text-2xl font-serif font-bold mb-2 ${theme.titleText}`}>
                                    {album.title}
                                </h2>
                                <p className={`font-handwriting text-xl leading-snug ${theme.bodyText}`}>
                                    {album.description}
                                </p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>

            <footer className="mt-32 py-12 text-center z-10">
                <div className={`font-serif text-2xl italic ${theme.accentText}`}>Forever & Always</div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mt-2">
                    © {new Date().getFullYear()} • Handcrafted with Love
                </div>
            </footer>
        </main>
    );
};

Dashboard.layout = page => <AppLayout children={page} />;

export default Dashboard;