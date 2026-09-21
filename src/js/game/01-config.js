  // Shared canvas references, world geometry, routes, colors, and UI bindings.
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
      nameKey: 'sector.one.name', shortKey: 'sector.one.short', nextKey: 'sector.one.next', stages: 6, boss: 'bossOmega', enemyDurability: 1.38, enemyTankinessMultiplier: 1.15,
      paths: [createPath([
        { x: -120, y: 380 }, { x: 360, y: 430 }, { x: 690, y: 770 }, { x: 1110, y: 690 },
        { x: 1470, y: 1010 }, { x: 1860, y: 1260 }, { x: 2250, y: 1160 }, { x: 2570, y: 850 },
        { x: 2860, y: 900 }, { x: PORTAL.x, y: PORTAL.y },
      ])],
      wormholes: [],
    },
    {
      nameKey: 'sector.two.name', shortKey: 'sector.two.short', nextKey: 'sector.two.next', stages: 7, boss: 'bossCarrier',
      paths: [
        createPath([{ x: -120, y: 310 }, { x: 440, y: 330 }, { x: 900, y: 600 }, { x: 1380, y: 520 }, { x: 1820, y: 820 }, { x: 2280, y: 760 }, { x: 2670, y: 900 }, { x: PORTAL.x, y: PORTAL.y }]),
        createPath([{ x: -120, y: 1780 }, { x: 420, y: 1670 }, { x: 820, y: 1390 }, { x: 1290, y: 1510 }, { x: 1710, y: 1220 }, { x: 2220, y: 1320 }, { x: 2660, y: 1100 }, { x: PORTAL.x, y: PORTAL.y }]),
      ],
      wormholes: [{ x: 1820, y: 820, pathId: 0, progress: .58 }, { x: 1710, y: 1220, pathId: 1, progress: .54 }],
    },
    {
      nameKey: 'sector.three.name', shortKey: 'sector.three.short', stages: 8, boss: 'bossTitan',
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
    'toast', 'endKicker', 'endTitle', 'endCopy', 'finalScore', 'finalWave', 'finalKills', 'playAgainLabel', 'retryStageButton', 'retryStageLabel', 'sectorText',
    'creditText', 'portalWarning', 'lockReadout', 'stationState', 'stationButton', 'intelOverlay', 'intelKicker', 'intelTitle',
    'intelRole', 'intelText', 'intelShip', 'bossOverlay', 'bossKicker', 'bossTitle', 'bossText',
    'sectorOverlay', 'sectorTitle', 'sectorCopy',
    'levelSelectOverlay', 'levelChoices',
    'speedTierText', 'damageTierText', 'rateTierText', 'hullTierText', 'rocketTierText', 'coolingTierText',
    'staticWarning', 'waveCallButton',
    'authOverlay', 'authTitle', 'authCopy', 'authForm', 'authUsername', 'authPassword',
    'authMessage',
    'pilotSummary', 'pilotType', 'pilotName', 'pilotSyncState', 'adminButton', 'languageSelect', 'menuLanguageSelect',
    'publicUsername', 'publicUsernameHint', 'menuAdminButton', 'leaderboardOverlay', 'leaderboardList',
  ].forEach((id) => { ui[id] = document.getElementById(id); });
