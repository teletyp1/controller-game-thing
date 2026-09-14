import React, { useEffect, useRef } from 'react';

const MissileGame = () => {
  const canvasRef = useRef(null);
  const requestRef = useRef();

  // 1. Store mutable game state entirely outside of React's state
  const gameState = useRef({
    missiles: [
      { id: 0, x: 200, y: 200, angle: 0, velocity: 5, active: false, color: '#ef4444' }, // red-500
      { id: 1, x: 200, y: 880, angle: 0, velocity: 5, active: false, color: '#3b82f6' }, // blue-500
      { id: 2, x: 1720, y: 200, angle: 0, velocity: 5, active: false, color: '#10b981' }, // emerald-500
      { id: 3, x: 1720, y: 880, angle: 0, velocity: 5, active: false, color: '#eab308' }, // yellow-500
    ],
    lastTime: performance.now(),
  });

  const updateLoop = (time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Time delta (helps keep movement consistent if frame rate dips)
    const deltaTime = (time - gameState.current.lastTime) / 1000;
    gameState.current.lastTime = time;

    // Clear the screen for the new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background 
    ctx.fillStyle = '#111827'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Poll Gamepads directly every frame
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

    for (let i = 0; i < 4; i++) {
      const pad = gamepads[i];
      const missile = gameState.current.missiles[i];

      if (pad) {
        missile.active = true;
        
        // 3. Extract L2 (6) and R2 (7) values (0.0 to 1.0)
        const l2 = pad.buttons[6]?.value || 0;
        const r2 = pad.buttons[7]?.value || 0;

        // Turning speed scalar
        const turnSpeed = 4.0; 
        
        // Update physics
        missile.angle += (r2 - l2) * turnSpeed * deltaTime;
        missile.x += missile.velocity * Math.cos(missile.angle);
        missile.y += missile.velocity * Math.sin(missile.angle);

        // Your custom wall collision and target logic goes here
      }

      // 4. Render the active missiles
      if (missile.active) {
        ctx.save();
        ctx.translate(missile.x, missile.y);
        ctx.rotate(missile.angle);
        
        // Draw the missile (a simple triangle)
        ctx.fillStyle = missile.color;
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(-10, -10);
        ctx.lineTo(-10, 10);
        ctx.fill();
        
        ctx.restore();
      }
    }

    // Schedule next frame
    requestRef.current = requestAnimationFrame(updateLoop);
  };

  useEffect(() => {
    // Start the game loop when the component mounts
    requestRef.current = requestAnimationFrame(updateLoop);
    
    // Cleanup to prevent memory leaks if the component unmounts
    return () => cancelAnimationFrame(requestRef.current);
  }, []); 

  return (
    // Simple full-screen layout for the map
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        className="max-h-full max-w-full border-2 border-gray-800 rounded-lg shadow-lg"
      />
    </div>
  );
};

export default MissileGame;