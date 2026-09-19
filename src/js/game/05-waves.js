  // Wave scheduling, enemy definitions, spawning, and resource creation.
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
    interceptor: { name: 'CARRIER INTERCEPTOR', role: 'LAUNCHED // DESTRUCTIBLE', description: 'A light interceptor launched by carrier vessels. Blaster hits damage its hull and can destroy it before it reaches the gate.', radius: 10, hp: 40, speed: 164, score: 80, xp: 7, color: '#ff9f88', interceptor: true },
    carrier: { name: 'BROOD CARRIER', role: 'SPAWNER // HEAVY HULL', description: 'A mobile hangar that launches smaller fighters along the route. Destroy it before the swarm grows.', radius: 37, hp: 520, speed: 49, score: 920, xp: 60, color: '#f071c8', major: true, carrier: true },
    sentinel: { name: 'AEGIS SENTINEL', role: 'ROCKET-BREAK SHIELD', description: 'Light blasters cannot pierce its barrier. Two heavy-rocket impacts collapse the barrier, regardless of rocket level.', radius: 29, hp: 310, shield: 0, shieldCharges: 2, speed: 62, score: 840, xp: 58, color: '#79a8ff', major: true, shielded: true },
    bossOmega: { name: 'DREADNOUGHT OMEGA', role: 'MISSILE COMMAND SHIP', description: 'The first invasion commander. It saturates the defense zone with guided warheads.', radius: 66, hp: 2850, speed: 34, score: 5400, xp: 260, color: '#ff506b', major: true, boss: true, bossSkill: 'rockets' },
    bossCarrier: { name: 'THE HOLLOW QUEEN', role: 'RIFT CARRIER // SWARM COMMAND', description: 'A vast carrier that continuously deploys escort wings through the twin rift. Its emergency shield activates if it is damaged too early.', radius: 74, hp: 4600, speed: 29, score: 7600, xp: 340, color: '#ef67d1', major: true, boss: true, carrier: true, bossSkill: 'swarm', emergencyShield: true },
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
      shieldCharges: blueprint.shieldCharges || 0,
      maxShieldCharges: blueprint.shieldCharges || 0,
      shieldHp: (blueprint.shield || 0) * difficultyScale,
      maxShield: (blueprint.shield || 0) * difficultyScale,
      emergencyShield: Boolean(blueprint.emergencyShield),
      emergencyShieldUsed: false,
      bossSkill: blueprint.bossSkill || '',
      rocketTimer: rand(1.3, 3),
      spawnTimer: blueprint.carrier ? rand(3.55, 5.95) : rand(3.2, 5.4),
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
