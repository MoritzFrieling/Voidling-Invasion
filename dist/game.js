(() => {
  'use strict';

  const canvas = document.querySelector('#gameCanvas');
  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  const mapCanvas = document.querySelector('#minimap');
  const mctx = mapCanvas.getContext('2d');

  const WORLD = { width: 3400, height: 2100 };
  const PORTAL = { x: 3080, y: 1010, radius: 112 };

  function createPath(points) {
    const segments = [];
    let length = 0;
    for (let i = 0; i < points.length - 1; i += 1) {
      const a = points[i];
      const b = points[i + 1];
      const segmentLength = Math.hypot(b.x - a.x, b.y - a.y);
      segments.push({ a, b, length: segmentLength, start: length });
      length += segmentLength;
    }
    return { points, segments, length };
  }

  const LEVELS = [
    {
      name: 'OUTER PERIMETER', short: 'SECTOR 01', stages: 6, boss: 'bossOmega',
      next: 'The route ahead has split. Hostiles are regrouping around twin approach corridors.',
      paths: [createPath([
        { x: -120, y: 380 }, { x: 360, y: 430 }, { x: 690, y: 770 }, { x: 1110, y: 690 },
        { x: 1470, y: 1010 }, { x: 1860, y: 1260 }, { x: 2250, y: 1160 }, { x: 2570, y: 850 },
        { x: 2860, y: 900 }, { x: PORTAL.x, y: PORTAL.y },
      ])],
      wormholes: [],
    },
    {
      name: 'TWIN RIFT', short: 'SECTOR 02', stages: 7, boss: 'bossCarrier',
      next: 'A shattered approach lies ahead. Three lanes and unstable wormholes converge on Earth.',
      paths: [
        createPath([{ x: -120, y: 310 }, { x: 440, y: 330 }, { x: 900, y: 600 }, { x: 1380, y: 520 }, { x: 1820, y: 820 }, { x: 2280, y: 760 }, { x: 2670, y: 900 }, { x: PORTAL.x, y: PORTAL.y }]),
        createPath([{ x: -120, y: 1780 }, { x: 420, y: 1670 }, { x: 820, y: 1390 }, { x: 1290, y: 1510 }, { x: 1710, y: 1220 }, { x: 2220, y: 1320 }, { x: 2660, y: 1100 }, { x: PORTAL.x, y: PORTAL.y }]),
      ],
      wormholes: [{ x: 1820, y: 820, pathId: 0, progress: .58 }, { x: 1710, y: 1220, pathId: 1, progress: .54 }],
    },
    {
      name: 'SHATTERED APPROACH', short: 'SECTOR 03', stages: 8, boss: 'bossTitan',
      next: '',
      paths: [
        createPath([{ x: -120, y: 220 }, { x: 510, y: 280 }, { x: 980, y: 520 }, { x: 1500, y: 410 }, { x: 1990, y: 660 }, { x: 2510, y: 720 }, { x: PORTAL.x, y: PORTAL.y }]),
        createPath([{ x: -120, y: 1030 }, { x: 490, y: 940 }, { x: 960, y: 1120 }, { x: 1440, y: 920 }, { x: 1940, y: 1080 }, { x: 2470, y: 930 }, { x: PORTAL.x, y: PORTAL.y }]),
        createPath([{ x: -120, y: 1900 }, { x: 500, y: 1780 }, { x: 930, y: 1510 }, { x: 1490, y: 1640 }, { x: 1980, y: 1370 }, { x: 2510, y: 1260 }, { x: PORTAL.x, y: PORTAL.y }]),
      ],
      wormholes: [{ x: 1500, y: 410, pathId: 0, progress: .48 }, { x: 1440, y: 920, pathId: 1, progress: .47 }, { x: 1490, y: 1640, pathId: 2, progress: .49 }],
    },
  ];
  let currentLevel = 0;
  let activePaths = LEVELS[0].paths;

  const COLORS = {
    cyan: '#6df7e8',
    cyanSoft: '#b7fff6',
    amber: '#ffb35c',
    coral: '#ff6f61',
    purple: '#a88cff',
    pale: '#e8f8f5',
    void: '#03070c',
  };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (array) => array[(Math.random() * array.length) | 0];
  const distanceSq = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
  const formatScore = (value) => String(Math.max(0, Math.floor(value))).padStart(6, '0');

  const ui = {};
  [
    'waveText', 'waveState', 'scoreText', 'bestText', 'healthBar', 'healthText', 'xpBar', 'xpText',
    'levelText', 'shieldPips', 'rocketState', 'rocketCooldown', 'boostState', 'boostCooldown',
    'startOverlay', 'pauseOverlay', 'settingsOverlay', 'upgradeOverlay', 'endOverlay', 'upgradeChoices',
    'tutorialCard', 'tutorialStep', 'tutorialTitle', 'tutorialText', 'tutorialProgress', 'crosshair',
    'toast', 'endKicker', 'endTitle', 'endCopy', 'finalScore', 'finalWave', 'finalKills', 'sectorText',
    'creditText', 'portalWarning', 'lockReadout', 'stationState', 'intelOverlay', 'intelKicker', 'intelTitle',
    'intelRole', 'intelText', 'intelShip', 'bossOverlay', 'bossKicker', 'bossTitle', 'bossText',
    'sectorOverlay', 'sectorTitle', 'sectorCopy',
    'levelSelectOverlay', 'levelChoices',
    'speedTierText', 'damageTierText', 'rateTierText', 'hullTierText', 'rocketTierText', 'coolingTierText',
    'staticWarning', 'waveCallButton',
    'authOverlay', 'authTitle', 'authCopy', 'authTabs', 'authForm', 'authUsername', 'authPassword',
    'authPasswordConfirm', 'authPasswordConfirmLabel', 'authHint', 'authMessage', 'authSubmit',
    'pilotSummary', 'pilotType', 'pilotName', 'pilotSyncState', 'protectProgressButton', 'pilotButton',
    'pilotButtonText', 'leaderboardOverlay', 'leaderboardList',
  ].forEach((id) => { ui[id] = document.getElementById(id); });

  const settings = {
    music: localStorage.getItem('voidline-music') !== 'false',
    sfx: localStorage.getItem('voidline-sfx') !== 'false',
    shake: localStorage.getItem('voidline-shake') !== 'false',
  };

  const input = {
    keys: new Set(),
    pointerDown: false,
    pointerActive: false,
    mouseX: 0,
    mouseY: 0,
    aimWorldX: 0,
    aimWorldY: 0,
    lastPointerAt: -Infinity,
  };

  const stars = Array.from({ length: 340 }, (_, i) => ({
    x: (i * 977 + 113) % WORLD.width,
    y: (i * 631 + 71) % WORLD.height,
    size: i % 17 === 0 ? 1.8 : i % 5 === 0 ? 1.15 : .65,
    alpha: .18 + ((i * 37) % 60) / 100,
    depth: .5 + ((i * 13) % 50) / 100,
  }));

  let screenWidth = 1280;
  let screenHeight = 720;
  let dpr = 1;
  let lastTime = performance.now();
  let elapsed = 0;
  let gameClock = 0;
  let mode = 'menu';
  let settingsReturn = 'menu';
  let wave = 0;
  let formation = 0;
  let formationsInStage = 1;
  let score = 0;
  let kills = 0;
  let gateShields = 3;
  let waveClearTimer = 0;
  let formationStartedAt = 0;
  let formationParTime = 0;
  let formationGateShields = 3;
  let waveReady = false;
  let waveCallEligible = false;
  let stationaryTime = 0;
  let staticPressure = 0;
  let announcementTimer = 0;
  let toastTimer = 0;
  let resourceTimer = 1;
  let repairTimer = 12;
  let spawnTimer = 0;
  let spawnQueue = [];
  let pendingLevelUps = 0;
  let tutorialMode = false;
  let tutorialIndex = 0;
  let tutorialDelay = 0;
  let runFinished = false;
  let seenEnemyTypes = new Set();
  let introQueue = [];
  let pendingWaveStart = false;
  let bossIntroTimer = 0;
  let threatWarningCooldown = 0;
  let lockedTarget = null;
  let lastRunLevel = 0;
  const CAMPAIGN_KEY = 'voidline-campaign-v1';
  const HIGH_SCORE_KEY = 'voidline-highscore';
  let activePilot = null;
  let activePilotId = null;
  let pendingPilotAction = null;
  let authMode = 'signin';
  let accountReturnMode = 'menu';
  let cloudSaveTimer = 0;
  let cloudBusy = false;
  let cloudSyncSuspended = false;
  let highScore = Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);

  function isAdminPilot() {
    return Boolean(activePilot?.isAdmin && !activePilot.isGuest);
  }

  function emptyCampaignState() {
    return { highestUnlocked: 0, checkpoints: {}, completedCampaigns: 0, seenEnemyTypes: [] };
  }

  function campaignKey(userId = activePilotId) {
    return userId ? `${CAMPAIGN_KEY}:${userId}` : CAMPAIGN_KEY;
  }

  function highScoreKey(userId = activePilotId) {
    return userId ? `${HIGH_SCORE_KEY}:${userId}` : HIGH_SCORE_KEY;
  }

  function localUpdatedKey(userId = activePilotId) {
    return userId ? `voidline-local-updated:${userId}` : 'voidline-local-updated';
  }

  function normalizeCampaignState(saved) {
    return {
      highestUnlocked: Math.max(0, Math.min(LEVELS.length - 1, Number(saved?.highestUnlocked) || 0)),
      checkpoints: saved?.checkpoints && typeof saved.checkpoints === 'object' ? saved.checkpoints : {},
      completedCampaigns: Number(saved?.completedCampaigns) || 0,
      seenEnemyTypes: Array.isArray(saved?.seenEnemyTypes) ? saved.seenEnemyTypes.filter((type) => typeof type === 'string') : [],
    };
  }

  function readCampaignState(storageKey = campaignKey()) {
    try {
      return normalizeCampaignState(JSON.parse(localStorage.getItem(storageKey) || '{}'));
    } catch {
      return emptyCampaignState();
    }
  }

  let campaignState = readCampaignState();

  function saveCampaignState(syncCloud = true, touchTimestamp = true) {
    localStorage.setItem(campaignKey(), JSON.stringify(campaignState));
    localStorage.setItem(highScoreKey(), String(isAdminPilot() ? 0 : highScore));
    if (touchTimestamp) localStorage.setItem(localUpdatedKey(), new Date().toISOString());
    if (syncCloud) scheduleCloudSave();
  }

  function scheduleCloudSave() {
    if (!activePilot || !window.VoidlineCloud || cloudSyncSuspended) return;
    clearTimeout(cloudSaveTimer);
    ui.pilotSyncState.textContent = 'CHANGES PENDING';
    cloudSaveTimer = setTimeout(syncCloudProgress, 650);
  }

  async function syncCloudProgress() {
    if (!activePilot || !window.VoidlineCloud || cloudSyncSuspended) return;
    if (cloudBusy) {
      cloudSaveTimer = setTimeout(syncCloudProgress, 650);
      return;
    }
    cloudBusy = true;
    ui.pilotSyncState.textContent = 'SYNCHRONIZING…';
    try {
      await window.VoidlineCloud.saveProgress(campaignState, isAdminPilot() ? 0 : highScore);
      ui.pilotSyncState.textContent = 'CLOUD SAVE CURRENT';
    } catch (error) {
      ui.pilotSyncState.textContent = 'OFFLINE · SAVED ON DEVICE';
      console.warn('Voidline cloud save:', error);
    } finally {
      cloudBusy = false;
    }
  }

  const camera = { x: 0, y: 0, shake: 0, shakeX: 0, shakeY: 0 };
  let player;
  let bullets = [];
  let rockets = [];
  let enemies = [];
  let enemyRockets = [];
  let resources = [];
  let pickups = [];
  let stations = [];
  let particles = [];
  let floaters = [];

  class AudioEngine {
    constructor() {
      this.context = null;
      this.master = null;
      this.musicGain = null;
      this.sfxGain = null;
      this.started = false;
      this.nodes = [];
    }

    init() {
      if (this.context) {
        if (this.context.state === 'suspended') this.context.resume();
        return;
      }
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.musicGain = this.context.createGain();
      this.sfxGain = this.context.createGain();
      this.master.gain.value = .34;
      this.musicGain.gain.value = settings.music ? .22 : 0;
      this.sfxGain.gain.value = settings.sfx ? .55 : 0;
      this.musicGain.connect(this.master);
      this.sfxGain.connect(this.master);
      this.master.connect(this.context.destination);
      this.startMusic();
    }

    startMusic() {
      if (!this.context || this.started) return;
      this.started = true;
      const filter = this.context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 420;
      filter.Q.value = 1.8;
      filter.connect(this.musicGain);

      [55, 82.41, 110].forEach((frequency, index) => {
        const oscillator = this.context.createOscillator();
        const gain = this.context.createGain();
        oscillator.type = index === 1 ? 'triangle' : 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.value = index === 0 ? .14 : .055;
        oscillator.connect(gain);
        gain.connect(filter);
        oscillator.start();
        this.nodes.push(oscillator, gain);
      });

      const lfo = this.context.createOscillator();
      const lfoGain = this.context.createGain();
      lfo.frequency.value = .09;
      lfoGain.gain.value = 110;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      this.nodes.push(lfo, lfoGain, filter);
    }

    setMusic(enabled) {
      if (!this.musicGain || !this.context) return;
      this.musicGain.gain.setTargetAtTime(enabled ? .22 : 0, this.context.currentTime, .08);
    }

    setSfx(enabled) {
      if (!this.sfxGain || !this.context) return;
      this.sfxGain.gain.setTargetAtTime(enabled ? .55 : 0, this.context.currentTime, .04);
    }

    tone(frequency, duration = .08, type = 'square', volume = .12, slide = 0) {
      if (!this.context || !settings.sfx) return;
      const now = this.context.currentTime;
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now);
      if (slide) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, frequency + slide), now + duration);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(.001, now + duration);
      oscillator.connect(gain);
      gain.connect(this.sfxGain);
      oscillator.start(now);
      oscillator.stop(now + duration + .01);
    }
  }

  const audio = new AudioEngine();

  function resize() {
    const rect = canvas.getBoundingClientRect();
    screenWidth = Math.max(1, rect.width);
    screenHeight = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    canvas.width = Math.round(screenWidth * dpr);
    canvas.height = Math.round(screenHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function resetPlayer() {
    return {
      x: 860,
      y: 1030,
      vx: 0,
      vy: 0,
      angle: 0,
      radius: 18,
      hp: 100,
      maxHp: 100,
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
      boostTime: 0,
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

  const PROGRESSION_VERSION = 3;

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
      player.speedTier = clamp(1 + Math.round(Math.log(Math.max(1, player.speed / 310)) / Math.log(1.14)), 1, 7);
      player.damageTier = clamp(1 + Math.round(Math.log(Math.max(1, player.damage / 18)) / Math.log(1.24)), 1, 7);
      player.rateTier = clamp(1 + Math.round(Math.log(Math.max(1, player.fireRate / 5.2)) / Math.log(1.2)), 1, 7);
      player.hullTier = clamp(1 + Math.round(Math.max(0, player.maxHp - 100) / 25), 1, 7);
      player.rocketTier = clamp(1 + Math.round(Math.log(Math.max(1, player.rocketDamage / 125)) / Math.log(1.32)), 1, 7);
      player.coolingTier = clamp(1 + Math.round(Math.log(Math.min(1, player.rocketMax / 6.8)) / Math.log(.84)), 1, 7);
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
    ui.pilotButton.classList.toggle('connected', connected && !activePilot.isGuest);
    ui.pilotButton.classList.toggle('guest', connected && activePilot.isGuest);
    ui.pilotButtonText.textContent = connected ? activePilot.username : 'PILOT';
    if (!connected) return;
    ui.pilotType.textContent = activePilot.isGuest ? 'GUEST PILOT · DEVICE SESSION' : 'CLOUD PILOT · PERMANENT ACCOUNT';
    ui.pilotName.textContent = activePilot.username;
    ui.protectProgressButton.hidden = !activePilot.isGuest;
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

  function setAuthMode(nextMode) {
    authMode = nextMode;
    const signedIn = Boolean(activePilot) && nextMode === 'summary';
    ui.authTabs.hidden = signedIn || nextMode === 'upgrade';
    ui.authForm.hidden = signedIn;
    ui.pilotSummary.hidden = !signedIn;
    ui.authMessage.textContent = '';
    ui.authMessage.classList.remove('success');
    ui.authForm.classList.remove('busy');
    ui.authUsername.readOnly = nextMode === 'upgrade';
    ui.authUsername.value = nextMode === 'upgrade' ? activePilot?.username || '' : '';
    ui.authPassword.value = '';
    ui.authPasswordConfirm.value = '';

    const needsPassword = nextMode !== 'guest';
    document.getElementById('authPasswordLabel').hidden = !needsPassword;
    ui.authPassword.required = needsPassword;
    ui.authPasswordConfirmLabel.hidden = !['signup', 'upgrade'].includes(nextMode);
    ui.authPasswordConfirm.required = ['signup', 'upgrade'].includes(nextMode);
    document.querySelectorAll('#authTabs button').forEach((button) => button.classList.remove('active'));

    if (nextMode === 'signin') {
      document.getElementById('showSignIn').classList.add('active');
      ui.authTitle.textContent = 'WELCOME BACK';
      ui.authCopy.textContent = 'Sign in with your pilot username and password to restore cloud progress.';
      ui.authHint.textContent = 'Your password is handled by Supabase Auth and is never stored in the game.';
      ui.authSubmit.querySelector('span').textContent = 'SIGN IN';
      ui.authPassword.autocomplete = 'current-password';
    } else if (nextMode === 'signup') {
      document.getElementById('showSignUp').classList.add('active');
      ui.authTitle.textContent = 'CREATE PILOT';
      ui.authCopy.textContent = 'Choose a unique callsign and password. No email address is required.';
      ui.authHint.textContent = 'There is no password recovery without an email, so keep your password safe.';
      ui.authSubmit.querySelector('span').textContent = 'CREATE ACCOUNT';
      ui.authPassword.autocomplete = 'new-password';
    } else if (nextMode === 'guest') {
      document.getElementById('showGuest').classList.add('active');
      ui.authTitle.textContent = 'GUEST FLIGHT';
      ui.authCopy.textContent = 'Choose a unique callsign and enter immediately. You can protect the progress with a password later.';
      ui.authHint.textContent = 'Guest progress stays with this browser session and cannot be recovered after signing out or clearing site data.';
      ui.authSubmit.querySelector('span').textContent = 'CONTINUE AS GUEST';
    } else if (nextMode === 'upgrade') {
      ui.authTitle.textContent = 'PROTECT PROGRESS';
      ui.authCopy.textContent = 'Add a password to keep this callsign, cloud save, and leaderboard record permanently.';
      ui.authHint.textContent = 'Your guest progress will be transferred to the new permanent account.';
      ui.authSubmit.querySelector('span').textContent = 'CREATE PERMANENT ACCOUNT';
      ui.authPassword.autocomplete = 'new-password';
    } else {
      ui.authTitle.textContent = 'PILOT ACCOUNT';
      ui.authCopy.textContent = activePilot?.isGuest
        ? 'This guest session is saved to the cloud but cannot be recovered after sign-out.'
        : 'Your campaign progress and best score synchronize through the pilot network.';
    }
  }

  function openAccount(requestedMode = null) {
    accountReturnMode = mode;
    if (mode === 'playing') mode = 'paused';
    hideOverlays();
    ui.crosshair.style.opacity = '0';
    setAuthMode(requestedMode || (activePilot ? 'summary' : 'signin'));
    ui.authOverlay.classList.add('active');
    if (!activePilot || requestedMode === 'upgrade') setTimeout(() => (requestedMode === 'upgrade' ? ui.authPassword : ui.authUsername).focus(), 30);
  }

  function closeAccount() {
    ui.authOverlay.classList.remove('active');
    if (['playing', 'paused'].includes(accountReturnMode)) {
      mode = 'paused';
      ui.pauseOverlay.classList.add('active');
    } else {
      mode = 'menu';
      ui.startOverlay.classList.add('active');
    }
  }

  function requirePilot(action) {
    if (activePilot) {
      action();
      return;
    }
    pendingPilotAction = action;
    openAccount('signin');
  }

  async function submitAuthForm(event) {
    event.preventDefault();
    if (!window.VoidlineCloud) {
      ui.authMessage.textContent = 'The pilot network could not be loaded. Check your connection and refresh.';
      return;
    }
    if (cloudBusy) return;
    const username = ui.authUsername.value;
    const password = ui.authPassword.value;
    if (['signup', 'upgrade'].includes(authMode) && password !== ui.authPasswordConfirm.value) {
      ui.authMessage.textContent = 'Passwords do not match.';
      return;
    }
    cloudBusy = true;
    ui.authForm.classList.add('busy');
    ui.authMessage.textContent = 'CONTACTING PILOT NETWORK…';
    try {
      let pilot;
      if (authMode === 'guest') pilot = await window.VoidlineCloud.playAsGuest(username);
      else if (authMode === 'signin') pilot = await window.VoidlineCloud.signIn(username, password);
      else if (authMode === 'upgrade') pilot = await window.VoidlineCloud.upgradeGuest(username, password);
      else pilot = await window.VoidlineCloud.createAccount(username, password);
      await activatePilot(pilot);
      ui.authMessage.textContent = 'PILOT LINK ESTABLISHED';
      ui.authMessage.classList.add('success');
      const action = pendingPilotAction;
      pendingPilotAction = null;
      setTimeout(() => {
        closeAccount();
        if (action) action();
      }, 260);
    } catch (error) {
      ui.authMessage.textContent = error.message || 'Pilot access failed.';
    } finally {
      cloudBusy = false;
      ui.authForm.classList.remove('busy');
    }
  }

  async function signOutPilot() {
    if (!activePilot || cloudBusy) return;
    if (activePilot.isGuest && !window.confirm('Signing out of a guest session makes it impossible to recover. Continue?')) return;
    cloudBusy = true;
    try {
      await window.VoidlineCloud.signOut();
      await activatePilot(null);
      pendingPilotAction = null;
      setAuthMode('signin');
    } catch (error) {
      ui.pilotSyncState.textContent = error.message || 'SIGN OUT FAILED';
    } finally {
      cloudBusy = false;
    }
  }

  async function openLeaderboard() {
    accountReturnMode = mode;
    if (mode === 'playing') mode = 'paused';
    hideOverlays();
    ui.crosshair.style.opacity = '0';
    ui.leaderboardOverlay.classList.add('active');
    ui.leaderboardList.innerHTML = '<p class="leaderboard-empty">CONTACTING DEFENSE NETWORK…</p>';
    try {
      const entries = await window.VoidlineCloud.getLeaderboard(12);
      ui.leaderboardList.replaceChildren();
      if (!entries.length) {
        ui.leaderboardList.innerHTML = '<p class="leaderboard-empty">NO COMBAT RECORDS YET · SET THE FIRST SCORE</p>';
        return;
      }
      for (const entry of entries) {
        const row = document.createElement('div');
        row.className = 'leaderboard-row';
        const rank = document.createElement('span');
        rank.className = 'leaderboard-rank';
        rank.textContent = `#${String(entry.rank).padStart(2, '0')}`;
        const pilotCell = document.createElement('span');
        pilotCell.className = 'leaderboard-pilot';
        const name = document.createElement('strong');
        name.textContent = entry.username;
        const detail = document.createElement('small');
        detail.textContent = `${entry.is_guest ? 'GUEST · ' : ''}SECTOR ${entry.level_reached} · STAGE ${entry.stage_reached} · ${entry.kills} KILLS`;
        pilotCell.append(name, detail);
        const value = document.createElement('span');
        value.className = 'leaderboard-score';
        value.textContent = formatScore(entry.score);
        row.append(rank, pilotCell, value);
        ui.leaderboardList.append(row);
      }
    } catch (error) {
      ui.leaderboardList.innerHTML = '';
      const message = document.createElement('p');
      message.className = 'leaderboard-empty';
      message.textContent = error.message || 'LEADERBOARD UNAVAILABLE';
      ui.leaderboardList.append(message);
    }
  }

  function closeLeaderboard() {
    ui.leaderboardOverlay.classList.remove('active');
    if (['playing', 'paused'].includes(accountReturnMode)) {
      mode = 'paused';
      ui.pauseOverlay.classList.add('active');
    } else {
      mode = 'menu';
      ui.startOverlay.classList.add('active');
    }
  }

  async function initializeCloud() {
    try {
      const pilot = await window.VoidlineCloud.init();
      await activatePilot(pilot);
      if (pilot && ui.authOverlay.classList.contains('active')) {
        const action = pendingPilotAction;
        pendingPilotAction = null;
        closeAccount();
        if (action) action();
      }
    } catch (error) {
      ui.pilotButtonText.textContent = 'SETUP';
      ui.pilotSyncState.textContent = 'CLOUD SETUP REQUIRED';
      console.warn('Voidline pilot network:', error);
    }
  }

  function renderLevelSelect() {
    campaignState = readCampaignState();
    ensureCampaignCheckpoints();
    ui.levelChoices.replaceChildren();
    LEVELS.forEach((level, index) => {
      const adminAccess = isAdminPilot();
      const unlocked = adminAccess || index <= campaignState.highestUnlocked;
      const completed = !adminAccess && (index < campaignState.highestUnlocked || (index === LEVELS.length - 1 && campaignState.completedCampaigns > 0));
      const checkpoint = campaignState.checkpoints[index] || expectedCheckpoint(index);
      const paths = level.paths.length === 1 ? '1 APPROACH' : `${level.paths.length} APPROACHES`;
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `level-card${unlocked ? '' : ' locked'}`;
      card.dataset.index = String(index + 1).padStart(2, '0');
      card.disabled = !unlocked;
      card.innerHTML = `
        <span class="level-status">${adminAccess ? 'ADMIN ACCESS' : unlocked ? completed ? 'CLEARED' : 'UNLOCKED' : 'LOCKED'}</span>
        <h3>${level.name}</h3>
        <p>${index === 0 ? 'Single-route frontier defense.' : index === 1 ? 'Twin routes and unstable rift entries.' : 'Three converging lanes and deep wormholes.'}</p>
        <footer><span>${level.stages} STAGES · ${paths}</span><span class="checkpoint-note">SHIP LVL ${checkpoint.level || 1} · ${checkpoint.credits || 0} ◈</span></footer>`;
      if (unlocked) card.addEventListener('click', () => startGame(false, index));
      ui.levelChoices.append(card);
    });
  }

  function openLevelSelect() {
    renderLevelSelect();
    mode = 'levelSelect';
    hideOverlays();
    ui.levelSelectOverlay.classList.add('active');
    ui.crosshair.style.opacity = '0';
  }

  function closeLevelSelect() {
    mode = 'menu';
    ui.levelSelectOverlay.classList.remove('active');
    ui.startOverlay.classList.add('active');
  }

  function setWaveCallAvailable(available) {
    ui.waveCallButton.classList.toggle('active', available);
    ui.waveCallButton.disabled = !available;
    ui.waveCallButton.setAttribute('aria-hidden', String(!available));
  }

  function togglePause(forcePause = null) {
    if (!['playing', 'paused'].includes(mode)) return;
    const shouldPause = forcePause === null ? mode === 'playing' : forcePause;
    mode = shouldPause ? 'paused' : 'playing';
    ui.pauseOverlay.classList.toggle('active', shouldPause);
    ui.crosshair.style.opacity = shouldPause ? '0' : '1';
    if (shouldPause) ui.lockReadout.classList.remove('active');
  }

  function openSettings(from = mode) {
    settingsReturn = from === 'menu' ? 'menu' : 'paused';
    if (from === 'playing') mode = 'paused';
    hideOverlays();
    ui.settingsOverlay.classList.add('active');
    ui.crosshair.style.opacity = '0';
  }

  function closeSettings() {
    ui.settingsOverlay.classList.remove('active');
    if (settingsReturn === 'menu') {
      mode = 'menu';
      ui.startOverlay.classList.add('active');
    } else {
      mode = 'paused';
      ui.pauseOverlay.classList.add('active');
    }
  }

  function beginWave() {
    const level = LEVELS[currentLevel];
    if (wave >= level.stages) {
      completeLevel();
      return;
    }
    wave += 1;
    formation = 1;
    formationsInStage = 2;
    waveClearTimer = 0;
    prepareFormation();
  }

  function prepareFormation() {
    const level = LEVELS[currentLevel];
    spawnQueue = [];
    const regularCount = tutorialMode ? 4 : 4 + Math.ceil(wave * 1.15) + currentLevel * 2 + formation;
    const available = ['scout', 'raider'];
    if (wave >= 2) available.push('striker');
    if (wave >= 3) available.push('major');
    if (currentLevel >= 1 && wave >= 2) available.push('carrier');
    if (currentLevel >= 2 && wave >= 2) available.push('sentinel');
    for (let i = 0; i < regularCount; i += 1) {
      let type = available[(i * 7 + wave * 3 + formation * 2) % available.length];
      if (wave === 1 && formation === 1 && i === 0) type = 'scout';
      if (wave === 1 && formation === 1 && i === 1) type = 'raider';
      if (type === 'carrier' && i % 7 !== 4) type = 'raider';
      if (type === 'sentinel' && i % 6 !== 3) type = 'major';
      const pathId = (i + wave + formation) % level.paths.length;
      let entryProgress = 0;
      let fromWormhole = false;
      if (level.wormholes.length && wave >= 3 && i > 2 && i % 5 === 0) {
        const wormhole = level.wormholes[(i + wave + formation) % level.wormholes.length];
        entryProgress = level.paths[wormhole.pathId].length * wormhole.progress;
        fromWormhole = true;
        spawnQueue.push({ type, pathId: wormhole.pathId, entryProgress, fromWormhole });
      } else {
        spawnQueue.push({ type, pathId, entryProgress, fromWormhole });
      }
    }
    const isBossFormation = wave === level.stages && formation === formationsInStage;
    if (isBossFormation) spawnQueue.push({ type: level.boss, pathId: Math.floor(level.paths.length / 2), entryProgress: 0 });

    const waveTypes = [...new Set(spawnQueue.map((entry) => entry.type).filter((type) => !ENEMY_TYPES[type].boss && type !== 'interceptor'))];
    introQueue = tutorialMode ? [] : waveTypes.filter((type) => !seenEnemyTypes.has(type));
    pendingWaveStart = true;
    if (isBossFormation) showBossIntro(level.boss);
    else if (introQueue.length) showNextIntel();
    else activateWave();
  }

  function beginNextFormation() {
    formation += 1;
    waveClearTimer = 0;
    prepareFormation();
  }

  const ENEMY_TYPES = {
    scout: { name: 'DART FIGHTER', role: 'VERY FAST // LIGHT HULL', description: 'Quick attack craft with very little armor. Track it early before it slips through.', radius: 12, hp: 42, speed: 138, score: 100, xp: 10, color: '#ff8b72' },
    raider: { name: 'MARAUDER', role: 'BALANCED // ARMORED', description: 'Reliable frontline ship. Slower than a Dart, but it can absorb sustained blaster fire.', radius: 19, hp: 105, speed: 88, score: 170, xp: 16, color: '#ffb35c' },
    striker: { name: 'NEEDLE', role: 'EXTREME SPEED // FRAGILE', description: 'A tiny interceptor built entirely around speed. Its erratic lane changes make it hard to track.', radius: 10, hp: 48, speed: 178, score: 220, xp: 18, color: '#c885ff' },
    major: { name: 'SIEGEBREAKER', role: 'HEAVY HULL // MISSILES', description: 'A slow assault vessel that launches guided rockets at your ship. Keep moving.', radius: 32, hp: 390, speed: 58, score: 700, xp: 48, color: '#ff6f61', major: true },
    interceptor: { name: 'CARRIER INTERCEPTOR', role: 'LAUNCHED // DESTRUCTIBLE', description: 'A light interceptor launched by carrier vessels. Blaster hits damage its hull and can destroy it before it reaches the gate.', radius: 10, hp: 46, speed: 164, score: 80, xp: 7, color: '#ff9f88', interceptor: true },
    carrier: { name: 'BROOD CARRIER', role: 'SPAWNER // HEAVY HULL', description: 'A mobile hangar that launches smaller fighters along the route. Destroy it before the swarm grows.', radius: 37, hp: 520, speed: 49, score: 920, xp: 60, color: '#f071c8', major: true, carrier: true },
    sentinel: { name: 'AEGIS SENTINEL', role: 'ROCKET-BREAK SHIELD', description: 'Light blasters cannot pierce its barrier. Heavy rockets damage it, but several may be needed depending on your rocket level.', radius: 29, hp: 310, shield: 128, speed: 67, score: 840, xp: 58, color: '#79a8ff', major: true, shielded: true },
    bossOmega: { name: 'DREADNOUGHT OMEGA', role: 'MISSILE COMMAND SHIP', description: 'The first invasion commander. It saturates the defense zone with guided warheads.', radius: 66, hp: 2850, speed: 34, score: 5400, xp: 260, color: '#ff506b', major: true, boss: true, bossSkill: 'rockets' },
    bossCarrier: { name: 'THE HOLLOW QUEEN', role: 'RIFT CARRIER // SWARM COMMAND', description: 'A vast carrier that continuously deploys escort wings through the twin rift.', radius: 74, hp: 4600, speed: 29, score: 7600, xp: 340, color: '#ef67d1', major: true, boss: true, carrier: true, bossSkill: 'swarm' },
    bossTitan: { name: 'AEGIS TITAN', role: 'PHASE SHIELD // FINAL COMMAND', description: 'The final gatebreaker. Heavy rockets are required; several may be needed to collapse each regenerating shield phase.', radius: 82, hp: 7200, shield: 900, speed: 26, score: 12000, xp: 500, color: '#6b8cff', major: true, boss: true, shielded: true, bossSkill: 'titan' },
  };

  function activateWave() {
    ui.intelOverlay.classList.remove('active');
    ui.bossOverlay.classList.remove('active');
    mode = 'playing';
    pendingWaveStart = false;
    announcementTimer = 2.2;
    spawnTimer = .55;
    formationStartedAt = gameClock;
    formationParTime = 18 + spawnQueue.length * 1.45 + currentLevel * 2.5;
    formationGateShields = gateShields;
    waveReady = false;
    waveCallEligible = false;
    setWaveCallAvailable(false);
    const bossFormation = wave === LEVELS[currentLevel].stages && formation === formationsInStage;
    showToast(bossFormation ? 'COMMAND SHIP ENTERING THE VOIDLINE' : `STAGE ${String(wave).padStart(2, '0')} // WAVE ${formation} OF ${formationsInStage}`);
    audio.tone(bossFormation ? 82 : 128, .42, 'sawtooth', .08, bossFormation ? -35 : 110);
    ui.crosshair.style.opacity = '1';
    if (pendingLevelUps > 0) showUpgradeChoices();
  }

  function showNextIntel() {
    if (!introQueue.length) { activateWave(); return; }
    const type = introQueue.shift();
    const intel = ENEMY_TYPES[type];
    seenEnemyTypes.add(type);
    campaignState.seenEnemyTypes = [...seenEnemyTypes];
    saveCampaignState();
    mode = 'briefing';
    ui.crosshair.style.opacity = '0';
    ui.intelTitle.textContent = intel.name;
    ui.intelRole.textContent = intel.role;
    ui.intelText.textContent = intel.description;
    ui.intelKicker.textContent = currentLevel === 0 && wave === 1 ? 'FIRST CONTACT // HOSTILE PROFILE' : 'NEW HOSTILE IDENTIFIED';
    ui.intelOverlay.querySelector('.intel-panel').dataset.enemy = type;
    drawIntelShip(type);
    ui.intelOverlay.classList.add('active');
  }

  function showBossIntro(type) {
    const boss = ENEMY_TYPES[type];
    mode = 'cutscene';
    bossIntroTimer = 4.2;
    ui.crosshair.style.opacity = '0';
    ui.bossTitle.textContent = boss.name;
    ui.bossText.textContent = boss.role;
    ui.bossKicker.textContent = `${LEVELS[currentLevel].short} // COMMAND SIGNATURE DETECTED`;
    ui.bossOverlay.classList.add('active');
    audio.tone(48, .9, 'sawtooth', .12, 34);
  }

  function spawnEnemy(spec, parent = null) {
    if (typeof spec === 'string') spec = { type: spec };
    const type = spec.type;
    const blueprint = ENEMY_TYPES[type];
    const pathId = spec.pathId ?? parent?.pathId ?? 0;
    const path = activePaths[pathId] || activePaths[0];
    const progress = spec.entryProgress ?? parent?.progress ?? rand(-30, 12);
    const at = getPathPoint(progress, pathId);
    const campaignStage = LEVELS.slice(0, currentLevel).reduce((sum, level) => sum + level.stages, 0) + wave;
    const rampStage = Math.max(0, campaignStage - 1);
    const hpVariance = rand(.86, 1.28);
    const speedVariance = rand(.86, 1.17);
    const difficultyScale = 1.05 + rampStage * .125 + currentLevel * .16;
    const maxHp = blueprint.hp * difficultyScale * hpVariance;
    const enemy = {
      type,
      x: at.x,
      y: at.y,
      pathId,
      pathLength: path.length,
      progress,
      lane: rand(-58, 58),
      wobble: rand(0, Math.PI * 2),
      radius: blueprint.radius,
      hp: maxHp,
      maxHp,
      speed: blueprint.speed * (1 + rampStage * .022 + currentLevel * .015) * speedVariance,
      score: blueprint.score,
      xp: blueprint.xp,
      color: blueprint.color,
      major: Boolean(blueprint.major),
      boss: Boolean(blueprint.boss),
      carrier: Boolean(blueprint.carrier),
      interceptor: Boolean(blueprint.interceptor),
      shieldHp: (blueprint.shield || 0) * difficultyScale,
      maxShield: (blueprint.shield || 0) * difficultyScale,
      bossSkill: blueprint.bossSkill || '',
      rocketTimer: rand(1.3, 3),
      spawnTimer: rand(3.2, 5.4),
      shieldHitTimer: 0,
      angle: 0,
      hitFlash: 0,
      dead: false,
    };
    enemies.push(enemy);
    if (spec.fromWormhole) burst(at.x, at.y, COLORS.purple, 16, 160);
    return enemy;
  }

  function getPathPoint(distance, pathId = 0) {
    const path = activePaths[pathId] || activePaths[0];
    const d = clamp(distance, 0, path.length);
    let segment = path.segments[path.segments.length - 1];
    for (let i = 0; i < path.segments.length; i += 1) {
      if (d <= path.segments[i].start + path.segments[i].length) {
        segment = path.segments[i];
        break;
      }
    }
    const t = clamp((d - segment.start) / segment.length, 0, 1);
    const x = lerp(segment.a.x, segment.b.x, t);
    const y = lerp(segment.a.y, segment.b.y, t);
    const angle = Math.atan2(segment.b.y - segment.a.y, segment.b.x - segment.a.x);
    return { x, y, angle, nx: -Math.sin(angle), ny: Math.cos(angle) };
  }

  function spawnResource(initial = false) {
    if (resources.length >= 12) return;
    let x;
    let y;
    let safe = false;
    for (let attempt = 0; attempt < 20 && !safe; attempt += 1) {
      x = initial ? rand(320, WORLD.width - 260) : rand(160, WORLD.width - 140);
      y = rand(170, WORLD.height - 170);
      safe = Math.hypot(x - PORTAL.x, y - PORTAL.y) > 270 && Math.hypot(x - player.x, y - player.y) > 160;
    }
    const roll = Math.random();
    const size = roll < .5 ? rand(14, 25) : roll < .86 ? rand(26, 42) : rand(43, 62);
    const crystal = Math.random() < .2;
    const stageScale = 1 + Math.max(0, wave - 1) * .13;
    const maxHp = size * size * .115 * (crystal ? 1.18 : 1) * stageScale;
    resources.push({
      x, y, radius: size, hp: maxHp, maxHp, rotation: rand(0, 6.28), spin: rand(-.28, .28),
      sides: 5 + ((Math.random() * 3) | 0), crystal, xpValue: Math.round(size * (crystal ? 1.25 : .72) * stageScale),
      creditValue: Math.round(size * (crystal ? 1.1 : .64) * stageScale), collisionTimer: 0, dead: false,
    });
  }

  function spawnPickup(kind = 'repair') {
    const angle = rand(0, Math.PI * 2);
    const radius = rand(380, 790);
    pickups.push({
      kind,
      x: clamp(player.x + Math.cos(angle) * radius, 130, WORLD.width - 130),
      y: clamp(player.y + Math.sin(angle) * radius, 130, WORLD.height - 130),
      radius: kind === 'shield' ? 20 : 17,
      life: 30,
      pulse: rand(0, 6.28),
      dead: false,
    });
  }

  function update(dt) {
    elapsed += dt;
    if (toastTimer > 0) {
      toastTimer -= dt;
      if (toastTimer <= 0) ui.toast.classList.remove('visible');
    }
    if (mode === 'cutscene') {
      bossIntroTimer -= dt;
      if (bossIntroTimer <= 0) activateWave();
    }
    if (mode !== 'playing') return;
    gameClock += dt;
    if (announcementTimer > 0) announcementTimer -= dt;

    updatePlayer(dt);
    updateWave(dt);
    updateProjectiles(dt);
    updateEnemies(dt);
    updateStations(dt);
    updateResources(dt);
    updatePickups(dt);
    updateParticles(dt);
    handleCollisions();
    updateCamera(dt);
    updateTutorial(dt);
    syncUi();
  }

  function updatePlayer(dt) {
    player.shotTimer = Math.max(0, player.shotTimer - dt);
    player.boostCooldown = Math.max(0, player.boostCooldown - dt);
    player.rocketCooldown = Math.max(0, player.rocketCooldown - dt);
    player.invulnerable = Math.max(0, player.invulnerable - dt);
    player.collisionTimer = Math.max(0, player.collisionTimer - dt);
    player.jumpBrake = Math.max(0, player.jumpBrake - dt);
    player.jumpFlash = Math.max(0, player.jumpFlash - dt);

    let dx = 0;
    let dy = 0;
    if (input.keys.has('KeyA')) dx -= 1;
    if (input.keys.has('KeyD')) dx += 1;
    if (input.keys.has('KeyW')) dy -= 1;
    if (input.keys.has('KeyS')) dy += 1;
    const magnitude = Math.hypot(dx, dy);
    if (magnitude) {
      dx /= magnitude;
      dy /= magnitude;
      player.lastMoveX = dx;
      player.lastMoveY = dy;
      if (!isPointerAiming()) player.angle = Math.atan2(dy, dx);
      if (tutorialMode && tutorialIndex === 0) advanceTutorial();
    }

    const precision = input.keys.has('ShiftLeft') || input.keys.has('ShiftRight');
    const acceleration = player.acceleration * (precision ? .52 : player.jumpBrake > 0 ? .62 : 1);
    player.vx += dx * acceleration * dt;
    player.vy += dy * acceleration * dt;
    const drag = Math.pow(magnitude ? player.jumpBrake > 0 ? .08 : .12 : player.jumpBrake > 0 ? .02 : .035, dt);
    player.vx *= drag;
    player.vy *= drag;
    const maxSpeed = player.speed * (player.jumpBrake > 0 ? .58 : precision ? .48 : 1);
    const speed = Math.hypot(player.vx, player.vy);
    if (speed > maxSpeed) {
      player.vx = (player.vx / speed) * maxSpeed;
      player.vy = (player.vy / speed) * maxSpeed;
    }
    player.x = clamp(player.x + player.vx * dt, 45, WORLD.width - 45);
    player.y = clamp(player.y + player.vy * dt, 45, WORLD.height - 45);

    if (!magnitude && speed < 55) stationaryTime += dt;
    else stationaryTime = Math.max(0, stationaryTime - dt * 2.4);
    staticPressure = clamp((stationaryTime - 1.2) / 3.5, 0, 1);
    ui.staticWarning.classList.toggle('active', staticPressure > .28 && enemies.length > 0);

    if (!isPointerAiming()) {
      const autoTarget = nearestEnemy(720);
      if (autoTarget) {
        const targetAngle = Math.atan2(autoTarget.y - player.y, autoTarget.x - player.x);
        player.angle += clamp(angleDelta(player.angle, targetAngle), -6.5 * dt, 6.5 * dt);
      }
    }

    updateAimWorld();
    updateTargetLock();
    if (input.pointerDown || input.keys.has('ArrowUp')) {
      const angle = input.pointerDown
        ? Math.atan2(input.aimWorldY - player.y, input.aimWorldX - player.x)
        : player.angle;
      player.angle = angle;
      fireBlaster(angle);
    }

    if (player.rocketCharge > 0) {
      player.rocketCharge -= dt;
      if (player.rocketCharge <= 0) launchRocket();
    }

    if (speed > 80 && Math.random() < .55) {
      addParticle(player.x - Math.cos(player.angle) * 20, player.y - Math.sin(player.angle) * 20, {
        vx: -Math.cos(player.angle) * rand(70, 150) - player.vx * .18,
        vy: -Math.sin(player.angle) * rand(70, 150) - player.vy * .18,
        color: COLORS.cyan,
        life: rand(.18, .4),
        size: rand(1.5, 3.2),
      });
    }
  }

  function updateWave(dt) {
    if (tutorialMode && wave === 0 && tutorialIndex < 2) return;
    if (tutorialMode && wave === 0) beginWave();

    if (spawnQueue.length) {
      spawnTimer -= dt * (1 + staticPressure * .25);
      if (spawnTimer <= 0) {
        spawnEnemy(spawnQueue.shift());
        const openingBuffer = wave <= 2 ? .12 : 0;
        spawnTimer = Math.max(.34, .78 + currentLevel * .12 - wave * .018 + openingBuffer);
      }
    } else if (!enemies.length && wave > 0) {
      if (!waveReady) {
        waveReady = true;
        const clearTime = gameClock - formationStartedAt;
        waveCallEligible = !tutorialMode && clearTime <= formationParTime && gateShields >= formationGateShields;
        setWaveCallAvailable(waveCallEligible);
      }
      waveClearTimer += dt;
      if (waveClearTimer > 2) advanceAfterClear();
    }

    resourceTimer -= dt;
    if (resourceTimer <= 0) {
      spawnResource();
      resourceTimer = rand(5.5, 8.5);
    }
    repairTimer -= dt;
    if (repairTimer <= 0) {
      if (pickups.filter((item) => item.kind === 'repair').length < 2) spawnPickup('repair');
      repairTimer = rand(17, 25);
    }
    updatePortalThreat(dt);
  }

  function advanceAfterClear() {
    if (!waveReady) return;
    waveReady = false;
    waveCallEligible = false;
    setWaveCallAvailable(false);
    if (formation < formationsInStage) beginNextFormation();
    else {
      if (wave % 2 === 0 && gateShields < 5) spawnPickup('shield');
      beginWave();
    }
  }

  function callNextWave() {
    if (mode !== 'playing' || !waveReady || !waveCallEligible) return;
    const bonus = Math.round((6 + wave * 2 + currentLevel * 3) * (1 + formation * .15));
    grantXp(bonus, true);
    showToast(`RAPID CLEAR // +${bonus} XP`);
    advanceAfterClear();
  }

  function angleDelta(from, to) {
    return ((to - from + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  }

  function acquireLock(angle, cone = .42, range = 1250, includeInterceptors = true) {
    let best = null;
    let bestScore = Infinity;
    for (const enemy of enemies) {
      if (enemy.dead || (!includeInterceptors && enemy.interceptor)) continue;
      const dx = enemy.x - player.x;
      const dy = enemy.y - player.y;
      const distance = Math.hypot(dx, dy);
      if (distance > range) continue;
      const delta = Math.abs(angleDelta(angle, Math.atan2(dy, dx)));
      const assistCone = enemy.interceptor ? Math.min(cone + .1, cone * 1.35) : cone;
      if (delta > assistCone) continue;
      const scoreValue = delta * 900 + distance * .18 - (enemy.interceptor ? 105 : enemy.boss ? 120 : enemy.major ? 45 : 0);
      if (scoreValue < bestScore) { best = enemy; bestScore = scoreValue; }
    }
    return best;
  }

  function acquireMissileLock(angle, cone = .2, range = 680) {
    let best = null;
    let bestScore = Infinity;
    for (const missile of enemyRockets) {
      if (missile.dead) continue;
      const dx = missile.x - player.x;
      const dy = missile.y - player.y;
      const distance = Math.hypot(dx, dy);
      if (distance > range) continue;
      const delta = Math.abs(angleDelta(angle, Math.atan2(dy, dx)));
      if (delta > cone) continue;
      const scoreValue = delta * 820 + distance * .22;
      if (scoreValue < bestScore) { best = missile; bestScore = scoreValue; }
    }
    return best;
  }

  function isPointerAiming() {
    return input.pointerDown || performance.now() - input.lastPointerAt < 900;
  }

  function nearestEnemy(range = 720) {
    let nearest = null;
    let best = range * range;
    for (const enemy of enemies) {
      if (enemy.dead) continue;
      const d = distanceSq(player, enemy);
      if (d < best) { best = d; nearest = enemy; }
    }
    return nearest;
  }

  function updateTargetLock() {
    const aimAngle = isPointerAiming()
      ? Math.atan2(input.aimWorldY - player.y, input.aimWorldX - player.x)
      : player.angle;
    lockedTarget = acquireLock(aimAngle, .5, 1350, false);
    ui.lockReadout.classList.toggle('active', Boolean(lockedTarget));
  }

  function fireBlaster(angle) {
    if (player.shotTimer > 0) return;
    player.shotTimer = 1 / player.fireRate;
    const assistTarget = acquireMissileLock(angle) || acquireLock(angle, .22, 880);
    if (assistTarget) {
      const targetAngle = Math.atan2(assistTarget.y - player.y, assistTarget.x - player.x);
      angle += angleDelta(angle, targetAngle) * .72;
    }
    const spread = player.multiShot === 1 ? [0] : player.multiShot === 2 ? [-.028, .028] : [-.052, 0, .052];
    spread.forEach((offset) => {
      const shotAngle = angle + offset;
      bullets.push({
        x: player.x + Math.cos(shotAngle) * 23,
        y: player.y + Math.sin(shotAngle) * 23,
        vx: Math.cos(shotAngle) * player.projectileSpeed + player.vx * .28,
        vy: Math.sin(shotAngle) * player.projectileSpeed + player.vy * .28,
        radius: 3.4,
        damage: player.damage,
        target: assistTarget,
        turnRate: assistTarget?.interceptor ? 4.2 : 2.1,
        source: 'player',
        life: 1.15,
        dead: false,
      });
    });
    if (tutorialMode && tutorialIndex === 1) advanceTutorial();
    audio.tone(340, .045, 'square', .035, 180);
  }

  function beginRocketCharge() {
    if (mode !== 'playing' || player.rocketCooldown > 0 || player.rocketCharge > 0) return;
    player.rocketCharge = .62;
    player.rocketTarget = lockedTarget && !lockedTarget.dead ? lockedTarget : null;
    showToast(player.rocketTarget ? `LOCK CONFIRMED // ${ENEMY_TYPES[player.rocketTarget.type].name}` : 'HEAVY ROCKET CHARGING // NO LOCK');
    audio.tone(96, .55, 'sawtooth', .05, 260);
  }

  function launchRocket() {
    const target = player.rocketTarget && !player.rocketTarget.dead ? player.rocketTarget : null;
    const angle = target ? Math.atan2(target.y - player.y, target.x - player.x) : player.angle;
    rockets.push({
      x: player.x + Math.cos(angle) * 27,
      y: player.y + Math.sin(angle) * 27,
      vx: Math.cos(angle) * 565,
      vy: Math.sin(angle) * 565,
      angle,
      radius: 8,
      damage: player.rocketDamage,
      life: 2.8,
      speed: 610,
      target,
      turnRate: 3.7,
      dead: false,
    });
    player.rocketTarget = null;
    player.rocketCooldown = player.rocketMax;
    if (tutorialMode && tutorialIndex === 4) advanceTutorial();
    camera.shake = Math.max(camera.shake, 6);
  }

  function triggerBoost() {
    if (mode !== 'playing' || player.boostCooldown > 0) return;
    let dx = 0;
    let dy = 0;
    if (input.keys.has('KeyA')) dx -= 1;
    if (input.keys.has('KeyD')) dx += 1;
    if (input.keys.has('KeyW')) dy -= 1;
    if (input.keys.has('KeyS')) dy += 1;
    if (!dx && !dy) { dx = Math.cos(player.angle); dy = Math.sin(player.angle); }
    const length = Math.hypot(dx, dy) || 1;
    dx /= length;
    dy /= length;
    const startX = player.x;
    const startY = player.y;
    const jumpDistance = 410;
    player.x = clamp(player.x + dx * jumpDistance, 45, WORLD.width - 45);
    player.y = clamp(player.y + dy * jumpDistance, 45, WORLD.height - 45);
    player.vx = dx * player.speed * .46;
    player.vy = dy * player.speed * .46;
    player.jumpBrake = 1.35;
    player.jumpFlash = .42;
    player.boostCooldown = player.boostMax;
    player.invulnerable = .48;
    for (let i = 0; i < 34; i += 1) {
      const distance = rand(0, jumpDistance);
      addParticle(startX + dx * distance + rand(-12, 12), startY + dy * distance + rand(-12, 12), {
        vx: -dx * rand(80, 240) + rand(-70, 70),
        vy: -dy * rand(80, 240) + rand(-70, 70),
        color: i % 3 ? COLORS.cyan : '#ffffff',
        life: rand(.28, .72),
        size: rand(1, 3.8),
      });
    }
    camera.shake = Math.max(camera.shake, 7);
    audio.tone(70, .42, 'sawtooth', .08, 520);
    if (tutorialMode && tutorialIndex === 3) advanceTutorial();
  }

  function updateProjectiles(dt) {
    bullets.forEach((bullet) => {
      if (bullet.target && !bullet.target.dead) {
        const speed = Math.hypot(bullet.vx, bullet.vy);
        const current = Math.atan2(bullet.vy, bullet.vx);
        const desired = Math.atan2(bullet.target.y - bullet.y, bullet.target.x - bullet.x);
        const next = current + clamp(angleDelta(current, desired), -bullet.turnRate * dt, bullet.turnRate * dt);
        bullet.vx = Math.cos(next) * speed;
        bullet.vy = Math.sin(next) * speed;
      }
      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;
      bullet.life -= dt;
      if (bullet.life <= 0) bullet.dead = true;
    });
    rockets.forEach((rocket) => {
      if (rocket.target && !rocket.target.dead) {
        const desired = Math.atan2(rocket.target.y - rocket.y, rocket.target.x - rocket.x);
        rocket.angle += clamp(angleDelta(rocket.angle, desired), -rocket.turnRate * dt, rocket.turnRate * dt);
        rocket.vx = Math.cos(rocket.angle) * rocket.speed;
        rocket.vy = Math.sin(rocket.angle) * rocket.speed;
      }
      rocket.x += rocket.vx * dt;
      rocket.y += rocket.vy * dt;
      rocket.angle = Math.atan2(rocket.vy, rocket.vx);
      rocket.life -= dt;
      if (rocket.life <= 0) {
        explodeRocket(rocket.x, rocket.y, rocket.damage * .65);
        rocket.dead = true;
      } else if (Math.random() < .85) {
        addParticle(rocket.x - Math.cos(rocket.angle) * 10, rocket.y - Math.sin(rocket.angle) * 10, {
          vx: -rocket.vx * .17 + rand(-30, 30), vy: -rocket.vy * .17 + rand(-30, 30),
          color: Math.random() < .55 ? COLORS.amber : COLORS.coral, life: rand(.16, .36), size: rand(2, 4),
        });
      }
    });
    enemyRockets.forEach((rocket) => {
      const desired = Math.atan2(player.y - rocket.y, player.x - rocket.x);
      let delta = ((desired - rocket.angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      rocket.angle += clamp(delta, -1.4 * dt, 1.4 * dt);
      rocket.vx = Math.cos(rocket.angle) * rocket.speed;
      rocket.vy = Math.sin(rocket.angle) * rocket.speed;
      rocket.x += rocket.vx * dt;
      rocket.y += rocket.vy * dt;
      rocket.life -= dt;
      rocket.hitFlash = Math.max(0, rocket.hitFlash - dt);
      if (rocket.life <= 0) rocket.dead = true;
      if (Math.random() < .55) addParticle(rocket.x, rocket.y, { vx: -rocket.vx * .1, vy: -rocket.vy * .1, color: COLORS.coral, life: .25, size: 2 });
    });
    bullets = bullets.filter((item) => !item.dead);
    rockets = rockets.filter((item) => !item.dead);
    enemyRockets = enemyRockets.filter((item) => !item.dead);
  }

  function updateEnemies(dt) {
    enemies.forEach((enemy) => {
      const pressureMultiplier = 1 + staticPressure * .22;
      enemy.progress += enemy.speed * dt * pressureMultiplier;
      enemy.wobble += dt * (enemy.type === 'striker' ? 3.3 : 1.7);
      enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
      enemy.shieldHitTimer = Math.max(0, enemy.shieldHitTimer - dt);
      const point = getPathPoint(enemy.progress, enemy.pathId);
      const sway = enemy.lane + Math.sin(enemy.wobble) * (enemy.boss ? 22 : 13);
      enemy.x = point.x + point.nx * sway;
      enemy.y = point.y + point.ny * sway;
      enemy.angle = point.angle + Math.cos(enemy.wobble * .8) * .08;

      if (enemy.major) {
        enemy.rocketTimer -= dt * (1 + staticPressure * .65);
        const playerDistance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (enemy.rocketTimer <= 0 && playerDistance < (enemy.boss ? 1200 : 820)) {
          fireEnemyRocket(enemy);
          if (enemy.bossSkill === 'titan') {
            fireEnemyRocket(enemy, -.22);
            fireEnemyRocket(enemy, .22);
          }
          enemy.rocketTimer = enemy.boss ? rand(1.15, 1.8) : rand(2.4, 3.8);
        }
      }

      if (enemy.carrier && !enemy.dead) {
        enemy.spawnTimer -= dt;
        if (enemy.spawnTimer <= 0 && enemies.length < 90) {
          const count = enemy.boss ? 4 : 2;
          for (let i = 0; i < count; i += 1) {
            spawnEnemy({ type: 'interceptor', pathId: enemy.pathId, entryProgress: Math.max(0, enemy.progress - 28 - i * 12) }, enemy);
          }
          enemy.spawnTimer = enemy.bossSkill === 'swarm' ? rand(2.82, 4) : rand(4.1, 5.8);
          burst(enemy.x, enemy.y, enemy.color, 10, 110);
          showToast(enemy.boss ? 'CARRIER WING DEPLOYED' : 'BROOD CARRIER LAUNCHED INTERCEPTORS');
        }
      }

      if (enemy.progress >= enemy.pathLength - 18) {
        enemy.dead = true;
        gateShields -= enemy.boss ? Math.max(1, gateShields) : 1;
        camera.shake = Math.max(camera.shake, 16);
        burst(PORTAL.x, PORTAL.y, COLORS.coral, 30, 320);
        audio.tone(58, .5, 'sawtooth', .11, -28);
        showToast(gateShields > 0 ? `GATE HIT // ${gateShields} SHIELD${gateShields === 1 ? '' : 'S'} REMAIN` : 'EARTH GATE BREACHED');
        if (gateShields <= 0) finishRun(false, 'gate');
      }
    });
    enemies = enemies.filter((enemy) => !enemy.dead);
  }

  function fireEnemyRocket(enemy, offset = 0) {
    const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x) + offset;
    const hull = enemy.boss ? 52 : 30;
    enemyRockets.push({
      x: enemy.x + Math.cos(angle) * enemy.radius,
      y: enemy.y + Math.sin(angle) * enemy.radius,
      angle,
      speed: enemy.boss ? 260 : 220,
      damage: enemy.boss ? 26 : 18,
      radius: enemy.boss ? 9 : 7,
      hp: hull,
      maxHp: hull,
      hitFlash: 0,
      life: 5.5,
      dead: false,
    });
    audio.tone(110, .11, 'sawtooth', .035, -50);
  }

  function stationBuildCost() {
    return 120 + stations.length * 35;
  }

  function nearestStation(range = Infinity) {
    let nearest = null;
    let best = range * range;
    for (const station of stations) {
      const d = distanceSq(station, player);
      if (d < best) { best = d; nearest = station; }
    }
    return nearest;
  }

  function useStation() {
    if (mode !== 'playing') return;
    const docked = nearestStation(110);
    if (docked) {
      if (Math.hypot(player.vx, player.vy) > 150) { showToast('SLOW DOWN TO DOCK'); return; }
      if (docked.level >= 4) { showToast('STATION AT MAXIMUM POWER'); return; }
      const cost = 90 + docked.level * 80;
      if (player.credits < cost) { showToast(`UPGRADE REQUIRES ${cost} SALVAGE CREDITS`); return; }
      player.credits -= cost;
      docked.level += 1;
      docked.range += 72;
      docked.damage *= 1.42;
      docked.fireRate *= .86;
      player.hp = Math.min(player.maxHp, player.hp + 12);
      burst(docked.x, docked.y, COLORS.amber, 24, 180);
      showToast(`STATION UPGRADED // MK ${docked.level}`);
      audio.tone(420, .36, 'sine', .07, 280);
      return;
    }
    if (stations.length >= 3) { showToast('STATION LIMIT REACHED'); return; }
    const cost = stationBuildCost();
    if (player.credits < cost) { showToast(`NEED ${cost} SALVAGE CREDITS`); return; }
    player.credits -= cost;
    stations.push({ x: player.x, y: player.y, radius: 30, level: 1, range: 470, damage: 17, fireRate: .8, fireTimer: .25, angle: 0, target: null });
    burst(player.x, player.y, COLORS.amber, 28, 210);
    showToast('FRIENDLY DEFENSE STATION DEPLOYED');
    audio.tone(230, .5, 'triangle', .075, 310);
  }

  function updateStations(dt) {
    for (const station of stations) {
      station.fireTimer -= dt;
      station.target = null;
      let bestScore = Infinity;
      for (const enemy of enemies) {
        const d = distanceSq(station, enemy);
        if (enemy.dead || d >= station.range ** 2) continue;
        const targetScore = d * (enemy.interceptor ? .45 : 1);
        if (targetScore < bestScore) { bestScore = targetScore; station.target = enemy; }
      }
      if (station.target) {
        station.angle = Math.atan2(station.target.y - station.y, station.target.x - station.x);
        if (station.fireTimer <= 0) {
          station.fireTimer = station.fireRate;
          const interceptorAssist = station.target.interceptor;
          const lightShip = station.target.radius <= 14;
          const shotSpeed = interceptorAssist ? 790 : 720;
          const damageMultiplier = interceptorAssist ? 2.15 : lightShip ? 1.8 : 1;
          bullets.push({
            x: station.x + Math.cos(station.angle) * 28, y: station.y + Math.sin(station.angle) * 28,
            vx: Math.cos(station.angle) * shotSpeed, vy: Math.sin(station.angle) * shotSpeed, radius: 3.8,
            damage: station.damage * damageMultiplier, target: station.target, turnRate: interceptorAssist ? 6.2 : 2.3, source: 'station', life: 1.5, dead: false,
          });
          audio.tone(250 + station.level * 40, .045, 'square', .018, 90);
        }
      }
    }
  }

  function updateResources(dt) {
    resources.forEach((rock) => { rock.rotation += rock.spin * dt; rock.collisionTimer = Math.max(0, rock.collisionTimer - dt); });
    resources = resources.filter((rock) => !rock.dead);
  }

  function updatePickups(dt) {
    pickups.forEach((item) => {
      item.life -= dt;
      item.pulse += dt * 3;
      if (item.life <= 0) item.dead = true;
    });
    pickups = pickups.filter((item) => !item.dead);
  }

  function updateParticles(dt) {
    particles.forEach((particle) => {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vx *= Math.pow(.18, dt);
      particle.vy *= Math.pow(.18, dt);
      particle.life -= dt;
    });
    floaters.forEach((floater) => { floater.y -= 26 * dt; floater.life -= dt; });
    particles = particles.filter((particle) => particle.life > 0);
    floaters = floaters.filter((floater) => floater.life > 0);
  }

  function handleCollisions() {
    for (const bullet of bullets) {
      if (bullet.dead) continue;
      for (const missile of enemyRockets) {
        if (missile.dead) continue;
        const radius = bullet.radius + missile.radius + 2;
        if (distanceSq(bullet, missile) <= radius * radius) {
          bullet.dead = true;
          damageEnemyRocket(missile, bullet.damage, bullet.x, bullet.y);
          break;
        }
      }
      if (bullet.dead) continue;
      for (const enemy of enemies) {
        if (enemy.dead) continue;
        const radius = bullet.radius + enemy.radius;
        if (distanceSq(bullet, enemy) <= radius * radius) {
          bullet.dead = true;
          damageEnemy(enemy, bullet.damage, bullet.x, bullet.y);
          break;
        }
      }
      if (bullet.dead) continue;
      for (const rock of resources) {
        const radius = bullet.radius + rock.radius;
        if (distanceSq(bullet, rock) <= radius * radius) {
          bullet.dead = true;
          damageResource(rock, bullet.damage, bullet.x, bullet.y);
          break;
        }
      }
    }

    for (const rocket of rockets) {
      if (rocket.dead) continue;
      for (const enemy of enemies) {
        if (enemy.dead || !enemy.interceptor) continue;
        if (distanceSq(rocket, enemy) <= (rocket.radius + enemy.radius) ** 2) {
          damageEnemy(enemy, Math.max(enemy.hp, rocket.damage), rocket.x, rocket.y, true);
        }
      }
      const target = enemies.find((enemy) => !enemy.dead && !enemy.interceptor
          && distanceSq(rocket, enemy) <= (rocket.radius + enemy.radius) ** 2)
        || enemyRockets.find((missile) => !missile.dead && distanceSq(rocket, missile) <= (rocket.radius + missile.radius) ** 2)
        || resources.find((rock) => distanceSq(rocket, rock) <= (rocket.radius + rock.radius) ** 2);
      if (target) {
        rocket.dead = true;
        explodeRocket(rocket.x, rocket.y, rocket.damage);
      }
    }

    for (const rocket of enemyRockets) {
      if (rocket.dead || player.invulnerable > 0) continue;
      if (distanceSq(rocket, player) <= (rocket.radius + player.radius) ** 2) {
        rocket.dead = true;
        damagePlayer(rocket.damage);
        burst(rocket.x, rocket.y, COLORS.coral, 12, 190);
      }
    }

    for (const enemy of enemies) {
      if (player.invulnerable <= 0 && distanceSq(enemy, player) <= (enemy.radius + player.radius) ** 2) {
        damagePlayer(enemy.boss ? 35 : enemy.major ? 24 : 12);
        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        player.vx += Math.cos(angle) * 330;
        player.vy += Math.sin(angle) * 330;
        enemy.progress = Math.max(0, enemy.progress - 30);
      }
    }

    for (const rock of resources) {
      if (rock.collisionTimer <= 0 && player.invulnerable <= 0 && distanceSq(rock, player) <= (rock.radius + player.radius) ** 2) {
        rock.collisionTimer = .8;
        damagePlayer(Math.max(6, Math.round(rock.radius * .32)));
        const angle = Math.atan2(player.y - rock.y, player.x - rock.x);
        player.vx += Math.cos(angle) * (260 + rock.radius * 4);
        player.vy += Math.sin(angle) * (260 + rock.radius * 4);
        addFloater(rock.x, rock.y - rock.radius, 'COLLISION', COLORS.coral);
      }
    }

    for (const item of pickups) {
      if (distanceSq(item, player) <= (item.radius + player.radius + 5) ** 2) collectPickup(item);
    }
  }

  function damageEnemy(enemy, amount, x, y, heavy = false) {
    if (enemy.shieldHp > 0) {
      enemy.shieldHitTimer = .16;
      if (!heavy) {
        if (enemy.shieldHitTimer <= .17 && Math.random() < .18) addFloater(enemy.x, enemy.y - enemy.radius, 'SHIELDED', '#79a8ff');
        addParticle(x, y, { vx: rand(-60, 60), vy: rand(-60, 60), color: '#79a8ff', life: .34, size: 2.5 });
        audio.tone(780, .045, 'sine', .022, -100);
        return;
      }
      enemy.shieldHp -= amount * 1.75;
      burst(x, y, '#79a8ff', 14, 160);
      if (enemy.shieldHp > 0) return;
      amount *= .72;
      showToast(`${ENEMY_TYPES[enemy.type].name} // SHIELD COLLAPSED`);
      addFloater(enemy.x, enemy.y - enemy.radius, 'SHIELD BROKEN', COLORS.amber);
    }
    enemy.hp -= amount;
    enemy.hitFlash = .08;
    if (enemy.interceptor) addFloater(enemy.x, enemy.y - enemy.radius, `${Math.max(1, Math.round(enemy.hp))} HULL`, enemy.color);
    addParticle(x, y, { vx: rand(-80, 80), vy: rand(-80, 80), color: enemy.color, life: .28, size: 2.2 });
    if (enemy.hp <= 0 && !enemy.dead) {
      enemy.dead = true;
      kills += 1;
      score += Math.round(enemy.score * (1 + wave * .05 + currentLevel * .18));
      grantXp(enemy.xp);
      burst(enemy.x, enemy.y, enemy.color, enemy.boss ? 60 : enemy.major ? 30 : 14, enemy.boss ? 520 : 240);
      addFloater(enemy.x, enemy.y - enemy.radius, `+${enemy.score}`, enemy.boss ? COLORS.amber : COLORS.cyan);
      if (enemy.interceptor) showToast('CARRIER INTERCEPTOR DESTROYED');
      camera.shake = Math.max(camera.shake, enemy.boss ? 22 : enemy.major ? 9 : 3.5);
      audio.tone(enemy.boss ? 48 : enemy.major ? 72 : 130, enemy.boss ? .75 : .16, 'sawtooth', enemy.boss ? .14 : .05, -35);
      if (enemy.major && Math.random() < .28) spawnPickupAt('repair', enemy.x, enemy.y);
    } else if (enemy.bossSkill === 'titan') {
      const ratio = enemy.hp / enemy.maxHp;
      enemy.shieldPhase ??= 0;
      const nextPhase = ratio < .34 ? 2 : ratio < .67 ? 1 : 0;
      if (nextPhase > enemy.shieldPhase) {
        enemy.shieldPhase = nextPhase;
        enemy.shieldHp = enemy.maxShield * .68;
        showToast(`AEGIS TITAN // PHASE ${nextPhase + 1} SHIELD ONLINE`);
        burst(enemy.x, enemy.y, '#79a8ff', 30, 250);
      }
    }
  }

  function damageEnemyRocket(rocket, amount, x, y) {
    if (rocket.dead) return;
    rocket.hp -= amount;
    rocket.hitFlash = .09;
    addParticle(x, y, { vx: rand(-90, 90), vy: rand(-90, 90), color: COLORS.coral, life: .25, size: 2.2 });
    if (rocket.hp <= 0) {
      rocket.dead = true;
      burst(rocket.x, rocket.y, COLORS.coral, 11, 190);
      addFloater(rocket.x, rocket.y - 13, 'MISSILE INTERCEPTED', COLORS.cyan);
      camera.shake = Math.max(camera.shake, 2.5);
      audio.tone(190, .1, 'square', .035, -70);
    } else {
      addFloater(rocket.x, rocket.y - 11, `${Math.ceil(rocket.hp)} HULL`, COLORS.coral);
      audio.tone(520, .035, 'square', .018, -80);
    }
  }

  function damageResource(rock, amount, x, y) {
    rock.hp -= amount;
    addParticle(x, y, { vx: rand(-65, 65), vy: rand(-65, 65), color: rock.crystal ? COLORS.purple : COLORS.cyan, life: .34, size: 2 });
    if (rock.hp <= 0 && !rock.dead) {
      rock.dead = true;
      const xp = Math.round(rock.xpValue * player.salvage);
      const credits = rock.creditValue;
      grantXp(xp);
      player.credits += credits;
      score += Math.round(rock.radius * (rock.crystal ? 6 : 3));
      burst(rock.x, rock.y, rock.crystal ? COLORS.purple : COLORS.cyan, 16, 170);
      addFloater(rock.x, rock.y - 20, `+${xp} XP  +${credits} ◈`, rock.crystal ? COLORS.purple : COLORS.cyan);
      audio.tone(520, .12, 'triangle', .04, 220);
      if (tutorialMode && tutorialIndex === 2) advanceTutorial();
    }
  }

  function explodeRocket(x, y, damage) {
    const radius = 128;
    for (const enemy of enemies) {
      const distance = Math.hypot(enemy.x - x, enemy.y - y);
      if (distance < radius + enemy.radius) damageEnemy(enemy, damage * (1 - distance / (radius * 1.7)), enemy.x, enemy.y, true);
    }
    for (const rock of resources) {
      const distance = Math.hypot(rock.x - x, rock.y - y);
      if (distance < radius + rock.radius) damageResource(rock, damage * .7, rock.x, rock.y);
    }
    for (const missile of enemyRockets) {
      if (missile.dead) continue;
      const distance = Math.hypot(missile.x - x, missile.y - y);
      if (distance < radius + missile.radius) damageEnemyRocket(missile, damage, missile.x, missile.y);
    }
    burst(x, y, COLORS.amber, 35, 390);
    camera.shake = Math.max(camera.shake, 14);
    audio.tone(62, .34, 'sawtooth', .12, -30);
  }

  function damagePlayer(amount) {
    if (player.invulnerable > 0 || mode !== 'playing') return;
    player.hp = Math.max(0, player.hp - amount);
    player.invulnerable = .5;
    camera.shake = Math.max(camera.shake, 12);
    burst(player.x, player.y, COLORS.coral, 14, 240);
    addFloater(player.x, player.y - 28, `-${Math.round(amount)} HULL`, COLORS.coral);
    audio.tone(94, .28, 'sawtooth', .09, -54);
    if (player.hp <= 0) finishRun(false, 'ship');
  }

  function collectPickup(item) {
    item.dead = true;
    if (item.kind === 'repair') {
      const healed = Math.min(36, player.maxHp - player.hp);
      player.hp += healed;
      showToast(healed > 0 ? `REPAIR FIELD // +${Math.round(healed)} HULL` : 'HULL ALREADY STABLE');
      addFloater(item.x, item.y, `+${Math.round(healed)} HP`, COLORS.cyan);
    } else {
      gateShields = Math.min(5, gateShields + 1);
      showToast('AEGIS CORE RECOVERED // GATE +1');
      addFloater(item.x, item.y, '+1 GATE SHIELD', COLORS.amber);
    }
    burst(item.x, item.y, item.kind === 'repair' ? COLORS.cyan : COLORS.amber, 20, 170);
    audio.tone(item.kind === 'repair' ? 660 : 420, .35, 'sine', .065, 240);
  }

  function spawnPickupAt(kind, x, y) {
    pickups.push({ kind, x, y, radius: kind === 'shield' ? 20 : 17, life: 22, pulse: 0, dead: false });
  }

  function grantXp(amount, deferUpgrade = false) {
    player.xp += amount;
    while (player.xp >= player.xpNext) {
      player.xp -= player.xpNext;
      player.level += 1;
      player.xpNext = Math.round(player.xpNext * 1.32 + 16);
      pendingLevelUps += 1;
    }
    if (pendingLevelUps > 0 && mode === 'playing' && !deferUpgrade) showUpgradeChoices();
  }

  const UPGRADES = [
    { id: 'damage', tier: 'damageTier', icon: '◆', name: 'Overcharged Bolts', description: 'Blaster damage increases by 24%.', detail: 'DAMAGE +24%', apply: () => { player.damage *= 1.24; player.damageTier += 1; } },
    { id: 'rate', tier: 'rateTier', icon: '≋', name: 'Flux Repeater', description: 'Blaster cycles 20% faster.', detail: 'FIRE RATE +20%', apply: () => { player.fireRate *= 1.2; player.rateTier += 1; } },
    { id: 'speed', tier: 'speedTier', icon: '»', name: 'Vector Thrusters', description: 'Flight speed and acceleration improve.', detail: 'SPEED +14%', apply: () => { player.speed *= 1.14; player.acceleration *= 1.1; player.speedTier += 1; } },
    { id: 'hull', tier: 'hullTier', icon: '⬡', name: 'Reactive Plating', description: 'Increase maximum hull and repair damage.', detail: 'MAX HULL +25', apply: () => { player.maxHp += 25; player.hp = Math.min(player.maxHp, player.hp + 35); player.hullTier += 1; } },
    { id: 'rocket', tier: 'rocketTier', icon: '▲', name: 'Siege Warhead', description: 'Heavy rockets deal more blast damage.', detail: 'ROCKET +32%', apply: () => { player.rocketDamage *= 1.32; player.rocketTier += 1; } },
    { id: 'cooling', tier: 'coolingTier', icon: '❄', name: 'Cryo Manifold', description: 'Rocket and void jump systems reload faster.', detail: 'COOLDOWNS -16%', apply: () => { player.rocketMax *= .84; player.boostMax *= .84; player.coolingTier += 1; } },
    { id: 'salvage', icon: 'XP', name: 'Salvage Matrix', description: 'Void ore yields more experience.', detail: 'RESOURCE XP +28%', apply: () => { player.salvage *= 1.28; } },
    { id: 'multi', icon: 'III', name: 'Splitfire Array', description: 'Add a tightly grouped blaster shot.', detail: 'MAX 3 SHOTS', apply: () => { player.multiShot = Math.min(3, player.multiShot + 1); } },
    { id: 'gate', icon: 'AEG', name: 'Gate Capacitor', description: 'Send a recovered charge to Earth.', detail: 'GATE SHIELD +1', apply: () => { gateShields = Math.min(5, gateShields + 1); } },
  ];

  function showUpgradeChoices() {
    mode = 'upgrade';
    ui.crosshair.style.opacity = '0';
    ui.lockReadout.classList.remove('active');
    const pool = [...UPGRADES].filter((upgrade) => (!upgrade.tier || player[upgrade.tier] < 7) && (upgrade.id !== 'multi' || player.multiShot < 3));
    const choices = [];
    while (choices.length < 3 && pool.length) choices.push(pool.splice((Math.random() * pool.length) | 0, 1)[0]);
    ui.upgradeChoices.replaceChildren();
    choices.forEach((upgrade, index) => {
      const button = document.createElement('button');
      button.className = 'upgrade-choice';
      button.type = 'button';
      button.innerHTML = `<span class="upgrade-icon">${upgrade.icon}</span><strong>${upgrade.name}</strong><p>${upgrade.description}</p><small>${index + 1} // ${upgrade.detail}</small>`;
      button.addEventListener('click', () => selectUpgrade(upgrade));
      ui.upgradeChoices.append(button);
    });
    ui.upgradeOverlay.classList.add('active');
    audio.tone(330, .35, 'sine', .06, 330);
  }

  function selectUpgrade(upgrade) {
    upgrade.apply();
    pendingLevelUps -= 1;
    ui.upgradeOverlay.classList.remove('active');
    showToast(`${upgrade.name.toUpperCase()} INSTALLED`);
    if (pendingLevelUps > 0) {
      setTimeout(showUpgradeChoices, 80);
    } else {
      mode = 'playing';
      ui.crosshair.style.opacity = '1';
    }
  }

  function updatePortalThreat(dt) {
    threatWarningCooldown = Math.max(0, threatWarningCooldown - dt);
    let closestRatio = 1;
    for (const enemy of enemies) closestRatio = Math.min(closestRatio, 1 - enemy.progress / enemy.pathLength);
    const threatened = closestRatio < .17;
    ui.portalWarning.classList.toggle('active', threatened);
    if (threatened && threatWarningCooldown <= 0) {
      threatWarningCooldown = 3.2;
      audio.tone(880, .1, 'square', .045, -260);
    }
  }

  function completeLevel() {
    ui.portalWarning.classList.remove('active');
    lockedTarget = null;
    ui.lockReadout.classList.remove('active');
    if (currentLevel >= LEVELS.length - 1) {
      campaignState.highestUnlocked = LEVELS.length - 1;
      campaignState.completedCampaigns += 1;
      saveCampaignState();
      finishRun(true);
      return;
    }
    const nextLevel = currentLevel + 1;
    player = resetPlayer();
    gateShields = 3;
    pendingLevelUps = 0;
    campaignState.highestUnlocked = Math.max(campaignState.highestUnlocked, nextLevel);
    campaignState.checkpoints[nextLevel] = captureProgress();
    saveCampaignState();
    mode = 'sector';
    ui.crosshair.style.opacity = '0';
    ui.sectorTitle.textContent = LEVELS[currentLevel].name;
    ui.sectorCopy.textContent = LEVELS[currentLevel].next;
    ui.sectorOverlay.classList.add('active');
    audio.tone(220, .7, 'sine', .09, 440);
  }

  function enterNextSector() {
    ui.sectorOverlay.classList.remove('active');
    currentLevel += 1;
    activePaths = LEVELS[currentLevel].paths;
    wave = 0;
    formation = 0;
    formationsInStage = 1;
    spawnQueue = [];
    enemies = [];
    enemyRockets = [];
    bullets = [];
    rockets = [];
    stations = [];
    resources = [];
    pickups = [];
    player.x = 760;
    player.y = 1030;
    player.vx = 0;
    player.vy = 0;
    for (let i = 0; i < 9; i += 1) spawnResource(true);
    camera.x = clamp(player.x - screenWidth / 2, 0, WORLD.width - screenWidth);
    camera.y = clamp(player.y - screenHeight / 2, 0, WORLD.height - screenHeight);
    mode = 'playing';
    showToast(`${LEVELS[currentLevel].name} // MULTIPLE APPROACH VECTORS`);
    beginWave();
  }

  function finishRun(victory, reason = '') {
    if (runFinished) return;
    runFinished = true;
    lastRunLevel = currentLevel;
    mode = 'ended';
    highScore = isAdminPilot() ? 0 : Math.max(highScore, score);
    saveCampaignState();
    if (activePilot && !isAdminPilot() && window.VoidlineCloud) {
      window.VoidlineCloud.submitScore({ score, level: currentLevel + 1, stage: wave, kills })
        .catch((error) => console.warn('Voidline leaderboard submit:', error));
    }
    ui.crosshair.style.opacity = '0';
    ui.portalWarning.classList.remove('active');
    ui.lockReadout.classList.remove('active');
    ui.tutorialCard.classList.remove('active');
    ui.endKicker.textContent = victory ? 'CORRIDOR SECURED' : reason === 'ship' ? 'PILOT SIGNAL LOST' : 'EARTH DEFENSE OFFLINE';
    ui.endTitle.textContent = victory ? 'INVASION REPELLED' : reason === 'ship' ? 'YOUR SHIP WAS LOST' : 'THE GATE HAS FALLEN';
    ui.endCopy.textContent = victory
      ? 'The flagship is gone and the surviving fleet has broken formation. Earth holds.'
      : reason === 'ship'
        ? 'Your ship could not hold the line. The defense network is ready for another run.'
        : 'The invasion fleet breached the last defense corridor.';
    ui.finalScore.textContent = formatScore(score);
    ui.finalWave.textContent = `L${currentLevel + 1} · ${wave}`;
    ui.finalKills.textContent = String(kills);
    ui.endOverlay.classList.add('active');
    audio.tone(victory ? 220 : 55, .8, victory ? 'sine' : 'sawtooth', .1, victory ? 440 : -25);
  }

  const tutorialSteps = [
    { title: 'TAKE THE CONTROLS', text: 'Use W, A, S, and D to move through the sector.' },
    { title: 'TEST THE BLASTER', text: 'Press the Up Arrow to fire forward, or hold the left mouse button to aim and fire.' },
    { title: 'SALVAGE VOID ORE', text: 'Shoot the nearby ore cluster. Destroyed resources give XP for upgrades.' },
    { title: 'PUNCH THE VOID', text: 'Press Q or right-click to make a Void Jump. The drive recharges after every jump.' },
    { title: 'ARM THE WARHEAD', text: 'Press F. Heavy rockets charge briefly, then deal large blast damage.' },
    { title: 'DEFEND THE GATE', text: 'Enemies follow the glowing corridor. Stop them before the Earth Gate loses every shield.' },
  ];

  function updateTutorialCard() {
    const step = tutorialSteps[tutorialIndex];
    if (!step) return;
    ui.tutorialStep.textContent = `TRAINING // ${String(tutorialIndex + 1).padStart(2, '0')}`;
    ui.tutorialTitle.textContent = step.title;
    ui.tutorialText.textContent = step.text;
    ui.tutorialProgress.innerHTML = tutorialSteps.map((_, index) => `<i class="${index <= tutorialIndex ? 'done' : ''}"></i>`).join('');
  }

  function advanceTutorial() {
    if (!tutorialMode || tutorialIndex >= tutorialSteps.length - 1) return;
    tutorialIndex += 1;
    if (tutorialIndex === 2) {
      const trainingOre = resources[0];
      if (trainingOre) {
        trainingOre.x = clamp(player.x + Math.cos(player.angle) * 245, 90, WORLD.width - 90);
        trainingOre.y = clamp(player.y + Math.sin(player.angle) * 245, 90, WORLD.height - 90);
      }
    }
    tutorialDelay = tutorialIndex === tutorialSteps.length - 1 ? 5 : 0;
    updateTutorialCard();
    audio.tone(540, .18, 'sine', .045, 210);
  }

  function updateTutorial(dt) {
    if (!tutorialMode || tutorialIndex !== tutorialSteps.length - 1) return;
    tutorialDelay -= dt;
    if (tutorialDelay <= 0) {
      tutorialMode = false;
      ui.tutorialCard.classList.remove('active');
      showToast('TRAINING COMPLETE // GOOD HUNTING');
    }
  }

  function addParticle(x, y, options = {}) {
    if (particles.length > 520) return;
    particles.push({
      x, y,
      vx: options.vx ?? rand(-50, 50),
      vy: options.vy ?? rand(-50, 50),
      color: options.color ?? COLORS.cyan,
      life: options.life ?? .4,
      maxLife: options.life ?? .4,
      size: options.size ?? 2,
    });
  }

  function burst(x, y, color, count = 12, speed = 180) {
    for (let i = 0; i < count; i += 1) {
      const angle = rand(0, Math.PI * 2);
      const velocity = rand(speed * .2, speed);
      addParticle(x, y, { vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity, color, life: rand(.25, .78), size: rand(1.3, 4.4) });
    }
  }

  function addFloater(x, y, text, color) {
    floaters.push({ x, y, text, color, life: 1.05, maxLife: 1.05 });
  }

  function updateCamera(dt) {
    const leadX = player.vx * .28;
    const leadY = player.vy * .28;
    const targetX = clamp(player.x - screenWidth / 2 + leadX, 0, Math.max(0, WORLD.width - screenWidth));
    const targetY = clamp(player.y - screenHeight / 2 + leadY, 0, Math.max(0, WORLD.height - screenHeight));
    const smoothing = 1 - Math.pow(.0003, dt);
    camera.x = lerp(camera.x, targetX, smoothing);
    camera.y = lerp(camera.y, targetY, smoothing);
    camera.shake *= Math.pow(.015, dt);
    const shakeAmount = settings.shake ? camera.shake : 0;
    camera.shakeX = rand(-shakeAmount, shakeAmount);
    camera.shakeY = rand(-shakeAmount, shakeAmount);
  }

  function worldToScreen(x, y) {
    return { x: x - camera.x + camera.shakeX, y: y - camera.y + camera.shakeY };
  }

  function updateAimWorld() {
    input.aimWorldX = input.mouseX + camera.x - camera.shakeX;
    input.aimWorldY = input.mouseY + camera.y - camera.shakeY;
  }

  function isVisible(object, padding = 100) {
    const position = worldToScreen(object.x, object.y);
    return position.x > -padding && position.y > -padding && position.x < screenWidth + padding && position.y < screenHeight + padding;
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const background = ctx.createRadialGradient(screenWidth * .53, screenHeight * .45, 20, screenWidth * .5, screenHeight * .5, Math.max(screenWidth, screenHeight));
    background.addColorStop(0, '#0b2029');
    background.addColorStop(.52, '#061018');
    background.addColorStop(1, '#020509');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    drawBackground();
    drawWorld();
    drawScreenEffects();
    drawMinimap();
  }

  function drawBackground() {
    ctx.save();
    const parallaxX = camera.x * .2;
    const parallaxY = camera.y * .2;
    for (const star of stars) {
      let sx = (star.x - parallaxX * star.depth) % (WORLD.width + screenWidth);
      let sy = (star.y - parallaxY * star.depth) % (WORLD.height + screenHeight);
      if (sx < 0) sx += WORLD.width + screenWidth;
      if (sy < 0) sy += WORLD.height + screenHeight;
      if (sx > screenWidth || sy > screenHeight) continue;
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = star.size > 1.5 ? COLORS.cyanSoft : '#b8cdd0';
      ctx.fillRect(sx, sy, star.size, star.size);
    }
    ctx.globalAlpha = 1;

    const gridSize = 160;
    const gridX = -((camera.x * .34) % gridSize);
    const gridY = -((camera.y * .34) % gridSize);
    ctx.strokeStyle = 'rgba(93, 181, 182, .035)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = gridX; x < screenWidth; x += gridSize) { ctx.moveTo(x, 0); ctx.lineTo(x, screenHeight); }
    for (let y = gridY; y < screenHeight; y += gridSize) { ctx.moveTo(0, y); ctx.lineTo(screenWidth, y); }
    ctx.stroke();
    ctx.restore();
  }

  function drawWorld() {
    ctx.save();
    ctx.translate(-camera.x + camera.shakeX, -camera.y + camera.shakeY);
    drawCorridor();
    drawPortal();
    resources.forEach(drawResource);
    pickups.forEach(drawPickup);
    stations.forEach(drawStation);
    enemies.forEach(drawEnemy);
    drawTargetLock();
    bullets.forEach(drawBullet);
    rockets.forEach(drawRocket);
    enemyRockets.forEach(drawEnemyRocket);
    particles.forEach(drawParticle);
    drawPlayer();
    floaters.forEach(drawFloater);
    ctx.restore();
  }

  function tracePath(path) {
    const points = path.points;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i += 1) {
      const current = points[i];
      const next = points[i + 1];
      ctx.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
    }
    ctx.lineTo(PORTAL.x, PORTAL.y);
  }

  function drawCorridor() {
    ctx.save();
    for (const path of activePaths) {
      tracePath(path);
      ctx.strokeStyle = 'rgba(70, 219, 211, .045)';
      ctx.lineWidth = 130;
      ctx.stroke();
      tracePath(path);
      ctx.setLineDash([13, 22]);
      ctx.lineDashOffset = -gameClock * 28;
      ctx.strokeStyle = 'rgba(109, 247, 232, .23)';
      ctx.lineWidth = 2;
      ctx.stroke();
      tracePath(path);
      ctx.setLineDash([2, 72]);
      ctx.lineDashOffset = -gameClock * 42;
      ctx.strokeStyle = 'rgba(255, 179, 92, .45)';
      ctx.lineWidth = 7;
      ctx.stroke();
    }
    ctx.setLineDash([]);
    for (const wormhole of LEVELS[currentLevel].wormholes) drawWormhole(wormhole);
    ctx.restore();
  }

  function drawWormhole(wormhole) {
    ctx.save();
    ctx.translate(wormhole.x, wormhole.y);
    ctx.rotate(-elapsed * .7);
    for (let ring = 0; ring < 3; ring += 1) {
      ctx.strokeStyle = `rgba(168,140,255,${.7 - ring * .18})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([7 + ring * 3, 9]);
      ctx.beginPath(); ctx.ellipse(0, 0, 34 + ring * 11, 17 + ring * 5, ring * .4, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }

  function drawPortal() {
    if (!isVisible(PORTAL, 180)) return;
    ctx.save();
    ctx.translate(PORTAL.x, PORTAL.y);
    const pulse = 1 + Math.sin(elapsed * 2.2) * .025;
    ctx.scale(pulse, pulse);
    const glow = ctx.createRadialGradient(0, 0, 12, 0, 0, 132);
    glow.addColorStop(0, 'rgba(81,190,225,.3)');
    glow.addColorStop(.62, 'rgba(32,114,126,.1)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(0, 0, 132, 0, Math.PI * 2); ctx.fill();

    ctx.save();
    ctx.rotate(elapsed * .16);
    for (let ring = 0; ring < 3; ring += 1) {
      ctx.strokeStyle = ring === 1 ? 'rgba(255,179,92,.62)' : 'rgba(109,247,232,.62)';
      ctx.lineWidth = ring === 1 ? 2 : 1;
      ctx.setLineDash([ring === 1 ? 11 : 4, ring === 1 ? 12 : 18]);
      ctx.beginPath(); ctx.arc(0, 0, 60 + ring * 19, ring * .7, Math.PI * 2 + ring * .7); ctx.stroke();
      ctx.rotate(-elapsed * .35 * (ring + 1));
    }
    ctx.restore();
    ctx.setLineDash([]);

    ctx.save();
    ctx.beginPath(); ctx.arc(0, 0, 39, 0, Math.PI * 2); ctx.clip();
    const ocean = ctx.createRadialGradient(-13, -16, 3, 6, 8, 50);
    ocean.addColorStop(0, '#48c8dc');
    ocean.addColorStop(.48, '#157ea1');
    ocean.addColorStop(1, '#062d50');
    ctx.fillStyle = ocean;
    ctx.fillRect(-44, -44, 88, 88);
    ctx.fillStyle = '#62c58d';
    ctx.beginPath();
    ctx.moveTo(-32, -13); ctx.bezierCurveTo(-24, -26, -11, -28, -5, -18); ctx.bezierCurveTo(1, -10, -7, -4, -2, 3); ctx.bezierCurveTo(-10, 8, -21, 3, -29, 9); ctx.bezierCurveTo(-35, 2, -38, -6, -32, -13); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(12, -25); ctx.bezierCurveTo(27, -20, 37, -8, 31, 1); ctx.bezierCurveTo(25, 4, 22, 14, 11, 13); ctx.bezierCurveTo(5, 5, 5, -5, -2, -10); ctx.bezierCurveTo(3, -19, 6, -23, 12, -25); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(9, 20); ctx.bezierCurveTo(18, 15, 30, 20, 29, 29); ctx.bezierCurveTo(18, 36, 10, 32, 5, 27); ctx.closePath(); ctx.fill();
    const night = ctx.createLinearGradient(-34, -24, 37, 28);
    night.addColorStop(.35, 'rgba(1,8,20,0)');
    night.addColorStop(.72, 'rgba(1,8,20,.38)');
    night.addColorStop(1, 'rgba(1,8,20,.78)');
    ctx.fillStyle = night;
    ctx.fillRect(-44, -44, 88, 88);
    ctx.restore();

    ctx.strokeStyle = '#9cfff4';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 14;
    ctx.shadowColor = COLORS.cyan;
    ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI * 2); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = COLORS.pale;
    ctx.font = '700 10px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('EARTH GATE', 0, 57);
    ctx.restore();
  }

  function drawResource(rock) {
    if (!isVisible(rock, 70)) return;
    ctx.save();
    ctx.translate(rock.x, rock.y);
    ctx.rotate(rock.rotation);
    ctx.beginPath();
    for (let i = 0; i < rock.sides; i += 1) {
      const angle = (i / rock.sides) * Math.PI * 2;
      const radius = rock.radius * (.75 + ((i * 47) % 25) / 100);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = rock.crystal ? 'rgba(168,140,255,.18)' : 'rgba(73,133,137,.25)';
    ctx.strokeStyle = rock.crystal ? COLORS.purple : 'rgba(125,205,201,.55)';
    ctx.lineWidth = rock.crystal ? 2 : 1;
    ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-rock.radius * .45, -rock.radius * .2); ctx.lineTo(rock.radius * .2, rock.radius * .34); ctx.lineTo(rock.radius * .5, -rock.radius * .42); ctx.stroke();
    ctx.restore();
    if (rock.hp < rock.maxHp) drawHealthBar(rock.x, rock.y - rock.radius - 10, 42, rock.hp / rock.maxHp, rock.crystal ? COLORS.purple : COLORS.cyan);
  }

  function drawPickup(item) {
    if (!isVisible(item, 60)) return;
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(elapsed * .55);
    const scale = 1 + Math.sin(item.pulse) * .08;
    ctx.scale(scale, scale);
    ctx.shadowBlur = 18;
    ctx.shadowColor = item.kind === 'repair' ? COLORS.cyan : COLORS.amber;
    ctx.strokeStyle = item.kind === 'repair' ? COLORS.cyan : COLORS.amber;
    ctx.fillStyle = item.kind === 'repair' ? 'rgba(109,247,232,.12)' : 'rgba(255,179,92,.12)';
    ctx.lineWidth = 2;
    if (item.kind === 'repair') {
      ctx.beginPath();
      for (let i = 0; i < 8; i += 1) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = i % 2 ? 10 : 19;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.rotate(-elapsed * .55);
      ctx.beginPath(); ctx.moveTo(-7, 0); ctx.lineTo(7, 0); ctx.moveTo(0, -7); ctx.lineTo(0, 7); ctx.stroke();
    } else {
      ctx.beginPath();
      for (let i = 0; i < 6; i += 1) {
        const angle = -Math.PI / 2 + (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 19;
        const y = Math.sin(angle) * 19;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }

  function drawStation(station) {
    if (!isVisible(station, station.range)) return;
    ctx.save();
    ctx.translate(station.x, station.y);
    ctx.strokeStyle = 'rgba(255,179,92,.12)';
    ctx.setLineDash([7, 13]);
    ctx.beginPath(); ctx.arc(0, 0, station.range, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.rotate(elapsed * .22);
    ctx.strokeStyle = COLORS.amber;
    ctx.fillStyle = 'rgba(17,28,31,.95)';
    ctx.shadowBlur = 14;
    ctx.shadowColor = COLORS.amber;
    ctx.lineWidth = 2;
    for (let arm = 0; arm < 4; arm += 1) {
      ctx.rotate(Math.PI / 2);
      ctx.fillRect(12, -5, 23 + station.level * 2, 10);
      ctx.strokeRect(12, -5, 23 + station.level * 2, 10);
    }
    ctx.rotate(-elapsed * .22);
    ctx.fillStyle = '#09161d';
    ctx.beginPath(); ctx.arc(0, 0, 18 + station.level * 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.rotate(station.angle);
    ctx.fillStyle = COLORS.cyan;
    ctx.fillRect(4, -3, 26, 6);
    ctx.restore();
    ctx.save();
    ctx.fillStyle = COLORS.amber;
    ctx.font = '700 9px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`DEFENSE STATION // MK ${station.level}`, station.x, station.y - 46);
    ctx.restore();
  }

  function drawTargetLock() {
    if (!lockedTarget || lockedTarget.dead || mode !== 'playing') return;
    ctx.save();
    ctx.translate(lockedTarget.x, lockedTarget.y);
    ctx.rotate(elapsed * .9);
    ctx.strokeStyle = COLORS.amber;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 7]);
    ctx.beginPath(); ctx.arc(0, 0, lockedTarget.radius + 16, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    for (let corner = 0; corner < 4; corner += 1) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath(); ctx.moveTo(lockedTarget.radius + 10, -7); ctx.lineTo(lockedTarget.radius + 10, 7); ctx.stroke();
    }
    ctx.restore();
  }

  function traceEnemyHull(target, type, r) {
    target.beginPath();
    if (type === 'scout' || type === 'striker') {
      target.moveTo(r, 0); target.lineTo(-r * .7, -r * .72); target.lineTo(-r * .35, 0); target.lineTo(-r * .7, r * .72);
    } else if (type === 'interceptor') {
      target.moveTo(r, 0); target.lineTo(0, -r * .62); target.lineTo(-r, 0); target.lineTo(0, r * .62);
    } else if (type === 'raider') {
      target.moveTo(r, 0); target.lineTo(r * .2, -r * .7); target.lineTo(-r, -r * .48); target.lineTo(-r * .62, 0); target.lineTo(-r, r * .48); target.lineTo(r * .2, r * .7);
    } else if (type === 'carrier' || type === 'bossCarrier') {
      target.moveTo(r, 0); target.lineTo(r * .35, -r * .6); target.lineTo(-r * .45, -r); target.lineTo(-r, -r * .3); target.lineTo(-r * .72, 0); target.lineTo(-r, r * .3); target.lineTo(-r * .45, r); target.lineTo(r * .35, r * .6);
    } else if (type === 'sentinel' || type === 'bossTitan') {
      for (let side = 0; side < 6; side += 1) {
        const a = side / 6 * Math.PI * 2;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (!side) target.moveTo(px, py); else target.lineTo(px, py);
      }
    } else {
      target.moveTo(r, 0); target.lineTo(r * .52, -r * .7); target.lineTo(-r * .35, -r); target.lineTo(-r, -r * .45); target.lineTo(-r * .7, 0); target.lineTo(-r, r * .45); target.lineTo(-r * .35, r); target.lineTo(r * .52, r * .7);
    }
    target.closePath();
  }

  function drawIntelShip(type) {
    const preview = ui.intelShip;
    const previewCtx = preview.getContext('2d');
    const blueprint = ENEMY_TYPES[type];
    const r = clamp(blueprint.radius * 2.25, 45, 92);
    previewCtx.clearRect(0, 0, preview.width, preview.height);
    previewCtx.save();
    previewCtx.translate(preview.width / 2, preview.height / 2);
    previewCtx.shadowBlur = 26;
    previewCtx.shadowColor = blueprint.color;
    previewCtx.fillStyle = 'rgba(17,22,30,.98)';
    previewCtx.strokeStyle = blueprint.color;
    previewCtx.lineWidth = blueprint.major ? 4 : 3;
    traceEnemyHull(previewCtx, type, r);
    previewCtx.fill(); previewCtx.stroke();
    previewCtx.shadowBlur = 10;
    previewCtx.fillStyle = blueprint.color;
    previewCtx.globalAlpha = .82;
    previewCtx.fillRect(-r * .72, -r * .14, r * .62, r * .28);
    previewCtx.globalAlpha = 1;
    if (blueprint.major) {
      previewCtx.strokeStyle = 'rgba(255,255,255,.48)';
      previewCtx.beginPath(); previewCtx.arc(r * .12, 0, r * .33, 0, Math.PI * 2); previewCtx.stroke();
      previewCtx.fillStyle = blueprint.color;
      previewCtx.beginPath(); previewCtx.arc(r * .12, 0, r * .12, 0, Math.PI * 2); previewCtx.fill();
    }
    if (blueprint.shielded) {
      previewCtx.strokeStyle = 'rgba(121,168,255,.9)';
      previewCtx.setLineDash([10, 8]);
      previewCtx.lineWidth = 3;
      previewCtx.beginPath(); previewCtx.arc(0, 0, r + 17, 0, Math.PI * 2); previewCtx.stroke();
    }
    previewCtx.restore();
  }

  function drawEnemy(enemy) {
    if (!isVisible(enemy, enemy.radius + 80)) return;
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.rotate(enemy.angle);
    ctx.shadowBlur = enemy.major ? 14 : 6;
    ctx.shadowColor = enemy.color;
    ctx.strokeStyle = enemy.hitFlash > 0 ? '#ffffff' : enemy.color;
    ctx.fillStyle = enemy.hitFlash > 0 ? 'rgba(255,255,255,.55)' : 'rgba(17,22,30,.96)';
    ctx.lineWidth = enemy.boss ? 3 : enemy.major ? 2 : 1.4;
    const r = enemy.radius;
    traceEnemyHull(ctx, enemy.type, r);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = enemy.color;
    ctx.globalAlpha = .8;
    ctx.fillRect(-r * .72, -r * .14, r * .62, r * .28);
    if (enemy.major) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(255,255,255,.35)';
      ctx.beginPath(); ctx.arc(r * .12, 0, r * .33, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = enemy.color;
      ctx.beginPath(); ctx.arc(r * .12, 0, r * .12, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    if (enemy.shieldHp > 0) {
      const shieldBarY = enemy.y - enemy.radius - (enemy.boss ? 34 : 24);
      const shieldBarWidth = enemy.boss ? 110 : 72;
      drawHealthBar(enemy.x, shieldBarY, shieldBarWidth, enemy.shieldHp / enemy.maxShield, '#79a8ff');
      ctx.save();
      ctx.fillStyle = '#9acbff';
      ctx.font = '700 8px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`SHIELD ${Math.ceil(enemy.shieldHp)}`, enemy.x, shieldBarY - 4);
      ctx.restore();
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      ctx.rotate(-elapsed * .65);
      ctx.strokeStyle = enemy.shieldHitTimer > 0 ? '#ffffff' : 'rgba(121,168,255,.8)';
      ctx.lineWidth = enemy.shieldHitTimer > 0 ? 4 : 2;
      ctx.setLineDash([8, 6]);
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#79a8ff';
      ctx.beginPath(); ctx.arc(0, 0, enemy.radius + 10, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
    if (enemy.major || enemy.interceptor || enemy.hp < enemy.maxHp) drawHealthBar(enemy.x, enemy.y - enemy.radius - 13, enemy.boss ? 110 : enemy.major ? 72 : 38, enemy.hp / enemy.maxHp, enemy.color);
    if (enemy.boss) {
      ctx.save();
      ctx.fillStyle = COLORS.coral;
      ctx.font = '700 10px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(ENEMY_TYPES[enemy.type].name, enemy.x, enemy.y - enemy.radius - 25);
      ctx.restore();
    }
  }

  function drawPlayer() {
    if (!player) return;
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    if (player.invulnerable > 0 && Math.floor(player.invulnerable * 18) % 2 === 0) ctx.globalAlpha = .35;
    ctx.shadowBlur = 14;
    ctx.shadowColor = COLORS.cyan;
    ctx.fillStyle = '#081a22';
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(27, 0);
    ctx.lineTo(-17, -15);
    ctx.lineTo(-10, -4);
    ctx.lineTo(-22, 0);
    ctx.lineTo(-10, 4);
    ctx.lineTo(-17, 15);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = COLORS.amber;
    ctx.beginPath(); ctx.moveTo(11, 0); ctx.lineTo(-3, -5); ctx.lineTo(-3, 5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(109,247,232,.75)';
    ctx.beginPath(); ctx.moveTo(-13, -5); ctx.lineTo(-25, 0); ctx.lineTo(-13, 5); ctx.closePath(); ctx.fill();
    ctx.restore();

    if (player.jumpFlash > 0) {
      ctx.save();
      ctx.globalAlpha = clamp(player.jumpFlash / .42, 0, 1) * .72;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 8]);
      ctx.beginPath(); ctx.arc(player.x, player.y, 30 + (1 - player.jumpFlash / .42) * 28, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }

    if (player.rocketCharge > 0) {
      const progress = 1 - player.rocketCharge / .62;
      ctx.save();
      ctx.strokeStyle = COLORS.amber;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(player.x, player.y, 31, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress); ctx.stroke();
      ctx.restore();
    }
  }

  function drawBullet(bullet) {
    ctx.save();
    ctx.strokeStyle = COLORS.cyanSoft;
    ctx.lineWidth = 2.2;
    ctx.shadowBlur = 9;
    ctx.shadowColor = COLORS.cyan;
    ctx.beginPath(); ctx.moveTo(bullet.x, bullet.y); ctx.lineTo(bullet.x - bullet.vx * .018, bullet.y - bullet.vy * .018); ctx.stroke();
    ctx.restore();
  }

  function drawRocket(rocket) {
    ctx.save();
    ctx.translate(rocket.x, rocket.y);
    ctx.rotate(rocket.angle);
    ctx.fillStyle = COLORS.amber;
    ctx.shadowBlur = 13;
    ctx.shadowColor = COLORS.amber;
    ctx.beginPath(); ctx.moveTo(13, 0); ctx.lineTo(-8, -5); ctx.lineTo(-4, 0); ctx.lineTo(-8, 5); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function drawEnemyRocket(rocket) {
    ctx.save();
    ctx.translate(rocket.x, rocket.y);
    ctx.rotate(rocket.angle);
    ctx.fillStyle = rocket.hitFlash > 0 ? '#ffffff' : COLORS.coral;
    ctx.shadowBlur = 12;
    ctx.shadowColor = COLORS.coral;
    ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-7, -4); ctx.lineTo(-7, 4); ctx.closePath(); ctx.fill();
    ctx.restore();
    if (rocket.hp < rocket.maxHp) drawHealthBar(rocket.x, rocket.y - rocket.radius - 8, 22, rocket.hp / rocket.maxHp, COLORS.coral);
  }

  function drawParticle(particle) {
    ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
    ctx.globalAlpha = 1;
  }

  function drawFloater(floater) {
    ctx.save();
    ctx.globalAlpha = clamp(floater.life / floater.maxLife, 0, 1);
    ctx.fillStyle = floater.color;
    ctx.font = '700 11px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(floater.text, floater.x, floater.y);
    ctx.restore();
  }

  function drawHealthBar(x, y, width, ratio, color) {
    ctx.save();
    ctx.fillStyle = 'rgba(2,7,11,.82)';
    ctx.fillRect(x - width / 2, y, width, 4);
    ctx.fillStyle = color;
    ctx.fillRect(x - width / 2, y, width * clamp(ratio, 0, 1), 4);
    ctx.restore();
  }

  function drawScreenEffects() {
    if (!player || mode === 'menu') return;
    const lowHealth = 1 - player.hp / player.maxHp;
    if (lowHealth > .45) {
      const vignette = ctx.createRadialGradient(screenWidth / 2, screenHeight / 2, screenHeight * .25, screenWidth / 2, screenHeight / 2, screenWidth * .72);
      vignette.addColorStop(.4, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, `rgba(130, 11, 20, ${lowHealth * .34})`);
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, screenWidth, screenHeight);
    }
    if (announcementTimer > 0) {
      const alpha = clamp(Math.min(announcementTimer, 2.2 - announcementTimer) * 1.8, 0, 1);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.textAlign = 'center';
      const bossStage = wave === LEVELS[currentLevel].stages;
      ctx.fillStyle = bossStage ? COLORS.coral : COLORS.pale;
      ctx.font = `700 ${Math.min(48, screenWidth * .045)}px "Chakra Petch", sans-serif`;
      ctx.fillText(bossStage ? 'FINAL STAGE' : `STAGE ${String(wave).padStart(2, '0')}`, screenWidth / 2, screenHeight * .36);
      ctx.fillStyle = COLORS.muted || '#8ca9aa';
      ctx.font = '700 10px "Space Mono", monospace';
      ctx.fillText(bossStage ? 'COMMAND SHIP ENTERING THE CORRIDOR' : 'HOSTILE FORMATION DETECTED', screenWidth / 2, screenHeight * .36 + 26);
      ctx.restore();
    }
  }

  function drawMinimap() {
    const width = mapCanvas.width;
    const height = mapCanvas.height;
    const sx = width / WORLD.width;
    const sy = height / WORLD.height;
    mctx.clearRect(0, 0, width, height);
    mctx.fillStyle = 'rgba(2,9,14,.92)';
    mctx.fillRect(0, 0, width, height);
    mctx.strokeStyle = 'rgba(109,247,232,.18)';
    mctx.lineWidth = 1;
    for (const path of activePaths) {
      mctx.beginPath();
      mctx.moveTo(path.points[0].x * sx, path.points[0].y * sy);
      for (let i = 1; i < path.points.length; i += 1) mctx.lineTo(path.points[i].x * sx, path.points[i].y * sy);
      mctx.stroke();
    }
    for (const rock of resources) {
      mctx.fillStyle = rock.crystal ? 'rgba(168,140,255,.65)' : 'rgba(109,247,232,.25)';
      mctx.fillRect(rock.x * sx, rock.y * sy, 2, 2);
    }
    for (const enemy of enemies) {
      mctx.fillStyle = enemy.boss ? '#ffffff' : COLORS.coral;
      const size = enemy.boss ? 5 : enemy.major ? 4 : 2.5;
      mctx.fillRect(enemy.x * sx - size / 2, enemy.y * sy - size / 2, size, size);
    }
    for (const station of stations) {
      mctx.fillStyle = COLORS.amber;
      mctx.fillRect(station.x * sx - 2, station.y * sy - 2, 4, 4);
    }
    for (const wormhole of LEVELS[currentLevel].wormholes) {
      mctx.strokeStyle = COLORS.purple;
      mctx.beginPath(); mctx.arc(wormhole.x * sx, wormhole.y * sy, 3, 0, Math.PI * 2); mctx.stroke();
    }
    if (player) {
      mctx.fillStyle = COLORS.cyan;
      mctx.beginPath(); mctx.arc(player.x * sx, player.y * sy, 3.5, 0, Math.PI * 2); mctx.fill();
      mctx.strokeStyle = 'rgba(109,247,232,.35)';
      mctx.strokeRect(camera.x * sx, camera.y * sy, screenWidth * sx, screenHeight * sy);
    }
    mctx.fillStyle = COLORS.amber;
    mctx.beginPath(); mctx.arc(PORTAL.x * sx, PORTAL.y * sy, 4.5, 0, Math.PI * 2); mctx.fill();
  }

  function syncUi() {
    if (!player) return;
    const level = LEVELS[currentLevel];
    ui.sectorText.textContent = `${level.short} // ${level.name}`;
    ui.waveText.textContent = `STAGE ${wave ? String(wave).padStart(2, '0') : '—'} / ${level.stages}`;
    ui.waveState.textContent = spawnQueue.length || enemies.length
      ? `WAVE ${formation}/${formationsInStage} · ${spawnQueue.length + enemies.length} HOSTILES`
      : wave ? `WAVE ${formation}/${formationsInStage} CLEAR` : 'STANDBY';
    ui.scoreText.textContent = formatScore(score);
    ui.bestText.textContent = formatScore(isAdminPilot() ? 0 : Math.max(highScore, score));
    const healthRatio = clamp(player.hp / player.maxHp, 0, 1);
    ui.healthBar.style.transform = `scaleX(${healthRatio})`;
    ui.healthBar.style.background = healthRatio < .3 ? COLORS.coral : COLORS.cyan;
    ui.healthText.textContent = `${Math.ceil(player.hp)}`;
    ui.levelText.textContent = String(player.level);
    ui.xpBar.style.transform = `scaleX(${clamp(player.xp / player.xpNext, 0, 1)})`;
    ui.xpText.textContent = `${Math.floor(player.xp)} / ${player.xpNext}`;
    ui.creditText.textContent = String(player.credits).padStart(3, '0');
    ui.speedTierText.textContent = `${player.speedTier}/7`;
    ui.damageTierText.textContent = `${player.damageTier}/7`;
    ui.rateTierText.textContent = `${player.rateTier}/7`;
    ui.hullTierText.textContent = `${player.hullTier}/7`;
    ui.rocketTierText.textContent = `${player.rocketTier}/7`;
    ui.coolingTierText.textContent = `${player.coolingTier}/7`;
    ui.shieldPips.innerHTML = Array.from({ length: 5 }, (_, index) => `<i class="${index >= gateShields ? 'empty' : ''}"></i>`).join('');
    ui.shieldPips.setAttribute('aria-label', `${gateShields} portal shields`);

    const rocketProgress = player.rocketCharge > 0 ? 1 - player.rocketCharge / .62 : 1 - player.rocketCooldown / player.rocketMax;
    ui.rocketCooldown.style.width = `${clamp(rocketProgress, 0, 1) * 100}%`;
    ui.rocketState.textContent = player.rocketCharge > 0 ? 'CHARGING' : player.rocketCooldown > 0 ? `${player.rocketCooldown.toFixed(1)}S` : 'READY';
    ui.rocketCooldown.closest('.ability-card').classList.toggle('cooling', player.rocketCooldown > 0 || player.rocketCharge > 0);

    const boostProgress = 1 - player.boostCooldown / player.boostMax;
    ui.boostCooldown.style.width = `${clamp(boostProgress, 0, 1) * 100}%`;
    ui.boostState.textContent = player.boostCooldown > 0 ? `${player.boostCooldown.toFixed(1)}S` : 'READY';
    ui.boostCooldown.closest('.ability-card').classList.toggle('cooling', player.boostCooldown > 0);

    const docked = nearestStation(110);
    const buildCost = stationBuildCost();
    if (docked) {
      const upgradeCost = 90 + docked.level * 80;
      ui.stationState.textContent = docked.level >= 4 ? 'MAXIMUM POWER' : `${upgradeCost} ◈ TO UPGRADE`;
    } else {
      ui.stationState.textContent = stations.length >= 3 ? 'STATION LIMIT' : `${buildCost} ◈ TO BUILD`;
    }
    document.getElementById('stationButton').disabled = false;
  }

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
    if (event.repeat && ['KeyQ', 'KeyF', 'KeyB', 'KeyR', 'Escape', 'Enter'].includes(event.code)) return;
    input.keys.add(event.code);
    if (tutorialMode && tutorialIndex === 0 && ['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) advanceTutorial();
    if (event.code === 'ArrowUp' && mode === 'playing') fireBlaster(player.angle);
    if (event.code === 'KeyQ') triggerBoost();
    if (event.code === 'KeyF') beginRocketCharge();
    if (event.code === 'KeyB') useStation();
    if (event.code === 'KeyR') callNextWave();
    if (event.code === 'Escape') {
      if (ui.authOverlay.classList.contains('active')) closeAccount();
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
  }

  function pointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    input.mouseX = event.clientX - rect.left;
    input.mouseY = event.clientY - rect.top;
    input.pointerActive = true;
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
    document.getElementById('pilotButton').addEventListener('click', () => openAccount());
    document.getElementById('accountButton').addEventListener('click', () => openAccount());
    document.getElementById('leaderboardButton').addEventListener('click', openLeaderboard);
    document.getElementById('closeAuth').addEventListener('click', closeAccount);
    document.getElementById('closeLeaderboard').addEventListener('click', closeLeaderboard);
    document.getElementById('showSignIn').addEventListener('click', () => setAuthMode('signin'));
    document.getElementById('showSignUp').addEventListener('click', () => setAuthMode('signup'));
    document.getElementById('showGuest').addEventListener('click', () => setAuthMode('guest'));
    document.getElementById('authForm').addEventListener('submit', submitAuthForm);
    document.getElementById('protectProgressButton').addEventListener('click', () => setAuthMode('upgrade'));
    document.getElementById('signOutButton').addEventListener('click', signOutPilot);
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
})();
