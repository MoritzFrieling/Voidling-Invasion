  // Runtime state, local/cloud persistence, and audio services.
  const settings = {
    music: localStorage.getItem('voidline-music') !== 'false',
    sfx: localStorage.getItem('voidline-sfx') !== 'false',
    shake: localStorage.getItem('voidline-shake') !== 'false',
  };

  const input = {
    keys: new Set(),
    pointerDown: false,
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
  let staticDamageTimer = 0;
  let jumpDestinationHold = 0;
  let jumpDestinationCancelArmed = false;
  let announcementTimer = 0;
  let toastTimer = 0;
  let resourceTimer = 1;
  let repairTimer = 12;
  let spawnTimer = 0;
  let spawnQueue = [];
  let pendingLevelUps = 0;
  let lastSelectedUpgradeId = null;
  let tutorialMode = false;
  let tutorialIndex = 0;
  let tutorialDelay = 0;
  let tutorialTransitionTimer = 0;
  let tutorialTransitioning = false;
  let tutorialMovementKeys = new Set();
  let tutorialStationBuilt = false;
  let tutorialCombatActive = false;
  let tutorialCombatKills = 0;
  let tutorialUpgradeTipShown = false;
  let runFinished = false;
  let seenEnemyTypes = new Set();
  let introQueue = [];
  let pendingWaveStart = false;
  let bossIntroTimer = 0;
  let threatWarningCooldown = 0;
  let lockedTarget = null;
  let lastRunLevel = 0;
  let stageCheckpoint = null;
  const CAMPAIGN_KEY = 'voidline-campaign-v1';
  const HIGH_SCORE_KEY = 'voidline-highscore';
  const GAME_STARTED_KEY = 'voidline-game-started';
  let activePilot = null;
  let activePilotId = null;
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
    ui.pilotSyncState.textContent = t('account.pending');
    cloudSaveTimer = setTimeout(syncCloudProgress, 650);
  }

  async function syncCloudProgress() {
    if (!activePilot || !window.VoidlineCloud || cloudSyncSuspended) return;
    if (cloudBusy) {
      cloudSaveTimer = setTimeout(syncCloudProgress, 650);
      return;
    }
    cloudBusy = true;
    ui.pilotSyncState.textContent = t('account.syncing');
    try {
      await window.VoidlineCloud.saveProgress(campaignState, isAdminPilot() ? 0 : highScore);
      ui.pilotSyncState.textContent = t('account.saveCurrent');
    } catch (error) {
      ui.pilotSyncState.textContent = t('account.offlineSaved');
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
