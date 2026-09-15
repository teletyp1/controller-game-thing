import React, { useEffect, useRef } from 'react';
import { initGameState } from '../game/state';
import { updatePhysics } from '../game/physics';
import { renderFrame } from '../game/renderer';
import { levels } from '../game/levels';

const MissileGame = ({ playerConfigs }) => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  
  const gameState = useRef(null);
  const lastTime = useRef(performance.now());
  const debugRef = useRef(false); // Track debug toggle outside of game state

  // Keyboard listener for the Debug switch
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle Debug
      if (e.key === 'd' || e.key === 'D') {
        debugRef.current = !debugRef.current;
      }
      // Toggle Pause
      if (e.key === 'p' || e.key === 'P') {
        if (gameState.current) {
          gameState.current.isPaused = !gameState.current.isPaused;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    gameState.current = initGameState(0, playerConfigs);
  }, [playerConfigs]);

  const updateLoop = (time) => {
    if (!canvasRef.current || !gameState.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const deltaTime = (time - lastTime.current) / 1000;
    lastTime.current = time;

    // 1. Run Physics
    updatePhysics(gameState.current, navigator.getGamepads(), deltaTime, canvas.width, canvas.height);
    
    // 2. Render Screen (Now passing debugRef.current!)
    renderFrame(ctx, gameState.current, canvas.width, canvas.height, debugRef.current);

    // 3. Handle Level Transitions
    if (gameState.current.phase !== 'PLAYING' && gameState.current.phaseTimer <= 0) {
      if (gameState.current.phase === 'LEVEL_CLEARED') {
        const nextLevel = (gameState.current.levelIndex + 1) % levels.length;
        gameState.current = initGameState(nextLevel, playerConfigs);
      } else if (gameState.current.phase === 'LEVEL_FAILED') {
        gameState.current = initGameState(gameState.current.levelIndex, playerConfigs);
      }
    }

    requestRef.current = requestAnimationFrame(updateLoop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        className="max-h-full max-w-full"
      />
    </div>
  );
};

export default MissileGame;