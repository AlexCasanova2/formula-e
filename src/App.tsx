import { useState, useMemo, useCallback } from 'react';
import { StartScreen } from './components/StartScreen';
import { Hud } from './components/Hud';
import { GameGrid } from './components/GameGrid';
import { MatchingGame } from './components/MatchingGame';
import { VictoryModal } from './components/VictoryModal';
import type { Driver, GameMode } from './types';
import { mockDrivers } from './data/gameData';
import { useMemoryGame } from './hooks/useMemoryGame';
import { useGameTimer } from './hooks/useGameTimer';
import { useIdleTimeout } from './hooks/useIdleTimeout';
import { useAssetPreloader } from './hooks/useAssetPreloader';
import { GAME_CONFIG } from './config/gameConfig';
import { getDriverImageUrl } from './data/assets';

function App() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);

  // Inicializamos los pilotos basados en la configuración de la partida (totalPairs)
  const [activeDrivers] = useState<Driver[]>(() => {
    // Tomamos N parejas de equipos (2 pilotos por equipo)
    const pairsNeeded = GAME_CONFIG.gameplay.totalPairs;
    return mockDrivers.slice(0, pairsNeeded * 2);
  });

  const {
    cards,
    moves,
    gameStarted,
    gameFinished,
    startGame,
    resetGame,
    handleCardTap,
    isProcessing,
    setGameFinished,
    setMoves,
  } = useMemoryGame(activeDrivers);

  const {
    formattedTime,
    resetTimer
  } = useGameTimer({
    isRunning: gameStarted && gameMode !== null,
    isFinished: gameFinished
  });

  // Preloading critical assets to ensure smooth event experience
  const criticalAssets = useMemo(() => [
    GAME_CONFIG.assets.logoFE,
    GAME_CONFIG.assets.logoEvent,
    GAME_CONFIG.assets.backgroundKV,
    GAME_CONFIG.assets.textureOverlay,
    ...activeDrivers.map(d => getDriverImageUrl(d.image) || '')
  ].filter(url => url !== ''), [activeDrivers]);

  const { isLoaded, progress } = useAssetPreloader(criticalAssets);

  const [gameKey, setGameKey] = useState(0);

  const handleHome = useCallback(() => {
    resetGame();
    resetTimer();
    setGameMode(null);
  }, [resetGame, resetTimer]);

  const handleNewGame = useCallback((mode?: GameMode) => {
    resetTimer();
    if (mode) setGameMode(mode);
    setGameKey(prev => prev + 1);
    startGame();
  }, [resetTimer, startGame]);

  useIdleTimeout({
    onIdle: handleHome,
    timeoutSeconds: GAME_CONFIG.gameplay.idleTimeoutSeconds,
    enabled: (gameStarted || gameFinished) && gameMode !== null
  });

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#001489] text-white font-sans">
        <div className="mb-10 animate-pulse">
          <img
            src={GAME_CONFIG.assets.logoFE}
            alt="Formula E"
            className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]"
          />
        </div>
        <div className="w-[300px] h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[var(--color-fe-blue)] to-[var(--color-fe-cyan)] transition-all duration-300 shadow-[0_0_15px_var(--color-fe-cyan-glow)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-500/80">
          {progress}% - INICIALIZANDO EXPERIENCIA
        </p>
      </div>
    );
  }

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#001489] font-sans text-white select-none">

      {/* Background Decorators Premium FE */}
      <div className="absolute inset-0 z-0 bg-[#001489] pointer-events-none"></div>

      {/* Eliminado Background Image KV por petición del usuario */}

      {/* Luces volumétricas emulando circuito nocturno usando colores de config (Estáticas) */}
      <div
        className="absolute -top-[500px] -right-[500px] z-0 h-[1000px] w-[1000px] rounded-full opacity-10 blur-[150px] pointer-events-none"
        style={{ backgroundColor: GAME_CONFIG.colors.primary }}
      ></div>
      <div
        className="absolute -bottom-[500px] -left-[500px] z-0 h-[1000px] w-[1000px] rounded-full opacity-[0.06] blur-[150px] pointer-events-none"
        style={{ backgroundColor: GAME_CONFIG.colors.secondary }}
      ></div>

      {/* Grid texture superpuesta al fondo para dar textura técnica de "carbon fiber" o diseño UI HUD */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none mix-blend-overlay" />

      {/* Texture Overlay (Carbon/Branding) */}
      <div
        className="absolute inset-0 z-0 opacity-5 pointer-events-none grayscale invert mix-blend-screen"
        style={{ backgroundImage: `url('${GAME_CONFIG.assets.textureOverlay}')`, backgroundSize: '800px' }}
      />

      {/* Pantalla Inicial */}
      {gameMode === null && (
        <StartScreen onStart={handleNewGame} />
      )}

      {/* Main Game Interface */}
      <div
        className={`relative z-10 flex h-full w-full flex-col transition-all duration-[800ms] ${gameMode !== null ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'
          }`}
      >
        <Hud
          formattedTime={formattedTime}
          gameTitle={gameMode === 'memory' ? GAME_CONFIG.event.memoryTitle : GAME_CONFIG.event.matchingTitle}
          onRestartClick={() => handleNewGame()}
          onHomeClick={handleHome}
        />

        <div className="flex-1 w-full flex relative overflow-hidden">
          {/* Overlay suave inferior que da contraste a las cartas */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent opacity-80 pointer-events-none z-0" />

          {gameMode === 'memory' ? (
            <GameGrid
              key={`memory-${gameKey}`}
              cards={cards}
              drivers={activeDrivers}
              isProcessing={isProcessing}
              onCardClick={handleCardTap}
            />
          ) : (
            <MatchingGame
              key={`matching-${gameKey}`}
              drivers={activeDrivers}
              onVictory={() => setGameFinished(true)}
              onMove={() => setMoves((prev: number) => prev + 1)}
            />
          )}
        </div>
      </div>

      {/* Victory Modal Overlay */}
      {gameFinished && (
        <VictoryModal
          formattedTime={formattedTime}
          moves={moves}
          onRestart={() => handleNewGame()}
        />
      )}

    </main>
  );
}

export default App;
