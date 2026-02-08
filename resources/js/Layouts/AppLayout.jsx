import { useState, useEffect, useMemo } from "react";
import DefaultLayout from "@/Layouts/ThemeLayouts/DefaultLayout";
import MidnightLayout from "@/Layouts/ThemeLayouts/MidnightLayout";
import ClassyLayout from "@/Layouts/ThemeLayouts/ClassyLayout";
import VintageLayout from "@/Layouts/ThemeLayouts/VintageLayout";
import NatureLayout from "@/Layouts/ThemeLayouts/NatureLayout";
import { usePage, router } from "@inertiajs/react";

// Import the high-performance versions we've discussed
import FloatingHearts from "@/Components/ThemeComponents/Default/FloatingHearts";
import FloatingStars from "@/Components/ThemeComponents/Midnight/FloatingStars";
import FloatingNature from "@/Components/ThemeComponents/Nature/FloatingNature";
import FloatingVintage from "@/Components/ThemeComponents/Vintage/FloatingVintage";
import FloatingClassy from "@/Components/ThemeComponents/Classy/FloatingClassy";

export default function AppLayout({ children, hideControls = false }) {
    const { auth, current_music, letter_content } = usePage().props;
    
    // 1. Define State first
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') return 'default';
        return auth?.user?.theme || localStorage.getItem('userTheme') || 'default';
    });

    // 2. Define the update function before it's used in any objects
    const updateTheme = async (newTheme) => {
        const previousTheme = theme;
        setTheme(newTheme);
        
        if (typeof window !== 'undefined') {
            localStorage.setItem('userTheme', newTheme);
        }
        
        if (auth?.user) {
            router.post('/theme/update', { theme: newTheme }, {
                preserveScroll: true,
                preserveState: true,
                onError: () => {
                    setTheme(previousTheme);
                    localStorage.setItem('userTheme', previousTheme);
                }
            });
        }
    };

    // 3. Sync theme if it changes via auth props
    useEffect(() => {
        const userTheme = auth?.user?.theme;
        if (userTheme && userTheme !== theme) {
            setTheme(userTheme);
            localStorage.setItem('userTheme', userTheme);
        }
    }, [auth?.user?.theme]);

    // 4. Memoize the Effect so it doesn't "reset" when scrolling or typing
    const ThemeEffect = useMemo(() => {
        switch(theme) {
            case 'midnight': return <FloatingStars />;
            case 'classy':   return <FloatingClassy />;
            case 'vintage':  return <FloatingVintage />;
            case 'nature':   return <FloatingNature />;
            default:         return <FloatingHearts />;
        }
    }, [theme]);

    const layoutProps = {
        children,
        currentTheme: theme,
        updateTheme, // Now properly defined
        current_music,
        letter_content,
        auth,
        hideControls
    };

    return (
        <>
            {/* Renders outside the layout tree to prevent scroll-jank */}
            {ThemeEffect}

            {theme === 'midnight' && <MidnightLayout {...layoutProps} />}
            {theme === 'classy' && <ClassyLayout {...layoutProps} />}
            {theme === 'vintage' && <VintageLayout {...layoutProps} />}
            {theme === 'nature' && <NatureLayout {...layoutProps} />}
            {theme === 'default' && <DefaultLayout {...layoutProps} />}
        </>
    );
}