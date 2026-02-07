import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import AppLayout from './Layouts/AppLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Get current origin (http or https)
const currentOrigin = window.location.origin;

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