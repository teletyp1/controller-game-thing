import React, { useState, useEffect } from 'react';
import ControllerLobby from './components/ControllerLobby';
import MissileGame from './components/MissileGame';

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [connectedPads, setConnectedPads] = useState([]);
  const [playerConfigs, setPlayerConfigs] = useState([]);

  useEffect(() => {
    const handleConnect = (e) => {
      setConnectedPads((prev) => [...prev, e.gamepad]);
    };

    const handleDisconnect = (e) => {
      setConnectedPads((prev) => 
        prev.filter((pad) => pad.index !== e.gamepad.index)
      );
    };

    window.addEventListener("gamepadconnected", handleConnect);
    window.addEventListener("gamepaddisconnected", handleDisconnect);

    const initialPads = Array.from(navigator.getGamepads()).filter(Boolean);
    if (initialPads.length > 0) setConnectedPads(initialPads);

    return () => {
      window.removeEventListener("gamepadconnected", handleConnect);
      window.removeEventListener("gamepaddisconnected", handleDisconnect);
    };
  }, []);

  return (
    // Enforce pure black background and classic monospace font globally
    <div className="min-h-screen bg-black text-white font-mono uppercase select-none">
      {!isPlaying ? (
        <ControllerLobby 
          connectedPads={connectedPads} 
          onStart={(mappings) => {
            setPlayerConfigs(mappings);
            setIsPlaying(true);
          }} 
        />
      ) : (
        <MissileGame playerConfigs={playerConfigs} />
      )}
    </div>
  );
};

export default App;