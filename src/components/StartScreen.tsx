import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

interface StartScreenProps {
    onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050810]/40 backdrop-blur-[8px]">

            {/* Luz ambiental tecnológica */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--color-fe-blue-light)_0%,_transparent_60%)] opacity-20 blur-[100px] pointer-events-none" />

            <div className="relative flex w-full max-w-5xl flex-col items-center justify-center rounded-[40px] bg-slate-900/40 border border-slate-700/50 p-20 text-center shadow-2xl overflow-hidden">

                {/* Textura de Branding configurable */}
                <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
                    style={{ backgroundImage: `url('${GAME_CONFIG.assets.textureOverlay}')` }} />

                {/* Brand Header */}
                <div className="relative mb-12 flex flex-col items-center space-y-4">
                    <div className="h-24 md:h-28 flex items-center justify-center opacity-90 mb-4 transition-all duration-700">
                        {/* Logo Formula E Centrado */}
                        <img
                            src={GAME_CONFIG.assets.logoFE}
                            alt="Formula E"
                            className="h-full w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        />
                    </div>

                    <div className="px-6 py-2 rounded-full border border-slate-600/60 bg-slate-800/50 backdrop-blur-md shadow-lg">
                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-fe-cyan)]">
                            {GAME_CONFIG.event.name}
                        </span>
                    </div>
                </div>

                <h1 className="relative mb-8 text-5xl font-black tracking-tight text-white drop-shadow-xl md:text-7xl leading-tight uppercase italic">
                    {GAME_CONFIG.event.title}
                </h1>

                <p className="relative mb-16 max-w-2xl text-2xl font-light text-slate-300">
                    {GAME_CONFIG.event.copy}. Memoriza las parejas de pilotos oficiales.
                </p>

                <button
                    onClick={onStart}
                    aria-label="Empezar partida de memoria"
                    className="relative group inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[var(--color-fe-blue)] to-[var(--color-fe-cyan)] px-20 py-8 text-3xl font-black uppercase tracking-wider text-white shadow-[0_0_40px_rgba(0,229,255,0.3)] transition-all duration-300 hover:scale-[1.03] active:scale-95"
                >
                    <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></span>
                    Empezar Partida
                </button>
            </div>
        </div>
    );
};
