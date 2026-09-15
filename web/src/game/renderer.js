export const renderFrame = (ctx, state, width, height, isDebug = false) => {
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#4b5563';
  ctx.beginPath();
  ctx.arc(state.cannon.x, state.cannon.y, 35, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(state.cannon.x, state.cannon.y);
  ctx.rotate(state.cannon.angle);
  ctx.fillStyle = '#6b7280';
  ctx.fillRect(0, -15, 60, 30);
  ctx.restore();

  state.obstacles.forEach(obs => {
    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2;
    ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
  });

  state.targets.forEach(target => {
    if (!target.active) return;
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 4;
    ctx.stroke();
  });

  state.missiles.forEach(m => {
    if (m.status === 'ALIVE') {
      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.rotate(m.angle);
      
      ctx.fillStyle = m.color;
      ctx.beginPath();
      ctx.moveTo(25, 0); 
      ctx.lineTo(-15, -15); 
      ctx.lineTo(-10, 0); 
      ctx.lineTo(-15, 15); 
      ctx.fill();
      ctx.restore();
    } else if (m.status === 'EXPLODING') {
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.explosionRadius, 0, Math.PI * 2);
      ctx.fillStyle = `${m.color}80`; 
      ctx.fill();
    }
  });

  // --- DEBUG MODE RENDER OVERLAY ---
  if (isDebug) {
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    
    // Outline text for readability
    const drawDebugText = (text, x, y, color = '#00ff00') => {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText(text, x, y);
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
    };

    // Cannon
    drawDebugText(`CANNON: ${Math.round(state.cannon.x)},${Math.round(state.cannon.y)}`, state.cannon.x + 40, state.cannon.y - 40);

    // Obstacles
    state.obstacles.forEach(obs => {
      drawDebugText(`[${obs.width}x${obs.height}]`, obs.x + 5, obs.y + 20, '#facc15'); // Yellow
      drawDebugText(`${Math.round(obs.x)},${Math.round(obs.y)}`, obs.x + 5, obs.y + 35, '#facc15');
    });

    // Targets
    state.targets.forEach(t => {
      if (t.active) {
        drawDebugText(`r:${t.radius}`, t.x + t.radius + 5, t.y - 15, '#38bdf8'); // Light Blue
        drawDebugText(`${Math.round(t.x)},${Math.round(t.y)}`, t.x + t.radius + 5, t.y, '#38bdf8');
      }
    });

    // Missiles
    state.missiles.forEach(m => {
      if (m.status === 'ALIVE' || m.status === 'WAITING') {
        drawDebugText(`${Math.round(m.x)},${Math.round(m.y)}`, m.x + 25, m.y + 25, m.color);
      }
    });
  }
  // ---------------------------------

  // HUD
  const hudHeight = 60;
  const hudY = height - hudHeight;
  const hudWidth = width / Math.max(state.missiles.length, 1);

  state.missiles.forEach((m, i) => {
    const startX = hudWidth * i;
    ctx.fillStyle = '#1f2937'; 
    ctx.fillRect(startX, hudY, hudWidth, hudHeight);

    let fillPercentage = 0;
    let statusText = '';
    let textColor = '#ffffff';

    if (state.phase === 'READY_CHECK' || state.phase === 'COUNTDOWN') {
      fillPercentage = m.isReady ? 1.0 : 0.0;
      statusText = m.isReady ? 'READY' : 'PRESS [X] TO READY';
      textColor = m.isReady ? '#000000' : '#ffffff';
    } else {
      if (['WAITING', 'ALIVE', 'EXPLODING'].includes(m.status)) {
        fillPercentage = 1.0; 
        statusText = m.status === 'WAITING' ? '[X] LAUNCH' : 'IN FLIGHT';
        textColor = '#000000'; 
      } else if (m.status === 'DEAD') {
        fillPercentage = 0.0;
        statusText = 'OFFLINE';
        textColor = '#6b7280'; 
      } else if (m.status === 'RESPAWNING') {
        fillPercentage = Math.max(0, (2.0 - m.respawnTimer) / 2.0);
        statusText = 'RELOADING...';
      }
    }

    if (fillPercentage > 0) {
      ctx.fillStyle = m.color;
      ctx.fillRect(startX, hudY, hudWidth * fillPercentage, hudHeight);
    }

    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 4;
    ctx.strokeRect(startX, hudY, hudWidth, hudHeight);
    ctx.fillStyle = textColor;
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(statusText, startX + (hudWidth / 2), hudY + (hudHeight / 2));
  });

  if (state.timeRemaining > 0) {
    const timePercentage = state.timeRemaining / state.timeLimit;
    ctx.fillStyle = '#3b82f6'; 
    ctx.fillRect(0, 0, width * timePercentage, 12);
  }

  // Phase Overlays
  if (state.phase !== 'PLAYING') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = (state.phase === 'LEVEL_CLEARED' || state.phase === 'COUNTDOWN') ? '#10b981' : '#ef4444';
    ctx.font = 'bold 80px monospace';
    ctx.textAlign = 'center';
    
    let centerText = '';
    if (state.phase === 'READY_CHECK') centerText = 'AWAITING AUTHORIZATION';
    else if (state.phase === 'COUNTDOWN') centerText = `LAUNCH IN ${Math.ceil(state.phaseTimer)}`;
    else if (state.phase === 'LEVEL_CLEARED') centerText = 'NETWORK BREACHED';
    else if (state.phase === 'LEVEL_FAILED') centerText = 'SYSTEM FAILURE';
    
    ctx.fillText(centerText, width / 2, height / 2);
  };
  if (state.isPaused) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    
    // Add a slight drop shadow so it stands out against any map elements
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Draw in the top right corner, just below the blue time bar
    ctx.fillText('SYSTEM PAUSED - PRESS [P] TO RESUME', width - 20, 20);
    
    // Reset shadow so it doesn't affect the next frame
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };
};