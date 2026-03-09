import type { Team, Driver, Card } from '../types';

/**
 * 1. Definición del Mock de Equipos
 * Cada equipo tiene un ID único que usaremos para validar las parejas.
 */
export const mockTeams: Team[] = [
    { id: 'cupra', name: 'ABT CUPRA Formula E Team' },
    { id: 'jaguar', name: 'Jaguar TCS Racing' },
    { id: 'porsche', name: 'TAG Heuer Porsche' },
    { id: 'ds', name: 'DS Penske' },
    { id: 'andretti', name: 'Andretti Formula E' },
    { id: 'nissan', name: 'Nissan Formula E Team' },
    { id: 'mclaren', name: 'NEOM McLaren' },
    { id: 'maserati', name: 'Maserati MSG Racing' },
    { id: 'ert', name: 'ERT Formula E Team' },
    { id: 'mahindra', name: 'Mahindra Racing' }
];

/**
 * 2. Definición del Mock de Pilotos
 * Tenemos exactamente 2 pilotos por cada escudería.
 */
export const mockDrivers: Driver[] = [
    // ABT CUPRA
    { id: 'd-cupra-1', name: 'Lucas di Grassi', teamId: 'cupra', teamName: 'ABT CUPRA Formula E Team', image: '' },
    { id: 'd-cupra-2', name: 'Nico Müller', teamId: 'cupra', teamName: 'ABT CUPRA Formula E Team', image: '' },

    // Jaguar TCS
    { id: 'd-jag-1', name: 'Mitch Evans', teamId: 'jaguar', teamName: 'Jaguar TCS Racing', image: '' },
    { id: 'd-jag-2', name: 'Nick Cassidy', teamId: 'jaguar', teamName: 'Jaguar TCS Racing', image: '' },

    // Porsche
    { id: 'd-por-1', name: 'Pascal Wehrlein', teamId: 'porsche', teamName: 'TAG Heuer Porsche', image: '' },
    { id: 'd-por-2', name: 'A. F. da Costa', teamId: 'porsche', teamName: 'TAG Heuer Porsche', image: '' },

    // DS Penske
    { id: 'd-ds-1', name: 'Jean-Éric Vergne', teamId: 'ds', teamName: 'DS Penske', image: '' },
    { id: 'd-ds-2', name: 'Stoffel Vandoorne', teamId: 'ds', teamName: 'DS Penske', image: '' },

    // Andretti
    { id: 'd-and-1', name: 'Jake Dennis', teamId: 'andretti', teamName: 'Andretti Formula E', image: '' },
    { id: 'd-and-2', name: 'Norman Nato', teamId: 'andretti', teamName: 'Andretti Formula E', image: '' },

    // Nissan
    { id: 'd-nis-1', name: 'Oliver Rowland', teamId: 'nissan', teamName: 'Nissan Formula E Team', image: '' },
    { id: 'd-nis-2', name: 'Sacha Fenestraz', teamId: 'nissan', teamName: 'Nissan Formula E Team', image: '' },

    // McLaren
    { id: 'd-mcl-1', name: 'Sam Bird', teamId: 'mclaren', teamName: 'NEOM McLaren', image: '' },
    { id: 'd-mcl-2', name: 'Jake Hughes', teamId: 'mclaren', teamName: 'NEOM McLaren', image: '' },

    // Maserati
    { id: 'd-mas-1', name: 'Max Günther', teamId: 'maserati', teamName: 'Maserati MSG Racing', image: '' },
    { id: 'd-mas-2', name: 'Jehan Daruvala', teamId: 'maserati', teamName: 'Maserati MSG Racing', image: '' },

    // ERT
    { id: 'd-ert-1', name: 'Dan Ticktum', teamId: 'ert', teamName: 'ERT Formula E Team', image: '' },
    { id: 'd-ert-2', name: 'Sérgio Sette Câmara', teamId: 'ert', teamName: 'ERT Formula E Team', image: '' },

    // Mahindra
    { id: 'd-mah-1', name: 'Edoardo Mortara', teamId: 'mahindra', teamName: 'Mahindra Racing', image: '' },
    { id: 'd-mah-2', name: 'Nyck de Vries', teamId: 'mahindra', teamName: 'Mahindra Racing', image: '' }
];

/**
 * 3. Helper function
 * Recibe una lista de pilotos, transforma cada piloto en una Card y mezcla el array resultante.
 * Garantiza que cada vez que se inicie el juego, el mazo sea diferente.
 */
export const generateDeck = (drivers: Driver[]): Card[] => {
    // Inicializamos las cartas mapeando cada piloto a su estado de carta
    const deck: Card[] = drivers.map((driver) => ({
        uniqueCardId: crypto.randomUUID(), // Necesario porque React necesita una key, y un Driver podría repetirse (aunque en nuestro caso no, pero es buena práctica de modelo)
        driverId: driver.id,
        teamId: driver.teamId, // Guardamos el teamId a nivel de carta para facilitar la comprobación de parejas
        isFlipped: false,
        isMatched: false,
    }));

    // Algoritmo de Fisher-Yates para mezclar aleatoriamente garantizando una distribución uniforme
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Swapping de ES6
    }

    return deck;
};
