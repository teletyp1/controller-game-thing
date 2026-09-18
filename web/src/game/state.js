import { levels } from './levels';

export const initGameState = (levelIndex, playerConfigs, runningTotalScore = 0) => {
  const levelData = levels[levelIndex];
  const playerCount = Math.max(1, playerConfigs.length);

  return {
    levelIndex,
    phase: 'COUNTDOWN',
    phaseTimer: 4.0,
    isPaused: false,
    elapsedTime: 0,
    playerCount,
    cannon: levelData.cannon,
    obstacles: levelData.obstacles,
    targets: levelData.targets.map(t => ({ ...t, active: true })), 

    // Score Tracking
    totalScore: runningTotalScore,
    levelScore: 0,
    tallyLevelScore: 0,
    tallyTotalScore: runningTotalScore,
    
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
    }))
  };
};