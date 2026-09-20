  // Keyboard, pointer, UI event wiring, and the animation frame loop.
  function showToast(message) {
    ui.toast.textContent = message;
    ui.toast.classList.add('visible');
    toastTimer = 2.1;
  }

  function keyDown(event) {
    const textEntry = event.target instanceof HTMLInputElement
      || event.target instanceof HTMLTextAreaElement
      || event.target.isContentEditable;
    if (textEntry && !['Escape', 'Enter'].includes(event.code)) return;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault();
    if (event.repeat && ['KeyQ', 'KeyF', 'KeyB', 'KeyR', 'KeyT', 'Escape', 'Enter'].includes(event.code)) return;
    input.keys.add(event.code);
    if (tutorialMode && tutorialIndex === 0 && ['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) advanceTutorial();
    if (event.code === 'ArrowUp' && mode === 'playing') fireBlaster(player.angle);
    if (event.code === 'KeyQ') triggerBoost();
    if (event.code === 'KeyF') beginRocketCharge();
    if (event.code === 'KeyB') useStation();
    if (event.code === 'KeyR') callNextWave();
    if (event.code === 'KeyT' && mode === 'playing') {
      jumpDestinationHold = 0;
      jumpDestinationCancelArmed = Number.isFinite(player.jumpDestinationX) && Number.isFinite(player.jumpDestinationY);
      if (!jumpDestinationCancelArmed) placeJumpDestination();
    }
    if (event.code === 'Escape') {
      if (ui.authOverlay.classList.contains('active')) closeAdminAccess();
      else if (ui.leaderboardOverlay.classList.contains('active')) closeLeaderboard();
      else if (mode === 'levelSelect') closeLevelSelect();
      else togglePause();
    }
    if (event.code === 'Enter') {
      if (ui.authOverlay.classList.contains('active') || ui.leaderboardOverlay.classList.contains('active')) return;
      if (mode === 'menu') requirePilot(() => startGame(false));
      else if (mode === 'ended') startGame(false, lastRunLevel);
      else if (mode === 'briefing') showNextIntel();
      else if (mode === 'cutscene') activateWave();
      else if (mode === 'sector') enterNextSector();
    }
    if (event.code === 'KeyT' && mode === 'menu') requirePilot(() => startGame(true));
    if (event.code === 'KeyL' && mode === 'menu') requirePilot(openLevelSelect);
    if (mode === 'upgrade' && ['Digit1', 'Digit2', 'Digit3'].includes(event.code)) {
      ui.upgradeChoices.children[Number(event.code.at(-1)) - 1]?.click();
    }
  }

  function keyUp(event) {
    input.keys.delete(event.code);
    if (event.code === 'KeyT') {
      if (mode === 'playing' && jumpDestinationCancelArmed) placeJumpDestination();
      jumpDestinationHold = 0;
      jumpDestinationCancelArmed = false;
    }
  }

  function pointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    input.mouseX = event.clientX - rect.left;
    input.mouseY = event.clientY - rect.top;
    input.lastPointerAt = performance.now();
    ui.crosshair.style.left = `${input.mouseX}px`;
    ui.crosshair.style.top = `${input.mouseY}px`;
    updateAimWorld();
  }

  function pointerDown(event) {
    if (event.button === 2) {
      event.preventDefault();
      if (mode === 'playing') { audio.init(); triggerBoost(); }
      return;
    }
    if (event.button !== 0 || mode !== 'playing') return;
    input.pointerDown = true;
    audio.init();
  }

  function pointerUp(event) {
    if (event.button === 0) input.pointerDown = false;
  }

  function bindUi() {
    document.getElementById('startButton').addEventListener('click', () => requirePilot(() => startGame(false)));
    document.getElementById('tutorialButton').addEventListener('click', () => requirePilot(() => startGame(true)));
    document.getElementById('levelSelectButton').addEventListener('click', () => requirePilot(openLevelSelect));
    document.getElementById('closeLevelSelect').addEventListener('click', closeLevelSelect);
    document.getElementById('controlsButton').addEventListener('click', () => openSettings('menu'));
    document.getElementById('settingsButton').addEventListener('click', () => openSettings('menu'));
    document.getElementById('pauseButton').addEventListener('click', () => togglePause(true));
    document.getElementById('resumeButton').addEventListener('click', () => togglePause(false));
    document.getElementById('pauseSettingsButton').addEventListener('click', () => openSettings('paused'));
    document.getElementById('restartButton').addEventListener('click', () => startGame(false, currentLevel));
    document.getElementById('quitButton').addEventListener('click', showTitle);
    document.getElementById('playAgainButton').addEventListener('click', () => startGame(false, lastRunLevel));
    document.getElementById('endQuitButton').addEventListener('click', showTitle);
    document.getElementById('closeSettings').addEventListener('click', closeSettings);
    document.getElementById('intelContinue').addEventListener('click', showNextIntel);
    document.getElementById('skipBossIntro').addEventListener('click', activateWave);
    document.getElementById('nextSectorButton').addEventListener('click', enterNextSector);
    document.getElementById('stationButton').addEventListener('click', useStation);
    document.getElementById('waveCallButton').addEventListener('click', callNextWave);
    document.getElementById('adminButton').addEventListener('click', openAdminAccess);
    document.getElementById('menuAdminButton').addEventListener('click', openAdminAccess);
    document.getElementById('leaderboardButton').addEventListener('click', openLeaderboard);
    document.getElementById('closeAuth').addEventListener('click', closeAdminAccess);
    document.getElementById('closeLeaderboard').addEventListener('click', closeLeaderboard);
    document.getElementById('authForm').addEventListener('submit', submitAdminForm);
    document.getElementById('signOutButton').addEventListener('click', signOutAdmin);
    document.getElementById('skipTutorial').addEventListener('click', () => {
      tutorialMode = false;
      ui.tutorialCard.classList.remove('active');
      if (wave === 0) beginWave();
      showToast('TRAINING SKIPPED');
    });

    const musicToggle = document.getElementById('musicToggle');
    const sfxToggle = document.getElementById('sfxToggle');
    const shakeToggle = document.getElementById('shakeToggle');
    musicToggle.checked = settings.music;
    sfxToggle.checked = settings.sfx;
    shakeToggle.checked = settings.shake;
    musicToggle.addEventListener('change', () => {
      settings.music = musicToggle.checked;
      localStorage.setItem('voidline-music', String(settings.music));
      audio.init(); audio.setMusic(settings.music);
    });
    sfxToggle.addEventListener('change', () => {
      settings.sfx = sfxToggle.checked;
      localStorage.setItem('voidline-sfx', String(settings.sfx));
      audio.init(); audio.setSfx(settings.sfx);
    });
    shakeToggle.addEventListener('change', () => {
      settings.shake = shakeToggle.checked;
      localStorage.setItem('voidline-shake', String(settings.shake));
    });
  }

  function frame(now) {
    const dt = Math.min(.034, (now - lastTime) / 1000 || .016);
    lastTime = now;
    update(dt);
    draw();
    requestAnimationFrame(frame);
  }
