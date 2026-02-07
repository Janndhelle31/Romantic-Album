import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import MidnightLayout from '@/Layouts/ThemeLayouts/MidnightLayout';
import ClassyLayout from '@/Layouts/ThemeLayouts/ClassyLayout';

export default function ThemeWrapper({ children }) {
    const { theme = 'default' } = usePage().props;
    
    switch(theme) {
        case 'midnight':
            return <MidnightLayout>{children}</MidnightLayout>;
        case 'classy':
            return <ClassyLayout>{children}</ClassyLayout>;
        case 'default':
        default:
            return <AppLayout>{children}</AppLayout>;
    }
}