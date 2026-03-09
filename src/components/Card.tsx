import React from 'react';
import type { Card as CardType, Driver } from '../types';

interface CardProps {
    card: CardType;
    driver?: Driver;
    onClick: (card: CardType) => void;
}

export const Card: React.FC<CardProps> = ({ card, driver, onClick }) => {
    const { isFlipped, isMatched, teamId } = card;

    // Lógica de color básica temporal asumiendo teamId (luego lo sacaríamos del objeto Team)
    const getTeamColor = (tId: string) => {
        switch (tId) {
            case 'cupra': return '#00B1A0';
            case 'jaguar': return '#000000';
            case 'porsche': return '#D5001C';
            case 'ds': return '#D4AF37';
            case 'andretti': return '#ED1B24';
            case 'nissan': return '#C3002F';
            case 'mclaren': return '#FF8000';
            case 'maserati': return '#001489';
            case 'ert:': return '#CCFF00';
            case 'mahindra': return '#DD052B';
            default: return '#00B1A0';
        }
    };

    const dynamicColor = getTeamColor(teamId);

    return (
        <div
            className={`relative w-full h-full cursor-pointer select-none [perspective:1000px] transition-all duration-300 active:scale-95 ${isMatched ? 'card-matched-anim pointer-events-none' : ''
                }`}
            onClick={() => onClick(card)}
        >
            <div
                className={`w-full h-full rounded-[24px] transition-transform duration-[600ms] [transform-style:preserve-3d] ${isFlipped || isMatched ? '[transform:rotateY(180deg)] shadow-2xl shadow-[var(--color-fe-cyan-glow)]' : 'shadow-xl shadow-black/50'
                    }`}
            >
                {/* PARTE TRASERA (BACK): Oculta, diseño premium oscuro con logo FE */}
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[16px] xl:rounded-[24px] bg-gradient-to-br from-slate-800 to-[#0A0E17] border-2 xl:border-[3px] border-slate-700/60 [backface-visibility:hidden] overflow-hidden">
                    {/* Fondo Texturizado Simulado */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050810_100%)] opacity-80" />
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-fe-blue-light)] blur-[60px] opacity-30 pointer-events-none" />

                    {/* Logo Central (E de Formula E) */}
                    <span className="relative z-10 text-[50px] md:text-[60px] lg:text-[70px] font-black italic tracking-tighter text-slate-600/30">FE</span>

                    <div className="absolute bottom-4 w-1/2 h-1 bg-slate-700/50 rounded-full" />
                </div>

                {/* PARTE DELANTERA (FRONT): Al hacer FLIP, revela la foto del piloto y su color corporativo */}
                <div
                    className="absolute inset-0 flex flex-col items-center justify-start rounded-[16px] xl:rounded-[24px] bg-white border-2 lg:border-4 p-2 md:p-3 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden"
                    style={{ borderColor: dynamicColor }}
                >
                    {/* Degradado superpuesto según equipo */}
                    <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(to bottom, transparent, ${dynamicColor})` }} />

                    {/* FOTO */}
                    <div className="flex-[2_2_0%] w-full flex items-center justify-center bg-slate-100 rounded-lg lg:rounded-[12px] overflow-hidden relative shadow-inner">
                        {driver?.image ? (
                            <img src={driver.image} alt={driver.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center justify-end h-full opacity-60">
                                <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full border-2 lg:border-4 mb-2" style={{ borderColor: dynamicColor, backgroundColor: '#cbd5e1' }} />
                                <div className="w-16 h-10 lg:w-20 lg:h-14 rounded-t-xl lg:rounded-t-2xl" style={{ backgroundColor: '#cbd5e1' }} />
                            </div>
                        )}
                    </div>

                    {/* DATOS */}
                    <div className="flex-[0.8_0.8_0%] w-full flex flex-col justify-center items-center mt-1 lg:mt-2 z-10 px-1">
                        <p className="text-[0.85rem] md:text-[1rem] lg:text-[1.1rem] xl:text-[1.2rem] font-bold text-slate-950 uppercase tracking-tighter leading-none mb-1 md:mb-1.5 text-center line-clamp-1">
                            {driver?.name || 'Desconocido'}
                        </p>
                        <p className="text-[0.55rem] md:text-[0.6rem] lg:text-[0.65rem] font-black uppercase tracking-[0.2em] text-center line-clamp-1" style={{ color: dynamicColor }}>
                            {driver?.teamName || card.teamId}
                        </p>
                    </div>

                    {/* Icon Match State (Only visible if matched) */}
                    {isMatched && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-20 flex items-center justify-center">
                            <div className="rounded-full bg-[var(--color-fe-cyan)] p-2 md:p-3 shadow-[0_0_20px_var(--color-fe-cyan-glow)]">
                                <svg className="w-6 h-6 lg:w-8 lg:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
