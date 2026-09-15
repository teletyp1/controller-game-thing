import { levels } from './levels';

export const initGameState = (levelIndex, playerConfigs) => {
  const levelData = levels[levelIndex];
  
  // Calculate the scaled time limit based on player count
  // We use Math.max(1, length) just to be safe from divide-by-zero errors
  const playerCount = Math.max(1, playerConfigs.length);
  const scaledTimeLimit = levelData.timeLimit / playerCount;

  return {
    levelIndex,
    phase: 'READY_CHECK', 
    phaseTimer: 0, 
    timeRemaining: scaledTimeLimit, // Use the scaled time
    timeLimit: scaledTimeLimit,     // Store the scaled time for the HUD percentage
    cannon: levelData.cannon,
    obstacles: levelData.obstacles,
    targets: levelData.targets.map(t => ({ ...t, active: true })), 
    
    missiles: playerConfigs.map((config) => ({
      id: config.gamepadIndex,
      color: config.color,
      x: levelData.cannon.x,
      y: levelData.cannon.y,
      angle: levelData.cannon.angle,
      velocity: 600,
      radius: 30,
      status: 'WAITING', 
      isPaused: false,
      nextStatus: null, 
      explosionRadius: 0,
      respawnTimer: 0,
      isReady: false 
    }))
  };
};