import { useState, useEffect, useMemo } from "react";
import DefaultLayout from "@/Layouts/ThemeLayouts/DefaultLayout";
import MidnightLayout from "@/Layouts/ThemeLayouts/MidnightLayout";
import ClassyLayout from "@/Layouts/ThemeLayouts/ClassyLayout";
import VintageLayout from "@/Layouts/ThemeLayouts/VintageLayout";
import NatureLayout from "@/Layouts/ThemeLayouts/NatureLayout";
import { usePage, router } from "@inertiajs/react";

// Import the high-performance versions
import FloatingHearts from "@/Components/ThemeComponents/Default/FloatingHearts";
import FloatingStars from "@/Components/ThemeComponents/Midnight/FloatingStars";
import FloatingNature from "@/Components/ThemeComponents/Nature/FloatingNature";
import FloatingVintage from "@/Components/ThemeComponents/Vintage/FloatingVintage";
import FloatingClassy from "@/Components/ThemeComponents/Classy/FloatingClassy";

// Import ThemeSelector ONLY - NO MusicPlayer or LetterModal here!
import ThemeSelector from "@/Components/ThemeSelector";
import { motion, AnimatePresence } from "framer-motion";

export default function DemoLayout({ 
    children, 
    hideControls = false, 
    isPreview = false,
    onThemeButtonClick 
}) {
    const { auth, current_music, letter_content } = usePage().props;
    
    // State for theme
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') return 'default';
        return auth?.user?.theme || localStorage.getItem('userTheme') || 'default';
    });

    const [previewTheme, setPreviewTheme] = useState(() => {
        if (typeof window === 'undefined') return 'default';
        return localStorage.getItem('previewTheme') || 'default';
    });

    const activeTheme = isPreview ? previewTheme : theme;

    // Update theme function
    const updateTheme = async (newTheme) => {
        const previousTheme = activeTheme;
        
        if (isPreview) {
            setPreviewTheme(newTheme);
            localStorage.setItem('previewTheme', newTheme);
        } else {
            setTheme(newTheme);
            localStorage.setItem('userTheme', newTheme);
            
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
        }
        
        applyThemeToDocument(newTheme);
        
        if (onThemeButtonClick) {
            onThemeButtonClick();
        }
    };

    // Apply theme to document
    const applyThemeToDocument = (themeName) => {
        document.documentElement.classList.remove(
            'theme-default',
            'theme-midnight',
            'theme-classy',
            'theme-vintage',
            'theme-nature'
        );
        document.documentElement.classList.add(`theme-${themeName}`);
        document.documentElement.setAttribute('data-theme', themeName);
    };

    // Apply theme on initial load
    useEffect(() => {
        applyThemeToDocument(activeTheme);
    }, []);

    // Sync theme if it changes via auth props
    useEffect(() => {
        if (!isPreview) {
            const userTheme = auth?.user?.theme;
            if (userTheme && userTheme !== theme) {
                setTheme(userTheme);
                localStorage.setItem('userTheme', userTheme);
                applyThemeToDocument(userTheme);
            }
        }
    }, [auth?.user?.theme, isPreview]);

    // Memoize the Theme Effect
    const ThemeEffect = useMemo(() => {
        switch(activeTheme) {
            case 'midnight': return <FloatingStars />;
            case 'classy':   return <FloatingClassy />;
            case 'vintage':  return <FloatingVintage />;
            case 'nature':   return <FloatingNature />;
            default:         return <FloatingHearts />;
        }
    }, [activeTheme]);

    // Layout props - pass everything to theme layouts
    const layoutProps = {
        children,
        hideControls,
        isPreview,
        current_music,      // Theme layouts need this
        letter_content,     // Theme layouts need this
        currentTheme: activeTheme,
    };

    return (
        <>
            {/* Floating theme effects */}
            {ThemeEffect}

            {/* Theme selector for preview mode ONLY */}
            {isPreview && !hideControls && (
                <div className="fixed top-4 right-4 z-[200]">
                    <ThemeSelector 
                        selectedTheme={activeTheme}
                        onThemeChange={updateTheme}
                    />
                </div>
            )}

            {/* 
                THEME LAYOUTS HANDLE THEIR OWN:
                - MusicPlayer
                - LetterModal  
                - Letter trigger button
                - Entrance screens
            */}
            {activeTheme === 'midnight' && <MidnightLayout {...layoutProps} />}
            {activeTheme === 'classy' && <ClassyLayout {...layoutProps} />}
            {activeTheme === 'vintage' && <VintageLayout {...layoutProps} />}
            {activeTheme === 'nature' && <NatureLayout {...layoutProps} />}
            {activeTheme === 'default' && <DefaultLayout {...layoutProps} />}
        </>
    );
}