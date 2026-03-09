/**
 * GUÍA DE ASSETS - 2026 CUPRA Raval Madrid E-Prix Memory Game
 * ---------------------------------------------------------
 * 
 * Convención de Carpetas:
 * /public/assets/branding/ -> Logos del evento, Formula E, Cupra, etc.
 * /public/assets/drivers/  -> Imágenes PNG de pilotos (Fondo transparente recomendado).
 * /public/assets/teams/    -> Logos de escuderías o backgrounds específicos.
 * 
 * Convención de Nombres (Drivers):
 * Usa el formato 'nombre-apellido.png' (todo en minúsculas, guiones en vez de espacios).
 * Ejemplo: 'mitch-evans.png', 'pascal-wehrlein.png'.
 */

import { GAME_CONFIG } from '../config/gameConfig';

export const ASSET_PATHS = GAME_CONFIG.assets.folders;

/**
 * Resuelve la ruta de la imagen de un piloto.
 * Si no se proporciona nombre de archivo, devuelve null para mostrar el fallback visual.
 */
export const getDriverImageUrl = (filename?: string): string | undefined => {
    if (!filename) return undefined;
    // Si el filename ya es una ruta completa o URL, la respetamos
    if (filename.startsWith('http') || filename.startsWith('/')) return filename;
    return `${ASSET_PATHS.drivers}${filename}`;
};

/**
 * Resuelve la ruta del logo de un equipo.
 */
export const getTeamLogoUrl = (teamId: string): string => {
    return `${ASSET_PATHS.teams}${teamId}.png`;
};

/**
 * Resuelve assets de branding general.
 */
export const getBrandingAssetUrl = (filename: string): string => {
    return `${ASSET_PATHS.branding}${filename}`;
};
