export const updatePhysics = (state, gamepads, deltaTime, canvasWidth, canvasHeight) => {
  // 1. Check for Pause
  if (state.isPaused) return;

  // 2. Handle Pre-Game Phase (4-second breather)
  if (state.phase === 'COUNTDOWN') {
    state.phaseTimer -= deltaTime;
    if (state.phaseTimer <= 0) {
      state.phase = 'PLAYING';
    }
    return; // Skip physics
  }

  // 3. Post-Game Phases
  if (state.phase === 'LEVEL_CLEARED' || state.phase === 'LEVEL_FAILED') {
    state.phaseTimer -= deltaTime;
    return; // Skip physics
  }

  // --- GAME IS PLAYING BELOW ---
  state.timeRemaining -= deltaTime;

  // 4. Process Input & Movement
  state.missiles.forEach(m => {
    const pad = gamepads[m.id];
    if (!pad) return;

    if (m.status === 'WAITING') {
      // Button 0 (X) launches them from the cannon
      if (pad.buttons[0]?.pressed || pad.buttons[0]?.value > 0.5) {
        m.status = 'ALIVE';
        m.x = state.cannon.x;
        m.y = state.cannon.y;
        m.angle = state.cannon.angle;
      }
    } else if (m.status === 'ALIVE') {
      const l2 = pad.buttons[6]?.value || 0;
      const r2 = pad.buttons[7]?.value || 0;
      
      // Both turning AND moving are locked to real-world time (deltaTime)
      m.angle += (r2 - l2) * 4.5 * deltaTime;
      m.x += m.velocity * Math.cos(m.angle) * deltaTime;
      m.y += m.velocity * Math.sin(m.angle) * deltaTime;
    }
  });

  // 5. Process Collisions
  for (let i = 0; i < state.missiles.length; i++) {
    const m1 = state.missiles[i];
    if (m1.status !== 'ALIVE') continue;

    let hitWall = false;
    let hitTargetRef = null;
    let hitPlayerRef = null;

    // Check Map Boundaries
    if (m1.x < 0 || m1.x > canvasWidth || m1.y < 0 || m1.y > canvasHeight) {
      hitWall = true;
    }

    // Check Obstacles
    if (!hitWall) {
      for (const obs of state.obstacles) {
        const testX = Math.max(obs.x, Math.min(m1.x, obs.x + obs.width));
        const testY = Math.max(obs.y, Math.min(m1.y, obs.y + obs.height));
        const distSq = (m1.x - testX) ** 2 + (m1.y - testY) ** 2;
        if (distSq < m1.radius ** 2) {
          hitWall = true;
          break;
        }
      }
    }

    // Check Targets
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

    // Check Other Players
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

    // Apply Collision Results & Rumble
    if (hitWall) {
      m1.status = 'EXPLODING';
      m1.nextStatus = 'DEAD'; 
      
      const pad1 = gamepads[m1.id];
      if (pad1 && pad1.vibrationActuator) {
        pad1.vibrationActuator.playEffect("dual-rumble", { duration: 300, weakMagnitude: 1.0, strongMagnitude: 1.0 }).catch(() => {});
      }
      
    } else if (hitPlayerRef) {
      m1.status = 'EXPLODING';
      m1.nextStatus = 'DEAD'; 
      hitPlayerRef.status = 'EXPLODING';
      hitPlayerRef.nextStatus = 'DEAD';
      
      const pad1 = gamepads[m1.id];
      const pad2 = gamepads[hitPlayerRef.id];
      
      if (pad1 && pad1.vibrationActuator) {
        pad1.vibrationActuator.playEffect("dual-rumble", { duration: 300, weakMagnitude: 1.0, strongMagnitude: 1.0 }).catch(() => {});
      }
      if (pad2 && pad2.vibrationActuator) {
        pad2.vibrationActuator.playEffect("dual-rumble", { duration: 300, weakMagnitude: 1.0, strongMagnitude: 1.0 }).catch(() => {});
      }
      
    } else if (hitTargetRef) {
      hitTargetRef.active = false;
      m1.status = 'EXPLODING';
      m1.nextStatus = 'RESPAWNING'; 
      m1.respawnTimer = 2.0; 
      
      const pad1 = gamepads[m1.id];
      if (pad1 && pad1.vibrationActuator) {
        pad1.vibrationActuator.playEffect("dual-rumble", { duration: 150, weakMagnitude: 0.5, strongMagnitude: 0.0 }).catch(() => {});
      }
    }
  }

  // 6. Update Explosions & State Machine
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

  // 7. Win/Loss Conditions
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