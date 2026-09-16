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
  const debugRef = useRef(false); 
  
  // Track keyboard inputs
  const keysRef = useRef({ space: false, left: false, right: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'd' || e.key === 'D') debugRef.current = !debugRef.current;
      if (e.key === 'p' || e.key === 'P') {
        if (gameState.current) gameState.current.isPaused = !gameState.current.isPaused;
      }
      
      if (e.code === 'Space') { e.preventDefault(); keysRef.current.space = true; }
      if (e.code === 'ArrowLeft') { e.preventDefault(); keysRef.current.left = true; }
      if (e.code === 'ArrowRight') { e.preventDefault(); keysRef.current.right = true; }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') { e.preventDefault(); keysRef.current.space = false; }
      if (e.code === 'ArrowLeft') { e.preventDefault(); keysRef.current.left = false; }
      if (e.code === 'ArrowRight') { e.preventDefault(); keysRef.current.right = false; }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
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

    // Pass keysRef.current into the physics engine
    updatePhysics(gameState.current, navigator.getGamepads(), keysRef.current, deltaTime, canvas.width, canvas.height);
    renderFrame(ctx, gameState.current, canvas.width, canvas.height, debugRef.current);

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