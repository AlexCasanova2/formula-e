import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { Driver } from '../types';
import { mockTeams } from '../data/gameData';
import { getDriverImageUrl, getTeamColor } from '../data/assets';

interface MatchingGameProps {
    drivers: Driver[];
    onVictory: () => void;
    onMove: () => void;
}

interface Point {
    x: number;
    y: number;
}

interface Match {
    driverId: string;
    teamId: string;
    start: Point;
    end: Point;
    color: string;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({ drivers, onVictory, onMove }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const pilotRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const teamRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Barajar al montar
    const shuffledDrivers = useMemo(() => [...drivers].sort(() => Math.random() - 0.5), [drivers]);
    const shuffledTeams = useMemo(() => [...mockTeams].sort(() => Math.random() - 0.5), []);

    const [activeDrag, setActiveDrag] = useState<{ driverId: string; start: Point; current: Point } | null>(null);
    const [hoveredTeamId, setHoveredTeamId] = useState<string | null>(null);
    const [selectedPilotId, setSelectedPilotId] = useState<string | null>(null);
    const [completedMatches, setCompletedMatches] = useState<Match[]>([]);
    const [lastError, setLastError] = useState<{ driverId: string; teamId: string | null; start?: Point; end?: Point } | null>(null);

    // Obtener coordenadas relativas al contenedor
    const getRelativeCoords = useCallback((clientX: number, clientY: number): Point => {
        if (!containerRef.current) return { x: 0, y: 0 };
        const rect = containerRef.current.getBoundingClientRect();
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }, []);

    const handleStartDrag = (e: React.PointerEvent, driverId: string) => {
        if (completedMatches.find(m => m.driverId === driverId)) return;

        const pilotEl = pilotRefs.current[driverId];
        if (!pilotEl || !containerRef.current) return;

        const pilotRect = pilotEl.getBoundingClientRect();
        // El punto de inicio siempre es el centro de la parte derecha de la caja del piloto
        const startPoint = getRelativeCoords(pilotRect.right, pilotRect.top + pilotRect.height / 2);
        const currentPoint = getRelativeCoords(e.clientX, e.clientY);

        setActiveDrag({ driverId, start: startPoint, current: currentPoint });
        setSelectedPilotId(driverId);

        // Capturamos el puntero en el CONTENEDOR principal para no perder eventos al salir de la caja del piloto
        containerRef.current.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!activeDrag) return;

        const currentCoords = getRelativeCoords(e.clientX, e.clientY);
        setActiveDrag(prev => prev ? { ...prev, current: currentCoords } : null);

        // Detectar si estamos sobre una escudería para feedback visual inmediato
        let detectedTeamId: string | null = null;
        for (const teamId in teamRefs.current) {
            const el = teamRefs.current[teamId];
            if (el) {
                const rect = el.getBoundingClientRect();
                if (
                    e.clientX >= rect.left && e.clientX <= rect.right &&
                    e.clientY >= rect.top && e.clientY <= rect.bottom
                ) {
                    detectedTeamId = teamId;
                    break;
                }
            }
        }
        setHoveredTeamId(detectedTeamId);
    };

    const completeMatch = (driverId: string, teamId: string) => {
        const driver = drivers.find(d => d.id === driverId);
        if (driver && driver.teamId === teamId) {
            // ACIERTO
            const pilotEl = pilotRefs.current[driverId];
            const teamEl = teamRefs.current[teamId];
            if (!pilotEl || !teamEl) return;

            const pRect = pilotEl.getBoundingClientRect();
            const tRect = teamEl.getBoundingClientRect();

            setCompletedMatches(prev => [
                ...prev,
                {
                    driverId,
                    teamId,
                    start: getRelativeCoords(pRect.right, pRect.top + pRect.height / 2),
                    end: getRelativeCoords(tRect.left, tRect.top + tRect.height / 2),
                    color: getTeamColor(teamId)
                }
            ]);
            onMove();
            setSelectedPilotId(null);
        } else {
            // ERROR
            const pilotEl = pilotRefs.current[driverId];
            const teamEl = teamRefs.current[teamId];
            if (pilotEl && teamEl) {
                const pRect = pilotEl.getBoundingClientRect();
                const tRect = teamEl.getBoundingClientRect();

                setLastError({
                    driverId,
                    teamId,
                    start: getRelativeCoords(pRect.right, pRect.top + pRect.height / 2),
                    end: getRelativeCoords(tRect.left, tRect.top + tRect.height / 2)
                });
            } else {
                setLastError({ driverId, teamId: null });
            }

            setTimeout(() => setLastError(null), 800);
            onMove();
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!activeDrag) return;

        // Buscar si el punto de soltado está sobre alguna escudería
        let matchedTeamId: string | null = null;
        for (const teamId in teamRefs.current) {
            const el = teamRefs.current[teamId];
            if (el) {
                const rect = el.getBoundingClientRect();
                if (
                    e.clientX >= rect.left && e.clientX <= rect.right &&
                    e.clientY >= rect.top && e.clientY <= rect.bottom
                ) {
                    matchedTeamId = teamId;
                    break;
                }
            }
        }

        if (matchedTeamId) {
            completeMatch(activeDrag.driverId, matchedTeamId);
        }

        setActiveDrag(null);
        setHoveredTeamId(null);
    };

    const handleTeamClick = (teamId: string) => {
        // Soporte para click-click si el arrastre falla o prefieren pulsar
        if (selectedPilotId) {
            completeMatch(selectedPilotId, teamId);
        }
    };

    // Comprobar victoria
    useEffect(() => {
        if (completedMatches.length === drivers.length && drivers.length > 0) {
            onVictory();
        }
    }, [completedMatches, drivers, onVictory]);

    return (
        <div
            ref={containerRef}
            className="relative flex w-full h-full max-w-7xl mx-auto items-start justify-between px-6 py-4 overflow-hidden touch-none select-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            {/* SVG Layer se movió al final */}

            {/* Columna Pilotos (2 Columnas, Compactas) */}
            <div className="w-[420px] flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar z-10 h-full text-left">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2 px-2 sticky top-0 bg-[#050810]/95 py-2 backdrop-blur-sm z-30">Pilotos</h3>
                <div className="grid grid-cols-2 gap-1.5">
                    {shuffledDrivers.map(driver => {
                        const isMatched = completedMatches.some(m => m.driverId === driver.id);
                        const isDragging = activeDrag?.driverId === driver.id;
                        const isSelected = selectedPilotId === driver.id;
                        const hasError = lastError?.driverId === driver.id;
                        const teamColor = getTeamColor(driver.teamId);

                        return (
                            <div
                                key={driver.id}
                                ref={el => { pilotRefs.current[driver.id] = el; }}
                                onPointerDown={(e) => handleStartDrag(e, driver.id)}
                                className={`
                                    relative flex items-center gap-3 p-3 px-4 rounded-xl border transition-all duration-300 cursor-grab active:cursor-grabbing
                                    ${isMatched ? 'bg-slate-900/40 border-slate-800 opacity-40' :
                                        (isDragging || isSelected) ? 'bg-blue-900/30 border-[var(--color-fe-cyan)] shadow-[0_0_15px_rgba(0,255,255,0.2)] scale-95' :
                                            hasError ? 'bg-red-900/40 border-red-500 animate-shake' :
                                                'bg-slate-800/10 border-white/5 hover:border-white/20'}
                                `}
                            >
                                <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-700 border border-white/5 shrink-0 shadow-lg">
                                    <img src={getDriverImageUrl(driver.image)} alt={driver.name} className="h-full w-full object-contain" />
                                </div>
                                <span className={`text-[11px] font-black uppercase italic truncate ${isMatched ? 'text-slate-500' : 'text-white'}`}>
                                    {driver.name.split(' ').pop()}
                                </span>

                                {isMatched && (
                                    <div
                                        className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.4)] border-2 border-[#050810]"
                                        style={{ backgroundColor: teamColor }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Espacio Central para conexiones */}
            <div className="flex-1 min-w-[30px]" />

            {/* Columna Escuderías (Más grande) */}
            <div className="w-96 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar z-10 h-full">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2 px-2 sticky top-0 bg-[#050810]/95 py-2 backdrop-blur-sm z-30">Escuderías</h3>
                <div className="flex flex-col gap-1.5">
                    {shuffledTeams.map(team => {
                        const teamColor = getTeamColor(team.id);
                        const isHovered = hoveredTeamId === team.id;
                        const matchCount = completedMatches.filter(m => m.teamId === team.id).length;
                        const isCompleted = matchCount >= 2;
                        const hasError = lastError?.teamId === team.id;

                        return (
                            <div
                                key={team.id}
                                ref={el => { teamRefs.current[team.id] = el; }}
                                onClick={() => handleTeamClick(team.id)}
                                className={`
                                    relative flex items-center p-3 rounded-lg border transition-all duration-300 text-left cursor-pointer
                                    ${isCompleted ? 'bg-slate-900/40 border-slate-800 opacity-40' :
                                        hasError ? 'bg-red-900/40 border-red-500 animate-shake shadow-[0_0_15px_rgba(239,68,68,0.2)]' :
                                            isHovered ? 'bg-blue-900/20 border-[var(--color-fe-cyan)] translate-x-1 shadow-[0_0_15px_rgba(0,255,255,0.1)]' :
                                                'bg-slate-800/10 border-white/5'}
                                    hover:bg-slate-800/20
                                `}
                            >
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-lg transition-opacity duration-300"
                                    style={{ backgroundColor: teamColor, opacity: isCompleted ? 0.3 : 0.8 }}
                                />
                                <span className={`text-[11px] font-black italic uppercase tracking-tighter pl-3 transition-colors ${isCompleted ? 'text-slate-500' :
                                    isHovered ? 'text-[var(--color-fe-cyan)]' :
                                        'text-white'
                                    }`}>
                                    {team.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SVG Layer para los hilos (Ahora al final para estar siempre por encima de todo) */}
            <svg className="absolute inset-0 pointer-events-none z-50 w-full h-full overflow-visible">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Hilos Completados */}
                {completedMatches.map((match, i) => (
                    <line
                        key={i}
                        x1={match.start.x} y1={match.start.y}
                        x2={match.end.x} y2={match.end.y}
                        stroke={match.color}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        filter="url(#glow)"
                        className="opacity-90"
                    />
                ))}

                {/* Hilo Activo */}
                {activeDrag && (
                    <line
                        x1={activeDrag.start.x} y1={activeDrag.start.y}
                        x2={activeDrag.current.x} y2={activeDrag.current.y}
                        stroke="var(--color-fe-cyan)"
                        strokeWidth="4"
                        strokeDasharray="10,10"
                        strokeLinecap="round"
                        filter="url(#glow)"
                        className="animate-dash"
                    />
                )}

                {/* Hilo de Error Temporal */}
                {lastError && lastError.start && lastError.end && (
                    <line
                        x1={lastError.start.x} y1={lastError.start.y}
                        x2={lastError.end.x} y2={lastError.end.y}
                        stroke="#ef4444"
                        strokeWidth="4"
                        strokeLinecap="round"
                        filter="url(#glow)"
                        className="opacity-100"
                    />
                )}
            </svg>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                
                @keyframes dash {
                    to { stroke-dashoffset: -16; }
                }
                .animate-dash {
                    animation: dash 0.5s linear infinite;
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; animation-iteration-count: 2; }
            `}</style>
        </div>
    );
};
