import React from 'react';

interface VictoryModalProps {
    formattedTime: string;
    onRestart: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ formattedTime, onRestart }) => {
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050810]/95 backdrop-blur-[20px] transition-opacity duration-[800ms]">

            {/* Luz ambiental tecnológica */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--color-fe-cyan)_0%,_transparent_60%)] opacity-10 blur-[100px] pointer-events-none" />

            <div className="relative flex w-full max-w-4xl flex-col items-center justify-center rounded-[40px] bg-slate-900/40 border border-slate-700/50 p-20 text-center shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden">

                {/* Decorative Grid Lines Simulation */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none mix-blend-overlay" />

                <div className="mb-4 rounded-full bg-slate-800/80 p-6 shadow-inner border border-slate-700/50 z-10 animate-bounce">
                    <svg className="w-16 h-16 text-[var(--color-fe-cyan)] drop-shadow-[0_0_15px_var(--color-fe-cyan-glow)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>

                <h2 className="relative z-10 mb-2 text-7xl font-black italic tracking-tighter text-white drop-shadow-2xl">
                    ¡COMPLETADO!
                </h2>

                <p className="relative z-10 mb-12 text-2xl font-light text-slate-300">
                    Misión exitosa. Has memorizado todas las escuderías.
                </p>

                <div className="relative z-10 mb-16 flex flex-col items-center bg-[#050810]/60 p-10 rounded-[24px] border border-slate-700/60 shadow-inner min-w-[320px]">
                    <span className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">
                        Tu Tiempo Final
                    </span>
                    <span className="mt-2 text-8xl font-mono font-black tracking-widest text-[var(--color-fe-cyan)] drop-shadow-[0_0_20px_var(--color-fe-cyan-glow)]">
                        {formattedTime}
                    </span>
                </div>

                <button
                    onClick={onRestart}
                    className="relative z-10 group inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-slate-200 to-white px-20 py-8 text-3xl font-black uppercase tracking-widest text-[#050810] shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-[1.03] active:scale-95"
                >
                    <span className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-100"></span>
                    Jugar de Nuevo
                </button>
            </div>
        </div>
    );
};
