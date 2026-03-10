import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

interface HudProps {
    formattedTime: string;
    gameTitle: string;
    onRestartClick: () => void;
    onHomeClick: () => void;
}

export const Hud: React.FC<HudProps> = ({ formattedTime, gameTitle, onRestartClick, onHomeClick }) => {
    return (
        <header className="flex h-[110px] w-full items-center justify-between bg-[#001489]/60 px-10 backdrop-blur-[30px] border-b border-white/5 relative z-50 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">

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
                    <span
                        className="text-[10px] uppercase tracking-[0.2em] text-slate-400"
                        style={{ fontFamily: 'var(--font-fe-medium)' }}
                    >
                        {GAME_CONFIG.event.name}
                    </span>
                </div>
            </div>

            {/* Main Copy Centered - FE Sans Mini Black, tight heading style */}
            <div
                className="text-center flex-1 mx-8 text-[1.4rem] tracking-tight text-white drop-shadow-sm truncate uppercase"
                style={{ fontFamily: 'var(--font-fe-black)', lineHeight: 0.95 }}
            >
                {gameTitle}
            </div>

            {/* Timer & Controls Panel Premium Layout */}
            <div className="flex shrink-0 items-center justify-end space-x-4 min-w-[340px]">
                {/* Timer UI Element */}
                <div className="flex shrink-0 items-center justify-center rounded-[16px] bg-[#050810] px-8 py-2 border border-slate-700/60 shadow-inner mr-2">
                    <div className="flex flex-col items-center justify-center">
                        <span
                            className="text-[9px] uppercase tracking-[0.3em] text-[var(--color-fe-cyan)]/70 mb-0.5"
                            style={{ fontFamily: 'var(--font-fe-black)' }}
                        >
                            TIEMPO
                        </span>
                        {/* fe-numeral: Editorial set, large display numeral */}
                        <span
                            className="fe-numeral text-3xl tracking-widest text-white text-glow leading-none"
                        >
                            {formattedTime}
                        </span>
                    </div>
                </div>

                {/* Home Button CTA */}
                <button
                    onClick={onHomeClick}
                    aria-label="Ir al inicio"
                    className="group flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800/40 border border-white/10 hover:bg-slate-700 transition duration-300 active:scale-95 shadow-lg relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </button>

                {/* Restart Button CTA */}
                <button
                    onClick={onRestartClick}
                    aria-label="Reiniciar partida"
                    className="group flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-600/50 hover:bg-slate-700 transition duration-300 active:scale-95 shadow-lg relative overflow-hidden"
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
