(() => {
  'use strict';

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
      'menu.beginDefense': 'BEGIN DEFENSE', 'menu.playCheckpoint': 'PLAY FROM LAST SAVE-POINT', 'menu.trainingRun': 'TRAINING RUN', 'menu.levelSelect': 'LEVEL SELECT', 'menu.topPilots': 'TOP PILOTS', 'menu.ranksShortcut': 'RANKS',
      'menu.intro': "Three sectors stand between the invasion fleet and Earth. Intercept every formation, salvage void ore, and protect Earth's last stronghold.",
      'menu.callsignAria': 'Callsign', 'menu.callsignTitle': '3–20 characters, or 2–20 when using Korean or German letters. Used for saves and the highscore board.',
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
      'toast.emergencyHeal': '{enemy} // EMERGENCY REPAIRS +{amount} HULL', 'toast.aegisRecovered': 'AEGIS CORE RECOVERED // GATE +1', 'toast.upgradeInstalled': '{upgrade} INSTALLED',
      'toast.multipleApproaches': '{sector} // MULTIPLE APPROACH VECTORS', 'toast.trainingComplete': 'TRAINING COMPLETE // GOOD HUNTING', 'toast.trainingSkipped': 'TRAINING SKIPPED',
      'toast.commandEntering': 'COMMAND SHIP ENTERING THE VOIDLINE', 'toast.stageWave': 'STAGE {stage} // WAVE {wave} OF {total}', 'toast.checkpointSaved': 'CHECKPOINT SAVED // {sector} · STAGE {stage}',
      'floater.shielded': 'SHIELDED', 'floater.shieldCollapsed': 'SHIELD COLLAPSED', 'floater.shieldBroken': 'SHIELD BROKEN', 'floater.emergencyHeal': '+{amount} HULL', 'floater.missileIntercepted': 'MISSILE INTERCEPTED',
      'floater.collision': 'COLLISION', 'floater.hull': '{amount} HULL', 'floater.shield': 'SHIELD {current}/{total}', 'floater.gateShield': '+1 GATE SHIELD',
      'render.earthGate': 'EARTH GATE', 'render.station': 'DEFENSE STATION // MK {level}', 'render.upgradeAvailable': 'UPGRADE AVAILABLE', 'render.shield': 'SHIELD {amount}', 'render.finalStage': 'FINAL STAGE', 'render.hostileFormation': 'HOSTILE FORMATION DETECTED',
      'end.secured': 'CORRIDOR SECURED', 'end.pilotLost': 'PILOT SIGNAL LOST', 'end.defenseOffline': 'EARTH DEFENSE OFFLINE', 'end.victoryTitle': 'INVASION REPELLED', 'end.shipLostTitle': 'YOUR SHIP WAS LOST', 'end.gateLostTitle': 'THE GATE HAS FALLEN',
      'end.victoryCopy': 'Earth is safe. The invasion command signal has gone dark.', 'end.shipLostCopy': 'Your ship was destroyed before the final corridor could be secured.', 'end.gateLostCopy': 'The invasion fleet breached the last defense corridor.',
      'tutorial.step': 'TRAINING // {step}', 'tutorial.takeControls': 'TAKE THE CONTROLS', 'tutorial.takeControlsCopy': 'Use WASD for steering. Keep moving - standing still too long causes your ship to take damage.', 'tutorial.testBlaster': 'TEST THE BLASTER', 'tutorial.testBlasterCopy': 'You can aim and shoot with the left mouse button. Without a mouse, press the Up Arrow to shoot in the direction your ship is facing.',
      'tutorial.salvage': 'SALVAGE VOID ORE', 'tutorial.salvageCopy': 'Shoot and destroy the nearby ore cluster.', 'tutorial.mineToGrow': 'MINE TO GROW', 'tutorial.mineToGrowCopy': 'Fight the threat, but mine meteors too—the ore makes your ship stronger.',
      'tutorial.xpTitle': 'XP FUELS UPGRADES', 'tutorial.xpCopy': 'Destroy enemies and mine ore to earn XP. Level up to improve your ship.',
      'tutorial.punchVoid': 'PUNCH THE VOID', 'tutorial.punchVoidCopy': 'Press T to place or replace a jump destination, then Q or Space to teleport there. Hold T to clear it and dash again.',
      'tutorial.armWarhead': 'ARM THE WARHEAD', 'tutorial.armWarheadCopy': 'Press F. Heavy rockets charge briefly, then deal large blast damage.',
      'tutorial.station': 'BUILD YOUR DEFENSE', 'tutorial.stationCopy': 'Press B to build an auto-firing station. Stay above it and press B again to upgrade it. You can deploy up to three.', 'tutorial.stationUpgradeCopy': 'Station online. Stay above it and press B again to upgrade it.',
      'tutorial.liveFire': 'LIVE-FIRE TEST', 'tutorial.liveFireCopy': 'Destroy two Dart Fighters and one Marauder. Your station fires at nearby enemies too.',
      'tutorial.complete': 'TRAINING COMPLETE', 'tutorial.completeCopy': 'Repeat the tutorial or begin the campaign in Sector 01.', 'tutorial.repeat': 'REPEAT TUTORIAL', 'tutorial.startCampaign': 'START PLAYING',
      'account.adminAccess': 'ADMIN ACCESS', 'account.adminConsole': 'ADMIN CONSOLE', 'account.adminCopy': 'Administrator tools are active. Every sector is unlocked and runs are excluded from highscores.', 'account.signInCopy': 'Sign in with the private administrator account to unlock testing access.',
      'account.adminPilot': 'ADMIN PILOT · HIGHSCORE DISABLED', 'account.guestPilot': 'GUEST PILOT · DEVICE SESSION', 'account.pending': 'CHANGES PENDING', 'account.syncing': 'SYNCHRONIZING…', 'account.saveCurrent': 'CLOUD SAVE CURRENT', 'account.offlineSaved': 'OFFLINE · SAVED ON DEVICE',
      'account.offlineDevice': 'OFFLINE · USING DEVICE SAVE', 'account.cloudLoaded': 'CLOUD SAVE LOADED', 'account.uploading': 'UPLOADING DEVICE SAVE…', 'account.deviceLoaded': 'DEVICE SAVE LOADED', 'account.importing': 'IMPORTING EXISTING PROGRESS…', 'account.cloudCreated': 'NEW CLOUD SAVE CREATED',
      'account.callsignInvalid': 'Use 3–20 characters, or 2–20 when using Korean or German letters.', 'account.callsignChanged': 'The callsign could not be changed.', 'account.connectingAs': 'CONNECTING AS {username}…', 'account.localFlight': 'LOCAL FLIGHT · CLOUD SAVE WILL RESUME WHEN AVAILABLE', 'account.guestStartFailed': 'Guest flight could not be started.',
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
      'menu.beginDefense': '방어 시작', 'menu.playCheckpoint': '마지막 저장 지점부터 시작', 'menu.trainingRun': '훈련 시작', 'menu.levelSelect': '구역 선택', 'menu.topPilots': '최고 조종사', 'menu.ranksShortcut': '순위',
      'menu.intro': '침공 함대와 지구 사이에는 세 개의 구역이 있습니다. 모든 편대를 요격하고, 보이드 광물을 회수하여 지구 최후의 거점을 지키세요.',
      'menu.callsignAria': '호출부호', 'menu.callsignTitle': '3~20자이며, 한글 또는 독일어 문자를 사용하면 2~20자까지 가능합니다. 저장과 최고 점수판에 사용됩니다.',
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
      'toast.shieldRemaining': '{enemy} // 방벽 충전 {count}개 남음', 'toast.shieldCollapsed': '{enemy} // 방벽 붕괴', 'toast.carrierInterceptorDestroyed': '캐리어 요격기 파괴', 'toast.emergencyHeal': '{enemy} // 비상 수리 +{amount} 선체', 'toast.aegisRecovered': '이지스 코어 회수 // 관문 +1', 'toast.upgradeInstalled': '{upgrade} 설치 완료',
      'toast.multipleApproaches': '{sector} // 다중 접근 경로', 'toast.trainingComplete': '훈련 완료 // 행운을 빕니다', 'toast.trainingSkipped': '훈련 건너뜀', 'toast.commandEntering': '지휘함이 보이드라인에 진입', 'toast.stageWave': '스테이지 {stage} // 웨이브 {wave}/{total}', 'toast.checkpointSaved': '체크포인트 저장 // {sector} · 스테이지 {stage}',
      'floater.shielded': '방벽', 'floater.shieldCollapsed': '방벽 붕괴', 'floater.shieldBroken': '방벽 파괴', 'floater.emergencyHeal': '선체 +{amount}', 'floater.missileIntercepted': '미사일 요격', 'floater.collision': '충돌', 'floater.hull': '선체 {amount}', 'floater.shield': '방벽 {current}/{total}', 'floater.gateShield': '관문 방벽 +1',
      'render.earthGate': '지구 관문', 'render.station': '방어 기지 // MK {level}', 'render.upgradeAvailable': '업그레이드 가능', 'render.shield': '방벽 {amount}', 'render.finalStage': '최종 스테이지', 'render.hostileFormation': '적 편대 감지',
      'end.secured': '통로 확보', 'end.pilotLost': '조종사 신호 소실', 'end.defenseOffline': '지구 방어 오프라인', 'end.victoryTitle': '침공 격퇴', 'end.shipLostTitle': '함선 손실', 'end.gateLostTitle': '관문 함락',
      'end.victoryCopy': '지구는 안전합니다. 침공 지휘 신호가 사라졌습니다.', 'end.shipLostCopy': '최종 통로를 확보하기 전에 함선이 파괴되었습니다.', 'end.gateLostCopy': '침공 함대가 마지막 방어 통로를 돌파했습니다.',
      'tutorial.step': '훈련 // {step}', 'tutorial.takeControls': '조작 익히기', 'tutorial.takeControlsCopy': 'WASD로 조종하세요. 계속 움직이세요. 너무 오래 멈춰 있으면 함선이 피해를 입습니다.', 'tutorial.testBlaster': '블래스터 시험', 'tutorial.testBlasterCopy': '왼쪽 마우스 버튼으로 조준하고 발사할 수 있습니다. 마우스가 없으면 위쪽 화살표로 함선이 바라보는 방향에 발사하세요.',
      'tutorial.salvage': '보이드 광물 회수', 'tutorial.salvageCopy': '근처 광물 덩어리를 쏘아 파괴하세요.', 'tutorial.mineToGrow': '채굴로 강화', 'tutorial.mineToGrowCopy': '적을 막는 동시에 운석도 파괴하세요. 광석으로 함선을 강화할 수 있습니다.',
      'tutorial.xpTitle': 'XP로 업그레이드', 'tutorial.xpCopy': '적을 처치하고 광석을 채굴하면 XP를 얻습니다. 레벨이 오르면 함선을 강화할 수 있습니다.',
      'tutorial.punchVoid': '보이드 돌파', 'tutorial.punchVoidCopy': 'T를 눌러 점프 목적지를 설정하거나 교체한 뒤 Q 또는 스페이스로 이동하세요. T를 길게 누르면 해제하고 대시로 돌아갑니다.',
      'tutorial.armWarhead': '탄두 장전', 'tutorial.armWarheadCopy': 'F를 누르세요. 중로켓은 잠시 충전한 뒤 큰 폭발 피해를 줍니다.',
      'tutorial.station': '방어망 구축', 'tutorial.stationCopy': 'B로 자동 사격 기지를 건설하세요. 기지 위에서 B를 다시 누르면 업그레이드됩니다. 최대 3개까지 배치할 수 있습니다.', 'tutorial.stationUpgradeCopy': '기지가 가동되었습니다. 기지 위에서 B를 다시 눌러 업그레이드하세요.',
      'tutorial.liveFire': '실전 사격 훈련', 'tutorial.liveFireCopy': '다트 전투기 2대와 약탈자 1대를 파괴하세요. 방어 기지도 근처 적을 자동으로 공격합니다.',
      'tutorial.complete': '훈련 완료', 'tutorial.completeCopy': '훈련을 반복하거나 구역 01에서 캠페인을 시작하세요.', 'tutorial.repeat': '훈련 반복', 'tutorial.startCampaign': '게임 시작',
      'account.adminAccess': '관리자 접근', 'account.adminConsole': '관리자 콘솔', 'account.adminCopy': '관리자 도구가 활성화되었습니다. 모든 구역이 해금되며 기록은 최고 점수에 포함되지 않습니다.', 'account.signInCopy': '테스트 접근을 해금하려면 개인 관리자 계정으로 로그인하세요.',
      'account.adminPilot': '관리자 조종사 · 최고 점수 비활성화', 'account.guestPilot': '게스트 조종사 · 기기 세션', 'account.pending': '변경 사항 대기 중', 'account.syncing': '동기화 중…', 'account.saveCurrent': '클라우드 저장 최신', 'account.offlineSaved': '오프라인 · 기기에 저장됨',
      'account.offlineDevice': '오프라인 · 기기 저장 사용 중', 'account.cloudLoaded': '클라우드 저장 불러옴', 'account.uploading': '기기 저장 업로드 중…', 'account.deviceLoaded': '기기 저장 불러옴', 'account.importing': '기존 진행도 가져오는 중…', 'account.cloudCreated': '새 클라우드 저장 생성됨',
      'account.callsignInvalid': '3~20자를 사용하세요. 한글 또는 독일어 문자를 사용하면 2~20자까지 가능합니다.', 'account.callsignChanged': '호출부호를 변경할 수 없습니다.', 'account.connectingAs': '{username}(으)로 연결 중…', 'account.localFlight': '로컬 비행 · 연결되면 클라우드 저장이 재개됩니다.', 'account.guestStartFailed': '게스트 비행을 시작할 수 없습니다.',
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
      nameKey: 'sector.one.name', shortKey: 'sector.one.short', nextKey: 'sector.one.next', stages: 6, boss: 'bossOmega', enemyDurability: 1.38, enemyTankinessMultiplier: 1.15 * 1.15, xpMultiplier: .6,
      paths: [createPath([
        { x: -120, y: 380 }, { x: 360, y: 430 }, { x: 690, y: 770 }, { x: 1110, y: 690 },
        { x: 1470, y: 1010 }, { x: 1860, y: 1260 }, { x: 2250, y: 1160 }, { x: 2570, y: 850 },
        { x: 2860, y: 900 }, { x: PORTAL.x, y: PORTAL.y },
      ])],
      wormholes: [],
    },
    {
      nameKey: 'sector.two.name', shortKey: 'sector.two.short', nextKey: 'sector.two.next', stages: 7, boss: 'bossCarrier', enemyDurability: 1.2,
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
    'tutorialCard', 'tutorialStep', 'tutorialTitle', 'tutorialText', 'tutorialProgress', 'tutorialActions',
    'repeatTutorial', 'startCampaign', 'skipTutorial', 'tutorialUpgradeTip', 'crosshair',
    'toast', 'checkpointNotice', 'checkpointButton', 'endKicker', 'endTitle', 'endCopy', 'finalScore', 'finalWave', 'finalKills', 'playAgainLabel', 'retryStageButton', 'retryStageLabel', 'sectorText',
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
  let checkpointNoticeTimer = 0;
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
    return { highestUnlocked: 0, checkpoints: {}, lastStageCheckpoint: null, completedCampaigns: 0, seenEnemyTypes: [] };
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
      lastStageCheckpoint: saved?.lastStageCheckpoint && typeof saved.lastStageCheckpoint === 'object' ? saved.lastStageCheckpoint : null,
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
  // Player defaults, progression checkpoints, campaign setup, and pilot activation.
  const BASE_ROCKET_DAMAGE = 125 * 1.15 * 1.05;

  function resetPlayer() {
    return {
      x: 860,
      y: 1030,
      vx: 0,
      vy: 0,
      angle: 0,
      radius: 18,
      hp: 50,
      maxHp: 50,
      speed: 310,
      acceleration: 860,
      fireRate: 5.2,
      shotTimer: 0,
      damage: 18,
      projectileSpeed: 920,
      level: 1,
      xp: 0,
      xpNext: 60,
      boostCooldown: 0,
      boostMax: 4.8,
      jumpDestinationX: null,
      jumpDestinationY: null,
      jumpDestinationCooldown: 0,
      jumpDestinationMax: 1.6,
      jumpBrake: 0,
      jumpFlash: 0,
      rocketCooldown: 0,
      rocketMax: 6.8,
      rocketCharge: 0,
      rocketDamage: BASE_ROCKET_DAMAGE,
      invulnerable: 0,
      lastMoveX: 1,
      lastMoveY: 0,
      multiShot: 1,
      multiUpgradeLevel: 0,
      salvage: 1,
      credits: 40,
      speedTier: 1,
      damageTier: 1,
      rateTier: 1,
      hullTier: 1,
      rocketTier: 1,
      coolingTier: 1,
      collisionTimer: 0,
    };
  }

  const PROGRESSION_VERSION = 5;

  const PROGRESS_KEYS = [
    'hp', 'maxHp', 'speed', 'acceleration', 'fireRate', 'damage', 'projectileSpeed', 'level', 'xp', 'xpNext',
    'boostMax', 'rocketMax', 'rocketDamage', 'multiShot', 'salvage', 'credits',
    'speedTier', 'damageTier', 'rateTier', 'hullTier', 'rocketTier', 'coolingTier',
  ];

  function captureProgress(source = player, shields = gateShields) {
    const checkpoint = { gateShields: shields, progressionVersion: PROGRESSION_VERSION, rocketDamageBase: BASE_ROCKET_DAMAGE };
    for (const key of PROGRESS_KEYS) checkpoint[key] = source[key];
    return checkpoint;
  }

  function expectedCheckpoint() {
    return captureProgress(resetPlayer(), 3);
  }

  function applyCheckpoint(checkpoint) {
    if (!checkpoint) return;
    const legacyCheckpoint = !Number.isFinite(Number(checkpoint.speedTier));
    for (const key of PROGRESS_KEYS) {
      const value = Number(checkpoint[key]);
      if (Number.isFinite(value)) player[key] = value;
    }
    const savedRocketDamageBase = Number(checkpoint.rocketDamageBase);
    if (Number.isFinite(player.rocketDamage)) {
      if (Number.isFinite(savedRocketDamageBase) && savedRocketDamageBase !== BASE_ROCKET_DAMAGE) {
        player.rocketDamage *= BASE_ROCKET_DAMAGE / savedRocketDamageBase;
        checkpoint.rocketDamageBase = BASE_ROCKET_DAMAGE;
      } else if (!Number.isFinite(savedRocketDamageBase)) {
        player.rocketDamage *= BASE_ROCKET_DAMAGE / 125;
        checkpoint.rocketDamageBase = BASE_ROCKET_DAMAGE;
      }
    }
    if (legacyCheckpoint) {
      player.speed *= 310 / 355;
      player.acceleration *= 860 / 980;
      player.speedTier = clamp(1 + Math.round(Math.log(Math.max(1, player.speed / 310)) / Math.log(1.1)), 1, 7);
      player.damageTier = clamp(1 + Math.round(Math.log(Math.max(1, player.damage / 18)) / Math.log(1.18)), 1, 7);
      player.rateTier = clamp(1 + Math.round(Math.log(Math.max(1, player.fireRate / 5.2)) / Math.log(1.14)), 1, 7);
      player.hullTier = clamp(1 + Math.round(Math.max(0, player.maxHp - 50) / 15), 1, 7);
      player.rocketTier = clamp(1 + Math.round(Math.log(Math.max(1, player.rocketDamage / BASE_ROCKET_DAMAGE)) / Math.log(1.22)), 1, 7);
      player.coolingTier = clamp(1 + Math.round(Math.log(Math.min(1, player.rocketMax / 6.8)) / Math.log(.9)), 1, 7);
    }
    player.hp = Math.max(1, Math.min(player.maxHp, player.hp));
    gateShields = Math.max(1, Math.min(5, Number(checkpoint.gateShields) || 3));
  }

  function ensureCampaignCheckpoints() {
    let changed = false;
    for (let index = 0; index <= campaignState.highestUnlocked; index += 1) {
      if (!campaignState.checkpoints[index]
        || Number(campaignState.checkpoints[index].progressionVersion) !== PROGRESSION_VERSION) {
        campaignState.checkpoints[index] = expectedCheckpoint(index);
        changed = true;
      }
    }
    if (campaignState.lastStageCheckpoint && !isStageCheckpointValid(campaignState.lastStageCheckpoint)) {
      campaignState.lastStageCheckpoint = null;
      changed = true;
    }
    if (changed) saveCampaignState();
  }

  function isStageCheckpointValid(checkpoint) {
    const level = Number(checkpoint?.level);
    const stage = Number(checkpoint?.stage);
    return Number(checkpoint?.progressionVersion) === PROGRESSION_VERSION
      && Number.isInteger(level) && level >= 0 && level < LEVELS.length
      && Number.isInteger(stage) && stage >= 1 && stage <= LEVELS[level].stages
      && checkpoint.player && typeof checkpoint.player === 'object'
      && Array.isArray(checkpoint.resources) && Array.isArray(checkpoint.pickups) && Array.isArray(checkpoint.stations);
  }

  function stageCheckpointRank(checkpoint) {
    if (!isStageCheckpointValid(checkpoint)) return -1;
    return LEVELS.slice(0, checkpoint.level).reduce((total, level) => total + level.stages, 0) + checkpoint.stage;
  }

  function cloneStageCheckpoint(checkpoint) {
    return {
      ...checkpoint,
      player: { ...checkpoint.player },
      resources: checkpoint.resources.map((resource) => ({ ...resource })),
      pickups: checkpoint.pickups.map((pickup) => ({ ...pickup })),
      stations: checkpoint.stations.map((station) => ({ ...station })),
    };
  }

  function updateCheckpointButton() {
    ui.checkpointButton.hidden = !isStageCheckpointValid(campaignState.lastStageCheckpoint);
  }

  function showCheckpointNotice(checkpoint) {
    const level = translateLevel(LEVELS[checkpoint.level]);
    ui.checkpointNotice.textContent = t('toast.checkpointSaved', { sector: level.short, stage: String(checkpoint.stage).padStart(2, '0') });
    ui.checkpointNotice.classList.add('visible');
    checkpointNoticeTimer = 2.8;
  }

  function saveStageCheckpoint(checkpoint) {
    if (stageCheckpointRank(checkpoint) >= stageCheckpointRank(campaignState.lastStageCheckpoint)) {
      campaignState.lastStageCheckpoint = cloneStageCheckpoint(checkpoint);
      saveCampaignState();
      updateCheckpointButton();
    }
  }

  function captureStageCheckpoint() {
    if (tutorialMode || wave <= 0) return;
    const { rocketTarget, ...checkpointPlayer } = player;
    stageCheckpoint = {
      level: currentLevel,
      stage: wave,
      progressionVersion: PROGRESSION_VERSION,
      player: checkpointPlayer,
      gateShields,
      score,
      kills,
      resources: resources.map((resource) => ({ ...resource })),
      pickups: pickups.map((pickup) => ({ ...pickup })),
      stations: stations.map(({ target, ...station }) => ({ ...station })),
      resourceTimer,
      repairTimer,
      lastSelectedUpgradeId,
    };
    saveStageCheckpoint(stageCheckpoint);
    showCheckpointNotice(stageCheckpoint);
  }

  function retryStageCheckpoint() {
    if (!isStageCheckpointValid(stageCheckpoint)) return false;
    const checkpoint = stageCheckpoint;
    currentLevel = checkpoint.level;
    activePaths = LEVELS[currentLevel].paths;
    player = { ...checkpoint.player, rocketTarget: null, invulnerable: 0, collisionTimer: 0, jumpFlash: 0 };
    gateShields = checkpoint.gateShields;
    score = checkpoint.score;
    kills = checkpoint.kills;
    resources = checkpoint.resources.map((resource) => ({ ...resource }));
    pickups = checkpoint.pickups.map((pickup) => ({ ...pickup }));
    stations = checkpoint.stations.map((station) => ({ ...station, target: null }));
    bullets = [];
    rockets = [];
    enemies = [];
    enemyRockets = [];
    particles = [];
    floaters = [];
    wave = checkpoint.stage - 1;
    formation = 0;
    formationsInStage = 1;
    waveClearTimer = 0;
    waveReady = false;
    waveCallEligible = false;
    resourceTimer = checkpoint.resourceTimer;
    repairTimer = checkpoint.repairTimer;
    spawnTimer = 0;
    spawnQueue = [];
    pendingLevelUps = 0;
    lastSelectedUpgradeId = checkpoint.lastSelectedUpgradeId;
    pendingWaveStart = false;
    bossIntroTimer = 0;
    threatWarningCooldown = 0;
    lockedTarget = null;
    stationaryTime = 0;
    staticDamageTimer = 0;
    jumpDestinationHold = 0;
    jumpDestinationCancelArmed = false;
    runFinished = false;
    lastRunLevel = currentLevel;
    camera.shake = 0;
    camera.x = clamp(player.x - screenWidth / 2, 0, WORLD.width - screenWidth);
    camera.y = clamp(player.y - screenHeight / 2, 0, WORLD.height - screenHeight);
    ui.staticWarning.classList.remove('active');
    ui.portalWarning.classList.remove('active');
    ui.lockReadout.classList.remove('active');
    setWaveCallAvailable(false);
    hideOverlays();
    ui.crosshair.style.opacity = '1';
    mode = 'playing';
    beginWave();
    syncUi();
    return true;
  }

  function resumeLastStageCheckpoint() {
    if (!isStageCheckpointValid(campaignState.lastStageCheckpoint)) return false;
    audio.init();
    localStorage.setItem(GAME_STARTED_KEY, 'true');
    tutorialMode = false;
    resetTutorialFlow();
    stageCheckpoint = cloneStageCheckpoint(campaignState.lastStageCheckpoint);
    return retryStageCheckpoint();
  }

  function clearRun(levelIndex = 0) {
    player = resetPlayer();
    bullets = [];
    rockets = [];
    enemies = [];
    enemyRockets = [];
    resources = [];
    pickups = [];
    stations = [];
    particles = [];
    floaters = [];
    wave = 0;
    formation = 0;
    formationsInStage = 1;
    const highestSelectable = isAdminPilot() ? LEVELS.length - 1 : campaignState.highestUnlocked;
    currentLevel = clamp(levelIndex, 0, highestSelectable);
    activePaths = LEVELS[currentLevel].paths;
    score = 0;
    kills = 0;
    gateShields = 3;
    ensureCampaignCheckpoints();
    applyCheckpoint(campaignState.checkpoints[currentLevel] || expectedCheckpoint(currentLevel));
    waveClearTimer = 0;
    formationStartedAt = 0;
    formationParTime = 0;
    formationGateShields = gateShields;
    waveReady = false;
    waveCallEligible = false;
    stationaryTime = 0;
    staticDamageTimer = 0;
    jumpDestinationHold = 0;
    jumpDestinationCancelArmed = false;
    resourceTimer = .7;
    repairTimer = 11;
    spawnTimer = 0;
    spawnQueue = [];
    pendingLevelUps = 0;
    lastSelectedUpgradeId = null;
    seenEnemyTypes = new Set(campaignState.seenEnemyTypes || []);
    introQueue = [];
    pendingWaveStart = false;
    bossIntroTimer = 0;
    threatWarningCooldown = 0;
    lockedTarget = null;
    stageCheckpoint = null;
    ui.staticWarning.classList.remove('active');
    setWaveCallAvailable(false);
    runFinished = false;
    gameClock = 0;
    camera.shake = 0;
    camera.x = player.x - screenWidth / 2;
    camera.y = player.y - screenHeight / 2;
    for (let i = 0; i < 7; i += 1) spawnResource(true);
  }

  function startGame(withTutorial = false, levelIndex = 0) {
    audio.init();
    localStorage.setItem(GAME_STARTED_KEY, 'true');
    document.getElementById('tutorialButton').classList.remove('tutorial-recommended');
    clearRun(withTutorial ? 0 : levelIndex);
    lastRunLevel = currentLevel;
    tutorialMode = withTutorial;
    tutorialIndex = 0;
    tutorialDelay = 0;
    resetTutorialFlow();
    mode = 'playing';
    hideOverlays();
    ui.crosshair.style.opacity = '1';
    if (tutorialMode) {
      resources = [];
      ui.tutorialCard.classList.add('active');
      updateTutorialCard();
      showToast(t('toast.trainingLink'));
    } else {
      ui.tutorialCard.classList.remove('active');
      beginWave();
    }
    syncUi();
  }

  function hideOverlays() {
    document.querySelectorAll('.overlay').forEach((overlay) => overlay.classList.remove('active'));
  }

  function showTitle() {
    mode = 'menu';
    hideOverlays();
    ui.startOverlay.classList.add('active');
    ui.tutorialCard.classList.remove('active');
    ui.crosshair.style.opacity = '0';
    ui.portalWarning.classList.remove('active');
    ui.lockReadout.classList.remove('active');
    updateCheckpointButton();
  }

  function updatePilotUi() {
    const connected = Boolean(activePilot);
    [ui.adminButton, ui.menuAdminButton].forEach((button) => {
      button.classList.toggle('connected', connected && isAdminPilot());
      button.title = connected && isAdminPilot() ? `${t('account.adminAccess')}: ${activePilot.username}` : t('tooltip.adminAccess');
    });
    if (activePilot?.isGuest && ui.publicUsername) ui.publicUsername.value = activePilot.username;
    if (!connected) return;
    ui.pilotType.textContent = isAdminPilot() ? t('account.adminPilot') : t('account.guestPilot');
    ui.pilotName.textContent = activePilot.username;
  }

  async function activatePilot(pilot) {
    activePilot = pilot;
    activePilotId = pilot?.id || null;
    cloudSyncSuspended = false;
    updatePilotUi();

    if (!pilot) {
      campaignState = emptyCampaignState();
      highScore = 0;
      ui.bestText.textContent = formatScore(0);
      updateCheckpointButton();
      return;
    }

    const cachedCampaign = localStorage.getItem(campaignKey()) ? readCampaignState(campaignKey()) : null;
    const cachedHighScore = Number(localStorage.getItem(highScoreKey()) || 0);
    const cachedUpdatedAt = Date.parse(localStorage.getItem(localUpdatedKey()) || '') || 0;
    let remote = null;
    try {
      remote = await window.VoidlineCloud.loadProgress();
    } catch (error) {
      cloudSyncSuspended = true;
      ui.pilotSyncState.textContent = t('account.offlineDevice');
      console.warn('Voidline cloud load:', error);
    }

    const remoteUpdatedAt = Date.parse(remote?.updated_at || '') || 0;
    if (remote && remoteUpdatedAt >= cachedUpdatedAt) {
      campaignState = normalizeCampaignState(remote.campaign);
      highScore = Math.max(0, Number(remote.high_score) || 0);
      saveCampaignState(false, false);
      localStorage.setItem(localUpdatedKey(), remote.updated_at);
      ui.pilotSyncState.textContent = t('account.cloudLoaded');
    } else if (cachedCampaign) {
      campaignState = cachedCampaign;
      highScore = cachedHighScore;
      ui.pilotSyncState.textContent = cloudSyncSuspended ? t('account.offlineSaved') : remote ? t('account.uploading') : t('account.deviceLoaded');
      scheduleCloudSave();
    } else if (localStorage.getItem(CAMPAIGN_KEY) && !localStorage.getItem('voidline-legacy-cloud-claimed')) {
      campaignState = readCampaignState(CAMPAIGN_KEY);
      highScore = Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
      localStorage.setItem('voidline-legacy-cloud-claimed', 'true');
      saveCampaignState();
      ui.pilotSyncState.textContent = t('account.importing');
    } else {
      campaignState = emptyCampaignState();
      highScore = 0;
      saveCampaignState();
      ui.pilotSyncState.textContent = t('account.cloudCreated');
    }

    ensureCampaignCheckpoints();
    if (isAdminPilot()) {
      highScore = 0;
      localStorage.setItem(highScoreKey(), '0');
      saveCampaignState();
    }
    ui.bestText.textContent = formatScore(highScore);
    updateCheckpointButton();
    if (mode === 'levelSelect') renderLevelSelect();
  }
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
      const descriptionKey = index === 0 ? 'level.oneDescription' : index === 1 ? 'level.twoDescription' : 'level.threeDescription';
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
    captureStageCheckpoint();
    prepareFormation();
  }

  function prepareFormation() {
    const level = LEVELS[currentLevel];
    spawnQueue = [];
    const regularCount = 4 + Math.ceil(wave * 1.15) + currentLevel * 2 + formation;
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
    bossOmega: { nameKey: 'enemy.bossOmega.name', roleKey: 'enemy.bossOmega.role', descriptionKey: 'enemy.bossOmega.description', radius: 66, hp: 2280, speed: 34, score: 5400, xp: 260, color: '#ff506b', major: true, boss: true, bossSkill: 'rockets' },
    // Offset Sector Two's 20% enemy durability bonus so this boss keeps its existing effective HP.
    bossCarrier: { nameKey: 'enemy.bossCarrier.name', roleKey: 'enemy.bossCarrier.role', descriptionKey: 'enemy.bossCarrier.description', radius: 74, hp: 4600 / 1.2, speed: 29, score: 7600, xp: 340, color: '#ef67d1', major: true, boss: true, carrier: true, bossSkill: 'swarm', emergencyHeal: .15 },
    bossTitan: { nameKey: 'enemy.bossTitan.name', roleKey: 'enemy.bossTitan.role', descriptionKey: 'enemy.bossTitan.description', radius: 82, hp: 2520, shield: 330, speed: 26, score: 12000, xp: 500, color: '#aeb8c0', major: true, boss: true, shielded: true, bossSkill: 'titan' },
  };

  function activateWave() {
    ui.intelOverlay.classList.remove('active');
    ui.bossOverlay.classList.remove('active');
    mode = 'playing';
    pendingWaveStart = false;
    announcementTimer = 2.2;
    spawnTimer = .55;
    formationStartedAt = gameClock;
    const sectorThreeSpacing = currentLevel === 2 ? 1.08 : 1;
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
    const hpVariance = rand(.86, 1.28);
    const speedVariance = rand(.86, 1.17);
    const difficultyScale = (1.05 + rampStage * .125 + currentLevel * .16)
      * (LEVELS[currentLevel].enemyDurability || 1)
      * (LEVELS[currentLevel].enemyTankinessMultiplier || 1);
    const maxHp = blueprint.hp * difficultyScale * hpVariance;
    const lane = type === 'striker' ? rand(-210, 210) : rand(-58, 58);
    const wobble = rand(0, Math.PI * 2);
    const laneTaper = type === 'striker' ? clamp((path.length - progress) / 420, 0, 1) : 1;
    const sway = lane * laneTaper + Math.sin(wobble) * (blueprint.boss ? 22 : 13);
    const enemy = {
      type,
      x: at.x + at.nx * sway,
      y: at.y + at.ny * sway,
      pathId,
      pathLength: path.length,
      progress,
      lane,
      wobble,
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
      tutorialTarget: Boolean(spec.tutorialTarget),
      shielded: Boolean(blueprint.shielded),
      shieldCharges: blueprint.shieldCharges || 0,
      maxShieldCharges: blueprint.shieldCharges || 0,
      shieldHp: (blueprint.shield || 0) * difficultyScale,
      maxShield: (blueprint.shield || 0) * difficultyScale,
      emergencyHeal: blueprint.emergencyHeal || 0,
      emergencyHealUsed: false,
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
    const turnSmoothingDistance = 180;
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
  // Per-frame simulation: movement, combat, collisions, stations, and damage.
  function update(dt) {
    elapsed += dt;
    if (toastTimer > 0) {
      toastTimer -= dt;
      if (toastTimer <= 0) ui.toast.classList.remove('visible');
    }
    if (checkpointNoticeTimer > 0) {
      checkpointNoticeTimer -= dt;
      if (checkpointNoticeTimer <= 0) ui.checkpointNotice.classList.remove('visible');
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
    if (!targetsRemain && tutorialCombatKills >= 3) queueTutorialAdvance();
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
    if (tutorialMode && tutorialIndex === TUTORIAL_STEP.blaster) queueTutorialAdvance();
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
    if (tutorialMode && tutorialIndex === TUTORIAL_STEP.rocket) queueTutorialAdvance();
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
    if (tutorialMode && tutorialIndex === TUTORIAL_STEP.jump) queueTutorialAdvance();
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
      if (tutorialMode && tutorialIndex === TUTORIAL_STEP.station) queueTutorialAdvance();
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
    } else if (enemy.emergencyHeal && !enemy.emergencyHealUsed
      && enemy.hp / enemy.maxHp <= .4 && enemy.progress < enemy.pathLength * .7) {
      enemy.emergencyHealUsed = true;
      const healAmount = Math.round(enemy.maxHp * enemy.emergencyHeal);
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + healAmount);
      showToast(t('toast.emergencyHeal', { enemy: translateEnemy(enemy.type).name, amount: healAmount }));
      addFloater(enemy.x, enemy.y - enemy.radius, t('floater.emergencyHeal', { amount: healAmount }), COLORS.cyan);
      burst(enemy.x, enemy.y, COLORS.cyan, 34, 280);
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
      if (completesTutorialMining) queueTutorialAdvance();
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
    const showTutorialTip = tutorialMode && !tutorialUpgradeTipShown;
    ui.tutorialUpgradeTip.hidden = !showTutorialTip;
    if (showTutorialTip) tutorialUpgradeTipShown = true;
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
    const continueTutorial = tutorialMode && tutorialIndex === TUTORIAL_STEP.mining;
    upgrade.apply();
    lastSelectedUpgradeId = upgrade.id;
    pendingLevelUps -= 1;
    ui.upgradeOverlay.classList.remove('active');
    ui.tutorialUpgradeTip.hidden = true;
    showToast(t('toast.upgradeInstalled', { upgrade: t(upgrade.nameKey) }));
    if (pendingLevelUps > 0) {
      setTimeout(showUpgradeChoices, 80);
    } else {
      mode = 'playing';
      ui.crosshair.style.opacity = '1';
      if (continueTutorial) queueTutorialAdvance();
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

  const TUTORIAL_STEP = Object.freeze({
    controls: 0,
    blaster: 1,
    salvage: 2,
    mining: 3,
    jump: 4,
    rocket: 5,
    station: 6,
    combat: 7,
    complete: 8,
  });
  const TUTORIAL_TRANSITION_DELAY = 2.6;

  const tutorialSteps = [
    { titleKey: 'tutorial.takeControls', textKey: 'tutorial.takeControlsCopy' },
    { titleKey: 'tutorial.testBlaster', textKey: 'tutorial.testBlasterCopy' },
    { titleKey: 'tutorial.salvage', textKey: 'tutorial.salvageCopy' },
    { titleKey: 'tutorial.mineToGrow', textKey: 'tutorial.mineToGrowCopy' },
    { titleKey: 'tutorial.punchVoid', textKey: 'tutorial.punchVoidCopy' },
    { titleKey: 'tutorial.armWarhead', textKey: 'tutorial.armWarheadCopy' },
    { titleKey: 'tutorial.station', textKey: 'tutorial.stationCopy' },
    { titleKey: 'tutorial.liveFire', textKey: 'tutorial.liveFireCopy' },
    { titleKey: 'tutorial.complete', textKey: 'tutorial.completeCopy' },
  ];

  function resetTutorialFlow() {
    tutorialMovementKeys = new Set();
    tutorialStationBuilt = false;
    tutorialCombatActive = false;
    tutorialCombatKills = 0;
    tutorialUpgradeTipShown = false;
    tutorialTransitionTimer = 0;
    tutorialTransitioning = false;
    ui.tutorialActions.hidden = true;
    ui.skipTutorial.hidden = false;
    ui.tutorialUpgradeTip.hidden = true;
  }

  function updateTutorialCard() {
    const step = tutorialSteps[tutorialIndex];
    if (!step) return;
    ui.tutorialStep.textContent = t('tutorial.step', { step: String(tutorialIndex + 1).padStart(2, '0') });
    ui.tutorialTitle.textContent = t(step.titleKey);
    const textKey = tutorialIndex === TUTORIAL_STEP.station && tutorialStationBuilt
      ? 'tutorial.stationUpgradeCopy'
      : step.textKey;
    ui.tutorialText.textContent = t(textKey);
    ui.tutorialProgress.innerHTML = tutorialSteps.map((_, index) => `<i class="${index <= tutorialIndex ? 'done' : ''}"></i>`).join('');
  }

  function advanceTutorial() {
    if (!tutorialMode || tutorialIndex >= TUTORIAL_STEP.complete) return;
    tutorialIndex += 1;
    tutorialDelay = 0;
    if (tutorialIndex === TUTORIAL_STEP.complete) {
      completeTutorial();
      return;
    }
    if (tutorialIndex === TUTORIAL_STEP.salvage) {
      resources = [];
      const oreCount = 3;
      const requiredXp = Math.max(1, player.xpNext - player.xp);
      const forwardX = Math.cos(player.angle);
      const forwardY = Math.sin(player.angle);
      const normalX = -forwardY;
      const normalY = forwardX;
      const orePlacements = [
        { distance: 240, lateral: -90 },
        { distance: 290, lateral: 0 },
        { distance: 240, lateral: 90 },
      ];
      for (const placement of orePlacements) {
        spawnResource(true);
        const trainingOre = resources[resources.length - 1];
        if (!trainingOre) continue;
        trainingOre.tutorialTarget = true;
        trainingOre.x = clamp(
          player.x + forwardX * placement.distance + normalX * placement.lateral,
          90,
          WORLD.width - 90,
        );
        trainingOre.y = clamp(
          player.y + forwardY * placement.distance + normalY * placement.lateral,
          90,
          WORLD.height - 90,
        );
        trainingOre.hp = Math.min(trainingOre.hp, 54);
        trainingOre.maxHp = trainingOre.hp;
        trainingOre.xpValue = Math.ceil(Math.ceil(requiredXp / oreCount) / player.salvage);
      }
    }
    if (tutorialIndex === TUTORIAL_STEP.mining) tutorialDelay = 3.8;
    if (tutorialIndex === TUTORIAL_STEP.station) {
      player.credits = Math.max(player.credits, 1000);
    }
    if (tutorialIndex === TUTORIAL_STEP.combat) beginTutorialCombat();
    updateTutorialCard();
    audio.tone(540, .18, 'sine', .045, 210);
  }

  function queueTutorialAdvance() {
    if (!tutorialMode || tutorialTransitioning || tutorialIndex >= TUTORIAL_STEP.complete) return;
    tutorialTransitioning = true;
    tutorialTransitionTimer = TUTORIAL_TRANSITION_DELAY;
  }

  function updateTutorial(dt) {
    if (!tutorialMode || mode !== 'playing') return;
    if (tutorialTransitioning) {
      tutorialTransitionTimer -= dt;
      if (tutorialTransitionTimer <= 0) {
        tutorialTransitioning = false;
        tutorialTransitionTimer = 0;
        advanceTutorial();
      }
      return;
    }
    if (tutorialIndex !== TUTORIAL_STEP.mining) return;
    tutorialDelay -= dt;
    if (tutorialDelay > 0) return;
    if (pendingLevelUps > 0) showUpgradeChoices();
    else queueTutorialAdvance();
  }

  function beginTutorialCombat() {
    tutorialCombatActive = true;
    tutorialCombatKills = 0;
    spawnQueue = [
      { type: 'scout', pathId: 0, entryProgress: 0, tutorialTarget: true },
      { type: 'scout', pathId: 0, entryProgress: 0, tutorialTarget: true },
      { type: 'raider', pathId: 0, entryProgress: 0, tutorialTarget: true },
    ];
    spawnTimer = .25;
  }

  function completeTutorial() {
    tutorialCombatActive = false;
    tutorialIndex = TUTORIAL_STEP.complete;
    mode = 'tutorialComplete';
    ui.crosshair.style.opacity = '0';
    ui.lockReadout.classList.remove('active');
    ui.skipTutorial.hidden = true;
    ui.tutorialActions.hidden = false;
    updateTutorialCard();
    showToast(t('toast.trainingComplete'));
  }
  // Canvas rendering, minimap, HUD synchronization, and visual effects.
  function addParticle(x, y, options = {}) {
    if (particles.length > 520) return;
    particles.push({
      x, y,
      vx: options.vx ?? rand(-50, 50),
      vy: options.vy ?? rand(-50, 50),
      color: options.color ?? COLORS.cyan,
      life: options.life ?? .4,
      maxLife: options.life ?? .4,
      size: options.size ?? 2,
    });
  }

  function burst(x, y, color, count = 12, speed = 180) {
    for (let i = 0; i < count; i += 1) {
      const angle = rand(0, Math.PI * 2);
      const velocity = rand(speed * .2, speed);
      addParticle(x, y, { vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity, color, life: rand(.25, .78), size: rand(1.3, 4.4) });
    }
  }

  function addFloater(x, y, text, color) {
    floaters.push({ x, y, text, color, life: 1.05, maxLife: 1.05 });
  }

  function updateCamera(dt) {
    const leadX = player.vx * .28;
    const leadY = player.vy * .28;
    const targetX = clamp(player.x - screenWidth / 2 + leadX, 0, Math.max(0, WORLD.width - screenWidth));
    const targetY = clamp(player.y - screenHeight / 2 + leadY, 0, Math.max(0, WORLD.height - screenHeight));
    const smoothing = 1 - Math.pow(.0003, dt);
    camera.x = lerp(camera.x, targetX, smoothing);
    camera.y = lerp(camera.y, targetY, smoothing);
    camera.shake *= Math.pow(.015, dt);
    const shakeAmount = settings.shake ? camera.shake : 0;
    camera.shakeX = rand(-shakeAmount, shakeAmount);
    camera.shakeY = rand(-shakeAmount, shakeAmount);
  }

  function worldToScreen(x, y) {
    return { x: x - camera.x + camera.shakeX, y: y - camera.y + camera.shakeY };
  }

  function updateAimWorld() {
    input.aimWorldX = input.mouseX + camera.x - camera.shakeX;
    input.aimWorldY = input.mouseY + camera.y - camera.shakeY;
  }

  function isVisible(object, padding = 100) {
    const position = worldToScreen(object.x, object.y);
    return position.x > -padding && position.y > -padding && position.x < screenWidth + padding && position.y < screenHeight + padding;
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const background = ctx.createRadialGradient(screenWidth * .53, screenHeight * .45, 20, screenWidth * .5, screenHeight * .5, Math.max(screenWidth, screenHeight));
    background.addColorStop(0, '#0b2029');
    background.addColorStop(.52, '#061018');
    background.addColorStop(1, '#020509');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    drawBackground();
    drawWorld();
    drawScreenEffects();
    drawMinimap();
  }

  function drawBackground() {
    ctx.save();
    const parallaxX = camera.x * .2;
    const parallaxY = camera.y * .2;
    for (const star of stars) {
      let sx = (star.x - parallaxX * star.depth) % (WORLD.width + screenWidth);
      let sy = (star.y - parallaxY * star.depth) % (WORLD.height + screenHeight);
      if (sx < 0) sx += WORLD.width + screenWidth;
      if (sy < 0) sy += WORLD.height + screenHeight;
      if (sx > screenWidth || sy > screenHeight) continue;
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = star.size > 1.5 ? COLORS.cyanSoft : '#b8cdd0';
      ctx.fillRect(sx, sy, star.size, star.size);
    }
    ctx.globalAlpha = 1;

    const gridSize = 160;
    const gridX = -((camera.x * .34) % gridSize);
    const gridY = -((camera.y * .34) % gridSize);
    ctx.strokeStyle = 'rgba(93, 181, 182, .035)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = gridX; x < screenWidth; x += gridSize) { ctx.moveTo(x, 0); ctx.lineTo(x, screenHeight); }
    for (let y = gridY; y < screenHeight; y += gridSize) { ctx.moveTo(0, y); ctx.lineTo(screenWidth, y); }
    ctx.stroke();
    ctx.restore();
  }

  function drawWorld() {
    ctx.save();
    ctx.translate(-camera.x + camera.shakeX, -camera.y + camera.shakeY);
    drawCorridor();
    drawPortal();
    resources.forEach(drawResource);
    pickups.forEach(drawPickup);
    stations.forEach(drawStation);
    enemies.forEach(drawEnemy);
    drawTargetLock();
    drawJumpDestination();
    bullets.forEach(drawBullet);
    rockets.forEach(drawRocket);
    enemyRockets.forEach(drawEnemyRocket);
    particles.forEach(drawParticle);
    drawPlayer();
    floaters.forEach(drawFloater);
    ctx.restore();
  }

  function drawJumpDestination() {
    if (!Number.isFinite(player.jumpDestinationX) || !Number.isFinite(player.jumpDestinationY)) return;
    const pulse = 1 + Math.sin(elapsed * 5) * .12;
    const ready = player.jumpDestinationCooldown <= 0;
    ctx.save();
    ctx.translate(player.jumpDestinationX, player.jumpDestinationY);
    ctx.rotate(elapsed * .8);
    ctx.globalAlpha = ready ? .9 : .42;
    ctx.strokeStyle = ready ? COLORS.purple : '#6f748d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 17 * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-25, 0); ctx.lineTo(-10, 0); ctx.moveTo(10, 0); ctx.lineTo(25, 0);
    ctx.moveTo(0, -25); ctx.lineTo(0, -10); ctx.moveTo(0, 10); ctx.lineTo(0, 25);
    ctx.stroke();
    ctx.fillStyle = COLORS.purple;
    ctx.globalAlpha *= .35;
    ctx.beginPath(); ctx.arc(0, 0, 7 * pulse, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function tracePath(path) {
    const points = path.points;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i += 1) {
      const current = points[i];
      const next = points[i + 1];
      ctx.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
    }
    ctx.lineTo(PORTAL.x, PORTAL.y);
  }

  function drawCorridor() {
    ctx.save();
    for (const path of activePaths) {
      tracePath(path);
      ctx.strokeStyle = 'rgba(70, 219, 211, .045)';
      ctx.lineWidth = 130;
      ctx.stroke();
      tracePath(path);
      ctx.setLineDash([13, 22]);
      ctx.lineDashOffset = -gameClock * 28;
      ctx.strokeStyle = 'rgba(109, 247, 232, .23)';
      ctx.lineWidth = 2;
      ctx.stroke();
      tracePath(path);
      ctx.setLineDash([2, 72]);
      ctx.lineDashOffset = -gameClock * 42;
      ctx.strokeStyle = 'rgba(255, 179, 92, .45)';
      ctx.lineWidth = 7;
      ctx.stroke();
    }
    ctx.setLineDash([]);
    for (const wormhole of LEVELS[currentLevel].wormholes) drawWormhole(wormhole);
    ctx.restore();
  }

  function drawWormhole(wormhole) {
    ctx.save();
    ctx.translate(wormhole.x, wormhole.y);
    ctx.rotate(-elapsed * .7);
    for (let ring = 0; ring < 3; ring += 1) {
      ctx.strokeStyle = `rgba(168,140,255,${.7 - ring * .18})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([7 + ring * 3, 9]);
      ctx.beginPath(); ctx.ellipse(0, 0, 34 + ring * 11, 17 + ring * 5, ring * .4, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }

  function drawPortal() {
    if (!isVisible(PORTAL, 180)) return;
    ctx.save();
    ctx.translate(PORTAL.x, PORTAL.y);
    const pulse = 1 + Math.sin(elapsed * 2.2) * .025;
    ctx.scale(pulse, pulse);
    const glow = ctx.createRadialGradient(0, 0, 12, 0, 0, 132);
    glow.addColorStop(0, 'rgba(81,190,225,.3)');
    glow.addColorStop(.62, 'rgba(32,114,126,.1)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(0, 0, 132, 0, Math.PI * 2); ctx.fill();

    ctx.save();
    ctx.rotate(elapsed * .16);
    for (let ring = 0; ring < 3; ring += 1) {
      ctx.strokeStyle = ring === 1 ? 'rgba(255,179,92,.62)' : 'rgba(109,247,232,.62)';
      ctx.lineWidth = ring === 1 ? 2 : 1;
      ctx.setLineDash([ring === 1 ? 11 : 4, ring === 1 ? 12 : 18]);
      ctx.beginPath(); ctx.arc(0, 0, 60 + ring * 19, ring * .7, Math.PI * 2 + ring * .7); ctx.stroke();
      ctx.rotate(-elapsed * .35 * (ring + 1));
    }
    ctx.restore();
    ctx.setLineDash([]);

    ctx.save();
    ctx.beginPath(); ctx.arc(0, 0, 39, 0, Math.PI * 2); ctx.clip();
    const ocean = ctx.createRadialGradient(-13, -16, 3, 6, 8, 50);
    ocean.addColorStop(0, '#48c8dc');
    ocean.addColorStop(.48, '#157ea1');
    ocean.addColorStop(1, '#062d50');
    ctx.fillStyle = ocean;
    ctx.fillRect(-44, -44, 88, 88);
    ctx.fillStyle = '#62c58d';
    ctx.beginPath();
    ctx.moveTo(-32, -13); ctx.bezierCurveTo(-24, -26, -11, -28, -5, -18); ctx.bezierCurveTo(1, -10, -7, -4, -2, 3); ctx.bezierCurveTo(-10, 8, -21, 3, -29, 9); ctx.bezierCurveTo(-35, 2, -38, -6, -32, -13); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(12, -25); ctx.bezierCurveTo(27, -20, 37, -8, 31, 1); ctx.bezierCurveTo(25, 4, 22, 14, 11, 13); ctx.bezierCurveTo(5, 5, 5, -5, -2, -10); ctx.bezierCurveTo(3, -19, 6, -23, 12, -25); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(9, 20); ctx.bezierCurveTo(18, 15, 30, 20, 29, 29); ctx.bezierCurveTo(18, 36, 10, 32, 5, 27); ctx.closePath(); ctx.fill();
    const night = ctx.createLinearGradient(-34, -24, 37, 28);
    night.addColorStop(.35, 'rgba(1,8,20,0)');
    night.addColorStop(.72, 'rgba(1,8,20,.38)');
    night.addColorStop(1, 'rgba(1,8,20,.78)');
    ctx.fillStyle = night;
    ctx.fillRect(-44, -44, 88, 88);
    ctx.restore();

    ctx.strokeStyle = '#9cfff4';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 14;
    ctx.shadowColor = COLORS.cyan;
    ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI * 2); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = COLORS.pale;
    ctx.font = '700 10px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(t('render.earthGate'), 0, 57);
    ctx.restore();
  }

  function drawResource(rock) {
    if (!isVisible(rock, 70)) return;
    ctx.save();
    ctx.translate(rock.x, rock.y);
    ctx.rotate(rock.rotation);
    ctx.beginPath();
    for (let i = 0; i < rock.sides; i += 1) {
      const angle = (i / rock.sides) * Math.PI * 2;
      const radius = rock.radius * (.75 + ((i * 47) % 25) / 100);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = rock.crystal ? 'rgba(168,140,255,.18)' : 'rgba(73,133,137,.25)';
    ctx.strokeStyle = rock.crystal ? COLORS.purple : 'rgba(125,205,201,.55)';
    ctx.lineWidth = rock.crystal ? 2 : 1;
    ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-rock.radius * .45, -rock.radius * .2); ctx.lineTo(rock.radius * .2, rock.radius * .34); ctx.lineTo(rock.radius * .5, -rock.radius * .42); ctx.stroke();
    ctx.restore();
    if (rock.hp < rock.maxHp) drawHealthBar(rock.x, rock.y - rock.radius - 10, 42, rock.hp / rock.maxHp, rock.crystal ? COLORS.purple : COLORS.cyan);
  }

  function drawPickup(item) {
    if (!isVisible(item, 60)) return;
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(elapsed * .55);
    const scale = 1 + Math.sin(item.pulse) * .08;
    ctx.scale(scale, scale);
    ctx.shadowBlur = 18;
    ctx.shadowColor = item.kind === 'repair' ? COLORS.cyan : COLORS.amber;
    ctx.strokeStyle = item.kind === 'repair' ? COLORS.cyan : COLORS.amber;
    ctx.fillStyle = item.kind === 'repair' ? 'rgba(109,247,232,.12)' : 'rgba(255,179,92,.12)';
    ctx.lineWidth = 2;
    if (item.kind === 'repair') {
      ctx.beginPath();
      for (let i = 0; i < 8; i += 1) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = i % 2 ? 10 : 19;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.rotate(-elapsed * .55);
      ctx.beginPath(); ctx.moveTo(-7, 0); ctx.lineTo(7, 0); ctx.moveTo(0, -7); ctx.lineTo(0, 7); ctx.stroke();
    } else {
      ctx.beginPath();
      for (let i = 0; i < 6; i += 1) {
        const angle = -Math.PI / 2 + (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 19;
        const y = Math.sin(angle) * 19;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }

  function drawStation(station) {
    if (!isVisible(station, station.range)) return;
    ctx.save();
    ctx.translate(station.x, station.y);
    ctx.strokeStyle = 'rgba(255,179,92,.12)';
    ctx.setLineDash([7, 13]);
    ctx.beginPath(); ctx.arc(0, 0, station.range, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.rotate(elapsed * .22);
    ctx.strokeStyle = COLORS.amber;
    ctx.fillStyle = 'rgba(17,28,31,.95)';
    ctx.shadowBlur = 14;
    ctx.shadowColor = COLORS.amber;
    ctx.lineWidth = 2;
    for (let arm = 0; arm < 4; arm += 1) {
      ctx.rotate(Math.PI / 2);
      ctx.fillRect(12, -5, 23 + station.level * 2, 10);
      ctx.strokeRect(12, -5, 23 + station.level * 2, 10);
    }
    ctx.rotate(-elapsed * .22);
    ctx.fillStyle = '#09161d';
    ctx.beginPath(); ctx.arc(0, 0, 18 + station.level * 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.rotate(station.angle);
    ctx.fillStyle = COLORS.cyan;
    ctx.fillRect(4, -3, 26, 6);
    ctx.restore();
    ctx.save();
    ctx.fillStyle = COLORS.amber;
    ctx.font = '700 9px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(t('render.station', { level: station.level }), station.x, station.y - 46);
    ctx.restore();
    const upgradeCost = 90 + station.level * 80;
    if (station.level < 4 && player.credits >= upgradeCost) {
      const pulse = .72 + Math.sin(elapsed * 4.5) * .22;
      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.font = '700 8px "Space Mono", monospace';
      ctx.textAlign = 'center';
      const label = t('render.upgradeAvailable');
      const width = ctx.measureText(label).width + 14;
      ctx.fillStyle = 'rgba(255,179,92,.16)';
      ctx.strokeStyle = COLORS.amber;
      ctx.lineWidth = 1;
      ctx.fillRect(station.x - width / 2, station.y - 70, width, 16);
      ctx.strokeRect(station.x - width / 2, station.y - 70, width, 16);
      ctx.fillStyle = COLORS.amber;
      ctx.fillText(label, station.x, station.y - 59);
      ctx.restore();
    }
  }

  function drawTargetLock() {
    if (!lockedTarget || lockedTarget.dead || mode !== 'playing') return;
    ctx.save();
    ctx.translate(lockedTarget.x, lockedTarget.y);
    ctx.rotate(elapsed * .9);
    ctx.strokeStyle = COLORS.amber;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 7]);
    ctx.beginPath(); ctx.arc(0, 0, lockedTarget.radius + 16, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    for (let corner = 0; corner < 4; corner += 1) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath(); ctx.moveTo(lockedTarget.radius + 10, -7); ctx.lineTo(lockedTarget.radius + 10, 7); ctx.stroke();
    }
    ctx.restore();
  }

  function traceEnemyHull(target, type, r) {
    target.beginPath();
    if (type === 'scout' || type === 'striker') {
      target.moveTo(r, 0); target.lineTo(-r * .7, -r * .72); target.lineTo(-r * .35, 0); target.lineTo(-r * .7, r * .72);
    } else if (type === 'interceptor') {
      target.moveTo(r, 0); target.lineTo(0, -r * .62); target.lineTo(-r, 0); target.lineTo(0, r * .62);
    } else if (type === 'raider') {
      target.moveTo(r, 0); target.lineTo(r * .2, -r * .7); target.lineTo(-r, -r * .48); target.lineTo(-r * .62, 0); target.lineTo(-r, r * .48); target.lineTo(r * .2, r * .7);
    } else if (type === 'carrier' || type === 'bossCarrier') {
      target.moveTo(r, 0); target.lineTo(r * .35, -r * .6); target.lineTo(-r * .45, -r); target.lineTo(-r, -r * .3); target.lineTo(-r * .72, 0); target.lineTo(-r, r * .3); target.lineTo(-r * .45, r); target.lineTo(r * .35, r * .6);
    } else if (type === 'sentinel' || type === 'bossTitan') {
      for (let side = 0; side < 6; side += 1) {
        const a = side / 6 * Math.PI * 2;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (!side) target.moveTo(px, py); else target.lineTo(px, py);
      }
    } else {
      target.moveTo(r, 0); target.lineTo(r * .52, -r * .7); target.lineTo(-r * .35, -r); target.lineTo(-r, -r * .45); target.lineTo(-r * .7, 0); target.lineTo(-r, r * .45); target.lineTo(-r * .35, r); target.lineTo(r * .52, r * .7);
    }
    target.closePath();
  }

  function drawIntelShip(type) {
    const preview = ui.intelShip;
    const previewCtx = preview.getContext('2d');
    const blueprint = ENEMY_TYPES[type];
    const r = clamp(blueprint.radius * 2.25, 45, 92);
    previewCtx.clearRect(0, 0, preview.width, preview.height);
    previewCtx.save();
    previewCtx.translate(preview.width / 2, preview.height / 2);
    previewCtx.shadowBlur = 26;
    previewCtx.shadowColor = blueprint.color;
    previewCtx.fillStyle = 'rgba(17,22,30,.98)';
    previewCtx.strokeStyle = blueprint.color;
    previewCtx.lineWidth = blueprint.major ? 4 : 3;
    traceEnemyHull(previewCtx, type, r);
    previewCtx.fill(); previewCtx.stroke();
    previewCtx.shadowBlur = 10;
    previewCtx.fillStyle = blueprint.color;
    previewCtx.globalAlpha = .82;
    previewCtx.fillRect(-r * .72, -r * .14, r * .62, r * .28);
    previewCtx.globalAlpha = 1;
    if (blueprint.major) {
      previewCtx.strokeStyle = 'rgba(255,255,255,.48)';
      previewCtx.beginPath(); previewCtx.arc(r * .12, 0, r * .33, 0, Math.PI * 2); previewCtx.stroke();
      previewCtx.fillStyle = blueprint.color;
      previewCtx.beginPath(); previewCtx.arc(r * .12, 0, r * .12, 0, Math.PI * 2); previewCtx.fill();
    }
    if (blueprint.shielded) {
      previewCtx.strokeStyle = 'rgba(121,168,255,.9)';
      previewCtx.setLineDash([10, 8]);
      previewCtx.lineWidth = 3;
      previewCtx.beginPath(); previewCtx.arc(0, 0, r + 17, 0, Math.PI * 2); previewCtx.stroke();
    }
    previewCtx.restore();
  }

  function drawEnemy(enemy) {
    if (!isVisible(enemy, enemy.radius + 80)) return;
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.rotate(enemy.angle);
    ctx.shadowBlur = enemy.major ? 14 : 6;
    ctx.shadowColor = enemy.color;
    ctx.strokeStyle = enemy.hitFlash > 0 ? '#ffffff' : enemy.color;
    ctx.fillStyle = enemy.hitFlash > 0 ? 'rgba(255,255,255,.55)' : 'rgba(17,22,30,.96)';
    ctx.lineWidth = enemy.boss ? 3 : enemy.major ? 2 : 1.4;
    const r = enemy.radius;
    traceEnemyHull(ctx, enemy.type, r);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = enemy.color;
    ctx.globalAlpha = .8;
    ctx.fillRect(-r * .72, -r * .14, r * .62, r * .28);
    if (enemy.major) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(255,255,255,.35)';
      ctx.beginPath(); ctx.arc(r * .12, 0, r * .33, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = enemy.color;
      ctx.beginPath(); ctx.arc(r * .12, 0, r * .12, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = enemy.boss ? '#ffffff' : enemy.shielded ? '#79a8ff' : COLORS.amber;
      ctx.lineWidth = enemy.boss ? 2.8 : 1.8;
      ctx.globalAlpha = .82;
      ctx.setLineDash(enemy.boss ? [10, 7] : [6, 6]);
      ctx.beginPath(); ctx.arc(0, 0, r + (enemy.boss ? 9 : 6), 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
    if (enemy.shieldCharges > 0 || enemy.shieldHp > 0) {
      const shieldBarY = enemy.y - enemy.radius - (enemy.boss ? 34 : 24);
      const shieldBarWidth = enemy.boss ? 110 : 72;
      const chargeShield = enemy.shieldCharges > 0;
      const shieldRatio = chargeShield ? enemy.shieldCharges / enemy.maxShieldCharges : enemy.shieldHp / enemy.maxShield;
      drawHealthBar(enemy.x, shieldBarY, shieldBarWidth, shieldRatio, '#79a8ff');
      ctx.save();
      ctx.fillStyle = '#9acbff';
      ctx.font = '700 8px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(t('render.shield', { amount: chargeShield ? `${enemy.shieldCharges}/${enemy.maxShieldCharges}` : Math.ceil(enemy.shieldHp) }), enemy.x, shieldBarY - 4);
      ctx.restore();
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      ctx.rotate(-elapsed * .65);
      ctx.strokeStyle = enemy.shieldHitTimer > 0 ? '#ffffff' : 'rgba(121,168,255,.8)';
      ctx.lineWidth = enemy.shieldHitTimer > 0 ? 4 : 2;
      ctx.setLineDash([8, 6]);
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#79a8ff';
      ctx.beginPath(); ctx.arc(0, 0, enemy.radius + 10, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
    if (enemy.major || enemy.interceptor || enemy.hp < enemy.maxHp) drawHealthBar(enemy.x, enemy.y - enemy.radius - 13, enemy.boss ? 110 : enemy.major ? 72 : 38, enemy.hp / enemy.maxHp, enemy.color);
    if (enemy.boss) {
      ctx.save();
      ctx.fillStyle = COLORS.coral;
      ctx.font = '700 10px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(translateEnemy(enemy.type).name, enemy.x, enemy.y - enemy.radius - 25);
      ctx.restore();
    }
  }

  function drawPlayer() {
    if (!player) return;
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    if (player.invulnerable > 0 && Math.floor(player.invulnerable * 18) % 2 === 0) ctx.globalAlpha = .35;
    ctx.shadowBlur = 14;
    ctx.shadowColor = COLORS.cyan;
    ctx.fillStyle = '#081a22';
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(27, 0);
    ctx.lineTo(-17, -15);
    ctx.lineTo(-10, -4);
    ctx.lineTo(-22, 0);
    ctx.lineTo(-10, 4);
    ctx.lineTo(-17, 15);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = COLORS.amber;
    ctx.beginPath(); ctx.moveTo(11, 0); ctx.lineTo(-3, -5); ctx.lineTo(-3, 5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(109,247,232,.75)';
    ctx.beginPath(); ctx.moveTo(-13, -5); ctx.lineTo(-25, 0); ctx.lineTo(-13, 5); ctx.closePath(); ctx.fill();
    ctx.restore();

    if (player.jumpFlash > 0) {
      ctx.save();
      ctx.globalAlpha = clamp(player.jumpFlash / .42, 0, 1) * .72;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 8]);
      ctx.beginPath(); ctx.arc(player.x, player.y, 30 + (1 - player.jumpFlash / .42) * 28, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }

    if (player.rocketCharge > 0) {
      const progress = 1 - player.rocketCharge / .62;
      ctx.save();
      ctx.strokeStyle = COLORS.amber;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(player.x, player.y, 31, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress); ctx.stroke();
      ctx.restore();
    }
  }

  function drawBullet(bullet) {
    ctx.save();
    ctx.strokeStyle = COLORS.cyanSoft;
    ctx.lineWidth = 2.2;
    ctx.shadowBlur = 9;
    ctx.shadowColor = COLORS.cyan;
    ctx.beginPath(); ctx.moveTo(bullet.x, bullet.y); ctx.lineTo(bullet.x - bullet.vx * .018, bullet.y - bullet.vy * .018); ctx.stroke();
    ctx.restore();
  }

  function drawRocket(rocket) {
    ctx.save();
    ctx.translate(rocket.x, rocket.y);
    ctx.rotate(rocket.angle);
    ctx.fillStyle = COLORS.amber;
    ctx.shadowBlur = 13;
    ctx.shadowColor = COLORS.amber;
    ctx.beginPath(); ctx.moveTo(13, 0); ctx.lineTo(-8, -5); ctx.lineTo(-4, 0); ctx.lineTo(-8, 5); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function drawEnemyRocket(rocket) {
    ctx.save();
    ctx.translate(rocket.x, rocket.y);
    ctx.rotate(rocket.angle);
    ctx.fillStyle = rocket.hitFlash > 0 ? '#ffffff' : COLORS.coral;
    ctx.shadowBlur = 12;
    ctx.shadowColor = COLORS.coral;
    ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-7, -4); ctx.lineTo(-7, 4); ctx.closePath(); ctx.fill();
    ctx.restore();
    if (rocket.hp < rocket.maxHp) drawHealthBar(rocket.x, rocket.y - rocket.radius - 8, 22, rocket.hp / rocket.maxHp, COLORS.coral);
  }

  function drawParticle(particle) {
    ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
    ctx.globalAlpha = 1;
  }

  function drawFloater(floater) {
    ctx.save();
    ctx.globalAlpha = clamp(floater.life / floater.maxLife, 0, 1);
    ctx.fillStyle = floater.color;
    ctx.font = '700 11px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(floater.text, floater.x, floater.y);
    ctx.restore();
  }

  function drawHealthBar(x, y, width, ratio, color) {
    ctx.save();
    ctx.fillStyle = 'rgba(2,7,11,.82)';
    ctx.fillRect(x - width / 2, y, width, 4);
    ctx.fillStyle = color;
    ctx.fillRect(x - width / 2, y, width * clamp(ratio, 0, 1), 4);
    ctx.restore();
  }

  function drawScreenEffects() {
    if (!player || mode === 'menu') return;
    const lowHealth = 1 - player.hp / player.maxHp;
    if (lowHealth > .45) {
      const vignette = ctx.createRadialGradient(screenWidth / 2, screenHeight / 2, screenHeight * .25, screenWidth / 2, screenHeight / 2, screenWidth * .72);
      vignette.addColorStop(.4, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, `rgba(130, 11, 20, ${lowHealth * .34})`);
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, screenWidth, screenHeight);
    }
    if (announcementTimer > 0) {
      const alpha = clamp(Math.min(announcementTimer, 2.2 - announcementTimer) * 1.8, 0, 1);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.textAlign = 'center';
      const bossStage = wave === LEVELS[currentLevel].stages;
      ctx.fillStyle = bossStage ? COLORS.coral : COLORS.pale;
      ctx.font = `700 ${Math.min(48, screenWidth * .045)}px "Chakra Petch", sans-serif`;
      ctx.fillText(bossStage ? t('render.finalStage') : t('status.stage', { stage: String(wave).padStart(2, '0'), total: LEVELS[currentLevel].stages }), screenWidth / 2, screenHeight * .36);
      ctx.fillStyle = COLORS.muted || '#8ca9aa';
      ctx.font = '700 10px "Space Mono", monospace';
      ctx.fillText(bossStage ? t('toast.commandEntering') : t('render.hostileFormation'), screenWidth / 2, screenHeight * .36 + 26);
      ctx.restore();
    }
  }

  function drawMinimap() {
    const width = mapCanvas.width;
    const height = mapCanvas.height;
    const sx = width / WORLD.width;
    const sy = height / WORLD.height;
    mctx.clearRect(0, 0, width, height);
    mctx.fillStyle = 'rgba(2,9,14,.92)';
    mctx.fillRect(0, 0, width, height);
    mctx.strokeStyle = 'rgba(109,247,232,.18)';
    mctx.lineWidth = 1;
    for (const path of activePaths) {
      mctx.beginPath();
      mctx.moveTo(path.points[0].x * sx, path.points[0].y * sy);
      for (let i = 1; i < path.points.length; i += 1) mctx.lineTo(path.points[i].x * sx, path.points[i].y * sy);
      mctx.stroke();
    }
    for (const rock of resources) {
      mctx.fillStyle = rock.crystal ? 'rgba(168,140,255,.65)' : 'rgba(109,247,232,.25)';
      mctx.fillRect(rock.x * sx, rock.y * sy, 2, 2);
    }
    for (const item of pickups) {
      const x = item.x * sx;
      const y = item.y * sy;
      const pulse = 1 + Math.sin(item.pulse) * .18;
      if (item.kind === 'shield') {
        mctx.save();
        mctx.translate(x, y);
        mctx.scale(pulse, pulse);
        mctx.strokeStyle = COLORS.amber;
        mctx.fillStyle = 'rgba(255,179,92,.2)';
        mctx.lineWidth = 1.2;
        mctx.beginPath();
        mctx.moveTo(0, -4.5); mctx.lineTo(4, -2.5); mctx.lineTo(3.2, 2.2);
        mctx.lineTo(0, 4.8); mctx.lineTo(-3.2, 2.2); mctx.lineTo(-4, -2.5);
        mctx.closePath();
        mctx.fill(); mctx.stroke();
        mctx.restore();
      } else {
        mctx.fillStyle = 'rgba(109,247,232,.7)';
        mctx.fillRect(x - 1.5, y - 1.5, 3, 3);
      }
    }
    for (const enemy of enemies) {
      const mapColor = enemy.major ? enemy.color : COLORS.coral;
      mctx.fillStyle = mapColor;
      const size = enemy.boss ? 5 : enemy.major ? 4 : 2.5;
      mctx.fillRect(enemy.x * sx - size / 2, enemy.y * sy - size / 2, size, size);
    }
    for (const station of stations) {
      mctx.fillStyle = COLORS.amber;
      mctx.fillRect(station.x * sx - 2, station.y * sy - 2, 4, 4);
    }
    for (const wormhole of LEVELS[currentLevel].wormholes) {
      mctx.strokeStyle = COLORS.purple;
      mctx.beginPath(); mctx.arc(wormhole.x * sx, wormhole.y * sy, 3, 0, Math.PI * 2); mctx.stroke();
    }
    if (player) {
      mctx.fillStyle = COLORS.cyan;
      mctx.beginPath(); mctx.arc(player.x * sx, player.y * sy, 3.5, 0, Math.PI * 2); mctx.fill();
      mctx.strokeStyle = 'rgba(109,247,232,.35)';
      mctx.strokeRect(camera.x * sx, camera.y * sy, screenWidth * sx, screenHeight * sy);
    }
    mctx.fillStyle = COLORS.amber;
    mctx.beginPath(); mctx.arc(PORTAL.x * sx, PORTAL.y * sy, 4.5, 0, Math.PI * 2); mctx.fill();
  }

  function syncUi() {
    if (!player) return;
    const level = LEVELS[currentLevel];
    const localizedLevel = translateLevel(level);
    ui.sectorText.textContent = `${localizedLevel.short} // ${localizedLevel.name}`;
    ui.waveText.textContent = t('status.stage', { stage: wave ? String(wave).padStart(2, '0') : '—', total: level.stages });
    ui.waveState.textContent = spawnQueue.length || enemies.length
      ? t('status.waveActive', { current: formation, total: formationsInStage, hostiles: spawnQueue.length + enemies.length })
      : wave ? t('status.waveClear', { current: formation, total: formationsInStage }) : t('hud.standby');
    ui.scoreText.textContent = formatScore(score);
    ui.bestText.textContent = formatScore(isAdminPilot() ? 0 : Math.max(highScore, score));
    const healthRatio = clamp(player.hp / player.maxHp, 0, 1);
    ui.healthBar.style.transform = `scaleX(${healthRatio})`;
    ui.healthBar.style.background = healthRatio < .3 ? COLORS.coral : COLORS.cyan;
    ui.healthText.textContent = `${Math.ceil(player.hp)}`;
    ui.levelText.textContent = String(player.level);
    ui.xpBar.style.transform = `scaleX(${clamp(player.xp / player.xpNext, 0, 1)})`;
    ui.xpText.textContent = `${Math.floor(player.xp)} / ${player.xpNext}`;
    ui.creditText.textContent = String(player.credits).padStart(3, '0');
    ui.speedTierText.textContent = `${player.speedTier}/7`;
    ui.damageTierText.textContent = `${player.damageTier}/7`;
    ui.rateTierText.textContent = `${player.rateTier}/7`;
    ui.hullTierText.textContent = `${player.hullTier}/7`;
    ui.rocketTierText.textContent = `${player.rocketTier}/7`;
    ui.coolingTierText.textContent = `${player.coolingTier}/7`;
    ui.shieldPips.innerHTML = Array.from({ length: 5 }, (_, index) => `<i class="${index >= gateShields ? 'empty' : ''}"></i>`).join('');
    ui.shieldPips.setAttribute('aria-label', t('status.portalShields', { count: gateShields }));

    const rocketProgress = player.rocketCharge > 0 ? 1 - player.rocketCharge / .62 : 1 - player.rocketCooldown / player.rocketMax;
    ui.rocketCooldown.style.width = `${clamp(rocketProgress, 0, 1) * 100}%`;
    ui.rocketState.textContent = player.rocketCharge > 0 ? t('status.charging') : player.rocketCooldown > 0 ? `${player.rocketCooldown.toFixed(1)}S` : t('ability.ready');
    ui.rocketCooldown.closest('.ability-card').classList.toggle('cooling', player.rocketCooldown > 0 || player.rocketCharge > 0);

    const boostProgress = 1 - player.boostCooldown / player.boostMax;
    ui.boostCooldown.style.width = `${clamp(boostProgress, 0, 1) * 100}%`;
    if (player.boostCooldown > 0) ui.boostState.textContent = `${player.boostCooldown.toFixed(1)}S`;
    else if (player.jumpDestinationCooldown > 0) ui.boostState.textContent = t('status.jumpReady', { seconds: player.jumpDestinationCooldown.toFixed(1) });
    else ui.boostState.textContent = Number.isFinite(player.jumpDestinationX) ? t('status.replaceClear') : t('status.placeDestination');
    ui.boostCooldown.closest('.ability-card').classList.toggle('cooling', player.boostCooldown > 0);

    const docked = nearestStation(110);
    const buildCost = stationBuildCost();
    let stationAffordable = false;
    if (docked) {
      const upgradeCost = 90 + docked.level * 80;
      ui.stationState.textContent = docked.level >= 4 ? t('status.maximumPower') : t('status.toUpgrade', { cost: upgradeCost });
      stationAffordable = docked.level < 4 && player.credits >= upgradeCost;
    } else {
      ui.stationState.textContent = stations.length >= 3 ? t('status.stationLimit') : t('status.toBuild', { cost: buildCost });
      stationAffordable = stations.length < 3 && player.credits >= buildCost;
    }
    ui.stationButton.disabled = false;
    ui.stationButton.classList.toggle('affordable', stationAffordable);
  }
  // Keyboard, pointer, UI event wiring, and the animation frame loop.
  function showToast(message) {
    ui.toast.textContent = message;
    ui.toast.classList.add('visible');
    toastTimer = 2.1;
  }

  function keyDown(event) {
    const textEntry = event.target instanceof HTMLInputElement
      || event.target instanceof HTMLTextAreaElement
      || event.target.isContentEditable;
    if (textEntry && !['Escape', 'Enter'].includes(event.code)) return;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault();
    if (event.repeat && ['KeyQ', 'Space', 'KeyF', 'KeyB', 'KeyR', 'KeyT', 'Escape', 'Enter'].includes(event.code)) return;
    input.keys.add(event.code);
    if (tutorialMode && tutorialIndex === TUTORIAL_STEP.controls && ['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
      tutorialMovementKeys.add(event.code);
      if (tutorialMovementKeys.size === 4) queueTutorialAdvance();
      else updateTutorialCard();
    }
    if (event.code === 'ArrowUp' && mode === 'playing') fireBlaster(player.angle);
    if (['KeyQ', 'Space'].includes(event.code)) triggerBoost();
    if (event.code === 'KeyF') beginRocketCharge();
    if (event.code === 'KeyB') useStation();
    if (event.code === 'KeyR') callNextWave();
    if (event.code === 'KeyT' && mode === 'playing') {
      jumpDestinationHold = 0;
      jumpDestinationCancelArmed = Number.isFinite(player.jumpDestinationX) && Number.isFinite(player.jumpDestinationY);
      if (!jumpDestinationCancelArmed) placeJumpDestination();
    }
    if (event.code === 'Escape') {
      if (ui.authOverlay.classList.contains('active')) closeAdminAccess();
      else if (ui.leaderboardOverlay.classList.contains('active')) closeLeaderboard();
      else if (mode === 'levelSelect') closeLevelSelect();
      else togglePause();
    }
    if (event.code === 'Enter') {
      if (ui.authOverlay.classList.contains('active') || ui.leaderboardOverlay.classList.contains('active')) return;
      if (mode === 'menu') requirePilot(() => startGame(false));
      else if (mode === 'ended') startGame(false, lastRunLevel);
      else if (mode === 'briefing') showNextIntel();
      else if (mode === 'cutscene') activateWave();
      else if (mode === 'sector') enterNextSector();
    }
    if (event.code === 'KeyT' && mode === 'menu') requirePilot(() => startGame(true));
    if (event.code === 'KeyL' && mode === 'menu') requirePilot(openLevelSelect);
    if (mode === 'upgrade' && ['Digit1', 'Digit2', 'Digit3'].includes(event.code)) {
      ui.upgradeChoices.children[Number(event.code.at(-1)) - 1]?.click();
    }
  }

  function keyUp(event) {
    input.keys.delete(event.code);
    if (event.code === 'KeyT') {
      if (mode === 'playing' && jumpDestinationCancelArmed) placeJumpDestination();
      jumpDestinationHold = 0;
      jumpDestinationCancelArmed = false;
    }
  }

  function pointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    input.mouseX = event.clientX - rect.left;
    input.mouseY = event.clientY - rect.top;
    input.lastPointerAt = performance.now();
    ui.crosshair.style.left = `${input.mouseX}px`;
    ui.crosshair.style.top = `${input.mouseY}px`;
    updateAimWorld();
  }

  function pointerDown(event) {
    if (event.button === 2) {
      event.preventDefault();
      return;
    }
    if (event.button !== 0 || mode !== 'playing') return;
    input.pointerDown = true;
    audio.init();
  }

  function pointerUp(event) {
    if (event.button === 0) input.pointerDown = false;
  }

  function bindUi() {
    [ui.languageSelect, ui.menuLanguageSelect].filter(Boolean).forEach((select) => {
      select.addEventListener('change', (event) => setLanguage(event.target.value));
    });
    document.getElementById('startButton').addEventListener('click', () => requirePilot(() => startGame(false)));
    ui.checkpointButton.addEventListener('click', () => requirePilot(resumeLastStageCheckpoint));
    document.getElementById('tutorialButton').addEventListener('click', () => requirePilot(() => startGame(true)));
    document.getElementById('levelSelectButton').addEventListener('click', () => requirePilot(openLevelSelect));
    document.getElementById('closeLevelSelect').addEventListener('click', closeLevelSelect);
    document.getElementById('controlsButton').addEventListener('click', () => openSettings('menu'));
    document.getElementById('settingsButton').addEventListener('click', () => openSettings('menu'));
    document.getElementById('pauseButton').addEventListener('click', () => togglePause(true));
    document.getElementById('resumeButton').addEventListener('click', () => togglePause(false));
    document.getElementById('pauseSettingsButton').addEventListener('click', () => openSettings('paused'));
    document.getElementById('restartButton').addEventListener('click', () => startGame(false, currentLevel));
    document.getElementById('quitButton').addEventListener('click', showTitle);
    document.getElementById('playAgainButton').addEventListener('click', () => startGame(false, lastRunLevel));
    document.getElementById('retryStageButton').addEventListener('click', retryStageCheckpoint);
    document.getElementById('endQuitButton').addEventListener('click', showTitle);
    document.getElementById('closeSettings').addEventListener('click', closeSettings);
    document.getElementById('intelContinue').addEventListener('click', showNextIntel);
    document.getElementById('skipBossIntro').addEventListener('click', activateWave);
    document.getElementById('nextSectorButton').addEventListener('click', enterNextSector);
    document.getElementById('stationButton').addEventListener('click', useStation);
    document.getElementById('waveCallButton').addEventListener('click', callNextWave);
    document.getElementById('adminButton').addEventListener('click', openAdminAccess);
    document.getElementById('menuAdminButton').addEventListener('click', openAdminAccess);
    document.getElementById('leaderboardButton').addEventListener('click', openLeaderboard);
    document.getElementById('closeAuth').addEventListener('click', closeAdminAccess);
    document.getElementById('closeLeaderboard').addEventListener('click', closeLeaderboard);
    document.getElementById('authForm').addEventListener('submit', submitAdminForm);
    document.getElementById('signOutButton').addEventListener('click', signOutAdmin);
    ui.skipTutorial.addEventListener('click', () => {
      startGame(false, 0);
      showToast(t('toast.trainingSkipped'));
    });
    ui.repeatTutorial.addEventListener('click', () => startGame(true));
    ui.startCampaign.addEventListener('click', () => startGame(false, 0));

    const musicToggle = document.getElementById('musicToggle');
    const sfxToggle = document.getElementById('sfxToggle');
    const shakeToggle = document.getElementById('shakeToggle');
    musicToggle.checked = settings.music;
    sfxToggle.checked = settings.sfx;
    shakeToggle.checked = settings.shake;
    musicToggle.addEventListener('change', () => {
      settings.music = musicToggle.checked;
      localStorage.setItem('voidline-music', String(settings.music));
      audio.init(); audio.setMusic(settings.music);
    });
    sfxToggle.addEventListener('change', () => {
      settings.sfx = sfxToggle.checked;
      localStorage.setItem('voidline-sfx', String(settings.sfx));
      audio.init(); audio.setSfx(settings.sfx);
    });
    shakeToggle.addEventListener('change', () => {
      settings.shake = shakeToggle.checked;
      localStorage.setItem('voidline-shake', String(settings.shake));
    });
  }

  function frame(now) {
    const dt = Math.min(.034, (now - lastTime) / 1000 || .016);
    lastTime = now;
    update(dt);
    draw();
    requestAnimationFrame(frame);
  }
  // Browser event listeners and initial application boot.
  window.addEventListener('resize', resize);
  window.addEventListener('keydown', keyDown, { passive: false });
  window.addEventListener('keyup', keyUp);
  window.addEventListener('blur', () => { input.keys.clear(); input.pointerDown = false; if (mode === 'playing') togglePause(true); });
  canvas.addEventListener('pointermove', pointerMove);
  canvas.addEventListener('pointerdown', pointerDown);
  window.addEventListener('pointerup', pointerUp);
  canvas.addEventListener('pointerleave', () => { input.pointerDown = false; });
  canvas.addEventListener('contextmenu', (event) => event.preventDefault());

  applyStaticTranslations();
  bindUi();
  const storedKeys = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index));
  const hasLegacyProgress = storedKeys.some((key) => {
    if (key === HIGH_SCORE_KEY || key?.startsWith(`${HIGH_SCORE_KEY}:`)) return Number(localStorage.getItem(key)) > 0;
    if (key !== CAMPAIGN_KEY && !key?.startsWith(`${CAMPAIGN_KEY}:`)) return false;
    try {
      const saved = JSON.parse(localStorage.getItem(key) || '{}');
      const checkpointProgress = Object.values(saved.checkpoints || {}).some((checkpoint) => (
        Number(checkpoint?.player?.level) > 1 || Number(checkpoint?.score) > 0 || Number(checkpoint?.wave) > 0
      ));
      return Number(saved.highestUnlocked) > 0
        || Number(saved.completedCampaigns) > 0
        || saved.seenEnemyTypes?.length > 0
        || checkpointProgress;
    } catch {
      return false;
    }
  });
  const hasStartedGame = localStorage.getItem(GAME_STARTED_KEY) === 'true' || hasLegacyProgress;
  document.getElementById('tutorialButton').classList.toggle('tutorial-recommended', !hasStartedGame);
  prepareDefaultCallsign();
  renderAdminPanel();
  resize();
  player = resetPlayer();
  camera.x = player.x - screenWidth / 2;
  camera.y = player.y - screenHeight / 2;
  ui.bestText.textContent = formatScore(highScore);
  syncUi();
  updateCheckpointButton();
  if (window.VoidlineCloud) {
    window.VoidlineCloud.onChange((pilot) => {
      if (!pilot && activePilot) activatePilot(null);
    });
  }
  initializeCloud();
  requestAnimationFrame(frame);

  function refreshLocalizedUi() {
    updatePilotUi();
    updateCheckpointButton();
    if (player) syncUi();
    if (mode === 'levelSelect') renderLevelSelect();
    if (mode === 'sector') {
      const completedLevel = translateLevel(LEVELS[currentLevel]);
      ui.sectorTitle.textContent = completedLevel.name;
      ui.sectorCopy.textContent = completedLevel.next;
    }
    if (tutorialMode) updateTutorialCard();
  }
})();
