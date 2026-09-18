import { processPlayerInputs } from './input';
import { checkCollisions } from './collisions';

const updateTimersAndExplosions = (state, deltaTime) => {
  state.missiles.forEach(m => {
    if (m.status === 'EXPLODING') {
      m.explosionRadius += 300 * deltaTime;
      if (m.explosionRadius > 80) {
        m.status = m.nextStatus;
        m.explosionRadius = 0;
      }
    } else if (m.status === 'RESPAWNING') {
      m.respawnTimer -= deltaTime;
      if (m.respawnTimer <= 0) {
        m.status = 'WAITING';
      }
    }
  });
};

const checkGameStatus = (state) => {
  const activeTargets = state.targets.filter(t => t.active).length;

  if (activeTargets === 0) {
    state.phase = 'LEVEL_CLEARED';
    state.phaseTimer = 3.8;

    // int(max((120000ms - timeTakenMs), 0) / playerCount)
    const timeTakenMs = state.elapsedTime * 1000;
    state.levelScore = Math.floor(Math.max(120000 - timeTakenMs, 0) / state.playerCount);
  }
};

export const updatePhysics = (state, gamepads, keys, deltaTime, canvasWidth, canvasHeight) => {
  if (state.isPaused || state.phase === 'GAME_COMPLETED') return;

  // 1. Level Clear Score Counting Animation
  if (state.phase === 'LEVEL_CLEARED') {
    state.phaseTimer -= deltaTime;

    if (state.tallyLevelScore < state.levelScore) {
      const tallyStep = Math.max(300, state.levelScore / 1.5) * deltaTime;
      state.tallyLevelScore = Math.min(state.levelScore, Math.round(state.tallyLevelScore + tallyStep));
      state.tallyTotalScore = state.totalScore + state.tallyLevelScore;
    }
    return;
  }

  // 2. Pre-game countdown & fail transitions
  if (state.phase === 'COUNTDOWN' || state.phase === 'LEVEL_FAILED') {
    state.phaseTimer -= deltaTime;
    if (state.phase === 'COUNTDOWN' && state.phaseTimer <= 0) {
      state.phase = 'PLAYING';
    }
    return;
  }

  // 3. Count elapsed time upwards
  state.elapsedTime += deltaTime;

  processPlayerInputs(state, gamepads, keys, deltaTime);
  checkCollisions(state, gamepads, canvasWidth, canvasHeight);
  updateTimersAndExplosions(state, deltaTime);
  checkGameStatus(state);
};