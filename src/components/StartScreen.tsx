import React from 'react';

interface StartScreenProps {
    onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050810]/95 backdrop-blur-[20px]">

            {/* Luz ambiental tecnológica */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--color-fe-blue-light)_0%,_transparent_60%)] opacity-20 blur-[100px] pointer-events-none" />

            <div className="relative flex w-full max-w-5xl flex-col items-center justify-center rounded-[40px] bg-slate-900/40 border border-slate-700/50 p-20 text-center shadow-2xl overflow-hidden">

                {/* Subtle texture overlay overlay inside card */}
                <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('/img-texture-placeholder.png')]" />

                {/* Brand Header */}
                <div className="relative mb-12 flex flex-col items-center space-y-4">
                    <div className="h-20 max-w-sm rounded flex items-center justify-center opacity-90 mb-4">
                        {/* If the real logo existed: <img src="/mnt/data/Logo Formula E.png" /> */}
                        <span className="text-3xl font-black italic tracking-tighter text-white mr-2">FORMULA</span>
                        <span className="text-3xl font-black italic tracking-tighter text-[var(--color-fe-cyan)]">E</span>
                    </div>

                    <div className="px-6 py-2 rounded-full border border-slate-600/60 bg-slate-800/50 backdrop-blur-md">
                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
                            2026 CUPRA Raval Madrid E-Prix
                        </span>
                    </div>
                </div>

                <h1 className="relative mb-8 text-5xl font-black tracking-tight text-white drop-shadow-xl md:text-7xl leading-tight">
                    Encuentra las parejas de los equipos
                </h1>

                <p className="relative mb-16 max-w-2xl text-2xl font-light text-slate-300">
                    Usa tu memoria para descubrir a los dos pilotos que componen cada escudería de la parrilla oficial.
                </p>

                <button
                    onClick={onStart}
                    className="relative group inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[var(--color-fe-blue)] to-[var(--color-fe-cyan)] px-20 py-8 text-3xl font-black uppercase tracking-wider text-white shadow-[0_0_40px_rgba(0,229,255,0.3)] transition-all duration-300 hover:scale-[1.03] active:scale-95"
                >
                    <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></span>
                    Empezar Partida
                </button>
            </div>
        </div>
    );
};
