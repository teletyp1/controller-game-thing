export const triggerRumble = (gamepads, playerId, { duration = 300, weak = 1.0, strong = 1.0 } = {}) => {
  if (playerId === 'keyboard') return;
  
  const pad = gamepads[playerId];
  if (pad?.vibrationActuator) {
    pad.vibrationActuator.playEffect('dual-rumble', {
      duration,
      weakMagnitude: weak,
      strongMagnitude: strong,
    }).catch(() => {});
  }
};