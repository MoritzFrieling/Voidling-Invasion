  // Upgrade choices, campaign completion, and tutorial flow.
  const UPGRADES = [
    { id: 'damage', tier: 'damageTier', icon: '◆', nameKey: 'upgrade.damage.name', descriptionKey: 'upgrade.damage.description', detailKey: 'upgrade.damage.detail', apply: () => { player.damage *= 1.18; player.damageTier += 1; } },
    { id: 'rate', tier: 'rateTier', icon: '≋', nameKey: 'upgrade.rate.name', descriptionKey: 'upgrade.rate.description', detailKey: 'upgrade.rate.detail', apply: () => { player.fireRate *= 1.14; player.rateTier += 1; } },
    { id: 'speed', tier: 'speedTier', icon: '»', nameKey: 'upgrade.speed.name', descriptionKey: 'upgrade.speed.description', detailKey: 'upgrade.speed.detail', apply: () => { player.speed *= 1.1; player.acceleration *= 1.07; player.speedTier += 1; } },
    { id: 'hull', tier: 'hullTier', icon: '⬡', nameKey: 'upgrade.hull.name', descriptionKey: 'upgrade.hull.description', detailKey: 'upgrade.hull.detail', apply: () => { player.maxHp += 15; player.hp = Math.min(player.maxHp, player.hp + 15); player.hullTier += 1; } },
    { id: 'rocket', tier: 'rocketTier', icon: '▲', nameKey: 'upgrade.rocket.name', descriptionKey: 'upgrade.rocket.description', detailKey: 'upgrade.rocket.detail', apply: () => { player.rocketDamage *= 1.22; player.rocketTier += 1; } },
    { id: 'cooling', tier: 'coolingTier', icon: '❄', nameKey: 'upgrade.cooling.name', descriptionKey: 'upgrade.cooling.description', detailKey: 'upgrade.cooling.detail', apply: () => { player.rocketMax *= .9; player.boostMax *= .9; player.coolingTier += 1; } },
    { id: 'salvage', icon: 'XP', nameKey: 'upgrade.salvage.name', descriptionKey: 'upgrade.salvage.description', detailKey: 'upgrade.salvage.detail', apply: () => { player.salvage *= 1.18; } },
    { id: 'multi', icon: 'III', nameKey: 'upgrade.multi.name', descriptionKey: 'upgrade.multi.description', detailKey: 'upgrade.multi.detail', apply: () => { player.multiShot = Math.min(3, player.multiShot + 1); player.multiUpgradeLevel = Math.floor(player.level / 4) * 4; } },
    { id: 'gate', icon: 'AEG', nameKey: 'upgrade.gate.name', descriptionKey: 'upgrade.gate.description', detailKey: 'upgrade.gate.detail', apply: () => { gateShields = Math.min(5, gateShields + 1); } },
  ];

  function upgradeSummary(upgrade) {
    switch (upgrade.id) {
      case 'damage': return { current: `${t('label.damage')} ${player.damage.toFixed(1)}`, effect: `→ ${(player.damage * 1.18).toFixed(1)} · +18%` };
      case 'rate': return { current: `${t('label.fireRate')} ${player.fireRate.toFixed(1)}/S`, effect: `→ ${(player.fireRate * 1.14).toFixed(1)}/S · +14%` };
      case 'speed': return { current: `${t('label.speed')} ${Math.round(player.speed)}`, effect: `→ ${Math.round(player.speed * 1.1)} · +10%` };
      case 'hull': return { current: `${t('label.maxHull')} ${Math.round(player.maxHp)}`, effect: `→ ${Math.round(player.maxHp + 15)} · +15` };
      case 'rocket': return { current: `${t('label.rocketDamage')} ${Math.round(player.rocketDamage)}`, effect: `→ ${Math.round(player.rocketDamage * 1.22)} · +22%` };
      case 'cooling': return { current: `${t('label.rocket')} ${player.rocketMax.toFixed(1)}S · ${t('label.jump')} ${player.boostMax.toFixed(1)}S`, effect: `→ ${(player.rocketMax * .9).toFixed(1)}S · ${(player.boostMax * .9).toFixed(1)}S · -10%` };
      case 'salvage': return { current: `${t('label.resourceXp')} ×${player.salvage.toFixed(2)}`, effect: `→ ×${(player.salvage * 1.18).toFixed(2)} · +18%` };
      case 'multi': return { current: `${t('label.shots')} ${player.multiShot}`, effect: `→ ${player.multiShot + 1} · +1` };
      case 'gate': return { current: `${t('label.gateShields')} ${gateShields}/5`, effect: `→ ${Math.min(5, gateShields + 1)}/5 · +1` };
      default: return { current: '', effect: t(upgrade.detailKey) };
    }
  }

  function eligibleUpgrades() {
    const nextMultiLevel = Math.max(4, (Math.floor(Number(player.multiUpgradeLevel) / 4) * 4) + 4);
    return UPGRADES.filter((upgrade) => (!upgrade.tier || player[upgrade.tier] < 7)
      && (upgrade.id !== 'multi' || (player.multiShot < 3 && player.level >= nextMultiLevel)));
  }

  function showUpgradeChoices() {
    mode = 'upgrade';
    ui.crosshair.style.opacity = '0';
    ui.lockReadout.classList.remove('active');
    const eligible = eligibleUpgrades();
    const pool = eligible.filter((upgrade) => upgrade.id !== lastSelectedUpgradeId);
    if (!pool.length) pool.push(...eligible);
    const choices = [];
    while (choices.length < 3 && pool.length) choices.push(pool.splice((Math.random() * pool.length) | 0, 1)[0]);
    ui.upgradeChoices.replaceChildren();
    choices.forEach((upgrade) => {
      const button = document.createElement('button');
      const summary = upgradeSummary(upgrade);
      button.className = 'upgrade-choice';
      button.type = 'button';
      button.innerHTML = `<span class="upgrade-icon">${upgrade.icon}</span><strong>${t(upgrade.nameKey)}</strong><p>${t(upgrade.descriptionKey)}</p><small><span>${t('label.current')} // ${summary.current}</span><b>${t('label.upgrade')} // ${summary.effect}</b></small>`;
      button.addEventListener('click', () => selectUpgrade(upgrade));
      ui.upgradeChoices.append(button);
    });
    ui.upgradeOverlay.classList.add('active');
    audio.tone(330, .35, 'sine', .06, 330);
  }

  function selectUpgrade(upgrade) {
    upgrade.apply();
    lastSelectedUpgradeId = upgrade.id;
    pendingLevelUps -= 1;
    ui.upgradeOverlay.classList.remove('active');
    showToast(t('toast.upgradeInstalled', { upgrade: t(upgrade.nameKey) }));
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
    const completedLevel = translateLevel(LEVELS[currentLevel]);
    ui.sectorTitle.textContent = completedLevel.name;
    ui.sectorCopy.textContent = completedLevel.next;
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
    showToast(t('toast.multipleApproaches', { sector: translateLevel(LEVELS[currentLevel]).name }));
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
    ui.endKicker.textContent = victory ? t('end.secured') : reason === 'ship' ? t('end.pilotLost') : t('end.defenseOffline');
    ui.endTitle.textContent = victory ? t('end.victoryTitle') : reason === 'ship' ? t('end.shipLostTitle') : t('end.gateLostTitle');
    ui.endCopy.textContent = victory
      ? t('end.victoryCopy')
      : reason === 'ship'
        ? t('end.shipLostCopy')
        : t('end.gateLostCopy');
    ui.finalScore.textContent = formatScore(score);
    ui.finalWave.textContent = `${translateLevel(LEVELS[currentLevel]).short} · ${wave}`;
    ui.finalKills.textContent = String(kills);
    const retryAvailable = !victory && stageCheckpoint?.level === currentLevel && stageCheckpoint.stage === wave;
    ui.playAgainLabel.textContent = victory ? t('end.flyAgain') : t('end.startBeginning');
    ui.retryStageButton.hidden = !retryAvailable;
    if (retryAvailable) ui.retryStageLabel.textContent = t('end.retryStage', { stage: String(stageCheckpoint.stage).padStart(2, '0') });
    ui.endOverlay.classList.add('active');
    audio.tone(victory ? 220 : 55, .8, victory ? 'sine' : 'sawtooth', .1, victory ? 440 : -25);
  }

  const tutorialSteps = [
    { titleKey: 'tutorial.takeControls', textKey: 'tutorial.takeControlsCopy' },
    { titleKey: 'tutorial.testBlaster', textKey: 'tutorial.testBlasterCopy' },
    { titleKey: 'tutorial.salvage', textKey: 'tutorial.salvageCopy' },
    { titleKey: 'tutorial.punchVoid', textKey: 'tutorial.punchVoidCopy' },
    { titleKey: 'tutorial.armWarhead', textKey: 'tutorial.armWarheadCopy' },
    { titleKey: 'tutorial.defendGate', textKey: 'tutorial.defendGateCopy' },
  ];

  function updateTutorialCard() {
    const step = tutorialSteps[tutorialIndex];
    if (!step) return;
    ui.tutorialStep.textContent = t('tutorial.step', { step: String(tutorialIndex + 1).padStart(2, '0') });
    ui.tutorialTitle.textContent = t(step.titleKey);
    ui.tutorialText.textContent = t(step.textKey);
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
      showToast(t('toast.trainingComplete'));
    }
  }
