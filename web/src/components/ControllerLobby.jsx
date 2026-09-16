import React, { useState, useEffect, useRef } from 'react';

const ControllerLobby = ({ connectedPads, onStart }) => {
  const [playerMappings, setPlayerMappings] = useState([]); 
  const requestRef = useRef();
  const prevButtonState = useRef({}); // Tracks previous button state to prevent spamming
  
  const missileColors = ['#ff0000', '#00ff00', '#ffff00', '#ff8800']; 
  const colorNames = ['P1 (RED)', 'P2 (GREEN)', 'P3 (YELLOW)', 'P4 (ORANGE)'];

  // Auto-start when at least 1 player is joined, and ALL joined players are ready
  useEffect(() => {
    if (playerMappings.length > 0 && playerMappings.every(p => p.isReady)) {
      onStart(playerMappings);
    }
  }, [playerMappings, onStart]);

  useEffect(() => {
    const pollInputs = () => {
      const pads = navigator.getGamepads();
      
      setPlayerMappings(prev => {
        let newMappings = [...prev];
        let stateMutated = false;

        for (let i = 0; i < 4; i++) {
          const pad = pads[i];
          if (!pad) continue;

          // X Button (PlayStation) / A Button (Xbox) is index 0
          const isPressed = pad.buttons[0]?.pressed || pad.buttons[0]?.value > 0.5;
          const wasPressed = prevButtonState.current[pad.index];

          if (isPressed && !wasPressed) {
            stateMutated = true;
            const existingIndex = newMappings.findIndex(p => p.gamepadIndex === pad.index);

            if (existingIndex >= 0) {
              // Player exists, toggle their ready state
              newMappings[existingIndex] = { 
                ...newMappings[existingIndex], 
                isReady: !newMappings[existingIndex].isReady 
              };
            } else if (newMappings.length < 4) {
              // New player joining
              newMappings.push({
                gamepadIndex: pad.index,
                color: missileColors[newMappings.length],
                isReady: false
              });
            }
          }
          
          prevButtonState.current[pad.index] = isPressed;
        }

        return stateMutated ? newMappings : prev;
      });

      requestRef.current = requestAnimationFrame(pollInputs);
    };

    requestRef.current = requestAnimationFrame(pollInputs);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-black font-mono select-none">
      
      <h1 className="text-7xl font-bold mb-8 text-white tracking-widest border-b-4 border-white pb-4">
        CO-OP STRIKE
      </h1>

      <div className="flex gap-8 mb-12 w-full max-w-6xl px-8">
        {/* Rules */}
        <div className="flex-1 border-4 border-white p-6 bg-black">
          <h2 className="text-3xl font-bold text-[#00ffff] mb-6 border-b-4 border-[#00ffff] inline-block pb-1">
            HOW TO PLAY
          </h2>
          <ul className="space-y-4 text-xl text-gray-300">
            <li>&gt; DESTROY ALL <span className="text-[#ff0055] font-bold">TARGETS</span> BEFORE TIME RUNS OUT.</li>
            <li>&gt; HITTING TARGETS DISABLES YOUR SHIP FOR <span className="text-[#ffff00] font-bold">2 SECONDS</span>.</li>
            <li>&gt; HITTING WALLS OR ALLIES CAUSES <span className="text-[#ff0000] font-bold">PERMADEATH</span>.</li>
            <li>&gt; DO NOT LAUNCH FROM THE CANNON AT THE SAME TIME!</li>
          </ul>
        </div>

        {/* Controls */}
        <div className="flex-1 border-4 border-white p-6 bg-black">
          <h2 className="text-3xl font-bold text-[#00ffff] mb-6 border-b-4 border-[#00ffff] inline-block pb-1">
            CONTROLS
          </h2>
          <ul className="space-y-5 text-2xl text-gray-300">
            <li><span className="text-white font-bold inline-block w-24">[L2]</span> STEER LEFT</li>
            <li><span className="text-white font-bold inline-block w-24">[R2]</span> STEER RIGHT</li>
            <li><span className="text-[#00ffff] font-bold inline-block w-24">[X]</span> JOIN / READY / LAUNCH</li>
            <li className="text-lg text-gray-500 pt-2"><span className="inline-block w-24">[P]</span> PAUSE (KEYBOARD ONLY)</li>
          </ul>
        </div>
      </div>

      {/* Player Slots */}
      <div className="flex gap-8 mb-12 w-full max-w-6xl px-8">
        {[0, 1, 2, 3].map((slotIndex) => {
          const mappedPlayer = playerMappings[slotIndex];
          
          if (mappedPlayer) {
            return (
              <div 
                key={slotIndex} 
                className="flex-1 flex flex-col items-center justify-center py-6 border-4" 
                style={{ 
                  borderColor: mappedPlayer.color, 
                  backgroundColor: mappedPlayer.isReady ? '#222' : '#000' 
                }}
              >
                <span className="text-3xl font-bold" style={{ color: mappedPlayer.color }}>{colorNames[slotIndex]}</span>
                <span className={`text-xl mt-3 font-bold ${mappedPlayer.isReady ? 'text-[#00ff00] animate-pulse' : 'text-white'}`}>
                  {mappedPlayer.isReady ? 'READY!' : 'PRESS [X] TO READY'}
                </span>
              </div>
            );
          }

          return (
            <div key={slotIndex} className="flex-1 flex flex-col items-center justify-center py-6 border-4 border-dashed border-gray-600 bg-black animate-pulse">
              <span className="text-2xl font-bold text-gray-400 text-center px-2">PRESS [X] TO JOIN</span>
            </div>
          );
        })}
      </div>
      
      <div className="h-20 flex items-center justify-center">
        {playerMappings.length > 0 && (
          <p className="text-2xl text-[#00ffff] animate-pulse">
            WAITING FOR ALL PLAYERS TO READY UP...
          </p>
        )}
      </div>

    </div>
  );
};

export default ControllerLobby;