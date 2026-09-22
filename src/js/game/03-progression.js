  // Player defaults, progression checkpoints, campaign setup, and pilot activation.
  const BASE_ROCKET_DAMAGE = 125 * 1.15 * 1.05;

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
      rocketDamage: BASE_ROCKET_DAMAGE,
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
    const checkpoint = { gateShields: shields, progressionVersion: PROGRESSION_VERSION, rocketDamageBase: BASE_ROCKET_DAMAGE };
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
    const savedRocketDamageBase = Number(checkpoint.rocketDamageBase);
    if (Number.isFinite(player.rocketDamage)) {
      if (Number.isFinite(savedRocketDamageBase) && savedRocketDamageBase !== BASE_ROCKET_DAMAGE) {
        player.rocketDamage *= BASE_ROCKET_DAMAGE / savedRocketDamageBase;
        checkpoint.rocketDamageBase = BASE_ROCKET_DAMAGE;
      } else if (!Number.isFinite(savedRocketDamageBase)) {
        player.rocketDamage *= BASE_ROCKET_DAMAGE / 125;
        checkpoint.rocketDamageBase = BASE_ROCKET_DAMAGE;
      }
    }
    if (legacyCheckpoint) {
      player.speed *= 310 / 355;
      player.acceleration *= 860 / 980;
      player.speedTier = clamp(1 + Math.round(Math.log(Math.max(1, player.speed / 310)) / Math.log(1.1)), 1, 7);
      player.damageTier = clamp(1 + Math.round(Math.log(Math.max(1, player.damage / 18)) / Math.log(1.18)), 1, 7);
      player.rateTier = clamp(1 + Math.round(Math.log(Math.max(1, player.fireRate / 5.2)) / Math.log(1.14)), 1, 7);
      player.hullTier = clamp(1 + Math.round(Math.max(0, player.maxHp - 50) / 15), 1, 7);
      player.rocketTier = clamp(1 + Math.round(Math.log(Math.max(1, player.rocketDamage / BASE_ROCKET_DAMAGE)) / Math.log(1.22)), 1, 7);
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
    if (campaignState.lastStageCheckpoint && !isStageCheckpointValid(campaignState.lastStageCheckpoint)) {
      campaignState.lastStageCheckpoint = null;
      changed = true;
    }
    if (changed) saveCampaignState();
  }

  function isStageCheckpointValid(checkpoint) {
    const level = Number(checkpoint?.level);
    const stage = Number(checkpoint?.stage);
    return Number(checkpoint?.progressionVersion) === PROGRESSION_VERSION
      && Number.isInteger(level) && level >= 0 && level < LEVELS.length
      && Number.isInteger(stage) && stage >= 1 && stage <= LEVELS[level].stages
      && checkpoint.player && typeof checkpoint.player === 'object'
      && Array.isArray(checkpoint.resources) && Array.isArray(checkpoint.pickups) && Array.isArray(checkpoint.stations);
  }

  function stageCheckpointRank(checkpoint) {
    if (!isStageCheckpointValid(checkpoint)) return -1;
    return LEVELS.slice(0, checkpoint.level).reduce((total, level) => total + level.stages, 0) + checkpoint.stage;
  }

  function cloneStageCheckpoint(checkpoint) {
    return {
      ...checkpoint,
      player: { ...checkpoint.player },
      resources: checkpoint.resources.map((resource) => ({ ...resource })),
      pickups: checkpoint.pickups.map((pickup) => ({ ...pickup })),
      stations: checkpoint.stations.map((station) => ({ ...station })),
    };
  }

  function updateCheckpointButton() {
    const checkpoint = campaignState.lastStageCheckpoint;
    const hasCheckpoint = isStageCheckpointValid(checkpoint);
    ui.checkpointButton.hidden = !hasCheckpoint;
    ui.startButton.querySelector('[data-i18n]').textContent = t(hasCheckpoint ? 'menu.beginNewDefense' : 'menu.beginDefense');
    ui.checkpointDetails.textContent = hasCheckpoint
      ? `${t('menu.checkpointSector', { level: checkpoint.level + 1 })}\n${t('menu.checkpointStage', { stage: checkpoint.stage })}`
      : '';
  }

  function showCheckpointNotice(checkpoint) {
    const level = translateLevel(LEVELS[checkpoint.level]);
    ui.checkpointNotice.textContent = t('toast.checkpointSaved', { sector: level.short, stage: String(checkpoint.stage).padStart(2, '0') });
    ui.checkpointNotice.classList.add('visible');
    checkpointNoticeTimer = 2.8;
  }

  function saveStageCheckpoint(checkpoint) {
    if (stageCheckpointRank(checkpoint) >= stageCheckpointRank(campaignState.lastStageCheckpoint)) {
      campaignState.lastStageCheckpoint = cloneStageCheckpoint(checkpoint);
      saveCampaignState();
      updateCheckpointButton();
    }
  }

  function captureStageCheckpoint() {
    if (tutorialMode || wave <= 0) return;
    const { rocketTarget, ...checkpointPlayer } = player;
    stageCheckpoint = {
      level: currentLevel,
      stage: wave,
      progressionVersion: PROGRESSION_VERSION,
      player: checkpointPlayer,
      gateShields,
      score,
      kills,
      resources: resources.map((resource) => ({ ...resource })),
      pickups: pickups.map((pickup) => ({ ...pickup })),
      stations: stations.map(({ target, ...station }) => ({ ...station })),
      resourceTimer,
      repairTimer,
      lastSelectedUpgradeId,
    };
    saveStageCheckpoint(stageCheckpoint);
    showCheckpointNotice(stageCheckpoint);
  }

  function retryStageCheckpoint() {
    if (!isStageCheckpointValid(stageCheckpoint)) return false;
    const checkpoint = stageCheckpoint;
    currentLevel = checkpoint.level;
    activePaths = LEVELS[currentLevel].paths;
    player = { ...checkpoint.player, rocketTarget: null, invulnerable: 0, collisionTimer: 0, jumpFlash: 0 };
    gateShields = checkpoint.gateShields;
    score = checkpoint.score;
    kills = checkpoint.kills;
    resources = checkpoint.resources.map((resource) => ({ ...resource }));
    pickups = checkpoint.pickups.map((pickup) => ({ ...pickup }));
    stations = checkpoint.stations.map((station) => ({ ...station, target: null }));
    bullets = [];
    rockets = [];
    enemies = [];
    enemyRockets = [];
    particles = [];
    floaters = [];
    wave = checkpoint.stage - 1;
    formation = 0;
    formationsInStage = 1;
    waveClearTimer = 0;
    waveReady = false;
    waveCallEligible = false;
    resourceTimer = checkpoint.resourceTimer;
    repairTimer = checkpoint.repairTimer;
    spawnTimer = 0;
    spawnQueue = [];
    pendingLevelUps = 0;
    lastSelectedUpgradeId = checkpoint.lastSelectedUpgradeId;
    pendingWaveStart = false;
    bossIntroTimer = 0;
    threatWarningCooldown = 0;
    lockedTarget = null;
    stationaryTime = 0;
    staticDamageTimer = 0;
    jumpDestinationHold = 0;
    jumpDestinationCancelArmed = false;
    runFinished = false;
    lastRunLevel = currentLevel;
    camera.shake = 0;
    camera.x = clamp(player.x - screenWidth / 2, 0, WORLD.width - screenWidth);
    camera.y = clamp(player.y - screenHeight / 2, 0, WORLD.height - screenHeight);
    ui.staticWarning.classList.remove('active');
    ui.portalWarning.classList.remove('active');
    ui.lockReadout.classList.remove('active');
    setWaveCallAvailable(false);
    hideOverlays();
    ui.crosshair.style.opacity = '1';
    mode = 'playing';
    beginWave();
    syncUi();
    return true;
  }

  function resumeLastStageCheckpoint() {
    if (!isStageCheckpointValid(campaignState.lastStageCheckpoint)) return false;
    audio.init();
    localStorage.setItem(GAME_STARTED_KEY, 'true');
    tutorialMode = false;
    resetTutorialFlow();
    stageCheckpoint = cloneStageCheckpoint(campaignState.lastStageCheckpoint);
    return retryStageCheckpoint();
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
    staticDamageTimer = 0;
    jumpDestinationHold = 0;
    jumpDestinationCancelArmed = false;
    resourceTimer = .7;
    repairTimer = 11;
    spawnTimer = 0;
    spawnQueue = [];
    pendingLevelUps = 0;
    lastSelectedUpgradeId = null;
    seenEnemyTypes = new Set(campaignState.seenEnemyTypes || []);
    introQueue = [];
    pendingWaveStart = false;
    bossIntroTimer = 0;
    threatWarningCooldown = 0;
    lockedTarget = null;
    stageCheckpoint = null;
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
    localStorage.setItem(GAME_STARTED_KEY, 'true');
    document.getElementById('tutorialButton').classList.remove('tutorial-recommended');
    clearRun(withTutorial ? 0 : levelIndex);
    lastRunLevel = currentLevel;
    tutorialMode = withTutorial;
    tutorialIndex = 0;
    tutorialDelay = 0;
    resetTutorialFlow();
    mode = 'playing';
    hideOverlays();
    ui.crosshair.style.opacity = '1';
    if (tutorialMode) {
      resources = [];
      ui.tutorialCard.classList.add('active');
      updateTutorialCard();
      showToast(t('toast.trainingLink'));
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
    updateCheckpointButton();
  }

  function updatePilotUi() {
    const connected = Boolean(activePilot);
    [ui.adminButton, ui.menuAdminButton].forEach((button) => {
      button.classList.toggle('connected', connected && isAdminPilot());
      button.title = connected && isAdminPilot() ? `${t('account.adminAccess')}: ${activePilot.username}` : t('tooltip.adminAccess');
    });
    if (activePilot?.isGuest && ui.publicUsername) ui.publicUsername.value = activePilot.username;
    if (!connected) return;
    ui.pilotType.textContent = isAdminPilot() ? t('account.adminPilot') : t('account.guestPilot');
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
      updateCheckpointButton();
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
      ui.pilotSyncState.textContent = t('account.offlineDevice');
      console.warn('Voidline cloud load:', error);
    }

    const remoteUpdatedAt = Date.parse(remote?.updated_at || '') || 0;
    if (remote && remoteUpdatedAt >= cachedUpdatedAt) {
      campaignState = normalizeCampaignState(remote.campaign);
      highScore = Math.max(0, Number(remote.high_score) || 0);
      saveCampaignState(false, false);
      localStorage.setItem(localUpdatedKey(), remote.updated_at);
      ui.pilotSyncState.textContent = t('account.cloudLoaded');
    } else if (cachedCampaign) {
      campaignState = cachedCampaign;
      highScore = cachedHighScore;
      ui.pilotSyncState.textContent = cloudSyncSuspended ? t('account.offlineSaved') : remote ? t('account.uploading') : t('account.deviceLoaded');
      scheduleCloudSave();
    } else if (localStorage.getItem(CAMPAIGN_KEY) && !localStorage.getItem('voidline-legacy-cloud-claimed')) {
      campaignState = readCampaignState(CAMPAIGN_KEY);
      highScore = Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
      localStorage.setItem('voidline-legacy-cloud-claimed', 'true');
      saveCampaignState();
      ui.pilotSyncState.textContent = t('account.importing');
    } else {
      campaignState = emptyCampaignState();
      highScore = 0;
      saveCampaignState();
      ui.pilotSyncState.textContent = t('account.cloudCreated');
    }

    ensureCampaignCheckpoints();
    if (isAdminPilot()) {
      highScore = 0;
      localStorage.setItem(highScoreKey(), '0');
      saveCampaignState();
    }
    ui.bestText.textContent = formatScore(highScore);
    updateCheckpointButton();
    if (mode === 'levelSelect') renderLevelSelect();
  }
