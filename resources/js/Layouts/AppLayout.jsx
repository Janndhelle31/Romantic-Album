import { useState, useEffect } from "react";
import DefaultLayout from "@/Layouts/ThemeLayouts/DefaultLayout";
import MidnightLayout from "@/Layouts/ThemeLayouts/MidnightLayout";
import ClassyLayout from "@/Layouts/ThemeLayouts/ClassyLayout";
import VintageLayout from "@/Layouts/ThemeLayouts/VintageLayout";
import NatureLayout from "@/Layouts/ThemeLayouts/NatureLayout"; // New Import
import { usePage, router } from "@inertiajs/react";

export default function AppLayout({ children }) {
    const { auth, current_music, letter_content } = usePage().props;
    
    // Determine the initial theme
    const getInitialTheme = () => {
        if (typeof window === 'undefined') return 'default';
        
        // Priority: Auth User > Local Storage > Default
        if (auth?.user?.theme) return auth.user.theme;
        
        const storedTheme = localStorage.getItem('userTheme');
        return storedTheme || 'default';
    };

    const [theme, setTheme] = useState(getInitialTheme);

    // Sync state with database changes (if user updates theme on another device/tab)
    useEffect(() => {
        const userTheme = auth?.user?.theme;
        if (userTheme && userTheme !== theme) {
            setTheme(userTheme);
            localStorage.setItem('userTheme', userTheme);
        }
    }, [auth?.user?.theme]);

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
                    // Rollback on failure
                    setTheme(previousTheme);
                    localStorage.setItem('userTheme', previousTheme);
                }
            });
        }
    };

    // Construct common props for all layouts
    const layoutProps = {
        children,
        currentTheme: theme,
        updateTheme,
        current_music,
        letter_content,
        auth
    };

    // Render the selected theme shell
    switch(theme) {
        case 'midnight':
            return <MidnightLayout {...layoutProps} />;
        case 'classy':
            return <ClassyLayout {...layoutProps} />;
        case 'vintage':
            return <VintageLayout {...layoutProps} />;
        case 'nature':
            return <NatureLayout {...layoutProps} />; // New Case
        default:
            return <DefaultLayout {...layoutProps} />;
    }
}