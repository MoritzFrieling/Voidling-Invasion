  // Localized player-facing copy. Add a locale here; game code only refers to keys.
  const LANGUAGE_STORAGE_KEY = 'voidline-language';
  const TRANSLATIONS = {
    en: {
      'language.label': 'Language', 'brand.network': 'EARTH DEFENSE NETWORK - FRONTIER LUNA', 'aria.gameWorld': 'Voidline Invasion game world', 'aria.gameStatus': 'Game status', 'aria.shipStatus': 'Ship status', 'aria.sectorMinimap': 'Sector minimap', 'aria.abilities': 'Weapons and abilities', 'aria.upgradeTiers': 'Installed ship upgrade tiers',
      'aria.adminAccess': 'Open admin access', 'aria.pause': 'Pause game', 'aria.closeLevelSelect': 'Close level selection', 'aria.closeSettings': 'Close settings', 'aria.closeAdmin': 'Close admin access', 'aria.closeLeaderboard': 'Close leaderboard',
      'tooltip.adminAccess': 'Admin access', 'tooltip.flightSpeed': 'Flight speed', 'tooltip.blasterDamage': 'Blaster damage', 'tooltip.fireRate': 'Fire rate', 'tooltip.hullStrength': 'Hull strength', 'tooltip.rocketPower': 'Rocket power', 'tooltip.systemCooling': 'System cooling',
      'hud.hull': 'HULL', 'hud.level': 'LVL', 'hud.earthGate': 'EARTH GATE', 'hud.salvageCredits': 'SALVAGE CREDITS',
      'hud.sectorDefense': 'SECTOR DEFENSE', 'hud.wave': 'WAVE', 'hud.standby': 'STANDBY', 'hud.score': 'SCORE', 'hud.best': 'BEST',
      'hud.tacticalMap': 'TACTICAL MAP', 'hud.live': 'LIVE', 'hud.you': 'YOU', 'hud.hostile': 'HOSTILE', 'hud.gate': 'GATE',
      'hud.gateProximity': 'GATE PROXIMITY ALERT', 'hud.targetLocked': 'TARGET LOCKED', 'hud.staticDrain': 'STATIC SIGNATURE // HULL DRAIN',
      'hud.callNextWave': 'CALL NEXT WAVE', 'hud.shipModules': 'SHIP MODULES',
      'ability.blaster': 'BLASTER', 'ability.ready': 'READY', 'ability.heavyRocket': 'HEAVY ROCKET', 'ability.voidJump': 'VOID JUMP', 'ability.station': 'DEFENSE STATION',
      'menu.beginDefense': 'BEGIN DEFENSE', 'menu.trainingRun': 'TRAINING RUN', 'menu.levelSelect': 'LEVEL SELECT', 'menu.topPilots': 'TOP PILOTS', 'menu.ranksShortcut': 'RANKS',
      'menu.intro': "Three sectors stand between the invasion fleet and Earth. Intercept every formation, salvage void ore, and protect Earth's last stronghold.",
      'menu.callsignAria': 'Callsign', 'menu.callsignTitle': '3–20 characters, or 2–20 when using Korean letters. Used for saves and the highscore board.',
      'menu.flightBriefing': 'FLIGHT BRIEFING', 'menu.flyFreely': 'Fly freely', 'menu.fireBlaster': 'Fire blaster', 'menu.chargeRocket': 'Charge heavy rocket',
      'menu.placeJump': 'Place jump destination', 'menu.voidJumpRecharge': 'Void jump — recharges', 'menu.buildStation': 'Build / upgrade station', 'menu.precisionFlight': 'Precision flight',
      'menu.controls': 'CONTROLS', 'menu.settings': 'SETTINGS', 'menu.inspirations': 'GAMEPLAY INSPIRATIONS', 'menu.skyRushCredit': 'SkyRush — created by a friend',
      'level.archive': 'CAMPAIGN ARCHIVE', 'level.chooseSector': 'CHOOSE A SECTOR', 'level.copy': 'Replaying a sector restores the ship and resources saved when that sector was first unlocked.',
      'pause.kicker': 'FLIGHT SUSPENDED', 'pause.title': 'PAUSED', 'pause.resume': 'RESUME', 'pause.settingsControls': 'SETTINGS & CONTROLS', 'pause.restart': 'RESTART RUN', 'pause.quit': 'QUIT TO TITLE',
      'settings.kicker': 'SHIP CONFIGURATION', 'settings.title': 'SETTINGS', 'settings.audioDisplay': 'AUDIO & DISPLAY', 'settings.music': 'MUSIC', 'settings.musicCopy': 'Procedural deep-space score',
      'settings.sfx': 'SOUND FX', 'settings.sfxCopy': 'Weapons, impacts, alerts', 'settings.shake': 'SCREEN SHAKE', 'settings.shakeCopy': 'Impact feedback',
      'settings.controls': 'CONTROLS', 'settings.flightVector': 'Flight vector', 'settings.fireForward': 'Fire forward', 'settings.aimFire': 'Aim & fire',
      'settings.heavyRocket': 'Heavy rocket', 'settings.placeJump': 'Place jump destination', 'settings.voidJump': 'Void jump', 'settings.station': 'Build / upgrade station',
      'settings.callWave': 'Call earned next wave', 'settings.precision': 'Precision flight', 'settings.pause': 'Pause',
      'intel.newHostile': 'NEW HOSTILE IDENTIFIED', 'intel.firstContact': 'FIRST CONTACT // HOSTILE PROFILE', 'intel.acknowledge': 'ACKNOWLEDGE', 'boss.commandSignature': 'COMMAND SIGNATURE DETECTED', 'boss.engage': 'ENGAGE NOW',
      'sector.secured': 'SECTOR SECURED', 'sector.fieldRepair': 'FIELD REPAIR', 'sector.hullReward': '+35% HULL', 'sector.gateSupport': 'GATE SUPPORT', 'sector.shieldReward': '+1 SHIELD', 'sector.next': 'ENTER NEXT SECTOR',
      'upgrade.kicker': 'POWER SIGNATURE INCREASED', 'upgrade.title': 'CHOOSE AN UPGRADE', 'upgrade.copy': 'Your ship can safely integrate one recovered module.',
      'end.score': 'SCORE', 'end.progress': 'PROGRESS', 'end.hostiles': 'HOSTILES', 'end.flyAgain': 'FLY AGAIN', 'end.startBeginning': 'START FROM BEGINNING', 'end.retryStage': 'START FROM STAGE {stage}', 'end.returnTitle': 'RETURN TO TITLE',
      'auth.kicker': 'VOIDLINE ADMIN CONSOLE', 'auth.admin': 'ADMIN', 'auth.access': 'ADMIN ACCESS', 'auth.username': 'USERNAME', 'auth.password': 'PASSWORD',
      'auth.hint': 'Admin runs unlock every sector and never submit highscores.', 'auth.signIn': 'SIGN IN AS ADMIN', 'auth.signOut': 'SIGN OUT',
      'leaderboard.kicker': 'EARTH DEFENSE RECORDS', 'leaderboard.title': 'TOP PILOTS', 'leaderboard.copy': 'The strongest run from each pilot is shown.',
      'leaderboard.connecting': 'CONTACTING DEFENSE NETWORK…', 'tutorial.skip': 'SKIP TRAINING', 'rotate': 'For the best flight view, rotate your device to landscape.',
      'sector.one.name': 'OUTER PERIMETER', 'sector.one.short': 'SECTOR 01', 'sector.one.next': 'The route ahead has split. Hostiles are regrouping around twin approach corridors.',
      'sector.two.name': 'TWIN RIFT', 'sector.two.short': 'SECTOR 02', 'sector.two.next': 'A shattered approach lies ahead. Three lanes and unstable wormholes converge on Earth.',
      'sector.three.name': 'SHATTERED APPROACH', 'sector.three.short': 'SECTOR 03',
      'enemy.scout.name': 'DART FIGHTER', 'enemy.scout.role': 'VERY FAST // LIGHT HULL', 'enemy.scout.description': 'Quick attack craft with very little armor. Track it early before it slips through.',
      'enemy.raider.name': 'MARAUDER', 'enemy.raider.role': 'BALANCED // ARMORED', 'enemy.raider.description': 'Reliable frontline ship. Slower than a Dart, but it can absorb sustained blaster fire.',
      'enemy.striker.name': 'NEEDLE', 'enemy.striker.role': 'EXTREME SPEED // FRAGILE', 'enemy.striker.description': 'A tiny interceptor built entirely around speed. Its erratic lane changes make it hard to track.',
      'enemy.major.name': 'SIEGEBREAKER', 'enemy.major.role': 'HEAVY HULL // MISSILES', 'enemy.major.description': 'A slow assault vessel that launches guided rockets at your ship. Keep moving.',
      'enemy.interceptor.name': 'CARRIER INTERCEPTOR', 'enemy.interceptor.role': 'LAUNCHED // DESTRUCTIBLE', 'enemy.interceptor.description': 'A light interceptor launched by carrier vessels. Destroy it before it reaches the gate.',
      'enemy.carrier.name': 'BROOD CARRIER', 'enemy.carrier.role': 'SPAWNER // HEAVY HULL', 'enemy.carrier.description': 'A mobile hangar that launches smaller fighters along the route. Destroy it before the swarm grows.',
      'enemy.sentinel.name': 'AEGIS SENTINEL', 'enemy.sentinel.role': 'ROCKET-BREAK SHIELD', 'enemy.sentinel.description': 'Light blasters cannot pierce its barrier. Two heavy-rocket impacts collapse the barrier.',
      'enemy.bossOmega.name': 'DREADNOUGHT OMEGA', 'enemy.bossOmega.role': 'MISSILE COMMAND SHIP', 'enemy.bossOmega.description': 'The first invasion commander. It saturates the defense zone with guided warheads.',
      'enemy.bossCarrier.name': 'THE HOLLOW QUEEN', 'enemy.bossCarrier.role': 'RIFT CARRIER // SWARM COMMAND', 'enemy.bossCarrier.description': 'A vast carrier that continuously deploys escort wings through the twin rift.',
      'enemy.bossTitan.name': 'AEGIS TITAN', 'enemy.bossTitan.role': 'ROCKET-BREAK SHIELD // FINAL COMMAND', 'enemy.bossTitan.description': 'Heavy rockets collapse its shield and leave the command ship exposed.',
      'upgrade.damage.name': 'Overcharged Bolts', 'upgrade.damage.description': 'Blaster damage increases by 18%.', 'upgrade.damage.detail': 'DAMAGE +18%',
      'upgrade.rate.name': 'Flux Repeater', 'upgrade.rate.description': 'Blaster cycles 14% faster.', 'upgrade.rate.detail': 'FIRE RATE +14%',
      'upgrade.speed.name': 'Vector Thrusters', 'upgrade.speed.description': 'Flight speed and acceleration improve.', 'upgrade.speed.detail': 'SPEED +10%',
      'upgrade.hull.name': 'Reactive Plating', 'upgrade.hull.description': 'Increase maximum hull and restore a little hull.', 'upgrade.hull.detail': 'MAX HULL +15',
      'upgrade.rocket.name': 'Siege Warhead', 'upgrade.rocket.description': 'Heavy rockets deal more blast damage.', 'upgrade.rocket.detail': 'ROCKET +22%',
      'upgrade.cooling.name': 'Cryo Manifold', 'upgrade.cooling.description': 'Rocket and void jump systems reload faster.', 'upgrade.cooling.detail': 'COOLDOWNS -10%',
      'upgrade.salvage.name': 'Salvage Matrix', 'upgrade.salvage.description': 'Void ore yields more experience.', 'upgrade.salvage.detail': 'RESOURCE XP +18%',
      'upgrade.multi.name': 'Splitfire Array', 'upgrade.multi.description': 'Add a tightly grouped blaster shot. Offered every four levels.', 'upgrade.multi.detail': '+1 SHOT · EVERY 4 LVL',
      'upgrade.gate.name': 'Gate Capacitor', 'upgrade.gate.description': 'Send a recovered charge to Earth.', 'upgrade.gate.detail': 'GATE SHIELD +1',
      'label.current': 'CURRENT', 'label.upgrade': 'UPGRADE', 'label.damage': 'DAMAGE', 'label.fireRate': 'FIRE RATE', 'label.speed': 'SPEED', 'label.maxHull': 'MAX HULL', 'label.rocketDamage': 'ROCKET DMG', 'label.rocket': 'ROCKET', 'label.jump': 'JUMP', 'label.resourceXp': 'RESOURCE XP', 'label.shots': 'SHOTS', 'label.gateShields': 'GATE SHIELDS',
      'status.stage': 'STAGE {stage} / {total}', 'status.waveActive': 'WAVE {current}/{total} · {hostiles} HOSTILES', 'status.waveClear': 'WAVE {current}/{total} CLEAR',
      'status.charging': 'CHARGING', 'status.jumpReady': 'JUMP READY · T {seconds}S', 'status.replaceClear': 'T TAP REPLACE · HOLD CLEAR', 'status.placeDestination': 'T PLACE DEST',
      'status.maximumPower': 'MAXIMUM POWER', 'status.stationLimit': 'STATION LIMIT', 'status.toUpgrade': '{cost} ◈ TO UPGRADE', 'status.toBuild': '{cost} ◈ TO BUILD', 'status.portalShields': '{count} portal shields',
      'toast.trainingLink': 'TRAINING LINK ACTIVE', 'toast.rapidClear': 'RAPID CLEAR // +{xp} XP', 'toast.lockConfirmed': 'LOCK CONFIRMED // {enemy}', 'toast.rocketCharging': 'HEAVY ROCKET CHARGING // NO LOCK',
      'toast.destinationSet': 'VOID DESTINATION SET', 'toast.destinationCleared': 'VOID DESTINATION CLEARED // DASH RESTORED', 'toast.jumpedAhead': 'JUMPED AHEAD // PRESS T TO SET A DESTINATION',
      'toast.carrierWing': 'CARRIER WING DEPLOYED', 'toast.carrierLaunch': 'BROOD CARRIER LAUNCHED INTERCEPTORS', 'toast.gateHit': ({ count }) => `GATE HIT // ${count} SHIELD${count === 1 ? '' : 'S'} REMAIN`, 'toast.gateBreached': 'EARTH GATE BREACHED',
      'toast.slowDock': 'SLOW DOWN TO DOCK', 'toast.stationMax': 'STATION AT MAXIMUM POWER', 'toast.upgradeRequires': 'UPGRADE REQUIRES {cost} SALVAGE CREDITS', 'toast.stationUpgraded': 'STATION UPGRADED // MK {level}',
      'toast.stationLimit': 'STATION LIMIT REACHED', 'toast.needCredits': 'NEED {cost} SALVAGE CREDITS', 'toast.stationDeployed': 'FRIENDLY DEFENSE STATION DEPLOYED', 'toast.repairField': 'REPAIR FIELD // +{amount} HULL', 'toast.hullStable': 'HULL ALREADY STABLE',
      'toast.shieldRemaining': '{enemy} // {count} SHIELD CHARGES REMAIN', 'toast.shieldCollapsed': '{enemy} // SHIELD COLLAPSED', 'toast.carrierInterceptorDestroyed': 'CARRIER INTERCEPTOR DESTROYED',
      'toast.emergencyShield': '{enemy} // EMERGENCY SHIELD ONLINE', 'toast.aegisRecovered': 'AEGIS CORE RECOVERED // GATE +1', 'toast.upgradeInstalled': '{upgrade} INSTALLED',
      'toast.multipleApproaches': '{sector} // MULTIPLE APPROACH VECTORS', 'toast.trainingComplete': 'TRAINING COMPLETE // GOOD HUNTING', 'toast.trainingSkipped': 'TRAINING SKIPPED',
      'toast.commandEntering': 'COMMAND SHIP ENTERING THE VOIDLINE', 'toast.stageWave': 'STAGE {stage} // WAVE {wave} OF {total}',
      'floater.shielded': 'SHIELDED', 'floater.shieldCollapsed': 'SHIELD COLLAPSED', 'floater.shieldBroken': 'SHIELD BROKEN', 'floater.emergencyShield': 'EMERGENCY SHIELD', 'floater.missileIntercepted': 'MISSILE INTERCEPTED',
      'floater.collision': 'COLLISION', 'floater.hull': '{amount} HULL', 'floater.shield': 'SHIELD {current}/{total}', 'floater.gateShield': '+1 GATE SHIELD',
      'render.earthGate': 'EARTH GATE', 'render.station': 'DEFENSE STATION // MK {level}', 'render.upgradeAvailable': 'UPGRADE AVAILABLE', 'render.shield': 'SHIELD {amount}', 'render.finalStage': 'FINAL STAGE', 'render.hostileFormation': 'HOSTILE FORMATION DETECTED',
      'end.secured': 'CORRIDOR SECURED', 'end.pilotLost': 'PILOT SIGNAL LOST', 'end.defenseOffline': 'EARTH DEFENSE OFFLINE', 'end.victoryTitle': 'INVASION REPELLED', 'end.shipLostTitle': 'YOUR SHIP WAS LOST', 'end.gateLostTitle': 'THE GATE HAS FALLEN',
      'end.victoryCopy': 'Earth is safe. The invasion command signal has gone dark.', 'end.shipLostCopy': 'Your ship was destroyed before the final corridor could be secured.', 'end.gateLostCopy': 'The invasion fleet breached the last defense corridor.',
      'tutorial.step': 'TRAINING // {step}', 'tutorial.takeControls': 'TAKE THE CONTROLS', 'tutorial.takeControlsCopy': 'Use W, A, S, and D to move through the sector.', 'tutorial.testBlaster': 'TEST THE BLASTER', 'tutorial.testBlasterCopy': 'Press the Up Arrow to fire forward, or hold the left mouse button to aim and fire.',
      'tutorial.salvage': 'SALVAGE VOID ORE', 'tutorial.salvageCopy': 'Shoot the nearby ore cluster. Destroyed resources give XP for upgrades.', 'tutorial.punchVoid': 'PUNCH THE VOID', 'tutorial.punchVoidCopy': 'Press T to place or replace a jump destination, then Q or Space to teleport there. Hold T to clear it and dash again.',
      'tutorial.armWarhead': 'ARM THE WARHEAD', 'tutorial.armWarheadCopy': 'Press F. Heavy rockets charge briefly, then deal large blast damage.', 'tutorial.defendGate': 'DEFEND THE GATE', 'tutorial.defendGateCopy': 'Enemies follow the glowing corridor. Stop them before the Earth Gate loses every shield.',
      'account.adminAccess': 'ADMIN ACCESS', 'account.adminConsole': 'ADMIN CONSOLE', 'account.adminCopy': 'Administrator tools are active. Every sector is unlocked and runs are excluded from highscores.', 'account.signInCopy': 'Sign in with the private administrator account to unlock testing access.',
      'account.adminPilot': 'ADMIN PILOT · HIGHSCORE DISABLED', 'account.guestPilot': 'GUEST PILOT · DEVICE SESSION', 'account.pending': 'CHANGES PENDING', 'account.syncing': 'SYNCHRONIZING…', 'account.saveCurrent': 'CLOUD SAVE CURRENT', 'account.offlineSaved': 'OFFLINE · SAVED ON DEVICE',
      'account.offlineDevice': 'OFFLINE · USING DEVICE SAVE', 'account.cloudLoaded': 'CLOUD SAVE LOADED', 'account.uploading': 'UPLOADING DEVICE SAVE…', 'account.deviceLoaded': 'DEVICE SAVE LOADED', 'account.importing': 'IMPORTING EXISTING PROGRESS…', 'account.cloudCreated': 'NEW CLOUD SAVE CREATED',
      'account.callsignInvalid': 'Use 3–20 characters, or 2–20 when using Korean letters.', 'account.callsignChanged': 'The callsign could not be changed.', 'account.connectingAs': 'CONNECTING AS {username}…', 'account.localFlight': 'LOCAL FLIGHT · CLOUD SAVE WILL RESUME WHEN AVAILABLE', 'account.guestStartFailed': 'Guest flight could not be started.',
      'account.networkLoadFailed': 'The pilot network could not be loaded. Check your connection and refresh.', 'account.contacting': 'CONTACTING PILOT NETWORK…', 'account.linkEstablished': 'ADMIN LINK ESTABLISHED', 'account.accessFailed': 'Pilot access failed.', 'account.signOutFailed': 'SIGN OUT FAILED',
      'account.recordsEmpty': 'NO COMBAT RECORDS YET · SET THE FIRST SCORE', 'account.leaderboardUnavailable': 'LEADERBOARD UNAVAILABLE', 'account.cloudUnavailable': 'CLOUD SAVE UNAVAILABLE · LOCAL FLIGHT READY', 'account.cloudSetup': 'CLOUD SETUP REQUIRED',
      'level.oneApproach': '1 APPROACH', 'level.approaches': '{count} APPROACHES', 'level.adminAccess': 'ADMIN ACCESS', 'level.cleared': 'CLEARED', 'level.unlocked': 'UNLOCKED', 'level.locked': 'LOCKED', 'level.stagesApproaches': '{stages} STAGES · {paths}', 'level.checkpoint': 'SHIP LVL {level} · {credits} ◈', 'level.oneDescription': 'Single-route frontier defense.', 'level.twoDescription': 'Twin routes and unstable rift entries.', 'level.threeDescription': 'Three converging lanes and deep wormholes.',
      'leaderboard.detail': '{guest}SECTOR {level} · STAGE {stage} · {kills} KILLS', 'leaderboard.guest': 'GUEST · ',
    },
    ko: {
      'language.label': '언어', 'brand.network': '지구 방어 네트워크 - 프론티어 루나', 'aria.gameWorld': '보이드라인 인베이전 게임 화면', 'aria.gameStatus': '게임 상태', 'aria.shipStatus': '함선 상태', 'aria.sectorMinimap': '구역 미니맵', 'aria.abilities': '무기 및 능력', 'aria.upgradeTiers': '설치된 함선 업그레이드 단계',
      'aria.adminAccess': '관리자 접근 열기', 'aria.pause': '게임 일시 정지', 'aria.closeLevelSelect': '구역 선택 닫기', 'aria.closeSettings': '설정 닫기', 'aria.closeAdmin': '관리자 접근 닫기', 'aria.closeLeaderboard': '순위표 닫기',
      'tooltip.adminAccess': '관리자 접근', 'tooltip.flightSpeed': '비행 속도', 'tooltip.blasterDamage': '블래스터 피해', 'tooltip.fireRate': '연사력', 'tooltip.hullStrength': '선체 내구도', 'tooltip.rocketPower': '로켓 위력', 'tooltip.systemCooling': '시스템 냉각',
      'hud.hull': '선체', 'hud.level': '레벨', 'hud.earthGate': '지구 관문', 'hud.salvageCredits': '회수 크레딧',
      'hud.sectorDefense': '구역 방어', 'hud.wave': '웨이브', 'hud.standby': '대기', 'hud.score': '점수', 'hud.best': '최고',
      'hud.tacticalMap': '전술 지도', 'hud.live': '실시간', 'hud.you': '플레이어', 'hud.hostile': '적', 'hud.gate': '관문',
      'hud.gateProximity': '관문 근접 경보', 'hud.targetLocked': '표적 고정', 'hud.staticDrain': '정지 신호 // 선체 손상', 'hud.callNextWave': '다음 웨이브 호출', 'hud.shipModules': '함선 모듈',
      'ability.blaster': '블래스터', 'ability.ready': '준비', 'ability.heavyRocket': '중로켓', 'ability.voidJump': '보이드 점프', 'ability.station': '방어 기지',
      'menu.beginDefense': '방어 시작', 'menu.trainingRun': '훈련 시작', 'menu.levelSelect': '구역 선택', 'menu.topPilots': '최고 조종사', 'menu.ranksShortcut': '순위',
      'menu.intro': '침공 함대와 지구 사이에는 세 개의 구역이 있습니다. 모든 편대를 요격하고, 보이드 광물을 회수하여 지구 최후의 거점을 지키세요.',
      'menu.callsignAria': '호출부호', 'menu.callsignTitle': '3~20자이며, 한글을 사용하면 2~20자까지 가능합니다. 저장과 최고 점수판에 사용됩니다.',
      'menu.flightBriefing': '비행 브리핑', 'menu.flyFreely': '자유 비행', 'menu.fireBlaster': '블래스터 발사', 'menu.chargeRocket': '중로켓 충전',
      'menu.placeJump': '점프 목적지 설정', 'menu.voidJumpRecharge': '보이드 점프 — 재충전', 'menu.buildStation': '방어 기지 건설 / 업그레이드', 'menu.precisionFlight': '정밀 비행',
      'menu.controls': '조작법', 'menu.settings': '설정', 'menu.inspirations': '게임플레이 영감', 'menu.skyRushCredit': 'SkyRush — 개발자의 친구가 제작',
      'level.archive': '캠페인 기록', 'level.chooseSector': '구역 선택', 'level.copy': '구역을 다시 플레이하면 처음 해금했을 때 저장된 함선과 자원이 복원됩니다.',
      'pause.kicker': '비행 중단', 'pause.title': '일시 정지', 'pause.resume': '계속', 'pause.settingsControls': '설정 및 조작법', 'pause.restart': '다시 시작', 'pause.quit': '타이틀로',
      'settings.kicker': '함선 구성', 'settings.title': '설정', 'settings.audioDisplay': '오디오 및 화면', 'settings.music': '음악', 'settings.musicCopy': '절차적으로 생성되는 우주 음악',
      'settings.sfx': '효과음', 'settings.sfxCopy': '무기, 충돌, 경보', 'settings.shake': '화면 흔들림', 'settings.shakeCopy': '충격 피드백',
      'settings.controls': '조작법', 'settings.flightVector': '비행 방향', 'settings.fireForward': '전방 발사', 'settings.aimFire': '조준 및 발사',
      'settings.heavyRocket': '중로켓', 'settings.placeJump': '점프 목적지 설정', 'settings.voidJump': '보이드 점프', 'settings.station': '방어 기지 건설 / 업그레이드', 'settings.callWave': '획득한 다음 웨이브 호출', 'settings.precision': '정밀 비행', 'settings.pause': '일시 정지',
      'intel.newHostile': '새 적 식별', 'intel.firstContact': '첫 조우 // 적 정보', 'intel.acknowledge': '확인', 'boss.commandSignature': '지휘 신호 감지', 'boss.engage': '교전 시작',
      'sector.secured': '구역 확보', 'sector.fieldRepair': '현장 수리', 'sector.hullReward': '선체 +35%', 'sector.gateSupport': '관문 지원', 'sector.shieldReward': '방벽 +1', 'sector.next': '다음 구역 진입',
      'upgrade.kicker': '출력 신호 증가', 'upgrade.title': '업그레이드 선택', 'upgrade.copy': '회수한 모듈 하나를 함선에 안전하게 통합할 수 있습니다.',
      'end.score': '점수', 'end.progress': '진행', 'end.hostiles': '적', 'end.flyAgain': '다시 비행', 'end.startBeginning': '처음부터 시작', 'end.retryStage': '스테이지 {stage}부터 시작', 'end.returnTitle': '타이틀로',
      'auth.kicker': '보이드라인 관리자 콘솔', 'auth.admin': '관리자', 'auth.access': '관리자 접근', 'auth.username': '사용자 이름', 'auth.password': '비밀번호', 'auth.hint': '관리자 플레이는 모든 구역을 해금하며 최고 점수에 등록되지 않습니다.', 'auth.signIn': '관리자로 로그인', 'auth.signOut': '로그아웃',
      'leaderboard.kicker': '지구 방어 기록', 'leaderboard.title': '최고 조종사', 'leaderboard.copy': '각 조종사의 가장 높은 기록을 표시합니다.', 'leaderboard.connecting': '방어 네트워크 연결 중…', 'tutorial.skip': '훈련 건너뛰기', 'rotate': '최적의 비행 화면을 위해 기기를 가로로 돌리세요.',
      'sector.one.name': '외곽 방어선', 'sector.one.short': '구역 01', 'sector.one.next': '전방 항로가 갈라졌습니다. 적이 쌍둥이 접근 통로에 재집결하고 있습니다.',
      'sector.two.name': '쌍둥이 균열', 'sector.two.short': '구역 02', 'sector.two.next': '세 개의 항로와 불안정한 웜홀이 지구로 수렴합니다.',
      'sector.three.name': '파쇄된 접근로', 'sector.three.short': '구역 03',
      'enemy.scout.name': '다트 전투기', 'enemy.scout.role': '매우 빠름 // 경장갑', 'enemy.scout.description': '장갑이 거의 없는 빠른 공격기입니다. 빠져나가기 전에 일찍 추적하세요.',
      'enemy.raider.name': '약탈자', 'enemy.raider.role': '균형형 // 장갑', 'enemy.raider.description': '신뢰할 수 있는 전선 함선입니다. 다트보다 느리지만 지속 사격을 견딥니다.',
      'enemy.striker.name': '니들', 'enemy.striker.role': '초고속 // 약함', 'enemy.striker.description': '속도에 모든 것을 투자한 소형 요격기입니다. 예측하기 어려운 이동을 합니다.',
      'enemy.major.name': '시즈브레이커', 'enemy.major.role': '중장갑 // 미사일', 'enemy.major.description': '유도 로켓을 발사하는 느린 강습함입니다. 계속 움직이세요.',
      'enemy.interceptor.name': '캐리어 요격기', 'enemy.interceptor.role': '발진 // 파괴 가능', 'enemy.interceptor.description': '캐리어에서 발진하는 경량 요격기입니다. 관문에 도달하기 전에 파괴하세요.',
      'enemy.carrier.name': '브루드 캐리어', 'enemy.carrier.role': '생산함 // 중장갑', 'enemy.carrier.description': '항로를 따라 전투기를 발진시키는 이동식 격납고입니다. 군집이 커지기 전에 파괴하세요.',
      'enemy.sentinel.name': '이지스 센티널', 'enemy.sentinel.role': '로켓 파괴 방벽', 'enemy.sentinel.description': '경량 블래스터는 방벽을 관통하지 못합니다. 중로켓 두 발로 붕괴시킬 수 있습니다.',
      'enemy.bossOmega.name': '드레드노트 오메가', 'enemy.bossOmega.role': '미사일 지휘함', 'enemy.bossOmega.description': '첫 번째 침공 지휘관입니다. 유도 탄두로 방어 구역을 포화시킵니다.',
      'enemy.bossCarrier.name': '할로우 퀸', 'enemy.bossCarrier.role': '균열 캐리어 // 군집 지휘', 'enemy.bossCarrier.description': '쌍둥이 균열에서 호위대를 계속 전개하는 거대한 캐리어입니다.',
      'enemy.bossTitan.name': '이지스 타이탄', 'enemy.bossTitan.role': '로켓 파괴 방벽 // 최종 지휘', 'enemy.bossTitan.description': '중로켓으로 방벽을 무너뜨리면 지휘함이 노출됩니다.',
      'upgrade.damage.name': '과충전 볼트', 'upgrade.damage.description': '블래스터 피해가 18% 증가합니다.', 'upgrade.damage.detail': '피해 +18%',
      'upgrade.rate.name': '플럭스 리피터', 'upgrade.rate.description': '블래스터 연사력이 14% 빨라집니다.', 'upgrade.rate.detail': '연사력 +14%',
      'upgrade.speed.name': '벡터 추진기', 'upgrade.speed.description': '비행 속도와 가속도가 향상됩니다.', 'upgrade.speed.detail': '속도 +10%',
      'upgrade.hull.name': '반응 장갑', 'upgrade.hull.description': '최대 선체를 늘리고 선체를 조금 회복합니다.', 'upgrade.hull.detail': '최대 선체 +15',
      'upgrade.rocket.name': '공성 탄두', 'upgrade.rocket.description': '중로켓 폭발 피해가 증가합니다.', 'upgrade.rocket.detail': '로켓 +22%',
      'upgrade.cooling.name': '크라이오 매니폴드', 'upgrade.cooling.description': '로켓과 보이드 점프 시스템의 재장전이 빨라집니다.', 'upgrade.cooling.detail': '재사용 대기시간 -10%',
      'upgrade.salvage.name': '회수 매트릭스', 'upgrade.salvage.description': '보이드 광물에서 더 많은 경험치를 얻습니다.', 'upgrade.salvage.detail': '자원 경험치 +18%',
      'upgrade.multi.name': '분산 사격 배열', 'upgrade.multi.description': '촘촘한 블래스터 탄환을 하나 추가합니다. 네 레벨마다 제공됩니다.', 'upgrade.multi.detail': '탄환 +1 · 4레벨마다',
      'upgrade.gate.name': '관문 축전기', 'upgrade.gate.description': '회수한 전하를 지구로 전송합니다.', 'upgrade.gate.detail': '관문 방벽 +1',
      'label.current': '현재', 'label.upgrade': '업그레이드', 'label.damage': '피해', 'label.fireRate': '연사력', 'label.speed': '속도', 'label.maxHull': '최대 선체', 'label.rocketDamage': '로켓 피해', 'label.rocket': '로켓', 'label.jump': '점프', 'label.resourceXp': '자원 경험치', 'label.shots': '탄환', 'label.gateShields': '관문 방벽',
      'status.stage': '스테이지 {stage} / {total}', 'status.waveActive': '웨이브 {current}/{total} · 적 {hostiles}', 'status.waveClear': '웨이브 {current}/{total} 완료',
      'status.charging': '충전 중', 'status.jumpReady': '점프 준비 · T {seconds}초', 'status.replaceClear': 'T 짧게 교체 · 길게 해제', 'status.placeDestination': 'T 목적지 설정',
      'status.maximumPower': '최대 출력', 'status.stationLimit': '기지 한도', 'status.toUpgrade': '{cost} ◈ 업그레이드', 'status.toBuild': '{cost} ◈ 건설', 'status.portalShields': '관문 방벽 {count}',
      'toast.trainingLink': '훈련 연결 활성화', 'toast.rapidClear': '신속 격파 // +{xp} XP', 'toast.lockConfirmed': '고정 확인 // {enemy}', 'toast.rocketCharging': '중로켓 충전 // 고정 없음',
      'toast.destinationSet': '보이드 목적지 설정', 'toast.destinationCleared': '보이드 목적지 해제 // 대시 복원', 'toast.jumpedAhead': '전방 점프 // T로 목적지 설정',
      'toast.carrierWing': '캐리어 편대 전개', 'toast.carrierLaunch': '브루드 캐리어가 요격기를 발진', 'toast.gateHit': ({ count }) => `관문 피격 // 방벽 ${count}개 남음`, 'toast.gateBreached': '지구 관문 돌파',
      'toast.slowDock': '도킹하려면 감속하세요', 'toast.stationMax': '기지 최대 출력', 'toast.upgradeRequires': '업그레이드에 회수 크레딧 {cost} 필요', 'toast.stationUpgraded': '기지 업그레이드 // MK {level}',
      'toast.stationLimit': '기지 한도 도달', 'toast.needCredits': '회수 크레딧 {cost} 필요', 'toast.stationDeployed': '아군 방어 기지 배치', 'toast.repairField': '수리장 // 선체 +{amount}', 'toast.hullStable': '선체가 이미 안정적입니다',
      'toast.shieldRemaining': '{enemy} // 방벽 충전 {count}개 남음', 'toast.shieldCollapsed': '{enemy} // 방벽 붕괴', 'toast.carrierInterceptorDestroyed': '캐리어 요격기 파괴', 'toast.emergencyShield': '{enemy} // 비상 방벽 가동', 'toast.aegisRecovered': '이지스 코어 회수 // 관문 +1', 'toast.upgradeInstalled': '{upgrade} 설치 완료',
      'toast.multipleApproaches': '{sector} // 다중 접근 경로', 'toast.trainingComplete': '훈련 완료 // 행운을 빕니다', 'toast.trainingSkipped': '훈련 건너뜀', 'toast.commandEntering': '지휘함이 보이드라인에 진입', 'toast.stageWave': '스테이지 {stage} // 웨이브 {wave}/{total}',
      'floater.shielded': '방벽', 'floater.shieldCollapsed': '방벽 붕괴', 'floater.shieldBroken': '방벽 파괴', 'floater.emergencyShield': '비상 방벽', 'floater.missileIntercepted': '미사일 요격', 'floater.collision': '충돌', 'floater.hull': '선체 {amount}', 'floater.shield': '방벽 {current}/{total}', 'floater.gateShield': '관문 방벽 +1',
      'render.earthGate': '지구 관문', 'render.station': '방어 기지 // MK {level}', 'render.upgradeAvailable': '업그레이드 가능', 'render.shield': '방벽 {amount}', 'render.finalStage': '최종 스테이지', 'render.hostileFormation': '적 편대 감지',
      'end.secured': '통로 확보', 'end.pilotLost': '조종사 신호 소실', 'end.defenseOffline': '지구 방어 오프라인', 'end.victoryTitle': '침공 격퇴', 'end.shipLostTitle': '함선 손실', 'end.gateLostTitle': '관문 함락',
      'end.victoryCopy': '지구는 안전합니다. 침공 지휘 신호가 사라졌습니다.', 'end.shipLostCopy': '최종 통로를 확보하기 전에 함선이 파괴되었습니다.', 'end.gateLostCopy': '침공 함대가 마지막 방어 통로를 돌파했습니다.',
      'tutorial.step': '훈련 // {step}', 'tutorial.takeControls': '조작 익히기', 'tutorial.takeControlsCopy': 'W, A, S, D로 구역 안을 이동하세요.', 'tutorial.testBlaster': '블래스터 시험', 'tutorial.testBlasterCopy': '위쪽 화살표로 전방 발사하거나 왼쪽 마우스 버튼을 누른 채 조준해 발사하세요.',
      'tutorial.salvage': '보이드 광물 회수', 'tutorial.salvageCopy': '근처 광물 덩어리를 쏘세요. 파괴한 자원은 업그레이드 경험치를 제공합니다.', 'tutorial.punchVoid': '보이드 돌파', 'tutorial.punchVoidCopy': 'T를 눌러 점프 목적지를 설정하거나 교체한 뒤 Q 또는 스페이스로 이동하세요. T를 길게 누르면 해제하고 대시로 돌아갑니다.',
      'tutorial.armWarhead': '탄두 장전', 'tutorial.armWarheadCopy': 'F를 누르세요. 중로켓은 잠시 충전한 뒤 큰 폭발 피해를 줍니다.', 'tutorial.defendGate': '관문 방어', 'tutorial.defendGateCopy': '적은 빛나는 통로를 따라옵니다. 지구 관문 방벽이 모두 사라지기 전에 막으세요.',
      'account.adminAccess': '관리자 접근', 'account.adminConsole': '관리자 콘솔', 'account.adminCopy': '관리자 도구가 활성화되었습니다. 모든 구역이 해금되며 기록은 최고 점수에 포함되지 않습니다.', 'account.signInCopy': '테스트 접근을 해금하려면 개인 관리자 계정으로 로그인하세요.',
      'account.adminPilot': '관리자 조종사 · 최고 점수 비활성화', 'account.guestPilot': '게스트 조종사 · 기기 세션', 'account.pending': '변경 사항 대기 중', 'account.syncing': '동기화 중…', 'account.saveCurrent': '클라우드 저장 최신', 'account.offlineSaved': '오프라인 · 기기에 저장됨',
      'account.offlineDevice': '오프라인 · 기기 저장 사용 중', 'account.cloudLoaded': '클라우드 저장 불러옴', 'account.uploading': '기기 저장 업로드 중…', 'account.deviceLoaded': '기기 저장 불러옴', 'account.importing': '기존 진행도 가져오는 중…', 'account.cloudCreated': '새 클라우드 저장 생성됨',
      'account.callsignInvalid': '3~20자를 사용하세요. 한글을 사용하면 2~20자까지 가능합니다.', 'account.callsignChanged': '호출부호를 변경할 수 없습니다.', 'account.connectingAs': '{username}(으)로 연결 중…', 'account.localFlight': '로컬 비행 · 연결되면 클라우드 저장이 재개됩니다.', 'account.guestStartFailed': '게스트 비행을 시작할 수 없습니다.',
      'account.networkLoadFailed': '조종사 네트워크를 불러올 수 없습니다. 연결을 확인하고 새로고침하세요.', 'account.contacting': '조종사 네트워크 연결 중…', 'account.linkEstablished': '관리자 연결 완료', 'account.accessFailed': '조종사 접근에 실패했습니다.', 'account.signOutFailed': '로그아웃 실패',
      'account.recordsEmpty': '전투 기록 없음 · 첫 기록을 세우세요', 'account.leaderboardUnavailable': '순위표를 사용할 수 없습니다', 'account.cloudUnavailable': '클라우드 저장 불가 · 로컬 비행 준비됨', 'account.cloudSetup': '클라우드 설정 필요',
      'level.oneApproach': '접근로 1개', 'level.approaches': '접근로 {count}개', 'level.adminAccess': '관리자 접근', 'level.cleared': '완료', 'level.unlocked': '해금됨', 'level.locked': '잠김', 'level.stagesApproaches': '{stages} 스테이지 · {paths}', 'level.checkpoint': '함선 레벨 {level} · {credits} ◈', 'level.oneDescription': '하나의 경로를 지키는 외곽 방어전입니다.', 'level.twoDescription': '쌍둥이 경로와 불안정한 균열 진입점이 있습니다.', 'level.threeDescription': '세 개의 수렴 항로와 깊은 웜홀이 있습니다.',
      'leaderboard.detail': '{guest}구역 {level} · 스테이지 {stage} · 처치 {kills}', 'leaderboard.guest': '게스트 · ',
    },
  };

  let currentLanguage = TRANSLATIONS[localStorage.getItem(LANGUAGE_STORAGE_KEY)] ? localStorage.getItem(LANGUAGE_STORAGE_KEY) : 'en';

  function t(key, values = {}) {
    const entry = TRANSLATIONS[currentLanguage]?.[key] ?? TRANSLATIONS.en[key] ?? key;
    if (typeof entry === 'function') return entry(values);
    return String(entry).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
  }

  function translateLevel(level) {
    return { name: t(level.nameKey), short: t(level.shortKey), next: level.nextKey ? t(level.nextKey) : '' };
  }

  function translateEnemy(type) {
    const enemy = ENEMY_TYPES[type];
    return { name: t(enemy.nameKey), role: t(enemy.roleKey), description: t(enemy.descriptionKey) };
  }

  function applyStaticTranslations() {
    document.documentElement.lang = currentLanguage;
    document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => { element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel)); });
    document.querySelectorAll('[data-i18n-title]').forEach((element) => { element.title = t(element.dataset.i18nTitle); });
    [ui.languageSelect, ui.menuLanguageSelect].filter(Boolean).forEach((select) => { select.value = currentLanguage; });
  }

  function setLanguage(language) {
    if (!TRANSLATIONS[language]) return;
    currentLanguage = language;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    applyStaticTranslations();
    refreshLocalizedUi();
  }
