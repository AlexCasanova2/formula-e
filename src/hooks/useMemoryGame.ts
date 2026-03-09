import { useState, useCallback, useEffect } from 'react';
import type { Card as CardType, Driver } from '../types';
import { generateDeck } from '../data/gameData';

export const useMemoryGame = (drivers: Driver[]) => {
    // Estado base del juego
    const [cards, setCards] = useState<CardType[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);

    // Control de flujo de partida
    const [gameStarted, setGameStarted] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);

    // Control de lógica de emparejamiento interactivo
    const [firstCard, setFirstCard] = useState<CardType | null>(null);
    const [secondCard, setSecondCard] = useState<CardType | null>(null);
    const [isProcessing, setIsProcessing] = useState(false); // Para lockear la UI durante el delay

    // Inicializa o resetea el juego.
    const startGame = useCallback(() => {
        const freshDeck = generateDeck(drivers);
        setCards(freshDeck);

        setGameStarted(true);
        setGameFinished(false);

        setMoves(0);
        setMatches(0);

        setFirstCard(null);
        setSecondCard(null);
        setIsProcessing(false);
    }, [drivers]);

    // Vuelve la UI y estado a cero
    const resetGame = useCallback(() => {
        setGameStarted(false);
        setGameFinished(false);
        setCards([]);
    }, []);

    // Lógica de tap encapsulada y controlada
    const handleCardTap = useCallback((card: CardType) => {
        // Si el tablero está procesando un error/match o la carta ya está volteada/emparejada, ignorar.
        if (!gameStarted || isProcessing || card.isFlipped || card.isMatched) {
            return;
        }

        // Volteamos visualmente la carta seleccionada
        setCards((prevCards) =>
            prevCards.map((c) =>
                c.uniqueCardId === card.uniqueCardId ? { ...c, isFlipped: true } : c
            )
        );

        // Si aún no hemos seleccionado la primera carta:
        if (firstCard === null) {
            setFirstCard({ ...card, isFlipped: true });
            return;
        }

        // Si ya teníamos una carta, esta es la segunda evaluación
        setSecondCard({ ...card, isFlipped: true });
        setMoves((prev) => prev + 1);
        setIsProcessing(true); // Bloquear más interacciones durante la pausa de UX

    }, [gameStarted, isProcessing, firstCard]);

    // Hook que evalúa el estado cuando dos cartas son seleccionadas
    useEffect(() => {
        if (firstCard && secondCard) {
            // Condición estricta de match: Mismo teamId PERO son pilotos diferentes (driverId distinto)
            // Aunque generateDeck solo genera 1 de cada Driver, lo controlamos como buena práctica
            const isMatch = firstCard.teamId === secondCard.teamId && firstCard.driverId !== secondCard.driverId;

            if (isMatch) {
                // Encerramos las cartas como "Matched"
                setCards((prevCards) =>
                    prevCards.map((card) => {
                        if (card.uniqueCardId === firstCard.uniqueCardId || card.uniqueCardId === secondCard.uniqueCardId) {
                            return { ...card, isMatched: true };
                        }
                        return card;
                    })
                );

                setMatches((prev) => prev + 1);
                resetSelectionState();
            } else {
                // Error de match: Volver a dar la vuelta tras un pequeño delay táctil.
                // 800ms suele sentirse Premium en animaciones de 500ms~ CSS
                const timer = setTimeout(() => {
                    setCards((prevCards) =>
                        prevCards.map((card) => {
                            if (card.uniqueCardId === firstCard.uniqueCardId || card.uniqueCardId === secondCard.uniqueCardId) {
                                return { ...card, isFlipped: false };
                            }
                            return card;
                        })
                    );
                    resetSelectionState();
                }, 1000); // 1000ms delay para dar tiempo al usuario a verlas antes de cerrar

                return () => clearTimeout(timer);
            }
        }
    }, [firstCard, secondCard]);

    // Hook que comprueba si hemos ganado (matches = la mitad del mazo)
    useEffect(() => {
        if (cards.length > 0 && matches === cards.length / 2) {
            // Pequeño delay para que dé tiempo a rotar visualmente la última pareja antes del modal
            const victoryTimer = setTimeout(() => {
                setGameFinished(true);
            }, 600);
            return () => clearTimeout(victoryTimer);
        }
    }, [matches, cards.length]);

    const resetSelectionState = () => {
        setFirstCard(null);
        setSecondCard(null);
        setIsProcessing(false);
    };

    return {
        cards,
        moves,
        matches,
        gameStarted,
        gameFinished,
        startGame,
        resetGame,
        handleCardTap,
        isProcessing, // Opcional, es útil si luego queremos meter un CSS global por ejemplo, pero lo retorno por si acaso
    };
};
