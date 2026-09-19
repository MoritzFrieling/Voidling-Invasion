  // Browser event listeners and initial application boot.
  window.addEventListener('resize', resize);
  window.addEventListener('keydown', keyDown, { passive: false });
  window.addEventListener('keyup', keyUp);
  window.addEventListener('blur', () => { input.keys.clear(); input.pointerDown = false; if (mode === 'playing') togglePause(true); });
  canvas.addEventListener('pointermove', pointerMove);
  canvas.addEventListener('pointerdown', pointerDown);
  window.addEventListener('pointerup', pointerUp);
  canvas.addEventListener('pointerleave', () => { input.pointerDown = false; });
  canvas.addEventListener('contextmenu', (event) => event.preventDefault());

  bindUi();
  setAuthMode('signin');
  resize();
  player = resetPlayer();
  camera.x = player.x - screenWidth / 2;
  camera.y = player.y - screenHeight / 2;
  ui.bestText.textContent = formatScore(highScore);
  syncUi();
  if (window.VoidlineCloud) {
    window.VoidlineCloud.onChange((pilot) => {
      if (!pilot && activePilot) activatePilot(null);
    });
  }
  initializeCloud();
  requestAnimationFrame(frame);
