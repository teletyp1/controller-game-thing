export const processPlayerInputs = (state, gamepads, keys, deltaTime) => {
  state.missiles.forEach(m => {
    const isKeyboard = m.id === 'keyboard';
    const pad = isKeyboard ? null : gamepads[m.id];

    if (!isKeyboard && !pad) return;

    if (m.status === 'WAITING') {
      const launchPressed = isKeyboard 
        ? keys.space 
        : (pad.buttons[0]?.pressed || pad.buttons[0]?.value > 0.5);

      if (launchPressed) {
        m.status = 'ALIVE';
        m.x = state.cannon.x;
        m.y = state.cannon.y;
        m.angle = state.cannon.angle;
      }
    } else if (m.status === 'ALIVE') {
      const l2 = isKeyboard ? (keys.left ? 1 : 0) : (pad.buttons[6]?.value || 0);
      const r2 = isKeyboard ? (keys.right ? 1 : 0) : (pad.buttons[7]?.value || 0);

      m.angle += (r2 - l2) * 4.5 * deltaTime;
      m.x += m.velocity * Math.cos(m.angle) * deltaTime;
      m.y += m.velocity * Math.sin(m.angle) * deltaTime;
    }
  });
};