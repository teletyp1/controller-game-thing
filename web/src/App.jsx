import React, { useState, useEffect } from 'react';
import ControllerLobby from './components/ControllerLobby';
import MissileGame from './components/MissileGame';

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [connectedPads, setConnectedPads] = useState([]);

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

    // Check for already connected gamepads on mount
    const initialPads = Array.from(navigator.getGamepads()).filter(Boolean);
    if (initialPads.length > 0) setConnectedPads(initialPads);

    return () => {
      window.removeEventListener("gamepadconnected", handleConnect);
      window.removeEventListener("gamepaddisconnected", handleDisconnect);
    };
  }, []);

  // Conditional rendering: Show Lobby until "Start", then mount the Game
  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono">
      {!isPlaying ? (
        <ControllerLobby 
          connectedPads={connectedPads} 
          onStart={() => setIsPlaying(true)} 
        />
      ) : (
        <MissileGame />
      )}
    </div>
  );
};

export default App;