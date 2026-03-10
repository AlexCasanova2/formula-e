import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';
import type { GameMode } from '../types';

interface StartScreenProps {
    onStart: (mode: GameMode) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#001489]/20 backdrop-blur-[8px]">

            {/* Luz ambiental tecnológica */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--color-fe-blue-light)_0%,_transparent_60%)] opacity-20 blur-[100px] pointer-events-none" />

            <div className="relative flex w-full max-w-6xl flex-col items-center justify-center rounded-[40px] bg-slate-900/40 border border-slate-700/50 p-12 md:p-16 text-center shadow-2xl overflow-hidden">

                {/* Eliminada Textura de Branding por petición del usuario */}

                {/* Brand Header */}
                <div className="relative mb-10 flex flex-col items-center space-y-4">
                    <div className="h-20 md:h-24 flex items-center justify-center opacity-90 transition-all duration-700">
                        {/* Logo Formula E Centrado */}
                        <img
                            src={GAME_CONFIG.assets.logoFE}
                            alt="Formula E"
                            className="h-full w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        />
                    </div>

                    <div className="px-6 py-2 rounded-full border border-slate-600/60 bg-slate-800/50 backdrop-blur-md shadow-lg">
                        <span
                            className="text-xs uppercase tracking-[0.2em] text-[var(--color-fe-cyan)]"
                            style={{ fontFamily: 'var(--font-fe-medium)' }}
                        >
                            {GAME_CONFIG.event.name}
                        </span>
                    </div>
                </div>

                <h1
                    className="relative mb-12 text-4xl tracking-tight text-white drop-shadow-xl md:text-6xl uppercase"
                    style={{ fontFamily: 'var(--font-fe-black)', lineHeight: 0.95, letterSpacing: '-0.02em' }}
                >
                    {GAME_CONFIG.event.title}
                </h1>

                {/* Opciones de Juego */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl relative z-10">

                    {/* Modo Memory */}
                    <button
                        onClick={() => onStart('memory')}
                        className="group relative flex flex-col items-center p-8 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 active:scale-95 text-center"
                    >
                        <div className="mb-6 rounded-2xl bg-[var(--color-fe-blue)]/20 p-5 group-hover:bg-[var(--color-fe-blue)]/40 transition-colors">
                            <svg className="w-10 h-10 text-[var(--color-fe-cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </div>
                        <h3
                            className="text-2xl text-white uppercase tracking-tighter mb-3"
                            style={{ fontFamily: 'var(--font-fe-black)', lineHeight: 0.95 }}
                        >Memory Game</h3>
                        <p
                            className="text-slate-400 text-sm leading-relaxed max-w-[320px]"
                            style={{ fontFamily: 'var(--font-fe-medium)' }}
                        >Encuentra las parejas de pilotos de cada escudería en el menor tiempo posible.</p>
                        <div className="mt-8 px-6 py-2 bg-[var(--color-fe-cyan)] text-[#050810] text-xs font-black uppercase tracking-widest rounded-full transition-all duration-300 group-hover:scale-110 shadow-lg shadow-[var(--color-fe-cyan)]/20">
                            Seleccionar
                        </div>
                    </button>

                    {/* Modo Matching */}
                    <button
                        onClick={() => onStart('matching')}
                        className="group relative flex flex-col items-center p-8 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 active:scale-95 text-center"
                    >
                        <div className="mb-6 rounded-2xl bg-[var(--color-fe-blue)]/20 p-5 group-hover:bg-[var(--color-fe-blue)]/40 transition-colors">
                            <svg className="w-10 h-10 text-[var(--color-fe-cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </div>
                        <h3
                            className="text-2xl text-white uppercase tracking-tighter mb-3"
                            style={{ fontFamily: 'var(--font-fe-black)', lineHeight: 0.95 }}
                        >Matching Game</h3>
                        <p
                            className="text-slate-400 text-sm leading-relaxed max-w-[320px]"
                            style={{ fontFamily: 'var(--font-fe-medium)' }}
                        >Une a cada piloto profesional con su escudería correcta. ¡Demuestra tu conocimiento!</p>
                        <div className="mt-8 px-6 py-2 bg-[var(--color-fe-cyan)] text-[#050810] text-xs font-black uppercase tracking-widest rounded-full transition-all duration-300 group-hover:scale-110 shadow-lg shadow-[var(--color-fe-cyan)]/20">
                            Seleccionar
                        </div>
                    </button>

                </div>
            </div>
        </div>
    );
};
