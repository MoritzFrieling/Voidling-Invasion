  // Account, leaderboard, settings, and level-select actions.
  let adminLoginOnly = false;

  function setAuthMode(nextMode) {
    authMode = nextMode;
    const signedIn = Boolean(activePilot) && nextMode === 'summary';
    ui.authTabs.hidden = signedIn || nextMode === 'upgrade' || adminLoginOnly;
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

    if (nextMode === 'signin' && adminLoginOnly) {
      ui.authTitle.textContent = 'ADMIN ACCESS';
      ui.authCopy.textContent = 'Sign in with the private administrator callsign to unlock every sector and test-only access.';
      ui.authHint.textContent = 'Administrator runs never submit a highscore.';
      ui.authSubmit.querySelector('span').textContent = 'SIGN IN AS ADMIN';
      ui.authPassword.autocomplete = 'current-password';
    } else if (nextMode === 'signin') {
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
    } else if (adminLoginOnly) {
      ui.authTitle.textContent = 'ADMIN CONSOLE';
      ui.authCopy.textContent = 'Administrator tools are active. This pilot can access every sector, but runs are excluded from highscores.';
    } else {
      ui.authTitle.textContent = 'PILOT ACCOUNT';
      ui.authCopy.textContent = activePilot?.isGuest
        ? 'This guest session is saved to the cloud but cannot be recovered after sign-out.'
        : 'Your campaign progress and best score synchronize through the pilot network.';
    }
  }

  function openAccount(requestedMode = null, adminOnly = false) {
    adminLoginOnly = adminOnly;
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
    adminLoginOnly = false;
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
    if (cloudBusy) return;
    const requested = String(ui.publicUsername?.value || '').trim();
    const username = requested || `pilot_${Math.random().toString(36).slice(2, 10)}`;
    ui.publicUsername.value = username;
    if (!window.VoidlineCloud) {
      activatePilot({ id: null, username, isGuest: true, isAdmin: false }).then(action);
      return;
    }
    cloudBusy = true;
    ui.publicUsername.disabled = true;
    ui.publicUsernameHint.textContent = `CONNECTING AS ${username.toUpperCase()}…`;
    Promise.resolve()
      .then(() => window.VoidlineCloud.init())
      .then((pilot) => pilot || window.VoidlineCloud.playAsGuest(username))
      .then((pilot) => activatePilot(pilot))
      .then(() => action())
      .catch((error) => {
        const message = error.message || 'Guest flight could not be started.';
        if (/unreachable|network|setup|required|connecting|loaded|anonymous sign-ins/i.test(message)) {
          activatePilot({ id: null, username, isGuest: true, isAdmin: false }).then(action);
          ui.publicUsernameHint.textContent = 'LOCAL FLIGHT · CLOUD SAVE WILL RESUME WHEN AVAILABLE';
        } else {
          ui.publicUsernameHint.textContent = message;
        }
      })
      .finally(() => {
        cloudBusy = false;
        ui.publicUsername.disabled = false;
      });
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
      ui.publicUsernameHint.textContent = 'CLOUD SAVE UNAVAILABLE · LOCAL FLIGHT READY';
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
