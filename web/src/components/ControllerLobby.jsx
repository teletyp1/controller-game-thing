import React, { useState, useEffect, useRef } from 'react';

const ControllerLobby = ({ connectedPads, onStart }) => {
  const [calibratingIndex, setCalibratingIndex] = useState(0);
  const [playerMappings, setPlayerMappings] = useState([]); 
  const requestRef = useRef();
  
  const missileColors = ['#ef4444', '#10b981', '#eab308', '#f97316']; 
  const colorNames = ['RED', 'GREEN', 'YELLOW', 'ORANGE'];

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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white font-mono text-center">
      <h1 className="text-5xl font-bold mb-8 text-emerald-400 tracking-widest">
        MISSILE COMMAND: CALIBRATION
      </h1>
      
      <div className="mb-12 h-32 flex flex-col justify-center items-center">
        {!isFullyCalibrated ? (
          <div className="animate-pulse">
            <h2 className="text-4xl font-bold mb-2">
              SQUEEZE L2 ON THE <span style={{ color: missileColors[calibratingIndex] }}>{colorNames[calibratingIndex]}</span> CONTROLLER
            </h2>
          </div>
        ) : (
          <h2 className="text-4xl font-bold text-emerald-400">MAX HARDWARE LOCKED</h2>
        )}
      </div>

      <div className="flex gap-4 mb-12 min-h-[120px]">
        {playerMappings.map((player, idx) => (
          <div key={idx} className="p-6 border-2 border-gray-700 rounded bg-gray-800 w-48">
            <p className="font-bold text-lg" style={{ color: player.color }}>
              {colorNames[idx]} MISSILE
            </p>
            <p className="text-sm text-gray-400 mt-2">Locked to Slot {player.gamepadIndex}</p>
          </div>
        ))}
      </div>

      {canStart && (
         <button
         onClick={() => onStart(playerMappings)}
         className="px-12 py-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-3xl transition-colors shadow-lg"
       >
         START WITH {playerMappings.length} PLAYER{playerMappings.length > 1 ? 'S' : ''}
       </button>
      )}
    </div>
  );
};

export default ControllerLobby;