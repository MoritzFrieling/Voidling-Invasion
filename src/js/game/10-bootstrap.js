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

  applyStaticTranslations();
  bindUi();
  const storedKeys = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index));
  const hasLegacyProgress = storedKeys.some((key) => {
    if (key === HIGH_SCORE_KEY || key?.startsWith(`${HIGH_SCORE_KEY}:`)) return Number(localStorage.getItem(key)) > 0;
    if (key !== CAMPAIGN_KEY && !key?.startsWith(`${CAMPAIGN_KEY}:`)) return false;
    try {
      const saved = JSON.parse(localStorage.getItem(key) || '{}');
      const checkpointProgress = Object.values(saved.checkpoints || {}).some((checkpoint) => (
        Number(checkpoint?.player?.level) > 1 || Number(checkpoint?.score) > 0 || Number(checkpoint?.wave) > 0
      ));
      return Number(saved.highestUnlocked) > 0
        || Number(saved.completedCampaigns) > 0
        || saved.seenEnemyTypes?.length > 0
        || checkpointProgress;
    } catch {
      return false;
    }
  });
  const hasStartedGame = localStorage.getItem(GAME_STARTED_KEY) === 'true' || hasLegacyProgress;
  document.getElementById('tutorialButton').classList.toggle('tutorial-recommended', !hasStartedGame);
  prepareDefaultCallsign();
  renderAdminPanel();
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

  function refreshLocalizedUi() {
    updatePilotUi();
    if (player) syncUi();
    if (mode === 'levelSelect') renderLevelSelect();
    if (mode === 'sector') {
      const completedLevel = translateLevel(LEVELS[currentLevel]);
      ui.sectorTitle.textContent = completedLevel.name;
      ui.sectorCopy.textContent = completedLevel.next;
    }
    if (tutorialMode) updateTutorialCard();
  }
