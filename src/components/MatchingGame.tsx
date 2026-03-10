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
    teamId: string; // The team identified by the group and the target team
    start: Point;
    end: Point;
    color: string;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({ drivers, onVictory, onMove }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const groupRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const teamRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Agrupar pilotos por escudería
    const driverGroups = useMemo(() => {
        const groups: { teamId: string; drivers: Driver[] }[] = [];
        const map: { [key: string]: Driver[] } = {};

        drivers.forEach(d => {
            if (!map[d.teamId]) map[d.teamId] = [];
            map[d.teamId].push(d);
        });

        Object.entries(map).forEach(([teamId, teamDrivers]) => {
            groups.push({ teamId, drivers: teamDrivers });
        });

        return groups.sort(() => Math.random() - 0.5);
    }, [drivers]);

    const shuffledTeams = useMemo(() => [...mockTeams].sort(() => Math.random() - 0.5), []);

    const [activeDrag, setActiveDrag] = useState<{ teamId: string; start: Point; current: Point } | null>(null);
    const [hoveredTeamId, setHoveredTeamId] = useState<string | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [completedMatches, setCompletedMatches] = useState<Match[]>([]);
    const [lastError, setLastError] = useState<{ teamId: string; targetTeamId: string | null; start?: Point; end?: Point } | null>(null);

    // Obtener coordenadas relativas al contenedor
    const getRelativeCoords = useCallback((clientX: number, clientY: number): Point => {
        if (!containerRef.current) return { x: 0, y: 0 };
        const rect = containerRef.current.getBoundingClientRect();
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }, []);

    const handleStartDrag = (e: React.PointerEvent, teamId: string) => {
        if (completedMatches.find(m => m.teamId === teamId)) return;

        const groupEl = groupRefs.current[teamId];
        if (!groupEl || !containerRef.current) return;

        const groupRect = groupEl.getBoundingClientRect();
        // El punto de inicio siempre es el centro de la parte derecha de la caja del grupo
        const startPoint = getRelativeCoords(groupRect.right, groupRect.top + groupRect.height / 2);
        const currentPoint = getRelativeCoords(e.clientX, e.clientY);

        setActiveDrag({ teamId, start: startPoint, current: currentPoint });
        setSelectedGroupId(teamId);

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

    const completeMatch = (sourceTeamId: string, targetTeamId: string) => {
        if (sourceTeamId === targetTeamId) {
            // ACIERTO
            const groupEl = groupRefs.current[sourceTeamId];
            const teamEl = teamRefs.current[targetTeamId];
            if (!groupEl || !teamEl) return;

            const gRect = groupEl.getBoundingClientRect();
            const tRect = teamEl.getBoundingClientRect();

            setCompletedMatches(prev => [
                ...prev,
                {
                    teamId: sourceTeamId,
                    start: getRelativeCoords(gRect.right, gRect.top + gRect.height / 2),
                    end: getRelativeCoords(tRect.left, tRect.top + tRect.height / 2),
                    color: getTeamColor(targetTeamId)
                }
            ]);
            onMove();
            setSelectedGroupId(null);
        } else {
            // ERROR
            const groupEl = groupRefs.current[sourceTeamId];
            const teamEl = teamRefs.current[targetTeamId];
            if (groupEl && teamEl) {
                const gRect = groupEl.getBoundingClientRect();
                const tRect = teamEl.getBoundingClientRect();

                setLastError({
                    teamId: sourceTeamId,
                    targetTeamId,
                    start: getRelativeCoords(gRect.right, gRect.top + gRect.height / 2),
                    end: getRelativeCoords(tRect.left, tRect.top + tRect.height / 2)
                });
            } else {
                setLastError({ teamId: sourceTeamId, targetTeamId: null });
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
            completeMatch(activeDrag.teamId, matchedTeamId);
        }

        setActiveDrag(null);
        setHoveredTeamId(null);
    };

    const handleTeamClick = (teamId: string) => {
        // Soporte para click-click si el arrastre falla o prefieren pulsar
        if (selectedGroupId) {
            completeMatch(selectedGroupId, teamId);
        }
    };

    // Comprobar victoria
    useEffect(() => {
        if (completedMatches.length === driverGroups.length && driverGroups.length > 0) {
            setTimeout(onVictory, 500);
        }
    }, [completedMatches, driverGroups, onVictory]);

    return (
        <div
            ref={containerRef}
            className="relative flex w-full h-full max-w-[1440px] mx-auto items-center justify-center gap-16 px-8 py-4 overflow-hidden touch-none select-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            {/* SVG Layer se movió al final */}

            {/* Columna Pilotos (2 Columnas de Parejas) */}
            <div className="w-[680px] flex flex-col gap-2 overflow-y-auto pr-4 custom-scrollbar z-10 max-h-full text-left">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300 mb-3 px-4 sticky top-0 bg-[#001489]/95 py-3 backdrop-blur-md z-30 border-l-2 border-cyan-500/50">
                    Pilotos por Escudería
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {driverGroups.map(group => {
                        const isMatched = completedMatches.some(m => m.teamId === group.teamId);
                        const isDragging = activeDrag?.teamId === group.teamId;
                        const isSelected = selectedGroupId === group.teamId;
                        const hasError = lastError?.teamId === group.teamId;
                        const teamColor = getTeamColor(group.teamId);

                        return (
                            <div
                                key={group.teamId}
                                ref={el => { groupRefs.current[group.teamId] = el; }}
                                onPointerDown={(e) => handleStartDrag(e, group.teamId)}
                                className={`
                                    relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 cursor-grab active:cursor-grabbing
                                    ${isMatched ? 'bg-slate-900/40 border-slate-800 opacity-40' :
                                        (isDragging || isSelected) ? 'bg-blue-900/30 border-[var(--color-fe-cyan)] shadow-[0_0_15px_rgba(0,255,255,0.2)] scale-95' :
                                            hasError ? 'bg-red-900/40 border-red-500 animate-shake shadow-[0_0_15px_rgba(239,68,68,0.3)]' :
                                                'bg-slate-800/10 border-white/5 hover:border-white/25 hover:bg-slate-800/20'}
                                `}
                            >
                                <div className="flex gap-8 items-center justify-center w-full">
                                    {group.drivers.map(driver => (
                                        <div key={driver.id} className="flex flex-col items-center gap-1.5 min-w-[80px]">
                                            <div className="h-14 w-14 rounded-full overflow-hidden bg-slate-700 border border-white/5 shadow-lg mb-1">
                                                <img src={getDriverImageUrl(driver.image)} alt={driver.name} className="h-full w-full object-contain scale-110" />
                                            </div>
                                            <span className={`text-[11px] font-black uppercase italic truncate max-w-[100px] text-center leading-none tracking-tight ${isMatched ? 'text-slate-500' : 'text-white'}`}>
                                                {driver.name.split(' ').pop()}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {isMatched && (
                                    <div
                                        className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.4)] border-2 border-[#001489] flex items-center justify-center z-20"
                                        style={{ backgroundColor: teamColor }}
                                    >
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Espacio Central para conexiones (Eliminado flex-1 para usar gap) */}

            {/* Columna Escuderías (Más grande) */}
            <div className="w-96 flex flex-col gap-2 overflow-y-auto pr-4 custom-scrollbar z-10 max-h-full">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300 mb-3 px-4 sticky top-0 bg-[#001489]/95 py-3 backdrop-blur-md z-30 border-l-2 border-cyan-500/50">
                    Escuderías
                </h3>
                <div className="flex flex-col gap-1.5">
                    {shuffledTeams.map(team => {
                        const teamColor = getTeamColor(team.id);
                        const isHovered = hoveredTeamId === team.id;
                        const isCompleted = completedMatches.some(m => m.teamId === team.id);
                        const hasError = lastError?.targetTeamId === team.id;

                        return (
                            <div
                                key={team.id}
                                ref={el => { teamRefs.current[team.id] = el; }}
                                onClick={() => handleTeamClick(team.id)}
                                className={`
                                    relative flex items-center p-4 rounded-xl border transition-all duration-300 text-left cursor-pointer
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
                                <span className={`text-[13px] font-black italic uppercase tracking-tighter pl-3 transition-colors ${isCompleted ? 'text-slate-500' :
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
