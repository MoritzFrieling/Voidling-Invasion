  // Upgrade choices, campaign completion, and tutorial flow.
  const UPGRADES = [
    { id: 'damage', tier: 'damageTier', icon: '◆', name: 'Overcharged Bolts', description: 'Blaster damage increases by 18%.', detail: 'DAMAGE +18%', apply: () => { player.damage *= 1.18; player.damageTier += 1; } },
    { id: 'rate', tier: 'rateTier', icon: '≋', name: 'Flux Repeater', description: 'Blaster cycles 14% faster.', detail: 'FIRE RATE +14%', apply: () => { player.fireRate *= 1.14; player.rateTier += 1; } },
    { id: 'speed', tier: 'speedTier', icon: '»', name: 'Vector Thrusters', description: 'Flight speed and acceleration improve.', detail: 'SPEED +10%', apply: () => { player.speed *= 1.1; player.acceleration *= 1.07; player.speedTier += 1; } },
    { id: 'hull', tier: 'hullTier', icon: '⬡', name: 'Reactive Plating', description: 'Increase maximum hull and restore a little hull.', detail: 'MAX HULL +15', apply: () => { player.maxHp += 15; player.hp = Math.min(player.maxHp, player.hp + 15); player.hullTier += 1; } },
    { id: 'rocket', tier: 'rocketTier', icon: '▲', name: 'Siege Warhead', description: 'Heavy rockets deal more blast damage.', detail: 'ROCKET +22%', apply: () => { player.rocketDamage *= 1.22; player.rocketTier += 1; } },
    { id: 'cooling', tier: 'coolingTier', icon: '❄', name: 'Cryo Manifold', description: 'Rocket and void jump systems reload faster.', detail: 'COOLDOWNS -10%', apply: () => { player.rocketMax *= .9; player.boostMax *= .9; player.coolingTier += 1; } },
    { id: 'salvage', icon: 'XP', name: 'Salvage Matrix', description: 'Void ore yields more experience.', detail: 'RESOURCE XP +18%', apply: () => { player.salvage *= 1.18; } },
    { id: 'multi', icon: 'III', name: 'Splitfire Array', description: 'Add a tightly grouped blaster shot. Offered every four levels.', detail: '+1 SHOT · EVERY 4 LVL', apply: () => { player.multiShot = Math.min(3, player.multiShot + 1); player.multiUpgradeLevel = Math.floor(player.level / 4) * 4; } },
    { id: 'gate', icon: 'AEG', name: 'Gate Capacitor', description: 'Send a recovered charge to Earth.', detail: 'GATE SHIELD +1', apply: () => { gateShields = Math.min(5, gateShields + 1); } },
  ];

  function upgradeCurrentStat(upgrade) {
    switch (upgrade.id) {
      case 'damage': return `CURRENT DAMAGE ${player.damage.toFixed(1)}`;
      case 'rate': return `CURRENT FIRE RATE ${player.fireRate.toFixed(1)}/S`;
      case 'speed': return `CURRENT SPEED ${Math.round(player.speed)}`;
      case 'hull': return `CURRENT MAX HULL ${Math.round(player.maxHp)}`;
      case 'rocket': return `CURRENT ROCKET DMG ${Math.round(player.rocketDamage)}`;
      case 'cooling': return `ROCKET CD ${player.rocketMax.toFixed(1)}S · JUMP CD ${player.boostMax.toFixed(1)}S`;
      case 'salvage': return `CURRENT RESOURCE XP ×${player.salvage.toFixed(2)}`;
      case 'multi': return `CURRENT SHOTS ${player.multiShot}`;
      case 'gate': return `CURRENT GATE SHIELDS ${gateShields}/5`;
      default: return upgrade.detail;
    }
  }

  function showUpgradeChoices() {
    mode = 'upgrade';
    ui.crosshair.style.opacity = '0';
    ui.lockReadout.classList.remove('active');
    const nextMultiLevel = Math.max(4, (Math.floor(Number(player.multiUpgradeLevel) / 4) * 4) + 4);
    const pool = [...UPGRADES].filter((upgrade) => (!upgrade.tier || player[upgrade.tier] < 7)
      && (upgrade.id !== 'multi' || (player.multiShot < 3 && player.level >= nextMultiLevel)));
    const choices = [];
    while (choices.length < 3 && pool.length) choices.push(pool.splice((Math.random() * pool.length) | 0, 1)[0]);
    ui.upgradeChoices.replaceChildren();
    choices.forEach((upgrade) => {
      const button = document.createElement('button');
      button.className = 'upgrade-choice';
      button.type = 'button';
      button.innerHTML = `<span class="upgrade-icon">${upgrade.icon}</span><strong>${upgrade.name}</strong><p>${upgrade.description}</p><small>${upgradeCurrentStat(upgrade)}</small>`;
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
    { title: 'PUNCH THE VOID', text: 'Press T to place or replace a jump destination, then Q or right-click to teleport there. Hold T to clear it and dash again.' },
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
