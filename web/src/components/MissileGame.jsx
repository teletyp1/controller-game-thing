import React, { useEffect, useRef } from 'react';
import { initGameState } from '../game/state';
import { updatePhysics } from '../game/physics';
import { renderFrame } from '../game/renderer';
import { levels } from '../game/levels';

const IDLE_TIMEOUT_SECONDS = 60;

const MissileGame = ({ playerConfigs, onExit }) => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  
  const gameState = useRef(null);
  const lastTime = useRef(performance.now());
  const debugRef = useRef(false); 
  const keysRef = useRef({ space: false, left: false, right: false });

  const victoryBuffer = useRef(0);
  const idleTimer = useRef(0);

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
    gameState.current = initGameState(0, playerConfigs, 0);
  }, [playerConfigs]);

  const updateLoop = (time) => {
    if (!canvasRef.current || !gameState.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const deltaTime = Math.min((time - lastTime.current) / 1000, 0.1);
    lastTime.current = time;

    const gamepads = navigator.getGamepads();

    // 1. Check for Active Input (L2, R2, X, Space, Left, Right)
    const hasKeyboardInput = keysRef.current.space || keysRef.current.left || keysRef.current.right;
    let hasGamepadInput = false;

    for (let i = 0; i < gamepads.length; i++) {
      const pad = gamepads[i];
      if (!pad) continue;

      const xPressed = pad.buttons[0]?.pressed || pad.buttons[0]?.value > 0.5;
      const l2Pressed = (pad.buttons[6]?.value || 0) > 0.2;
      const r2Pressed = (pad.buttons[7]?.value || 0) > 0.2;

      if (xPressed || l2Pressed || r2Pressed) {
        hasGamepadInput = true;
        break;
      }
    }

    if (hasKeyboardInput || hasGamepadInput) {
      idleTimer.current = 0;
    } else {
      idleTimer.current += deltaTime;
      if (idleTimer.current >= IDLE_TIMEOUT_SECONDS) {
        onExit();
        return;
      }
    }

    // 2. Check for Victory Screen Exit Input
    if (gameState.current.phase === 'GAME_COMPLETED') {
      victoryBuffer.current += deltaTime;
      if (victoryBuffer.current > 1.0) {
        let returnPressed = keysRef.current.space;
        if (!returnPressed) {
          for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]?.buttons[0]?.pressed || gamepads[i]?.buttons[0]?.value > 0.5) {
              returnPressed = true;
              break;
            }
          }
        }
        if (returnPressed) {
          onExit();
          return;
        }
      }
    }

    // 3. Physics & Render
    updatePhysics(gameState.current, gamepads, keysRef.current, deltaTime, canvas.width, canvas.height);
    renderFrame(ctx, gameState.current, canvas.width, canvas.height, debugRef.current);

    // 4. Level Progression Handling
    if (gameState.current.phase === 'LEVEL_CLEARED' && gameState.current.phaseTimer <= 0) {
      const nextTotalScore = gameState.current.totalScore + gameState.current.levelScore;
      const nextLevelIndex = gameState.current.levelIndex + 1;

      if (nextLevelIndex >= levels.length) {
        gameState.current.phase = 'GAME_COMPLETED';
        gameState.current.totalScore = nextTotalScore;
        victoryBuffer.current = 0;
      } else {
        gameState.current = initGameState(nextLevelIndex, playerConfigs, nextTotalScore);
      }
    } else if (gameState.current.phase === 'LEVEL_FAILED' && gameState.current.phaseTimer <= 0) {
      gameState.current = initGameState(gameState.current.levelIndex, playerConfigs, gameState.current.totalScore);
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