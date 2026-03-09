import React from 'react';
import type { Card as CardType, Driver } from '../types';
import { Card } from './Card';

interface GameGridProps {
    cards: CardType[];
    drivers: Driver[];
    onCardClick: (card: CardType) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({ cards, drivers, onCardClick }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-8 xl:p-12 overflow-hidden w-full h-full relative z-10 perspective-[2000px] mb-6">
            <div
                className="grid w-full h-full max-w-[1300px] grid-cols-5 grid-rows-4 gap-3 md:gap-4 lg:gap-5 transform-gpu transition-all duration-700 mx-auto justify-items-center items-center"
            >
                {cards.map((card) => {
                    const driverData = drivers.find(d => d.id === card.driverId);

                    return (
                        <div key={card.uniqueCardId} className="w-full h-full ease-out duration-300">
                            <Card
                                card={card}
                                driver={driverData}
                                onClick={onCardClick}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
