  // Per-frame simulation: movement, combat, collisions, stations, and damage.
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
    player.jumpDestinationCooldown = Math.max(0, player.jumpDestinationCooldown - dt);
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
    else {
      stationaryTime = 0;
      staticDamageTimer = 0;
    }
    const staticDamageActive = stationaryTime >= 1.25 && (enemies.length > 0 || spawnQueue.length > 0);
    ui.staticWarning.classList.toggle('active', staticDamageActive);
    if (staticDamageActive) {
      staticDamageTimer += dt;
      if (staticDamageTimer >= .65) {
        staticDamageTimer = 0;
        damagePlayer(2);
      }
    }

    if (input.keys.has('KeyT') && jumpDestinationCancelArmed) {
      jumpDestinationHold += dt;
      if (jumpDestinationHold >= .75) {
        clearJumpDestination();
        jumpDestinationCancelArmed = false;
      }
    }

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
    if (tutorialMode) {
      updateTutorialCombatWave(dt);
      return;
    }

    if (spawnQueue.length) {
      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        spawnEnemy(spawnQueue.shift());
        const openingBuffer = wave <= 2 ? .12 : 0;
        const sectorThreeSpacing = currentLevel === 2 ? 1.08 : 1;
        spawnTimer = Math.max(.34, (.78 + currentLevel * .12 - wave * .018 + openingBuffer) * sectorThreeSpacing);
      }
    } else if (!enemies.length && wave > 0) {
      if (!waveReady) {
        waveReady = true;
        const clearTime = gameClock - formationStartedAt;
        waveCallEligible = !tutorialMode && clearTime <= formationParTime && gateShields >= formationGateShields;
        setWaveCallAvailable(waveCallEligible);
      }
      waveClearTimer += dt;
      if (waveClearTimer > 3) advanceAfterClear();
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

  function updateTutorialCombatWave(dt) {
    if (!tutorialCombatActive) return;
    player.invulnerable = Math.max(player.invulnerable, .2);
    if (spawnQueue.length) {
      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        spawnEnemy(spawnQueue.shift());
        spawnTimer = .72;
      }
      return;
    }
    const targetsRemain = enemies.some((enemy) => enemy.tutorialTarget && !enemy.dead);
    if (!targetsRemain && tutorialCombatKills >= 3) completeTutorial();
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
    const earnedXp = grantXp(bonus, true);
    showToast(t('toast.rapidClear', { xp: earnedXp }));
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
      const assistCone = enemy.interceptor
        ? Math.min(cone + .1, cone * 1.35)
        : enemy.type === 'striker'
          ? Math.min(cone + .08, cone * 1.45)
          : cone;
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
    const assistTarget = acquireMissileLock(angle) || acquireLock(angle, .27, 920);
    if (assistTarget) {
      const targetAngle = Math.atan2(assistTarget.y - player.y, assistTarget.x - player.x);
      angle += angleDelta(angle, targetAngle) * .8;
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
        turnRate: assistTarget?.interceptor ? 4.2 : assistTarget?.type === 'striker' ? 3.8 : 2.4,
        source: 'player',
        life: 1.15,
        dead: false,
      });
    });
    if (tutorialMode && tutorialIndex === TUTORIAL_STEP.blaster) advanceTutorial();
    audio.tone(340, .045, 'square', .035, 180);
  }

  function beginRocketCharge() {
    if (mode !== 'playing' || player.rocketCooldown > 0 || player.rocketCharge > 0) return;
    player.rocketCharge = .62;
    player.rocketTarget = lockedTarget && !lockedTarget.dead ? lockedTarget : null;
    showToast(player.rocketTarget ? t('toast.lockConfirmed', { enemy: translateEnemy(player.rocketTarget.type).name }) : t('toast.rocketCharging'));
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
    if (tutorialMode && tutorialIndex === TUTORIAL_STEP.rocket) advanceTutorial();
    camera.shake = Math.max(camera.shake, 6);
  }

  function placeJumpDestination() {
    if (mode !== 'playing' || player.jumpDestinationCooldown > 0) return;
    let targetX;
    let targetY;
    if (isPointerAiming()) {
      targetX = input.aimWorldX;
      targetY = input.aimWorldY;
    } else {
      let dx = 0;
      let dy = 0;
      if (input.keys.has('KeyA')) dx -= 1;
      if (input.keys.has('KeyD')) dx += 1;
      if (input.keys.has('KeyW')) dy -= 1;
      if (input.keys.has('KeyS')) dy += 1;
      if (!dx && !dy) { dx = Math.cos(player.angle); dy = Math.sin(player.angle); }
      const length = Math.hypot(dx, dy) || 1;
      targetX = player.x + (dx / length) * 410;
      targetY = player.y + (dy / length) * 410;
    }
    player.jumpDestinationX = clamp(targetX, 70, WORLD.width - 70);
    player.jumpDestinationY = clamp(targetY, 70, WORLD.height - 70);
    player.jumpDestinationCooldown = player.jumpDestinationMax;
    burst(player.jumpDestinationX, player.jumpDestinationY, COLORS.purple, 12, 120);
    showToast(t('toast.destinationSet'));
    audio.tone(340, .16, 'sine', .07, 520);
  }

  function clearJumpDestination() {
    player.jumpDestinationX = null;
    player.jumpDestinationY = null;
    player.jumpDestinationCooldown = 0;
    showToast(t('toast.destinationCleared'));
    audio.tone(220, .14, 'sine', .06, -280);
  }

  function triggerBoost() {
    if (mode !== 'playing' || player.boostCooldown > 0) return;
    const startX = player.x;
    const startY = player.y;
    let targetX = player.jumpDestinationX;
    let targetY = player.jumpDestinationY;
    if (!Number.isFinite(targetX) || !Number.isFinite(targetY)) {
      let dx = 0;
      let dy = 0;
      if (input.keys.has('KeyA')) dx -= 1;
      if (input.keys.has('KeyD')) dx += 1;
      if (input.keys.has('KeyW')) dy -= 1;
      if (input.keys.has('KeyS')) dy += 1;
      if (!dx && !dy) { dx = Math.cos(player.angle); dy = Math.sin(player.angle); }
      const length = Math.hypot(dx, dy) || 1;
      targetX = clamp(player.x + (dx / length) * 410, 45, WORLD.width - 45);
      targetY = clamp(player.y + (dy / length) * 410, 45, WORLD.height - 45);
      showToast(t('toast.jumpedAhead'));
    } else {
      targetX = clamp(targetX, 45, WORLD.width - 45);
      targetY = clamp(targetY, 45, WORLD.height - 45);
    }
    const travelX = targetX - startX;
    const travelY = targetY - startY;
    const travelLength = Math.hypot(travelX, travelY);
    const dx = travelLength > 1 ? travelX / travelLength : Math.cos(player.angle);
    const dy = travelLength > 1 ? travelY / travelLength : Math.sin(player.angle);
    const jumpDistance = Math.max(1, travelLength);
    player.x = targetX;
    player.y = targetY;
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
    if (tutorialMode && tutorialIndex === TUTORIAL_STEP.jump) advanceTutorial();
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
      enemy.progress += enemy.speed * dt;
      enemy.wobble += dt * (enemy.type === 'striker' ? 1.15 : 1.7);
      enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
      enemy.shieldHitTimer = Math.max(0, enemy.shieldHitTimer - dt);
      const point = getPathPoint(enemy.progress, enemy.pathId);
      const laneTaper = enemy.type === 'striker' ? clamp((enemy.pathLength - enemy.progress) / 420, 0, 1) : 1;
      const sway = enemy.lane * laneTaper + Math.sin(enemy.wobble) * (enemy.boss ? 22 : 13);
      enemy.x = point.x + point.nx * sway;
      enemy.y = point.y + point.ny * sway;
      enemy.angle = point.angle + Math.cos(enemy.wobble * .8) * .08;

      if (enemy.major) {
        enemy.rocketTimer -= dt;
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
          const count = enemy.boss ? 3 : 1;
          for (let i = 0; i < count; i += 1) {
            spawnEnemy({ type: 'interceptor', pathId: enemy.pathId, entryProgress: Math.max(0, enemy.progress - 28 - i * 12) }, enemy);
          }
          enemy.spawnTimer = enemy.bossSkill === 'swarm' ? rand(2.9, 4.2) : rand(4.2, 5.9);
          burst(enemy.x, enemy.y, enemy.color, 10, 110);
          showToast(enemy.boss ? t('toast.carrierWing') : t('toast.carrierLaunch'));
        }
      }

      if (enemy.progress >= enemy.pathLength - 18) {
        enemy.dead = true;
        if (tutorialMode && enemy.tutorialTarget) {
          spawnQueue.push({ type: enemy.type, pathId: enemy.pathId, entryProgress: 0, tutorialTarget: true });
          spawnTimer = Math.min(spawnTimer, .35);
          return;
        }
        gateShields -= enemy.boss ? Math.max(1, gateShields) : 1;
        camera.shake = Math.max(camera.shake, 16);
        burst(PORTAL.x, PORTAL.y, COLORS.coral, 30, 320);
        audio.tone(58, .5, 'sawtooth', .11, -28);
        showToast(gateShields > 0 ? t('toast.gateHit', { count: gateShields }) : t('toast.gateBreached'));
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
      if (Math.hypot(player.vx, player.vy) > 150) { showToast(t('toast.slowDock')); return; }
      if (docked.level >= 4) { showToast(t('toast.stationMax')); return; }
      const cost = 90 + docked.level * 80;
      if (player.credits < cost) { showToast(t('toast.upgradeRequires', { cost })); return; }
      player.credits -= cost;
      docked.level += 1;
      docked.range += 72;
      docked.damage *= 1.42;
      docked.fireRate *= .86;
      player.hp = Math.min(player.maxHp, player.hp + 12);
      burst(docked.x, docked.y, COLORS.amber, 24, 180);
      showToast(t('toast.stationUpgraded', { level: docked.level }));
      audio.tone(420, .36, 'sine', .07, 280);
      if (tutorialMode && tutorialIndex === TUTORIAL_STEP.station) advanceTutorial();
      return;
    }
    if (stations.length >= 3) { showToast(t('toast.stationLimit')); return; }
    const cost = stationBuildCost();
    if (player.credits < cost) { showToast(t('toast.needCredits', { cost })); return; }
    player.credits -= cost;
    stations.push({ x: player.x, y: player.y, radius: 30, level: 1, range: 470, damage: 17, fireRate: .8, fireTimer: .25, angle: 0, target: null });
    burst(player.x, player.y, COLORS.amber, 28, 210);
    showToast(t('toast.stationDeployed'));
    audio.tone(230, .5, 'triangle', .075, 310);
    if (tutorialMode && tutorialIndex === TUTORIAL_STEP.station) {
      tutorialStationBuilt = true;
      updateTutorialCard();
    }
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
          const damageMultiplier = interceptorAssist ? 2.8 : lightShip ? 1.8 : 1;
          bullets.push({
            x: station.x + Math.cos(station.angle) * 28, y: station.y + Math.sin(station.angle) * 28,
            vx: Math.cos(station.angle) * shotSpeed, vy: Math.sin(station.angle) * shotSpeed, radius: 3.8,
            damage: station.damage * damageMultiplier, target: station.target, turnRate: interceptorAssist ? 7.2 : 2.3, source: 'station', life: 1.5, dead: false,
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
      for (const missile of enemyRockets) {
        if (missile.dead) continue;
        if (distanceSq(rocket, missile) <= (rocket.radius + missile.radius) ** 2) {
          damageEnemyRocket(missile, rocket.damage, rocket.x, rocket.y);
        }
      }
      const target = enemies.find((enemy) => !enemy.dead && !enemy.interceptor
        && distanceSq(rocket, enemy) <= (rocket.radius + enemy.radius) ** 2);
      if (target) {
        rocket.dead = true;
        explodeRocket(rocket.x, rocket.y, rocket.damage);
        continue;
      }
      for (const rock of resources) {
        if (rock.dead) continue;
        if (distanceSq(rocket, rock) <= (rocket.radius + rock.radius) ** 2) {
          rocket.dead = true;
          explodeRocket(rocket.x, rocket.y, rocket.damage);
          break;
        }
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
      }
    }

    for (const rock of resources) {
      if (rock.collisionTimer <= 0 && player.invulnerable <= 0 && distanceSq(rock, player) <= (rock.radius + player.radius) ** 2) {
        rock.collisionTimer = .8;
        damagePlayer(Math.max(6, Math.round(rock.radius * .32)));
        const angle = Math.atan2(player.y - rock.y, player.x - rock.x);
        player.vx += Math.cos(angle) * (260 + rock.radius * 4);
        player.vy += Math.sin(angle) * (260 + rock.radius * 4);
        addFloater(rock.x, rock.y - rock.radius, t('floater.collision'), COLORS.coral);
      }
    }

    for (const item of pickups) {
      if (distanceSq(item, player) <= (item.radius + player.radius + 5) ** 2) collectPickup(item);
    }
  }

  function damageEnemy(enemy, amount, x, y, heavy = false) {
    if (enemy.shieldCharges > 0) {
      enemy.shieldHitTimer = .16;
      if (!heavy) {
        if (Math.random() < .18) addFloater(enemy.x, enemy.y - enemy.radius, t('floater.shielded'), '#79a8ff');
        addParticle(x, y, { vx: rand(-60, 60), vy: rand(-60, 60), color: '#79a8ff', life: .34, size: 2.5 });
        audio.tone(780, .045, 'sine', .022, -100);
        return;
      }
      enemy.shieldCharges -= 1;
      burst(x, y, '#79a8ff', 14, 160);
      if (enemy.shieldCharges > 0) {
        showToast(t('toast.shieldRemaining', { enemy: translateEnemy(enemy.type).name, count: enemy.shieldCharges }));
        addFloater(enemy.x, enemy.y - enemy.radius, t('floater.shield', { current: enemy.shieldCharges, total: enemy.maxShieldCharges }), '#9acbff');
        return;
      }
      amount *= .72;
      showToast(t('toast.shieldCollapsed', { enemy: translateEnemy(enemy.type).name }));
      addFloater(enemy.x, enemy.y - enemy.radius, t('floater.shieldCollapsed'), COLORS.amber);
    } else if (enemy.shieldHp > 0) {
      enemy.shieldHitTimer = .16;
      if (!heavy) {
        if (enemy.shieldHitTimer <= .17 && Math.random() < .18) addFloater(enemy.x, enemy.y - enemy.radius, t('floater.shielded'), '#79a8ff');
        addParticle(x, y, { vx: rand(-60, 60), vy: rand(-60, 60), color: '#79a8ff', life: .34, size: 2.5 });
        audio.tone(780, .045, 'sine', .022, -100);
        return;
      }
      enemy.shieldHp -= amount * 1.75;
      burst(x, y, '#79a8ff', 14, 160);
      if (enemy.shieldHp > 0) return;
      amount *= .72;
      showToast(t('toast.shieldCollapsed', { enemy: translateEnemy(enemy.type).name }));
      addFloater(enemy.x, enemy.y - enemy.radius, t('floater.shieldBroken'), COLORS.amber);
    }
    enemy.hp -= amount;
    enemy.hitFlash = .08;
    if (enemy.interceptor) addFloater(enemy.x, enemy.y - enemy.radius, t('floater.hull', { amount: Math.max(1, Math.round(enemy.hp)) }), enemy.color);
    addParticle(x, y, { vx: rand(-80, 80), vy: rand(-80, 80), color: enemy.color, life: .28, size: 2.2 });
    if (enemy.hp <= 0 && !enemy.dead) {
      enemy.dead = true;
      kills += 1;
      if (tutorialMode && tutorialCombatActive && enemy.tutorialTarget) tutorialCombatKills += 1;
      score += Math.round(enemy.score * (1 + wave * .05 + currentLevel * .18));
      grantXp(enemy.xp);
      burst(enemy.x, enemy.y, enemy.color, enemy.boss ? 60 : enemy.major ? 30 : 14, enemy.boss ? 520 : 240);
      addFloater(enemy.x, enemy.y - enemy.radius, `+${enemy.score}`, enemy.boss ? COLORS.amber : COLORS.cyan);
      if (enemy.interceptor) showToast(t('toast.carrierInterceptorDestroyed'));
      camera.shake = Math.max(camera.shake, enemy.boss ? 22 : enemy.major ? 9 : 3.5);
      audio.tone(enemy.boss ? 48 : enemy.major ? 72 : 130, enemy.boss ? .75 : .16, 'sawtooth', enemy.boss ? .14 : .05, -35);
      if (enemy.major && Math.random() < .28) spawnPickupAt('repair', enemy.x, enemy.y);
    } else if (enemy.emergencyShield && !enemy.emergencyShieldUsed
      && enemy.hp / enemy.maxHp <= .4 && enemy.progress < enemy.pathLength * .7) {
      enemy.emergencyShieldUsed = true;
      enemy.maxShield = enemy.maxHp * .2;
      enemy.shieldHp = enemy.maxShield;
      enemy.shieldHitTimer = .45;
      showToast(t('toast.emergencyShield', { enemy: translateEnemy(enemy.type).name }));
      addFloater(enemy.x, enemy.y - enemy.radius, t('floater.emergencyShield'), '#9acbff');
      burst(enemy.x, enemy.y, '#79a8ff', 34, 280);
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
      addFloater(rocket.x, rocket.y - 13, t('floater.missileIntercepted'), COLORS.cyan);
      camera.shake = Math.max(camera.shake, 2.5);
      audio.tone(190, .1, 'square', .035, -70);
    } else {
      addFloater(rocket.x, rocket.y - 11, t('floater.hull', { amount: Math.ceil(rocket.hp) }), COLORS.coral);
      audio.tone(520, .035, 'square', .018, -80);
    }
  }

  function damageResource(rock, amount, x, y) {
    rock.hp -= amount;
    addParticle(x, y, { vx: rand(-65, 65), vy: rand(-65, 65), color: rock.crystal ? COLORS.purple : COLORS.cyan, life: .34, size: 2 });
    if (rock.hp <= 0 && !rock.dead) {
      rock.dead = true;
      const completesTutorialMining = tutorialMode
        && tutorialIndex === TUTORIAL_STEP.salvage
        && rock.tutorialTarget;
      const xp = grantXp(Math.round(rock.xpValue * player.salvage), completesTutorialMining);
      const credits = rock.creditValue;
      player.credits += credits;
      score += Math.round(rock.radius * (rock.crystal ? 6 : 3));
      burst(rock.x, rock.y, rock.crystal ? COLORS.purple : COLORS.cyan, 16, 170);
      addFloater(rock.x, rock.y - 20, `+${xp} XP  +${credits} ◈`, rock.crystal ? COLORS.purple : COLORS.cyan);
      audio.tone(520, .12, 'triangle', .04, 220);
      if (completesTutorialMining) advanceTutorial();
    }
  }

  function explodeRocket(x, y, damage) {
    const radius = 150;
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
    addFloater(player.x, player.y - 28, t('floater.hull', { amount: `-${Math.round(amount)}` }), COLORS.coral);
    audio.tone(94, .28, 'sawtooth', .09, -54);
    if (player.hp <= 0) finishRun(false, 'ship');
  }

  function collectPickup(item) {
    item.dead = true;
    if (item.kind === 'repair') {
      const healed = Math.min(36, player.maxHp - player.hp);
      player.hp += healed;
      showToast(healed > 0 ? t('toast.repairField', { amount: Math.round(healed) }) : t('toast.hullStable'));
      addFloater(item.x, item.y, t('floater.hull', { amount: `+${Math.round(healed)}` }), COLORS.cyan);
    } else {
      gateShields = Math.min(5, gateShields + 1);
      showToast(t('toast.aegisRecovered'));
      addFloater(item.x, item.y, t('floater.gateShield'), COLORS.amber);
    }
    burst(item.x, item.y, item.kind === 'repair' ? COLORS.cyan : COLORS.amber, 20, 170);
    audio.tone(item.kind === 'repair' ? 660 : 420, .35, 'sine', .065, 240);
  }

  function spawnPickupAt(kind, x, y) {
    pickups.push({ kind, x, y, radius: kind === 'shield' ? 20 : 17, life: 22, pulse: 0, dead: false });
  }

  function grantXp(amount, deferUpgrade = false) {
    const xpMultiplier = tutorialMode ? 1 : (LEVELS[currentLevel]?.xpMultiplier || 1);
    const earnedXp = Math.max(1, Math.round(amount * xpMultiplier));
    player.xp += earnedXp;
    while (player.xp >= player.xpNext) {
      player.xp -= player.xpNext;
      player.level += 1;
      player.xpNext = Math.round(player.xpNext * 1.32 + 16);
      pendingLevelUps += 1;
    }
    if (pendingLevelUps > 0 && mode === 'playing' && !deferUpgrade) showUpgradeChoices();
    return earnedXp;
  }
