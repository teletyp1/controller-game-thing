import { levels } from './levels';

export const initGameState = (levelIndex, playerConfigs) => {
  const levelData = levels[levelIndex];
  
  const playerCount = Math.max(1, playerConfigs.length);
  const scaledTimeLimit = levelData.timeLimit / playerCount;

  return {
    levelIndex,
    phase: 'COUNTDOWN', // Instantly go into the buffer phase
    phaseTimer: 4.0,    // Increased to 4 seconds to give players a breather
    isPaused: false,
    timeRemaining: scaledTimeLimit,
    timeLimit: scaledTimeLimit,
    cannon: levelData.cannon,
    obstacles: levelData.obstacles,
    targets: levelData.targets.map(t => ({ ...t, active: true })), 
    
    missiles: playerConfigs.map((config) => ({
      id: config.gamepadIndex,
      color: config.color,
      x: levelData.cannon.x,
      y: levelData.cannon.y,
      angle: levelData.cannon.angle,
      velocity: 360,
      radius: 15,
      status: 'WAITING', 
      nextStatus: null, 
      explosionRadius: 0,
      respawnTimer: 0
      // isReady is no longer needed in the game state!
    }))
  };
};