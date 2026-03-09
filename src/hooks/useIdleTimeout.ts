import { useEffect, useRef, useCallback } from 'react';

interface UseIdleTimeoutProps {
    onIdle: () => void;
    timeoutSeconds: number;
    enabled: boolean;
}

/**
 * Hook para detectar inactividad del usuario en un entorno físico (iPad/Kiosk).
 * Resetea el juego a la pantalla inicial si no hay interacción.
 */
export const useIdleTimeout = ({ onIdle, timeoutSeconds, enabled }: UseIdleTimeoutProps) => {
    const timerRef = useRef<any>(null);

    const resetTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (enabled) {
            timerRef.current = setTimeout(() => {
                onIdle();
            }, timeoutSeconds * 1000);
        }
    }, [onIdle, timeoutSeconds, enabled]);

    useEffect(() => {
        if (!enabled) {
            if (timerRef.current) clearTimeout(timerRef.current);
            return;
        }

        // Eventos a monitorizar para resetear el timer de inactividad
        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
            'pointerdown',
            'pointermove',
            'click'
        ];

        const handleActivity = () => {
            resetTimer();
        };

        // Escuchamos eventos globales
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Iniciamos el timer por primera vez
        resetTimer();

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [enabled, resetTimer]);

    return { resetIdleTimer: resetTimer };
};
