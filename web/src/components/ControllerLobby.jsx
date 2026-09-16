import React, { useState, useEffect, useRef } from 'react';

const ControllerLobby = ({ connectedPads, onStart }) => {
  const [calibratingIndex, setCalibratingIndex] = useState(0);
  const [playerMappings, setPlayerMappings] = useState([]); 
  const requestRef = useRef();
  
  const missileColors = ['#ff0000', '#00ff00', '#ffff00', '#ff8800']; 
  const colorNames = ['P1 (RED)', 'P2 (GREEN)', 'P3 (YELLOW)', 'P4 (ORANGE)'];

  useEffect(() => {
    if (calibratingIndex >= 4) return;

    const pollInputs = () => {
      const pads = navigator.getGamepads();
      
      for (let i = 0; i < 4; i++) {
        const pad = pads[i];
        
        if (pad && pad.buttons[6]?.value > 0.8) {
          const alreadyMapped = playerMappings.some(m => m.gamepadIndex === pad.index);
          
          if (!alreadyMapped) {
            setPlayerMappings(prev => [...prev, {
              gamepadIndex: pad.index,
              color: missileColors[calibratingIndex]
            }]);
            
            setCalibratingIndex(prev => prev + 1);
            return; 
          }
        }
      }
      requestRef.current = requestAnimationFrame(pollInputs);
    };

    requestRef.current = requestAnimationFrame(pollInputs);
    return () => cancelAnimationFrame(requestRef.current);
  }, [calibratingIndex, playerMappings]);

  const canStart = playerMappings.length > 0;
  const isFullyCalibrated = playerMappings.length === 4;

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-black">
      
      <h1 className="text-7xl font-bold mb-16 text-white tracking-widest border-b-4 border-white pb-4">
        CO-OP STRIKE
      </h1>

      <div className="flex gap-8 mb-16 w-full max-w-6xl px-8">
        {[0, 1, 2, 3].map((slotIndex) => {
          const mappedPlayer = playerMappings[slotIndex];
          
          if (mappedPlayer) {
            return (
              <div key={slotIndex} className="flex-1 flex flex-col items-center justify-center p-8 border-4 bg-gray-900" style={{ borderColor: mappedPlayer.color }}>
                <span className="text-3xl font-bold" style={{ color: mappedPlayer.color }}>{colorNames[slotIndex]}</span>
                <span className="text-xl mt-4 text-white">JOINED</span>
              </div>
            );
          }

          if (slotIndex === calibratingIndex) {
            return (
              <div key={slotIndex} className="flex-1 flex flex-col items-center justify-center p-8 border-4 border-dashed border-gray-500 bg-black animate-pulse">
                <span className="text-2xl font-bold text-white text-center">PRESS L2 TO JOIN</span>
              </div>
            );
          }

          return (
            <div key={slotIndex} className="flex-1 flex flex-col items-center justify-center p-8 border-4 border-gray-800 bg-black">
              <span className="text-xl font-bold text-gray-700">WAITING...</span>
            </div>
          );
        })}
      </div>

      <div className="h-24">
        {canStart && (
          <button
            onClick={() => onStart(playerMappings)}
            className="px-12 py-4 border-4 border-white text-white text-3xl font-bold hover:bg-white hover:text-black transition-colors"
          >
            PRESS START ({playerMappings.length}P)
          </button>
        )}
      </div>

    </div>
  );
};

export default ControllerLobby;