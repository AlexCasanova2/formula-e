import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

interface VictoryModalProps {
    formattedTime: string;
    moves: number;
    onRestart: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ formattedTime, moves, onRestart }) => {
    return (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#001489]/90 backdrop-blur-[10px] transition-all duration-1000 animate-in fade-in zoom-in">

            {/* Eliminado Background Image KV por petición del usuario */}
            <div
                className="absolute top-0 left-1/4 w-[800px] h-[800px] opacity-20 blur-[180px] pointer-events-none"
                style={{ backgroundColor: GAME_CONFIG.colors.primary }}
            />
            <div
                className="absolute bottom-0 right-1/4 w-[800px] h-[800px] opacity-10 blur-[180px] pointer-events-none"
                style={{ backgroundColor: GAME_CONFIG.colors.secondary }}
            />

            {/* Patrón Checkered sutil de fondo completo */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '32px 32px' }} />

            <div className="relative z-10 flex w-full flex-col items-center justify-center text-center px-6">



                <h2 className="mb-4 text-6xl md:text-8xl lg:text-9xl font-black italic tracking-tighter text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] uppercase">
                    {GAME_CONFIG.event.victoryTitle}
                </h2>

                <p className="mb-12 lg:mb-16 text-xl md:text-2xl lg:text-3xl font-medium text-slate-300 max-w-4xl px-4 leading-relaxed">
                    {GAME_CONFIG.event.victoryBody.replace('{event}', GAME_CONFIG.event.name)}
                </p>

                {/* Stats Grid - Sin recuadro, solo flotando con sombra sutil */}
                <div className="mb-14 lg:mb-20 flex flex-col md:flex-row gap-8 md:gap-14">

                    {/* Tiempo */}
                    <div className="flex flex-col items-center justify-center min-w-[280px] lg:min-w-[340px]">
                        <span className="text-sm lg:text-base font-black uppercase tracking-[0.5em] text-white opacity-90 mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            TIEMPO FINAL
                        </span>
                        <span className="text-7xl lg:text-8xl xl:text-9xl font-mono font-black tracking-widest text-[var(--color-fe-cyan)] drop-shadow-[0_0_25px_var(--color-fe-cyan-glow)]">
                            {formattedTime}
                        </span>
                    </div>

                    {/* Movimientos */}
                    <div className="flex flex-col items-center justify-center min-w-[280px] lg:min-w-[340px]">
                        <span className="text-sm lg:text-base font-black uppercase tracking-[0.5em] text-white opacity-90 mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            MOVIMIENTOS
                        </span>
                        <div className="flex items-baseline gap-3">
                            <span className="text-7xl lg:text-8xl xl:text-9xl font-mono font-black text-white">
                                {moves}
                            </span>
                        </div>
                    </div>

                </div>

                {/* Botón Acción - Más grande y Premium */}
                <button
                    onClick={onRestart}
                    className="group active:scale-95 transition-all duration-300 relative"
                >
                    <div className="absolute inset-0 bg-[var(--color-fe-cyan)] blur-[40px] opacity-30 group-hover:opacity-60 transition-opacity rounded-full animate-pulse" />
                    <div className="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white px-16 md:px-24 lg:px-32 py-6 lg:py-8 text-2xl lg:text-4xl font-black uppercase tracking-[0.25em] text-[#050810] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                        <span className="relative z-10">{GAME_CONFIG.event.victoryButton}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                </button>

            </div>
        </div>
    );
};
