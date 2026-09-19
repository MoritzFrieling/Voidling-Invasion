  // Player defaults, progression checkpoints, campaign setup, and pilot activation.
  function resetPlayer() {
    return {
      x: 860,
      y: 1030,
      vx: 0,
      vy: 0,
      angle: 0,
      radius: 18,
      hp: 50,
      maxHp: 50,
      speed: 310,
      acceleration: 860,
      fireRate: 5.2,
      shotTimer: 0,
      damage: 18,
      projectileSpeed: 920,
      level: 1,
      xp: 0,
      xpNext: 60,
      boostCooldown: 0,
      boostMax: 4.8,
      jumpDestinationX: null,
      jumpDestinationY: null,
      jumpDestinationCooldown: 0,
      jumpDestinationMax: 1.6,
      jumpBrake: 0,
      jumpFlash: 0,
      rocketCooldown: 0,
      rocketMax: 6.8,
      rocketCharge: 0,
      rocketDamage: 125,
      invulnerable: 0,
      lastMoveX: 1,
      lastMoveY: 0,
      multiShot: 1,
      multiUpgradeLevel: 0,
      salvage: 1,
      credits: 40,
      speedTier: 1,
      damageTier: 1,
      rateTier: 1,
      hullTier: 1,
      rocketTier: 1,
      coolingTier: 1,
      collisionTimer: 0,
    };
  }

  const PROGRESSION_VERSION = 5;

  const PROGRESS_KEYS = [
    'hp', 'maxHp', 'speed', 'acceleration', 'fireRate', 'damage', 'projectileSpeed', 'level', 'xp', 'xpNext',
    'boostMax', 'rocketMax', 'rocketDamage', 'multiShot', 'salvage', 'credits',
    'speedTier', 'damageTier', 'rateTier', 'hullTier', 'rocketTier', 'coolingTier',
  ];

  function captureProgress(source = player, shields = gateShields) {
    const checkpoint = { gateShields: shields, progressionVersion: PROGRESSION_VERSION };
    for (const key of PROGRESS_KEYS) checkpoint[key] = source[key];
    return checkpoint;
  }

  function expectedCheckpoint() {
    return captureProgress(resetPlayer(), 3);
  }

  function applyCheckpoint(checkpoint) {
    if (!checkpoint) return;
    const legacyCheckpoint = !Number.isFinite(Number(checkpoint.speedTier));
    for (const key of PROGRESS_KEYS) {
      const value = Number(checkpoint[key]);
      if (Number.isFinite(value)) player[key] = value;
    }
    if (legacyCheckpoint) {
      player.speed *= 310 / 355;
      player.acceleration *= 860 / 980;
      player.speedTier = clamp(1 + Math.round(Math.log(Math.max(1, player.speed / 310)) / Math.log(1.1)), 1, 7);
      player.damageTier = clamp(1 + Math.round(Math.log(Math.max(1, player.damage / 18)) / Math.log(1.18)), 1, 7);
      player.rateTier = clamp(1 + Math.round(Math.log(Math.max(1, player.fireRate / 5.2)) / Math.log(1.14)), 1, 7);
      player.hullTier = clamp(1 + Math.round(Math.max(0, player.maxHp - 50) / 15), 1, 7);
      player.rocketTier = clamp(1 + Math.round(Math.log(Math.max(1, player.rocketDamage / 125)) / Math.log(1.22)), 1, 7);
      player.coolingTier = clamp(1 + Math.round(Math.log(Math.min(1, player.rocketMax / 6.8)) / Math.log(.9)), 1, 7);
    }
    player.hp = Math.max(1, Math.min(player.maxHp, player.hp));
    gateShields = Math.max(1, Math.min(5, Number(checkpoint.gateShields) || 3));
  }

  function ensureCampaignCheckpoints() {
    let changed = false;
    for (let index = 0; index <= campaignState.highestUnlocked; index += 1) {
      if (!campaignState.checkpoints[index]
        || Number(campaignState.checkpoints[index].progressionVersion) !== PROGRESSION_VERSION) {
        campaignState.checkpoints[index] = expectedCheckpoint(index);
        changed = true;
      }
    }
    if (changed) saveCampaignState();
  }

  function clearRun(levelIndex = 0) {
    player = resetPlayer();
    bullets = [];
    rockets = [];
    enemies = [];
    enemyRockets = [];
    resources = [];
    pickups = [];
    stations = [];
    particles = [];
    floaters = [];
    wave = 0;
    formation = 0;
    formationsInStage = 1;
    const highestSelectable = isAdminPilot() ? LEVELS.length - 1 : campaignState.highestUnlocked;
    currentLevel = clamp(levelIndex, 0, highestSelectable);
    activePaths = LEVELS[currentLevel].paths;
    score = 0;
    kills = 0;
    gateShields = 3;
    ensureCampaignCheckpoints();
    applyCheckpoint(campaignState.checkpoints[currentLevel] || expectedCheckpoint(currentLevel));
    waveClearTimer = 0;
    formationStartedAt = 0;
    formationParTime = 0;
    formationGateShields = gateShields;
    waveReady = false;
    waveCallEligible = false;
    stationaryTime = 0;
    staticPressure = 0;
    resourceTimer = .7;
    repairTimer = 11;
    spawnTimer = 0;
    spawnQueue = [];
    pendingLevelUps = 0;
    seenEnemyTypes = new Set(campaignState.seenEnemyTypes || []);
    introQueue = [];
    pendingWaveStart = false;
    bossIntroTimer = 0;
    threatWarningCooldown = 0;
    lockedTarget = null;
    ui.staticWarning.classList.remove('active');
    setWaveCallAvailable(false);
    runFinished = false;
    gameClock = 0;
    camera.shake = 0;
    camera.x = player.x - screenWidth / 2;
    camera.y = player.y - screenHeight / 2;
    for (let i = 0; i < 7; i += 1) spawnResource(true);
  }

  function startGame(withTutorial = false, levelIndex = 0) {
    audio.init();
    clearRun(withTutorial ? 0 : levelIndex);
    lastRunLevel = currentLevel;
    tutorialMode = withTutorial;
    tutorialIndex = 0;
    tutorialDelay = 0;
    mode = 'playing';
    hideOverlays();
    ui.crosshair.style.opacity = '1';
    if (tutorialMode) {
      ui.tutorialCard.classList.add('active');
      updateTutorialCard();
      const rock = resources[0];
      if (rock) { rock.x = player.x + 300; rock.y = player.y - 50; }
      showToast('TRAINING LINK ACTIVE');
    } else {
      ui.tutorialCard.classList.remove('active');
      beginWave();
    }
    syncUi();
  }

  function hideOverlays() {
    document.querySelectorAll('.overlay').forEach((overlay) => overlay.classList.remove('active'));
  }

  function showTitle() {
    mode = 'menu';
    hideOverlays();
    ui.startOverlay.classList.add('active');
    ui.tutorialCard.classList.remove('active');
    ui.crosshair.style.opacity = '0';
    ui.portalWarning.classList.remove('active');
    ui.lockReadout.classList.remove('active');
  }

  function updatePilotUi() {
    const connected = Boolean(activePilot);
    [ui.adminButton, ui.menuAdminButton].forEach((button) => {
      button.classList.toggle('connected', connected && isAdminPilot());
      button.title = connected && isAdminPilot() ? `Admin: ${activePilot.username}` : 'Admin access';
    });
    if (activePilot?.isGuest && ui.publicUsername) ui.publicUsername.value = activePilot.username;
    if (!connected) return;
    ui.pilotType.textContent = isAdminPilot() ? 'ADMIN PILOT · HIGHSCORE DISABLED' : 'GUEST PILOT · DEVICE SESSION';
    ui.pilotName.textContent = activePilot.username;
  }

  async function activatePilot(pilot) {
    activePilot = pilot;
    activePilotId = pilot?.id || null;
    cloudSyncSuspended = false;
    updatePilotUi();

    if (!pilot) {
      campaignState = emptyCampaignState();
      highScore = 0;
      ui.bestText.textContent = formatScore(0);
      return;
    }

    const cachedCampaign = localStorage.getItem(campaignKey()) ? readCampaignState(campaignKey()) : null;
    const cachedHighScore = Number(localStorage.getItem(highScoreKey()) || 0);
    const cachedUpdatedAt = Date.parse(localStorage.getItem(localUpdatedKey()) || '') || 0;
    let remote = null;
    try {
      remote = await window.VoidlineCloud.loadProgress();
    } catch (error) {
      cloudSyncSuspended = true;
      ui.pilotSyncState.textContent = 'OFFLINE · USING DEVICE SAVE';
      console.warn('Voidline cloud load:', error);
    }

    const remoteUpdatedAt = Date.parse(remote?.updated_at || '') || 0;
    if (remote && remoteUpdatedAt >= cachedUpdatedAt) {
      campaignState = normalizeCampaignState(remote.campaign);
      highScore = Math.max(0, Number(remote.high_score) || 0);
      saveCampaignState(false, false);
      localStorage.setItem(localUpdatedKey(), remote.updated_at);
      ui.pilotSyncState.textContent = 'CLOUD SAVE LOADED';
    } else if (cachedCampaign) {
      campaignState = cachedCampaign;
      highScore = cachedHighScore;
      ui.pilotSyncState.textContent = cloudSyncSuspended ? 'OFFLINE · SAVED ON DEVICE' : remote ? 'UPLOADING DEVICE SAVE…' : 'DEVICE SAVE LOADED';
      scheduleCloudSave();
    } else if (localStorage.getItem(CAMPAIGN_KEY) && !localStorage.getItem('voidline-legacy-cloud-claimed')) {
      campaignState = readCampaignState(CAMPAIGN_KEY);
      highScore = Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
      localStorage.setItem('voidline-legacy-cloud-claimed', 'true');
      saveCampaignState();
      ui.pilotSyncState.textContent = 'IMPORTING EXISTING PROGRESS…';
    } else {
      campaignState = emptyCampaignState();
      highScore = 0;
      saveCampaignState();
      ui.pilotSyncState.textContent = 'NEW CLOUD SAVE CREATED';
    }

    ensureCampaignCheckpoints();
    if (isAdminPilot()) {
      highScore = 0;
      localStorage.setItem(highScoreKey(), '0');
      saveCampaignState();
    }
    ui.bestText.textContent = formatScore(highScore);
    if (mode === 'levelSelect') renderLevelSelect();
  }
