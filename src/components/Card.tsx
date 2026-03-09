import React from 'react';
import type { Card as CardType, Driver } from '../types';
import { getDriverImageUrl } from '../data/assets';
import { GAME_CONFIG } from '../config/gameConfig';

interface CardProps {
    card: CardType;
    driver?: Driver;
    /** 
     * Puede deshabilitarse de forma externa si el hook está validando otra carta ("tablero bloqueado")
     */
    disabled?: boolean;
    onClick: (card: CardType) => void;
}

export const Card: React.FC<CardProps> = ({ card, driver, disabled = false, onClick }) => {
    const { isFlipped, isMatched, teamId } = card;

    // Colores corporativos centralizados en GAME_CONFIG
    const teamColor = (GAME_CONFIG.colors.teams as any)[teamId] || GAME_CONFIG.colors.accent;
    const isLocked = isMatched || isFlipped || disabled;

    // Resolvemos la URL de la imagen (PNG real o fallback visual)
    const driverImage = getDriverImageUrl(driver?.image);

    const handleTap = () => {
        if (!isLocked) {
            onClick(card);
        }
    };

    return (
        <div
            className={`relative w-full h-full select-none outline-none preserve-3d
                ${!isLocked ? 'cursor-pointer active:scale-95 transition-transform duration-200' : ''}
                ${isMatched ? 'card-matched-anim pointer-events-none' : ''}
                ${disabled && !isFlipped ? 'opacity-80' : ''}
            `}
            onClick={handleTap}
            aria-label={`Carta de ${driver?.name || 'piloto'}, escudería ${driver?.teamName || card.teamId}. ${isMatched ? 'Emparejada' : isFlipped ? 'Volteada' : 'Oculta'}`}
            role="button"
            aria-disabled={isLocked}
            tabIndex={isLocked ? -1 : 0}
        >
            <div
                className={`w-full h-full rounded-[16px] xl:rounded-[20px] transition-transform duration-[600ms] shadow-xl preserve-3d
                    ${isFlipped || isMatched ? 'card-flip-open shadow-[var(--color-fe-cyan-glow)]' : 'card-flip-closed shadow-black/60'}
                `}
                style={{
                    transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
            >
                {/* BACK: ESTADO OCULTA */}
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center rounded-[16px] xl:rounded-[20px] bg-gradient-to-br from-slate-800 to-[#0A0E17] border-[2px] xl:border-[3px] border-slate-700/60 overflow-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050810_100%)] opacity-80" />
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-fe-blue-light)] blur-[50px] opacity-40 mix-blend-screen pointer-events-none" />
                    <span className="relative z-10 text-[50px] md:text-[60px] lg:text-[70px] font-black italic tracking-tighter text-slate-600/20 pointer-events-none">FE</span>
                    <div className="absolute bottom-4 w-1/3 h-1 bg-slate-700/50 rounded-full" />
                </div>

                {/* FRONT: ESTADO VOLTEADA */}
                <div
                    className="absolute inset-0 flex flex-col items-center justify-between rounded-[16px] xl:rounded-[20px] bg-white border-[3px] lg:border-[4px] p-2 md:p-3 overflow-hidden shadow-inner"
                    style={{
                        borderColor: teamColor,
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    <div className="absolute inset-x-0 top-0 h-1/2 opacity-10 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${teamColor}, transparent)` }} />

                    {/* CAJA ASSETS / PILOTO PNG */}
                    <div className="flex-[2.5_2.5_0%] w-full flex items-end justify-center bg-slate-100 rounded-[10px] overflow-hidden relative shadow-inner mb-2 lg:mb-3 border border-slate-200/60 pt-2">
                        {driverImage ? (
                            <img
                                src={driverImage}
                                alt={driver?.name}
                                /**
                                 * USAR object-contain PARA PILOTOS SIN FONDO
                                 * Asegura que el cuerpo del piloto repose en la base sin cortarse
                                 */
                                className="w-full h-full object-contain object-bottom transition-opacity duration-300 pointer-events-none"
                                onError={(e) => {
                                    // Prevenir bucle infinito si falla el fallback
                                    (e.target as HTMLImageElement).style.opacity = '0';
                                }}
                            />
                        ) : (
                            /* FALLBACK VISUAL: Se muestra mientras no pegues los PNGs reales */
                            <div className="flex flex-col items-center justify-end h-full w-full opacity-30 px-4">
                                <div className="w-[35%] aspect-square rounded-[1.5rem] border-[4px] mb-[2%] shadow-sm" style={{ borderColor: teamColor, backgroundColor: '#94a3b8' }} />
                                <div className="w-[65%] h-[40%] rounded-t-[1.5rem] shadow-sm" style={{ backgroundColor: '#cbd5e1' }} />
                            </div>
                        )}
                    </div>

                    {/* DATOS PILOTO */}
                    <div className="flex-[0.8_0.8_0%] w-full flex flex-col justify-center items-center z-10 px-1">
                        <p className="text-[0.85rem] md:text-[0.95rem] lg:text-[1.1rem] xl:text-[1.2rem] font-bold text-slate-900 uppercase tracking-tighter leading-none mb-1 text-center line-clamp-1 w-full drop-shadow-sm">
                            {driver?.name || 'Desconocido'}
                        </p>
                        <hr className="w-8 border-t-2 opacity-30 mt-0.5 mb-1 lg:mb-1.5" style={{ borderColor: teamColor }} />
                        <p className="text-[0.55rem] md:text-[0.6rem] lg:text-[0.65rem] font-black uppercase tracking-[0.2em] text-center line-clamp-1 w-full" style={{ color: teamColor }}>
                            {driver?.teamName || card.teamId}
                        </p>
                    </div>

                    {/* ESTADO MATCHED (OVERLAY) */}
                    {isMatched && (
                        <div className="absolute inset-0 bg-white/20 z-20 flex items-center justify-center animate-in fade-in zoom-in duration-300">
                            <div className="rounded-full bg-[var(--color-fe-cyan)] p-2 md:p-3 shadow-[0_0_20px_var(--color-fe-cyan-glow)] flex items-center justify-center">
                                <svg className="w-6 h-6 lg:w-8 lg:h-8 text-[#050810]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

