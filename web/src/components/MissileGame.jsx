import React, { useEffect, useRef } from 'react';

const MissileGame = ({ playerConfigs }) => {
  const canvasRef = useRef(null);
  const requestRef = useRef();

  const gameState = useRef({
    missiles: [],
    lastTime: performance.now(),
  });

  useEffect(() => {
    // 4 corners of a 1080p screen
    const spawnPoints = [
      { x: 200, y: 200, angle: 0 },
      { x: 1720, y: 200, angle: Math.PI },
      { x: 200, y: 880, angle: 0 },
      { x: 1720, y: 880, angle: Math.PI }
    ];

    gameState.current.missiles = playerConfigs.map((config, index) => ({
      id: config.gamepadIndex, 
      color: config.color,
      x: spawnPoints[index].x,
      y: spawnPoints[index].y,
      angle: spawnPoints[index].angle,
      velocity: 6, // Pixels per frame
      active: true,
      radius: 15, 
    }));
  }, [playerConfigs]);

  const updateLoop = (time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const deltaTime = (time - gameState.current.lastTime) / 1000;
    gameState.current.lastTime = time;

    // Clear and draw background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111827'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gamepads = navigator.getGamepads();

    // Update and draw each missile
    gameState.current.missiles.forEach((missile) => {
      if (!missile.active) return;

      const pad = gamepads[missile.id];

      if (pad) {
        // Read L2 and R2
        const l2 = pad.buttons[6]?.value || 0;
        const r2 = pad.buttons[7]?.value || 0;

        const turnSpeed = 4.5; 
        missile.angle += (r2 - l2) * turnSpeed * deltaTime;

        missile.x += missile.velocity * Math.cos(missile.angle);
        missile.y += missile.velocity * Math.sin(missile.angle);
        
        // Screen wrap
        if (missile.x > canvas.width) missile.x = 0;
        if (missile.x < 0) missile.x = canvas.width;
        if (missile.y > canvas.height) missile.y = 0;
        if (missile.y < 0) missile.y = canvas.height;
      }

      ctx.save();
      ctx.translate(missile.x, missile.y);
      ctx.rotate(missile.angle);
      
      ctx.fillStyle = missile.color;
      ctx.beginPath();
      ctx.moveTo(25, 0); // Nose
      ctx.lineTo(-15, -15); // Left wing
      ctx.lineTo(-10, 0); // Engine block
      ctx.lineTo(-15, 15); // Right wing
      ctx.fill();
      
      ctx.restore();
    });

    requestRef.current = requestAnimationFrame(updateLoop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); 

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
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