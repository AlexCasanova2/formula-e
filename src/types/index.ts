export interface Team {
    id: string;
    name: string;
}

export interface Driver {
    id: string;
    name: string;
    teamId: string;
    teamName: string;
    image: string;
}

export interface Card {
    uniqueCardId: string;
    driverId: string;
    teamId: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export type GameState = 'START' | 'PLAYING' | 'VICTORY';
