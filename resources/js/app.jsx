import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import AppLayout from './Layouts/AppLayout';
import DemoLayout from './Layouts/DemoLayout'; // Add this import

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        );

        // FIX: Set layout conditionally based on page
        if (!page.default.layout) {
            // For preview pages, use DemoLayout
            if (name === 'Preview' || name === 'AlbumPreview') {
                page.default.layout = (page) => <DemoLayout children={page} isPreview={true} />;
            } 
            // For all other pages, use AppLayout
            else {
                page.default.layout = (page) => <AppLayout children={page} />;
            }
        }
        
        return page;
    },
    setup({ el, App, props }) {
        // Set base URL for Inertia requests
        if (window.history?.pushState) {
            const originalPushState = window.history.pushState;
            window.history.pushState = function(state, title, url) {
                if (url && typeof url === 'string' && url.startsWith('http://')) {
                    url = url.replace('http://', 'https://');
                }
                return originalPushState.call(this, state, title, url);
            };
        }
        
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#fbbf24',
    },
});