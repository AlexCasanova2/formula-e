/**
 * CONFIGURACIÓN GLOBAL - Formula E Memory Game
 * -------------------------------------------
 * Centraliza todos los textos, tiempos y assets del proyecto para facilitar
 * su reutilización en futuros eventos.
 */

export const GAME_CONFIG = {
    // Branding y Textos del Evento
    event: {
        name: '2026 CUPRA Raval Madrid E-Prix',
        title: 'Official Games',
        copy: 'Selecciona tu desafío Formula E',
        memoryTitle: 'Memory Game: Encuentra las parejas',
        matchingTitle: 'Matching Game: Une los pilotos',
        tagline: 'Kids Zone Official Activation',
        victoryTitle: '¡BANDERA A CUADROS!',
        victoryBody: 'Misión cumplida en el {event}. Has demostrado una memoria digna de un campeón.',
        victoryButton: 'Jugar de Nuevo',
    },

    // Lógica y Tiempos del Juego
    gameplay: {
        totalPairs: 10,                 // 20 cartas en total (5x4)
        mismatchDelay: 1000,            // Milisegundos que las cartas quedan abiertas si no coinciden
        matchDelay: 1000,               // Milisegundos de espera antes de marcar como acierto (UX)
        victoryDelay: 600,              // Espera antes de mostrar el modal de victoria
        idleTimeoutSeconds: 30,         // Tiempo de inactividad para resetear (Attract Mode)
    },

    // Rutas de Assets (Basadas en /public)
    assets: {
        folders: {
            drivers: '/assets/drivers/',
            teams: '/assets/teams/',
            branding: '/assets/branding/',
        },
        logoFE: '/assets/branding/logo-fe.png',
        logoEvent: '/assets/branding/logo-fe.png', // Provisional: Cambiado porque logo-cupra.png no existe en la carpeta
        backgroundKV: '/assets/branding/background-fe.png',
        textureOverlay: '/assets/branding/textura-fe.png',
        placeholderDriver: '/assets/drivers/placeholder.png',
        favicon: '/assets/branding/favicon.jpg',
    },

    // Colores Principales (Sincronizados con el tema visual)
    colors: {
        primary: '#001489',             // FE Blue
        secondary: '#00E5FF',           // FE Cyan
        accent: '#00B1A0',              // Cupra Teal
        dark: '#001489',                // FE Blue (formerly Deep Space)
        glass: 'rgba(15, 23, 42, 0.4)',  // Glassmorphism base
        teams: {
            cupra: '#000000',
            jaguar: '#000000',
            porsche: '#D5001C',
            ds: '#cba65f',
            andretti: '#000000',
            nissan: '#C3002F',
            yamaha: '#0033A0',
            citroen: '#eb002a',
            envision: '#00C900',
            mahindra: '#e31837',
        }
    }
};
