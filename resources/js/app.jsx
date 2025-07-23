import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import TranslationProvider from './context/TranslationProvider';
import './echo'; // Import the Echo setup file

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.jsx`, import.meta.glob('./pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <TranslationProvider>
                <App {...props} />
            </TranslationProvider>,
        );
    },
    progress: {
        color: '#FF2D20',
    },
});

// This will set light / dark mode on load...
initializeTheme();
