import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import AppLayout from './Layouts/AppLayout';
import FloatingHearts from '@/Components/FloatingHearts'; // 1. Import your optimized component

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        );

        page.default.layout = page.default.layout || ((page) => <AppLayout children={page} />);
        return page;
    },
    setup({ el, App, props }) {
        // ... (your existing history pushState logic)

        const root = createRoot(el);
        
        // 2. Wrap the App and the floating effect in a Fragment
        // This ensures Hearts is independent of the Inertia routing/scrolling logic
        root.render(
            <>
                <App {...props} />
                <FloatingHearts /> 
            </>
        );
    },
    progress: {
        color: '#fbbf24',
    },
});