import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { statsApi } from '@/lib/api';

export function AccessLogger() {
    const location = useLocation();

    useEffect(() => {
        const logPageAccess = async () => {
            try {
                const metadata = {
                    screen_width: window.screen.width,
                    screen_height: window.screen.height,
                    language: navigator.language,
                    referrer: document.referrer,
                    platform: navigator.platform,
                };

                await statsApi.logAccess({
                    path: location.pathname + location.search,
                    metadata
                });
            } catch (error) {
                // Silently fail to not disrupt user experience
                console.warn('Failed to log access', error);
            }
        };

        // Log immediately on mount and updates
        logPageAccess();

    }, [location]);

    return null; // Component renders nothing
}
