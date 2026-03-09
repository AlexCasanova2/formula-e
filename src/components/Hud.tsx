import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

interface HudProps {
    formattedTime: string;
    onRestartClick: () => void;
}

export const Hud: React.FC<HudProps> = ({ formattedTime, onRestartClick }) => {
    return (
        <header className="flex h-[110px] w-full items-center justify-between bg-[#0A0E17]/80 px-10 backdrop-blur-[30px] border-b border-white/5 relative z-50 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">

            {/* Target Logo / Event space */}
            <div className="flex items-center space-x-6 min-w-[320px]">
                {/* Logo Formula E real de Config */}
                <div className="flex flex-col items-start justify-center">
                    <img
                        src={GAME_CONFIG.assets.logoFE}
                        alt="Formula E"
                        className="h-10 w-auto object-contain mb-1"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        {GAME_CONFIG.event.name}
                    </span>
                </div>
            </div>

            {/* Main Copy Centered - Centralizado en Config */}
            <div className="text-center flex-1 mx-8 text-[1.4rem] font-bold tracking-tight text-white drop-shadow-sm truncate">
                {GAME_CONFIG.event.copy}
            </div>

            {/* Timer & Controls Panel Premium Layout */}
            <div className="flex shrink-0 items-center justify-end space-x-6 min-w-[280px]">
                {/* Timer UI Element */}
                <div className="flex shrink-0 items-center justify-center rounded-[16px] bg-[#050810] px-8 py-2 border border-slate-700/60 shadow-inner">
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-[9px] uppercase font-black tracking-[0.3em] text-[var(--color-fe-cyan)]/70 mb-0.5">
                            TIEMPO
                        </span>
                        <span className="font-mono text-3xl font-black tracking-widest text-white text-glow leading-none">
                            {formattedTime}
                        </span>
                    </div>
                </div>

                {/* Restart Button CTA */}
                <button
                    onClick={onRestartClick}
                    aria-label="Reiniciar partida"
                    className="group flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/80 border border-slate-600/50 hover:bg-slate-700 transition duration-300 active:scale-95 shadow-lg relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[var(--color-fe-blue-light)] opacity-0 group-hover:opacity-20 transition-opacity" />
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            {/* Thin line glow at the bottom of header */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-fe-cyan)] to-transparent opacity-20" />
        </header>
    );
};
