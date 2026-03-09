import { useState, useEffect } from 'react';

/**
 * Hook to preload critical assets before starting the experience.
 * Ensures smooth visual transitions in a physical event environment.
 */
export const useAssetPreloader = (imageUrls: string[]) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (imageUrls.length === 0) {
            setIsLoaded(true);
            return;
        }

        let loadedCount = 0;
        const total = imageUrls.length;

        const handleImageLoad = () => {
            loadedCount++;
            setProgress(Math.round((loadedCount / total) * 100));
            if (loadedCount === total) {
                // Small delay for perceived smoothness
                setTimeout(() => setIsLoaded(true), 500);
            }
        };

        const handleImageError = (url: string) => {
            console.warn(`Failed to preload asset: ${url}`);
            handleImageLoad(); // Continue anyway to not block the app
        };

        imageUrls.forEach((url) => {
            const img = new Image();
            img.src = url;
            img.onload = handleImageLoad;
            img.onerror = () => handleImageError(url);
        });
    }, [imageUrls]);

    return { isLoaded, progress };
};
