import { useState } from 'react';
import { StartScreen } from './components/StartScreen';
import { Hud } from './components/Hud';
import { GameGrid } from './components/GameGrid';
import { VictoryModal } from './components/VictoryModal';
import type { Driver } from './types';
import { mockDrivers } from './data/gameData';
import { useMemoryGame } from './hooks/useMemoryGame';
import { useGameTimer } from './hooks/useGameTimer';

function App() {
  const [activeDrivers] = useState<Driver[]>(mockDrivers);

  const {
    cards,
    moves,
    matches,
    gameStarted,
    gameFinished,
    startGame,
    resetGame,
    handleCardTap,
  } = useMemoryGame(activeDrivers);

  const {
    formattedTime,
    resetTimer
  } = useGameTimer({
    isRunning: gameStarted,
    isFinished: gameFinished
  });

  const handleStart = () => {
    resetTimer();
    startGame();
  };

  const handleRestart = () => {
    resetGame();
    resetTimer();
  };

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#0A0E17] font-sans text-white select-none">

      {/* Background Decorators Premium FE */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,_#111A2E_0%,_#050810_100%)] pointer-events-none transition-colors duration-1000"></div>

      {/* Luces volumétricas animadas emulando circuito nocturno */}
      <div className="absolute -top-[500px] -right-[500px] z-0 h-[1000px] w-[1000px] rounded-full bg-[var(--color-fe-blue)] opacity-10 blur-[150px] pointer-events-none bg-pulse-slow"></div>
      <div className="absolute -bottom-[500px] -left-[500px] z-0 h-[1000px] w-[1000px] rounded-full bg-[var(--color-fe-cyan)] opacity-[0.06] blur-[150px] pointer-events-none bg-pulse-slow object-none [animation-delay:-4s]"></div>

      {/* Grid texture superpuesta al fondo para dar textura técnica de "carbon fiber" o diseño UI HUD */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none mix-blend-overlay" />

      {/* Pantalla Inicial */}
      {!gameStarted && (
        <StartScreen onStart={handleStart} />
      )}

      {/* Main Game Interface */}
      <div
        className={`relative z-10 flex h-full w-full flex-col transition-all duration-[800ms] ${gameStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'
          }`}
      >
        <Hud formattedTime={formattedTime} onRestartClick={handleRestart} />

        <div className="flex-1 w-full flex relative overflow-hidden">
          {/* Overlay suave inferior que da contraste a las cartas */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent opacity-80 pointer-events-none z-0" />

          <GameGrid
            cards={cards}
            drivers={activeDrivers}
            onCardClick={handleCardTap}
          />
        </div>
      </div>

      {/* Victory Modal Overlay */}
      {gameFinished && (
        <VictoryModal formattedTime={formattedTime} onRestart={handleRestart} />
      )}

    </main>
  );
}

export default App;
