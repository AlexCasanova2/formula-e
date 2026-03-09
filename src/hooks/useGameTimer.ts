import { useState, useEffect, useCallback } from 'react';

interface UseGameTimerProps {
    isRunning: boolean;
    isFinished: boolean;
}

export const useGameTimer = ({ isRunning, isFinished }: UseGameTimerProps) => {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        let timerId: ReturnType<typeof setInterval>;

        // Iniciar temporizador si el juego está corriendo y no ha terminado
        if (isRunning && !isFinished) {
            timerId = setInterval(() => {
                setElapsedSeconds((prev) => prev + 1);
            }, 1000);
        }

        // Cleanup de la función: Limpia siempre el intervalo para evitar ejecuciones huérfanas
        return () => clearInterval(timerId);
    }, [isRunning, isFinished]);

    const resetTimer = useCallback(() => {
        setElapsedSeconds(0);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return {
        elapsedSeconds,
        formattedTime: formatTime(elapsedSeconds),
        resetTimer,
    };
};
