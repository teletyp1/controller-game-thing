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
  const canContinue = state.missiles.some(m =>
    ['ALIVE', 'WAITING', 'RESPAWNING'].includes(m.status) ||
    (m.status === 'EXPLODING' && m.nextStatus !== 'DEAD')
  );

  if (activeTargets === 0) {
    state.phase = 'LEVEL_CLEARED';
    state.phaseTimer = 3.0;
  } else if (state.timeRemaining <= 0 || !canContinue) {
    state.phase = 'LEVEL_FAILED';
    state.phaseTimer = 3.0;
  }
};

export const updatePhysics = (state, gamepads, keys, deltaTime, canvasWidth, canvasHeight) => {
  if (state.isPaused) return;

  // Pre & post game phase transitions
  if (state.phase === 'COUNTDOWN' || state.phase === 'LEVEL_CLEARED' || state.phase === 'LEVEL_FAILED') {
    state.phaseTimer -= deltaTime;
    if (state.phase === 'COUNTDOWN' && state.phaseTimer <= 0) {
      state.phase = 'PLAYING';
    }
    return;
  }

  // Active gameplay tick
  state.timeRemaining -= deltaTime;

  processPlayerInputs(state, gamepads, keys, deltaTime);
  checkCollisions(state, gamepads, canvasWidth, canvasHeight);
  updateTimersAndExplosions(state, deltaTime);
  checkGameStatus(state);
};