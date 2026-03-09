import type { Team, Driver, Card } from '../types';

/**
 * 1. Definición del Mock de Equipos
 * Cada equipo tiene un ID único que usaremos para validar las parejas.
 */
export const mockTeams: Team[] = [
    { id: 'cupra', name: 'ABT CUPRA Formula E Team' },
    { id: 'jaguar', name: 'Jaguar TCS Racing' },
    { id: 'porsche', name: 'Porsche' },
    { id: 'ds', name: 'DS Penske' },
    { id: 'andretti', name: 'Andretti Formula E' },
    { id: 'nissan', name: 'Nissan Formula E Team' },
    { id: 'yamaha', name: 'Lola Yamaha' },
    { id: 'citroen', name: 'Citroën Racing' },
    { id: 'envision', name: 'Envision Racing' },
    { id: 'mahindra', name: 'Mahindra Racing' }
];

/**
 * 2. Definición del Mock de Pilotos
 * Tenemos exactamente 2 pilotos por cada escudería.
 */
export const mockDrivers: Driver[] = [
    // ABT CUPRA - OK
    { id: 'd-cupra-1', name: 'Josep Maria Martí', teamId: 'cupra', teamName: 'ABT CUPRA Formula E Team', image: 'josep-maria-marti.png' },
    { id: 'd-cupra-2', name: 'Dan Ticktum', teamId: 'cupra', teamName: 'ABT CUPRA Formula E Team', image: 'dan-ticktum.png' },

    // Jaguar TCS - OK
    { id: 'd-jag-1', name: 'Mitch Evans', teamId: 'jaguar', teamName: 'Jaguar TCS Racing', image: 'mitch-evans.png' },
    { id: 'd-jag-2', name: 'António Félix Da Costa', teamId: 'jaguar', teamName: 'Jaguar TCS Racing', image: 'antonio-felix-dacosta.png' },

    // Porsche - OK
    { id: 'd-por-1', name: 'Nico Müller', teamId: 'porsche', teamName: 'Porsche', image: 'nico-muller.png' },
    { id: 'd-por-2', name: 'Pascal Wehrlein', teamId: 'porsche', teamName: 'Porsche', image: 'pascal-wehrlein.png' },

    // DS Penske - OK
    { id: 'd-ds-1', name: 'Maximilian Günther', teamId: 'ds', teamName: 'DS Penske', image: 'maximilian-gunther.png' },
    { id: 'd-ds-2', name: 'Taylor Barnard', teamId: 'ds', teamName: 'DS Penske', image: 'taylor-barnard.png' },

    // Andretti - OK
    { id: 'd-and-1', name: 'Jake Dennis', teamId: 'andretti', teamName: 'Andretti Formula E', image: 'jake-dennis.png' },
    { id: 'd-and-2', name: 'Felipe Drugovich', teamId: 'andretti', teamName: 'Andretti Formula E', image: 'felipe-drugovich.png' },

    // Nissan - OK
    { id: 'd-nis-1', name: 'Oliver Rowland', teamId: 'nissan', teamName: 'Nissan Formula E Team', image: 'oliver-rowland.png' },
    { id: 'd-nis-2', name: 'Norman Nato', teamId: 'nissan', teamName: 'Nissan Formula E Team', image: 'norman-nato.png' },

    // Lola Yamaha - OK
    { id: 'd-yam-1', name: 'Lucas Di Grassi', teamId: 'yamaha', teamName: 'Lola Yamaha', image: 'lucas-di-grassi.png' },
    { id: 'd-yam-2', name: 'Zane Maloney', teamId: 'yamaha', teamName: 'Lola Yamaha', image: 'zane-maloney.png' },

    // Citroën - OK
    { id: 'd-cit-1', name: 'Nick Cassidy', teamId: 'citroen', teamName: 'Citroën Racing', image: 'nick-cassidy.png' },
    { id: 'd-cit-2', name: 'Jean-Éric Vergne', teamId: 'citroen', teamName: 'Citroën Racing', image: 'jean-eric-vergne.png' },

    // Envision Racing - OK
    { id: 'd-env-1', name: 'Joel Eriksson', teamId: 'envision', teamName: 'Envision Racing', image: 'joel-eriksson.png' },
    { id: 'd-env-2', name: 'Sébastien Buemi', teamId: 'envision', teamName: 'Envision Racing', image: 'sebastien-buemi.png' },

    // Mahindra - OK
    { id: 'd-mah-1', name: 'Edoardo Mortara', teamId: 'mahindra', teamName: 'Mahindra Racing', image: 'edoardo-mortara.png' },
    { id: 'd-mah-2', name: 'Nyck de Vries', teamId: 'mahindra', teamName: 'Mahindra Racing', image: 'nyck-devries.png' }
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
