  // Wave scheduling, enemy definitions, spawning, and resource creation.
  function setWaveCallAvailable(available) {
    ui.waveCallButton.classList.toggle('active', available);
    ui.waveCallButton.disabled = !available;
    ui.waveCallButton.setAttribute('aria-hidden', String(!available));
    ui.waveCallButton.querySelector('span').textContent = t('hud.callNextWave');
    ui.waveCallButton.querySelector('b').hidden = openingWaveTimer > 0;
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
    captureStageCheckpoint();
    prepareFormation();
  }

  function prepareFormation() {
    const level = LEVELS[currentLevel];
    spawnQueue = [];
    const regularCount = currentLevel === 3
      ? (wave === 1 ? 3 + formation : Math.min(15, 4 + Math.ceil(wave * 1.1) + formation))
      : 4 + Math.ceil(wave * 1.15) + currentLevel * 2 + formation;
    const available = ['scout', 'raider'];
    if (wave >= 2) available.push('striker');
    if (wave >= 3) available.push('major');
    if (currentLevel >= 1 && wave >= 2) available.push('carrier');
    if (currentLevel >= 2 && wave >= 2) available.push('sentinel');
    if (currentLevel >= 3 && wave >= 2) available.push('gravity');
    if (currentLevel >= 3 && wave >= 3) available.push('repair');
    for (let i = 0; i < regularCount; i += 1) {
      let type = available[(i * 7 + wave * 3 + formation * 2) % available.length];
      if (currentLevel === 3 && wave === 1) type = i % 3 === 0 ? 'raider' : 'scout';
      if (wave === 1 && formation === 1 && i === 0) type = 'scout';
      if (wave === 1 && formation === 1 && i === 1) type = 'raider';
      if (currentLevel === 3 && wave === 2 && formation === 1 && i === 0) type = 'gravity';
      if (currentLevel === 3 && wave === 3 && formation === 1 && i === 0) type = 'repair';
      if (type === 'carrier' && i % 7 !== 4) type = 'raider';
      if (type === 'sentinel' && i % 6 !== 3) type = 'major';
      if (type === 'repair' && i % 7 !== 2 && !(wave === 3 && formation === 1 && i === 0)) type = 'raider';
      if (type === 'gravity' && i % 6 !== 1 && !(wave === 2 && formation === 1 && i === 0)) type = 'scout';
      const pathId = (i + wave + formation) % level.paths.length;
      let entryProgress = 0;
      let fromWormhole = false;
      const activeWormholes = level.wormholes.filter((wormhole) => wave >= (wormhole.minWave || 3));
      if (activeWormholes.length && wave >= 3 && i > 2 && i % 5 === 0) {
        const wormhole = activeWormholes[(i + wave + formation) % activeWormholes.length];
        entryProgress = level.paths[wormhole.pathId].length * wormhole.progress;
        fromWormhole = true;
        spawnQueue.push({ type, pathId: wormhole.pathId, entryProgress, fromWormhole });
      } else {
        spawnQueue.push({ type, pathId, entryProgress, fromWormhole });
      }
    }

    // Sector 3 / Stage 2's second formation has one heavy hull too many.
    // Break that ship into three smaller raiders to soften the spike without
    // changing the encounter's overall pacing or route count.
    if (currentLevel === 2 && wave === 2 && formation === 2) {
      const heavyIndex = spawnQueue.findIndex((entry) => entry.type === 'major');
      if (heavyIndex >= 0) {
        const heavy = spawnQueue[heavyIndex];
        spawnQueue.splice(heavyIndex, 1,
          { ...heavy, type: 'raider' },
          { ...heavy, type: 'raider', pathId: (heavy.pathId + 1) % level.paths.length },
          { ...heavy, type: 'raider', pathId: (heavy.pathId + 2) % level.paths.length },
        );
      }
    }
    const isBossFormation = wave === level.stages && formation === formationsInStage;
    if (isBossFormation) spawnQueue.push({ type: level.boss, pathId: Math.floor(level.paths.length / 2), entryProgress: 0 });

    const waveTypes = [...new Set(spawnQueue.map((entry) => entry.type).filter((type) => !ENEMY_TYPES[type].boss && type !== 'interceptor'))];
    introQueue = waveTypes.filter((type) => !seenEnemyTypes.has(type));
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
    scout: { nameKey: 'enemy.scout.name', roleKey: 'enemy.scout.role', descriptionKey: 'enemy.scout.description', radius: 12, hp: 42, speed: 138, score: 100, xp: 10, color: '#ff8b72' },
    raider: { nameKey: 'enemy.raider.name', roleKey: 'enemy.raider.role', descriptionKey: 'enemy.raider.description', radius: 19, hp: 105, speed: 88, score: 170, xp: 16, color: '#ffb35c' },
    striker: { nameKey: 'enemy.striker.name', roleKey: 'enemy.striker.role', descriptionKey: 'enemy.striker.description', radius: 10, hp: 48, speed: 178, score: 220, xp: 18, color: '#c885ff' },
    major: { nameKey: 'enemy.major.name', roleKey: 'enemy.major.role', descriptionKey: 'enemy.major.description', radius: 32, hp: 390, speed: 55.1, score: 700, xp: 48, color: '#ff6f61', major: true },
    interceptor: { nameKey: 'enemy.interceptor.name', roleKey: 'enemy.interceptor.role', descriptionKey: 'enemy.interceptor.description', radius: 10, hp: 34, speed: 148, score: 80, xp: 7, color: '#ff9f88', interceptor: true },
    carrier: { nameKey: 'enemy.carrier.name', roleKey: 'enemy.carrier.role', descriptionKey: 'enemy.carrier.description', radius: 37, hp: 520, speed: 49, score: 920, xp: 60, color: '#f071c8', major: true, carrier: true },
    sentinel: { nameKey: 'enemy.sentinel.name', roleKey: 'enemy.sentinel.role', descriptionKey: 'enemy.sentinel.description', radius: 29, hp: 310, shield: 0, shieldCharges: 2, speed: 62, score: 840, xp: 58, color: '#aeb8c0', major: true, shielded: true },
    gravity: { nameKey: 'enemy.gravity.name', roleKey: 'enemy.gravity.role', descriptionKey: 'enemy.gravity.description', radius: 25, hp: 210, speed: 68, score: 620, xp: 42, color: '#ad91ff' },
    repair: { nameKey: 'enemy.repair.name', roleKey: 'enemy.repair.role', descriptionKey: 'enemy.repair.description', radius: 27, hp: 190, speed: 66, score: 660, xp: 44, color: '#71efb1' },
    bossOmega: { nameKey: 'enemy.bossOmega.name', roleKey: 'enemy.bossOmega.role', descriptionKey: 'enemy.bossOmega.description', radius: 66, hp: 2280, speed: 34, score: 5400, xp: 260, color: '#ff506b', major: true, boss: true, bossSkill: 'rockets' },
    // Offset Sector Two's 20% enemy durability bonus so this boss keeps its existing effective HP.
    bossCarrier: { nameKey: 'enemy.bossCarrier.name', roleKey: 'enemy.bossCarrier.role', descriptionKey: 'enemy.bossCarrier.description', radius: 74, hp: 4600 / 1.2, speed: 29, score: 7600, xp: 340, color: '#ef67d1', major: true, boss: true, carrier: true, bossSkill: 'swarm', emergencyHeal: .15 },
    bossTitan: { nameKey: 'enemy.bossTitan.name', roleKey: 'enemy.bossTitan.role', descriptionKey: 'enemy.bossTitan.description', radius: 82, hp: 2520, shield: 330, speed: 26, score: 12000, xp: 500, color: '#aeb8c0', major: true, boss: true, shielded: true, bossSkill: 'titan' },
    bossWarden: { nameKey: 'enemy.bossWarden.name', roleKey: 'enemy.bossWarden.role', descriptionKey: 'enemy.bossWarden.description', radius: 86, hp: 3100, speed: 28, score: 15000, xp: 600, color: '#b18bff', major: true, boss: true, bossSkill: 'gravity' },
  };

  function activateWave() {
    ui.intelOverlay.classList.remove('active');
    ui.bossOverlay.classList.remove('active');
    mode = 'playing';
    pendingWaveStart = false;
    announcementTimer = 2.2;
    spawnTimer = .55;
    formationStartedAt = gameClock;
    const sectorThreeSpacing = currentLevel === 3 ? 1.3 : currentLevel === 2 ? 1.08 : 1;
    formationParTime = (18 + spawnQueue.length * 1.45 + currentLevel * 2.5) * sectorThreeSpacing;
    formationGateShields = gateShields;
    waveReady = false;
    waveCallEligible = false;
    setWaveCallAvailable(false);
    const bossFormation = wave === LEVELS[currentLevel].stages && formation === formationsInStage;
    showToast(bossFormation ? t('toast.commandEntering') : t('toast.stageWave', { stage: String(wave).padStart(2, '0'), wave: formation, total: formationsInStage }));
    audio.tone(bossFormation ? 82 : 128, .42, 'sawtooth', .08, bossFormation ? -35 : 110);
    ui.crosshair.style.opacity = '1';
    if (pendingLevelUps > 0) showUpgradeChoices();
  }

  function showNextIntel() {
    if (!introQueue.length) { activateWave(); return; }
    const type = introQueue.shift();
    const firstContact = !seenEnemyTypes.has(type);
    const intel = translateEnemy(type);
    seenEnemyTypes.add(type);
    campaignState.seenEnemyTypes = [...seenEnemyTypes];
    saveCampaignState();
    mode = 'briefing';
    ui.crosshair.style.opacity = '0';
    ui.intelTitle.textContent = intel.name;
    ui.intelRole.textContent = intel.role;
    ui.intelText.textContent = intel.description;
    ui.intelKicker.textContent = t(firstContact ? 'intel.firstContact' : 'intel.newHostile');
    ui.intelOverlay.querySelector('.intel-panel').dataset.enemy = type;
    drawIntelShip(type);
    ui.intelOverlay.classList.add('active');
  }

  function showBossIntro(type) {
    const boss = translateEnemy(type);
    mode = 'cutscene';
    bossIntroTimer = 4.2;
    ui.crosshair.style.opacity = '0';
    ui.bossTitle.textContent = boss.name;
    ui.bossText.textContent = boss.role;
    ui.bossKicker.textContent = `${translateLevel(LEVELS[currentLevel]).short} // ${t('boss.commandSignature')}`;
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
    const sectorFourLight = currentLevel === 3 && ['scout', 'raider', 'striker', 'interceptor'].includes(type);
    const hpVariance = rand(.86, 1.28);
    const speedVariance = sectorFourLight ? rand(.94, 1.08) : rand(.86, 1.17);
    const difficultyScale = (1.05 + rampStage * .125 + currentLevel * .16)
      * (LEVELS[currentLevel].enemyDurability || 1)
      * (LEVELS[currentLevel].enemyTankinessMultiplier || 1);
    const maxHp = blueprint.hp * difficultyScale * hpVariance;
    const lane = sectorFourLight
      ? type === 'striker' ? rand(-85, 85) : rand(-36, 36)
      : type === 'striker' ? rand(-210, 210) : rand(-58, 58);
    const wobble = rand(0, Math.PI * 2);
    const laneTaperDistance = sectorFourLight && type === 'striker' ? 700 : 420;
    const wobbleAmplitude = blueprint.boss ? 22 : sectorFourLight ? 5 : 13;
    const wobbleRate = sectorFourLight ? .8 : type === 'striker' ? 1.15 : 1.7;
    const laneTaper = type === 'striker' ? clamp((path.length - progress) / laneTaperDistance, 0, 1) : 1;
    const sway = lane * laneTaper + Math.sin(wobble) * wobbleAmplitude;
    const speedScale = currentLevel === 3
      ? (1.3 + Math.max(0, wave - 1) * .015) * (type === 'striker' ? .82 : sectorFourLight ? .9 : 1)
      : 1 + rampStage * .022 + currentLevel * .015;
    const enemy = {
      type,
      x: at.x + at.nx * sway,
      y: at.y + at.ny * sway,
      pathId,
      pathLength: path.length,
      progress,
      lane,
      wobble,
      wobbleAmplitude,
      wobbleRate,
      laneTaperDistance,
      radius: blueprint.radius,
      hp: maxHp,
      maxHp,
      speed: blueprint.speed * speedScale * speedVariance,
      score: blueprint.score,
      xp: blueprint.xp,
      color: blueprint.color,
      major: Boolean(blueprint.major),
      boss: Boolean(blueprint.boss),
      carrier: Boolean(blueprint.carrier),
      interceptor: Boolean(blueprint.interceptor),
      tutorialTarget: Boolean(spec.tutorialTarget),
      shielded: Boolean(blueprint.shielded),
      shieldCharges: blueprint.shieldCharges || 0,
      maxShieldCharges: blueprint.shieldCharges || 0,
      shieldHp: (blueprint.shield || 0) * difficultyScale,
      maxShield: (blueprint.shield || 0) * difficultyScale,
      emergencyHeal: blueprint.emergencyHeal || 0,
      emergencyHealUsed: false,
      bossSkill: blueprint.bossSkill || '',
      supportTimer: rand(2, 3),
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

  function getPathPosition(path, distance) {
    const d = clamp(distance, 0, path.length);
    let segment = path.segments[path.segments.length - 1];
    for (let i = 0; i < path.segments.length; i += 1) {
      if (d <= path.segments[i].start + path.segments[i].length) {
        segment = path.segments[i];
        break;
      }
    }
    const t = clamp((d - segment.start) / segment.length, 0, 1);
    return { x: lerp(segment.a.x, segment.b.x, t), y: lerp(segment.a.y, segment.b.y, t) };
  }

  function getPathPoint(distance, pathId = 0) {
    const path = activePaths[pathId] || activePaths[0];
    const d = clamp(distance, 0, path.length);
    const position = getPathPosition(path, d);
    const turnSmoothingDistance = currentLevel === 3 ? 280 : 180;
    const before = getPathPosition(path, d - turnSmoothingDistance);
    const after = getPathPosition(path, d + turnSmoothingDistance);
    const angle = Math.atan2(after.y - before.y, after.x - before.x);
    return { ...position, angle, nx: -Math.sin(angle), ny: Math.cos(angle) };
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
