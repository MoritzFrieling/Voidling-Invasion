  // Guest launch, admin access, leaderboard, settings, and level-select actions.
  const CALLSIGN_PREFIXES = ['nova', 'void', 'lunar', 'solar', 'orbit', 'rift', 'astro', 'comet'];
  const CALLSIGN_SUFFIXES = ['hawk', 'fox', 'ace', 'lancer', 'raven', 'drift', 'spark', 'guard'];

  function generateCallsign() {
    const prefix = pick(CALLSIGN_PREFIXES);
    const suffix = pick(CALLSIGN_SUFFIXES);
    return `${prefix}_${suffix}_${Math.floor(rand(10, 100))}`;
  }

  function prepareDefaultCallsign() {
    if (!ui.publicUsername.value.trim()) ui.publicUsername.value = generateCallsign();
  }

  function readCallsign() {
    const username = String(ui.publicUsername.value || '').trim().toLowerCase() || generateCallsign();
    ui.publicUsername.value = username;
    const hasFlexibleLetters = /[가-힣äöüß]/u.test(username);
    if (!/^(?:[a-z0-9_äöüß]|[가-힣]){2,20}$/u.test(username) || (!hasFlexibleLetters && username.length < 3)) {
      throw new Error(t('account.callsignInvalid'));
    }
    return username;
  }

  function renderAdminPanel() {
    const signedIn = isAdminPilot();
    ui.authForm.hidden = signedIn;
    ui.pilotSummary.hidden = !signedIn;
    ui.authForm.classList.remove('busy');
    ui.authMessage.textContent = '';
    ui.authMessage.classList.remove('success');
    ui.authPassword.value = '';
    ui.authTitle.textContent = signedIn ? t('account.adminConsole') : t('account.adminAccess');
    ui.authCopy.textContent = signedIn
      ? t('account.adminCopy')
      : t('account.signInCopy');
  }

  function openAdminAccess() {
    accountReturnMode = mode;
    if (mode === 'playing') mode = 'paused';
    hideOverlays();
    ui.crosshair.style.opacity = '0';
    renderAdminPanel();
    ui.authOverlay.classList.add('active');
    if (!isAdminPilot()) setTimeout(() => ui.authUsername.focus(), 30);
  }

  function closeAdminAccess() {
    ui.authOverlay.classList.remove('active');
    if (['playing', 'paused'].includes(accountReturnMode)) {
      mode = 'paused';
      ui.pauseOverlay.classList.add('active');
    } else {
      mode = 'menu';
      ui.startOverlay.classList.add('active');
    }
  }

  async function requirePilot(action) {
    let username;
    try {
      username = readCallsign();
    } catch (error) {
      ui.publicUsernameHint.textContent = error.message;
      ui.publicUsernameHint.classList.add('active');
      ui.publicUsername.focus();
      return;
    }
    if (activePilot) {
      if (activePilot.isGuest && username !== activePilot.username) {
        if (activePilot.id && window.VoidlineCloud) {
          if (cloudBusy) return;
          cloudBusy = true;
          ui.publicUsername.disabled = true;
          try {
            activePilot = await window.VoidlineCloud.updateGuestUsername(username);
            updatePilotUi();
          } catch (error) {
            ui.publicUsernameHint.textContent = error.message || t('account.callsignChanged');
            ui.publicUsernameHint.classList.add('active');
            return;
          } finally {
            cloudBusy = false;
            ui.publicUsername.disabled = false;
          }
        } else {
          activePilot.username = username;
          updatePilotUi();
        }
      }
      action();
      return;
    }
    if (cloudBusy) return;
    if (!window.VoidlineCloud) {
      await activatePilot({ id: null, username, isGuest: true, isAdmin: false });
      action();
      return;
    }
    cloudBusy = true;
    ui.publicUsername.disabled = true;
    ui.publicUsernameHint.textContent = t('account.connectingAs', { username: username.toUpperCase() });
    ui.publicUsernameHint.classList.add('active');
    try {
      const currentPilot = await window.VoidlineCloud.init();
      const pilot = currentPilot || await window.VoidlineCloud.playAsGuest(username);
      await activatePilot(pilot);
      ui.publicUsernameHint.textContent = '';
      ui.publicUsernameHint.classList.remove('active');
      action();
    } catch (error) {
      const message = error.message || t('account.guestStartFailed');
      if (/unreachable|network|setup|required|connecting|loaded|anonymous sign-ins/i.test(message)) {
        await activatePilot({ id: null, username, isGuest: true, isAdmin: false });
        ui.publicUsernameHint.textContent = t('account.localFlight');
        ui.publicUsernameHint.classList.add('active');
        action();
      } else {
        ui.publicUsernameHint.textContent = message;
        ui.publicUsernameHint.classList.add('active');
      }
    } finally {
      cloudBusy = false;
      ui.publicUsername.disabled = false;
    }
  }

  async function submitAdminForm(event) {
    event.preventDefault();
    if (!window.VoidlineCloud) {
      ui.authMessage.textContent = t('account.networkLoadFailed');
      return;
    }
    if (cloudBusy) return;
    const username = ui.authUsername.value;
    const password = ui.authPassword.value;
    cloudBusy = true;
    ui.authForm.classList.add('busy');
    ui.authMessage.textContent = t('account.contacting');
    try {
      await window.VoidlineCloud.init();
      const pilot = await window.VoidlineCloud.signInAdmin(username, password);
      await activatePilot(pilot);
      ui.authMessage.textContent = t('account.linkEstablished');
      ui.authMessage.classList.add('success');
      setTimeout(closeAdminAccess, 260);
    } catch (error) {
      ui.authMessage.textContent = error.message || t('account.accessFailed');
    } finally {
      cloudBusy = false;
      ui.authForm.classList.remove('busy');
    }
  }

  async function signOutAdmin() {
    if (!isAdminPilot() || cloudBusy) return;
    cloudBusy = true;
    try {
      await window.VoidlineCloud.signOut();
      await activatePilot(null);
      prepareDefaultCallsign();
      renderAdminPanel();
    } catch (error) {
      ui.pilotSyncState.textContent = error.message || t('account.signOutFailed');
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
    ui.leaderboardList.innerHTML = `<p class="leaderboard-empty">${t('leaderboard.connecting')}</p>`;
    try {
      const entries = await window.VoidlineCloud.getLeaderboard(12);
      ui.leaderboardList.replaceChildren();
      if (!entries.length) {
        ui.leaderboardList.innerHTML = `<p class="leaderboard-empty">${t('account.recordsEmpty')}</p>`;
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
        detail.textContent = t('leaderboard.detail', { guest: entry.is_guest ? t('leaderboard.guest') : '', level: entry.level_reached, stage: entry.stage_reached, kills: entry.kills });
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
      message.textContent = error.message || t('account.leaderboardUnavailable');
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
      if (ui.authOverlay.classList.contains('active')) renderAdminPanel();
    } catch (error) {
      ui.publicUsernameHint.textContent = t('account.cloudUnavailable');
      ui.publicUsernameHint.classList.add('active');
      ui.pilotSyncState.textContent = t('account.cloudSetup');
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
      const localizedLevel = translateLevel(level);
      const paths = level.paths.length === 1 ? t('level.oneApproach') : t('level.approaches', { count: level.paths.length });
      const descriptionKey = ['level.oneDescription', 'level.twoDescription', 'level.threeDescription', 'level.fourDescription'][index];
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `level-card${unlocked ? '' : ' locked'}`;
      card.dataset.index = String(index + 1).padStart(2, '0');
      card.disabled = !unlocked;
      card.innerHTML = `
        <span class="level-status">${adminAccess ? t('level.adminAccess') : unlocked ? completed ? t('level.cleared') : t('level.unlocked') : t('level.locked')}</span>
        <h3>${localizedLevel.name}</h3>
        <p>${t(descriptionKey)}</p>
        <footer><span>${t('level.stagesApproaches', { stages: level.stages, paths })}</span><span class="checkpoint-note">${t('level.checkpoint', { level: checkpoint.level || 1, credits: checkpoint.credits || 0 })}</span></footer>`;
      if (unlocked) card.addEventListener('click', () => startGame(false, index));
      ui.levelChoices.append(card);
    });
    updateLevelSlider();
  }

  function updateLevelSlider() {
    const maxScroll = Math.max(0, ui.levelChoices.scrollWidth - ui.levelChoices.clientWidth);
    ui.levelSlider.max = String(Math.max(1, Math.ceil(maxScroll)));
    ui.levelSlider.value = String(Math.round(Math.min(maxScroll, ui.levelChoices.scrollLeft)));
    ui.levelSlider.parentElement.hidden = maxScroll < 1;
  }

  function openLevelSelect() {
    renderLevelSelect();
    mode = 'levelSelect';
    hideOverlays();
    ui.levelSelectOverlay.classList.add('active');
    updateLevelSlider();
    ui.crosshair.style.opacity = '0';
  }

  function closeLevelSelect() {
    mode = 'menu';
    ui.levelSelectOverlay.classList.remove('active');
    ui.startOverlay.classList.add('active');
  }
