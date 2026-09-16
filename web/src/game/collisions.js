import { triggerRumble } from './haptics';

export const circleIntersectsRect = (cx, cy, radius, rx, ry, rw, rh) => {
  const testX = Math.max(rx, Math.min(cx, rx + rw));
  const testY = Math.max(ry, Math.min(cy, ry + rh));
  const distSq = (cx - testX) ** 2 + (cy - testY) ** 2;
  return distSq < radius ** 2;
};

export const checkCollisions = (state, gamepads, canvasWidth, canvasHeight) => {
  for (let i = 0; i < state.missiles.length; i++) {
    const m1 = state.missiles[i];
    if (m1.status !== 'ALIVE') continue;

    let hitWall = false;
    let hitTargetRef = null;
    let hitPlayerRef = null;

    // 1. Boundary bounds
    if (m1.x < 0 || m1.x > canvasWidth || m1.y < 0 || m1.y > canvasHeight) {
      hitWall = true;
    }

    // 2. Obstacles
    if (!hitWall) {
      for (const obs of state.obstacles) {
        if (circleIntersectsRect(m1.x, m1.y, m1.radius, obs.x, obs.y, obs.width, obs.height)) {
          hitWall = true;
          break;
        }
      }
    }

    // 3. Targets
    if (!hitWall) {
      for (const target of state.targets) {
        if (!target.active) continue;
        const distSq = (m1.x - target.x) ** 2 + (m1.y - target.y) ** 2;
        if (distSq < (m1.radius + target.radius) ** 2) {
          hitTargetRef = target;
          break;
        }
      }
    }

    // 4. Other Missiles (Player vs Player)
    if (!hitWall && !hitTargetRef) {
      for (let j = i + 1; j < state.missiles.length; j++) {
        const m2 = state.missiles[j];
        if (m2.status !== 'ALIVE') continue;
        const distSq = (m2.x - m1.x) ** 2 + (m2.y - m1.y) ** 2;
        if (distSq < (m1.radius + m2.radius) ** 2) {
          hitPlayerRef = m2;
          break;
        }
      }
    }

    // Resolve Outcomes
    if (hitWall) {
      m1.status = 'EXPLODING';
      m1.nextStatus = 'DEAD';
      triggerRumble(gamepads, m1.id, { duration: 300, weak: 1.0, strong: 1.0 });
    } else if (hitPlayerRef) {
      m1.status = 'EXPLODING';
      m1.nextStatus = 'DEAD';
      hitPlayerRef.status = 'EXPLODING';
      hitPlayerRef.nextStatus = 'DEAD';
      triggerRumble(gamepads, m1.id, { duration: 300, weak: 1.0, strong: 1.0 });
      triggerRumble(gamepads, hitPlayerRef.id, { duration: 300, weak: 1.0, strong: 1.0 });
    } else if (hitTargetRef) {
      hitTargetRef.active = false;
      m1.status = 'EXPLODING';
      m1.nextStatus = 'RESPAWNING';
      m1.respawnTimer = 2.0;
      triggerRumble(gamepads, m1.id, { duration: 150, weak: 0.5, strong: 0.0 });
    }
  }
};