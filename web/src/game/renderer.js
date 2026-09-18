export const renderFrame = (ctx, state, width, height, isDebug = false) => {
  // 1. Pure Arcade Black Background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // Set classic vector styles
  ctx.lineJoin = 'miter';
  ctx.lineCap = 'square';

  // 2. The Cannon (Simple blocky design)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(state.cannon.x - 20, state.cannon.y - 20, 40, 40);

  ctx.save();
  ctx.translate(state.cannon.x, state.cannon.y);
  ctx.rotate(state.cannon.angle);
  ctx.fillStyle = '#aaaaaa';
  ctx.fillRect(0, -10, 50, 20);
  ctx.restore();

  // 3. Obstacles (Vector wireframe style)
  state.obstacles.forEach(obs => {
    ctx.fillStyle = '#000000';
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    ctx.strokeStyle = '#00ffff'; // Neon cyan wireframe
    ctx.lineWidth = 4;
    ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
  });

  // 4. Targets (Thick retro squares instead of smooth circles for aesthetic)
  state.targets.forEach(target => {
    if (!target.active) return;
    const size = target.radius * 2;
    ctx.strokeStyle = '#ff0055'; // Neon pink/red
    ctx.lineWidth = 6;
    ctx.strokeRect(target.x - target.radius, target.y - target.radius, size, size);
    
    // Inner pulse core
    ctx.fillStyle = '#ff0055';
    ctx.fillRect(target.x - 5, target.y - 5, 10, 10);
  });

  // 5. Missiles & Explosions
  state.missiles.forEach(m => {
    if (m.status === 'ALIVE') {
      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.rotate(m.angle);
      
      // Simple sharp chevron
      ctx.fillStyle = m.color;
      ctx.beginPath();
      ctx.moveTo(20, 0); 
      ctx.lineTo(-15, -15); 
      ctx.lineTo(-5, 0); 
      ctx.lineTo(-15, 15); 
      ctx.fill();
      ctx.restore();
    } else if (m.status === 'EXPLODING') {
      // Vector expanding ring explosion
      ctx.strokeStyle = m.color;
      ctx.lineWidth = Math.max(1, 10 - (m.explosionRadius / 10)); // Ring gets thinner as it expands
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.explosionRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  // 6. Debug Overlay
  if (isDebug) {
    ctx.font = '14px Courier New, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    
    const drawDebugText = (text, x, y, color = '#00ff00') => {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeText(text, x, y);
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
    };

    drawDebugText(`CANNON: ${Math.round(state.cannon.x)},${Math.round(state.cannon.y)}`, state.cannon.x + 40, state.cannon.y - 40);

    state.obstacles.forEach(obs => {
      drawDebugText(`[${obs.width}x${obs.height}]`, obs.x + 5, obs.y + 20, '#ffff00');
      drawDebugText(`${Math.round(obs.x)},${Math.round(obs.y)}`, obs.x + 5, obs.y + 35, '#ffff00');
    });

    state.targets.forEach(t => {
      if (t.active) {
        drawDebugText(`r:${t.radius}`, t.x + t.radius + 5, t.y - 15, '#00ffff');
        drawDebugText(`${Math.round(t.x)},${Math.round(t.y)}`, t.x + t.radius + 5, t.y, '#00ffff');
      }
    });

    state.missiles.forEach(m => {
      if (m.status === 'ALIVE' || m.status === 'WAITING') {
        drawDebugText(`${Math.round(m.x)},${Math.round(m.y)}`, m.x + 25, m.y + 25, m.color);
      }
    });
  }
// ... (Your existing render logic for Background through Debug overlay)

  // 7. Classic Arcade HUD
  const hudHeight = 70;
  const hudY = height - hudHeight;
  const hudWidth = width / Math.max(state.missiles.length, 1);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, hudY);
  ctx.lineTo(width, hudY);
  ctx.stroke();

  state.missiles.forEach((m, i) => {
    const startX = hudWidth * i;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(startX, hudY + 2, hudWidth, hudHeight - 2);

    let statusText = '';
    let textColor = m.color;

    // Simplified HUD text logic
    if (state.phase === 'COUNTDOWN') {
      statusText = 'STANDBY';
      textColor = '#ffffff';
    } else {
      if (['WAITING', 'ALIVE', 'EXPLODING'].includes(m.status)) {
        statusText = m.status === 'WAITING' ? 'PRESS X' : 'ACTIVE';
      } else if (m.status === 'DEAD') {
        statusText = 'GAME OVER';
        textColor = '#555555'; 
      } else if (m.status === 'RESPAWNING') {
        statusText = `RESPAWN ${Math.ceil(m.respawnTimer)}`;
      }
    }

    if (i > 0) {
      ctx.beginPath();
      ctx.moveTo(startX, hudY);
      ctx.lineTo(startX, height);
      ctx.stroke();
    }

    ctx.fillStyle = textColor;
    ctx.font = 'bold 24px Courier New, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`P${i + 1}`, startX + 20, hudY + (hudHeight / 2));

    ctx.textAlign = 'right';
    ctx.fillText(statusText, startX + hudWidth - 20, hudY + (hudHeight / 2));
  });

 // 8. Count-up Timer (Top Center)
  const totalSeconds = state.elapsedTime || 0;
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  const hundredths = Math.floor((totalSeconds % 1) * 100);
  const timeString = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;

  ctx.font = 'bold 28px Courier New, monospace';
  ctx.fillStyle = '#00ffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(`TIME: ${timeString}`, width / 2, 20);

  // 9. Overlay Screens
  if (state.phase !== 'PLAYING') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
    ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;

    if (state.phase === 'COUNTDOWN') {
      ctx.font = 'bold 90px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#00ffff';
      ctx.fillText(`GET READY: ${Math.ceil(state.phaseTimer)}`, centerX, centerY);
    } 
    else if (state.phase === 'LEVEL_CLEARED') {
      ctx.textAlign = 'center';
      
      ctx.font = 'bold 70px Courier New, monospace';
      ctx.fillStyle = '#00ff00';
      ctx.fillText('LEVEL CLEAR', centerX, centerY - 110);

      ctx.font = 'bold 32px Courier New, monospace';
      ctx.fillStyle = '#00ffff';
      ctx.fillText(`CLEAR TIME: ${timeString}`, centerX, centerY - 30);

      ctx.font = 'bold 36px Courier New, monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`TIME BONUS: +${state.tallyLevelScore}`, centerX, centerY + 25);

      ctx.fillStyle = '#ffff00';
      ctx.fillText(`TOTAL SCORE: ${state.tallyTotalScore}`, centerX, centerY + 85);
    } 
    else if (state.phase === 'GAME_COMPLETED') {
      ctx.textAlign = 'center';

      ctx.font = 'bold 75px Courier New, monospace';
      ctx.fillStyle = '#00ffff';
      ctx.fillText('MISSION COMPLETE', centerX, centerY - 120);

      ctx.font = 'bold 45px Courier New, monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`FINAL SCORE: ${state.totalScore}`, centerX, centerY - 20);

      ctx.font = 'bold 28px Courier New, monospace';
      ctx.fillStyle = Math.floor(Date.now() / 500) % 2 === 0 ? '#00ff00' : '#ffffff';
      ctx.fillText('PRESS [X] OR [SPACE] TO RETURN TO LOBBY', centerX, centerY + 80);
    } 
    else if (state.phase === 'LEVEL_FAILED') {
      ctx.textAlign = 'center';
      ctx.font = 'bold 80px Courier New, monospace';
      ctx.fillStyle = '#ff0000';
      ctx.fillText('GAME OVER', centerX, centerY - 30);
      
      ctx.font = 'bold 36px Courier New, monospace';
      ctx.fillStyle = '#888888';
      ctx.fillText('RETRYING...', centerX, centerY + 50);
    }
  }

  // 10. Pause Overlay
  if (state.isPaused) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Courier New, monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('PAUSED', width - 20, 30);
  }
};