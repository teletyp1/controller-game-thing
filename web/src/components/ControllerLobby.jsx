import React from 'react';

const ControllerLobby = ({ connectedPads, onStart }) => {
  // We expect exactly 4 players. Create an array of 4 slots.
  const slots = [0, 1, 2, 3];

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold mb-12 text-emerald-400 tracking-widest">
        SYSTEM BREACH: INITIALIZE
      </h1>
      
      <div className="grid grid-cols-2 gap-8 mb-12 w-full max-w-4xl">
        {slots.map((slotIndex) => {
          // Check if a gamepad is mapped to this index
          const pad = connectedPads.find(p => p.index === slotIndex);
          
          return (
            <div 
              key={slotIndex}
              className={`p-6 border-2 rounded-lg flex flex-col items-center justify-center h-32 transition-colors ${
                pad 
                  ? 'border-emerald-500 bg-emerald-900/20' 
                  : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              <h2 className="text-xl font-bold mb-2">
                PLAYER {slotIndex + 1}
              </h2>
              <p className={pad ? 'text-emerald-400' : 'text-gray-500 animate-pulse'}>
                {pad ? `CONNECTED: ${pad.id.substring(0, 20)}...` : 'AWAITING CONNECTION...'}
              </p>
            </div>
          );
        })}
      </div>

      <button
        onClick={onStart}
        disabled={connectedPads.length === 0}
        className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold rounded text-2xl transition-all"
      >
        {connectedPads.length > 0 ? 'EXECUTE STRIKE' : 'CONNECT AT LEAST 1 CONTROLLER'}
      </button>
    </div>
  );
};

export default ControllerLobby;